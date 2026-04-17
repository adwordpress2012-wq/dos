const logoUrl = "/logo.png";

const NAVY = "#0b1220";
const NAVY2 = "#0f172a";
const TEAL = "#00d1b2";

function makeStars(count: number, seed: number) {
  const stars: { x: number; y: number; r: number; o: number }[] = [];
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = 0; i < count; i++) {
    stars.push({
      x: rand() * 100,
      y: rand() * 100,
      r: rand() * 1.4 + 0.3,
      o: rand() * 0.7 + 0.3,
    });
  }
  return stars;
}

export default function SignatureCard() {
  const stars = makeStars(120, 42);

  return (
    <div
      style={{
        background: NAVY,
        padding: 40,
        minHeight: "100vh",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <div
        id="sig"
        style={{
          position: "relative",
          width: 620,
          background: `radial-gradient(120% 140% at 0% 0%, #112038 0%, ${NAVY2} 45%, ${NAVY} 100%)`,
          padding: 28,
          borderRadius: 18,
          border: "1px solid rgba(0,209,178,0.18)",
          boxShadow: "0 18px 48px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.02) inset",
          overflow: "hidden",
        }}
      >
        {/* Star field */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          {stars.map((st, i) => (
            <circle
              key={i}
              cx={st.x}
              cy={st.y}
              r={st.r * 0.18}
              fill="#ffffff"
              opacity={st.o}
            />
          ))}
        </svg>

        {/* Subtle teal glow */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 260,
            height: 260,
            background: "radial-gradient(circle, rgba(0,209,178,0.18), transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <table cellPadding={0} cellSpacing={0} style={{ borderCollapse: "collapse", position: "relative" }}>
          <tbody>
            <tr>
              <td style={{ paddingRight: 22, verticalAlign: "middle" }}>
                <div
                  style={{
                    width: 118,
                    height: 118,
                    borderRadius: 999,
                    padding: 3,
                    background: `linear-gradient(135deg, ${TEAL}, rgba(0,209,178,0.25))`,
                    boxShadow: "0 0 24px rgba(0,209,178,0.35)",
                  }}
                >
                  <div
                    style={{
                      width: 112,
                      height: 112,
                      borderRadius: 999,
                      background: "#0b1220",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={logoUrl}
                      alt="Directive OS"
                      width={86}
                      height={86}
                      style={{ display: "block", objectFit: "contain" }}
                    />
                  </div>
                </div>
              </td>
              <td
                style={{
                  borderLeft: `3px solid ${TEAL}`,
                  paddingLeft: 22,
                  verticalAlign: "middle",
                  color: "#ffffff",
                }}
              >
                <div style={{ fontSize: 26, lineHeight: 1.1, fontWeight: 800, color: "#ffffff" }}>
                  Jayson Ocampo
                </div>
                <div
                  style={{
                    fontSize: 13,
                    letterSpacing: 1.6,
                    textTransform: "uppercase",
                    color: "#e2e8f0",
                    fontWeight: 700,
                    marginTop: 4,
                  }}
                >
                  Director of AI Solutions
                </div>
                <div
                  style={{
                    fontSize: 12,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: TEAL,
                    fontWeight: 800,
                    marginTop: 2,
                  }}
                >
                  Directive OS
                </div>
                <div
                  style={{
                    height: 1,
                    background: "rgba(148,163,184,0.25)",
                    margin: "14px 0",
                    width: 320,
                  }}
                />
                <div style={{ fontSize: 14, lineHeight: 1.7, color: "#e2e8f0" }}>
                  <div>
                    <span style={{ color: TEAL, fontWeight: 800 }}>M</span>{" "}
                    <strong style={{ color: "#ffffff" }}>0434 666 080</strong>
                  </div>
                  <div>
                    <span style={{ color: TEAL, fontWeight: 800 }}>E</span>{" "}
                    <a
                      href="mailto:jayson@directiveos.com.au"
                      style={{ color: "#ffffff", textDecoration: "none", fontWeight: 700 }}
                    >
                      jayson@directiveos.com.au
                    </a>
                  </div>
                  <div>
                    <span style={{ color: TEAL, fontWeight: 800 }}>W</span>{" "}
                    <a
                      href="https://directiveos.com.au"
                      style={{ color: TEAL, textDecoration: "none", fontWeight: 700 }}
                    >
                      directiveos.com.au
                    </a>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan={2} style={{ paddingTop: 18 }}>
                <div
                  style={{
                    background: "rgba(0,209,178,0.08)",
                    border: "1px solid rgba(0,209,178,0.25)",
                    color: "#ffffff",
                    borderRadius: 12,
                    padding: "12px 18px",
                    fontSize: 13,
                    lineHeight: 1.4,
                  }}
                >
                  <span style={{ opacity: 0.85 }}>
                    AI Receptionist & Web Solutions for Australian Real Estate
                  </span>
                  <span style={{ color: TEAL, fontWeight: 700 }}>
                    {" "}· Never miss a call. Never miss a lead.
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
