import { useState, useRef } from "react";
import { Link } from "wouter";
import { AppLayout } from "@/components/layout/MarketingLayout";
import { useAiChat } from "@workspace/api-client-react";
import {
  Phone, MessageSquare, Zap, Shield, Building2, FileText,
  ArrowRight, Check, X, Send, Star, BarChart3,
  Workflow, BrainCircuit, CalendarCheck, Bell, Lock, ChevronRight,
  Bed, Bath
} from "lucide-react";

const BASE_PRICE = 299;
const SEAT_PRICE = 89;
const SETUP_FEE = 1500;

function PricingCalculator() {
  const [seats, setSeats] = useState(1);
  const monthly = BASE_PRICE + Math.max(0, seats - 1) * SEAT_PRICE;

  return (
    <div
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

      <h3 className="text-2xl font-bold text-foreground mb-1">Calculate Your Investment</h3>
      <p className="text-muted-foreground mb-8 text-sm">Transparent pricing. No hidden fees. Cancel anytime.</p>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-foreground">Number of Agent Seats</label>
          <span className="text-3xl font-bold text-primary">{seats}</span>
        </div>
        <input
          type="range" min="1" max="15" value={seats}
          onChange={e => setSeats(Number(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary"
          style={{ background: `linear-gradient(to right, #00d1b2 0%, #00d1b2 ${((seats - 1) / 14) * 100}%, rgba(255,255,255,0.1) ${((seats - 1) / 14) * 100}%, rgba(255,255,255,0.1) 100%)` }}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>1 seat</span><span>15 seats</span>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center py-2.5 border-b border-white/5 text-sm">
          <span className="text-muted-foreground">Base License (1st seat included)</span>
          <span className="font-semibold text-foreground">${BASE_PRICE}/mo</span>
        </div>
        {seats > 1 && (
          <div className="flex justify-between items-center py-2.5 border-b border-white/5 text-sm">
            <span className="text-muted-foreground">{seats - 1} additional seat{seats > 2 ? "s" : ""} × ${SEAT_PRICE}/mo</span>
            <span className="font-semibold text-foreground">${(seats - 1) * SEAT_PRICE}/mo</span>
          </div>
        )}
        <div className="flex justify-between items-center py-2.5 border-b border-white/5 text-sm">
          <span className="text-muted-foreground">100 AI minutes/month</span>
          <span className="font-semibold text-primary">Included</span>
        </div>
        <div className="flex justify-between items-center py-2.5 border-b border-white/5 text-sm">
          <span className="text-muted-foreground">Excess AI usage</span>
          <span className="font-semibold text-foreground">$25 per 10-min block</span>
        </div>
        <div className="flex justify-between items-center pt-4">
          <span className="font-bold text-foreground text-lg">Monthly Total</span>
          <div className="text-right">
            <div className="text-4xl font-bold text-primary">${monthly}<span className="text-xl font-normal text-muted-foreground">/mo</span></div>
            <div className="text-xs text-muted-foreground">+ GST</div>
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

      <Link href="/sign-up">
        <button className="w-full font-bold py-3.5 px-6 rounded-xl transition-all hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, #00d1b2, #00b89c)", color: "#0a0a0a", boxShadow: "0 4px 24px rgba(0,209,178,0.3)" }}>
          Get Started with {seats} Seat{seats > 1 ? "s" : ""}
          <ArrowRight className="w-4 h-4" />
        </button>
      </Link>
    </div>
  );
}

interface Message { role: "assistant" | "user"; content: string; }

function DemoChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm the Directive OS AI Receptionist for Pinnacle Real Estate. I'm available 24/7 to assist you. Are you a buyer looking to purchase, or a tenant looking for a rental?" }
  ]);
  const [input, setInput] = useState("");
  const [sessionId] = useState(`demo_${Date.now()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chat = useAiChat();

  const send = async () => {
    if (!input.trim() || chat.isPending) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    try {
      const result = await chat.mutateAsync({ data: { sessionId, message: userMsg, agencyId: null } });
      setMessages(prev => [...prev, { role: "assistant", content: result.reply }]);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Thank you for your message. One of our agents will be in touch shortly." }]);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110"
        style={{ background: "linear-gradient(135deg, #00d1b2, #00b89c)", boxShadow: "0 4px 24px rgba(0,209,178,0.4)" }}
      >
        <MessageSquare className="w-6 h-6 text-black" />
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[340px] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{ background: "rgba(13,17,23,0.97)", border: "1px solid rgba(0,209,178,0.25)", backdropFilter: "blur(20px)" }}>
          <div className="px-4 py-3 flex items-center justify-between"
            style={{ background: "linear-gradient(135deg, rgba(0,209,178,0.15), rgba(0,209,178,0.05))", borderBottom: "1px solid rgba(0,209,178,0.15)" }}>
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#00d1b2", boxShadow: "0 0 8px #00d1b2" }} />
              <div>
                <div className="text-sm font-semibold text-foreground">Directive OS — Live Demo</div>
                <div className="text-xs text-muted-foreground">Pinnacle Real Estate · AI Receptionist</div>
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
            {chat.isPending && (
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
              placeholder="Ask about a property..."
              className="flex-1 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", focusRingColor: "#00d1b2" } as React.CSSProperties}
            />
            <button onClick={send} disabled={chat.isPending || !input.trim()}
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
          <div className="inline-flex items-center gap-2 rounded-full mb-8 text-sm px-4 py-1.5 font-medium"
            style={{ background: "rgba(0,209,178,0.08)", border: "1px solid rgba(0,209,178,0.2)", color: "#00d1b2" }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#00d1b2", boxShadow: "0 0 8px #00d1b2" }} />
            Now live for Australian Real Estate Agencies
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.05]">
            <span className="text-foreground">The AI Infrastructure for</span><br />
            <span style={{ background: "linear-gradient(135deg, #00d1b2 0%, #00e8c8 50%, #00b89c 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Top-Tier Agencies.
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            Directive OS is the command infrastructure that powers modern real estate agencies.
            Your AI Receptionist handles every call and chat — 24/7 — qualifying buyers, syncing VaultRE listings,
            and routing hot leads to your agents in real time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/sign-up">
              <button className="font-bold py-3.5 px-8 rounded-xl transition-all hover:scale-105 flex items-center gap-2"
                style={{ background: "linear-gradient(135deg, #00d1b2, #00b89c)", color: "#0a0a0a", boxShadow: "0 4px 32px rgba(0,209,178,0.35)" }}>
                Activate Your Agency
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <button
              onClick={() => document.getElementById("demo-section")?.scrollIntoView({ behavior: "smooth" })}
              className="font-semibold py-3.5 px-8 rounded-xl transition-all hover:scale-105 flex items-center gap-2 text-foreground hover:border-primary/40"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <MessageSquare className="w-4 h-4" style={{ color: "#00d1b2" }} />
              See Live Demo
            </button>
          </div>

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
            ].map(f => (
              <div key={f.title}
                className="rounded-xl p-6 group transition-all hover:border-primary/30 hover:shadow-lg"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(10px)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px rgba(0,209,178,0.08)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
              >
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

      {/* Pricing */}
      <section id="pricing" className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#00d1b2" }}>Pricing</div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Seat-Based. Scalable. Transparent.</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              One formula: base license + seat count. Scale your team, scale your coverage.
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
                    "VaultRE CRM live sync",
                    "100 AI minutes/month included",
                    "NSW Tenancy Form automation",
                    "Hot lead call transfers",
                    "Command Bridge dashboard",
                    "Full call recordings & transcripts",
                    "GST-compliant tax invoices",
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
          <Link href="/sign-up">
            <button className="font-bold py-4 px-12 rounded-xl transition-all hover:scale-105 text-lg mx-auto flex items-center gap-3"
              style={{ background: "linear-gradient(135deg, #00d1b2, #00b89c)", color: "#0a0a0a", boxShadow: "0 8px 40px rgba(0,209,178,0.35)" }}>
              Activate Directive OS
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
          <p className="text-muted-foreground text-sm mt-6">
            From $299/mo + GST — no lock-in contracts — Australian-hosted infrastructure
          </p>
        </div>
      </section>

      <DemoChatWidget />
    </AppLayout>
  );
}
