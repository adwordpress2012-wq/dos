import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Phone } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SARAH_INTRO = "Hi there! I'm Sarah, the virtual receptionist for Meridian Property Group. I can help you with property enquiries, book inspections, or connect you with one of our agents. What can I help you with today?";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

export default function SarahChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: SARAH_INTRO },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionId = useRef<string>(crypto.randomUUID());

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId.current,
          message: text,
          agencyId: 1,
        }),
      });

      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const assistantMsg: Message = { role: "assistant", content: data.message || data.reply || "I'm not sure how to help with that — please call us on 02 5850 4038." };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having a moment. Please call us on 02 5850 4038 and we'll get you sorted right away!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Chat with Sarah"}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gold shadow-lg hover:bg-gold-dark transition-colors flex items-center justify-center group"
      >
        {open ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
          </>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-[#0F1623] px-4 py-3 flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center">
                <span className="text-gold font-serif font-bold text-base">S</span>
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0F1623]" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-none">Sarah</p>
              <p className="text-white/50 text-xs mt-0.5">AI Receptionist · Meridian Property Group</p>
            </div>
            <a
              href="tel:0258504038"
              className="ml-auto flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors"
              title="Call us"
            >
              <Phone className="w-3.5 h-3.5" />
              02 5850 4038
            </a>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 max-h-80 min-h-40 bg-[#faf9f7]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center mr-2 shrink-0 mt-0.5">
                    <span className="text-gold font-serif font-bold text-xs">S</span>
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gold text-white rounded-br-sm"
                      : "bg-white text-foreground border border-border rounded-bl-sm shadow-xs"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center mr-2 shrink-0 mt-0.5">
                  <span className="text-gold font-serif font-bold text-xs">S</span>
                </div>
                <div className="bg-white border border-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-xs flex items-center gap-1">
                  <span className="typing-dot w-2 h-2 rounded-full bg-muted-foreground" />
                  <span className="typing-dot w-2 h-2 rounded-full bg-muted-foreground" />
                  <span className="typing-dot w-2 h-2 rounded-full bg-muted-foreground" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border bg-white px-3 py-3 flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type a message…"
              className="flex-1 text-sm bg-muted rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gold/40 placeholder:text-muted-foreground"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-full bg-gold hover:bg-gold-dark disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors shrink-0"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Powered by badge */}
          <div className="bg-[#faf9f7] border-t border-border px-3 py-2 flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <a
              href="https://directiveos.com.au"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Powered by <strong>Directive OS</strong> AI Receptionist
            </a>
          </div>
        </div>
      )}
    </>
  );
}
