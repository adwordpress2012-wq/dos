import { Router, type IRouter, type Request, type Response } from "express";
import WebSocket from "ws";
import Stripe from "stripe";
import OpenAI from "openai";
import { db, agenciesTable, transcriptsTable, transcriptMessagesTable, leadsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";

const router: IRouter = Router();

// ─── Constants ────────────────────────────────────────────────────────────────

const OPENAI_REALTIME_URL =
  "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview";

const AI_PERSONA = `You are Sarah, a professional Australian real estate receptionist for Directive OS. 
You are helping Jayson manage enquiries for commercial and residential properties in Western Sydney.
Speak with a natural, warm Australian manner. Keep responses concise — no more than 2-3 sentences.
Be extremely helpful and always offer a clear next step.

Your role:
- Welcome callers and identify whether they are a buyer, tenant, vendor, or landlord
- For buyers: gather suburb preference, budget, and bedroom count; offer to book an inspection
- For tenants: assist with rental enquiries; offer to email the NSW Fair Trading Tenancy Form
- For vendors and landlords: offer a free property appraisal with Jayson
- Always collect caller name, email, and phone number for follow-up
- If a caller wants to make an offer or is ready to proceed, say you will arrange an immediate callback from Jayson

Never make up specific property addresses or prices unless the caller provided them.
Use Australian spelling: "enquiry" not "inquiry", "authorise" not "authorize".
Do not use emojis or filler words. End every response with a question or next step.`;

// ─── TwiML Entry Point ────────────────────────────────────────────────────────

router.post("/voice/incoming", (req: Request, res: Response) => {
  // CRITICAL: The WebSocket host MUST match the host that served this TwiML response.
  // Twilio will connect the media-stream WebSocket back to whatever host we specify here.
  // Using x-forwarded-host ensures this works in both dev (replit.dev) and production.
  const forwardedHost = req.headers["x-forwarded-host"] as string | undefined;
  const rawHost = forwardedHost || req.headers.host || "directiveos.com.au";
  // Strip port from host — wss:// doesn't need it for standard TLS
  const host = rawHost.split(",")[0].trim().replace(/:\d+$/, "");

  const wsUrl = `wss://${host}/api/voice/media-stream`;

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="${wsUrl}" />
  </Connect>
</Response>`;

  console.log(`[VOICE] Incoming call → TwiML host=${host} wsUrl=${wsUrl}`);
  logger.info({ wsUrl, host }, "Incoming call — returning TwiML media stream");
  res.type("text/xml").send(twiml);
});

// ─── Call Session Tracker ─────────────────────────────────────────────────────

interface CallSession {
  streamSid: string | null;
  callSid: string | null;
  agencyId: number;
  startTime: number;
  transcript: Array<{ role: "user" | "assistant"; content: string }>;
  openaiWs: WebSocket;
  twilioWs: WebSocket;
}

// ─── WebSocket Bridge: Twilio ↔ OpenAI Realtime ───────────────────────────────

export function handleMediaStream(twilioWs: WebSocket): void {
  console.log("[VOICE] New Twilio media stream connection received");
  logger.info("New Twilio media stream connection received");

  if (!process.env.OPENAI_API_KEY) {
    console.error("[VOICE] FATAL: OPENAI_API_KEY is not set — closing connection");
    logger.error("OPENAI_API_KEY is not set");
    twilioWs.close();
    return;
  }

  console.log("[VOICE] Connecting to OpenAI Realtime API:", OPENAI_REALTIME_URL);

  const session: CallSession = {
    streamSid: null,
    callSid: null,
    agencyId: 1, // default demo agency; replace with lookup once auth is live
    startTime: Date.now(),
    transcript: [],
    openaiWs: new WebSocket(OPENAI_REALTIME_URL, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "OpenAI-Beta": "realtime=v1",
      },
    }),
    twilioWs,
  };

  // ── OpenAI Realtime session setup ──────────────────────────────────────────
  session.openaiWs.on("open", () => {
    console.log("[VOICE] OpenAI Realtime WebSocket connected successfully");
    logger.info("OpenAI Realtime WebSocket open");

    // Configure the session
    session.openaiWs.send(
      JSON.stringify({
        type: "session.update",
        session: {
          turn_detection: { type: "server_vad", silence_duration_ms: 800 },
          input_audio_format: "g711_ulaw",
          output_audio_format: "g711_ulaw",
          input_audio_transcription: { model: "whisper-1" },
          voice: "shimmer",
          instructions: AI_PERSONA,
          modalities: ["text", "audio"],
          temperature: 0.7,
        },
      }),
    );

    // Send greeting trigger
    session.openaiWs.send(
      JSON.stringify({
        type: "conversation.item.create",
        item: {
          type: "message",
          role: "user",
          content: [
            {
              type: "input_text",
              text: "Greet the caller warmly and ask how you can help them today.",
            },
          ],
        },
      }),
    );
    session.openaiWs.send(JSON.stringify({ type: "response.create" }));
  });

  // ── OpenAI → Twilio audio relay ────────────────────────────────────────────
  session.openaiWs.on("message", (raw: Buffer) => {
    try {
      const event = JSON.parse(raw.toString());

      // Stream audio back to the caller via Twilio
      if (event.type === "response.audio.delta" && event.delta && session.streamSid) {
        const twilioMsg = JSON.stringify({
          event: "media",
          streamSid: session.streamSid,
          media: { payload: event.delta },
        });
        if (twilioWs.readyState === WebSocket.OPEN) {
          twilioWs.send(twilioMsg);
        }
      }

      // Capture assistant speech transcript
      if (event.type === "response.audio_transcript.done" && event.transcript) {
        session.transcript.push({ role: "assistant", content: event.transcript });
        logger.info({ content: event.transcript.substring(0, 80) }, "Sarah spoke");
      }

      // Capture user speech transcript
      if (
        event.type === "conversation.item.input_audio_transcription.completed" &&
        event.transcript
      ) {
        session.transcript.push({ role: "user", content: event.transcript });
        logger.info({ content: event.transcript.substring(0, 80) }, "Caller spoke");
      }

      // Log OpenAI errors explicitly so we can see them
      if (event.type === "error") {
        logger.error({ openaiError: event.error }, "OpenAI Realtime API error event");
      }
    } catch (err) {
      logger.warn({ err }, "Failed to parse OpenAI Realtime message");
    }
  });

  session.openaiWs.on("error", (err) => {
    console.error("[VOICE] OpenAI Realtime WebSocket error:", err);
    logger.error({ err }, "OpenAI Realtime WebSocket error");
  });

  session.openaiWs.on("close", (code, reason) => {
    console.log(`[VOICE] OpenAI WebSocket closed — code=${code} reason=${reason.toString()}`);
    logger.info({ code, reason: reason.toString() }, "OpenAI WebSocket closed");
  });

  // ── Twilio → OpenAI audio relay ────────────────────────────────────────────
  twilioWs.on("message", (raw: Buffer) => {
    try {
      const msg = JSON.parse(raw.toString());

      if (msg.event === "start") {
        session.streamSid = msg.start.streamSid;
        session.callSid = msg.start.callSid ?? null;
        session.startTime = Date.now();
        console.log(`[VOICE] Twilio stream started — streamSid=${session.streamSid} callSid=${session.callSid}`);
        logger.info({ streamSid: session.streamSid, callSid: session.callSid }, "Twilio stream started");
      }

      if (msg.event === "media" && session.openaiWs.readyState === WebSocket.OPEN) {
        session.openaiWs.send(
          JSON.stringify({
            type: "input_audio_buffer.append",
            audio: msg.media.payload,
          }),
        );
      }

      if (msg.event === "stop") {
        logger.info({ streamSid: session.streamSid }, "Twilio stream stopped");
        session.openaiWs.close();
      }
    } catch (err) {
      logger.warn({ err }, "Failed to parse Twilio message");
    }
  });

  // ── Cleanup and billing on call end ───────────────────────────────────────
  twilioWs.on("close", () => {
    console.log("[VOICE] Twilio WebSocket closed — cleaning up session");
    // Only close OpenAI if it's in a closeable state (not CONNECTING=0)
    if (session.openaiWs.readyState !== WebSocket.CONNECTING) {
      session.openaiWs.close();
    } else {
      // If still connecting, terminate immediately to avoid "closed before established" error
      session.openaiWs.terminate();
    }
    void onCallEnd(session);
  });

  session.openaiWs.on("close", () => {
    console.log("[VOICE] OpenAI WebSocket closed — closing Twilio if still open");
    if (twilioWs.readyState === WebSocket.OPEN) twilioWs.close();
  });
}

// ─── Post-Call: Save Transcript + Capture Lead + Stripe Billing ──────────────

async function onCallEnd(session: CallSession): Promise<void> {
  const durationSeconds = Math.round((Date.now() - session.startTime) / 1000);
  const durationMinutes = durationSeconds / 60;

  logger.info(
    { durationSeconds, transcriptMessages: session.transcript.length },
    "Call ended — processing transcript and billing",
  );

  try {
    // ── Detect contact info from transcript ──────────────────────────────────
    const fullText = session.transcript.map((m) => m.content).join(" ").toLowerCase();
    const emailMatch = fullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = fullText.match(/(\+?61|0)[0-9 ]{8,12}/);
    const nameMatch = fullText.match(/(?:my name is|i(?:'m| am)) ([a-z]+(?: [a-z]+)?)/i);

    const callerName = nameMatch ? nameMatch[1].replace(/\b\w/g, (c) => c.toUpperCase()) : "Phone Caller";
    const callerEmail = emailMatch?.[0] ?? null;
    const callerPhone = phoneMatch?.[0] ?? null;

    const leadType = fullText.includes("buy") || fullText.includes("purchas") ? "buyer"
      : fullText.includes("rent") || fullText.includes("tenant") ? "tenant"
      : fullText.includes("sell") || fullText.includes("vendor") ? "vendor"
      : fullText.includes("landlord") || fullText.includes("manag") ? "landlord"
      : "enquiry";

    // ── Save lead ────────────────────────────────────────────────────────────
    let leadId: number | null = null;
    if (callerEmail || callerPhone) {
      const [lead] = await db
        .insert(leadsTable)
        .values({
          agencyId: session.agencyId,
          name: callerName,
          email: callerEmail,
          phone: callerPhone,
          leadType,
          status: "new",
          channel: "voice",
          hotLead: false,
          notes: `Voice call — ${durationSeconds}s — Stream: ${session.streamSid ?? "unknown"}`,
        })
        .returning();
      leadId = lead.id;
      logger.info({ leadId, callerName, callerEmail }, "Voice lead saved");
    }

    // ── Save transcript ──────────────────────────────────────────────────────
    if (session.transcript.length > 0) {
      const [savedTranscript] = await db
        .insert(transcriptsTable)
        .values({
          agencyId: session.agencyId,
          leadId,
          leadName: callerName,
          channel: "voice",
          duration: durationSeconds,
          summary: `Voice call with ${callerName} — ${Math.round(durationMinutes)}m ${durationSeconds % 60}s`,
        })
        .returning();

      await db.insert(transcriptMessagesTable).values(
        session.transcript.map((m) => ({
          transcriptId: savedTranscript.id,
          role: m.role,
          content: m.content,
          timestamp: new Date(),
        })),
      );

      logger.info({ transcriptId: savedTranscript.id }, "Voice transcript saved");
    }

    // ── Stripe usage billing — $25 per 10-minute block ───────────────────────
    const stripeKey = process.env.STRIPE_KEY_ACTIVE;
    if (stripeKey && durationMinutes >= 1) {
      try {
        const [agency] = await db
          .select({ stripeCustomerId: agenciesTable.stripeCustomerId })
          .from(agenciesTable)
          .where(eq(agenciesTable.id, session.agencyId));

        if (agency?.stripeCustomerId) {
          const tenMinBlocks = Math.ceil(durationMinutes / 10);
          const stripe = new Stripe(stripeKey, { apiVersion: "2025-03-31.basil" });

          await stripe.billing.meterEvents.create({
            event_name: "ai_voice_minutes",
            payload: {
              stripe_customer_id: agency.stripeCustomerId,
              value: String(Math.ceil(durationMinutes)),
            },
          });

          logger.info(
            { blocks: tenMinBlocks, durationMinutes },
            "Stripe voice usage reported",
          );
        }
      } catch (err) {
        logger.warn({ err }, "Failed to report Stripe voice usage");
      }
    }
  } catch (err) {
    logger.error({ err }, "Failed to process call end");
  }
}

export default router;
