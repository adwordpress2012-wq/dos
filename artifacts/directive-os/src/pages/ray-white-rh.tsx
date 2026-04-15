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
        <div style={{ fontSize: size * 0.2, fontWeight: 600, color: "#999", letterSpacing: 1.5, textTransform: "uppercase", lineHeight: 1.3 }}>Rooty Hill</div>
      </div>
    </div>
  );
}

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "G'day! I'm Sarah, the AI receptionist for Ray White Rooty Hill. Looking to buy, sell, or rent in Rooty Hill, Mount Druitt, or Western Sydney? I'm available 24/7 — how can I help?" }
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
        body: JSON.stringify({ sessionId: sessionId.current, message: text, agencyName: "Ray White Rooty Hill" }),
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
              <div style={{ fontSize: 11, color: "#333" }}>Ray White Rooty Hill · Always available</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ marginLeft: "auto", background: "none", border: "none", color: BLACK, fontSize: 22, cursor: "pointer", fontWeight: 700 }}>×</button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "82%", padding: "10px 14px", fontSize: 13, lineHeight: 1.55,
                  background: m.role === "user" ? YELLOW : "#1e1e1e",
                  color: m.role === "user" ? BLACK : "#eee",
                  borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  border: m.role === "assistant" ? "1px solid #333" : "none"
                }}>{m.content}</div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: 5, padding: "10px 14px", background: "#1e1e1e", borderRadius: "16px 16px 16px 4px", width: 60, border: "1px solid #333" }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: YELLOW, animation: `bounce 1s infinite ${i * 0.2}s` }} />
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div style={{ padding: "12px 14px", borderTop: "1px solid #2a2a2a", display: "flex", gap: 8 }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Ask Sarah anything..."
              style={{ flex: 1, background: "#1a1a1a", border: "1px solid #333", borderRadius: 6, padding: "10px 12px", color: "#fff", fontSize: 13, outline: "none" }}
            />
            <button onClick={send} disabled={loading}
              style={{ background: YELLOW, border: "none", borderRadius: 6, width: 42, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>→</button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(p => !p)} style={{
        position: "fixed", bottom: 24, right: 24, width: 64, height: 64, borderRadius: "50%",
        background: YELLOW, border: "none", cursor: "pointer", zIndex: 9998,
        boxShadow: `0 4px 24px ${YELLOW}66`, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        {open ? "×" : "💬"}
      </button>
      <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }`}</style>
    </>
  );
}

export default function RayWhiteRHPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: BLACK, fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* DEMO BANNER */}
      <div style={{
        background: DARK_BG, color: "#ccc", textAlign: "center",
        padding: "9px 16px", fontSize: 12, fontWeight: 500, letterSpacing: 0.5,
        borderBottom: `2px solid ${YELLOW}`, position: "relative", zIndex: 200
      }}>
        <span style={{ background: YELLOW, color: BLACK, padding: "2px 8px", fontWeight: 800, fontSize: 11, marginRight: 10, letterSpacing: 1 }}>DEMO</span>
        This is a live preview built for Ray White Rooty Hill — your franchise and main website are completely untouched.{" "}
        <a href="https://directiveos.com.au" target="_blank" rel="noreferrer" style={{ color: YELLOW, fontWeight: 700, textDecoration: "none" }}>Directive OS</a>
        {" "}powers this page independently.
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
          {["Buy", "Sell", "Rent", "About Us"].map(l => (
            <a key={l} href="https://www.raywhite.com/" target="_blank" rel="noreferrer"
              style={{ color: "#aaa", textDecoration: "none", fontWeight: 500 }}
              onMouseOver={e => (e.currentTarget.style.color = YELLOW)}
              onMouseOut={e => (e.currentTarget.style.color = "#aaa")}>{l}</a>
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
            Every Call Answered.<br />
            <span style={{ color: YELLOW }}>Every Lead Captured.</span>
          </h1>
          <p style={{ fontSize: 19, color: "#bbb", lineHeight: 1.75, marginBottom: 50, maxWidth: 620, margin: "0 auto 50px" }}>
            Ray White Rooty Hill's AI receptionist Sarah answers every call to your office — 24/7 — even when you're at an inspection, with a client, or it's Sunday night. You get the lead. You get the transcript. You never miss a thing.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={`tel:${PHONE.replace(/\s/g, "")}`} style={{
              background: YELLOW, color: BLACK, padding: "16px 40px",
              textDecoration: "none", fontSize: 17, fontWeight: 900,
              boxShadow: `0 4px 28px ${YELLOW}55`, letterSpacing: 0.5
            }}>📞 Call Sarah Now — {PHONE}</a>
            <button onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                background: "transparent", border: `2px solid ${YELLOW}66`, color: "#eee",
                padding: "16px 40px", fontSize: 17, fontWeight: 700, cursor: "pointer", letterSpacing: 0.5
              }}>See How It Works ↓</button>
          </div>
          <p style={{ color: "#555", fontSize: 13, marginTop: 24 }}>
            This call connects to a live AI demo — try it. You'll receive a sample lead email within 30 seconds.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ background: "#0d0d0d", padding: "80px 32px", borderBottom: `1px solid #222` }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: YELLOW, marginBottom: 12 }}>HOW IT WORKS</div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 900, color: "#fff", margin: 0 }}>What happens when someone calls your office</h2>
            <p style={{ color: "#777", fontSize: 15, marginTop: 14, maxWidth: 560, margin: "14px auto 0" }}>The whole thing runs in under 60 seconds. You don't need to do anything.</p>
          </div>

          {/* Flow steps */}
          <div style={{ display: "grid", gap: 0 }}>
            {[
              {
                num: "01",
                icon: "📞",
                title: "Someone calls your office",
                body: "A buyer, vendor, or tenant rings your office line — at 7pm, on the weekend, whenever. Instead of voicemail or a missed call, Sarah picks up in under 3 seconds.",
                accent: "#FFE100",
              },
              {
                num: "02",
                icon: "🤖",
                title: "Sarah answers — naturally",
                body: "\"G'day, Ray White Rooty Hill, this is Sarah — how can I help you today?\" She qualifies the caller, answers questions about listings, books inspections, and handles rentals. Sounds like a real receptionist.",
                accent: "#FFE100",
              },
              {
                num: "03",
                icon: "📧",
                title: "You get an email immediately",
                body: "The moment the call ends, an email lands in your inbox. It contains: the caller's name, phone number, what they were enquiring about, their buyer intent, and the full conversation transcript — word for word.",
                accent: "#FFE100",
                mockup: "email",
              },
              {
                num: "04",
                icon: "🔔",
                title: "App notification on your phone",
                body: "Your phone buzzes with a push notification — even if you're at an inspection. Tap it to open the full lead profile in the Command Bridge app. See exactly who called, what they said, and what they need — so you can call back with full context.",
                accent: "#FFE100",
                mockup: "app",
              },
            ].map((step, i) => (
              <div key={step.num} style={{ display: "flex", gap: 0, marginBottom: i < 3 ? 0 : 0 }}>
                {/* Left: number + connector */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 80, flexShrink: 0 }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: YELLOW, color: BLACK, fontWeight: 900, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1 }}>{step.num}</div>
                  {i < 3 && <div style={{ width: 2, flex: 1, background: `linear-gradient(${YELLOW}, ${YELLOW}33)`, minHeight: 60 }} />}
                </div>
                {/* Right: content */}
                <div style={{ flex: 1, paddingBottom: i < 3 ? 48 : 0, paddingLeft: 24, paddingTop: 14 }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{step.icon}</div>
                  <h3 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: "0 0 10px" }}>{step.title}</h3>
                  <p style={{ fontSize: 15, color: "#999", lineHeight: 1.75, margin: "0 0 20px", maxWidth: 560 }}>{step.body}</p>

                  {/* Email mockup */}
                  {step.mockup === "email" && (
                    <div style={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 12, padding: "20px 24px", maxWidth: 520, fontFamily: "monospace" }}>
                      <div style={{ fontSize: 11, color: "#555", marginBottom: 16, borderBottom: "1px solid #222", paddingBottom: 12 }}>
                        <div style={{ marginBottom: 4 }}><span style={{ color: "#666" }}>FROM: </span><span style={{ color: "#aaa" }}>leads@directiveos.com.au</span></div>
                        <div style={{ marginBottom: 4 }}><span style={{ color: "#666" }}>TO: </span><span style={{ color: "#aaa" }}>david@raywhiterootyhillnsw.com.au</span></div>
                        <div style={{ color: YELLOW, fontWeight: 700, fontSize: 12, fontFamily: "sans-serif" }}>🔴 New Lead — Buyer Enquiry · Rooty Hill</div>
                      </div>
                      <div style={{ fontSize: 12, color: "#888", lineHeight: 1.8, fontFamily: "sans-serif" }}>
                        <div><span style={{ color: "#555" }}>Caller: </span><span style={{ color: "#ddd" }}>Mark Thompson</span></div>
                        <div><span style={{ color: "#555" }}>Phone: </span><span style={{ color: YELLOW, fontWeight: 700 }}>0412 xxx xxx</span></div>
                        <div><span style={{ color: "#555" }}>Enquiry: </span><span style={{ color: "#ddd" }}>3-bed house in Rooty Hill, budget $750K</span></div>
                        <div><span style={{ color: "#555" }}>Finance: </span><span style={{ color: "#4ade80" }}>Pre-approved ✓</span></div>
                        <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #222" }}>
                          <div style={{ color: "#555", marginBottom: 6, fontSize: 11 }}>TRANSCRIPT</div>
                          <div><span style={{ color: YELLOW }}>Sarah: </span><span style={{ color: "#777" }}>G'day, Ray White Rooty Hill, this is Sarah...</span></div>
                          <div><span style={{ color: "#aaa" }}>Mark: </span><span style={{ color: "#666" }}>Hi, I'm looking at a 3-bed in Rooty Hill...</span></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* App notification mockup */}
                  {step.mockup === "app" && (
                    <div style={{ maxWidth: 320 }}>
                      {/* Phone notification */}
                      <div style={{ background: "#1c1c1e", borderRadius: 16, padding: "14px 16px", marginBottom: 12, border: "1px solid #333", display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <div style={{ width: 42, height: 42, borderRadius: 10, background: YELLOW, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🎯</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 2 }}>New Lead — Sarah</div>
                          <div style={{ fontSize: 12, color: "#999", lineHeight: 1.5 }}>Mark Thompson called · Pre-approved buyer · 3bd Rooty Hill $750K · Tap to view full transcript</div>
                          <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>now · Ray White Rooty Hill</div>
                        </div>
                      </div>
                      {/* App lead card */}
                      <div style={{ background: "#111", border: `1px solid ${YELLOW}44`, borderRadius: 12, padding: "16px 18px" }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: YELLOW, letterSpacing: 2, marginBottom: 8 }}>COMMAND BRIDGE APP</div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <span style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>Mark Thompson</span>
                          <span style={{ background: "#4ade8022", color: "#4ade80", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>Pre-approved</span>
                        </div>
                        <div style={{ fontSize: 12, color: "#777", marginBottom: 10 }}>0412 xxx xxx · 3bd · Rooty Hill · $750K</div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <div style={{ flex: 1, background: YELLOW, color: BLACK, textAlign: "center", padding: "8px 0", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>📞 Call Back</div>
                          <div style={{ flex: 1, background: "#1e1e1e", color: "#aaa", textAlign: "center", padding: "8px 0", borderRadius: 6, fontSize: 12, fontWeight: 600, border: "1px solid #333", cursor: "pointer" }}>📄 Transcript</div>
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

      {/* FRANCHISE REASSURANCE */}
      <section style={{ background: "#0a0a0a", padding: "60px 32px", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: YELLOW, marginBottom: 16 }}>IMPORTANT — YOUR FRANCHISE IS UNTOUCHED</div>
          <h2 style={{ fontSize: 30, fontWeight: 800, color: "#fff", marginBottom: 20 }}>This doesn't change anything about your Ray White setup</h2>
          <p style={{ color: "#777", fontSize: 15, lineHeight: 1.8, marginBottom: 36 }}>
            Directive OS operates on a separate landing page — completely independent of your Ray White franchise, your main office listing, and your head office relationship. Nothing is changed on your existing website, your Ray White profile, or your franchise agreement.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, textAlign: "left" }}>
            {[
              { icon: "✅", label: "Your Ray White profile", status: "Untouched" },
              { icon: "✅", label: "Your franchise agreement", status: "Untouched" },
              { icon: "✅", label: "Your existing website", status: "Untouched" },
              { icon: "✅", label: "Your team's phones & email", status: "Untouched" },
              { icon: "✅", label: "Your VaultRE setup", status: "Untouched" },
              { icon: "🆕", label: "This landing page", status: "New addition" },
            ].map(item => (
              <div key={item.label} style={{ background: "#141414", border: "1px solid #222", borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{item.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#ccc", marginBottom: 3 }}>{item.label}</div>
                <div style={{ fontSize: 12, color: item.status === "New addition" ? YELLOW : "#4ade80", fontWeight: 700 }}>{item.status}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE CHAT DEMO */}
      <section id="chat-demo" style={{ background: "#f8f8f8", padding: "80px 32px", borderBottom: "1px solid #e5e5e5" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "#888", marginBottom: 16 }}>TRY IT NOW</div>
          <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 900, color: BLACK, marginBottom: 16 }}>Chat with Sarah right now</h2>
          <p style={{ color: "#666", fontSize: 15, lineHeight: 1.7, marginBottom: 40 }}>
            Click the chat button below — bottom right corner — and ask about a listing, a rental, or anything you'd expect a buyer to ask. This is exactly what your callers would experience.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={`tel:${PHONE.replace(/\s/g, "")}`} style={{
              background: BLACK, color: YELLOW, padding: "14px 32px",
              textDecoration: "none", fontSize: 16, fontWeight: 900, letterSpacing: 0.5,
              border: `3px solid ${YELLOW}`, display: "inline-block"
            }}>📞 Or Call — {PHONE}</a>
          </div>
          <p style={{ color: "#aaa", fontSize: 12, marginTop: 20 }}>Sarah answers calls 24/7 — try it after hours to see what your clients experience when no one's in the office.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: BLACK, borderTop: `3px solid ${YELLOW}`, padding: "32px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <RWLogo size={32} />
          <p style={{ color: "#555", fontSize: 12, marginTop: 16, lineHeight: 1.7 }}>
            This demo page is powered by{" "}
            <a href="https://directiveos.com.au" target="_blank" rel="noreferrer" style={{ color: YELLOW, textDecoration: "none", fontWeight: 700 }}>Directive OS</a>
            {" "}— AI Receptionist for Real Estate. The Ray White name and branding are property of Ray White (Real Estate) Ltd. This landing page is operated independently and is not affiliated with or endorsed by Ray White corporate.
          </p>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
}
