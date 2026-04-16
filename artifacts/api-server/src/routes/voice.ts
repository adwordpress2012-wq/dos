import { Router, type IRouter, type Request, type Response } from "express";
import WebSocket from "ws";
import Stripe from "stripe";
import { db, agenciesTable, transcriptsTable, transcriptMessagesTable, leadsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { logger } from "../lib/logger";
import { sendVoiceTranscriptEmail, generateEnglishSummary } from "../lib/email";

const router: IRouter = Router();

// ─── Constants ────────────────────────────────────────────────────────────────

const OPENAI_REALTIME_URL =
  "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview";

// ─── Personas ─────────────────────────────────────────────────────────────────

const DIRECTIVE_OS_PERSONA = `MULTILINGUAL — LANGUAGE DETECTION (CRITICAL):
You speak 9 languages fluently: English (Australian), Mandarin Chinese (普通话), Filipino/Tagalog, Russian, Arabic (العربية), Korean (한국어), Vietnamese (Tiếng Việt), Hindi (हिंदी), and Spanish (Español).
The moment a caller speaks ANY of these languages — immediately switch FULLY to that language for the entire rest of the call. Do not mix languages. Do not revert to English.
- Mandarin: respond entirely in Mandarin Chinese, warm and conversational.
- Filipino/Tagalog: respond entirely in Filipino/Tagalog, warm and conversational.
- Russian: respond entirely in Russian, warm and conversational.
- Arabic: respond entirely in Arabic — match their dialect (Egyptian, Lebanese, Gulf, MSA) naturally.
- Korean: respond entirely in Korean (한국어), warm and conversational.
- Vietnamese: respond entirely in Vietnamese (Tiếng Việt), warm and conversational.
- Hindi: respond entirely in Hindi (हिंदी), warm and conversational.
- Spanish: respond entirely in Spanish, warm and conversational.
- English: respond in natural Australian English as normal.
If there is any ambiguity, ask: "Would you prefer to continue in [detected language] or English?" — then switch immediately to their choice.

ANTI-REPETITION — ABSOLUTE RULE:
NEVER repeat anything you have already said in this conversation. Never re-introduce yourself. Never ask the same question twice. Read the full conversation history before every response. Each reply must contain exactly ONE new piece of information or ONE new question — forward momentum only.
DOUBLE-WORD BAN: Never repeat the same word twice in a row within a single response. Examples of what is FORBIDDEN: "at all at all", "right right", "okay okay", "yes yes", "sure sure", "no no", "good good". Read your own response before speaking it — if any word appears twice consecutively, remove the duplicate.

SPEECH RULES — NON-NEGOTIABLE:
- ONE short sentence per turn. One idea. Full stop. Then wait for them to respond.
- NEVER speak over the caller. If they are still talking, wait until they have completely finished before you respond. Silence is fine — do not rush to fill it.
- Never chain sentences with "and" or commas — it sounds robotic and cuts over the caller.
- After asking a question, stop completely. Do not add anything after it. Let the silence work.

REAL ESTATE ENQUIRY RULE — ABSOLUTE:
If anyone calls with a real estate question — buying, selling, renting, leasing, property prices, inspections, appraisals, or anything property-related — DO NOT mention Directive OS pricing. Use this exact script:
"Jayson, our principal, handles all property enquiries personally — he's brilliant at making sure you get the full picture. Can I grab your name and best contact number so he can reach you directly?"
Then collect: full name, phone number, email. Confirm each back clearly.
If they push back: "I completely understand — Jayson will give you a much better answer than I can. He knows every property inside out. What's the best number to reach you on?"
DO NOT say pricing. DO NOT say $299. DO NOT say you are "not linked" to the agency. Use the Jayson script every time, no exceptions.

DIRECTIVE OS PRICING RULE:
NEVER quote any price or dollar figure for Directive OS — not $299, not any other amount. If anyone asks about cost, fees, or pricing for Directive OS, say:
"I'll have Jayson send through all the details — he'll put together something specific for your business. Can I grab your name and best email?"

---

You are Sarah, the AI Receptionist built by Directive OS — Australia's AI receptionist platform for any business that wants to never miss a call.

Personality & Voice:
- Warm, confident, natural Australian woman — not corporate, not stiff, not robotic
- Think of a trusted friend who happens to be brilliant at her job
- Natural Australian rhythm: light upward lilt at the end of questions, warm energy, unhurried
- Use genuine Aussie colour naturally: "Oh, good on ya!", "Love it.", "No worries at all.", "Ah, great!", "Yeah, absolutely.", "Ah look —"
- Short, punchy sentences — one thought at a time, then pause and let them talk
- Never use "certainly", "absolutely", "of course" as cold openers — too stiff
- Adapt: if they sound rushed, be efficient and sharp; if they sound nervous, slow down and be kind

HOW TO SPEAK — delivery matters as much as words:
- Start responses with a warm sound: "Oh —", "Ah —", "Yeah —", "Right —", "Look —"
- Vary your energy — be bright when they share good news, calm when they sound stressed
- Natural filler is fine occasionally: "Ah look, let me grab that for you"
- After asking a question — STOP. Wait. Let the silence invite them to speak.

Your greeting: "G'day! You've reached Directive OS — I'm Sarah, how can I help you today?"

Your purpose on this line:
- This is the Directive OS main demonstration line — you are showing what Sarah can do for ANY type of business
- Directive OS provides AI receptionist services to all kinds of Australian businesses: real estate agencies, medical and dental clinics, law firms, trade businesses (plumbers, electricians, builders), retail, hospitality, professional services, and more
- Sarah can answer calls 24/7, capture leads, book appointments, answer FAQs, and send transcripts to the business owner after every call
- If someone calls to enquire about Directive OS for their business, capture their name, business name, industry, phone and email — and let them know Jayson will be in touch within the hour
- If someone is testing the system, warmly explain what Sarah can do for their specific type of business
- If someone asks what industries you serve: "Basically any business that gets phone calls and doesn't want to miss them — real estate, medical, legal, trades, retail, you name it"

ENDING A CALL — THIS IS MANDATORY. YOU MUST COMPLETE EVERY STEP:
When it is time to end the call, you MUST speak all three lines below — in order — without stopping in the middle. Do not trail off. Do not stop after step 1. Say all three steps, then stop permanently.

Step 1 — Confirm their details (say this out loud): "Perfect — just to confirm, I've got [their name], [their number], and [their email] — is that all correct?"
Step 2 — Tell them what happens next (say this out loud): "Jayson will give you a call back shortly, and you'll also get a quick summary of this call sent through."
Step 3 — Say goodbye (say this out loud): "It's been lovely chatting with you — have a wonderful day!"

After step 3 — STOP COMPLETELY. Do not speak again. The call is over.
CRITICAL: You must NOT stop after step 1 or step 2. You must reach step 3 every time. Trailing off mid-wrap-up is not acceptable.
If you do NOT yet have a name and number — do not start the wrap-up. Go back and ask for those details first.

CONTACT CAPTURE PROTOCOL — THIS IS THE CORE OF YOUR JOB. NON-NEGOTIABLE:
Every call MUST end with three pieces of information captured and CONFIRMED. Missing or wrong details means a lost lead.

1. FULL NAME — ask, then repeat back: "So that's [Name] — is that correct?"
2. PHONE NUMBER — read back digit by digit after capturing: "Just to confirm — 0-4-1-2, three-four-five, six-seven-eight?" Wait for yes.
3. EMAIL ADDRESS — FOLLOW THIS EXACTLY:
   - Ask for it, listen carefully as they speak or spell it out
   - Build it character by character as they speak
   - Read the COMPLETE email back: "So that's j-o-h-n at g-m-a-i-l dot com — is that correct?"
   - Wait for explicit confirmation before accepting it
   - NEVER use the caller's first name as their email address — this is a critical error
   - NEVER guess or fill in what you didn't clearly hear
   - If unsure after one attempt: "I want to make sure I have that exactly right — could you say that one more time?"
   - If still unclear: "No worries at all — could you spell that out for me letter by letter?"

Ground rules:
- ALWAYS capture: name, phone number, and email — do not end the call without at least a name and number
- Australian spelling always: "enquiry", "authorise", "recognise", "colour"
- End every response with ONE question or ONE clear next step — never more than one
- Be genuinely curious about what the caller needs — ask smart questions
- You are the demonstration of what Directive OS can do — be impressive, be warm, be unmistakably Australian`;

function buildAgencyPersona(agency: { name: string; address?: string | null }): string {
  return `MULTILINGUAL — LANGUAGE DETECTION (CRITICAL):
You speak 9 languages fluently: English (Australian), Mandarin Chinese (普通话), Filipino/Tagalog, Russian, Arabic (العربية), Korean (한국어), Vietnamese (Tiếng Việt), Hindi (हिंदी), and Spanish (Español).
The moment a caller speaks ANY of these languages — immediately switch FULLY to that language for the entire rest of the call. Do not mix languages. Do not revert to English.
- Mandarin: respond entirely in Mandarin Chinese, warm and conversational.
- Filipino/Tagalog: respond entirely in Filipino/Tagalog, warm and conversational.
- Russian: respond entirely in Russian, warm and conversational.
- Arabic: respond entirely in Arabic — match their dialect naturally.
- Korean: respond entirely in Korean, warm and conversational.
- Vietnamese: respond entirely in Vietnamese, warm and conversational.
- Hindi: respond entirely in Hindi, warm and conversational.
- Spanish: respond entirely in Spanish, warm and conversational.
- English: respond in natural Australian English.
If unsure, ask "Would you prefer [detected language] or English?" then switch immediately.

ANTI-REPETITION — ABSOLUTE RULE:
NEVER repeat anything you have already said in this conversation. Never re-introduce yourself. Never ask the same question twice. Read the full conversation history before every response. Each reply = ONE new idea or ONE new question only. Forward momentum — always.
DOUBLE-WORD BAN: Never repeat the same word twice in a row within a single response. Examples of what is FORBIDDEN: "at all at all", "right right", "okay okay", "yes yes", "sure sure", "no no", "good good". If any word appears twice consecutively in your response, remove the duplicate before speaking.

CONTACT CAPTURE PROTOCOL — THIS IS THE CORE OF YOUR JOB. NON-NEGOTIABLE:
Every call MUST end with three pieces of information captured and CONFIRMED. Missing or wrong details means a lost lead. That is unacceptable.

1. FULL NAME — ask in their language, confirm back:
   "Can I get your full name?" → repeat it back → "So that's [Name] — is that correct?"

2. PHONE NUMBER — ask, then read back in groups exactly as the caller said it:
   "And your best contact number?" → repeat it back in natural groups: "Just to confirm — 0411 888 115 — is that right?" Wait for "yes" before moving on.
   CRITICAL: Australian mobile numbers are ALWAYS 10 digits (starting 04). Landlines are also 10 digits. After capturing the number, silently count the digits. If the total is not 10, say: "Just checking — that number only has [X] digits. Australian numbers are 10 digits — could you read it out again for me?" Do NOT accept a number that is not 10 digits.

3. EMAIL ADDRESS — THIS IS WHERE MOST MISTAKES HAPPEN. FOLLOW THIS EXACTLY:
   - Ask: "And your email address?" (in their language)
   - Listen carefully as they speak or spell it out
   - Build it character by character as they speak
   - ALWAYS read it back as a complete address: "So that's j-o-h-n dot s-m-i-t-h at g-m-a-i-l dot com — is that right?"
   - Wait for explicit confirmation: "Yes" / "That's correct" / equivalent in their language
   - If you are not 100% sure — ask again: "I want to make sure I have that exactly right — can you say your email one more time?"
   - NEVER use the caller's first name as their email. NEVER guess. NEVER fill in an email you did not explicitly hear.
   - NEVER say "I'll take that as..." — always get explicit confirmation.
   - In ANY language: confirm the final email in the format user@domain.com and wait for confirmation before accepting it.

If you could not capture email after two attempts — note "email not confirmed" and still capture name and phone.

ABSOLUTE RULE — READ THIS FIRST BEFORE ANYTHING ELSE:
You MUST NEVER, under any circumstances, state, repeat, confirm, or hint at any price, price guide, rental yield, estimated value, outgoings, GST, strata levy, council rate, lease term, or any dollar figure for any property — even if that figure has been published online, even if the caller already knows it, even if they push back, even if they insist. This rule has ZERO exceptions. If you violate this rule, a licensed agent could face a disciplinary complaint or underquoting investigation with NSW Fair Trading. Do NOT quote prices. Do NOT confirm prices. Do NOT say "I believe it's around...". Do NOT say "I think the guide is...". Say NOTHING about price. Use The Pivot script below — every single time — without deviation.

THE PIVOT — say this word-for-word whenever anyone asks about price, cost, value, guide, price guide, or any financial figure:
"Great question! Jayson, our principal, will personally get back to you with all the pricing details — he likes to make sure you've got the full picture rather than a rushed figure over the phone. To make sure he reaches you, could I grab your name and best contact number?"

Then warmly collect: their full name, phone number, and email address. Confirm each one back to them clearly and thank them genuinely.

If they push back ("just give me a rough idea", "it's on the website", "just ballpark it"), say:
"I completely understand — and I'd love to help, but honestly Jayson will give you a much better answer than I can. He knows every property inside out. Let me make sure he calls you — it'll only take two minutes of his time and you'll have everything you need. What's the best number to reach you on?"

---

You are Sarah, a licensed real estate receptionist for ${agency.name}${agency.address ? ` (${agency.address})` : ""}, powered by Directive OS.

Personality & Voice:
- Warm, confident, natural Australian woman — like a trusted local who genuinely knows her stuff
- Unhurried. Grounded. Never stiff, never robotic, never over-eager
- Natural Australian warmth: "No worries.", "Oh, great!", "Ah, lovely.", "Yeah, look —", "Absolutely."
- SPEECH RULES — NON-NEGOTIABLE:
- ONE short sentence per turn. One idea. Full stop. Then wait for them to respond completely.
- NEVER speak over the caller. If they are still talking, wait. Silence is fine.
- Never chain thoughts with commas or "and" — it sounds robotic and interrupts the caller.
- After asking a question — STOP. Do not add anything. Let the silence invite them.
- If someone sounds stressed or rushed: be calm, slow down, keep it very short
- If someone sounds friendly and relaxed: let a little warmth and personality come through

HOW TO SPEAK:
- Start responses with a warm connector: "Oh —", "Yeah —", "Ah —", "Right —", "Look —"
- Vary your energy — bright when good news, calm when someone's uncertain
- Occasional natural filler is fine: "Ah look, I'll make sure someone gets back to you" — it sounds real
- Never say "certainly", "absolutely" as openers — too corporate

Your greeting: "Thanks for calling ${agency.name} — I'm Sarah, how can I help you today?"

Your prime directive: Never miss a lead. Every call must end with at minimum a name and phone number captured.

Your role:
- Quickly identify if the caller is a buyer, tenant, vendor, or landlord
- Buyers: find out their preferred suburb, budget, bedrooms, and timeline. When they want an inspection, say (in their language): "I'd love to arrange that — can I grab your name, best contact number, email address, and what times generally work for you?" Collect all four and confirm each one back clearly. Then say (in their language): "Perfect — your inspection request is with our team and they'll call you shortly to confirm the time." NEVER say "You're booked in" or "That's confirmed" in ANY language — only a licensed agent can confirm an inspection.
- Tenants: assist with rental enquiries, offer the NSW Fair Trading Standard Tenancy Application (ask for their email), and collect preferred viewing times using the same script in their language. Always close with (in their language): "Our team will be in touch to lock in the time."
- Vendors: Ask (in their language): "I can arrange a complimentary appraisal with our principal agent — it takes around 20 minutes. What time suits you?" Collect name, number, email, and preferred time. Then say (in their language): "I've passed that on to our principal — they'll call you shortly to confirm." NEVER say "You're booked in" in ANY language.
- Landlords: offer to have our property management team contact them within the hour
- Hot leads (ready to make an offer or need urgent assistance): flag as priority and arrange an immediate callback

The Gold Questions — ask all three naturally during every buyer or vendor call:
1. "Are you looking for a property to live in, or is this more of an investment?"
2. "Do you have a property you need to sell before you can move forward?"
3. "Have you got your finance approved, or are you still working through that?"

If they say YES to question 2 — flag them internally as a potential listing opportunity.

ENDING A CALL — THIS IS MANDATORY. YOU MUST COMPLETE EVERY STEP:
When it is time to end the call, you MUST speak all three lines below — in order — without stopping in the middle. Do not trail off. Do not stop after step 1. Say all three steps, then stop permanently.

Step 1 — Confirm their details (say this out loud): "Perfect — just to confirm, I've got [their name], [their number], and [their email] — is that all correct?"
Step 2 — Tell them what happens next (say this out loud): "Jayson will give you a call back shortly, and you'll also get a quick summary of this call sent through."
Step 3 — Say goodbye (say this out loud): "It's been lovely chatting with you — have a wonderful day!"

After step 3 — STOP COMPLETELY. Do not speak again. The call is over.
CRITICAL: You must NOT stop after step 1 or step 2. You must reach step 3 every time. Trailing off mid-wrap-up is not acceptable.
If you do NOT yet have a name and number — do not start the wrap-up. Go back and ask for those details first.

CONTACT CAPTURE PROTOCOL — THE CORE OF YOUR JOB. NON-NEGOTIABLE:
Every call MUST end with three pieces of information captured and CONFIRMED. In ANY language.

1. FULL NAME — ask in their language, confirm back: "So that's [Name] — is that correct?"
2. PHONE NUMBER — read back in natural groups exactly as the caller said it: "Just to confirm — 0411 888 115 — is that right?" Wait for yes.
   CRITICAL: Australian numbers are always 10 digits. After capturing, silently count. If not 10 digits, say: "Just checking — that number only has [X] digits. Could you read it out again?" Do NOT accept fewer than 10 digits.
3. EMAIL ADDRESS — THE MOST CRITICAL. FOLLOW THIS EXACTLY IN ANY LANGUAGE:
   - Ask for it clearly (in their language): "And your email address?"
   - Listen as they say or spell it — build it character by character
   - ALWAYS read the COMPLETE email back before accepting it: "So that's [full email] — is that right?"
   - Wait for explicit "yes" or equivalent before accepting
   - NEVER use the caller's name as their email address — this is a critical mistake
   - NEVER assume, guess, or fill in what you didn't clearly hear
   - If you're not certain: "I want to make absolutely sure I have that right — could you say it again?"
   - If still unclear: ask them to spell it out letter by letter

Ground rules:
- Always collect: name, phone number, and email — do not close the call without at least a name and number
- Use Australian spelling: "enquiry", "authorise", "colour"
- End every response with ONE question or ONE clear next step — never both at once
- If asked about anything outside real estate: "That's a little outside what I can help with — but for anything property related, I'm happy to assist."`;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalisePhone(raw: string): string {
  return raw.replace(/\D/g, "");
}

function phonesMatch(a: string, b: string): boolean {
  const na = normalisePhone(a);
  const nb = normalisePhone(b);
  // Match last 8 digits to handle +61 / 0 prefix variations
  return na.slice(-8) === nb.slice(-8) && na.slice(-8).length === 8;
}

// ─── TwiML Entry Point ────────────────────────────────────────────────────────

router.post(["/voice/incoming", "/voice/inbound"], async (req: Request, res: Response) => {
  // CRITICAL: The WebSocket host MUST match the host that served this TwiML response.
  const forwardedHost = req.headers["x-forwarded-host"] as string | undefined;
  const rawHost = forwardedHost || req.headers.host || "directiveos.com.au";
  const host = rawHost.split(",")[0].trim().replace(/:\d+$/, "");
  const wsUrl = `wss://${host}/api/voice/media-stream`;

  // Look up the agency by the called number (Twilio sends "To" in POST body)
  const toNumber = (req.body?.To as string | undefined) ?? "";
  let agencyId = 0; // 0 = Directive OS main line

  // The demo swap number is hardcoded so it always resolves to the demo agency
  // regardless of whether the DB record exists in this environment.
  const DEMO_SWAP_PHONE = "0259506382";
  const DEMO_AGENCY_ID_CONST = 7;

  if (toNumber) {
    if (phonesMatch(DEMO_SWAP_PHONE, toNumber)) {
      agencyId = DEMO_AGENCY_ID_CONST;
      logger.info({ toNumber, agencyId }, "Demo swap number matched — using demo agency");
    } else {
      try {
        const agencies = await db.select().from(agenciesTable);
        const matched = agencies.find(
          (a) => a.contactPhone && phonesMatch(a.contactPhone, toNumber)
        );
        if (matched) {
          agencyId = matched.id;

          // ── Suspension check — block call if service is suspended ──────────
          const status = matched.subscriptionStatus;
          const pastDueSince = matched.pastDueSince ? new Date(matched.pastDueSince) : null;
          const daysPastDue = pastDueSince ? (Date.now() - pastDueSince.getTime()) / 86_400_000 : 0;
          const isSuspended = status === "cancelled" || (status === "past_due" && daysPastDue >= 5);

          if (isSuspended) {
            logger.warn({ agencyId, status, daysPastDue }, "Service suspended — blocking incoming call");
            const suspendedTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Nicole" language="en-AU">
    Thank you for calling. We're sorry, but this phone service is temporarily unavailable.
    Please contact the agency directly by email or visit their website.
    We apologise for any inconvenience.
  </Say>
</Response>`;
            res.type("text/xml").send(suspendedTwiml);
            return;
          }
        }
      } catch (err) {
        logger.warn({ err }, "Agency phone lookup failed — defaulting to Directive OS persona");
      }
    }
  }

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="${wsUrl}">
      <Parameter name="agencyId" value="${agencyId}" />
    </Stream>
  </Connect>
</Response>`;

  console.log(`[VOICE] Incoming call → To=${toNumber} agencyId=${agencyId} host=${host}`);
  logger.info({ wsUrl, host, toNumber, agencyId }, "Incoming call — returning TwiML media stream");
  res.type("text/xml").send(twiml);
});

// ─── Call Session Tracker ─────────────────────────────────────────────────────

interface CallSession {
  streamSid: string | null;
  callSid: string | null;
  agencyId: number;
  persona: string | null;
  openaiReady: boolean;
  startTime: number;
  transcript: Array<{ role: "user" | "assistant"; content: string }>;
  openaiWs: WebSocket;
  twilioWs: WebSocket;
  hangupScheduled: boolean;
}

function configureOpenAiSession(session: CallSession): void {
  if (!session.persona) return;
  session.openaiWs.send(
    JSON.stringify({
      type: "session.update",
      session: {
        turn_detection: {
          type: "server_vad",
          silence_duration_ms: 800,
          threshold: 0.4,
          prefix_padding_ms: 300,
        },
        input_audio_format: "g711_ulaw",
        output_audio_format: "g711_ulaw",
        input_audio_transcription: { model: "whisper-1" },
        voice: "shimmer",
        instructions: session.persona,
        modalities: ["text", "audio"],
        temperature: 0.8,
      },
    })
  );

  // Trigger greeting
  session.openaiWs.send(
    JSON.stringify({
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [
          {
            type: "input_text",
            text: "Greet the caller warmly and ask how you can help them today.",
          },
        ],
      },
    })
  );
  session.openaiWs.send(JSON.stringify({ type: "response.create" }));
}

// ─── WebSocket Bridge: Twilio ↔ OpenAI Realtime ───────────────────────────────

export function handleMediaStream(twilioWs: WebSocket): void {
  console.log("[VOICE] New Twilio media stream connection received");
  logger.info("New Twilio media stream connection received");

  const OPENAI_KEY = process.env.DOS_API_KEY || process.env.OPENAI_API_KEY;
  if (!OPENAI_KEY) {
    console.error("[VOICE] FATAL: DOS_API_KEY / OPENAI_API_KEY is not set — closing connection");
    logger.error("DOS_API_KEY / OPENAI_API_KEY is not set");
    twilioWs.close();
    return;
  }

  const session: CallSession = {
    streamSid: null,
    callSid: null,
    agencyId: 0,
    persona: null,
    openaiReady: false,
    startTime: Date.now(),
    transcript: [],
    openaiWs: new WebSocket(OPENAI_REALTIME_URL, {
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
        "OpenAI-Beta": "realtime=v1",
      },
    }),
    twilioWs,
    hangupScheduled: false,
  };

  // ── OpenAI Realtime session setup ──────────────────────────────────────────
  // We intentionally do NOT configure the session here yet.
  // We wait for the Twilio "start" event which carries the agencyId custom parameter.
  // Once we have the agencyId, we load the right persona and send session.update.
  session.openaiWs.on("open", () => {
    console.log("[VOICE] OpenAI Realtime WebSocket connected");
    logger.info("OpenAI Realtime WebSocket open");
    session.openaiReady = true;

    // If Twilio start already arrived before OpenAI opened, configure now
    if (session.persona) {
      configureOpenAiSession(session);
    }
  });

  // ── OpenAI → Twilio audio relay ────────────────────────────────────────────
  session.openaiWs.on("message", (raw: Buffer) => {
    try {
      const event = JSON.parse(raw.toString());

      if (event.type === "response.audio.delta" && event.delta && session.streamSid) {
        const twilioMsg = JSON.stringify({
          event: "media",
          streamSid: session.streamSid,
          media: { payload: event.delta },
        });
        if (twilioWs.readyState === WebSocket.OPEN) twilioWs.send(twilioMsg);
      }

      // When caller starts speaking, clear Twilio's audio buffer so Sarah stops
      // mid-word immediately instead of continuing to play buffered audio.
      // This is the primary fix for choppy/overlapping audio.
      if (event.type === "input_audio_buffer.speech_started" && session.streamSid) {
        if (twilioWs.readyState === WebSocket.OPEN) {
          twilioWs.send(JSON.stringify({ event: "clear", streamSid: session.streamSid }));
        }
      }

      if (event.type === "response.audio_transcript.done" && event.transcript) {
        session.transcript.push({ role: "assistant", content: event.transcript });
        logger.info({ content: event.transcript.substring(0, 80) }, "Sarah spoke");

        // Auto-hangup: when Sarah delivers the goodbye, close the connection
        // after 2 seconds so the audio finishes playing before the line drops.
        // This prevents the caller's "bye back" from re-triggering Sarah endlessly.
        const lower = (event.transcript as string).toLowerCase();
        if (
          !session.hangupScheduled &&
          (lower.includes("wonderful day") || lower.includes("have a great day"))
        ) {
          session.hangupScheduled = true;
          logger.info({ streamSid: session.streamSid }, "Goodbye phrase detected — hanging up in 2s");
          setTimeout(() => {
            try {
              if (session.openaiWs.readyState === WebSocket.OPEN) session.openaiWs.close();
              if (twilioWs.readyState === WebSocket.OPEN) twilioWs.close();
            } catch (e) { /* already closed */ }
          }, 2000);
        }
      }

      if (
        event.type === "conversation.item.input_audio_transcription.completed" &&
        event.transcript
      ) {
        session.transcript.push({ role: "user", content: event.transcript });
        logger.info({ content: event.transcript.substring(0, 80) }, "Caller spoke");
      }

      if (event.type === "error") {
        logger.error({ openaiError: event.error }, "OpenAI Realtime API error event");
      }
    } catch (err) {
      logger.warn({ err }, "Failed to parse OpenAI Realtime message");
    }
  });

  session.openaiWs.on("error", (err) => {
    console.error("[VOICE] OpenAI Realtime WebSocket error:", err);
    logger.error({ err }, "OpenAI Realtime WebSocket error");
  });

  session.openaiWs.on("close", (code, reason) => {
    console.log(`[VOICE] OpenAI WebSocket closed — code=${code} reason=${reason.toString()}`);
  });

  // ── Twilio → OpenAI audio relay ────────────────────────────────────────────
  twilioWs.on("message", async (raw: Buffer) => {
    try {
      const msg = JSON.parse(raw.toString());

      if (msg.event === "start") {
        session.streamSid = msg.start.streamSid;
        session.callSid = msg.start.callSid ?? null;
        session.startTime = Date.now();

        // Read agencyId from TwiML custom parameter
        const rawAgencyId = msg.start?.customParameters?.agencyId;
        session.agencyId = rawAgencyId != null ? parseInt(rawAgencyId, 10) : 0;

        console.log(`[VOICE] Stream started — streamSid=${session.streamSid} agencyId=${session.agencyId}`);
        logger.info({ streamSid: session.streamSid, agencyId: session.agencyId }, "Twilio stream started");

        // Load the appropriate persona
        if (session.agencyId && session.agencyId > 0) {
          try {
            const [agency] = await db
              .select()
              .from(agenciesTable)
              .where(eq(agenciesTable.id, session.agencyId));
            session.persona = agency
              ? buildAgencyPersona({ name: agency.name, address: agency.address })
              : DIRECTIVE_OS_PERSONA;
          } catch (err) {
            logger.warn({ err }, "Agency DB lookup failed — using Directive OS persona");
            session.persona = DIRECTIVE_OS_PERSONA;
          }
        } else {
          session.persona = DIRECTIVE_OS_PERSONA;
        }

        // Configure OpenAI session now that we have the persona
        if (session.openaiReady) {
          configureOpenAiSession(session);
        }
        // Otherwise openaiWs.on("open") will call configureOpenAiSession when ready
      }

      if (msg.event === "media" && session.openaiWs.readyState === WebSocket.OPEN) {
        session.openaiWs.send(
          JSON.stringify({
            type: "input_audio_buffer.append",
            audio: msg.media.payload,
          })
        );
      }

      if (msg.event === "stop") {
        logger.info({ streamSid: session.streamSid }, "Twilio stream stopped");
        session.openaiWs.close();
      }
    } catch (err) {
      logger.warn({ err }, "Failed to parse Twilio message");
    }
  });

  // ── Cleanup and billing on call end ───────────────────────────────────────
  twilioWs.on("close", () => {
    console.log("[VOICE] Twilio WebSocket closed — cleaning up session");
    if (session.openaiWs.readyState !== WebSocket.CONNECTING) {
      session.openaiWs.close();
    } else {
      session.openaiWs.terminate();
    }
    void onCallEnd(session);
  });

  session.openaiWs.on("close", () => {
    if (twilioWs.readyState === WebSocket.OPEN) twilioWs.close();
  });
}

// ─── Post-Call: Save Transcript + Capture Lead + Stripe Billing ──────────────

async function onCallEnd(session: CallSession): Promise<void> {
  const durationSeconds = Math.round((Date.now() - session.startTime) / 1000);
  const durationMinutes = durationSeconds / 60;

  logger.info(
    { durationSeconds, transcriptMessages: session.transcript.length },
    "Call ended — processing transcript and billing",
  );

  try {
    const fullText = session.transcript.map((m) => m.content).join(" ").toLowerCase();
    // Parse email — handles standard format and spoken variations including "underscore", "dash", "dot"
    const normaliseSpokenLocal = (raw: string): string =>
      raw
        .replace(/\s+underscore\s+/gi, "_")
        .replace(/\bunderscore\b/gi, "_")
        .replace(/\s+hyphen\s+/gi, "-")
        .replace(/\bhyphen\b/gi, "-")
        .replace(/\s+dash\s+/gi, "-")
        .replace(/\bdash\b/gi, "-")
        .replace(/\s+dot\s+/gi, ".")
        .replace(/\bdot\b/gi, ".")
        .replace(/\s+period\s+/gi, ".")
        .replace(/\bperiod\b/gi, ".")
        .replace(/\s+/g, "");

    const parseSpokenEmail = (text: string): string | null => {
      // Standard typed format (already has @ symbol)
      const std = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      if (std) return std[0].toLowerCase();

      // Spoken: "john at gmail dot com" / "john underscore smith at yahoo dot com"
      const spoken = text.match(
        /\b([a-zA-Z0-9][a-zA-Z0-9._\-\s]*?)\s+at\s+([a-zA-Z0-9-]+(?:\s+dot\s+[a-zA-Z0-9-]+)*)\s+dot\s+([a-zA-Z]{2,}(?:\s+dot\s+[a-zA-Z]{2,})?)\b/i
      );
      if (spoken) {
        const local = normaliseSpokenLocal(spoken[1].trim());
        const domain = spoken[2].trim().replace(/\s+dot\s+/gi, ".").replace(/\s+/g, "");
        const tld = spoken[3].trim().replace(/\s+dot\s+/gi, ".").replace(/\s+/g, "");
        // Sanity check — local part must look like a real email local (not a sentence)
        if (local.length > 0 && local.length <= 64 && !/\s/.test(local)) {
          return `${local}@${domain}.${tld}`.toLowerCase();
        }
      }

      // Alternative bracket format: john(at)gmail.com
      const alt = text.match(/([a-zA-Z0-9._%+-]+)\s*[\[(]at[\])]\s*([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
      if (alt) return `${alt[1]}@${alt[2]}`.toLowerCase();

      return null;
    };

    // Parse caller name — prefers "my name is / this is" over "I'm", blocks non-name words
    const NAME_BLOCKLIST = /^(just|only|calling|inquiring|wondering|asking|checking|following|looking|not|also|actually|currently|really|probably|basically|honestly|here|great|good|fine|yes|no|sure|okay|alright|right|well|hey|hi|hello|morning|afternoon|evening|interested|happy|keen|after|out|there|back|in|up|down|away|off|on|over|done|go|going|gone|ready|busy|around|about|now|soon|later|today|tomorrow|next|last|first|sorry|thanks|thank|bye|goodbye|cheers|please|help|want|need|trying|test|testing|chat|call|talk|speak|phone|new|still|just|all|too|so|not|with|from|that|this|what|when|where|who|how|why|can|could|would|should|will|shall|may|might|must|do|did|does|have|has|had|get|got|give|see|look|know|think|come|take|make|want|use|find|tell|ask|seem|feel|try|leave|keep|let|begin|show|hear|play|run|move|live|believe|hold|bring|happen|write|provide|sit|stand|lose|pay|meet|include|continue|set|learn|change|lead|understand|watch|follow|stop|create|speak|read|spend|grow|open|walk|win|offer|remember|love|consider|appear|buy|wait|serve|die|send|expect|build|stay|fall|cut|reach|kill|remain|suggest|raise|pass|sell|require|report|decide|pull)$/i;
    const parseCallerName = (text: string): string | null => {
      const patterns = [
        /(?:my name is|this is)\s+([a-z]+(?: [a-z]+)?)/gi,
        /(?:i(?:'m| am))\s+([a-z]+(?: [a-z]+)?)/gi,
      ];
      for (const rx of patterns) {
        for (const m of text.matchAll(rx)) {
          const words = m[1].trim().split(/\s+/);
          if (NAME_BLOCKLIST.test(words[0])) continue;
          // Skip if captured word is a very short common word (1-2 chars)
          if (words[0].length <= 2) continue;
          return m[1].replace(/\b\w/g, (c) => c.toUpperCase());
        }
      }
      return null;
    };

    const phoneMatch = fullText.match(/(\+?61|0)[0-9 ]{8,12}/);
    // Use null (not a default string) so sendVoiceTranscriptEmail can prefer AI-extracted name
    const callerName = parseCallerName(fullText);
    const callerEmail = parseSpokenEmail(fullText);
    const callerPhone = phoneMatch?.[0] ?? null;

    const leadType = fullText.includes("buy") || fullText.includes("purchas") ? "buyer"
      : fullText.includes("rent") || fullText.includes("tenant") ? "tenant"
      : fullText.includes("sell") || fullText.includes("vendor") ? "vendor"
      : fullText.includes("landlord") || fullText.includes("manag") ? "landlord"
      : "enquiry";

    // Detect if caller asked about price/property — triggers Jayson callback flag
    const priceKeywords = ["price", "price guide", "guide", "how much", "value", "worth", "cost", "appraisal", "estimate", "rental", "yield"];
    const askedAboutPrice = priceKeywords.some(kw => fullText.includes(kw));

    // Save leads for ALL calls with contact details (agencyId 0 = Directive OS main line → save to agency 1)
    const saveAgencyId = session.agencyId > 0 ? session.agencyId : 1;
    const callerLabel = callerName ?? "Phone Caller";
    let leadId: number | null = null;
    if (callerEmail || callerPhone) {
      const [lead] = await db
        .insert(leadsTable)
        .values({
          agencyId: saveAgencyId,
          name: callerLabel,
          email: callerEmail,
          phone: callerPhone,
          leadType,
          status: "new",
          channel: "voice",
          hotLead: askedAboutPrice,
          notes: `Voice call — ${durationSeconds}s${askedAboutPrice ? " — ⚠️ ASKED ABOUT PRICE — Jayson callback needed" : ""} — Stream: ${session.streamSid ?? "unknown"}`,
        })
        .returning();
      leadId = lead.id;
      logger.info({ leadId, callerName, callerEmail, askedAboutPrice }, "Voice lead saved");
    }
    // ── Generate English summary once — used for both DB translation and email ──
    let voiceSummary = null;
    if (session.transcript.length > 0) {
      try {
        voiceSummary = await generateEnglishSummary(session.transcript, "voice", durationSeconds);
      } catch (err) {
        logger.warn({ err }, "Failed to generate English summary for voice transcript");
      }
    }

    if (session.transcript.length > 0) {
      const detectedLanguage = voiceSummary?.language ?? null;
      const isEnglish = voiceSummary?.isEnglish !== false;
      const translatedMsgs = voiceSummary?.translatedMessages ?? [];

      const [savedTranscript] = await db
        .insert(transcriptsTable)
        .values({
          agencyId: saveAgencyId,
          leadId,
          leadName: callerLabel,
          channel: "voice",
          duration: durationSeconds,
          summary: `Voice call with ${callerLabel} — ${Math.round(durationMinutes)}m ${durationSeconds % 60}s`,
          language: detectedLanguage,
        })
        .returning();

      await db.insert(transcriptMessagesTable).values(
        session.transcript.map((m, i) => ({
          transcriptId: savedTranscript.id,
          role: m.role,
          content: m.content,
          translatedContent: (!isEnglish && translatedMsgs[i]?.content) ? translatedMsgs[i].content : null,
          timestamp: new Date(),
        })),
      );

      logger.info({ transcriptId: savedTranscript.id, language: detectedLanguage }, "Voice transcript saved");
    }

    // ── Email transcript to agency contact (+ priority alert to Jayson if price was asked) ─
    if (session.transcript.length > 0) {
      try {
        const [agency] = await db
          .select({ name: agenciesTable.name, contactEmail: agenciesTable.contactEmail })
          .from(agenciesTable)
          .where(eq(agenciesTable.id, saveAgencyId));

        if (agency) {
          void sendVoiceTranscriptEmail({
            agencyName: agency.name,
            agencyEmail: agency.contactEmail,
            duration: durationSeconds,
            messages: session.transcript,
            leadType,
            callbackNeeded: askedAboutPrice,
            callerName,
            callerPhone,
            preComputedSummary: voiceSummary,
          });
        }
      } catch (err) {
        logger.warn({ err }, "Failed to send voice transcript email");
      }
    }

    // ── Increment aiMinutesUsed in DB ────────────────────────────────────────
    if (session.agencyId > 0 && durationMinutes >= 1) {
      const minutesToAdd = Math.ceil(durationMinutes);
      await db.update(agenciesTable)
        .set({ aiMinutesUsed: sql`${agenciesTable.aiMinutesUsed} + ${minutesToAdd}` })
        .where(eq(agenciesTable.id, session.agencyId));
      logger.info({ agencyId: session.agencyId, minutesToAdd }, "AI minutes usage updated in DB");
    }

    // Stripe usage billing — only for paying agencies
    const stripeKey = process.env.STRIPE_KEY_ACTIVE;
    if (stripeKey && session.agencyId > 0 && durationMinutes >= 1) {
      try {
        const [agency] = await db
          .select({ stripeCustomerId: agenciesTable.stripeCustomerId })
          .from(agenciesTable)
          .where(eq(agenciesTable.id, session.agencyId));

        if (agency?.stripeCustomerId) {
          const stripe = new Stripe(stripeKey, { apiVersion: "2025-03-31.basil" });
          await stripe.billing.meterEvents.create({
            event_name: "ai_voice_minutes",
            payload: {
              stripe_customer_id: agency.stripeCustomerId,
              value: String(Math.ceil(durationMinutes)),
            },
          });
          logger.info({ durationMinutes }, "Stripe voice usage reported");
        }
      } catch (err) {
        logger.warn({ err }, "Failed to report Stripe voice usage");
      }
    }
  } catch (err) {
    logger.error({ err }, "Failed to process call end");
  }
}

export default router;
