const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const outPath = path.join(__dirname, "directive-os-outreach-playbook.pdf");
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
function h3(t) {
  doc.moveDown(0.3).fillColor(TEAL).font("Helvetica-Bold").fontSize(11).text(t);
  doc.moveDown(0.2);
}
function p(t) {
  doc.fillColor(GREY).font("Helvetica").fontSize(10.5).text(t, { align: "left", lineGap: 3 });
  doc.moveDown(0.4);
}
function quote(t) {
  const startY = doc.y;
  doc.fillColor(LIGHT).rect(56, startY, 484, 0).fill();
  doc.fillColor(NAVY).font("Helvetica").fontSize(10.5).text(t, 70, startY + 8, { width: 460, lineGap: 3 });
  const endY = doc.y + 8;
  doc.fillColor(LIGHT).rect(56, startY, 484, endY - startY).fill();
  doc.strokeColor(TEAL).lineWidth(3).moveTo(56, startY).lineTo(56, endY).stroke();
  doc.fillColor(NAVY).font("Helvetica").fontSize(10.5).text(t, 70, startY + 8, { width: 460, lineGap: 3 });
  doc.moveDown(0.6);
}
function bullet(t) {
  doc.fillColor(GREY).font("Helvetica").fontSize(10.5).list([t], { bulletRadius: 2, lineGap: 3, textIndent: 8 });
}

// ─── COVER ─────────────────────────────────────────────────────────────────
doc.fillColor(NAVY).rect(0, 0, 595, 842).fill();
doc.fillColor(TEAL).font("Helvetica-Bold").fontSize(36).text("Outreach Playbook", 56, 200);
doc.fillColor("#ffffff").font("Helvetica").fontSize(16).text("Directive OS — Real Estate Edition", 56, 250);
doc.fillColor(GOLD).font("Helvetica").fontSize(11).text("Email · SMS · WhatsApp sequences for cold + warm prospects", 56, 290);
doc.fillColor("rgba(255,255,255,0.4)").font("Helvetica").fontSize(9).text("Agent-to-agent tone · Friendly, casual, professional", 56, 320);
doc.fillColor(TEAL).font("Helvetica-Bold").fontSize(10).text("directiveos.com.au", 56, 760);

doc.addPage();

// ─── INTRO ─────────────────────────────────────────────────────────────────
h1("How to Use This Playbook");
p("This is a 4-touch outreach sequence designed for fellow real estate agents reaching out to other agencies. The tone is warm, casual, and professional — never pushy, never salesy.");
p("Use the Email sequence as your main outreach channel. Add SMS or WhatsApp when you have the prospect's mobile number — these get higher reply rates but feel more personal.");

h2("Sequence Schedule");
bullet("Day 0 — Touch 1 (intro)");
bullet("Day 2-3 — Touch 2 (follow-up)");
bullet("Day 5 — Touch 3 (soft close)");
bullet("Day 7-10 — Touch 4 (final note)");
p(" ");
p("If they read but don't reply, wait the full window before the next touch. Never send 2 messages in 24 hours.");

// ─── EMAIL SEQUENCE ────────────────────────────────────────────────────────
doc.addPage();
h1("Email Sequence");

h3("Email 1 — Intro");
p("Subject: Quick hello from one agent to another");
quote("Hi [Name],\n\nHope you're having a good week. I'm [Your Name] — I work in real estate too, and lately I've been helping a few agencies set up smarter ways to handle calls and leads after hours.\n\nThought I'd reach out and say hi. Would you be open to a quick chat at some point? Happy to work around whatever suits you.\n\nCheers,\n[Your Name]");

h3("Email 2 — Follow-up (2-3 days later)");
p("Subject: Just bumping this up");
quote("Hi [Name],\n\nJust popping back in case my last note got lost in the inbox.\n\nIs there a time that works better for a quick chat? Even a 5-minute call is fine if you're flat out.\n\nCheers,\n[Your Name]");

h3("Email 3 — Soft close (5 days later)");
p("Subject: All good if not the right time");
quote("Hi [Name],\n\nTotally understand things get busy. If now isn't ideal, no stress — just let me know if I should circle back later, or if there's someone else on the team I should chat to instead.\n\nCheers,\n[Your Name]");

h3("Email 4 — Final touch (7-10 days later)");
p("Subject: Last one from me");
quote("Hi [Name],\n\nI'll leave it here for now. If it's easier than a call, I can send through a quick overview — just say the word.\n\nEither way, all the best with the listings.\n\nCheers,\n[Your Name]");

// ─── SMS SEQUENCE ──────────────────────────────────────────────────────────
doc.addPage();
h1("SMS Sequence");
p("Short, punchy, real-estate to real-estate. Always sign off with your first name so they know it's a person.");

h3("SMS 1 — Intro");
quote("Hey [Name], it's [Your Name] — fellow agent. Been helping a few agencies sort out after-hours calls and lead capture. Worth a quick chat? No pressure either way 👍");

h3("SMS 2 — Follow-up (2 days later)");
quote("Hey [Name], just bumping this in case you missed it. Even a 5-min chat works if you're flat out — let me know what suits.");

h3("SMS 3 — Soft close (4-5 days later)");
quote("All good if now's not the right time [Name]. Want me to circle back later, or is there someone else on your team I should chat to?");

h3("SMS 4 — Final touch (7 days later)");
quote("Last one from me [Name] 🙂 Happy to send a quick overview instead of a call if easier — just say the word. All the best with the listings.");

h2("SMS Tips");
bullet("Send between 9-11am or 2-4pm weekdays — agents check phones between appointments");
bullet("Avoid Mondays (busy day) and Friday afternoons (winding down)");
bullet("Keep emojis to 1 max — looks human, not spammy");
bullet("Always sign off with your first name");

// ─── WHATSAPP SEQUENCE ─────────────────────────────────────────────────────
doc.addPage();
h1("WhatsApp Sequence");
p("Slightly longer than SMS but still casual. WhatsApp shows read receipts — wait 48 hours before following up if they read but don't reply.");

h3("Message 1 — Intro");
quote("Hey [Name], hope you're going well 👋\n\nIt's [Your Name] — I'm in real estate myself. Been working on something that helps agencies pick up after-hours calls and capture leads automatically (basically a virtual receptionist trained for property enquiries).\n\nThought I'd reach out and see if it's worth a quick chat. No sales pitch — just a chat between agents. Let me know what suits 🙂");

h3("Message 2 — Follow-up (2-3 days later)");
quote("Hey [Name], just floating this back up in case it slipped through.\n\nHappy to keep it super quick — even 5 mins between appointments works. Would later this week suit?");

h3("Message 3 — Soft close (4-5 days later)");
quote("All good if the timing's off [Name] 👍\n\nWant me to circle back in a few weeks, or is there someone else at the office I should have a chat to?");

h3("Message 4 — Final touch (7-10 days later)");
quote("Hey [Name], I'll leave it here for now.\n\nIf easier, I can flick through a quick 1-pager so you can have a look in your own time — just let me know. Either way, all the best with the listings 🏡");

h2("WhatsApp Tips");
bullet("Set a professional head-shot as your profile photo — agents reply more to a face");
bullet("Set your About to 'Real estate + AI tools' so they know who you are");
bullet("Best send times: 9-10am, 1-2pm, 6-7pm");
bullet("Voice notes (15-20 sec) get 2-3x more replies than text");

// ─── CHANNEL STRATEGY ──────────────────────────────────────────────────────
doc.addPage();
h1("Channel Strategy");

h2("Cold Phone vs Cold Email vs Cold SMS");
p("Phone: highest conversion, faster feedback, but more rejection. Best when you have a specific principal/contact and want fast rapport.");
p("Email: easier to repeat, less intrusive, better for first touch. Best for scale and polish.");
p("SMS/WhatsApp: highest open rate, fastest reply, but more personal. Best when you already have a mobile number.");

h2("Recommended Play");
bullet("Email first → call same day if they open or click");
bullet("If they don't open in 48 hours → send SMS or WhatsApp");
bullet("After 4 touches with no reply → move on, circle back in 60-90 days");

h2("Best Send Times (AEST)");
bullet("Tuesday, Wednesday, Thursday — best days");
bullet("9-11am — between appointments and inspections");
bullet("2-4pm — afternoon admin window");
bullet("Avoid: Monday (chaos), Friday afternoon (winding down), weekends");

doc.fillColor(GOLD).font("Helvetica-Bold").fontSize(10).text(" ", 56, 760);
doc.fillColor(TEAL).font("Helvetica-Bold").fontSize(10).text("directiveos.com.au — Built by agents, for agents", 56, 780);

doc.end();

doc.on("pageAdded", () => {});
console.log("PDF written to:", outPath);
