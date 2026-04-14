import { useState, useRef, useEffect } from "react";

const YELLOW = "#FFE100";
const BLACK = "#1a1a1a";
const DARK_BG = "#111111";
const PHONE = "02 5850 4038";
const API_BASE = "/api";

interface Message { role: "user" | "assistant"; content: string; }

function RWLogo({ size = 40 }: { size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: size, height: size, background: YELLOW,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 900, fontSize: size * 0.42, color: BLACK, flexShrink: 0,
        clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
      }}>RW</div>
      <div>
        <div style={{ fontSize: size * 0.34, fontWeight: 900, color: YELLOW, letterSpacing: 2, textTransform: "uppercase", lineHeight: 1 }}>RAY WHITE</div>
        <div style={{ fontSize: size * 0.2, fontWeight: 600, color: "#999", letterSpacing: 1.5, textTransform: "uppercase", lineHeight: 1.3 }}>United Group · St Marys</div>
      </div>
    </div>
  );
}

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "G'day! I'm Sarah, the AI receptionist for Ray White United Group. Looking to buy, sell, or rent in St Marys and Greater Penrith? I'm available 24/7 — how can I help?" }
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
        body: JSON.stringify({ sessionId: sessionId.current, message: text, agencyName: "Ray White United Group" }),
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
          background: BLACK, borderRadius: 4, boxShadow: `0 8px 40px rgba(255,225,0,0.2)`,
          border: `2px solid ${YELLOW}`, display: "flex", flexDirection: "column", zIndex: 9999, overflow: "hidden"
        }}>
          <div style={{ background: YELLOW, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, background: BLACK, display: "flex", alignItems: "center",
              justifyContent: "center", fontWeight: 900, fontSize: 12, color: YELLOW, flexShrink: 0,
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
            }}>RW</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: BLACK }}>Sarah — AI Receptionist</div>
              <div style={{ fontSize: 11, color: "#333" }}>Ray White United Group · Always available</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ marginLeft: "auto", background: "none", border: "none", color: BLACK, fontSize: 22, cursor: "pointer", fontWeight: 700 }}>×</button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10, background: "#1a1a1a" }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "82%", padding: "10px 14px",
                  borderRadius: m.role === "user" ? "4px 4px 0 4px" : "4px 4px 4px 0",
                  background: m.role === "user" ? YELLOW : "#2a2a2a",
                  color: m.role === "user" ? BLACK : "#eee",
                  border: m.role === "assistant" ? "1px solid #333" : "none",
                  fontSize: 13, lineHeight: 1.5, fontWeight: m.role === "user" ? 600 : 400
                }}>{m.content}</div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex" }}>
                <div style={{ padding: "10px 14px", background: "#2a2a2a", border: "1px solid #333", borderRadius: "4px 4px 4px 0", fontSize: 13, color: "#888" }}>Sarah is typing…</div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div style={{ padding: "10px 14px", borderTop: "1px solid #333", display: "flex", gap: 8, background: "#222" }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Type a message…"
              style={{ flex: 1, background: "#2a2a2a", border: "1px solid #444", borderRadius: 2, padding: "9px 14px", color: "#eee", fontSize: 13, outline: "none" }}
            />
            <button onClick={send} disabled={loading || !input.trim()} style={{
              width: 38, height: 38, background: YELLOW, border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              opacity: loading || !input.trim() ? 0.5 : 1, fontSize: 16, color: BLACK, fontWeight: 700
            }}>➤</button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(p => !p)} style={{
        position: "fixed", bottom: 24, right: 24, width: 60, height: 60,
        background: YELLOW, border: "none", cursor: "pointer",
        boxShadow: "0 4px 20px rgba(255,225,0,0.5)",
        fontSize: 26, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
        animation: "rwpulse 2.5s infinite"
      }}>💬</button>
      <style>{`@keyframes rwpulse { 0%,100%{box-shadow:0 4px 20px rgba(255,225,0,0.4)} 50%{box-shadow:0 4px 36px rgba(255,225,0,0.8)} }`}</style>
    </>
  );
}

export default function RayWhiteUGPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: BLACK, fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* DEMO BANNER */}
      <div style={{
        background: DARK_BG, color: "#ccc", textAlign: "center",
        padding: "9px 16px", fontSize: 12, fontWeight: 500, letterSpacing: 0.5,
        borderBottom: `2px solid ${YELLOW}`, position: "relative", zIndex: 200
      }}>
        <span style={{ background: YELLOW, color: BLACK, padding: "2px 8px", fontWeight: 800, fontSize: 11, marginRight: 10, letterSpacing: 1 }}>DEMO</span>
        This page is a live preview — dedicated phone line setup pending. Contact{" "}
        <a href="https://directiveos.com.au" target="_blank" rel="noreferrer" style={{ color: YELLOW, fontWeight: 700, textDecoration: "none" }}>Directive OS</a>
        {" "}to activate your official AI receptionist.
      </div>

      {/* NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100, background: BLACK,
        borderBottom: `3px solid ${YELLOW}`, padding: "0 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: 72,
        boxShadow: "0 2px 20px rgba(0,0,0,0.4)"
      }}>
        <RWLogo size={38} />
        <div style={{ display: "flex", gap: 28, fontSize: 14 }}>
          {[
            { label: "Buy",      url: "https://www.raywhite.com/find-an-agent/nsw/st-marys/" },
            { label: "Sell",     url: "https://www.raywhite.com/find-an-agent/nsw/st-marys/" },
            { label: "Rent",     url: "https://www.raywhite.com/find-an-agent/nsw/st-marys/" },
            { label: "About Us", url: "https://www.raywhite.com/find-an-agent/nsw/st-marys/" },
          ].map(l => (
            <a key={l.label} href={l.url} target="_blank" rel="noreferrer"
              style={{ color: "#aaa", textDecoration: "none", fontWeight: 500 }}
              onMouseOver={e => (e.currentTarget.style.color = YELLOW)}
              onMouseOut={e => (e.currentTarget.style.color = "#aaa")}>{l.label}</a>
          ))}
        </div>
        <a href={`tel:${PHONE.replace(/\s/g, "")}`} style={{
          background: YELLOW, color: BLACK, padding: "10px 22px",
          textDecoration: "none", fontSize: 14, fontWeight: 800, letterSpacing: 0.5
        }}>📞 {PHONE}</a>
      </nav>

      {/* HERO */}
      <section style={{
        position: "relative", overflow: "hidden",
        padding: "110px 32px 90px", textAlign: "center",
        background: `linear-gradient(160deg, ${DARK_BG} 0%, #2a2200 60%, ${DARK_BG} 100%)`,
        borderBottom: `1px solid #333`
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: YELLOW }} />
        <div style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${YELLOW}18 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative" }}>
          <div style={{
            display: "inline-block", background: `${YELLOW}22`, border: `1px solid ${YELLOW}66`,
            color: YELLOW, padding: "6px 20px", fontSize: 12, fontWeight: 700,
            marginBottom: 28, letterSpacing: 3, textTransform: "uppercase"
          }}>
            AI Receptionist · Available 24/7
          </div>
          <h1 style={{ fontSize: "clamp(36px, 5.5vw, 66px)", fontWeight: 900, lineHeight: 1.05, marginBottom: 24, letterSpacing: -1.5, color: "#fff" }}>
            Never Miss Another<br />
            <span style={{ color: YELLOW }}>Property Enquiry.</span>
          </h1>
          <p style={{ fontSize: 19, color: "#bbb", lineHeight: 1.75, marginBottom: 50, maxWidth: 620, margin: "0 auto 50px" }}>
            Ray White United Group's AI receptionist Sarah answers every call, books inspections, and captures leads across St Marys, Penrith and Greater Western Sydney — day and night.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={`tel:${PHONE.replace(/\s/g, "")}`} style={{
              background: YELLOW, color: BLACK, padding: "16px 40px",
              textDecoration: "none", fontSize: 17, fontWeight: 900,
              boxShadow: `0 4px 28px ${YELLOW}55`, letterSpacing: 0.5
            }}>📞 Call {PHONE}</a>
            <button onClick={() => document.getElementById("chat-demo")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                background: "transparent", border: `2px solid ${YELLOW}66`, color: "#eee",
                padding: "16px 40px", fontSize: 17, fontWeight: 700, cursor: "pointer", letterSpacing: 0.5
              }}>Chat with Sarah ↓</button>
          </div>
        </div>
      </section>

      {/* YELLOW STATS BAR */}
      <section style={{ background: YELLOW, padding: "40px 32px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 24, textAlign: "center" }}>
          {[
            { val: "24/7", label: "Always Answering" },
            { val: "< 2s", label: "Response Time" },
            { val: "100%", label: "Calls Captured" },
            { val: "0",    label: "Missed Leads" },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 36, fontWeight: 900, color: BLACK }}>{s.val}</div>
              <div style={{ fontSize: 12, color: "#444", marginTop: 4, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CHAT DEMO */}
      <section id="chat-demo" style={{ padding: "90px 32px", textAlign: "center", background: "#f7f7f7" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{ fontSize: 34, fontWeight: 900, marginBottom: 12, color: BLACK }}>Talk to Sarah — Right Now</h2>
          <p style={{ color: "#666", marginBottom: 48, fontSize: 16 }}>Ask about a listing, book an inspection, or get an appraisal. Sarah handles it all instantly.</p>
          <div style={{ background: DARK_BG, border: `2px solid ${YELLOW}`, overflow: "hidden", boxShadow: `0 8px 40px ${YELLOW}22` }}>
            <div style={{ background: YELLOW, padding: "18px 24px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 44, height: 44, background: BLACK, display: "flex", alignItems: "center",
                justifyContent: "center", fontWeight: 900, fontSize: 14, color: YELLOW, flexShrink: 0,
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
              }}>RW</div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 900, color: BLACK, fontSize: 16 }}>Sarah · Ray White United Group</div>
                <div style={{ fontSize: 12, color: "#333" }}>● Online now — always available</div>
              </div>
            </div>
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14, background: "#1a1a1a" }}>
              <div style={{ alignSelf: "flex-start", maxWidth: "80%", background: "#2a2a2a", border: "1px solid #333", padding: "14px 18px", borderRadius: "0 4px 4px 4px", fontSize: 14, lineHeight: 1.7, textAlign: "left", color: "#eee" }}>
                G'day! I'm Sarah, the AI receptionist for Ray White United Group in St Marys. Looking to buy, sell, or rent in the Greater Penrith area? What can I help with?
              </div>
              <div style={{ alignSelf: "flex-end", background: YELLOW, color: BLACK, padding: "14px 18px", borderRadius: "4px 4px 0 4px", fontSize: 14, lineHeight: 1.7, fontWeight: 600 }}>
                What's available to buy under $750k in Kingswood?
              </div>
              <div style={{ alignSelf: "flex-start", maxWidth: "80%", background: "#2a2a2a", border: "1px solid #333", padding: "14px 18px", borderRadius: "0 4px 4px 4px", fontSize: 14, lineHeight: 1.7, textAlign: "left", color: "#eee" }}>
                Great area! Under $750k in Kingswood we typically see 3-bedroom homes and some 2-bed townhouses — it's very popular with first home buyers right now. Would you like me to book a call with one of our agents to go through what's currently listed and what's coming up?
              </div>
            </div>
            <div style={{ padding: "14px 20px", borderTop: `1px solid ${YELLOW}33`, display: "flex", gap: 10, background: "#222" }}>
              <div style={{ flex: 1, background: "#2a2a2a", border: "1px solid #444", padding: "11px 18px", fontSize: 13, color: "#555" }}>Type a message…</div>
              <div style={{ width: 42, height: 42, background: YELLOW, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: BLACK, fontWeight: 700 }}>➤</div>
            </div>
          </div>
          <p style={{ marginTop: 20, fontSize: 13, color: "#999" }}>💬 Use the chat button bottom-right to talk to Sarah live</p>
        </div>
      </section>

      {/* TRY SARAH BY PHONE */}
      <section style={{ padding: "52px 32px", background: DARK_BG, borderTop: `1px solid #2a2a2a`, borderBottom: `1px solid #2a2a2a` }}>
        <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 24, justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e", animation: "blink 1.5s infinite" }} />
              <span style={{ fontSize: 13, color: "#22c55e", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Sarah is live now</span>
            </div>
            <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8, color: "#fff" }}>Want to hear Sarah's voice?</h3>
            <p style={{ fontSize: 14, color: "#888", lineHeight: 1.7 }}>Call the demo line and experience exactly what your callers will hear — 24/7, no scripts, no hold music.</p>
          </div>
          <a href="tel:0258504038" style={{
            background: YELLOW, color: BLACK, padding: "18px 36px",
            textDecoration: "none", fontSize: 20, fontWeight: 900, letterSpacing: 0.5,
            whiteSpace: "nowrap", flexShrink: 0
          }}>📞 02 5850 4038</a>
        </div>
        <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "90px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 34, fontWeight: 900, marginBottom: 12, color: BLACK }}>What Sarah Does for Ray White United Group</h2>
          <div style={{ width: 60, height: 4, background: YELLOW, margin: "0 auto 56px" }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 2 }}>
            {[
              { icon: "📞", title: "Answers Every Call", desc: "No missed calls, no voicemail. Sarah picks up in under 2 seconds — every time, 24/7." },
              { icon: "🏠", title: "Books Inspections", desc: "Buyers book inspections directly through Sarah. Your agents get instant SMS with full buyer details." },
              { icon: "📋", title: "Captures Every Lead", desc: "Name, number, email, budget, intent — all captured automatically and pushed to your dashboard." },
              { icon: "💼", title: "Qualifies Buyers", desc: "Pre-approved? Investor or owner-occupier? Timeframe? Sarah asks so your agents know who to call first." },
              { icon: "🏷️", title: "Appraisal Booking", desc: "Vendors calling about selling? Sarah books a complimentary appraisal straight into your calendar." },
              { icon: "📊", title: "Real-Time Dashboard", desc: "Every lead, call and enquiry tracked live. Full visibility for the whole Ray White United Group team." },
            ].map((f, i) => (
              <div key={f.title} style={{
                background: i % 2 === 0 ? "#fff" : "#fafafa",
                borderLeft: `4px solid ${YELLOW}`, padding: 34,
                transition: "background 0.2s", boxShadow: "0 1px 6px rgba(0,0,0,0.05)"
              }}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = `${YELLOW}12`; }}
                onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? "#fff" : "#fafafa"; }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8, color: BLACK }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "#666", lineHeight: 1.75 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE AREAS */}
      <section style={{ padding: "64px 32px", background: "#f7f7f7", borderTop: "1px solid #e8e8e8" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8, color: BLACK }}>Our Service Areas</h2>
          <p style={{ color: "#888", marginBottom: 36, fontSize: 15 }}>Trusted by buyers, sellers, investors and tenants across Greater Western Sydney</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {["St Marys", "Penrith", "Erskine Park", "Colyton", "Kingswood", "Werrington", "Cambridge Park", "Rooty Hill", "Mount Druitt", "Quakers Hill", "Blacktown", "Glendenning"].map(suburb => (
              <div key={suburb} style={{
                border: `2px solid ${YELLOW}`, padding: "9px 22px", fontSize: 14,
                color: BLACK, background: `${YELLOW}14`, fontWeight: 600
              }}>{suburb}</div>
            ))}
          </div>
        </div>
      </section>

      {/* YELLOW CTA */}
      <section style={{ padding: "90px 32px", textAlign: "center", background: YELLOW }}>
        <div style={{ maxWidth: 620, margin: "0 auto" }}>
          <h2 style={{ fontSize: 40, fontWeight: 900, color: BLACK, marginBottom: 18, letterSpacing: -0.5 }}>Ready to Buy, Sell or Rent?</h2>
          <p style={{ color: "#333", fontSize: 17, marginBottom: 44, lineHeight: 1.75 }}>
            Our AI receptionist Sarah is available 24/7 — call now or chat with her below. Ray White United Group never sleeps.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={`tel:${PHONE.replace(/\s/g, "")}`} style={{
              background: BLACK, color: YELLOW, padding: "18px 44px",
              textDecoration: "none", fontSize: 17, fontWeight: 900, letterSpacing: 0.5
            }}>📞 {PHONE}</a>
            <button onClick={() => document.getElementById("chat-demo")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                background: "transparent", border: `2px solid ${BLACK}`, color: BLACK,
                padding: "18px 44px", fontSize: 17, fontWeight: 700, cursor: "pointer", letterSpacing: 0.5
              }}>Chat with Sarah</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: DARK_BG, padding: "48px 32px", borderTop: `3px solid ${YELLOW}` }}>
        <div style={{ maxWidth: 980, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 32, alignItems: "flex-start" }}>
          <div>
            <RWLogo size={36} />
            <p style={{ color: "#666", marginTop: 16, fontSize: 13, maxWidth: 300, lineHeight: 1.7 }}>
              AI-powered property receptionist serving St Marys and Greater Western Sydney. Sarah is available 24/7, 365 days a year.
            </p>
          </div>
          <div>
            <div style={{ color: YELLOW, fontWeight: 700, fontSize: 13, marginBottom: 14, letterSpacing: 1, textTransform: "uppercase" }}>Contact Sarah</div>
            <a href={`tel:${PHONE.replace(/\s/g, "")}`} style={{ display: "block", color: "#fff", textDecoration: "none", fontSize: 22, fontWeight: 900, marginBottom: 8 }}>{PHONE}</a>
            <div style={{ color: "#555", fontSize: 12 }}>Available 24 hours · 7 days a week</div>
          </div>
          <div>
            <div style={{ color: YELLOW, fontWeight: 700, fontSize: 13, marginBottom: 14, letterSpacing: 1, textTransform: "uppercase" }}>Powered by</div>
            <a href="https://directiveos.com.au" target="_blank" rel="noreferrer" style={{ color: "#888", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>Directive OS</a>
            <div style={{ color: "#444", fontSize: 11, marginTop: 6 }}>directiveos.com.au</div>
          </div>
        </div>
        <div style={{ maxWidth: 980, margin: "32px auto 0", paddingTop: 24, borderTop: "1px solid #2a2a2a", textAlign: "center", color: "#444", fontSize: 12 }}>
          © {new Date().getFullYear()} Ray White United Group · St Marys, NSW · AI Receptionist by Directive OS
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
}
