import { logger } from "./logger";

const OWNER_EMAILS = ["adwordpress2012@gmail.com", "jayson@directiveos.com.au"];
const FROM = "Directive OS | New Lead Captured <leads@directiveos.com.au>";

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

function detectContact(text: string): { email: string | null; phone: string | null; name: string | null } {
  const lower = text.toLowerCase();
  const email = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] ?? null;
  const phone = text.match(/(\+?61|0)[0-9 ]{8,12}/)?.[0] ?? null;
  const nameMatch = lower.match(/(?:my name is|i(?:'m| am)|this is) ([a-z]+(?: [a-z]+)?)/i);
  const name = nameMatch ? nameMatch[1].replace(/\b\w/g, c => c.toUpperCase()) : null;
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
}): Promise<void> {
  const fullText = opts.messages.map(m => m.content).join(" ");
  const { email, phone, name } = detectContact(fullText);
  const intel = detectLeadIntelligence(fullText);

  const callerLabel = name ?? email ?? phone ?? "Unknown Caller";
  const subjectPrefix = intel.hasPropertyToSell ? "[POTENTIAL LISTING] " : "";
  const subject = `${subjectPrefix}New Lead: ${callerLabel} · ${opts.agencyName}`;

  const to = [...new Set([opts.agencyEmail, ...OWNER_EMAILS])];

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
  });

  await sendViaResend(to, subject, html);
}

export { OWNER_EMAILS, detectContact };
