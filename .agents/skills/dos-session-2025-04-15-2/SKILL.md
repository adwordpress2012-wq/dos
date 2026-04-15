---
name: dos-session-2025-04-15-2
description: Documents every improvement made in the second session of 15 April 2025 to Directive OS — multilingual inspection booking compliance (applied to all 9 languages), and the full multilingual transcript translation pipeline (DB schema, call/chat end processing, dashboard display). Use when debugging Sarah's inspection handoff behaviour in any language, translating transcripts in the dashboard, or modifying the post-call/post-chat processing pipeline.
---

# Directive OS — Session 2 (15 April 2025)

## Changes Made This Session

### 1. Inspection Booking Compliance — Extended to ALL Languages

**Problem:** The inspection handoff rule ("never say 'You're booked in'") existed in the English prompt instructions but was not explicitly enforced for multilingual callers. Sarah could theoretically confirm a booking in Mandarin, Arabic, etc.

**Fix:** Updated prompts in both `voice.ts` and `ai.ts` to explicitly state the rule applies in ANY language.

**Files changed:**
- `artifacts/api-server/src/routes/voice.ts` — `buildAgencyPersona()` buyer/tenant/vendor bullets
- `artifacts/api-server/src/routes/ai.ts` — `buildRealEstateSarahPrompt()` and platform prompt

**Canonical wording (voice.ts):**
```
- Buyers: find out their preferred suburb, budget, bedrooms, and timeline. When they want an inspection, say (in their language): "I'd love to arrange that — can I grab your name, best contact number, email address, and what times generally work for you?" Collect all four and confirm each one back clearly. Then say (in their language): "Perfect — your inspection request is with our team and they'll call you shortly to confirm the time." NEVER say "You're booked in" or "That's confirmed" in ANY language — only a licensed agent can confirm an inspection.
- Tenants: ...collect preferred viewing times using the same script in their language. Always close with (in their language): "Our team will be in touch to lock in the time."
- Vendors: Ask (in their language): "I can arrange a complimentary appraisal..." ...say (in their language): "I've passed that on to our principal — they'll call you shortly to confirm." NEVER say "You're booked in" in ANY language.
```

**Why this matters:** Under the Property and Stock Agents Regulation 2022 (NSW), confirming an inspection appointment is a licensed agent function. The AI must never do it in any language. Reference: `.agents/reference/Property_and_Stock_Agents_Regulation_2022.txt`

---

### 2. Multilingual Transcript Translation Pipeline

**Problem:** Sarah conducts conversations in 9 languages but the dashboard transcript viewer always showed raw messages in the original language (Mandarin, Arabic, Korean, etc.), making them unreadable for agency staff.

The email translation WAS working (via `generateEnglishSummary` in `email.ts`) but translations were never saved to the database.

**Root cause:** `generateEnglishSummary` was only called inside the email-sending functions and its output was never persisted to the DB.

#### DB Schema Changes

File: `lib/db/src/schema/transcripts.ts`

Added two nullable columns:
```typescript
// transcriptsTable
language: text("language"),  // e.g. "Mandarin", "Arabic", "English"

// transcriptMessagesTable
translatedContent: text("translated_content"),  // English translation of message, null if English
```

Applied with:
```bash
pnpm --filter @workspace/db run push
```

#### email.ts Changes

File: `artifacts/api-server/src/lib/email.ts`

1. **Exported `generateEnglishSummary`** (was private):
   ```typescript
   export async function generateEnglishSummary(...) { ... }
   ```

2. **Added `preComputedSummary?` to `sendVoiceTranscriptEmail`** — prevents calling OpenAI twice when the summary is already generated:
   ```typescript
   preComputedSummary?: ConversationSummary | null;
   // Uses it if provided, falls back to generating one
   ```

3. **Added `preComputedSummary?` to `sendChatTranscriptEmail`** — same pattern. Also changed return type to `Promise<ConversationSummary | null>` so callers can reuse the result.

#### voice.ts Changes (`onCallEnd`)

File: `artifacts/api-server/src/routes/voice.ts`

Now generates English summary **before** saving transcript messages to DB:

```typescript
// 1. Generate summary once
let voiceSummary = null;
if (session.transcript.length > 0) {
  voiceSummary = await generateEnglishSummary(session.transcript, "voice", durationSeconds);
}

// 2. Save transcript with language + translated content per message
const detectedLanguage = voiceSummary?.language ?? null;
const isEnglish = voiceSummary?.isEnglish !== false;
const translatedMsgs = voiceSummary?.translatedMessages ?? [];

// transcript row gets language column
{ ..., language: detectedLanguage }

// each message row gets translatedContent
session.transcript.map((m, i) => ({
  ...m,
  translatedContent: (!isEnglish && translatedMsgs[i]?.content) ? translatedMsgs[i].content : null,
}))

// 3. Pass preComputedSummary to email function (avoids second OpenAI call)
sendVoiceTranscriptEmail({ ..., preComputedSummary: voiceSummary });
```

#### ai.ts Changes (Chat Lead Capture)

File: `artifacts/api-server/src/routes/ai.ts`

Chat messages are saved one-at-a-time per exchange, so translation is applied at the point of lead capture (when email is triggered):

```typescript
// Generate English summary once
const chatSummary = await generateEnglishSummary(history, "chat");

// If non-English, backfill all transcript messages with translations
if (chatSummary && !chatSummary.isEnglish && chatSummary.translatedMessages?.length) {
  // Update transcript record with language
  await db.update(transcriptsTable).set({ language: chatSummary.language })...

  // Fetch all saved messages and update each with its translated content
  const savedMsgs = await db.select({ id: transcriptMessagesTable.id })
    .from(transcriptMessagesTable)
    .where(eq(transcriptMessagesTable.transcriptId, transcript.id))
    .orderBy(transcriptMessagesTable.timestamp);

  for (let i = 0; i < savedMsgs.length; i++) {
    await db.update(transcriptMessagesTable)
      .set({ translatedContent: chatSummary.translatedMessages[i]?.content })
      .where(eq(transcriptMessagesTable.id, savedMsgs[i].id));
  }
}

// Pass pre-computed summary to email
sendChatTranscriptEmail({ ..., preComputedSummary: chatSummary });
```

#### Dashboard Transcript Viewer

File: `artifacts/directive-os/src/pages/dashboard/transcripts.tsx`

Updated `TranscriptDetail` component:

- **Language badge** in modal header — blue pill showing detected language (e.g. "🌐 Mandarin")
- **Translation notice banner** — shown only when translated: "Translated from Mandarin to English by Sarah AI — original recording preserved"
- **Message rendering** — shows `translatedContent` as primary text, shows original in faded italic below it
- **Summary filter** — hides internal `chat:sessionId` summary keys from display
- Fixed label: "Caller" → stays "Caller", "Directive OS (AI Receptionist)" → "Sarah (AI Receptionist)"

```tsx
// Show translation if available, original as footnote
<p className="text-sm leading-relaxed">{msg.translatedContent ?? msg.content}</p>
{msg.translatedContent && (
  <p className="text-xs text-muted-foreground/60 mt-1.5 italic border-t border-border/40 pt-1.5">
    {msg.content}
  </p>
)}
```

---

## Architecture Summary: Translation Flow

```
VOICE CALL ENDS
    ↓
onCallEnd() in voice.ts
    ↓
generateEnglishSummary(transcript, "voice", duration)
    → detects language
    → translates all messages to English
    → returns { language, isEnglish, translatedMessages[], ... }
    ↓
DB: transcripts.language = "Mandarin"
DB: transcript_messages[i].translated_content = "English text"
    ↓
sendVoiceTranscriptEmail(preComputedSummary)  ← no second API call
    → email shows translated transcript

DASHBOARD OPENS TRANSCRIPT
    ↓
GET /api/transcripts/:id
    → returns transcript + messages (including translated_content)
    ↓
UI shows translatedContent ?? content
    → language badge if non-English
    → "Translated from X" banner
    → original text in faded italic below each message
```

```
CHAT LEAD CAPTURED
    ↓
detectAction() triggers collect_lead
    ↓
generateEnglishSummary(history, "chat")
    ↓
DB: UPDATE transcript SET language = "Arabic"
DB: UPDATE each transcript_message SET translated_content = "English text"
    ↓
sendChatTranscriptEmail(preComputedSummary)  ← no second API call
```

---

## Key Files Reference

| File | Role |
|------|------|
| `artifacts/api-server/src/lib/email.ts` | `generateEnglishSummary()` (exported), `sendVoiceTranscriptEmail()`, `sendChatTranscriptEmail()` |
| `artifacts/api-server/src/routes/voice.ts` | `onCallEnd()` — post-call processing, translation, DB save |
| `artifacts/api-server/src/routes/ai.ts` | Chat message save + lead capture + translation backfill |
| `artifacts/api-server/src/routes/transcripts.ts` | GET /transcripts + GET /transcripts/:id — returns all columns including `language` and `translatedContent` |
| `lib/db/src/schema/transcripts.ts` | DB schema — `language` on transcripts, `translatedContent` on messages |
| `artifacts/directive-os/src/pages/dashboard/transcripts.tsx` | Dashboard transcript viewer with translation UI |

---

## Compliance Notes

- Sarah speaks 9 languages: English (AU), Mandarin, Filipino/Tagalog, Russian, Arabic, Korean, Vietnamese, Hindi, Spanish
- The "never confirm an inspection" rule is absolute — applies in all 9 languages
- Regulation reference: `.agents/reference/Property_and_Stock_Agents_Regulation_2022.txt`
- Correct handoff phrase (in caller's language): "Your inspection request is with our team — they'll be in touch shortly to confirm a time."
- Forbidden in any language: "You're booked in", "That's confirmed", "Your booking is confirmed"
