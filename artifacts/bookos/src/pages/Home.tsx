import { Link } from "react-router-dom";
import { Phone, CheckCircle, Scissors, Wrench, Heart, Star } from "lucide-react";

const DEMO_NUMBER  = import.meta.env.VITE_BOOKOS_DEMO_NUMBER  ?? "02 5850 4038";
const DEMO_DISPLAY = import.meta.env.VITE_BOOKOS_DEMO_DISPLAY ?? "02 5850 4038";

const industries = [
  { icon: Scissors, label: "Hair & Beauty Salons", desc: "Never miss a booking enquiry again" },
  { icon: Wrench,   label: "Trades & Services",    desc: "Plumbers, electricians, builders & more" },
  { icon: Heart,    label: "Wellness & Health",     desc: "Physio, massage, yoga & clinics" },
];

const benefits = [
  "Answers every call — 24 hours, 7 days",
  "Texts your Calendly link instantly after each call",
  "Captures caller name, number, and email automatically",
  "Emails you a full summary of every conversation",
  "Works on any existing phone number",
  "Setup in 15 minutes — no IT required",
];

const proof = [
  { stat: "< 2s",  label: "Average answer time" },
  { stat: "100%",  label: "Calls answered" },
  { stat: "24/7",  label: "Always on" },
  { stat: "5 sec", label: "SMS booking link sent" },
];

export default function Home() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, #00c9a7, transparent 70%)" }} />
        </div>

        <div className="max-w-6xl mx-auto px-4 py-24 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-8 border" style={{ background: "rgba(0,201,167,0.08)", borderColor: "rgba(0,201,167,0.25)", color: "#00c9a7" }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#00c9a7" }} />
            Live in Australia — Powered by AI
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            Sarah answers every call.
            <br />
            <span style={{ color: "#00c9a7" }}>Your customers book themselves.</span>
            <br />
            <span className="text-3xl md:text-5xl font-normal" style={{ color: "rgba(255,255,255,0.7)" }}>
              You stay focused on the chair&nbsp;/&nbsp;the job.
            </span>
          </h1>

          <p className="text-lg max-w-2xl mx-auto mb-10" style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
            BookOS is an AI receptionist built for Australian salons, tradies, and wellness businesses.
            Sarah answers every call in under 2 seconds, captures the enquiry, and texts your online booking link — automatically.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <a
              href={`tel:${DEMO_NUMBER.replace(/\s/g, "")}`}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-base transition-all glow-teal"
              style={{ background: "#00c9a7", color: "#06111f" }}
            >
              <Phone className="w-4 h-4" />
              Try Sarah Now — Call {DEMO_DISPLAY}
            </a>
            <Link
              to="/pricing"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-base border transition-all"
              style={{ borderColor: "rgba(0,201,167,0.3)", color: "#00c9a7", background: "rgba(0,201,167,0.06)" }}
            >
              See Plans & Pricing
            </Link>
          </div>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            Demo line — call right now and speak to Sarah live
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto">
            {proof.map(p => (
              <div key={p.stat} className="p-4 rounded-xl border" style={{ background: "rgba(10,28,48,0.6)", borderColor: "rgba(0,201,167,0.12)" }}>
                <div className="text-2xl font-bold font-mono mb-1" style={{ color: "#00c9a7" }}>{p.stat}</div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{p.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-20 border-t" style={{ borderColor: "rgba(0,201,167,0.08)" }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-xs font-bold tracking-widest mb-3" style={{ color: "rgba(0,201,167,0.7)" }}>BUILT FOR</div>
            <h2 className="text-3xl font-bold text-white">Every business that gets phone calls</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {industries.map(ind => (
              <div key={ind.label} className="p-6 rounded-2xl border transition-all" style={{ background: "rgba(10,28,48,0.6)", borderColor: "rgba(0,201,167,0.12)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(0,201,167,0.1)", border: "1px solid rgba(0,201,167,0.2)" }}>
                  <ind.icon className="w-5 h-5" style={{ color: "#00c9a7" }} />
                </div>
                <h3 className="font-bold text-white mb-1">{ind.label}</h3>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{ind.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Everything you need. Nothing you don't.</h2>
            <p className="text-base" style={{ color: "rgba(255,255,255,0.5)" }}>No complex setup. No monthly contracts you can't understand. Just Sarah answering your calls.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {benefits.map(b => (
              <div key={b} className="flex items-start gap-3 p-4 rounded-xl border" style={{ background: "rgba(10,28,48,0.5)", borderColor: "rgba(0,201,167,0.1)" }}>
                <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#00c9a7" }} />
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-20 border-t" style={{ borderColor: "rgba(0,201,167,0.08)" }}>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" style={{ color: "#f59e0b" }} />)}
          </div>
          <blockquote className="text-xl font-medium text-white max-w-2xl mx-auto mb-4">
            "We were missing 30% of our calls after hours. Since Sarah, every single one gets answered and they get a booking link straight away."
          </blockquote>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>— Salon owner, Western Sydney</p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to never miss a call?</h2>
          <p className="text-base mb-8" style={{ color: "rgba(255,255,255,0.5)" }}>
            Setup takes 15 minutes. Sarah is live on your number the same day.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg glow-teal transition-all"
            style={{ background: "#00c9a7", color: "#06111f" }}
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
}
