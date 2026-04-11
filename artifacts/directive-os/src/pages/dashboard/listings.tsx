import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  useGetListings, useCreateListing, useSyncVaultRE,
  getGetListingsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Building2, RefreshCw, Plus, Home, Key, X, Bed, Bath, Car, Calendar, User, ImageIcon } from "lucide-react";

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
    bedrooms: "", bathrooms: "", carSpaces: "",
    agentName: "", agentMobile: "",
    inspectionTimes: "",
    photoUrl: "",
    description: "",
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

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl w-full max-w-xl shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h3 className="font-semibold text-foreground">Add Listing Manually</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Use when CRM sync is unavailable</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[72vh] overflow-y-auto">
          {/* Photo Preview */}
          {form.photoUrl && (
            <div className="rounded-xl overflow-hidden h-36 bg-muted">
              <img src={form.photoUrl} alt="Preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Photo URL <span className="text-muted-foreground/50">(optional)</span></label>
            <div className="flex gap-2">
              <ImageIcon className="w-4 h-4 text-muted-foreground mt-2.5 flex-shrink-0" />
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
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Price</label>
              <input value={form.price} onChange={f("price")} placeholder="$850,000 or $550/week" className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Type *</label>
              <select value={form.listingType} onChange={f("listingType")} className={inputCls}>
                <option value="sale">For Sale</option>
                <option value="rental">For Rent</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Bedrooms</label>
              <input type="number" min="0" value={form.bedrooms} onChange={f("bedrooms")} className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Bathrooms</label>
              <input type="number" min="0" value={form.bathrooms} onChange={f("bathrooms")} className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Agent Name *</label>
              <input value={form.agentName} onChange={f("agentName")} placeholder="Mark Thompson" className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Agent Mobile *</label>
              <input value={form.agentMobile} onChange={f("agentMobile")} placeholder="0412 301 112" className={inputCls} />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Inspection Times <span className="text-muted-foreground/50">(one per line)</span></label>
              <textarea rows={2} value={form.inspectionTimes} onChange={f("inspectionTimes")}
                placeholder={"Saturday 11:00-11:30am\nSunday 1:00-1:30pm"}
                className={`${inputCls} resize-none`} />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Property Description <span className="text-muted-foreground/50">(optional)</span></label>
              <textarea rows={3} value={form.description} onChange={f("description")}
                placeholder="Describe the property features, location, and highlights..."
                className={`${inputCls} resize-none`} />
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-border">
          <button onClick={onClose} className="flex-1 bg-muted border border-border text-muted-foreground hover:text-foreground py-2 rounded-lg text-sm font-medium transition-colors">
            Cancel
          </button>
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

export default function Listings() {
  const [showAdd, setShowAdd] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");
  const [filter, setFilter] = useState<"all" | "sale" | "rental">("all");
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

  const filtered = listings?.filter(l => filter === "all" || l.listingType === filter) ?? [];

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Property Intelligence</h1>
          <p className="text-muted-foreground text-sm mt-1">Live listing data powering your AI receptionist</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="flex bg-muted border border-border rounded-lg overflow-hidden text-sm">
            {(["all", "sale", "rental"] as const).map(v => (
              <button key={v} onClick={() => setFilter(v)}
                className={`px-3 py-1.5 font-medium transition-colors capitalize ${filter === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {v === "all" ? "All" : v === "sale" ? "For Sale" : "For Rent"}
              </button>
            ))}
          </div>
          <button
            onClick={() => syncVaultRE.mutate({})}
            disabled={syncVaultRE.isPending}
            className="flex items-center gap-2 bg-card border border-border hover:border-primary/40 text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${syncVaultRE.isPending ? "animate-spin" : ""}`} />
            {syncVaultRE.isPending ? "Syncing..." : "Sync VaultRE"}
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
          {[...Array(6)].map((_, i) => <div key={i} className="h-72 bg-card border border-border rounded-xl animate-pulse" />)}
        </div>
      ) : !listings?.length ? (
        <div className="bg-card border border-border rounded-xl py-20 text-center">
          <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <div className="text-foreground font-medium mb-2">No listings yet</div>
          <div className="text-muted-foreground text-sm mb-6">Sync from VaultRE to import your listings, or add them manually.</div>
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
            {filtered.map(l => (
              <div key={l.id} className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-all hover:shadow-lg group">
                {/* Photo */}
                <div className="relative h-44 bg-muted overflow-hidden">
                  {l.photoUrl ? (
                    <img
                      src={l.photoUrl}
                      alt={l.address}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={e => {
                        (e.target as HTMLImageElement).style.display = "none";
                        (e.target as HTMLImageElement).parentElement!.classList.add("flex", "items-center", "justify-center");
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-muted-foreground/40" />
                    </div>
                  )}
                  {/* Overlay badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 ${l.listingType === "rental" ? "bg-blue-600/90 text-white" : "bg-emerald-600/90 text-white"}`}>
                      {l.listingType === "rental" ? <Key className="w-3 h-3" /> : <Home className="w-3 h-3" />}
                      For {l.listingType === "rental" ? "Rent" : "Sale"}
                    </span>
                    <StatusBadge status={l.status} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="font-semibold text-foreground mb-0.5 truncate">{l.address}</div>
                  <div className="text-sm text-muted-foreground mb-3">{l.suburb} {l.state} {l.postcode}</div>

                  {l.price && <div className="text-xl font-bold text-primary mb-3">{l.price}</div>}

                  {/* Features row */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    {l.bedrooms != null && (
                      <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" />{l.bedrooms} bed</span>
                    )}
                    {l.bathrooms != null && (
                      <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" />{l.bathrooms} bath</span>
                    )}
                  </div>

                  {l.description && (
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">{l.description}</p>
                  )}

                  <div className="border-t border-border pt-3 space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <User className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      <span className="text-foreground font-medium">{l.agentName}</span>
                      <span className="text-primary ml-auto">{l.agentMobile}</span>
                    </div>
                    {l.inspectionTimes?.length > 0 && (
                      <div className="flex items-start gap-2 text-xs">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div>
                          {l.inspectionTimes.slice(0, 2).map((t, i) => (
                            <div key={i} className="text-muted-foreground">{t}</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {showAdd && <AddListingModal onClose={() => setShowAdd(false)} />}
    </DashboardLayout>
  );
}
