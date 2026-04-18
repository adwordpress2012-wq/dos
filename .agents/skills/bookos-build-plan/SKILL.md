---
name: bookos-build-plan
description: Master build plan for BookOS — the SMB sister product to Directive OS. Sarah-powered AI receptionist for hairdressers, barbers, beauty studios, plumbers and small AU service businesses. Booking-only (no end-customer payments), Calendly + SMS + email notifications, separate brand and marketing site, lower-tier pricing, but shares the Directive OS database, API server, and Sarah voice infrastructure. Use this skill when building, scoping, costing, or pitching BookOS.
---

# BookOS — Build Plan & Workflow

> Status: **APPROVED — awaiting build kickoff**
> Owner: Jayson Ocampo, Director of AI Solutions
> Decision date: 17 April 2026

---

## 1. Product summary

**BookOS** is a stripped-down, SMB-priced version of Directive OS for small Australian service businesses. Sarah answers every call and chat, qualifies the customer, captures name + service + preferred time + phone + email, then **sends the customer a Calendly booking link by SMS** so they self-serve the actual time slot. The business owner gets an instant push notification + email with the lead.

### What it is
- Sarah AI voice receptionist (24/7) — same brain as DOS, salon/trades persona.
- Live web chat widget for the business's website.
- Calendly link sent to every qualified caller via SMS.
- Email notification to the owner with full transcript and lead summary.
- Push notification via the BookOS owner app (lightweight version of Command Bridge).
- Owner dashboard — leads, transcripts, missed-call recovery.

### What it is NOT (MVP scope)
- ❌ NO end-customer payment at booking (owner subscribes via Stripe; customers pay $0).
- ❌ NO direct calendar write (Sarah does NOT create the Calendly event herself; she sends the link).
- ❌ NO listings sync, no VaultRE, no real estate features.
- ❌ NO multi-language at launch (English only — add later if demand).
- ❌ NO branded mobile app per business (premium add-on for v2).

---

## 2. Architecture decision

### Brand & domain
- **Brand:** BookOS (separate brand from Directive OS).
- **Domain:** `bookos.com.au` (preferred) OR `bookos.directiveos.com.au` (fallback subdomain if .com.au is taken/expensive).
- **Visual identity:** Same teal/navy DOS-family palette but with a softer, friendlier vibe (book a haircut ≠ book an appraisal). Logo to be designed.

### Backend
- **Same Replit deployment, same `api-server`** as DOS.
- **Same Postgres database** — add a `vertical` column to `agencies` (`real_estate` | `salon` | `trades` | `wellness` | `other`) so we can route persona logic and tier pricing per vertical without a schema fork.
- **Same Sarah voice bridge** — new persona variant loaded by `vertical` field instead of hardcoded real estate.
- **Same Twilio account** — each BookOS client gets their own Twilio number, exactly like DOS.
- **Same OpenAI Realtime + GPT-4o-mini** — no new providers.

### Frontend (new)
- New artifact `artifacts/bookos` — public marketing site at `bookos.com.au`.
- Reuses the chat widget from DOS (already built).
- Owner dashboard reuses 80% of DOS dashboard components — feature flags hide real estate–specific bits (listings, vendor leads, tenancy automation).

### Notifications
- **SMS to customer:** Twilio Programmable Messaging — sends the Calendly link 5 seconds after Sarah ends the call.
- **Email to owner:** Resend — leads@bookos.com.au or shared infra under bookos brand.
- **Push to owner mobile:** Expo Push (reuses Command Bridge codebase, BookOS-themed build).

---

## 3. Pricing tiers (locked-in proposal)

| Plan | Setup | Monthly | Per-seat | Voice minutes incl. | Overage |
|---|---|---|---|---|---|
| **Solo** (1 chair / 1 tradie) | $499 once-off | $99/mo | n/a | 200 min | $20 / 10 min |
| **Studio** (2–5 staff) | $799 once-off | $149/mo | +$25/mo per extra staff | 400 min | $20 / 10 min |
| **Multi-Location** (2+ shops) | $1,499 once-off | $249/mo | +$25/mo per extra staff | 800 min | $20 / 10 min |

- No lock-in contracts. Cancel anytime.
- Setup includes: Twilio number, persona tuning, Calendly handoff config, dashboard onboarding, custom website chat widget snippet.

### Stripe products to create
- `BookOS Solo Setup` — $499 AUD one-off
- `BookOS Solo Subscription` — $99 AUD/mo recurring
- `BookOS Studio Setup` — $799 AUD one-off
- `BookOS Studio Subscription` — $149 AUD/mo recurring
- `BookOS Multi Setup` — $1,499 AUD one-off
- `BookOS Multi Subscription` — $249 AUD/mo recurring
- `BookOS Voice Overage` — metered $20/10min, billed monthly

---

## 4. Customer call workflow

1. Customer calls the salon's BookOS-provisioned Twilio number.
2. Twilio routes to the shared `api-server` voice handler.
3. Server reads agency by `to` number → loads the **Salon persona** with the agency's name, services, and Calendly link.
4. Sarah greets: *"Hi, thanks for calling [Salon Name], this is Sarah — how can I help?"*
5. Sarah qualifies: name, service requested (cut, colour, blow-dry…), preferred stylist if any, day/time preference.
6. Sarah confirms back the details and says: *"I'll send you a text right now with our online calendar — pick the slot that suits you and you're booked. Anything else I can help with?"*
7. Goodbye exchange → call ends.
8. **Within 5s after call ends:**
   - Twilio SMS → customer with the Calendly link + summary line.
   - Resend email → owner with transcript + lead.
   - Expo push → owner mobile with "New lead — [Name] — [Service]".
   - Lead row inserted into `leads` table (channel = `voice`, vertical = `salon`).
   - Transcript saved.

**If the customer didn't leave a phone number:** SMS is skipped, but email + push still fire. (Same pattern as DOS today.)

---

## 5. Build phases & AI-minute estimates

> **Definition of "AI minutes":** Roughly the wall-clock time I (the agent) spend implementing, testing, and verifying the work in this environment. Real elapsed calendar time will be longer because of your reviews and Stripe/Twilio account setup steps.

### Phase 0 — Decisions & domain (you do this, ~1 day calendar)
- Buy `bookos.com.au` (or confirm subdomain choice).
- Create Stripe products listed in §3.
- Create Resend domain + DNS for `bookos.com.au` (DKIM/SPF).

### Phase 1 — Database & vertical routing (≈ 25 AI minutes)
- Add `vertical` enum column to `agencies` table (`real_estate` | `salon` | `trades` | `wellness` | `other`).
- Add `calendlyUrl`, `bookosTier` columns.
- Update Drizzle schema, run `db:push`.
- Add helper `getAgencyVertical()` and `getCalendlyUrl()`.
- **Deliverable:** existing DOS unaffected, schema ready for BookOS clients.

### Phase 2 — Sarah salon/trades persona (≈ 30 AI minutes)
- New persona builders in `voice.ts`: `buildSalonPersona()`, `buildTradesPersona()`.
- Personas know the service menu, Calendly handoff line, and the explicit "I'll text you the calendar link" closer.
- Persona selected automatically by the agency's `vertical` field (no extra branching needed at the call entrypoint).
- **Deliverable:** any agency with `vertical=salon` answers like a salon receptionist.

### Phase 3 — Calendly SMS handoff (≈ 25 AI minutes)
- New helper `sendCalendlyLinkSms(toNumber, salonName, calendlyUrl, summary)`.
- Wired into `onCallEnd()` — fires when `vertical=salon|trades|wellness` AND `callerPhone` was captured.
- SMS template: short, friendly, includes business name, the link, and a one-line booking summary.
- **Deliverable:** every qualified caller gets the Calendly text within 5s of hanging up.

### Phase 4 — BookOS marketing site (≈ 90 AI minutes)
- New artifact `artifacts/bookos` (Vite + React + Tailwind, mirrored from `directive-os` scaffold).
- Pages: home, pricing, how it works, demo, sign-up, login, contact.
- Hero copy, screenshots, demo phone number CTA.
- "Try Sarah Now" button — calls a dedicated demo Twilio number with a generic salon persona.
- Sign-up flow → Stripe Checkout for setup + subscription.
- **Deliverable:** `bookos.com.au` is live, sells, and can take a paying client end-to-end.

### Phase 5 — Owner dashboard (BookOS-flavoured) (≈ 70 AI minutes)
- New `/bookos/dashboard` routes inside the existing `directive-os` app OR new `artifacts/bookos-dashboard`. Recommendation: new artifact for clean branding.
- Reuses `Leads`, `Transcripts`, `Settings`, `Billing` components with feature flags hiding listings/VaultRE/vendor-only fields.
- New widget: "Calendly Links Sent" — count + click-through (track via UTM param appended to the SMS).
- **Deliverable:** owner can log in, see leads, replay transcripts, manage billing.

### Phase 6 — Mobile push notifications (≈ 30 AI minutes)
- Reuse existing `directive-os-mobile` (Command Bridge) — add a build flavour or env switch for BookOS branding.
- New badge colour, new logo, same notification pipeline.
- **Deliverable:** owner gets a push when a new lead lands.

### Phase 7 — Onboarding & client provisioning script (≈ 25 AI minutes)
- Admin page: "Create BookOS Client" — collects name, ABN, address, Calendly URL, tier, contact email, contact phone.
- Auto-buys a Twilio AU local number, attaches the BookOS voice webhook, inserts `agencies` row with `vertical=salon`, generates dashboard login.
- **Deliverable:** Jayson can onboard a paid client in under 5 minutes.

### Phase 8 — Pilot client (manual, ~1 week calendar)
- Onboard 1 friendly hairdresser at $0 for the first month in exchange for a video testimonial.
- Monitor call quality, tweak persona.
- Capture metrics: % of calls that produce a booking, owner satisfaction, customer satisfaction.

### Phase 9 — Sales materials & launch (≈ 60 AI minutes)
- BookOS one-pager, brochure, business card, email signature variant, cold outreach playbook (salon-specific tone).
- Add BookOS to the marketing hub.
- **Deliverable:** sales kit ready, you can start outreach.

---

### Total build estimate (Phases 1–7 + 9)
**≈ 355 AI minutes ≈ 6 hours of focused agent work** to get from zero to "I can sell this".

Phase 8 (pilot) is calendar time, not AI time.

If you want, we can deliver this in **two ship-windows**:
- **Sprint A — Launchable MVP (Phases 1–4 + 7):** ≈ 195 AI minutes (~3.5 hrs). At the end of this you can take a paying salon, provision them, and Sarah will work end-to-end. Dashboard would temporarily reuse the DOS dashboard with bookos branding hidden.
- **Sprint B — Polished v1 (Phases 5, 6, 9):** ≈ 160 AI minutes (~2.5 hrs). Adds dedicated dashboard, mobile push, and full sales kit.

---

## 6. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Salon owners are price-sensitive — $99/mo could feel high. | Lead with ROI: "One missed booking = $80+. We answer 24/7." Offer free first month for testimonial. |
| Calendly link click-through could be low. | Track via UTM param, send a follow-up SMS after 6h if no booking detected. (Phase 5 enhancement.) |
| Twilio AU number costs ~$1.50/mo per number — eats into Solo margin. | Built into pricing; Solo still has ~$95+ gross margin/mo. |
| Sarah's voice may sound "too corporate" for a chill barbershop. | Per-vertical persona tuning — friendlier tone, casual greeting. |
| Customer thinks they're booked after the call (they're not until they click the link). | Sarah explicitly says "you're not booked until you pick a slot in the text I just sent". Persona enforces this. |
| Cannibalises future DOS energy. | Same codebase, same Sarah, same database — no fork. The work scales DOS too. |

---

## 7. Where the plan is saved

- This skill: `.agents/skills/bookos-build-plan/SKILL.md`
- Section in `replit.md` under "BookOS — Sister Product"
- PDF: `exports/bookos-build-plan.pdf` (regenerated from this file when needed)

---

## 8. Decision log

| Date | Decision |
|---|---|
| 2026-04-17 | Approved separate brand "BookOS" (not a vertical inside DOS). |
| 2026-04-17 | Booking-only — no end-customer payments. |
| 2026-04-17 | Calendly handoff via SMS (not direct API write). |
| 2026-04-17 | Same `api-server` + same Postgres + same Sarah voice — no fork. |
| 2026-04-17 | Lower-tier pricing: $99 / $149 / $249 monthly. |
| 2026-04-17 | Domain: prefer `bookos.com.au`, fallback `bookos.directiveos.com.au`. |
