import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, agenciesTable, listingsTable } from "@workspace/db";
import {
  CreateListingBody,
  UpdateListingBody,
  GetListingParams,
  UpdateListingParams,
  DeleteListingParams,
} from "@workspace/api-zod";
import { MOCK_VAULT_LISTINGS, MOCK_VAULT_SUMMARY } from "../lib/mockVault";

const router: IRouter = Router();

const IS_SIMULATION = process.env.DATABASE_MODE === "SIMULATION";

async function getAgencyId(clerkOrgId: string): Promise<number | null> {
  const [agency] = await db.select({ id: agenciesTable.id }).from(agenciesTable).where(eq(agenciesTable.clerkOrgId, clerkOrgId));
  return agency?.id ?? null;
}

router.get("/listings", async (req, res): Promise<void> => {
  const clerkOrgId = req.headers["x-clerk-org-id"] as string | undefined;
  if (!clerkOrgId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const agencyId = await getAgencyId(clerkOrgId);
  if (!agencyId) { res.status(404).json({ error: "Agency not found" }); return; }
  const listings = await db.select().from(listingsTable).where(eq(listingsTable.agencyId, agencyId));
  res.json(listings);
});

router.post("/listings", async (req, res): Promise<void> => {
  const clerkOrgId = req.headers["x-clerk-org-id"] as string | undefined;
  if (!clerkOrgId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const agencyId = await getAgencyId(clerkOrgId);
  if (!agencyId) { res.status(404).json({ error: "Agency not found" }); return; }
  const parsed = CreateListingBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [listing] = await db.insert(listingsTable).values({
    agencyId,
    ...parsed.data,
    inspectionTimes: parsed.data.inspectionTimes ?? [],
  }).returning();
  res.status(201).json(listing);
});

router.get("/listings/sync-vaultre", async (req, res): Promise<void> => {
  res.status(405).json({ error: "Use POST" });
});

router.post("/listings/sync-vaultre", async (req, res): Promise<void> => {
  const clerkOrgId = req.headers["x-clerk-org-id"] as string | undefined;
  if (!clerkOrgId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const agencyId = await getAgencyId(clerkOrgId);
  if (!agencyId) { res.status(404).json({ error: "Agency not found" }); return; }

  const sourceListings = IS_SIMULATION ? MOCK_VAULT_LISTINGS : [
    // Minimal fallback if not simulation and no real VaultRE credentials
    {
      vaultreId: "VR001",
      address: "42 Harbour View Drive", suburb: "Kirribilli", state: "NSW" as const, postcode: "2061",
      price: "$2,850,000", listingType: "sale" as const, bedrooms: 4, bathrooms: 3,
      agentName: "Sarah Mitchell", agentMobile: "0412 111 222",
      inspectionTimes: ["Saturday 12:00-12:30pm", "Sunday 1:00-1:30pm"],
      status: "active" as const,
    },
  ];

  let added = 0;
  let updated = 0;

  for (const mock of sourceListings) {
    const { carSpaces, ...dbFields } = mock as typeof mock & { carSpaces?: number };
    const existing = await db.select({ id: listingsTable.id }).from(listingsTable)
      .where(and(eq(listingsTable.agencyId, agencyId), eq(listingsTable.vaultreId, mock.vaultreId)));
    if (existing.length > 0) {
      await db.update(listingsTable).set(dbFields).where(eq(listingsTable.id, existing[0].id));
      updated++;
    } else {
      await db.insert(listingsTable).values({ agencyId, ...dbFields, inspectionTimes: dbFields.inspectionTimes ?? [] });
      added++;
    }
  }

  const mode = IS_SIMULATION ? "SIMULATION" : "LIVE";
  res.json({
    synced: sourceListings.length,
    added,
    updated,
    mode,
    source: IS_SIMULATION ? MOCK_VAULT_SUMMARY.source : "VaultRE Production API",
    suburbs: IS_SIMULATION ? MOCK_VAULT_SUMMARY.suburbs : [],
    message: IS_SIMULATION
      ? `Synced ${sourceListings.length} listings from VaultRE Simulation Bridge across ${MOCK_VAULT_SUMMARY.suburbs.join(", ")}`
      : `Synced ${sourceListings.length} listings from VaultRE`,
  });
});

router.get("/listings/:id", async (req, res): Promise<void> => {
  const clerkOrgId = req.headers["x-clerk-org-id"] as string | undefined;
  if (!clerkOrgId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const agencyId = await getAgencyId(clerkOrgId);
  if (!agencyId) { res.status(404).json({ error: "Agency not found" }); return; }
  const params = GetListingParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [listing] = await db.select().from(listingsTable)
    .where(and(eq(listingsTable.id, params.data.id), eq(listingsTable.agencyId, agencyId)));
  if (!listing) { res.status(404).json({ error: "Listing not found" }); return; }
  res.json(listing);
});

router.patch("/listings/:id", async (req, res): Promise<void> => {
  const clerkOrgId = req.headers["x-clerk-org-id"] as string | undefined;
  if (!clerkOrgId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const agencyId = await getAgencyId(clerkOrgId);
  if (!agencyId) { res.status(404).json({ error: "Agency not found" }); return; }
  const params = UpdateListingParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const parsed = UpdateListingBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [listing] = await db.update(listingsTable).set(parsed.data)
    .where(and(eq(listingsTable.id, params.data.id), eq(listingsTable.agencyId, agencyId)))
    .returning();
  if (!listing) { res.status(404).json({ error: "Listing not found" }); return; }
  res.json(listing);
});

router.delete("/listings/:id", async (req, res): Promise<void> => {
  const clerkOrgId = req.headers["x-clerk-org-id"] as string | undefined;
  if (!clerkOrgId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const agencyId = await getAgencyId(clerkOrgId);
  if (!agencyId) { res.status(404).json({ error: "Agency not found" }); return; }
  const params = DeleteListingParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  await db.delete(listingsTable)
    .where(and(eq(listingsTable.id, params.data.id), eq(listingsTable.agencyId, agencyId)));
  res.sendStatus(204);
});

export default router;
