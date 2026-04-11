import { useEffect } from "react";
import { AppLayout } from "@/components/layout/MarketingLayout";
import { Check, Clock, Phone, Shield, CalendarCheck } from "lucide-react";

const CALENDLY_URL = "https://calendly.com/adwordpress2012/directive-os-agency-onboarding";

const WHAT_WE_COVER = [
  "How the AI receptionist handles your inbound calls and chats 24/7",
  "VaultRE CRM sync and how your listings stay live automatically",
  "Pricing, seat count, and what onboarding looks like for your agency",
  "Compliance with NSW tenancy requirements and Australian Privacy Act",
  "Go-live timeline — most agencies are live within 48 hours",
];

export default function BookConsultation() {
  useEffect(() => {
    const existing = document.querySelector('script[src*="calendly"]');
    if (existing) return;
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <AppLayout>
      <div className="min-h-screen py-16 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full"
              style={{ color: "#00d1b2", background: "rgba(0,209,178,0.08)", border: "1px solid rgba(0,209,178,0.2)" }}>
              <Phone className="w-3.5 h-3.5" /> Free Consultation
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Book Your Free<br />
              <span style={{ color: "#00d1b2" }}>Strategy Call</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              15 minutes. No charge. No commitment.<br />
              We'll walk you through exactly how Directive OS fits your agency.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-8 items-start">

            {/* Left — what we cover */}
            <div className="md:col-span-2 space-y-6">
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

              <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(0,209,178,0.1)" }}>
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">15 minutes</div>
                    <div className="text-xs text-muted-foreground">Quick and focused — no sales pressure</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(0,209,178,0.1)" }}>
                    <Shield className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">No charge, ever</div>
                    <div className="text-xs text-muted-foreground">This call is completely free of charge</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(0,209,178,0.1)" }}>
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">Phone or video</div>
                    <div className="text-xs text-muted-foreground">Your choice — wherever you're comfortable</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Calendly embed */}
            <div className="md:col-span-3">
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div
                  className="calendly-inline-widget"
                  data-url={`${CALENDLY_URL}?hide_gdpr_banner=1&background_color=1a1f2e&text_color=f0f0f0&primary_color=00d1b2`}
                  style={{ minWidth: "280px", height: "700px" }}
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </AppLayout>
  );
}
