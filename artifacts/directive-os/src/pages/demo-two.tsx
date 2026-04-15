import { useState, useRef, useEffect } from "react";

const TEAL = "#00d1b2";
const TEAL_DARK = "#009e87";
const WHITE = "#ffffff";
const DARK_BG = "#07090f";
const DARK_CARD = "#0d1017";
const BORDER = "#1a2030";
const PHONE = "02 5850 4038";
const API_BASE = "/api";

interface Message { role: "user" | "assistant"; content: string; }

function DOSLogo({ size = 40 }: { size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{
        width: size, height: size, borderRadius: size * 0.22,
        background: `linear-gradient(135deg, ${TEAL} 0%, #0891b2 100%)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 900, fontSize: size * 0.44, color: DARK_BG, flexShrink: 0,
        boxShadow: `0 0 ${size * 0.5}px ${TEAL}44`
      }}>D</div>
      <div>
        <div style={{ fontSize: size * 0.32, fontWeight: 800, color: WHITE, letterSpacing: 0.5, lineHeight: 1 }}>Directive OS</div>
        <div style={{ fontSize: size * 0.19, fontWeight: 500, color: TEAL, letterSpacing: 1.5, textTransform: "uppercase", lineHeight: 1.4 }}>AI Receptionist</div>
      </div>
    </div>
  );
}

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "G'day! I'm Sarah, your agency's AI receptionist. Whether you're buying, selling, or renting — I'm here 24/7. How can I help?" }
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
        body: JSON.stringify({ sessionId: sessionId.current, message: text, agencyName: "Directive OS Demo" }),
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
          background: DARK_BG, borderRadius: 12, boxShadow: `0 8px 40px rgba(0,209,178,0.2)`,
          border: `2px solid ${TEAL}66`, display: "flex", flexDirection: "column", zIndex: 9999, overflow: "hidden"
        }}>
          <div style={{ background: `linear-gradient(90deg, ${TEAL_DARK}, #0891b2)`, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, color: TEAL, flexShrink: 0 }}>D</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: WHITE }}>Sarah — AI Receptionist</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>Directive OS · Always available</div>
              <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
                {[["🇦🇺","EN"],["🇨🇳","中文"],["🇵🇭","FIL"],["🇷🇺","РУС"],["🇸🇦","عربي"],["🇰🇷","한국어"],["🇻🇳","Việt"],["🇮🇳","हिंदी"],["🇪🇸","ESP"]].map(([flag, lang]) => (
                  <span key={lang} style={{ fontSize: 9, background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.9)", borderRadius: 4, padding: "1px 5px", fontWeight: 600, letterSpacing: 0.3, whiteSpace: "nowrap" }}>{flag} {lang}</span>
                ))}
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ marginLeft: "auto", background: "none", border: "none", color: WHITE, fontSize: 22, cursor: "pointer", fontWeight: 700 }}>×</button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "82%", padding: "10px 14px", fontSize: 13, lineHeight: 1.55,
                  background: m.role === "user" ? TEAL : "#141c2a",
                  color: m.role === "user" ? DARK_BG : "#ddd",
                  fontWeight: m.role === "user" ? 600 : 400,
                  borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  border: m.role === "assistant" ? `1px solid ${BORDER}` : "none"
                }}>{m.content}</div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: 5, padding: "10px 14px", background: "#141c2a", borderRadius: "16px 16px 16px 4px", width: 60, border: `1px solid ${BORDER}` }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: TEAL, animation: `bounce 1s infinite ${i * 0.2}s` }} />
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div style={{ padding: "12px 14px", borderTop: `1px solid ${BORDER}`, display: "flex", gap: 8 }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Ask Sarah anything..."
              style={{ flex: 1, background: "#0a0f1a", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "10px 12px", color: WHITE, fontSize: 13, outline: "none" }}
            />
            <button onClick={send} disabled={loading}
              style={{ background: TEAL, border: "none", borderRadius: 6, width: 42, cursor: "pointer", fontSize: 18, color: DARK_BG, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>→</button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(p => !p)} style={{
        position: "fixed", bottom: 24, right: 24, width: 64, height: 64, borderRadius: "50%",
        background: `linear-gradient(135deg, ${TEAL}, #0891b2)`, border: "none", cursor: "pointer", zIndex: 9998,
        boxShadow: `0 4px 24px ${TEAL}88`, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        {open ? <span style={{ color: DARK_BG, fontSize: 28, fontWeight: 700 }}>×</span> : "💬"}
      </button>
      <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }`}</style>
    </>
  );
}

export default function DemoTwoPage() {
  return (
    <div style={{ minHeight: "100vh", background: WHITE, color: DARK_BG, fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* DEMO BANNER */}
      <div style={{
        background: DARK_BG, color: "#888", textAlign: "center",
        padding: "9px 16px", fontSize: 12, fontWeight: 500, letterSpacing: 0.4,
        borderBottom: `3px solid ${TEAL}`, position: "relative", zIndex: 200
      }}>
        <span style={{ background: TEAL, color: DARK_BG, padding: "2px 9px", fontWeight: 800, fontSize: 11, marginRight: 10, borderRadius: 4, letterSpacing: 1 }}>LIVE DEMO</span>
        This is a live preview — your agency's custom version is built with your branding, your name, and your listings.{" "}
        <a href="https://directiveos.com.au" target="_blank" rel="noreferrer" style={{ color: TEAL, fontWeight: 700, textDecoration: "none" }}>Directive OS</a>
      </div>

      {/* NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100, background: DARK_BG,
        borderBottom: `3px solid ${TEAL}`, padding: "0 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: 72,
        boxShadow: "0 2px 20px rgba(0,0,0,0.5)"
      }}>
        <DOSLogo size={36} />
        <div style={{ display: "flex", gap: 28, fontSize: 14 }}>
          {["Buy", "Sell", "Rent", "About Agent"].map(l => (
            <a key={l} href="https://directiveos.com.au" target="_blank" rel="noreferrer"
              style={{ color: "#555", textDecoration: "none", fontWeight: 500 }}
              onMouseOver={e => (e.currentTarget.style.color = TEAL)}
              onMouseOut={e => (e.currentTarget.style.color = "#555")}>{l}</a>
          ))}
        </div>
        <a href={`tel:${PHONE.replace(/\s/g, "")}`} style={{
          background: TEAL, color: DARK_BG, padding: "10px 22px",
          textDecoration: "none", fontSize: 14, fontWeight: 800, borderRadius: 6, letterSpacing: 0.5
        }}>📞 {PHONE}</a>
      </nav>

      {/* HERO */}
      <section style={{
        position: "relative", overflow: "hidden",
        padding: "110px 32px 90px", textAlign: "center",
        background: `linear-gradient(160deg, ${DARK_BG} 0%, #001a17 60%, ${DARK_BG} 100%)`,
        borderBottom: `1px solid ${BORDER}`
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, transparent, ${TEAL}, transparent)` }} />
        <div style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${TEAL}18 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: 820, margin: "0 auto", position: "relative" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: `${TEAL}18`, border: `1px solid ${TEAL}44`,
            color: TEAL, padding: "6px 20px", borderRadius: 100, fontSize: 12, fontWeight: 700,
            marginBottom: 28, letterSpacing: 3, textTransform: "uppercase"
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 6px #4ade80" }} />
            AI Receptionist · Available 24/7
          </div>
          <h1 style={{ fontSize: "clamp(36px, 5.5vw, 64px)", fontWeight: 900, lineHeight: 1.05, marginBottom: 24, letterSpacing: -1.5, color: WHITE }}>
            Your Office Never<br />
            <span style={{ color: TEAL }}>Misses a Call Again.</span>
          </h1>
          <p style={{ fontSize: 19, color: "#888", lineHeight: 1.8, maxWidth: 640, margin: "0 auto 16px" }}>
            Sarah is an AI receptionist built for your agency. She answers every call to your office line — 24 hours a day — qualifies the enquiry, and sends the Agent a notification the moment the call ends.
          </p>
          <p style={{ fontSize: 15, color: "#444", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 50px" }}>
            No voicemail. No missed leads. Just a full lead transcript in your inbox and a tap on your phone — every time.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={`tel:${PHONE.replace(/\s/g, "")}`} style={{
              background: TEAL, color: DARK_BG, padding: "16px 40px", borderRadius: 8,
              textDecoration: "none", fontSize: 17, fontWeight: 900,
              boxShadow: `0 4px 28px ${TEAL}55`, letterSpacing: 0.5
            }}>📞 Call Sarah — {PHONE}</a>
            <button onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                background: "transparent", border: `2px solid ${TEAL}44`, color: "#ccc",
                padding: "16px 40px", borderRadius: 8, fontSize: 17, fontWeight: 700, cursor: "pointer", letterSpacing: 0.5
              }}>See How It Works ↓</button>
          </div>
          <p style={{ color: "#333", fontSize: 13, marginTop: 20 }}>
            Call the number now — Sarah answers live. Or scroll down to chat with her.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ background: DARK_BG, padding: "80px 32px", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: TEAL, marginBottom: 12 }}>HOW IT WORKS</div>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 900, color: WHITE, margin: 0 }}>
              What happens when someone calls the office
            </h2>
            <p style={{ color: "#555", fontSize: 15, marginTop: 14, maxWidth: 520, margin: "14px auto 0" }}>
              You don't have to do anything differently. The whole thing runs automatically — in under 60 seconds.
            </p>
          </div>

          <div style={{ display: "grid", gap: 0 }}>
            {[
              {
                num: "01",
                icon: "📞",
                title: "Someone calls your office",
                body: "A buyer, vendor, or tenant rings your office line — midday, at 7pm, on a Saturday. Instead of ringing out or hitting voicemail, Sarah answers in under 3 seconds. Every time.",
              },
              {
                num: "02",
                icon: "🤖",
                title: "Sarah handles the call",
                body: "\"G'day, [Your Agency] — this is Sarah, how can I help?\" She qualifies the Caller, answers questions about listings, books inspection times, handles rental enquiries. Sounds real, acts professional.",
              },
              {
                num: "03",
                icon: "📧",
                title: "Email lands in Agent's inbox immediately",
                body: "The second the call ends, a lead summary email hits the Agent's inbox. Caller's name, phone number, what they're looking for, their budget, finance status — and the full word-for-word transcript of the call.",
                mockup: "email",
              },
              {
                num: "04",
                icon: "🔔",
                title: "App notification straight to Agent's phone",
                body: "The Agent's phone buzzes — even if they're at an auction or an inspection. Tap the notification to open the full lead in the app. See who called, what they said, and call them back with full context — not blind.",
                mockup: "app",
              },
            ].map((step, i) => (
              <div key={step.num} style={{ display: "flex", gap: 0, marginBottom: 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 80, flexShrink: 0 }}>
                  <div style={{ width: 54, height: 54, borderRadius: "50%", background: `linear-gradient(135deg, ${TEAL}, #0891b2)`, color: DARK_BG, fontWeight: 900, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1 }}>{step.num}</div>
                  {i < 3 && <div style={{ width: 2, flex: 1, background: `linear-gradient(${TEAL}, ${TEAL}11)`, minHeight: 60 }} />}
                </div>
                <div style={{ flex: 1, paddingBottom: i < 3 ? 52 : 0, paddingLeft: 24, paddingTop: 12 }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{step.icon}</div>
                  <h3 style={{ fontSize: 21, fontWeight: 800, color: WHITE, margin: "0 0 10px" }}>{step.title}</h3>
                  <p style={{ fontSize: 15, color: "#777", lineHeight: 1.8, margin: "0 0 22px", maxWidth: 560 }}>{step.body}</p>

                  {step.mockup === "email" && (
                    <div style={{ background: "#0d1117", border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 24px", maxWidth: 520, fontFamily: "monospace" }}>
                      <div style={{ fontSize: 11, color: "#3a4a5a", marginBottom: 16, borderBottom: `1px solid ${BORDER}`, paddingBottom: 12, fontFamily: "sans-serif" }}>
                        <div style={{ marginBottom: 3 }}><span style={{ color: "#3a4a5a" }}>FROM: </span><span style={{ color: "#4a5568" }}>leads@directiveos.com.au</span></div>
                        <div style={{ marginBottom: 8 }}><span style={{ color: "#3a4a5a" }}>TO: </span><span style={{ color: "#4a5568" }}>agent@youragency.com.au</span></div>
                        <div style={{ color: TEAL, fontWeight: 700, fontSize: 13, fontFamily: "sans-serif" }}>🔴 New Lead — Buyer Enquiry · Western Sydney</div>
                      </div>
                      <div style={{ fontSize: 13, color: "#4a5568", lineHeight: 2, fontFamily: "sans-serif" }}>
                        <div><span style={{ color: "#3a4a5a" }}>Caller: </span><span style={{ color: "#c9d1d9", fontWeight: 600 }}>Caller</span></div>
                        <div><span style={{ color: "#3a4a5a" }}>Phone: </span><span style={{ color: TEAL, fontWeight: 700 }}>0412 xxx xxx</span></div>
                        <div><span style={{ color: "#3a4a5a" }}>Enquiry: </span><span style={{ color: "#8b949e" }}>3-bed house in the area, budget $750K</span></div>
                        <div><span style={{ color: "#3a4a5a" }}>Finance: </span><span style={{ color: "#4ade80", fontWeight: 700 }}>Pre-approved ✓</span></div>
                        <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${BORDER}` }}>
                          <div style={{ color: "#3a4a5a", marginBottom: 6, fontSize: 11, letterSpacing: 1 }}>TRANSCRIPT</div>
                          <div style={{ fontSize: 12 }}><span style={{ color: TEAL }}>Sarah: </span><span style={{ color: "#4a5568" }}>G'day, [Your Agency], this is Sarah — how can I help?</span></div>
                          <div style={{ fontSize: 12 }}><span style={{ color: "#555" }}>Caller: </span><span style={{ color: "#3a4a5a" }}>Hi, I saw your listing in the area...</span></div>
                          <div style={{ fontSize: 12, color: "#1e2a3a", fontStyle: "italic", marginTop: 4 }}>+ full conversation below...</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step.mockup === "app" && (
                    <div style={{ maxWidth: 300 }}>
                      <div style={{ background: "#1c1c1e", borderRadius: 16, padding: "14px 16px", marginBottom: 12, border: `1px solid ${BORDER}`, display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <div style={{ width: 44, height: 44, borderRadius: 10, background: `linear-gradient(135deg, ${TEAL}, #0891b2)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🎯</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: WHITE, marginBottom: 2 }}>New Lead — Sarah</div>
                          <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.55 }}>Caller enquired · Pre-approved · 3bd $750K · Tap to view full transcript</div>
                          <div style={{ fontSize: 11, color: "#374151", marginTop: 4 }}>now · Your Agency</div>
                        </div>
                      </div>
                      <div style={{ background: "#0d1017", border: `1px solid ${TEAL}33`, borderRadius: 12, padding: "16px 18px" }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: TEAL, letterSpacing: 2, marginBottom: 8 }}>COMMAND BRIDGE APP</div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <span style={{ fontWeight: 700, color: WHITE, fontSize: 15 }}>Caller</span>
                          <span style={{ background: "#4ade8022", color: "#4ade80", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>Pre-approved</span>
                        </div>
                        <div style={{ fontSize: 12, color: "#4a5568", marginBottom: 12 }}>0412 xxx xxx · 3bd · $750K</div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <div style={{ flex: 1, background: TEAL, color: DARK_BG, textAlign: "center", padding: "9px 0", borderRadius: 6, fontSize: 12, fontWeight: 800, cursor: "pointer" }}>📞 Call Back</div>
                          <div style={{ flex: 1, background: "#141c2a", color: "#6b7280", textAlign: "center", padding: "9px 0", borderRadius: 6, fontSize: 12, fontWeight: 600, border: `1px solid ${BORDER}`, cursor: "pointer" }}>📄 Transcript</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REASSURANCE */}
      <section style={{ background: "#050709", padding: "64px 32px", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: TEAL, marginBottom: 16 }}>YOUR EXISTING SETUP IS UNTOUCHED</div>
          <h2 style={{ fontSize: 30, fontWeight: 800, color: WHITE, marginBottom: 18 }}>
            This doesn't change anything about how your agency runs
          </h2>
          <p style={{ color: "#555", fontSize: 15, lineHeight: 1.8, maxWidth: 600, margin: "0 auto 36px" }}>
            Directive OS runs on a separate landing page — completely independent of your existing website, your franchise, and your head office. Nothing is touched, moved, or changed. It's simply an addition.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, textAlign: "left" }}>
            {[
              { icon: "✅", label: "Your franchise / brand", status: "Untouched" },
              { icon: "✅", label: "Your existing website", status: "Untouched" },
              { icon: "✅", label: "Your head office", status: "Untouched" },
              { icon: "✅", label: "Your team's phones & email", status: "Untouched" },
              { icon: "✅", label: "Your REA & Domain profiles", status: "Untouched" },
              { icon: "🆕", label: "This landing page", status: "New addition only" },
            ].map(item => (
              <div key={item.label} style={{ background: DARK_CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{item.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#7a8a9a", marginBottom: 3 }}>{item.label}</div>
                <div style={{ fontSize: 11, color: item.status === "New addition only" ? TEAL : "#4ade80", fontWeight: 700 }}>{item.status}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHAT DEMO */}
      <section id="chat-demo" style={{ background: "#f7f7f7", padding: "80px 32px", borderBottom: "1px solid #e5e5e5" }}>
        <div style={{ maxWidth: 660, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "#999", marginBottom: 16 }}>TRY IT NOW</div>
          <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 900, color: DARK_BG, marginBottom: 16 }}>Talk to Sarah yourself</h2>
          <p style={{ color: "#555", fontSize: 15, lineHeight: 1.75, marginBottom: 40 }}>
            Hit the chat button — bottom right corner — and ask anything a buyer or tenant would ask. This is exactly what your callers experience. Or call the number and talk to her live right now.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={`tel:${PHONE.replace(/\s/g, "")}`} style={{
              background: DARK_BG, color: TEAL, padding: "14px 36px", borderRadius: 8,
              textDecoration: "none", fontSize: 16, fontWeight: 900,
              border: `3px solid ${TEAL}`, display: "inline-block"
            }}>📞 Call Sarah — {PHONE}</a>
          </div>
          <p style={{ color: "#bbb", fontSize: 12, marginTop: 20 }}>
            Try it after hours — that's when your competitors' phones go to voicemail.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: DARK_BG, borderTop: `3px solid ${TEAL}`, padding: "32px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <DOSLogo size={30} />
          <p style={{ color: "#2a3a4a", fontSize: 12, marginTop: 16, lineHeight: 1.8 }}>
            This demo page is powered by{" "}
            <a href="https://directiveos.com.au" target="_blank" rel="noreferrer" style={{ color: TEAL, textDecoration: "none", fontWeight: 700 }}>Directive OS</a>
            {" "}— AI Receptionist for Australian Real Estate Agencies.
            <br />ABN 87 754 544 171 · directiveos.com.au
          </p>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
}
