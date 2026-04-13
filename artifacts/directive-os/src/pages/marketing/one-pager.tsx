const TEAL = "#00d1b2";

export default function OnePager() {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1a", fontFamily: "Inter, sans-serif", color: "#fff" }}>
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
        <button onClick={() => window.print()} style={{ marginLeft: "auto", padding: "8px 20px", borderRadius: 8, border: "none", background: TEAL, color: "#000", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>🖨 Print / Save as PDF</button>
      </div>

      {/* A4 Page */}
      <div className="page" style={{ maxWidth: 794, margin: "32px auto", background: "#0d1424", borderRadius: 12, overflow: "hidden", boxShadow: "0 0 60px rgba(0,0,0,0.6)" }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #0a0f1a 0%, #0d1f2d 100%)", padding: "40px 48px 32px", borderBottom: "2px solid #00d1b2" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <img src="/logo.png" alt="Directive OS" style={{ width: 56, height: 56, objectFit: "contain", filter: "drop-shadow(0 0 10px rgba(0,209,178,0.6))" }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: 22, letterSpacing: "0.04em" }}>Directive OS</div>
                <div style={{ color: TEAL, fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase" }}>24/7 Business Assistant</div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "#64748b", fontSize: 11 }}>directiveos.com.au</div>
              <div style={{ color: "#64748b", fontSize: 11 }}>02 5850 4038</div>
            </div>
          </div>
          <div style={{ marginTop: 28 }}>
            <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.2, marginBottom: 10 }}>
              Your Business, <span style={{ color: TEAL }}>Always On.</span>
            </div>
            <div style={{ color: "#94a3b8", fontSize: 14, maxWidth: 540, lineHeight: 1.6 }}>
              Directive OS gives your business a 24/7 AI assistant that answers every enquiry, qualifies prospects, and emails you a full summary — so you never miss a lead, day or night.
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: "1px solid #1e293b" }}>
          {[
            { stat: "24/7", label: "Always Available" },
            { stat: "$0", label: "Extra Staff Cost" },
            { stat: "< 2s", label: "Response Time" },
          ].map(({ stat, label }) => (
            <div key={label} style={{ padding: "20px", textAlign: "center", borderRight: "1px solid #1e293b" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: TEAL }}>{stat}</div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* How it works + Features */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, borderBottom: "1px solid #1e293b" }}>
          <div style={{ padding: "28px 32px", borderRight: "1px solid #1e293b" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>How It Works</div>
            {[
              { n: "1", t: "Customer calls or messages your business" },
              { n: "2", t: "Sarah AI answers instantly, 24/7" },
              { n: "3", t: "Lead is qualified and details captured" },
              { n: "4", t: "You receive a full email summary immediately" },
            ].map(({ n, t }) => (
              <div key={n} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: "rgba(0,209,178,0.15)", border: "1px solid rgba(0,209,178,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11, fontWeight: 700, color: TEAL }}>{n}</div>
                <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.5, paddingTop: 3 }}>{t}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: "28px 32px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>What You Get</div>
            {[
              "AI voice & chat receptionist — Sarah",
              "24/7 lead capture & qualification",
              "Instant email transcript on every call",
              "Full agency dashboard & reporting",
              "CRM integration ready",
              "No lock-in contracts",
            ].map(t => (
              <div key={t} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                <div style={{ color: TEAL, flexShrink: 0, marginTop: 1 }}>✓</div>
                <div style={{ fontSize: 12, color: "#cbd5e1" }}>{t}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div style={{ padding: "28px 32px 24px", borderBottom: "1px solid #1e293b" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>Simple, Transparent Pricing</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {[
              { label: "One-Time Setup", price: "$1,800", note: "Full onboarding & configuration" },
              { label: "Monthly Plan", price: "$299/mo", note: "AI + hosting + support" },
              { label: "Extra Seats", price: "$89/mo", note: "Per additional staff member" },
            ].map(({ label, price, note }) => (
              <div key={label} style={{ background: "#0a0f1a", border: "1px solid #1e293b", borderRadius: 8, padding: "14px 16px" }}>
                <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{price}</div>
                <div style={{ fontSize: 10, color: "#475569" }}>{note}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div style={{ padding: "24px 32px", background: "rgba(0,209,178,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>Ready to stop missing leads?</div>
            <div style={{ color: "#64748b", fontSize: 12 }}>Book a free 15-min strategy call — no obligation.</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: TEAL, fontWeight: 700, fontSize: 13 }}>directiveos.com.au</div>
            <div style={{ color: "#64748b", fontSize: 12 }}>jayson@directiveos.com.au · 02 5850 4038</div>
          </div>
        </div>
      </div>
    </div>
  );
}
