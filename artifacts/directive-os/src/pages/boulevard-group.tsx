import { useState, useRef, useEffect, useCallback } from "react";
import { QRCodeCanvas } from "qrcode.react";

const NAVY    = "#1a2442";
const GOLD    = "#f0b849";
const DNAVY   = "#111d36";
const WHITE   = "#ffffff";
const LGREY   = "#f7f7f5";
const PHONE   = "02 5850 4038"; // demo — swap to dedicated Twilio number at activation
const API_BASE = "/api";

interface Message { role: "user" | "assistant"; content: string; }

// ─── Boulevard Group Logo ─────────────────────────────────────────────────────
function BoulevardLogo({ size = 36, light = false }: { size?: number; light?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: size, height: size, border: `2px solid ${GOLD}`,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <span style={{ color: GOLD, fontWeight: 900, fontSize: size * 0.36, letterSpacing: -1, fontFamily: "Georgia, serif" }}>B</span>
      </div>
      <div>
        <div style={{ fontSize: size * 0.3, fontWeight: 700, color: GOLD, letterSpacing: 3, textTransform: "uppercase", lineHeight: 1, fontFamily: "Georgia, serif" }}>THE BOULEVARD</div>
        <div style={{ fontSize: size * 0.17, fontWeight: 400, color: light ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.55)", letterSpacing: 3, textTransform: "uppercase", lineHeight: 1.4 }}>GROUP</div>
      </div>
    </div>
  );
}

// ─── Chat Widget ──────────────────────────────────────────────────────────────
function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "G'day! I'm Sarah, AI receptionist for The Boulevard Group. Looking to buy, sell, lease or manage a property? I'm available 24/7 — how can I help?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionId = useRef(crypto.randomUUID());

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 200); }, [open]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setMessages(p => [...p, { role: "user", content: text }]);
    setInput(""); setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionId.current, message: text, agencyId: 1 }),
      });
      const data = await res.json();
      const reply = data.message || data.reply || `Please call us on ${PHONE}.`;
      const words = reply.trim().split(/\s+/).length;
      await new Promise(r => setTimeout(r, Math.min(2500, Math.max(900, words * 35))));
      setMessages(p => [...p, { role: "assistant", content: reply }]);
    } catch {
      await new Promise(r => setTimeout(r, 900));
      setMessages(p => [...p, { role: "assistant", content: `Sorry about that! Please call us on ${PHONE}.` }]);
    }
    setLoading(false);
  }

  return (
    <>
      {/* Floating button */}
      <button onClick={() => setOpen(o => !o)} style={{
        position: "fixed", bottom: 28, right: 28, zIndex: 1000,
        width: 60, height: 60, borderRadius: "50%", border: "none", cursor: "pointer",
        background: GOLD, boxShadow: "0 4px 20px rgba(240,184,73,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: open ? "none" : "pulse-gold 2.5s infinite",
      }}>
        {open
          ? <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M5 5l12 12M17 5L5 17" stroke={NAVY} strokeWidth="2.5" strokeLinecap="round"/></svg>
          : <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M4 5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H9l-5 4V5z" fill={NAVY}/></svg>
        }
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: "fixed", bottom: 100, right: 28, zIndex: 999,
          width: 360, height: 500, display: "flex", flexDirection: "column",
          background: WHITE, borderRadius: 16, overflow: "hidden",
          boxShadow: "0 8px 40px rgba(26,36,66,0.25)", border: `1px solid ${GOLD}33`,
        }}>
          {/* Header */}
          <div style={{ background: NAVY, padding: "14px 18px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: GOLD, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: NAVY, fontWeight: 800, fontSize: 15 }}>S</span>
            </div>
            <div>
              <div style={{ color: WHITE, fontWeight: 700, fontSize: 14 }}>Sarah</div>
              <div style={{ color: GOLD, fontSize: 11 }}>The Boulevard Group · Online 24/7</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10, background: LGREY }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "80%", padding: "10px 14px", borderRadius: 12, fontSize: 13, lineHeight: 1.5,
                  background: m.role === "user" ? NAVY : WHITE,
                  color: m.role === "user" ? WHITE : "#1e1e1e",
                  border: m.role === "assistant" ? `1px solid ${GOLD}33` : "none",
                  borderRadius: m.role === "user" ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
                }}>
                  {m.role === "assistant" && <span style={{ color: GOLD, fontWeight: 700, fontSize: 11, display: "block", marginBottom: 3 }}>Sarah</span>}
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ background: WHITE, border: `1px solid ${GOLD}33`, borderRadius: "12px 12px 12px 4px", padding: "10px 16px" }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD, animation: `bounce 1s ${i * 0.15}s infinite` }} />)}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: 12, background: WHITE, borderTop: `1px solid #e5e7eb`, display: "flex", gap: 8 }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Ask Sarah anything…"
              style={{ flex: 1, border: `1px solid #e5e7eb`, borderRadius: 8, padding: "9px 12px", fontSize: 13, outline: "none", fontFamily: "inherit" }}
            />
            <button onClick={send} disabled={loading} style={{
              background: GOLD, border: "none", borderRadius: 8, padding: "0 14px", cursor: "pointer",
              color: NAVY, fontWeight: 700, fontSize: 13,
            }}>Send</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse-gold { 0%,100%{box-shadow:0 4px 20px rgba(240,184,73,0.5)} 50%{box-shadow:0 4px 32px rgba(240,184,73,0.85)} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
      `}</style>
    </>
  );
}

// ─── Featured Listing ─────────────────────────────────────────────────────────
const DEMO_LISTING = {
  address: "12 Ridgeline Circuit, Bella Vista NSW 2153",
  price: "$1,495,000",
  beds: 4, baths: 2, cars: 2, sqm: 612,
  type: "House",
  status: "For Sale",
  link: "https://www.theboulevardgroup.com.au/buy/",
  agentName: "The Boulevard Group",
  features: ["Freshly painted interior", "Stone benchtops", "Ducted air conditioning", "Double lock-up garage"],
};

function FeaturedListing() {
  const [imgError, setImgError] = useState(false);
  const listing = DEMO_LISTING;
  return (
    <section style={{ background: WHITE, padding: "72px 20px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "inline-block", background: `${GOLD}22`, border: `1px solid ${GOLD}66`, borderRadius: 20, padding: "3px 14px", marginBottom: 10 }}>
              <span style={{ color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Featured Listing</span>
            </div>
            <h2 style={{ color: NAVY, fontSize: 28, fontWeight: 800, margin: 0, fontFamily: "Georgia, serif" }}>Latest Property</h2>
          </div>
          <div style={{ background: `${GOLD}18`, border: `1px solid ${GOLD}44`, borderRadius: 8, padding: "6px 14px", fontSize: 12, color: NAVY, fontWeight: 600 }}>
            ✦ DEMO — Updated at activation
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 40px rgba(26,36,66,0.12)", border: `1px solid ${GOLD}33` }}>
          {/* Photo */}
          <div style={{ position: "relative", minHeight: 340, background: `linear-gradient(135deg, ${DNAVY} 0%, ${NAVY} 100%)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {!imgError ? (
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
                alt="Featured property"
                onError={() => setImgError(true)}
                style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", top: 0, left: 0 }}
              />
            ) : (
              <div style={{ textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
                <div style={{ fontSize: 48, marginBottom: 8 }}>🏠</div>
                <div style={{ fontSize: 13 }}>Photo coming soon</div>
              </div>
            )}
            <div style={{ position: "absolute", top: 16, left: 16, display: "flex", gap: 8 }}>
              <span style={{ background: GOLD, color: NAVY, fontWeight: 800, fontSize: 11, padding: "4px 12px", borderRadius: 4 }}>{listing.status}</span>
              <span style={{ background: "rgba(0,0,0,0.55)", color: WHITE, fontWeight: 600, fontSize: 11, padding: "4px 12px", borderRadius: 4 }}>{listing.type}</span>
            </div>
          </div>

          {/* Details */}
          <div style={{ background: WHITE, padding: 36, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 900, color: NAVY, marginBottom: 8 }}>{listing.price}</div>
              <div style={{ fontSize: 15, color: "#6b7280", marginBottom: 20, lineHeight: 1.4 }}>{listing.address}</div>

              {/* Stats */}
              <div style={{ display: "flex", gap: 20, marginBottom: 24, paddingBottom: 24, borderBottom: `1px solid #f0f0f0` }}>
                {[
                  { icon: "🛏", val: listing.beds, label: "Beds" },
                  { icon: "🚿", val: listing.baths, label: "Baths" },
                  { icon: "🚗", val: listing.cars, label: "Cars" },
                  { icon: "📐", val: `${listing.sqm}m²`, label: "Land" },
                ].map(({ icon, val, label }) => (
                  <div key={label} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: NAVY }}>{val}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div style={{ marginBottom: 24 }}>
                {listing.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "#4b5563" }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <a href={listing.link} target="_blank" rel="noopener" style={{
                flex: 1, textAlign: "center", padding: "13px 0", background: NAVY, color: WHITE,
                fontWeight: 700, fontSize: 14, borderRadius: 8, textDecoration: "none",
              }}>View Listing →</a>
              <a href="#activate" style={{
                flex: 1, textAlign: "center", padding: "13px 0", background: GOLD, color: NAVY,
                fontWeight: 700, fontSize: 14, borderRadius: 8, textDecoration: "none",
              }}>Chat with Sarah</a>
            </div>
          </div>
        </div>

        <p style={{ textAlign: "center", color: "#9ca3af", fontSize: 12, marginTop: 14 }}>
          ✦ This listing is updated by The Boulevard Group team. <a href="#activate" style={{ color: GOLD, textDecoration: "none" }}>Activate to feature your latest property.</a>
        </p>
      </div>
    </section>
  );
}

// ─── QR Code Download ─────────────────────────────────────────────────────────
const LANDING_URL = "https://directiveos.com.au/boulevard-group";

function QRCodeSection() {
  const download = useCallback((label: string, sizePx: number) => {
    const source = document.getElementById("qr-canvas") as HTMLCanvasElement | null;
    if (!source) return;

    const out = document.createElement("canvas");
    out.width = sizePx; out.height = sizePx;
    const ctx = out.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, sizePx, sizePx);
    ctx.drawImage(source, 0, 0, sizePx, sizePx);

    const a = document.createElement("a");
    a.download = `boulevard-group-qr-${label}.png`;
    a.href = out.toDataURL("image/png");
    a.click();
  }, []);

  return (
    <section style={{ background: LGREY, padding: "72px 20px", borderTop: `1px solid ${GOLD}22` }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-block", background: `${GOLD}22`, border: `1px solid ${GOLD}55`, borderRadius: 20, padding: "4px 16px", marginBottom: 14 }}>
            <span style={{ color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>QR Code — Print Ready</span>
          </div>
          <h2 style={{ color: NAVY, fontSize: 28, fontWeight: 800, margin: "0 0 12px", fontFamily: "Georgia, serif" }}>Put Sarah on Your Signboard</h2>
          <p style={{ color: "#6b7280", fontSize: 15, maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
            Add this QR code to your for-sale signs, DL flyers, and open home materials. Buyers scan it → Sarah answers their questions 24/7.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 48, alignItems: "center", background: WHITE, borderRadius: 16, padding: 40, border: `1px solid ${GOLD}33`, boxShadow: "0 4px 24px rgba(26,36,66,0.07)" }}>
          {/* QR Code */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ background: WHITE, padding: 16, borderRadius: 12, border: `2px solid ${GOLD}44`, display: "inline-block" }}>
              <QRCodeCanvas
                id="qr-canvas"
                value={LANDING_URL}
                size={160}
                fgColor={NAVY}
                bgColor={WHITE}
                level="H"
              />
            </div>
            <div style={{ fontSize: 11, color: "#9ca3af", textAlign: "center", maxWidth: 180, lineHeight: 1.5 }}>
              Scan to visit<br /><span style={{ color: NAVY, fontWeight: 600 }}>The Boulevard Group</span><br />AI Receptionist
            </div>
          </div>

          {/* Downloads */}
          <div>
            <h3 style={{ color: NAVY, fontSize: 17, fontWeight: 700, margin: "0 0 8px" }}>Download for Print</h3>
            <p style={{ color: "#6b7280", fontSize: 13, margin: "0 0 24px", lineHeight: 1.6 }}>
              High-resolution PNG files ready for your signwriter or printer. Drop them into any design or send directly.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Signboard (Large Format)", sub: "1200 × 1200px · Corflute / A-frame / Banners", size: 1200, icon: "🪧" },
                { label: "DL Flyer (99 × 210mm)", sub: "1169 × 2480px · 300dpi · Letterbox drop / Open home", size: 1169, icon: "📄" },
                { label: "Social Media Square", sub: "1080 × 1080px · Instagram / Facebook ready", size: 1080, icon: "📱" },
              ].map(({ label, sub, size, icon }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", border: `1px solid ${GOLD}33`, borderRadius: 10, background: LGREY }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 22 }}>{icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, color: NAVY, fontSize: 14 }}>{label}</div>
                      <div style={{ fontSize: 12, color: "#9ca3af" }}>{sub}</div>
                    </div>
                  </div>
                  <button onClick={() => download(label.toLowerCase().replace(/\s+/g, "-"), size)} style={{
                    background: GOLD, color: NAVY, fontWeight: 700, fontSize: 12,
                    padding: "8px 16px", border: "none", borderRadius: 7, cursor: "pointer", whiteSpace: "nowrap",
                  }}>
                    ↓ Download
                  </button>
                </div>
              ))}
            </div>

            <p style={{ color: "#9ca3af", fontSize: 11, marginTop: 16 }}>
              QR code links to: <span style={{ color: NAVY, fontWeight: 600 }}>{LANDING_URL}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── GetStarted CTA ───────────────────────────────────────────────────────────
function GetStartedCTA() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email) { setError("Please enter your name and email."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API_BASE}/billing/checkout/prospect`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agencySlug: "boulevard-group", agencyName: "The Boulevard Group", contactName: name, email, phone }),
      });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; }
      else { setError(data.error || "Something went wrong. Please try again."); setLoading(false); }
    } catch { setError("Connection error. Please try again."); setLoading(false); }
  }

  return (
    <section id="activate" style={{ background: NAVY, padding: "80px 20px" }}>
      <div style={{ maxWidth: 620, margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: `${GOLD}22`, border: `1px solid ${GOLD}55`, borderRadius: 20, padding: "4px 16px", marginBottom: 20 }}>
          <span style={{ color: GOLD, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Activate Sarah for The Boulevard Group</span>
        </div>
        <h2 style={{ color: WHITE, fontSize: 34, fontWeight: 800, margin: "0 0 12px", lineHeight: 1.2 }}>Never Miss Another Lead</h2>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 16, margin: "0 0 40px", lineHeight: 1.7 }}>
          Sarah answers 24/7 — even when your team is at inspections or off the clock.<br />Setup fee A$1,800 · Then A$299/month. Cancel anytime.
        </p>

        <form onSubmit={handleSubmit} style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${GOLD}33`, borderRadius: 16, padding: 32 }}>
          {[
            { label: "Your Name", value: name, set: setName, type: "text", placeholder: "John Smith", req: true },
            { label: "Email Address", value: email, set: setEmail, type: "email", placeholder: "john@boulevard.com.au", req: true },
            { label: "Phone Number", value: phone, set: setPhone, type: "tel", placeholder: "04XX XXX XXX", req: false },
          ].map(({ label, value, set, type, placeholder, req }) => (
            <div key={label} style={{ marginBottom: 14, textAlign: "left" }}>
              <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{label}</label>
              <input type={type} value={value} onChange={e => set(e.target.value)} placeholder={placeholder} required={req}
                style={{ width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "12px 14px", color: WHITE, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            </div>
          ))}

          {error && <p style={{ color: "#fca5a5", fontSize: 13, marginBottom: 12 }}>{error}</p>}

          <button type="submit" disabled={loading} style={{
            width: "100%", padding: 15, background: loading ? "#555" : GOLD,
            color: NAVY, fontWeight: 800, fontSize: 15, border: "none", borderRadius: 10, cursor: loading ? "not-allowed" : "pointer", marginTop: 6,
          }}>
            {loading ? "Taking you to checkout…" : "Activate Sarah — Pay A$2,099 →"}
          </button>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 12 }}>🔒 Secured by Stripe · Card, Apple Pay, Google Pay, Klarna</p>
        </form>
      </div>
    </section>
  );
}

// ─── Main Landing Page ────────────────────────────────────────────────────────
export default function BoulevardGroupLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Buy",          href: "https://www.theboulevardgroup.com.au/buy/" },
    { label: "Sell",         href: "https://www.theboulevardgroup.com.au/sell/" },
    { label: "Lease",        href: "https://www.theboulevardgroup.com.au/lease/" },
    { label: "Manage",       href: "https://www.theboulevardgroup.com.au/manage/" },
    { label: "About Us",     href: "https://www.theboulevardgroup.com.au/about-us/" },
    { label: "Areas We Serve", href: "https://www.theboulevardgroup.com.au/areas-we-serve/" },
    { label: "Contact Us",   href: "https://www.theboulevardgroup.com.au/contact-us/" },
  ];

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", minHeight: "100vh", background: WHITE }}>

      {/* ── DEMO BANNER ── */}
      <div style={{ background: DNAVY, borderBottom: `3px solid ${GOLD}`, padding: "10px 20px", textAlign: "center", position: "relative", zIndex: 100 }}>
        <span style={{
          display: "inline-block", background: GOLD, color: NAVY,
          fontWeight: 800, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase",
          padding: "2px 10px", borderRadius: 4, marginRight: 10,
        }}>DEMO</span>
        <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 13 }}>
          This is a preview of The Boulevard Group's AI Receptionist page.{" "}
          <a href="https://directiveos.com.au" target="_blank" rel="noopener" style={{ color: GOLD, textDecoration: "none", fontWeight: 600 }}>
            Powered by Directive OS ↗
          </a>
        </span>
      </div>

      {/* ── NAV ── */}
      <nav style={{ background: NAVY, padding: "0 32px", position: "sticky", top: 0, zIndex: 99, boxShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          <a href="https://www.theboulevardgroup.com.au" target="_blank" rel="noopener">
            <BoulevardLogo size={36} />
          </a>
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            {navLinks.map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener" style={{
                color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em",
                textDecoration: "none", padding: "8px 10px", textTransform: "uppercase",
                transition: "color 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
              >{l.label}</a>
            ))}
            <a href={`tel:${PHONE.replace(/\s/g, "")}`} style={{
              marginLeft: 12, background: GOLD, color: NAVY, fontWeight: 800, fontSize: 13,
              padding: "9px 18px", borderRadius: 6, textDecoration: "none", whiteSpace: "nowrap",
            }}>{PHONE}</a>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        background: `linear-gradient(135deg, ${DNAVY} 0%, ${NAVY} 60%, #1f2f55 100%)`,
        padding: "100px 20px 80px", textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        {/* Decorative lines */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.05, backgroundImage: "repeating-linear-gradient(90deg, #fff 0, #fff 1px, transparent 1px, transparent 80px)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 780, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${GOLD}18`, border: `1px solid ${GOLD}44`, borderRadius: 20, padding: "6px 18px", marginBottom: 28 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: GOLD }} />
            <span style={{ color: GOLD, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Sarah — AI Receptionist · Available 24/7</span>
          </div>

          <h1 style={{ color: WHITE, fontSize: "clamp(32px, 5vw, 54px)", fontWeight: 800, lineHeight: 1.15, margin: "0 0 20px", fontFamily: "Georgia, serif" }}>
            Every Call Answered.<br />
            <span style={{ color: GOLD }}>Every Lead Captured.</span>
          </h1>

          <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 18, lineHeight: 1.7, margin: "0 0 40px" }}>
            The Boulevard Group never misses an enquiry — Sarah handles calls, qualifies leads, books inspections, and forwards everything to your team. Day or night.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#activate" style={{ background: GOLD, color: NAVY, fontWeight: 800, fontSize: 16, padding: "16px 36px", borderRadius: 8, textDecoration: "none" }}>
              Activate Sarah →
            </a>
            <a href={`tel:${PHONE.replace(/\s/g, "")}`} style={{ background: "rgba(255,255,255,0.1)", color: WHITE, fontWeight: 700, fontSize: 16, padding: "16px 36px", borderRadius: 8, textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)" }}>
              Try Sarah: {PHONE}
            </a>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{ background: GOLD, padding: "28px 20px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 20 }}>
          {[
            { num: "24/7", label: "Always On" },
            { num: "<10s", label: "Answer Time" },
            { num: "100%", label: "Calls Answered" },
            { num: "0",    label: "Missed Leads" },
          ].map(({ num, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 30, fontWeight: 900, color: NAVY, lineHeight: 1 }}>{num}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: `${NAVY}bb`, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED LISTING ── */}
      <FeaturedListing />

      {/* ── CHAT DEMO SECTION ── */}
      <section style={{ background: LGREY, padding: "80px 20px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ color: NAVY, fontSize: 34, fontWeight: 800, margin: "0 0 12px", fontFamily: "Georgia, serif" }}>Chat with Sarah Right Now</h2>
          <p style={{ color: "#6b7280", fontSize: 16, margin: "0 0 40px", lineHeight: 1.7 }}>
            Click the chat bubble in the bottom right — Sarah is live and ready to assist your clients 24/7.
          </p>

          {/* Mock conversation preview */}
          <div style={{ background: WHITE, borderRadius: 16, padding: 28, border: `1px solid ${GOLD}33`, textAlign: "left", boxShadow: "0 4px 24px rgba(26,36,66,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid #f0f0f0` }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: GOLD, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: NAVY, fontWeight: 800 }}>S</span>
              </div>
              <div>
                <div style={{ fontWeight: 700, color: NAVY, fontSize: 14 }}>Sarah · The Boulevard Group</div>
                <div style={{ color: "#22c55e", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} /> Online now
                </div>
              </div>
            </div>
            {[
              { role: "assistant", text: "G'day! I'm Sarah, AI receptionist for The Boulevard Group. Looking to buy, sell, or lease? How can I help?" },
              { role: "user",      text: "Hi, I'm interested in a 3-bed house in the area under $900k" },
              { role: "assistant", text: "Great taste! We've got some beautiful options in that range. Are you finance-approved, or still working on that? I can also book you in for a callback with one of our agents this week." },
            ].map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 12 }}>
                <div style={{
                  maxWidth: "78%", padding: "10px 14px", fontSize: 13, lineHeight: 1.5, borderRadius: 12,
                  background: m.role === "user" ? NAVY : LGREY,
                  color: m.role === "user" ? WHITE : "#1e1e1e",
                  borderRadius: m.role === "user" ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
                  border: m.role === "assistant" ? `1px solid ${GOLD}22` : "none",
                }}>
                  {m.role === "assistant" && <div style={{ color: GOLD, fontWeight: 700, fontSize: 11, marginBottom: 4 }}>Sarah</div>}
                  {m.text}
                </div>
              </div>
            ))}
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <span style={{ color: "#9ca3af", fontSize: 12 }}>💬 Click the chat bubble to continue the conversation →</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ background: WHITE, padding: "80px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <h2 style={{ color: NAVY, fontSize: 34, fontWeight: 800, margin: "0 0 12px", fontFamily: "Georgia, serif" }}>What Sarah Does for The Boulevard Group</h2>
            <p style={{ color: "#6b7280", fontSize: 16, maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>Handling every enquiry the moment it comes in — so your team can focus on closing deals.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {[
              { icon: "📞", title: "Answers Every Call", desc: "No voicemail. No missed leads. Sarah picks up and qualifies every caller — buyers, tenants, vendors and landlords." },
              { icon: "🏠", title: "Books Inspections", desc: "Buyers and tenants get inspection bookings confirmed on the spot — 24 hours a day, 7 days a week." },
              { icon: "📋", title: "Captures Lead Details", desc: "Name, number, email, finance status, intent — every lead is captured in full and emailed to your team instantly." },
              { icon: "💰", title: "Qualifies Vendors", desc: "Spotted a potential listing? Sarah flags it immediately and schedules a free appraisal with your agent." },
              { icon: "⚡", title: "Real-Time Alerts", desc: "Hot leads — active buyers, urgent enquiries, potential vendors — are flagged and forwarded to your phone immediately." },
              { icon: "📊", title: "Full Transcripts", desc: "Every conversation logged, tagged, and searchable from your Directive OS dashboard." },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ padding: 28, border: `1px solid ${GOLD}33`, borderRadius: 14, background: LGREY, borderTop: `3px solid ${GOLD}` }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{icon}</div>
                <h3 style={{ color: NAVY, fontSize: 16, fontWeight: 700, margin: "0 0 8px" }}>{title}</h3>
                <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICE AREAS ── */}
      <section style={{ background: LGREY, padding: "60px 20px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ color: NAVY, fontSize: 28, fontWeight: 800, margin: "0 0 12px", fontFamily: "Georgia, serif" }}>Areas We Serve</h2>
          <p style={{ color: "#6b7280", fontSize: 15, margin: "0 0 32px" }}>Sarah handles enquiries for all The Boulevard Group's service areas</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {["Castle Hill", "Bella Vista", "Norwest", "Baulkham Hills", "Winston Hills", "Seven Hills", "Kellyville", "Rouse Hill", "Acacia Gardens", "Glenwood", "Blacktown", "Stanhope Gardens"].map(suburb => (
              <span key={suburb} style={{ background: WHITE, border: `1px solid ${GOLD}55`, borderRadius: 20, padding: "6px 18px", color: NAVY, fontSize: 13, fontWeight: 600 }}>{suburb}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── QR CODE ── */}
      <QRCodeSection />

      {/* ── GET STARTED CTA ── */}
      <GetStartedCTA />

      {/* ── FOOTER ── */}
      <footer style={{ background: DNAVY, padding: "36px 20px", textAlign: "center", borderTop: `3px solid ${GOLD}44` }}>
        <BoulevardLogo size={30} />
        <div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
          {navLinks.slice(0, 4).map(l => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener" style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, textDecoration: "none" }}>{l.label}</a>
          ))}
        </div>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginTop: 20 }}>
          © 2025 The Boulevard Group · All rights reserved ·{" "}
          <a href="https://directiveos.com.au" target="_blank" rel="noopener" style={{ color: GOLD, textDecoration: "none", opacity: 0.7 }}>Powered by Directive OS</a>
        </p>
      </footer>

      {/* Chat widget */}
      <ChatWidget />
    </div>
  );
}
