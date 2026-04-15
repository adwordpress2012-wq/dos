import { useState } from "react";
import { Link } from "wouter";
import { AppLayout } from "@/components/layout/MarketingLayout";
import { ArrowRight, ExternalLink, Phone, MessageSquare } from "lucide-react";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";

const DEMOS = [
  {
    id: "demo",
    name: "Standard Demo — Any Agency",
    tagline: "AI Receptionist · DOS Branding",
    industry: "Real Estate",
    location: "Australia-wide",
    desc: "The standard Directive OS demo — built in DOS branding. Shows the full How It Works flow: call → Sarah answers → email notification → app notification. Use this as the starting point for any new prospect. We customise it with their branding on sign-up.",
    href: `${BASE}/demo`,
    external: false,
    badge: "Template",
    badgeColor: "#00d1b2",
    accent: "#00d1b2",
    accentGlow: "rgba(0,209,178,0.2)",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    features: ["How It Works Flow", "Live Chat Sarah", "Lead Email Mockup", "App Notification Mockup"],
  },
  {
    id: "ray-white-ug",
    name: "Ray White United Group",
    tagline: "AI Receptionist Landing Page",
    industry: "Real Estate",
    location: "St Marys · Greater Penrith, NSW",
    desc: "Ray White-branded AI receptionist for United Group St Marys. Sarah answers every call 24/7, qualifies buyers under $750k, books inspections and captures vendor appraisal requests.",
    href: `${BASE}/ray-white-ug`,
    external: false,
    badge: "New Client",
    badgeColor: "#FFE100",
    accent: "#FFE100",
    accentGlow: "rgba(255,225,0,0.25)",
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    features: ["Voice AI · Sarah", "24/7 Chat", "Inspection Booking", "Lead Capture"],
  },
  {
    id: "elite-sydney",
    name: "Elite Sydney Property",
    tagline: "AI Receptionist Landing Page",
    industry: "Real Estate",
    location: "Liverpool · Hinchinbrook, NSW",
    desc: "Full branded landing page for a SW Sydney agency. Sarah answers every call 24/7, qualifies buyers, books inspections, syncs with VaultRE and all major CRMs.",
    href: `${BASE}/elite-sydney`,
    external: false,
    badge: "Live Demo",
    badgeColor: "#fbb701",
    accent: "#004391",
    accentGlow: "rgba(0,67,145,0.25)",
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    features: ["Voice AI · Sarah", "24/7 Chat", "VaultRE Sync", "QR Code Print"],
  },
  {
    id: "c21-rana",
    name: "Century 21 The Rana Group",
    tagline: "AI Receptionist Landing Page",
    industry: "Real Estate",
    location: "Seven Hills · Blacktown, NSW",
    desc: "Century 21-branded AI receptionist page. Sarah handles all buyer and tenant enquiries around the clock, books inspections and captures vendor leads.",
    href: "/c21-rana",
    external: true,
    badge: "Live Client",
    badgeColor: "#F2B838",
    accent: "#F2B838",
    accentGlow: "rgba(242,184,56,0.2)",
    img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80",
    features: ["Voice AI · Sarah", "24/7 Chat", "Inspection Booking", "Lead Capture"],
  },
  {
    id: "nidus-re",
    name: "Nidus Real Estate",
    tagline: "AI Receptionist Landing Page",
    industry: "Real Estate",
    location: "Mt Druitt · Western Sydney, NSW",
    desc: "Bold hot-pink branded landing page for a Western Sydney agency. Sarah qualifies every lead 24/7, books appraisals, and never lets a call go to voicemail.",
    href: "/nidus-re",
    external: true,
    badge: "Live Client",
    badgeColor: "#e70d73",
    accent: "#e70d73",
    accentGlow: "rgba(231,13,115,0.2)",
    img: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80",
    features: ["Voice AI · Sarah", "24/7 Chat", "Vendor Spotting", "Hot Lead Alerts"],
  },
  {
    id: "boulevard-group",
    name: "The Boulevard Group",
    tagline: "AI Receptionist Landing Page",
    industry: "Real Estate",
    location: "Sydney Metro, NSW",
    desc: "Premium navy and gold branding for a boutique Sydney agency. Full Sarah AI receptionist, featured listing showcase, QR code for signboard print, and listing promotion services.",
    href: `${BASE}/boulevard-group`,
    external: false,
    badge: "Live Demo",
    badgeColor: "#f0b849",
    accent: "#1a2442",
    accentGlow: "rgba(26,36,66,0.4)",
    img: "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?w=800&q=80",
    features: ["Voice AI · Sarah", "24/7 Chat", "Listing Showcase", "QR Code Print"],
  },
  {
    id: "realestate-demo",
    name: "Meridian Property Group",
    tagline: "Full Website Demo",
    industry: "Real Estate",
    location: "Western Sydney (Demo)",
    desc: "A full multi-page real estate website demo — homepage, property listings, listing detail pages, and an AI-powered sales dashboard. Shows the complete Directive OS website product.",
    href: "/realestate-demo",
    external: true,
    badge: "Full Site Demo",
    badgeColor: "#00d1b2",
    accent: "#00d1b2",
    accentGlow: "rgba(0,209,178,0.2)",
    img: "https://images.unsplash.com/photo-1448630360428-65456885c650?w=800&q=80",
    features: ["Full Website", "Property Listings", "AI Dashboard", "Sarah Chat"],
  },
];

const INDUSTRIES = ["All", "Real Estate"];

export default function DemosPage() {
  const [filter, setFilter] = useState("All");

  const visible = filter === "All" ? DEMOS : DEMOS.filter(d => d.industry === filter);

  return (
    <AppLayout>
      {/* Hero */}
      <section className="py-20 text-center border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(0,209,178,0.06) 0%, transparent 70%)" }} />
        <div className="container mx-auto px-4 relative">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold mb-6 tracking-widest uppercase"
            style={{ background: "rgba(0,209,178,0.08)", border: "1px solid rgba(0,209,178,0.2)", color: "#00d1b2" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            All Live Demos
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            See Directive OS in Action
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Every demo below is a real, working Directive OS deployment — live AI chat, voice AI (Sarah), and full agency branding. Click any card to experience it yourself.
          </p>

          {/* Industry filter */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {INDUSTRIES.map(ind => (
              <button key={ind} onClick={() => setFilter(ind)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  background: filter === ind ? "#00d1b2" : "rgba(255,255,255,0.05)",
                  color: filter === ind ? "#0a0e1a" : "rgba(255,255,255,0.6)",
                  border: filter === ind ? "1px solid #00d1b2" : "1px solid rgba(255,255,255,0.1)",
                }}>
                {ind}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Demo grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {visible.map(demo => (
              <DemoCard key={demo.id} demo={demo} />
            ))}
          </div>

          {/* Coming soon slots */}
          <div className="mt-8 grid md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {[
              { industry: "Medical & Allied Health", name: "Northside Medical Centre", desc: "GP clinic · Appointment booking · After-hours triage · Medicare queries", img: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&q=80" },
              { industry: "Legal", name: "Whitmore & Associates", desc: "Law firm · Client intake · Matter enquiries · After-hours message capture", img: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80" },
              { industry: "Hospitality", name: "The Grand Pavilion Hotel", desc: "Hotel · Reservations · Concierge · Event enquiries · Room upgrades", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80" },
            ].map(d => (
              <div key={d.name} className="group relative rounded-2xl overflow-hidden border"
                style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}>
                  Coming Soon
                </div>
                <div className="aspect-video relative overflow-hidden">
                  <img src={d.img} alt={d.industry} className="w-full h-full object-cover opacity-15" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="text-xs font-semibold uppercase tracking-widest mb-1 text-white/30">{d.industry}</div>
                  <h3 className="font-bold text-white/40 text-lg mb-1">{d.name}</h3>
                  <p className="text-white/25 text-xs leading-relaxed">{d.desc}</p>
                  <div className="mt-3 text-xs text-white/25">Launching Soon</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border text-center" style={{ background: "rgba(0,209,178,0.02)" }}>
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl font-bold text-foreground mb-4">Want Your Agency on This Page?</h2>
          <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
            We build your branded AI receptionist page in 48 hours. Sarah goes live, your phone number gets answered, and you never miss a lead again.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://calendly.com/adwordpress2012/directive-os-agency-onboarding"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
              style={{ background: "#00d1b2", color: "#0a0e1a" }}>
              Book a Free Discovery Call <ArrowRight className="w-4 h-4" />
            </a>
            <Link href="/pay"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)" }}>
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}

function DemoCard({ demo }: { demo: typeof DEMOS[number] }) {
  const Tag = demo.external ? "a" : Link;
  const linkProps = demo.external
    ? { href: demo.href, target: "_blank", rel: "noopener noreferrer" }
    : { href: demo.href };

  return (
    <Tag {...(linkProps as any)}
      className="group relative rounded-2xl overflow-hidden border transition-all duration-300 hover:scale-[1.02] block"
      style={{ borderColor: `${demo.accent}44`, background: "rgba(255,255,255,0.02)" }}
      onMouseEnter={(e: React.MouseEvent<HTMLElement>) => { (e.currentTarget as HTMLElement).style.boxShadow = `0 0 48px ${demo.accentGlow}`; }}
      onMouseLeave={(e: React.MouseEvent<HTMLElement>) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
    >
      {/* Badge */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
        style={{ background: `${demo.badgeColor}20`, border: `1px solid ${demo.badgeColor}44`, color: demo.badgeColor }}>
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: demo.badgeColor }} />
        {demo.badge}
      </div>

      {/* Image */}
      <div className="aspect-video relative overflow-hidden">
        <img src={demo.img} alt={demo.name}
          className="w-full h-full object-cover opacity-55 group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: demo.badgeColor }}>
          {demo.industry} · {demo.location}
        </div>
        <h3 className="font-bold text-white text-lg leading-tight mb-1">{demo.name}</h3>
        <p className="text-white/55 text-xs leading-relaxed mb-3">{demo.desc}</p>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {demo.features.map(f => (
            <span key={f} className="px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>
              {f}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold group-hover:gap-2.5 transition-all" style={{ color: demo.badgeColor }}>
          {demo.external ? <ExternalLink className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
          View Live Demo
        </div>
      </div>
    </Tag>
  );
}
