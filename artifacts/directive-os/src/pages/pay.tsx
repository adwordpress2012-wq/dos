import { useState, useEffect } from "react";
import { useLocation } from "wouter";

const AGENCY_NAMES: Record<string, string> = {
  "c21-rana": "Century 21 The Rana Group",
  "nidus-re": "Nidus Real Estate",
};

const FEATURES = [
  "24/7 AI receptionist — never misses a call",
  "Dedicated Australian phone number",
  "Instant lead capture & email forwarding",
  "Inspection bookings & appraisal scheduling",
  "Full call transcripts & lead qualification",
  "Branded landing page included",
  "Client dashboard with live activity feed",
  "100 AI minutes/month included",
];

export default function PayPage() {
  const [location] = useLocation();
  const params = new URLSearchParams(window.location.search);

  const slug = params.get("agency") ?? location.split("/pay/")[1]?.split("?")[0] ?? "";
  const prefillName = params.get("name") ?? "";
  const prefillEmail = params.get("email") ?? "";

  const agencyName = AGENCY_NAMES[slug] ?? (slug ? slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "Your Agency");

  const [name, setName] = useState(prefillName);
  const [email, setEmail] = useState(prefillEmail);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = `Activate Sarah — ${agencyName} | Directive OS`;
  }, [agencyName]);

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email) { setError("Please enter your name and email to continue."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/billing/checkout/prospect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agencySlug: slug,
          agencyName,
          contactName: name,
          email,
          phone,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "Something went wrong. Please try again or contact jayson@directiveos.com.au");
        setLoading(false);
      }
    } catch {
      setError("Connection error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0e1a", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      {/* Top bar */}
      <div style={{ background: "#060912", borderBottom: "1px solid #1e293b", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #00d1b2, #0891b2)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>D</span>
          </div>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Directive OS</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: 8, height: 8, background: "#22c55e", borderRadius: "50%" }} />
          <span style={{ color: "#64748b", fontSize: 12 }}>Secure checkout via Stripe</span>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px", display: "grid", gridTemplateColumns: "1fr 420px", gap: 40, alignItems: "start" }}>

        {/* Left — What you're getting */}
        <div>
          <div style={{ marginBottom: 8 }}>
            <span style={{ background: "rgba(0,209,178,0.15)", color: "#00d1b2", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", padding: "4px 12px", borderRadius: 20, textTransform: "uppercase" }}>
              AI Receptionist Activation
            </span>
          </div>

          <h1 style={{ color: "#fff", fontSize: 36, fontWeight: 800, lineHeight: 1.2, margin: "16px 0 8px" }}>
            Activate Sarah for<br />
            <span style={{ color: "#00d1b2" }}>{agencyName}</span>
          </h1>

          <p style={{ color: "#94a3b8", fontSize: 16, lineHeight: 1.6, margin: "0 0 40px" }}>
            Sarah answers every inbound call 24/7 — qualifying buyers, booking inspections, and capturing leads while your team sleeps.
          </p>

          {/* Pricing breakdown */}
          <div style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 16, padding: 28, marginBottom: 32 }}>
            <h3 style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 20px" }}>What you pay today</h3>

            {[
              { label: "Setup & Onboarding", desc: "Custom Sarah config, dedicated phone number, branded page", amount: "A$1,800" },
              { label: "Month 1 Licence", desc: "Includes 100 AI minutes, 1 seat, full dashboard access", amount: "A$299" },
            ].map(({ label, desc, amount }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "14px 0", borderBottom: "1px solid #1e293b" }}>
                <div>
                  <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 14 }}>{label}</div>
                  <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>{desc}</div>
                </div>
                <div style={{ color: "#00d1b2", fontWeight: 700, fontSize: 16, whiteSpace: "nowrap", marginLeft: 16 }}>{amount}</div>
              </div>
            ))}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16 }}>
              <div style={{ color: "#94a3b8", fontSize: 14 }}>
                <strong style={{ color: "#fff" }}>Total today</strong>
                <div style={{ fontSize: 12, marginTop: 2 }}>Then A$299/month from Month 2</div>
              </div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 24 }}>A$2,099</div>
            </div>
          </div>

          {/* Feature list */}
          <h3 style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 16px" }}>Everything included</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 24px" }}>
            {FEATURES.map(f => (
              <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginTop: 2, flexShrink: 0 }}>
                  <circle cx="8" cy="8" r="8" fill="#00d1b2" fillOpacity="0.15" />
                  <path d="M5 8l2 2 4-4" stroke="#00d1b2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.4 }}>{f}</span>
              </div>
            ))}
          </div>

          {/* Trust signals */}
          <div style={{ display: "flex", gap: 24, marginTop: 40, flexWrap: "wrap" }}>
            {[
              { icon: "🔒", text: "Payments secured by Stripe" },
              { icon: "🇦🇺", text: "ABN 87 754 544 171" },
              { icon: "📞", text: "Live within 2 business days" },
              { icon: "✉️", text: "jayson@directiveos.com.au" },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14 }}>{icon}</span>
                <span style={{ color: "#64748b", fontSize: 12 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Payment form */}
        <div style={{ position: "sticky", top: 24 }}>
          <div style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 20, overflow: "hidden" }}>

            {/* Form header */}
            <div style={{ background: "linear-gradient(135deg, #00d1b2 0%, #0891b2 100%)", padding: "24px 28px" }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>Activate Sarah</div>
              <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, marginTop: 4 }}>Enter your details to go to secure checkout</div>
            </div>

            <form onSubmit={handlePay} style={{ padding: 28 }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", color: "#94a3b8", fontSize: 12, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Your Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="John Smith"
                  required
                  style={{ width: "100%", background: "#0f172a", border: "1px solid #334155", borderRadius: 10, padding: "12px 14px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", color: "#94a3b8", fontSize: 12, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="john@agency.com.au"
                  required
                  style={{ width: "100%", background: "#0f172a", border: "1px solid #334155", borderRadius: 10, padding: "12px 14px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", color: "#94a3b8", fontSize: 12, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Phone Number <span style={{ color: "#475569", fontWeight: 400 }}>(optional)</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="04XX XXX XXX"
                  style={{ width: "100%", background: "#0f172a", border: "1px solid #334155", borderRadius: 10, padding: "12px 14px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
              </div>

              {error && (
                <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px", color: "#fca5a5", fontSize: 13, marginBottom: 16 }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "15px",
                  background: loading ? "#334155" : "linear-gradient(135deg, #00d1b2, #0891b2)",
                  color: loading ? "#64748b" : "#0a0e1a",
                  fontWeight: 800,
                  fontSize: 15,
                  border: "none",
                  borderRadius: 12,
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "opacity 0.2s",
                }}
              >
                {loading ? "Taking you to checkout…" : "Activate Sarah — Pay A$2,099 →"}
              </button>

              <div style={{ textAlign: "center", marginTop: 14 }}>
                <span style={{ color: "#475569", fontSize: 11 }}>
                  🔒 Powered by Stripe · Card, Apple Pay, Google Pay, Klarna
                </span>
              </div>

              {/* Summary */}
              <div style={{ marginTop: 20, padding: "14px", background: "#0f172a", borderRadius: 10, borderLeft: "3px solid #00d1b2" }}>
                <div style={{ color: "#64748b", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Summary</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ color: "#94a3b8", fontSize: 12 }}>Setup fee</span>
                  <span style={{ color: "#e2e8f0", fontSize: 12, fontWeight: 600 }}>A$1,800</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ color: "#94a3b8", fontSize: 12 }}>Month 1 licence</span>
                  <span style={{ color: "#e2e8f0", fontSize: 12, fontWeight: 600 }}>A$299</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid #1e293b", marginTop: 4 }}>
                  <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>Total today</span>
                  <span style={{ color: "#00d1b2", fontSize: 13, fontWeight: 800 }}>A$2,099</span>
                </div>
                <div style={{ color: "#475569", fontSize: 11, marginTop: 6 }}>Then A$299/month from Month 2. Cancel anytime with 30 days notice.</div>
              </div>
            </form>
          </div>

          {/* ABN/legal */}
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <span style={{ color: "#334155", fontSize: 11 }}>
              Directive OS Pty Ltd · ABN 87 754 544 171 · directiveos.com.au
            </span>
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .pay-grid { grid-template-columns: 1fr !important; }
        }
        input:focus { border-color: #00d1b2 !important; }
      `}</style>
    </div>
  );
}
