---
name: dos-session-2025-04-15
description: Documents every improvement made on 15 April 2025 to Directive OS — AI contact capture overhaul, spoken email parsing, voice persona double-word ban, expanded name blocklist, multilingual email translation pipeline, and the new DOS-Demo-3 multilingual landing page. Use when debugging contact capture, email transcript issues, voice persona behaviour, or when building new demo pages.
---

# Directive OS — Session Log: 15 April 2025

## What Was Fixed & Built Today

### 1. AI-First Contact Extraction (email.ts)

**Problem:** Emails and names in transcript emails were wrong — regex was guessing the caller's name as their email address, and spoken emails like "man underscore dj ph at yahoo.com" weren't being reconstructed correctly.

**Solution — three-layer extraction pipeline:**

#### Layer 1: AI summary extracts structured contacts
The `generateEnglishSummary()` function in `email.ts` now returns three dedicated fields alongside the existing summary:
```typescript
interface ConversationSummary {
  capturedName: string | null;   // Exact name as confirmed in conversation
  capturedEmail: string | null;  // user@domain.com format ONLY — never a person's name
  capturedPhone: string | null;  // Exact phone as confirmed
  // ... existing fields
}
```

The AI prompt enforces:
- `capturedEmail` must be a real `user@domain.com` address — never a person's name
- Spoken emails reconstructed: "john at gmail dot com" → `john@gmail.com`
- Any unconfirmed contact → `null` (no guessing)

#### Layer 2: Priority chain in send functions
Both `sendVoiceTranscriptEmail` and `sendChatTranscriptEmail` now:
1. Generate AI summary FIRST (before any regex)
2. Use AI-extracted contacts as primary source
3. Fall back to regex only if AI returns null

```typescript
const callerName = summary?.capturedName ?? opts.callerName ?? regexName;
const callerEmail = summary?.capturedEmail ?? regexEmail;
const callerPhone = summary?.capturedPhone ?? opts.callerPhone ?? regexPhone;
```

**Critical change:** `sendVoiceTranscriptEmail` used to accept `callerName` as a pre-extracted string with a default of `"Phone Caller"`. This blocked AI extraction. The default was removed — voice.ts now passes `null` when regex found nothing.

---

### 2. Spoken Email Parser — Handles "underscore", "dash", "dot" (voice.ts)

**Problem:** "man underscore dj ph at yahoo.com" was being parsed as `manunderscoredjph@yahoo.com`.

**Fix:** Added a `normaliseSpokenLocal()` function that runs BEFORE the regex match:
```typescript
const normaliseSpokenLocal = (raw: string): string =>
  raw
    .replace(/\s+underscore\s+/gi, "_").replace(/\bunderscore\b/gi, "_")
    .replace(/\s+hyphen\s+/gi, "-").replace(/\bhyphen\b/gi, "-")
    .replace(/\s+dash\s+/gi, "-").replace(/\bdash\b/gi, "-")
    .replace(/\s+dot\s+/gi, ".").replace(/\bdot\b/gi, ".")
    .replace(/\s+period\s+/gi, ".").replace(/\bperiod\b/gi, ".")
    .replace(/\s+/g, "");
```

Result: "man underscore dj ph at yahoo dot com" → `man_djph@yahoo.com` ✓

---

### 3. Name Blocklist Expansion (voice.ts)

**Problem:** The regex name parser was extracting "Out" from "I'm out, I'm out y'all" and treating it as the caller's name.

**Fix:** Expanded `NAME_BLOCKLIST` from ~20 words to 100+ common English words that can never be a caller's name:
- Added: `out|there|back|in|up|down|away|off|on|over|done|go|going|gone|ready|busy|sorry|thanks|bye|goodbye|testing|chat|call|talk|speak|phone` plus all common verbs/conjunctions/prepositions
- Added a length check: `if (words[0].length <= 2) continue;` — rejects single-letter and two-letter captures
- **Critical:** voice.ts now passes `callerName: null` (not `"Phone Caller"`) to `sendVoiceTranscriptEmail` when regex finds nothing, so AI extraction can take priority

The `"Phone Caller"` default was moved to the DB save level only:
```typescript
const callerLabel = callerName ?? "Phone Caller";
// Used for DB inserts only — email function handles its own fallback
```

---

### 4. Double-Word Ban in Voice Persona (voice.ts)

**Problem:** Sarah was saying things like "at all at all", "right right", "okay okay" — consecutive word repetition in voice responses.

**Fix:** Added to both `DIRECTIVE_OS_PERSONA` and `buildAgencyPersona()` immediately after the ANTI-REPETITION rule:

```
DOUBLE-WORD BAN: Never repeat the same word twice in a row within a single response.
Examples of what is FORBIDDEN: "at all at all", "right right", "okay okay", "yes yes",
"sure sure", "no no", "good good". Read your own response before speaking it — if any
word appears twice consecutively, remove the duplicate.
```

---

### 5. Chat Prompt — Strict Contact Capture Protocol (ai.ts)

The chat Sarah prompt was updated with the same protocol as voice:

```
CONTACT CAPTURE PROTOCOL — NON-NEGOTIABLE. THIS IS THE CORE OF YOUR JOB:
Every conversation MUST end with three pieces of information captured and CONFIRMED. In ANY language.

1. FULL NAME — ask, then confirm: "Just to confirm — that's [Name], correct?"
2. PHONE NUMBER — ask, then repeat back the full number: "And that number is [digits] — is that right?"
3. EMAIL ADDRESS — THE CRITICAL ONE. FOLLOW THIS EXACTLY:
   - Ask: "And your email address?" — in their language
   - When they provide it: read it back as a complete address before accepting
   - Confirm: "Just to confirm — that's [full email] — is that correct?"
   - Wait for explicit "yes" before accepting
   - Accept any spoken format and reconstruct: "john at gmail dot com" → john@gmail.com
   - NEVER use the person's name as their email address — this is a critical error
   - NEVER guess or assume the email — only accept what was explicitly provided and confirmed
```

---

### 6. DOS-Demo-3 — Multilingual Landing Page

**File:** `artifacts/directive-os/src/pages/demo-three.tsx`
**Route:** `/demo-3` (added to `artifacts/directive-os/src/App.tsx`)

**Key components built in this page:**

#### `<LanguageMarquee />`
Scrolling infinite marquee strip showing all 9 language flags, names, and native scripts. Animates at 36s loop. Placed immediately below hero, above the multilingual section.

#### `<MultilingualSection />`
- 3×3 flag grid (flag + English name + native script)
- Three differentiator cards: Voice auto-switches / Chat auto-switches / Included at no charge
- Anchor: `id="languages"` — hero CTA scrolls here

#### Hero updates vs demo-2:
- Headline: "Your Office Answers Every Call. Every Language."
- CTA: "See 9 Languages ↓" (scrolls to language section)
- Badge: "AI Receptionist · Available 24/7 · 9 Languages"

#### Email mockup (step 3) updated to show multilingual:
- Shows a Mandarin call example with 🇨🇳 flag
- "Language: Mandarin (普通话) — Translated by Sarah AI"
- App notification shows "Tap for English transcript"

#### Chat widget updates:
- Placeholder text: "Try any language — Sarah adapts..."
- Language pills shown below CTA in chat section
- All 9 language badges in chat header (same as demo-2)

**The `LANGUAGES` array is the single source of truth for the page:**
```typescript
const LANGUAGES = [
  { flag: "🇦🇺", lang: "English", native: "EN", note: "Australian" },
  { flag: "🇨🇳", lang: "Mandarin", native: "普通话", note: "Chinese" },
  { flag: "🇵🇭", lang: "Filipino", native: "Tagalog", note: "Philippines" },
  { flag: "🇷🇺", lang: "Russian", native: "Русский", note: "Russia" },
  { flag: "🇸🇦", lang: "Arabic", native: "العربية", note: "Arabic" },
  { flag: "🇰🇷", lang: "Korean", native: "한국어", note: "Korean" },
  { flag: "🇻🇳", lang: "Vietnamese", native: "Tiếng Việt", note: "Vietnamese" },
  { flag: "🇮🇳", lang: "Hindi", native: "हिंदी", note: "Indian" },
  { flag: "🇪🇸", lang: "Spanish", native: "Español", note: "Spanish" },
];
```

---

## Key Architecture Reminders

### Contact Extraction Priority (ALWAYS in this order):
1. `summary.capturedName/capturedEmail/capturedPhone` (AI-extracted from full transcript)
2. `opts.callerName/callerPhone` passed from voice.ts (regex result — now `null` if not found)
3. `regexName/regexEmail/regexPhone` from `detectContact(fullText)` in email.ts

### AI Summary Prompt Rules (email.ts):
- `capturedEmail` must be `user@domain.com` format — never a name
- Spoken emails reconstructed from "john at gmail dot com"
- `null` if not explicitly confirmed in conversation
- All 9 languages supported — AI auto-translates transcript to English

### Voice Persona Files:
- `DIRECTIVE_OS_PERSONA` = main Directive OS line (Sarah, general businesses)
- `buildAgencyPersona(agency)` = client agency lines (real estate specific)
- Both have identical: ANTI-REPETITION, DOUBLE-WORD BAN, CONTACT CAPTURE PROTOCOL, MULTILINGUAL rules

### Demo Page Pattern (all demo pages follow this):
- Dark theme (`#07090f` background, `#00d1b2` teal accent)
- Self-contained — no Tailwind, all inline styles
- Chat widget uses `agencyName: "Directive OS Demo"` in POST body (never `agencyId`)
- Phone: `02 5850 4038`
- API calls go to `/api/ai/chat`

---

## Files Changed Today

| File | Change |
|------|--------|
| `artifacts/api-server/src/lib/email.ts` | Added `capturedName/Email/Phone` to interface; AI-first extraction in both send functions; AI summary generated BEFORE regex |
| `artifacts/api-server/src/routes/voice.ts` | `normaliseSpokenLocal()` for spoken email; expanded NAME_BLOCKLIST; `callerName` defaults to `null` not "Phone Caller"; DOUBLE-WORD BAN added to both personas; CONTACT CAPTURE PROTOCOL in both personas |
| `artifacts/api-server/src/routes/ai.ts` | CONTACT CAPTURE PROTOCOL added to chat Sarah prompt |
| `artifacts/directive-os/src/pages/demo-three.tsx` | NEW — DOS-Demo-3 multilingual landing page |
| `artifacts/directive-os/src/App.tsx` | Added `DemoThree` import and `/demo-3` route |

---

## Commit References

- `7db75f5` — AI-first contact extraction + multilingual translation pipeline
- `a4781b5` — Spoken email parsing (underscore/dash/dot) + name blocklist expansion + null default for callerName
- `cfbcb0a` — Double-word ban added to both voice personas
- `08e10a7` — DOS-Demo-3 multilingual page + /demo-3 route
