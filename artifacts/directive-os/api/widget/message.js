import { handleWidgetMessage } from "../_lib/micah-widget.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).json({
      ok: true,
      message: "POST JSON { client_id?, message, messages? } for Micah widget.",
    });
    return;
  }
  if (req.method !== "POST") {
    res.status(405).setHeader("Allow", "GET, POST").json({ error: "Method Not Allowed" });
    return;
  }
  try {
    const out = await handleWidgetMessage(req.body || {});
    res.status(200).json({ reply: out.reply });
  } catch {
    res.status(500).json({ reply: "Sorry — something went wrong. Please try again shortly." });
  }
}
