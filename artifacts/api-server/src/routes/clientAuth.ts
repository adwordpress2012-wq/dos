import { Router, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db, agenciesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: Router = Router();

const JWT_SECRET = process.env.CLIENT_JWT_SECRET || "dos-client-fallback-secret-change-me";

function generatePassword(length = 12): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
  let pass = "";
  for (let i = 0; i < length; i++) pass += chars[Math.floor(Math.random() * chars.length)];
  return pass;
}

async function sendPasswordEmail(email: string, agencyName: string, password: string, isReset = false) {
  const apiKey = process.env.DOS_RESEND_KEY || process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const subject = isReset
    ? "Your Directive OS Command Centre — Password Reset"
    : "Your Directive OS Command Centre is Live";

  const intro = isReset
    ? `Your password has been reset by the Directive OS team.`
    : `Your Command Centre is set up and ready to use. Below are your login credentials.`;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Directive OS <leads@directiveos.com.au>",
      to: [email],
      cc: ["jayson@directiveos.com.au", "adwordpress2012@gmail.com"],
      subject,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0a0e1a;color:#f0f0f0;padding:40px;border-radius:12px;">
          <div style="color:#00d1b2;font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px;">DIRECTIVE OS</div>
          <h2 style="color:#fff;margin:0 0 20px;font-size:22px;">${subject}</h2>
          <p style="color:#a0aec0;margin-bottom:24px;">${intro}</p>

          <div style="background:#131929;border:1px solid #1e2d45;border-radius:8px;padding:24px;margin-bottom:24px;">
            <div style="margin-bottom:16px;">
              <div style="color:#555;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px;">AGENCY</div>
              <div style="color:#fff;font-weight:600;">${agencyName}</div>
            </div>
            <div style="margin-bottom:16px;">
              <div style="color:#555;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px;">LOGIN URL</div>
              <div style="color:#00d1b2;font-weight:600;">directiveos.com.au/dashboard</div>
            </div>
            <div style="margin-bottom:16px;">
              <div style="color:#555;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px;">EMAIL</div>
              <div style="color:#fff;font-weight:600;">${email}</div>
            </div>
            <div>
              <div style="color:#555;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px;">PASSWORD</div>
              <div style="color:#00d1b2;font-weight:700;font-size:18px;letter-spacing:2px;font-family:monospace;">${password}</div>
            </div>
          </div>

          <a href="https://directiveos.com.au/dashboard" style="display:inline-block;background:#00d1b2;color:#040912;font-weight:800;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:15px;margin-bottom:24px;">
            Open My Command Centre →
          </a>

          <p style="color:#4a5568;font-size:13px;margin-top:24px;border-top:1px solid #1e2d45;padding-top:16px;">
            Keep this email safe. If you need help, contact us at support@directiveos.com.au
            <br/>Directive OS · ABN 87 754 544 171 · directiveos.com.au
          </p>
        </div>
      `,
    }),
  });
}

export { sendPasswordEmail, generatePassword };

router.post("/client/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email: string; password: string };
  if (!email || !password) {
    res.status(400).json({ ok: false, error: "Email and password required" });
    return;
  }

  const rows = await db.select().from(agenciesTable).where(eq(agenciesTable.contactEmail, email.toLowerCase().trim()));
  const agency = rows[0];

  if (!agency || !agency.passwordHash) {
    res.status(401).json({ ok: false, error: "Invalid email or password" });
    return;
  }

  const valid = await bcrypt.compare(password, agency.passwordHash);
  if (!valid) {
    res.status(401).json({ ok: false, error: "Invalid email or password" });
    return;
  }

  const token = jwt.sign({ agencyId: agency.id, email: agency.contactEmail }, JWT_SECRET, { expiresIn: "30d" });
  res.json({
    ok: true,
    token,
    agency: { id: agency.id, name: agency.name, contactEmail: agency.contactEmail, subscriptionStatus: agency.subscriptionStatus },
  });
});

router.get("/client/me", async (req: Request, res: Response): Promise<void> => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ ok: false, error: "Not authenticated" });
    return;
  }

  try {
    const payload = jwt.verify(auth.slice(7), JWT_SECRET) as { agencyId: number };
    const rows = await db.select().from(agenciesTable).where(eq(agenciesTable.id, payload.agencyId));
    const agency = rows[0];
    if (!agency) {
      res.status(401).json({ ok: false, error: "Agency not found" });
      return;
    }
    res.json({
      ok: true,
      agency: {
        id: agency.id,
        name: agency.name,
        contactEmail: agency.contactEmail,
        subscriptionStatus: agency.subscriptionStatus,
        clerkOrgId: agency.clerkOrgId,
      },
    });
  } catch {
    res.status(401).json({ ok: false, error: "Invalid or expired session" });
  }
});

export default router;
