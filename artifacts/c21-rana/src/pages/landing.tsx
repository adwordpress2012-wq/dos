import { useState, useRef, useEffect, useCallback } from "react";

const GOLD = "#F2B838";
const BLACK = "#111111";
const PHONE = "0410 567 777";
const API_BASE = "/api";
const AGENCY_ID = 1;

interface Listing {
  id: number;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  price: string;
  listingType: string;
  bedrooms: number;
  bathrooms: number;
  carSpaces?: number | null;
  agentName?: string | null;
  inspectionTimes?: string[] | null;
  photoUrl?: string | null;
  status: string;
  auctionDate?: string | null;
  auctionTime?: string | null;
}

function PropertyListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filter, setFilter] = useState<"all" | "sale" | "rental">("all");
  const [loading, setLoading] = useState(true);

  const fetchListings = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/public/listings?agencyId=${AGENCY_ID}`);
      if (res.ok) {
        const data = await res.json();
        setListings(Array.isArray(data) ? data : []);
      }
    } catch {
      setListings([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { void fetchListings(); }, [fetchListings]);

  const visible = listings.filter(l => {
    if (filter === "sale") return l.listingType === "sale";
    if (filter === "rental") return l.listingType === "rental";
    return true;
  });

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: "8px 22px", fontSize: 13, fontWeight: 700, cursor: "pointer",
    border: active ? "none" : `1px solid ${GOLD}`,
    borderRadius: 0, transition: "all 0.2s",
    background: active ? BLACK : "transparent",
    color: active ? GOLD : BLACK,
    letterSpacing: 0.5,
  });

  return (
    <section style={{ padding: "80px 32px", background: "#fff", borderTop: "1px solid #e8e8e8" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-block", border: `2px solid ${GOLD}`, padding: "4px 20px", fontSize: 12, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: BLACK, marginBottom: 16 }}>
            Current Listings
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: BLACK, marginBottom: 8 }}>Properties Available Now</h2>
          <div style={{ width: 60, height: 3, background: GOLD, margin: "0 auto 24px" }} />
          <p style={{ color: "#666", fontSize: 15, marginBottom: 28 }}>Browse our latest sales and rentals across Seven Hills and Western Sydney</p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {(["all", "sale", "rental"] as const).map(f => (
              <button key={f} style={tabStyle(filter === f)} onClick={() => setFilter(f)}>
                {f === "all" ? "All Listings" : f === "sale" ? "For Sale" : "For Rent"}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ background: "#f5f5f5", overflow: "hidden", border: "1px solid #e8e8e8" }}>
                <div style={{ height: 200, background: "#e8e8e8", animation: "pulse 1.5s infinite" }} />
                <div style={{ padding: 20 }}>
                  <div style={{ height: 16, background: "#e8e8e8", borderRadius: 2, marginBottom: 10, width: "70%", animation: "pulse 1.5s infinite" }} />
                  <div style={{ height: 12, background: "#f0f0f0", borderRadius: 2, width: "50%", animation: "pulse 1.5s infinite" }} />
                </div>
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 24px", color: "#aaa" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏡</div>
            <p style={{ fontSize: 16, color: "#666" }}>No listings currently available. Check back soon or call us on <a href={`tel:${PHONE.replace(/\s/g,"")}`} style={{ color: BLACK, fontWeight: 700 }}>{PHONE}</a></p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
            {visible.map(l => (
              <div key={l.id} style={{
                background: "#fff", border: "1px solid #e8e8e8",
                overflow: "hidden", transition: "box-shadow 0.2s, transform 0.2s",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              }}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 24px rgba(0,0,0,0.12)`; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                onMouseOut={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)"; (e.currentTarget as HTMLElement).style.transform = "none"; }}>
                <div style={{ position: "relative", height: 210, overflow: "hidden", background: "#f5f5f5" }}>
                  {l.photoUrl ? (
                    <img src={l.photoUrl} alt={l.address} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>🏠</div>
                  )}
                  <div style={{
                    position: "absolute", top: 12, left: 12,
                    background: l.listingType === "rental" ? BLACK : GOLD,
                    color: l.listingType === "rental" ? GOLD : BLACK,
                    fontSize: 11, fontWeight: 800, padding: "4px 12px",
                    letterSpacing: 0.5, textTransform: "uppercase"
                  }}>
                    {l.listingType === "rental" ? "For Rent" : "For Sale"}
                  </div>
                  {l.auctionDate && (
                    <div style={{ position: "absolute", top: 12, right: 12, background: "#e53e3e", color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 10px", textTransform: "uppercase" }}>
                      Auction {l.auctionDate}
                    </div>
                  )}
                </div>
                <div style={{ padding: "18px 20px 20px" }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: BLACK, marginBottom: 4 }}>{l.price}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: BLACK, marginBottom: 2 }}>{l.address}</div>
                  <div style={{ fontSize: 13, color: "#888", marginBottom: 14 }}>{l.suburb} {l.state} {l.postcode}</div>
                  <div style={{ display: "flex", gap: 16, marginBottom: 14, fontSize: 13, color: "#555", borderTop: `2px solid ${GOLD}`, paddingTop: 12 }}>
                    <span>🛏 {l.bedrooms} bed</span>
                    <span>🚿 {l.bathrooms} bath</span>
                    {l.carSpaces ? <span>🚗 {l.carSpaces} car</span> : null}
                  </div>
                  {l.inspectionTimes && l.inspectionTimes.length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Inspections</div>
                      {l.inspectionTimes.slice(0, 2).map((t, i) => (
                        <div key={i} style={{ fontSize: 12, color: "#555", padding: "4px 10px", background: `${GOLD}15`, borderLeft: `2px solid ${GOLD}`, marginBottom: 4 }}>📅 {t}</div>
                      ))}
                    </div>
                  )}
                  {l.agentName && (
                    <div style={{ fontSize: 12, color: "#aaa", marginBottom: 14 }}>
                      Agent: <span style={{ color: "#666", fontWeight: 600 }}>{l.agentName}</span>
                    </div>
                  )}
                  <button
                    onClick={() => document.querySelector<HTMLElement>("[data-chat-trigger]")?.click()}
                    style={{
                      width: "100%", background: BLACK, color: GOLD,
                      border: "none", padding: "11px 0", fontSize: 14,
                      fontWeight: 800, cursor: "pointer", letterSpacing: 0.5
                    }}>
                    Enquire with Sarah →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </section>
  );
}

interface Message { role: "user" | "assistant"; content: string; }

function C21Logo({ size = 40, dark = false }: { size?: number; dark?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: size, height: size, background: GOLD, display: "flex", alignItems: "center",
        justifyContent: "center", fontWeight: 900, fontSize: size * 0.38, color: BLACK,
        letterSpacing: -1, flexShrink: 0
      }}>21</div>
      <div>
        <div style={{ fontSize: size * 0.32, fontWeight: 700, color: GOLD, letterSpacing: 3, textTransform: "uppercase", lineHeight: 1 }}>CENTURY</div>
        <div style={{ fontSize: size * 0.18, fontWeight: 500, color: dark ? "#888" : "#555", letterSpacing: 2, textTransform: "uppercase", lineHeight: 1.3 }}>The Rana Group</div>
      </div>
    </div>
  );
}

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "G'day! I'm Sarah, the AI receptionist for Century 21 The Rana Group. Looking to buy, sell, or rent in Seven Hills or surrounds? I'm available 24/7 — how can I help?" }
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
    setInput("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionId.current, message: text, agencyId: 1 }),
      });
      const data = await res.json();
      setMessages(p => [...p, { role: "assistant", content: data.message || data.reply || `Please call us on ${PHONE}.` }]);
    } catch {
      setMessages(p => [...p, { role: "assistant", content: `Sorry! Please call us on ${PHONE}.` }]);
    }
    setLoading(false);
  }

  return (
    <>
      {open && (
        <div style={{
          position: "fixed", bottom: 90, right: 24, width: 360, height: 500,
          background: "#fff", borderRadius: 4, boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
          border: `2px solid ${GOLD}`, display: "flex", flexDirection: "column", zIndex: 9999, overflow: "hidden"
        }}>
          <div style={{ background: GOLD, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: BLACK, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, color: GOLD, flexShrink: 0 }}>21</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: BLACK }}>Sarah — AI Receptionist</div>
              <div style={{ fontSize: 11, color: "#333" }}>Century 21 The Rana Group · Always available</div>
              <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
                {[["🇦🇺","EN"],["🇨🇳","中文"],["🇵🇭","FIL"],["🇷🇺","РУС"],["🇸🇦","عربي"],["🇰🇷","한국어"],["🇻🇳","Việt"],["🇮🇳","हिंदी"],["🇪🇸","ESP"]].map(([flag, lang]) => (
                  <span key={lang} style={{ fontSize: 9, background: "rgba(0,0,0,0.1)", border: "1px solid rgba(0,0,0,0.2)", color: "#333", borderRadius: 4, padding: "1px 5px", fontWeight: 700, letterSpacing: 0.3, whiteSpace: "nowrap" }}>{flag} {lang}</span>
                ))}
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ marginLeft: "auto", background: "none", border: "none", color: BLACK, fontSize: 22, cursor: "pointer", fontWeight: 700 }}>×</button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10, background: "#fafafa" }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "82%", padding: "10px 14px",
                  borderRadius: m.role === "user" ? "4px 4px 0 4px" : "4px 4px 4px 0",
                  background: m.role === "user" ? GOLD : "#fff",
                  color: BLACK, border: m.role === "assistant" ? "1px solid #e5e5e5" : "none",
                  fontSize: 13, lineHeight: 1.5, fontWeight: m.role === "user" ? 600 : 400
                }}>{m.content}</div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex" }}>
                <div style={{ padding: "10px 14px", background: "#fff", border: "1px solid #e5e5e5", borderRadius: "4px 4px 4px 0", fontSize: 13, color: "#888" }}>Sarah is typing…</div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div style={{ padding: "10px 14px", borderTop: "1px solid #e5e5e5", display: "flex", gap: 8, background: "#fff" }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Type a message…"
              style={{ flex: 1, background: "#f5f5f5", border: "1px solid #ddd", borderRadius: 2, padding: "9px 14px", color: BLACK, fontSize: 13, outline: "none" }}
            />
            <button onClick={send} disabled={loading || !input.trim()} style={{
              width: 38, height: 38, background: GOLD, border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              opacity: loading || !input.trim() ? 0.5 : 1, fontSize: 16, color: BLACK, fontWeight: 700
            }}>➤</button>
          </div>
        </div>
      )}
      <button data-chat-trigger onClick={() => setOpen(p => !p)} style={{
        position: "fixed", bottom: 24, right: 24, width: 60, height: 60,
        background: GOLD, border: "none", cursor: "pointer",
        boxShadow: "0 4px 20px rgba(242,184,56,0.5)",
        fontSize: 26, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
        animation: "goldpulse 2.5s infinite"
      }}>💬</button>
      <style>{`@keyframes goldpulse { 0%,100%{box-shadow:0 4px 20px rgba(242,184,56,0.5)} 50%{box-shadow:0 4px 32px rgba(242,184,56,0.85)} }`}</style>
    </>
  );
}

interface GetStartedProps {
  agencySlug: string; agencyName: string; accentColor: string;
  textColor: string; bgColor: string; dark?: boolean;
}
function GetStartedCTA({ agencySlug, agencyName, accentColor, textColor, bgColor, dark }: GetStartedProps) {
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agencySlug, agencyName, contactName: name, email, phone }),
      });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; }
      else { setError(data.error || "Something went wrong. Please try again."); setLoading(false); }
    } catch { setError("Connection error. Please try again."); setLoading(false); }
  }

  const inputStyle: React.CSSProperties = {
    flex: 1, minWidth: 160, padding: "11px 14px", fontSize: 14,
    background: dark ? "rgba(255,255,255,0.06)" : "#f5f5f5",
    border: `1px solid ${dark ? "rgba(255,255,255,0.15)" : "#ddd"}`,
    color: dark ? "#fff" : "#111", outline: "none", borderRadius: 0,
  };

  return (
    <section style={{ padding: "64px 32px", background: bgColor, borderTop: `2px solid ${accentColor}` }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "inline-block", background: `${accentColor}22`, border: `1px solid ${accentColor}66`, color: dark ? accentColor : "#7a5a00", padding: "4px 16px", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>
            Activate Your AI Receptionist
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: textColor, marginBottom: 10 }}>Get Started with Sarah Today</h2>
          <p style={{ color: dark ? "#888" : "#666", fontSize: 15, lineHeight: 1.6 }}>
            A$1,800 setup · A$299/month · Dedicated phone line · Custom-trained for your agency
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
            <input style={inputStyle} placeholder="Your Name *" value={name} onChange={e => setName(e.target.value)} required />
            <input style={inputStyle} type="email" placeholder="Email Address *" value={email} onChange={e => setEmail(e.target.value)} required />
            <input style={inputStyle} type="tel" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          {error && <p style={{ color: "#f87171", fontSize: 13, marginBottom: 10 }}>{error}</p>}
          <div style={{ textAlign: "center" }}>
            <button type="submit" disabled={loading} style={{
              background: accentColor, color: dark ? "#fff" : "#111",
              padding: "14px 48px", fontSize: 16, fontWeight: 800, border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1, letterSpacing: 0.5,
              boxShadow: `0 4px 20px ${accentColor}44`
            }}>
              {loading ? "Redirecting to payment…" : "Activate Sarah — Pay $1,800 Setup Fee →"}
            </button>
            <p style={{ fontSize: 12, color: dark ? "#555" : "#999", marginTop: 10 }}>
              Secure payment via Stripe · Card, Apple Pay, Google Pay · No lock-in contract
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: BLACK }}>

      {/* DEMO WATERMARK BANNER */}
      <div style={{
        background: "#1a1a1a", color: "#ccc", textAlign: "center",
        padding: "9px 16px", fontSize: 12, fontWeight: 500, letterSpacing: 0.5,
        borderBottom: `2px solid ${GOLD}`, position: "relative", zIndex: 200
      }}>
        <span style={{ background: GOLD, color: BLACK, padding: "2px 8px", fontWeight: 800, fontSize: 11, marginRight: 10, letterSpacing: 1 }}>DEMO</span>
        This page is a live preview — dedicated phone line setup pending. Contact{" "}
        <a href="https://directiveos.com.au" target="_blank" rel="noreferrer" style={{ color: GOLD, fontWeight: 700, textDecoration: "none" }}>Directive OS</a>
        {" "}to activate your official AI receptionist.
      </div>

      {/* NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100, background: "#fffffff5", backdropFilter: "blur(12px)",
        borderBottom: `3px solid ${GOLD}`, padding: "0 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: 72,
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)"
      }}>
        <C21Logo size={40} />
        <div style={{ display: "flex", gap: 32, fontSize: 14 }}>
          {[
            { label: "Buy",      url: "https://theranagroup.century21.com.au/local-properties-for-sale?searchtype=sale" },
            { label: "Sell",     url: "https://theranagroup.century21.com.au/sell/" },
            { label: "Rent",     url: "https://theranagroup.century21.com.au/local-properties-for-sale?searchtype=rent" },
            { label: "About Us", url: "https://theranagroup.century21.com.au/about-us/" },
          ].map(l => (
            <a key={l.label} href={l.url} target="_blank" rel="noreferrer"
              style={{ color: "#555", textDecoration: "none", fontWeight: 500 }}
              onMouseOver={e => (e.currentTarget.style.color = BLACK)}
              onMouseOut={e => (e.currentTarget.style.color = "#555")}>{l.label}</a>
          ))}
        </div>
        <a href={`tel:${PHONE.replace(/\s/g, "")}`} style={{
          background: GOLD, color: BLACK, padding: "10px 22px",
          textDecoration: "none", fontSize: 14, fontWeight: 800, letterSpacing: 0.5
        }}>📞 {PHONE}</a>
      </nav>

      {/* HERO */}
      <section style={{
        position: "relative", overflow: "hidden",
        padding: "100px 32px 80px", textAlign: "center",
        background: "#fff", borderBottom: `1px solid #e8e8e8`
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: GOLD }} />
        <div style={{ maxWidth: 780, margin: "0 auto", position: "relative" }}>
          <div style={{
            display: "inline-block", background: `${GOLD}22`, border: `1px solid ${GOLD}`,
            color: "#7a5a00", padding: "6px 18px", fontSize: 13, fontWeight: 700,
            marginBottom: 28, letterSpacing: 2, textTransform: "uppercase"
          }}>
            AI Receptionist · 24 / 7
          </div>
          <h1 style={{ fontSize: "clamp(34px, 5.5vw, 60px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 22, letterSpacing: -1, color: BLACK }}>
            Never Miss Another<br />
            <span style={{ color: GOLD }}>Property Enquiry.</span>
          </h1>
          <p style={{ fontSize: 18, color: "#555", lineHeight: 1.75, marginBottom: 44, maxWidth: 580, margin: "0 auto 44px" }}>
            Century 21 The Rana Group's AI receptionist Sarah answers every call, books inspections, and captures leads across Seven Hills, Blacktown, Toongabbie and Pendle Hill — day and night.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={`tel:${PHONE.replace(/\s/g, "")}`} style={{
              background: GOLD, color: BLACK, padding: "15px 36px",
              textDecoration: "none", fontSize: 16, fontWeight: 800,
              boxShadow: `0 4px 20px ${GOLD}66`, letterSpacing: 0.5
            }}>📞 Call {PHONE}</a>
            <button onClick={() => document.getElementById("chat-demo")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                background: "transparent", border: `2px solid ${BLACK}`, color: BLACK,
                padding: "15px 36px", fontSize: 16, fontWeight: 700, cursor: "pointer", letterSpacing: 0.5
              }}>Chat with Sarah ↓</button>
          </div>
        </div>
      </section>

      {/* GOLD STATS BAR */}
      <section style={{ background: GOLD, padding: "36px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 24, textAlign: "center" }}>
          {[
            { val: "24/7", label: "Always Answering" },
            { val: "< 2s", label: "Response Time" },
            { val: "100%", label: "Calls Captured" },
            { val: "0",    label: "Missed Leads" },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 34, fontWeight: 900, color: BLACK }}>{s.val}</div>
              <div style={{ fontSize: 12, color: "#333", marginTop: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CHAT DEMO */}
      <section id="chat-demo" style={{ padding: "88px 32px", textAlign: "center", background: "#f7f7f7" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12, color: BLACK }}>Talk to Sarah — Right Now</h2>
          <p style={{ color: "#666", marginBottom: 44 }}>Ask about a listing, book an inspection, or get an appraisal. Sarah handles it all instantly.</p>
          <div style={{ background: "#fff", border: `2px solid ${GOLD}`, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
            <div style={{ background: GOLD, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, background: BLACK, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 16, color: GOLD, flexShrink: 0 }}>21</div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 800, color: BLACK, fontSize: 15 }}>Sarah · Century 21 The Rana Group</div>
                <div style={{ fontSize: 12, color: "#333" }}>● Online now — always available</div>
              </div>
            </div>
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12, background: "#fafafa" }}>
              <div style={{ alignSelf: "flex-start", maxWidth: "80%", background: "#fff", border: "1px solid #e5e5e5", padding: "12px 16px", borderRadius: "0 4px 4px 4px", fontSize: 14, lineHeight: 1.6, textAlign: "left", color: BLACK }}>
                G'day! I'm Sarah, the AI receptionist for Century 21 The Rana Group. Looking to buy, sell, or rent in Seven Hills or the surrounding area? What can I help with?
              </div>
              <div style={{ alignSelf: "flex-end", background: GOLD, color: BLACK, padding: "12px 16px", borderRadius: "4px 4px 0 4px", fontSize: 14, lineHeight: 1.6, fontWeight: 600 }}>
                What's the rental market like in Blacktown at the moment?
              </div>
              <div style={{ alignSelf: "flex-start", maxWidth: "80%", background: "#fff", border: "1px solid #e5e5e5", padding: "12px 16px", borderRadius: "0 4px 4px 4px", fontSize: 14, lineHeight: 1.6, textAlign: "left", color: BLACK }}>
                Great question! The Blacktown rental market is quite active — vacancy rates are tight and well-presented properties are moving quickly. Would you like me to connect you with one of our property managers, or are you thinking of listing a rental?
              </div>
            </div>
            <div style={{ padding: "12px 16px", borderTop: "1px solid #e5e5e5", display: "flex", gap: 10, background: "#fff" }}>
              <div style={{ flex: 1, background: "#f5f5f5", border: "1px solid #ddd", padding: "10px 16px", fontSize: 13, color: "#aaa" }}>Type a message…</div>
              <div style={{ width: 38, height: 38, background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: BLACK, fontWeight: 700 }}>➤</div>
            </div>
          </div>
          <p style={{ marginTop: 20, fontSize: 13, color: "#999" }}>💬 Use the chat button bottom-right to talk to Sarah live</p>
        </div>
      </section>

      {/* TRY SARAH BY PHONE */}
      <section style={{ padding: "48px 32px", background: "#fff", borderTop: `1px solid #e8e8e8`, borderBottom: `1px solid #e8e8e8` }}>
        <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 24, justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e", animation: "blink 1.5s infinite" }} />
              <span style={{ fontSize: 13, color: "#22c55e", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Sarah is live now</span>
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6, color: BLACK }}>Want to hear Sarah's voice?</h3>
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>Call the demo line and experience exactly what your callers will hear — 24/7, no scripts, no hold music.</p>
          </div>
          <a href="tel:0258504038" style={{
            background: BLACK, color: GOLD, padding: "16px 32px",
            textDecoration: "none", fontSize: 18, fontWeight: 900, letterSpacing: 0.5,
            whiteSpace: "nowrap", flexShrink: 0
          }}>📞 02 5850 4038</a>
        </div>
        <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "88px 32px", background: "#f7f7f7" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: 800, marginBottom: 12, color: BLACK }}>What Sarah Does for The Rana Group</h2>
          <div style={{ width: 60, height: 3, background: GOLD, margin: "0 auto 52px" }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 2 }}>
            {[
              { icon: "📞", title: "Answers Every Call", desc: "No missed calls, no voicemail. Sarah picks up instantly — 24/7, 365 days a year." },
              { icon: "🏠", title: "Books Inspections", desc: "Buyers book inspections through Sarah. Your agents get instant notifications with full details." },
              { icon: "📋", title: "Captures Every Lead", desc: "Name, number, email, intent — all captured automatically and sent to the team." },
              { icon: "💼", title: "Qualifies Buyers", desc: "Finance ready? Investor or owner-occupier? Sarah asks the right questions so agents know who to prioritise." },
              { icon: "🏷️", title: "Appraisal Requests", desc: "Vendors asking about selling? Sarah books a complimentary appraisal on the spot." },
              { icon: "📊", title: "Real-Time Dashboard", desc: "Every lead, call, and enquiry tracked live — full visibility for your whole team." },
            ].map((f, i) => (
              <div key={f.title} style={{
                background: i % 2 === 0 ? "#fff" : "#fafafa",
                borderLeft: `3px solid ${GOLD}`, padding: 32,
                transition: "background 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.05)"
              }}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = `${GOLD}10`; }}
                onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? "#fff" : "#fafafa"; }}>
                <div style={{ fontSize: 30, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, color: BLACK }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE AREAS */}
      <section style={{ padding: "64px 32px", background: "#fff", borderTop: "1px solid #e8e8e8" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: BLACK }}>Our Service Areas</h2>
          <p style={{ color: "#888", marginBottom: 36, fontSize: 15 }}>Trusted by buyers, sellers, investors and tenants across Western Sydney</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {["Seven Hills", "Blacktown", "Toongabbie", "Pendle Hill", "Girraween", "Wentworthville", "Westmead", "Parramatta", "Baulkham Hills", "Old Toongabbie"].map(suburb => (
              <div key={suburb} style={{
                border: `1px solid ${GOLD}`, padding: "8px 20px", fontSize: 14,
                color: BLACK, background: `${GOLD}10`, fontWeight: 500
              }}>{suburb}</div>
            ))}
          </div>
        </div>
      </section>

      {/* LISTINGS */}
      <PropertyListings />

      {/* CTA */}
      <section style={{ padding: "88px 32px", textAlign: "center", background: GOLD }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: BLACK, marginBottom: 16, letterSpacing: -0.5 }}>Ready to Buy, Sell or Rent?</h2>
          <p style={{ color: "#333", fontSize: 16, marginBottom: 40, lineHeight: 1.7 }}>
            Our AI receptionist Sarah is standing by 24/7. Call now or chat below — someone is always available.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={`tel:${PHONE.replace(/\s/g, "")}`} style={{
              background: BLACK, color: GOLD, padding: "16px 40px",
              textDecoration: "none", fontSize: 16, fontWeight: 800, letterSpacing: 0.5
            }}>📞 {PHONE}</a>
            <a href="https://theranagroup.century21.com.au/contact" target="_blank" rel="noreferrer" style={{
              background: "transparent", border: `2px solid ${BLACK}`, color: BLACK,
              padding: "16px 40px", textDecoration: "none", fontSize: 16, fontWeight: 700
            }}>Request an Appraisal</a>
          </div>
        </div>
      </section>

      {/* GET STARTED — PAYMENT CTA */}
      <GetStartedCTA
        agencySlug="c21-rana"
        agencyName="Century 21 The Rana Group"
        accentColor={GOLD}
        textColor={BLACK}
        bgColor="#f7f7f7"
      />

      {/* FOOTER */}
      <footer style={{ padding: "40px 32px", borderTop: `3px solid ${GOLD}`, background: BLACK }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center", justifyContent: "space-between" }}>
          <C21Logo size={32} dark />
          <div style={{ fontSize: 13, color: "#777", textAlign: "center" }}>
            Seven Hills · Blacktown · Toongabbie · Pendle Hill<br />
            Licensed Real Estate Agency · NSW
          </div>
          <div style={{ fontSize: 12, color: "#555", textAlign: "right" }}>
            AI Receptionist powered by<br />
            <span style={{ color: "#00d1b2", fontWeight: 700 }}>Directive OS</span>
          </div>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
}
