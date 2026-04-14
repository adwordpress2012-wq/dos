# Sarah AI Voice Receptionist — Reference Configuration

This file captures the full, tuned configuration for Sarah — the Directive OS AI voice receptionist. Use this as the starting point for any new client deployment or future project using OpenAI Realtime API + Twilio.

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

These control when Sarah starts speaking after the caller finishes. Tuned to avoid cutting in too early.

```typescript
turn_detection: {
  type: "server_vad",
  silence_duration_ms: 2000,   // Wait 2 full seconds of silence before responding
  threshold: 0.6,               // Slightly higher = less sensitive to ambient noise
  prefix_padding_ms: 300,       // Brief padding before Sarah's audio starts
}
```

**Tuning notes:**
- If Sarah still cuts in too fast → increase `silence_duration_ms` to 2200–2500
- If Sarah is too slow to respond → decrease to 1600–1800
- If she fires on background noise → increase `threshold` toward 0.7
- Do NOT go below 1200ms — she will talk over callers

---

## Session Config (full)

```typescript
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

### Key rules baked in:
1. **No pricing ever** — not $299, not any number. Redirect all pricing questions to Jayson.
2. **Real estate enquiries → Jayson** — never try to answer property questions on the demo line.
3. **One sentence per turn** — never chain thoughts, never fill silence after a question.
4. **Do not interrupt** — wait for full silence before responding.
5. **3-step mandatory wrap-up** — confirm details → next step → goodbye → STOP.

### Persona greeting:
> "G'day! You've reached Directive OS — I'm Sarah, how can I help you today?"

### Pricing redirect (when asked about Directive OS cost):
> "I'll have Jayson send through all the details — he'll put together something specific for your business. Can I grab your name and best email?"

### Real estate redirect:
> "Jayson, our principal, handles all property enquiries personally — he's brilliant at making sure you get the full picture. Can I grab your name and best contact number so he can reach you directly?"

### Call wrap-up (mandatory 3 steps in order):
1. "Perfect — just to confirm, I've got [name], [number], and [email] — is that all correct?"
2. "Jayson will give you a call back shortly, and you'll also get a quick summary of this call sent through."
3. "It's been lovely chatting with you — have a wonderful day!"
→ Then STOP. No more words.

---

## Agency Persona (buildAgencyPersona)

Used when `agencyId > 0` — calls to a registered client's dedicated Twilio number. Built dynamically from the agency's name and address.

### Key rules baked in:
1. **The Price Wall** — NEVER quote any property price, price guide, rental yield, estimated value, or dollar figure. Zero exceptions. This is a legal compliance requirement (NSW Fair Trading underquoting laws).
2. **The Pivot** — every price question uses: "Jayson, our principal, will personally get back to you with all the pricing details..."
3. **The Gold Questions** — ask all three naturally during every buyer/vendor call:
   - "Are you looking for a property to live in, or is this more of an investment?"
   - "Do you have a property you need to sell before you can move forward?"
   - "Have you got your finance approved, or are you still working through that?"
4. **Caller classification** — buyer / tenant / vendor / landlord
5. **Email collection** — accepts spoken format ("john at gmail dot com"), confirms back

### Agency greeting:
> "Thanks for calling [Agency Name] — I'm Sarah, how can I help you today?"

### Same 3-step wrap-up as main line persona.

---

## WebSocket Architecture (Twilio ↔ OpenAI)

```
Caller → Twilio → POST /api/voice/incoming → TwiML response
Twilio opens WS → /api/voice/media-stream
Server opens WS → OpenAI Realtime API
Audio flows: Twilio (g711_ulaw) → OpenAI → back to Twilio → Caller
```

### CRITICAL: Host matching rule
TwiML MUST use `x-forwarded-host` header to build the WebSocket URL:
```typescript
const forwardedHost = req.headers["x-forwarded-host"] as string;
const wsUrl = `wss://${host}/api/voice/media-stream`;
```
NEVER hardcode `directiveos.com.au` — production proxy mismatch will break the WebSocket.

---

## Post-Call Pipeline

After every call ends:
1. Transcript saved → `transcripts` + `transcript_messages` DB tables
2. Lead auto-extracted from speech (name, phone, email via regex + spoken format parsing)
3. Lead type auto-classified: buyer / tenant / vendor / landlord / enquiry
4. Stripe meter event `ai_voice_minutes` fired
5. Transcript email sent to agency contact + jayson@directiveos.com.au + adwordpress2012@gmail.com

---

## Compliance — Price Wall (Non-Negotiable)

Sarah MUST NEVER:
- State, confirm, suggest, or hint at any property price, price guide, rental yield, appraisal value, outgoings, strata levy, council rate, lease term, or any dollar figure for any property
- This applies even if the figure is published online, even if the caller already knows it

**Legal basis**: Quoting/confirming an incorrect price guide is an underquoting offence under the *Property and Stock Agents Act 2002 (NSW)* and equivalent state legislation. Penalties include licence suspension, fines, and civil liability.

**Test after every persona change**: Ask "What's the price guide for [property]?" and push back with "just give me a rough idea." If Sarah answers with a number, the guardrail has failed.

---

## Twilio Setup

- **Phone number**: 02 5850 4038 (Directive OS main demo line)
- **Webhook**: `https://directiveos.com.au/api/voice/incoming` (POST)
- **Calendly for bookings**: https://calendly.com/adwordpress2012/directive-os-agency-onboarding

## Owner contacts
- Jayson: jayson@directiveos.com.au / adwordpress2012@gmail.com
- Admin secret: `directive-captain-2024`
