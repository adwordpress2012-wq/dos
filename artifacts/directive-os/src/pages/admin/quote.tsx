import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Copy, Check, FileText, Zap } from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL ?? "/api";
const secret = () => localStorage.getItem("adminSecret") || "";

const TIERS = [
  { id: "small",  label: "Small",  setup: 1800, monthly: 299, perSeat: 89 },
  { id: "medium", label: "Medium", setup: 2500, monthly: 399, perSeat: 99 },
  { id: "large",  label: "Large",  setup: 4500, monthly: 599, perSeat: 119 },
];

export default function AdminQuote() {
  const [tier, setTier] = useState("small");
  const [seats, setSeats] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const selected = TIERS.find(t => t.id === tier)!;
  const additionalSeats = Math.max(0, seats - 1);
  const totalSetup = selected.setup;
  const totalMonthly = selected.monthly + additionalSeats * selected.perSeat;

  async function generate() {
    if (!email || !agencyName) { setError("Agency name and email are required."); return; }
    setError("");
    setLoading(true);
    setLink("");
    try {
      const res = await fetch(`${API}/admin/quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-secret": secret() },
        body: JSON.stringify({ tier, seats, contactName: name, email, agencyName }),
      });
      const data = await res.json();
      if (data.url) setLink(data.url);
      else setError(data.error ?? "Failed to generate link.");
    } catch { setError("Connection error. Try again."); }
    finally { setLoading(false); }
  }

  function copy() {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(0,209,178,0.15)",
    borderRadius: 8,
    padding: "10px 14px",
    color: "#fff",
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5" style={{ color: "#00d1b2" }} />
            <h1 className="text-xl font-bold text-white">Quote Builder</h1>
          </div>
          <p className="text-sm font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>
            Generate a Stripe payment link for any prospect — select tier, seats, and send.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Tier selector */}
          <div className="rounded-xl p-6" style={{ background: "rgba(5,14,26,0.9)", border: "1px solid rgba(0,209,178,0.12)" }}>
            <div className="text-xs font-mono font-bold tracking-wider mb-4" style={{ color: "rgba(0,209,178,0.6)" }}>SELECT TIER</div>
            <div className="grid grid-cols-3 gap-3">
              {TIERS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTier(t.id)}
                  className="rounded-lg p-4 text-left transition-all"
                  style={{
                    background: tier === t.id ? "rgba(0,209,178,0.12)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${tier === t.id ? "rgba(0,209,178,0.4)" : "rgba(0,209,178,0.08)"}`,
                  }}
                >
                  <div className="text-sm font-bold text-white mb-1">{t.label}</div>
                  <div className="text-xs font-mono" style={{ color: "#00d1b2" }}>${t.setup.toLocaleString()} setup</div>
                  <div className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>${t.monthly}/mo + ${t.perSeat}/seat</div>
                </button>
              ))}
            </div>
          </div>

          {/* Seats + prospect details */}
          <div className="rounded-xl p-6" style={{ background: "rgba(5,14,26,0.9)", border: "1px solid rgba(0,209,178,0.12)" }}>
            <div className="text-xs font-mono font-bold tracking-wider mb-4" style={{ color: "rgba(0,209,178,0.6)" }}>PROSPECT DETAILS</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-mono font-bold mb-2" style={{ color: "rgba(0,209,178,0.5)" }}>AGENCY NAME *</label>
                <input style={inputStyle} value={agencyName} onChange={e => setAgencyName(e.target.value)} placeholder="e.g. Century 21 The Rana Group" />
              </div>
              <div>
                <label className="block text-xs font-mono font-bold mb-2" style={{ color: "rgba(0,209,178,0.5)" }}>CONTACT NAME</label>
                <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. John Smith" />
              </div>
              <div>
                <label className="block text-xs font-mono font-bold mb-2" style={{ color: "rgba(0,209,178,0.5)" }}>CONTACT EMAIL *</label>
                <input style={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@agency.com.au" />
              </div>
              <div>
                <label className="block text-xs font-mono font-bold mb-2" style={{ color: "rgba(0,209,178,0.5)" }}>SEATS (incl. owner)</label>
                <input style={inputStyle} type="number" min={1} max={50} value={seats} onChange={e => setSeats(Math.max(1, parseInt(e.target.value) || 1))} />
              </div>
            </div>
          </div>

          {/* Quote summary */}
          <div className="rounded-xl p-6" style={{ background: "rgba(0,209,178,0.04)", border: "1px solid rgba(0,209,178,0.15)" }}>
            <div className="text-xs font-mono font-bold tracking-wider mb-4" style={{ color: "rgba(0,209,178,0.6)" }}>QUOTE SUMMARY</div>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span style={{ color: "rgba(255,255,255,0.5)" }}>Tier</span>
                <span className="text-white font-semibold">{selected.label}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "rgba(255,255,255,0.5)" }}>Setup Fee (one-time)</span>
                <span className="font-mono font-bold" style={{ color: "#00d1b2" }}>A${totalSetup.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "rgba(255,255,255,0.5)" }}>Month 1 Licence</span>
                <span className="font-mono font-bold text-white">A${selected.monthly}</span>
              </div>
              {additionalSeats > 0 && (
                <div className="flex justify-between">
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>{additionalSeats} Additional Seat{additionalSeats > 1 ? "s" : ""} × A${selected.perSeat}</span>
                  <span className="font-mono font-bold text-white">A${(additionalSeats * selected.perSeat).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t" style={{ borderColor: "rgba(0,209,178,0.15)" }}>
                <span className="font-bold text-white">Due Today</span>
                <span className="font-mono font-bold text-lg" style={{ color: "#00d1b2" }}>
                  A${(totalSetup + selected.monthly + additionalSeats * selected.perSeat).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Then monthly from Month 2</span>
                <span className="font-mono text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>A${totalMonthly}/mo</span>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg text-xs font-mono" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444" }}>
                {error}
              </div>
            )}

            {link ? (
              <div className="space-y-3">
                <div className="p-3 rounded-lg text-xs font-mono break-all" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(0,209,178,0.2)", color: "#00d1b2" }}>
                  {link}
                </div>
                <div className="flex gap-2">
                  <button onClick={copy} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all flex-1 justify-center" style={{ background: copied ? "rgba(16,185,129,0.15)" : "rgba(0,209,178,0.15)", border: "1px solid rgba(0,209,178,0.3)", color: copied ? "#10b981" : "#00d1b2" }}>
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied!" : "Copy Link"}
                  </button>
                  <button onClick={() => { setLink(""); setName(""); setEmail(""); setAgencyName(""); setSeats(1); }} className="px-4 py-2.5 rounded-lg text-sm font-bold" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>
                    New Quote
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={generate} disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all disabled:opacity-50" style={{ background: "#00d1b2", color: "#050e1a" }}>
                <Zap className="w-4 h-4" />
                {loading ? "Generating..." : "Generate Payment Link"}
              </button>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
