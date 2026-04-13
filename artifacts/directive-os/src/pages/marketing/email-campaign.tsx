import { useState } from "react";

const TEAL = "#00d1b2";

const emails = [
  {
    id: 1,
    label: "Email 1 — Introduction",
    subject: "Is [Business Name] missing after-hours enquiries?",
    body: `Hi [First Name],

Quick question — when someone enquires about your business at 9pm on a Friday, what happens?

If the answer is "they wait until Monday", you're not alone. Most businesses lose 30–40% of their leads simply because no one was available to respond.

That's exactly the problem Directive OS was built to solve.

We give your business a 24/7 AI assistant called Sarah — she answers calls and messages instantly, qualifies every lead, and emails you a full summary the moment contact details are captured. No voicemail. No missed opportunities.

Setup takes less than a week, and there are no lock-in contracts.

Would it be worth a 15-minute call to see if it's a fit for [Business Name]?

[Calendly link or reply to this email]

Best,
Jayson
Founder, Directive OS
📞 02 5850 4038
🌐 directiveos.com.au`,
    tips: ["Personalise [Business Name] and [First Name]", "Works well for any service business", "Send Tuesday–Thursday, 9–11am for best open rates"],
  },
  {
    id: 2,
    label: "Email 2 — Follow-Up (3 days later)",
    subject: "Re: Is [Business Name] missing after-hours enquiries?",
    body: `Hi [First Name],

Just following up on my note from earlier this week.

I wanted to share something quick — one of our clients (a real estate agency in NSW) was missing roughly 12 after-hours enquiries per week before they turned on Directive OS. Within 30 days, they had captured and qualified over 40 leads that would have gone to voicemail.

That's not an ad claim — it's just what happens when you stop making customers wait.

Sarah (our AI assistant) handles the call or message, asks the right questions, and sends you a full transcript within seconds. You wake up to a qualified lead, not a missed call.

If you're open to a quick 15-minute demo, I'll show you exactly how it works for businesses like yours.

[Calendly link]

No pressure either way,
Jayson
Directive OS · 02 5850 4038 · directiveos.com.au`,
    tips: ["Reference the previous email in the subject line", "Include a specific result or case study", "Keep it short — 3 paragraphs max"],
  },
  {
    id: 3,
    label: "Email 3 — Final Follow-Up (5 days later)",
    subject: "Last note — [Business Name] + Directive OS",
    body: `Hi [First Name],

I'll keep this short — I know you're busy.

I've reached out a couple of times about Directive OS, our 24/7 AI business assistant. If the timing isn't right, no problem at all — I won't keep sending follow-ups.

But if you're losing sleep over missed leads or wondering how to handle after-hours enquiries without hiring extra staff, I'd genuinely love to show you what we've built.

One last link if you'd like to see it in action:
👉 directiveos.com.au/demos

If not, I wish you all the best with [Business Name] — and feel free to reach out any time if things change.

Jayson
Founder, Directive OS
📞 02 5850 4038 | jayson@directiveos.com.au`,
    tips: ["Subject line signals this is the last email — higher open rate", "Always include the live demo link", "Leave the door open — don't burn bridges"],
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button onClick={handleCopy} style={{ padding: "6px 14px", borderRadius: 6, border: `1px solid ${copied ? TEAL : "#334155"}`, background: copied ? "rgba(0,209,178,0.1)" : "transparent", color: copied ? TEAL : "#94a3b8", fontWeight: 600, cursor: "pointer", fontSize: 12 }}>
      {copied ? "✓ Copied!" : "Copy"}
    </button>
  );
}

export default function EmailCampaign() {
  const [active, setActive] = useState(0);
  const email = emails[active];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1a", color: "#fff", fontFamily: "Inter, sans-serif", padding: "40px 24px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <a href="/marketing" style={{ color: "#64748b", fontSize: 13, textDecoration: "none" }}>← Back to Marketing</a>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "12px 0 4px" }}>Cold Email Campaign</h1>
        <p style={{ color: "#64748b", marginBottom: 32 }}>3-part outreach sequence. Personalise the fields in [brackets] before sending.</p>

        {/* Tab selector */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {emails.map((e, i) => (
            <button key={i} onClick={() => setActive(i)} style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${active === i ? TEAL : "#1e293b"}`, background: active === i ? "rgba(0,209,178,0.1)" : "#111827", color: active === i ? TEAL : "#94a3b8", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>
              Email {e.id}
            </button>
          ))}
        </div>

        <div style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 16, overflow: "hidden" }}>
          {/* Subject */}
          <div style={{ padding: "16px 24px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <span style={{ color: "#64748b", fontSize: 12, marginRight: 8 }}>Subject:</span>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{email.subject}</span>
            </div>
            <CopyButton text={email.subject} />
          </div>

          {/* Body */}
          <div style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
              <CopyButton text={`Subject: ${email.subject}\n\n${email.body}`} />
            </div>
            <pre style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#cbd5e1", lineHeight: 1.75, whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0 }}>{email.body}</pre>
          </div>

          {/* Tips */}
          <div style={{ padding: "16px 24px", borderTop: "1px solid #1e293b", background: "rgba(0,209,178,0.03)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Sending Tips</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {email.tips.map(tip => (
                <div key={tip} style={{ fontSize: 11, color: "#64748b", background: "#0a0f1a", border: "1px solid #1e293b", borderRadius: 6, padding: "4px 10px" }}>{tip}</div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 24, padding: 20, background: "#111827", border: "1px solid #1e293b", borderRadius: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 14 }}>Recommended Schedule</div>
          <div style={{ color: "#64748b", fontSize: 13, lineHeight: 1.7 }}>
            Day 1 → Email 1 · Day 4 → Email 2 · Day 9 → Email 3<br />
            Best send times: Tuesday–Thursday, 9–11am or 1–3pm.<br />
            Use your CRM or a tool like Instantly, Lemlist, or Mailchimp to automate the sequence.
          </div>
        </div>
      </div>
    </div>
  );
}
