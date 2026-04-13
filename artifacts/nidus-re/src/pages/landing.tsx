import { useState, useRef, useEffect } from "react";

const PINK = "#e70d73";
const PURPLE = "#2f1655";
const DARK = "#0d0617";
const LOGO = "https://www.nidusre.com.au/wp-content/uploads/2025/08/Nidus-Logo-white-tagline-01-1.png";
const PHONE = "02 9625 0000";
const API_BASE = "/api";

interface Message { role: "user" | "assistant"; content: string; }

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "G'day! I'm Sarah, the virtual receptionist for Nidus Real Estate. Looking to buy, sell, or rent in Mt Druitt? I'm here to help 24/7 — what can I do for you today?" }
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
      setMessages(p => [...p, { role: "assistant", content: data.message || data.reply || "Let me connect you with the team — call us on " + PHONE }]);
    } catch {
      setMessages(p => [...p, { role: "assistant", content: "Sorry, I had a hiccup! Call us directly on " + PHONE }]);
    }
    setLoading(false);
  }

  return (
    <>
      {/* Chat window */}
      {open && (
        <div style={{
          position: "fixed", bottom: 90, right: 24, width: 360, height: 500,
          background: "#1a0d2e", borderRadius: 16, boxShadow: `0 8px 40px rgba(231,13,115,0.3)`,
          border: `1px solid ${PINK}40`, display: "flex", flexDirection: "column", zIndex: 9999,
          overflow: "hidden"
        }}>
          {/* Header */}
          <div style={{ background: `linear-gradient(135deg, ${PINK}, ${PURPLE})`, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤖</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Sarah — AI Receptionist</div>
              <div style={{ fontSize: 11, opacity: 0.85 }}>Nidus Real Estate · Always available</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ marginLeft: "auto", background: "none", border: "none", color: "white", fontSize: 20, cursor: "pointer", opacity: 0.8 }}>×</button>
          </div>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "82%", padding: "10px 14px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: m.role === "user" ? `linear-gradient(135deg, ${PINK}, ${PURPLE})` : "rgba(255,255,255,0.08)",
                  fontSize: 13, lineHeight: 1.5, color: "#fff"
                }}>{m.content}</div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex" }}>
                <div style={{ padding: "10px 14px", background: "rgba(255,255,255,0.08)", borderRadius: "16px 16px 16px 4px", fontSize: 13, color: "#e70d73" }}>Sarah is typing…</div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          {/* Input */}
          <div style={{ padding: "10px 14px", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", gap: 8 }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Type a message…"
              style={{ flex: 1, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 24, padding: "9px 14px", color: "#fff", fontSize: 13, outline: "none" }}
            />
            <button onClick={send} disabled={loading || !input.trim()} style={{
              width: 38, height: 38, borderRadius: "50%", background: PINK, border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              opacity: loading || !input.trim() ? 0.5 : 1, fontSize: 16
            }}>➤</button>
          </div>
        </div>
      )}
      {/* Bubble */}
      <button onClick={() => setOpen(p => !p)} style={{
        position: "fixed", bottom: 24, right: 24, width: 60, height: 60, borderRadius: "50%",
        background: `linear-gradient(135deg, ${PINK}, ${PURPLE})`,
        border: "none", cursor: "pointer", boxShadow: `0 4px 24px rgba(231,13,115,0.5)`,
        fontSize: 26, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
        animation: "pulse 2s infinite"
      }}>💬</button>
      <style>{`@keyframes pulse { 0%,100%{box-shadow:0 4px 24px rgba(231,13,115,0.5)} 50%{box-shadow:0 4px 36px rgba(231,13,115,0.8)} }`}</style>
    </>
  );
}

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: DARK, color: "#fff" }}>

      {/* NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100, background: `${DARK}ee`, backdropFilter: "blur(12px)",
        borderBottom: `1px solid rgba(231,13,115,0.2)`, padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: 68
      }}>
        <img src={LOGO} alt="Nidus Real Estate" style={{ height: 36, objectFit: "contain" }} />
        <div style={{ display: "flex", gap: 32, fontSize: 14, color: "#ccc" }}>
          {["Buy", "Sell", "Rent", "About"].map(l => (
            <a key={l} href="#" style={{ color: "#ccc", textDecoration: "none" }}
              onMouseOver={e => (e.currentTarget.style.color = PINK)}
              onMouseOut={e => (e.currentTarget.style.color = "#ccc")}>{l}</a>
          ))}
        </div>
        <a href={`tel:${PHONE}`} style={{
          background: PINK, color: "#fff", padding: "9px 20px", borderRadius: 24,
          textDecoration: "none", fontSize: 14, fontWeight: 600
        }}>📞 {PHONE}</a>
      </nav>

      {/* HERO */}
      <section style={{
        position: "relative", overflow: "hidden",
        padding: "100px 24px 80px", textAlign: "center",
        background: `radial-gradient(ellipse at 50% 0%, ${PURPLE}88 0%, transparent 70%)`
      }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 80% 50%, ${PINK}15 0%, transparent 60%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: 760, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-block", background: `${PINK}22`, border: `1px solid ${PINK}55`, color: PINK, borderRadius: 24, padding: "6px 16px", fontSize: 13, fontWeight: 600, marginBottom: 24 }}>
            🤖 AI Receptionist — Available 24/7
          </div>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 62px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 20 }}>
            Never Miss a Lead.<br />
            <span style={{ background: `linear-gradient(135deg, ${PINK}, #ff6bb3)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Sarah Answers Every Call.
            </span>
          </h1>
          <p style={{ fontSize: 18, color: "#c0a8d8", lineHeight: 1.7, marginBottom: 40, maxWidth: 580, margin: "0 auto 40px" }}>
            Nidus Real Estate's AI receptionist is live 24/7 — answering enquiries, booking inspections, and capturing every lead across Mt Druitt and Western Sydney.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={`tel:${PHONE}`} style={{
              background: PINK, color: "#fff", padding: "14px 32px", borderRadius: 32,
              textDecoration: "none", fontSize: 16, fontWeight: 700, boxShadow: `0 4px 24px ${PINK}55`
            }}>📞 Call Us Now</a>
            <button onClick={() => document.getElementById("chat")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                background: "transparent", border: `2px solid ${PINK}66`, color: "#fff",
                padding: "14px 32px", borderRadius: 32, fontSize: 16, fontWeight: 600, cursor: "pointer"
              }}>Chat with Sarah ↓</button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ borderTop: `1px solid rgba(231,13,115,0.15)`, borderBottom: `1px solid rgba(231,13,115,0.15)`, padding: "40px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 24, textAlign: "center" }}>
          {[
            { val: "24/7", label: "Always Available" },
            { val: "< 2s", label: "Response Time" },
            { val: "100%", label: "Calls Answered" },
            { val: "0", label: "Missed Leads" },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 36, fontWeight: 900, color: PINK }}>{s.val}</div>
              <div style={{ fontSize: 13, color: "#9080a8", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CHAT DEMO */}
      <section id="chat" style={{ padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Chat with Sarah — Right Now</h2>
          <p style={{ color: "#9080a8", marginBottom: 40 }}>Ask about a property, book an inspection, or request an appraisal. Sarah is live and ready.</p>
          <div style={{
            background: "#1a0d2e", borderRadius: 20, border: `1px solid ${PINK}30`,
            boxShadow: `0 8px 40px rgba(231,13,115,0.15)`, overflow: "hidden"
          }}>
            {/* Header */}
            <div style={{ background: `linear-gradient(135deg, ${PINK}, ${PURPLE})`, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🤖</div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 700 }}>Sarah · Nidus Real Estate</div>
                <div style={{ fontSize: 12, opacity: 0.85 }}>● Online now</div>
              </div>
            </div>
            {/* Demo message */}
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ alignSelf: "flex-start", maxWidth: "80%", background: "rgba(255,255,255,0.06)", padding: "12px 16px", borderRadius: "16px 16px 16px 4px", fontSize: 14, lineHeight: 1.6, textAlign: "left" }}>
                G'day! I'm Sarah, the virtual receptionist for Nidus Real Estate. Looking to buy, sell, or rent in Mt Druitt? I'm here to help 24/7 — what can I do for you today?
              </div>
              <div style={{ alignSelf: "flex-end", background: `linear-gradient(135deg, ${PINK}, ${PURPLE})`, padding: "12px 16px", borderRadius: "16px 16px 4px 16px", fontSize: 14, lineHeight: 1.6 }}>
                I'd like to book an inspection at 14 Second Avenue, Mt Druitt.
              </div>
              <div style={{ alignSelf: "flex-start", maxWidth: "80%", background: "rgba(255,255,255,0.06)", padding: "12px 16px", borderRadius: "16px 16px 16px 4px", fontSize: 14, lineHeight: 1.6, textAlign: "left" }}>
                Absolutely! I'll lock in a time with the agent. Can I grab your name, best number, and are you looking to live in or invest?
              </div>
            </div>
            {/* Input bar */}
            <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: 24, padding: "10px 16px", fontSize: 13, color: "#665577" }}>Type a message…</div>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: PINK, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>➤</div>
            </div>
          </div>
          <p style={{ marginTop: 20, fontSize: 13, color: "#6a5578" }}>
            💬 Use the chat button in the bottom-right to talk to Sarah live
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "0 24px 80px", background: `linear-gradient(180deg, transparent, ${PURPLE}22)` }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: 800, marginBottom: 48 }}>What Sarah Does for Nidus</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {[
              { icon: "📞", title: "Answers Every Call", desc: "No missed calls, no voicemail. Sarah picks up every enquiry instantly — day, night, weekends." },
              { icon: "🏠", title: "Books Inspections", desc: "Buyers can book inspections directly through Sarah. Agent gets notified immediately." },
              { icon: "📋", title: "Captures Leads", desc: "Every caller's name, number, and email is captured and sent straight to the team." },
              { icon: "💼", title: "Qualifies Buyers", desc: "Sarah asks the gold questions — finance, timeline, intent — so agents know who to call first." },
              { icon: "🏷️", title: "Appraisal Requests", desc: "Vendors get connected to a complimentary appraisal booking in seconds." },
              { icon: "📊", title: "Live Dashboard", desc: "Track every lead, call, and enquiry in the Nidus real-time dashboard." },
            ].map(f => (
              <div key={f.title} style={{
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(231,13,115,0.15)",
                borderRadius: 16, padding: 28, transition: "border-color 0.2s"
              }}
                onMouseOver={e => (e.currentTarget.style.borderColor = `${PINK}60`)}
                onMouseOut={e => (e.currentTarget.style.borderColor = "rgba(231,13,115,0.15)")}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "#9080a8", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: "80px 24px", textAlign: "center",
        background: `linear-gradient(135deg, ${PURPLE}88, ${PINK}22)`,
        borderTop: `1px solid ${PINK}30`, borderBottom: `1px solid ${PINK}30`
      }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>Ready to Find Your Next Home?</h2>
          <p style={{ color: "#c0a8d8", fontSize: 16, marginBottom: 36, lineHeight: 1.7 }}>
            Servicing Mt Druitt, Blackett, Hebersham, Bidwill, and all of Western Sydney. Call us or request an appraisal today.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={`tel:${PHONE}`} style={{
              background: PINK, color: "#fff", padding: "16px 36px", borderRadius: 32,
              textDecoration: "none", fontSize: 16, fontWeight: 700, boxShadow: `0 4px 24px ${PINK}55`
            }}>📞 {PHONE}</a>
            <a href="https://www.nidusre.com.au/sell/sales-appraisal/" target="_blank" rel="noreferrer" style={{
              background: "transparent", border: `2px solid ${PINK}66`, color: "#fff",
              padding: "16px 36px", borderRadius: 32, textDecoration: "none", fontSize: 16, fontWeight: 600
            }}>Request Appraisal</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "40px 24px", borderTop: `1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center", justifyContent: "space-between" }}>
          <img src={LOGO} alt="Nidus Real Estate" style={{ height: 32, objectFit: "contain" }} />
          <div style={{ fontSize: 13, color: "#6a5578", textAlign: "center" }}>
            Mt Druitt & Western Sydney · Licensed Real Estate Agency
          </div>
          <div style={{ fontSize: 12, color: "#4a3558", textAlign: "right" }}>
            AI Receptionist powered by<br />
            <span style={{ color: "#00d1b2", fontWeight: 700 }}>Directive OS</span>
          </div>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
}
