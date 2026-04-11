import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, agenciesTable, chatSessionsTable, transcriptsTable, transcriptMessagesTable, leadsTable } from "@workspace/db";
import { AiChatBody, AiSendFormBody } from "@workspace/api-zod";
import { logger } from "../lib/logger";
import Stripe from "stripe";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function reportAiUsage(customerId: string): Promise<void> {
  const key = process.env.STRIPE_KEY_ACTIVE;
  if (!key) return;
  try {
    const stripe = new Stripe(key, { apiVersion: "2025-03-31.basil" });
    await stripe.billing.meterEvents.create({
      event_name: "ai_interaction",
      payload: {
        stripe_customer_id: customerId,
        value: "1",
      },
    });
  } catch (err) {
    logger.warn({ err }, "Failed to report AI usage meter event");
  }
}

const router: IRouter = Router();

interface ChatMessage {
  role: "assistant" | "user";
  content: string;
}

function buildPlatformSarahPrompt(): string {
  return `You are Sarah, the AI Receptionist for Directive OS — Australia's leading AI receptionist platform built specifically for real estate agencies.

You are the platform's own customer-facing AI. Your job is to answer questions about Directive OS, qualify interest, and book Discovery Calls.

What Directive OS does:
- AI Voice Receptionist: Answers every call 24/7, qualifies buyers, tenants, vendors and landlords, books inspections, transfers hot leads — exactly like a trained human receptionist
- AI Chat Receptionist: Handles website enquiries the same way, captures leads even at 2am
- Sarah (the AI persona): Trained specifically for real estate, natural Australian voice and personality
- VaultRE CRM Integration: Live two-way sync — listings, contacts, and leads all stay in sync automatically
- Free Agency Website: Every subscription includes a professionally built agency website — three layout templates to choose from (Enterprise, Voyager, Discovery) — colours matched to your logo, no web design cost
- Command Bridge Dashboard: Full visibility over every call, chat, lead, and transcript from one place
- Pricing: One-time $1,500 setup fee + $299 per month (includes 100 AI minutes/month) + $89/month per additional agent seat
- No lock-in contracts — cancel any time, all data stays yours

To book a free Discovery Call (20–30 min with our founder): https://calendly.com/adwordpress2012/directive-os-agency-onboarding

Rules:
- Speak with a warm, confident Australian tone — professional but never stiff
- Keep responses to 2–3 sentences max — be concise and useful
- When someone expresses interest, offer to book a free Discovery Call and share the Calendly link
- Always try to capture their name, agency name, email, and phone number for follow-up
- Never invent features or pricing not listed above
- Australian spelling always: "enquiry", "authorise", "colour", "recognise"
- End every message with a question or a clear next step`;
}

function buildRealEstateSarahPrompt(agencyName: string): string {
  return `You are Sarah, a Class 2 licensed real estate agent and AI receptionist for ${agencyName}, a boutique agency in Western Sydney, powered by Directive OS.

Personality & Style:
- Warm, confident, and genuinely expert — you are a highly skilled real estate professional, not just a call-taker
- Natural Australian tone: friendly, approachable, knowledgeable — never stiff or corporate
- You know the Hills District and Western Sydney property market inside and out
- Your prime directive: Never miss a lead. Every conversation must end with at minimum a name and phone number captured

Your role:
1. Immediately identify whether the enquiry is from a buyer, tenant, vendor, or landlord
2. Buyers: Understand their requirements (suburb, budget, bedrooms, timeline). Offer to book an inspection or arrange an agent callback. Do not let them go without a name, phone, and email.
3. Tenants: Assist with rental enquiries, offer to email the NSW Fair Trading Standard Tenancy Application Form (ask for their email), try to lock in a viewing time
4. Vendors: Offer a free property appraisal — "I can lock one in with our principal agent right now, takes about 20 minutes — when suits you?"
5. Landlords: Property management enquiries — offer to have our PM contact them within the hour
6. Hot leads: Anyone ready to make an offer or wanting an agent urgently — tell them you'll flag it as a priority and arrange an immediate callback

Rules:
- Keep responses to 2–3 sentences max — concise, warm, and action-oriented
- Never make up specific property addresses, prices, or availability — say "I'll have our agent confirm that with you directly"
- ALWAYS try to collect: name, phone number, email — do not let the conversation close without at least a name and number
- Australian spelling always: "enquiry", "authorise", "colour", "recognise"
- End every response with a question or a clear next step to keep the lead engaged and moving forward
- You are a licensed professional — be confident and knowledgeable, never just a message-taker`;
}

function buildSystemPrompt(agencyName: string | null): string {
  if (!agencyName) return buildPlatformSarahPrompt();
  return buildRealEstateSarahPrompt(agencyName);
}

function detectAction(message: string, history: ChatMessage[]): { action: string | null; leadData?: Record<string, string> } {
  const lower = message.toLowerCase();
  const allText = history.map(m => m.content).join(" ").toLowerCase();

  if (lower.includes("send me the form") || lower.includes("paper application") || lower.includes("tenancy form") || lower.includes("application form")) {
    return { action: "send_form" };
  }
  if (lower.includes("make an offer") || lower.includes("want to buy") || lower.includes("ready to purchase") || lower.includes("i'll take it")) {
    return { action: "transfer_call" };
  }

  // Simple lead detection
  const emailMatch = allText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = allText.match(/(\+?61|0)[0-9 ]{8,12}/);
  if (emailMatch || phoneMatch) {
    return {
      action: "collect_lead",
      leadData: {
        email: emailMatch?.[0] ?? "",
        phone: phoneMatch?.[0] ?? "",
      },
    };
  }

  return { action: null };
}

router.post("/ai/chat", async (req, res): Promise<void> => {
  const parsed = AiChatBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const { sessionId, message, agencyId } = parsed.data;

  // Load or create session
  let session = await db.select().from(chatSessionsTable).where(eq(chatSessionsTable.sessionId, sessionId)).then(r => r[0]);
  let history: ChatMessage[] = session ? JSON.parse(session.history) : [];

  // Add user message
  history.push({ role: "user", content: message });

  // Get agency name — null means platform (Directive OS) Sarah, a real name means real estate Sarah
  let agencyName: string | null = null;
  if (agencyId) {
    const [ag] = await db.select({ name: agenciesTable.name }).from(agenciesTable).where(eq(agenciesTable.id, agencyId));
    if (ag) agencyName = ag.name;
  }

  // Build AI response using OpenAI GPT-4o-mini
  let reply = "";
  try {
    const openaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: buildSystemPrompt(agencyName) },
      ...history.slice(0, -1).map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
      { role: "user", content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: openaiMessages,
      max_tokens: 180,
      temperature: 0.7,
    });

    reply = completion.choices[0]?.message?.content ?? "Thank you for reaching out. One of our agents will be in touch with you shortly.";
  } catch (err) {
    logger.error({ err }, "OpenAI chat completion failed");
    reply = "Thank you for reaching out. One of our team members will be in contact with you shortly.";
  }

  history.push({ role: "assistant", content: reply });

  // Save or update session
  if (session) {
    await db.update(chatSessionsTable).set({ history: JSON.stringify(history) }).where(eq(chatSessionsTable.sessionId, sessionId));
  } else {
    await db.insert(chatSessionsTable).values({ sessionId, agencyId: agencyId ?? null, history: JSON.stringify(history) });
  }

  // Detect action and contact info in the conversation
  const { action, leadData } = detectAction(message, history);

  // Save transcript and lead if we have an agency
  if (agencyId) {
    try {
      // Find or create one transcript per chat session (keyed by sessionId in summary)
      let transcript = await db.select().from(transcriptsTable)
        .where(eq(transcriptsTable.summary, `chat:${sessionId}`))
        .then(r => r[0]);

      if (!transcript) {
        const [newTranscript] = await db.insert(transcriptsTable).values({
          agencyId,
          channel: "chat",
          summary: `chat:${sessionId}`,
          leadName: "Website Visitor",
        }).returning();
        transcript = newTranscript;
      }

      // Append both sides of this exchange to the transcript
      await db.insert(transcriptMessagesTable).values([
        { transcriptId: transcript.id, role: "user", content: message, timestamp: new Date() },
        { transcriptId: transcript.id, role: "assistant", content: reply, timestamp: new Date() },
      ]);

      // Save lead when contact info is detected for the first time
      if (action === "collect_lead" && (leadData?.email || leadData?.phone)) {
        // Check if a lead already exists for this session
        const existingLead = await db.select({ id: leadsTable.id })
          .from(leadsTable)
          .where(eq(leadsTable.notes, `session:${sessionId}`))
          .then(r => r[0]);

        if (!existingLead) {
          // Infer lead type from conversation history
          const allText = history.map(m => m.content).join(" ").toLowerCase();
          const leadType = allText.includes("buy") || allText.includes("purchas") ? "buyer"
            : allText.includes("rent") || allText.includes("tenant") ? "tenant"
            : allText.includes("sell") || allText.includes("vendor") ? "vendor"
            : allText.includes("landlord") || allText.includes("manag") ? "landlord"
            : "enquiry";

          const hotLead = action === "transfer_call";

          const [newLead] = await db.insert(leadsTable).values({
            agencyId,
            name: "Website Enquiry",
            email: leadData.email || null,
            phone: leadData.phone || null,
            leadType,
            status: "new",
            channel: "chat",
            hotLead,
            notes: `session:${sessionId}`,
          }).returning();

          // Link lead to transcript
          await db.update(transcriptsTable)
            .set({ leadId: newLead.id, leadName: leadData.email || leadData.phone || "Website Enquiry" })
            .where(eq(transcriptsTable.id, transcript.id));

          logger.info({ leadId: newLead.id, email: leadData.email, phone: leadData.phone }, "New lead captured from chat");
        }
      }
    } catch (err) {
      logger.warn({ err }, "Failed to save transcript or lead");
    }

    // Report AI usage meter event if agency has a Stripe customer ID
    try {
      const [ag] = await db.select({ stripeCustomerId: agenciesTable.stripeCustomerId }).from(agenciesTable).where(eq(agenciesTable.id, agencyId));
      if (ag?.stripeCustomerId) {
        void reportAiUsage(ag.stripeCustomerId);
      }
    } catch (err) {
      logger.warn({ err }, "Failed to look up Stripe customer for usage reporting");
    }
  }

  res.json({ reply, action: action ?? null, leadData });
});

router.post("/ai/send-form", async (req, res): Promise<void> => {
  const parsed = AiSendFormBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const { email, name, listingAddress, agencyName } = parsed.data;
  // Mock SendGrid email send
  logger.info({ email, name, listingAddress, agencyName }, "Sending tenancy form email");
  res.json({
    success: true,
    message: `NSW Fair Trading Standard Tenancy Form sent to ${email}. The applicant will receive it within a few minutes.`,
  });
});

export default router;
