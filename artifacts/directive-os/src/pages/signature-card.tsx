import logoUrl from "@assets/dos-email-signature_1776414853088.png";

export default function SignatureCard() {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: 40,
        minHeight: "100vh",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <div
        id="sig"
        style={{
          width: 620,
          background: "#ffffff",
          padding: 24,
          borderRadius: 16,
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        <table cellPadding={0} cellSpacing={0} style={{ borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ paddingRight: 22, verticalAlign: "middle" }}>
                <img
                  src={logoUrl}
                  alt="Directive OS"
                  width={108}
                  height={108}
                  style={{ display: "block", borderRadius: 999 }}
                />
              </td>
              <td
                style={{
                  borderLeft: "3px solid #00d1b2",
                  paddingLeft: 22,
                  verticalAlign: "middle",
                  color: "#0f172a",
                }}
              >
                <div style={{ fontSize: 26, lineHeight: 1.1, fontWeight: 800, color: "#0f172a" }}>
                  Jayson Ocampo
                </div>
                <div
                  style={{
                    fontSize: 13,
                    letterSpacing: 1.6,
                    textTransform: "uppercase",
                    color: "#0f172a",
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
                    color: "#00d1b2",
                    fontWeight: 800,
                    marginTop: 2,
                  }}
                >
                  Directive OS
                </div>
                <div
                  style={{
                    height: 1,
                    background: "#e5e7eb",
                    margin: "14px 0",
                    width: 320,
                  }}
                />
                <div style={{ fontSize: 14, lineHeight: 1.7, color: "#0f172a" }}>
                  <div>
                    <span style={{ color: "#00d1b2", fontWeight: 800 }}>M</span>{" "}
                    <strong>0434 666 080</strong>
                  </div>
                  <div>
                    <span style={{ color: "#00d1b2", fontWeight: 800 }}>E</span>{" "}
                    <a
                      href="mailto:jayson@directiveos.com.au"
                      style={{ color: "#0f172a", textDecoration: "none", fontWeight: 700 }}
                    >
                      jayson@directiveos.com.au
                    </a>
                  </div>
                  <div>
                    <span style={{ color: "#00d1b2", fontWeight: 800 }}>W</span>{" "}
                    <a
                      href="https://directiveos.com.au"
                      style={{ color: "#00d1b2", textDecoration: "none", fontWeight: 700 }}
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
                    background: "#0f172a",
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
                  <span style={{ color: "#00d1b2", fontWeight: 700 }}>
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
