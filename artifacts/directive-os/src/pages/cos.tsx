import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { MessageSquare, X, Send, Sparkles, Phone } from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL ?? "";

interface Msg {
  role: "assistant" | "user";
  content: string;
}

export default function CosPage() {
  const [open, setOpen] = useState(true);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "G'day — I'm Micah, the AI receptionist for our demo venue. Ask about opening hours, the menu, or tell me you’d like a table and I’ll walk through a booking.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  async function send() {
    const text = input.trim();
    if (!text || typing) return;
    const prior = messages;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setTyping(true);
    try {
      const res = await fetch(`${API}/api/widget/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: "micah-demo",
          message: text,
          messages: prior.map((x) => ({ role: x.role, content: x.content })),
        }),
      });
      const data = await res.json();
      const reply = typeof data.reply === "string" ? data.reply : "One moment — try again in a sec.";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Sorry — connection issue. Please refresh and try again.",
        },
      ]);
    }
    setTyping(false);
  }

  return (
    <main className="min-h-screen text-white relative overflow-hidden" style={{ background: "linear-gradient(165deg, #0f0820 0%, #1e1035 40%, #0c4f4a 100%)" }}>
      <div className="pointer-events-none absolute inset-0 opacity-40" style={{
        backgroundImage: "radial-gradient(circle at 20% 20%, rgba(124,58,237,0.35), transparent 45%), radial-gradient(circle at 80% 30%, rgba(236,72,153,0.2), transparent 40%)",
      }} />

      <div className="relative mx-auto max-w-6xl px-6 py-14 md:py-20">
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <span className="text-xs uppercase tracking-[0.25em]" style={{ color: "#c4b5fd" }}>
            Chat OS · Live showcase
          </span>
          <Link href="/" className="text-xs text-white/50 hover:text-white transition-colors">
            directiveos.com.au
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold mb-6"
              style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.35)", color: "#e9d5ff" }}>
              <Sparkles className="w-3.5 h-3.5" />
              Conversational AI · SMS · WhatsApp · Voice
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5 bg-gradient-to-r from-white via-purple-100 to-teal-200 bg-clip-text text-transparent">
              Micah live demo
            </h1>
            <p className="text-lg text-white/75 leading-relaxed mb-8 max-w-xl">
              This page is the Micah experience — FAQs, opening hours, menu questions, and a full conversational booking flow.
              DOS hosts the business hub; COS is where we show what Micah feels like in the wild.
            </p>
            <ul className="space-y-3 text-sm text-white/70 mb-10">
              <li className="flex gap-2"><span style={{ color: "#14b8a6" }}>✓</span> Natural booking capture (date → time → guests → name → phone)</li>
              <li className="flex gap-2"><span style={{ color: "#14b8a6" }}>✓</span> Hand-off message only after details are collected</li>
              <li className="flex gap-2"><span style={{ color: "#14b8a6" }}>✓</span> Same Micah stack powers DOS client deployments</li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <a
                href="tel:0258504038"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-transform hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, #14b8a6, #0d9488)", color: "#042f2e" }}
              >
                <Phone className="w-4 h-4" />
                Voice demo line
              </a>
              <Link
                href="/#instant-quote"
                className="inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold text-white/90 transition-transform hover:scale-[1.02]"
                style={{ borderColor: "rgba(168,85,247,0.4)", background: "rgba(124,58,237,0.12)" }}
              >
                Instant AI quote (DOS)
              </Link>
            </div>
          </div>

          <div className="relative">
            <div
              className="rounded-3xl overflow-hidden flex flex-col shadow-2xl min-h-[460px]"
              style={{
                background: "rgba(15,23,42,0.75)",
                border: "1px solid rgba(168,85,247,0.35)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 0 60px rgba(124,58,237,0.2)",
              }}
            >
              <div className="px-4 py-3 flex items-center justify-between border-b border-white/10"
                style={{ background: "linear-gradient(90deg, rgba(124,58,237,0.25), rgba(236,72,153,0.08))" }}>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: "#a855f7", boxShadow: "0 0 10px #a855f7" }} />
                  <div>
                    <div className="text-sm font-semibold">Micah · Demo venue</div>
                    <div className="text-[11px] text-white/50">client_id: micah-demo</div>
                  </div>
                </div>
                <button type="button" className="p-2 rounded-lg hover:bg-white/10 text-white/50" onClick={() => setOpen((o) => !o)} aria-label="Minimise">
                  {open ? <X className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                </button>
              </div>

              {open && (
                <>
                  <div className="flex-1 p-4 space-y-3 max-h-[340px] overflow-y-auto">
                    {messages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                            msg.role === "user" ? "text-white font-medium" : "text-white/90"
                          }`}
                          style={
                            msg.role === "user"
                              ? { background: "linear-gradient(135deg, #7c3aed, #db2777)" }
                              : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }
                          }
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {typing && (
                      <div className="flex justify-start">
                        <div className="rounded-2xl px-3 py-2 text-xs text-white/50 flex gap-1 items-center" style={{ background: "rgba(255,255,255,0.05)" }}>
                          <span className="animate-pulse">Micah is typing…</span>
                        </div>
                      </div>
                    )}
                    <div ref={bottomRef} />
                  </div>
                  <div className="p-3 flex gap-2 border-t border-white/10">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && void send()}
                      placeholder="Book a table, ask hours, or browse the menu…"
                      className="flex-1 rounded-xl px-3 py-2.5 text-sm bg-white/5 border border-white/10 text-white placeholder:text-white/35 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => void send()}
                      disabled={typing || !input.trim()}
                      className="rounded-xl p-3 disabled:opacity-40 transition-all hover:scale-105"
                      style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}
                    >
                      <Send className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
