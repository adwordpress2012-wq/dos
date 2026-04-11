import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, agenciesTable, chatSessionsTable, transcriptsTable, transcriptMessagesTable, leadsTable } from "@workspace/db";
import { AiChatBody, AiSendFormBody } from "@workspace/api-zod";
import { logger } from "../lib/logger";
import Stripe from "stripe";

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
  return `You are an AI receptionist for ${agencyName}, a real estate agency. 
You are professional, helpful, and friendly. 

Your primary goals:
1. First, determine if the caller is a buyer, tenant, vendor, or landlord
2. For tenants: Help them with rental applications, offer to email the NSW Fair Trading Standard Tenancy Form
3. For buyers: Provide information about properties and offer to connect them with an agent
4. If someone expresses high intent like "I want to make an offer" or "I want to buy", indicate a live transfer to the agent is available
5. Collect contact details (name, email, phone) for lead capture

Keep responses concise and professional. Always be helpful and warm.`;
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

  // Build AI response (mock GPT-4o logic without API key)
  let reply = "";
  const lower = message.toLowerCase();
  const isFirstMessage = history.filter(m => m.role === "user").length === 1;

  if (isFirstMessage) {
    reply = `Thank you for contacting ${agencyName}! I'm your AI receptionist, available 24/7 to assist you. To best help you today, could you let me know — are you a buyer looking to purchase a property, or a tenant looking for a rental?`;
  } else if (lower.includes("buyer") || lower.includes("purchase") || lower.includes("buy")) {
    reply = `Excellent! I can help you find the perfect property. We have a number of great listings available. Could you share a bit more about what you're looking for — preferred suburb, budget range, and the number of bedrooms? I can also arrange for one of our agents to call you directly.`;
  } else if (lower.includes("tenant") || lower.includes("rent") || lower.includes("rental")) {
    reply = `Of course! I'd love to help you find your next home. We have several rental properties currently available. Are you looking for anything specific in terms of location, size, or budget? Also, if you'd like to apply for a property, I can email you the NSW Fair Trading Standard Tenancy Application Form — just provide your email address.`;
  } else if (lower.includes("inspection") || lower.includes("open home") || lower.includes("when can i")) {
    reply = `We'd love to show you through the property! Our current inspection times are available on each listing. I can also arrange a private inspection for you with the listing agent. Could you confirm your name and contact number so we can get that booked in?`;
  } else if (lower.includes("form") || lower.includes("application") || lower.includes("apply")) {
    reply = `Absolutely! I can arrange for the NSW Fair Trading Standard Tenancy Application Form to be sent to your email immediately. Could you provide your email address and the property address you're interested in?`;
  } else if (lower.includes("offer") || lower.includes("make an offer") || lower.includes("purchase price")) {
    reply = `That's fantastic — it sounds like you're ready to move forward! I'll connect you directly with the listing agent right away. They'll be able to guide you through the offer process. Please hold while I transfer your call, or I can have them call you back shortly. What's the best number to reach you?`;
  } else if (lower.includes("price") || lower.includes("how much") || lower.includes("cost")) {
    reply = `Great question! Prices vary depending on the property. Our current listings range from $650/week for apartments to $2.8M+ for premium homes. Would you like me to pull up details on a specific property, or would you prefer our agents to send you a tailored list based on your budget?`;
  } else if (lower.includes("@") || lower.includes("email")) {
    reply = `Perfect, I've noted your contact details. One of our agents will be in touch with you shortly. In the meantime, is there anything else I can help you with today?`;
  } else {
    reply = `Thank you for that information. I want to make sure I connect you with the right person from our team. Could you tell me a bit more about what you're looking for — are you interested in buying, renting, selling, or managing a property?`;
  }

  history.push({ role: "assistant", content: reply });

  // Save or update session
  if (session) {
    await db.update(chatSessionsTable).set({ history: JSON.stringify(history) }).where(eq(chatSessionsTable.sessionId, sessionId));
  } else {
    await db.insert(chatSessionsTable).values({ sessionId, agencyId: agencyId ?? null, history: JSON.stringify(history) });
  }

  // Detect action
  const { action, leadData } = detectAction(message, history);

  // Save transcript message if we have a session connected to an agency
  if (agencyId) {
    try {
      let transcript = await db.select().from(transcriptsTable)
        .where(eq(transcriptsTable.leadId, -1 * agencyId))
        .then(r => r[0]);

      if (!transcript) {
        const [newTranscript] = await db.insert(transcriptsTable).values({
          agencyId,
          channel: "chat",
          summary: "Web chat session",
        }).returning();
        transcript = newTranscript;
      }

      await db.insert(transcriptMessagesTable).values([
        { transcriptId: transcript.id, role: "user", content: message, timestamp: new Date() },
        { transcriptId: transcript.id, role: "assistant", content: reply, timestamp: new Date() },
      ]);
    } catch (err) {
      logger.warn({ err }, "Failed to save transcript message");
    }
  }

  // Report AI usage meter event if agency has a Stripe customer ID
  if (agencyId) {
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
