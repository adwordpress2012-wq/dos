import { WebSocketServer } from "ws";
import app from "./app";
import { handleMediaStream } from "./routes/voice";
import { logger } from "./lib/logger";

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

wss.on("connection", (ws) => {
  logger.info("New Twilio media stream WebSocket connection");
  handleMediaStream(ws);
});

wss.on("error", (err) => {
  logger.error({ err }, "WebSocket server error");
});
