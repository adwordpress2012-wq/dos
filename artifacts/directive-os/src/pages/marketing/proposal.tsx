import { useState } from "react";

const TEAL = "#00d1b2";
const NAVY = "#0a0f1a";

const today = new Date();
const EXPIRY = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
const DATE = today.toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });

const TIERS = [
  {
    id: "small",
    name: "Small Agency",
    size: "1–5 agents",
    setup: "$1,800",
    monthly: "$299",
    seat: "$89",
    mobileSetup: "$4,500",
    mobileMonthly: "$149",
    features: [
      "Sarah AI voice receptionist — 24/7",
      "Live chat widget for your website",
      "Lead qualification & capture",
      "Email transcript on every call",
      "Agency Command Bridge dashboard",
      "VaultRE CRM sync",
      "Full onboarding & configuration",
    ],
  },
  {
    id: "medium",
    name: "Medium Agency",
    size: "6–20 agents",
    setup: "$2,500",
    monthly: "$399",
    seat: "$99",
    mobileSetup: "$6,500",
    mobileMonthly: "$199",
    features: [
      "Everything in Small Agency",
      "Priority email & phone support",
      "Monthly performance report",
      "Custom AI greeting script",
      "Dedicated account manager",
      "Advanced CRM workflow automation",
      "White-glove onboarding",
    ],
  },
  {
    id: "large",
    name: "Large / Franchise",
    size: "20+ agents",
    setup: "$4,500",
    monthly: "$599",
    seat: "$119",
    mobileSetup: "Custom",
    mobileMonthly: "$299+",
    features: [
      "Everything in Medium Agency",
      "Multi-office configuration",
      "Custom AI persona & voice tuning",
      "Quarterly strategy review",
      "Priority support hotline",
      "Franchise-wide reporting dashboard",
      "Custom integration builds on request",
    ],
  },
];

export default function ProposalTemplate() {
  const [clientName, setClientName] = useState("Your Business Name");
  const [contactName, setContactName] = useState("Contact Name");
  const [selected, setSelected] = useState("small");
  const [editing, setEditing] = useState(false);
  const [includeMobile, setIncludeMobile] = useState(false);

  const tier = TIERS.find(t => t.id === selected)!;

  return (
    <div style={{ minHeight: "100vh", background: NAVY, fontFamily: "Inter, sans-serif", color: "#fff" }}>
      <style>{`
        @media print {
          @page { size: A4; margin: 0; }
          body { margin: 0 !important; background: #fff !important; }
          .no-print { display: none !important; }
          .page { box-shadow: none !important; border-radius: 0 !important; max-width: 100% !important; margin: 0 !important; }
          .page * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
        input { background: transparent; border: none; outline: none; color: inherit; font: inherit; width: 100%; }
        input:focus { border-bottom: 1px dashed ${TEAL}; }
      `}</style>

      {/* Controls */}
      <div className="no-print" style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, borderBottom: "1px solid #1e293b", flexWrap: "wrap" }}>
        <a href="/marketing" style={{ color: "#64748b", fontSize: 13, textDecoration: "none" }}>← Back to Marketing</a>
        <div style={{ display: "flex", gap: 10, marginLeft: "auto", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#64748b" }}>Agency size:</span>
          {TIERS.map(t => (
            <button key={t.id} onClick={() => setSelected(t.id)} style={{ padding: "6px 14px", borderRadius: 7, border: `1px solid ${selected === t.id ? TEAL : "#1e293b"}`, background: selected === t.id ? "rgba(0,209,178,0.1)" : "#111827", color: selected === t.id ? TEAL : "#94a3b8", fontWeight: 600, cursor: "pointer", fontSize: 12 }}>
              {t.name} <span style={{ opacity: 0.6 }}>({t.size})</span>
            </button>
          ))}
          <button onClick={() => setIncludeMobile(!includeMobile)} style={{ padding: "6px 14px", borderRadius: 7, border: `1px solid ${includeMobile ? "#f59e0b" : "#1e293b"}`, background: includeMobile ? "rgba(245,158,11,0.1)" : "#111827", color: includeMobile ? "#f59e0b" : "#94a3b8", fontWeight: 600, cursor: "pointer", fontSize: 12 }}>
            {includeMobile ? "✓ Mobile App" : "+ Mobile App"}
          </button>
          <button onClick={() => setEditing(!editing)} style={{ padding: "6px 14px", borderRadius: 7, border: `1px solid ${editing ? TEAL : "#1e293b"}`, background: editing ? "rgba(0,209,178,0.1)" : "#111827", color: editing ? TEAL : "#94a3b8", fontWeight: 600, cursor: "pointer", fontSize: 12 }}>
            {editing ? "✓ Done Editing" : "✏ Edit Client"}
          </button>
          <button onClick={() => window.print()} style={{ padding: "6px 16px", borderRadius: 7, border: "none", background: TEAL, color: "#000", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>🖨 Print / Save PDF</button>
        </div>
      </div>

      {/* A4 Proposal Page */}
      <div className="page" style={{ maxWidth: 794, margin: "28px auto 60px", background: "#0d1424", borderRadius: 12, overflow: "hidden", boxShadow: "0 0 60px rgba(0,0,0,0.7)" }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #0a0f1a 0%, #0d1f2d 100%)", padding: "40px 48px 36px", borderBottom: `3px solid ${TEAL}`, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -50, right: -50, width: 180, height: 180, borderRadius: "50%", background: "rgba(0,209,178,0.04)", border: "1px solid rgba(0,209,178,0.08)" }} />
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <img src="/logo.png" alt="Directive OS" style={{ width: 52, height: 52, objectFit: "contain", filter: "drop-shadow(0 0 10px rgba(0,209,178,0.6))" }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: "0.04em" }}>Directive OS</div>
                <div style={{ color: TEAL, fontSize: 9, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase" }}>24/7 AI Receptionist</div>
              </div>
            </div>
            <div style={{ textAlign: "right", fontSize: 11, color: "#64748b", lineHeight: 1.8 }}>
              <div>jayson@directiveos.com.au</div>
              <div>02 5850 4038</div>
              <div>directiveos.com.au</div>
            </div>
          </div>
          <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid #1e293b" }}>
            <div style={{ fontSize: 11, color: TEAL, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 6 }}>Proposal Prepared For</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>
              {editing ? <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Business Name" /> : clientName}
            </div>
            <div style={{ fontSize: 13, color: "#94a3b8" }}>
              Attn: {editing ? <input value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Contact Name" style={{ width: 200 }} /> : contactName}
            </div>
            <div style={{ display: "flex", gap: 24, marginTop: 10, fontSize: 11, color: "#475569" }}>
              <span>Date: {DATE}</span>
              <span>Valid until: {EXPIRY}</span>
              <span>Ref: DOS-{Math.floor(Math.random() * 9000) + 1000}</span>
            </div>
          </div>
        </div>

        {/* What is Directive OS */}
        <div style={{ padding: "28px 48px", borderBottom: "1px solid #1e293b" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>What Is Directive OS?</div>
          <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.75, margin: 0 }}>
            Directive OS is a 24/7 AI receptionist — powered by a conversational AI called Sarah — that answers every phone call and message your business receives, qualifies the enquiry, captures the lead's details, and emails you a full summary transcript immediately. No voicemail. No missed opportunities. No extra staff required.
          </p>
          <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.75, margin: "12px 0 0" }}>
            Whether it's 2pm on a Tuesday or 11pm on a Sunday, Sarah answers with the same professionalism — representing your brand, asking the right questions, and making sure every person who contacts you feels heard and attended to.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", borderBottom: "1px solid #1e293b" }}>
          {[
            { stat: "24/7", label: "Always Available" },
            { stat: "< 2s", label: "Response Time" },
            { stat: "$0", label: "Extra Staff Cost" },
            { stat: "100%", label: "Leads Captured" },
          ].map(({ stat, label }) => (
            <div key={label} style={{ padding: "18px", textAlign: "center", borderRight: "1px solid #1e293b" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: TEAL }}>{stat}</div>
              <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Recommended Plan */}
        <div style={{ padding: "28px 48px", borderBottom: "1px solid #1e293b" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.12em" }}>Your Plan — {tier.name}</div>
            <div style={{ padding: "3px 10px", borderRadius: 20, background: "rgba(0,209,178,0.12)", border: "1px solid rgba(0,209,178,0.25)", fontSize: 11, color: TEAL, fontWeight: 600 }}>{tier.size}</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
                {[{ label: "One-Time Setup", value: tier.setup, sub: "full onboarding" }, { label: "Monthly", value: tier.monthly + "/mo", sub: "1 seat included" }].map(({ label, value, sub }) => (
                  <div key={label} style={{ background: "#0a0f1a", border: "1px solid #1e293b", borderRadius: 10, padding: "14px 18px", flex: 1 }}>
                    <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>{value}</div>
                    <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>{sub}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(0,209,178,0.06)", border: "1px solid rgba(0,209,178,0.15)", borderRadius: 8, padding: "12px 14px", fontSize: 12, color: "#94a3b8" }}>
                Additional agent seats at <strong style={{ color: "#fff" }}>{tier.seat}/seat/month</strong>. Excess AI call time billed at <strong style={{ color: "#fff" }}>$25 per 10 minutes</strong>. No lock-in contracts. Cancel anytime.
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Included in your plan</div>
              {tier.features.map(f => (
                <div key={f} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                  <span style={{ color: TEAL, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: 12, color: "#cbd5e1" }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile App Add-on */}
          {includeMobile && (
            <div style={{ marginTop: 20, padding: "16px 18px", background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Premium Add-on — Branded Mobile App</div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>Your agency's own app on the App Store & Google Play — published under your name, not ours.</div>
                </div>
                <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", marginBottom: 2 }}>Setup</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{tier.mobileSetup}</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", marginBottom: 2 }}>Monthly</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{tier.mobileMonthly}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* How it works */}
        <div style={{ padding: "24px 48px", borderBottom: "1px solid #1e293b" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14 }}>How We Get You Started</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
            {[
              { n: "1", t: "Onboarding call", d: "We learn your business, tone, and FAQs" },
              { n: "2", t: "Sarah configured", d: "AI scripted and tested to your brand" },
              { n: "3", t: "Go live", d: "Number forwarding set up, dashboard ready" },
              { n: "4", t: "You receive leads", d: "Full email transcript after every call" },
            ].map(({ n, t, d }) => (
              <div key={n} style={{ textAlign: "center" }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(0,209,178,0.12)", border: "1px solid rgba(0,209,178,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", fontSize: 13, fontWeight: 800, color: TEAL }}>{n}</div>
                <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 3 }}>{t}</div>
                <div style={{ fontSize: 10, color: "#64748b", lineHeight: 1.5 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Terms & CTA */}
        <div style={{ padding: "22px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, background: "rgba(0,209,178,0.04)" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>Ready to move forward?</div>
            <div style={{ fontSize: 11, color: "#64748b" }}>Reply to this proposal or book a call — we'll get you live within the week.</div>
          </div>
          <div style={{ textAlign: "right", fontSize: 11, color: "#475569" }}>
            <div style={{ color: TEAL, fontWeight: 700, fontSize: 12 }}>directiveos.com.au</div>
            <div>jayson@directiveos.com.au · 02 5850 4038</div>
            <div style={{ marginTop: 4 }}>Proposal valid until {EXPIRY} · Australian owned &amp; operated</div>
          </div>
        </div>
      </div>
    </div>
  );
}
