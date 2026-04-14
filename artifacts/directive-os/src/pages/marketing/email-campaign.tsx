import { useState } from "react";

const TEAL = "#00d1b2";
const FROM = "adwordpress2012@gmail.com";

function buildEmails(agency: string, contact: string, website: string, score: string, f1: string, f2: string, f3: string, quoteLink: string) {
  const ag = agency  || "[Agency Name]";
  const co = contact || "[First Name]";
  const wb = website || "[their website]";
  const sc = score   || "?";
  const q  = quoteLink || "directiveos.com.au/marketing/web-quote";

  return [
    {
      id: 1,
      label: "Email 1 — The Observation",
      subject: `${wb} — quick website note`,
      body:
`Hi ${co},

I was doing some research on real estate agencies in your area and ran a quick check on ${wb}.

One thing stood out straight away — ${f1 || "page speed on mobile is well below the 3-second threshold that Google uses to rank sites"}. That usually means a chunk of your enquiries are dropping off before they even hit your contact form.

Anyway — thought it was worth a mention. Is this something you're already looking at fixing?

Not trying to sell anything just yet — just a genuine observation.

Jayson
Directive OS
02 5850 4038 · directiveos.com.au

Not interested? Just reply and I won't contact you again.`,
      tips: [
        "Send Tuesday–Thursday, 9–11am",
        "No attachments on Email 1 — keeps it out of spam",
        "Personalise the finding to something specific you actually noticed",
        "Subject line uses their domain — high open rate",
      ],
    },
    {
      id: 2,
      label: "Email 2 — The Audit Report",
      subject: `Your free Website Health Check — ${ag}`,
      body:
`Hi ${co},

Following up on my last note — I went ahead and ran a full audit on ${wb}.

Overall score: ${sc}/10

Three things standing out:

1. ${f1 || "Page speed on mobile — loading well above 3 seconds, which hurts Google rankings and drops off enquiries"}
2. ${f2 || "No testimonials or Google Reviews visible above the fold — trust signals are missing on the homepage"}
3. ${f3 || "reCAPTCHA on all enquiry forms — adds friction and typically reduces form completions by 20–30%"}

The full report is attached as a PDF.

I've also put together a no-obligation quote based on what I found — you can view it here:
${q}

Happy to walk through it on a 15-minute call if that's easier.

Jayson
Directive OS
02 5850 4038 · directiveos.com.au

Not interested? Just reply and I won't follow up again.`,
      tips: [
        "Attach the Health Check PDF to this email",
        "Include the pre-filled quote link from the Health Check tool",
        "Send 3–4 days after Email 1",
        "If they reply to Email 1, skip this and go straight to the quote",
      ],
    },
    {
      id: 3,
      label: "Email 3 — Soft Close",
      subject: `Re: ${ag} — last one from me`,
      body:
`Hi ${co},

Last note from me — I know your inbox is busy.

I've sent through a free website audit and a quote for ${ag} over the past couple of weeks. If the timing isn't right, that's completely fine — I won't keep following up.

The quote stays open for 30 days if you want to revisit it:
${q}

And if things change down the track — new financial year, new goals, or you just decide the website needs a refresh — feel free to reach out any time.

Wishing you all the best with ${ag}.

Jayson
Founder · Directive OS
02 5850 4038 · jayson@directiveos.com.au · directiveos.com.au`,
      tips: [
        "Send 5–7 days after Email 2",
        '"Last one from me" subject lines have higher open rates',
        "Leave the door open — don't burn the relationship",
        "Some replies come from Email 3 weeks or months later",
      ],
    },
  ];
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); }}
      style={{ padding: "6px 14px", borderRadius: 6, border: `1px solid ${copied ? TEAL : "#334155"}`, background: copied ? "rgba(0,209,178,0.1)" : "transparent", color: copied ? TEAL : "#94a3b8", fontWeight: 600, cursor: "pointer", fontSize: 12 }}
    >
      {copied ? "✓ Copied!" : "Copy"}
    </button>
  );
}

export default function EmailCampaign() {
  const [active, setActive]       = useState(0);
  const [agency,  setAgency]      = useState("Elite Sydney Property");
  const [contact, setContact]     = useState("Khaled");
  const [website, setWebsite]     = useState("elitesydneyproperty.com.au");
  const [score,   setScore]       = useState("5.4");
  const [f1, setF1]               = useState("Page speed on mobile is scoring 4/10 — well above the 3-second threshold Google uses to rank sites");
  const [f2, setF2]               = useState("No testimonials or Google Reviews visible on the homepage — key trust signals are missing");
  const [f3, setF3]               = useState("reCAPTCHA on every enquiry form adds friction and typically reduces form completions by 20–30%");
  const [quoteLink, setQuoteLink] = useState("directiveos.com.au/marketing/web-quote?type=rebuild&pkg=business&client=Elite+Sydney+Property&contact=Khaled&addons=ai,seo,analytics,speed,forms,security,vaultre,rea,domain");
  const [showFields, setShowFields] = useState(true);

  const emails = buildEmails(agency, contact, website, score, f1, f2, f3, quoteLink);
  const email  = emails[active];

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`;

  const fieldStyle: React.CSSProperties = {
    width: "100%", background: "#0a0f1a", border: "1px solid #1e293b", borderRadius: 7,
    padding: "8px 12px", color: "#fff", fontSize: 12, fontFamily: "Inter, sans-serif",
    outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1a", color: "#fff", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @media print {
          @page { size: A4; margin: 12mm; }
          body { margin:0!important; background:#fff!important; color:#000!important; }
          .np { display:none!important; }
          .print-email { background:#fff!important; color:#000!important; border:none!important; padding:0!important; }
          .print-email pre { color:#000!important; font-size:13px!important; }
          .print-label { color:#000!important; font-weight:800; font-size:16px; margin-bottom:8px; display:block; }
          .print-subject { color:#333!important; font-size:13px; margin-bottom:16px; display:block; }
        }
        input:focus, textarea:focus { border-color: rgba(0,209,178,0.5)!important; outline:none; }
      `}</style>

      {/* Top bar */}
      <div className="np" style={{ padding: "12px 24px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", gap: 12, background: "#0d1424", flexWrap: "wrap" }}>
        <a href="/marketing" style={{ color: "#64748b", fontSize: 13, textDecoration: "none" }}>← Marketing</a>
        <span style={{ color: "#1e293b" }}>|</span>
        <span style={{ fontWeight: 700, fontSize: 13 }}>Cold Email — Website Audit Sequence</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button onClick={() => setShowFields(!showFields)} style={{ padding: "6px 14px", borderRadius: 7, border: `1px solid ${showFields ? TEAL : "#1e293b"}`, background: showFields ? "rgba(0,209,178,0.08)" : "transparent", color: showFields ? TEAL : "#94a3b8", fontWeight: 600, cursor: "pointer", fontSize: 12 }}>
            {showFields ? "✓ Hide Fields" : "✏ Edit Client"}
          </button>
          <a href={gmailUrl} target="_blank" rel="noreferrer" style={{ padding: "6px 16px", borderRadius: 7, background: "#4285F4", color: "#fff", fontWeight: 700, fontSize: 12, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
            ✉ Open in Gmail ↗
          </a>
          <button onClick={() => window.print()} style={{ padding: "6px 16px", borderRadius: 7, border: "none", background: TEAL, color: "#000", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>
            🖨 Print / PDF
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 940, margin: "0 auto", padding: "28px 20px 60px" }}>

        {/* Editable fields */}
        {showFields && (
          <div className="np" style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 14, padding: "20px 24px", marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>Client Details — fills all 3 emails automatically</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 12 }}>
              {[
                { label: "Agency Name",  val: agency,  set: setAgency },
                { label: "Contact Name", val: contact, set: setContact },
                { label: "Website",      val: website, set: setWebsite },
                { label: "Health Check Score (/10)", val: score, set: setScore },
              ].map(f => (
                <div key={f.label}>
                  <div style={{ fontSize: 10, color: "#64748b", fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>{f.label}</div>
                  <input value={f.val} onChange={e => f.set(e.target.value)} style={fieldStyle} />
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {[
                { label: "Finding 1 (for Email 2)", val: f1, set: setF1 },
                { label: "Finding 2 (for Email 2)", val: f2, set: setF2 },
                { label: "Finding 3 (for Email 2)", val: f3, set: setF3 },
                { label: "Quote Link (for Emails 2 & 3)", val: quoteLink, set: setQuoteLink },
              ].map(f => (
                <div key={f.label}>
                  <div style={{ fontSize: 10, color: "#64748b", fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>{f.label}</div>
                  <textarea value={f.val} onChange={e => f.set(e.target.value)} rows={2} style={{ ...fieldStyle, resize: "vertical", lineHeight: 1.5 }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Email tabs */}
        <div className="np" style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {emails.map((e, i) => (
            <button key={i} onClick={() => setActive(i)} style={{ padding: "8px 18px", borderRadius: 8, border: `1px solid ${active === i ? TEAL : "#1e293b"}`, background: active === i ? "rgba(0,209,178,0.1)" : "#111827", color: active === i ? TEAL : "#94a3b8", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>
              Email {e.id}
            </button>
          ))}
        </div>

        {/* Email card */}
        {emails.map((e, i) => (
          <div key={i} style={{ display: i === active ? "block" : "none" }}>
            {/* Print header */}
            <div className="print-label" style={{ display: "none" }}>{e.label}</div>

            <div className="print-email" style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 16, overflow: "hidden" }}>
              {/* Subject row */}
              <div style={{ padding: "14px 24px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div style={{ flex: 1 }}>
                  <span style={{ color: "#64748b", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginRight: 10 }}>Subject:</span>
                  <span className="print-subject" style={{ fontWeight: 600, fontSize: 13 }}>{e.subject}</span>
                </div>
                <div className="np" style={{ display: "flex", gap: 8 }}>
                  <CopyButton text={e.subject} />
                </div>
              </div>

              {/* From + label */}
              <div style={{ padding: "10px 24px", borderBottom: "1px solid #0f172a", background: "rgba(0,0,0,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#475569" }}>From: <span style={{ color: "#64748b" }}>{FROM}</span></span>
                <span style={{ fontSize: 10, color: TEAL, fontWeight: 700, background: "rgba(0,209,178,0.08)", border: "1px solid rgba(0,209,178,0.2)", borderRadius: 20, padding: "2px 8px" }}>{e.label}</span>
              </div>

              {/* Body */}
              <div style={{ padding: "24px" }}>
                <div className="np" style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14, gap: 8 }}>
                  <CopyButton text={`Subject: ${e.subject}\n\n${e.body}`} />
                  <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=&su=${encodeURIComponent(e.subject)}&body=${encodeURIComponent(e.body)}`} target="_blank" rel="noreferrer"
                    style={{ padding: "6px 14px", borderRadius: 6, background: "#4285F4", color: "#fff", fontWeight: 700, fontSize: 12, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5 }}>
                    ✉ Open in Gmail ↗
                  </a>
                </div>
                <pre style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#cbd5e1", lineHeight: 1.85, whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0 }}>{e.body}</pre>
              </div>

              {/* Tips */}
              <div className="np" style={{ padding: "14px 24px", borderTop: "1px solid #1e293b", background: "rgba(0,209,178,0.02)" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Tips for this email</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {e.tips.map(tip => (
                    <div key={tip} style={{ fontSize: 11, color: "#64748b", background: "#0a0f1a", border: "1px solid #1e293b", borderRadius: 6, padding: "3px 10px" }}>{tip}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Schedule */}
        <div className="np" style={{ marginTop: 20, padding: "18px 24px", background: "#111827", border: "1px solid #1e293b", borderRadius: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 13 }}>Recommended Schedule</div>
          <div style={{ color: "#64748b", fontSize: 12, lineHeight: 1.8 }}>
            <strong style={{ color: "#94a3b8" }}>Day 1</strong> → Email 1 (the observation — no attachment) &nbsp;·&nbsp;
            <strong style={{ color: "#94a3b8" }}>Day 4</strong> → Email 2 (attach the Health Check PDF + quote link) &nbsp;·&nbsp;
            <strong style={{ color: "#94a3b8" }}>Day 9</strong> → Email 3 (soft close)<br />
            Best send times: <strong style={{ color: "#94a3b8" }}>Tue–Thu, 9–11am or 1–3pm</strong> &nbsp;·&nbsp; Send from jayson@directiveos.com.au or adwordpress2012@gmail.com
          </div>
        </div>

        {/* Workflow reminder */}
        <div className="np" style={{ marginTop: 12, padding: "16px 24px", background: "rgba(0,209,178,0.04)", border: "1px solid rgba(0,209,178,0.15)", borderRadius: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 12, color: TEAL, marginBottom: 6 }}>Workflow: Health Check → Email → Quote</div>
          <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.8 }}>
            1. Run the <a href="/marketing/health-check" style={{ color: TEAL }}>Health Check tool</a> for the agency &nbsp;·&nbsp;
            2. Fill in the findings above &nbsp;·&nbsp;
            3. Copy Email 1 → send (no attachment) &nbsp;·&nbsp;
            4. Print the Health Check as PDF → attach with Email 2 &nbsp;·&nbsp;
            5. The quote link auto-fills from the health check
          </div>
        </div>
      </div>
    </div>
  );
}
