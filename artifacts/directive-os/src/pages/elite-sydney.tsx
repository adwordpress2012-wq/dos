import { useState, useRef, useEffect, useCallback } from "react";
import { QRCodeCanvas } from "qrcode.react";

// ─── Brand ───────────────────────────────────────────────────────────────────
const BLUE   = "#004391";
const DBLUE  = "#002d6b";
const GOLD   = "#fbb701";
const DARK   = "#1A222C";
const WHITE  = "#ffffff";
const LGREY  = "#f6f7f9";
const MGREY  = "#e8edf4";
const PHONE  = "02 5850 4038";
const SLUG   = "elite-sydney";
const AGENCY = "Elite Sydney Property";
const URL    = `https://directiveos.com.au/${SLUG}`;
const API    = "/api";

type Msg = { role: "user" | "assistant"; content: string };

// ─── Google Font ──────────────────────────────────────────────────────────────
function FontLoader() {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);
  return null;
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
function EliteLogo({ dark = false }: { dark?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
      <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: 22, letterSpacing: 4, color: dark ? BLUE : WHITE, textTransform: "uppercase" }}>ELITE</span>
      <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 500, fontSize: 9, letterSpacing: 3, color: GOLD, textTransform: "uppercase", marginTop: 1 }}>SYDNEY PROPERTY</span>
    </div>
  );
}

// ─── Chat ─────────────────────────────────────────────────────────────────────
function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", content: "G'day! I'm Sarah, AI receptionist for Elite Sydney Property. I'm available 24/7 — are you looking to buy, sell, or rent in the Liverpool area?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const sessionId = useRef(crypto.randomUUID());
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 150); }, [open]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);

  async function send() {
    const t = input.trim();
    if (!t || loading) return;
    setMsgs(p => [...p, { role: "user", content: t }]);
    setInput(""); setLoading(true);
    try {
      const res = await fetch(`${API}/ai/chat`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionId.current, message: t, agencyId: 1 }),
      });
      const d = await res.json();
      const reply = d.message || d.reply || `Call us on ${PHONE}.`;
      // Natural typing delay — proportional to response length, capped at 2.5 s
      const words = reply.trim().split(/\s+/).length;
      await new Promise(r => setTimeout(r, Math.min(2500, Math.max(900, words * 35))));
      setMsgs(p => [...p, { role: "assistant", content: reply }]);
    } catch {
      await new Promise(r => setTimeout(r, 900));
      setMsgs(p => [...p, { role: "assistant", content: `Sorry! Please call us on ${PHONE}.` }]);
    }
    setLoading(false);
  }

  return (
    <>
      {/* FAB */}
      <button onClick={() => setOpen(o => !o)} style={{
        position: "fixed", bottom: 28, right: 28, zIndex: 1000,
        width: 64, height: 64, borderRadius: "50%", border: "none", cursor: "pointer",
        background: `linear-gradient(135deg, ${GOLD}, #e8a800)`,
        boxShadow: open ? "none" : "0 0 0 0 rgba(251,183,1,0.7)",
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: open ? "none" : "glow-pulse 2s infinite",
      }}>
        {open
          ? <svg width="22" height="22" viewBox="0 0 22 22"><path d="M5 5l12 12M17 5L5 17" stroke={DARK} strokeWidth="2.5" strokeLinecap="round"/></svg>
          : <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M4 5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H9l-5 4V5z" fill={DARK}/></svg>
        }
      </button>

      {/* Panel */}
      {open && (
        <div style={{
          position: "fixed", bottom: 104, right: 28, zIndex: 999,
          width: 360, height: 500, display: "flex", flexDirection: "column",
          background: WHITE, borderRadius: 18, overflow: "hidden",
          boxShadow: `0 8px 48px rgba(0,67,145,0.2)`, border: `2px solid ${GOLD}44`,
        }}>
          <div style={{ background: `linear-gradient(135deg, ${DBLUE}, ${BLUE})`, padding: "14px 18px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: DARK, fontWeight: 900, fontSize: 16, fontFamily: "Montserrat, sans-serif" }}>S</span>
            </div>
            <div>
              <div style={{ color: WHITE, fontWeight: 700, fontSize: 14, fontFamily: "Montserrat, sans-serif" }}>Sarah</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
                <span style={{ color: GOLD, fontSize: 11, fontFamily: "Montserrat, sans-serif" }}>Elite Sydney Property · Online 24/7</span>
              </div>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10, background: LGREY }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "82%", padding: "10px 14px", fontSize: 13, lineHeight: 1.5, fontFamily: "Montserrat, sans-serif",
                  background: m.role === "user" ? BLUE : WHITE,
                  color: m.role === "user" ? WHITE : DARK,
                  borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  border: m.role === "assistant" ? `1px solid ${MGREY}` : "none",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}>
                  {m.role === "assistant" && <div style={{ color: GOLD, fontWeight: 700, fontSize: 10, marginBottom: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>Sarah · Elite Sydney Property</div>}
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ background: WHITE, border: `1px solid ${MGREY}`, borderRadius: "14px 14px 14px 4px", padding: "12px 16px", display: "flex", gap: 5 }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: GOLD, animation: `bounce 1s ${i*0.15}s infinite` }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{ padding: "10px 12px", background: WHITE, borderTop: `1px solid ${MGREY}`, display: "flex", gap: 8 }}>
            <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Ask Sarah anything…"
              style={{ flex: 1, border: `1.5px solid ${MGREY}`, borderRadius: 10, padding: "10px 13px", fontSize: 13, outline: "none", fontFamily: "Montserrat, sans-serif", color: DARK }} />
            <button onClick={send} disabled={loading} style={{ background: BLUE, border: "none", borderRadius: 10, padding: "0 16px", cursor: "pointer", color: WHITE, fontWeight: 700, fontSize: 13, fontFamily: "Montserrat, sans-serif" }}>Send</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes glow-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(251,183,1,0.7)} 50%{box-shadow:0 0 0 18px rgba(251,183,1,0)} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes glow-btn { 0%,100%{box-shadow:0 0 24px rgba(251,183,1,0.7),0 0 48px rgba(251,183,1,0.3)} 50%{box-shadow:0 0 48px rgba(251,183,1,1),0 0 96px rgba(251,183,1,0.5),0 0 120px rgba(251,183,1,0.2)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      `}</style>
    </>
  );
}

// ─── QR Section ───────────────────────────────────────────────────────────────
function QRSection() {
  const download = useCallback((label: string, px: number) => {
    const src = document.getElementById("elite-qr") as HTMLCanvasElement | null;
    if (!src) return;
    const out = document.createElement("canvas");
    out.width = px; out.height = px;
    const ctx = out.getContext("2d")!;
    ctx.fillStyle = WHITE; ctx.fillRect(0, 0, px, px);
    ctx.drawImage(src, 0, 0, px, px);
    const a = document.createElement("a");
    a.download = `elite-sydney-qr-${label}.png`;
    a.href = out.toDataURL("image/png");
    a.click();
  }, []);

  return (
    <section style={{ background: LGREY, padding: "72px 20px", borderTop: `1px solid ${MGREY}` }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <span style={{ display: "inline-block", background: `${GOLD}22`, border: `1px solid ${GOLD}66`, borderRadius: 20, padding: "4px 16px", marginBottom: 12 }}>
            <span style={{ color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Montserrat, sans-serif" }}>QR Code · Print Ready</span>
          </span>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", color: DARK, fontSize: 28, fontWeight: 800, margin: "0 0 10px" }}>Put Sarah on Your Signboard</h2>
          <p style={{ color: "#6b7280", fontSize: 15, maxWidth: 480, margin: "0 auto", lineHeight: 1.7, fontFamily: "Montserrat, sans-serif" }}>
            Buyers scan your sign → Sarah answers 24/7. Download print-ready files for signboards, DL flyers and social.
          </p>
        </div>

        <div style={{ background: WHITE, borderRadius: 16, padding: "36px 40px", border: `1px solid ${MGREY}`, boxShadow: "0 4px 24px rgba(0,67,145,0.07)", display: "grid", gridTemplateColumns: "auto 1fr", gap: 48, alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ background: WHITE, padding: 14, borderRadius: 12, border: `2px solid ${GOLD}55` }}>
              <QRCodeCanvas id="elite-qr" value={URL} size={150} fgColor={BLUE} bgColor={WHITE} level="H" />
            </div>
            <div style={{ fontSize: 10, color: "#9ca3af", textAlign: "center", maxWidth: 170, lineHeight: 1.6, fontFamily: "Montserrat, sans-serif" }}>
              Scans to<br /><strong style={{ color: DARK }}>Elite Sydney Property</strong><br />AI Receptionist
            </div>
          </div>

          <div>
            <h3 style={{ fontFamily: "Montserrat, sans-serif", color: DARK, fontWeight: 700, fontSize: 16, margin: "0 0 6px" }}>Download for Print</h3>
            <p style={{ color: "#6b7280", fontSize: 13, margin: "0 0 20px", lineHeight: 1.6, fontFamily: "Montserrat, sans-serif" }}>High-res PNG, ready for your signwriter or printer. One click.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Signboard", sub: "1200×1200px · Corflute / A-frame", size: 1200, icon: "🪧" },
                { label: "DL Flyer (99×210mm)", sub: "1169×2480px 300dpi · Letterbox drop", size: 1169, icon: "📄" },
                { label: "Social Media", sub: "1080×1080px · Instagram / Facebook", size: 1080, icon: "📱" },
              ].map(({ label, sub, size, icon }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", border: `1px solid ${MGREY}`, borderRadius: 10, background: LGREY }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 20 }}>{icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, color: DARK, fontSize: 13, fontFamily: "Montserrat, sans-serif" }}>{label}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af", fontFamily: "Montserrat, sans-serif" }}>{sub}</div>
                    </div>
                  </div>
                  <button onClick={() => download(label.toLowerCase().replace(/[\s()×]+/g, "-"), size)} style={{ background: BLUE, color: WHITE, fontWeight: 700, fontSize: 12, padding: "8px 16px", border: "none", borderRadius: 7, cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>↓ Download</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EliteSydneyLanding() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const crms = ["VaultRE", "Rex CRM", "PropertyMe", "AgentBox", "Console Cloud", "Inspection Manager", "MyDesktop", "PropertyTree"];

  const features = [
    { icon: "📞", title: "Answers Every Call Instantly", desc: "No voicemail, no missed leads. Sarah picks up within seconds — buyers, tenants, vendors and landlords get a real response, 24/7." },
    { icon: "🏠", title: "Books Inspections On the Spot", desc: "Interested buyers get inspections booked in real time — day or night, weekends included. No chasing back and forth." },
    { icon: "🎯", title: "Qualifies Every Lead", desc: "Finance status, property intent, urgency — Sarah asks the right questions and sends you a full profile for every caller." },
    { icon: "💰", title: "Spots Potential Vendors", desc: "When a caller mentions selling, Sarah flags it immediately and books a free appraisal with your team." },
    { icon: "⚡", title: "Hot Lead Alerts", desc: "High-intent buyers and urgent enquiries trigger an instant alert to your phone — you never miss a deal-ready lead." },
    { icon: "🔗", title: "Syncs With Your CRM", desc: "Sarah connects to all major real estate CRMs — VaultRE, Rex, PropertyMe, AgentBox, Console Cloud and more." },
  ];

  const suburbs = ["Liverpool", "Hinchinbrook", "Prestons", "Casula", "Lurnea", "Warwick Farm", "Miller", "Hoxton Park", "Cecil Hills", "Carnes Hill", "Len Waters", "Bonnyrigg", "Cabramatta", "Wetherill Park", "Green Valley"];

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: WHITE, minHeight: "100vh" }}>
      <FontLoader />

      {/* ── DEMO BANNER ── */}
      <div style={{ background: DBLUE, borderBottom: `3px solid ${GOLD}`, padding: "9px 20px", textAlign: "center", position: "relative", zIndex: 200 }}>
        <span style={{ display: "inline-block", background: GOLD, color: DARK, fontWeight: 800, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", padding: "2px 10px", borderRadius: 4, marginRight: 10, fontFamily: "Montserrat, sans-serif" }}>DEMO</span>
        <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontFamily: "Montserrat, sans-serif" }}>Preview of Elite Sydney Property's AI Receptionist. <a href="https://directiveos.com.au" target="_blank" rel="noopener" style={{ color: GOLD, textDecoration: "none", fontWeight: 600 }}>Powered by Directive OS ↗</a></span>
      </div>

      {/* ── NAV ── */}
      <nav style={{
        background: scrolled ? `rgba(0,20,60,0.97)` : DBLUE,
        backdropFilter: scrolled ? "blur(12px)" : "none",
        padding: "0 40px", position: "sticky", top: 0, zIndex: 100,
        transition: "background 0.3s ease",
        boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,0.3)" : "0 2px 16px rgba(0,0,0,0.2)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
          <EliteLogo />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {["Properties", "About Us", "Areas We Serve", "Contact"].map(l => (
              <span key={l} style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", padding: "8px 12px", cursor: "default" }}>{l}</span>
            ))}
            <a href={`tel:${PHONE.replace(/\s/g,"")}`} style={{
              marginLeft: 8, background: GOLD, color: DARK, fontWeight: 800, fontSize: 12,
              padding: "10px 20px", borderRadius: 6, textDecoration: "none", letterSpacing: "0.04em",
              fontFamily: "Montserrat, sans-serif",
            }}>{PHONE}</a>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        background: `linear-gradient(145deg, ${DBLUE} 0%, ${BLUE} 50%, #1a5aad 100%)`,
        minHeight: "88vh", display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "60px 20px 100px", position: "relative", overflow: "hidden",
      }}>
        {/* Background texture */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 50%, rgba(251,183,1,0.08) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 60px)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative" }}>
          {/* Live badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(251,183,1,0.15)", border: `1px solid ${GOLD}55`, borderRadius: 24, padding: "7px 20px", marginBottom: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: GOLD, animation: "glow-pulse 2s infinite" }} />
            <span style={{ color: GOLD, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Sarah — AI Receptionist · Available 24/7</span>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
            {[["🇦🇺","English"],["🇨🇳","中文"],["🇵🇭","Filipino"],["🇷🇺","Русский"],["🇸🇦","عربي"],["🇰🇷","한국어"],["🇻🇳","Tiếng Việt"],["🇮🇳","हिंदी"],["🇪🇸","Español"]].map(([flag, lang]) => (
              <span key={lang} style={{ fontSize: 10, background: "rgba(251,183,1,0.12)", border: `1px solid ${GOLD}44`, color: GOLD, borderRadius: 6, padding: "2px 8px", fontWeight: 600, letterSpacing: 0.3 }}>{flag} {lang}</span>
            ))}
          </div>

          <h1 style={{ color: WHITE, fontSize: "clamp(36px,5.5vw,62px)", fontWeight: 900, lineHeight: 1.1, margin: "0 0 24px", letterSpacing: "-0.02em" }}>
            Your Agency.<br />
            <span style={{ color: GOLD }}>Never Misses a Call.</span>
          </h1>

          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 18, lineHeight: 1.75, margin: "0 0 16px", maxWidth: 620, marginLeft: "auto", marginRight: "auto" }}>
            Elite Sydney Property runs 24/7 with Sarah — an AI receptionist who answers every call, qualifies every buyer, books inspections, and captures every lead. Even at midnight.
          </p>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: "0 0 48px" }}>
            Integrates with VaultRE, Rex, PropertyMe, AgentBox and all major CRMs.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={`tel:${PHONE.replace(/\s/g,"")}`} style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: GOLD, color: DARK, fontWeight: 800, fontSize: 17,
              padding: "18px 40px", borderRadius: 10, textDecoration: "none",
              fontFamily: "Montserrat, sans-serif", letterSpacing: "0.02em",
              animation: "glow-btn 2.5s ease-in-out infinite",
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2 3a2 2 0 012-2h2.153a2 2 0 011.994 1.794l.24 2.16a2 2 0 01-1.073 2.015L6 7.5a12 12 0 005.5 5.5l.531-1.314a2 2 0 012.015-1.073l2.16.24A2 2 0 0118 12.847V15a2 2 0 01-2 2 15 15 0 01-14-14z" fill={DARK}/></svg>
              Call Sarah Now
            </a>
            <button onClick={() => document.getElementById("chat-open-btn")?.click()} style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: "rgba(255,255,255,0.12)", color: WHITE, fontWeight: 700, fontSize: 16,
              padding: "18px 36px", borderRadius: 10, border: "1.5px solid rgba(255,255,255,0.25)", cursor: "pointer",
              fontFamily: "Montserrat, sans-serif",
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2 3a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H7l-5 4V3z" fill={WHITE}/></svg>
              Chat with Sarah
            </button>
          </div>

          {/* Floating stat cards */}
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 64, flexWrap: "wrap" }}>
            {[
              { num: "< 10s", label: "Answer time" },
              { num: "24/7", label: "Always on" },
              { num: "100%", label: "Calls answered" },
              { num: "0", label: "Missed leads" },
            ].map(({ num, label }) => (
              <div key={label} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 14, padding: "18px 28px", backdropFilter: "blur(8px)", textAlign: "center", minWidth: 110, animation: "float 4s ease-in-out infinite" }}>
                <div style={{ color: GOLD, fontSize: 26, fontWeight: 900, letterSpacing: "-0.02em" }}>{num}</div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave */}
        <svg style={{ position: "absolute", bottom: -2, left: 0, right: 0, width: "100%" }} viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill={WHITE} />
        </svg>
      </section>

      {/* ── CRM SYNC STRIP ── */}
      <section style={{ background: WHITE, padding: "40px 20px", borderBottom: `1px solid ${MGREY}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: "#9ca3af", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 20, fontFamily: "Montserrat, sans-serif" }}>Sarah connects with all major real estate CRMs</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            {crms.map(crm => (
              <div key={crm} style={{ background: LGREY, border: `1px solid ${MGREY}`, borderRadius: 8, padding: "8px 18px", fontSize: 12, fontWeight: 700, color: DARK, fontFamily: "Montserrat, sans-serif", letterSpacing: "0.03em" }}>{crm}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ background: WHITE, padding: "88px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{ display: "inline-block", background: `${GOLD}22`, border: `1px solid ${GOLD}55`, borderRadius: 20, padding: "4px 16px", marginBottom: 14 }}>
              <span style={{ color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>What Sarah Does</span>
            </span>
            <h2 style={{ color: DARK, fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 800, margin: "0 0 12px", letterSpacing: "-0.02em" }}>Elite Service, Around the Clock</h2>
            <p style={{ color: "#6b7280", fontSize: 16, maxWidth: 540, margin: "0 auto", lineHeight: 1.7 }}>Everything your front desk does — handled instantly, 24 hours a day, without dropping a single call.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))", gap: 20 }}>
            {features.map((f, i) => (
              <div key={f.title} style={{
                padding: "28px 28px 24px", borderRadius: 14, border: `1px solid ${MGREY}`,
                background: WHITE, borderTop: `3px solid ${i % 2 === 0 ? BLUE : GOLD}`,
                boxShadow: "0 4px 20px rgba(0,67,145,0.05)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px rgba(0,67,145,0.12)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,67,145,0.05)"; }}
              >
                <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ color: DARK, fontSize: 15, fontWeight: 700, margin: "0 0 8px" }}>{f.title}</h3>
                <p style={{ color: "#6b7280", fontSize: 13.5, lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHAT DEMO ── */}
      <section style={{ background: LGREY, padding: "88px 20px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
          <div>
            <span style={{ display: "inline-block", background: `${GOLD}22`, border: `1px solid ${GOLD}55`, borderRadius: 20, padding: "4px 16px", marginBottom: 16 }}>
              <span style={{ color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Try It Now</span>
            </span>
            <h2 style={{ color: DARK, fontSize: 32, fontWeight: 800, margin: "0 0 16px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>Talk to Sarah.<br />Right Now.</h2>
            <p style={{ color: "#6b7280", fontSize: 15, lineHeight: 1.7, margin: "0 0 28px" }}>
              Call or chat — Sarah is live and ready. She'll qualify your enquiry the same way she does for every buyer and tenant who contacts Elite Sydney Property.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <a href={`tel:${PHONE.replace(/\s/g,"")}`} style={{
                display: "inline-flex", alignItems: "center", gap: 12, background: GOLD, color: DARK,
                fontWeight: 800, fontSize: 16, padding: "16px 28px", borderRadius: 10, textDecoration: "none",
                animation: "glow-btn 2.5s ease-in-out infinite", fontFamily: "Montserrat, sans-serif",
              }}>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M2 3a2 2 0 012-2h2.153a2 2 0 011.994 1.794l.24 2.16a2 2 0 01-1.073 2.015L6 7.5a12 12 0 005.5 5.5l.531-1.314a2 2 0 012.015-1.073l2.16.24A2 2 0 0118 12.847V15a2 2 0 01-2 2 15 15 0 01-14-14z" fill={DARK}/></svg>
                Call Sarah — {PHONE}
              </a>
              <p style={{ color: "#9ca3af", fontSize: 12, margin: 0 }}>Or click the gold chat bubble → bottom right corner</p>
            </div>
          </div>

          {/* Mock conversation */}
          <div style={{ background: WHITE, borderRadius: 18, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,67,145,0.12)", border: `1px solid ${MGREY}` }}>
            <div style={{ background: `linear-gradient(135deg, ${DBLUE}, ${BLUE})`, padding: "14px 18px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: GOLD, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: DARK, fontWeight: 900, fontSize: 15 }}>S</span>
              </div>
              <div>
                <div style={{ color: WHITE, fontWeight: 700, fontSize: 14 }}>Sarah</div>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e" }} />
                  <span style={{ color: GOLD, fontSize: 11 }}>Elite Sydney Property · Online now</span>
                </div>
              </div>
            </div>
            <div style={{ padding: 16, background: LGREY, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { r: "assistant", t: "G'day! I'm Sarah with Elite Sydney Property. Are you looking to buy, sell, or rent in the Liverpool area?" },
                { r: "user",      t: "Hi, looking to buy a 4-bed in Liverpool under $900k. Finance approved." },
                { r: "assistant", t: "Perfect timing — we have some great options right now. As a finance-approved buyer you're in a strong position. Would you like me to book you a callback with our agent today, or arrange a private inspection this week?" },
              ].map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.r === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{
                    maxWidth: "80%", padding: "10px 14px", fontSize: 12.5, lineHeight: 1.5,
                    background: m.r === "user" ? BLUE : WHITE,
                    color: m.r === "user" ? WHITE : DARK,
                    borderRadius: m.r === "user" ? "12px 12px 3px 12px" : "12px 12px 12px 3px",
                    border: m.r === "assistant" ? `1px solid ${MGREY}` : "none",
                    fontFamily: "Montserrat, sans-serif",
                  }}>
                    {m.r === "assistant" && <div style={{ color: GOLD, fontWeight: 700, fontSize: 10, marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.06em" }}>Sarah</div>}
                    {m.t}
                  </div>
                </div>
              ))}
              <div style={{ textAlign: "center", paddingTop: 4 }}>
                <span style={{ color: "#9ca3af", fontSize: 11, fontFamily: "Montserrat, sans-serif" }}>💬 Chat with Sarah → bottom right</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICE AREAS ── */}
      <section style={{ background: `linear-gradient(135deg, ${DBLUE}, ${BLUE})`, padding: "72px 20px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 70% 50%, rgba(251,183,1,0.06) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <h2 style={{ color: WHITE, fontSize: 28, fontWeight: 800, margin: "0 0 8px", letterSpacing: "-0.01em" }}>Areas We Serve</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, margin: "0 0 32px" }}>Sarah handles enquiries across all of Elite Sydney Property's service areas</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {suburbs.map(s => (
              <span key={s} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20, padding: "7px 18px", color: WHITE, fontSize: 13, fontWeight: 600, fontFamily: "Montserrat, sans-serif" }}>{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ background: WHITE, padding: "88px 20px", textAlign: "center" }}>
        <div style={{ maxWidth: 620, margin: "0 auto" }}>
          <div style={{ fontSize: 48, marginBottom: 20, animation: "float 3s ease-in-out infinite" }}>📞</div>
          <h2 style={{ color: DARK, fontSize: "clamp(28px,4vw,42px)", fontWeight: 900, margin: "0 0 16px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
            Ready to Never Miss<br />Another Lead?
          </h2>
          <p style={{ color: "#6b7280", fontSize: 16, margin: "0 0 40px", lineHeight: 1.7 }}>
            Call Sarah right now — she's live, she's ready, and she'll show you exactly what Elite Sydney Property's clients experience every day.
          </p>
          <a href={`tel:${PHONE.replace(/\s/g,"")}`} style={{
            display: "inline-flex", alignItems: "center", gap: 12,
            background: GOLD, color: DARK, fontWeight: 900, fontSize: 20,
            padding: "22px 52px", borderRadius: 12, textDecoration: "none",
            fontFamily: "Montserrat, sans-serif", letterSpacing: "0.01em",
            animation: "glow-btn 2.5s ease-in-out infinite",
          }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none"><path d="M2 3a2 2 0 012-2h2.153a2 2 0 011.994 1.794l.24 2.16a2 2 0 01-1.073 2.015L6 7.5a12 12 0 005.5 5.5l.531-1.314a2 2 0 012.015-1.073l2.16.24A2 2 0 0118 12.847V15a2 2 0 01-2 2 15 15 0 01-14-14z" fill={DARK}/></svg>
            Call Sarah Now — {PHONE}
          </a>
          <p style={{ color: "#d1d5db", fontSize: 12, marginTop: 16, fontFamily: "Montserrat, sans-serif" }}>Available 24 hours · 7 days · No voicemail</p>
        </div>
      </section>

      {/* ── QR CODE ── */}
      <QRSection />

      {/* ── FOOTER ── */}
      <footer style={{ background: DBLUE, padding: "40px 20px 32px", borderTop: `4px solid ${GOLD}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 24, marginBottom: 28 }}>
            <EliteLogo />
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {["Properties", "About Us", "Areas We Serve", "Contact"].map(l => (
                <span key={l} style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontFamily: "Montserrat, sans-serif", cursor: "default" }}>{l}</span>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, margin: 0, fontFamily: "Montserrat, sans-serif" }}>© 2025 Elite Sydney Property · All rights reserved</p>
            <a href="https://directiveos.com.au" target="_blank" rel="noopener" style={{ color: GOLD, fontSize: 11, textDecoration: "none", fontFamily: "Montserrat, sans-serif", opacity: 0.6 }}>Powered by Directive OS</a>
          </div>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
}
