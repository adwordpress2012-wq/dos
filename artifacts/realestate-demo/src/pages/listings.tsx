import { useState } from "react";
import { SlidersHorizontal, Search } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PropertyCard from "@/components/property-card";
import { listings, type Listing } from "@/data/listings";

const suburbOptions = ["All Suburbs", "Baulkham Hills", "Castle Hill", "Kellyville", "Norwest", "Rouse Hill", "Stanhope Gardens"];
const bedroomOptions = ["Any", "1+", "2+", "3+", "4+", "5+"];

export default function ListingsPage() {
  const params = new URLSearchParams(window.location.search);
  const initialType = params.get("type") as "sale" | "rental" | null;
  const initialSuburb = params.get("suburb") ?? "All Suburbs";

  const [tab, setTab] = useState<"all" | "sale" | "rental">(
    initialType === "sale" ? "sale" : initialType === "rental" ? "rental" : "all"
  );
  const [search, setSearch] = useState(
    initialSuburb !== "All Suburbs" ? initialSuburb : ""
  );
  const [selectedSuburb, setSelectedSuburb] = useState(initialSuburb);
  const [minBeds, setMinBeds] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = listings.filter((l) => {
    if (tab === "sale" && l.type !== "sale") return false;
    if (tab === "rental" && l.type !== "rental") return false;
    if (selectedSuburb !== "All Suburbs" && l.suburb !== selectedSuburb) return false;
    if (search && !l.suburb.toLowerCase().includes(search.toLowerCase()) && !l.address.toLowerCase().includes(search.toLowerCase())) return false;
    if (minBeds > 0 && l.bedrooms < minBeds) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <div className="bg-[#0F1623] pt-24 pb-10 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-2">Properties</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
            {tab === "sale" ? "Properties for Sale" : tab === "rental" ? "Rental Properties" : "All Properties"}
          </h1>

          {/* Search bar */}
          <div className="flex gap-2 max-w-xl">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by suburb or address…"
                className="w-full bg-white/10 border border-white/15 text-white placeholder:text-white/40 text-sm pl-9 pr-4 py-2.5 rounded-lg outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-lg border transition-colors ${
                showFilters
                  ? "bg-gold border-gold text-white"
                  : "bg-white/10 border-white/15 text-white/80 hover:bg-white/15"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 bg-white/8 border border-white/12 rounded-xl p-4 max-w-2xl flex flex-wrap gap-4">
              <div>
                <label className="text-xs text-white/50 block mb-1.5">Suburb</label>
                <select
                  value={selectedSuburb}
                  onChange={(e) => setSelectedSuburb(e.target.value)}
                  className="bg-white/10 border border-white/15 text-white text-sm px-3 py-2 rounded-lg outline-none focus:border-gold/50"
                >
                  {suburbOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-white/50 block mb-1.5">Min. Bedrooms</label>
                <select
                  value={minBeds}
                  onChange={(e) => setMinBeds(Number(e.target.value.replace("+", "")))}
                  className="bg-white/10 border border-white/15 text-white text-sm px-3 py-2 rounded-lg outline-none focus:border-gold/50"
                >
                  {bedroomOptions.map((b, i) => <option key={b} value={i}>{b}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-border sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-0">
          {([["all", "All"], ["sale", "Buy"], ["rental", "Rent"]] as const).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setTab(val)}
              className={`text-sm font-medium px-5 py-3 border-b-2 transition-colors ${
                tab === val
                  ? "border-gold text-gold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
          <div className="ml-auto flex items-center text-xs text-muted-foreground px-4">
            {filtered.length} {filtered.length === 1 ? "property" : "properties"}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif text-2xl font-bold mb-2">No properties found</p>
            <p className="text-muted-foreground text-sm">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((l) => (
              <PropertyCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
