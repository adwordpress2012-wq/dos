import { handleInstantQuote } from "../_lib/micah-widget.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).setHeader("Allow", "POST").json({ error: "Method Not Allowed" });
    return;
  }
  try {
    await handleInstantQuote(req.body || {});
    res.status(200).json({ ok: true });
  } catch {
    res.status(500).json({ ok: false });
  }
}
