import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Download, Search, Users, CheckCircle, AlertCircle, Clock, XCircle, KeyRound, RotateCcw } from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL ?? "/api";
const secret = () => sessionStorage.getItem("adminSecret") || "";

function fmt(cents: number) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", minimumFractionDigits: 0 }).format(cents / 100);
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  active: { label: "ACTIVE", color: "#10b981", icon: CheckCircle },
  trialing: { label: "TRIAL", color: "#f59e0b", icon: Clock },
  pending: { label: "PENDING", color: "#6366f1", icon: AlertCircle },
  cancelled: { label: "CHURNED", color: "#ef4444", icon: XCircle },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold"
      style={{ background: `${cfg.color}15`, color: cfg.color, border: `1px solid ${cfg.color}30` }}
    >
      <Icon className="w-2.5 h-2.5" />
      {cfg.label}
    </span>
  );
}

export default function AdminClients() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [resetting, setResetting] = useState<number | null>(null);
  const [resetMsg, setResetMsg] = useState<{ id: number; msg: string } | null>(null);

  async function resetPassword(clientId: number, email: string) {
    if (!confirm(`Reset password for ${email}? A new password will be emailed to them.`)) return;
    setResetting(clientId);
    setResetMsg(null);
    try {
      const res = await fetch(`${API}/admin/clients/${clientId}/reset-password`, {
        method: "POST",
        headers: { "x-admin-secret": secret() },
      });
      const data = await res.json();
      setResetMsg({ id: clientId, msg: data.ok ? "Password emailed ✓" : (data.error || "Failed") });
    } catch {
      setResetMsg({ id: clientId, msg: "Error — try again" });
    } finally {
      setResetting(null);
      setTimeout(() => setResetMsg(null), 4000);
    }
  }

  useEffect(() => {
    fetch(`${API}/admin/clients`, { headers: { "x-admin-secret": secret() } })
      .then(async r => {
        const data = await r.json();
        if (!r.ok) {
          setFetchError(r.status === 401 ? "Session expired — please log in again." : `Error ${r.status}`);
          return;
        }
        setClients(Array.isArray(data) ? data : []);
      })
      .catch(() => setFetchError("Could not reach server — check your connection."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = clients
    .filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.contactEmail?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "revenue") return b.monthlyRevenueCents - a.monthlyRevenueCents;
      if (sortBy === "leads") return b.leadCount - a.leadCount;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  function exportCsv() {
    window.open(`${API}/admin/clients/export-csv`, "_blank");
  }

  const totalMRR = clients.filter(c => c.subscriptionStatus === "active").length * 29900;

  return (
    <AdminLayout title="FLEET MANIFEST">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-mono font-bold tracking-wider mb-1" style={{ color: "rgba(0,209,178,0.6)" }}>
              REGISTERED AGENCIES · {clients.length} TOTAL
            </div>
            <div className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              Combined MRR: <span className="font-bold text-white">{fmt(totalMRR)}</span>
            </div>
          </div>
          <button
            onClick={exportCsv}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold tracking-wider transition-all hover:opacity-80"
            style={{ background: "rgba(0,209,178,0.1)", border: "1px solid rgba(0,209,178,0.3)", color: "#00d1b2" }}
          >
            <Download className="w-3.5 h-3.5" />
            EXPORT CSV
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "rgba(0,209,178,0.5)" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search agencies..."
              className="w-full pl-9 pr-4 py-2 text-xs font-mono rounded-lg outline-none"
              style={{ background: "rgba(0,209,178,0.05)", border: "1px solid rgba(0,209,178,0.15)", color: "white" }}
            />
          </div>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-3 py-2 text-xs font-mono rounded-lg outline-none"
            style={{ background: "rgba(0,209,178,0.05)", border: "1px solid rgba(0,209,178,0.15)", color: "rgba(255,255,255,0.7)" }}
          >
            <option value="createdAt">Newest first</option>
            <option value="revenue">Highest revenue</option>
            <option value="leads">Most leads</option>
          </select>
        </div>

        {/* Table */}
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(0,209,178,0.12)" }}>
          <div
            className="grid text-[10px] font-mono font-bold tracking-wider px-4 py-2.5"
            style={{
              gridTemplateColumns: "1fr 1fr 80px 80px 80px 80px 90px 110px",
              background: "rgba(0,209,178,0.06)",
              color: "rgba(0,209,178,0.6)",
              borderBottom: "1px solid rgba(0,209,178,0.1)",
            }}
          >
            <div>AGENCY</div>
            <div>CONTACT</div>
            <div>STATUS</div>
            <div>MRR</div>
            <div>LEADS</div>
            <div>MINUTES</div>
            <div>JOINED</div>
            <div>DASHBOARD</div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-xs font-mono" style={{ color: "rgba(0,209,178,0.4)", background: "rgba(5,14,26,0.9)" }}>
              SCANNING FLEET...
            </div>
          ) : fetchError ? (
            <div className="text-center py-12" style={{ background: "rgba(5,14,26,0.9)" }}>
              <AlertCircle className="w-8 h-8 mx-auto mb-2" style={{ color: "#ef4444" }} />
              <div className="text-xs font-mono mb-3" style={{ color: "#ef4444" }}>{fetchError}</div>
              <button
                onClick={() => window.location.href = "/admin/login"}
                className="px-4 py-2 rounded-lg text-xs font-bold tracking-wider"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444" }}
              >
                GO TO LOGIN
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12" style={{ background: "rgba(5,14,26,0.9)" }}>
              <Users className="w-8 h-8 mx-auto mb-2" style={{ color: "rgba(0,209,178,0.2)" }} />
              <div className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>NO AGENCIES FOUND</div>
            </div>
          ) : (
            filtered.map((c, i) => (
              <div
                key={c.id}
                className="grid items-center px-4 py-3 transition-colors hover:bg-white/[0.02]"
                style={{
                  gridTemplateColumns: "1fr 1fr 80px 80px 80px 80px 90px 110px",
                  background: i % 2 === 0 ? "rgba(5,14,26,0.9)" : "rgba(4,9,18,0.95)",
                  borderBottom: "1px solid rgba(0,209,178,0.05)",
                }}
              >
                <div>
                  <div className="text-xs font-semibold text-white truncate">{c.name}</div>
                  <div className="text-[10px] font-mono truncate" style={{ color: "rgba(255,255,255,0.3)" }}>ABN {c.abn}</div>
                </div>
                <div>
                  <div className="text-[11px] text-white/70 truncate">{c.contactEmail}</div>
                  <div className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>{c.contactPhone || "—"}</div>
                </div>
                <div><StatusBadge status={c.subscriptionStatus} /></div>
                <div className="text-xs font-mono font-bold" style={{ color: c.monthlyRevenueCents > 0 ? "#10b981" : "rgba(255,255,255,0.3)" }}>
                  {c.monthlyRevenueCents > 0 ? fmt(c.monthlyRevenueCents) : "—"}
                </div>
                <div className="text-xs font-mono text-white">{c.leadCount.toLocaleString()}</div>
                <div className="text-xs font-mono text-white">{c.aiMinutesUsed}<span className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>/{c.aiMinutesIncluded}</span></div>
                <div className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {new Date(c.createdAt).toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "2-digit" })}
                </div>
                <div>
                  {resetMsg?.id === c.id ? (
                    <span className="text-[10px] font-mono" style={{ color: resetMsg.msg.includes("✓") ? "#10b981" : "#ef4444" }}>
                      {resetMsg.msg}
                    </span>
                  ) : (
                    <button
                      onClick={() => resetPassword(c.id, c.contactEmail)}
                      disabled={resetting === c.id}
                      className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono font-bold transition-all disabled:opacity-50"
                      style={{ background: "rgba(0,209,178,0.08)", border: "1px solid rgba(0,209,178,0.2)", color: "#00d1b2" }}
                      title="Reset password and email to client"
                    >
                      {resetting === c.id ? <RotateCcw className="w-3 h-3 animate-spin" /> : <KeyRound className="w-3 h-3" />}
                      {resetting === c.id ? "..." : "Reset PW"}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
