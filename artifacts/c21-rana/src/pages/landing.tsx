import { useState, useRef, useEffect } from "react";

const GOLD = "#F2B838";
const BLACK = "#111111";
const DARKGOLD = "#c9921e";
const PHONE = "0410 567 777";
const API_BASE = "/api";

interface Message { role: "user" | "assistant"; content: string; }

function C21Logo({ size = 40 }: { size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: size, height: size, background: GOLD, display: "flex", alignItems: "center",
        justifyContent: "center", fontWeight: 900, fontSize: size * 0.38, color: BLACK,
        letterSpacing: -1, flexShrink: 0
      }}>21</div>
      <div>
        <div style={{ fontSize: size * 0.32, fontWeight: 700, color: GOLD, letterSpacing: 3, textTransform: "uppercase", lineHeight: 1 }}>CENTURY</div>
        <div style={{ fontSize: size * 0.18, fontWeight: 400, color: "#ccc", letterSpacing: 2, textTransform: "uppercase", lineHeight: 1.2 }}>The Rana Group</div>
      </div>
    </div>
  );
}

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "G'day! I'm Sarah, the AI receptionist for Century 21 The Rana Group. Looking to buy, sell, or rent in Seven Hills or surrounds? I'm available 24/7 — how can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionId = useRef(crypto.randomUUID());

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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
      setMessages(p => [...p, { role: "assistant", content: data.message || data.reply || `Please call us directly on ${PHONE} and the team will assist you.` }]);
    } catch {
      setMessages(p => [...p, { role: "assistant", content: `Sorry about that! Please call us on ${PHONE} and we'll sort you out.` }]);
    }
    setLoading(false);
  }

  return (
    <>
      {open && (
        <div style={{
          position: "fixed", bottom: 90, right: 24, width: 360, height: 500,
          background: "#1a1a1a", borderRadius: 4, boxShadow: `0 8px 40px rgba(0,0,0,0.6)`,
          border: `2px solid ${GOLD}`, display: "flex", flexDirection: "column", zIndex: 9999, overflow: "hidden"
        }}>
          <div style={{ background: GOLD, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: BLACK, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, color: GOLD, flexShrink: 0 }}>21</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: BLACK }}>Sarah — AI Receptionist</div>
              <div style={{ fontSize: 11, color: "#333" }}>Century 21 The Rana Group · Always available</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ marginLeft: "auto", background: "none", border: "none", color: BLACK, fontSize: 22, cursor: "pointer", fontWeight: 700 }}>×</button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "82%", padding: "10px 14px",
                  borderRadius: m.role === "user" ? "4px 4px 0 4px" : "4px 4px 4px 0",
                  background: m.role === "user" ? GOLD : "rgba(255,255,255,0.08)",
                  color: m.role === "user" ? BLACK : "#fff",
                  fontSize: 13, lineHeight: 1.5, fontWeight: m.role === "user" ? 600 : 400
                }}>{m.content}</div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex" }}>
                <div style={{ padding: "10px 14px", background: "rgba(255,255,255,0.08)", borderRadius: "4px 4px 4px 0", fontSize: 13, color: GOLD }}>Sarah is typing…</div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div style={{ padding: "10px 14px", borderTop: `1px solid rgba(242,184,56,0.2)`, display: "flex", gap: 8 }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Type a message…"
              style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: `1px solid rgba(242,184,56,0.3)`, borderRadius: 2, padding: "9px 14px", color: "#fff", fontSize: 13, outline: "none" }}
            />
            <button onClick={send} disabled={loading || !input.trim()} style={{
              width: 38, height: 38, background: GOLD, border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              opacity: loading || !input.trim() ? 0.5 : 1, fontSize: 16, color: BLACK, fontWeight: 700
            }}>➤</button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(p => !p)} style={{
        position: "fixed", bottom: 24, right: 24, width: 60, height: 60,
        background: GOLD, border: "none", cursor: "pointer",
        boxShadow: `0 4px 20px rgba(242,184,56,0.5)`,
        fontSize: 26, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
        animation: "goldpulse 2.5s infinite"
      }}>💬</button>
      <style>{`@keyframes goldpulse { 0%,100%{box-shadow:0 4px 20px rgba(242,184,56,0.5)} 50%{box-shadow:0 4px 32px rgba(242,184,56,0.85)} }`}</style>
    </>
  );
}

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: BLACK, color: "#fff" }}>

      {/* NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100, background: `${BLACK}f0`, backdropFilter: "blur(12px)",
        borderBottom: `2px solid ${GOLD}`, padding: "0 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: 72
      }}>
        <C21Logo size={40} />
        <div style={{ display: "flex", gap: 32, fontSize: 14 }}>
          {[
            { label: "Buy",      url: "https://theranagroup.century21.com.au/buy/" },
            { label: "Sell",     url: "https://theranagroup.century21.com.au/sell/" },
            { label: "Rent",     url: "https://theranagroup.century21.com.au/rent/" },
            { label: "About Us", url: "https://theranagroup.century21.com.au/about-us/" },
          ].map(l => (
            <a key={l.label} href={l.url} target="_blank" rel="noreferrer" style={{ color: "#aaa", textDecoration: "none", fontWeight: 500 }}
              onMouseOver={e => (e.currentTarget.style.color = GOLD)}
              onMouseOut={e => (e.currentTarget.style.color = "#aaa")}>{l.label}</a>
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
        padding: "110px 32px 90px", textAlign: "center",
        borderBottom: `1px solid rgba(242,184,56,0.15)`
      }}>
        {/* Gold diagonal accent */}
        <div style={{ position: "absolute", top: 0, right: 0, width: 400, height: "100%", background: `linear-gradient(135deg, transparent 60%, ${GOLD}10)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: 780, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-block", background: `${GOLD}22`, border: `1px solid ${GOLD}66`, color: GOLD, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 28, letterSpacing: 2, textTransform: "uppercase" }}>
            AI Receptionist · 24 / 7
          </div>
          <h1 style={{ fontSize: "clamp(34px, 5.5vw, 60px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 22, letterSpacing: -1 }}>
            Never Miss Another<br />
            <span style={{ color: GOLD }}>Property Enquiry.</span>
          </h1>
          <p style={{ fontSize: 18, color: "#999", lineHeight: 1.75, marginBottom: 44, maxWidth: 580, margin: "0 auto 44px" }}>
            Century 21 The Rana Group's AI receptionist Sarah answers every call, books inspections, and captures leads across Seven Hills, Blacktown, Toongabbie and Pendle Hill — day and night.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={`tel:${PHONE.replace(/\s/g, "")}`} style={{
              background: GOLD, color: BLACK, padding: "15px 36px",
              textDecoration: "none", fontSize: 16, fontWeight: 800, boxShadow: `0 4px 24px ${GOLD}44`, letterSpacing: 0.5
            }}>📞 Call {PHONE}</a>
            <button onClick={() => document.getElementById("chat-demo")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                background: "transparent", border: `2px solid ${GOLD}`, color: GOLD,
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
            { val: "0", label: "Missed Leads" },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 34, fontWeight: 900, color: BLACK }}>{s.val}</div>
              <div style={{ fontSize: 12, color: "#333", marginTop: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CHAT DEMO */}
      <section id="chat-demo" style={{ padding: "88px 32px", textAlign: "center", background: "#161616" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Talk to Sarah — Right Now</h2>
          <p style={{ color: "#888", marginBottom: 44 }}>Ask about a listing, book an inspection, or get an appraisal. Sarah handles it all instantly.</p>
          <div style={{ background: "#1a1a1a", border: `2px solid ${GOLD}`, overflow: "hidden" }}>
            <div style={{ background: GOLD, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, background: BLACK, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 16, color: GOLD, flexShrink: 0 }}>21</div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 800, color: BLACK, fontSize: 15 }}>Sarah · Century 21 The Rana Group</div>
                <div style={{ fontSize: 12, color: "#333" }}>● Online now — always available</div>
              </div>
            </div>
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ alignSelf: "flex-start", maxWidth: "80%", background: "rgba(255,255,255,0.06)", padding: "12px 16px", borderRadius: "0 4px 4px 4px", fontSize: 14, lineHeight: 1.6, textAlign: "left" }}>
                G'day! I'm Sarah, the AI receptionist for Century 21 The Rana Group. Looking to buy, sell, or rent in Seven Hills or the surrounding area? What can I help with?
              </div>
              <div style={{ alignSelf: "flex-end", background: GOLD, color: BLACK, padding: "12px 16px", borderRadius: "4px 4px 0 4px", fontSize: 14, lineHeight: 1.6, fontWeight: 600 }}>
                What's the rental market like in Blacktown at the moment?
              </div>
              <div style={{ alignSelf: "flex-start", maxWidth: "80%", background: "rgba(255,255,255,0.06)", padding: "12px 16px", borderRadius: "0 4px 4px 4px", fontSize: 14, lineHeight: 1.6, textAlign: "left" }}>
                Great question! The Blacktown rental market is quite active right now — vacancy rates are tight and well-presented properties are moving quickly. Would you like me to connect you with one of our property managers, or are you thinking of listing a rental?
              </div>
            </div>
            <div style={{ padding: "12px 16px", borderTop: `1px solid rgba(242,184,56,0.2)`, display: "flex", gap: 10 }}>
              <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: `1px solid rgba(242,184,56,0.2)`, padding: "10px 16px", fontSize: 13, color: "#444" }}>Type a message…</div>
              <div style={{ width: 38, height: 38, background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: BLACK, fontWeight: 700 }}>➤</div>
            </div>
          </div>
          <p style={{ marginTop: 20, fontSize: 13, color: "#555" }}>💬 Use the chat button bottom-right to talk to Sarah live</p>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "88px 32px", background: BLACK }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: 800, marginBottom: 12 }}>What Sarah Does for The Rana Group</h2>
          <div style={{ width: 60, height: 3, background: GOLD, margin: "0 auto 52px" }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 2 }}>
            {[
              { icon: "📞", title: "Answers Every Call", desc: "No missed calls, no voicemail black holes. Sarah picks up instantly — 24/7, 365 days a year." },
              { icon: "🏠", title: "Books Inspections", desc: "Buyers book inspections directly through Sarah. Your agents get instant notifications and full details." },
              { icon: "📋", title: "Captures Every Lead", desc: "Name, number, email, intent — all captured automatically and sent straight to the team." },
              { icon: "💼", title: "Qualifies Buyers", desc: "Finance ready? Investor or owner-occupier? Sarah asks the right questions so your agents know who to call first." },
              { icon: "🏷️", title: "Appraisal Requests", desc: "Vendors asking about selling? Sarah books a complimentary appraisal on the spot." },
              { icon: "📊", title: "Real-Time Dashboard", desc: "Every lead, call, and enquiry tracked in a live dashboard — full visibility for your whole team." },
            ].map((f, i) => (
              <div key={f.title} style={{
                background: i % 2 === 0 ? "#161616" : "#1a1a1a",
                borderLeft: `3px solid ${GOLD}`, padding: 32,
                transition: "background 0.2s"
              }}
                onMouseOver={e => (e.currentTarget.style.background = "#222")}
                onMouseOut={e => (e.currentTarget.style.background = i % 2 === 0 ? "#161616" : "#1a1a1a")}>
                <div style={{ fontSize: 30, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, color: "#fff" }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "#777", lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE AREAS */}
      <section style={{ padding: "64px 32px", background: "#161616", borderTop: `1px solid rgba(242,184,56,0.15)` }}>
        <div style={{ maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Our Service Areas</h2>
          <p style={{ color: "#777", marginBottom: 36, fontSize: 15 }}>Trusted by buyers, sellers, investors and tenants across Western Sydney</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            {["Seven Hills", "Blacktown", "Toongabbie", "Pendle Hill", "Girraween", "Wentworthville", "Westmead", "Parramatta", "Baulkham Hills", "Old Toongabbie"].map(suburb => (
              <div key={suburb} style={{
                border: `1px solid ${GOLD}44`, padding: "8px 20px", fontSize: 14, color: "#ccc",
                background: "rgba(242,184,56,0.04)", fontWeight: 500
              }}>{suburb}</div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "88px 32px", textAlign: "center", background: GOLD }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: BLACK, marginBottom: 16, letterSpacing: -0.5 }}>Ready to Buy, Sell or Rent?</h2>
          <p style={{ color: "#444", fontSize: 16, marginBottom: 40, lineHeight: 1.7 }}>
            Our AI receptionist Sarah is standing by 24/7. Call now or chat below — someone is always available to help.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={`tel:${PHONE.replace(/\s/g, "")}`} style={{
              background: BLACK, color: GOLD, padding: "16px 40px",
              textDecoration: "none", fontSize: 16, fontWeight: 800, letterSpacing: 0.5,
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
            }}>📞 {PHONE}</a>
            <a href="https://theranagroup.century21.com.au/contact" target="_blank" rel="noreferrer" style={{
              background: "transparent", border: `2px solid ${BLACK}`, color: BLACK,
              padding: "16px 40px", textDecoration: "none", fontSize: 16, fontWeight: 700
            }}>Request an Appraisal</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "40px 32px", borderTop: `2px solid ${GOLD}`, background: "#0d0d0d" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center", justifyContent: "space-between" }}>
          <C21Logo size={32} />
          <div style={{ fontSize: 13, color: "#555", textAlign: "center" }}>
            Seven Hills · Blacktown · Toongabbie · Pendle Hill<br />
            Licensed Real Estate Agency · NSW
          </div>
          <div style={{ fontSize: 12, color: "#444", textAlign: "right" }}>
            AI Receptionist powered by<br />
            <span style={{ color: "#00d1b2", fontWeight: 700 }}>Directive OS</span>
          </div>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
}
