const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const outPath = path.join(__dirname, "directive-os-website-widget-plan.pdf");
const doc = new PDFDocument({ size: "A4", margin: 56 });
doc.pipe(fs.createWriteStream(outPath));

const NAVY = "#0a0e1a";
const TEAL = "#00d1b2";
const GOLD = "#C9A84C";
const GREY = "#4a5568";
const LIGHT = "#f5f7fa";

function h1(t) {
  doc.moveDown(0.3).fillColor(NAVY).font("Helvetica-Bold").fontSize(20).text(t);
  doc.moveTo(doc.x, doc.y + 2).lineTo(540, doc.y + 2).strokeColor(TEAL).lineWidth(2).stroke();
  doc.moveDown(0.6);
}
function h2(t) {
  doc.moveDown(0.5).fillColor(NAVY).font("Helvetica-Bold").fontSize(14).text(t);
  doc.moveDown(0.3);
}
function p(t) {
  doc.fillColor(GREY).font("Helvetica").fontSize(11).text(t, { align: "left", lineGap: 3 });
  doc.moveDown(0.4);
}
function bullet(t) {
  doc.fillColor(GREY).font("Helvetica").fontSize(11).list([t], { bulletRadius: 2, lineGap: 3, textIndent: 8 });
}
function kv(rows) {
  const startX = doc.x;
  const colW = [220, 260];
  rows.forEach(([k, v]) => {
    const y = doc.y;
    doc.font("Helvetica-Bold").fontSize(10).fillColor(NAVY).text(k, startX, y, { width: colW[0] });
    doc.font("Helvetica").fontSize(10).fillColor(GREY).text(v, startX + colW[0], y, { width: colW[1] });
    doc.moveDown(0.3);
  });
  doc.moveDown(0.3);
}
function box(text, color = TEAL) {
  const startY = doc.y;
  doc.rect(56, startY, 484, 0).fill(LIGHT);
  doc.fillColor(NAVY).font("Helvetica").fontSize(10.5).text(text, 68, startY + 10, { width: 460, lineGap: 3 });
  const endY = doc.y + 10;
  doc.rect(56, startY, 484, endY - startY).fillAndStroke(LIGHT, color).lineWidth(1);
  doc.fillColor(NAVY).font("Helvetica").fontSize(10.5).text(text, 68, startY + 10, { width: 460, lineGap: 3 });
  doc.moveDown(0.8);
}

// --- Cover header ---
doc.rect(0, 0, 595, 110).fill(NAVY);
doc.fillColor(TEAL).font("Helvetica-Bold").fontSize(10).text("DIRECTIVE OS", 56, 36);
doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(22).text("Website Widget Add-On — Build Plan", 56, 52);
doc.fillColor("#cbd5e0").font("Helvetica").fontSize(10).text("Tier 2 feature · $50/mo add-on · Hybrid self-serve + managed strategy", 56, 82);
doc.y = 140;

// --- Strategy ---
h1("Strategy");
p("Hybrid model. Keep the consultative / managed onboarding path for Tier 1 clients ($299–$899/mo core plans). Add the Website Widget as a Tier 2 $50/mo add-on for agencies who already have their own website and want Sarah embedded on it.");
p("Directive OS retains full ownership of Sarah. The widget is a thin loader script — all AI, prompts, database, and logic stay on Directive OS servers. When a client cancels or goes past-due 5+ days, the widget silently removes itself from their site using the existing suspension system.");

// --- Scope ---
h1("Scope of Work");
h2("1. Embeddable widget.js");
bullet("Hosted at directiveos.com.au/widget.js?agency=SLUG");
bullet("~60 lines of vanilla JS — no framework, no dependencies");
bullet("Renders floating Sarah chat bubble on any external website");
bullet("Pre-flight status check; server decides if widget loads or hides");
bullet("All messages relay through the Directive OS API (agencyId scoped)");

h2("2. Server-side kill switch");
bullet("Reuses existing 5-day suspension logic (pastDueSince + subscription status)");
bullet("Active → widget loads and responds normally");
bullet("past_due 5+ days or cancelled → widget removes itself silently (no broken UI)");
bullet("Auto-recovery when payment succeeds — no redeploy needed");

h2("3. Client dashboard page");
bullet("New page: 'Add Sarah to Your Website' under agency dashboard");
bullet("Shows unique copy-paste snippet with their agency slug pre-filled");
bullet("Live preview panel so the agency can test before pasting to their site");
bullet("Copy-to-clipboard button + short install instructions");

h2("4. Quote Builder line item");
bullet("New toggle: 'Website Widget Add-On — $50/mo'");
bullet("Appears in proposal PDFs and internal quote calculator");
bullet("Flows through to Stripe checkout as a second subscription line item");

h2("5. Stripe integration");
bullet("Jayson creates new Stripe price manually ($50/mo AUD recurring ex-GST)");
bullet("Jayson pastes price ID into env var (STRIPE_PRICE_WIDGET_ADDON)");
bullet("Add-on attached to existing subscription — not a separate charge");
bullet("Cancellation of add-on alone supported without killing core plan");

h2("6. Testing");
bullet("Embed widget on a blank external test page and verify it loads");
bullet("Manually suspend the test agency and confirm widget hides silently");
bullet("Restore to active and confirm widget reappears on next page load");
bullet("Verify quote builder output + Stripe checkout creates both line items");

// --- Why it's safe ---
doc.addPage();
h1("Why This Is Safe for Directive OS");
kv([
  ["You own Sarah", "Snippet is just a loader. All AI + data lives on your servers."],
  ["Clean shutoff on cancel", "Widget removes itself. No broken JS, no branded debt-collector message."],
  ["No redeploy needed", "Suspension is runtime. Turn it off in the admin panel and widget hides within seconds."],
  ["Scales cleanly", "One widget.js serves every client. Agency slug in the URL scopes everything."],
  ["Extra revenue, low overhead", "$50/mo × 50 clients = $2,500/mo MRR with near-zero marginal cost."],
]);

// --- Timing ---
h1("Time Estimate");
kv([
  ["Embeddable widget.js + hosted route", "45 min"],
  ["Dashboard page with copy-paste snippet", "30 min"],
  ["Suspension check on widget API (reuse existing)", "15 min"],
  ["Web Widget Add-On line item in Quote Builder", "30 min"],
  ["Stripe wiring for add-on line item", "30 min"],
  ["Testing on external page + suspension kill-switch", "30 min"],
  ["TOTAL", "≈ 2–3 hours of build time"],
]);
p("Jayson's required input: ~5 minutes. Create one Stripe price ($50/mo AUD ex-GST recurring) and paste the price ID into the environment variable.");

// --- Mode ---
h1("Recommended Build Mode");
box("Use POWER mode (Autonomous agent).\n\nThis work touches Stripe, the live production database, and an embeddable script that will run on clients' real websites. Power mode uses the stronger model and is better for multi-file, payment-sensitive work. Economy mode can make mistakes that cost real money here.");

// --- Cost ---
h1("Estimated Build Cost");
p("Replit Agent usage is priced per 'checkpoint' rather than per hour. A checkpoint is created roughly each time the agent finishes a batch of edits. For this build:");
kv([
  ["Estimated checkpoints", "15 – 25"],
  ["Typical Power-mode checkpoint", "~US$0.25 – $0.50 each"],
  ["Estimated total Replit Agent cost", "~US$5 – US$15"],
  ["Stripe cost (new product / price)", "$0 — Stripe is free to set up"],
  ["Additional monthly hosting cost", "$0 — runs on existing Directive OS infra"],
]);
p("This is an indicative range. Actual cost depends on how many iterations are needed during testing. Worst case with heavy debugging: up to US$25.");

// --- Execution contract ---
h1("Execution Contract (When You Give the Green Light)");
bullet("Switch Replit Agent to Power / Autonomous mode");
bullet("Confirm Stripe price ID is ready to paste in");
bullet("Agent builds all 6 scope items in one session");
bullet("Agent self-tests suspension and active flows");
bullet("Agent commits changes and presents a deployment summary");
bullet("Jayson reviews + clicks publish when satisfied");

// --- Footer ---
doc.moveDown(1);
doc.strokeColor(GOLD).lineWidth(1).moveTo(56, doc.y).lineTo(540, doc.y).stroke();
doc.moveDown(0.5);
doc.fillColor(GREY).font("Helvetica-Oblique").fontSize(9).text(
  "Directive OS — AI Receptionist for Australian Real Estate · directiveos.com.au · Plan generated 16 April 2026",
  { align: "center" }
);

doc.end();
console.log("PDF written to:", outPath);
