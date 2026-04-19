const YELLOW = "#FFE100";
const BLACK = "#111111";
const SARAH_NUMBER = "02 5850 4038";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";

const DEMOS = [
  {
    name: "Ray White United Group",
    sub: "St Marys · Greater Penrith",
    url: `${BASE}/ray-white-ug`,
    color: "#FFE100",
    textColor: "#111",
    icon: "🏡",
    tag: "New",
  },
  {
    name: "Century 21 The Rana Group",
    sub: "Seven Hills · Blacktown",
    url: "/c21-rana",
    external: true,
    color: "#F2B838",
    textColor: "#111",
    icon: "🏘️",
    tag: "Live",
  },
  {
    name: "Nidus Real Estate",
    sub: "Mt Druitt · Western Sydney",
    url: "/nidus-re",
    external: true,
    color: "#e70d73",
    textColor: "#fff",
    icon: "🔑",
    tag: "Live",
  },
  {
    name: "Elite Sydney Property",
    sub: "Liverpool · Hinchinbrook",
    url: `${BASE}/elite-sydney`,
    color: "#004391",
    textColor: "#fff",
    icon: "🏙️",
    tag: "Demo",
  },
  {
    name: "The Boulevard Group",
    sub: "Sydney Metro",
    url: `${BASE}/boulevard-group`,
    color: "#1a2442",
    textColor: "#f0b849",
    icon: "✨",
    tag: "Demo",
  },
  {
    name: "Meridian Property Group",
    sub: "Full Website Demo",
    url: "/realestate-demo",
    external: true,
    color: "#00d1b2",
    textColor: "#0a0e1a",
    icon: "🌐",
    tag: "Full Site",
  },
];

export default function LaunchPage() {
  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a", color: "#fff",
      fontFamily: "'Inter', -apple-system, sans-serif",
      paddingBottom: 32
    }}>

      {/* Header */}
      <div style={{
        background: "#111", borderBottom: `3px solid ${YELLOW}`,
        padding: "20px 20px 16px", textAlign: "center",
        position: "sticky", top: 0, zIndex: 100
      }}>
        <div style={{ fontSize: 11, color: YELLOW, fontWeight: 800, letterSpacing: 4, textTransform: "uppercase", marginBottom: 4 }}>
          DIRECTIVE OS
        </div>
        <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", letterSpacing: -0.5 }}>
          Live Demo Launcher
        </div>
        <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>Tap any card to demo for prospects</div>
      </div>

      {/* Sarah Call Bar */}
      <div style={{ padding: "16px 20px", background: "#1a1a00", borderBottom: `1px solid ${YELLOW}33` }}>
        <a href="tel:0258504038" style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          textDecoration: "none", background: YELLOW, color: BLACK,
          padding: "14px 20px", borderRadius: 8, boxShadow: `0 4px 20px ${YELLOW}44`
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", opacity: 0.6 }}>Call Sarah Live Now</div>
            <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: -0.5 }}>📞 {SARAH_NUMBER}</div>
          </div>
          <div style={{
            width: 12, height: 12, borderRadius: "50%", background: "#22c55e",
            boxShadow: "0 0 10px #22c55e", animation: "pulse 1.5s infinite"
          }} />
        </a>
      </div>

      {/* Section heading */}
      <div style={{ padding: "20px 20px 8px" }}>
        <div style={{ fontSize: 11, color: "#555", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
          Live Client Pages — {DEMOS.length} Active
        </div>
      </div>

      {/* Demo cards */}
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {DEMOS.map((d) => (
          <a
            key={d.name}
            href={d.url}
            target={d.external ? "_blank" : "_self"}
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", gap: 16,
              background: "#1a1a1a", border: `1px solid ${d.color}44`,
              borderRadius: 12, padding: "16px 18px", textDecoration: "none",
              transition: "all 0.15s"
            }}
          >
            <div style={{
              width: 50, height: 50, borderRadius: 10,
              background: d.color, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 22, flexShrink: 0
            }}>{d.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: 3 }}>{d.name}</div>
              <div style={{ fontSize: 12, color: "#666", fontWeight: 500 }}>{d.sub}</div>
            </div>
            <div style={{
              background: `${d.color}22`, border: `1px solid ${d.color}55`,
              color: d.color, fontSize: 10, fontWeight: 800, letterSpacing: 1.5,
              textTransform: "uppercase", padding: "4px 10px", borderRadius: 20, flexShrink: 0
            }}>{d.tag}</div>
          </a>
        ))}
      </div>

      {/* Add to Home Screen tip */}
      <div style={{ margin: "24px 16px 0", background: "#111", border: "1px solid #2a2a2a", borderRadius: 12, padding: "16px 18px" }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: YELLOW, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
          📌 Add to Home Screen
        </div>
        <div style={{ fontSize: 12, color: "#666", lineHeight: 1.7 }}>
          <strong style={{ color: "#aaa" }}>iPhone:</strong> Tap the Share button in Safari → "Add to Home Screen"<br />
          <strong style={{ color: "#aaa" }}>Android:</strong> Tap the menu (⋮) → "Add to Home Screen"
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "28px 20px 0", color: "#333", fontSize: 11 }}>
        <a href="https://directiveos.com.au" style={{ color: "#444", textDecoration: "none", fontWeight: 700 }}>directiveos.com.au</a>
        {" · "}ABN 87 754 544 171
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        a:active { opacity: 0.7; }
      `}</style>
    </div>
  );
}
