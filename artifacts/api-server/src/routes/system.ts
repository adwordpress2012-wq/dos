import { Router, type IRouter } from "express";
import { MOCK_VAULT_SUMMARY } from "../lib/mockVault";

const router: IRouter = Router();

const IS_SIMULATION = process.env.DATABASE_MODE === "SIMULATION";

router.get("/system/status", (_req, res): void => {
  res.json({
    mode: IS_SIMULATION ? "SIMULATION" : "LIVE",
    status: "ACTIVE",
    label: IS_SIMULATION ? "ACTIVE (SIMULATED)" : "ACTIVE (LIVE)",
    vaultReBridge: IS_SIMULATION ? "SIMULATION" : "LIVE",
    aiEngine: "GPT-4o",
    voiceEngine: "Vapi.ai",
    infrastructure: "Australian Cloud (ap-southeast-2)",
    databaseMode: process.env.DATABASE_MODE ?? "LIVE",
    mockVaultSummary: IS_SIMULATION ? MOCK_VAULT_SUMMARY : null,
    timestamp: new Date().toISOString(),
  });
});

export default router;
