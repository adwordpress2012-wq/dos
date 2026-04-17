---
name: dos-session-2026-04-17
description: Documents the Sarah voice call hangup fix on 17 April 2026 — Sarah was dropping calls early (after ~3 mins) because the auto-hangup trigger was matching loose phrases like "wonderful day" anywhere in her speech. Fix tightened the trigger to require the FULL scripted goodbye AND a matching caller farewell. Use when debugging premature call end, voice call duration issues, or auto-hangup logic.
---

# Directive OS — Session 17 April 2026

## Issue reported
Jayson tested Sarah on the live line. Conversation was healthy for **2 minutes 57 seconds**, then Sarah hung up unexpectedly while the caller still wanted to keep talking.

## Root cause
File: `artifacts/api-server/src/routes/voice.ts` (around line 458)

The auto-hangup logic was triggering whenever Sarah's spoken transcript contained the substring `"wonderful day"` OR `"have a great day"` — anywhere in any sentence.

```ts
// OLD — too loose
if (
  !session.hangupScheduled &&
  (lower.includes("wonderful day") || lower.includes("have a great day"))
) {
  session.hangupScheduled = true;
  setTimeout(() => { /* close both sockets */ }, 2000);
}
```

So friendly mid-call closers like:
- "Great, **have a wonderful day** at the inspection!"
- "Hope you **have a great day** picking up the keys."

…were being interpreted as the final goodbye, and the line dropped within 2 seconds. That is exactly what cut Jayson's test call at 2:57.

## Fix applied
Tightened the trigger so the call ONLY ends when **both** of the following are true at the same time:

1. **Sarah delivers the full scripted goodbye** — must contain both `"lovely chatting"` (or `"been lovely"`) AND `"wonderful day"`. This matches the persona's mandated final line: *"It's been lovely chatting with you — have a wonderful day!"*
2. **The caller's last utterance is an actual farewell** — regex matches `bye | goodbye | see ya | see you | cheers | thanks | thank you | that's all | all good | nothing else | talk later | talk soon | appreciate it | have a good one`.

```ts
const sarahFullGoodbye =
  (lower.includes("lovely chatting") && lower.includes("wonderful day")) ||
  (lower.includes("been lovely") && lower.includes("wonderful day"));

const lastUserMsg = [...session.transcript].reverse().find((m) => m.role === "user");
const callerSaidGoodbye = lastUserMsg
  ? /\b(bye|goodbye|see ya|see you|cheers|talk later|talk soon|thanks(?: a lot)?|thank you|that'?s all|that is all|all good|nothing else|no(?:thing)? more|appreciate it|have a good one)\b/i.test(
      lastUserMsg.content,
    )
  : false;

if (!session.hangupScheduled && sarahFullGoodbye && callerSaidGoodbye) {
  session.hangupScheduled = true;
  setTimeout(() => { /* close both sockets */ }, 2000);
}
```

## Result
- **No hard time limit on calls.** Twilio's natural cap (4 hours per call) applies.
- Sarah will now keep talking as long as the caller wants. The call only ends when:
  - The caller hangs up the phone, OR
  - Both sides exchange a real goodbye (Sarah uses the full scripted closer AND the caller responds with a farewell), OR
  - Twilio's stop event fires for any other reason.
- The endless "bye-bye-bye" loop the original code was guarding against is still prevented — Sarah's goodbye still triggers a scheduled hangup, just only when the caller has also said goodbye.

## Files changed
- `artifacts/api-server/src/routes/voice.ts` — auto-hangup trigger tightened (lines ~458–490)

## Workflow restarted
- `artifacts/api-server: API Server`

## Test plan for next call
1. Call the live Sarah line.
2. Have a multi-turn conversation that lasts > 5 minutes.
3. During the conversation, deliberately say "have a wonderful day" or similar mid-thought — Sarah should keep going, not hang up.
4. End the call naturally by saying "thanks, bye" — Sarah should deliver her full goodbye and the line should drop ~2 seconds later.

## Related context
- Persona scripted goodbye: *"It's been lovely chatting with you — have a wonderful day!"* — defined in `voice.ts` PERSONA constants around lines 87 and 214.
- Onboarding/billing flows untouched.
- No DB schema changes.
