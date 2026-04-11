import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  useGetListings, useCreateListing, useSyncVaultRE,
  getGetListingsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Building2, RefreshCw, Plus, Home, Key, X, Bed, Bath, Car,
  User, ImageIcon, Gavel, CalendarCheck, Phone
} from "lucide-react";

// ── Inspection time parser ──────────────────────────────────────────────────
// Expects: "Sat 3 May, 10:00-10:30am"
function parseInspectionTime(str: string): { day: string; date: string; month: string; time: string } | null {
  const m = str.match(/^([A-Za-z]+)\s+(\d+)\s+([A-Za-z]+),\s*(.+)$/);
  if (!m) return null;
  return { day: m[1].toUpperCase(), date: m[2], month: m[3].toUpperCase(), time: m[4] };
}

function InspectionBox({ label, day, date, month, time, dark }: {
  label?: string; day: string; date: string; month: string; time: string; dark?: boolean;
}) {
  return (
    <div className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl text-center min-w-[62px] ${
      dark
        ? "bg-foreground text-background"
        : "bg-muted border border-border text-foreground"
    }`}>
      {label && (
        <span className={`text-[9px] font-bold tracking-widest uppercase mb-0.5 ${dark ? "text-background/70" : "text-primary"}`}>
          {label}
        </span>
      )}
      <span className="text-[10px] font-semibold leading-none">{day}</span>
      <span className={`text-xl font-bold leading-tight ${dark ? "text-background" : "text-foreground"}`}>{date}</span>
      <span className="text-[10px] font-medium leading-none mb-1">{month}</span>
      <span className={`text-[9px] leading-none ${dark ? "text-background/70" : "text-muted-foreground"}`}>{time}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    active:      { cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", label: "Active" },
    under_offer: { cls: "bg-amber-500/10 text-amber-400 border-amber-500/20", label: "Under Offer" },
    sold:        { cls: "bg-muted text-muted-foreground border-border", label: "Sold" },
    leased:      { cls: "bg-muted text-muted-foreground border-border", label: "Leased" },
  };
  const s = map[status] || map.active;
  return <span className={`text-xs px-2 py-0.5 rounded border font-medium ${s.cls}`}>{s.label}</span>;
}

function AddListingModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const createListing = useCreateListing({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetListingsQueryKey() });
        onClose();
      },
    },
  });

  const [form, setForm] = useState({
    address: "", suburb: "", state: "NSW", postcode: "",
    price: "", listingType: "sale" as "sale" | "rental",
    listingMethod: "private_treaty",
    bedrooms: "", bathrooms: "", carSpaces: "",
    agentName: "", agentMobile: "",
    inspectionTimes: "",
    auctionDate: "", auctionTime: "",
    photoUrl: "", description: "",
  });

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = () => {
    createListing.mutate({
      data: {
        address: form.address,
        suburb: form.suburb,
        state: form.state,
        postcode: form.postcode,
        price: form.price || undefined,
        listingType: form.listingType,
        bedrooms: form.bedrooms ? parseInt(form.bedrooms) : undefined,
        bathrooms: form.bathrooms ? parseInt(form.bathrooms) : undefined,
        agentName: form.agentName,
        agentMobile: form.agentMobile,
        inspectionTimes: form.inspectionTimes ? form.inspectionTimes.split("\n").filter(Boolean) : [],
        photoUrl: form.photoUrl || undefined,
        description: form.description || undefined,
      }
    });
  };

  const inputCls = "w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground";
  const isAuction = form.listingMethod === "auction";

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl w-full max-w-xl shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h3 className="font-semibold text-foreground">Add Listing Manually</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Format inspection times: "Sat 3 May, 10:00-10:30am"</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[72vh] overflow-y-auto">
          {form.photoUrl && (
            <div className="rounded-xl overflow-hidden h-32 bg-muted">
              <img src={form.photoUrl} alt="Preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>
          )}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Photo URL</label>
            <div className="flex gap-2 items-center">
              <ImageIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <input value={form.photoUrl} onChange={f("photoUrl")} placeholder="https://..." className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Street Address *</label>
              <input value={form.address} onChange={f("address")} placeholder="14 Example Street" className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Suburb *</label>
              <input value={form.suburb} onChange={f("suburb")} placeholder="Penrith" className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Postcode *</label>
              <input value={form.postcode} onChange={f("postcode")} placeholder="2750" className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Listing Type *</label>
              <select value={form.listingType} onChange={f("listingType")} className={inputCls}>
                <option value="sale">For Sale</option>
                <option value="rental">For Rent</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Method</label>
              <select value={form.listingMethod} onChange={f("listingMethod")} className={inputCls}>
                <option value="private_treaty">Private Treaty</option>
                <option value="auction">Auction</option>
                <option value="expression_of_interest">EOI</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Price</label>
              <input value={form.price} onChange={f("price")} placeholder="$850,000 or $550/week or Auction" className={inputCls} />
            </div>
            {isAuction && (
              <>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Auction Date</label>
                  <input value={form.auctionDate} onChange={f("auctionDate")} placeholder="Sat 17 May" className={inputCls} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Auction Time</label>
                  <input value={form.auctionTime} onChange={f("auctionTime")} placeholder="11:00am" className={inputCls} />
                </div>
              </>
            )}
            <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Beds</label><input type="number" min="0" value={form.bedrooms} onChange={f("bedrooms")} className={inputCls} /></div>
            <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Baths</label><input type="number" min="0" value={form.bathrooms} onChange={f("bathrooms")} className={inputCls} /></div>
            <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Car Spaces</label><input type="number" min="0" value={form.carSpaces} onChange={f("carSpaces")} className={inputCls} /></div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Agent Name *</label>
              <input value={form.agentName} onChange={f("agentName")} placeholder="Mark Thompson" className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Agent Mobile *</label>
              <input value={form.agentMobile} onChange={f("agentMobile")} placeholder="0412 301 112" className={inputCls} />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Inspection Times <span className="text-muted-foreground/50">(one per line — "Sat 3 May, 10:00-10:30am")</span>
              </label>
              <textarea rows={3} value={form.inspectionTimes} onChange={f("inspectionTimes")}
                placeholder={"Sat 3 May, 10:00-10:30am\nSun 4 May, 1:00-1:30pm"}
                className={`${inputCls} resize-none`} />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Description</label>
              <textarea rows={3} value={form.description} onChange={f("description")}
                placeholder="Property highlights..." className={`${inputCls} resize-none`} />
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-border">
          <button onClick={onClose} className="flex-1 bg-muted border border-border text-muted-foreground hover:text-foreground py-2 rounded-lg text-sm font-medium transition-colors">Cancel</button>
          <button
            onClick={submit}
            disabled={createListing.isPending || !form.address || !form.suburb || !form.agentName || !form.agentMobile}
            className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {createListing.isPending ? "Adding..." : "Add Listing"}
          </button>
        </div>
      </div>
    </div>
  );
}

type Listing = {
  id: number;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  price?: string | null;
  listingType: "sale" | "rental";
  listingMethod?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  carSpaces?: number | null;
  agentName: string;
  agentMobile: string;
  inspectionTimes: string[];
  auctionDate?: string | null;
  auctionTime?: string | null;
  status: string;
  photoUrl?: string | null;
  description?: string | null;
};

function ListingCard({ l }: { l: Listing }) {
  const [bookMsg, setBookMsg] = useState("");
  const isAuction = l.listingMethod === "auction";

  const parsedTimes = l.inspectionTimes
    .map(parseInspectionTime)
    .filter((t): t is NonNullable<ReturnType<typeof parseInspectionTime>> => t !== null)
    .slice(0, 3);

  const auctionParts = l.auctionDate
    ? l.auctionDate.match(/^([A-Za-z]+)\s+(\d+)\s+([A-Za-z]+)$/)
    : null;

  const handleBook = () => {
    setBookMsg("Inspection request sent!");
    setTimeout(() => setBookMsg(""), 3000);
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-all hover:shadow-lg group flex flex-col">
      {/* Photo */}
      <div className="relative h-44 bg-muted overflow-hidden flex-shrink-0">
        {l.photoUrl ? (
          <img src={l.photoUrl} alt={l.address} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Building2 className="w-8 h-8 text-muted-foreground/40" />
          </div>
        )}
        {/* Top overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 ${l.listingType === "rental" ? "bg-blue-600/90 text-white" : "bg-emerald-600/90 text-white"}`}>
              {l.listingType === "rental" ? <Key className="w-3 h-3" /> : <Home className="w-3 h-3" />}
              For {l.listingType === "rental" ? "Rent" : "Sale"}
            </span>
            {isAuction && (
              <span className="text-xs px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 bg-foreground text-background">
                <Gavel className="w-3 h-3" /> AUCTION
              </span>
            )}
          </div>
          <StatusBadge status={l.status} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="font-semibold text-foreground mb-0.5 truncate">{l.address}</div>
        <div className="text-sm text-muted-foreground mb-2">{l.suburb} {l.state} {l.postcode}</div>

        {l.price && (
          <div className={`text-xl font-bold mb-3 ${isAuction ? "text-foreground" : "text-primary"}`}>
            {l.price}
          </div>
        )}

        {/* Beds / Baths / Cars */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
          {l.bedrooms != null && <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" />{l.bedrooms} Beds</span>}
          {l.bathrooms != null && <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" />{l.bathrooms} Baths</span>}
          {l.carSpaces != null && <span className="flex items-center gap-1"><Car className="w-3.5 h-3.5" />{l.carSpaces} Cars</span>}
        </div>

        {l.description && (
          <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">{l.description}</p>
        )}

        {/* Inspection + Auction time boxes */}
        {(parsedTimes.length > 0 || auctionParts) && (
          <div className="mb-4">
            <div className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
              <CalendarCheck className="w-3.5 h-3.5" />
              Inspections &amp; {isAuction ? "Auction" : "Schedule"}
            </div>
            <div className="flex flex-wrap gap-2">
              {parsedTimes.map((t, i) => (
                <InspectionBox key={i} day={t.day} date={t.date} month={t.month} time={t.time} />
              ))}
              {auctionParts && (
                <InspectionBox
                  label="AUCTION"
                  day={auctionParts[1].toUpperCase()}
                  date={auctionParts[2]}
                  month={auctionParts[3].toUpperCase()}
                  time={l.auctionTime ?? ""}
                  dark
                />
              )}
            </div>
          </div>
        )}

        {/* Agent + CTA */}
        <div className="mt-auto border-t border-border pt-3 space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <User className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            <span className="text-foreground font-medium">{l.agentName}</span>
            <a href={`tel:${l.agentMobile}`} className="text-primary ml-auto flex items-center gap-1 hover:underline">
              <Phone className="w-3 h-3" />{l.agentMobile}
            </a>
          </div>

          <div className="flex gap-2">
            {isAuction ? (
              <>
                <button
                  onClick={handleBook}
                  className="flex-1 text-xs bg-muted border border-border hover:border-primary/40 text-muted-foreground hover:text-foreground py-2 rounded-lg font-medium transition-colors"
                >
                  Book Inspection
                </button>
                <button
                  onClick={handleBook}
                  className="flex-1 text-xs bg-foreground text-background hover:bg-foreground/90 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1"
                >
                  <Gavel className="w-3 h-3" /> Register to Bid
                </button>
              </>
            ) : (
              <button
                onClick={handleBook}
                className="w-full text-xs bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                {bookMsg || "Book Inspection"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Listings() {
  const [showAdd, setShowAdd] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");
  const [filter, setFilter] = useState<"all" | "sale" | "rental" | "auction">("all");
  const queryClient = useQueryClient();
  const { data: listings, isLoading } = useGetListings();
  const syncVaultRE = useSyncVaultRE({
    mutation: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: getGetListingsQueryKey() });
        setSyncMsg(data.message);
        setTimeout(() => setSyncMsg(""), 5000);
      },
    },
  });

  const filtered = (listings ?? []).filter(l => {
    if (filter === "sale") return l.listingType === "sale" && l.listingMethod !== "auction";
    if (filter === "rental") return l.listingType === "rental";
    if (filter === "auction") return l.listingMethod === "auction";
    return true;
  });

  const auctionCount = listings?.filter(l => l.listingMethod === "auction").length ?? 0;

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Property Intelligence</h1>
          <p className="text-muted-foreground text-sm mt-1">Live listing data powering your AI receptionist</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="flex bg-muted border border-border rounded-lg overflow-hidden text-sm">
            {([
              { key: "all", label: "All" },
              { key: "sale", label: "For Sale" },
              { key: "rental", label: "For Rent" },
              { key: "auction", label: `Auction${auctionCount > 0 ? ` (${auctionCount})` : ""}` },
            ] as const).map(v => (
              <button key={v.key} onClick={() => setFilter(v.key)}
                className={`px-3 py-1.5 font-medium transition-colors ${filter === v.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {v.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => syncVaultRE.mutate({})}
            disabled={syncVaultRE.isPending}
            className="flex items-center gap-2 bg-card border border-border hover:border-primary/40 text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${syncVaultRE.isPending ? "animate-spin" : ""}`} />
            Sync VaultRE
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Manually
          </button>
        </div>
      </div>

      {syncMsg && (
        <div className="mb-5 bg-primary/10 border border-primary/20 text-primary text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <RefreshCw className="w-4 h-4 flex-shrink-0" />
          {syncMsg}
        </div>
      )}

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => <div key={i} className="h-96 bg-card border border-border rounded-xl animate-pulse" />)}
        </div>
      ) : !listings?.length ? (
        <div className="bg-card border border-border rounded-xl py-20 text-center">
          <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <div className="text-foreground font-medium mb-2">No listings yet</div>
          <div className="text-muted-foreground text-sm mb-6">Sync from VaultRE or add manually.</div>
          <div className="flex gap-3 justify-center">
            <button onClick={() => syncVaultRE.mutate({})} className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium transition-colors">
              Sync VaultRE
            </button>
            <button onClick={() => setShowAdd(true)} className="bg-card border border-border hover:border-primary/40 text-foreground px-6 py-2 rounded-lg text-sm font-medium transition-colors">
              Add Manually
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="text-xs text-muted-foreground mb-4">
            Showing {filtered.length} of {listings.length} listings
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(l => <ListingCard key={l.id} l={l} />)}
          </div>
        </>
      )}

      {showAdd && <AddListingModal onClose={() => setShowAdd(false)} />}
    </DashboardLayout>
  );
}
