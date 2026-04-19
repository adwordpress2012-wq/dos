import { Link } from "react-router-dom";
import { Phone, MessageSquare, Calendar, Mail } from "lucide-react";

const steps = [
  {
    icon: Phone,
    title: "Customer calls your number",
    desc: "Sarah answers instantly — day or night. No voicemail, no hold music, no missed calls.",
  },
  {
    icon: MessageSquare,
    title: "Sarah qualifies and captures",
    desc: "She asks the right questions, confirms the caller's name, phone, and email — then wraps up warmly.",
  },
  {
    icon: Calendar,
    title: "Booking link texted automatically",
    desc: "Within seconds, Sarah texts the caller your Calendly link with a friendly message. \"Your slot isn't confirmed until you pick a time.\"",
  },
  {
    icon: Mail,
    title: "You get a full summary",
    desc: "An email lands in your inbox with the caller's details, what they need, and the full conversation transcript.",
  },
];

export default function HowItWorks() {
  return (
    <div className="pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="text-xs font-bold tracking-widest mb-3" style={{ color: "rgba(0,201,167,0.7)" }}>HOW IT WORKS</div>
          <h1 className="text-4xl font-bold text-white mb-4">Simple. Automatic. Always on.</h1>
          <p className="text-base" style={{ color: "rgba(255,255,255,0.5)" }}>
            BookOS runs quietly in the background. You focus on the work. Sarah handles every call.
          </p>
        </div>

        <div className="space-y-4">
          {steps.map((s, i) => (
            <div key={i} className="flex gap-5 p-6 rounded-2xl border" style={{ background: "rgba(10,28,48,0.6)", borderColor: "rgba(0,201,167,0.12)" }}>
              <div className="shrink-0">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(0,201,167,0.1)", border: "1px solid rgba(0,201,167,0.2)" }}>
                  <s.icon className="w-5 h-5" style={{ color: "#00c9a7" }} />
                </div>
              </div>
              <div>
                <div className="text-xs font-bold font-mono mb-1" style={{ color: "rgba(0,201,167,0.6)" }}>STEP {i + 1}</div>
                <h3 className="font-bold text-white mb-1">{s.title}</h3>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/signup" className="inline-flex items-center px-8 py-3.5 rounded-xl font-bold glow-teal transition-all" style={{ background: "#00c9a7", color: "#06111f" }}>
            Get Started Today
          </Link>
        </div>
      </div>
    </div>
  );
}
