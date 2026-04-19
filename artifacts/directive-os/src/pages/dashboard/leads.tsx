import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useGetLeads, useUpdateLead, getGetLeadsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Phone, MessageSquare, Flame, Globe, ChevronDown, ChevronUp, FileText, User } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    contacted: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    qualified: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    closed: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded border font-medium capitalize ${map[status] || map.new}`}>
      {status}
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
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
  if (channel === "voice") return <Phone className="w-3.5 h-3.5 text-muted-foreground" />;
  if (channel === "chat") return <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />;
  return <Globe className="w-3.5 h-3.5 text-muted-foreground" />;
}

type LeadFilter = "all" | "buyer" | "tenant" | "hot" | "new";

export default function Leads() {
  const [filter, setFilter] = useState<LeadFilter>("all");
  const [expanded, setExpanded] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: leads, isLoading } = useGetLeads();
  const updateLead = useUpdateLead({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetLeadsQueryKey() }),
    },
  });

  const filtered = leads?.filter(l => {
    if (filter === "buyer") return l.leadType === "buyer";
    if (filter === "tenant") return l.leadType === "tenant";
    if (filter === "hot") return l.hotLead;
    if (filter === "new") return l.status === "new";
    return true;
  }) ?? [];

  const tabs: { key: LeadFilter; label: string }[] = [
    { key: "all", label: "All Leads" },
    { key: "new", label: "New" },
    { key: "buyer", label: "Buyers" },
    { key: "tenant", label: "Tenants" },
    { key: "hot", label: "Hot Leads" },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Lead Inbox</h1>
        <p className="text-muted-foreground text-sm mt-1">All leads captured by your AI receptionist</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === t.key
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
            }`}
          >
            {t.label}
            {t.key === "hot" && <Flame className="w-3 h-3 inline ml-1.5 text-orange-400" />}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(6)].map((_, i) => <div key={i} className="h-14 bg-muted rounded-lg animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <User className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <div className="text-muted-foreground">No leads found. Your AI receptionist is ready to capture them.</div>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map(lead => (
              <div key={lead.id}>
                <div
                  className="flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => setExpanded(expanded === lead.id ? null : lead.id)}
                >
                  <ChannelIcon channel={lead.channel} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-foreground">{lead.name}</span>
                      {lead.hotLead && <Flame className="w-3.5 h-3.5 text-orange-400" />}
                    </div>
                    <div className="text-xs text-muted-foreground truncate mt-0.5">
                      {lead.listingAddress || lead.email || "General enquiry"} •{" "}
                      {new Date(lead.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {lead.formRequested && <FileText className="w-3.5 h-3.5 text-primary" title="Form requested" />}
                    <TypeBadge type={lead.leadType} />
                    <StatusBadge status={lead.status} />
                    {expanded === lead.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </div>

                {expanded === lead.id && (
                  <div className="px-6 pb-4 bg-muted/20 border-t border-border">
                    <div className="grid md:grid-cols-2 gap-4 py-4">
                      <div className="space-y-2 text-sm">
                        {lead.email && <div><span className="text-muted-foreground">Email: </span><span className="text-foreground">{lead.email}</span></div>}
                        {lead.phone && <div><span className="text-muted-foreground">Phone: </span><span className="text-foreground">{lead.phone}</span></div>}
                        {lead.listingAddress && <div><span className="text-muted-foreground">Property: </span><span className="text-foreground">{lead.listingAddress}</span></div>}
                        {lead.notes && <div><span className="text-muted-foreground">Notes: </span><span className="text-foreground">{lead.notes}</span></div>}
                        {lead.formRequested && <div className="text-primary text-xs font-medium">Tenancy form requested</div>}
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-2">Update Status</div>
                        <div className="flex flex-wrap gap-2">
                          {(["new", "contacted", "qualified", "closed"] as const).map(s => (
                            <button
                              key={s}
                              onClick={e => {
                                e.stopPropagation();
                                updateLead.mutate({ id: lead.id, data: { status: s } });
                              }}
                              className={`text-xs px-3 py-1.5 rounded-lg border font-medium capitalize transition-colors ${
                                lead.status === s
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "bg-card border-border text-muted-foreground hover:border-primary/40"
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
