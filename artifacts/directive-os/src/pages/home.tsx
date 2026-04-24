import { useState, useRef } from "react";
import { Link } from "wouter";
import { AppLayout } from "@/components/layout/MarketingLayout";
import { useAiChat } from "@workspace/api-client-react";
import {
  Phone, MessageSquare, Zap, Shield, Building2, FileText,
  ArrowRight, Check, X, Send, Star, BarChart3,
  Workflow, BrainCircuit, CalendarCheck, Bell, Lock, ChevronRight,
  Bed, Bath, Mail, Inbox, Smartphone, Globe
} from "lucide-react";

const BASE_PRICE = 299;
const SEAT_PRICE = 89;
const SETUP_FEE = 1800;

function PricingCalculator() {
  const [missedCalls, setMissedCalls] = useState(5);
  const [commission, setCommission] = useState(15000);

  const CONVERSION_RATE = 0.05;
  const monthlyMissed = missedCalls * 4.33;
  const lostSales = monthlyMissed * CONVERSION_RATE;
  const monthlyLoss = Math.round(lostSales * commission);
  const annualLoss = monthlyLoss * 12;

  return (
    <div
      id="roi-calculator"
      className="rounded-2xl p-8 max-w-2xl mx-auto relative overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(0,209,178,0.2)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 0 60px rgba(0,209,178,0.06)",
      }}
    >
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,209,178,0.08) 0%, transparent 70%)" }} />

      <h3 className="text-2xl font-bold text-foreground mb-1">ROI Calculator</h3>
      <p className="text-muted-foreground mb-8 text-sm">See how much commission you're losing every month from missed calls.</p>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-foreground">Missed Calls per Week</label>
          <span className="text-3xl font-bold text-primary">{missedCalls}</span>
        </div>
        <input
          type="range" min="1" max="15" value={missedCalls}
          onChange={e => setMissedCalls(Number(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary"
          style={{ background: `linear-gradient(to right, #00d1b2 0%, #00d1b2 ${((missedCalls - 1) / 14) * 100}%, rgba(255,255,255,0.1) ${((missedCalls - 1) / 14) * 100}%, rgba(255,255,255,0.1) 100%)` }}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>1 call</span><span>15 calls</span>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-foreground">Average Commission per Sale</label>
          <span className="text-3xl font-bold text-primary">${commission.toLocaleString()}</span>
        </div>
        <input
          type="range" min="10000" max="60000" step="1000" value={commission}
          onChange={e => setCommission(Number(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary"
          style={{ background: `linear-gradient(to right, #00d1b2 0%, #00d1b2 ${((commission - 10000) / 50000) * 100}%, rgba(255,255,255,0.1) ${((commission - 10000) / 50000) * 100}%, rgba(255,255,255,0.1) 100%)` }}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>$10k</span><span>$60k</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2 italic">AU industry average: ~$15,000 (2% on a $750k sale).</p>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center py-2.5 border-b border-white/5 text-sm">
          <span className="text-muted-foreground">Monthly missed calls</span>
          <span className="font-semibold text-foreground">{Math.round(monthlyMissed)}</span>
        </div>
        <div className="flex justify-between items-center py-2.5 border-b border-white/5 text-sm">
          <span className="text-muted-foreground">Likely lost sales (5% conversion)</span>
          <span className="font-semibold text-foreground">{lostSales.toFixed(1)}</span>
        </div>
        <div className="flex justify-between items-center py-2.5 border-b border-white/5 text-sm">
          <span className="text-muted-foreground">Annual commission lost</span>
          <span className="font-semibold text-foreground">${annualLoss.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center pt-4">
          <span className="font-bold text-foreground text-lg">Total Monthly Opportunity Loss</span>
          <div className="text-right">
            <div className="text-4xl font-bold text-primary">${monthlyLoss.toLocaleString()}<span className="text-xl font-normal text-muted-foreground">/mo</span></div>
          </div>
        </div>
      </div>

      <div className="rounded-xl p-4 mb-6 text-sm"
        style={{ background: "rgba(0,209,178,0.06)", border: "1px solid rgba(0,209,178,0.15)" }}>
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="font-semibold text-foreground text-sm">Done-for-you onboarding included</span>
        </div>
        <ul className="space-y-1 text-muted-foreground text-xs ml-6">
          <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />Full platform configuration &amp; custom setup</li>
          <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />VaultRE CRM mapping &amp; live sync</li>
          <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />AI receptionist training for your listings</li>
          <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />Live walkthrough &amp; staff onboarding session</li>
        </ul>
        <p className="text-xs text-muted-foreground mt-2 ml-6 italic">Onboarding investment outlined during your free strategy call.</p>
      </div>

      <Link href="/onboard">
        <button className="w-full font-bold py-3.5 px-6 rounded-xl transition-all hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, #00d1b2, #00b89c)", color: "#0a0a0a", boxShadow: "0 4px 24px rgba(0,209,178,0.3)" }}>
          Activate &amp; Pay via Stripe
          <ArrowRight className="w-4 h-4" />
        </button>
      </Link>

      <a
        href="https://calendly.com/adwordpress2012/directive-os-agency-onboarding"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-2.5 px-6 rounded-xl border transition-all hover:border-primary/40 hover:text-primary text-sm font-medium text-muted-foreground"
        style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
      >
        <Phone className="w-3.5 h-3.5" />
        Book a free 15-min strategy call first
      </a>
    </div>
  );
}

interface Message { role: "assistant" | "user"; content: string; }

function DemoChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hey! Running an agency is full-on, yeah? I'm Sarah from Directive OS. Quick one to kick things off — when a call comes in after hours or while your agents are out on inspections, what happens to it? Voicemail, or does someone always have to be on call?" }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [sessionId] = useState(`dos_${Date.now()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chat = useAiChat();

  const send = async () => {
    if (!input.trim() || chat.isPending || typing) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setTyping(true);
    try {
      const result = await chat.mutateAsync({ data: { sessionId, message: userMsg, agencyId: null } });
      const reply = result.reply;
      const words = reply.trim().split(/\s+/).length;
      await new Promise(r => setTimeout(r, Math.min(2500, Math.max(900, words * 35))));
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch {
      await new Promise(r => setTimeout(r, 900));
      setMessages(prev => [...prev, { role: "assistant", content: "Thank you for your message. One of our agents will be in touch shortly." }]);
    }
    setTyping(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-24 right-6 z-[60] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110"
        style={{ background: "linear-gradient(135deg, #00d1b2, #00b89c)", boxShadow: "0 4px 24px rgba(0,209,178,0.4)" }}
      >
        {open ? <X className="w-5 h-5 text-black" /> : <MessageSquare className="w-6 h-6 text-black" />}
      </button>

      {open && (
        <div className="fixed bottom-44 right-6 z-[60] w-[340px] sm:w-[380px] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{ background: "rgba(13,17,23,0.97)", border: "1px solid rgba(0,209,178,0.25)", backdropFilter: "blur(20px)" }}>
          <div className="px-4 py-3 flex items-center justify-between"
            style={{ background: "linear-gradient(135deg, rgba(0,209,178,0.15), rgba(0,209,178,0.05))", borderBottom: "1px solid rgba(0,209,178,0.15)" }}>
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#00d1b2", boxShadow: "0 0 8px #00d1b2" }} />
              <div>
                <div className="text-sm font-semibold text-foreground">Sarah · Directive OS</div>
                <div className="text-xs text-muted-foreground">AI Receptionist · Available 24/7</div>
                <div className="flex items-center gap-1 mt-1 flex-wrap">
                  {[["🇦🇺","EN"],["🇨🇳","中文"],["🇵🇭","FIL"],["🇷🇺","РУС"],["🇸🇦","عربي"],["🇰🇷","한국어"],["🇻🇳","Việt"],["🇮🇳","हिंदी"],["🇪🇸","ESP"]].map(([flag, lang]) => (
                    <span key={lang} style={{ fontSize: 9, background: "rgba(0,209,178,0.12)", border: "1px solid rgba(0,209,178,0.25)", color: "#00d1b2", borderRadius: 4, padding: "1px 5px", fontWeight: 600, letterSpacing: 0.3, whiteSpace: "nowrap" }}>{flag} {lang}</span>
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
                    ? "text-black font-medium"
                    : "text-foreground"
                }`}
                  style={msg.role === "user"
                    ? { background: "linear-gradient(135deg, #00d1b2, #00b89c)" }
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
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
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
              placeholder="Ask about Directive OS..."
              className="flex-1 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", focusRingColor: "#00d1b2" } as React.CSSProperties}
            />
            <button onClick={send} disabled={typing || !input.trim()}
              className="rounded-lg p-2 transition-all hover:scale-105 disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #00d1b2, #00b89c)" }}>
              <Send className="w-4 h-4 text-black" />
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
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,209,178,0.08) 1px, transparent 0)`,
            backgroundSize: "40px 40px"
          }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-20 blur-3xl"
            style={{ background: "radial-gradient(ellipse, rgba(0,209,178,0.3) 0%, transparent 70%)" }} />
        </div>

        <div className="container mx-auto px-4 py-28 md:py-40 text-center relative">
          {/* Urgency badge */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <div className="inline-flex items-center gap-2 rounded-full text-sm px-4 py-1.5 font-medium"
              style={{ background: "rgba(0,209,178,0.08)", border: "1px solid rgba(0,209,178,0.2)", color: "#00d1b2" }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#00d1b2", boxShadow: "0 0 8px #00d1b2" }} />
              Now live for Australian Real Estate Agencies
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full text-xs px-3 py-1.5 font-bold"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              Limited — 5 spots left in NSW this quarter
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.05]">
            <span className="text-foreground">Stop Losing </span>
            <span style={{ background: "linear-gradient(135deg, #00d1b2 0%, #00e8c8 50%, #00b89c 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              $50,000+
            </span>
            <span className="text-foreground"> in Missed Property Leads</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-3 leading-relaxed">
            Sarah answers every call, qualifies buyers, and emails you instantly — even after hours.
          </p>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto mb-10">
            No after-hours voicemail. No missed opportunities. From <span className="font-semibold text-foreground">$299/month.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <a
              href="#roi-calculator"
              className="font-bold py-3.5 px-8 rounded-xl transition-all hover:scale-105 flex items-center gap-2 justify-center"
              style={{ background: "linear-gradient(135deg, #00d1b2, #00b89c)", color: "#0a0a0a", boxShadow: "0 4px 32px rgba(0,209,178,0.35)" }}>
              <BarChart3 className="w-4 h-4" />
              Show Me The Money
              <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#voice-demo" className="font-semibold py-3.5 px-8 rounded-xl transition-all hover:scale-105 flex items-center gap-2 text-foreground justify-center"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.15)" }}>
              Try the AI Demo
              <ArrowRight className="w-4 h-4 opacity-60" />
            </a>
          </div>

          <p className="text-xs text-muted-foreground mb-6">See your real losses in 10 seconds — no signup required</p>

          {/* Live Voice Demo CTA */}
          <div className="mb-2 flex justify-center">
            <a
              href="tel:0258504038"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl transition-all hover:scale-105 group"
              style={{ background: "rgba(0,209,178,0.08)", border: "1px solid rgba(0,209,178,0.25)", backdropFilter: "blur(10px)" }}
            >
              <div className="relative flex items-center justify-center w-8 h-8">
                <span className="absolute w-8 h-8 rounded-full opacity-40 animate-ping" style={{ background: "rgba(0,209,178,0.4)" }} />
                <Phone className="w-4 h-4 relative z-10" style={{ color: "#00d1b2" }} />
              </div>
              <div className="text-left">
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Or test the AI right now — call Sarah</div>
                <div className="font-bold text-foreground tracking-wide">02 5850 4038</div>
                <div className="flex items-center gap-1 mt-1 flex-wrap">
                  {[["🇦🇺","EN"],["🇨🇳","中文"],["🇵🇭","FIL"],["🇷🇺","РУС"],["🇸🇦","عربي"],["🇰🇷","한국어"],["🇻🇳","Việt"],["🇮🇳","हिंदी"],["🇪🇸","ESP"]].map(([flag, lang]) => (
                    <span key={lang} style={{ fontSize: 9, background: "rgba(0,209,178,0.12)", border: "1px solid rgba(0,209,178,0.25)", color: "#00d1b2", borderRadius: 4, padding: "1px 5px", fontWeight: 600, letterSpacing: 0.3, whiteSpace: "nowrap" }}>{flag} {lang}</span>
                  ))}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          <p className="text-xs text-muted-foreground mt-2 mb-16">This is a live AI — not a recording</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { value: "24/7", label: "Lead Coverage" },
              { value: "< 3s", label: "Response Time" },
              { value: "< 48h", label: "Go-Live Time" },
              { value: "100%", label: "Calls Answered" },
            ].map(stat => (
              <div key={stat.label} className="rounded-xl p-4 text-center"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(10px)" }}>
                <div className="text-2xl font-bold mb-1" style={{ color: "#00d1b2" }}>{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Products */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#00d1b2" }}>Core Platform</div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Mission-Critical Infrastructure</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Every module engineered for the specific demands of Australian real estate operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: <Phone className="w-5 h-5" />,
                title: "AI Voice Receptionist",
                desc: "Handles inbound calls 24/7. Qualifies buyers and tenants, books inspections, and executes live hot-transfers to your listing agent's mobile."
              },
              {
                icon: <MessageSquare className="w-5 h-5" />,
                title: "AI Chat Receptionist",
                desc: "Embedded on your website. Engages every visitor, captures leads, answers property questions, and hands off to your team — all without human input."
              },
              {
                icon: <Building2 className="w-5 h-5" />,
                title: "VaultRE CRM Sync",
                desc: "Bi-directional sync with your VaultRE account. Listings, agent contacts, and inspection times are always live — the AI never gives outdated info."
              },
              {
                icon: <FileText className="w-5 h-5" />,
                title: "NSW Tenancy Automation",
                desc: "When a tenant asks to apply, the AI instantly emails the NSW Fair Trading Standard Tenancy Form. No manual follow-up. Zero admin time."
              },
              {
                icon: <Zap className="w-5 h-5" />,
                title: "Hot Lead Routing",
                desc: "High-intent signals trigger an immediate call transfer to the listing agent's mobile — number pulled directly from your CRM, in real time."
              },
              {
                icon: <BarChart3 className="w-5 h-5" />,
                title: "Command Bridge Dashboard",
                desc: "All call recordings, chat transcripts, and lead data in one intelligence centre. Full visibility over every interaction, from anywhere."
              },
              {
                icon: <Globe className="w-5 h-5" />,
                title: "9 Languages — No Extra Charge",
                desc: "Sarah speaks English, Mandarin, Arabic, Korean, Vietnamese, Hindi, Filipino, Russian, and Spanish. Auto-detects and switches instantly — voice or chat.",
                badge: "Included"
              },
            ].map(f => (
              <div key={f.title}
                className="rounded-xl p-6 group transition-all hover:border-primary/30 hover:shadow-lg relative"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(10px)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px rgba(0,209,178,0.08)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
              >
                {(f as any).badge && (
                  <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={(f as any).badge === "Included"
                      ? { background: "rgba(0,209,178,0.15)", color: "#00d1b2", border: "1px solid rgba(0,209,178,0.3)" }
                      : { background: "rgba(251,146,0,0.12)", color: "#f59e0b", border: "1px solid rgba(251,146,0,0.3)" }
                    }>
                    {(f as any).badge}
                  </span>
                )}
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-all group-hover:scale-110"
                  style={{ background: "rgba(0,209,178,0.1)", color: "#00d1b2" }}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Multilingual Feature Section ────────────────────────────────── */}
      <section className="py-24 border-t border-border" style={{ background: "rgba(0,209,178,0.02)" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
              style={{ background: "rgba(0,209,178,0.1)", border: "1px solid rgba(0,209,178,0.2)", color: "#00d1b2" }}>
              <Globe className="w-3.5 h-3.5" />
              Multilingual AI — Included in Every Plan
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Sarah speaks your buyer's language.<br />
              <span style={{ color: "#00d1b2" }}>No extra charge. No setup.</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Over 40% of property buyers in Greater Sydney speak a language other than English at home. Sarah detects their language instantly and switches — on voice calls and live chat — so your agency never loses a lead to a language barrier.
            </p>
          </div>

          {/* Language flags grid */}
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-3 md:grid-cols-9 gap-3 mb-10">
              {[
                { flag: "🇦🇺", lang: "English", note: "AU" },
                { flag: "🇨🇳", lang: "Mandarin", note: "普通话" },
                { flag: "🇸🇦", lang: "Arabic", note: "العربية" },
                { flag: "🇰🇷", lang: "Korean", note: "한국어" },
                { flag: "🇻🇳", lang: "Vietnamese", note: "Tiếng Việt" },
                { flag: "🇮🇳", lang: "Hindi", note: "हिंदी" },
                { flag: "🇵🇭", lang: "Filipino", note: "Tagalog" },
                { flag: "🇷🇺", lang: "Russian", note: "Русский" },
                { flag: "🇪🇸", lang: "Spanish", note: "Español" },
              ].map(l => (
                <div key={l.lang} className="flex flex-col items-center gap-1 p-3 rounded-xl text-center"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <span style={{ fontSize: 26 }}>{l.flag}</span>
                  <span className="text-[10px] font-bold text-foreground">{l.lang}</span>
                  <span className="text-[9px] text-muted-foreground">{l.note}</span>
                </div>
              ))}
            </div>

            {/* Key differentiator points */}
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { icon: "🎙️", title: "Voice auto-switches", desc: "Sarah detects the caller's language in the first sentence and responds natively — no menu prompts, no transfers." },
                { icon: "💬", title: "Chat auto-switches", desc: "Web chat widget detects typed language and switches immediately. Arabic, Korean, Vietnamese — all handled in real time." },
                { icon: "🆓", title: "Included at no charge", desc: "All 9 languages are built-in and included in every plan. Not an add-on. Not a premium tier. Just part of what Sarah does." },
              ].map(p => (
                <div key={p.title} className="rounded-xl p-5"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{p.icon}</div>
                  <div className="font-semibold text-foreground text-sm mb-1">{p.title}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">{p.desc}</div>
                </div>
              ))}
            </div>
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
                desc: "Booking confirmed, tenancy form emailed, or hot-transfer executed — whichever the lead requires. Zero admin. Zero delays.",
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

      {/* Pricing */}
      <section id="pricing" className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#00d1b2" }}>Pricing</div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Simple Pricing. Straight to Checkout.</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              One formula: base licence + seat count. Activate online in minutes via Stripe — no lock-in contracts.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-start">
            <PricingCalculator />

            <div className="space-y-4">
              <div className="rounded-xl p-6"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Check className="w-4 h-4" style={{ color: "#00d1b2" }} />
                  Everything included in every plan
                </h4>
                <div className="space-y-3">
                  {[
                    "AI Voice Receptionist (24/7)",
                    "AI Chat Receptionist",
                    "Agency website (Enterprise, Voyager or Discovery)",
                    "Automatic transcript emails after every call & chat",
                    "VaultRE CRM live sync",
                    "100 AI minutes/month included",
                    "NSW Tenancy Form automation",
                    "Hot lead call transfers",
                    "Command Bridge dashboard",
                    "Full call recordings & transcripts",
                    "Automated tax invoices via Stripe",
                    "Australian-hosted infrastructure",
                    "NSW Privacy Act compliant",
                  ].map(f => (
                    <div key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#00d1b2" }} />
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl p-5 flex items-start gap-3"
                style={{ background: "rgba(0,209,178,0.05)", border: "1px solid rgba(0,209,178,0.15)" }}>
                <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#00d1b2" }} />
                <div className="text-sm text-muted-foreground">
                  <strong className="text-foreground block mb-1">No lock-in contracts</strong>
                  Cancel at any time. Your data is always yours — export everything from your Command Bridge with one click.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo-section" className="py-20 border-t border-border" style={{ background: "rgba(0,209,178,0.02)" }}>
        <div className="container mx-auto px-4 text-center">
          <div className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#00d1b2" }}>Live Demo</div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Talk to the AI Receptionist</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-10">
            Experience exactly what your buyers and tenants experience. Ask about a property, request an inspection, or apply for a rental.
          </p>
          <div className="inline-flex items-center gap-3 rounded-full px-5 py-3 text-sm font-medium cursor-pointer transition-all hover:scale-105"
            style={{ background: "rgba(0,209,178,0.08)", border: "1px solid rgba(0,209,178,0.2)", color: "#00d1b2" }}
            onClick={() => document.querySelector<HTMLButtonElement>(".fixed.bottom-6.right-6")?.click()}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#00d1b2" }} />
            Click to open the AI Receptionist demo
            <ChevronRight className="w-4 h-4" />
          </div>
          <div className="mt-8 text-xs text-muted-foreground">
            Try asking: "I'm interested in a 2-bedroom rental in Surry Hills" or "I want to book an inspection for 14 Marine Parade"
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
            From $299/mo — no lock-in contracts — Australian-hosted infrastructure
          </p>
        </div>
      </section>

      {/* ── Voice Demo Section ───────────────────────────────────────────── */}
      <section className="py-20 relative overflow-hidden" id="voice-demo">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] blur-3xl opacity-10"
            style={{ background: "radial-gradient(ellipse, rgba(0,209,178,0.6) 0%, transparent 70%)" }} />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,209,178,0.2)", backdropFilter: "blur(20px)" }}>
            <div className="grid md:grid-cols-2 gap-0">

              {/* Left — description */}
              <div className="p-10 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5 w-fit"
                  style={{ background: "rgba(0,209,178,0.12)", color: "#00d1b2", border: "1px solid rgba(0,209,178,0.2)" }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#00d1b2" }} />
                  LIVE AI VOICE DEMO
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-4 leading-tight">
                  Call Sarah.<br />
                  <span style={{ background: "linear-gradient(135deg, #00d1b2, #00e8c8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Your AI Receptionist.
                  </span>
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Sarah answers 24/7, qualifies buyers and tenants, books inspections, and logs every lead to your dashboard automatically.
                  This is the same AI that will answer calls for your agency.
                </p>
                <div className="space-y-2.5">
                  {[
                    "Natural Australian female voice",
                    "Qualifies buyer intent in real time",
                    "Captures lead details automatically",
                    "Full transcript saved to your dashboard",
                  ].map(point => (
                    <div key={point} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: "#00d1b2" }} />
                      {point}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — call CTA */}
              <div className="p-10 flex flex-col items-center justify-center text-center"
                style={{ background: "rgba(0,209,178,0.04)", borderLeft: "1px solid rgba(0,209,178,0.15)" }}>
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto"
                    style={{ background: "linear-gradient(135deg, rgba(0,209,178,0.2), rgba(0,209,178,0.05))", border: "2px solid rgba(0,209,178,0.3)" }}>
                    <Phone className="w-10 h-10" style={{ color: "#00d1b2" }} />
                  </div>
                  <span className="absolute top-0 right-0 w-5 h-5 rounded-full border-2 border-background flex items-center justify-center"
                    style={{ background: "#22c55e" }}>
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mb-2">AI Receptionist — Live Now</p>
                <a
                  href="tel:0258504038"
                  className="text-4xl font-bold tracking-wider mb-2 hover:opacity-80 transition-opacity block"
                  style={{ color: "#00d1b2" }}
                >
                  02 5850 4038
                </a>
                <p className="text-xs text-muted-foreground mb-6">Australian number · tap to call on mobile</p>
                <a
                  href="tel:0258504038"
                  className="w-full font-bold py-4 px-6 rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2.5"
                  style={{ background: "linear-gradient(135deg, #00d1b2, #00b89c)", color: "#0a0a0a", boxShadow: "0 4px 24px rgba(0,209,178,0.35)" }}
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
