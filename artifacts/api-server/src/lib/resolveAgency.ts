import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db, agenciesTable } from "@workspace/db";
import type { Request } from "express";

const JWT_SECRET = process.env.CLIENT_JWT_SECRET || "dos-client-fallback-secret-change-me";

type Agency = typeof agenciesTable.$inferSelect;

export async function resolveAgency(req: Request): Promise<Agency | null> {
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) {
    try {
      const payload = jwt.verify(auth.slice(7), JWT_SECRET) as { agencyId?: number };
      if (payload.agencyId) {
        const [agency] = await db.select().from(agenciesTable).where(eq(agenciesTable.id, payload.agencyId));
        return agency ?? null;
      }
    } catch {
    }
  }

  const clerkOrgId = req.headers["x-clerk-org-id"] as string | undefined;
  if (clerkOrgId) {
    const [agency] = await db.select().from(agenciesTable).where(eq(agenciesTable.clerkOrgId, clerkOrgId));
    return agency ?? null;
  }

  return null;
}
