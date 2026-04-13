import { useEffect } from "react";

export default function Welcome() {
  const params = new URLSearchParams(window.location.search);
  const name = params.get("name") ?? "there";
  const agency = params.get("agency") ?? "";

  useEffect(() => {
    document.title = "Welcome to Directive OS — Payment Confirmed";
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0e1a", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", display: "flex", flexDirection: "column" }}>

      {/* Top bar */}
      <div style={{ background: "#060912", borderBottom: "1px solid #1e293b", padding: "16px 24px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #00d1b2, #0891b2)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>D</span>
        </div>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Directive OS</span>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
        <div style={{ maxWidth: 560, width: "100%", textAlign: "center" }}>

          {/* Success icon */}
          <div style={{ width: 80, height: 80, background: "rgba(0,209,178,0.12)", border: "2px solid rgba(0,209,178,0.4)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 32px" }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M10 18l6 6 10-10" stroke="#00d1b2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,209,178,0.1)", border: "1px solid rgba(0,209,178,0.3)", borderRadius: 20, padding: "4px 14px", marginBottom: 20 }}>
            <div style={{ width: 6, height: 6, background: "#00d1b2", borderRadius: "50%" }} />
            <span style={{ color: "#00d1b2", fontSize: 12, fontWeight: 600, letterSpacing: "0.05em" }}>PAYMENT CONFIRMED</span>
          </div>

          <h1 style={{ color: "#fff", fontSize: 36, fontWeight: 800, lineHeight: 1.2, margin: "0 0 16px" }}>
            You're in, {name.split(" ")[0]}!
          </h1>

          <p style={{ color: "#94a3b8", fontSize: 16, lineHeight: 1.7, margin: "0 0 40px" }}>
            {agency ? `Sarah is being set up for ${agency} right now.` : "Sarah is being set up for you right now."}{" "}
            Jayson will be in touch within 2 business days once your dedicated phone number is live.
          </p>

          {/* What happens next */}
          <div style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 16, padding: 28, textAlign: "left", marginBottom: 32 }}>
            <h3 style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 20px" }}>What happens next</h3>
            {[
              { step: "1", title: "Tax invoice sent to your email", desc: "Stripe will send your receipt immediately." },
              { step: "2", title: "Sarah is configured for your agency", desc: "We customise her persona, knowledge base, and response style." },
              { step: "3", title: "Dedicated Australian number provisioned", desc: "Your own phone line — within 2 business days." },
              { step: "4", title: "Your page goes live", desc: "DEMO watermark removed. Sarah is answering 24/7." },
            ].map(({ step, title, desc }) => (
              <div key={step} style={{ display: "flex", gap: 16, marginBottom: 18 }}>
                <div style={{ width: 28, height: 28, background: "#00d1b2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: "#0a0e1a", fontWeight: 800, fontSize: 12 }}>{step}</span>
                </div>
                <div>
                  <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 14 }}>{title}</div>
                  <div style={{ color: "#64748b", fontSize: 13, marginTop: 2 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: "20px 24px", marginBottom: 32 }}>
            <div style={{ color: "#94a3b8", fontSize: 13 }}>
              Questions? Reach Jayson directly:{" "}
              <a href="mailto:jayson@directiveos.com.au" style={{ color: "#00d1b2", textDecoration: "none", fontWeight: 600 }}>
                jayson@directiveos.com.au
              </a>
            </div>
          </div>

          <a href="https://directiveos.com.au" style={{ color: "#475569", fontSize: 13, textDecoration: "none" }}>
            ← Back to directiveos.com.au
          </a>
        </div>
      </div>
    </div>
  );
}
