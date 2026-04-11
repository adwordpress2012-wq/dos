import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Phone, MessageSquare, Radio, Search, Clock, User } from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL ?? "/api";
const secret = () => sessionStorage.getItem("adminSecret") || "";

function ChannelBadge({ channel }: { channel: string }) {
  const isVoice = channel === "voice";
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold"
      style={{
        background: isVoice ? "rgba(0,209,178,0.1)" : "rgba(99,102,241,0.1)",
        color: isVoice ? "#00d1b2" : "#818cf8",
        border: `1px solid ${isVoice ? "rgba(0,209,178,0.25)" : "rgba(99,102,241,0.25)"}`,
      }}
    >
      {isVoice ? <Phone className="w-2.5 h-2.5" /> : <MessageSquare className="w-2.5 h-2.5" />}
      {isVoice ? "VOICE" : "CHAT"}
    </span>
  );
}

export default function AdminActivity() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  async function load() {
    const res = await fetch(`${API}/admin/activity?limit=100`, { headers: { "x-admin-secret": secret() } });
    setData(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); const iv = setInterval(load, 20000); return () => clearInterval(iv); }, []);

  const items = (data?.transcripts || []).filter((t: any) => {
    const matchSearch = !search || t.leadName?.toLowerCase().includes(search.toLowerCase()) || t.agencyName?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || t.channel === filter;
    return matchSearch && matchFilter;
  });

  return (
    <AdminLayout title="INTEL FEED">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-mono font-bold tracking-wider mb-1" style={{ color: "rgba(0,209,178,0.6)" }}>
              AI ACTIVITY MONITOR · ALL AGENCIES
            </div>
            <div className="flex items-center gap-4 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              <span>📞 <span className="font-bold text-white">{data?.stats?.totalCalls || 0}</span> calls</span>
              <span>💬 <span className="font-bold text-white">{data?.stats?.totalChats || 0}</span> chats</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: "rgba(0,209,178,0.06)", border: "1px solid rgba(0,209,178,0.15)" }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#00d1b2" }} />
            <span className="text-[10px] font-mono" style={{ color: "#00d1b2" }}>AUTO-REFRESH 20s</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "rgba(0,209,178,0.5)" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or agency..."
              className="w-full pl-9 pr-4 py-2 text-xs font-mono rounded-lg outline-none"
              style={{ background: "rgba(0,209,178,0.05)", border: "1px solid rgba(0,209,178,0.15)", color: "white" }}
            />
          </div>
          {["all", "voice", "chat"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-2 text-[10px] font-mono font-bold rounded-lg tracking-wider transition-all"
              style={{
                background: filter === f ? "rgba(0,209,178,0.15)" : "rgba(0,209,178,0.04)",
                border: `1px solid ${filter === f ? "rgba(0,209,178,0.4)" : "rgba(0,209,178,0.1)"}`,
                color: filter === f ? "#00d1b2" : "rgba(255,255,255,0.4)",
              }}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(0,209,178,0.12)" }}>
          <div
            className="grid text-[10px] font-mono font-bold tracking-wider px-4 py-2.5"
            style={{
              gridTemplateColumns: "120px 1fr 1fr 80px 80px 140px",
              background: "rgba(0,209,178,0.06)",
              color: "rgba(0,209,178,0.6)",
              borderBottom: "1px solid rgba(0,209,178,0.1)",
            }}
          >
            <div>CHANNEL</div>
            <div>CALLER / USER</div>
            <div>AGENCY</div>
            <div>DURATION</div>
            <div>SUMMARY</div>
            <div>TIMESTAMP</div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-xs font-mono" style={{ color: "rgba(0,209,178,0.4)", background: "rgba(5,14,26,0.9)" }}>
              <div className="w-5 h-5 border-2 rounded-full animate-spin mx-auto mb-2" style={{ borderColor: "rgba(0,209,178,0.2)", borderTopColor: "#00d1b2" }} />
              SCANNING COMMUNICATIONS...
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12" style={{ background: "rgba(5,14,26,0.9)" }}>
              <Radio className="w-8 h-8 mx-auto mb-2" style={{ color: "rgba(0,209,178,0.2)" }} />
              <div className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>NO COMMUNICATIONS LOGGED YET</div>
            </div>
          ) : (
            items.map((t: any, i: number) => (
              <div
                key={t.id}
                className="grid items-center px-4 py-3 hover:bg-white/[0.02] transition-colors"
                style={{
                  gridTemplateColumns: "120px 1fr 1fr 80px 80px 140px",
                  background: i % 2 === 0 ? "rgba(5,14,26,0.9)" : "rgba(4,9,18,0.95)",
                  borderBottom: "1px solid rgba(0,209,178,0.04)",
                }}
              >
                <div><ChannelBadge channel={t.channel} /></div>
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 shrink-0" style={{ color: "rgba(0,209,178,0.3)" }} />
                  <span className="text-xs text-white truncate">{t.leadName || "Unknown"}</span>
                </div>
                <div className="text-xs truncate" style={{ color: "rgba(255,255,255,0.6)" }}>{t.agencyName}</div>
                <div className="flex items-center gap-1 text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>
                  <Clock className="w-3 h-3" />
                  {t.duration ? `${t.duration}s` : "—"}
                </div>
                <div className="text-[10px] truncate" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {t.summary ? t.summary.slice(0, 40) + "..." : "—"}
                </div>
                <div className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {new Date(t.createdAt).toLocaleString("en-AU", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
