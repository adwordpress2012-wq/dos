import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.DOS_API_KEY || process.env.OPENAI_API_KEY });

/** Fallback demo venue when Supabase has no profile */
export const MICAH_DEMO_FALLBACK_PROFILE = {
  business_name: "Harbour Bistro",
  tagline: "Modern Australian dining — Circular Quay",
  opening_hours: "Wednesday–Sunday 12:00–15:00 & 17:30–22:00. Closed Monday–Tuesday.",
  menu_summary:
    "Seasonal seafood, wood-fired steaks, vegetarian tasting menu, full wine list. Ask about allergens.",
  address: "Shop 4, Circular Quay East, Sydney NSW",
  phone_display: "02 5550 0100",
};

export interface WidgetMessageBody {
  client_id?: string;
  message?: string;
  messages?: Array<{ role: "user" | "assistant"; content: string }>;
}

function normaliseProfile(raw: Record<string, unknown> | null): Record<string, string> {
  const base = MICAH_DEMO_FALLBACK_PROFILE;
  if (!raw) {
    return {
      business_name: base.business_name,
      tagline: base.tagline,
      opening_hours: base.opening_hours,
      menu_summary: base.menu_summary,
      address: base.address,
      phone_display: base.phone_display,
    };
  }
  const str = (k: string, fb: string) =>
    (typeof raw[k] === "string" && String(raw[k]).trim() ? String(raw[k]).trim() : fb);
  return {
    business_name: str("business_name", str("name", base.business_name)),
    tagline: str("tagline", base.tagline),
    opening_hours: str("opening_hours", base.opening_hours),
    menu_summary: str("menu_summary", str("menu", base.menu_summary)),
    address: str("address", base.address),
    phone_display: str("phone_display", str("phone", base.phone_display)),
  };
}

export async function fetchSupabaseBusinessProfile(clientId: string): Promise<Record<string, unknown> | null> {
  const baseUrl = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!baseUrl || !key) return null;
  try {
    const url = `${baseUrl.replace(/\/+$/, "")}/rest/v1/business_profiles?select=*&client_id=eq.${encodeURIComponent(clientId)}&limit=1`;
    const res = await fetch(url, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        Accept: "application/json",
      },
    });
    if (!res.ok) return null;
    const rows = (await res.json()) as unknown;
    if (!Array.isArray(rows) || rows.length === 0) return null;
    return rows[0] as Record<string, unknown>;
  } catch {
    return null;
  }
}

function buildMicahDemoSystemPrompt(profile: Record<string, string>): string {
  return `You are Micah — a warm, sharp AI receptionist for ${profile.business_name} (${profile.tagline}).

BUSINESS FACTS (only state these when relevant — never invent others):
- Opening hours: ${profile.opening_hours}
- Menu / food: ${profile.menu_summary}
- Address: ${profile.address}
- Phone: ${profile.phone_display}

YOUR JOB
1) Answer FAQs, opening hours, and menu questions conversationally.
2) When someone wants a booking, run the booking capture flow — ONE question per reply, short sentences.
3) Never claim a table is confirmed. The venue confirms bookings.

BOOKING FLOW (strict order — skip only if the user already gave that detail earlier in the chat)
Step A — Preferred date
Step B — Preferred time
Step C — Number of guests
Step D — Guest full name
Step E — Best contact phone (Australian mobile or landline)

After steps A–E are clearly present in the conversation, your NEXT reply must:
1) Briefly summarise date, time, guests, name, phone.
2) End with this EXACT sentence on its own line:
Thanks, I've sent your request to the team.

Until A–E are all established, NEVER use that sentence or imply the request was already handed off.

STYLE
- Australian English: "enquiry", "colour".
- One question per message until booking details are complete.
- Do not escalate or "hand off" early. Do not apologise by sending everything to the team unless the closing sentence above applies.

SAFETY
- If asked something you cannot know from the facts above, say you'll pass it to the team with their booking — but still complete the booking questions first when they want a reservation.`;
}

function buildDosHubSystemPrompt(): string {
  return `You are Micah — the Directive OS assistant on directiveos.com.au.

Directive OS sells Done-For-You AI Business Systems for Australian small businesses: website rebuilds, AI receptionist (you), SMS automation, WhatsApp, booking automation, and AI voice receptionist — installed and managed for them.

Be concise, friendly, non-technical, and business-focused. Not "AI nerd" speak.

Rules:
- Answer questions about what DOS includes and how it helps (more bookings, fewer missed customers, faster replies).
- If they want pricing, summarise that plans start from the Founding tier at $197/month through Growth at $497/month, optional website rebuilds from about $1000+, and offer https://calendly.com/adwordpress2012/directive-os-agency-onboarding for a tailored quote.
- Collect interest naturally: business type, what they need — one question at a time when helpful.
- NEVER say "Thanks, I've sent your request to the team" on Directive OS marketing chat — that phrase is reserved for restaurant booking demos only.
- Do not mention internal codenames for voice infrastructure — refer to "AI voice receptionist" under Micah / Directive OS only.`;
}

const CLOSING_LINE = "Thanks, I've sent your request to the team.";

function transcriptText(messages: Array<{ role: string; content: string }>): string {
  return messages.map((m) => m.content).join("\n");
}

function hasClosingLine(messages: Array<{ role: string; content: string }>): boolean {
  const t = transcriptText(messages).toLowerCase();
  return t.includes("sent your request to the team");
}

function bookingFieldsSatisfied(text: string): boolean {
  const lower = text.toLowerCase();
  const compact = text.replace(/\s/g, " ");
  const hasPhone = /(\+?61|0)\s?4\d{2}\s?\d{3}\s?\d{3}|(\+?61|0)\s?[2-478]\d{8}/.test(compact);
  const hasGuests =
    /(?:for\s+)?(\d{1,2})\s*(guest|people|person|pax|of\s+us)/i.test(lower) ||
    /party\s+of\s+(\d{1,2})/i.test(lower) ||
    /table\s+for\s+(\d{1,2})/i.test(lower) ||
    /\b(a couple|two people|three people|four people)\b/i.test(lower);
  const hasTime =
    /\b(\d{1,2}(:\d{2})?\s*(am|pm)|midday|noon|lunch|dinner|\d{1,2}\.\d{2}\s*(pm|am))\b/i.test(lower) ||
    /\b([01]?\d|2[0-3]):[0-5]\d\b/.test(compact);
  const hasDate =
    /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|tonight)\b/i.test(lower) ||
    /\b\d{1,2}[\/\-]\d{1,2}(\/\d{2,4})?\b/.test(lower) ||
    /\b\d{1,2}\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b/i.test(lower);
  const hasName =
    /\bmy name is\b/i.test(lower) ||
    /\b(?:i'?m|i am)\s+[A-Za-z][a-z]+(?:\s+[A-Za-z][a-z]+)?\b/.test(text) ||
    /\b(?:under the name|name'?s?)\s+[A-Za-z][A-Za-z\s'-]{2,24}\b/i.test(text);
  return Boolean(hasDate && hasTime && hasGuests && hasName && hasPhone);
}

export async function handleWidgetMessage(body: WidgetMessageBody): Promise<{ reply: string }> {
  const clientId = body.client_id?.trim() || "micah-demo";
  const incomingMessage = String(body.message ?? "").trim();
  let history = Array.isArray(body.messages) ? [...body.messages] : [];

  if (!incomingMessage && history.length === 0) {
    return { reply: "Hey — I'm Micah. How can I help today?" };
  }

  if (incomingMessage) {
    history.push({ role: "user", content: incomingMessage });
  }

  const apiKey = process.env.DOS_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      reply:
        "Micah is temporarily unavailable — please call Directive OS on 02 5850 4038 or email support@directiveos.com.au.",
    };
  }

  let systemPrompt: string;
  let profileLabel = "";

  if (clientId === "dos-hub") {
    systemPrompt = buildDosHubSystemPrompt();
  } else {
    const rawProfile =
      clientId === "micah-demo" ? await fetchSupabaseBusinessProfile("micah-demo").catch(() => null) : null;
    const profile = normaliseProfile(rawProfile);
    profileLabel = profile.business_name;
    systemPrompt = buildMicahDemoSystemPrompt(profile);
  }

  const openaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...history.slice(-24).map((m) => ({
      role: m.role === "user" ? "user" as const : "assistant" as const,
      content: m.content,
    })),
  ];

  let reply =
    "I'm having trouble connecting right now — please try again in a moment.";

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: openaiMessages,
      max_tokens: clientId === "dos-hub" ? 220 : 180,
      temperature: 0.55,
    });
    reply = completion.choices[0]?.message?.content?.trim() || reply;
  } catch {
    reply =
      clientId === "dos-hub"
        ? "No worries — for a detailed answer, book a free call at https://calendly.com/adwordpress2012/directive-os-agency-onboarding or phone 02 5850 4038."
        : `Hi — I'm Micah from ${profileLabel || "the venue"}. What date were you thinking for your booking?`;
  }

  // Restaurant demo: only allow the closing line when booking fields are present
  if (clientId !== "dos-hub") {
    const assistantDraft = reply;
    const draftLower = assistantDraft.toLowerCase();
    const mentionsClosing = draftLower.includes("sent your request to the team");
    const satisfied = bookingFieldsSatisfied(transcriptText(history));

    if (mentionsClosing && !satisfied) {
      reply = assistantDraft
        .replace(new RegExp(CLOSING_LINE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
      if (!reply) {
        reply =
          "Happy to help with a booking — what date works best for you?";
      }
    } else if (!mentionsClosing && satisfied && !hasClosingLine(history)) {
      reply = `${assistantDraft}\n\n${CLOSING_LINE}`;
    }
  }

  return { reply };
}

export async function handleInstantQuote(body: Record<string, unknown>): Promise<{ ok: boolean }> {
  const payload = {
    business_type: String(body.business_type ?? ""),
    website_rebuild: Boolean(body.website_rebuild),
    ai_receptionist: Boolean(body.ai_receptionist),
    sms: Boolean(body.sms),
    whatsapp: Boolean(body.whatsapp),
    ai_voice: Boolean(body.ai_voice),
    booking_system: Boolean(body.booking_system),
    hosting: Boolean(body.hosting),
    name: String(body.name ?? ""),
    email: String(body.email ?? ""),
    phone: String(body.phone ?? ""),
    business_name: String(body.business_name ?? ""),
    estimated_setup_aud: Number(body.estimated_setup_aud ?? 0),
    estimated_monthly_aud: Number(body.estimated_monthly_aud ?? 0),
    created_at: new Date().toISOString(),
  };

  const baseUrl = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (baseUrl && key) {
    try {
      await fetch(`${baseUrl.replace(/\/+$/, "")}/rest/v1/instant_ai_quotes`, {
        method: "POST",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(payload),
      });
    } catch {
      // optional table — ignore
    }
  }

  const resendKey = process.env.DOS_RESEND_KEY || process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "leads@directiveos.com.au",
          to: ["leads@directiveos.com.au"],
          subject: `Instant AI quote · ${payload.business_name || payload.name || "Unknown"}`,
          html: `<pre style="font-family:system-ui,sans-serif">${JSON.stringify(payload, null, 2)}</pre>`,
        }),
      });
    } catch {
      // ignore
    }
  }

  return { ok: true };
}
