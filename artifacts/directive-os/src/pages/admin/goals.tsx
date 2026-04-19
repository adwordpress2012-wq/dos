import { useState, useEffect, useRef } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Target, TrendingUp, Users, DollarSign, Zap, ChevronRight } from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL ?? "/api";
const secret = () => localStorage.getItem("adminSecret") || "";

function aud(cents: number) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", minimumFractionDigits: 0 }).format(cents / 100);
}

function AnimatedBar({ pct, color }: { pct: number; color: string }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 100);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <div className="w-full rounded-full h-3 overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${width}%`, background: color }}
      />
    </div>
  );
}

function CountUp({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef(0);
  useEffect(() => {
    ref.current = 0;
    const steps = 50;
    let step = 0;
    const iv = setInterval(() => {
      step++;
      ref.current = Math.round((target * step) / steps);
      setVal(ref.current);
      if (step >= steps) clearInterval(iv);
    }, 20);
    return () => clearInterval(iv);
  }, [target]);
  return <span>{prefix}{val.toLocaleString()}{suffix}</span>;
}

function MonthLabel(month: string) {
  const [y, m] = month.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleDateString("en-AU", { month: "short" }).toUpperCase();
}

export default function AdminGoals() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/admin/goals`, { headers: { "x-admin-secret": secret() } })
      .then(r => r.json())
      .then(d => { if (d && typeof d.goalCents === "number") setData(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const maxCloses = data ? Math.max(1, ...data.monthlyCloses.map((m: any) => m.count)) : 1;

  const MILESTONES = [
    { label: "Month 6", clients: 21, revenue: 5673600, mrr: 627900 },
    { label: "Month 9", clients: 36, revenue: 12000000, mrr: 1076400 },
    { label: "Month 12", clients: 53, revenue: 20000000, mrr: 1584700 },
  ];

  return (
    <AdminLayout title="MISSION TARGET">
      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="text-xs font-mono font-bold tracking-wider mb-1" style={{ color: "rgba(0,209,178,0.6)" }}>
              12-MONTH REVENUE GOAL
            </div>
            <div className="text-2xl font-bold text-white">$200,000 AUD</div>
          </div>
          {data && (
            <div className="text-right">
              <div className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>AVG CLOSES/MONTH</div>
              <div className="text-xl font-bold" style={{ color: "#00d1b2" }}>{data.avgClosesPerMonth}</div>
            </div>
          )}
        </div>

        {/* Main progress bar */}
        <div className="rounded-xl p-5" style={{ background: "rgba(0,209,178,0.04)", border: "1px solid rgba(0,209,178,0.15)" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" style={{ color: "#00d1b2" }} />
              <span className="text-xs font-mono font-bold tracking-wider" style={{ color: "rgba(0,209,178,0.8)" }}>
                TOTAL REVENUE PROGRESS
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-white">
                {loading ? "—" : aud(data?.totalRevenueCents ?? 0)}
                <span className="text-xs font-mono ml-1" style={{ color: "rgba(255,255,255,0.4)" }}>/ $200,000</span>
              </div>
              <div className="text-[10px] font-mono" style={{ color: "rgba(0,209,178,0.6)" }}>
                {loading ? "" : `${data?.progressPct ?? 0}% COMPLETE`}
              </div>
            </div>
          </div>
          <AnimatedBar pct={data?.progressPct ?? 0} color="linear-gradient(90deg, #00d1b2, #10b981)" />
          <div className="flex justify-between mt-2">
            <span className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.25)" }}>$0</span>
            <span className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.25)" }}>$100k</span>
            <span className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.25)" }}>$200k</span>
          </div>
        </div>

        {/* KPI Cards */}
        {loading ? (
          <div className="text-center py-8 text-xs font-mono" style={{ color: "rgba(0,209,178,0.4)" }}>LOADING MISSION DATA...</div>
        ) : data && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: DollarSign, label: "CURRENT MRR", value: aud(data.currentMRRCents), sub: `target ${aud(data.mrrTargetCents)}`, pct: data.mrrProgressPct, color: "#00d1b2" },
                { icon: Users, label: "ACTIVE CLIENTS", value: data.activeClients, sub: `target ${data.clientTarget}`, pct: data.clientProgressPct, color: "#10b981" },
                { icon: TrendingUp, label: "PROJECTED YEAR", value: aud(data.projectedYearEndCents), sub: "at current rate", pct: null, color: "#6366f1" },
                { icon: Zap, label: "GOAL PROGRESS", value: `${data.progressPct}%`, sub: `${aud(20000000 - data.totalRevenueCents)} to go`, pct: data.progressPct, color: "#f59e0b" },
              ].map(({ icon: Icon, label, value, sub, pct, color }) => (
                <div key={label} className="rounded-xl p-4" style={{ background: "rgba(5,14,26,0.9)", border: "1px solid rgba(0,209,178,0.1)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-3.5 h-3.5" style={{ color }} />
                    <span className="text-[10px] font-mono tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</span>
                  </div>
                  <div className="text-lg font-bold text-white mb-1">{value}</div>
                  <div className="text-[10px] font-mono mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>{sub}</div>
                  {pct !== null && <AnimatedBar pct={pct} color={color} />}
                </div>
              ))}
            </div>

            {/* Monthly closes bar chart */}
            <div className="rounded-xl p-5" style={{ background: "rgba(5,14,26,0.9)", border: "1px solid rgba(0,209,178,0.1)" }}>
              <div className="text-xs font-mono font-bold tracking-wider mb-4" style={{ color: "rgba(0,209,178,0.6)" }}>
                MONTHLY CLOSES — LAST 12 MONTHS
              </div>
              <div className="flex items-end gap-1.5 h-24">
                {data.monthlyCloses.map((m: any) => {
                  const heightPct = (m.count / maxCloses) * 100;
                  const isThisMonth = m.month === `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
                  return (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                      <div className="text-[9px] font-mono font-bold" style={{ color: m.count > 0 ? "#00d1b2" : "rgba(255,255,255,0.2)" }}>
                        {m.count > 0 ? m.count : ""}
                      </div>
                      <div className="w-full rounded-t-sm transition-all duration-700" style={{
                        height: `${Math.max(4, heightPct * 0.8)}px`,
                        background: isThisMonth
                          ? "linear-gradient(180deg, #f59e0b, #d97706)"
                          : m.count > 0
                            ? "linear-gradient(180deg, #00d1b2, #059669)"
                            : "rgba(255,255,255,0.06)",
                        minHeight: "4px",
                      }} />
                      <div className="text-[8px] font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>
                        {MonthLabel(m.month)}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 flex items-center gap-4 text-[9px] font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>
                <span><span className="inline-block w-2 h-2 rounded-sm mr-1" style={{ background: "#00d1b2" }} />CLOSE</span>
                <span><span className="inline-block w-2 h-2 rounded-sm mr-1" style={{ background: "#f59e0b" }} />THIS MONTH</span>
              </div>
            </div>

            {/* Milestones */}
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(0,209,178,0.1)" }}>
              <div className="px-4 py-2.5 text-[10px] font-mono font-bold tracking-wider" style={{ background: "rgba(0,209,178,0.06)", color: "rgba(0,209,178,0.6)", borderBottom: "1px solid rgba(0,209,178,0.1)" }}>
                MILESTONES
              </div>
              {MILESTONES.map((ms, i) => {
                const reached = data.totalRevenueCents >= ms.revenue;
                const inProgress = !reached && (i === 0 || data.totalRevenueCents >= MILESTONES[i - 1].revenue);
                return (
                  <div key={ms.label} className="flex items-center gap-4 px-4 py-3" style={{ background: i % 2 === 0 ? "rgba(5,14,26,0.9)" : "rgba(4,9,18,0.95)", borderBottom: i < MILESTONES.length - 1 ? "1px solid rgba(0,209,178,0.05)" : undefined }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: reached ? "rgba(16,185,129,0.2)" : inProgress ? "rgba(0,209,178,0.1)" : "rgba(255,255,255,0.05)", border: `1px solid ${reached ? "#10b981" : inProgress ? "#00d1b2" : "rgba(255,255,255,0.1)"}` }}>
                      {reached ? (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      ) : (
                        <ChevronRight className="w-2.5 h-2.5" style={{ color: inProgress ? "#00d1b2" : "rgba(255,255,255,0.2)" }} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold" style={{ color: reached ? "#10b981" : inProgress ? "#ffffff" : "rgba(255,255,255,0.4)" }}>{ms.label}</span>
                        {inProgress && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: "rgba(0,209,178,0.1)", color: "#00d1b2", border: "1px solid rgba(0,209,178,0.2)" }}>IN PROGRESS</span>}
                        {reached && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)" }}>REACHED</span>}
                      </div>
                      <div className="text-[10px] font-mono mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                        {ms.clients} clients · {aud(ms.mrr)}/mo MRR · {aud(ms.revenue)} total
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Weekly targets */}
            <div className="rounded-xl p-5" style={{ background: "rgba(5,14,26,0.9)", border: "1px solid rgba(0,209,178,0.1)" }}>
              <div className="text-xs font-mono font-bold tracking-wider mb-4" style={{ color: "rgba(0,209,178,0.6)" }}>WEEKLY ACTIVITY TARGETS</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "OUTREACH CALLS", value: "20", unit: "agencies" },
                  { label: "DEMOS BOOKED", value: "4-5", unit: "per week" },
                  { label: "CLOSES TARGET", value: "1-2", unit: "per week" },
                  { label: "CLIENT CHECK-INS", value: "ALL", unit: "active clients" },
                ].map(({ label, value, unit }) => (
                  <div key={label} className="text-center rounded-lg p-3" style={{ background: "rgba(0,209,178,0.04)", border: "1px solid rgba(0,209,178,0.08)" }}>
                    <div className="text-[9px] font-mono tracking-wider mb-1" style={{ color: "rgba(0,209,178,0.5)" }}>{label}</div>
                    <div className="text-xl font-bold text-white">{value}</div>
                    <div className="text-[9px] font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>{unit}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Business value callout */}
            <div className="rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3" style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)" }}>
              <div className="flex-1">
                <div className="text-[10px] font-mono tracking-wider mb-1" style={{ color: "rgba(99,102,241,0.7)" }}>BUSINESS VALUE AT GOAL</div>
                <div className="text-sm text-white">At $200k revenue · $15.8k MRR → <strong style={{ color: "#6366f1" }}>$380k–$570k business value</strong> at 2–3× ARR multiple</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-[10px] font-mono" style={{ color: "rgba(99,102,241,0.6)" }}>PROJECTED ARR</div>
                <div className="text-lg font-bold" style={{ color: "#6366f1" }}>$190,164</div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
