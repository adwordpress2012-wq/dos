import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Plus, Trash2, Pencil, Building2, Bed, Bath, Car, X, Check, RefreshCw, ChevronDown } from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL ?? "/api";
const secret = () => sessionStorage.getItem("adminSecret") || "";

const AUS_STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];
const LISTING_TYPES = ["sale", "rental", "commercial", "land"];
const LISTING_METHODS = ["private_treaty", "auction", "tender", "expressions_of_interest"];
const STATUSES = ["active", "under_offer", "sold", "leased", "withdrawn"];

const STATUS_COLOR: Record<string, string> = {
  active: "#10b981",
  under_offer: "#f59e0b",
  sold: "#6366f1",
  leased: "#06b6d4",
  withdrawn: "#ef4444",
};

const EMPTY_FORM = {
  agencyId: "",
  address: "",
  suburb: "",
  state: "NSW",
  postcode: "",
  price: "",
  listingType: "sale",
  listingMethod: "private_treaty",
  bedrooms: "",
  bathrooms: "",
  carSpaces: "",
  agentName: "",
  agentMobile: "",
  inspectionTimesRaw: "",
  auctionDate: "",
  auctionTime: "",
  status: "active",
  photoUrl: "",
  description: "",
};

type Listing = {
  id: number;
  agencyId: number;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  price: string | null;
  listingType: string;
  listingMethod: string;
  bedrooms: number | null;
  bathrooms: number | null;
  carSpaces: number | null;
  agentName: string;
  agentMobile: string;
  inspectionTimes: string[];
  auctionDate: string | null;
  auctionTime: string | null;
  status: string;
  photoUrl: string | null;
  description: string | null;
  vaultreId: string | null;
  createdAt: string;
};

type Agency = { id: number; name: string };

function Input({ label, value, onChange, type = "text", placeholder = "", required = false }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[10px] font-mono font-bold mb-1" style={{ color: "rgba(0,209,178,0.7)" }}>
        {label}{required && <span style={{ color: "#ef4444" }}> *</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded text-sm font-mono outline-none"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,209,178,0.2)", color: "#fff" }}
      />
    </div>
  );
}

function Select({ label, value, onChange, options, required = false }: {
  label: string; value: string; onChange: (v: string) => void;
  options: string[]; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[10px] font-mono font-bold mb-1" style={{ color: "rgba(0,209,178,0.7)" }}>
        {label}{required && <span style={{ color: "#ef4444" }}> *</span>}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded text-sm font-mono outline-none"
        style={{ background: "#0a1628", border: "1px solid rgba(0,209,178,0.2)", color: "#fff" }}
      >
        {options.map(o => <option key={o} value={o}>{o.replace(/_/g, " ").toUpperCase()}</option>)}
      </select>
    </div>
  );
}

function Modal({ title, onClose, onSave, form, setForm, agencies, saving }: {
  title: string; onClose: () => void; onSave: () => void;
  form: typeof EMPTY_FORM; setForm: (f: typeof EMPTY_FORM) => void;
  agencies: Agency[]; saving: boolean;
}) {
  const set = (key: keyof typeof EMPTY_FORM) => (v: string) => setForm({ ...form, [key]: v });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.75)" }}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl"
        style={{ background: "#050e1a", border: "1px solid rgba(0,209,178,0.25)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(0,209,178,0.15)" }}>
          <span className="text-sm font-bold tracking-wider font-mono" style={{ color: "#00d1b2" }}>{title}</span>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-[10px] font-mono font-bold mb-1" style={{ color: "rgba(0,209,178,0.7)" }}>
              AGENCY <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <select
              value={form.agencyId}
              onChange={e => set("agencyId")(e.target.value)}
              className="w-full px-3 py-2 rounded text-sm font-mono outline-none"
              style={{ background: "#0a1628", border: "1px solid rgba(0,209,178,0.2)", color: "#fff" }}
            >
              <option value="">— Select Agency —</option>
              {agencies.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <Input label="STREET ADDRESS" value={form.address} onChange={set("address")} required placeholder="42 Harbour View Drive" />
          </div>
          <Input label="SUBURB" value={form.suburb} onChange={set("suburb")} required placeholder="Castle Hill" />
          <div className="grid grid-cols-2 gap-3">
            <Select label="STATE" value={form.state} onChange={set("state")} options={AUS_STATES} required />
            <Input label="POSTCODE" value={form.postcode} onChange={set("postcode")} required placeholder="2154" />
          </div>
          <Input label="PRICE" value={form.price} onChange={set("price")} placeholder="$850,000" />
          <Select label="LISTING TYPE" value={form.listingType} onChange={set("listingType")} options={LISTING_TYPES} required />
          <Select label="SALE METHOD" value={form.listingMethod} onChange={set("listingMethod")} options={LISTING_METHODS} />
          <Select label="STATUS" value={form.status} onChange={set("status")} options={STATUSES} required />
          <Input label="BEDROOMS" value={form.bedrooms} onChange={set("bedrooms")} type="number" placeholder="4" />
          <Input label="BATHROOMS" value={form.bathrooms} onChange={set("bathrooms")} type="number" placeholder="2" />
          <Input label="CAR SPACES" value={form.carSpaces} onChange={set("carSpaces")} type="number" placeholder="2" />
          <Input label="AGENT NAME" value={form.agentName} onChange={set("agentName")} required placeholder="James Hartley" />
          <Input label="AGENT MOBILE" value={form.agentMobile} onChange={set("agentMobile")} required placeholder="0412 345 678" />
          {(form.listingMethod === "auction") && <>
            <Input label="AUCTION DATE" value={form.auctionDate} onChange={set("auctionDate")} type="date" />
            <Input label="AUCTION TIME" value={form.auctionTime} onChange={set("auctionTime")} placeholder="11:00am" />
          </>}
          <div className="col-span-2">
            <label className="block text-[10px] font-mono font-bold mb-1" style={{ color: "rgba(0,209,178,0.7)" }}>
              INSPECTION TIMES <span className="text-white/30">(one per line)</span>
            </label>
            <textarea
              value={form.inspectionTimesRaw}
              onChange={e => set("inspectionTimesRaw")(e.target.value)}
              rows={2}
              placeholder={"Saturday 10:00-10:30am\nSunday 1:00-1:30pm"}
              className="w-full px-3 py-2 rounded text-sm font-mono outline-none resize-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,209,178,0.2)", color: "#fff" }}
            />
          </div>
          <div className="col-span-2">
            <Input label="PHOTO URL" value={form.photoUrl} onChange={set("photoUrl")} placeholder="https://..." />
          </div>
          <div className="col-span-2">
            <label className="block text-[10px] font-mono font-bold mb-1" style={{ color: "rgba(0,209,178,0.7)" }}>DESCRIPTION</label>
            <textarea
              value={form.description}
              onChange={e => set("description")(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded text-sm font-mono outline-none resize-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,209,178,0.2)", color: "#fff" }}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 pb-6">
          <button onClick={onClose} className="px-4 py-2 rounded text-sm font-mono text-white/50 hover:text-white/80">Cancel</button>
          <button
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded text-sm font-bold font-mono transition-all"
            style={{ background: saving ? "rgba(0,209,178,0.3)" : "#00d1b2", color: "#040912" }}
          >
            <Check className="w-3.5 h-3.5" />
            {saving ? "SAVING..." : "SAVE LISTING"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminListings() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [selectedAgency, setSelectedAgency] = useState<string>("");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Listing | null>(null);
  const [form, setForm] = useState<typeof EMPTY_FORM>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    fetch(`${API}/admin/clients`, { headers: { "x-admin-secret": secret() } })
      .then(r => r.json())
      .then((clients: any) => {
        if (Array.isArray(clients)) {
          setAgencies(clients.map(c => ({ id: c.id, name: c.name })));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedAgency) { setListings([]); return; }
    setLoading(true);
    fetch(`${API}/admin/listings?agencyId=${selectedAgency}`, { headers: { "x-admin-secret": secret() } })
      .then(r => r.json()).then(setListings).finally(() => setLoading(false));
  }, [selectedAgency]);

  function openAdd() {
    setEditTarget(null);
    setForm({ ...EMPTY_FORM, agencyId: selectedAgency });
    setShowModal(true);
  }

  function openEdit(l: Listing) {
    setEditTarget(l);
    setForm({
      agencyId: String(l.agencyId),
      address: l.address,
      suburb: l.suburb,
      state: l.state,
      postcode: l.postcode,
      price: l.price || "",
      listingType: l.listingType,
      listingMethod: l.listingMethod,
      bedrooms: l.bedrooms != null ? String(l.bedrooms) : "",
      bathrooms: l.bathrooms != null ? String(l.bathrooms) : "",
      carSpaces: l.carSpaces != null ? String(l.carSpaces) : "",
      agentName: l.agentName,
      agentMobile: l.agentMobile,
      inspectionTimesRaw: l.inspectionTimes.join("\n"),
      auctionDate: l.auctionDate || "",
      auctionTime: l.auctionTime || "",
      status: l.status,
      photoUrl: l.photoUrl || "",
      description: l.description || "",
    });
    setShowModal(true);
  }

  async function handleSave() {
    setSaving(true);
    const body = {
      ...form,
      agencyId: Number(form.agencyId),
      bedrooms: form.bedrooms || null,
      bathrooms: form.bathrooms || null,
      carSpaces: form.carSpaces || null,
      inspectionTimes: form.inspectionTimesRaw.split("\n").map(s => s.trim()).filter(Boolean),
      auctionDate: form.auctionDate || null,
      auctionTime: form.auctionTime || null,
      price: form.price || null,
      photoUrl: form.photoUrl || null,
      description: form.description || null,
    };
    try {
      if (editTarget) {
        await fetch(`${API}/admin/listings/${editTarget.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "x-admin-secret": secret() },
          body: JSON.stringify(body),
        });
        showToast("Listing updated");
      } else {
        await fetch(`${API}/admin/listings`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-admin-secret": secret() },
          body: JSON.stringify(body),
        });
        showToast("Listing added");
      }
      setShowModal(false);
      if (selectedAgency) {
        const res = await fetch(`${API}/admin/listings?agencyId=${selectedAgency}`, { headers: { "x-admin-secret": secret() } });
        setListings(await res.json());
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this listing?")) return;
    await fetch(`${API}/admin/listings/${id}`, { method: "DELETE", headers: { "x-admin-secret": secret() } });
    setListings(prev => prev.filter(l => l.id !== id));
    showToast("Listing deleted");
  }

  async function handleSync() {
    if (!selectedAgency) return;
    setSyncing(true);
    try {
      const res = await fetch(`${API}/listings/sync-vaultre`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-secret": secret(), "x-agency-id": selectedAgency },
      });
      const data = await res.json();
      showToast(`VaultRE sync: ${data.added ?? 0} added, ${data.updated ?? 0} updated`);
      const r2 = await fetch(`${API}/admin/listings?agencyId=${selectedAgency}`, { headers: { "x-admin-secret": secret() } });
      setListings(await r2.json());
    } finally {
      setSyncing(false);
    }
  }

  const agencyName = agencies.find(a => String(a.id) === selectedAgency)?.name;

  return (
    <AdminLayout title="LISTINGS OPS">
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-mono font-bold shadow-xl"
          style={{ background: "#00d1b2", color: "#040912" }}>
          <Check className="w-4 h-4" /> {toast}
        </div>
      )}

      {showModal && (
        <Modal
          title={editTarget ? `EDIT LISTING — #${editTarget.id}` : "ADD NEW LISTING"}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          form={form}
          setForm={setForm}
          agencies={agencies}
          saving={saving}
        />
      )}

      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold tracking-wider text-white">LISTINGS OPS</h1>
            <p className="text-xs font-mono mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
              Manually manage property listings for any agency
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedAgency && (
              <>
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold transition-all"
                  style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#818cf8" }}
                >
                  <RefreshCw className={`w-3 h-3 ${syncing ? "animate-spin" : ""}`} />
                  {syncing ? "SYNCING..." : "SYNC VAULTRE"}
                </button>
                <button
                  onClick={openAdd}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold"
                  style={{ background: "#00d1b2", color: "#040912" }}
                >
                  <Plus className="w-3.5 h-3.5" /> ADD LISTING
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: "rgba(0,209,178,0.05)", border: "1px solid rgba(0,209,178,0.15)" }}>
          <Building2 className="w-4 h-4 shrink-0" style={{ color: "#00d1b2" }} />
          <label className="text-xs font-mono font-bold shrink-0" style={{ color: "#00d1b2" }}>SELECT AGENCY</label>
          <div className="relative flex-1">
            <select
              value={selectedAgency}
              onChange={e => setSelectedAgency(e.target.value)}
              className="w-full px-3 py-2 pr-8 rounded text-sm font-mono outline-none appearance-none"
              style={{ background: "#0a1628", border: "1px solid rgba(0,209,178,0.2)", color: "#fff" }}
            >
              <option value="">— Choose an agency to manage listings —</option>
              {agencies.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "rgba(255,255,255,0.4)" }} />
          </div>
        </div>

        {!selectedAgency && (
          <div className="text-center py-16">
            <Building2 className="w-10 h-10 mx-auto mb-3" style={{ color: "rgba(0,209,178,0.2)" }} />
            <p className="text-sm font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>Select an agency above to view and manage their listings</p>
          </div>
        )}

        {selectedAgency && loading && (
          <div className="text-center py-16">
            <div className="w-6 h-6 border-2 rounded-full animate-spin mx-auto mb-3"
              style={{ borderColor: "rgba(0,209,178,0.3)", borderTopColor: "#00d1b2" }} />
            <p className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>Loading listings...</p>
          </div>
        )}

        {selectedAgency && !loading && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>
                {agencyName} — <span style={{ color: "#00d1b2" }}>{listings.length} listings</span>
              </div>
            </div>

            {listings.length === 0 ? (
              <div className="text-center py-16 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)" }}>
                <Building2 className="w-8 h-8 mx-auto mb-3" style={{ color: "rgba(0,209,178,0.2)" }} />
                <p className="text-sm font-mono mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>No listings yet for {agencyName}</p>
                <p className="text-xs font-mono mb-4" style={{ color: "rgba(255,255,255,0.2)" }}>Add manually or trigger a VaultRE sync</p>
                <button
                  onClick={openAdd}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded text-sm font-mono font-bold"
                  style={{ background: "#00d1b2", color: "#040912" }}
                >
                  <Plus className="w-4 h-4" /> Add First Listing
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {listings.map(l => (
                  <div key={l.id} className="flex items-center gap-4 px-4 py-3 rounded-lg group transition-all"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-semibold text-white truncate">{l.address}</span>
                        <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>{l.suburb} {l.state}</span>
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold shrink-0"
                          style={{ background: `${STATUS_COLOR[l.status] || "#888"}20`, color: STATUS_COLOR[l.status] || "#888" }}
                        >
                          {l.status.replace(/_/g, " ").toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>
                        <span style={{ color: "#00d1b2" }}>{l.price || "POA"}</span>
                        <span>{l.listingType.toUpperCase()} · {l.listingMethod.replace(/_/g, " ").toUpperCase()}</span>
                        {l.bedrooms != null && <span className="flex items-center gap-1"><Bed className="w-3 h-3" />{l.bedrooms}</span>}
                        {l.bathrooms != null && <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{l.bathrooms}</span>}
                        {l.carSpaces != null && <span className="flex items-center gap-1"><Car className="w-3 h-3" />{l.carSpaces}</span>}
                        <span>{l.agentName}</span>
                        {l.vaultreId && <span className="px-1 py-0.5 rounded" style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}>VaultRE</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(l)}
                        className="p-1.5 rounded hover:bg-white/10 transition-colors" style={{ color: "#00d1b2" }}>
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(l.id)}
                        className="p-1.5 rounded hover:bg-white/10 transition-colors" style={{ color: "#ef4444" }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
