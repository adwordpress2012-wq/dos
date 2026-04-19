# Directive OS — Full Build Document

**Platform**: AI Receptionist SaaS for Australian Real Estate Agencies
**Live URL**: https://directiveos.com.au
**Australian AI Receptionist Phone**: 02 5850 4038
**Last Updated**: April 2026

---

## 1. What We Built

Directive OS is a white-label AI receptionist platform built specifically for Australian real estate agencies. It replaces the front desk — answering inbound calls 24/7, qualifying leads, syncing with the agency's CRM, and routing hot buyers directly to agents in real time.

### Key Product Features

| Feature | Status |
|---|---|
| Marketing homepage with live AI chat | Live |
| Live AI phone receptionist (Sarah) | Live — calls 02 5850 4038 |
| 3-step agency onboarding wizard | Live |
| Stripe billing — $1,500 setup + $299/mo | Live |
| Afterpay for setup fee | Live |
| Klarna for subscription | Live |
| Multi-page Command Bridge dashboard | Live |
| Lead inbox + auto-qualification | Live |
| Call transcripts (voice + chat) | Live |
| Property listings management | Live |
| VaultRE CRM sync (simulation mode) | Live (demo) |
| Staff / seat management | Live |
| NSW tenancy automation | In progress |
| Clerk Auth (real multi-tenant login) | Pending — see Next Steps |

---

## 2. Full Architecture

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + Tailwind CSS + Wouter router |
| Backend API | Express 5 + TypeScript |
| Database ORM | Drizzle ORM |
| Database | PostgreSQL (Replit managed) |
| API Spec | OpenAPI 3.1 |
| API Client | Orval (generated React Query hooks) |
| Schema validation | Zod |
| Monorepo | pnpm workspaces |

### Repository Layout

```
artifacts/
  directive-os/       Frontend (React app)
  api-server/         API + WebSocket server
lib/
  db/                 Drizzle schema + migrations
  api-spec/           OpenAPI YAML
  api-client-react/   Orval-generated hooks
  api-zod/            Zod request/response schemas
```

### Design System

- Background: Deep Navy (`#0a0e1a`)
- Accent: Emerald Green (`#00d1b2`)
- Style: Glassmorphism cards, no emojis, professional tone
- Demo organisation: "Pinnacle Real Estate" (`org_demo_001`)

---

## 3. AI Tools & Services Used

### 3.1 OpenAI — GPT-4o-mini (Live Chat Receptionist)

**Used for**: The chat widget on the homepage and inside the dashboard. Visitors and agencies can type questions in real time and Sarah responds.

- **Model**: `gpt-4o-mini`
- **Route**: `POST /api/ai/chat`
- **Sarah persona**: Warm Australian personality — uses "reckon", "heaps", "arvo", "no worries", "cheers". Qualifies buyer / tenant / vendor / landlord. Collects name, email, phone.
- **Saves**: Chat transcripts to DB + creates leads automatically if contact details detected
- **Files**: `artifacts/api-server/src/routes/ai.ts`

### 3.2 OpenAI — GPT-4o Realtime API (Live Voice Receptionist)

**Used for**: The actual phone receptionist. When someone calls 02 5850 4038, they speak directly to Sarah in real time.

- **Model**: `gpt-4o-realtime-preview`
- **Voice**: `shimmer` (warm, natural-sounding female Australian voice)
- **Transcription**: `whisper-1` (captures caller speech into transcript records)
- **Protocol**: OpenAI Realtime API over WebSocket (`wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview`)
- **VAD (Voice Activity Detection)**: `silence_duration_ms: 800` — lets callers pause naturally
- **Files**: `artifacts/api-server/src/routes/voice.ts` → `AI_PERSONA` constant

### 3.3 Twilio — Inbound Call Handling

**Used for**: Receiving the inbound call on the Australian number and bridging the audio to OpenAI Realtime in real time.

- **Australian number**: 02 5850 4038 (purchased through Twilio)
- **Webhook**: `https://directiveos.com.au/api/voice/incoming`
- **Protocol**: TwiML → `<Stream>` → WebSocket → OpenAI Realtime
- **Audio format**: `g711_ulaw` (8kHz, PCM, mulaw encoded — Twilio's standard)
- **Files**: `artifacts/api-server/src/routes/voice.ts`

### 3.4 Stripe — Billing & Payments

**Used for**: Charging agencies the setup fee and monthly subscription. Full payment flow including Afterpay.

- **Mode**: Stripe Checkout (hosted page)
- **Pricing**:
  - Setup/onboarding: $1,500 AUD one-time
  - Subscription: $299/mo (includes 1 seat)
  - Additional seats: $89/mo each
  - AI usage overage: $25 per 10-minute block beyond 100 min/month
- **Payment methods by step**:
  - Setup fee: Afterpay, Klarna, card (payment mode)
  - Monthly subscription: Klarna, card (subscription mode)
- **Meter**: AI voice minutes reported to Stripe via meter events (`ai_voice_minutes`)
- **Files**: `artifacts/api-server/src/routes/billing.ts`

---

## 4. Process — How Everything Was Built

### Phase 1 — Marketing Homepage

Built the public-facing homepage (`/`) with:
- Hero section with headline, phone number, "Activate Your Agency" CTA
- Live chat demo (GPT-4o-mini powered, embedded chat widget)
- Feature grid explaining AI receptionist capabilities
- Pricing calculator (seat slider, live $ total)
- "Book Free Consultation" button → Calendly (`https://calendly.com/adwordpress2012/directive-os-agency-onboarding`)

### Phase 2 — Voice AI Receptionist (Most Complex)

This was the hardest technical piece. Here is what happened and how it was fixed:

**The original bug — "Application Error"**

When a call came in, Twilio showed "Application Error" before Sarah could answer. Root cause: the TwiML response was hardcoding `wss://directiveos.com.au/api/voice/media-stream` as the WebSocket URL. But Replit's production proxy doesn't forward WebSocket UPGRADE requests when the host doesn't match exactly.

**The fix**

Changed TwiML generation to read the `x-forwarded-host` header so the WebSocket URL always matches whichever server actually served the TwiML. This way Twilio always connects back to the same host.

```typescript
// WRONG — hardcoded domain
const wsUrl = `wss://directiveos.com.au/api/voice/media-stream`;

// CORRECT — dynamic host from request
const host = req.headers["x-forwarded-host"] ?? req.headers.host;
const wsUrl = `wss://${host}/api/voice/media-stream`;
```

**Other voice bugs fixed**
- Early WebSocket close crash: added `readyState !== CONNECTING` guard + `terminate()` instead of `close()`
- OpenAI model URL: removed date suffix from model name (`gpt-4o-realtime-preview`, not `gpt-4o-realtime-preview-2024-12-17`)
- Whisper transcription enabled via `input_audio_transcription: { model: "whisper-1" }` in session config

**Sarah persona (Australian)**

The AI was given an instruction set that makes her sound authentically Australian and specifically trained for Western Sydney real estate (Jayson's portfolio):

> "You are Sarah, a friendly AI receptionist for [Agency Name]... Like chatting with a knowledgeable mate who works in real estate... use 'reckon', 'keen', 'heaps', 'arvo', 'no worries', 'cheers'. Keep responses to 1-2 sentences per turn, then listen."

**Post-call pipeline**

When a call ends:
1. Full transcript saved to `transcripts` + `transcript_messages` tables
2. Lead auto-created if name/email/phone detected in speech
3. Lead auto-classified: buyer / tenant / vendor / landlord / enquiry
4. Stripe meter event fired with call duration in minutes

### Phase 3 — Agency Onboarding (3-Step Wizard)

`/onboard` — three steps:

1. **Agency Details**: name, ABN, contact email, phone
2. **Select Seats**: seat count slider, live pricing breakdown showing $1,500 + $299/mo
3. **Legal & Payment**: T&C acceptance, payment summary, Stripe checkout

During step 3 the agency record is created in the DB first, then the Stripe checkout session is created, then the browser is redirected to Stripe.

### Phase 4 — Command Bridge Dashboard

Multi-page dashboard at `/dashboard/*`:

| Page | What it shows |
|---|---|
| `/dashboard` | Stats cards, AI usage chart, recent leads, activity feed |
| `/dashboard/leads` | Lead inbox — name, type, source, status, notes |
| `/dashboard/transcripts` | All voice + chat transcripts, filterable by channel |
| `/dashboard/listings` | Property cards — price, bedrooms, auction dates, photos |
| `/dashboard/staff` | Team seats — invite, remove, role |
| `/dashboard/billing` | Current plan, AI usage gauge, invoices |
| `/dashboard/settings` | Communication protocols, Sarah's instructions |

### Phase 5 — Stripe Billing

**Price IDs (test mode)**

| Item | Stripe Price ID |
|---|---|
| Onboarding (one-time) | `price_1TKwod9aGsy5kFWkRGkCu61m` |
| Subscription base | `price_1TKwuz9aGsy5kFWkNYUwwGQH` |
| Per additional seat | `price_1TKwxl9aGsy5kFWk8tEbNyKc` |
| AI usage overage | `price_1TKwyH9aGsy5kFWkBWcoTfZY` |
| Usage meter ID | `mtr_test_61UUKvWeRyLG29Qn6419aGsy5kFWkSVM` |

**Environment secrets required**

| Secret | Purpose |
|---|---|
| `STRIPE_KEY_ACTIVE` | Stripe publishable or secret key for active mode |
| `STRIPE_SECRET_KEY` | Stripe secret key (server-side) |
| `STRIPE_PRICE_ONBOARDING` | One-time $1,500 price ID |
| `STRIPE_PRICE_SUBSCRIPTION` | $299/mo recurring price ID |
| `STRIPE_PRICE_PER_SEAT` | $89/mo per-seat price ID |
| `STRIPE_PRICE_EXCESS_USAGE` | Overage metered price ID |
| `OPENAI_API_KEY` | GPT-4o-mini chat + GPT-4o Realtime voice |
| `SESSION_SECRET` | Express session encryption |

### Phase 6 — Afterpay Two-Step Checkout

**The problem**: Afterpay (and all BNPL networks globally) block recurring subscription payments by design. Stripe enforces this — you cannot add `afterpay_clearpay` to a `subscription` mode checkout.

**The solution**: Split the payment into two Stripe checkout sessions:

```
Step 1 — /api/billing/checkout/setup
  Mode: payment (one-time)
  Price: $1,500 setup fee
  Methods: Afterpay, Klarna, card
  Success URL: /onboard/subscribe?orgId=...

        ↓ Stripe redirects here after payment ↓

Step 2 — /onboard/subscribe (bridge page)
  Auto-calls /api/billing/checkout/subscription

        ↓ Redirects immediately to Stripe ↓

Step 3 — /api/billing/checkout/subscription
  Mode: subscription (recurring)
  Price: $299/mo + seats + overage
  Methods: Klarna, card (Afterpay not available for recurring)
  Success URL: /dashboard?subscribed=true
```

The bridge page (`/onboard/subscribe`) fires the subscription checkout automatically so the user doesn't have to click a second "pay" button — it feels like one seamless flow even though it's two separate Stripe sessions.

---

## 5. API Route Reference

### Voice
| Method | Route | Description |
|---|---|---|
| POST | `/api/voice/incoming` | Twilio webhook — returns TwiML |
| WS | `/api/voice/media-stream` | Audio bridge: Twilio ↔ OpenAI Realtime |

### AI Chat
| Method | Route | Description |
|---|---|---|
| POST | `/api/ai/chat` | GPT-4o-mini chat receptionist |

### Agencies
| Method | Route | Description |
|---|---|---|
| GET | `/api/agencies/me` | Agency profile |
| PATCH | `/api/agencies/me` | Update agency |
| POST | `/api/agencies/onboard` | Create agency during signup |

### Billing
| Method | Route | Description |
|---|---|---|
| GET | `/api/billing/subscription` | Current plan details |
| GET | `/api/billing/usage` | AI minutes used / overage |
| POST | `/api/billing/checkout/setup` | Create $1,500 Afterpay checkout |
| POST | `/api/billing/checkout/subscription` | Create $299/mo Klarna/card checkout |
| POST | `/api/billing/portal` | Stripe customer portal |

### Listings
| Method | Route | Description |
|---|---|---|
| GET | `/api/listings` | All listings |
| POST | `/api/listings` | Add listing |
| POST | `/api/listings/sync-vaultre` | Sync from VaultRE CRM |

### Leads
| Method | Route | Description |
|---|---|---|
| GET | `/api/leads` | All leads |
| POST | `/api/leads` | Create lead |
| PATCH | `/api/leads/:id` | Update lead status/notes |

### Transcripts
| Method | Route | Description |
|---|---|---|
| GET | `/api/transcripts` | All call + chat transcripts |
| GET | `/api/transcripts/:id` | Single transcript with messages |

### Dashboard
| Method | Route | Description |
|---|---|---|
| GET | `/api/dashboard/summary` | Stats cards |
| GET | `/api/dashboard/recent-leads` | Latest 10 leads |
| GET | `/api/dashboard/lead-breakdown` | Lead types pie data |
| GET | `/api/dashboard/activity` | Recent events feed |

---

## 6. Next Steps (Priority Order)

### 1. Clerk Authentication
Real multi-tenant login replacing the demo middleware. Currently all users see "Pinnacle Real Estate" demo data.
- Needs: Clerk account, `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- Once live: each agency principal signs in, sees only their data

### 2. Multi-Agency Voice Routing
Currently voice calls hardcode `agencyId: 1`. Once Clerk is live, voice calls should resolve the agency by Twilio number.

### 3. VaultRE Live Integration
Currently runs in simulation mode with mock data. Live integration requires VaultRE API credentials from each agency.

### 4. NSW Tenancy Automation
Auto-generate tenancy applications and condition reports via the transcripts from tenant callers.

### 5. Stripe Webhook Handlers
Handle `checkout.session.completed` to:
- Mark setup fee as paid in DB
- Activate subscription status
- Send welcome email to agency principal

---

## 7. Key Technical Decisions & Lessons

| Decision | Why |
|---|---|
| WebSocket host must be dynamic (`x-forwarded-host`) | Hardcoding the production domain causes "Application Error" because Replit's proxy doesn't UPGRADE WebSocket requests across mismatched hosts |
| GPT-4o Realtime, no date suffix in model name | Stripe-style versioning not used — just `gpt-4o-realtime-preview` |
| Whisper transcription required separately | Realtime API doesn't auto-transcribe caller speech unless `input_audio_transcription` is set |
| Afterpay requires payment mode, not subscription mode | Global Afterpay network policy — not a Stripe or code limitation |
| Two-step checkout for Afterpay | Only correct architecture — splits one-time and recurring into separate Stripe sessions |
| `terminate()` not `close()` for early WebSocket close | `close()` on a CONNECTING WebSocket throws unhandled exception; `terminate()` is safe |
| Klarna works in subscription mode | Unlike Afterpay, Klarna supports recurring billing — used for monthly subscription |

---

*Built by Directive OS development team using Replit, April 2026.*
