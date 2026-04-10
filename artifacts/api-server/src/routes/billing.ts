import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, agenciesTable } from "@workspace/db";
import { CreateSetupCheckoutBody, CreateSubscriptionCheckoutBody } from "@workspace/api-zod";

const router: IRouter = Router();

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

router.post("/billing/checkout/setup", async (req, res): Promise<void> => {
  const parsed = CreateSetupCheckoutBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  // Mock Stripe checkout — in production this would create a real Stripe session
  res.json({ url: `${parsed.data.successUrl}?mock=setup_paid` });
});

router.post("/billing/checkout/subscription", async (req, res): Promise<void> => {
  const parsed = CreateSubscriptionCheckoutBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  res.json({ url: `${parsed.data.successUrl}?mock=subscription_started&seats=${parsed.data.seatCount}` });
});

router.post("/billing/portal", async (req, res): Promise<void> => {
  const clerkOrgId = req.headers["x-clerk-org-id"] as string | undefined;
  if (!clerkOrgId) { res.status(401).json({ error: "Unauthorized" }); return; }
  res.json({ url: "https://billing.stripe.com/p/session/mock" });
});

router.get("/billing/invoices", async (req, res): Promise<void> => {
  const clerkOrgId = req.headers["x-clerk-org-id"] as string | undefined;
  if (!clerkOrgId) { res.status(401).json({ error: "Unauthorized" }); return; }
  // Mock invoice history
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
