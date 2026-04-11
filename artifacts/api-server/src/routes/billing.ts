import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, agenciesTable } from "@workspace/db";
import Stripe from "stripe";

const router: IRouter = Router();

function getStripe(): Stripe {
  const key = process.env.STRIPE_KEY_ACTIVE;
  if (!key) throw new Error("STRIPE_KEY_ACTIVE is not set.");
  return new Stripe(key, { apiVersion: "2025-03-31.basil" });
}

const YOUR_DOMAIN = "https://directiveos.com.au";

async function getAgency(clerkOrgId: string) {
  const [agency] = await db.select().from(agenciesTable).where(eq(agenciesTable.clerkOrgId, clerkOrgId));
  return agency ?? null;
}

router.get("/billing/subscription", async (req, res): Promise<void> => {
  const clerkOrgId = req.headers["x-clerk-org-id"] as string | undefined;
  if (!clerkOrgId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const agency = await getAgency(clerkOrgId);
  if (!agency) { res.status(404).json({ error: "Agency not found" }); return; }
  const seatCount = agency.seatCount;
  const baseFee = 299;
  const perSeatFee = 89;
  const additionalSeats = Math.max(0, seatCount - 1);
  const totalMonthly = baseFee + additionalSeats * perSeatFee;
  res.json({
    status: agency.subscriptionStatus,
    planName: "Directive OS License",
    seatCount,
    baseFeeAud: baseFee,
    perSeatFeeAud: perSeatFee,
    totalMonthlyAud: totalMonthly,
    nextBillingDate: null,
    setupFeePaid: agency.setupFeePaid,
  });
});

router.get("/billing/usage", async (req, res): Promise<void> => {
  const clerkOrgId = req.headers["x-clerk-org-id"] as string | undefined;
  if (!clerkOrgId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const agency = await getAgency(clerkOrgId);
  if (!agency) { res.status(404).json({ error: "Agency not found" }); return; }
  const minutesUsed = agency.aiMinutesUsed;
  const minutesIncluded = agency.aiMinutesIncluded;
  const overageMinutes = Math.max(0, minutesUsed - minutesIncluded);
  const overageBlocks = Math.ceil(overageMinutes / 10);
  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  res.json({
    minutesUsed,
    minutesIncluded,
    overageBlocks,
    overageCostAud: overageBlocks * 25,
    periodStart: periodStart.toISOString(),
    periodEnd: periodEnd.toISOString(),
  });
});

router.post("/billing/checkout", async (req, res): Promise<void> => {
  const clerkOrgId = req.headers["x-clerk-org-id"] as string | undefined;
  if (!clerkOrgId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const priceOnboarding = process.env.ONBOARDING_PRICE_ID ?? process.env.STRIPE_PRICE_ONBOARDING;
  const priceSubscription = process.env.SUBSCRIPTION_PRICE_ID ?? process.env.STRIPE_PRICE_SUBSCRIPTION;
  const pricePerSeat = process.env.STRIPE_PRICE_PER_SEAT;
  const priceExcessUsage = process.env.STRIPE_PRICE_EXCESS_USAGE;

  if (!priceOnboarding || !priceSubscription) {
    res.status(500).json({ error: "Stripe price IDs are not configured. Please set STRIPE_PRICE_ONBOARDING and STRIPE_PRICE_SUBSCRIPTION." });
    return;
  }

  let stripe: Stripe;
  try {
    stripe = getStripe();
  } catch {
    res.status(500).json({ error: "Stripe is not configured. Please set STRIPE_SECRET_KEY." });
    return;
  }

  const agency = await getAgency(clerkOrgId);
  const additionalSeats = Math.max(0, (agency?.seatCount ?? 1) - 1);

  // In subscription mode, Stripe allows one-time and recurring prices together.
  // The one-time setup fee is charged on the first invoice only.
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    { price: priceOnboarding, quantity: 1 },     // $1,500 one-time onboarding & training
    { price: priceSubscription, quantity: 1 },   // $299/mo base subscription
  ];

  if (additionalSeats > 0 && pricePerSeat) {
    lineItems.push({ price: pricePerSeat, quantity: additionalSeats });
  }

  // Metered excess usage (no quantity — Stripe tracks via meter events)
  if (priceExcessUsage) {
    lineItems.push({ price: priceExcessUsage });
  }

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: "subscription",
    automatic_tax: { enabled: true },
    line_items: lineItems,
    success_url: `${YOUR_DOMAIN}/dashboard/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${YOUR_DOMAIN}/dashboard/billing`,
  };

  if (agency?.stripeCustomerId) {
    sessionParams.customer = agency.stripeCustomerId;
  } else if (agency?.contactEmail) {
    sessionParams.customer_email = agency.contactEmail;
  }

  try {
    const session = await stripe.checkout.sessions.create(sessionParams);
    res.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: `Failed to create checkout session: ${message}` });
  }
});

router.post("/billing/portal", async (req, res): Promise<void> => {
  const clerkOrgId = req.headers["x-clerk-org-id"] as string | undefined;
  if (!clerkOrgId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const agency = await getAgency(clerkOrgId);
  if (!agency?.stripeCustomerId) {
    res.status(400).json({ error: "No Stripe customer found for this agency." });
    return;
  }

  let stripe: Stripe;
  try {
    stripe = getStripe();
  } catch {
    res.status(500).json({ error: "Stripe is not configured." });
    return;
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: agency.stripeCustomerId,
      return_url: `${YOUR_DOMAIN}/dashboard/billing`,
    });
    res.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: `Failed to create portal session: ${message}` });
  }
});

router.get("/billing/success", async (req, res): Promise<void> => {
  const sessionId = req.query.session_id as string | undefined;
  const redirectUrl = `${YOUR_DOMAIN}/dashboard/billing/success${sessionId ? `?session_id=${sessionId}` : ""}`;
  res.redirect(302, redirectUrl);
});

router.get("/billing/invoices", async (req, res): Promise<void> => {
  const clerkOrgId = req.headers["x-clerk-org-id"] as string | undefined;
  if (!clerkOrgId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const now = new Date();
  const invoices = [
    {
      id: "inv_001",
      number: "DOS-2025-001",
      amountAud: 1500,
      status: "paid",
      description: "Onboarding & Training Fee",
      pdfUrl: null,
      createdAt: new Date(now.getFullYear(), now.getMonth() - 2, 1).toISOString(),
    },
    {
      id: "inv_002",
      number: "DOS-2025-002",
      amountAud: 299,
      status: "paid",
      description: "Directive OS License — Monthly Subscription",
      pdfUrl: null,
      createdAt: new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString(),
    },
    {
      id: "inv_003",
      number: "DOS-2025-003",
      amountAud: 388,
      status: "paid",
      description: "Directive OS License — Monthly Subscription (2 seats + $25 overage)",
      pdfUrl: null,
      createdAt: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
    },
  ];
  res.json(invoices);
});

export default router;
