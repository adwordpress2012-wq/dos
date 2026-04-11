import { logger } from "./logger";

const OWNER_EMAILS = ["adwordpress2012@gmail.com", "jayson@directiveos.com.au"];
const FROM = "Sarah at Directive OS <onboarding@resend.dev>";

interface TranscriptMessage {
  role: "user" | "assistant";
  content: string;
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

function buildEmailHtml(opts: {
  agencyName: string;
  channel: "voice" | "chat";
  duration?: number;
  messageCount: number;
  callerName: string | null;
  callerEmail: string | null;
  callerPhone: string | null;
  leadType?: string;
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
        <div style="color:#00d1b2;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Sarah AI Receptionist</div>
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

  <!-- Transcript -->
  <div style="padding:20px 28px;">
    <div style="font-size:13px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:16px;border-bottom:2px solid #00d1b2;padding-bottom:8px;">Full Transcript</div>
    <table style="width:100%;border-collapse:separate;border-spacing:0 2px;">
      ${buildTranscriptRows(opts.messages)}
    </table>
  </div>

  <!-- Footer -->
  <div style="padding:16px 28px;background:#f9fafb;border-top:1px solid #e5e7eb;font-size:11px;color:#9ca3af;">
    Sent automatically by Sarah · Powered by Directive OS · <a href="https://directiveos.com.au" style="color:#00d1b2;text-decoration:none;">directiveos.com.au</a>
  </div>
</div>`;
}

async function sendViaResend(to: string[], subject: string, html: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    logger.warn("RESEND_API_KEY not set — transcript email not sent");
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

  const callerLabel = name ?? email ?? phone ?? "Unknown Caller";
  const subject = `📞 Call Transcript — ${callerLabel} · ${opts.agencyName}`;

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

  const contactLabel = name ?? email ?? phone ?? "Website Visitor";
  const subject = `💬 Chat Transcript — ${contactLabel} · ${opts.agencyName}`;

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
    messages: opts.messages,
  });

  await sendViaResend(to, subject, html);
}

export { OWNER_EMAILS, detectContact };
