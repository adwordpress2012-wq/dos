import { useState, useRef } from "react";
import { Link } from "wouter";
import { AppLayout } from "@/components/layout/MarketingLayout";
import { useAiChat } from "@workspace/api-client-react";
import {
  Phone, MessageSquare, Zap, Shield, Building2, FileText,
  ArrowRight, Check, ChevronRight, X, Send, Mic, Star,
  Clock, TrendingUp, Users, BarChart3
} from "lucide-react";

const BASE_PRICE = 299;
const SEAT_PRICE = 89;
const SETUP_FEE = 1500;

function PricingCalculator() {
  const [seats, setSeats] = useState(1);
  const monthly = BASE_PRICE + Math.max(0, seats - 1) * SEAT_PRICE;

  return (
    <div className="bg-card border border-border rounded-2xl p-8 max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold text-foreground mb-2">Calculate Your Investment</h3>
      <p className="text-muted-foreground mb-8">Transparent pricing. No hidden fees.</p>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-foreground">Number of Agent Seats</label>
          <span className="text-2xl font-bold text-primary">{seats}</span>
        </div>
        <input
          type="range"
          min="1"
          max="15"
          value={seats}
          onChange={e => setSeats(Number(e.target.value))}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>1 seat</span>
          <span>15 seats</span>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center py-2 border-b border-border">
          <span className="text-muted-foreground">Base License (1st seat included)</span>
          <span className="font-semibold">${BASE_PRICE}/mo</span>
        </div>
        {seats > 1 && (
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted-foreground">{seats - 1} additional seat{seats > 2 ? "s" : ""} × ${SEAT_PRICE}/mo</span>
            <span className="font-semibold">${(seats - 1) * SEAT_PRICE}/mo</span>
          </div>
        )}
        <div className="flex justify-between items-center py-2 border-b border-border">
          <span className="text-muted-foreground">AI Minutes (100 included/mo)</span>
          <span className="font-semibold text-primary">Included</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border">
          <span className="text-muted-foreground">Overage rate</span>
          <span className="font-semibold">$25 per 10-min block</span>
        </div>
        <div className="flex justify-between items-center py-3">
          <span className="font-bold text-lg">Monthly Total (+ GST)</span>
          <span className="text-3xl font-bold text-primary">${monthly}/mo</span>
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="w-4 h-4 text-primary flex-shrink-0" />
          <span>One-time onboarding fee: <strong className="text-foreground">${SETUP_FEE} AUD + GST</strong> (includes training & setup)</span>
        </div>
      </div>

      <Link href="/sign-up">
        <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
          Get Started with {seats} Seat{seats > 1 ? "s" : ""}
          <ArrowRight className="w-4 h-4" />
        </button>
      </Link>
    </div>
  );
}

interface Message {
  role: "assistant" | "user";
  content: string;
}

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
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Thank you for your message. One of our agents will be in touch shortly." }]);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-primary hover:bg-primary/90 text-primary-foreground w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-primary px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-primary-foreground font-semibold text-sm">AI Receptionist Demo</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-primary-foreground/80 hover:text-primary-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 p-4 space-y-3 max-h-72 overflow-y-auto">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {chat.isPending && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-3 py-2 text-sm text-muted-foreground">
                  <span className="animate-pulse">Typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-border flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Type a message..."
              className="flex-1 bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={send}
              disabled={chat.isPending || !input.trim()}
              className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground rounded-lg p-2 transition-colors"
            >
              <Send className="w-4 h-4" />
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
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 py-24 md:py-36 text-center relative">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-sm px-4 py-1.5 rounded-full mb-8 font-medium">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Now live for Australian Real Estate Agencies
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 leading-tight">
            Your Agency's AI<br />
            <span className="text-primary">Receptionist. 24/7.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            Directive OS is the command infrastructure for modern real estate agencies. Never miss a lead — instantly qualify buyers and tenants, sync your VaultRE listings, and hand off hot leads to your agents in real time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-8 rounded-lg transition-all hover:scale-105 flex items-center gap-2 shadow-lg shadow-primary/25">
                Start Your Agency Free Trial
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <button
              onClick={() => document.getElementById("demo-section")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-card hover:bg-card/80 border border-border text-foreground font-semibold py-3 px-8 rounded-lg transition-all hover:scale-105 flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-primary" />
              See Live Demo
            </button>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { label: "Leads Captured", value: "24/7" },
              { label: "Response Time", value: "< 3s" },
              { label: "Setup Time", value: "< 48hrs" },
              { label: "AI Coverage", value: "100%" },
            ].map(stat => (
              <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Mission-Critical Infrastructure
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Every feature is engineered for the specific demands of Australian real estate operations.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Phone className="w-6 h-6" />,
                title: "AI Voice Receptionist",
                desc: "Handles inbound calls 24/7. Qualifies buyers and tenants, books inspections, and executes live call transfers to your listing agents."
              },
              {
                icon: <MessageSquare className="w-6 h-6" />,
                title: "AI Chat Receptionist",
                desc: "Embedded on your website or portal. Engages every visitor, captures lead details, and answers property questions instantly."
              },
              {
                icon: <Building2 className="w-6 h-6" />,
                title: "VaultRE CRM Sync",
                desc: "Automatically syncs your listings, agent contacts, and inspection times. The AI always has live, accurate property information."
              },
              {
                icon: <FileText className="w-6 h-6" />,
                title: "NSW Tenancy Forms",
                desc: "When a tenant asks to apply, the AI instantly emails the NSW Fair Trading Standard Tenancy Form. No manual follow-up required."
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Hot Lead Transfer",
                desc: "High-intent signals trigger an immediate call transfer to the listing agent's mobile — pulled directly from your CRM data."
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: "Lead Intelligence Dashboard",
                desc: "Complete call recordings, chat transcripts, and lead data in one Command Centre. Review while on the road from your iPhone."
              },
            ].map(f => (
              <div key={f.title} className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-colors">
                <div className="text-primary mb-4">{f.icon}</div>
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 border-t border-border bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Deployed in 48 Hours</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              We handle the full setup. You start capturing leads immediately.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Onboard & Activate",
                desc: "Register your agency ABN, select your seat count, and complete the one-time setup payment. Your Command Centre is provisioned instantly."
              },
              {
                step: "02",
                title: "Connect & Configure",
                desc: "We sync your VaultRE listings, configure your AI receptionist's knowledge base, and assign your dedicated phone number."
              },
              {
                step: "03",
                title: "Go Live",
                desc: "Deploy your AI receptionist to your website and phone line. From this moment, every lead is captured, qualified, and routed automatically."
              },
            ].map(step => (
              <div key={step.step} className="text-center">
                <div className="text-5xl font-bold text-primary/20 mb-4">{step.step}</div>
                <h3 className="font-semibold text-foreground mb-3 text-xl">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Trusted by Leading Agencies</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                quote: "We were missing calls after hours constantly. Directive OS changed that overnight. Our lead capture rate went up 40% in the first month.",
                name: "James Harrison",
                role: "Principal — Pinnacle Real Estate, Sydney"
              },
              {
                quote: "The VaultRE integration is seamless. The AI knows every listing, every inspection time. It's like having a full-time receptionist who never sleeps.",
                name: "Sarah Chen",
                role: "Director — Harbour Property Group, North Sydney"
              },
              {
                quote: "I was sceptical about AI for real estate. But when I saw a hot buyer transferred directly to my mobile at 9pm on a Saturday, I was sold.",
                name: "Michael Rossi",
                role: "Principal — The Property Collection, Parramatta"
              },
            ].map(t => (
              <div key={t.name} className="bg-card border border-border rounded-xl p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 italic">"{t.quote}"</p>
                <div>
                  <div className="font-semibold text-sm text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 border-t border-border bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Seat-Based Pricing</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Scale your team, scale your coverage. One simple formula, transparent invoicing.
            </p>
          </div>
          <PricingCalculator />
          <div className="mt-8 grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              "GST-compliant Tax Invoices",
              "100 AI minutes/month included",
              "No lock-in contracts",
              "Australian-hosted infrastructure",
              "NSW Privacy Act compliant",
              "Cancel anytime"
            ].map(f => (
              <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo-section" className="py-20 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Talk to the AI Receptionist
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-8">
            Experience what your callers and website visitors experience. Try asking about a property, requesting an inspection, or applying for a rental.
          </p>
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-sm px-4 py-2 rounded-full">
            <MessageSquare className="w-4 h-4" />
            Click the chat bubble in the bottom right to start the demo
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Deploy Your Command Bridge?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-10">
            Join the agencies capturing 100% of after-hours leads. Setup takes less than 48 hours.
          </p>
          <Link href="/sign-up">
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 px-10 rounded-lg transition-all hover:scale-105 shadow-lg shadow-primary/25 flex items-center gap-2 mx-auto">
              Activate Directive OS
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </section>

      <DemoChatWidget />
    </AppLayout>
  );
}
