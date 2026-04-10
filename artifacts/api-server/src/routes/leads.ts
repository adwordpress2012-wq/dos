import { Router, type IRouter } from "express";
import { eq, and, desc } from "drizzle-orm";
import { db, agenciesTable, leadsTable } from "@workspace/db";
import {
  CreateLeadBody,
  UpdateLeadBody,
  GetLeadParams,
  UpdateLeadParams,
  GetLeadsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

async function getAgencyId(clerkOrgId: string): Promise<number | null> {
  const [agency] = await db.select({ id: agenciesTable.id }).from(agenciesTable).where(eq(agenciesTable.clerkOrgId, clerkOrgId));
  return agency?.id ?? null;
}

router.get("/leads", async (req, res): Promise<void> => {
  const clerkOrgId = req.headers["x-clerk-org-id"] as string | undefined;
  if (!clerkOrgId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const agencyId = await getAgencyId(clerkOrgId);
  if (!agencyId) { res.status(404).json({ error: "Agency not found" }); return; }
  const query = GetLeadsQueryParams.safeParse(req.query);
  let leads = await db.select().from(leadsTable)
    .where(eq(leadsTable.agencyId, agencyId))
    .orderBy(desc(leadsTable.createdAt));
  if (query.success) {
    if (query.data.status) leads = leads.filter(l => l.status === query.data.status);
    if (query.data.type) leads = leads.filter(l => l.leadType === query.data.type);
  }
  res.json(leads);
});

router.post("/leads", async (req, res): Promise<void> => {
  const clerkOrgId = req.headers["x-clerk-org-id"] as string | undefined;
  if (!clerkOrgId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const agencyId = await getAgencyId(clerkOrgId);
  if (!agencyId) { res.status(404).json({ error: "Agency not found" }); return; }
  const parsed = CreateLeadBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [lead] = await db.insert(leadsTable).values({ agencyId, ...parsed.data }).returning();
  res.status(201).json(lead);
});

router.get("/leads/:id", async (req, res): Promise<void> => {
  const clerkOrgId = req.headers["x-clerk-org-id"] as string | undefined;
  if (!clerkOrgId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const agencyId = await getAgencyId(clerkOrgId);
  if (!agencyId) { res.status(404).json({ error: "Agency not found" }); return; }
  const params = GetLeadParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [lead] = await db.select().from(leadsTable)
    .where(and(eq(leadsTable.id, params.data.id), eq(leadsTable.agencyId, agencyId)));
  if (!lead) { res.status(404).json({ error: "Lead not found" }); return; }
  res.json(lead);
});

router.patch("/leads/:id", async (req, res): Promise<void> => {
  const clerkOrgId = req.headers["x-clerk-org-id"] as string | undefined;
  if (!clerkOrgId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const agencyId = await getAgencyId(clerkOrgId);
  if (!agencyId) { res.status(404).json({ error: "Agency not found" }); return; }
  const params = UpdateLeadParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const parsed = UpdateLeadBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [lead] = await db.update(leadsTable).set(parsed.data)
    .where(and(eq(leadsTable.id, params.data.id), eq(leadsTable.agencyId, agencyId)))
    .returning();
  if (!lead) { res.status(404).json({ error: "Lead not found" }); return; }
  res.json(lead);
});

export default router;
