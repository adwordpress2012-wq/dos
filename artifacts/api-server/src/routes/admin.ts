import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { eq, desc, sql, gte, and } from "drizzle-orm";
import {
  db, agenciesTable, leadsTable, transcriptsTable, chatSessionsTable,
  adminExpensesTable, adminPipelineTable, listingsTable,
} from "@workspace/db";

const router: IRouter = Router();

const ADMIN_SECRET = process.env.ADMIN_SECRET || "directive-captain-2024";
const SETUP_FEE_CENTS = 150000;
const MONTHLY_SUB_CENTS = 29900;

function adminAuth(req: Request, res: Response, next: NextFunction) {
  const secret = req.headers["x-admin-secret"];
  if (secret !== ADMIN_SECRET) {
    res.status(401).json({ error: "Unauthorised — Prime Directive violation" });
    return;
  }
  next();
}

router.post("/admin/auth", (req: Request, res: Response): void => {
  const { secret } = req.body;
  if (secret === ADMIN_SECRET) {
    res.json({ ok: true });
  } else {
    res.status(401).json({ ok: false, error: "Invalid access code" });
  }
});

router.post("/admin/test-email", adminAuth, async (req: Request, res: Response): Promise<void> => {
  const apiKey = process.env.DOS_RESEND_CFG || process.env.DOS_RESEND_KEY || process.env.RESEND_API_KEY;
  if (!apiKey) { res.status(500).json({ error: "DOS_RESEND_KEY / RESEND_API_KEY not set" }); return; }
  const result = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Directive OS | New Lead Captured <leads@directiveos.com.au>",
      to: ["adwordpress2012@gmail.com", "jayson@directiveos.com.au"],
      subject: "✅ DNS Verified — Directive OS Email Delivery Test",
      html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0e1a;color:#f0f0f0;padding:32px;border-radius:8px"><div style="color:#00d1b2;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px">DIRECTIVE OS — SYSTEM TEST</div><h2 style="color:#fff;margin:0 0 16px">Email Delivery Confirmed ✓</h2><p style="color:#a0aec0">DNS records are verified. Directive OS is now live sending from <strong style="color:#00d1b2">leads@directiveos.com.au</strong>.</p><p style="color:#a0aec0">Every lead Sarah captures — voice call or chat — will arrive in your inbox from this address.</p><div style="background:#131929;border:1px solid #1e2d45;border-radius:6px;padding:20px;margin:24px 0"><div style="color:#a0aec0;font-size:13px;margin-bottom:4px">FROM ADDRESS</div><div style="color:#fff;font-weight:600;margin-bottom:12px">leads@directiveos.com.au</div><div style="color:#a0aec0;font-size:13px;margin-bottom:4px">DNS STATUS</div><div style="color:#00d1b2;font-weight:600">DKIM ✓ &nbsp;&nbsp; SPF ✓ &nbsp;&nbsp; MX ✓</div></div><p style="color:#718096;font-size:13px;margin-top:24px;border-top:1px solid #1e2d45;padding-top:16px">Sarah — Directive OS AI Receptionist &nbsp;|&nbsp; directiveos.com.au</p></div>`,
    }),
  });
  const data = await result.json();
  res.status(result.status).json(data);
});

router.get("/admin/overview", adminAuth, async (_req: Request, res: Response): Promise<void> => {
  const agencies = await db.select().from(agenciesTable).orderBy(desc(agenciesTable.createdAt));

  const active = agencies.filter(a => a.subscriptionStatus === "active");
  const trial = agencies.filter(a => a.subscriptionStatus === "trialing");
  const pending = agencies.filter(a => a.subscriptionStatus === "pending");
  const churned = agencies.filter(a => a.subscriptionStatus === "cancelled");

  const mrr = active.length * MONTHLY_SUB_CENTS;
  const arr = mrr * 12;
  const setupRevenue = agencies.filter(a => a.setupFeePaid).length * SETUP_FEE_CENTS;
  const totalRevenue = setupRevenue + (mrr);

  const monthStart = new Date();
  monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);

  const [newSignups] = await db.select({ count: sql<number>`count(*)` })
    .from(agenciesTable).where(gte(agenciesTable.createdAt, monthStart));

  const [totalLeads] = await db.select({ count: sql<number>`count(*)` }).from(leadsTable);
  const [totalTranscripts] = await db.select({ count: sql<number>`count(*)` }).from(transcriptsTable);
  const [totalChats] = await db.select({ count: sql<number>`count(*)` }).from(chatSessionsTable);

  const totalMinutes = agencies.reduce((sum, a) => sum + a.aiMinutesUsed, 0);

  const expenses = await db.select().from(adminExpensesTable);
  const totalExpensesCents = expenses.reduce((s, e) => s + e.amountCents, 0);
  const netProfitCents = totalRevenue - totalExpensesCents;

  res.json({
    mrr,
    arr,
    setupRevenue,
    totalRevenue,
    netProfitCents,
    totalExpensesCents,
    activeClients: active.length,
    trialClients: trial.length,
    pendingClients: pending.length,
    churnedClients: churned.length,
    newSignupsThisMonth: Number(newSignups.count),
    totalLeads: Number(totalLeads.count),
    totalTranscripts: Number(totalTranscripts.count),
    totalChats: Number(totalChats.count),
    totalMinutes,
  });
});

router.get("/admin/clients", adminAuth, async (_req: Request, res: Response): Promise<void> => {
  const agencies = await db.select().from(agenciesTable).orderBy(desc(agenciesTable.createdAt));

  const enriched = await Promise.all(agencies.map(async (a) => {
    const [leads] = await db.select({ count: sql<number>`count(*)` }).from(leadsTable).where(eq(leadsTable.agencyId, a.id));
    const [transcripts] = await db.select({ count: sql<number>`count(*)` }).from(transcriptsTable).where(eq(transcriptsTable.agencyId, a.id));
    return {
      ...a,
      leadCount: Number(leads.count),
      transcriptCount: Number(transcripts.count),
      monthlyRevenueCents: a.subscriptionStatus === "active" ? MONTHLY_SUB_CENTS : 0,
      setupRevenueCents: a.setupFeePaid ? SETUP_FEE_CENTS : 0,
    };
  }));

  res.json(enriched);
});

router.get("/admin/clients/export-csv", adminAuth, async (_req: Request, res: Response): Promise<void> => {
  const agencies = await db.select().from(agenciesTable).orderBy(desc(agenciesTable.createdAt));

  const enriched = await Promise.all(agencies.map(async (a) => {
    const [leads] = await db.select({ count: sql<number>`count(*)` }).from(leadsTable).where(eq(leadsTable.agencyId, a.id));
    return { ...a, leadCount: Number(leads.count) };
  }));

  const headers = ["ID","Name","Email","Phone","ABN","Status","Setup Paid","AI Minutes Used","Lead Count","Signup Date"];
  const rows = enriched.map(a => [
    a.id, `"${a.name}"`, a.contactEmail, a.contactPhone || "", a.abn,
    a.subscriptionStatus, a.setupFeePaid ? "Yes" : "No",
    a.aiMinutesUsed, a.leadCount,
    new Date(a.createdAt).toLocaleDateString("en-AU"),
  ].join(","));

  const csv = [headers.join(","), ...rows].join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="directive-os-clients.csv"');
  res.send(csv);
});

router.get("/admin/financials", adminAuth, async (_req: Request, res: Response): Promise<void> => {
  const agencies = await db.select().from(agenciesTable);
  const expenses = await db.select().from(adminExpensesTable).orderBy(desc(adminExpensesTable.createdAt));

  const activeCount = agencies.filter(a => a.subscriptionStatus === "active").length;
  const setupCount = agencies.filter(a => a.setupFeePaid).length;
  const mrr = activeCount * MONTHLY_SUB_CENTS;
  const setupRevenue = setupCount * SETUP_FEE_CENTS;
  const totalExpenses = expenses.reduce((s, e) => s + e.amountCents, 0);
  const netProfit = mrr + setupRevenue - totalExpenses;

  const monthlyBreakdown: Record<string, { revenue: number; expenses: number }> = {};
  agencies.forEach(a => {
    const m = new Date(a.createdAt).toISOString().slice(0, 7);
    if (!monthlyBreakdown[m]) monthlyBreakdown[m] = { revenue: 0, expenses: 0 };
    if (a.setupFeePaid) monthlyBreakdown[m].revenue += SETUP_FEE_CENTS;
    if (a.subscriptionStatus === "active") monthlyBreakdown[m].revenue += MONTHLY_SUB_CENTS;
  });
  expenses.forEach(e => {
    const m = e.expenseDate.slice(0, 7);
    if (!monthlyBreakdown[m]) monthlyBreakdown[m] = { revenue: 0, expenses: 0 };
    monthlyBreakdown[m].expenses += e.amountCents;
  });

  const months = Object.entries(monthlyBreakdown)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({ month, ...data, profit: data.revenue - data.expenses }));

  res.json({ mrr, setupRevenue, totalExpenses, netProfit, months, expenses });
});

router.get("/admin/financials/export-csv", adminAuth, async (_req: Request, res: Response): Promise<void> => {
  const expenses = await db.select().from(adminExpensesTable).orderBy(desc(adminExpensesTable.expenseDate));
  const headers = ["Date","Category","Description","Amount (AUD)","Notes"];
  const rows = expenses.map(e => [
    e.expenseDate, e.category, `"${e.description}"`,
    (e.amountCents / 100).toFixed(2), `"${e.notes || ""}"`,
  ].join(","));
  const csv = [headers.join(","), ...rows].join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="directive-os-expenses.csv"');
  res.send(csv);
});

router.post("/admin/expenses", adminAuth, async (req: Request, res: Response): Promise<void> => {
  const { category, description, amountCents, expenseDate, notes } = req.body;
  if (!description || !amountCents || !expenseDate) {
    res.status(400).json({ error: "Missing required fields" }); return;
  }
  const [expense] = await db.insert(adminExpensesTable).values({
    category: category || "other", description, amountCents: Number(amountCents), expenseDate, notes,
  }).returning();
  res.json(expense);
});

router.delete("/admin/expenses/:id", adminAuth, async (req: Request, res: Response): Promise<void> => {
  await db.delete(adminExpensesTable).where(eq(adminExpensesTable.id, Number(req.params.id)));
  res.json({ ok: true });
});

router.get("/admin/pipeline", adminAuth, async (_req: Request, res: Response): Promise<void> => {
  const pipeline = await db.select().from(adminPipelineTable).orderBy(desc(adminPipelineTable.updatedAt));
  res.json(pipeline);
});

router.post("/admin/pipeline", adminAuth, async (req: Request, res: Response): Promise<void> => {
  const { agencyName, contactName, contactEmail, contactPhone, stage, source, notes, estimatedValue } = req.body;
  if (!agencyName || !contactName) { res.status(400).json({ error: "Missing required fields" }); return; }
  const [entry] = await db.insert(adminPipelineTable).values({
    agencyName, contactName, contactEmail, contactPhone,
    stage: stage || "lead", source, notes,
    estimatedValue: estimatedValue ? Number(estimatedValue) * 100 : 0,
  }).returning();
  res.json(entry);
});

router.put("/admin/pipeline/:id", adminAuth, async (req: Request, res: Response): Promise<void> => {
  const { stage, notes, contactEmail, contactPhone, estimatedValue } = req.body;
  const updates: Record<string, unknown> = {};
  if (stage !== undefined) updates.stage = stage;
  if (notes !== undefined) updates.notes = notes;
  if (contactEmail !== undefined) updates.contactEmail = contactEmail;
  if (contactPhone !== undefined) updates.contactPhone = contactPhone;
  if (estimatedValue !== undefined) updates.estimatedValue = Number(estimatedValue) * 100;
  const [updated] = await db.update(adminPipelineTable).set(updates).where(eq(adminPipelineTable.id, Number(req.params.id))).returning();
  res.json(updated);
});

router.delete("/admin/pipeline/:id", adminAuth, async (req: Request, res: Response): Promise<void> => {
  await db.delete(adminPipelineTable).where(eq(adminPipelineTable.id, Number(req.params.id)));
  res.json({ ok: true });
});

router.get("/admin/listings", adminAuth, async (req: Request, res: Response): Promise<void> => {
  const agencyId = req.query.agencyId ? Number(req.query.agencyId) : null;
  if (!agencyId) {
    const all = await db.select().from(listingsTable).orderBy(desc(listingsTable.createdAt));
    res.json(all); return;
  }
  const listings = await db.select().from(listingsTable)
    .where(eq(listingsTable.agencyId, agencyId))
    .orderBy(desc(listingsTable.createdAt));
  res.json(listings);
});

router.post("/admin/listings", adminAuth, async (req: Request, res: Response): Promise<void> => {
  const { agencyId, address, suburb, state, postcode, price, listingType, listingMethod,
    bedrooms, bathrooms, carSpaces, agentName, agentMobile, inspectionTimes,
    auctionDate, auctionTime, status, photoUrl, description } = req.body;
  if (!agencyId || !address || !suburb || !state || !postcode || !agentName || !agentMobile) {
    res.status(400).json({ error: "Missing required fields" }); return;
  }
  const [listing] = await db.insert(listingsTable).values({
    agencyId: Number(agencyId), address, suburb, state, postcode,
    price: price || null,
    listingType: listingType || "sale",
    listingMethod: listingMethod || "private_treaty",
    bedrooms: bedrooms ? Number(bedrooms) : null,
    bathrooms: bathrooms ? Number(bathrooms) : null,
    carSpaces: carSpaces ? Number(carSpaces) : null,
    agentName, agentMobile,
    inspectionTimes: inspectionTimes || [],
    auctionDate: auctionDate || null,
    auctionTime: auctionTime || null,
    status: status || "active",
    photoUrl: photoUrl || null,
    description: description || null,
  }).returning();
  res.status(201).json(listing);
});

router.patch("/admin/listings/:id", adminAuth, async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const { address, suburb, state, postcode, price, listingType, listingMethod,
    bedrooms, bathrooms, carSpaces, agentName, agentMobile, inspectionTimes,
    auctionDate, auctionTime, status, photoUrl, description } = req.body;
  const updates: Record<string, unknown> = {};
  if (address !== undefined) updates.address = address;
  if (suburb !== undefined) updates.suburb = suburb;
  if (state !== undefined) updates.state = state;
  if (postcode !== undefined) updates.postcode = postcode;
  if (price !== undefined) updates.price = price;
  if (listingType !== undefined) updates.listingType = listingType;
  if (listingMethod !== undefined) updates.listingMethod = listingMethod;
  if (bedrooms !== undefined) updates.bedrooms = bedrooms ? Number(bedrooms) : null;
  if (bathrooms !== undefined) updates.bathrooms = bathrooms ? Number(bathrooms) : null;
  if (carSpaces !== undefined) updates.carSpaces = carSpaces ? Number(carSpaces) : null;
  if (agentName !== undefined) updates.agentName = agentName;
  if (agentMobile !== undefined) updates.agentMobile = agentMobile;
  if (inspectionTimes !== undefined) updates.inspectionTimes = inspectionTimes;
  if (auctionDate !== undefined) updates.auctionDate = auctionDate;
  if (auctionTime !== undefined) updates.auctionTime = auctionTime;
  if (status !== undefined) updates.status = status;
  if (photoUrl !== undefined) updates.photoUrl = photoUrl;
  if (description !== undefined) updates.description = description;
  const [listing] = await db.update(listingsTable).set(updates)
    .where(eq(listingsTable.id, id)).returning();
  if (!listing) { res.status(404).json({ error: "Listing not found" }); return; }
  res.json(listing);
});

router.delete("/admin/listings/:id", adminAuth, async (req: Request, res: Response): Promise<void> => {
  await db.delete(listingsTable).where(eq(listingsTable.id, Number(req.params.id)));
  res.json({ ok: true });
});

router.get("/admin/activity", adminAuth, async (req: Request, res: Response): Promise<void> => {
  const limit = Number(req.query.limit) || 50;
  const agencies = await db.select({ id: agenciesTable.id, name: agenciesTable.name }).from(agenciesTable);
  const agencyMap = Object.fromEntries(agencies.map(a => [a.id, a.name]));

  const transcripts = await db.select().from(transcriptsTable)
    .orderBy(desc(transcriptsTable.createdAt)).limit(limit);

  const enriched = transcripts.map(t => ({
    ...t,
    agencyName: agencyMap[t.agencyId] || "Unknown",
  }));

  const [totalCalls] = await db.select({ count: sql<number>`count(*)` })
    .from(transcriptsTable).where(eq(transcriptsTable.channel, "voice"));
  const [totalChats] = await db.select({ count: sql<number>`count(*)` })
    .from(transcriptsTable).where(eq(transcriptsTable.channel, "chat"));

  res.json({
    transcripts: enriched,
    stats: {
      totalCalls: Number(totalCalls.count),
      totalChats: Number(totalChats.count),
    },
  });
});

export default router;
