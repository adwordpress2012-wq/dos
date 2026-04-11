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

// ─── Onboarding checkout ──────────────────────────────────────────────────────
// payment mode — both line items shown (itemised order).
// card → Apple Pay & Google Pay surface automatically on compatible browsers.
// klarna → pay in instalments.
// payment_intent_data.setup_future_usage saves the card so the subscription
// checkout (step 2) doesn't ask for card details again.

router.post("/billing/checkout/setup", async (req, res): Promise<void> => {
  const clerkOrgId = req.headers["x-clerk-org-id"] as string | undefined;
  if (!clerkOrgId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const priceOnboarding = process.env.ONBOARDING_PRICE_ID ?? process.env.STRIPE_PRICE_ONBOARDING;
  if (!priceOnboarding) {
    res.status(500).json({ error: "STRIPE_PRICE_ONBOARDING is not configured." });
    return;
  }

  let stripe: Stripe;
  try { stripe = getStripe(); } catch {
    res.status(500).json({ error: "Stripe is not configured." }); return;
  }

  const agency = await getAgency(clerkOrgId);
  const seatCount = agency?.seatCount ?? 1;
  const additionalSeats = Math.max(0, seatCount - 1);

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    // Line 1 — setup fee (uses the Stripe price record so name/description come from Stripe)
    { price: priceOnboarding, quantity: 1 },
    // Line 2 — first month licence shown inline
    {
      price_data: {
        currency: "aud",
        product_data: {
          name: "Directive OS Licence — Month 1",
          description: "Then A$299/month from month 2 onwards",
        },
        unit_amount: 29900,
      },
      quantity: 1,
    },
  ];

  if (additionalSeats > 0) {
    lineItems.push({
      price_data: {
        currency: "aud",
        product_data: {
          name: `Additional Seats — Month 1 (${additionalSeats} × A$89)`,
          description: "Then A$89/seat/month from month 2 onwards",
        },
        unit_amount: 8900,
      },
      quantity: additionalSeats,
    });
  }

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    payment_method_types: ["card", "klarna"],
    payment_intent_data: {
      // Saves card for subscription billing (card payments only — Klarna not reusable)
      setup_future_usage: "off_session",
      metadata: { clerkOrgId },
    },
    line_items: lineItems,
    success_url: `${YOUR_DOMAIN}/onboard/subscribe?orgId=${encodeURIComponent(clerkOrgId)}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${YOUR_DOMAIN}/onboard`,
  };

  if (agency?.stripeCustomerId) {
    // Existing customer — attach session to them (no customer_creation needed)
    sessionParams.customer = agency.stripeCustomerId;
  } else {
    // No existing customer — always create one so create-subscription can find it
    sessionParams.customer_creation = "always";
    if (agency?.contactEmail) {
      sessionParams.customer_email = agency.contactEmail;
    }
  }

  try {
    const session = await stripe.checkout.sessions.create(sessionParams);
    res.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: `Failed to create checkout: ${message}` });
  }
});

// ─── Create subscription programmatically after payment checkout completes ─────
// Called by the bridge page (/onboard/subscribe) with the Stripe session ID.
// Retrieves the completed payment session, extracts the saved payment method,
// and creates a subscription with a 30-day trial (month 1 already paid above).

router.post("/billing/create-subscription", async (req, res): Promise<void> => {
  const clerkOrgId = req.headers["x-clerk-org-id"] as string | undefined;
  if (!clerkOrgId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { sessionId } = req.body as { sessionId?: string };
  if (!sessionId) { res.status(400).json({ error: "sessionId is required" }); return; }

  const priceSubscription = process.env.SUBSCRIPTION_PRICE_ID ?? process.env.STRIPE_PRICE_SUBSCRIPTION;
  const pricePerSeat = process.env.STRIPE_PRICE_PER_SEAT;

  if (!priceSubscription) {
    res.status(500).json({ error: "STRIPE_PRICE_SUBSCRIPTION is not configured." });
    return;
  }

  let stripe: Stripe;
  try { stripe = getStripe(); } catch {
    res.status(500).json({ error: "Stripe is not configured." }); return;
  }

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent.payment_method"],
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: `Could not retrieve checkout session: ${msg}` });
    return;
  }

  const customerId = session.customer as string | null;
  if (!customerId) {
    res.status(400).json({ error: "No Stripe customer on this session." });
    return;
  }

  const paymentIntent = session.payment_intent as Stripe.PaymentIntent | null;
  const rawPaymentMethod = paymentIntent?.payment_method ?? null;
  const paymentMethodId = typeof rawPaymentMethod === "string"
    ? rawPaymentMethod
    : (rawPaymentMethod as Stripe.PaymentMethod | null)?.id ?? null;

  // Only card payment methods can be saved for off-session recurring billing.
  // Klarna, bank redirects etc. are one-off — subscription will start on trial
  // and Stripe will contact the customer to add a card before month 2.
  let cardPaymentMethodId: string | null = null;
  if (paymentMethodId) {
    try {
      const pm = await stripe.paymentMethods.retrieve(paymentMethodId);
      if (pm.type === "card") cardPaymentMethodId = pm.id;
    } catch {
      // Non-fatal — proceed without a default payment method
    }
  }

  const agency = await getAgency(clerkOrgId);
  const additionalSeats = Math.max(0, (agency?.seatCount ?? 1) - 1);

  const subscriptionItems: Stripe.SubscriptionCreateParams.Item[] = [
    { price: priceSubscription },
  ];
  if (additionalSeats > 0 && pricePerSeat) {
    subscriptionItems.push({ price: pricePerSeat, quantity: additionalSeats });
  }

  const subscriptionParams: Stripe.SubscriptionCreateParams = {
    customer: customerId,
    items: subscriptionItems,
    trial_period_days: 30,  // Month 1 already paid via payment checkout
    metadata: { clerkOrgId },
    ...(cardPaymentMethodId ? { default_payment_method: cardPaymentMethodId } : {}),
  };

  try {
    const subscription = await stripe.subscriptions.create(subscriptionParams);

    await db.update(agenciesTable)
      .set({ stripeCustomerId: customerId, subscriptionStatus: "active", setupFeePaid: true })
      .where(eq(agenciesTable.clerkOrgId, clerkOrgId));

    res.json({ success: true, subscriptionId: subscription.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: `Failed to create subscription: ${message}` });
  }
});

// ─── /billing/checkout/subscription — kept for any direct subscription upgrades ─

router.post("/billing/checkout/subscription", async (req, res): Promise<void> => {
  const clerkOrgId = req.headers["x-clerk-org-id"] as string | undefined;
  if (!clerkOrgId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const priceSubscription = process.env.SUBSCRIPTION_PRICE_ID ?? process.env.STRIPE_PRICE_SUBSCRIPTION;
  const pricePerSeat = process.env.STRIPE_PRICE_PER_SEAT;
  const priceExcessUsage = process.env.STRIPE_PRICE_EXCESS_USAGE;

  if (!priceSubscription) {
    res.status(500).json({ error: "STRIPE_PRICE_SUBSCRIPTION is not configured." });
    return;
  }

  let stripe: Stripe;
  try { stripe = getStripe(); } catch {
    res.status(500).json({ error: "Stripe is not configured." }); return;
  }

  const agency = await getAgency(clerkOrgId);
  const additionalSeats = Math.max(0, (agency?.seatCount ?? 1) - 1);

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    { price: priceSubscription, quantity: 1 },
  ];
  if (additionalSeats > 0 && pricePerSeat) {
    lineItems.push({ price: pricePerSeat, quantity: additionalSeats });
  }
  if (priceExcessUsage) {
    lineItems.push({ price: priceExcessUsage });
  }

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: "subscription",
    payment_method_types: ["card", "klarna"],
    automatic_tax: { enabled: true },
    line_items: lineItems,
    success_url: `${YOUR_DOMAIN}/dashboard?subscribed=true`,
    cancel_url: `${YOUR_DOMAIN}/onboard`,
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
    res.status(500).json({ error: `Failed to create subscription checkout: ${message}` });
  }
});

// ─── /billing/checkout — dashboard "upgrade plan" route ──────────────────────

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

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    { price: priceSubscription, quantity: 1 },
  ];
  if (additionalSeats > 0 && pricePerSeat) {
    lineItems.push({ price: pricePerSeat, quantity: additionalSeats });
  }
  if (priceExcessUsage) {
    lineItems.push({ price: priceExcessUsage });
  }

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: "subscription",
    payment_method_types: ["card", "klarna"],
    automatic_tax: { enabled: true },
    line_items: lineItems,
    subscription_data: {
      add_invoice_items: [{ price: priceOnboarding, quantity: 1 }],
    },
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
