import { useState } from "react";
import { Link } from "wouter";
import {
  Star, Award, Users, TrendingUp, ChevronRight, ArrowRight,
  Phone, Mail, MapPin, CheckCircle
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PropertyCard from "@/components/property-card";
import { listings } from "@/data/listings";

const base = import.meta.env.BASE_URL.replace(/\/$/, "");

const featuredListings = listings.filter(
  (l) => l.status === "active" || l.status === "under_offer"
).slice(0, 3);

const stats = [
  { value: "$1.4B+", label: "Properties Sold" },
  { value: "2,300+", label: "Happy Clients" },
  { value: "97%", label: "Auction Clearance" },
  { value: "18 Days", label: "Avg Days on Market" },
];

const team = [
  {
    name: "James Whitfield",
    title: "Principal & Licensed Agent",
    photo: "https://api.dicebear.com/8.x/avataaars/svg?seed=James&backgroundColor=b6e3f4&size=200",
    bio: "18 years experience in the Hills District. Specialist in prestige residential sales.",
  },
  {
    name: "Sophie Chen",
    title: "Senior Sales Agent",
    photo: "https://api.dicebear.com/8.x/avataaars/svg?seed=Sophie&backgroundColor=ffdfbf&size=200",
    bio: "Renowned for her market insights and compassionate approach to every transaction.",
  },
  {
    name: "Michael Torres",
    title: "Property Manager",
    photo: "https://api.dicebear.com/8.x/avataaars/svg?seed=Michael&backgroundColor=c0aede&size=200",
    bio: "Managing over 240 investment properties with meticulous attention to detail.",
  },
];

const testimonials = [
  {
    name: "Rebecca & Tom H.",
    suburb: "Baulkham Hills",
    rating: 5,
    text: "James and the Ray White Castle Hill team achieved $85k above our expectations. Their communication throughout the campaign was second to none. Truly a world-class agency.",
  },
  {
    name: "David K.",
    suburb: "Castle Hill",
    rating: 5,
    text: "Sophie's knowledge of the local market is unparalleled. We sold in 9 days at auction — couldn't be happier. Highly recommend to anyone in the Hills.",
  },
  {
    name: "Priya & Sanjay M.",
    suburb: "Kellyville",
    rating: 5,
    text: "I called the office on a Saturday night and was immediately helped by Sarah, their AI receptionist. She booked us an inspection for Sunday morning. Incredible service.",
  },
];

export default function HomePage() {
  const [searchType, setSearchType] = useState<"buy" | "rent">("buy");
  const [suburb, setSuburb] = useState("");

  function handleSearch() {
    const params = new URLSearchParams({ type: searchType === "buy" ? "sale" : "rental" });
    if (suburb) params.set("suburb", suburb);
    window.location.href = `${base}/listings?${params.toString()}`;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1800&q=85')" }}
      >
        <div className="absolute inset-0 bg-[#0F1623]/60" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-[6.5rem]">
          <p className="text-gold text-sm font-semibold tracking-[0.25em] uppercase mb-4">
            Castle Hill's #1 Real Estate Agency
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-white font-bold leading-tight mb-6">
            Finding Your Perfect<br />
            <span className="text-gold">Place to Call Home</span>
          </h1>
          <p className="text-white/75 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Australia's most trusted name in real estate. Ray White Castle Hill has delivered exceptional results for Hills District families and investors for over 20 years.
          </p>

          {/* Search widget */}
          <div className="bg-white rounded-2xl shadow-2xl p-4 max-w-2xl mx-auto">
            {/* Tabs */}
            <div className="flex gap-1 bg-muted rounded-lg p-1 mb-4">
              {(["buy", "rent"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setSearchType(t)}
                  className={`flex-1 text-sm font-medium py-1.5 rounded-md transition-all capitalize ${
                    searchType === t
                      ? "bg-white text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t === "buy" ? "Buy" : "Rent"}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={suburb}
                onChange={(e) => setSuburb(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search by suburb or postcode…"
                className="flex-1 text-sm bg-muted rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-gold/40 placeholder:text-muted-foreground"
              />
              <button
                onClick={handleSearch}
                className="bg-gold hover:bg-gold-dark text-white font-medium text-sm px-6 py-3 rounded-lg transition-colors"
              >
                Search
              </button>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {["Baulkham Hills", "Castle Hill", "Kellyville", "Norwest", "Rouse Hill"].map((suburb) => (
              <a
                key={suburb}
                href={`${base}/listings?suburb=${suburb}`}
                className="text-xs text-white/70 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1.5 rounded-full transition-all"
              >
                {suburb}
              </a>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-10 bg-gradient-to-b from-white/0 to-white/40" />
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#0F1623] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-serif text-3xl font-bold text-gold mb-1">{s.value}</div>
              <div className="text-sm text-white/55 uppercase tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured listings */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-2">Featured Properties</p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
                Exceptional Homes,<br />Extraordinary Lives
              </h2>
            </div>
            <a
              href={`${base}/listings`}
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-gold hover:underline"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((l) => (
              <PropertyCard key={l.id} listing={l} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <a
              href={`${base}/listings`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gold"
            >
              View All Properties
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Sarah AI receptionist callout */}
      <section className="bg-gradient-to-br from-[#0F1623] to-[#1a2435] py-16 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-28 h-28 rounded-full bg-gold/20 border-4 border-gold/40 flex items-center justify-center">
              <span className="font-serif text-5xl font-bold text-gold">S</span>
            </div>
            <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-400 rounded-full border-3 border-[#0F1623]" />
          </div>

          <div className="flex-1 text-center md:text-left">
            <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-2">AI Receptionist · Available 24/7</p>
            <h2 className="font-serif text-3xl font-bold text-white mb-3">Meet Sarah</h2>
            <p className="text-white/65 text-base leading-relaxed max-w-lg">
              Sarah handles calls, answers enquiries, and books inspections around the clock — so you never miss an opportunity, and our team can focus on what they do best.
            </p>
            <div className="flex flex-wrap gap-3 mt-5 justify-center md:justify-start">
              {["Book Inspections", "Enquire on Listings", "Get Market Updates", "Request Appraisals"].map((f) => (
                <span key={f} className="flex items-center gap-1.5 text-xs text-white/70 bg-white/8 border border-white/12 px-3 py-1.5 rounded-full">
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 shrink-0">
            <a
              href="tel:0258504038"
              className="flex items-center gap-2.5 bg-gold hover:bg-gold-dark text-white font-medium text-sm px-6 py-3 rounded-lg transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call 02 5850 4038
            </a>
            <button
              onClick={() => {
                const btn = document.querySelector<HTMLButtonElement>('[aria-label="Chat with Sarah"]');
                btn?.click();
              }}
              className="flex items-center gap-2.5 bg-white/10 hover:bg-white/15 text-white font-medium text-sm px-6 py-3 rounded-lg border border-white/15 transition-colors"
            >
              Chat with Sarah
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Why Meridian */}
      <section className="py-20 px-4 bg-muted/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-2">Why Choose Us</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">The Ray White Difference</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: "Global Network, Local Experts",
                text: "Backed by Australia's largest real estate group, Ray White Castle Hill combines global reach with deep local knowledge to deliver outstanding results.",
              },
              {
                icon: TrendingUp,
                title: "Market-Leading Results",
                text: "Our properties sell 34% faster than the Hills District average, consistently exceeding vendor expectations through targeted campaigns and genuine buyer relationships.",
              },
              {
                icon: Users,
                title: "24/7 AI Concierge",
                text: "Powered by Directive OS, our AI receptionist Sarah is available around the clock to answer your questions, book inspections, and ensure you never miss an opportunity.",
              },
            ].map((card) => (
              <div key={card.title} className="bg-white rounded-xl p-6 border border-border shadow-sm">
                <div className="w-11 h-11 rounded-lg bg-gold/10 flex items-center justify-center mb-4">
                  <card.icon className="w-5 h-5 text-gold" />
                </div>
                <h3 className="font-serif text-lg font-bold mb-2">{card.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-2">Our People</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">Meet the Team</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {team.map((m) => (
              <div key={m.name} className="text-center group">
                <div className="w-28 h-28 rounded-full mx-auto mb-4 overflow-hidden border-2 border-border bg-muted">
                  <img src={m.photo} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <h3 className="font-serif text-lg font-bold">{m.name}</h3>
                <p className="text-gold text-xs font-semibold tracking-wide mb-2">{m.title}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{m.bio}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <a href={`${base}/about`} className="inline-flex items-center gap-2 text-sm font-medium text-gold hover:underline">
              Learn more about our team <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-[#0F1623]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-2">Client Stories</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">What Our Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-white/80 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-white/40 text-xs">{t.suburb}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-16 px-4 bg-gold">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Make Your Move?
          </h2>
          <p className="text-white/85 text-base leading-relaxed mb-8">
            Whether you're buying, selling, or investing — our team is ready to guide you through every step of the journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`${base}/contact`}
              className="bg-white text-[#0F1623] font-semibold text-sm px-8 py-3.5 rounded-lg hover:bg-white/90 transition-colors"
            >
              Request a Free Appraisal
            </a>
            <a
              href={`${base}/listings`}
              className="bg-white/15 text-white font-semibold text-sm px-8 py-3.5 rounded-lg border border-white/30 hover:bg-white/25 transition-colors"
            >
              Browse Properties
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
