---
name: weekly-prospect-list
description: Automated weekly email that searches for 10 real estate agencies in rotating Sydney suburbs and sends a ready-to-call list to Jayson every Monday 8am AEST. Use when the user asks to update the suburb rotation, add/remove target areas, change the email format, manually trigger a prospect search, or debug the cron job.
---

# Weekly Prospect List — Directive OS

Automatically finds 10 real estate agencies in Sydney each week and emails a ready-to-call list to Jayson every Monday at 8am AEST.

## Key Files

| File | Purpose |
|------|---------|
| `artifacts/api-server/src/lib/prospector.ts` | Core logic — suburb rotation, OpenAI web search, email builder |
| `artifacts/api-server/src/index.ts` | Cron job setup (node-cron) |
| `artifacts/api-server/src/routes/system.ts` | Manual trigger endpoint |

## How It Works

1. **Schedule**: `node-cron` fires every Sunday at 22:00 UTC = Monday 8:00am AEST
2. **Suburb rotation**: Rotates through 8 suburb clusters (changes weekly based on ISO week number)
3. **Search**: Uses OpenAI Responses API with `web_search_preview` tool to find live agency data; falls back to GPT-4o knowledge base if web search fails
4. **Email**: Formatted HTML list with agency name, address, phone, website, principal, and note — sent via Resend to both owner emails

## Owner Email Recipients

- `adwordpress2012@gmail.com`
- `jayson@directiveos.com.au`

## Two Weekly Lists

### Monday 7am AEST — Multicultural Sydney (Chinese/Filipino/Russian focus)
Targets suburbs with high Chinese, Filipino, and Russian communities — key multilingual selling point for DOS.

```
Week 1: Chatswood & North Shore Chinese Community
Week 2: Burwood, Strathfield & Inner West Chinese Hub
Week 3: Hurstville & South Sydney Chinese Community
Week 4: Cabramatta & Liverpool Filipino Community
Week 5: Parramatta & Greater West
Week 6: Ashfield & Campsie Chinese Community
Week 7: Ryde & Meadowbank
Week 8: Box Hill & Hills District Growth Corridor
Week 9: Eastwood & Epping Chinese Community
Week 10: Rhodes & Concord West Chinese Community
```

To add/change: edit the `SYDNEY_CLUSTERS` array in `prospector.ts`.

### Wednesday 7am AEST — Jayson's Local Area (Greater Western Sydney)
Jayson's home territory — agencies he can visit in person or call with local knowledge.

```
Week 1: Penrith & Blue Mountains Gateway
Week 2: Richmond & Hawkesbury Valley
Week 3: Blacktown & Seven Hills
Week 4: Parramatta & Westmead Surrounds
Week 5: Liverpool & South West Corridor
Week 6: Fairfield & Cabramatta
Week 7: Mount Druitt & St Marys
Week 8: Campbelltown & Macarthur Region
```

To add/change: edit the `LOCAL_CLUSTERS` array in `prospector.ts`.

## Manual Triggers

**Monday Sydney list** (run anytime):
```bash
curl -X POST https://directiveos.com.au/api/system/prospect-now \
  -H "x-admin-secret: directive-captain-2024"
```

**Wednesday local list** (run anytime):
```bash
curl -X POST https://directiveos.com.au/api/system/prospect-local-now \
  -H "x-admin-secret: directive-captain-2024"
```

## Cron Expressions

```
"0 21 * * 0"  →  Every Sunday 21:00 UTC = Monday 07:00 AEST
"0 21 * * 2"  →  Every Tuesday 21:00 UTC = Wednesday 07:00 AEST
```

Defined in `artifacts/api-server/src/index.ts`:
```ts
cron.schedule("0 21 * * 0", () => { void runWeeklyProspector(); }, { timezone: "UTC" });
cron.schedule("0 21 * * 2", () => { void runLocalProspector(); }, { timezone: "UTC" });
```

## Email Format

Each agency card in the email shows:
- Agency name + sequential number
- Address (suburb + postcode)
- Clickable phone (tel: link) and website
- Principal agent name
- Short note (size, specialty, community focus)
- Opening pitch script at the top of the email

## Updating the Opening Pitch Line

Edit the `buildProspectEmailHtml()` function in `prospector.ts` — look for the "Your opening line" section in the HTML template.

## Package Dependency

`node-cron` is installed in `artifacts/api-server`. If it needs reinstalling:
```bash
cd artifacts/api-server && pnpm add node-cron @types/node-cron
```

## Targeting Strategy

Focus areas are chosen for high density of Chinese, Filipino, and Russian communities — these are the primary multilingual selling points for Directive OS (Sarah speaks Mandarin, Tagalog, Russian, and English). Agencies in these suburbs are most likely to have missed calls from non-English-speaking buyers and tenants.
