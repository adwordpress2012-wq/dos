import { Award, Users, TrendingUp, Home, CheckCircle } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const base = import.meta.env.BASE_URL.replace(/\/$/, "");

const team = [
  {
    name: "James Whitfield",
    title: "Principal & Licensed Agent",
    photo: "https://api.dicebear.com/8.x/avataaars/svg?seed=James&backgroundColor=b6e3f4&size=200",
    bio: "A Hills District native with 18 years in the industry, James built Meridian from the ground up with a singular vision — a boutique agency that treats every client like family. He's personally sold over 1,200 properties across the Hills District and holds a consistent auction clearance rate above 94%.",
    specialties: ["Prestige Residential", "Auctions", "Off-Market Sales"],
  },
  {
    name: "Sophie Chen",
    title: "Senior Sales Agent",
    photo: "https://api.dicebear.com/8.x/avataaars/svg?seed=Sophie&backgroundColor=ffdfbf&size=200",
    bio: "Sophie brings a decade of experience and an extraordinary depth of market knowledge to every transaction. Her warm, empathetic approach has earned her a loyal client base who return again and again. She holds a particular passion for helping first-home buyers navigate the market with confidence.",
    specialties: ["Apartments & Townhouses", "First Home Buyers", "Investor Portfolios"],
  },
  {
    name: "Michael Torres",
    title: "Head of Property Management",
    photo: "https://api.dicebear.com/8.x/avataaars/svg?seed=Michael&backgroundColor=c0aede&size=200",
    bio: "Michael oversees a portfolio of 240+ investment properties, bringing meticulous organisation, proactive communication, and a genuine respect for both landlords and tenants to the role. His property management model has reduced vacancy rates across the Meridian portfolio to an industry-best 1.2%.",
    specialties: ["Residential Property Management", "Investor Advisory", "Tenancy Legislation"],
  },
  {
    name: "Annabelle Park",
    title: "Client Experience Manager",
    photo: "https://api.dicebear.com/8.x/avataaars/svg?seed=Annabelle&backgroundColor=ffd5dc&size=200",
    bio: "Annabelle is the heart of the Meridian office — ensuring every client enquiry is handled with warmth, speed, and professionalism. She coordinates our AI receptionist Sarah and oversees the customer journey from first contact through to settlement.",
    specialties: ["Client Relations", "Campaign Coordination", "Digital Marketing"],
  },
];

const milestones = [
  { year: "2006", event: "Meridian Property Group founded by James Whitfield in Castle Hill" },
  { year: "2010", event: "Expanded to rental management, reaching 50 managed properties" },
  { year: "2015", event: "$500M in total sales achieved across Hills District" },
  { year: "2018", event: "Named 'Hills District Agency of the Year' by REB Awards" },
  { year: "2022", event: "Launched Sarah — our 24/7 AI receptionist powered by Directive OS" },
  { year: "2024", event: "Surpassed $1.4B in total property sales" },
];

const values = [
  { icon: Award, title: "Excellence Without Compromise", text: "We don't settle for average results. Every campaign, every negotiation, every client interaction is an opportunity to exceed expectations." },
  { icon: Users, title: "People First", text: "Property transactions are among the biggest decisions of people's lives. We treat every client with the respect, empathy, and transparency they deserve." },
  { icon: TrendingUp, title: "Always Ahead", text: "We invest continuously in technology, training, and market intelligence to ensure our clients always have the competitive edge." },
  { icon: Home, title: "Community Roots", text: "We're not just selling homes — we're building community. Meridian gives back through local school sponsorships, charity auctions, and community events." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div
        className="relative pt-[6.5rem] min-h-[380px] flex items-end bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80')" }}
      >
        <div className="absolute inset-0 bg-[#0F1623]/70" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-2">Our Story</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white max-w-2xl leading-tight">
            Boutique by Design.<br />Exceptional by Reputation.
          </h1>
        </div>
      </div>

      {/* Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-3">Who We Are</p>
          <h2 className="font-serif text-3xl font-bold mb-5">
            Western Sydney's Most Trusted Independent Agency
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
            <p>
              Founded in 2006, Meridian Property Group has grown from a one-man office in Castle Hill into the Hills District's premier independent real estate agency — without losing the personal touch that defined us from day one.
            </p>
            <p>
              We deliberately keep our team small and our standards high. Unlike the corporate franchises, we're not chasing volume — we're chasing excellence. Every agent at Meridian is a specialist, not a generalist.
            </p>
            <p>
              In 2022, we became one of the first agencies in NSW to deploy an AI receptionist. Powered by Directive OS, our virtual receptionist Sarah handles enquiries, books inspections, and ensures no opportunity is ever missed — day or night.
            </p>
          </div>
          <a
            href={`${base}/contact`}
            className="inline-flex items-center gap-2 mt-6 bg-gold hover:bg-gold-dark text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Meet the Team
          </a>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-square rounded-xl overflow-hidden">
            <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80" alt="Team" className="w-full h-full object-cover" />
          </div>
          <div className="aspect-square rounded-xl overflow-hidden mt-6">
            <img src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=600&q=80" alt="Office" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#0F1623] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "$1.4B+", label: "Total Sales" },
            { value: "1,200+", label: "Homes Sold" },
            { value: "240+", label: "Managed Properties" },
            { value: "18 yrs", label: "Experience" },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-serif text-3xl font-bold text-gold mb-1">{s.value}</div>
              <div className="text-sm text-white/55 uppercase tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-2">What We Stand For</p>
          <h2 className="font-serif text-3xl font-bold">Our Values</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => (
            <div key={v.title} className="bg-white border border-border rounded-xl p-5 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center mb-4">
                <v.icon className="w-5 h-5 text-gold" />
              </div>
              <h3 className="font-serif text-sm font-bold mb-2">{v.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-muted/40 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-2">The People</p>
            <h2 className="font-serif text-3xl font-bold">Meet Our Team</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((m) => (
              <div key={m.name} className="bg-white rounded-xl overflow-hidden border border-border shadow-sm">
                <div className="aspect-square bg-muted">
                  <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-base font-bold">{m.name}</h3>
                  <p className="text-gold text-xs font-semibold tracking-wide mb-2">{m.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">{m.bio}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {m.specialties.map((s) => (
                      <span key={s} className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-2">Our Journey</p>
          <h2 className="font-serif text-3xl font-bold">18 Years of Excellence</h2>
        </div>
        <div className="space-y-0">
          {milestones.map((m, i) => (
            <div key={m.year} className="flex gap-6 items-start relative">
              {/* Timeline line */}
              {i < milestones.length - 1 && (
                <div className="absolute left-[34px] top-10 w-px h-full bg-border" />
              )}
              <div className="shrink-0 w-16 text-right">
                <span className="font-serif text-sm font-bold text-gold">{m.year}</span>
              </div>
              <div className="shrink-0 w-4 h-4 rounded-full bg-gold mt-0.5 relative z-10 shadow" />
              <p className="text-sm text-foreground/80 pb-8">{m.event}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI section */}
      <section className="bg-gradient-to-br from-[#0F1623] to-[#1a2435] py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-gold/20 border-2 border-gold/40 flex items-center justify-center mx-auto mb-5">
            <span className="font-serif text-3xl font-bold text-gold">S</span>
          </div>
          <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-2">Meet Our AI Receptionist</p>
          <h2 className="font-serif text-3xl font-bold text-white mb-4">Sarah is Always Here</h2>
          <p className="text-white/65 text-base leading-relaxed max-w-2xl mx-auto mb-6">
            Powered by Directive OS, Sarah handles enquiries, books inspections, and captures leads 24 hours a day. She's available on the phone at 02 5850 4038 and in the chat widget below — so you always have someone to speak to, any time of day or night.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {["24/7 Availability", "Instant Responses", "Inspection Booking", "Lead Capture", "No Wait Times", "Real Information"].map((f) => (
              <span key={f} className="flex items-center gap-1.5 text-xs text-white/70 bg-white/8 border border-white/12 px-3 py-1.5 rounded-full">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                {f}
              </span>
            ))}
          </div>
          <a
            href="https://directiveos.com.au"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-8 text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Powered by Directive OS AI Receptionist
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
