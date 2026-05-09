import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, agenciesTable, chatSessionsTable, transcriptsTable, transcriptMessagesTable, leadsTable } from "@workspace/db";
import { AiChatBody, AiSendFormBody } from "@workspace/api-zod";
import { logger } from "../lib/logger";
import { sendChatTranscriptEmail, generateEnglishSummary, OWNER_EMAILS } from "../lib/email";
import Stripe from "stripe";
import OpenAI from "openai";
import { handleInstantQuote, handleWidgetMessage } from "../lib/micah-widget";

const openai = new OpenAI({ apiKey: process.env.DOS_API_KEY || process.env.OPENAI_API_KEY });

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
  return `MULTILINGUAL — LANGUAGE DETECTION (CRITICAL):
You speak 9 languages fluently: English (Australian), Mandarin Chinese (普通话), Filipino/Tagalog, Russian, Arabic (العربية), Korean (한국어), Vietnamese (Tiếng Việt), Hindi (हिंदी), and Spanish (Español).
The moment a visitor writes in ANY of these languages — immediately switch FULLY to that language for the entire conversation. Do not mix languages. Do not revert to English.
- Mandarin: respond entirely in Mandarin Chinese.
- Filipino/Tagalog: respond entirely in Filipino/Tagalog.
- Russian: respond entirely in Russian.
- Arabic: respond entirely in Arabic, matching their dialect.
- Korean: respond entirely in Korean (한국어).
- Vietnamese: respond entirely in Vietnamese (Tiếng Việt).
- Hindi: respond entirely in Hindi (हिंदी).
- Spanish: respond entirely in Spanish.
- English: respond in natural Australian English.

You are Sarah — a sharp, warm, genuinely curious consultant for Directive OS, Australia's AI receptionist platform for real estate agencies. You're not a salesperson, you're more like a knowledgeable mate having a coffee chat with a busy agency principal.

Your core message (weave this in naturally, don't lecture):
Directive OS means agency principals and agents stop spending their days answering the same calls over and over. Sarah (the AI) handles every call and web enquiry — 24/7 — so the team can focus on listings, appraisals, and deals that actually make money. Less phone grind. More profit. Zero missed leads.

What's included (know this cold):
- AI Voice Receptionist: Picks up every call, 24/7 — qualifies buyers, tenants, vendors, landlords, receives inspection requests and passes them to the agent team for confirmation, flags hot leads for immediate callback
- AI Chat Receptionist: Same thing for website enquiries — captures leads at 2am so no one falls through the cracks
- Free Agency Website: Every subscription includes a professionally built website (3 template choices: Enterprise, Voyager, Discovery) — colours matched to the agency's logo, no web design cost, no maintenance
- VaultRE CRM Integration: Live two-way sync — listings, contacts, leads always up to date
- Command Bridge Dashboard: All calls, chats, leads, and transcripts in one place — full visibility, anywhere
- Pricing — three tiers, no lock-in, cancel any time:
  • Small Agency (1–5 agents): $1,800 setup + $299/month (includes 100 AI minutes) + $89/seat/month for extra agents
  • Medium Agency (6–15 agents): $2,500 setup + $399/month (includes 200 AI minutes) + $99/seat/month for extra agents
  • Large Agency (16+ agents): $4,500 setup + $599/month (includes 400 AI minutes) + $119/seat/month for extra agents
- When asked about pricing, briefly describe all three tiers so they can self-identify which fits — then offer the Discovery Call for a tailored quote

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
  return `MULTILINGUAL — LANGUAGE DETECTION (CRITICAL):
You speak 9 languages fluently: English (Australian), Mandarin Chinese (普通话), Filipino/Tagalog, Russian, Arabic (العربية), Korean (한국어), Vietnamese (Tiếng Việt), Hindi (हिंदी), and Spanish (Español).
The moment a visitor writes in ANY of these languages — immediately switch FULLY to that language for the entire conversation. Do not mix languages. Do not revert to English.
- Mandarin: respond entirely in Mandarin Chinese.
- Filipino/Tagalog: respond entirely in Filipino/Tagalog.
- Russian: respond entirely in Russian.
- Arabic: respond entirely in Arabic, matching their dialect.
- Korean: respond entirely in Korean (한국어).
- Vietnamese: respond entirely in Vietnamese (Tiếng Việt).
- Hindi: respond entirely in Hindi (हिंदी).
- Spanish: respond entirely in Spanish.
- English: respond in natural Australian English.

You are Sarah, a Class 2 licensed real estate agent and AI receptionist for ${agencyName}, powered by Directive OS.

CRITICAL ANTI-REPETITION RULES — READ FIRST:
- NEVER repeat, paraphrase, or echo anything you have already said in this conversation
- NEVER ask a question you have already asked — if they haven't answered, gently acknowledge and move on
- NEVER use the same opening phrase twice ("Great!", "Perfect!", "Wonderful!" — vary them every single response)
- Read the full conversation history above before each reply — if you already introduced yourself, DO NOT introduce yourself again
- Keep every reply fresh — one new idea, one new question, forward momentum only

CONTACT CAPTURE PROTOCOL — NON-NEGOTIABLE. THIS IS THE CORE OF YOUR JOB:
Every conversation MUST end with three pieces of information captured and CONFIRMED. In ANY language.

1. FULL NAME — ask, then confirm: "Just to confirm — that's [Name], correct?"
2. PHONE NUMBER — ask, then repeat back the full number: "And that number is [digits] — is that right?"
3. EMAIL ADDRESS — THE CRITICAL ONE. FOLLOW THIS EXACTLY:
   - Ask: "And your email address?" — in their language
   - When they provide it (typed or spelled): read it back as a complete address before accepting
   - Confirm: "Just to confirm — that's [full email] — is that correct?"
   - Wait for explicit "yes" before accepting
   - Accept any spoken format and reconstruct: "john at gmail dot com" → john@gmail.com
   - NEVER use the person's name as their email address — this is a critical error
   - NEVER guess or assume the email — only accept what was explicitly provided and confirmed
   - If unclear: "I want to make sure I have that exactly right — could you type it again?"

Personality & Style:
- Warm, confident, genuinely expert — a skilled real estate professional, not a script-reader
- Natural Australian tone: friendly, approachable, knowledgeable — never stiff or corporate
- Your prime directive: Never miss a lead. Every conversation must end with at minimum a name and phone number captured

Your role:
1. Immediately identify whether the enquiry is from a buyer, tenant, vendor, or landlord
2. Buyers: Understand their requirements (suburb, budget, bedrooms, timeline). When they want an inspection say (in their language): "I'd love to arrange that — can I grab your name, best contact number, email, and what times generally work for you?" Collect all four and confirm each back. Then say (in their language): "Your inspection request is with our team — they'll be in touch shortly to confirm a time." NEVER say "You're booked in" or "That's confirmed" in ANY language — only a licensed agent can confirm an inspection.
3. Tenants: Assist with rental enquiries, offer to email the NSW Fair Trading Standard Tenancy Application Form (ask for their email), and collect preferred viewing times — always close with (in their language): "Our team will be in touch to lock in the time."
4. Vendors: Offer a free property appraisal (in their language): "I can arrange a complimentary appraisal with our principal agent, takes about 20 minutes — when suits you?" Collect name, number, email, and preferred time. Then say (in their language): "I've passed that on — they'll call you shortly to confirm." NEVER say "You're booked in" in ANY language.
5. Landlords: Offer to have our PM contact them within the hour
6. Hot leads: Anyone ready to make an offer — flag as priority and arrange immediate callback

Rules:
- Keep responses to 2–3 sentences max — concise, warm, action-oriented
- Never make up specific property addresses, prices, or availability — say "I'll have our agent confirm that with you directly"
- ALWAYS try to collect: name, phone number, email — do not let the conversation close without at least a name and number
- Australian spelling always: "enquiry", "authorise", "colour", "recognise"
- End every response with ONE question or ONE clear next step — never two questions at once`;
}

function buildSystemPrompt(agencyName: string | null): string {
  if (!agencyName) return buildPlatformSarahPrompt();
  return buildRealEstateSarahPrompt(agencyName);
}


function parseSpokenEmail(text: string): string | null {
  // Standard format: john@gmail.com
  const std = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (std) return std[0].toLowerCase();

  // Spoken format: "john at gmail dot com" or "john dot smith at outlook dot com dot au"
  const spoken = text.match(
    /\b([a-zA-Z0-9][a-zA-Z0-9._\- ]*?)\s+at\s+([a-zA-Z0-9-]+(?:\s+dot\s+[a-zA-Z0-9-]+)*)\s+dot\s+([a-zA-Z]{2,}(?:\s+dot\s+[a-zA-Z]{2,})?)\b/i
  );
  if (spoken) {
    const local = spoken[1].trim().replace(/\s+dot\s+/gi, ".").replace(/\s+/g, "");
    const domain = spoken[2].trim().replace(/\s+dot\s+/gi, ".").replace(/\s+/g, "");
    const tld = spoken[3].trim().replace(/\s+dot\s+/gi, ".").replace(/\s+/g, "");
    return `${local}@${domain}.${tld}`.toLowerCase();
  }

  // Alternative: "john(at)gmail.com" or "john[at]gmail.com"
  const alt = text.match(/([a-zA-Z0-9._%+-]+)\s*[\[(]at[\])]\s*([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
  if (alt) return `${alt[1]}@${alt[2]}`.toLowerCase();

  return null;
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

  // Lead detection with spoken email support
  const email = parseSpokenEmail(allText) ?? "";
  const phoneMatch = allText.match(/(\+?61|0)[0-9 ]{8,12}/);
  if (email || phoneMatch) {
    return {
      action: "collect_lead",
      leadData: {
        email,
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
  // agencyNameOverride allows demo pages to pass the agency name directly
  // without needing a database record (used by client landing page demos)
  const agencyNameOverride: string | null = typeof req.body.agencyName === "string" ? req.body.agencyName : null;

  // Load or create session
  let session = await db.select().from(chatSessionsTable).where(eq(chatSessionsTable.sessionId, sessionId)).then(r => r[0]);
  let history: ChatMessage[] = session ? JSON.parse(session.history) : [];

  // Add user message
  history.push({ role: "user", content: message });

  // Get agency name — null means platform (Directive OS) Sarah, a real name means real estate Sarah
  // Priority: agencyNameOverride (demo pages) > DB lookup by agencyId > null (platform Sarah)
  let agencyName: string | null = agencyNameOverride;
  if (!agencyName && agencyId) {
    const [ag] = await db.select({
      name: agenciesTable.name,
      subscriptionStatus: agenciesTable.subscriptionStatus,
      pastDueSince: agenciesTable.pastDueSince,
    }).from(agenciesTable).where(eq(agenciesTable.id, agencyId));
    if (ag) {
      agencyName = ag.name;
      // Suspension check — block chat if service is suspended
      const daysPastDue = ag.pastDueSince ? (Date.now() - new Date(ag.pastDueSince).getTime()) / 86_400_000 : 0;
      const isSuspended = ag.subscriptionStatus === "cancelled" || (ag.subscriptionStatus === "past_due" && daysPastDue >= 5);
      if (isSuspended) {
        res.json({ reply: "I'm sorry, this chat service is temporarily unavailable. Please contact the agency directly by phone or email. We apologise for the inconvenience." });
        return;
      }
    }
  }

  // Build AI response using OpenAI GPT-4o-mini
  let reply = "";
  try {
    // Seed a greeting context when this is the first user message, so OpenAI knows
    // the introduction has already happened and won't repeat it
    const isFirstMessage = history.length === 1;
    const greetingContext: OpenAI.Chat.ChatCompletionMessageParam[] = isFirstMessage ? [{
      role: "assistant",
      content: agencyName
        ? `G'day! Thanks for reaching out to ${agencyName}. I'm Sarah, how can I help you today?`
        : `G'day! You've reached Directive OS — I'm Sarah, the AI receptionist. How can I help you today?`,
    }] : [];

    const openaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: buildSystemPrompt(agencyName) },
      ...greetingContext,
      ...history.slice(0, -1).map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
      { role: "user", content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: openaiMessages,
      max_tokens: agencyName ? 160 : 220,
      temperature: agencyName ? 0.6 : 0.75,
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

          // Email transcript to agency contact on first lead capture
          try {
            const [ag] = await db
              .select({ name: agenciesTable.name, contactEmail: agenciesTable.contactEmail })
              .from(agenciesTable)
              .where(eq(agenciesTable.id, agencyId));

            if (ag) {
              const allText = history.map(m => m.content).join(" ").toLowerCase();
              const leadType = allText.includes("buy") || allText.includes("purchas") ? "buyer"
                : allText.includes("rent") || allText.includes("tenant") ? "tenant"
                : allText.includes("sell") || allText.includes("vendor") ? "vendor"
                : allText.includes("landlord") || allText.includes("manag") ? "landlord"
                : "enquiry";

              // Generate English summary once — used for both translation DB save and email
              const chatSummary = await generateEnglishSummary(history, "chat");

              // Save language on transcript and translated content on messages if non-English
              if (chatSummary && !chatSummary.isEnglish && chatSummary.translatedMessages?.length) {
                await db.update(transcriptsTable)
                  .set({ language: chatSummary.language })
                  .where(eq(transcriptsTable.id, transcript.id));

                // Fetch saved messages in order to update them with translations
                const savedMsgs = await db.select({ id: transcriptMessagesTable.id })
                  .from(transcriptMessagesTable)
                  .where(eq(transcriptMessagesTable.transcriptId, transcript.id))
                  .orderBy(transcriptMessagesTable.timestamp);

                for (let i = 0; i < savedMsgs.length; i++) {
                  const translated = chatSummary.translatedMessages[i]?.content;
                  if (translated) {
                    await db.update(transcriptMessagesTable)
                      .set({ translatedContent: translated })
                      .where(eq(transcriptMessagesTable.id, savedMsgs[i].id));
                  }
                }
              }

              void sendChatTranscriptEmail({
                agencyName: ag.name,
                agencyEmail: ag.contactEmail,
                sessionId,
                messages: history,
                leadType,
                preComputedSummary: chatSummary,
              });
            }
          } catch (err) {
            logger.warn({ err }, "Failed to send agency chat transcript email");
          }
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
      void sendChatTranscriptEmail({
        agencyName: "Directive OS",
        agencyEmail: null,
        sessionId,
        messages: history,
      });
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

router.post("/widget/message", async (req, res): Promise<void> => {
  try {
    const out = await handleWidgetMessage(req.body ?? {});
    res.json({ reply: out.reply });
  } catch (err) {
    logger.error({ err }, "widget/message failed");
    res.status(500).json({ reply: "Sorry — something went wrong. Please try again shortly." });
  }
});

router.post("/widget/instant-quote", async (req, res): Promise<void> => {
  try {
    await handleInstantQuote((req.body ?? {}) as Record<string, unknown>);
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "instant-quote failed");
    res.status(500).json({ ok: false });
  }
});

export default router;
