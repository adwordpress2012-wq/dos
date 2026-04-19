import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, agenciesTable } from "@workspace/db";
import {
  UpdateMyAgencyBody,
  OnboardAgencyBody,
} from "@workspace/api-zod";
import { resolveAgency } from "../lib/resolveAgency";

const router: IRouter = Router();

router.get("/agencies/me", async (req, res): Promise<void> => {
  const agency = await resolveAgency(req);
  if (!agency) { res.status(404).json({ error: "Agency not found" }); return; }
  res.json(agency);
});

router.patch("/agencies/me", async (req, res): Promise<void> => {
  const agency = await resolveAgency(req);
  if (!agency) { res.status(404).json({ error: "Agency not found" }); return; }
  const parsed = UpdateMyAgencyBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [updated] = await db.update(agenciesTable)
    .set(parsed.data)
    .where(eq(agenciesTable.id, agency.id))
    .returning();
  if (!updated) { res.status(404).json({ error: "Agency not found" }); return; }
  res.json(updated);
});

router.post("/agencies/onboard", async (req, res): Promise<void> => {
  const parsed = OnboardAgencyBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const existing = await db.select().from(agenciesTable).where(eq(agenciesTable.clerkOrgId, parsed.data.clerkOrgId));
  if (existing.length > 0) {
    res.status(200).json(existing[0]);
    return;
  }
  const [agency] = await db.insert(agenciesTable).values({
    clerkOrgId: parsed.data.clerkOrgId,
    name: parsed.data.name,
    abn: parsed.data.abn,
    contactEmail: parsed.data.contactEmail,
    contactPhone: parsed.data.contactPhone ?? null,
    seatCount: parsed.data.seatCount,
    termsAccepted: parsed.data.termsAccepted,
    subscriptionStatus: "pending",
    setupFeePaid: false,
    aiMinutesUsed: 0,
    aiMinutesIncluded: 100,
  }).returning();
  res.status(201).json(agency);
});

export default router;
