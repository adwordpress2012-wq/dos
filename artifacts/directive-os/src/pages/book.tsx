import { AppLayout } from "@/components/layout/MarketingLayout";
import { Check, Clock, Phone, Shield, CalendarCheck, ArrowRight } from "lucide-react";

const CALENDLY_URL = "https://calendly.com/adwordpress2012/directive-os-agency-onboarding";
const CALENDLY_IFRAME = `${CALENDLY_URL}?hide_gdpr_banner=1&background_color=111827&text_color=e5e7eb&primary_color=00d1b2`;

const WHAT_WE_COVER = [
  "How the AI receptionist handles your inbound calls and chats 24/7",
  "VaultRE CRM sync and how your listings stay live automatically",
  "Pricing, seat count, and what onboarding looks like for your agency",
  "Compliance with NSW tenancy requirements and Australian Privacy Act",
  "Go-live timeline — most agencies are live within 48 hours",
];

const QUICK_FACTS = [
  { icon: Clock, title: "15 minutes", sub: "Quick and focused — no sales pressure" },
  { icon: Shield, title: "No charge, ever", sub: "This call is completely free of charge" },
  { icon: Phone, title: "Phone or video", sub: "Your choice — wherever you're comfortable" },
];

export default function BookConsultation() {
  return (
    <AppLayout>
      <div className="min-h-screen py-16 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-5 px-4 py-1.5 rounded-full"
              style={{ color: "#00d1b2", background: "rgba(0,209,178,0.08)", border: "1px solid rgba(0,209,178,0.2)" }}>
              <Phone className="w-3.5 h-3.5" /> Free — No Charge
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Book Your Free<br />
              <span style={{ color: "#00d1b2" }}>Strategy Call</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto leading-relaxed">
              15 minutes. No charge. No commitment.<br />
              We'll walk you through exactly how Directive OS fits your agency.
            </p>
          </div>

          {/* Quick facts row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 max-w-2xl mx-auto">
            {QUICK_FACTS.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-3 bg-card border border-border rounded-xl p-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(0,209,178,0.1)" }}>
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{title}</div>
                  <div className="text-xs text-muted-foreground">{sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-5 gap-8 items-start">

            {/* Left — what we cover */}
            <div className="md:col-span-2 space-y-5">
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-primary" /> What we'll cover
                </h3>
                <ul className="space-y-3">
                  {WHAT_WE_COVER.map(item => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: "rgba(0,209,178,0.12)" }}>
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prefer to self-serve? */}
              <div className="bg-card border border-border rounded-2xl p-5 text-center">
                <p className="text-sm text-muted-foreground mb-3">Ready to activate right away?</p>
                <a
                  href="/sign-up"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:opacity-80"
                  style={{ color: "#00d1b2" }}
                >
                  Get Started Now <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Right — Calendly iframe */}
            <div className="md:col-span-3">
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
                <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">Select a time that suits you</span>
                  <span className="ml-auto text-xs text-muted-foreground">No credit card required</span>
                </div>
                <iframe
                  src={CALENDLY_IFRAME}
                  width="100%"
                  height="680"
                  frameBorder="0"
                  title="Book a free strategy call with Directive OS"
                  allow="fullscreen"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </AppLayout>
  );
}
