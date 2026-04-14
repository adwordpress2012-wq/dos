import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import profilePhoto from "@assets/MYPHOTO-IM_1776166731530.png";

const TEAL = "#00d1b2";
const NAVY = "#0a0f1a";
const NAVY2 = "#0d1424";
const NAVY3 = "#111827";
const SLATE = "#94a3b8";

function Step({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 24 }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: TEAL, color: "#000", fontWeight: 900, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{n}</div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 13, color: SLATE, lineHeight: 1.5 }}>{desc}</div>
      </div>
    </div>
  );
}

function Service({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 18, padding: "14px", background: "rgba(0,209,178,0.06)", borderRadius: 10, border: "1px solid rgba(0,209,178,0.15)" }}>
      <div style={{ fontSize: 22, flexShrink: 0, lineHeight: 1 }}>{icon}</div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 3 }}>{title}</div>
        <div style={{ fontSize: 12, color: SLATE, lineHeight: 1.4 }}>{desc}</div>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: "center", padding: "16px 8px" }}>
      <div style={{ fontSize: 28, fontWeight: 900, color: TEAL, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 11, color: SLATE, lineHeight: 1.4 }}>{label}</div>
    </div>
  );
}

const PANEL_H = 756;
const PANEL_W = 378;

const panelBase: React.CSSProperties = {
  width: PANEL_W,
  height: PANEL_H,
  padding: "40px 32px",
  boxSizing: "border-box",
  position: "relative",
  overflow: "hidden",
  fontFamily: "Inter, sans-serif",
  flexShrink: 0,
};

export default function Brochure() {
  const [side, setSide] = useState<"outside" | "inside">("outside");

  return (
    <div style={{ minHeight: "100vh", background: "#060b14", fontFamily: "Inter, sans-serif", color: "#fff" }}>
      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 0; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body { margin: 0 !important; }
          .no-print { display: none !important; }
          .print-sheet {
            width: 297mm !important;
            height: 210mm !important;
            display: flex !important;
            flex-direction: row !important;
            overflow: hidden !important;
            transform: none !important;
            box-shadow: none !important;
          }
          .print-panel {
            width: 99mm !important;
            height: 210mm !important;
            flex-shrink: 0 !important;
            overflow: hidden !important;
          }
        }
      `}</style>

      {/* Toolbar */}
      <div className="no-print" style={{ padding: "14px 24px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", gap: 12, background: NAVY2, position: "sticky", top: 0, zIndex: 10 }}>
        <a href="/marketing" style={{ color: "#64748b", fontSize: 13, textDecoration: "none", marginRight: 8 }}>← Marketing</a>
        <span style={{ color: "#475569", fontSize: 13 }}>Trifold Brochure</span>
        <div style={{ display: "flex", gap: 0, border: "1px solid #1e293b", borderRadius: 8, overflow: "hidden", marginLeft: 8 }}>
          {(["outside", "inside"] as const).map(s => (
            <button key={s} onClick={() => setSide(s)} style={{ padding: "7px 18px", border: "none", background: side === s ? TEAL : "transparent", color: side === s ? "#000" : "#94a3b8", fontWeight: 700, cursor: "pointer", fontSize: 12, textTransform: "capitalize" }}>
              {s === "outside" ? "Outside (Side 1)" : "Inside (Side 2)"}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#475569" }}>Print each side separately → send to printer as double-sided A4 landscape</span>
          <button onClick={() => window.print()} style={{ padding: "7px 18px", borderRadius: 7, border: "none", background: TEAL, color: "#000", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>
            🖨 Print {side === "outside" ? "Side 1" : "Side 2"}
          </button>
        </div>
      </div>

      {/* Preview wrapper */}
      <div className="no-print" style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "40px 20px", minHeight: "calc(100vh - 57px)" }}>
        <div>
          <div style={{ textAlign: "center", marginBottom: 16, fontSize: 12, color: "#475569" }}>
            {side === "outside" ? "OUTSIDE — Side 1 (print first)" : "INSIDE — Side 2 (flip & print)"}
          </div>
          <Sheet side={side} preview />
        </div>
      </div>

      {/* Hidden print target */}
      <div style={{ position: "fixed", top: 0, left: 0, opacity: 0, pointerEvents: "none" }} aria-hidden>
        <div className="print-sheet">
          <Sheet side={side} preview={false} />
        </div>
      </div>
    </div>
  );
}

function Sheet({ side, preview }: { side: "outside" | "inside"; preview: boolean }) {
  const scale = preview ? 0.72 : 1;
  const sheetStyle: React.CSSProperties = preview
    ? { display: "flex", flexDirection: "row", transform: `scale(${scale})`, transformOrigin: "top left", width: PANEL_W * 3, height: PANEL_H, boxShadow: "0 8px 48px rgba(0,0,0,0.6)" }
    : { display: "flex", flexDirection: "row" };

  return (
    <div style={preview ? { width: PANEL_W * 3 * scale, height: PANEL_H * scale, overflow: "hidden" } : {}}>
      <div style={sheetStyle}>
        {side === "outside" ? <OutsidePanels /> : <InsidePanels />}
      </div>
    </div>
  );
}

function OutsidePanels() {
  return (
    <>
      {/* Panel 1 — Contact / Jayson (left when printed = inside flap, first seen when opening) */}
      <div className="print-panel" style={{ ...panelBase, background: NAVY2, borderRight: "1px solid #1a2540", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 20 }}>Your Directive OS Representative</div>

          {/* Photo placeholder */}
          <div style={{ width: 120, height: 140, borderRadius: 12, background: "linear-gradient(135deg, #1e293b, #0f172a)", border: `2px solid ${TEAL}`, overflow: "hidden", marginBottom: 20 }}>
            <img src={profilePhoto} alt="Jayson Ocampo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>

          <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 4, color: "#fff" }}>Jayson Ocampo</div>
          <div style={{ fontSize: 12, color: TEAL, fontWeight: 600, marginBottom: 2 }}>Principal — Directive OS</div>
          <div style={{ fontSize: 11, color: SLATE, marginBottom: 20 }}>Licensed Real Estate Agent</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { icon: "📞", val: "0434 666 080" },
              { icon: "✉️", val: "jayson@directiveos.com.au" },
              { icon: "🌐", val: "directiveos.com.au" },
            ].map(r => (
              <div key={r.val} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#cbd5e1" }}>
                <span style={{ fontSize: 14 }}>{r.icon}</span>
                <span>{r.val}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ padding: 8, background: "#fff", borderRadius: 8 }}>
            <QRCodeSVG value="https://directiveos.com.au" size={80} bgColor="#ffffff" fgColor="#0a0f1a" />
          </div>
          <div style={{ fontSize: 10, color: SLATE, textAlign: "center" }}>Scan to visit our website</div>
        </div>
      </div>

      {/* Panel 2 — Why Directive OS (middle = back of brochure) */}
      <div className="print-panel" style={{ ...panelBase, background: NAVY, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 16 }}>Why agencies choose us</div>
          <div style={{ fontWeight: 800, fontSize: 20, lineHeight: 1.3, marginBottom: 24, color: "#fff" }}>Built for Australian real estate. Nothing else.</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, marginBottom: 28 }}>
            <Stat value="24/7" label="Calls answered — even at 2am" />
            <Stat value="48hrs" label="Average setup time" />
            <Stat value="0" label="Lock-in contracts" />
            <Stat value="100%" label="Australian owned & supported" />
          </div>

          <div style={{ borderTop: "1px solid #1e293b", paddingTop: 20 }}>
            <div style={{ fontSize: 12, color: SLATE, lineHeight: 1.6 }}>
              Directive OS is the only AI receptionist platform purpose-built for Australian real estate agencies — not adapted from a generic call centre product.
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/logo.png" alt="Directive OS" style={{ width: 28, height: 28, filter: "drop-shadow(0 0 6px rgba(0,209,178,0.5))" }} />
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: TEAL }}>DIRECTIVE OS</div>
            <div style={{ fontSize: 9, color: SLATE }}>Proudly Australian · ABN 87 754 544 171</div>
          </div>
        </div>
      </div>

      {/* Panel 3 — Front Cover (right = front) */}
      <div className="print-panel" style={{ ...panelBase, background: NAVY, display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
        {/* Decorative teal glow blob */}
        <div style={{ position: "absolute", top: -80, right: -80, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,209,178,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,209,178,0.10) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 48 }}>
            <img src="/logo.png" alt="Directive OS" style={{ width: 36, height: 36, filter: "drop-shadow(0 0 8px rgba(0,209,178,0.6))" }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: "0.04em" }}>DIRECTIVE OS</div>
              <div style={{ fontSize: 9, color: TEAL, fontWeight: 600, letterSpacing: "0.08em" }}>WEB · AI · MOBILE</div>
            </div>
          </div>

          {/* Waveform visual */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginBottom: 36, height: 60 }}>
            {[14, 28, 42, 56, 38, 22, 48, 34, 18, 44, 30, 16].map((h, i) => (
              <div key={i} style={{ width: 6, height: h, borderRadius: 3, background: i % 3 === 0 ? TEAL : i % 3 === 1 ? "rgba(0,209,178,0.5)" : "rgba(0,209,178,0.25)", flexShrink: 0 }} />
            ))}
          </div>

          <div style={{ fontWeight: 900, fontSize: 30, lineHeight: 1.2, color: "#fff", marginBottom: 16 }}>
            Never miss<br />another lead.
          </div>
          <div style={{ fontSize: 13, color: SLATE, lineHeight: 1.6, marginBottom: 28 }}>
            AI Receptionist · Agency Website · iOS & Android App
          </div>
          <div style={{ height: 2, width: 48, background: TEAL, borderRadius: 2, marginBottom: 28 }} />
          <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>
            For Australian real estate agencies ready to grow without missing a single call.
          </div>
        </div>

        <div style={{ position: "relative" }}>
          <div style={{ background: "rgba(0,209,178,0.1)", border: `1px solid ${TEAL}`, borderRadius: 10, padding: "12px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 10, color: TEAL, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Starting from</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: "#fff" }}>$299<span style={{ fontSize: 13, fontWeight: 400, color: SLATE }}>/month</span></div>
            <div style={{ fontSize: 10, color: SLATE, marginTop: 2 }}>No lock-in contracts · Setup from $1,800</div>
          </div>
        </div>
      </div>
    </>
  );
}

function InsidePanels() {
  return (
    <>
      {/* Panel 4 — How Sarah Works */}
      <div className="print-panel" style={{ ...panelBase, background: NAVY2, borderRight: "1px solid #1a2540", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 8 }}>How it works</div>
        <div style={{ fontWeight: 800, fontSize: 20, color: "#fff", marginBottom: 28, lineHeight: 1.3 }}>Sarah answers every call — so you don't have to.</div>

        <Step n={1} title="Buyer calls your agency" desc="Your existing phone number. No changes needed on the client's side — their number stays the same." />
        <Step n={2} title="Sarah answers instantly" desc="Your AI receptionist responds in a warm, professional Australian voice — 24 hours a day, 7 days a week." />
        <Step n={3} title="Lead qualified & captured" desc="Sarah collects the caller's name, phone, email and enquiry type. You get notified immediately." />
        <Step n={4} title="You follow up when ready" desc="Every lead lands in your dashboard with a full transcript. No missed opportunities — ever." />

        <div style={{ marginTop: "auto", padding: "14px 16px", background: "rgba(0,209,178,0.06)", borderRadius: 10, border: "1px solid rgba(0,209,178,0.15)" }}>
          <div style={{ fontSize: 11, color: SLATE, lineHeight: 1.5 }}>
            💡 <strong style={{ color: "#fff" }}>Real example:</strong> A buyer calls at 10:30pm about a Saturday auction. Sarah qualifies them, books a callback, and your agent wakes up to a warm lead — not a missed call.
          </div>
        </div>
      </div>

      {/* Panel 5 — What's Included */}
      <div className="print-panel" style={{ ...panelBase, background: NAVY, display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 8 }}>Everything your agency needs</div>
        <div style={{ fontWeight: 800, fontSize: 20, color: "#fff", marginBottom: 24, lineHeight: 1.3 }}>One partner. Four powerful services.</div>

        <Service icon="🤖" title="AI Receptionist — Sarah" desc="Answers every call. Qualifies buyers, tenants, vendors and landlords. Collects contact details. Saves every transcript." />
        <Service icon="🌐" title="Agency Website" desc="Professionally designed. Mobile-first. CMS so your team can update it. Built to convert visitors into enquiries." />
        <Service icon="📱" title="iOS & Android App" desc="Your agency's own branded app on the App Store. Buyers browse your listings, enquire, and get push notifications for new properties." />
        <Service icon="🔗" title="CRM Integration" desc="Connects to VaultRE, Rex Software, PropertyMe, realestate.com.au and Domain. Listings sync automatically." />
      </div>

      {/* Panel 6 — Offer + Pricing + CTA */}
      <div className="print-panel" style={{ ...panelBase, background: NAVY, display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,209,178,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 8 }}>Simple, transparent pricing</div>
          <div style={{ fontWeight: 800, fontSize: 20, color: "#fff", marginBottom: 20, lineHeight: 1.3 }}>Start small. Scale as you grow.</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
            {[
              { item: "AI Receptionist (Sarah)", price: "$299/mo" },
              { item: "Agency Website (new build)", price: "from $2,500" },
              { item: "Mobile App — iOS & Android", price: "from $4,500" },
              { item: "CRM / Portal Integration", price: "from $500" },
            ].map(r => (
              <div key={r.item} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid #1e293b" }}>
                <span style={{ fontSize: 12, color: "#cbd5e1" }}>{r.item}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: TEAL }}>{r.price}</span>
              </div>
            ))}
          </div>

          {/* Offer box */}
          <div style={{ background: "linear-gradient(135deg, rgba(0,209,178,0.15), rgba(0,209,178,0.05))", border: `1.5px solid ${TEAL}`, borderRadius: 12, padding: "16px 18px", marginBottom: 20 }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: TEAL, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>🎁 Free offer — In-person visits</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 6, lineHeight: 1.3 }}>Ask for your free website health check — done in 5 minutes, right now.</div>
            <div style={{ fontSize: 11, color: SLATE, lineHeight: 1.4 }}>We'll audit your current site on the spot and give you an honest score. No obligation.</div>
          </div>
        </div>

        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ textAlign: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>Ready to get started?</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <div style={{ padding: 6, background: "#fff", borderRadius: 8 }}>
              <QRCodeSVG value="https://directiveos.com.au/book" size={64} bgColor="#ffffff" fgColor="#0a0f1a" />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 2 }}>0434 666 080</div>
              <div style={{ fontSize: 11, color: SLATE, marginBottom: 2 }}>jayson@directiveos.com.au</div>
              <div style={{ fontSize: 10, color: TEAL }}>Scan to book a free call</div>
            </div>
          </div>
          <div style={{ textAlign: "center", fontSize: 10, color: "#334155", marginTop: 4 }}>directiveos.com.au · No lock-in contracts</div>
        </div>
      </div>
    </>
  );
}
