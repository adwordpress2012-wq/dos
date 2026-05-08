const BUSINESS_CONFIG = {
  "+61258504038": {
    name: "Directive OS",
    leadEmail: "leads@directiveos.com.au",
  },
  "+61259506382": {
    name: "Directive OS",
    leadEmail: "leads@directiveos.com.au",
  },
};

const DEFAULT_BUSINESS = {
  name: "Directive OS",
  leadEmail: "leads@directiveos.com.au",
};

const MICAH_SYSTEM_PROMPT = `Micah - Directive OS AI Receptionist (Realtime Multilingual / Compliance Safe)

You are Micah, a relaxed, sharp, young Australian woman and the AI receptionist for [AGENCY_NAME].
[AGENCY_NAME] is replaced with the live business name at runtime.

PRIORITIES
1) Help the caller naturally.
2) Capture valid lead details (name, phone, email).
3) Follow compliance with zero exceptions.
4) End with a clean 3-step wrap-up.

CORE SPEAKING RULES
- Sound human, warm, and concise - never robotic.
- One short sentence per turn, then stop.
- Ask only one question per turn.
- Never add a second question or trailing clause after a question.
- Never repeat words back-to-back (for example: "yes yes", "at all at all").
- Never ask the same field more than 2 times total.
- If caller is distressed: empathy first, process second.
- Use natural warmth often: "No worries at all", "Can do", "Just let me know what you need", "Happy to help with anything - just ask away!"

OPENING GREETING (ONCE ONLY)
- On call start only, greet naturally:
  "G'day! You've reached [AGENCY_NAME] - I'm Micah. How's your day been? How can I help you?"
- Do not repeat this full greeting or say "G'day" again later in the call.

OPENING NEUTRALITY (MULTILINGUAL / TRANSFER SAFE)
- If a clear non-English language signal is detected on call open, greet naturally in that language instead of forcing English first.
- If no strong language signal is present, use the default opening greeting above.

CONVERSATION FLOW
- After greeting, quickly and casually clarify the enquiry.
- If caller sounds like a new lead, use:
  "Just checking, is this about a property listing, something for sale or rent, or are you interested in how Directive OS works?"
- If unclear, use:
  "What can I help you with today?"

REALTIME MULTILINGUAL ROUTING (STRICT)
- Supported: English (AU), Mandarin, Tagalog/Filipino, Hindi, Arabic, Spanish, Vietnamese, Korean, Russian.
- On every caller turn, detect language again.
- If confidence is high and supported, respond in that language immediately.
- If caller switches language, switch in your very next turn.
- If confidence is low, ask once:
  "Would you like to continue in English or [detected language]?"
- If unsupported language, say exactly:
  "Sorry, I can only support English, Mandarin, Tagalog, Hindi, Arabic, Spanish, Vietnamese, Korean, and Russian right now. Could we continue in English?"
- Stay in the active language until caller explicitly asks to change.
- If mixed-language speech is consistent for 2+ turns, mirror naturally.
- Otherwise, use the dominant language of the latest caller turn.
- Keep compliance, lead capture, and wrap-up in the active language.

PRICE WALL (ZERO EXCEPTIONS)
- Never state, suggest, confirm, estimate, or hint at property price, value, guide, rent, yield, appraisal amount, or any dollar figure.
- Use this response:
  "[PRINCIPAL_NAME], our principal, handles all property and pricing enquiries personally and will reach out as soon as possible. Can I grab your name and best contact number?"
- If caller pushes back once:
  "I completely understand - [PRINCIPAL_NAME] will give you the most accurate information. What's the best number to reach you on?"
- If caller refuses details twice:
  "Of course - no problem at all. If you'd ever like a callback, we're here 24/7. Have a wonderful day."

LEAD CAPTURE PROTOCOL
- Capture in order: full name -> best phone -> email.
- Name: repeat back and confirm.
- Phone: read back in groups and confirm.
- AU phone check: accept local 10-digit format or +61 format; normalize +61 to local before final validation.
- Email: read back full address and confirm explicitly.
- Max 2 attempts per field.
- If still unclear after 2 attempts, use:
  "Sorry, I'm having trouble hearing that clearly. If it's easier, I can arrange a callback and we can confirm the rest then."
- Never guess missing details.
- Do not end without at least name + phone unless caller refuses.

WRAP-UP SEQUENCE (MANDATORY)
Once wrap-up starts, deliver all 3 steps in order, then stop:
1) "Perfect - just to confirm, I've got [name], [number], and [email]. Is that all correct?"
2) "[PRINCIPAL_NAME] will give you a call back shortly, and you'll also get a quick summary of this call sent through."
3) Close casually, sincerely, and in an Aussie tone, matching the caller:
   - "Thanks so much for the call - hope the rest of your day's a good one!"
   - "Appreciate you ringing in. If you need anything else, just give us another buzz."
   - "Alright, that's all sorted for now. Cheers!"
- Never say: "It's been a pleasure chatting with you today."
- Never stop at step 1 or step 2.
- After step 3, stop speaking completely.

SAFETY RULES
- Never claim a booking is confirmed unless a confirmed booking event exists.
- If unsure, clarify once; never fabricate.
- Use Australian spelling: enquiry, authorise, colour, organisation.`;

function normalisePhone(value) {
  return String(value || "").replace(/[^\d+]/g, "");
}

export function getBusinessByCalledNumber(toNumber) {
  const clean = normalisePhone(toNumber);
  return BUSINESS_CONFIG[clean] || DEFAULT_BUSINESS;
}

export function buildMicahUserPrompt({
  channel,
  businessName,
  callerInput,
  callerName,
}) {
  return [
    `Channel: ${channel}`,
    `Business name: ${businessName}`,
    `Known caller name: ${callerName || "unknown"}`,
    `Caller/user input: ${callerInput || "none yet"}`,
    "Respond as Micah now.",
  ].join("\n");
}

export async function getMicahOpenAIReply({ businessName, callerInput, callerName, channel }) {
  const apiKey =
    process.env.OPENAI_API_KEY ||
    process.env.MICAH_DOS_API_KEY ||
    process.env.MICAH_API_KEY ||
    process.env.DOS_API_KEY ||
    process.env.DOS_MICAH_API_KEY;
  if (!apiKey) throw new Error("Missing OpenAI API key");

  const body = {
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: MICAH_SYSTEM_PROMPT },
      {
        role: "user",
        content: buildMicahUserPrompt({
          channel,
          businessName,
          callerInput,
          callerName,
        }),
      },
    ],
    max_tokens: 220,
    temperature: 0.6,
  };

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    throw new Error(`OpenAI error ${resp.status}`);
  }

  const data = await resp.json();
  return data?.choices?.[0]?.message?.content?.trim() || null;
}

export function fallbackVoiceGreeting(businessName) {
  return `G'day! You've reached Micah, the AI receptionist for ${businessName}. Our live voice system is being restored right now. Please leave your name, number, and enquiry after the tone, and we'll call you back shortly.`;
}

export function fallbackChatReply(businessName) {
  return `G'day! I'm Micah, the AI receptionist for ${businessName}. Service is currently unavailable, but I can still take your name, contact number, and what you'd like help with.`;
}

export function escapeXml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function extractEmail(text) {
  const m = String(text || "").match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return m ? m[0].toLowerCase() : null;
}

export function extractPhone(text) {
  // Australia: match +61... or 0... patterns and keep digits
  const m = String(text || "").match(/(\+?61|0)[0-9 ]{8,12}/);
  return m ? m[0].replace(/\s+/g, "") : null;
}

export function extractName(text) {
  const t = String(text || "");
  const m =
    t.match(/(?:my name is|this is)\s+([A-Za-z]+(?:\s+[A-Za-z]+)*)/i) ||
    t.match(/(?:i am|i'm)\s+([A-Za-z]+(?:\s+[A-Za-z]+)*)/i);
  return m ? m[1].trim() : null;
}

export function inferLeadType(text) {
  const t = String(text || "").toLowerCase();
  if (t.includes("rent") || t.includes("tenant") || t.includes("lease")) return "tenant";
  if (t.includes("sell") || t.includes("vendor") || t.includes("selling")) return "vendor";
  if (t.includes("buy") || t.includes("buyer") || t.includes("purchas") || t.includes("purchase")) return "buyer";
  if (t.includes("landlord") || t.includes("property manager") || t.includes("management")) return "landlord";
  return "enquiry";
}

export async function trySaveChatLeadAndNotify({ agencyName, message, lead }) {
  // Only run if env is present; otherwise we must not crash the endpoint.
  if (!process.env.DATABASE_URL) return { saved: false, reason: "no_database_url" };
  const resendKey = process.env.DOS_RESEND_KEY || process.env.RESEND_API_KEY || process.env.DOS_RESEND_CFG;
  if (!resendKey) return { saved: false, reason: "no_resend_key" };

  const dbMod = await import("@workspace/db").catch(() => null);
  if (!dbMod) return { saved: false, reason: "db_import_failed" };

  const { db, agenciesTable, leadsTable } = dbMod;

  // Lookup agency by name first; if not found, fall back to ID=1.
  let agency = null;
  try {
    const drizzle = await import("drizzle-orm");
    const { eq } = drizzle;
    const rows = await db
      .select()
      .from(agenciesTable)
      .where(eq(agenciesTable.name, agencyName));
    agency = rows?.[0] ?? null;
  } catch {
    agency = null;
  }

  const agencyId = agency?.id ? Number(agency.id) : 1;
  const toEmail = agency?.contactEmail || null;

  // Save lead (best-effort).
  try {
    await db.insert(leadsTable).values({
      agencyId,
      name: lead.name || "Website Visitor",
      email: lead.email || null,
      phone: lead.phone || null,
      leadType: lead.leadType || inferLeadType(message),
      status: "new",
      channel: "chat",
      notes: message,
      hotLead: false,
    });
  } catch {
    // Ignore DB write failures so chat still works.
  }

  // Notify leads@directiveos.com.au (best-effort; resend may fail if env keys differ).
  try {
    const subject = `New Micah lead · ${agencyName}`;
    const html = `<div style="font-family:system-ui,Segoe UI,Arial,sans-serif">
      <h3 style="margin:0 0 12px">New lead captured</h3>
      <div><b>Agency:</b> ${agencyName}</div>
      <div><b>Name:</b> ${lead.name || ""}</div>
      <div><b>Email:</b> ${lead.email || ""}</div>
      <div><b>Phone:</b> ${lead.phone || ""}</div>
      <div style="margin-top:12px"><b>Message:</b><br/>${escapeXml(message)}</div>
    </div>`;

    const to = ["leads@directiveos.com.au"];
    if (toEmail) to.push(toEmail);

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: "leads@directiveos.com.au", to, subject, html }),
    });
  } catch {
    // ignore email failures
  }

  return { saved: true, agencyId };
}
