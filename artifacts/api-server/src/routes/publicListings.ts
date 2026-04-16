import { Router, type IRouter, type Request, type Response } from "express";
import { eq, and } from "drizzle-orm";
import { db, agenciesTable, listingsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/public/listings", async (req: Request, res: Response): Promise<void> => {
  const agencyId = parseInt(req.query.agencyId as string, 10);
  if (!agencyId || isNaN(agencyId)) {
    res.status(400).json({ error: "agencyId query param required" });
    return;
  }

  const listings = await db
    .select()
    .from(listingsTable)
    .where(and(eq(listingsTable.agencyId, agencyId), eq(listingsTable.status, "active")))
    .orderBy(listingsTable.id);

  res.json(listings);
});

router.get("/public/agency/:id", async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (!id || isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [agency] = await db
    .select({ id: agenciesTable.id, name: agenciesTable.name, contactPhone: agenciesTable.contactPhone })
    .from(agenciesTable)
    .where(eq(agenciesTable.id, id));
  if (!agency) { res.status(404).json({ error: "Not found" }); return; }
  res.json(agency);
});

export default router;
