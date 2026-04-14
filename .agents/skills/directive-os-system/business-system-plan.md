# Directive OS — Business System Plan

**Owner:** Jayson  
**ABN:** 87 754 544 171  
**Primary contact:** jayson@directiveos.com.au  
**Website:** directiveos.com.au  
**Last updated:** April 2026

---

## 1. Business Overview

Directive OS is an AI receptionist SaaS platform built specifically for Australian real estate agencies. The core product is Sarah — an AI that answers every inbound call and live chat 24/7, qualifies buyers, books inspections, syncs with VaultRE CRM, and emails full lead transcripts instantly.

The business sells to independent and franchise real estate agencies across Australia, starting with Western Sydney (Hills District). Agencies pay a one-off setup fee and a monthly subscription. The business grows through direct sales (door-knocking, cold calling, email outreach) — no paid advertising required in the early phase.

---

## 2. The Problem We Solve

Real estate agencies miss calls constantly. After-hours, at lunch, in inspections, during busy periods — every missed call is a potential commission lost. Buyers who reach voicemail typically don't leave messages; they call the next agent on their list.

Existing solutions (receptionist services, voicemail, basic chatbots) are either expensive, limited, or impersonal. Directive OS fills the gap with a natural-sounding AI that handles the full qualification and booking flow — indistinguishable from a trained human receptionist.

**The core sales insight:** One missed buyer = one missed commission = $8,000–$25,000 in lost GCI. Directive OS costs $299/month. The payoff is obvious.

---

## 3. Product Suite

### Core System (All Plans)
1. Sarah — Voice AI Receptionist (24/7, qualifies, books, transfers)
2. Live Chat Widget (website AI — same intelligence as voice)
3. VaultRE CRM Sync (bi-directional, always live)
4. NSW Tenancy Automation (instant tenancy form delivery)
5. Hot Lead Routing (live call transfer to listing agent)
6. Command Bridge Dashboard (web portal — all leads, recordings, transcripts)

### Add-On
7. Branded Mobile App — iOS & Android ($4,500 + $149/mo flat)
   - Published under the AGENCY'S name on App Store + Google Play
   - Buyers browse listings, book inspections, chat with Sarah
   - Push notifications to every buyer who downloaded the app

For full product detail and pitch lines — see `products-pricing.md`.

---

## 4. Revenue Model

### Per-Client Revenue

| Scenario | One-Off | Monthly | Year 1 Total |
|---|---|---|---|
| Base only (1 seat) | $1,800 | $299/mo | $1,800 + $3,588 = **$5,388** |
| Base + 3 seats | $1,800 | $299 + $178 = $477/mo | $1,800 + $5,724 = **$7,524** |
| Base + App | $1,800 + $4,500 = $6,300 | $299 + $149 = $448/mo | $6,300 + $5,376 = **$11,676** |
| Full stack (3 seats + app) | $6,300 | $477 + $149 = $626/mo | $6,300 + $7,512 = **$13,812** |

### Revenue Projections

| Milestone | Clients | Monthly Recurring | Year Total |
|---|---|---|---|
| 3 months | 5 clients | ~$1,500–$2,500/mo | ~$16k inc. setup fees |
| 6 months | 15 clients | ~$4,500–$7,000/mo | ~$52k cumulative |
| 12 months | 30 clients | ~$9,000–$18,000/mo | ~$225k cumulative |
| 24 months | 60 clients + employees | ~$20k–$40k/mo | $500k+ cumulative |

**Key insight:** Monthly recurring revenue is the primary value driver. Each client signed is permanent income with near-zero ongoing delivery cost.

---

## 5. Pricing Schedule

| Item | Price |
|---|---|
| Setup / Onboarding | $1,800 once-off |
| Base Monthly Licence | $299/mo |
| Per Additional Agent Seat | $89/seat/mo |
| AI Overage (per 10-min block above 100 min) | $25/block |
| Mobile App Setup | $4,500 once-off |
| Mobile App Monthly | $149/mo flat (unlimited buyers) |

No lock-in contracts. 30 days written notice to cancel. Setup fee non-refundable once onboarding begins.

---

## 6. Sales System

### Sales Process (Each Client)

```
STAGE 1 — PROSPECT
  Source: door-knocking, cold calling, email outreach
  Goal: book a 15-min demo call with the principal or business owner

STAGE 2 — DEMO
  In-person or video call
  Hand them a phone and call 02 5850 4038 — let them talk to Sarah live
  Show the Ray White Castle Hill demo site
  Show the Command Bridge dashboard

STAGE 3 — PROPOSAL
  Email the service agreement (use Proposal Template from marketing hub)
  Principal replies "I agree" + name + business = electronic acceptance

STAGE 4 — PAYMENT
  Click Activate Sarah on their landing page → Stripe checkout
  $1,800 setup + $299 Month 1 licence

STAGE 5 — ONBOARDING
  Jayson activates in ~15 minutes:
    - Clerk org + client login
    - Twilio number purchased + configured
    - VaultRE API connected
    - Landing page DEMO banner removed
    - Agency goes live

STAGE 6 — RETENTION
  Monthly billing via Stripe (automated)
  Check in quarterly
  Upsell: additional seats, mobile app add-on
```

### Target Market — Western Sydney (Phase 1)

**Tier 1 — In-Person (Hills District)**
- Murdoch Lee Real Estate (Castle Hill)
- Lindellas Real Estate
- Louis Carr Real Estate
- Ray White Castle Hill
- First National Hills
- PRD Nationwide
- Professionals Castle Hill

**Tier 2 — Drive Out (Surrounding suburbs)**
- McGrath Castle Hill / Norwest
- Laing+Simmons
- Starr Partners

**Tier 3 — Call & Email**
- Sweeney Estate Agents
- One Agency operators (Western Sydney)
- Independent boutique agencies

### Outreach Tools Available (all in Marketing Hub)
- Trifold Brochure (print, door-knock)
- Sales One-Pager (email attachment)
- 3-Part Email Campaign (copy-paste cold email sequence)
- Email Signature (branded, links to demo)
- Business Card (print-ready)
- Client Proposal Template (branded, 3 plan tiers)
- Website Health Check (audit a prospect's site → auto-score → quote)

---

## 7. Client Delivery System

### What Jayson Does to Onboard a Client (~15 minutes)

1. Create their Clerk organisation, invite client as owner
2. Insert agency record in PostgreSQL with nominated contact email
3. Purchase dedicated Twilio number (02 XXXX XXXX) in Twilio console
4. Configure Sarah's voice for that number
5. Remove DEMO banner from client landing page
6. Update landing page phone number to their dedicated line
7. Send client their dashboard login link

### What the Client Gets
- Sarah live on their dedicated number
- Live chat widget code to paste into their website
- Dashboard login (directiveos.com.au/dashboard)
- VaultRE connected (requires client to supply API key)
- Auto-email for every lead captured (name, phone, email, transcript)

### Ongoing Delivery (Automated)
- All calls handled by Sarah (no human involvement)
- Stripe auto-bills monthly
- Lead emails sent via Resend — zero manual work
- Dashboard available 24/7 for client self-service

---

## 8. Technology Infrastructure

### Hosting & Deployment
- Platform: Replit Autoscale
- Domain: directiveos.com.au (CNAME to Replit)
- Deployment: automatic from main branch on Replit
- Database: PostgreSQL (managed by Replit)
- All artifacts run from a single pnpm monorepo workspace

### Cost Structure (Monthly, Estimated)

| Item | Estimated Cost |
|---|---|
| Replit hosting (Autoscale) | ~$50–150/mo depending on traffic |
| OpenAI API (per client usage) | ~$5–20/client/mo |
| Twilio (per client number + call minutes) | ~$10–30/client/mo |
| Resend email | ~$5/mo base |
| Stripe fees | ~2.9% + $0.30 per transaction |

**Effective gross margin:** ~85%+ after platform costs at 10+ clients.

---

## 9. Client Landing Pages

Each client gets a branded landing page built at directiveos.com.au/[slug].

The landing page includes:
- Branded hero section with their agency colours
- Sarah AI live chat widget embedded
- "Activate Sarah" CTA → Stripe checkout
- DEMO watermark banner until officially activated

### Current Client Pages

| Client | Slug | Theme | Status |
|---|---|---|---|
| Nidus Real Estate | `/nidus-re/` | Dark | DEMO |
| Century 21 The Rana Group | `/c21-rana/` | Light | DEMO |

### Demo Site
The Ray White Castle Hill demo (`/realestate-demo/`) is used for prospect demos only — not a real client.

---

## 10. Growth Plan

### Phase 1 — Months 1–3 (Foundation)
- **Goal:** 5 paying clients
- **Focus:** Western Sydney Hills District in-person sales
- **Tool:** Trifold brochure + live Sarah demo on the spot
- **KPI:** Book 3 demo calls per week minimum

### Phase 2 — Months 4–6 (Scale)
- **Goal:** 15 paying clients
- **Focus:** Expand to Greater Western Sydney + email campaigns
- **Actions:** Activate cold email sequence to Tier 3 list; begin referral program (clients refer agencies)
- **KPI:** 2 new clients per month minimum

### Phase 3 — Months 7–12 (Systematise)
- **Goal:** 30 paying clients
- **Actions:** 
  - Hire part-time sales rep (commission only)
  - Build franchise/group package for multi-office groups
  - Launch mobile buyer app as a major upsell campaign
  - Activate Stripe webhook automation (remove manual onboarding steps)
- **KPI:** MRR exceeds $9,000/mo

### Phase 4 — Year 2 (Growth)
- **Goal:** 60+ clients; expand to other states (VIC, QLD)
- **Actions:**
  - Partner with VaultRE as an endorsed integration
  - Attend REIA / state real estate conferences
  - Automated onboarding (webhook → Clerk → Twilio → DB — no manual steps)
- **KPI:** $500k cumulative revenue

---

## 11. Automation Roadmap (Known Gaps)

| Gap | Impact | Effort |
|---|---|---|
| Stripe webhook → auto-notify Jayson | Removes manual monitoring | Small |
| Stripe webhook → auto-create DB record | Removes DB step from onboarding | Small |
| Stripe webhook → auto-email client "payment received" | Professional CX | Small |
| Twilio number auto-purchase via API | Removes console step | Medium |
| Clerk org auto-create on payment | Removes manual setup | Medium |
| VaultRE connection wizard in dashboard | Client self-service | Medium |
| Automated onboarding email sequence (Resend) | Removes all manual steps | Large |

**Priority:** Build the Stripe webhook first — it notifies Jayson, creates the DB record, and emails the client automatically when payment lands.

---

## 12. Competitive Position

| | Directive OS | Generic AI Chatbot | Human VA Service |
|---|---|---|---|
| Answers phone calls | Yes | No | Yes |
| Live 24/7 | Yes | Yes | No |
| VaultRE integration | Yes | No | No |
| NSW tenancy automation | Yes | No | No |
| Hot lead call transfer | Yes | No | Rare |
| Branded mobile app | Yes (add-on) | No | No |
| Monthly cost | $299/mo | $50–200/mo | $800–2,000/mo |
| Setup time | 48 hours | Days/weeks | Weeks |

**Key differentiator:** Directive OS is the only AI that is built specifically for Australian real estate, connects live to VaultRE, and can transfer urgent callers to an agent in real time.

---

## 13. Legal & Compliance

- Electronic agreements: Client emails "I agree" + name + business = binding acceptance
- ABN: 87 754 544 171
- GST: All prices are inclusive of GST
- Cancellation: 30 days written notice, no early exit fees
- Setup fee: Non-refundable once onboarding work has commenced
- Data: Call recordings and transcripts stored in Directive OS PostgreSQL — accessible by client via dashboard
- Privacy: Clients responsible for notifying their customers that calls may be recorded/handled by AI (standard in AU telecoms)
