---
name: directive-os-system
description: Master knowledge base for the Directive OS business — full product catalog, pricing, two-app architecture, client workflow, sales process, technology stack, and business plan. Use when the user asks about how Directive OS works, how to sell it, how to build or extend it, or when making any changes to any artifact in this workspace.
---

# Directive OS — Master System Skill

> **Reference files in this folder:**
> - `products-pricing.md` — Full product catalog with pitch lines and pricing
> - `business-system-plan.md` — Business system plan, revenue model, growth targets

---

## Business Identity

| Field | Value |
|---|---|
| Business name | Directive OS |
| Trading URL | directiveos.com.au |
| ABN | 87 754 544 171 |
| Owner | Jayson |
| Owner emails | jayson@directiveos.com.au · adwordpress2012@gmail.com |
| Target market | Australian real estate agencies |
| Core product | Sarah — AI Receptionist (voice + chat) |
| Admin secret | `directive-captain-2024` |
| Demo line | 02 5850 4038 (Sarah live, 24/7) |

---

## Workspace Architecture

### Artifacts (apps in this workspace)

| Artifact | Path | Purpose |
|---|---|---|
| `directive-os` | `/directive-os/` | Main marketing site + dashboard + marketing hub |
| `api-server` | port 8080 | Express backend — voice, chat, billing, CRM, email |
| `directive-os-mobile` | Expo | Command Bridge — agent/staff mobile app |
| `realestate-demo` | `/realestate-demo/` | Ray White Castle Hill demo (prospect tool) |
| `nidus-re` | `/nidus-re/` | Nidus Real Estate client landing page (DEMO) |
| `c21-rana` | `/c21-rana/` | Century 21 The Rana Group landing page (DEMO) |

### Key Source Files

| File | What it does |
|---|---|
| `artifacts/directive-os/src/pages/home.tsx` | Main marketing homepage |
| `artifacts/directive-os/src/pages/marketing/index.tsx` | Marketing hub — products, apps, print tools, demo |
| `artifacts/directive-os/src/pages/marketing/brochure.tsx` | Trifold brochure (print-ready) |
| `artifacts/api-server/src/routes/voice.ts` | Sarah voice AI — Twilio/OpenAI realtime |
| `artifacts/api-server/src/routes/billing.ts` | Stripe checkout + prospect payments |
| `artifacts/api-server/src/lib/email.ts` | Lead transcript emails |
| `artifacts/realestate-demo/src/pages/home.tsx` | Ray White demo homepage |

### Tech Stack

- **Frontend:** React + Vite + TailwindCSS (TypeScript)
- **Backend:** Express + TypeScript (Node.js)
- **AI:** OpenAI GPT-4o-mini (chat) + OpenAI Realtime API (voice)
- **Voice:** Twilio (phone numbers + TwiML + WebSocket media streams)
- **Auth:** Clerk (org-based — each client is a separate Clerk org)
- **Database:** PostgreSQL (Drizzle ORM)
- **Email:** Resend (transactional — lead transcripts)
- **Payments:** Stripe (checkout + subscriptions + metered billing)
- **CRM integration:** VaultRE REST API
- **Mobile:** Expo (React Native) — iOS + Android
- **Hosting:** Replit Autoscale (directiveos.com.au via CNAME)

---

## The Two Apps — Critical Distinction

Always clarify this when discussing "the app" — there are two completely separate products:

### App 1: Command Bridge (Included in all plans)
- **Users:** Agents and staff
- **Purpose:** Internal tool — manage Sarah, view transcripts, get lead alerts
- **Published under:** Directive OS developer accounts
- **Buyer-facing:** No — buyers never see or use this

### App 2: Branded Buyer App (Add-on — $4,500 + $149/mo flat)
- **Users:** Buyers and renters
- **Purpose:** The agency's own branded app on the App Store
- **Published under:** The AGENCY'S name (e.g. "Ray White Castle Hill App")
- **Buyer-facing:** Yes — buyers download it, search listings, chat/call Sarah
- **Key pitch:** "Domain and REA charge you to list on their platform. This puts YOUR brand in every buyer's pocket permanently."

---

## Pricing Schedule

| Item | Price | Notes |
|---|---|---|
| Onboarding / Setup | $1,800 one-off | Non-refundable once work begins |
| Base Monthly Licence | $299/mo | Sarah + Dashboard + VaultRE sync + Chat |
| Additional Agent Seats | $89/seat/mo | Per agent login to dashboard |
| AI Call Overage | $25/10-min block | After included 100 min/mo |
| Branded Mobile App Setup | $4,500 one-off | Build, brand, publish to App Store + Google Play |
| Branded Mobile App Licence | $149/mo flat | Unlimited buyers, no per-user fees |

Month 1 licence is charged at setup. Month 2+ is auto-billed via Stripe subscription.
No lock-in contract. 30 days written notice to cancel.

### Stripe Price IDs (Live)
- Onboarding: `price_1TLWeF9aGsy5kFWkH4TtBm8z`
- Monthly subscription: `price_1TLWg59aGsy5kFWkzOWGsN3R`
- Per-seat: `price_1TLWhi9aGsy5kFWkBiahUKDB`
- Overage (10-min): `price_1TLWjU9aGsy5kFWk5pqiB0V8`

---

## 7 Core Products

Products 1–6 are included in every plan. Product 7 is an add-on.

1. **Voice AI Receptionist (Sarah)** — Answers every call 24/7, qualifies buyers, books inspections, emails transcript
2. **Live Chat Widget** — Same AI on the agency website, captures leads from every visitor
3. **VaultRE CRM Sync** — Bi-directional, listings/agents/opens always live
4. **NSW Tenancy Automation** — Emails NSW Fair Trading tenancy form instantly when tenant enquires
5. **Hot Lead Routing** — Live call transfer to listing agent's mobile when high intent detected
6. **Command Bridge Dashboard** — All transcripts, leads, recordings in one web portal
7. **Branded Mobile App** *(Add-on)* — Agency's own app on App Store + Google Play for buyers

Full details and pitch lines → see `products-pricing.md`

---

## Sarah AI — Voice Configuration

Sarah is powered by the OpenAI Realtime API streamed through Twilio Media Streams.

```
VAD config:
  silence_duration_ms: 2000
  threshold: 0.6
  prefix_padding_ms: 300

Voice: "shimmer" (warm, professional female)
Model: gpt-4o-realtime-preview
Turn detection: server_vad
```

**Critical WebSocket rule:** TwiML `<Connect>` MUST use `x-forwarded-host` header for the WebSocket URL.
Never hardcode `directiveos.com.au` — it will break in dev and staging environments.

```typescript
// CORRECT
const host = req.headers["x-forwarded-host"] || req.headers.host;
const wsUrl = `wss://${host}/api/voice/ws`;

// WRONG — never do this
const wsUrl = `wss://directiveos.com.au/api/voice/ws`;
```

---

## Client Onboarding Flow (Summary)

Full workflow → see `dos-onboarding` skill.

```
1. Send service agreement email → client replies "I agree" + name + business
2. Client pays $1,800 + $299 via Stripe on their landing page
3. Jayson receives Stripe notification
4. Jayson activates (~15 min):
   a. Create Clerk org, invite client as owner
   b. Insert agency record in DB with nominated email
   c. Purchase dedicated Twilio number
   d. Remove DEMO banner from landing page
   e. Set agency's dedicated phone number
5. Client receives dashboard login → goes live
```

---

## Current Client Pages

| Client | URL | Status | Notes |
|---|---|---|---|
| Nidus Real Estate | `/nidus-re/` | DEMO | Dark theme |
| Century 21 The Rana Group | `/c21-rana/` | DEMO | Light theme, uses 0410 567 777 |

### Adding a New Client Page
1. `createArtifact({ slug: "agency-slug", kind: "web", title: "Agency Name" })`
2. Copy `c21-rana` (light) or `nidus-re` (dark) as base
3. Update: name, phone, brand colours, logo, nav links
4. Add DEMO banner, `GetStartedCTA` with agency slug
5. Add to directive-os homepage "See Directive OS in the Wild" section
6. Deploy

---

## Marketing Hub Location

Internal sales command centre accessible at:
`directiveos.com.au/directive-os/marketing`

Contains:
- 7 Products tab (expandable cards with pitch lines)
- Two Apps comparison table
- Print & Digital materials (brochure, one-pager, business card, proposal, email campaign, email signature, health check, web quote)
- Live Demo tab (Sarah's number, Ray White demo QR, 5-step demo script)

**Important:** Never send the Web Quote Builder link (`/marketing/web-quote`) to prospects — internal use only. Use the Proposal Template instead.

---

## Sales Targets & Prospecting

Western Sydney priority targets (Hills District — in-person):
Murdoch Lee, Lindellas, Louis Carr, R&W Castle Hill, First National, PRD, Professionals

Further (call/email): Starr Partners, Laing+Simmons, Sweeney, One Agency

Revenue projections:
- 3 months: 5 clients → ~$16k
- 6 months: 15 clients → ~$52k
- Year 1: 30 clients → ~$225k

---

## Environment Variables (Required)

| Secret | Purpose |
|---|---|
| `OPENAI_API_KEY` | GPT-4o-mini chat + Realtime voice |
| `STRIPE_SECRET_KEY` | Payments |
| `STRIPE_WEBHOOK_SECRET` | Webhook verification |
| `STRIPE_KEY_ACTIVE` | Public Stripe key |
| `STRIPE_PRICE_ONBOARDING` | Setup fee price ID |
| `DOS_RESEND_KEY` | Resend API for lead emails |
| `RESEND_API_KEY` | Resend (general) |
| `SESSION_SECRET` | Express session |
| `DATABASE_URL` | PostgreSQL |

---

## Known System Gaps (To Build)

1. **Stripe webhook** — `POST /api/billing/webhook` — auto-notify Jayson when prospect pays, auto-create DB record, send client "payment received" email
2. **VaultRE live sync** — currently stubbed; needs VaultRE API credentials from each client to activate
3. **Mobile buyer app** — Expo app for buyers (Ray White Castle Hill demo ready to build)
4. **Stripe webhook → Clerk org auto-create** — currently manual step 4a
