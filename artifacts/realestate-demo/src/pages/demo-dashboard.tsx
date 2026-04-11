import { useState } from "react";
import {
  Users, Phone, MessageSquare, FileText, TrendingUp, Flame,
  Clock, Building2, BarChart3, ChevronRight, ArrowUpRight,
  Activity, Star, Download, X,
} from "lucide-react";

const BASE = `${import.meta.env.BASE_URL}`.replace(/\/$/, "");

const MOCK_LEADS = [
  { id: 1, name: "Jason Ojumpo", type: "buyer", phone: "0412 938 477", channel: "voice", hot: true, time: "11:42 PM", status: "Callback booked 11AM" },
  { id: 2, name: "Sarah Chen", type: "buyer", phone: "0421 555 890", channel: "chat", hot: false, time: "9:18 PM", status: "Inspection requested" },
  { id: 3, name: "Marcus Webb", type: "vendor", phone: "0403 211 674", channel: "voice", hot: true, time: "8:55 PM", status: "Appraisal booked" },
  { id: 4, name: "Lisa Nguyen", type: "tenant", phone: "0435 887 220", channel: "chat", hot: false, time: "7:30 PM", status: "Form requested" },
  { id: 5, name: "David Park", type: "buyer", phone: "0418 332 991", channel: "voice", hot: false, time: "6:12 PM", status: "Enquiry logged" },
];

const MOCK_TRANSCRIPTS = [
  { id: 1, name: "Jason Ojumpo", type: "voice", duration: "4m 12s", summary: "Buyer interested in Penrith property, $1.5M budget. Callback booked for 11AM." },
  { id: 2, name: "Sarah Chen", type: "chat", duration: "—", summary: "First home buyer, looking in Castle Hill area, 3 bed budget $900k." },
  { id: 3, name: "Marcus Webb", type: "voice", duration: "2m 48s", summary: "Vendor wants to appraise 4-bedroom property in Baulkham Hills. Meeting scheduled." },
];

function StatPod({ label, value, icon: Icon, color = "#00d1b2", sub }: { label: string; value: string | number; icon: React.ElementType; color?: string; sub?: string }) {
  return (
    <div className="rounded-xl p-4 relative overflow-hidden" style={{ background: "rgba(15,22,35,0.95)", border: `1px solid ${color}20` }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}40, transparent)` }} />
      <div className="flex items-start justify-between mb-2">
        <div className="p-1.5 rounded-lg" style={{ background: `${color}12` }}>
          <Icon className="w-3.5 h-3.5" style={{ color }} />
        </div>
        <ArrowUpRight className="w-3 h-3" style={{ color: `${color}30` }} />
      </div>
      <div className="text-2xl font-bold text-white font-mono">{value}</div>
      <div className="text-[10px] font-bold tracking-wider uppercase mt-0.5" style={{ color: `${color}70` }}>{label}</div>
      {sub && <div className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>{sub}</div>}
    </div>
  );
}

function LeadRow({ lead }: { lead: typeof MOCK_LEADS[0] }) {
  const typeColor: Record<string, string> = { buyer: "#6366f1", tenant: "#10b981", vendor: "#f59e0b", landlord: "#8b5cf6" };
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b last:border-0" style={{ borderColor: "rgba(201,168,76,0.08)" }}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">{lead.name}</span>
          {lead.hot && <Flame className="w-3.5 h-3.5 text-orange-400" />}
        </div>
        <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{lead.status}</div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] px-1.5 py-0.5 rounded font-medium capitalize" style={{ background: `${typeColor[lead.type]}15`, color: typeColor[lead.type], border: `1px solid ${typeColor[lead.type]}25` }}>{lead.type}</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: lead.channel === "voice" ? "rgba(0,209,178,0.1)" : "rgba(99,102,241,0.1)", color: lead.channel === "voice" ? "#00d1b2" : "#818cf8" }}>
          {lead.channel === "voice" ? "📞" : "💬"} {lead.channel}
        </span>
        <span className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>{lead.time}</span>
      </div>
    </div>
  );
}

export default function DemoDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "leads" | "transcripts">("overview");
  const [showCTA, setShowCTA] = useState(true);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "leads", label: "Lead Inbox" },
    { id: "transcripts", label: "Comm Logs" },
  ] as const;

  return (
    <div className="min-h-screen" style={{ background: "#0a0f1c" }}>
      {/* CTA Banner */}
      {showCTA && (
        <div className="fixed bottom-0 left-0 right-0 z-50 py-3 px-4 flex items-center justify-between" style={{ background: "linear-gradient(90deg, #0a1628, #0f2040)", borderTop: "1px solid rgba(201,168,76,0.3)" }}>
          <div>
            <div className="text-xs font-bold text-white">This is YOUR Command Bridge — if you join Directive OS</div>
            <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.5)" }}>Every agency gets this dashboard + Sarah AI Receptionist from $299/month.</div>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-4">
            <a href="https://calendly.com/adwordpress2012/directive-os-agency-onboarding" target="_blank" rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap" style={{ background: "#C9A84C", color: "#0a0f1c" }}>
              Book a Call
            </a>
            <button onClick={() => setShowCTA(false)} className="p-1" style={{ color: "rgba(255,255,255,0.4)" }}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Sidebar + main layout */}
      <div className="flex min-h-screen pb-16">
        {/* Sidebar */}
        <div className="hidden md:flex flex-col w-52 shrink-0 border-r" style={{ background: "#060c18", borderColor: "rgba(201,168,76,0.12)" }}>
          {/* Logo */}
          <div className="px-4 py-5 border-b" style={{ borderColor: "rgba(201,168,76,0.12)" }}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded flex items-center justify-center font-serif font-bold text-sm" style={{ background: "#C9A84C", color: "#0a0f1c" }}>M</div>
              <div>
                <div className="text-xs font-bold text-white">MERIDIAN</div>
                <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>PROPERTY GROUP</div>
              </div>
            </div>
            <div className="mt-2 px-2 py-1 rounded text-[9px] font-bold text-center tracking-wider" style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", color: "#C9A84C" }}>
              ⚡ DEMO MODE
            </div>
          </div>
          {/* Nav */}
          <nav className="flex-1 px-3 py-3 space-y-1">
            {[
              { id: "overview", label: "Command Centre", icon: Activity },
              { id: "leads", label: "Lead Inbox", icon: Users },
              { id: "transcripts", label: "Comm Logs", icon: FileText },
            ].map(item => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all"
                  style={{
                    background: active ? "rgba(201,168,76,0.1)" : "transparent",
                    border: active ? "1px solid rgba(201,168,76,0.2)" : "1px solid transparent",
                    color: active ? "#C9A84C" : "rgba(255,255,255,0.4)",
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{item.label}</span>
                  {active && <ChevronRight className="w-3 h-3 ml-auto" />}
                </button>
              );
            })}
          </nav>
          <div className="px-4 py-3 border-t text-[10px]" style={{ borderColor: "rgba(201,168,76,0.1)", color: "rgba(255,255,255,0.2)" }}>
            Powered by <span style={{ color: "#00d1b2" }}>Directive OS</span>
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <div className="h-12 flex items-center justify-between px-4 border-b shrink-0" style={{ background: "#060c18", borderColor: "rgba(201,168,76,0.1)" }}>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-white">Command Bridge</span>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold" style={{ background: "rgba(201,168,76,0.1)", color: "#C9A84C" }}>DEMO</span>
            </div>
            {/* Mobile tabs */}
            <div className="flex md:hidden gap-1">
              {tabs.map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)} className="px-2 py-1 text-[10px] rounded" style={{ background: activeTab === t.id ? "#C9A84C" : "rgba(255,255,255,0.05)", color: activeTab === t.id ? "#0a0f1c" : "rgba(255,255,255,0.5)" }}>
                  {t.label}
                </button>
              ))}
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>Sarah AI: Online</span>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4 md:p-6">
            {activeTab === "overview" && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-white mb-0.5">Good evening, Meridian</h2>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                    Sarah captured <span className="text-white font-semibold">5 leads</span> tonight while your team was offline.
                  </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <StatPod label="Leads This Month" value={23} icon={Users} sub="+5 last night" />
                  <StatPod label="Hot Leads" value={2} icon={Flame} color="#f59e0b" sub="Immediate follow-up" />
                  <StatPod label="AI Calls Handled" value={18} icon={Phone} color="#6366f1" sub="After hours" />
                  <StatPod label="Est. Value Captured" value="$2.3M" icon={TrendingUp} color="#10b981" sub="In enquiry pipeline" />
                </div>

                {/* Recent leads */}
                <div className="rounded-xl overflow-hidden" style={{ background: "rgba(15,22,35,0.95)", border: "1px solid rgba(201,168,76,0.12)" }}>
                  <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: "rgba(201,168,76,0.08)" }}>
                    <span className="text-xs font-bold text-white">Recent Leads — Last 12 Hours</span>
                    <Star className="w-3.5 h-3.5" style={{ color: "#C9A84C" }} />
                  </div>
                  {MOCK_LEADS.slice(0, 3).map(lead => <LeadRow key={lead.id} lead={lead} />)}
                </div>

                {/* AI activity */}
                <div className="rounded-xl p-4" style={{ background: "rgba(15,22,35,0.95)", border: "1px solid rgba(201,168,76,0.12)" }}>
                  <div className="text-xs font-bold text-white mb-3">Sarah's Activity Tonight</div>
                  <div className="space-y-2">
                    {[
                      { icon: Phone, text: "Answered call from Jason Ojumpo at 11:42 PM", color: "#00d1b2" },
                      { icon: MessageSquare, text: "Captured buyer details — Sarah Chen, Castle Hill", color: "#6366f1" },
                      { icon: FileText, text: "Sent transcript email to you at 11:47 PM", color: "#C9A84C" },
                      { icon: Building2, text: "Synced 3 new listings from VaultRE", color: "#10b981" },
                    ].map((item, i) => {
                      const Icon = item.icon;
                      return (
                        <div key={i} className="flex items-center gap-3 text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                          <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: item.color }} />
                          {item.text}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "leads" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-white">Lead Inbox</h2>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>All contacts captured by Sarah</p>
                  </div>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)", color: "#C9A84C" }}>
                    <Download className="w-3.5 h-3.5" /> Export CSV
                  </button>
                </div>
                <div className="rounded-xl overflow-hidden" style={{ background: "rgba(15,22,35,0.95)", border: "1px solid rgba(201,168,76,0.12)" }}>
                  {MOCK_LEADS.map(lead => <LeadRow key={lead.id} lead={lead} />)}
                </div>
              </div>
            )}

            {activeTab === "transcripts" && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-bold text-white">Communication Logs</h2>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Full records of every call and chat Sarah handled</p>
                </div>
                <div className="space-y-3">
                  {MOCK_TRANSCRIPTS.map(t => (
                    <div key={t.id} className="rounded-xl p-4" style={{ background: "rgba(15,22,35,0.95)", border: "1px solid rgba(201,168,76,0.1)" }}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="text-sm font-semibold text-white">{t.name}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: t.type === "voice" ? "rgba(0,209,178,0.1)" : "rgba(99,102,241,0.1)", color: t.type === "voice" ? "#00d1b2" : "#818cf8" }}>
                              {t.type === "voice" ? "📞 Voice" : "💬 Chat"}
                            </span>
                            {t.duration !== "—" && (
                              <span className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>
                                <Clock className="w-2.5 h-2.5 inline mr-0.5" />{t.duration}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{t.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
