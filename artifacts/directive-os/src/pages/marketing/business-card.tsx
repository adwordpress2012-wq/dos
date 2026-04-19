import { useState } from "react";
import { Link } from "wouter";

const TEAL = "#00d1b2";
const NAVY = "#0a0f1a";
const DARK = "#111827";

function CardFront() {
  return (
    <div style={{
      width: 350, height: 200, background: NAVY, borderRadius: 12,
      border: "1px solid #1e293b", padding: "24px 28px", display: "flex",
      flexDirection: "column", justifyContent: "space-between", boxSizing: "border-box",
      fontFamily: "Inter, sans-serif", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: -40, right: -40, width: 120, height: 120, borderRadius: "50%", background: "rgba(0,209,178,0.06)", border: "1px solid rgba(0,209,178,0.12)" }} />
      <div style={{ position: "absolute", bottom: -30, left: -30, width: 90, height: 90, borderRadius: "50%", background: "rgba(0,209,178,0.04)" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img src="/logo.png" alt="Logo" style={{ width: 38, height: 38, objectFit: "contain", filter: "drop-shadow(0 0 6px rgba(0,209,178,0.5))" }} />
        <div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, letterSpacing: "0.04em" }}>Directive OS</div>
          <div style={{ color: TEAL, fontSize: 8, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase" }}>24/7 Business Assistant</div>
        </div>
      </div>
      <div>
        <div style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 2 }}>Jayson</div>
        <div style={{ color: TEAL, fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Founder & CEO</div>
        <div style={{ color: "#94a3b8", fontSize: 10, lineHeight: 1.8 }}>
          <div>📞 02 5850 4038</div>
          <div>✉ jayson@directiveos.com.au</div>
          <div>🌐 directiveos.com.au</div>
        </div>
      </div>
    </div>
  );
}

function CardBack() {
  return (
    <div style={{
      width: 350, height: 200, background: `linear-gradient(135deg, ${TEAL} 0%, #0097a7 100%)`,
      borderRadius: 12, padding: "24px 28px", display: "flex", flexDirection: "column",
      justifyContent: "space-between", boxSizing: "border-box", fontFamily: "Inter, sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
      <div style={{ position: "absolute", bottom: -40, left: 20, width: 130, height: 130, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
      <div style={{ color: "#003d38", fontWeight: 800, fontSize: 14, letterSpacing: "0.06em", textTransform: "uppercase" }}>Never Miss a Lead Again</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {["AI answers every call 24/7", "Qualifies leads instantly", "Emails you the full transcript", "Saves time & cuts costs"].map(t => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 8, color: "#003d38", fontSize: 11, fontWeight: 600 }}>
            <div style={{ width: 5, height: 5, borderRadius: 1, background: "#003d38", flexShrink: 0 }} />
            {t}
          </div>
        ))}
      </div>
      <div style={{ color: "rgba(0,61,56,0.7)", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>directiveos.com.au</div>
    </div>
  );
}

export default function BusinessCard() {
  const [side, setSide] = useState<"front" | "back">("front");

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1a", color: "#fff", fontFamily: "Inter, sans-serif", padding: "40px 24px" }}>
      <style>{`
        @media print {
          @page { size: 3.5in 2in; margin: 0; }
          body { margin: 0; background: #0a0f1a !important; }
          .no-print { display: none !important; }
          .print-area { display: flex !important; gap: 0.25in; }
        }
      `}</style>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div className="no-print" style={{ marginBottom: 32 }}>
          <Link href="/marketing" style={{ color: "#64748b", fontSize: 13, textDecoration: "none" }}>← Back to Marketing</Link>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: "12px 0 4px" }}>Business Card</h1>
          <p style={{ color: "#64748b", margin: "0 0 24px" }}>Print at 3.5" × 2" — use browser Print → Save as PDF for best quality.</p>
          <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
            <button onClick={() => setSide("front")} style={{ padding: "8px 20px", borderRadius: 8, border: `1px solid ${side === "front" ? TEAL : "#1e293b"}`, background: side === "front" ? "rgba(0,209,178,0.1)" : "transparent", color: side === "front" ? TEAL : "#94a3b8", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>Front</button>
            <button onClick={() => setSide("back")} style={{ padding: "8px 20px", borderRadius: 8, border: `1px solid ${side === "back" ? TEAL : "#1e293b"}`, background: side === "back" ? "rgba(0,209,178,0.1)" : "transparent", color: side === "back" ? TEAL : "#94a3b8", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>Back</button>
            <button onClick={() => window.print()} style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: TEAL, color: "#000", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>🖨 Print / Save PDF</button>
          </div>
        </div>

        {/* Preview */}
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap", alignItems: "flex-start" }}>
          <div className="no-print">
            <div style={{ fontSize: 11, color: "#475569", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>Front</div>
            <CardFront />
          </div>
          <div className="no-print">
            <div style={{ fontSize: 11, color: "#475569", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>Back</div>
            <CardBack />
          </div>
        </div>

        {/* Print area — both sides shown */}
        <div className="print-area" style={{ display: "none" }}>
          <CardFront />
          <CardBack />
        </div>
      </div>
    </div>
  );
}
