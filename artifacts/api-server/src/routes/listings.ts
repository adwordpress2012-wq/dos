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

const router: IRouter = Router();

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

  // Mock VaultRE sync — returns sample listings
  const mockListings = [
    {
      address: "42 Harbour View Drive", suburb: "Kirribilli", state: "NSW", postcode: "2061",
      price: "$2,800,000", listingType: "sale" as const, bedrooms: 4, bathrooms: 3,
      agentName: "Sarah Mitchell", agentMobile: "0412 345 678",
      inspectionTimes: ["Saturday 12:00-12:30pm", "Sunday 1:00-1:30pm"],
      vaultreId: "VR001", status: "active" as const,
    },
    {
      address: "8/15 Pacific Highway", suburb: "North Sydney", state: "NSW", postcode: "2060",
      price: "$650/week", listingType: "rental" as const, bedrooms: 2, bathrooms: 1,
      agentName: "James Chen", agentMobile: "0423 456 789",
      inspectionTimes: ["Wednesday 5:00-5:30pm", "Saturday 10:00-10:30am"],
      vaultreId: "VR002", status: "active" as const,
    },
    {
      address: "101 George Street", suburb: "Parramatta", state: "NSW", postcode: "2150",
      price: "$850/week", listingType: "rental" as const, bedrooms: 3, bathrooms: 2,
      agentName: "Emma Rodriguez", agentMobile: "0434 567 890",
      inspectionTimes: ["Thursday 12:00-12:30pm"],
      vaultreId: "VR003", status: "active" as const,
    },
  ];

  let added = 0;
  let updated = 0;
  for (const mock of mockListings) {
    const existing = await db.select({ id: listingsTable.id }).from(listingsTable)
      .where(and(eq(listingsTable.agencyId, agencyId), eq(listingsTable.vaultreId, mock.vaultreId!)));
    if (existing.length > 0) {
      await db.update(listingsTable).set(mock).where(eq(listingsTable.id, existing[0].id));
      updated++;
    } else {
      await db.insert(listingsTable).values({ agencyId, ...mock });
      added++;
    }
  }

  res.json({ synced: mockListings.length, added, updated, message: `Synced ${mockListings.length} listings from VaultRE` });
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
