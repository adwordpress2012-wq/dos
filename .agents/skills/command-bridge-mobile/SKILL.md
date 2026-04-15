---
name: command-bridge-mobile
description: Complete architecture reference for the Directive OS Command Bridge mobile app — Expo React Native. Covers auth flow, all 4 tabs, API hooks, mobile API routes, and the dashboard Mobile Access token card. Use whenever modifying the mobile app or its backend routes.
---

# Command Bridge Mobile — Full Architecture Reference

> **Artifact:** `artifacts/directive-os-mobile`
> **Workspace package:** `@workspace/directive-os-mobile`
> **Kind:** Expo (React Native, iOS + Android)
> **Workflow:** `artifacts/directive-os-mobile: expo`

---

## Purpose

Command Bridge is the internal mobile app for real estate agency staff. It lets agents and principals:

- Monitor Sarah AI Receptionist stats in real time
- View and act on leads captured by Sarah
- Read full voice/chat transcripts
- See a live activity feed of everything Sarah has done

Buyers and vendors never use this app. It is included in all Directive OS plans.

---

## Authentication

### How it works

- Each agency has a **`mobileToken`** column on the `agenciesTable` (a static UUID string).
- Staff paste this token into the login screen — no username/password.
- The token is stored in **`AsyncStorage`** under the key `"mobile_token"`.
- On every app start, the stored token is verified against `POST /api/mobile/login`. If invalid, user is sent to `/login`.
- All authenticated API calls send the token in the **`x-mobile-token`** header.

### Key files

| File | Role |
|---|---|
| `artifacts/directive-os-mobile/app/login.tsx` | Login screen UI |
| `artifacts/directive-os-mobile/hooks/useAuth.tsx` | `AuthProvider` context + `useAuth()` hook |
| `artifacts/directive-os-mobile/app/_layout.tsx` | Root layout — redirects to `/login` or `/(tabs)` based on token |

### `useAuth` hook exposes

```typescript
{
  token: string | null,
  agency: AgencyInfo | null,  // { id, name, contactPhone, subscriptionStatus, aiMinutesUsed, aiMinutesIncluded }
  loading: boolean,
  login: (token: string) => Promise<{ ok: boolean; error?: string }>,
  logout: () => Promise<void>,
}
```

### API base

```typescript
const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? "https://directiveos.com.au/api";
```

Set `EXPO_PUBLIC_API_URL` in `.env` during development to point at the local API server.

---

## App Structure

```
artifacts/directive-os-mobile/
├── app/
│   ├── _layout.tsx          ← Root layout (fonts, providers, auth redirect)
│   ├── login.tsx            ← Token entry screen
│   └── (tabs)/
│       ├── _layout.tsx      ← Tab bar configuration
│       ├── index.tsx        ← Tab 1: Command Centre (home dashboard)
│       ├── leads.tsx        ← Tab 2: Lead Inbox
│       ├── transcripts.tsx  ← Tab 3: Transcripts
│       └── activity.tsx     ← Tab 4: AI Activity feed
├── hooks/
│   ├── useAuth.tsx          ← Auth context & token management
│   ├── useMobileApi.ts      ← All TanStack Query hooks for API data
│   └── useColors.ts         ← Colour palette (dark theme)
└── components/
    └── ErrorBoundary.tsx
```

### Root layout providers (in order)

```
SafeAreaProvider
  → ErrorBoundary
    → QueryClientProvider (TanStack Query)
      → AuthProvider (mobile token auth)
        → GestureHandlerRootView
          → KeyboardProvider
            → RootLayoutNav (redirects login/tabs)
```

---

## Colour Palette (`useColors`)

The app uses a dark navy theme throughout. Key colour tokens:

| Token | Usage |
|---|---|
| `navy` | Primary background (`#0a0e1a`) |
| `navyLight` | Secondary background / progress bars |
| `surface` | Card / modal backgrounds |
| `border` | Card borders |
| `teal` | Primary accent — Sarah online, calls, CTA (`#00d1b2`) |
| `gold` | Vendor accent (`#C9A84C`) |
| `textPrimary` | Main text |
| `textSecondary` | Muted/label text |

Lead type colours:
- Buyer → `teal`
- Vendor → `gold`
- Tenant → `#a78bfa` (purple)
- Landlord → `#fb923c` (orange)

---

## Tab 1 — Command Centre (`index.tsx`)

**Data hooks used:** `useDashboard()`, `useLeads()`, `useActivity()`

**What it shows:**
- Time-based greeting + agency name (first word only)
- "Sarah Online" animated pulse badge + logout button
- Banner: "Sarah captured N leads while your team was offline" (only if `newLastNight > 0`)
- 4 stat cards: Leads This Month, Hot Leads, AI Calls, Value Captured
- AI Minutes progress bar: `aiMinutesUsed / aiMinutesIncluded`
- Last 4 recent leads (tappable, routes to leads tab)
- Last 4 activity items (routes to activity tab)
- Pull-to-refresh refreshes all 3 data sources in parallel

**Auto-refresh:** `useDashboard` polls every 60s, leads/activity every 30s.

---

## Tab 2 — Lead Inbox (`leads.tsx`)

**Data hooks used:** `useLeads()`, `useUpdateLeadStatus()`

**Features:**
- Filter chips: All / Buyer / Vendor / Tenant / Landlord
- New lead count badge on screen title
- FlatList of lead cards with avatar initials, type badge, status badge, hot lead flame icon
- Tap → `LeadDetailModal` (slide-up sheet) showing:
  - Name, type + status + HOT badges
  - Contact details (phone, email, channel + time)
  - Sarah's notes
  - "Mark as Contacted" button → `PATCH /api/mobile/leads/:id { status: "contacted" }`
- Hot leads have an orange border highlight on the card
- Pull-to-refresh

**Lead statuses:** `new` (green), `contacted` (blue), `qualified` (amber), `closed` (grey)

---

## Tab 3 — Transcripts (`transcripts.tsx`)

**Data hooks used:** `useTranscripts()`, `useTranscriptDetail(id)`

**Features:**
- Segment control: All / Calls / Chats
- FlatList of transcript cards (caller name, summary preview, lead type tag, duration for voice)
- Tap → `TranscriptDetailModal` (slide-up sheet):
  - Fetches full message thread from `GET /api/mobile/transcripts/:id/messages`
  - Chat-bubble UI: Sarah (teal) vs Caller (gold)
  - Duration shown for voice calls
  - Falls back to `transcript.summary` if no messages

---

## Tab 4 — AI Activity (`activity.tsx`)

**Data hook:** `useActivity()`

**Features:**
- "LIVE" animated badge in header
- Timeline-style vertical list with icon circles + connector lines
- Line colour: teal = voice, purple = chat
- Banner: "Last 7 days — N actions by Sarah"
- Activity types: `call_answered`, `lead_captured`, `email_sent`, `inspection_booked`, `appraisal_booked`, `form_sent`
- Pull-to-refresh

---

## API Hooks (`useMobileApi.ts`)

All hooks use TanStack Query. All send `x-mobile-token` header.

| Hook | Endpoint | Poll interval |
|---|---|---|
| `useDashboard()` | `GET /api/mobile/dashboard` | 60s |
| `useLeads()` | `GET /api/mobile/leads` | 30s |
| `useUpdateLeadStatus()` | `PATCH /api/mobile/leads/:id` | mutation |
| `useTranscripts()` | `GET /api/mobile/transcripts` | 30s |
| `useTranscriptDetail(id)` | `GET /api/mobile/transcripts/:id/messages` | on demand |
| `useActivity()` | `GET /api/mobile/activity` | 30s |

All hooks are gated on `enabled: !!token` — they won't fire until the user is logged in.

---

## Backend Mobile Routes (`artifacts/api-server/src/routes/mobile.ts`)

Mounted in the main Express app. All routes under `/api/mobile/`.

### Auth middleware

```typescript
function mobileAuth(req, res, next) {
  const token = req.headers["x-mobile-token"]?.trim();
  if (!token) return res.status(401).json({ error: "x-mobile-token header required" });
  req.mobileToken = token;
  next();
}
```

Every protected route calls `getAgencyByToken(token)` to resolve the agency from `agenciesTable.mobileToken`.

### Route reference

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/mobile/login` | none | Verify token, return agency info |
| `GET` | `/api/mobile/dashboard` | `mobileAuth` | Stats: leads, hot leads, AI calls, overnight count, minutes |
| `GET` | `/api/mobile/leads` | `mobileAuth` | Last 50 leads for agency, newest first |
| `PATCH` | `/api/mobile/leads/:id` | `mobileAuth` | Update lead status (checks agency ownership) |
| `GET` | `/api/mobile/transcripts` | `mobileAuth` | Last 50 transcripts for agency |
| `GET` | `/api/mobile/transcripts/:id/messages` | `mobileAuth` | Full transcript with messages array |
| `GET` | `/api/mobile/activity` | `mobileAuth` | Last 7 days: transcripts + leads merged, sorted by date, max 40 items |

### Dashboard response shape

```typescript
{
  agencyName: string,
  leadsThisMonth: number,    // total leads (all time — note: query counts all, not filtered by month)
  hotLeads: number,
  aiCallsHandled: number,    // voice transcripts this calendar month
  newLastNight: number,      // leads since midnight yesterday
  aiMinutesUsed: number,
  aiMinutesIncluded: number,
  estimatedValue: null,      // placeholder — not yet implemented
}
```

### Activity route logic

Merges `recentTranscripts` (as `call_answered` events) and `recentLeads` (as `lead_captured` events) from the last 7 days, sorts by `createdAt` descending, returns max 40 items. Each item has `{ id, type, description, detail?, time, channel }`.

---

## Dashboard Settings — Mobile Access Card

**File:** `artifacts/directive-os/src/pages/dashboard/settings.tsx`

The `MobileTokenCard` component shows the agency's `mobileToken`:
- Token hidden by default (dots), toggle show/hide
- One-click copy to clipboard with checkmark feedback
- 3-step instructions: download app → sign in → share with agents

Access is gated to `isAgencyOwner` or `principal` role only. Token is read from `agency.mobileToken` via the `useGetMyAgency()` API hook.

---

## Database

The `mobileToken` column lives on `agenciesTable`:

```typescript
mobileToken: varchar("mobile_token", { length: 255 }),
```

It is a static UUID string (not JWT). Generated when the agency is created (or on demand). It never expires — if compromised, a new one must be generated manually (no rotation UI yet).

---

## Known Gaps / Future Work

- `estimatedValue` in dashboard always returns `null` — pipeline value calculation not implemented
- Activity tab `todayCount` logic is a no-op (always returns full count)
- No push notifications for new leads
- No mobile token rotation UI (must regenerate in DB manually)
- No per-staff login (all agents share the same agency token)
- No filtering or search on leads/transcripts lists
- `leadsThisMonth` in dashboard actually counts ALL leads, not just the current month — minor bug
