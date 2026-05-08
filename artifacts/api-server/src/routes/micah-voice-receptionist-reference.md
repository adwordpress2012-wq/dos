# Micah AI Voice Receptionist — Reference Configuration (Directive OS)

This file captures the full, tuned **reference configuration for Micah** — the Directive OS AI voice receptionist.
Use this as the starting point for any new client deployment or future project using **OpenAI Realtime API + Twilio**.

> Source of truth implementation: `artifacts/api-server/src/routes/voice.ts`

---

## Technical Stack

- **Model**: `gpt-4o-realtime-preview` via OpenAI Realtime API
- **Audio format**: `g711_ulaw` (in + out) — required for Twilio
- **Voice**: `coral` (warm, natural Australian female tone)
- **Transcription**: `whisper-1` for caller speech capture
- **Bridge**: Twilio Media Streams WebSocket ↔ OpenAI Realtime WebSocket
- **File**: `artifacts/api-server/src/routes/voice.ts`

---

## VAD Settings (Voice Activity Detection)

These control when Micah starts speaking after the caller finishes.

```ts
turn_detection: {
  type: "server_vad",
  silence_duration_ms: 2000,   // Wait 2 full seconds of silence before responding
  threshold: 0.6,              // Higher = less sensitive to ambient noise
  prefix_padding_ms: 300,      // Brief padding before Micah's audio starts
}
```

### Tuning notes

- If Micah still cuts in too fast → increase `silence_duration_ms` to 2200–2500
- If Micah is too slow → decrease to 1600–1800
- If she fires on background noise → increase `threshold` toward 0.7
- Do **NOT** go below 1200ms (she will talk over callers)

---

## Session Config (full)

```ts
session: {
  turn_detection: {
    type: "server_vad",
    silence_duration_ms: 2000,
    threshold: 0.6,
    prefix_padding_ms: 300,
  },
  input_audio_format: "g711_ulaw",
  output_audio_format: "g711_ulaw",
  input_audio_transcription: { model: "whisper-1" },
  voice: "coral",
  instructions: PERSONA_STRING,
  modalities: ["text", "audio"],
  temperature: 0.8,
}
```

---

## Directive OS Main Line Persona (DIRECTIVE_OS_PERSONA)

Used when `agencyId = 0` — i.e. calls to the Directive OS demo number (02 5850 4038).

### Key rules baked in

- **No pricing ever** — not $299, not any number. Redirect all pricing questions to Jayson.
- **Real estate enquiries → Jayson** — never answer property questions on the demo line.
- **One sentence per turn** — never chain thoughts; never fill silence after a question.
- **Do not interrupt** — wait for full silence before responding (VAD controls).
- **3-step mandatory wrap-up** — confirm details → next step → goodbye → STOP.

### Persona greeting

`"G'day! You've reached Directive OS — I'm Micah, how can I help you today?"`

### Pricing redirect (Directive OS cost)

`"I'll have Jayson send through all the details — he'll put together something specific for your business. Can I grab your name and best email?"`

### Real estate redirect

`"Jayson, our principal, handles all property enquiries personally — he's brilliant at making sure you get the full picture. Can I grab your name and best contact number so he can reach you directly?"`

### Call wrap-up (mandatory 3 steps)

1) `"Perfect — just to confirm, I've got [name], [number], and [email] — is that all correct?"`  
2) `"Jayson will give you a call back shortly, and you'll also get a quick summary of this call sent through."`  
3) `"It's been lovely chatting with you — have a wonderful day!"` → then STOP

---

## Agency Persona (buildAgencyPersona)

Used when `agencyId > 0` — calls to a registered client's dedicated Twilio number.
Built dynamically from the agency’s name and address.

### Compliance — Price Wall (Non‑Negotiable)

Micah MUST NEVER:

- State, confirm, suggest, or hint at any property price, price guide, rental yield, estimated value, outgoings, strata levy, council rate, lease term, or any dollar figure for any property
- This applies even if it’s published online, even if the caller insists

**The Pivot** (every time):

`"Great question! Jayson, our principal, will personally get back to you with all the pricing details — he likes to make sure you've got the full picture rather than a rushed figure over the phone. To make sure he reaches you, could I grab your name and best contact number?"`

---

## WebSocket Architecture (Twilio ↔ OpenAI)

Caller → Twilio → POST `/api/voice/incoming` → TwiML response  
Twilio opens WS → `/api/voice/media-stream`  
Server opens WS → OpenAI Realtime API  
Audio flows: Twilio (`g711_ulaw`) → OpenAI → back to Twilio → Caller

### CRITICAL: Host matching rule

TwiML MUST use `x-forwarded-host` to build the WebSocket URL.
Never hardcode `directiveos.com.au` (production proxy mismatch will break the WebSocket).

---

## Post‑Call Pipeline

After every call ends:

- Transcript saved → `transcripts` + `transcript_messages` DB tables
- Lead auto-extracted from speech (name/phone/email via regex + spoken format parsing)
- Lead type auto-classified: buyer / tenant / vendor / landlord / enquiry
- Stripe meter event `ai_voice_minutes` fired
- Transcript email sent to agency contact + `jayson@directiveos.com.au` + `adwordpress2012@gmail.com`

---

## Twilio Setup

- **Phone number**: 02 5850 4038 (Directive OS main demo line)
- **Webhook**: `https://directiveos.com.au/api/voice/incoming` (POST)
- **Calendly**: `https://calendly.com/adwordpress2012/directive-os-agency-onboarding`

### Owner contacts

- Jayson: `jayson@directiveos.com.au` / `adwordpress2012@gmail.com`

