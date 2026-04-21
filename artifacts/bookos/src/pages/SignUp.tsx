import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL ?? "https://directiveos.com.au/api";

const TIERS = [
  { id: "solo",   name: "Solo",           setup: 499,  monthly: 99,  minutes: 200 },
  { id: "studio", name: "Studio",         setup: 799,  monthly: 149, minutes: 400 },
  { id: "multi",  name: "Multi-Location", setup: 1499, monthly: 249, minutes: 800 },
];

const VERTICALS = [
  { id: "salon",    label: "Hair & Beauty Salon" },
  { id: "trades",   label: "Trades & Services (plumbing, electrical, etc.)" },
  { id: "wellness", label: "Wellness & Health (physio, massage, yoga, etc.)" },
  { id: "other",    label: "Other" },
];

const inputStyle = {
  background: "rgba(0,201,167,0.05)",
  border: "1px solid rgba(0,201,167,0.2)",
  color: "white",
  outline: "none",
  padding: "10px 14px",
  borderRadius: "10px",
  fontSize: "14px",
  width: "100%",
} as const;

export default function SignUp() {
  const [params] = useSearchParams();
  const [tier, setTier] = useState(params.get("tier") ?? "solo");
  const [vertical, setVertical] = useState("salon");
  const [form, setForm] = useState({ businessName: "", contactName: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = params.get("tier");
    if (t && TIERS.find(x => x.id === t)) setTier(t);
  }, [params]);

  function field(k: keyof typeof form, v: string) {
    setForm(f => ({ ...f, [k]: v }));
  }

  const selectedTier = TIERS.find(t => t.id === tier) ?? TIERS[0];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.businessName || !form.email) { setError("Business name and email are required."); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/billing/bookos-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, vertical, ...form }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? "Something went wrong. Please try again or contact us.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Network error — please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="text-xs font-bold tracking-widest mb-3" style={{ color: "rgba(0,201,167,0.7)" }}>GET STARTED</div>
          <h1 className="text-3xl font-bold text-white mb-3">Activate Sarah for your business</h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            You'll be taken to Stripe to complete payment. Setup takes ~15 minutes after payment.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-5 rounded-2xl p-6 border" style={{ background: "rgba(10,28,48,0.7)", borderColor: "rgba(0,201,167,0.15)" }}>
          {/* Tier selector */}
          <div>
            <label className="block text-xs font-bold mb-2" style={{ color: "rgba(0,201,167,0.8)" }}>PLAN</label>
            <div className="grid grid-cols-3 gap-2">
              {TIERS.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTier(t.id)}
                  className="p-3 rounded-xl text-center border transition-all"
                  style={{
                    background: tier === t.id ? "rgba(0,201,167,0.12)" : "transparent",
                    borderColor: tier === t.id ? "rgba(0,201,167,0.5)" : "rgba(255,255,255,0.1)",
                    color: tier === t.id ? "#00c9a7" : "rgba(255,255,255,0.5)",
                  }}
                >
                  <div className="font-bold text-xs">{t.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: tier === t.id ? "rgba(0,201,167,0.7)" : "rgba(255,255,255,0.35)" }}>${t.monthly}/mo</div>
                </button>
              ))}
            </div>
            <div className="text-xs mt-2 text-center" style={{ color: "rgba(255,255,255,0.35)" }}>
              ${selectedTier.setup} setup + ${selectedTier.monthly}/mo · {selectedTier.minutes} AI minutes
            </div>
          </div>

          {/* Vertical */}
          <div>
            <label className="block text-xs font-bold mb-2" style={{ color: "rgba(0,201,167,0.8)" }}>BUSINESS TYPE</label>
            <select
              value={vertical}
              onChange={e => setVertical(e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              {VERTICALS.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}
            </select>
          </div>

          {/* Business name */}
          <div>
            <label className="block text-xs font-bold mb-2" style={{ color: "rgba(0,201,167,0.8)" }}>BUSINESS NAME *</label>
            <input
              style={inputStyle}
              placeholder="e.g. Smith's Hair Studio"
              value={form.businessName}
              onChange={e => field("businessName", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold mb-2" style={{ color: "rgba(0,201,167,0.8)" }}>YOUR NAME</label>
              <input
                style={inputStyle}
                placeholder="First name"
                value={form.contactName}
                onChange={e => field("contactName", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-2" style={{ color: "rgba(0,201,167,0.8)" }}>PHONE</label>
              <input
                style={inputStyle}
                placeholder="04xx xxx xxx"
                value={form.phone}
                onChange={e => field("phone", e.target.value)}
                type="tel"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-2" style={{ color: "rgba(0,201,167,0.8)" }}>EMAIL *</label>
            <input
              style={inputStyle}
              placeholder="you@yourbusiness.com.au"
              value={form.email}
              onChange={e => field("email", e.target.value)}
              type="email"
              required
            />
          </div>

          {error && (
            <div className="text-sm p-3 rounded-xl" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2"
            style={{ background: loading ? "rgba(0,201,167,0.5)" : "#00c9a7", color: "#06111f", cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Preparing Checkout…" : `Continue to Payment — $${selectedTier.setup} setup + $${selectedTier.monthly}/mo`}
          </button>

          <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.3)" }}>
            Secure payment via Stripe · All prices AUD ex-GST
          </p>
        </form>
      </div>
    </div>
  );
}
