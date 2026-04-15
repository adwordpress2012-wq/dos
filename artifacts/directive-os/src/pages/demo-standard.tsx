import { useState, useRef, useEffect } from "react";

const TEAL = "#00d1b2";
const TEAL_DARK = "#00a896";
const BG = "#07090f";
const CARD = "#0d1017";
const BORDER = "#1a2030";
const WHITE = "#ffffff";
const SLATE = "#94a3b8";
const PHONE = "02 5850 4038";
const API_BASE = "/api";

interface Message { role: "user" | "assistant"; content: string; }

function DOSLogo({ size = 36 }: { size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: size, height: size, borderRadius: size * 0.22,
        background: `linear-gradient(135deg, ${TEAL} 0%, #0891b2 100%)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 900, fontSize: size * 0.44, color: BG, flexShrink: 0,
        boxShadow: `0 0 ${size * 0.5}px ${TEAL}44`
      }}>D</div>
      <div>
        <div style={{ fontSize: size * 0.36, fontWeight: 800, color: WHITE, letterSpacing: 0.5, lineHeight: 1 }}>Directive OS</div>
        <div style={{ fontSize: size * 0.2, fontWeight: 500, color: TEAL, letterSpacing: 1.5, textTransform: "uppercase", lineHeight: 1.4 }}>AI Receptionist</div>
      </div>
    </div>
  );
}

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "G'day! I'm Sarah — a 24/7 AI receptionist for real estate agencies. I answer calls, qualify buyers and tenants, book inspections, and send lead summaries straight to the agent. What would you like to know?" }
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
      setMessages(p => [...p, { role: "assistant", content: data.message || data.reply || `Give us a call on ${PHONE} and Sarah will answer live.` }]);
    } catch {
      setMessages(p => [...p, { role: "assistant", content: `Something went wrong — call ${PHONE} to talk to Sarah live.` }]);
    }
    setLoading(false);
  }

  return (
    <>
      {open && (
        <div style={{
          position: "fixed", bottom: 90, right: 24, width: 360, height: 500,
          background: CARD, borderRadius: 16, boxShadow: `0 8px 48px rgba(0,209,178,0.18)`,
          border: `1.5px solid ${TEAL}55`, display: "flex", flexDirection: "column", zIndex: 9999, overflow: "hidden"
        }}>
          <div style={{ background: `linear-gradient(90deg, ${TEAL_DARK}, #0891b2)`, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, color: TEAL, flexShrink: 0 }}>D</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: WHITE }}>Sarah — AI Receptionist</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)" }}>Directive OS · Live demo</div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 6px #4ade80" }} />
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>Live</span>
            </div>
            <button onClick={() => setOpen(false)} style={{ marginLeft: 8, background: "none", border: "none", color: WHITE, fontSize: 22, cursor: "pointer", fontWeight: 700 }}>×</button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "82%", padding: "10px 14px", fontSize: 13, lineHeight: 1.6,
                  background: m.role === "user" ? TEAL : "#161c28",
                  color: m.role === "user" ? BG : "#ddd",
                  borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  border: m.role === "assistant" ? `1px solid ${BORDER}` : "none",
                  fontWeight: m.role === "user" ? 600 : 400,
                }}>{m.content}</div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: 5, padding: "12px 14px", background: "#161c28", borderRadius: "16px 16px 16px 4px", width: 64, border: `1px solid ${BORDER}` }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: TEAL, animation: `bounce 1s infinite ${i * 0.18}s` }} />
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
              style={{ flex: 1, background: "#0a0f1a", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 12px", color: WHITE, fontSize: 13, outline: "none" }}
            />
            <button onClick={send} disabled={loading}
              style={{ background: TEAL, border: "none", borderRadius: 8, width: 42, cursor: "pointer", fontSize: 18, color: BG, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>→</button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(p => !p)} style={{
        position: "fixed", bottom: 24, right: 24, width: 64, height: 64, borderRadius: "50%",
        background: `linear-gradient(135deg, ${TEAL}, #0891b2)`, border: "none", cursor: "pointer", zIndex: 9998,
        boxShadow: `0 4px 28px ${TEAL}66`, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        {open ? <span style={{ color: BG, fontSize: 28, fontWeight: 700 }}>×</span> : "💬"}
      </button>
      <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }`}</style>
    </>
  );
}

export default function DemoStandardPage() {
  return (
    <div style={{ minHeight: "100vh", background: BG, color: WHITE, fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* TOP BAR */}
      <div style={{
        background: `${TEAL}12`, borderBottom: `1px solid ${TEAL}33`,
        padding: "9px 20px", fontSize: 12, fontWeight: 500, color: SLATE,
        textAlign: "center", letterSpacing: 0.4
      }}>
        <span style={{ background: TEAL, color: BG, padding: "2px 9px", fontWeight: 800, fontSize: 11, marginRight: 10, borderRadius: 4, letterSpacing: 1 }}>LIVE DEMO</span>
        This is a standard demo — we build your agency a custom version with{" "}
        <span style={{ color: TEAL, fontWeight: 700 }}>your branding, your name, and your listings</span>.{" "}
        <a href="https://directiveos.com.au" style={{ color: TEAL, textDecoration: "none", fontWeight: 600 }}>See how →</a>
      </div>

      {/* NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100, background: "rgba(7,9,15,0.95)",
        backdropFilter: "blur(12px)", borderBottom: `1px solid ${BORDER}`,
        padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68,
      }}>
        <DOSLogo size={34} />
        <div style={{ display: "flex", gap: 32, fontSize: 14 }}>
          {[
            { label: "How It Works", href: "#how-it-works" },
            { label: "Try Sarah", href: "#try-sarah" },
            { label: "For Your Agency", href: "#for-your-agency" },
          ].map(l => (
            <a key={l.label} href={l.href}
              style={{ color: SLATE, textDecoration: "none", fontWeight: 500 }}
              onMouseOver={e => (e.currentTarget.style.color = TEAL)}
              onMouseOut={e => (e.currentTarget.style.color = SLATE)}>{l.label}</a>
          ))}
        </div>
        <a href={`tel:${PHONE.replace(/\s/g, "")}`} style={{
          background: TEAL, color: BG, padding: "10px 22px", borderRadius: 8,
          textDecoration: "none", fontSize: 14, fontWeight: 800
        }}>📞 {PHONE}</a>
      </nav>

      {/* HERO */}
      <section style={{
        position: "relative", overflow: "hidden",
        padding: "120px 40px 100px", textAlign: "center",
      }}>
        <div style={{ position: "absolute", top: -120, left: "50%", transform: "translateX(-50%)", width: 700, height: 700, borderRadius: "50%", background: `radial-gradient(circle, ${TEAL}14 0%, transparent 68%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${TEAL}, transparent)` }} />
        <div style={{ maxWidth: 820, margin: "0 auto", position: "relative" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: `${TEAL}14`, border: `1px solid ${TEAL}44`,
            color: TEAL, padding: "7px 20px", borderRadius: 100, fontSize: 12, fontWeight: 700,
            marginBottom: 32, letterSpacing: 2, textTransform: "uppercase"
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 6px #4ade80" }} />
            AI Receptionist · Live right now
          </div>
          <h1 style={{ fontSize: "clamp(38px, 6vw, 70px)", fontWeight: 900, lineHeight: 1.04, marginBottom: 26, letterSpacing: -2, color: WHITE }}>
            Your Office Phone.<br />
            <span style={{ color: TEAL }}>Answered. Every Time.</span>
          </h1>
          <p style={{ fontSize: 19, color: SLATE, lineHeight: 1.8, marginBottom: 14, maxWidth: 620, margin: "0 auto 14px" }}>
            Sarah is a 24/7 AI receptionist built specifically for real estate agencies. She answers every call, qualifies every lead, and puts the details in your pocket — before you've even looked at your phone.
          </p>
          <p style={{ fontSize: 14, color: "#4a5568", lineHeight: 1.7, marginBottom: 52, maxWidth: 480, margin: "0 auto 52px" }}>
            Built for Australian agencies of all sizes. Fully branded to match your agency — colours, name, tone, everything.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={`tel:${PHONE.replace(/\s/g, "")}`} style={{
              background: TEAL, color: BG, padding: "17px 44px", borderRadius: 10,
              textDecoration: "none", fontSize: 17, fontWeight: 900,
              boxShadow: `0 4px 32px ${TEAL}55`, letterSpacing: 0.3
            }}>📞 Call Sarah — {PHONE}</a>
            <button onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                background: "transparent", border: `1.5px solid ${BORDER}`, color: SLATE,
                padding: "17px 44px", borderRadius: 10, fontSize: 17, fontWeight: 600, cursor: "pointer",
              }}
              onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = TEAL; (e.currentTarget as HTMLButtonElement).style.color = WHITE; }}
              onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = BORDER; (e.currentTarget as HTMLButtonElement).style.color = SLATE; }}>
              See How It Works ↓
            </button>
          </div>
          <p style={{ color: "#2d3748", fontSize: 12, marginTop: 22 }}>
            Call the number right now — Sarah answers live, 24/7. No scripts, no voicemail.
          </p>
        </div>
      </section>

      {/* STATS STRIP */}
      <section style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, padding: "28px 40px", background: CARD }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "center", gap: 60, flexWrap: "wrap" }}>
          {[
            { value: "< 3 sec", label: "Time to answer" },
            { value: "24/7", label: "Always available" },
            { value: "100%", label: "Calls answered" },
            { value: "60 sec", label: "Lead in your inbox" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: TEAL }}>{s.value}</div>
              <div style={{ fontSize: 12, color: SLATE, fontWeight: 500, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: "90px 40px", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 70 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: TEAL, marginBottom: 14 }}>HOW IT WORKS</div>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 46px)", fontWeight: 900, color: WHITE, margin: "0 0 14px" }}>
              What happens when someone calls your office
            </h2>
            <p style={{ color: SLATE, fontSize: 15, maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
              The whole thing is automatic. You don't change anything about how your office runs.
            </p>
          </div>

          <div style={{ display: "grid", gap: 0 }}>
            {[
              {
                num: "01",
                icon: "📞",
                title: "Someone calls your office line",
                body: "A buyer, a vendor, a tenant — they ring your office. Could be during an inspection, after hours, Sunday night. It doesn't matter. Sarah picks up in under 3 seconds. No voicemail. No missed call.",
              },
              {
                num: "02",
                icon: "🤖",
                title: "Sarah handles the whole call",
                body: "\"G'day, [Your Agency] — this is Sarah, how can I help?\" She chats naturally, qualifies the enquiry, answers questions about listings, books inspections, handles rental enquiries. Sounds like a real person. Acts like a great receptionist.",
              },
              {
                num: "03",
                icon: "📧",
                title: "Email straight to your inbox — immediately",
                body: "The second the call ends, a lead summary hits your email. Caller name, phone number, what they're after, their budget, finance status — and the full word-for-word transcript of the call. Nothing missed.",
                mockup: "email",
              },
              {
                num: "04",
                icon: "🔔",
                title: "Push notification on your phone",
                body: "Your phone buzzes with a tap notification. Open it and you see the full lead card — who called, what they want, whether they're finance-approved. Hit \"Call Back\" and you're on the front foot before they've called anyone else.",
                mockup: "app",
              },
            ].map((step, i) => (
              <div key={step.num} style={{ display: "flex", gap: 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 80, flexShrink: 0 }}>
                  <div style={{
                    width: 54, height: 54, borderRadius: "50%",
                    background: `linear-gradient(135deg, ${TEAL}22, ${TEAL}44)`,
                    border: `2px solid ${TEAL}66`,
                    color: TEAL, fontWeight: 900, fontSize: 16,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1
                  }}>{step.num}</div>
                  {i < 3 && <div style={{ width: 1, flex: 1, background: `linear-gradient(${TEAL}44, transparent)`, minHeight: 60 }} />}
                </div>
                <div style={{ flex: 1, paddingBottom: i < 3 ? 56 : 0, paddingLeft: 28, paddingTop: 12 }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{step.icon}</div>
                  <h3 style={{ fontSize: 21, fontWeight: 800, color: WHITE, margin: "0 0 10px" }}>{step.title}</h3>
                  <p style={{ fontSize: 15, color: SLATE, lineHeight: 1.8, margin: "0 0 24px", maxWidth: 560 }}>{step.body}</p>

                  {step.mockup === "email" && (
                    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "22px 26px", maxWidth: 520 }}>
                      <div style={{ fontSize: 11, color: "#3a4a5a", marginBottom: 16, borderBottom: `1px solid ${BORDER}`, paddingBottom: 14 }}>
                        <div style={{ marginBottom: 3 }}><span style={{ color: "#2d3748" }}>FROM: </span><span style={{ color: "#4a5568" }}>leads@directiveos.com.au</span></div>
                        <div style={{ marginBottom: 10 }}><span style={{ color: "#2d3748" }}>TO: </span><span style={{ color: "#4a5568" }}>you@youragency.com.au</span></div>
                        <div style={{ color: TEAL, fontWeight: 700, fontSize: 13 }}>🎯 New Lead — Buyer Enquiry · Rooty Hill</div>
                      </div>
                      <div style={{ fontSize: 13, lineHeight: 2 }}>
                        <div><span style={{ color: "#3a4a5a" }}>Caller: </span><span style={{ color: "#cdd8e8", fontWeight: 600 }}>Mark Thompson</span></div>
                        <div><span style={{ color: "#3a4a5a" }}>Phone: </span><span style={{ color: TEAL, fontWeight: 700 }}>0412 xxx xxx</span></div>
                        <div><span style={{ color: "#3a4a5a" }}>Enquiry: </span><span style={{ color: "#a0aec0" }}>3-bed house, budget $750K</span></div>
                        <div><span style={{ color: "#3a4a5a" }}>Finance: </span><span style={{ color: "#4ade80", fontWeight: 700 }}>Pre-approved ✓</span></div>
                        <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${BORDER}` }}>
                          <div style={{ fontSize: 10, letterSpacing: 1.5, color: "#2d3748", marginBottom: 8, fontWeight: 700 }}>FULL TRANSCRIPT</div>
                          <div style={{ fontSize: 12, color: "#2d3748" }}><span style={{ color: TEAL }}>Sarah: </span>G'day, this is Sarah — how can I help?</div>
                          <div style={{ fontSize: 12, color: "#2d3748" }}><span style={{ color: "#4a5568" }}>Mark: </span>Hi, I'm looking at a 3-bed in the area...</div>
                          <div style={{ fontSize: 12, color: "#1a2030", fontStyle: "italic", marginTop: 4 }}>+ full conversation below...</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step.mockup === "app" && (
                    <div style={{ maxWidth: 300 }}>
                      {/* Push notification */}
                      <div style={{ background: "#1c1c1e", borderRadius: 16, padding: "14px 16px", marginBottom: 12, border: `1px solid ${BORDER}`, display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <div style={{ width: 44, height: 44, borderRadius: 11, background: `linear-gradient(135deg, ${TEAL}, #0891b2)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🎯</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: WHITE, marginBottom: 3 }}>New Lead — Sarah answered</div>
                          <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.55 }}>Mark Thompson · Pre-approved buyer · 3bd $750K · Tap to view</div>
                          <div style={{ fontSize: 11, color: "#374151", marginTop: 5 }}>just now · Directive OS</div>
                        </div>
                      </div>
                      {/* App lead card */}
                      <div style={{ background: "#0d1017", border: `1px solid ${TEAL}33`, borderRadius: 14, padding: "18px 20px" }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: TEAL, letterSpacing: 2, marginBottom: 10 }}>COMMAND BRIDGE APP</div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <span style={{ fontWeight: 800, color: WHITE, fontSize: 15 }}>Mark Thompson</span>
                          <span style={{ background: "#4ade8018", color: "#4ade80", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, border: "1px solid #4ade8033" }}>Pre-approved</span>
                        </div>
                        <div style={{ fontSize: 12, color: "#4a5568", marginBottom: 14 }}>0412 xxx xxx · 3bd · $750K budget</div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <div style={{ flex: 1, background: TEAL, color: BG, textAlign: "center", padding: "10px 0", borderRadius: 8, fontSize: 12, fontWeight: 900, cursor: "pointer" }}>📞 Call Back</div>
                          <div style={{ flex: 1, background: CARD, color: SLATE, textAlign: "center", padding: "10px 0", borderRadius: 8, fontSize: 12, fontWeight: 600, border: `1px solid ${BORDER}`, cursor: "pointer" }}>📄 Transcript</div>
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

      {/* TRY SARAH */}
      <section id="try-sarah" style={{ background: CARD, padding: "80px 40px", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 660, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: TEAL, marginBottom: 16 }}>TRY IT NOW — NO SIGN UP</div>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 900, color: WHITE, marginBottom: 16 }}>Talk to Sarah yourself</h2>
          <p style={{ color: SLATE, fontSize: 15, lineHeight: 1.75, marginBottom: 36 }}>
            Open the chat widget at the bottom right and ask her anything a buyer or tenant would ask. Or ring the number and have a full conversation with her live — she answers every call, around the clock.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={`tel:${PHONE.replace(/\s/g, "")}`} style={{
              background: TEAL, color: BG, padding: "15px 38px", borderRadius: 10,
              textDecoration: "none", fontSize: 16, fontWeight: 900,
              boxShadow: `0 4px 24px ${TEAL}44`
            }}>📞 Call Sarah — {PHONE}</a>
            <button
              onClick={() => {
                const btn = document.querySelector<HTMLButtonElement>('button[data-chat-toggle]');
                if (btn) btn.click();
                else document.querySelector<HTMLButtonElement>('.chat-toggle-btn')?.click();
              }}
              style={{
                background: "transparent", border: `1.5px solid ${BORDER}`, color: SLATE,
                padding: "15px 38px", borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: "pointer"
              }}>💬 Chat with Sarah ↗</button>
          </div>
          <p style={{ color: "#2d3748", fontSize: 12, marginTop: 18 }}>
            Try it at night or on the weekend — that's when most agencies miss their best leads.
          </p>
        </div>
      </section>

      {/* FOR YOUR AGENCY */}
      <section id="for-your-agency" style={{ padding: "80px 40px", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: TEAL, marginBottom: 14 }}>YOUR BRANDED VERSION</div>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 900, color: WHITE, marginBottom: 14 }}>
              We build it in your agency's brand
            </h2>
            <p style={{ color: SLATE, fontSize: 15, maxWidth: 520, margin: "0 auto", lineHeight: 1.75 }}>
              This is a standard demo. Your version comes with your logo, your colours, your office name — and Sarah introduced as your own receptionist. Clients never know she's AI.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            {[
              { icon: "🎨", title: "Your branding", body: "Your agency colours, logo, and tone. Sarah introduces herself as your receptionist, not ours." },
              { icon: "🏘️", title: "Your suburbs", body: "Sarah knows your area, your listings, your common enquiry types. Set up for your patch." },
              { icon: "📱", title: "Your notifications", body: "Leads land in your inbox and on your phone — in real time. No dashboard to check, no delays." },
              { icon: "🔗", title: "Your own landing page", body: "A dedicated URL you can share, put on signboards, and link from your REA profile." },
              { icon: "🗣️", title: "Your agent names", body: "Sarah can direct enquiries to specific agents or principals. Fully configurable." },
              { icon: "⚙️", title: "Setup in 48 hours", body: "We handle everything. You test it, approve it, and it goes live. No tech knowledge needed." },
            ].map(item => (
              <div key={item.title} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "22px 20px" }}
                onMouseOver={e => (e.currentTarget.style.borderColor = `${TEAL}55`)}
                onMouseOut={e => (e.currentTarget.style.borderColor = BORDER)}>
                <div style={{ fontSize: 26, marginBottom: 10 }}>{item.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: WHITE, marginBottom: 7 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: SLATE, lineHeight: 1.7 }}>{item.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "90px 40px", textAlign: "center", background: CARD }}>
        <div style={{ maxWidth: 580, margin: "0 auto" }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: `${TEAL}18`, border: `1.5px solid ${TEAL}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 28px" }}>🎯</div>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 900, color: WHITE, marginBottom: 16 }}>
            Ready to see your version?
          </h2>
          <p style={{ color: SLATE, fontSize: 15, lineHeight: 1.75, marginBottom: 40 }}>
            We'll put together a branded demo for your agency — free, no commitment. You'll see exactly what your buyers would experience when they call your office.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={`tel:${PHONE.replace(/\s/g, "")}`} style={{
              background: TEAL, color: BG, padding: "16px 40px", borderRadius: 10,
              textDecoration: "none", fontSize: 16, fontWeight: 900,
              boxShadow: `0 4px 28px ${TEAL}55`
            }}>📞 Call — {PHONE}</a>
            <a href="mailto:jayson@directiveos.com.au" style={{
              background: "transparent", border: `1.5px solid ${BORDER}`, color: SLATE,
              padding: "16px 40px", borderRadius: 10, textDecoration: "none", fontSize: 16, fontWeight: 600
            }}>✉️ Email Jayson</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: BG, borderTop: `1px solid ${BORDER}`, padding: "32px 40px", textAlign: "center" }}>
        <DOSLogo size={28} />
        <p style={{ color: "#1e2a3a", fontSize: 12, marginTop: 16, lineHeight: 1.8 }}>
          © 2025 Directive OS Australia · ABN 87 754 544 171 · directiveos.com.au
          <br />AI Receptionist for Australian Real Estate Agencies · All rights reserved.
        </p>
      </footer>

      <ChatWidget />
    </div>
  );
}
