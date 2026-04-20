import { Router, type Request, type Response } from "express";
import { z } from "zod";
import { db, agenciesTable } from "@workspace/db";
import { logger } from "../lib/logger";

const router = Router();

// ─── Zod schema — mirrors client-side ProspectSchema in get-started.tsx ──────

export const ProspectCaptureBody = z.object({
  name:        z.string().min(2,  "Name must be at least 2 characters"),
  email:       z.string().email("Please enter a valid email address"),
  agencyName:  z.string().min(2,  "Agency name must be at least 2 characters"),
});

export type ProspectCaptureBody = z.infer<typeof ProspectCaptureBody>;

// ─── POST /api/prospects ─────────────────────────────────────────────────────
// Public — no auth required. Called from the /get-started landing page before
// the user enters the full /onboard wizard. Inserts a lightweight "pending"
// agency row so the lead is captured in the DB immediately.

router.post("/prospects", async (req: Request, res: Response): Promise<void> => {
  const parsed = ProspectCaptureBody.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      error: "Validation failed",
      issues: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  const { name, email, agencyName } = parsed.data;

  try {
    // Return existing record if this email has already started onboarding
    const existing = await db.select().from(agenciesTable);
    const duplicate = existing.find(
      (a) => a.contactEmail.toLowerCase() === email.toLowerCase(),
    );

    if (duplicate) {
      logger.info(
        { email, agencyId: duplicate.id },
        "Prospect already exists — returning existing record",
      );
      res.status(200).json({ ok: true, prospectId: duplicate.id, existing: true });
      return;
    }

    // clerkOrgId is a temporary placeholder — overwritten during /onboard
    const clerkOrgId = `prospect_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const [prospect] = await db
      .insert(agenciesTable)
      .values({
        clerkOrgId,
        name:               agencyName.trim(),
        abn:                "pending",        // collected in /onboard Step 1
        contactEmail:       email.toLowerCase().trim(),
        subscriptionStatus: "pending",
        setupFeePaid:       false,
        termsAccepted:      false,
        seatCount:          1,
        aiMinutesUsed:      0,
        aiMinutesIncluded:  100,
      })
      .returning();

    logger.info(
      { prospectId: prospect.id, agencyName, email, name },
      "Prospect lead captured from /get-started",
    );

    res.status(201).json({ ok: true, prospectId: prospect.id, existing: false });
  } catch (err) {
    logger.error({ err, email, agencyName }, "Failed to save prospect lead");
    res.status(500).json({ error: "Failed to save lead — please try again" });
  }
});

export default router;
