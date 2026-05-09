import { useState, useRef } from "react";
import { Link } from "wouter";
import { AppLayout } from "@/components/layout/MarketingLayout";
import {
  Phone, MessageSquare, Zap, Shield, Building2, FileText,
  ArrowRight, Check, X, Send, Star,
  Workflow, BrainCircuit, CalendarCheck, Bell, Lock, ChevronRight,
  Bed, Bath, Mail, Inbox, Smartphone, Globe
} from "lucide-react";

const API_WIDGET = import.meta.env.VITE_API_BASE_URL ?? "";

const CALENDLY_DEMO = "https://calendly.com/adwordpress2012/directive-os-agency-onboarding";
const MICAH_PHONE_DISPLAY = "02 5950 6382";
const MICAH_PHONE_LINK = "tel:0259506382";

/** Instant quote estimates — DFY positioning */
function estimateQuote(answers: {
  website_rebuild: boolean;
  ai_receptionist: boolean;
  sms: boolean;
  whatsapp: boolean;
  ai_voice: boolean;
  booking_system: boolean;
  hosting: boolean;
}) {
  let setup = 800;
  let monthly = 197;
  if (answers.ai_receptionist || answers.sms || answers.whatsapp || answers.booking_system) monthly = 297;
  if (answers.ai_voice) monthly = 497;
  if (answers.website_rebuild) setup += 1000;
  if (answers.hosting) setup += 200;
  if (answers.ai_voice) setup += 400;
  if (answers.booking_system) setup += 350;
  return { setup, monthly };
}

function InstantAiQuote() {
  const [businessType, setBusinessType] = useState("");
  const [websiteRebuild, setWebsiteRebuild] = useState(false);
  const [aiReceptionist, setAiReceptionist] = useState(true);
  const [sms, setSms] = useState(false);
  const [whatsapp, setWhatsapp] = useState(false);
  const [aiVoice, setAiVoice] = useState(false);
  const [booking, setBooking] = useState(true);
  const [hosting, setHosting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bizName, setBizName] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setup, monthly } = estimateQuote({
    website_rebuild: websiteRebuild,
    ai_receptionist: aiReceptionist,
    sms,
    whatsapp,
    ai_voice: aiVoice,
    booking_system: booking,
    hosting,
  });

  const submit = async () => {
    setLoading(true);
    try {
      await fetch(`${API_WIDGET}/api/widget/instant-quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_type: businessType,
          website_rebuild: websiteRebuild,
          ai_receptionist: aiReceptionist,
          sms,
          whatsapp,
          ai_voice: aiVoice,
          booking_system: booking,
          hosting,
          name,
          email,
          phone,
          business_name: bizName,
          estimated_setup_aud: setup,
          estimated_monthly_aud: monthly,
        }),
      });
      setSent(true);
    } catch {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <section id="instant-quote" className="py-20 border-t border-border">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <div className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#a855f7" }}>
            Instant AI Business Quote
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Scope your system in two minutes</h2>
          <p className="text-muted-foreground text-lg">
            Tick what you need — we show a ballpark setup fee and monthly plan before you talk to us.
          </p>
        </div>

        <div
          className="rounded-2xl p-8 space-y-6"
          style={{
            background: "rgba(124,58,237,0.06)",
            border: "1px solid rgba(168,85,247,0.25)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Business type</label>
            <input
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              placeholder="e.g. Hair salon, plumber, clinic"
              className="w-full rounded-xl px-4 py-3 text-sm bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer border border-white/10 bg-white/[0.03]">
              <input type="checkbox" checked={websiteRebuild} onChange={(e) => setWebsiteRebuild(e.target.checked)} className="accent-purple-600" />
              <span className="text-sm text-foreground">Website rebuild</span>
            </label>
            <label className="flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer border border-white/10 bg-white/[0.03]">
              <input type="checkbox" checked={aiReceptionist} onChange={(e) => setAiReceptionist(e.target.checked)} className="accent-purple-600" />
              <span className="text-sm text-foreground">AI receptionist (chat)</span>
            </label>
            <label className="flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer border border-white/10 bg-white/[0.03]">
              <input type="checkbox" checked={sms} onChange={(e) => setSms(e.target.checked)} className="accent-purple-600" />
              <span className="text-sm text-foreground">SMS automation</span>
            </label>
            <label className="flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer border border-white/10 bg-white/[0.03]">
              <input type="checkbox" checked={whatsapp} onChange={(e) => setWhatsapp(e.target.checked)} className="accent-purple-600" />
              <span className="text-sm text-foreground">WhatsApp</span>
            </label>
            <label className="flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer border border-white/10 bg-white/[0.03]">
              <input type="checkbox" checked={aiVoice} onChange={(e) => setAiVoice(e.target.checked)} className="accent-purple-600" />
              <span className="text-sm text-foreground">AI voice receptionist</span>
            </label>
            <label className="flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer border border-white/10 bg-white/[0.03]">
              <input type="checkbox" checked={booking} onChange={(e) => setBooking(e.target.checked)} className="accent-purple-600" />
              <span className="text-sm text-foreground">Booking system</span>
            </label>
            <label className="flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer border border-white/10 bg-white/[0.03]">
              <input type="checkbox" checked={hosting} onChange={(e) => setHosting(e.target.checked)} className="accent-purple-600" />
              <span className="text-sm text-foreground">Hosting</span>
            </label>
          </div>

          <div className="rounded-xl p-6 grid md:grid-cols-2 gap-6" style={{ background: "rgba(20,184,166,0.08)", border: "1px solid rgba(20,184,166,0.2)" }}>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Estimated setup fee</div>
              <div className="text-3xl font-bold text-foreground">From ${setup.toLocaleString()} AUD</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Estimated monthly plan</div>
              <div className="text-3xl font-bold" style={{ color: "#a855f7" }}>
                From ${monthly}/mo
              </div>
            </div>
            <p className="md:col-span-2 text-xs text-muted-foreground">
              Website rebuilds typically from $1,000+ depending on scope. Final numbers confirmed on your free demo call.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="rounded-xl px-4 py-3 text-sm bg-white/5 border border-white/10"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              className="rounded-xl px-4 py-3 text-sm bg-white/5 border border-white/10"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
              className="rounded-xl px-4 py-3 text-sm bg-white/5 border border-white/10"
            />
            <input
              value={bizName}
              onChange={(e) => setBizName(e.target.value)}
              placeholder="Business name"
              className="rounded-xl px-4 py-3 text-sm bg-white/5 border border-white/10"
            />
          </div>

          {sent ? (
            <p className="text-center text-emerald-400 font-medium">Thanks — your quote request is saved and our team will follow up shortly.</p>
          ) : (
            <button
              type="button"
              disabled={loading || !email.trim()}
              onClick={() => void submit()}
              className="w-full font-bold py-3.5 rounded-xl transition-all hover:opacity-95 disabled:opacity-40"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                color: "#fff",
              }}
            >
              {loading ? "Sending…" : "Submit quote request"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

interface Message { role: "assistant" | "user"; content: string; }

function DemoChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "G'day — I'm Micah from Directive OS. We install done-for-you AI booking and communication systems for small businesses. What kind of business are you running?",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const send = async () => {
    if (!input.trim() || typing) return;
    const userMsg = input.trim();
    const prior = messages;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setTyping(true);
    try {
      const res = await fetch(`${API_WIDGET}/api/widget/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: "dos-hub",
          message: userMsg,
          messages: prior.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = typeof data.reply === "string" ? data.reply : "Let me connect you — book a free call at directiveos.com.au/contact.";
      const words = reply.trim().split(/\s+/).length;
      await new Promise((r) => setTimeout(r, Math.min(2200, Math.max(600, words * 28))));
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch {
      await new Promise((r) => setTimeout(r, 600));
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            `I'm having a moment — please email support@directiveos.com.au or call ${MICAH_PHONE_DISPLAY} and we'll help right away.`,
        },
      ]);
    }
    setTyping(false);
  };

  return (
    <>
      <button
        type="button"
        id="dos-micah-chat-launcher"
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-24 right-6 z-[60] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110"
        style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)", boxShadow: "0 4px 24px rgba(124,58,237,0.45)" }}
      >
        {open ? <X className="w-5 h-5 text-white" /> : <MessageSquare className="w-6 h-6 text-white" />}
      </button>

      {open && (
        <div className="fixed bottom-44 right-6 z-[60] w-[340px] sm:w-[380px] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{ background: "rgba(13,17,23,0.97)", border: "1px solid rgba(168,85,247,0.35)", backdropFilter: "blur(20px)" }}>
          <div className="px-4 py-3 flex items-center justify-between"
            style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(236,72,153,0.08))", borderBottom: "1px solid rgba(168,85,247,0.2)" }}>
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#a855f7", boxShadow: "0 0 8px #a855f7" }} />
              <div>
                <div className="text-sm font-semibold text-foreground">Micah · Directive OS</div>
                <div className="text-xs text-muted-foreground">DFY AI Business Systems · Chat</div>
                <div className="flex items-center gap-1 mt-1 flex-wrap">
                  {[["🇦🇺","EN"],["🇨🇳","中文"],["🇵🇭","FIL"],["🇷🇺","РУС"],["🇸🇦","عربي"],["🇰🇷","한국어"],["🇻🇳","Việt"],["🇮🇳","हिंदी"],["🇪🇸","ESP"]].map(([flag, lang]) => (
                    <span key={lang} style={{ fontSize: 9, background: "rgba(124,58,237,0.15)", border: "1px solid rgba(168,85,247,0.35)", color: "#c4b5fd", borderRadius: 4, padding: "1px 5px", fontWeight: 600, letterSpacing: 0.3, whiteSpace: "nowrap" }}>{flag} {lang}</span>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 p-4 space-y-3 max-h-72 overflow-y-auto">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "text-white font-medium"
                    : "text-foreground"
                }`}
                  style={msg.role === "user"
                    ? { background: "linear-gradient(135deg, #7c3aed, #9333ea)" }
                    : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }
                  }>
                  {msg.content}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="rounded-xl px-3 py-2 text-sm text-muted-foreground flex items-center gap-1.5"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ animationDelay: "0ms", background: "#a855f7" }} />
                  <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ animationDelay: "150ms", background: "#a855f7" }} />
                  <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ animationDelay: "300ms", background: "#a855f7" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 flex gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <input
              type="text" value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Ask how DOS can run your bookings…"
              className="flex-1 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", focusRingColor: "#a855f7" } as React.CSSProperties}
            />
            <button onClick={send} disabled={typing || !input.trim()}
              className="rounded-lg p-2 transition-all hover:scale-105 disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}>
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function Home() {
  return (
    <AppLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(124,58,237,0.09) 1px, transparent 0)`,
            backgroundSize: "40px 40px"
          }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[520px] rounded-full opacity-25 blur-3xl"
            style={{ background: "radial-gradient(ellipse, rgba(168,85,247,0.35) 0%, rgba(236,72,153,0.12) 45%, transparent 70%)" }} />
        </div>

        <div className="container mx-auto px-4 py-24 md:py-36 text-center relative">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <div className="inline-flex items-center gap-2 rounded-full text-sm px-4 py-1.5 font-medium"
              style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(168,85,247,0.35)", color: "#e9d5ff" }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#a855f7", boxShadow: "0 0 12px #a855f7" }} />
              Done-For-You AI Business Systems
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.08] text-foreground">
            Never Miss Another Booking Again.
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Experience Micah live — call our AI receptionist and see how DOS captures enquiries for your business.
          </p>

          <div className="relative max-w-3xl mx-auto mb-8">
            <div
              className="absolute -inset-1 rounded-[2rem] opacity-60 blur-xl animate-pulse pointer-events-none"
              style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.75), rgba(20,184,166,0.65), rgba(34,197,94,0.55))" }}
            />
            <a
              href={MICAH_PHONE_LINK}
              className="relative block rounded-[1.75rem] p-[1px] transition-all hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-emerald-300/70"
              style={{
                background: "linear-gradient(135deg, rgba(168,85,247,0.95), rgba(20,184,166,0.9), rgba(34,197,94,0.85))",
                boxShadow: "0 0 42px rgba(124,58,237,0.35), 0 0 70px rgba(20,184,166,0.18)",
              }}
            >
              <div
                className="relative overflow-hidden rounded-[1.7rem] px-5 py-5 sm:px-8 sm:py-6"
                style={{ background: "linear-gradient(135deg, rgba(10,14,26,0.96), rgba(15,23,42,0.92))" }}
              >
                <div
                  className="absolute -right-16 -top-16 h-36 w-36 rounded-full blur-3xl opacity-50 pointer-events-none"
                  style={{ background: "rgba(20,184,166,0.45)" }}
                />
                <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div className="text-center md:text-left">
                    <div
                      className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] mb-3"
                      style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.35)", color: "#bbf7d0" }}
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75 animate-ping" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                      </span>
                      LIVE AI VOICE DEMO
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">Call Micah Now</div>
                    <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                      Talk to Micah, our AI receptionist, for bookings, enquiries, website rebuilds, and AI business system demos.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3 rounded-2xl px-5 py-4 shrink-0"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
                    <div className="relative">
                      <span className="absolute inset-0 rounded-full animate-ping" style={{ background: "rgba(20,184,166,0.35)" }} />
                      <span className="relative flex h-11 w-11 items-center justify-center rounded-full"
                        style={{ background: "linear-gradient(135deg, #7c3aed, #14b8a6, #22c55e)" }}>
                        <Phone className="h-5 w-5 text-white" />
                      </span>
                    </div>
                    <div className="text-left">
                      <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Tap to call</div>
                      <div className="text-lg sm:text-xl font-bold text-foreground">{MICAH_PHONE_DISPLAY}</div>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
            <a
              href={CALENDLY_DEMO}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold py-3.5 px-8 rounded-xl transition-all hover:scale-[1.02] flex items-center gap-2 justify-center"
              style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)", color: "#fff", boxShadow: "0 8px 40px rgba(124,58,237,0.35)" }}>
              Book Your Free AI System Demo
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link href="/cos" className="font-semibold py-3.5 px-8 rounded-xl transition-all hover:scale-[1.02] flex items-center gap-2 text-foreground justify-center"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.35)" }}>
              See Micah In Action
              <ArrowRight className="w-4 h-4 opacity-70" />
            </Link>
          </div>

          {/* Flow visual */}
          <div className="max-w-4xl mx-auto rounded-2xl p-8 md:p-10 text-left"
            style={{
              background: "rgba(124,58,237,0.06)",
              border: "1px solid rgba(168,85,247,0.25)",
              backdropFilter: "blur(18px)",
              boxShadow: "0 0 80px rgba(124,58,237,0.12)",
            }}>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] mb-6 text-center" style={{ color: "#c4b5fd" }}>How DOS captures every enquiry</div>
            <div className="flex flex-col items-stretch gap-2 md:flex-row md:flex-wrap md:justify-center md:items-center md:gap-2">
              {[
                { t: "Customer Enquiry", d: "Web, SMS, WhatsApp, or voice" },
                { t: "Micah AI Receptionist", d: "Answers, qualifies, routes 24/7" },
                { t: "Website Chat / SMS / WhatsApp / Voice", d: "One brain across every channel" },
                { t: "Booking Captured", d: "Structured requests & transcripts" },
                { t: "Business Owner Notified", d: "Instant alerts & follow-ups" },
              ].flatMap((step, i, arr) => {
                const card = (
                  <div
                    key={step.t}
                    className="rounded-xl px-4 py-4 min-h-[100px] flex flex-col justify-center md:min-w-[140px] md:flex-1 md:max-w-[200px]"
                    style={{
                      background: "rgba(15,23,42,0.65)",
                      border: "1px solid rgba(168,85,247,0.35)",
                      boxShadow: "inset 0 0 28px rgba(124,58,237,0.1)",
                    }}
                  >
                    <div className="text-sm font-semibold text-foreground leading-snug text-center">{step.t}</div>
                    <div className="text-[11px] text-muted-foreground mt-1.5 leading-snug text-center">{step.d}</div>
                  </div>
                );
                if (i === arr.length - 1) return [card];
                const arrow = (
                  <div
                    key={`${step.t}-arrow`}
                    className="flex items-center justify-center py-1 md:py-0 md:px-1 text-lg shrink-0"
                    style={{ color: "#14b8a6" }}
                  >
                    <span className="md:hidden">↓</span>
                    <span className="hidden md:inline">→</span>
                  </div>
                );
                return [card, arrow];
              })}
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <a
              href={MICAH_PHONE_LINK}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl transition-all hover:scale-[1.02] group"
              style={{ background: "rgba(20,184,166,0.08)", border: "1px solid rgba(20,184,166,0.35)", backdropFilter: "blur(10px)" }}
            >
              <Phone className="w-4 h-4 relative z-10" style={{ color: "#14b8a6" }} />
              <div className="text-left">
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Live AI voice demo — call Micah</div>
                <div className="font-bold text-foreground tracking-wide">{MICAH_PHONE_DISPLAY}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Try Micah Voice */}
      <section className="py-16 border-t border-border relative overflow-hidden" style={{ background: "rgba(20,184,166,0.025)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute left-1/2 top-0 h-56 w-[720px] -translate-x-1/2 rounded-full blur-3xl opacity-20"
            style={{ background: "linear-gradient(135deg, #7c3aed, #14b8a6, #22c55e)" }}
          />
        </div>
        <div className="container mx-auto px-4 relative">
          <div
            className="max-w-4xl mx-auto rounded-3xl p-8 md:p-10 text-center"
            style={{
              background: "rgba(255,255,255,0.035)",
              border: "1px solid rgba(20,184,166,0.22)",
              backdropFilter: "blur(18px)",
              boxShadow: "0 0 70px rgba(20,184,166,0.08)",
            }}
          >
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-widest mb-5"
              style={{ background: "rgba(124,58,237,0.14)", border: "1px solid rgba(168,85,247,0.35)", color: "#e9d5ff" }}
            >
              <Phone className="w-3.5 h-3.5" />
              Micah Voice
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Try Micah Voice</h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto mb-8">
              Call Micah to experience how an AI receptionist can answer enquiries, collect details, and help businesses respond faster.
            </p>
            <a
              href={MICAH_PHONE_LINK}
              className="inline-flex items-center justify-center gap-3 rounded-2xl px-7 py-4 font-bold text-white transition-all hover:scale-[1.03]"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #14b8a6, #22c55e)",
                boxShadow: "0 10px 44px rgba(20,184,166,0.25), 0 0 38px rgba(124,58,237,0.22)",
              }}
            >
              <Phone className="w-5 h-5" />
              Call {MICAH_PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>

      {/* Core services */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#a855f7" }}>What DOS Handles For You</div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Done-For-You AI Business Systems</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              More bookings, fewer missed customers, faster replies — we build and run the stack so you can run the business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: <Globe className="w-5 h-5" />,
                title: "Website Rebuilds",
                desc: "Modern conversion-focused business websites.",
              },
              {
                icon: <MessageSquare className="w-5 h-5" />,
                title: "AI Receptionist",
                desc: "Micah answers enquiries 24/7.",
              },
              {
                icon: <Smartphone className="w-5 h-5" />,
                title: "SMS Automation",
                desc: "Instant customer replies and follow-ups.",
              },
              {
                icon: <Phone className="w-5 h-5" />,
                title: "WhatsApp Integration",
                desc: "Capture leads and bookings automatically.",
              },
              {
                icon: <CalendarCheck className="w-5 h-5" />,
                title: "Booking Automation",
                desc: "Automate enquiries and booking requests.",
              },
              {
                icon: <Workflow className="w-5 h-5" />,
                title: "Done-For-You Setup",
                desc: "We build and manage the system for you.",
              },
            ].map(f => (
              <div key={f.title}
                className="rounded-xl p-6 group transition-all hover:border-primary/30 hover:shadow-lg relative"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(10px)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px rgba(168,85,247,0.15)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-all group-hover:scale-110"
                  style={{ background: "rgba(124,58,237,0.15)", color: "#c4b5fd" }}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Voice Receptionist */}
      <section className="py-24 border-t border-border" style={{ background: "rgba(124,58,237,0.04)" }}>
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
              style={{ background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.35)", color: "#e9d5ff" }}>
              <Phone className="w-3.5 h-3.5" />
              AI Voice Receptionist
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Never miss the call — Micah answers the phone.
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Micah can answer customer phone calls using conversational AI voice technology powered by our integrated voice system.
              Same Micah persona across chat, SMS, WhatsApp, and voice — so every caller gets a consistent, professional experience.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Missed call capture",
              "AI receptionist",
              "Call answering",
              "Booking requests",
              "Lead qualification",
              "Business notifications",
            ].map((label) => (
              <div
                key={label}
                className="rounded-xl px-5 py-4 flex items-center gap-3"
                style={{
                  background: "rgba(15,23,42,0.55)",
                  border: "1px solid rgba(20,184,166,0.25)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <Check className="w-4 h-4 shrink-0" style={{ color: "#14b8a6" }} />
                <span className="text-sm text-foreground font-medium">{label}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={MICAH_PHONE_LINK}
              className="inline-flex items-center justify-center gap-2 font-semibold py-3 px-8 rounded-xl transition-all hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #14b8a6, #0d9488)", color: "#042f2e" }}
            >
              <Phone className="w-4 h-4" />
              Call the live voice demo
            </a>
            <Link
              href="/cos"
              className="inline-flex items-center justify-center gap-2 font-semibold py-3 px-8 rounded-xl border transition-all hover:scale-[1.02] text-foreground"
              style={{ borderColor: "rgba(168,85,247,0.4)", background: "rgba(124,58,237,0.08)" }}
            >
              Open Micah chat demo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Transcript Emails Feature */}
      <section className="py-20 border-t border-border" style={{ background: "rgba(0,209,178,0.025)" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left: Copy */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
                style={{ background: "rgba(0,209,178,0.1)", border: "1px solid rgba(0,209,178,0.2)", color: "#00d1b2" }}>
                <Mail className="w-3.5 h-3.5" />
                Included in Every Plan
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                Every Conversation.<br />
                <span style={{ color: "#00d1b2" }}>Delivered to Your Inbox.</span>
              </h2>

              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                After every call and chat, Sarah automatically emails you a full formatted transcript — who enquired,
                what they asked, and what contact details were captured. No dashboard login needed.
                Everything you need to follow up and close, right in your inbox.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  {
                    icon: <Inbox className="w-4 h-4" />,
                    title: "Instant delivery",
                    desc: "Transcript arrives the moment Sarah captures contact info or a booking signal — not at end of day.",
                  },
                  {
                    icon: <Mail className="w-4 h-4" />,
                    title: "Multiple recipients",
                    desc: "Send transcripts to your principal, your PA, and your business mobile — whoever needs to know.",
                  },
                  {
                    icon: <BrainCircuit className="w-4 h-4" />,
                    title: "Closing intelligence",
                    desc: "The email surfaces extracted contact info at the top — name, phone, email — so you can call before a competitor does.",
                  },
                  {
                    icon: <Shield className="w-4 h-4" />,
                    title: "Full audit trail",
                    desc: "Every enquiry is timestamped and archived. Useful for compliance, handovers, and dispute resolution.",
                  },
                ].map(b => (
                  <div key={b.title} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: "rgba(0,209,178,0.1)", color: "#00d1b2" }}>
                      {b.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-sm">{b.title}</div>
                      <div className="text-muted-foreground text-sm leading-relaxed">{b.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "#00d1b2" }}>
                <Check className="w-4 h-4" />
                Included at no extra cost in every Directive OS subscription
              </div>
            </div>

            {/* Right: Email preview mockup */}
            <div className="relative">
              {/* Glow behind */}
              <div className="absolute inset-0 rounded-2xl blur-3xl opacity-20 pointer-events-none"
                style={{ background: "radial-gradient(circle at 50% 50%, #00d1b2, transparent 70%)" }} />

              <div className="relative rounded-2xl overflow-hidden shadow-2xl"
                style={{ border: "1px solid rgba(255,255,255,0.1)", background: "#1a1a2e" }}>

                {/* Email client chrome */}
                <div className="px-4 py-3 flex items-center gap-2"
                  style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                  </div>
                  <div className="flex-1 mx-3 px-3 py-1 rounded text-xs text-white/30"
                    style={{ background: "rgba(255,255,255,0.05)" }}>
                    New Message — 🔔 New Enquiry: Marcus Webb — Hills Property Partners
                  </div>
                </div>

                {/* Email body */}
                <div className="p-5 space-y-4">
                  {/* Header bar */}
                  <div className="rounded-xl p-4"
                    style={{ background: "#0a0e1a", border: "1px solid rgba(0,209,178,0.2)" }}>
                    <div className="text-sm font-bold" style={{ color: "#00d1b2" }}>Directive OS — New Chat Enquiry</div>
                    <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Today at 2:14 AM · Session dos_1714...</div>
                  </div>

                  {/* Extracted info */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { label: "Name detected", value: "Marcus Webb" },
                      { label: "Agency", value: "Hills Property Partners" },
                      { label: "Phone", value: "0412 938 477" },
                      { label: "Email", value: "m.webb@hpp.com.au" },
                    ].map(r => (
                      <div key={r.label} className="rounded-lg p-2.5" style={{ background: "rgba(255,255,255,0.05)" }}>
                        <div style={{ color: "rgba(255,255,255,0.4)" }} className="mb-0.5">{r.label}</div>
                        <div className="font-semibold text-white">{r.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Transcript */}
                  <div>
                    <div className="text-xs font-semibold mb-2 pb-1.5"
                      style={{ color: "rgba(255,255,255,0.5)", borderBottom: "1px solid rgba(0,209,178,0.2)" }}>
                      Full Conversation
                    </div>
                    <div className="space-y-2">
                      {[
                        { role: "sarah", text: "Hey! Running an agency is full-on. When a call comes in after hours, what happens?" },
                        { role: "prospect", text: "Honestly? Usually voicemail. We miss a lot of after-hours stuff." },
                        { role: "sarah", text: "Heaps of agencies are in the same boat — and it's costing real deals. How many agents do you have?" },
                        { role: "prospect", text: "6 agents. We're growing but the phone stuff is a headache. What does this cost?" },
                        { role: "sarah", text: "$299/month after a $1,500 setup — there's a lot included. Worth a 20-min chat with Jayson to go through it all?" },
                        { role: "prospect", text: "Yeah keen. My number is 0412 938 477, email m.webb@hpp.com.au" },
                      ].map((msg, i) => (
                        <div key={i} className={`flex gap-2 ${msg.role === "prospect" ? "justify-end" : ""}`}>
                          <div className="max-w-[85%] rounded-lg px-3 py-1.5 text-xs leading-relaxed"
                            style={{
                              background: msg.role === "sarah" ? "rgba(0,209,178,0.12)" : "rgba(99,102,241,0.15)",
                              color: msg.role === "sarah" ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.85)",
                              border: `1px solid ${msg.role === "sarah" ? "rgba(0,209,178,0.2)" : "rgba(99,102,241,0.25)"}`,
                            }}>
                            <span className="font-semibold text-[10px] block mb-0.5"
                              style={{ color: msg.role === "sarah" ? "#00d1b2" : "#818cf8" }}>
                              {msg.role === "sarah" ? "🤖 Sarah" : "👤 Marcus"}
                            </span>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="text-[10px] text-center pt-1" style={{ color: "rgba(255,255,255,0.2)" }}>
                    Sent automatically by Sarah · Directive OS AI Receptionist
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AgentFlow */}
      <section className="py-20 border-t border-border" style={{ background: "rgba(0,209,178,0.02)" }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#00d1b2" }}>AgentFlow</div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Automated from First Contact to Close</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              AgentFlow is the workflow engine inside Directive OS. Every lead triggers a precision sequence — no manual steps required.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {[
              {
                icon: <Phone className="w-5 h-5" />,
                step: "01",
                title: "Lead Arrives",
                desc: "A buyer calls your agency or enquires via your website chat. The AI Receptionist picks up instantly — every time, regardless of hour.",
                tag: "Voice + Chat"
              },
              {
                icon: <BrainCircuit className="w-5 h-5" />,
                step: "02",
                title: "AI Qualifies",
                desc: "The AI asks the right questions: budget, property type, timeframe, pre-approval status. All data is structured and stored automatically.",
                tag: "Intent Scoring"
              },
              {
                icon: <Building2 className="w-5 h-5" />,
                step: "03",
                title: "VaultRE Syncs",
                desc: "The AI cross-references your live VaultRE listings and presents matching properties. Inspection times are retrieved in real time.",
                tag: "CRM Live Sync"
              },
              {
                icon: <CalendarCheck className="w-5 h-5" />,
                step: "04",
                title: "Action Dispatched",
                desc: "Booking request sent to the team. They will confirm shortly, tenancy form emailed, or hot-transfer executed — whichever the lead requires. Zero admin. Zero delays.",
                tag: "Auto-Execute"
              },
              {
                icon: <Bell className="w-5 h-5" />,
                step: "05",
                title: "Agent Notified",
                desc: "Your listing agent receives a structured lead brief on their mobile — with full transcript, lead score, and recommended next step.",
                tag: "Instant Alert"
              },
            ].map((item, idx) => (
              <div key={item.step} className="flex gap-6 mb-6 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(0,209,178,0.12)", border: "1px solid rgba(0,209,178,0.25)", color: "#00d1b2" }}>
                    {item.icon}
                  </div>
                  {idx < 4 && <div className="w-px flex-1 mt-2" style={{ background: "linear-gradient(to bottom, rgba(0,209,178,0.3), transparent)" }} />}
                </div>
                <div className="pb-6 last:pb-0 flex-1">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="text-xs font-bold" style={{ color: "rgba(0,209,178,0.5)" }}>{item.step}</span>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: "rgba(0,209,178,0.08)", color: "#00d1b2", border: "1px solid rgba(0,209,178,0.15)" }}>
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#00d1b2" }}>Testimonials</div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Trusted by Leading Agencies</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[
              {
                quote: "We were missing calls after hours constantly. Directive OS changed that overnight. Lead capture rate went up 40% in the first month.",
                name: "James Harrison",
                role: "Principal — Pinnacle Real Estate, Sydney"
              },
              {
                quote: "The VaultRE integration is seamless. The AI knows every listing, every inspection time. It's like a full-time receptionist who never sleeps.",
                name: "Sarah Chen",
                role: "Director — Harbour Property Group, North Sydney"
              },
              {
                quote: "I was sceptical about AI for real estate. But when I saw a hot buyer transferred directly to my mobile at 9pm on a Saturday, I was sold.",
                name: "Michael Rossi",
                role: "Principal — The Property Collection, Parramatta"
              },
            ].map(t => (
              <div key={t.name} className="rounded-xl p-6 relative overflow-hidden"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(10px)" }}>
                <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none rounded-bl-full"
                  style={{ background: "radial-gradient(circle, rgba(0,209,178,0.06) 0%, transparent 70%)" }} />
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-black"
                    style={{ background: "linear-gradient(135deg, #00d1b2, #00b89c)" }}>
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 border-t border-border" style={{ background: "rgba(255,255,255,0.01)" }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#00d1b2" }}>Onboarding</div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Deployed in 48 Hours</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">We handle the full setup. You start capturing leads immediately.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Onboard & Activate",
                desc: "Register your agency ABN, select your seat count, and complete the one-time setup payment. Your Command Bridge is provisioned instantly."
              },
              {
                step: "02",
                title: "Connect & Configure",
                desc: "We sync your VaultRE listings, configure the AI's knowledge base with your properties and team, and assign your dedicated phone number."
              },
              {
                step: "03",
                title: "Go Live",
                desc: "Deploy to your website and phone line. From this moment, every lead is captured, qualified, and routed automatically — 24 hours a day."
              },
            ].map((step, idx) => (
              <div key={step.step} className="relative text-center">
                {idx < 2 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] right-0 h-px"
                    style={{ background: "linear-gradient(to right, rgba(0,209,178,0.4), transparent)" }} />
                )}
                <div className="text-6xl font-black mb-4 leading-none"
                  style={{ color: "rgba(0,209,178,0.12)", fontVariantNumeric: "tabular-nums" }}>{step.step}</div>
                <h3 className="font-bold text-foreground mb-3 text-lg">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Listings Preview */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#00d1b2" }}>Property Intelligence</div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Your Listings. Live. Always Accurate.</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              The AI Receptionist knows every property in your portfolio — prices, inspection times, agent contacts — synced directly from VaultRE in real time.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto mb-10">
            {[
              {
                photo: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80",
                type: "sale",
                status: "active",
                address: "14 Jamison Road",
                suburb: "Penrith NSW 2750",
                price: "$895,000",
                beds: 4, baths: 2,
                agent: "Mark Thompson",
                inspection: "Sat 11:00–11:30am"
              },
              {
                photo: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
                type: "sale",
                status: "active",
                address: "45 Richmond Road",
                suburb: "Blacktown NSW 2148",
                price: "$1,050,000",
                beds: 5, baths: 3,
                agent: "Mark Thompson",
                inspection: "Sat 2:00–2:45pm"
              },
              {
                photo: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80",
                type: "rental",
                status: "active",
                address: "7 Illaroo Place",
                suburb: "Colyton NSW 2760",
                price: "$460/week",
                beds: 3, baths: 1,
                agent: "Rachel Kim",
                inspection: "Sat 9:30–10:00am"
              },
            ].map((l, i) => (
              <div key={i} className="rounded-xl overflow-hidden group"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="relative h-44 overflow-hidden bg-muted">
                  <img src={l.photo} alt={l.address} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${l.type === "rental" ? "bg-blue-600/90 text-white" : "bg-emerald-600/90 text-white"}`}>
                      For {l.type === "rental" ? "Rent" : "Sale"}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded border font-medium bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Active</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="font-semibold text-foreground text-sm mb-0.5">{l.address}</div>
                  <div className="text-xs text-muted-foreground mb-2">{l.suburb}</div>
                  <div className="text-lg font-bold mb-2" style={{ color: "#00d1b2" }}>{l.price}</div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Bed className="w-3 h-3" />{l.beds} bed
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="w-3 h-3" />{l.baths} bath
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground border-t border-white/5 pt-3 flex justify-between">
                    <span>{l.agent}</span>
                    <span style={{ color: "#00d1b2" }}>{l.inspection}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-3 text-sm text-muted-foreground">
              <Check className="w-4 h-4" style={{ color: "#00d1b2" }} />
              Can't sync with your CRM? Add listings manually from the Command Bridge — no integration required.
            </div>
          </div>
        </div>
      </section>

      {/* 3 Website Templates */}
      <section id="templates" className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <div className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#00d1b2" }}>Your Agency Website</div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              A Professional Website — <span style={{ color: "#00d1b2" }}>Built for You</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-3">
              Every Directive OS subscription comes with a fully built agency website. Choose from three layouts,
              supply your logo — we handle the rest. Colours automatically match your brand.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
              style={{ background: "rgba(0,209,178,0.08)", border: "1px solid rgba(0,209,178,0.2)", color: "#00d1b2" }}>
              <Check className="w-3.5 h-3.5" />
              No ongoing maintenance required. Just supply your logo.
            </div>
          </div>

          {/* Template cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12">
            {[
              {
                name: "Enterprise",
                tagline: "The Flagship",
                desc: "Corporate and authoritative. Clean grid layout with strong typography, a bold header, and a professional property search experience. Perfect for established agencies.",
                feel: ["Clean & minimal", "Grid-forward", "Corporate authority"],
                accent: "#6366f1",
                previewBg: "linear-gradient(135deg, #0f1035 0%, #1e2060 100%)",
                badge: "Most Popular",
              },
              {
                name: "Voyager",
                tagline: "The Explorer",
                desc: "Boutique and editorial. Serif headlines, warm tones, rich photography, and an elegant listing presentation. Ideal for premium, relationship-driven agencies.",
                feel: ["Boutique & warm", "Serif-forward", "Luxury editorial"],
                accent: "#C9A84C",
                previewBg: "linear-gradient(135deg, #1a1208 0%, #2d1f0a 100%)",
                badge: "Meridian uses this",
              },
              {
                name: "Discovery",
                tagline: "The Pioneer",
                desc: "Bold and cinematic. Dark hero sections, high-contrast photography, and a modern sans-serif feel. For agencies that want to stand out with a striking first impression.",
                feel: ["Bold & cinematic", "High-contrast", "Contemporary dark"],
                accent: "#e11d48",
                previewBg: "linear-gradient(135deg, #1a0010 0%, #2d0020 100%)",
                badge: "New",
              },
            ].map((t) => (
              <div
                key={t.name}
                className="relative rounded-2xl overflow-hidden border flex flex-col"
                style={{ borderColor: `${t.accent}30`, background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)" }}
              >
                {/* Badge */}
                <div
                  className="absolute top-3 right-3 z-10 text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: `${t.accent}20`, border: `1px solid ${t.accent}40`, color: t.accent }}
                >
                  {t.badge}
                </div>

                {/* Preview mockup */}
                <div className="aspect-[4/3] relative overflow-hidden" style={{ background: t.previewBg }}>
                  <div className="absolute inset-0 flex flex-col p-4">
                    {/* Fake nav */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-1.5">
                        <div className="w-12 h-1.5 rounded-full opacity-70" style={{ background: t.accent }} />
                      </div>
                      <div className="flex gap-2">
                        {[1,2,3,4].map(i => <div key={i} className="w-6 h-1 rounded-full bg-white/20" />)}
                      </div>
                    </div>
                    {/* Fake hero text */}
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="w-3/4 h-3 rounded-full bg-white/80 mb-2" />
                      <div className="w-1/2 h-2 rounded-full bg-white/40 mb-4" />
                      <div className="flex gap-2">
                        <div className="w-20 h-6 rounded-lg" style={{ background: t.accent }} />
                        <div className="w-20 h-6 rounded-lg bg-white/10" />
                      </div>
                    </div>
                    {/* Fake property cards */}
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="rounded-lg bg-white/8 overflow-hidden">
                          <div className="h-8 bg-white/10" />
                          <div className="p-1.5">
                            <div className="w-full h-1.5 rounded-full bg-white/30 mb-1" />
                            <div className="w-2/3 h-1 rounded-full bg-white/15" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Colour accent glow */}
                  <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none"
                    style={{ background: t.accent }} />
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="mb-0.5">
                    <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: t.accent }}>{t.tagline}</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{t.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{t.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {t.feel.map(f => (
                      <span key={f} className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                        style={{ background: `${t.accent}15`, color: t.accent, border: `1px solid ${t.accent}25` }}>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom note */}
          <div className="text-center mt-10">
            <p className="text-muted-foreground text-sm mb-5">
              Your colours are extracted from your logo automatically — no design work needed on your end.
              Website details are discussed during your onboarding call.
            </p>
            <a
              href="https://calendly.com/adwordpress2012/directive-os-agency-onboarding"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all"
              style={{ background: "rgba(0,209,178,0.1)", border: "1px solid rgba(0,209,178,0.25)", color: "#00d1b2" }}
            >
              Book a Call to Choose Your Template <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Live Industry Demos */}
      <section id="demos" className="py-20 border-t border-border" style={{ background: "rgba(0,209,178,0.02)" }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <div className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#00d1b2" }}>Live Demos</div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">See Directive OS in the Wild</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Explore live demo sites showing exactly how Directive OS looks and performs inside a real business — by industry.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            {/* Real Estate — LIVE */}
            <a
              href="/realestate-demo"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-2xl overflow-hidden border transition-all hover:scale-[1.02] hover:shadow-2xl"
              style={{ borderColor: "rgba(0,209,178,0.25)", background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 40px rgba(0,209,178,0.12)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
            >
              {/* Live badge */}
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Demo
              </div>
              <div className="aspect-video overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80"
                  alt="Real Estate Demo"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#C9A84C" }}>Real Estate</div>
                <h3 className="font-bold text-white text-lg leading-tight mb-1">Meridian Property Group</h3>
                <p className="text-white/60 text-xs">Western Sydney boutique agency · Sarah AI Receptionist · 24/7 enquiries & inspections</p>
                <div className="flex items-center gap-1.5 mt-3 text-xs font-medium" style={{ color: "#00d1b2" }}>
                  View Live Demo <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </a>

            {/* Nidus Real Estate — LIVE */}
            <a
              href="/nidus-re"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-2xl overflow-hidden border transition-all hover:scale-[1.02] hover:shadow-2xl"
              style={{ borderColor: "rgba(231,13,115,0.25)", background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 40px rgba(231,13,115,0.12)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
            >
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Client
              </div>
              <div className="aspect-video overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&q=80"
                  alt="Nidus Real Estate"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#e70d73" }}>Real Estate · Mt Druitt</div>
                <h3 className="font-bold text-white text-lg leading-tight mb-1">Nidus Real Estate</h3>
                <p className="text-white/60 text-xs">Western Sydney · Sarah AI Receptionist · Leads, inspections & appraisals 24/7</p>
                <div className="flex items-center gap-1.5 mt-3 text-xs font-medium" style={{ color: "#e70d73" }}>
                  View Live Page <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </a>

            {/* Century 21 The Rana Group — LIVE */}
            <a
              href="/c21-rana"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-2xl overflow-hidden border transition-all hover:scale-[1.02] hover:shadow-2xl"
              style={{ borderColor: "rgba(242,184,56,0.25)", background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 40px rgba(242,184,56,0.12)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
            >
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Client
              </div>
              <div className="aspect-video overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80"
                  alt="Century 21 The Rana Group"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#F2B838" }}>Real Estate · Seven Hills</div>
                <h3 className="font-bold text-white text-lg leading-tight mb-1">Century 21 The Rana Group</h3>
                <p className="text-white/60 text-xs">Blacktown & Western Sydney · Sarah AI Receptionist · Leads, inspections & appraisals 24/7</p>
                <div className="flex items-center gap-1.5 mt-3 text-xs font-medium" style={{ color: "#F2B838" }}>
                  View Live Page <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </a>

            {/* The Boulevard Group — LIVE */}
            <Link
              href="/boulevard-group"
              className="group relative rounded-2xl overflow-hidden border transition-all hover:scale-[1.02] hover:shadow-2xl"
              style={{ borderColor: "rgba(240,184,73,0.25)", background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 40px rgba(240,184,73,0.12)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
            >
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Demo
              </div>
              <div className="aspect-video relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?w=600&q=80"
                  alt="The Boulevard Group"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#f0b849" }}>Real Estate · Sydney Metro</div>
                <h3 className="font-bold text-white text-lg leading-tight mb-1">The Boulevard Group</h3>
                <p className="text-white/60 text-xs">Sydney boutique agency · Sarah AI Receptionist · Featured listings & QR signboard</p>
                <div className="flex items-center gap-1.5 mt-3 text-xs font-medium" style={{ color: "#f0b849" }}>
                  View Live Demo <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>

            {/* Elite Sydney Property — LIVE */}
            <Link
              href="/elite-sydney"
              className="group relative rounded-2xl overflow-hidden border transition-all hover:scale-[1.02] hover:shadow-2xl"
              style={{ borderColor: "rgba(0,67,145,0.35)", background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 40px rgba(251,183,1,0.12)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
            >
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Demo
              </div>
              <div className="aspect-video relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80"
                  alt="Elite Sydney Property"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#fbb701" }}>Real Estate · Liverpool & Hinchinbrook</div>
                <h3 className="font-bold text-white text-lg leading-tight mb-1">Elite Sydney Property</h3>
                <p className="text-white/60 text-xs">SW Sydney agency · Sarah AI Receptionist · VaultRE sync · 24/7 enquiries</p>
                <div className="flex items-center gap-1.5 mt-3 text-xs font-medium" style={{ color: "#fbb701" }}>
                  View Live Demo <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          </div>

          {/* CTA */}
          <div className="text-center mt-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/demos"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
                style={{ background: "#00d1b2", color: "#0a0e1a" }}
              >
                View All 5 Live Demos <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://calendly.com/adwordpress2012/directive-os-agency-onboarding"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all"
                style={{ background: "rgba(0,209,178,0.08)", border: "1px solid rgba(0,209,178,0.2)", color: "#00d1b2" }}
              >
                Book a Discovery Call
              </a>
            </div>
          </div>
        </div>
      </section>

      <InstantAiQuote />

      {/* Pricing */}
      <section id="pricing" className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#a855f7" }}>Pricing</div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Plans that scale with your business</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              DFY setup on every tier. Optional website rebuilds from $1,000+ depending on scope.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
            {[
              {
                name: "Founding Member",
                price: "$197",
                period: "/month",
                items: ["Website Chat Widget", "FAQ Automation", "Booking Requests", "Email Notifications", "DFY Setup"],
                accent: "rgba(124,58,237,0.35)",
              },
              {
                name: "Starter",
                price: "$297",
                period: "/month",
                items: ["AI Receptionist", "SMS Automation", "WhatsApp Ready", "Booking Automation", "DFY Setup"],
                accent: "rgba(236,72,153,0.35)",
                featured: true,
              },
              {
                name: "Growth",
                price: "$497",
                period: "/month",
                items: ["AI Voice Receptionist", "SMS + WhatsApp", "Booking System", "Lead Capture", "Priority Support", "DFY Setup"],
                accent: "rgba(20,184,166,0.35)",
              },
            ].map((tier) => (
              <div
                key={tier.name}
                className="rounded-2xl p-8 flex flex-col relative overflow-hidden"
                style={{
                  background: tier.featured ? "rgba(124,58,237,0.1)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${tier.accent}`,
                  backdropFilter: "blur(14px)",
                  boxShadow: tier.featured ? "0 0 50px rgba(168,85,247,0.15)" : undefined,
                }}
              >
                {tier.featured && (
                  <span
                    className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full"
                    style={{ background: "rgba(236,72,153,0.2)", color: "#fbcfe8", border: "1px solid rgba(236,72,153,0.4)" }}
                  >
                    Popular
                  </span>
                )}
                <h3 className="text-lg font-bold text-foreground mb-1">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black" style={{ color: "#f5f3ff" }}>{tier.price}</span>
                  <span className="text-muted-foreground text-sm">{tier.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#14b8a6" }} />
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href={CALENDLY_DEMO}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center font-bold py-3 rounded-xl transition-all hover:scale-[1.02]"
                  style={{
                    background: tier.featured ? "linear-gradient(135deg, #7c3aed, #ec4899)" : "rgba(255,255,255,0.08)",
                    color: "#fff",
                    border: tier.featured ? undefined : "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  Book Your Free AI System Demo
                </a>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-10 max-w-2xl mx-auto">
            Website rebuilds quoted separately from <span className="text-foreground font-medium">$1,000+</span>. Enterprise agencies with VaultRE and advanced workflows — talk to us for a tailored package.
          </p>

          <div className="max-w-xl mx-auto mt-10 rounded-xl p-5 flex items-start gap-3"
            style={{ background: "rgba(20,184,166,0.06)", border: "1px solid rgba(20,184,166,0.2)" }}>
            <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#14b8a6" }} />
            <div className="text-sm text-muted-foreground">
              <strong className="text-foreground block mb-1">No lock-in contracts</strong>
              Cancel when you like. Australian-hosted infrastructure and full transcript history in your Command Bridge.
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo-section" className="py-20 border-t border-border" style={{ background: "rgba(124,58,237,0.04)" }}>
        <div className="container mx-auto px-4 text-center">
          <div className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#c4b5fd" }}>Live Demo</div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Chat with Micah on this page</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-10">
            Ask how DOS would handle bookings, SMS, WhatsApp, and voice for your business — or open the full conversational showcase on COS.
          </p>
          <div className="inline-flex items-center gap-3 rounded-full px-5 py-3 text-sm font-medium cursor-pointer transition-all hover:scale-105"
            style={{ background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.35)", color: "#e9d5ff" }}
            onClick={() => document.getElementById("dos-micah-chat-launcher")?.click()}
            onKeyDown={(e) => e.key === "Enter" && document.getElementById("dos-micah-chat-launcher")?.click()}
            role="button"
            tabIndex={0}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#a855f7" }} />
            Open Micah chat
            <ChevronRight className="w-4 h-4" />
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center text-xs text-muted-foreground">
            <span>Try: &quot;I run a salon — how does booking work?&quot;</span>
            <Link href="/cos" className="text-purple-300 hover:text-purple-200 underline-offset-2 hover:underline">See full Micah demo (COS)</Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,209,178,0.05) 1px, transparent 0)`,
            backgroundSize: "40px 40px"
          }} />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] blur-3xl opacity-20"
            style={{ background: "radial-gradient(ellipse, rgba(0,209,178,0.4) 0%, transparent 70%)" }} />
        </div>
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            Ready to Deploy Your<br />
            <span style={{ background: "linear-gradient(135deg, #00d1b2, #00e8c8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Command Bridge?
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-xl mb-10">
            Join the agencies capturing 100% of after-hours enquiries. Setup takes less than 48 hours.
          </p>
          <a href="https://calendly.com/adwordpress2012/directive-os-agency-onboarding" target="_blank" rel="noopener noreferrer">
            <button className="font-bold py-4 px-12 rounded-xl transition-all hover:scale-105 text-lg mx-auto flex items-center gap-3"
              style={{ background: "linear-gradient(135deg, #00d1b2, #00b89c)", color: "#0a0a0a", boxShadow: "0 8px 40px rgba(0,209,178,0.35)" }}>
              Activate Directive OS
              <ArrowRight className="w-5 h-5" />
            </button>
          </a>
          <p className="text-muted-foreground text-sm mt-6">
            From $197/mo founding tier — no lock-in — Australian-hosted infrastructure
          </p>
        </div>
      </section>

      {/* ── Voice Demo Section ───────────────────────────────────────────── */}
      <section className="py-20 relative overflow-hidden" id="voice-demo">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] blur-3xl opacity-15"
            style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.5) 0%, transparent 70%)" }} />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(168,85,247,0.25)", backdropFilter: "blur(20px)" }}>
            <div className="grid md:grid-cols-2 gap-0">

              {/* Left — description */}
              <div className="p-10 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5 w-fit"
                  style={{ background: "rgba(124,58,237,0.15)", color: "#e9d5ff", border: "1px solid rgba(168,85,247,0.35)" }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#a855f7" }} />
                  LIVE AI VOICE DEMO
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-4 leading-tight">
                  Call Micah.<br />
                  <span style={{ background: "linear-gradient(135deg, #a855f7, #14b8a6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Your AI Voice Receptionist.
                  </span>
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Micah answers on voice with the same behaviour as chat — qualifying enquiries, capturing bookings, and notifying your team.
                  Full transcripts land in your Command Bridge.
                </p>
                <div className="space-y-2.5">
                  {[
                    "Natural conversational voice",
                    "Missed-call capture and callbacks",
                    "Booking requests & lead qualification",
                    "Business notifications and summaries",
                  ].map(point => (
                    <div key={point} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: "#14b8a6" }} />
                      {point}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — call CTA */}
              <div className="p-10 flex flex-col items-center justify-center text-center"
                style={{ background: "rgba(20,184,166,0.06)", borderLeft: "1px solid rgba(168,85,247,0.2)" }}>
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto"
                    style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(20,184,166,0.15))", border: "2px solid rgba(168,85,247,0.35)" }}>
                    <Phone className="w-10 h-10" style={{ color: "#c4b5fd" }} />
                  </div>
                  <span className="absolute top-0 right-0 w-5 h-5 rounded-full border-2 border-background flex items-center justify-center"
                    style={{ background: "#22c55e" }}>
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mb-2">Micah voice — Live Now</p>
                <a
                  href={MICAH_PHONE_LINK}
                  className="text-4xl font-bold tracking-wider mb-2 hover:opacity-80 transition-opacity block"
                  style={{ color: "#14b8a6" }}
                >
                  {MICAH_PHONE_DISPLAY}
                </a>
                <p className="text-xs text-muted-foreground mb-6">Australian number · tap to call on mobile</p>
                <a
                  href={MICAH_PHONE_LINK}
                  className="w-full font-bold py-4 px-6 rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2.5"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #14b8a6)", color: "#fff", boxShadow: "0 4px 24px rgba(124,58,237,0.35)" }}
                >
                  <Phone className="w-4 h-4" />
                  Call Now — It's Free
                </a>
                <p className="text-xs text-muted-foreground mt-3">Normal call rates apply · No signup required</p>
              </div>

            </div>
          </div>
        </div>
      </section>

      <DemoChatWidget />
    </AppLayout>
  );
}
