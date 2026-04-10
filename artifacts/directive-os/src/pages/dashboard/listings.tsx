import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  useGetListings, useCreateListing, useSyncVaultRE,
  getGetListingsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Building2, RefreshCw, Plus, Home, Key, X } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    under_offer: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    sold: "bg-muted text-muted-foreground border-border",
    leased: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded border font-medium ${map[status] || map.active}`}>
      {status.replace("_", " ")}
    </span>
  );
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
    bedrooms: "", bathrooms: "",
    agentName: "", agentMobile: "",
    inspectionTimes: "",
  });

  const submit = () => {
    createListing.mutate({
      data: {
        ...form,
        bedrooms: form.bedrooms ? parseInt(form.bedrooms) : undefined,
        bathrooms: form.bathrooms ? parseInt(form.bathrooms) : undefined,
        inspectionTimes: form.inspectionTimes ? form.inspectionTimes.split("\n").filter(Boolean) : [],
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Add Listing</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs text-muted-foreground mb-1 block">Street Address</label>
              <input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Suburb</label>
              <input value={form.suburb} onChange={e => setForm(p => ({ ...p, suburb: e.target.value }))}
                className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Postcode</label>
              <input value={form.postcode} onChange={e => setForm(p => ({ ...p, postcode: e.target.value }))}
                className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Price</label>
              <input value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                placeholder="$850/week or $1,200,000"
                className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Type</label>
              <select value={form.listingType} onChange={e => setForm(p => ({ ...p, listingType: e.target.value as "sale" | "rental" }))}
                className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="sale">For Sale</option>
                <option value="rental">For Rent</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Beds</label>
              <input type="number" value={form.bedrooms} onChange={e => setForm(p => ({ ...p, bedrooms: e.target.value }))}
                className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Baths</label>
              <input type="number" value={form.bathrooms} onChange={e => setForm(p => ({ ...p, bathrooms: e.target.value }))}
                className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Agent Name</label>
              <input value={form.agentName} onChange={e => setForm(p => ({ ...p, agentName: e.target.value }))}
                className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Agent Mobile</label>
              <input value={form.agentMobile} onChange={e => setForm(p => ({ ...p, agentMobile: e.target.value }))}
                className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-muted-foreground mb-1 block">Inspection Times (one per line)</label>
              <textarea rows={2} value={form.inspectionTimes} onChange={e => setForm(p => ({ ...p, inspectionTimes: e.target.value }))}
                placeholder="Saturday 11:00-11:30am"
                className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-border">
          <button onClick={onClose} className="flex-1 bg-muted border border-border text-muted-foreground hover:text-foreground py-2 rounded-lg text-sm font-medium transition-colors">Cancel</button>
          <button
            onClick={submit}
            disabled={createListing.isPending || !form.address || !form.agentName}
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
  const queryClient = useQueryClient();
  const { data: listings, isLoading } = useGetListings();
  const syncVaultRE = useSyncVaultRE({
    mutation: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: getGetListingsQueryKey() });
        setSyncMsg(data.message);
        setTimeout(() => setSyncMsg(""), 4000);
      },
    },
  });

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Property Intelligence</h1>
          <p className="text-muted-foreground text-sm mt-1">Live listing data powering your AI receptionist</p>
        </div>
        <div className="flex gap-2">
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
            Add Listing
          </button>
        </div>
      </div>

      {syncMsg && (
        <div className="mb-4 bg-primary/10 border border-primary/20 text-primary text-sm px-4 py-3 rounded-lg">
          {syncMsg}
        </div>
      )}

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-48 bg-card border border-border rounded-xl animate-pulse" />)}
        </div>
      ) : !listings?.length ? (
        <div className="bg-card border border-border rounded-xl py-16 text-center">
          <Building2 className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <div className="text-muted-foreground mb-4">No listings yet. Sync from VaultRE or add manually.</div>
          <button onClick={() => syncVaultRE.mutate({})} className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium transition-colors">
            Sync VaultRE
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map(l => (
            <div key={l.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 text-primary">
                  {l.listingType === "rental" ? <Key className="w-4 h-4" /> : <Home className="w-4 h-4" />}
                  <span className="text-xs font-medium uppercase text-muted-foreground">For {l.listingType === "rental" ? "Rent" : "Sale"}</span>
                </div>
                <StatusBadge status={l.status} />
              </div>
              <div className="font-semibold text-foreground mb-1">{l.address}</div>
              <div className="text-sm text-muted-foreground mb-3">{l.suburb} {l.state} {l.postcode}</div>
              {l.price && <div className="text-xl font-bold text-primary mb-3">{l.price}</div>}
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                {l.bedrooms && <span>{l.bedrooms} bed</span>}
                {l.bathrooms && <span>{l.bathrooms} bath</span>}
              </div>
              <div className="border-t border-border pt-3">
                <div className="text-xs text-muted-foreground mb-1">Listing Agent</div>
                <div className="text-sm font-medium text-foreground">{l.agentName}</div>
                <div className="text-xs text-primary">{l.agentMobile}</div>
              </div>
              {l.inspectionTimes?.length > 0 && (
                <div className="mt-3 border-t border-border pt-3">
                  <div className="text-xs text-muted-foreground mb-1">Inspection Times</div>
                  {l.inspectionTimes.slice(0, 2).map((t, i) => (
                    <div key={i} className="text-xs text-foreground">{t}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showAdd && <AddListingModal onClose={() => setShowAdd(false)} />}
    </DashboardLayout>
  );
}
