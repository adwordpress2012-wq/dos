const today = new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });

export default function ReferralSchedule() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f1f5f9; font-family: 'Inter', sans-serif; }
        .page { max-width: 820px; margin: 0 auto; background: #fff; }
        .no-print { display: flex; }
        @media print {
          body { background: #fff; }
          .no-print { display: none !important; }
          .page { max-width: 100%; box-shadow: none; }
          .page-break { break-before: page; }
        }
      `}</style>

      {/* Print bar */}
      <div className="no-print" style={{ background: "#0f172a", padding: "14px 32px", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 50, gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <a href="/marketing" style={{ color: "#64748b", fontSize: 13, textDecoration: "none" }}>← Back to Hub</a>
          <span style={{ color: "#1e293b" }}>|</span>
          <span style={{ color: "#94a3b8", fontSize: 13 }}>Referral Fee Schedule — Print / Save as PDF</span>
        </div>
        <button
          onClick={() => window.print()}
          style={{ background: "#00d1b2", color: "#000", fontWeight: 800, border: "none", borderRadius: 8, padding: "10px 22px", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
          🖨️ Print / Save PDF
        </button>
      </div>

      <div className="page" style={{ padding: "60px 64px", minHeight: "297mm", boxShadow: "0 4px 40px rgba(0,0,0,0.12)", margin: "32px auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 48, borderBottom: "2px solid #0f172a", paddingBottom: 28 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "#00d1b2", marginBottom: 6 }}>DIRECTIVE OS</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", lineHeight: 1.1 }}>Referral Fee Schedule</div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 8 }}>Spotter / Partner Program — Effective {today}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.8 }}>
              <div style={{ fontWeight: 700, color: "#0f172a" }}>Directive OS Pty Ltd</div>
              <div>ABN: 87 754 544 171</div>
              <div>📞 02 5850 4038</div>
              <div>🌐 directiveos.com.au</div>
            </div>
          </div>
        </div>

        {/* Intro */}
        <div style={{ background: "#f0fdf9", border: "1px solid #99f6e4", borderRadius: 10, padding: "20px 24px", marginBottom: 40 }}>
          <div style={{ fontSize: 13, color: "#0f766e", fontWeight: 700, marginBottom: 8, letterSpacing: 0.5 }}>ABOUT THIS PROGRAM</div>
          <p style={{ fontSize: 14, color: "#134e4a", lineHeight: 1.75 }}>
            Directive OS pays a one-time spotter fee to any person who refers a real estate agency that signs up and goes live with our AI Receptionist platform. The fee is calculated as <strong>10% of the client's setup fee</strong>, based on the package they purchase. No ongoing obligations, no registration required — just refer, they go live, you get paid.
          </p>
        </div>

        {/* Fee Table */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#64748b", marginBottom: 14 }}>SPOTTER FEE TABLE — 10% OF CLIENT SETUP FEE</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#0f172a" }}>
                <th style={{ padding: "14px 18px", textAlign: "left", color: "#fff", fontWeight: 700, fontSize: 12 }}>Package</th>
                <th style={{ padding: "14px 18px", textAlign: "center", color: "#fff", fontWeight: 700, fontSize: 12 }}>Small Agency<br /><span style={{ fontWeight: 400, fontSize: 10, color: "#94a3b8" }}>1–5 agents</span></th>
                <th style={{ padding: "14px 18px", textAlign: "center", color: "#fff", fontWeight: 700, fontSize: 12 }}>Medium Agency<br /><span style={{ fontWeight: 400, fontSize: 10, color: "#94a3b8" }}>6–20 agents</span></th>
                <th style={{ padding: "14px 18px", textAlign: "center", color: "#fff", fontWeight: 700, fontSize: 12 }}>Large / Franchise<br /><span style={{ fontWeight: 400, fontSize: 10, color: "#94a3b8" }}>20+ agents</span></th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  label: "Sarah AI Receptionist",
                  sub: "Voice AI + chat widget + dashboard",
                  setups: ["$1,800", "$2,500", "$4,500"],
                  fees: ["$180", "$250", "$450"],
                },
                {
                  label: "Branded Mobile App",
                  sub: "Buyer-facing iOS & Android app",
                  setups: ["$4,500", "$6,500", "$12,500"],
                  fees: ["$450", "$650", "$1,250"],
                },
                {
                  label: "Sarah + Mobile App Bundle",
                  sub: "Full package — both products combined",
                  setups: ["$6,300", "$9,000", "$17,000"],
                  fees: ["$630", "$900", "$1,700"],
                  highlight: true,
                },
              ].map(({ label, sub, setups, fees, highlight }, i) => (
                <tr key={label} style={{ background: highlight ? "#f0fdf9" : i % 2 === 0 ? "#fff" : "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "16px 18px" }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>{label}</div>
                    <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>{sub}</div>
                  </td>
                  {fees.map((fee, j) => (
                    <td key={j} style={{ padding: "16px 18px", textAlign: "center" }}>
                      <div style={{ fontWeight: 900, fontSize: 20, color: "#00b89f" }}>{fee}</div>
                      <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 3 }}>client pays {setups[j]}</div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 10, paddingLeft: 4 }}>
            All amounts are in Australian Dollars (AUD) inclusive of GST. Monthly subscription fees are not included in the spotter fee calculation.
          </div>
        </div>

        {/* How Payment Works */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#64748b", marginBottom: 14 }}>HOW PAYMENT WORKS</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            {[
              { num: "01", title: "You make the intro", body: "Connect us with a real estate principal or director — by email, phone, or group message. That's all you need to do." },
              { num: "02", title: "They sign & go live", body: "Once the agency pays their setup invoice and Micah is live on their phone line, the referral is recorded for payout." },
              { num: "03", title: "You get paid", body: "Bank transfer within 7 business days of the client going live. No forms, no chasing — we initiate it." },
            ].map(s => (
              <div key={s.num} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "18px 20px" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#00d1b2", marginBottom: 8 }}>{s.num}</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a", marginBottom: 6 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.6 }}>{s.body}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Terms */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#64748b", marginBottom: 14 }}>TERMS & CONDITIONS</div>
          <div style={{ display: "grid", gap: 8 }}>
            {[
              "The referred client must be a new Directive OS client — not already in active negotiation with us at the time of referral.",
              "The spotter fee is based on the package the client actually signs, which may differ from what was initially discussed.",
              "Only one referral fee is payable per client, regardless of subsequent add-ons purchased after go-live.",
              "Directive OS reserves the right to verify the referral source before processing payment.",
              "Payment is by direct bank transfer (EFT) to the referrer's nominated Australian bank account.",
              "This fee schedule may be updated at any time. The rate in effect at the time of client sign-up applies.",
              "The referral program is available to individuals only — not applicable to agencies acting as formal resellers or affiliates.",
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 14px", background: "#fafafa", border: "1px solid #f1f5f9", borderRadius: 8 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#0f172a", color: "#fff", fontWeight: 800, fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                <span style={{ fontSize: 12, color: "#475569", lineHeight: 1.6 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: "2px solid #0f172a", paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#00d1b2", marginBottom: 6 }}>DIRECTIVE OS</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>AI Receptionist for Real Estate</div>
            <div style={{ fontSize: 12, color: "#64748b" }}>📞 02 5850 4038 &nbsp;·&nbsp; 🌐 directiveos.com.au</div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}>ABN: 87 754 544 171 &nbsp;·&nbsp; Document issued {today}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>Authorised by</div>
            <div style={{ width: 180, height: 1, background: "#0f172a", marginBottom: 6, marginLeft: "auto" }} />
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Jayson</div>
            <div style={{ fontSize: 11, color: "#64748b" }}>Founder, Directive OS</div>
          </div>
        </div>

      </div>
    </>
  );
}
