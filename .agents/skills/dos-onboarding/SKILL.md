---
name: dos-onboarding
description: Directive OS client onboarding workflow, lead email system, dashboard access, payment flow, and post-payment setup steps. Use when the user asks about onboarding a new client, activating Sarah for a client, setting up a nominated email, explaining the workflow, or removing the DEMO banner from a client landing page.
---

# Directive OS — Client Onboarding Workflow

> **Related skills:** Read `directive-os-system` skill for full product catalog, pricing, tech stack, and business plan.
> Reference files: `.agents/skills/directive-os-system/products-pricing.md` · `.agents/skills/directive-os-system/business-system-plan.md`

## The Full Journey (Client Perspective)

```
STEP 1 — Agreement
  Jayson sends the service agreement email to the prospect.
  Client replies "I agree" with their full name + business name.
  This reply = documented electronic acceptance of terms.

STEP 2 — Payment
  Client clicks "Activate Sarah — Pay $1,800 Setup Fee" on their
  branded landing page (e.g. directiveos.com.au/c21-rana/).
  → Stripe checkout opens (card / Apple Pay / Google Pay / Klarna)
  → Line items: $1,800 setup + $299 Month 1 licence
  → Tax invoice auto-emailed to client's email address
  → Month 2+ billing is automatic via Stripe subscription

STEP 3 — Jayson is notified
  Stripe dashboard shows the payment.
  TODO: Stripe webhook → auto-notify Jayson when prospect pays
  (endpoint /billing/checkout/prospect stores metadata: agencySlug,
   agencyName, contactName, email, phone)

STEP 4 — Jayson activates (takes ~15 mins)
  a. Create their Clerk org + invite client as owner
  b. Insert agency record in DB with contactEmail = their nominated email
  c. Set their dedicated Twilio number (purchase in Twilio console)
  d. Update landing page: remove DEMO banner, swap in dedicated number
  e. Set agencyId on the landing page chat widget

STEP 5 — Client goes live
  Client receives dashboard login link
  Sarah is live on their dedicated number + landing page chat
  All leads forward to their nominated email automatically 24/7
```

---

## Lead Email Forwarding — How It Works

Every call and chat Sarah handles triggers an auto-email containing:
- Caller name, phone, email
- Finance status (approved / not approved / working on it)
- Buyer intent (investment / owner-occupier / unknown)
- 🔴 POTENTIAL LISTING flag if caller has property to sell
- Full conversation transcript (colour-coded Sarah vs Caller)

**Who receives lead emails:**
```
Voice calls  → [agency.contactEmail, jayson@directiveos.com.au, adwordpress2012@gmail.com]
Chat enquiries → [agency.contactEmail, jayson@directiveos.com.au, adwordpress2012@gmail.com]
```
`agency.contactEmail` = the nominated email stored in the agencies table.

**File:** `artifacts/api-server/src/lib/email.ts`
- `sendVoiceTranscriptEmail()` — called at end of every voice call
- `sendChatTranscriptEmail()` — called when chat session closes

**Changing a client's nominated email:**
```sql
UPDATE agencies SET contact_email = 'new@email.com' WHERE id = <agency_id>;
```
Or via PATCH `/api/agencies/me` with `{ contactEmail: "new@email.com" }` from the dashboard.

---

## Dashboard Access

URL: `https://directiveos.com.au/dashboard`
Auth: Clerk (org-based — each client is a separate Clerk org)

Dashboard features available to clients:
- Command Centre (live stats + activity feed)
- Lead Inbox (filterable by type: buyer/tenant/vendor/landlord)
- Communication Logs (voice + chat transcripts, full playback)
- Property Intelligence (listings management)
- Seat Management (add/remove team members)
- Billing (invoices, AI usage, Stripe portal)
- Settings (agency profile, Sarah's communication protocols)

---

## Pricing Schedule (inc. GST)

| Item | Amount |
|---|---|
| Setup / Onboarding (once-off) | A$1,800 |
| Monthly Licence — Base (1 seat) | A$299/mo |
| Additional Seats | A$89/seat/mo |
| AI Overage (per 10-min block above 100 min) | A$25/block |

Month 1 licence is paid at setup. Month 2+ is auto-billed via Stripe.
No lock-in contract — cancel with 30 days written notice.

---

## Landing Page Status & Demo Watermark

Each client landing page shows a DEMO banner until officially activated:

```
[DEMO] This page is a live preview — dedicated phone line setup pending.
       Contact Directive OS to activate your official AI receptionist.
```

**To remove the DEMO banner after payment:**
Delete the `{/* DEMO WATERMARK BANNER */}` block from the client's `landing.tsx`.

**To swap in their dedicated Twilio number:**
Change the `PHONE` constant at the top of `landing.tsx` from the placeholder
(e.g. `02 9625 0000` or `02 5850 4038`) to their assigned Twilio number.

---

## Current Client Pages

| Client | Slug | Status | Phone | Nominated Email |
|---|---|---|---|---|
| Nidus Real Estate | `/nidus-re/` | DEMO | `02 9625 0000` (placeholder) | TBC from Jayson |
| Century 21 The Rana Group | `/c21-rana/` | DEMO | `0410 567 777` (their real line) | TBC from Jayson |

Demo line (shared): `02 5850 4038` — Sarah answers, used for try-before-you-buy demos.

---

## Service Agreement Email Template

**Subject:** Your Directive OS AI Receptionist — Service Agreement & Activation

Key sections:
1. What they're getting (Sarah, 24/7, dedicated number, landing page)
2. Pricing schedule (table format)
3. Terms (no lock-in, setup fee non-refundable once onboarding starts, 30-day notice)
4. Activation instructions (reply "I agree" → click payment link)
5. Jayson's signature + ABN 87 754 544 171

Client confirms by replying "I agree" + full name + business name.
This email reply = binding electronic acceptance.

---

## Stripe Prospect Checkout Endpoint (Public)

`POST /api/billing/checkout/prospect`
No auth required — called directly from client landing pages.

Body: `{ agencySlug, agencyName, contactName, email, phone }`
Returns: `{ url }` → redirect to Stripe checkout

Line items:
- Setup fee ($1,800) from `STRIPE_PRICE_ONBOARDING` env var
- Month 1 licence ($299) as price_data inline

Success URL: `directiveos.com.au/welcome?name=...&agency=...`
All metadata stored in Stripe payment intent for Jayson to retrieve.

**File:** `artifacts/api-server/src/routes/billing.ts`

---

## What's Next (Automation Gap)

Currently missing: Stripe webhook that fires when a prospect pays.
When built, it should:
1. Auto-notify Jayson via email with client details (name, email, phone, agency)
2. Create a pending agency record in the DB
3. Send the client a "Payment received — we'll be in touch within 1 business day" email

Build at: `POST /api/billing/webhook` with Stripe signature verification.
Use `stripe.webhooks.constructEvent()` with `STRIPE_WEBHOOK_SECRET` env var.
Listen for: `checkout.session.completed` where `metadata.source === "landing_page"`.

---

## Adding a New Client Page

1. Create artifact: `createArtifact({ slug: "agency-slug", kind: "web", title: "Agency Name" })`
2. Copy `artifacts/c21-rana` (light theme) or `artifacts/nidus-re` (dark theme)
3. Update: agency name, PHONE constant, brand colours, nav links → client's real site
4. Add DEMO banner (copy from c21-rana)
5. Add `GetStartedCTA` component with agency slug + name
6. Add to Directive OS homepage "See Directive OS in the Wild" section
7. Deploy → directiveos.com.au/agency-slug/
