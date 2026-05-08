import {
  extractEmail,
  extractName,
  extractPhone,
  fallbackChatReply,
  getMicahOpenAIReply,
  inferLeadType,
  trySaveChatLeadAndNotify,
} from "../_lib/micah.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).setHeader("Allow", "POST").json({ error: "Method Not Allowed" });
    return;
  }

  const body = req.body || {};
  const sessionId = String(body.sessionId || body.session_id || "");
  const message = String(body.message || body.text || "").trim();
  const agencyName = String(body.agencyName || body.agency || "Directive OS").trim();

  if (!message) {
    res.status(400).json({ error: "Missing message" });
    return;
  }

  const callerName = extractName(message);
  const lead = {
    name: callerName || null,
    email: extractEmail(message),
    phone: extractPhone(message),
    leadType: inferLeadType(message),
  };

  let reply = fallbackChatReply(agencyName);
  try {
    const ai = await getMicahOpenAIReply({
      businessName: agencyName,
      callerInput: message,
      callerName: callerName || "",
      channel: "chat",
    });
    if (ai) reply = ai;
  } catch {
    // Fallback by design.
  }

  // Best-effort persistence + email (only works when DATABASE_URL + resend keys exist).
  await trySaveChatLeadAndNotify({
    agencyName,
    message,
    lead,
    sessionId,
  });

  res.status(200).json({
    ok: true,
    sessionId,
    message: reply,
    reply,
    businessName: agencyName,
    leadEmail: lead.email,
  });
}

