import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, agenciesTable, staffTable } from "@workspace/db";
import { InviteStaffBody, RemoveStaffParams } from "@workspace/api-zod";

const router: IRouter = Router();

async function getAgencyId(clerkOrgId: string): Promise<number | null> {
  const [agency] = await db.select({ id: agenciesTable.id }).from(agenciesTable).where(eq(agenciesTable.clerkOrgId, clerkOrgId));
  return agency?.id ?? null;
}

router.get("/staff", async (req, res): Promise<void> => {
  const clerkOrgId = req.headers["x-clerk-org-id"] as string | undefined;
  if (!clerkOrgId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const agencyId = await getAgencyId(clerkOrgId);
  if (!agencyId) { res.status(404).json({ error: "Agency not found" }); return; }
  const staff = await db.select().from(staffTable).where(eq(staffTable.agencyId, agencyId));
  res.json(staff);
});

router.post("/staff", async (req, res): Promise<void> => {
  const clerkOrgId = req.headers["x-clerk-org-id"] as string | undefined;
  if (!clerkOrgId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const agencyId = await getAgencyId(clerkOrgId);
  if (!agencyId) { res.status(404).json({ error: "Agency not found" }); return; }
  const parsed = InviteStaffBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [member] = await db.insert(staffTable).values({
    agencyId,
    clerkUserId: `invited_${Date.now()}`,
    name: parsed.data.name,
    email: parsed.data.email,
    role: parsed.data.role,
    status: "invited",
  }).returning();
  res.status(201).json(member);
});

router.delete("/staff/:id", async (req, res): Promise<void> => {
  const clerkOrgId = req.headers["x-clerk-org-id"] as string | undefined;
  if (!clerkOrgId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const agencyId = await getAgencyId(clerkOrgId);
  if (!agencyId) { res.status(404).json({ error: "Agency not found" }); return; }
  const params = RemoveStaffParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  await db.delete(staffTable)
    .where(and(eq(staffTable.id, params.data.id), eq(staffTable.agencyId, agencyId)));
  res.sendStatus(204);
});

export default router;
