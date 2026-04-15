import { useState } from "react";
import { Link } from "wouter";
import { QRCodeSVG } from "qrcode.react";

const TEAL = "#00d1b2";
const NAVY = "#07090f";
const NAVY2 = "#0d1117";
const NAVY3 = "#111827";
const WHITE = "#ffffff";
const SLATE = "#94a3b8";
const BORDER = "#1e293b";
const PHONE = "02 5850 4038";

const steps = [
  {
    num: "01",
    icon: "🤝",
    title: "You refer an agency",
    body: "You know a real estate principal who could use an AI receptionist. You send them our way — by email, a quick intro call, or a shared demo link. That's it.",
  },
  {
    num: "02",
    icon: "📞",
    title: "We handle everything",
    body: "Jayson takes it from there — demo, proposal, onboarding. You don't need to sell anything. Just make the introduction.",
  },
  {
    num: "03",
    icon: "💸",
    title: "You get paid",
    body: "When the agency signs up, we pay you a $500 referral fee — transferred within 7 days of their first payment. No chasing, no paperwork beyond a quick email.",
  },
];

const whoItsFor = [
  { icon: "🏦", label: "Mortgage Brokers", desc: "You already talk to buyers and vendors. A single intro to an agent = $500." },
  { icon: "⚖️", label: "Conveyancers & Solicitors", desc: "You work with agency principals every week. The intro writes itself." },
  { icon: "🏠", label: "Buyers Agents", desc: "You know which agencies are losing leads to voicemail. You can fix that." },
  { icon: "📊", label: "Accountants", desc: "Your real estate clients want better systems. This is a tangible referral." },
  { icon: "🔑", label: "Property Managers", desc: "You see the missed calls firsthand. Refer your principal. Done." },
  { icon: "💼", label: "Business Consultants", desc: "If you work with agencies, this is an easy add to your recommendations." },
];

export default function PartnersPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", biz: "", note: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div style={{ minHeight: "100vh", background: NAVY, color: WHITE, fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100, background: NAVY,
        borderBottom: `1px solid ${BORDER}`, padding: "0 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: 68,
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: `linear-gradient(135deg, ${TEAL}, #0891b2)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontSize: 16, color: NAVY
          }}>D</div>
          <span style={{ fontWeight: 800, color: WHITE, fontSize: 16 }}>Directive OS</span>
        </Link>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <Link href="/" style={{ color: SLATE, textDecoration: "none", fontSize: 14 }}>Home</Link>
          <a href="/#pricing" style={{ color: SLATE, textDecoration: "none", fontSize: 14 }}>Pricing</a>
          <Link href="/book" style={{
            background: TEAL, color: NAVY, padding: "9px 20px", borderRadius: 8,
            textDecoration: "none", fontSize: 14, fontWeight: 800
          }}>Book a Demo</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        padding: "100px 32px 80px", textAlign: "center",
        background: `linear-gradient(160deg, ${NAVY} 0%, #001a17 60%, ${NAVY} 100%)`,
        borderBottom: `1px solid ${BORDER}`, position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 700, height: 700, borderRadius: "50%", background: `radial-gradient(circle, ${TEAL}15 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: 760, margin: "0 auto", position: "relative" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: `${TEAL}18`, border: `1px solid ${TEAL}44`,
            color: TEAL, padding: "6px 20px", borderRadius: 100,
            fontSize: 12, fontWeight: 700, marginBottom: 28, letterSpacing: 2, textTransform: "uppercase"
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL, boxShadow: `0 0 6px ${TEAL}` }} />
            Referral Partner Program
          </div>
          <h1 style={{ fontSize: "clamp(34px, 5vw, 58px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 22, letterSpacing: -1.5 }}>
            Refer an Agency.<br />
            <span style={{ color: TEAL }}>Earn $500.</span>
          </h1>
          <p style={{ fontSize: 18, color: SLATE, lineHeight: 1.8, maxWidth: 580, margin: "0 auto 16px" }}>
            If you work alongside real estate agencies — as a broker, conveyancer, accountant, or consultant — you're already positioned to make a warm introduction worth $500.
          </p>
          <p style={{ fontSize: 14, color: "#374151", marginBottom: 44 }}>
            No selling. No setup. Just an intro email and we take it from there.
          </p>
          <a href="#register" style={{
            background: TEAL, color: NAVY, padding: "15px 42px", borderRadius: 8,
            textDecoration: "none", fontSize: 16, fontWeight: 900,
            boxShadow: `0 4px 28px ${TEAL}44`, display: "inline-block"
          }}>Become a Partner →</a>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section style={{ padding: "80px 32px", background: NAVY2, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: TEAL, marginBottom: 12 }}>WHO IT'S FOR</div>
            <h2 style={{ fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 900, margin: 0 }}>
              If you work with agencies, you're a fit
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {whoItsFor.map(w => (
              <div key={w.label} style={{
                background: NAVY3, border: `1px solid ${BORDER}`, borderRadius: 14,
                padding: "24px 22px", transition: "border-color 0.2s"
              }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{w.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 15, color: WHITE, marginBottom: 6 }}>{w.label}</div>
                <div style={{ fontSize: 13, color: SLATE, lineHeight: 1.7 }}>{w.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "80px 32px", background: NAVY, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: TEAL, marginBottom: 12 }}>HOW IT WORKS</div>
            <h2 style={{ fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 900, margin: 0 }}>
              Three steps. That's it.
            </h2>
          </div>
          <div style={{ display: "grid", gap: 0 }}>
            {steps.map((s, i) => (
              <div key={s.num} style={{ display: "flex", gap: 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 80, flexShrink: 0 }}>
                  <div style={{
                    width: 54, height: 54, borderRadius: "50%",
                    background: `linear-gradient(135deg, ${TEAL}, #0891b2)`,
                    color: NAVY, fontWeight: 900, fontSize: 16,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1
                  }}>{s.num}</div>
                  {i < steps.length - 1 && <div style={{ width: 2, flex: 1, background: `linear-gradient(${TEAL}, ${TEAL}11)`, minHeight: 50 }} />}
                </div>
                <div style={{ flex: 1, paddingBottom: i < steps.length - 1 ? 48 : 0, paddingLeft: 24, paddingTop: 12 }}>
                  <div style={{ fontSize: 26, marginBottom: 8 }}>{s.icon}</div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: WHITE, margin: "0 0 10px" }}>{s.title}</h3>
                  <p style={{ fontSize: 15, color: SLATE, lineHeight: 1.8, margin: 0, maxWidth: 520 }}>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EARNINGS BREAKDOWN */}
      <section style={{ padding: "80px 32px", background: NAVY2, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: TEAL, marginBottom: 12 }}>WHAT YOU EARN</div>
          <h2 style={{ fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 900, marginBottom: 16 }}>Simple. Flat. No catch.</h2>
          <p style={{ color: SLATE, fontSize: 15, lineHeight: 1.8, maxWidth: 520, margin: "0 auto 48px" }}>
            Every agency you refer that signs a paid plan earns you $500, paid within 7 days of their first payment clearing.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 40 }}>
            {[
              { label: "Per client signed", value: "$500", note: "Flat fee, no tiers" },
              { label: "Payment timeline", value: "7 days", note: "After their first payment" },
              { label: "Referral limit", value: "None", note: "Refer as many as you like" },
            ].map(e => (
              <div key={e.label} style={{ background: NAVY3, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "28px 20px" }}>
                <div style={{ fontSize: 32, fontWeight: 900, color: TEAL, marginBottom: 6 }}>{e.value}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: WHITE, marginBottom: 4 }}>{e.label}</div>
                <div style={{ fontSize: 12, color: "#374151" }}>{e.note}</div>
              </div>
            ))}
          </div>
          <div style={{ background: `${TEAL}0d`, border: `1px solid ${TEAL}33`, borderRadius: 12, padding: "20px 28px", display: "inline-block", textAlign: "left", maxWidth: 480 }}>
            <div style={{ fontSize: 13, color: TEAL, fontWeight: 700, marginBottom: 8 }}>Example</div>
            <div style={{ fontSize: 14, color: SLATE, lineHeight: 1.8 }}>
              You refer 3 agencies this quarter. All three sign up.<br />
              <span style={{ color: WHITE, fontWeight: 700 }}>You receive $1,500 — transferred directly to you.</span>
            </div>
          </div>
        </div>
      </section>

      {/* REGISTER FORM */}
      <section id="register" style={{ padding: "80px 32px", background: NAVY, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: TEAL, marginBottom: 12 }}>GET STARTED</div>
            <h2 style={{ fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 900, marginBottom: 12 }}>Register as a Partner</h2>
            <p style={{ color: SLATE, fontSize: 14, lineHeight: 1.7 }}>
              Fill in your details below and Jayson will be in touch within one business day to confirm your partner status.
            </p>
          </div>

          {submitted ? (
            <div style={{
              background: `${TEAL}12`, border: `2px solid ${TEAL}44`, borderRadius: 16,
              padding: "48px 32px", textAlign: "center"
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: WHITE, marginBottom: 10 }}>You're registered</h3>
              <p style={{ color: SLATE, fontSize: 14, lineHeight: 1.7 }}>
                Thanks — Jayson will confirm your partner status within one business day. When you're ready to refer, just forward the agency principal's name and contact details to{" "}
                <a href="mailto:jayson@directiveos.com.au" style={{ color: TEAL }}>jayson@directiveos.com.au</a>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
              {[
                { key: "name", label: "Your Full Name", placeholder: "Jane Smith", type: "text" },
                { key: "email", label: "Your Email", placeholder: "jane@yourbusiness.com.au", type: "email" },
                { key: "phone", label: "Your Phone", placeholder: "04xx xxx xxx", type: "tel" },
                { key: "biz", label: "Your Business / Role", placeholder: "e.g. Mortgage Broker · Smith Finance", type: "text" },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: SLATE, display: "block", marginBottom: 6 }}>{f.label}</label>
                  <input
                    type={f.type}
                    required
                    placeholder={f.placeholder}
                    value={(form as Record<string, string>)[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{
                      width: "100%", background: NAVY2, border: `1px solid ${BORDER}`,
                      borderRadius: 8, padding: "12px 14px", color: WHITE, fontSize: 14,
                      outline: "none", boxSizing: "border-box"
                    }}
                  />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: SLATE, display: "block", marginBottom: 6 }}>Any agencies in mind already? (optional)</label>
                <textarea
                  placeholder="e.g. I work with 3 independent agencies in Western Sydney..."
                  value={form.note}
                  onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
                  rows={3}
                  style={{
                    width: "100%", background: NAVY2, border: `1px solid ${BORDER}`,
                    borderRadius: 8, padding: "12px 14px", color: WHITE, fontSize: 14,
                    outline: "none", resize: "vertical", boxSizing: "border-box"
                  }}
                />
              </div>
              <button type="submit" style={{
                background: TEAL, color: NAVY, padding: "14px 0", borderRadius: 8,
                border: "none", fontSize: 16, fontWeight: 900, cursor: "pointer",
                marginTop: 4, boxShadow: `0 4px 20px ${TEAL}44`
              }}>
                Register as a Partner →
              </button>
              <p style={{ textAlign: "center", color: "#374151", fontSize: 12, margin: 0 }}>
                Or email directly:{" "}
                <a href="mailto:jayson@directiveos.com.au" style={{ color: TEAL, textDecoration: "none", fontWeight: 600 }}>jayson@directiveos.com.au</a>
                {" "}· {" "}
                <a href={`tel:${PHONE.replace(/\s/g, "")}`} style={{ color: TEAL, textDecoration: "none", fontWeight: 600 }}>{PHONE}</a>
              </p>
            </form>
          )}
        </div>
      </section>

      {/* QR CODE */}
      <section style={{ padding: "64px 32px", background: NAVY2, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: TEAL, marginBottom: 12 }}>SHARE THIS PAGE</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12 }}>QR Code — Partners Page</h2>
          <p style={{ color: SLATE, fontSize: 14, lineHeight: 1.7, maxWidth: 420, margin: "0 auto 32px" }}>
            Print this on your business card, flyer, or one-pager. Anyone who scans it lands directly on the partner registration page.
          </p>
          <div style={{ display: "inline-block", background: WHITE, padding: 20, borderRadius: 16, boxShadow: `0 0 40px ${TEAL}22` }}>
            <QRCodeSVG
              value="https://directiveos.com.au/partners"
              size={180}
              bgColor="#ffffff"
              fgColor="#07090f"
              level="H"
              includeMargin={false}
            />
          </div>
          <div style={{ marginTop: 16, fontSize: 13, color: "#374151" }}>directiveos.com.au/partners</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: NAVY2, borderTop: `1px solid ${BORDER}`, padding: "32px", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: `linear-gradient(135deg, ${TEAL}, #0891b2)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, color: NAVY }}>D</div>
            <span style={{ fontWeight: 800, color: WHITE, fontSize: 14 }}>Directive OS</span>
          </Link>
          <p style={{ color: "#374151", fontSize: 12, lineHeight: 1.8, margin: 0 }}>
            AI Receptionist for Australian Real Estate Agencies · ABN 87 754 544 171<br />
            <a href="https://directiveos.com.au" style={{ color: TEAL, textDecoration: "none" }}>directiveos.com.au</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
