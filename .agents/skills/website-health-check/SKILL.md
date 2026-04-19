# Website Health Check Report Skill

## Purpose
Generate a professional, branded Website Health Check Report for a prospect's current website. This report is used as a pre-sales tool — attached to a proposal or email — to demonstrate expertise, build trust, and naturally lead the client toward booking a rebuild quote with Directive OS.

## Where It Lives
**URL:** `directiveos.com.au/marketing/health-check`

The page is interactive and produces a printable A4 PDF report. No external tools needed.

## Workflow — Step by Step

### 1. Research the client's website before opening the tool
Spend 5–10 minutes reviewing the site. Look at:
- Desktop and mobile layout
- Navigation complexity
- Page load speed (use PageSpeed Insights: pagespeed.web.dev)
- Google search: `site:theirdomain.com.au` — count indexed pages
- Check for HTTPS, SSL padlock
- Look at blog/content quality
- Count calls-to-action on the homepage
- Check for testimonials, reviews, trust signals

### 2. Open the Health Check Builder
Go to: `directiveos.com.au/marketing/health-check`

### 3. Click "Edit Client"
Fill in:
- Client business name
- Their website URL
- Contact person's name

### 4. Rate each section using the left panel sliders (1–10)

**Rating Guide:**

| Section | What to assess |
|---|---|
| 🎨 Design | Does it look modern, professional, trustworthy? Clean layout? Brand consistent? |
| 🔍 SEO | Local keyword pages? Meta titles visible? Google indexed? Schema markup? |
| 📱 Mobile | Does it look good on phone? Easy to tap? Fast to load on mobile? |
| ⚡ Speed | Use PageSpeed Insights. Under 3 sec = good. 5+ sec = critical. |
| 📝 Content | Is the copy clear, specific, compelling? Or generic and forgettable? |
| 🎯 Conversion | Visible phone number? Testimonials? Reviews? Easy contact? Strong CTA? |
| 🔒 Security | HTTPS? WordPress without security? Outdated plugins visible? |

**Scoring reference:**
- 9–10: Excellent, industry leading
- 7–8: Good, minor improvements only
- 5–6: Average, needs work
- 3–4: Poor, significant issues
- 1–2: Critical, actively hurting business

### 5. Edit the notes for each section
The notes auto-populate with template text. Customise them to reflect what you actually saw on their specific site. Be honest but professional — specific observations are more compelling than generic ones.

### 6. Review the auto-generated report
The right panel updates live. Check:
- Overall score looks right
- Verdict is appropriate (MINOR / PARTIAL / FULL / URGENT)
- Package recommendation makes sense
- Add-on suggestions are relevant

### 7. Click "Build Quote from this Report →"
This opens the Web Quote Builder pre-filled with:
- Project type (new build or rebuild)
- Recommended package (starter/business/professional/enterprise)
- Client name
- Pre-checked add-ons based on low-scoring sections

Adjust the quote as needed, then print both the Health Check Report AND the Quote as PDFs.

### 8. Print / Save PDF
Click "Print / PDF" — the left control panel hides, leaving only the clean A4 report. Save as PDF and attach to your proposal email.

---

## Scoring → Recommendation Logic

| Average Score | Verdict | Recommended Package |
|---|---|---|
| 8.0+ | Minor Improvements Only | Not a rebuild — suggest add-ons |
| 6.5–7.9 | Partial Refresh | Starter Rebuild ($1,800) |
| 4.5–6.4 | Full Rebuild Recommended | Business Rebuild ($3,500) |
| Below 4.5 | Urgent Rebuild Required | Professional Rebuild ($5,200) |

---

## Auto-Suggested Add-ons Logic

| Low Score Section | Add-ons Suggested |
|---|---|
| SEO < 7 | SEO Foundation + Google Analytics |
| Speed < 7 | Speed & Performance Optimisation |
| Content < 6 | Copywriting per page |
| Conversion < 7 | Custom Forms & Lead Capture |
| Security < 7 | Security Hardening & SSL |
| Always | AI Receptionist — Sarah (Directive OS) |

---

## Tone Guidelines
- **Professional but honest** — don't sugarcoat critical issues, but frame them constructively
- **Specific over generic** — "reCAPTCHA on every form adds friction" beats "forms need improvement"
- **Solution-oriented** — every problem statement should imply the fix we offer
- **Casual enough to be human** — this isn't a legal document, it's a conversation starter

---

## Creating a New Report for a Different Client
1. Open `/marketing/health-check`
2. Click "Edit Client" and update all three fields
3. Reset sliders to neutral (5) before you start rating
4. Update the notes to reflect the new client's specific site
5. Click "Build Quote →" to generate their pre-filled quote
6. Print both documents and send

---

## Files
- Health Check page: `artifacts/directive-os/src/pages/marketing/health-check.tsx`
- Web Quote page: `artifacts/directive-os/src/pages/marketing/web-quote.tsx`
- Marketing Hub: `artifacts/directive-os/src/pages/marketing/index.tsx`
