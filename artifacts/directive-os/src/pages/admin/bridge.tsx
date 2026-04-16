import { useState, useEffect, useRef, useCallback } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  TrendingUp, Users, DollarSign, Activity, Zap, Phone, MessageSquare,
  Clock, AlertTriangle, ChevronRight, ArrowUpRight, RefreshCw, Check,
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

export default function AdminBridge() {
  const [data, setData] = useState<any>(null);
  const [activity, setActivity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
        {/* Section header */}
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

        {/* Top KPI grid */}
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

        {/* Secondary KPIs */}
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
          {/* Activity feed */}
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

          {/* Status panels */}
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
      </div>
    </AdminLayout>
  );
}
