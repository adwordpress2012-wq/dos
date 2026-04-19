const TEAL = "#00d1b2";
const GOLD = "#C9A84C";
const NAVY = "#0a0f1a";

export default function LeaveBehind() {
  return (
    <div style={{ minHeight: "100vh", background: NAVY, fontFamily: "Inter, sans-serif", color: "#fff" }}>
      <style>{`
        @media print {
          @page { size: A4; margin: 0; }
          body { margin: 0 !important; }
          .no-print { display: none !important; }
          .page { box-shadow: none !important; border-radius: 0 !important; max-width: 100% !important; }
        }
      `}</style>

      {/* Controls */}
      <div className="no-print" style={{ padding: "24px", display: "flex", alignItems: "center", gap: 16, borderBottom: "1px solid #1e293b" }}>
        <a href="/marketing" style={{ color: "#64748b", fontSize: 13, textDecoration: "none" }}>← Back to Marketing</a>
        <button onClick={() => window.print()} style={{ marginLeft: "auto", padding: "8px 20px", borderRadius: 8, border: "none", background: TEAL, color: "#000", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
          Print / Save as PDF
        </button>
      </div>

      {/* A4 Page */}
      <div className="page" style={{ maxWidth: 794, margin: "32px auto", background: "#0d1424", borderRadius: 12, overflow: "hidden", boxShadow: "0 0 60px rgba(0,0,0,0.6)" }}>

        {/* Header */}
        <div style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #0d1f2d 100%)`, padding: "36px 48px 28px", borderBottom: `3px solid ${TEAL}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <img src="/logo.png" alt="Directive OS" style={{ width: 48, height: 48, objectFit: "contain", filter: "drop-shadow(0 0 10px rgba(0,209,178,0.6))" }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: "0.04em" }}>Directive OS</div>
                <div style={{ color: TEAL, fontSize: 9, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase" }}>AI Receptionist for Real Estate</div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "#64748b", fontSize: 11 }}>directiveos.com.au</div>
              <div style={{ color: "#64748b", fontSize: 11 }}>jayson@directiveos.com.au</div>
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.2, marginBottom: 8 }}>
            Why every dollar you invest<br />
            <span style={{ color: TEAL }}>pays for itself in the first month.</span>
          </div>
          <div style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.6 }}>
            A practical breakdown for principals who want to understand the value before committing.
          </div>
        </div>

        {/* The core pitch */}
        <div style={{ padding: "28px 48px", borderBottom: "1px solid #1e293b", background: "rgba(201,168,76,0.04)" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12 }}>The One-Sentence Case</div>
          <div style={{ fontSize: 17, fontWeight: 600, color: "#fff", lineHeight: 1.6, fontStyle: "italic" }}>
            "A part-time receptionist costs $40,000–$60,000 a year. Sarah costs less than $3,600 — and she works every Sunday night, every public holiday, and never calls in sick."
          </div>
        </div>

        {/* What it replaces table */}
        <div style={{ padding: "28px 48px", borderBottom: "1px solid #1e293b" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 16 }}>What Directive OS Replaces</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", fontSize: 10, color: "#64748b", fontWeight: 600, paddingBottom: 8, borderBottom: "1px solid #1e293b", letterSpacing: "0.1em" }}>WHAT YOU'D PAY FOR TODAY</th>
                <th style={{ textAlign: "right", fontSize: 10, color: "#64748b", fontWeight: 600, paddingBottom: 8, borderBottom: "1px solid #1e293b", letterSpacing: "0.1em" }}>ANNUAL COST</th>
                <th style={{ textAlign: "right", fontSize: 10, color: "#64748b", fontWeight: 600, paddingBottom: 8, borderBottom: "1px solid #1e293b", letterSpacing: "0.1em" }}>WITH DIRECTIVE OS</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Part-time receptionist (20 hrs/wk)", "$40,000–$60,000", "Included"],
                ["Agency website design + annual hosting", "$2,000–$5,000", "Included"],
                ["After-hours answering service", "$2,400–$7,200", "Included"],
                ["Manual CRM data entry admin (2 hrs/wk)", "$3,000–$5,000", "Included"],
                ["Missed commissions (1 missed lead/wk × 52)", "$520,000+ opportunity cost", "Captured"],
              ].map(([what, cost, status], i) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "10px 0 10px 0", fontSize: 12, color: "#cbd5e1" }}>{what}</td>
                  <td style={{ padding: "10px 0", textAlign: "right", fontSize: 12, color: GOLD, fontWeight: 600, fontFamily: "monospace" }}>{cost}</td>
                  <td style={{ padding: "10px 0 10px 8px", textAlign: "right", fontSize: 11, color: TEAL, fontWeight: 700 }}>{status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total cost vs Sarah */}
        <div style={{ padding: "24px 48px", borderBottom: "1px solid #1e293b", background: "rgba(0,209,178,0.04)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "18px 20px" }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#f87171", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Without Directive OS</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#f87171" }}>$47,400–$77,200</div>
              <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 4 }}>per year in combined costs</div>
              <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>Plus uncaptured leads every week</div>
            </div>
            <div style={{ background: "rgba(0,209,178,0.08)", border: "1px solid rgba(0,209,178,0.3)", borderRadius: 10, padding: "18px 20px" }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>With Directive OS (Small)</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: TEAL }}>$3,588/year</div>
              <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 4 }}>from Month 2 ($299/mo)</div>
              <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>+ $1,800 setup (one-time)</div>
            </div>
          </div>
        </div>

        {/* The missed lead math */}
        <div style={{ padding: "24px 48px", borderBottom: "1px solid #1e293b" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12 }}>The Missed Lead Calculation</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { n: "1", label: "Extra sale per year from captured leads", value: "$10,000–$15,000", sub: "Average NSW residential commission" },
              { n: "÷", label: "Sarah's full annual cost (setup + 12 months)", value: "$5,388", sub: "Small agency, Year 1" },
              { n: "=", label: "Return on investment", value: "185%–278%", sub: "From ONE extra sale" },
            ].map(({ n, label, value, sub }) => (
              <div key={n} style={{ background: "#0a0f1a", border: "1px solid #1e293b", borderRadius: 8, padding: "14px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: TEAL, marginBottom: 6 }}>{n}</div>
                <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 6, lineHeight: 1.4 }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{value}</div>
                <div style={{ fontSize: 9, color: "#475569", marginTop: 3 }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Add-ons */}
        <div style={{ padding: "24px 48px", borderBottom: "1px solid #1e293b" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12 }}>Optional Add-Ons</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { name: "Website Widget", price: "+$50/mo", desc: "Embed Sarah on your existing website. Chat widget works on any site — just paste one line of code." },
              { name: "CRM Auto-Sync", price: "+$99/mo", desc: "Listings automatically sync from VaultRE or Rex. No manual uploads. Sarah always has the latest data." },
            ].map(({ name, price, desc }) => (
              <div key={name} style={{ background: "#0a0f1a", border: "1px solid #1e293b", borderRadius: 8, padding: "14px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{name}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: TEAL, fontFamily: "monospace" }}>{price}</div>
                </div>
                <div style={{ fontSize: 10, color: "#64748b", lineHeight: 1.5 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Objection handlers */}
        <div style={{ padding: "24px 48px", borderBottom: "1px solid #1e293b" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12 }}>Common Questions</div>
          <div style={{ display: "grid", gap: 10 }}>
            {[
              {
                q: "What if Sarah gives a caller wrong information?",
                a: "Sarah is trained on your specific listings, your rules, and your agency's tone. You review and approve everything before she goes live. If something changes, you update her instructions in minutes.",
              },
              {
                q: "Can I cancel if it's not working?",
                a: "No lock-in contracts. Cancel anytime from your dashboard. We're confident you'll stay because the leads won't stop coming in.",
              },
              {
                q: "What about calls in languages other than English?",
                a: "Sarah speaks 9 languages including Mandarin, Arabic, Vietnamese, Filipino, Hindi, Korean, Russian, and Spanish. No extra charge.",
              },
            ].map(({ q, a }) => (
              <div key={q} style={{ background: "#0a0f1a", border: "1px solid #1e293b", borderRadius: 8, padding: "12px 16px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{q}</div>
                <div style={{ fontSize: 10, color: "#64748b", lineHeight: 1.6 }}>{a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Footer */}
        <div style={{ padding: "24px 48px", background: "rgba(0,209,178,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Ready to stop missing leads?</div>
            <div style={{ color: "#64748b", fontSize: 12, marginBottom: 6 }}>Your AI is live within 48 hours. No tech skills needed.</div>
            <div style={{ display: "inline-block", background: TEAL, color: "#000", fontSize: 11, fontWeight: 700, padding: "6px 16px", borderRadius: 6 }}>
              Book a free 15-min call → directiveos.com.au/book
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: TEAL, fontWeight: 700, fontSize: 13 }}>directiveos.com.au</div>
            <div style={{ color: "#64748b", fontSize: 11 }}>jayson@directiveos.com.au</div>
            <div style={{ color: "#64748b", fontSize: 11 }}>02 5850 4038</div>
          </div>
        </div>

      </div>
    </div>
  );
}
