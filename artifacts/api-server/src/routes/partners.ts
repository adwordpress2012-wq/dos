import { Router, type IRouter } from "express";
import { sendPartnerRegistrationEmail } from "../lib/email";
import { logger } from "../lib/logger";

const router: IRouter = Router();

router.post("/partners/register", async (req, res) => {
  const { name, email, phone, biz, note } = req.body ?? {};
  if (!name || !email || !phone || !biz) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  try {
    await sendPartnerRegistrationEmail({ name, email, phone, biz, note });
    logger.info({ name, email }, "Partner registration received");
    res.json({ ok: true });
  } catch (err) {
    logger.warn({ err }, "Failed to send partner registration email");
    res.status(500).json({ error: "Failed to send" });
  }
});

export default router;
