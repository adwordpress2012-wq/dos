import { useState, useRef, useEffect } from "react";

const RED = "#CC1414";
const RED_DARK = "#a00f0f";
const WHITE = "#ffffff";
const DARK_BG = "#0f0f0f";
const DARK_CARD = "#141414";
const PHONE = "02 5850 4038";
const API_BASE = "/api";

interface Message { role: "user" | "assistant"; content: string; }

function RWLogo({ size = 40 }: { size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{
        background: RED, padding: `${size * 0.12}px ${size * 0.22}px`,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <span style={{ fontWeight: 900, fontSize: size * 0.52, color: WHITE, letterSpacing: -1, lineHeight: 1 }}>R&amp;W</span>
      </div>
      <div>
        <div style={{ fontSize: size * 0.3, fontWeight: 800, color: WHITE, letterSpacing: 1, lineHeight: 1 }}>RICHARDSON &amp; WRENCH</div>
        <div style={{ fontSize: size * 0.2, fontWeight: 500, color: "#aaa", letterSpacing: 1, lineHeight: 1.4 }}>Rooty Hill &amp; Mt Druitt</div>
      </div>
    </div>
  );
}

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "G'day! I'm Sarah, the AI receptionist for Richardson & Wrench Rooty Hill & Mt Druitt. Thinking of buying, selling, or renting in Western Sydney? I'm here 24/7 — how can I help?" }
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
        body: JSON.stringify({ sessionId: sessionId.current, message: text, agencyName: "Richardson & Wrench Rooty Hill" }),
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
          background: DARK_BG, borderRadius: 6, boxShadow: `0 8px 40px rgba(204,20,20,0.25)`,
          border: `2px solid ${RED}`, display: "flex", flexDirection: "column", zIndex: 9999, overflow: "hidden"
        }}>
          <div style={{ background: RED, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ background: WHITE, padding: "4px 8px", fontWeight: 900, fontSize: 13, color: RED, flexShrink: 0 }}>R&amp;W</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: WHITE }}>Sarah — AI Receptionist</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)" }}>R&amp;W Rooty Hill · Always available</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ marginLeft: "auto", background: "none", border: "none", color: WHITE, fontSize: 22, cursor: "pointer", fontWeight: 700 }}>×</button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "82%", padding: "10px 14px", fontSize: 13, lineHeight: 1.55,
                  background: m.role === "user" ? RED : "#1e1e1e",
                  color: WHITE,
                  borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  border: m.role === "assistant" ? "1px solid #2a2a2a" : "none"
                }}>{m.content}</div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: 5, padding: "10px 14px", background: "#1e1e1e", borderRadius: "16px 16px 16px 4px", width: 60, border: "1px solid #2a2a2a" }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: RED, animation: `bounce 1s infinite ${i * 0.2}s` }} />
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div style={{ padding: "12px 14px", borderTop: "1px solid #222", display: "flex", gap: 8 }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Ask Sarah anything..."
              style={{ flex: 1, background: "#1a1a1a", border: "1px solid #333", borderRadius: 6, padding: "10px 12px", color: WHITE, fontSize: 13, outline: "none" }}
            />
            <button onClick={send} disabled={loading}
              style={{ background: RED, border: "none", borderRadius: 6, width: 42, cursor: "pointer", fontSize: 18, color: WHITE, display: "flex", alignItems: "center", justifyContent: "center" }}>→</button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(p => !p)} style={{
        position: "fixed", bottom: 24, right: 24, width: 64, height: 64, borderRadius: "50%",
        background: RED, border: "none", cursor: "pointer", zIndex: 9998,
        boxShadow: `0 4px 24px ${RED}88`, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        {open ? <span style={{ color: WHITE, fontSize: 28, fontWeight: 700 }}>×</span> : "💬"}
      </button>
      <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }`}</style>
    </>
  );
}

export default function RayWhiteRHPage() {
  return (
    <div style={{ minHeight: "100vh", background: WHITE, color: DARK_BG, fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* DEMO BANNER */}
      <div style={{
        background: DARK_BG, color: "#ccc", textAlign: "center",
        padding: "9px 16px", fontSize: 12, fontWeight: 500, letterSpacing: 0.4,
        borderBottom: `3px solid ${RED}`, position: "relative", zIndex: 200
      }}>
        <span style={{ background: RED, color: WHITE, padding: "2px 9px", fontWeight: 800, fontSize: 11, marginRight: 10, letterSpacing: 1 }}>DEMO</span>
        Built specifically for R&amp;W Rooty Hill — your existing website and franchise are completely untouched.{" "}
        <a href="https://directiveos.com.au" target="_blank" rel="noreferrer" style={{ color: RED, fontWeight: 700, textDecoration: "none" }}>Directive OS</a>
        {" "}runs this page independently.
      </div>

      {/* NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100, background: DARK_BG,
        borderBottom: `3px solid ${RED}`, padding: "0 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: 72,
        boxShadow: "0 2px 20px rgba(0,0,0,0.5)"
      }}>
        <RWLogo size={36} />
        <div style={{ display: "flex", gap: 28, fontSize: 14 }}>
          {["Buy", "Sell", "Rent", "About David"].map(l => (
            <a key={l} href="https://www.rw.com.au/" target="_blank" rel="noreferrer"
              style={{ color: "#aaa", textDecoration: "none", fontWeight: 500 }}
              onMouseOver={e => (e.currentTarget.style.color = RED)}
              onMouseOut={e => (e.currentTarget.style.color = "#aaa")}>{l}</a>
          ))}
        </div>
        <a href={`tel:${PHONE.replace(/\s/g, "")}`} style={{
          background: RED, color: WHITE, padding: "10px 22px",
          textDecoration: "none", fontSize: 14, fontWeight: 800, letterSpacing: 0.5
        }}>📞 {PHONE}</a>
      </nav>

      {/* HERO */}
      <section style={{
        position: "relative", overflow: "hidden",
        padding: "110px 32px 90px", textAlign: "center",
        background: `linear-gradient(160deg, ${DARK_BG} 0%, #1a0000 60%, ${DARK_BG} 100%)`,
        borderBottom: `1px solid #2a2a2a`
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: RED }} />
        <div style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${RED}22 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: 820, margin: "0 auto", position: "relative" }}>
          <div style={{
            display: "inline-block", background: `${RED}22`, border: `1px solid ${RED}55`,
            color: RED, padding: "6px 20px", fontSize: 12, fontWeight: 700,
            marginBottom: 28, letterSpacing: 3, textTransform: "uppercase"
          }}>
            AI Receptionist · Available 24/7
          </div>
          <h1 style={{ fontSize: "clamp(36px, 5.5vw, 64px)", fontWeight: 900, lineHeight: 1.05, marginBottom: 24, letterSpacing: -1.5, color: WHITE }}>
            Your Office Never<br />
            <span style={{ color: RED }}>Misses a Call Again.</span>
          </h1>
          <p style={{ fontSize: 19, color: "#bbb", lineHeight: 1.8, marginBottom: 16, maxWidth: 640, margin: "0 auto 16px" }}>
            Sarah is an AI receptionist built for R&amp;W Rooty Hill &amp; Mt Druitt. She answers every call to your office line — 24 hours a day — qualifies the enquiry, and sends David a notification the moment the call ends.
          </p>
          <p style={{ fontSize: 15, color: "#666", lineHeight: 1.7, marginBottom: 50, maxWidth: 560, margin: "0 auto 50px" }}>
            No voicemail. No missed leads. Just a full lead transcript in your inbox and a tap on your phone — every time.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={`tel:${PHONE.replace(/\s/g, "")}`} style={{
              background: RED, color: WHITE, padding: "16px 40px",
              textDecoration: "none", fontSize: 17, fontWeight: 900,
              boxShadow: `0 4px 28px ${RED}66`, letterSpacing: 0.5
            }}>📞 Call Sarah — {PHONE}</a>
            <button onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                background: "transparent", border: `2px solid ${RED}66`, color: "#eee",
                padding: "16px 40px", fontSize: 17, fontWeight: 700, cursor: "pointer", letterSpacing: 0.5
              }}>See How It Works ↓</button>
          </div>
          <p style={{ color: "#444", fontSize: 13, marginTop: 20 }}>
            Call the number now — Sarah answers live. Or scroll down to chat with her.
          </p>
        </div>
      </section>

      {/* DAVID STAT BAR */}
      <section style={{ background: RED, padding: "20px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
          <div style={{ color: WHITE, textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 900 }}>27 yrs</div>
            <div style={{ fontSize: 12, opacity: 0.85, fontWeight: 600 }}>Experience</div>
          </div>
          <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.3)" }} />
          <div style={{ color: WHITE, textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 900 }}>5.0 ⭐</div>
            <div style={{ fontSize: 12, opacity: 0.85, fontWeight: 600 }}>201 Reviews</div>
          </div>
          <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.3)" }} />
          <div style={{ color: WHITE, textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 900 }}>51</div>
            <div style={{ fontSize: 12, opacity: 0.85, fontWeight: 600 }}>Properties sold this year</div>
          </div>
          <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.3)" }} />
          <div style={{ color: WHITE, textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 900 }}>$1.01M</div>
            <div style={{ fontSize: 12, opacity: 0.85, fontWeight: 600 }}>Median sold price</div>
          </div>
          <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.3)" }} />
          <div style={{ color: WHITE, fontSize: 14, fontWeight: 700 }}>
            David Frendo<br />
            <span style={{ fontWeight: 500, opacity: 0.85, fontSize: 12 }}>Sales Manager · Auctioneer</span>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ background: DARK_BG, padding: "80px 32px", borderBottom: `1px solid #1e1e1e` }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: RED, marginBottom: 12 }}>HOW IT WORKS</div>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 900, color: WHITE, margin: 0 }}>
              What happens when someone calls the office
            </h2>
            <p style={{ color: "#666", fontSize: 15, marginTop: 14, maxWidth: 520, margin: "14px auto 0" }}>
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
                body: "\"G'day, Richardson & Wrench Rooty Hill, this is Sarah — how can I help?\" She qualifies the caller, answers questions about listings, books inspection times, handles rental enquiries. Sounds real, acts professional.",
              },
              {
                num: "03",
                icon: "📧",
                title: "Email lands in David's inbox immediately",
                body: "The second the call ends, a lead summary email hits your inbox. Caller's name, phone number, what they're looking for, their budget, finance status — and the full word-for-word transcript of the call.",
                mockup: "email",
              },
              {
                num: "04",
                icon: "🔔",
                title: "App notification straight to David's phone",
                body: "Your phone buzzes — even if you're at an auction or an inspection. Tap the notification to open the full lead in the app. You can see who called, what they said, and call them back with full context — not blind.",
                mockup: "app",
              },
            ].map((step, i) => (
              <div key={step.num} style={{ display: "flex", gap: 0, marginBottom: 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 80, flexShrink: 0 }}>
                  <div style={{ width: 54, height: 54, borderRadius: "50%", background: RED, color: WHITE, fontWeight: 900, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1 }}>{step.num}</div>
                  {i < 3 && <div style={{ width: 2, flex: 1, background: `linear-gradient(${RED}, ${RED}22)`, minHeight: 60 }} />}
                </div>
                <div style={{ flex: 1, paddingBottom: i < 3 ? 52 : 0, paddingLeft: 24, paddingTop: 12 }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{step.icon}</div>
                  <h3 style={{ fontSize: 21, fontWeight: 800, color: WHITE, margin: "0 0 10px" }}>{step.title}</h3>
                  <p style={{ fontSize: 15, color: "#888", lineHeight: 1.8, margin: "0 0 22px", maxWidth: 560 }}>{step.body}</p>

                  {step.mockup === "email" && (
                    <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 12, padding: "20px 24px", maxWidth: 520, fontFamily: "monospace" }}>
                      <div style={{ fontSize: 11, color: "#555", marginBottom: 16, borderBottom: "1px solid #222", paddingBottom: 12, fontFamily: "sans-serif" }}>
                        <div style={{ marginBottom: 3 }}><span style={{ color: "#555" }}>FROM: </span><span style={{ color: "#888" }}>leads@directiveos.com.au</span></div>
                        <div style={{ marginBottom: 8 }}><span style={{ color: "#555" }}>TO: </span><span style={{ color: "#888" }}>david@rwrootyhillmtdruitt.com.au</span></div>
                        <div style={{ color: RED, fontWeight: 700, fontSize: 13 }}>🔴 New Lead — Buyer Enquiry · Rooty Hill</div>
                      </div>
                      <div style={{ fontSize: 13, color: "#777", lineHeight: 2, fontFamily: "sans-serif" }}>
                        <div><span style={{ color: "#444" }}>Caller: </span><span style={{ color: "#ccc", fontWeight: 600 }}>Mark Thompson</span></div>
                        <div><span style={{ color: "#444" }}>Phone: </span><span style={{ color: RED, fontWeight: 700 }}>0412 xxx xxx</span></div>
                        <div><span style={{ color: "#444" }}>Enquiry: </span><span style={{ color: "#ccc" }}>3-bed house in Rooty Hill, budget $750K</span></div>
                        <div><span style={{ color: "#444" }}>Finance: </span><span style={{ color: "#4ade80", fontWeight: 700 }}>Pre-approved ✓</span></div>
                        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #222" }}>
                          <div style={{ color: "#444", marginBottom: 6, fontSize: 11, letterSpacing: 1 }}>TRANSCRIPT</div>
                          <div style={{ fontSize: 12 }}><span style={{ color: RED }}>Sarah: </span><span style={{ color: "#666" }}>G'day, Richardson & Wrench Rooty Hill, this is Sarah...</span></div>
                          <div style={{ fontSize: 12 }}><span style={{ color: "#888" }}>Mark: </span><span style={{ color: "#555" }}>Hi, I saw your listing in Rooty Hill...</span></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step.mockup === "app" && (
                    <div style={{ maxWidth: 300 }}>
                      <div style={{ background: "#1c1c1e", borderRadius: 16, padding: "14px 16px", marginBottom: 12, border: "1px solid #2a2a2a", display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <div style={{ width: 44, height: 44, borderRadius: 10, background: RED, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🎯</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: WHITE, marginBottom: 2 }}>New Lead — Sarah</div>
                          <div style={{ fontSize: 12, color: "#888", lineHeight: 1.55 }}>Mark Thompson called · Pre-approved · 3bd Rooty Hill $750K · Tap to view full transcript</div>
                          <div style={{ fontSize: 11, color: "#444", marginTop: 4 }}>now · R&amp;W Rooty Hill</div>
                        </div>
                      </div>
                      <div style={{ background: "#111", border: `1px solid ${RED}44`, borderRadius: 12, padding: "16px 18px" }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: RED, letterSpacing: 2, marginBottom: 8 }}>COMMAND BRIDGE APP</div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <span style={{ fontWeight: 700, color: WHITE, fontSize: 15 }}>Mark Thompson</span>
                          <span style={{ background: "#4ade8022", color: "#4ade80", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>Pre-approved</span>
                        </div>
                        <div style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>0412 xxx xxx · 3bd · Rooty Hill · $750K</div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <div style={{ flex: 1, background: RED, color: WHITE, textAlign: "center", padding: "9px 0", borderRadius: 6, fontSize: 12, fontWeight: 800, cursor: "pointer" }}>📞 Call Back</div>
                          <div style={{ flex: 1, background: "#1e1e1e", color: "#888", textAlign: "center", padding: "9px 0", borderRadius: 6, fontSize: 12, fontWeight: 600, border: "1px solid #2a2a2a", cursor: "pointer" }}>📄 Transcript</div>
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
      <section style={{ background: "#0a0a0a", padding: "64px 32px", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: RED, marginBottom: 16 }}>IMPORTANT — YOUR R&amp;W SETUP IS UNTOUCHED</div>
          <h2 style={{ fontSize: 30, fontWeight: 800, color: WHITE, marginBottom: 18 }}>
            This doesn't change anything about your Richardson &amp; Wrench franchise
          </h2>
          <p style={{ color: "#666", fontSize: 15, lineHeight: 1.8, marginBottom: 36, maxWidth: 600, margin: "0 auto 36px" }}>
            Directive OS runs on a separate branded landing page — completely independent of your R&amp;W franchise, your head office, and your existing website. Nothing is touched, moved, or changed. It's simply an addition.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, textAlign: "left" }}>
            {[
              { icon: "✅", label: "Your R&W franchise", status: "Untouched" },
              { icon: "✅", label: "Your head office relationship", status: "Untouched" },
              { icon: "✅", label: "Your existing website", status: "Untouched" },
              { icon: "✅", label: "Your team's phones & email", status: "Untouched" },
              { icon: "✅", label: "Your realestate.com.au profile", status: "Untouched" },
              { icon: "🆕", label: "This landing page", status: "New addition only" },
            ].map(item => (
              <div key={item.label} style={{ background: DARK_CARD, border: "1px solid #1e1e1e", borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{item.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#aaa", marginBottom: 3 }}>{item.label}</div>
                <div style={{ fontSize: 11, color: item.status === "New addition only" ? RED : "#4ade80", fontWeight: 700 }}>{item.status}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE CHAT DEMO */}
      <section id="chat-demo" style={{ background: "#f7f7f7", padding: "80px 32px", borderBottom: "1px solid #e5e5e5" }}>
        <div style={{ maxWidth: 660, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "#999", marginBottom: 16 }}>TRY IT NOW</div>
          <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 900, color: DARK_BG, marginBottom: 16 }}>Talk to Sarah yourself</h2>
          <p style={{ color: "#666", fontSize: 15, lineHeight: 1.75, marginBottom: 36 }}>
            Hit the chat button at the bottom right and ask about a listing, a price appraisal, or anything a buyer would say. Or ring the number and talk to her live — she answers 24/7.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={`tel:${PHONE.replace(/\s/g, "")}`} style={{
              background: RED, color: WHITE, padding: "14px 36px",
              textDecoration: "none", fontSize: 16, fontWeight: 900,
              boxShadow: `0 4px 20px ${RED}55`, display: "inline-block"
            }}>📞 Call Sarah — {PHONE}</a>
          </div>
          <p style={{ color: "#bbb", fontSize: 12, marginTop: 18 }}>Try it after hours — that's when your competitors' phones go to voicemail.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: DARK_BG, borderTop: `3px solid ${RED}`, padding: "32px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <RWLogo size={30} />
          <p style={{ color: "#444", fontSize: 12, marginTop: 18, lineHeight: 1.8 }}>
            This demo page is independently powered by{" "}
            <a href="https://directiveos.com.au" target="_blank" rel="noreferrer" style={{ color: RED, textDecoration: "none", fontWeight: 700 }}>Directive OS</a>
            {" "}— AI Receptionist for Real Estate. Richardson &amp; Wrench name and branding are property of Richardson &amp; Wrench Ltd. This landing page is not affiliated with or endorsed by Richardson &amp; Wrench corporate.
          </p>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
}
