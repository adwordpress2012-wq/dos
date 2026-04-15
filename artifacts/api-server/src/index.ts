import { WebSocketServer } from "ws";
import cron from "node-cron";
import app from "./app";
import { handleMediaStream } from "./routes/voice";
import { logger } from "./lib/logger";
import { runWeeklyProspector, runLocalProspector } from "./lib/prospector";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const server = app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});

// Attach WebSocket server for Twilio media streams
// Twilio will connect to wss://directiveos.com.au/api/voice/media-stream
const wss = new WebSocketServer({ server, path: "/api/voice/media-stream" });

wss.on("connection", (ws, req) => {
  const origin = req.headers.origin ?? "unknown";
  const ip = req.socket.remoteAddress ?? "unknown";
  console.log(`[VOICE] Twilio WebSocket connected — origin=${origin} ip=${ip}`);
  logger.info({ origin, ip }, "New Twilio media stream WebSocket connection");
  handleMediaStream(ws);
});

wss.on("error", (err) => {
  logger.error({ err }, "WebSocket server error");
});

// ─── Prospect Lists — Monday & Wednesday 7am AEST ────────────────────────────
// 7am AEST = 21:00 UTC the night before (UTC+10)

// Monday 7am AEST — Multicultural Sydney suburbs
cron.schedule("0 21 * * 0", () => {
  logger.info("Cron: running Monday Sydney prospect list");
  void runWeeklyProspector();
}, { timezone: "UTC" });

// Wednesday 7am AEST — Jayson's local Western Sydney area
cron.schedule("0 21 * * 2", () => {
  logger.info("Cron: running Wednesday local prospect list");
  void runLocalProspector();
}, { timezone: "UTC" });

logger.info("Prospect lists scheduled — Monday & Wednesday 7am AEST");
