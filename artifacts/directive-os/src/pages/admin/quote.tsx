import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Copy, Check, FileText, Zap, Globe, Database, TrendingUp } from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL ?? "/api";
const secret = () => localStorage.getItem("adminSecret") || "";

const TIERS = [
  { id: "small",  label: "Small",  setup: 1800, monthly: 299, perSeat: 89,  agents: "1–5 agents" },
  { id: "medium", label: "Medium", setup: 2500, monthly: 399, perSeat: 99,  agents: "6–20 agents" },
  { id: "large",  label: "Large",  setup: 4500, monthly: 599, perSeat: 119, agents: "20+ agents" },
];

const ADDONS = [
  {
    id: "widget",
    label: "Website Widget Add-On",
    desc: "Embed Sarah on the agency's existing website",
    monthly: 50,
    icon: Globe,
  },
  {
    id: "crm",
    label: "CRM Integration Add-On",
    desc: "Auto-sync listings from VaultRE / Rex — no manual uploads",
    monthly: 99,
    icon: Database,
  },
];

export default function AdminQuote() {
  const [tier, setTier] = useState("small");
  const [seats, setSeats] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [addons, setAddons] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const PRESETS = [
    { label: "Core Only", desc: "No add-ons", addons: [] },
    { label: "Core + Widget", desc: "+$50/mo website widget", addons: ["widget"] },
    { label: "Full Suite", desc: "+$149/mo both add-ons", addons: ["widget", "crm"] },
  ];

  const selected = TIERS.find(t => t.id === tier)!;
  const additionalSeats = Math.max(0, seats - 1);
  const addonMonthly = ADDONS.filter(a => addons.includes(a.id)).reduce((s, a) => s + a.monthly, 0);
  const totalSetup = selected.setup;
  const totalMonthly = selected.monthly + additionalSeats * selected.perSeat + addonMonthly;
  const dueToday = totalSetup + selected.monthly + additionalSeats * selected.perSeat + addonMonthly;

  function toggleAddon(id: string) {
    setAddons(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  async function generate() {
    if (!email || !agencyName) { setError("Agency name and email are required."); return; }
    setError("");
    setLoading(true);
    setLink("");
    try {
      const res = await fetch(`${API}/admin/quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-secret": secret() },
        body: JSON.stringify({ tier, seats, contactName: name, email, agencyName, addons }),
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

  const card: React.CSSProperties = {
    background: "rgba(5,14,26,0.9)",
    border: "1px solid rgba(0,209,178,0.12)",
    borderRadius: 12,
    padding: 24,
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
            Generate a Stripe payment link for any prospect — select tier, add-ons, and send.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Quick presets */}
          <div style={card}>
            <div className="text-xs font-mono font-bold tracking-wider mb-4" style={{ color: "rgba(0,209,178,0.6)" }}>QUICK PRESETS</div>
            <div className="grid grid-cols-3 gap-3">
              {PRESETS.map(p => {
                const active = JSON.stringify([...addons].sort()) === JSON.stringify([...p.addons].sort());
                return (
                  <button
                    key={p.label}
                    onClick={() => setAddons(p.addons)}
                    className="rounded-lg p-3 text-left transition-all"
                    style={{
                      background: active ? "rgba(0,209,178,0.12)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${active ? "rgba(0,209,178,0.4)" : "rgba(0,209,178,0.08)"}`,
                    }}
                  >
                    <div className="text-sm font-bold text-white mb-1">{p.label}</div>
                    <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{p.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tier selector */}
          <div style={card}>
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
                  <div className="text-xs font-mono" style={{ color: "#94a3b8" }}>{t.agents}</div>
                  <div className="text-xs font-mono mt-1" style={{ color: "#00d1b2" }}>${t.setup.toLocaleString()} setup</div>
                  <div className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>${t.monthly}/mo</div>
                </button>
              ))}
            </div>
          </div>

          {/* Add-ons */}
          <div style={card}>
            <div className="text-xs font-mono font-bold tracking-wider mb-4" style={{ color: "rgba(0,209,178,0.6)" }}>ADD-ONS (OPTIONAL)</div>
            <div className="grid gap-3">
              {ADDONS.map(a => {
                const active = addons.includes(a.id);
                const Icon = a.icon;
                return (
                  <button
                    key={a.id}
                    onClick={() => toggleAddon(a.id)}
                    className="flex items-center gap-4 rounded-lg p-4 text-left transition-all w-full"
                    style={{
                      background: active ? "rgba(0,209,178,0.08)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${active ? "rgba(0,209,178,0.35)" : "rgba(0,209,178,0.08)"}`,
                    }}
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: active ? "rgba(0,209,178,0.15)" : "rgba(255,255,255,0.04)" }}>
                      <Icon className="w-4 h-4" style={{ color: active ? "#00d1b2" : "rgba(255,255,255,0.3)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white">{a.label}</div>
                      <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{a.desc}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-mono font-bold" style={{ color: active ? "#00d1b2" : "rgba(255,255,255,0.3)" }}>+${a.monthly}/mo</div>
                      <div className="text-xs mt-0.5" style={{ color: active ? "rgba(0,209,178,0.6)" : "transparent" }}>included</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prospect details */}
          <div style={card}>
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
                <span style={{ color: "rgba(255,255,255,0.5)" }}>Tier — {selected.label} ({selected.agents})</span>
                <span className="text-white font-semibold">{selected.label}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "rgba(255,255,255,0.5)" }}>Setup Fee (one-time)</span>
                <span className="font-mono font-bold" style={{ color: "#00d1b2" }}>A${totalSetup.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "rgba(255,255,255,0.5)" }}>Monthly Licence</span>
                <span className="font-mono font-bold text-white">A${selected.monthly}/mo</span>
              </div>
              {additionalSeats > 0 && (
                <div className="flex justify-between">
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>{additionalSeats} Additional Seat{additionalSeats > 1 ? "s" : ""} × A${selected.perSeat}</span>
                  <span className="font-mono font-bold text-white">A${(additionalSeats * selected.perSeat).toLocaleString()}/mo</span>
                </div>
              )}
              {ADDONS.filter(a => addons.includes(a.id)).map(a => (
                <div key={a.id} className="flex justify-between">
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>{a.label}</span>
                  <span className="font-mono font-bold" style={{ color: "#00d1b2" }}>A${a.monthly}/mo</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 border-t" style={{ borderColor: "rgba(0,209,178,0.15)" }}>
                <span className="font-bold text-white">Due Today</span>
                <span className="font-mono font-bold text-lg" style={{ color: "#00d1b2" }}>
                  A${dueToday.toLocaleString()}
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
                  <button onClick={() => { setLink(""); setName(""); setEmail(""); setAgencyName(""); setSeats(1); setAddons([]); }} className="px-4 py-2.5 rounded-lg text-sm font-bold" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>
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

          {/* Value Justification — "What's the $1,800 for?" */}
          <div style={{ ...card, border: "1px solid rgba(201,168,76,0.25)", background: "rgba(201,168,76,0.03)" }}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4" style={{ color: "#C9A84C" }} />
              <div className="text-xs font-mono font-bold tracking-wider" style={{ color: "rgba(201,168,76,0.8)" }}>VALUE JUSTIFICATION — "WHAT'S THE $1,800 FOR?"</div>
            </div>
            <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
              Use this when a prospect asks why the setup fee is worth it. The ROI is clear once you frame it correctly.
            </p>
            <div className="rounded-lg p-4 mb-4" style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="text-xs font-bold mb-3" style={{ color: "#C9A84C" }}>WHAT IT REPLACES</div>
              <div className="space-y-2">
                {[
                  ["Part-time receptionist (20 hrs/wk)", "$40,000–$60,000/year"],
                  ["Lost lead from 1 missed call/week", "$10,000–$15,000 commission"],
                  ["Agency website build + hosting", "$2,000–$5,000/year"],
                  ["Manual CRM data entry (2 hrs/wk)", "$3,000–$5,000/year in admin"],
                  ["After-hours answering service", "$200–$600/month"],
                ].map(([what, cost]) => (
                  <div key={what} className="flex justify-between items-center text-xs gap-4">
                    <span style={{ color: "rgba(255,255,255,0.5)" }}>{what}</span>
                    <span className="font-mono font-bold flex-shrink-0" style={{ color: "#C9A84C" }}>{cost}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg p-3" style={{ background: "rgba(0,209,178,0.06)", border: "1px solid rgba(0,209,178,0.15)" }}>
              <div className="text-xs font-bold mb-1" style={{ color: "#00d1b2" }}>THE PITCH LINE</div>
              <p className="text-xs italic" style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
                "A part-time receptionist costs $40k a year. Sarah costs less than $3,600. And she works every Sunday night, every public holiday, and never calls in sick. The setup fee covers your AI training, your agency website, and your first month — all in."
              </p>
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}
