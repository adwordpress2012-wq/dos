import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { eq, desc, and, gte, sql } from "drizzle-orm";
import { db, agenciesTable, leadsTable, transcriptsTable, transcriptMessagesTable } from "@workspace/db";

const router: IRouter = Router();

async function getAgencyByToken(token: string) {
  const [agency] = await db.select().from(agenciesTable).where(eq(agenciesTable.mobileToken, token));
  return agency ?? null;
}

function mobileAuth(req: Request, res: Response, next: NextFunction) {
  const token = (req.headers["x-mobile-token"] as string | undefined)?.trim();
  if (!token) { res.status(401).json({ error: "x-mobile-token header required" }); return; }
  (req as any).mobileToken = token;
  next();
}

router.post("/mobile/login", async (req, res): Promise<void> => {
  const { token } = req.body as { token?: string };
  if (!token) { res.status(400).json({ error: "token is required" }); return; }
  const agency = await getAgencyByToken(token.trim());
  if (!agency) { res.status(401).json({ error: "Invalid token" }); return; }
  res.json({
    token: agency.mobileToken,
    agency: {
      id: agency.id,
      name: agency.name,
      contactPhone: agency.contactPhone,
      subscriptionStatus: agency.subscriptionStatus,
      aiMinutesUsed: agency.aiMinutesUsed,
      aiMinutesIncluded: agency.aiMinutesIncluded,
    },
  });
});

router.get("/mobile/dashboard", mobileAuth, async (req: Request, res: Response): Promise<void> => {
  const token = (req as any).mobileToken as string;
  const agency = await getAgencyByToken(token);
  if (!agency) { res.status(401).json({ error: "Invalid token" }); return; }

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastNight = new Date(); lastNight.setHours(0, 0, 0, 0); lastNight.setDate(lastNight.getDate() - 1);

  const [totalLeads] = await db.select({ count: sql<number>`count(*)` }).from(leadsTable).where(eq(leadsTable.agencyId, agency.id));
  const [hotLeads] = await db.select({ count: sql<number>`count(*)` }).from(leadsTable).where(and(eq(leadsTable.agencyId, agency.id), eq(leadsTable.hotLead, true)));
  const [newLastNight] = await db.select({ count: sql<number>`count(*)` }).from(leadsTable).where(and(eq(leadsTable.agencyId, agency.id), gte(leadsTable.createdAt, lastNight)));
  const [aiCalls] = await db.select({ count: sql<number>`count(*)` }).from(transcriptsTable).where(and(eq(transcriptsTable.agencyId, agency.id), eq(transcriptsTable.channel, "voice"), gte(transcriptsTable.createdAt, monthStart)));

  res.json({
    agencyName: agency.name,
    leadsThisMonth: Number(totalLeads.count),
    hotLeads: Number(hotLeads.count),
    aiCallsHandled: Number(aiCalls.count),
    newLastNight: Number(newLastNight.count),
    aiMinutesUsed: agency.aiMinutesUsed,
    aiMinutesIncluded: agency.aiMinutesIncluded,
    estimatedValue: null,
  });
});

router.get("/mobile/leads", mobileAuth, async (req: Request, res: Response): Promise<void> => {
  const token = (req as any).mobileToken as string;
  const agency = await getAgencyByToken(token);
  if (!agency) { res.status(401).json({ error: "Invalid token" }); return; }

  const leads = await db.select().from(leadsTable)
    .where(eq(leadsTable.agencyId, agency.id))
    .orderBy(desc(leadsTable.createdAt))
    .limit(50);
  res.json(leads);
});

router.patch("/mobile/leads/:id", mobileAuth, async (req: Request, res: Response): Promise<void> => {
  const token = (req as any).mobileToken as string;
  const agency = await getAgencyByToken(token);
  if (!agency) { res.status(401).json({ error: "Invalid token" }); return; }

  const leadId = parseInt(req.params.id, 10);
  const { status } = req.body as { status?: string };
  if (!status) { res.status(400).json({ error: "status required" }); return; }

  const [lead] = await db.update(leadsTable)
    .set({ status: status as any })
    .where(and(eq(leadsTable.id, leadId), eq(leadsTable.agencyId, agency.id)))
    .returning();
  if (!lead) { res.status(404).json({ error: "Lead not found" }); return; }
  res.json(lead);
});

router.get("/mobile/transcripts", mobileAuth, async (req: Request, res: Response): Promise<void> => {
  const token = (req as any).mobileToken as string;
  const agency = await getAgencyByToken(token);
  if (!agency) { res.status(401).json({ error: "Invalid token" }); return; }

  const transcripts = await db.select().from(transcriptsTable)
    .where(eq(transcriptsTable.agencyId, agency.id))
    .orderBy(desc(transcriptsTable.createdAt))
    .limit(50);
  res.json(transcripts);
});

router.get("/mobile/transcripts/:id/messages", mobileAuth, async (req: Request, res: Response): Promise<void> => {
  const token = (req as any).mobileToken as string;
  const agency = await getAgencyByToken(token);
  if (!agency) { res.status(401).json({ error: "Invalid token" }); return; }

  const transcriptId = parseInt(req.params.id, 10);
  const [transcript] = await db.select().from(transcriptsTable)
    .where(and(eq(transcriptsTable.id, transcriptId), eq(transcriptsTable.agencyId, agency.id)));
  if (!transcript) { res.status(404).json({ error: "Not found" }); return; }

  const messages = await db.select().from(transcriptMessagesTable)
    .where(eq(transcriptMessagesTable.transcriptId, transcriptId))
    .orderBy(transcriptMessagesTable.createdAt);

  res.json({ transcript, messages });
});

router.get("/mobile/activity", mobileAuth, async (req: Request, res: Response): Promise<void> => {
  const token = (req as any).mobileToken as string;
  const agency = await getAgencyByToken(token);
  if (!agency) { res.status(401).json({ error: "Invalid token" }); return; }

  const since = new Date(); since.setDate(since.getDate() - 7);

  const recentLeads = await db.select().from(leadsTable)
    .where(and(eq(leadsTable.agencyId, agency.id), gte(leadsTable.createdAt, since)))
    .orderBy(desc(leadsTable.createdAt))
    .limit(30);

  const recentTranscripts = await db.select().from(transcriptsTable)
    .where(and(eq(transcriptsTable.agencyId, agency.id), gte(transcriptsTable.createdAt, since)))
    .orderBy(desc(transcriptsTable.createdAt))
    .limit(30);

  type ActivityItem = { id: string; type: string; description: string; detail?: string; time: string; channel: string; sortDate: Date };
  const items: ActivityItem[] = [];

  for (const t of recentTranscripts) {
    items.push({
      id: `call-${t.id}`,
      type: "call_answered",
      description: `Answered ${t.channel} from ${t.callerName ?? "Unknown"}`,
      detail: t.summary ?? undefined,
      time: t.createdAt.toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" }),
      channel: t.channel ?? "voice",
      sortDate: t.createdAt,
    });
  }

  for (const l of recentLeads) {
    items.push({
      id: `lead-${l.id}`,
      type: "lead_captured",
      description: `New lead — ${l.name}`,
      detail: l.notes ?? l.leadType ?? undefined,
      time: l.createdAt.toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" }),
      channel: l.channel ?? "voice",
      sortDate: l.createdAt,
    });
  }

  items.sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime());

  res.json(items.slice(0, 40).map(({ sortDate: _s, ...rest }) => rest));
});

export default router;
