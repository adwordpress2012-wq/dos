import { logger } from "./logger";
import { generateListingServicesPDF } from "./listing-pdf";

const OWNER_EMAILS = ["adwordpress2012@gmail.com", "jayson@directiveos.com.au"];
const FROM = "Directive OS | New Lead Captured <leads@directiveos.com.au>";

// ─── AI English Summary ───────────────────────────────────────────────────────

interface ConversationSummary {
  language: string;
  callerName: string | null;
  intent: string;
  keyDetails: string[];
  contactsCaptured: string[];
  outcome: string;
  nextAction: string;
  isEnglish: boolean;
}

async function generateEnglishSummary(
  messages: TranscriptMessage[],
  channel: "voice" | "chat",
  durationSeconds?: number
): Promise<ConversationSummary | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || messages.length === 0) return null;

  const transcriptText = messages
    .map(m => `${m.role === "user" ? "Caller/Visitor" : "Sarah (AI)"}: ${m.content}`)
    .join("\n");

  const systemPrompt = `You are an assistant that analyses real estate AI receptionist conversations and produces a structured English summary for the agency. Always respond in English regardless of the conversation language.

Return ONLY a valid JSON object with this exact shape:
{
  "language": "the primary language detected (e.g. English, Arabic, Mandarin, Vietnamese, etc.)",
  "callerName": "full name if captured, otherwise null",
  "intent": "one of: buyer | tenant | vendor | landlord | general_enquiry | sales_enquiry",
  "keyDetails": ["array of 3-6 bullet point strings summarising what was discussed — always in English"],
  "contactsCaptured": ["list what was captured e.g. 'Name: Ahmed Hassan', 'Phone: 0412 345 678', 'Email: ahmed@email.com' — empty array if none"],
  "outcome": "one sentence in English describing the outcome of the conversation",
  "nextAction": "one sentence in English describing the recommended next action for the agency",
  "isEnglish": true/false (true if the conversation was in English)
}`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Channel: ${channel}${durationSeconds ? ` | Duration: ${Math.floor(durationSeconds / 60)}m ${durationSeconds % 60}s` : ""}\n\nTranscript:\n${transcriptText}` },
        ],
        temperature: 0.2,
        max_tokens: 600,
      }),
    });

    if (!res.ok) {
      logger.warn({ status: res.status }, "OpenAI summary call failed");
      return null;
    }

    const data = await res.json() as { choices: Array<{ message: { content: string } }> };
    const raw = data.choices?.[0]?.message?.content ?? "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    return JSON.parse(jsonMatch[0]) as ConversationSummary;
  } catch (err) {
    logger.warn({ err }, "Failed to generate English summary");
    return null;
  }
}

function buildSummaryBlock(summary: ConversationSummary): string {
  const intentMap: Record<string, string> = {
    buyer: "🏠 Buyer",
    tenant: "🔑 Tenant",
    vendor: "🏷️ Vendor / Potential Listing",
    landlord: "🏢 Landlord",
    general_enquiry: "💬 General Enquiry",
    sales_enquiry: "📣 Sales / Partnership Enquiry",
  };
  const intentLabel = intentMap[summary.intent] ?? summary.intent;
  const langFlag = summary.isEnglish ? "" : ` 🌐 (translated from ${summary.language})`;

  const keyDetailRows = summary.keyDetails.map(d =>
    `<li style="margin-bottom:5px;font-size:14px;color:#1f2937;">${d}</li>`
  ).join("");

  const contactRows = summary.contactsCaptured.length > 0
    ? summary.contactsCaptured.map(c =>
        `<span style="display:inline-block;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:3px 10px;font-size:13px;font-weight:600;color:#15803d;margin:2px;">${c}</span>`
      ).join("")
    : `<span style="color:#9ca3af;font-size:13px;">No contact details captured</span>`;

  return `
  <!-- English Summary Block -->
  <div style="padding:20px 28px;border-bottom:1px solid #e5e7eb;background:#f0fdf4;">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
      <div style="background:#16a34a;border-radius:6px;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;">📋</div>
      <div>
        <div style="font-size:13px;font-weight:700;color:#15803d;text-transform:uppercase;letter-spacing:0.5px;">Conversation Summary — English${langFlag}</div>
        <div style="font-size:11px;color:#6b7280;margin-top:1px;">AI-generated · ${summary.language} conversation</div>
      </div>
    </div>

    <table style="width:100%;font-size:13px;border-collapse:collapse;margin-bottom:14px;">
      <tr>
        <td style="padding:6px 0;color:#6b7280;font-weight:600;width:130px;vertical-align:top;">Caller Name</td>
        <td style="padding:6px 0;font-weight:700;color:#111;">${summary.callerName ?? "—"}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;color:#6b7280;font-weight:600;vertical-align:top;">Intent</td>
        <td style="padding:6px 0;font-weight:700;color:#111;">${intentLabel}</td>
      </tr>
    </table>

    <div style="margin-bottom:12px;">
      <div style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Key Points</div>
      <ul style="margin:0;padding-left:18px;">${keyDetailRows}</ul>
    </div>

    <div style="margin-bottom:12px;">
      <div style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Contacts Captured</div>
      <div>${contactRows}</div>
    </div>

    <div style="background:#fff;border:1px solid #bbf7d0;border-radius:8px;padding:12px 14px;margin-bottom:10px;">
      <div style="font-size:11px;font-weight:700;color:#15803d;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">Outcome</div>
      <div style="font-size:14px;color:#1f2937;">${summary.outcome}</div>
    </div>

    <div style="background:#fef9c3;border:1px solid #fde047;border-radius:8px;padding:12px 14px;">
      <div style="font-size:11px;font-weight:700;color:#854d0e;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">⚡ Next Action for Your Team</div>
      <div style="font-size:14px;color:#1f2937;font-weight:600;">${summary.nextAction}</div>
    </div>
  </div>`;
}

interface TranscriptMessage {
  role: "user" | "assistant";
  content: string;
}

export interface LeadIntelligence {
  intent: "live_in" | "investment" | "unknown";
  hasPropertyToSell: boolean;
  financeApproved: "yes" | "no" | "working_on_it" | "unknown";
}

export function detectLeadIntelligence(text: string): LeadIntelligence {
  const t = text.toLowerCase();

  const hasPropertyToSell =
    /(?:yes|yeah|yep|i do|we do|got one|need to sell|selling|have a property|property to sell|sell\s+(?:my|our|a)\s+(?:house|property|place|home))/i.test(t) &&
    /(?:sell|property|house|place|home)/i.test(t);

  const investmentKeywords = /\binvestment\b|\binvest\b|\brental\s+yield\b|\bincome\b|\bip\b|\bportfolio\b/i.test(t);
  const liveInKeywords = /\blive\s+in\b|\blive\s+there\b|\bmove\s+in\b|\bown\s+home\b|\bppor\b|\bprincipal\s+place\b|\bfamily\s+home\b|\bhome\s+to\s+live\b/i.test(t);
  const intent: LeadIntelligence["intent"] = investmentKeywords
    ? "investment"
    : liveInKeywords
    ? "live_in"
    : "unknown";

  const financeYes = /(?:finance\s+is\s+(?:approved|done|sorted|ready|in\s+place)|pre.?approv|yes[,.]?\s*(?:my\s+)?finance|finance[,.]?\s*yes)/i.test(t);
  const financeNo = /(?:finance\s+(?:not|isn.t|haven.t|no)\b|haven.t\s+(?:started|sorted|done)\s+(?:my\s+)?finance|no[,.]?\s*(?:my\s+)?finance\s+(?:is\s+)?not)/i.test(t);
  const financeWorking = /(?:working\s+on|in\s+progress|still\s+(?:working|sorting|figuring)|looking\s+into\s+finance|getting\s+finance)/i.test(t);
  const financeApproved: LeadIntelligence["financeApproved"] = financeYes
    ? "yes"
    : financeNo
    ? "no"
    : financeWorking
    ? "working_on_it"
    : "unknown";

  return { intent, hasPropertyToSell, financeApproved };
}

function parseSpokenEmail(text: string): string | null {
  const std = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (std) return std[0];
  const spoken = text.match(/\b([a-zA-Z0-9][a-zA-Z0-9._-]*(?:\s[a-zA-Z0-9])?)\s+at\s+([a-zA-Z0-9-]+)\s+dot\s+([a-zA-Z]{2,})\b/i);
  if (spoken) return `${spoken[1].replace(/\s+/g, "")}@${spoken[2]}.${spoken[3]}`;
  return null;
}

const NAME_BLOCKLIST = /^(just|only|calling|inquiring|wondering|asking|checking|following|looking|not|also|actually|currently|really|probably|basically|honestly|here|great|good|fine|yes|no|sure|okay|alright|right|well|hey|hi|hello|morning|afternoon|evening|interested|happy|keen|after)$/i;

function parseCallerName(text: string): string | null {
  const patterns = [
    /(?:my name is|this is)\s+([a-z]+(?: [a-z]+)?)/gi,
    /(?:i(?:'m| am))\s+([a-z]+(?: [a-z]+)?)/gi,
  ];
  for (const rx of patterns) {
    for (const m of text.matchAll(rx)) {
      const words = m[1].trim().split(/\s+/);
      if (NAME_BLOCKLIST.test(words[0])) continue;
      return m[1].replace(/\b\w/g, c => c.toUpperCase());
    }
  }
  return null;
}

function detectContact(text: string): { email: string | null; phone: string | null; name: string | null } {
  const email = parseSpokenEmail(text);
  const phone = text.match(/(\+?61|0)[0-9 ]{8,12}/)?.[0] ?? null;
  const name = parseCallerName(text.toLowerCase());
  return { email, phone, name };
}

function buildTranscriptRows(messages: TranscriptMessage[]): string {
  return messages.map(m => `
    <tr>
      <td style="padding:8px 12px;vertical-align:top;width:90px;color:${m.role === "user" ? "#6366f1" : "#00d1b2"};font-weight:bold;white-space:nowrap;font-size:13px;">
        ${m.role === "user" ? "👤 Caller" : "🤖 Sarah"}
      </td>
      <td style="padding:8px 12px;font-size:14px;line-height:1.6;color:#222;background:${m.role === "user" ? "#f5f5ff" : "#f0fffc"};border-radius:6px;">
        ${m.content.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>")}
      </td>
    </tr>
    <tr><td colspan="2" style="height:4px;"></td></tr>`
  ).join("");
}

function intentLabel(intent: LeadIntelligence["intent"]): string {
  if (intent === "investment") return "🏦 Investment";
  if (intent === "live_in") return "🏡 Owner-Occupier";
  return "❓ Unknown";
}

function financeLabel(f: LeadIntelligence["financeApproved"]): string {
  if (f === "yes") return "✅ Approved";
  if (f === "no") return "❌ Not Approved";
  if (f === "working_on_it") return "⏳ In Progress";
  return "❓ Unknown";
}

function buildLeadIntelBlock(intel: LeadIntelligence): string {
  const potentialListingBanner = intel.hasPropertyToSell
    ? `<div style="background:#fef3c7;border:2px solid #f59e0b;border-radius:8px;padding:12px 16px;margin-bottom:20px;display:flex;align-items:center;gap:10px;">
        <span style="font-size:20px;">🏷️</span>
        <div>
          <div style="font-weight:700;color:#92400e;font-size:14px;">POTENTIAL LISTING OPPORTUNITY</div>
          <div style="color:#78350f;font-size:12px;margin-top:2px;">This caller has a property to sell — prioritise follow-up immediately.</div>
        </div>
      </div>`
    : "";

  return `
  ${potentialListingBanner}
  <div style="padding:20px 28px;border-bottom:1px solid #e5e7eb;">
    <div style="font-size:13px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">Lead Intelligence — Gold Questions</div>
    <table style="width:100%;font-size:14px;border-collapse:collapse;">
      <tr style="background:#f9fafb;">
        <td style="padding:8px 12px;color:#6b7280;font-weight:600;width:180px;border-radius:6px 0 0 6px;">Finance Status</td>
        <td style="padding:8px 12px;font-weight:700;color:#111;border-radius:0 6px 6px 0;">${financeLabel(intel.financeApproved)}</td>
      </tr>
      <tr>
        <td style="padding:8px 12px;color:#6b7280;font-weight:600;">Intent</td>
        <td style="padding:8px 12px;font-weight:700;color:#111;">${intentLabel(intel.intent)}</td>
      </tr>
      <tr style="background:#f9fafb;">
        <td style="padding:8px 12px;color:#6b7280;font-weight:600;border-radius:6px 0 0 6px;">Property to Sell</td>
        <td style="padding:8px 12px;font-weight:700;border-radius:0 6px 6px 0;" style="color:${intel.hasPropertyToSell ? "#dc2626" : "#111"};">
          ${intel.hasPropertyToSell ? "🔴 YES — Potential Listing" : "No"}
        </td>
      </tr>
    </table>
  </div>`;
}

function buildEmailHtml(opts: {
  agencyName: string;
  channel: "voice" | "chat";
  duration?: number;
  messageCount: number;
  callerName: string | null;
  callerEmail: string | null;
  callerPhone: string | null;
  leadType?: string;
  intel?: LeadIntelligence;
  messages: TranscriptMessage[];
  summary?: ConversationSummary | null;
}): string {
  const channelLabel = opts.channel === "voice" ? "📞 Voice Call" : "💬 Chat Enquiry";
  const durationLabel = opts.duration
    ? `${Math.floor(opts.duration / 60)}m ${opts.duration % 60}s`
    : null;

  return `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:660px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">

  <!-- Header -->
  <div style="background:#0a0e1a;padding:24px 28px;">
    <div style="display:flex;align-items:center;gap:12px;">
      <div style="background:#00d1b2;border-radius:8px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:18px;">🤖</div>
      <div>
        <div style="color:#00d1b2;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Directive OS | New Lead Captured</div>
        <div style="color:#fff;font-size:18px;font-weight:700;margin-top:2px;">${opts.agencyName}</div>
      </div>
    </div>
  </div>

  <!-- Summary bar -->
  <div style="background:#f9fafb;border-bottom:1px solid #e5e7eb;padding:16px 28px;display:flex;gap:24px;flex-wrap:wrap;">
    <div>
      <div style="font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">Channel</div>
      <div style="font-size:15px;font-weight:600;color:#111;">${channelLabel}</div>
    </div>
    ${durationLabel ? `<div>
      <div style="font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">Duration</div>
      <div style="font-size:15px;font-weight:600;color:#111;">${durationLabel}</div>
    </div>` : ""}
    <div>
      <div style="font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">Messages</div>
      <div style="font-size:15px;font-weight:600;color:#111;">${opts.messageCount}</div>
    </div>
    ${opts.leadType ? `<div>
      <div style="font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">Lead Type</div>
      <div style="font-size:15px;font-weight:600;color:#00d1b2;text-transform:capitalize;">${opts.leadType}</div>
    </div>` : ""}
  </div>

  ${opts.summary ? buildSummaryBlock(opts.summary) : ""}

  <!-- Contact details -->
  <div style="padding:20px 28px;border-bottom:1px solid #e5e7eb;">
    <div style="font-size:13px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">Contact Captured</div>
    <table style="width:100%;font-size:14px;border-collapse:collapse;">
      <tr>
        <td style="padding:5px 0;color:#6b7280;width:80px;">Name</td>
        <td style="padding:5px 0;font-weight:600;color:#111;">${opts.callerName ?? "—"}</td>
      </tr>
      <tr>
        <td style="padding:5px 0;color:#6b7280;">Email</td>
        <td style="padding:5px 0;font-weight:600;color:#111;">${opts.callerEmail ? `<a href="mailto:${opts.callerEmail}" style="color:#6366f1;text-decoration:none;">${opts.callerEmail}</a>` : "—"}</td>
      </tr>
      <tr>
        <td style="padding:5px 0;color:#6b7280;">Phone</td>
        <td style="padding:5px 0;font-weight:600;color:#111;">${opts.callerPhone ? `<a href="tel:${opts.callerPhone}" style="color:#6366f1;text-decoration:none;">${opts.callerPhone}</a>` : "—"}</td>
      </tr>
    </table>
  </div>

  <!-- Lead Intelligence (Gold Questions) -->
  ${opts.intel ? buildLeadIntelBlock(opts.intel) : ""}

  <!-- Transcript -->
  <div style="padding:20px 28px;">
    <div style="font-size:13px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:16px;border-bottom:2px solid #00d1b2;padding-bottom:8px;">Full Transcript</div>
    <table style="width:100%;border-collapse:separate;border-spacing:0 2px;">
      ${buildTranscriptRows(opts.messages)}
    </table>
  </div>

  <!-- Footer / Sarah Signature -->
  <div style="padding:20px 28px;background:#f9fafb;border-top:2px solid #e5e7eb;">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
      <div style="background:#0a0e1a;border-radius:50%;width:38px;height:38px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">🤖</div>
      <div>
        <div style="font-size:14px;font-weight:700;color:#111;">Sarah</div>
        <div style="font-size:12px;color:#6b7280;">AI Receptionist · ${opts.agencyName}</div>
      </div>
    </div>
    <div style="font-size:11px;color:#9ca3af;line-height:1.8;">
      <a href="mailto:leads@directiveos.com.au" style="color:#00d1b2;text-decoration:none;">leads@directiveos.com.au</a>
      &nbsp;·&nbsp;
      <a href="https://directiveos.com.au" style="color:#00d1b2;text-decoration:none;">directiveos.com.au</a>
    </div>
    <div style="margin-top:8px;font-size:10px;color:#d1d5db;">
      This message was sent automatically by your AI Receptionist. Sarah is available 24/7 to capture leads and answer enquiries on behalf of ${opts.agencyName}.
    </div>
  </div>
</div>`;
}

async function sendViaResend(to: string[], subject: string, html: string): Promise<void> {
  const apiKey = process.env.DOS_RESEND_CFG || process.env.DOS_RESEND_KEY || process.env.RESEND_API_KEY;
  if (!apiKey) {
    logger.warn("DOS_RESEND_KEY / RESEND_API_KEY not set — transcript email not sent");
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    });

    if (!res.ok) {
      const err = await res.text();
      logger.warn({ err, status: res.status }, "Resend API error");
    } else {
      logger.info({ to }, "Transcript email sent successfully");
    }
  } catch (err) {
    logger.warn({ err }, "Failed to send transcript email");
  }
}

export async function sendVoiceTranscriptEmail(opts: {
  agencyName: string;
  agencyEmail: string;
  duration: number;
  messages: TranscriptMessage[];
  leadType?: string;
  callbackNeeded?: boolean;
  callerName?: string | null;
  callerPhone?: string | null;
}): Promise<void> {
  const fullText = opts.messages.map(m => m.content).join(" ");
  const { email, phone, name } = detectContact(fullText);
  const intel = detectLeadIntelligence(fullText);

  const callerLabel = opts.callerName ?? name ?? email ?? phone ?? "Unknown Caller";
  const subjectPrefix = opts.callbackNeeded
    ? "⚠️ CALLBACK NEEDED — Price Enquiry: "
    : intel.hasPropertyToSell ? "[POTENTIAL LISTING] " : "";
  const subject = `${subjectPrefix}${callerLabel} · ${opts.agencyName}`;

  const to = [...new Set([opts.agencyEmail, ...OWNER_EMAILS])];

  const summary = await generateEnglishSummary(opts.messages, "voice", opts.duration);

  const html = buildEmailHtml({
    agencyName: opts.agencyName,
    channel: "voice",
    duration: opts.duration,
    messageCount: opts.messages.length,
    callerName: name,
    callerEmail: email,
    callerPhone: phone,
    leadType: opts.leadType,
    intel,
    messages: opts.messages,
    summary,
  });

  await sendViaResend(to, subject, html);
}

export async function sendChatTranscriptEmail(opts: {
  agencyName: string;
  agencyEmail: string | null;
  sessionId: string;
  messages: TranscriptMessage[];
  leadType?: string;
}): Promise<void> {
  const fullText = opts.messages.map(m => m.content).join(" ");
  const { email, phone, name } = detectContact(fullText);
  const intel = detectLeadIntelligence(fullText);

  const contactLabel = name ?? email ?? phone ?? "Website Visitor";
  const subjectPrefix = intel.hasPropertyToSell ? "[POTENTIAL LISTING] " : "";
  const subject = `${subjectPrefix}New Lead: ${contactLabel} · ${opts.agencyName}`;

  const to = opts.agencyEmail
    ? [...new Set([opts.agencyEmail, ...OWNER_EMAILS])]
    : OWNER_EMAILS;

  const summary = await generateEnglishSummary(opts.messages, "chat");

  const html = buildEmailHtml({
    agencyName: opts.agencyName,
    channel: "chat",
    messageCount: opts.messages.length,
    callerName: name,
    callerEmail: email,
    callerPhone: phone,
    leadType: opts.leadType,
    intel,
    messages: opts.messages,
    summary,
  });

  await sendViaResend(to, subject, html);
}

// ─── Tax Invoice Email ────────────────────────────────────────────────────────

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitAmountAud: number;
}

function formatAud(cents: number): string {
  return `A$${(cents / 100).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function buildInvoiceHtml(opts: {
  invoiceNumber: string;
  invoiceDate: string;
  agencyName: string;
  agencyEmail: string;
  agencyAbn?: string;
  lineItems: InvoiceLineItem[];
  notes?: string;
}): string {
  const subtotalCents = opts.lineItems.reduce((sum, i) => sum + i.quantity * i.unitAmountAud * 100, 0);
  const gstCents = Math.round(subtotalCents / 11);
  const totalCents = subtotalCents;
  const exGstCents = subtotalCents - gstCents;

  const rows = opts.lineItems.map(item => {
    const total = item.quantity * item.unitAmountAud * 100;
    return `
      <tr>
        <td style="padding:14px 20px;font-size:14px;color:#111;border-bottom:1px solid #f3f4f6;">${item.description}</td>
        <td style="padding:14px 20px;font-size:14px;color:#111;border-bottom:1px solid #f3f4f6;text-align:center;">${item.quantity}</td>
        <td style="padding:14px 20px;font-size:14px;color:#111;border-bottom:1px solid #f3f4f6;text-align:right;">${formatAud(item.unitAmountAud * 100)}</td>
        <td style="padding:14px 20px;font-size:14px;font-weight:600;color:#111;border-bottom:1px solid #f3f4f6;text-align:right;">${formatAud(total)}</td>
      </tr>`;
  }).join("");

  return `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif;max-width:680px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;box-shadow:0 4px 24px rgba(0,0,0,0.07);">

  <!-- Header -->
  <div style="background:#0a0e1a;padding:32px 36px;display:flex;justify-content:space-between;align-items:flex-start;">
    <div>
      <img src="https://directiveos.com.au/logo.png" alt="Directive OS" style="height:40px;display:block;margin-bottom:6px;" />
      <div style="font-size:11px;color:#6b7280;letter-spacing:0.5px;margin-top:4px;">directiveos.com.au</div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:22px;font-weight:800;color:#00d1b2;letter-spacing:1px;text-transform:uppercase;">Tax Invoice</div>
      <div style="font-size:13px;color:#9ca3af;margin-top:6px;">Invoice #&nbsp;<span style="color:#ffffff;font-weight:600;">${opts.invoiceNumber}</span></div>
      <div style="font-size:13px;color:#9ca3af;margin-top:4px;">Date:&nbsp;<span style="color:#ffffff;">${opts.invoiceDate}</span></div>
    </div>
  </div>

  <!-- From / To -->
  <div style="display:flex;gap:0;border-bottom:2px solid #f3f4f6;">
    <div style="flex:1;padding:28px 36px;border-right:1px solid #f3f4f6;">
      <div style="font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:10px;">From</div>
      <div style="font-size:15px;font-weight:700;color:#111;margin-bottom:4px;">Directive OS Pty Ltd</div>
      <div style="font-size:13px;color:#6b7280;line-height:1.9;">
        ABN 87 754 544 171<br/>
        billing@directiveos.com.au<br/>
        directiveos.com.au
      </div>
    </div>
    <div style="flex:1;padding:28px 36px;">
      <div style="font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:10px;">Bill To</div>
      <div style="font-size:15px;font-weight:700;color:#111;margin-bottom:4px;">${opts.agencyName}</div>
      <div style="font-size:13px;color:#6b7280;line-height:1.9;">
        ${opts.agencyEmail}
        ${opts.agencyAbn ? `<br/>ABN ${opts.agencyAbn}` : ""}
      </div>
    </div>
  </div>

  <!-- Line Items -->
  <table style="width:100%;border-collapse:collapse;">
    <thead>
      <tr style="background:#f9fafb;">
        <th style="padding:12px 20px;font-size:11px;font-weight:700;color:#9ca3af;text-align:left;text-transform:uppercase;letter-spacing:0.6px;">Description</th>
        <th style="padding:12px 20px;font-size:11px;font-weight:700;color:#9ca3af;text-align:center;text-transform:uppercase;letter-spacing:0.6px;">Qty</th>
        <th style="padding:12px 20px;font-size:11px;font-weight:700;color:#9ca3af;text-align:right;text-transform:uppercase;letter-spacing:0.6px;">Unit Price</th>
        <th style="padding:12px 20px;font-size:11px;font-weight:700;color:#9ca3af;text-align:right;text-transform:uppercase;letter-spacing:0.6px;">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <!-- Totals -->
  <div style="padding:24px 36px;background:#f9fafb;border-top:2px solid #e5e7eb;">
    <table style="width:100%;max-width:300px;margin-left:auto;font-size:14px;border-collapse:collapse;">
      <tr>
        <td style="padding:6px 0;color:#6b7280;">Subtotal (excl. GST)</td>
        <td style="padding:6px 0;text-align:right;color:#111;">${formatAud(exGstCents)}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;color:#6b7280;">GST (10%)</td>
        <td style="padding:6px 0;text-align:right;color:#111;">${formatAud(gstCents)}</td>
      </tr>
      <tr style="border-top:2px solid #e5e7eb;">
        <td style="padding:14px 0 6px;font-size:16px;font-weight:800;color:#111;">Total (AUD)</td>
        <td style="padding:14px 0 6px;text-align:right;font-size:20px;font-weight:800;color:#00d1b2;">${formatAud(totalCents)}</td>
      </tr>
    </table>
  </div>

  ${opts.notes ? `
  <!-- Notes -->
  <div style="padding:20px 36px;border-top:1px solid #f3f4f6;">
    <div style="font-size:12px;color:#9ca3af;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:6px;">Notes</div>
    <div style="font-size:13px;color:#6b7280;line-height:1.7;">${opts.notes}</div>
  </div>` : ""}

  <!-- Footer -->
  <div style="padding:24px 36px;background:#0a0e1a;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
    <div style="font-size:12px;color:#6b7280;line-height:1.8;">
      <span style="color:#00d1b2;font-weight:700;">Directive OS Pty Ltd</span><br/>
      ABN 87 754 544 171 &nbsp;·&nbsp; GST Registered<br/>
      <a href="mailto:billing@directiveos.com.au" style="color:#6b7280;text-decoration:none;">billing@directiveos.com.au</a>
    </div>
    <div style="font-size:11px;color:#374151;text-align:right;">
      This is a tax invoice for<br/>GST purposes under Australian law.
    </div>
  </div>

</div>`;
}

export async function sendInvoiceEmail(opts: {
  agencyName: string;
  agencyEmail: string;
  agencyAbn?: string;
  invoiceNumber: string;
  lineItems: InvoiceLineItem[];
  notes?: string;
}): Promise<void> {
  const invoiceDate = new Date().toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" });

  const totalAud = opts.lineItems.reduce((sum, i) => sum + i.quantity * i.unitAmountAud, 0);

  const subject = `Tax Invoice ${opts.invoiceNumber} — A$${totalAud.toLocaleString("en-AU", { minimumFractionDigits: 2 })} — Directive OS`;

  const html = buildInvoiceHtml({
    invoiceNumber: opts.invoiceNumber,
    invoiceDate,
    agencyName: opts.agencyName,
    agencyEmail: opts.agencyEmail,
    agencyAbn: opts.agencyAbn,
    lineItems: opts.lineItems,
    notes: opts.notes,
  });

  const to = [...new Set([opts.agencyEmail, ...OWNER_EMAILS])];
  const from = "Directive OS Billing <billing@directiveos.com.au>";

  const apiKey = process.env.DOS_RESEND_CFG || process.env.DOS_RESEND_KEY || process.env.RESEND_API_KEY;
  if (!apiKey) {
    logger.warn("Resend key not set — invoice email not sent");
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject, html }),
    });
    if (!res.ok) {
      const err = await res.text();
      logger.warn({ err, status: res.status }, "Resend invoice email error");
    } else {
      logger.info({ to, invoiceNumber: opts.invoiceNumber }, "Invoice email sent");
    }
  } catch (err) {
    logger.warn({ err }, "Failed to send invoice email");
  }
}

// ─── Partner Registration Notification ────────────────────────────────────────

export async function sendPartnerRegistrationEmail(opts: {
  name: string;
  email: string;
  phone: string;
  biz: string;
  note?: string;
}): Promise<void> {
  const subject = `🤝 New Partner Registration — ${opts.name} · ${opts.biz}`;
  const html = `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
  <div style="background:#07090f;padding:24px 28px;">
    <div style="color:#00d1b2;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;">Directive OS · Referral Partner Program</div>
    <div style="color:#fff;font-size:20px;font-weight:800;">New Partner Registration</div>
  </div>
  <div style="padding:28px 28px;border-bottom:1px solid #f3f4f6;">
    <table style="width:100%;font-size:14px;border-collapse:collapse;">
      <tr><td style="padding:8px 0;color:#6b7280;width:120px;font-weight:600;">Name</td><td style="padding:8px 0;font-weight:700;color:#111;">${opts.name}</td></tr>
      <tr><td style="padding:8px 0;color:#6b7280;font-weight:600;">Email</td><td style="padding:8px 0;color:#111;"><a href="mailto:${opts.email}" style="color:#00d1b2;text-decoration:none;">${opts.email}</a></td></tr>
      <tr><td style="padding:8px 0;color:#6b7280;font-weight:600;">Phone</td><td style="padding:8px 0;color:#111;"><a href="tel:${opts.phone}" style="color:#00d1b2;text-decoration:none;">${opts.phone}</a></td></tr>
      <tr><td style="padding:8px 0;color:#6b7280;font-weight:600;">Business / Role</td><td style="padding:8px 0;color:#111;">${opts.biz}</td></tr>
      ${opts.note ? `<tr><td style="padding:8px 0;color:#6b7280;font-weight:600;vertical-align:top;">Note</td><td style="padding:8px 0;color:#555;font-style:italic;">${opts.note}</td></tr>` : ""}
    </table>
  </div>
  <div style="padding:20px 28px;background:#f9fafb;">
    <div style="font-size:13px;color:#6b7280;">Reply to this email or call them directly to confirm their partner status. Referral fee: <strong style="color:#111;">$500 per signed client</strong>, paid within 7 days.</div>
  </div>
</div>`;

  await sendViaResend(OWNER_EMAILS, subject, html);
}

// ─── New client payment notification (to Jayson) ──────────────────────────────

interface NewClientNotificationOpts {
  agencyName: string;
  agencySlug: string;
  contactName: string;
  email: string;
  phone: string;
  amountPaid: number;
  stripeSessionId: string;
}

export async function sendNewClientNotification(opts: NewClientNotificationOpts): Promise<void> {
  const apiKey = process.env.DOS_RESEND_CFG || process.env.DOS_RESEND_KEY || process.env.RESEND_API_KEY;
  if (!apiKey) { logger.warn("Resend key not set — new client notification not sent"); return; }

  const stripeLink = `https://dashboard.stripe.com/payments/${opts.stripeSessionId}`;
  const adminLink = `https://directiveos.com.au/admin`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>New Client Payment</title>
</head>
<body style="margin:0;padding:0;background:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#1e293b;border-radius:12px;overflow:hidden;max-width:600px;">

      <!-- Header -->
      <tr><td style="background:linear-gradient(135deg,#00d1b2,#0891b2);padding:32px 40px;text-align:center;">
        <p style="margin:0 0 8px;color:rgba(255,255,255,0.8);font-size:12px;letter-spacing:2px;text-transform:uppercase;">Directive OS</p>
        <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;">🎉 New Client Payment!</h1>
        <p style="margin:12px 0 0;color:rgba(255,255,255,0.9);font-size:16px;">Someone just paid — Sarah is needed!</p>
      </td></tr>

      <!-- Amount Banner -->
      <tr><td style="padding:24px 40px;background:#0f172a;text-align:center;border-bottom:1px solid #334155;">
        <p style="margin:0 0 4px;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Amount Paid</p>
        <p style="margin:0;color:#00d1b2;font-size:42px;font-weight:800;">A$${opts.amountPaid.toFixed(2)}</p>
        <p style="margin:4px 0 0;color:#64748b;font-size:12px;">Setup + Month 1 via Stripe</p>
      </td></tr>

      <!-- Client Details -->
      <tr><td style="padding:32px 40px;">
        <h2 style="margin:0 0 20px;color:#e2e8f0;font-size:16px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Client Details</h2>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${[
            ["Agency", opts.agencyName],
            ["Contact Name", opts.contactName || "—"],
            ["Email", opts.email],
            ["Phone", opts.phone || "—"],
            ["Slug", opts.agencySlug ? `directiveos.com.au/${opts.agencySlug}/` : "—"],
          ].map(([label, value], i) => `
          <tr style="background:${i % 2 === 0 ? "#0f172a" : "#1e293b"};">
            <td style="padding:12px 16px;color:#64748b;font-size:13px;font-weight:600;width:140px;border-radius:6px 0 0 6px;">${label}</td>
            <td style="padding:12px 16px;color:#e2e8f0;font-size:13px;border-radius:0 6px 6px 0;">${value}</td>
          </tr>`).join("")}
        </table>
      </td></tr>

      <!-- Action Checklist -->
      <tr><td style="padding:0 40px 24px;">
        <h2 style="margin:0 0 16px;color:#e2e8f0;font-size:16px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">⚡ Do These Now</h2>
        ${[
          "Create Clerk org + invite client as owner",
          "Buy dedicated Australian Twilio number",
          "Remove DEMO banner from landing page",
          "Swap PHONE to their dedicated Twilio number",
          "Redeploy — Sarah goes live!",
        ].map((step, i) => `
        <div style="display:flex;align-items:flex-start;margin-bottom:10px;padding:12px 16px;background:#0f172a;border-radius:8px;border-left:3px solid #00d1b2;">
          <span style="color:#00d1b2;font-weight:800;font-size:14px;margin-right:12px;min-width:20px;">${i + 1}.</span>
          <span style="color:#cbd5e1;font-size:13px;line-height:1.5;">${step}</span>
        </div>`).join("")}
      </td></tr>

      <!-- CTA Buttons -->
      <tr><td style="padding:8px 40px 32px;text-align:center;">
        <a href="${stripeLink}" style="display:inline-block;margin:8px;padding:14px 28px;background:#00d1b2;color:#0f172a;text-decoration:none;font-weight:700;font-size:14px;border-radius:8px;">View in Stripe →</a>
        <a href="${adminLink}" style="display:inline-block;margin:8px;padding:14px 28px;background:#1e40af;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;border-radius:8px;">Admin Dashboard →</a>
      </td></tr>

      <!-- Footer -->
      <tr><td style="padding:20px 40px;background:#0a0f1a;text-align:center;border-top:1px solid #1e293b;">
        <p style="margin:0;color:#475569;font-size:11px;">Directive OS — Internal Notification · directiveos.com.au · ABN 87 754 544 171</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Directive OS Payments <billing@directiveos.com.au>",
        to: OWNER_EMAILS,
        subject: `🎉 New Client Paid — ${opts.agencyName} · A$${opts.amountPaid.toFixed(2)}`,
        html,
      }),
    });
    if (!res.ok) {
      logger.warn({ status: res.status, err: await res.text() }, "Failed to send new client notification");
    } else {
      logger.info({ agencyName: opts.agencyName, email: opts.email }, "New client notification sent to Jayson");
    }
  } catch (err) {
    logger.warn({ err }, "Error sending new client notification");
  }
}

// ─── Welcome email (to new client after payment) ──────────────────────────────

interface ClientWelcomeEmailOpts {
  contactName: string;
  agencyName: string;
  email: string;
  agencySlug: string;
}

export async function sendClientWelcomeEmail(opts: ClientWelcomeEmailOpts): Promise<void> {
  const apiKey = process.env.DOS_RESEND_CFG || process.env.DOS_RESEND_KEY || process.env.RESEND_API_KEY;
  if (!apiKey) { logger.warn("Resend key not set — client welcome email not sent"); return; }

  const landingPageUrl = opts.agencySlug
    ? `https://directiveos.com.au/${opts.agencySlug}/`
    : "https://directiveos.com.au";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Welcome to Directive OS</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

      <!-- Header -->
      <tr><td style="background:linear-gradient(135deg,#0a0e1a,#0f2040);padding:36px 40px;text-align:center;">
        <p style="margin:0 0 6px;color:#00d1b2;font-size:12px;letter-spacing:3px;text-transform:uppercase;font-weight:600;">Directive OS</p>
        <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:800;">You're all set, ${opts.contactName}!</h1>
        <p style="margin:12px 0 0;color:rgba(255,255,255,0.75);font-size:15px;">Sarah is being set up for ${opts.agencyName} right now.</p>
      </td></tr>

      <!-- What Happens Next -->
      <tr><td style="padding:36px 40px;">
        <h2 style="margin:0 0 20px;color:#0a0e1a;font-size:16px;font-weight:700;">What happens next</h2>

        ${[
          ["Within 2 business days", "Your dedicated Australian phone number is provisioned and Sarah goes live on your line."],
          ["Your branded page goes live", `Your landing page at ${landingPageUrl} has the DEMO watermark removed and Sarah's number updated.`],
          ["Dashboard access", "You'll receive a login link to your Directive OS dashboard — track every lead, transcript, and booking from there."],
          ["You're covered 24/7", "From the moment Sarah is live, every call to your number is answered — even at midnight, weekends, and public holidays."],
        ].map(([title, body], i) => `
        <div style="display:flex;margin-bottom:20px;padding:16px;background:${i % 2 === 0 ? "#f8fafc" : "#ffffff"};border-radius:10px;border:1px solid #e2e8f0;">
          <div style="background:#00d1b2;color:#0a0e1a;font-weight:800;font-size:16px;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-right:16px;text-align:center;line-height:32px;">${i + 1}</div>
          <div>
            <p style="margin:0 0 4px;color:#0a0e1a;font-size:14px;font-weight:700;">${title}</p>
            <p style="margin:0;color:#64748b;font-size:13px;line-height:1.5;">${body}</p>
          </div>
        </div>`).join("")}
      </td></tr>

      <!-- Questions? -->
      <tr><td style="padding:0 40px 32px;">
        <div style="background:#0a0e1a;border-radius:10px;padding:24px;text-align:center;">
          <p style="margin:0 0 8px;color:#ffffff;font-size:15px;font-weight:700;">Questions? I'm here.</p>
          <p style="margin:0 0 16px;color:#94a3b8;font-size:13px;">Reach out directly — happy to chat anytime.</p>
          <a href="mailto:jayson@directiveos.com.au" style="display:inline-block;padding:12px 24px;background:#00d1b2;color:#0a0e1a;text-decoration:none;font-weight:700;font-size:13px;border-radius:8px;">jayson@directiveos.com.au</a>
        </div>
      </td></tr>

      <!-- Footer -->
      <tr><td style="padding:20px 40px;background:#f1f5f9;text-align:center;border-top:1px solid #e2e8f0;">
        <p style="margin:0 0 4px;color:#64748b;font-size:12px;">Directive OS — AI Receptionist Platform</p>
        <p style="margin:0;color:#94a3b8;font-size:11px;">directiveos.com.au · ABN 87 754 544 171 · jayson@directiveos.com.au</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;

  try {
    // Generate the listing services PDF to attach
    let attachments: { filename: string; content: string }[] = [];
    try {
      const pdfBuffer = await generateListingServicesPDF();
      attachments = [{
        filename: "Directive-OS-Listing-Services.pdf",
        content: pdfBuffer.toString("base64"),
      }];
    } catch (pdfErr) {
      logger.warn({ pdfErr }, "Could not generate listing services PDF — sending email without attachment");
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Jayson at Directive OS <jayson@directiveos.com.au>",
        to: [opts.email],
        bcc: OWNER_EMAILS,
        subject: `Welcome to Directive OS — Sarah is being set up for ${opts.agencyName}`,
        html,
        attachments,
      }),
    });
    if (!res.ok) {
      logger.warn({ status: res.status, err: await res.text() }, "Failed to send client welcome email");
    } else {
      logger.info({ to: opts.email, agencyName: opts.agencyName }, "Client welcome email sent with listing services PDF");
    }
  } catch (err) {
    logger.warn({ err }, "Error sending client welcome email");
  }
}

export { OWNER_EMAILS, detectContact };
