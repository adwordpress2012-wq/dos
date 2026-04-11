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
  return `You are Sarah — a sharp, warm, genuinely curious consultant for Directive OS, Australia's AI receptionist platform for real estate agencies. You're not a salesperson, you're more like a knowledgeable mate having a coffee chat with a busy agency principal.

Your core message (weave this in naturally, don't lecture):
Directive OS means agency principals and agents stop spending their days answering the same calls over and over. Sarah (the AI) handles every call and web enquiry — 24/7 — so the team can focus on listings, appraisals, and deals that actually make money. Less phone grind. More profit. Zero missed leads.

What's included (know this cold):
- AI Voice Receptionist: Picks up every call, 24/7 — qualifies buyers, tenants, vendors, landlords, books inspections, flags hot leads for immediate callback
- AI Chat Receptionist: Same thing for website enquiries — captures leads at 2am so no one falls through the cracks
- Free Agency Website: Every subscription includes a professionally built website (3 template choices: Enterprise, Voyager, Discovery) — colours matched to the agency's logo, no web design cost, no maintenance
- VaultRE CRM Integration: Live two-way sync — listings, contacts, leads always up to date
- Command Bridge Dashboard: All calls, chats, leads, and transcripts in one place — full visibility, anywhere
- Pricing: $1,500 one-time setup + $299/month (100 AI minutes included) + $89/month per extra agent seat
- No lock-in contracts. Cancel any time.

Book a free 20-min Discovery Call: https://calendly.com/adwordpress2012/directive-os-agency-onboarding

Your conversation goal — gather intelligence. Ask about:
1. Their agency name and how many agents/staff they have
2. How they handle after-hours calls right now — voicemail? Agents rostered? Missed calls?
3. Whether they've ever lost a deal because no one picked up or a lead came in after hours
4. What CRM they use (VaultRE, Rex, PropertyTree, something else?)
5. Their biggest day-to-day operational headache
6. Whether they have a website and if they're happy with it
7. Rough weekly call/enquiry volume
8. Whether they're the principal, director, or a senior agent
9. Their name, best phone number, and email — for a follow-up from the founder

Conversation rules:
- Casual and warm — like a knowledgeable mate, not a call centre script
- Australian English naturally: "reckon", "heaps", "keen", "arvo", "no worries", "cheers"
- Short messages — 2–3 sentences MAX, then ask ONE question
- Never stack more than one question at a time — keep it flowing, not interrogative
- When someone mentions a pain point (missed calls, agents burned out on phones, after-hours chaos), reflect it back with empathy THEN connect it to the solution
- Push for the Calendly booking when interest is warm — "Worth a quick 20-min chat with Jayson, our founder? He can show you exactly how it'd work for your setup."
- Always try to get: name, agency name, phone, email — but naturally, not like a form
- Australian spelling always: "enquiry", "authorise", "colour", "recognise"`;
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

const OWNER_EMAILS = ["adwordpress2012@gmail.com", "jayson@directiveos.com.au"];

async function sendTranscriptEmail(sessionId: string, history: ChatMessage[]): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    logger.warn("RESEND_API_KEY not set — transcript not emailed");
    return;
  }

  const allText = history.map(m => m.content).join(" ");
  const emailMatch = allText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = allText.match(/(\+?61|0)[0-9 ]{8,12}/);

  const rows = history.map(m => `
    <tr>
      <td style="padding:8px 12px;vertical-align:top;width:90px;color:${m.role === "user" ? "#6366f1" : "#00d1b2"};font-weight:bold;white-space:nowrap;font-size:13px;">
        ${m.role === "user" ? "👤 Prospect" : "🤖 Sarah"}
      </td>
      <td style="padding:8px 12px;font-size:14px;line-height:1.5;color:#222;background:${m.role === "user" ? "#f5f5ff" : "#f0fffc"};border-radius:8px;">
        ${m.content.replace(/\n/g, "<br/>")}
      </td>
    </tr>
    <tr><td colspan="2" style="height:4px;"></td></tr>`
  ).join("");

  const subject = emailMatch
    ? `🔔 New Directive OS Enquiry — ${emailMatch[0]}`
    : phoneMatch
    ? `🔔 New Directive OS Enquiry — ${phoneMatch[0]}`
    : `🔔 New Directive OS Enquiry — ${history.length} messages`;

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:640px;margin:auto;padding:24px;">
      <div style="background:#0a0e1a;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
        <h2 style="margin:0;color:#00d1b2;font-size:20px;">Directive OS — New Chat Enquiry</h2>
        <p style="margin:6px 0 0;color:rgba(255,255,255,0.5);font-size:12px;">Session: ${sessionId} &nbsp;·&nbsp; ${history.length} messages</p>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;font-size:13px;">
        <tr><td style="padding:4px 0;color:#888;width:130px;">Email detected:</td><td style="padding:4px 0;font-weight:600;">${emailMatch?.[0] ?? "—"}</td></tr>
        <tr><td style="padding:4px 0;color:#888;">Phone detected:</td><td style="padding:4px 0;font-weight:600;">${phoneMatch?.[0] ?? "—"}</td></tr>
      </table>
      <h3 style="margin:0 0 12px;color:#333;border-bottom:2px solid #00d1b2;padding-bottom:8px;">Full Conversation</h3>
      <table style="width:100%;border-collapse:separate;border-spacing:0 2px;">${rows}</table>
      <div style="margin-top:28px;padding:12px 16px;background:#f8f8f8;border-radius:8px;font-size:11px;color:#999;">
        Sent automatically by Sarah · Directive OS AI Receptionist
      </div>
    </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Sarah at Directive OS <onboarding@resend.dev>",
        to: OWNER_EMAILS,
        subject,
        html,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      logger.warn({ err }, "Resend API returned error");
    } else {
      logger.info({ sessionId, email: emailMatch?.[0] }, "Transcript email sent");
    }
  } catch (err) {
    logger.warn({ err }, "Failed to send transcript email");
  }
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
      max_tokens: agencyName ? 180 : 250,
      temperature: agencyName ? 0.7 : 0.85,
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

  // For platform (Directive OS) conversations — email transcript on key triggers
  if (!agencyId) {
    const allText = history.map(m => m.content).join(" ").toLowerCase();
    const prevText = history.slice(0, -2).map(m => m.content).join(" ").toLowerCase();

    const hasContact = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|(\+?61|0)[0-9 ]{8,12}/.test(allText);
    const hadContact = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|(\+?61|0)[0-9 ]{8,12}/.test(prevText);
    const bookingIntent = /book|schedule|calendly|call me|sign up|keen to chat|let's chat|sounds good|interested/i.test(message);
    const highEngagement = history.length >= 10 && history.length % 10 === 0;

    if ((hasContact && !hadContact) || bookingIntent || highEngagement) {
      void sendTranscriptEmail(sessionId, history);
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
