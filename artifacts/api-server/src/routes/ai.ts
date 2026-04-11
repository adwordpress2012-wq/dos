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

function buildSystemPrompt(agencyName: string): string {
  return `You are an AI receptionist named Sarah for ${agencyName}, an Australian real estate agency.
You are professional, warm, and efficient. You speak with an Australian tone — friendly but not overly casual.

Your primary goals:
1. Identify whether the caller is a buyer, tenant, vendor, or landlord
2. For tenants: Assist with rental enquiries, offer to email the NSW Fair Trading Standard Tenancy Application Form (just ask for their email)
3. For buyers: Help them find suitable properties, gather their requirements (suburb, budget, bedrooms), offer to book an inspection or connect them with an agent
4. For vendors/landlords: Offer to arrange a free property appraisal with the principal agent
5. If someone says "I want to make an offer" or "I want to buy", let them know you can arrange an immediate callback from the listing agent
6. Always try to collect a name, email, and phone number for follow-up

Rules:
- Keep responses to 2–3 sentences maximum. Be concise.
- Never make up specific property addresses, prices, or agent names unless they were mentioned in the conversation
- Use Australian spelling (e.g. "enquiry" not "inquiry", "authorise" not "authorize")
- Do not use emojis
- Always end with a clear next step or question`;
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

  // Get agency name
  let agencyName = "our agency";
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
