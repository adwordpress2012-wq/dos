---
name: dos-session-2025-04-16
description: Documents every improvement made on 16 April 2026 to Directive OS — admin goal tracker, Sarah Tagalog approval, transcript translation upgrade (GPT-4o + multilingual digit maps), billing missed payment system (Stripe webhooks, client warning emails), and the 5-day service suspension system (voice and chat blocking). Use when debugging billing flows, payment webhooks, service suspension, transcript extraction, or the admin goals page.
---

# Directive OS — Session 16 April 2026

## Summary of Changes

1. Admin Goal Tracker page (`/admin/goals`)
2. Sarah Tagalog configuration approved and locked
3. Transcript translation upgraded to GPT-4o with multilingual digit/email extraction
4. Billing missed payment system — Stripe webhook handlers + email alerts
5. 5-day service suspension system — voice and chat blocking with auto-recovery

---

## 1. Admin Goal Tracker — MISSION TARGET Page

### API Endpoint
`GET /admin/goals` — requires `x-admin-secret` header

**Response shape:**
```json
{
  "goalCents": 20000000,
  "mrrTargetCents": 1584700,
  "clientTarget": 53,
  "totalClients": 6,
  "activeClients": 4,
  "currentMRRCents": 119600,
  "totalRevenueCents": 540000,
  "projectedYearEndCents": 18602100,
  "monthlyCloses": [{ "month": "2026-04", "count": 1 }],
  "avgClosesPerMonth": 1.2,
  "progressPct": 3,
  "mrrProgressPct": 8,
  "clientProgressPct": 8
}
```

**Constants (hardcoded in admin.ts):**
- `GOAL_CENTS` = 20,000,000 ($200k)
- `MRR_TARGET_CENTS` = 1,584,700 ($15,847/mo)
- `CLIENT_TARGET` = 53

### Frontend Page
- File: `artifacts/directive-os/src/pages/admin/goals.tsx`
- Route: `/admin/goals` (added to `App.tsx`)
- Nav: "MISSION TARGET" with `Target` icon in `AdminLayout.tsx`
- Features:
  - Animated revenue progress bar ($0 → $200k)
  - 4 KPI cards: MRR, Active Clients, Projected Year-End, Goal %
  - 12-month monthly closes bar chart (current month in amber)
  - Milestone tracker: Month 6 / Month 9 / Month 12 with auto-reached detection
  - Weekly activity targets (20 calls, 4-5 demos, 1-2 closes, all clients)
  - Business valuation callout ($380k–$570k at goal)

---

## 2. Sarah Tagalog Configuration — APPROVED & LOCKED

**Date approved:** 16 April 2026  
**Status: DO NOT CHANGE without explicit user approval**

Live test confirmed:
- Filipino/Tagalog language detection and switching ✅
- Timing / pacing ✅
- Asking for contact details ✅

Key settings in `voice.ts` (both `DIRECTIVE_OS_PERSONA` and `buildAgencyPersona()`):
- Language list: 9 languages incl. Filipino/Tagalog
- Rule: `"respond entirely in Filipino/Tagalog, warm and conversational"`
- ONE sentence per turn — active
- Anti-repetition / double-word ban — active
- Digit-by-digit phone readback + email character readback — active
- Inspection rule (NEVER say "You're booked in" in ANY language) — active

Any modification must be tested in Tagalog before deploying.

---

## 3. Transcript Translation Upgrade

### File changed
`artifacts/api-server/src/lib/email.ts` — `generateEnglishSummary()` function

### Changes
| Setting | Before | After |
|---|---|---|
| Model | `gpt-4o-mini` | `gpt-4o` |
| Temperature | 0.2 | 0.1 |
| max_tokens | 2000 | 3000 |
| Prompt | Basic | Detailed multilingual extraction |

### Multilingual Digit Word Maps Added
The extraction AI now knows these number words map to digits:

| Language | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|---|
| Filipino | sero | isa | dalawa | tatlo | apat | lima | anim | pito | walo | siyam |
| Mandarin | 零 | 一 | 二/两 | 三 | 四 | 五 | 六 | 七 | 八 | 九 |
| Arabic | صفر | واحد | اثنين | ثلاثة | أربعة | خمسة | ستة | سبعة | ثمانية | تسعة |
| Vietnamese | không | một | hai | ba | bốn | năm | sáu | bảy | tám | chín |
| Korean | 영/공 | 일 | 이 | 삼 | 사 | 오 | 육 | 칠 | 팔 | 구 |
| Hindi | शून्य | एक | दो | तीन | चार | पाँच | छह | सात | आठ | नौ |
| Russian | ноль | один | два | три | четыре | пять | шесть | семь | восемь | девять |
| Spanish | cero | uno | dos | tres | cuatro | cinco | seis | siete | ocho | nueve |

### Filipino Email Notation
- `tuldok` → `.` (dot/period)
- `sa` / `arroba` → `@`
- `gitling` → `-` (hyphen)
- `salungguhit` → `_` (underscore)

### Extraction Logic
- When Sarah reads back digits to confirm a phone number, THAT is the captured number
- Australian mobiles: always 10 digits starting 04
- Email: reconstruct from character readback, look for Sarah's confirmation pattern

---

## 4. Billing Missed Payment System

### Webhook Handlers Added — `artifacts/api-server/src/app.ts`

**`invoice.payment_failed`**
- Looks up agency by `stripeCustomerId`
- Marks `subscriptionStatus = "past_due"` in DB
- Sets `pastDueSince = now` (first failure only — doesn't reset on retries)
- Sends `sendPaymentFailedAlert` to Jayson (every attempt)
- Sends `sendClientPaymentWarning` to client (attempt 1 only)

**`customer.subscription.deleted`**
- Marks `subscriptionStatus = "cancelled"` in DB
- Sends `sendSubscriptionCanceledAlert` to Jayson

**`customer.subscription.updated`**
- Syncs status from Stripe: active/past_due/canceled/trialing
- If becomes `active`: clears `pastDueSince` (resets the suspension clock)

### Email Functions Added — `artifacts/api-server/src/lib/email.ts`

**`sendClientPaymentWarning()`**
- To: client's `contactEmail`
- BCC: OWNER_EMAILS (Jayson + Gmail)
- Subject: `Action Required — Your Directive OS payment was unsuccessful`
- Content: amount, suspension deadline (5 days from `pastDueSince`), 3 steps to fix, Jayson contact button
- Yellow warning box with exact suspension date

**`sendPaymentFailedAlert()`**
- To: OWNER_EMAILS only
- Subject: `⚠️ Payment Failed — [Agency] (Attempt X/3)`
- Content: agency, email, amount, attempt count, next retry date, recommended actions, Stripe dashboard link

**`sendSubscriptionCanceledAlert()`**
- To: OWNER_EMAILS only
- Subject: `🔴 Subscription Cancelled — [Agency]`
- Content: agency, reason, link to admin clients dashboard

---

## 5. Service Suspension System

### DB Schema Change
New column added to `agencies` table:
```typescript
pastDueSince: timestamp("past_due_since", { withTimezone: true })
```
Applied via `pnpm run push` in `lib/db`.

### Suspension Logic
An agency is considered suspended when:
```
subscriptionStatus === "cancelled"
OR
(subscriptionStatus === "past_due" AND pastDueSince is 5+ days ago)
```

This is a **runtime check** (no cron needed) — evaluated at the moment each call/chat arrives.

### Voice Suspension — `artifacts/api-server/src/routes/voice.ts`

Check happens at the TwiML entry point (before the WebSocket stream is connected).

If suspended → return `<Say>` TwiML instead of `<Connect>`:
```xml
<Say voice="Polly.Nicole" language="en-AU">
  Thank you for calling. We're sorry, but this phone service is temporarily unavailable.
  Please contact the agency directly by email or visit their website.
  We apologise for any inconvenience.
</Say>
```

Note: The demo swap number (0259506382 → agencyId 7) bypasses this check — demo always works.

### Chat Suspension — `artifacts/api-server/src/routes/ai.ts`

Check happens when loading agency details for the chat session.

If suspended → return early with:
```
"I'm sorry, this chat service is temporarily unavailable. Please contact the agency directly by phone or email. We apologise for the inconvenience."
```

### Auto-Recovery
When `customer.subscription.updated` fires with `status: "active"`:
- `pastDueSince` is set to `null`
- `subscriptionStatus` set to `"active"`
- Voice and chat resume immediately on next call/message

### Full Billing Timeline
| Time | Event | System Action |
|---|---|---|
| Day 0 | Payment fails (attempt 1) | Mark past_due, set pastDueSince, alert Jayson, warn client |
| Day 2–4 | Stripe retries (attempts 2–3) | Alert Jayson per attempt (no new client email) |
| Day 5 | Call or chat arrives | Suspension check — service blocked if still past_due |
| Any day | Payment succeeds | Clear pastDueSince, status → active, service resumes |
| After all retries | Stripe cancels | Mark cancelled, alert Jayson, service stays blocked |
