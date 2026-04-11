import { Router, type IRouter } from "express";
import { MOCK_VAULT_SUMMARY } from "../lib/mockVault";

const router: IRouter = Router();

const IS_SIMULATION = process.env.DATABASE_MODE === "SIMULATION";

router.get("/system/status", (_req, res): void => {
  const stripeKey = process.env.STRIPE_KEY_ACTIVE ?? "";
  const stripeKeyType = !stripeKey
    ? "NOT_SET"
    : stripeKey.startsWith("sk_live_")
    ? "LIVE_SECRET"
    : stripeKey.startsWith("sk_test_")
    ? "TEST_SECRET"
    : stripeKey.startsWith("rk_")
    ? "RESTRICTED_KEY"
    : "UNKNOWN";

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
    stripeKeyType,
    timestamp: new Date().toISOString(),
  });
});

export default router;
