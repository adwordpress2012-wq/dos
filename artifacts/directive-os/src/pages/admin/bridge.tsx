import { useState, useEffect, useRef, useCallback } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  TrendingUp, Users, DollarSign, Activity, Zap, Phone, MessageSquare,
  Clock, AlertTriangle, ChevronRight, ArrowUpRight, RefreshCw, Check,
  Scissors, Plus, ChevronDown, ChevronUp,
} from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL ?? "/api";
const secret = () => localStorage.getItem("adminSecret") || "";

function fmt(cents: number) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", minimumFractionDigits: 0 }).format(cents / 100);
}

function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(0);
  useEffect(() => {
    const target = value;
    const start = ref.current;
    const diff = target - start;
    const steps = 40;
    let step = 0;
    const iv = setInterval(() => {
      step++;
      ref.current = Math.round(start + (diff * step) / steps);
      setDisplay(ref.current);
      if (step >= steps) clearInterval(iv);
    }, 20);
    return () => clearInterval(iv);
  }, [value]);
  return <span>{prefix}{display.toLocaleString()}{suffix}</span>;
}

function KPIPod({
  label, value, sub, icon: Icon, accent, glow, alert,
}: {
  label: string; value: string | React.ReactNode; sub?: string;
  icon: React.ElementType; accent?: string; glow?: boolean; alert?: boolean;
}) {
  const color = alert ? "#ef4444" : (accent || "#00d1b2");
  return (
    <div
      className="relative rounded-xl p-5 overflow-hidden"
      style={{
        background: "rgba(5,14,26,0.9)",
        border: `1px solid ${color}25`,
        boxShadow: glow ? `0 0 20px ${color}15` : undefined,
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}50, transparent)` }} />
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-lg" style={{ background: `${color}12`, border: `1px solid ${color}20` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <ArrowUpRight className="w-3.5 h-3.5" style={{ color: `${color}40` }} />
      </div>
      <div className="text-2xl font-bold text-white font-mono mb-0.5">{value}</div>
      <div className="text-xs font-bold tracking-wider uppercase mb-1" style={{ color: `${color}80` }}>{label}</div>
      {sub && <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>{sub}</div>}
    </div>
  );
}

function ActivityFeed({ items }: { items: Array<{ id: number; leadName: string | null; channel: string; agencyName: string; createdAt: string }> }) {
  return (
    <div className="space-y-1.5">
      {items.slice(0, 8).map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-3 px-3 py-2 rounded-lg"
          style={{ background: "rgba(0,209,178,0.03)", border: "1px solid rgba(0,209,178,0.08)" }}
        >
          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: item.channel === "voice" ? "#00d1b2" : "#6366f1" }} />
          <div className="flex-1 min-w-0">
            <span className="text-xs text-white font-medium">{item.leadName || "Unknown caller"}</span>
            <span className="text-[10px] mx-2" style={{ color: "rgba(255,255,255,0.3)" }}>·</span>
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>{item.agencyName}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {item.channel === "voice" ? <Phone className="w-3 h-3" style={{ color: "#00d1b2" }} /> : <MessageSquare className="w-3 h-3" style={{ color: "#6366f1" }} />}
            <span className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>
              {new Date(item.createdAt).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function DemoSwapCard() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [current, setCurrent] = useState("Demo Agency");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await fetch(`${API}/admin/demo-swap`, { headers: { "x-admin-secret": secret() } });
      const d = await r.json();
      setCurrent(d.name);
      setName(d.name);
      setAddress(d.address ?? "");
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function save() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await fetch(`${API}/admin/demo-swap`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-secret": secret() },
        body: JSON.stringify({ name: name.trim(), address: address.trim() }),
      });
      setCurrent(name.trim());
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl p-5" style={{ background: "rgba(5,14,26,0.9)", border: "1px solid rgba(99,102,241,0.25)" }}>
      <div className="flex items-center gap-2 mb-1">
        <Phone className="w-3.5 h-3.5" style={{ color: "#6366f1" }} />
        <div className="text-xs font-mono font-bold tracking-wider" style={{ color: "#6366f1" }}>DEMO SWAP</div>
      </div>
      <div className="text-[10px] mb-3 font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>
        02 5950 6382 · currently: <span style={{ color: "#a5b4fc", fontWeight: 700 }}>{current}</span>
      </div>
      <div className="space-y-2">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Agency name for demo…"
          className="w-full px-3 py-2 text-xs rounded-lg"
          style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.25)", color: "white", outline: "none" }}
        />
        <input
          value={address}
          onChange={e => setAddress(e.target.value)}
          placeholder="Suburbs (e.g. Seven Hills, Blacktown)"
          className="w-full px-3 py-2 text-xs rounded-lg"
          style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.25)", color: "white", outline: "none" }}
        />
        <button
          onClick={save}
          disabled={saving || !name.trim()}
          className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all"
          style={{
            background: saved ? "#10b981" : "rgba(99,102,241,0.8)",
            color: "white", opacity: saving ? 0.6 : 1, cursor: saving ? "not-allowed" : "pointer"
          }}>
          {saved ? <><Check className="w-3 h-3" /> SARAH UPDATED</> : saving ? <><RefreshCw className="w-3 h-3 animate-spin" /> UPDATING…</> : "SWAP PERSONA →"}
        </button>
      </div>
    </div>
  );
}

// ─── BookOS Bridge ────────────────────────────────────────────────────────────

const BOOKOS_TIERS = ["solo", "studio", "multi"];
const BOOKOS_VERTICALS = ["salon", "trades", "wellness", "other"];

function BookosBridgeSection() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [provisioning, setProvisioning] = useState(false);
  const [provisionResult, setProvisionResult] = useState<any>(null);
  const [form, setForm] = useState({
    name: "", abn: "", address: "", calendlyUrl: "",
    bookosTier: "solo", contactEmail: "", contactPhone: "", vertical: "salon",
  });

  const loadClients = useCallback(async () => {
    try {
      const r = await fetch(`${API}/admin/bookos/clients`, { headers: { "x-admin-secret": secret() } });
      setClients(await r.json());
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadClients(); }, [loadClients]);

  function field(key: keyof typeof form, value: string) {
    setForm(f => ({ ...f, [key]: value }));
  }

  async function provision() {
    if (!form.name || !form.contactEmail) return;
    setProvisioning(true);
    setProvisionResult(null);
    try {
      const r = await fetch(`${API}/admin/bookos/provision-client`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-secret": secret() },
        body: JSON.stringify(form),
      });
      const result = await r.json();
      setProvisionResult(result);
      if (result.ok) {
        setForm({ name: "", abn: "", address: "", calendlyUrl: "", bookosTier: "solo", contactEmail: "", contactPhone: "", vertical: "salon" });
        setShowForm(false);
        void loadClients();
      }
    } finally {
      setProvisioning(false);
    }
  }

  const inputStyle = {
    background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.25)",
    color: "white", outline: "none", padding: "8px 12px", borderRadius: "8px",
    fontSize: "12px", width: "100%",
  } as const;

  const selectStyle = { ...inputStyle, cursor: "pointer" };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-bold font-mono tracking-wider" style={{ color: "#10b981" }}>BOOKOS CLIENTS</div>
          <div className="text-[10px] font-mono mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
            {clients.length} active · salon, trades, wellness
          </div>
        </div>
        <button
          onClick={() => setShowForm(f => !f)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all"
          style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.4)", color: "#10b981" }}
        >
          <Plus className="w-3 h-3" />
          CREATE CLIENT
          {showForm ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
        </button>
      </div>

      {/* Create client form */}
      {showForm && (
        <div className="rounded-xl p-5 space-y-3" style={{ background: "rgba(5,14,26,0.95)", border: "1px solid rgba(16,185,129,0.3)" }}>
          <div className="text-xs font-mono font-bold tracking-wider mb-1" style={{ color: "#10b981" }}>NEW BOOKOS CLIENT</div>

          <div className="grid grid-cols-2 gap-2">
            <input style={inputStyle} placeholder="Business name *" value={form.name} onChange={e => field("name", e.target.value)} />
            <input style={inputStyle} placeholder="ABN" value={form.abn} onChange={e => field("abn", e.target.value)} />
          </div>

          <input style={inputStyle} placeholder="Address / suburb" value={form.address} onChange={e => field("address", e.target.value)} />

          <input style={inputStyle} placeholder="Calendly URL (e.g. https://calendly.com/business/booking)" value={form.calendlyUrl} onChange={e => field("calendlyUrl", e.target.value)} />

          <div className="grid grid-cols-3 gap-2">
            <select style={selectStyle} value={form.bookosTier} onChange={e => field("bookosTier", e.target.value)}>
              {BOOKOS_TIERS.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
            <select style={selectStyle} value={form.vertical} onChange={e => field("vertical", e.target.value)}>
              {BOOKOS_VERTICALS.map(v => <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>)}
            </select>
            <input style={inputStyle} placeholder="Contact phone" value={form.contactPhone} onChange={e => field("contactPhone", e.target.value)} />
          </div>

          <input style={inputStyle} placeholder="Contact email *" value={form.contactEmail} onChange={e => field("contactEmail", e.target.value)} />

          <div className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>
            • Leave phone blank to auto-purchase a Twilio AU number (requires TWILIO_ACCOUNT_SID + TWILIO_AUTH_TOKEN)
          </div>

          {provisionResult && !provisionResult.ok && (
            <div className="text-xs p-2 rounded-lg" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}>
              {provisionResult.error ?? "Provisioning failed"}
            </div>
          )}

          {provisionResult?.ok && (
            <div className="text-xs p-3 rounded-lg space-y-1" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", color: "#6ee7b7" }}>
              <div className="font-bold">✓ {provisionResult.message}</div>
              {provisionResult.tempPassword && <div>Temp password: <span className="font-mono">{provisionResult.tempPassword}</span></div>}
              {provisionResult.twilioNumber && <div>Twilio number: <span className="font-mono">{provisionResult.twilioNumber}</span></div>}
            </div>
          )}

          <button
            onClick={provision}
            disabled={provisioning || !form.name || !form.contactEmail}
            className="w-full py-2 text-xs font-bold rounded-lg transition-all"
            style={{
              background: provisioning ? "rgba(16,185,129,0.4)" : "rgba(16,185,129,0.85)",
              color: "white", opacity: (!form.name || !form.contactEmail) ? 0.5 : 1,
              cursor: (provisioning || !form.name || !form.contactEmail) ? "not-allowed" : "pointer",
            }}
          >
            {provisioning ? "PROVISIONING…" : "PROVISION BOOKOS CLIENT →"}
          </button>
        </div>
      )}

      {/* Existing clients table */}
      <div className="rounded-xl overflow-hidden" style={{ background: "rgba(5,14,26,0.9)", border: "1px solid rgba(16,185,129,0.12)" }}>
        {loading ? (
          <div className="flex items-center justify-center h-20">
            <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(16,185,129,0.2)", borderTopColor: "#10b981" }} />
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-8 text-xs font-mono" style={{ color: "rgba(255,255,255,0.2)" }}>NO BOOKOS CLIENTS YET</div>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(16,185,129,0.12)" }}>
                {["BUSINESS", "VERTICAL", "TIER", "PHONE", "STATUS"].map(h => (
                  <th key={h} className="text-left px-4 py-2 font-mono text-[10px] tracking-wider" style={{ color: "rgba(16,185,129,0.6)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.map((c: any) => (
                <tr key={c.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td className="px-4 py-2.5 font-medium text-white">{c.name}</td>
                  <td className="px-4 py-2.5 font-mono capitalize" style={{ color: "#10b981" }}>{c.vertical}</td>
                  <td className="px-4 py-2.5 font-mono capitalize" style={{ color: "rgba(255,255,255,0.5)" }}>{c.bookosTier ?? "—"}</td>
                  <td className="px-4 py-2.5 font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>{c.contactPhone ?? "—"}</td>
                  <td className="px-4 py-2.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono" style={{
                      background: c.subscriptionStatus === "active" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)",
                      color: c.subscriptionStatus === "active" ? "#10b981" : "#f59e0b",
                    }}>{c.subscriptionStatus.toUpperCase()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default function AdminBridge() {
  const [data, setData] = useState<any>(null);
  const [activity, setActivity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showBookos, setShowBookos] = useState(false);

  async function load() {
    try {
      const [ov, ac] = await Promise.all([
        fetch(`${API}/admin/overview`, { headers: { "x-admin-secret": secret() } }).then(r => r.json()),
        fetch(`${API}/admin/activity?limit=10`, { headers: { "x-admin-secret": secret() } }).then(r => r.json()),
      ]);
      setData(ov);
      setActivity(ac);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); const iv = setInterval(load, 30000); return () => clearInterval(iv); }, []);

  if (loading) return (
    <AdminLayout title="BRIDGE OVERVIEW">
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 rounded-full animate-spin mx-auto mb-3" style={{ borderColor: "rgba(0,209,178,0.3)", borderTopColor: "#00d1b2" }} />
          <div className="text-xs font-mono" style={{ color: "rgba(0,209,178,0.6)" }}>INITIALISING SYSTEMS...</div>
        </div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout title="BRIDGE OVERVIEW">
      <div className="space-y-6">
        {/* Product toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBookos(false)}
            className="px-4 py-1.5 text-xs font-bold font-mono rounded-lg transition-all"
            style={{
              background: !showBookos ? "rgba(0,209,178,0.15)" : "transparent",
              border: `1px solid ${!showBookos ? "rgba(0,209,178,0.5)" : "rgba(255,255,255,0.1)"}`,
              color: !showBookos ? "#00d1b2" : "rgba(255,255,255,0.4)",
            }}
          >
            DIRECTIVE OS
          </button>
          <button
            onClick={() => setShowBookos(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold font-mono rounded-lg transition-all"
            style={{
              background: showBookos ? "rgba(16,185,129,0.15)" : "transparent",
              border: `1px solid ${showBookos ? "rgba(16,185,129,0.5)" : "rgba(255,255,255,0.1)"}`,
              color: showBookos ? "#10b981" : "rgba(255,255,255,0.4)",
            }}
          >
            <Scissors className="w-3 h-3" />
            BOOKOS BRIDGE
          </button>
        </div>

        {/* BookOS section */}
        {showBookos && <BookosBridgeSection />}

        {/* DOS telemetry — hidden when BookOS Bridge is active */}
        {!showBookos && (
          <>
            <div className="flex items-center gap-3">
              <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(0,209,178,0.4), transparent)" }} />
              <span className="text-[10px] font-mono font-bold tracking-widest" style={{ color: "rgba(0,209,178,0.6)" }}>
                REAL-TIME BUSINESS TELEMETRY
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#00d1b2" }} />
                <span className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>LIVE</span>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <KPIPod
                label="Monthly Recurring" icon={DollarSign} glow
                value={<AnimatedNumber value={data?.mrr || 0} prefix="$" />}
                sub="Active subscriptions"
              />
              <KPIPod
                label="Annual Run Rate" icon={TrendingUp}
                value={fmt(data?.arr || 0)}
                sub="Projected ARR"
                accent="#6366f1"
              />
              <KPIPod
                label="Active Clients" icon={Users}
                value={<AnimatedNumber value={data?.activeClients || 0} />}
                sub={`${data?.trialClients || 0} trialing · ${data?.pendingClients || 0} pending`}
                accent="#10b981"
              />
              <KPIPod
                label="Net Profit (Est.)" icon={Zap}
                value={fmt(data?.netProfitCents || 0)}
                sub="Revenue minus expenses"
                glow
                alert={(data?.netProfitCents || 0) < 0}
              />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <KPIPod
                label="New Signups (MTD)" icon={Activity}
                value={<AnimatedNumber value={data?.newSignupsThisMonth || 0} />}
                accent="#f59e0b"
              />
              <KPIPod
                label="Total AI Minutes" icon={Clock}
                value={<AnimatedNumber value={data?.totalMinutes || 0} suffix=" min" />}
                accent="#8b5cf6"
              />
              <KPIPod
                label="Total Leads Captured" icon={Users}
                value={<AnimatedNumber value={data?.totalLeads || 0} />}
                accent="#06b6d4"
              />
              <KPIPod
                label="Setup Revenue" icon={DollarSign}
                value={fmt(data?.setupRevenue || 0)}
                sub="One-time fees collected"
                accent="#10b981"
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              <div className="rounded-xl p-5" style={{ background: "rgba(5,14,26,0.9)", border: "1px solid rgba(0,209,178,0.12)" }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xs font-mono font-bold tracking-wider" style={{ color: "#00d1b2" }}>INTELLIGENCE FEED</div>
                    <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>Recent AI activity across all agencies</div>
                  </div>
                  <Activity className="w-4 h-4" style={{ color: "rgba(0,209,178,0.4)" }} />
                </div>
                {activity?.transcripts?.length > 0
                  ? <ActivityFeed items={activity.transcripts} />
                  : <div className="text-center py-8 text-xs font-mono" style={{ color: "rgba(255,255,255,0.2)" }}>NO ACTIVITY LOGGED YET</div>
                }
              </div>

              <div className="space-y-3">
                <div className="rounded-xl p-5" style={{ background: "rgba(5,14,26,0.9)", border: "1px solid rgba(0,209,178,0.12)" }}>
                  <div className="text-xs font-mono font-bold tracking-wider mb-3" style={{ color: "#00d1b2" }}>FLEET STATUS</div>
                  <div className="space-y-2">
                    {[
                      { label: "ACTIVE", value: data?.activeClients || 0, color: "#10b981" },
                      { label: "TRIALING", value: data?.trialClients || 0, color: "#f59e0b" },
                      { label: "PENDING", value: data?.pendingClients || 0, color: "#6366f1" },
                      { label: "CHURNED", value: data?.churnedClients || 0, color: "#ef4444" },
                    ].map(s => (
                      <div key={s.label} className="flex items-center gap-3">
                        <div className="w-16 text-[10px] font-mono font-bold" style={{ color: s.color }}>{s.label}</div>
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${Math.min((s.value / Math.max(data?.activeClients + data?.trialClients + data?.pendingClients + data?.churnedClients, 1)) * 100, 100)}%`, background: s.color }} />
                        </div>
                        <div className="w-6 text-right text-xs font-mono font-bold text-white">{s.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <DemoSwapCard />

                <div className="rounded-xl p-5" style={{ background: "rgba(5,14,26,0.9)", border: "1px solid rgba(0,209,178,0.12)" }}>
                  <div className="text-xs font-mono font-bold tracking-wider mb-3" style={{ color: "#00d1b2" }}>AI SYSTEM PERFORMANCE</div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "VOICE CALLS", value: activity?.stats?.totalCalls || 0 },
                      { label: "CHAT SESSIONS", value: activity?.stats?.totalChats || 0 },
                      { label: "LEADS TOTAL", value: data?.totalLeads || 0 },
                      { label: "COMMS LOGS", value: data?.totalTranscripts || 0 },
                    ].map(s => (
                      <div key={s.label} className="text-center p-2 rounded-lg" style={{ background: "rgba(0,209,178,0.04)", border: "1px solid rgba(0,209,178,0.1)" }}>
                        <div className="text-lg font-bold font-mono text-white">{s.value.toLocaleString()}</div>
                        <div className="text-[9px] font-mono tracking-wider" style={{ color: "rgba(0,209,178,0.5)" }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
