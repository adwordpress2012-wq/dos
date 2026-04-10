import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  useGetDashboardSummary,
  useGetRecentLeads,
  useGetLeadBreakdown,
  useGetDashboardActivity,
} from "@workspace/api-client-react";
import { Link } from "wouter";
import {
  Users, Inbox, Building2, Mic, FileText, Flame, MessageSquare, TrendingUp,
  Phone, Clock, ArrowRight, ChevronRight
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

function StatCard({ icon, label, value, sub, accent }: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className={`bg-card border rounded-xl p-5 ${accent ? "border-primary/30" : "border-border"}`}>
      <div className={`inline-flex p-2 rounded-lg mb-3 ${accent ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="text-sm font-medium text-foreground mt-0.5">{label}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </div>
  );
}

function LeadTypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    buyer: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    tenant: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    vendor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    landlord: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    unknown: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded border font-medium capitalize ${map[type] || map.unknown}`}>
      {type}
    </span>
  );
}

function ChannelIcon({ channel }: { channel: string }) {
  return channel === "voice"
    ? <Phone className="w-3.5 h-3.5 text-muted-foreground" />
    : <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />;
}

function ActivityTypeIcon({ type }: { type: string }) {
  const map: Record<string, React.ReactNode> = {
    new_lead: <Users className="w-4 h-4 text-blue-400" />,
    transcript: <MessageSquare className="w-4 h-4 text-muted-foreground" />,
    form_request: <FileText className="w-4 h-4 text-emerald-400" />,
    hot_lead: <Flame className="w-4 h-4 text-orange-400" />,
    listing_sync: <Building2 className="w-4 h-4 text-primary" />,
  };
  return <>{map[type] || map.new_lead}</>;
}

const LEAD_COLORS = ["#26a269", "#3b82f6", "#f59e0b", "#a855f7", "#6b7280"];

export default function Dashboard() {
  const { data: summary, isLoading: summaryLoading } = useGetDashboardSummary();
  const { data: recentLeads, isLoading: leadsLoading } = useGetRecentLeads();
  const { data: breakdown, isLoading: breakdownLoading } = useGetLeadBreakdown();
  const { data: activity, isLoading: activityLoading } = useGetDashboardActivity();

  const pieData = breakdown ? [
    { name: "Buyers", value: breakdown.buyers },
    { name: "Tenants", value: breakdown.tenants },
    { name: "Vendors", value: breakdown.vendors },
    { name: "Landlords", value: breakdown.landlords },
    { name: "Unknown", value: breakdown.unknown },
  ].filter(d => d.value > 0) : [];

  const aiPct = summary ? Math.min(100, Math.round((summary.aiMinutesUsed / summary.aiMinutesIncluded) * 100)) : 0;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Command Centre</h1>
        <p className="text-muted-foreground text-sm mt-1">Real-time operational overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<Users className="w-5 h-5" />} label="Total Leads" value={summaryLoading ? "—" : (summary?.totalLeads ?? 0)} sub={`${summary?.newLeadsToday ?? 0} new today`} />
        <StatCard icon={<Building2 className="w-5 h-5" />} label="Active Listings" value={summaryLoading ? "—" : (summary?.activeListings ?? 0)} sub="From VaultRE" />
        <StatCard icon={<Flame className="w-5 h-5" />} label="Hot Leads" value={summaryLoading ? "—" : (summary?.hotLeads ?? 0)} sub="High intent" accent />
        <StatCard icon={<FileText className="w-5 h-5" />} label="Forms Requested" value={summaryLoading ? "—" : (summary?.formsRequested ?? 0)} sub="Tenancy applications" />
      </div>

      {/* AI Usage + Charts */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* AI Minutes */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">AI Minutes</h3>
            <Mic className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">
            {summary?.aiMinutesUsed ?? 0}
            <span className="text-muted-foreground text-lg font-normal">/{summary?.aiMinutesIncluded ?? 100}</span>
          </div>
          <div className="text-xs text-muted-foreground mb-3">minutes used this month</div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${aiPct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{aiPct}% used</span>
            <span>{(summary?.aiMinutesIncluded ?? 100) - (summary?.aiMinutesUsed ?? 0)} remaining</span>
          </div>
        </div>

        {/* Lead Breakdown Pie */}
        <div className="bg-card border border-border rounded-xl p-6 col-span-1 lg:col-span-2">
          <h3 className="font-semibold text-foreground mb-4">Lead Type Breakdown</h3>
          {breakdownLoading ? (
            <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">Loading...</div>
          ) : pieData.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">No leads yet</div>
          ) : (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="60%" height={140}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={2} dataKey="value">
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={LEAD_COLORS[index % LEAD_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(220 25% 12%)", border: "1px solid hsl(220 18% 20%)", borderRadius: "8px", color: "#e8ecf0" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 flex-1">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: LEAD_COLORS[i % LEAD_COLORS.length] }} />
                      <span className="text-muted-foreground">{d.name}</span>
                    </div>
                    <span className="font-semibold text-foreground">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Leads + Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Recent Leads</h3>
            <Link href="/dashboard/leads" className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {leadsLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />)}
            </div>
          ) : !recentLeads?.length ? (
            <div className="text-center py-8 text-muted-foreground text-sm">No leads yet. Your AI receptionist is ready to capture them.</div>
          ) : (
            <div className="space-y-3">
              {recentLeads.slice(0, 6).map(lead => (
                <div key={lead.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <ChannelIcon channel={lead.channel} />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">{lead.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{lead.listingAddress || "General enquiry"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {lead.hotLead && <Flame className="w-3.5 h-3.5 text-orange-400" />}
                    <LeadTypeBadge type={lead.leadType} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Recent Activity</h3>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </div>
          {activityLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-muted rounded-lg animate-pulse" />)}
            </div>
          ) : !activity?.length ? (
            <div className="text-center py-8 text-muted-foreground text-sm">Activity will appear here as your AI handles calls and chats.</div>
          ) : (
            <div className="space-y-3">
              {activity.slice(0, 8).map(a => (
                <div key={a.id} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                  <div className="mt-0.5 flex-shrink-0">
                    <ActivityTypeIcon type={a.type} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-foreground">{a.description}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {new Date(a.timestamp).toLocaleDateString("en-AU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
