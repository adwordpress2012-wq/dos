import { useState, useRef, useEffect } from "react";
import { AppLayout } from "@/components/layout/MarketingLayout";
import {
  Phone, MessageSquare, MapPin, Star, Check,
  ArrowRight, Calendar, Send, Clock, Bell, Zap, Home
} from "lucide-react";

const JAYSON_PHONE = "02 5850 4038";
const JAYSON_CALENDLY = "https://calendly.com/adwordpress2012/directive-os-agency-onboarding";

function useQueryParam(key: string, fallback: string) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key) || fallback;
}

function SarahChat({ agency, suburb }: { agency: string; suburb: string }) {
  const [messages, setMessages] = useState([
    { from: "sarah", text: `Hi there! Thanks for visiting ${agency}. I'm Sarah, your AI receptionist. Are you looking to buy, sell, or rent in ${suburb}?` }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const RESPONSES: Record<string, string> = {
    buy: `Great! We have some beautiful properties available in ${suburb} right now. Could I grab your name and number so one of our agents can call you with the best matches?`,
    sell: `Wonderful — ${suburb} is a fantastic market right now. I can book you a free appraisal with one of our senior agents. What day works best for you?`,
    rent: `Of course! We have several rental properties available in ${suburb}. Are you looking for a house or an apartment?`,
    price: `Great question! Jayson, our principal, will personally get back to you with all the pricing details. Could I grab your name and best contact number?`,
    inspect: `Absolutely! I can book you in for an inspection. What property are you interested in, and when are you available?`,
    default: `Thanks for that! Let me make sure one of our agents gets back to you with all the details. Could I take your name and best contact number?`
  };

  const getReply = (msg: string) => {
    const lower = msg.toLowerCase();
    if (lower.includes("buy") || lower.includes("purchase")) return RESPONSES.buy;
    if (lower.includes("sell") || lower.includes("list") || lower.includes("apprais")) return RESPONSES.sell;
    if (lower.includes("rent") || lower.includes("lease") || lower.includes("tenant")) return RESPONSES.rent;
    if (lower.includes("price") || lower.includes("cost") || lower.includes("worth") || lower.includes("guide")) return RESPONSES.price;
    if (lower.includes("inspect") || lower.includes("view") || lower.includes("open")) return RESPONSES.inspect;
    return RESPONSES.default;
  };

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(m => [...m, { from: "user", text: userMsg }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, { from: "sarah", text: getReply(userMsg) }]);
    }, 1200);
  };

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  return (
    <div className="rounded-2xl border border-border overflow-hidden flex flex-col" style={{ height: 420, background: "rgba(255,255,255,0.03)" }}>
      <div className="px-4 py-3 flex items-center gap-3 border-b border-border" style={{ background: "rgba(0,209,178,0.08)" }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: "linear-gradient(135deg,#00d1b2,#00b89c)", color: "#0a0a0a" }}>S</div>
        <div>
          <p className="text-sm font-semibold text-foreground">Sarah — AI Receptionist</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />Online 24/7</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              m.from === "user"
                ? "text-white rounded-br-sm"
                : "text-foreground rounded-bl-sm border border-border"
            }`} style={m.from === "user" ? { background: "linear-gradient(135deg,#00d1b2,#00b89c)", color: "#0a0a0a" } : { background: "rgba(255,255,255,0.05)" }}>
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm px-4 py-3 border border-border flex gap-1" style={{ background: "rgba(255,255,255,0.05)" }}>
              {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div className="p-3 border-t border-border flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Type a message..."
          className="flex-1 bg-background border border-border rounded-xl px-4 py-2 text-sm outline-none focus:border-primary transition-colors"
        />
        <button onClick={send} className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:opacity-90 flex-shrink-0" style={{ background: "linear-gradient(135deg,#00d1b2,#00b89c)" }}>
          <Send className="w-4 h-4" style={{ color: "#0a0a0a" }} />
        </button>
      </div>
    </div>
  );
}

export default function DemoPage() {
  const agency = useQueryParam("agency", "Your Real Estate Agency");
  const suburb = useQueryParam("suburb", "Your Suburb");
  const agent = useQueryParam("agent", "Jayson");

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      {/* Preview bar */}
      <div className="w-full py-2.5 px-4 text-center text-xs font-semibold flex items-center justify-center gap-3 flex-wrap" style={{ background: "linear-gradient(135deg,#00d1b2,#00b89c)", color: "#0a0a0a" }}>
        <span>👋 This is your custom website preview — powered by Directive OS</span>
        <a href={`tel:${JAYSON_PHONE.replace(/\s/g,"")}`} className="underline font-bold">Call Jayson to go live today: {JAYSON_PHONE}</a>
      </div>

      {/* Agency nav */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm" style={{ background: "linear-gradient(135deg,#00d1b2,#00b89c)", color: "#0a0a0a" }}>
              {agency.charAt(0)}
            </div>
            <span className="font-bold text-lg tracking-tight">{agency}</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Buy</a>
            <a href="#" className="hover:text-foreground transition-colors">Sell</a>
            <a href="#" className="hover:text-foreground transition-colors">Rent</a>
            <a href="#" className="hover:text-foreground transition-colors">About</a>
          </nav>
          <a href={`tel:${JAYSON_PHONE.replace(/\s/g,"")}`} className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-all hover:opacity-90" style={{ background: "rgba(0,209,178,0.1)", border: "1px solid rgba(0,209,178,0.3)", color: "#00d1b2" }}>
            <Phone className="w-4 h-4" />{JAYSON_PHONE}
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,209,178,0.15) 0%, transparent 60%), #0a0e1a", minHeight: 480 }}>
        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-5 border" style={{ color: "#00d1b2", borderColor: "rgba(0,209,178,0.3)", background: "rgba(0,209,178,0.08)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
            AI Receptionist Online 24/7
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 leading-tight">
            Welcome to <span style={{ color: "#00d1b2" }}>{agency}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Your trusted real estate experts in <strong className="text-foreground">{suburb}</strong> — buying, selling and renting with confidence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href={JAYSON_CALENDLY} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-lg text-sm transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg,#00d1b2,#00b89c)", color: "#0a0a0a" }}>
              <Calendar className="w-4 h-4" />Book a Free Appraisal
            </a>
            <a href="#chat" className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-lg text-sm border border-border hover:border-primary transition-colors">
              <MessageSquare className="w-4 h-4" />Chat with Sarah Now
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Clock, title: "24/7 AI Receptionist", desc: `Sarah answers every call for ${agency} — day, night and weekends.` },
              { icon: Bell, title: "Instant Lead Alerts", desc: `${agent} gets a text and email the moment a new enquiry comes in.` },
              { icon: Zap, title: "Same-Day Response", desc: `No voicemail. Every enquiry is captured and actioned within minutes.` },
            ].map((f, i) => (
              <div key={i} className="text-center p-6 rounded-xl border border-border" style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(0,209,178,0.1)" }}>
                  <f.icon className="w-5 h-5" style={{ color: "#00d1b2" }} />
                </div>
                <h3 className="font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chat demo */}
      <section id="chat" className="py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-3">Meet Sarah — Your AI Receptionist</h2>
            <p className="text-muted-foreground">Available right now. Try asking about buying, selling or renting in {suburb}.</p>
          </div>
          <SarahChat agency={agency} suburb={suburb} />
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-border" style={{ background: "rgba(0,209,178,0.04)" }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto text-center">
            {[
              { val: "24/7", label: "Always Available" },
              { val: "< 2s", label: "Response Time" },
              { val: "100%", label: "Calls Answered" },
              { val: "0", label: "Missed Leads" },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-3xl font-bold mb-1" style={{ color: "#00d1b2" }}>{s.val}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t" style={{ background: "rgba(10,14,26,0.97)", backdropFilter: "blur(20px)", borderColor: "rgba(0,209,178,0.25)" }}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-bold text-sm text-foreground">Want this live for your agency today?</p>
            <p className="text-xs text-muted-foreground">$1,800 setup · $299/month · Goes live same day</p>
          </div>
          <div className="flex items-center gap-2">
            <a href={`tel:${JAYSON_PHONE.replace(/\s/g,"")}`} className="inline-flex items-center gap-2 font-bold text-sm px-4 py-2.5 rounded-lg border transition-colors" style={{ borderColor: "rgba(0,209,178,0.4)", color: "#00d1b2" }}>
              <Phone className="w-4 h-4" />{JAYSON_PHONE}
            </a>
            <a href={JAYSON_CALENDLY} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-bold text-sm px-5 py-2.5 rounded-lg transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg,#00d1b2,#00b89c)", color: "#0a0a0a" }}>
              <Calendar className="w-4 h-4" />Book a Demo
            </a>
          </div>
        </div>
      </div>
      <div className="h-20" />
    </div>
  );
}
