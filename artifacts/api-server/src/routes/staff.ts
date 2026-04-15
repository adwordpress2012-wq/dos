import { Router, type Request, type Response, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, agenciesTable, staffTable } from "@workspace/db";
import { InviteStaffBody, RemoveStaffParams } from "@workspace/api-zod";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import Stripe from "stripe";
import { logger } from "../lib/logger";
import { resolveAgency } from "../lib/resolveAgency";

const router: IRouter = Router();

const ADMIN_EMAILS = ["jayson@directiveos.com.au", "adwordpress2012@gmail.com"];
const RESEND_FROM = "Directive OS <leads@directiveos.com.au>";
const BASE_URL = "https://directiveos.com.au";

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_KEY_ACTIVE;
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2025-03-31.basil" });
}

async function sendInviteEmail(opts: {
  toEmail: string; toName: string; agencyName: string; setPasswordUrl: string;
}): Promise<void> {
  const apiKey = process.env.DOS_RESEND_KEY || process.env.RESEND_API_KEY;
  if (!apiKey) { logger.warn("Resend key not set — invite email not sent"); return; }
  const html = `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;background:#0a0e1a;color:#f0f0f0;padding:40px;border-radius:12px;">
  <div style="color:#00d1b2;font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px;">DIRECTIVE OS</div>
  <h2 style="color:#fff;margin:0 0 20px;font-size:22px;">You've been invited to the Command Centre</h2>
  <p style="color:#a0aec0;margin-bottom:24px;">Hi ${opts.toName}, you've been added as an agent for <strong style="color:#fff">${opts.agencyName}</strong> on Directive OS. Click below to set your password and activate your account.</p>
  <div style="background:#131929;border:1px solid #1e2d45;border-radius:8px;padding:20px;margin-bottom:24px;">
    <div style="margin-bottom:12px;">
      <span style="color:#a0aec0;font-size:13px;">Your Login Email</span><br/>
      <span style="color:#fff;font-weight:700;font-size:15px;">${opts.toEmail}</span>
    </div>
    <div>
      <span style="color:#a0aec0;font-size:13px;">Agency</span><br/>
      <span style="color:#00d1b2;font-weight:700;font-size:15px;">${opts.agencyName}</span>
    </div>
  </div>
  <a href="${opts.setPasswordUrl}" style="display:inline-block;background:#00d1b2;color:#0a0e1a;text-decoration:none;font-weight:700;font-size:15px;padding:14px 32px;border-radius:8px;margin-bottom:24px;">
    Set My Password &amp; Activate →
  </a>
  <p style="color:#4a5568;font-size:13px;margin-top:8px;">⏳ This link expires in <strong>48 hours</strong>. If you didn't expect this, you can safely ignore it.</p>
  <p style="color:#4a5568;font-size:13px;margin-top:24px;border-top:1px solid #1e2d45;padding-top:16px;">
    Need help? Contact us at support@directiveos.com.au<br/>
    Directive OS · ABN 87 754 544 171 · directiveos.com.au
  </p>
</div>`;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: [opts.toEmail],
        cc: ADMIN_EMAILS,
        subject: `You've been invited to ${opts.agencyName} — Directive OS`,
        html,
      }),
    });
  } catch (err) { logger.warn({ err }, "Invite email failed"); }
}

async function getAgencyFull(clerkOrgId: string) {
  const [agency] = await db.select().from(agenciesTable).where(eq(agenciesTable.clerkOrgId, clerkOrgId));
  return agency ?? null;
}

async function getAgencyId(clerkOrgId: string): Promise<number | null> {
  const agency = await getAgencyFull(clerkOrgId);
  return agency?.id ?? null;
}

async function adjustStripeSeats(agency: typeof agenciesTable.$inferSelect, delta: number): Promise<void> {
  if (!agency.stripeCustomerId) return;
  const stripe = getStripe();
  if (!stripe) return;
  const pricePerSeat = process.env.STRIPE_PRICE_PER_SEAT;
  if (!pricePerSeat) return;

  try {
    const subs = await stripe.subscriptions.list({ customer: agency.stripeCustomerId, status: "active", limit: 1 });
    const sub = subs.data[0];
    if (!sub) return;

    const seatItem = sub.items.data.find(item => item.price.id === pricePerSeat);
    const currentQty = seatItem?.quantity ?? 0;
    const newQty = Math.max(0, currentQty + delta);

    if (seatItem) {
      if (newQty === 0) {
        await stripe.subscriptionItems.del(seatItem.id, { proration_behavior: "create_prorations" });
      } else {
        await stripe.subscriptionItems.update(seatItem.id, { quantity: newQty, proration_behavior: "create_prorations" });
      }
    } else if (delta > 0 && newQty > 0) {
      await stripe.subscriptionItems.create({ subscription: sub.id, price: pricePerSeat, quantity: newQty, proration_behavior: "create_prorations" });
    }
    logger.info({ agencyId: agency.id, delta, newQty }, "Stripe seats adjusted");
  } catch (err) {
    logger.warn({ err }, "Stripe seat adjustment failed — non-fatal");
  }
}

// ─── GET /staff ────────────────────────────────────────────────────────────────
router.get("/staff", async (req: Request, res: Response): Promise<void> => {
  const agency = await resolveAgency(req);
  if (!agency) { res.status(404).json({ error: "Agency not found" }); return; }
  const staff = await db.select({
    id: staffTable.id, name: staffTable.name, email: staffTable.email,
    role: staffTable.role, status: staffTable.status, createdAt: staffTable.createdAt,
  }).from(staffTable).where(eq(staffTable.agencyId, agency.id));
  res.json(staff);
});

// ─── POST /staff — invite agent ────────────────────────────────────────────────
router.post("/staff", async (req: Request, res: Response): Promise<void> => {
  const agency = await resolveAgency(req);
  if (!agency) { res.status(404).json({ error: "Agency not found" }); return; }

  const parsed = InviteStaffBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const token = crypto.randomBytes(32).toString("hex");
  const tokenExpiry = new Date(Date.now() + 48 * 60 * 60 * 1000);

  const [member] = await db.insert(staffTable).values({
    agencyId: agency.id,
    clerkUserId: `invited_${Date.now()}`,
    name: parsed.data.name,
    email: parsed.data.email.toLowerCase().trim(),
    role: parsed.data.role,
    status: "invited",
    passwordSetToken: token,
    tokenExpiry,
  }).returning();

  await db.update(agenciesTable).set({ seatCount: (agency.seatCount ?? 1) + 1 }).where(eq(agenciesTable.id, agency.id));
  void adjustStripeSeats(agency, 1);

  const setPasswordUrl = `${BASE_URL}/dashboard/set-password?token=${token}`;
  void sendInviteEmail({ toEmail: member.email, toName: member.name, agencyName: agency.name, setPasswordUrl });

  res.status(201).json({ ...member, passwordHash: undefined, passwordSetToken: undefined });
});

// ─── DELETE /staff/:id — remove agent ─────────────────────────────────────────
router.delete("/staff/:id", async (req: Request, res: Response): Promise<void> => {
  const agency = await resolveAgency(req);
  if (!agency) { res.status(404).json({ error: "Agency not found" }); return; }
  const params = RemoveStaffParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }

  await db.delete(staffTable).where(and(eq(staffTable.id, params.data.id), eq(staffTable.agencyId, agency.id)));
  const newSeatCount = Math.max(1, (agency.seatCount ?? 1) - 1);
  await db.update(agenciesTable).set({ seatCount: newSeatCount }).where(eq(agenciesTable.id, agency.id));
  void adjustStripeSeats(agency, -1);

  res.sendStatus(204);
});

// ─── POST /staff/verify-token — validate set-password token ───────────────────
router.post("/staff/verify-token", async (req: Request, res: Response): Promise<void> => {
  const { token } = req.body as { token?: string };
  if (!token) { res.status(400).json({ ok: false, error: "Token required" }); return; }

  const [staff] = await db.select({
    id: staffTable.id, name: staffTable.name, email: staffTable.email,
    tokenExpiry: staffTable.tokenExpiry, agencyId: staffTable.agencyId,
    passwordSetToken: staffTable.passwordSetToken,
  }).from(staffTable).where(eq(staffTable.passwordSetToken, token));

  if (!staff || !staff.tokenExpiry || new Date(staff.tokenExpiry) < new Date()) {
    res.json({ ok: false, error: "Invalid or expired token" }); return;
  }

  const [agency] = await db.select({ name: agenciesTable.name }).from(agenciesTable).where(eq(agenciesTable.id, staff.agencyId));
  res.json({ ok: true, name: staff.name, email: staff.email, agencyName: agency?.name ?? "" });
});

// ─── POST /staff/activate — set password and activate account ─────────────────
router.post("/staff/activate", async (req: Request, res: Response): Promise<void> => {
  const { token, password } = req.body as { token?: string; password?: string };
  if (!token || !password || password.length < 8) {
    res.status(400).json({ ok: false, error: "Token and password (min 8 chars) required" }); return;
  }

  const [staff] = await db.select().from(staffTable).where(eq(staffTable.passwordSetToken, token));
  if (!staff || !staff.tokenExpiry || new Date(staff.tokenExpiry) < new Date()) {
    res.status(401).json({ ok: false, error: "Invalid or expired token" }); return;
  }

  const hash = await bcrypt.hash(password, 10);
  await db.update(staffTable).set({
    passwordHash: hash,
    passwordSetToken: null,
    tokenExpiry: null,
    status: "active",
  }).where(eq(staffTable.id, staff.id));

  res.json({ ok: true });
});

export default router;
