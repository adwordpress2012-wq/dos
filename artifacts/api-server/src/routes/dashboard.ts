import { Router, type IRouter } from "express";
import { eq, desc, and, gte, sql } from "drizzle-orm";
import { db, agenciesTable, leadsTable, listingsTable, transcriptsTable } from "@workspace/db";

const router: IRouter = Router();

async function getAgencyId(clerkOrgId: string): Promise<number | null> {
  const [agency] = await db.select({ id: agenciesTable.id, aiMinutesUsed: agenciesTable.aiMinutesUsed, aiMinutesIncluded: agenciesTable.aiMinutesIncluded })
    .from(agenciesTable).where(eq(agenciesTable.clerkOrgId, clerkOrgId));
  return agency?.id ?? null;
}

async function getAgency(clerkOrgId: string) {
  const [agency] = await db.select().from(agenciesTable).where(eq(agenciesTable.clerkOrgId, clerkOrgId));
  return agency ?? null;
}

router.get("/dashboard/summary", async (req, res): Promise<void> => {
  const clerkOrgId = req.headers["x-clerk-org-id"] as string | undefined;
  if (!clerkOrgId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const agency = await getAgency(clerkOrgId);
  if (!agency) { res.status(404).json({ error: "Agency not found" }); return; }

  const agencyId = agency.id;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const [totalLeadsResult] = await db.select({ count: sql<number>`count(*)` }).from(leadsTable).where(eq(leadsTable.agencyId, agencyId));
  const [newTodayResult] = await db.select({ count: sql<number>`count(*)` }).from(leadsTable)
    .where(and(eq(leadsTable.agencyId, agencyId), gte(leadsTable.createdAt, today)));
  const [activeListingsResult] = await db.select({ count: sql<number>`count(*)` }).from(listingsTable)
    .where(and(eq(listingsTable.agencyId, agencyId), eq(listingsTable.status, "active")));
  const [formsResult] = await db.select({ count: sql<number>`count(*)` }).from(leadsTable)
    .where(and(eq(leadsTable.agencyId, agencyId), eq(leadsTable.formRequested, true)));
  const [hotLeadsResult] = await db.select({ count: sql<number>`count(*)` }).from(leadsTable)
    .where(and(eq(leadsTable.agencyId, agencyId), eq(leadsTable.hotLead, true)));
  const [transcriptsResult] = await db.select({ count: sql<number>`count(*)` }).from(transcriptsTable)
    .where(and(eq(transcriptsTable.agencyId, agencyId), gte(transcriptsTable.createdAt, monthStart)));

  res.json({
    totalLeads: Number(totalLeadsResult.count),
    newLeadsToday: Number(newTodayResult.count),
    activeListings: Number(activeListingsResult.count),
    aiMinutesUsed: agency.aiMinutesUsed,
    aiMinutesIncluded: agency.aiMinutesIncluded,
    formsRequested: Number(formsResult.count),
    hotLeads: Number(hotLeadsResult.count),
    transcriptsThisMonth: Number(transcriptsResult.count),
  });
});

router.get("/dashboard/recent-leads", async (req, res): Promise<void> => {
  const clerkOrgId = req.headers["x-clerk-org-id"] as string | undefined;
  if (!clerkOrgId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const agencyId = await getAgencyId(clerkOrgId);
  if (!agencyId) { res.status(404).json({ error: "Agency not found" }); return; }
  const leads = await db.select().from(leadsTable)
    .where(eq(leadsTable.agencyId, agencyId))
    .orderBy(desc(leadsTable.createdAt))
    .limit(10);
  res.json(leads);
});

router.get("/dashboard/lead-breakdown", async (req, res): Promise<void> => {
  const clerkOrgId = req.headers["x-clerk-org-id"] as string | undefined;
  if (!clerkOrgId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const agencyId = await getAgencyId(clerkOrgId);
  if (!agencyId) { res.status(404).json({ error: "Agency not found" }); return; }
  const leads = await db.select({ leadType: leadsTable.leadType }).from(leadsTable).where(eq(leadsTable.agencyId, agencyId));
  const breakdown = { buyers: 0, tenants: 0, landlords: 0, vendors: 0, unknown: 0 };
  for (const lead of leads) {
    if (lead.leadType === "buyer") breakdown.buyers++;
    else if (lead.leadType === "tenant") breakdown.tenants++;
    else if (lead.leadType === "landlord") breakdown.landlords++;
    else if (lead.leadType === "vendor") breakdown.vendors++;
    else breakdown.unknown++;
  }
  res.json(breakdown);
});

router.get("/dashboard/activity", async (req, res): Promise<void> => {
  const clerkOrgId = req.headers["x-clerk-org-id"] as string | undefined;
  if (!clerkOrgId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const agencyId = await getAgencyId(clerkOrgId);
  if (!agencyId) { res.status(404).json({ error: "Agency not found" }); return; }

  const recentLeads = await db.select().from(leadsTable)
    .where(eq(leadsTable.agencyId, agencyId))
    .orderBy(desc(leadsTable.createdAt))
    .limit(5);
  const recentTranscripts = await db.select().from(transcriptsTable)
    .where(eq(transcriptsTable.agencyId, agencyId))
    .orderBy(desc(transcriptsTable.createdAt))
    .limit(5);

  const activities: Array<{ id: number; type: string; description: string; timestamp: Date; metadata: Record<string, unknown> }> = [];
  let idCounter = 1;

  for (const lead of recentLeads) {
    let type = "new_lead";
    let desc = `New ${lead.leadType} lead: ${lead.name}`;
    if (lead.hotLead) { type = "hot_lead"; desc = `Hot lead detected: ${lead.name}`; }
    if (lead.formRequested) { type = "form_request"; desc = `Tenancy form requested by ${lead.name}`; }
    activities.push({ id: idCounter++, type, description: desc, timestamp: lead.createdAt, metadata: { leadId: lead.id, channel: lead.channel } });
  }

  for (const t of recentTranscripts) {
    activities.push({
      id: idCounter++,
      type: "transcript",
      description: `${t.channel === "voice" ? "Voice call" : "Chat session"} with ${t.leadName ?? "Unknown"}`,
      timestamp: t.createdAt,
      metadata: { transcriptId: t.id, channel: t.channel },
    });
  }

  activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  res.json(activities.slice(0, 10).map(a => ({ ...a, timestamp: a.timestamp.toISOString() })));
});

export default router;
