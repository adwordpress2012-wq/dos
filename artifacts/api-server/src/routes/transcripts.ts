import { Router, type IRouter } from "express";
import { eq, and, desc } from "drizzle-orm";
import { db, agenciesTable, transcriptsTable, transcriptMessagesTable } from "@workspace/db";
import {
  GetTranscriptParams,
  GetTranscriptsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

async function getAgencyId(clerkOrgId: string): Promise<number | null> {
  const [agency] = await db.select({ id: agenciesTable.id }).from(agenciesTable).where(eq(agenciesTable.clerkOrgId, clerkOrgId));
  return agency?.id ?? null;
}

router.get("/transcripts", async (req, res): Promise<void> => {
  const clerkOrgId = req.headers["x-clerk-org-id"] as string | undefined;
  if (!clerkOrgId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const agencyId = await getAgencyId(clerkOrgId);
  if (!agencyId) { res.status(404).json({ error: "Agency not found" }); return; }
  const query = GetTranscriptsQueryParams.safeParse(req.query);
  let transcripts = await db.select().from(transcriptsTable)
    .where(eq(transcriptsTable.agencyId, agencyId))
    .orderBy(desc(transcriptsTable.createdAt));
  if (query.success) {
    if (query.data.channel) transcripts = transcripts.filter(t => t.channel === query.data.channel);
    if (query.data.leadId) transcripts = transcripts.filter(t => t.leadId === query.data.leadId);
  }
  res.json(transcripts);
});

router.get("/transcripts/:id", async (req, res): Promise<void> => {
  const clerkOrgId = req.headers["x-clerk-org-id"] as string | undefined;
  if (!clerkOrgId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const agencyId = await getAgencyId(clerkOrgId);
  if (!agencyId) { res.status(404).json({ error: "Agency not found" }); return; }
  const params = GetTranscriptParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [transcript] = await db.select().from(transcriptsTable)
    .where(and(eq(transcriptsTable.id, params.data.id), eq(transcriptsTable.agencyId, agencyId)));
  if (!transcript) { res.status(404).json({ error: "Transcript not found" }); return; }
  const messages = await db.select().from(transcriptMessagesTable)
    .where(eq(transcriptMessagesTable.transcriptId, params.data.id))
    .orderBy(transcriptMessagesTable.timestamp);
  res.json({ ...transcript, messages });
});

export default router;
