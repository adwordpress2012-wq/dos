import {
  fallbackChatReply,
  getBusinessByCalledNumber,
  getMicahOpenAIReply,
} from "../_lib/micah.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).json({
      ok: true,
      message: "Micah chat endpoint is live. Send a POST with JSON { message, name?, to?/To? }.",
      example: {
        message: "G'day Micah — can you help?",
        name: "Jayson",
        to: "+61200000000",
      },
    });
    return;
  }

  if (req.method !== "POST") {
    res.status(405).setHeader("Allow", "GET, POST").json({ error: "Method Not Allowed" });
    return;
  }

  const body = req.body || {};
  const message = String(body.message || body.text || "").trim();
  const callerName = String(body.name || "").trim();
  const toNumber = body.to || body.To || "";
  const business = getBusinessByCalledNumber(toNumber);

  let reply = fallbackChatReply(business.name);
  try {
    const ai = await getMicahOpenAIReply({
      businessName: business.name,
      callerInput: message,
      callerName,
      channel: "chat",
    });
    if (ai) reply = ai;
  } catch (_) {
    // Fallback by design.
  }

  res.status(200).json({
    ok: true,
    businessName: business.name,
    leadEmail: business.leadEmail,
    reply,
    fallback: reply === fallbackChatReply(business.name),
  });
}
