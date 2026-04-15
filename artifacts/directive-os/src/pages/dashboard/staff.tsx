import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useGetStaff, useInviteStaff, useRemoveStaff, getGetStaffQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useClientAuth } from "@/hooks/useClientAuth";
import { Users, Plus, X, Trash2, Crown, User, Mail } from "lucide-react";

export default function Staff() {
  const { isAgencyOwner, loading: authLoading } = useClientAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!authLoading && !isAgencyOwner) navigate("/dashboard");
  }, [authLoading, isAgencyOwner]);

  const [showInvite, setShowInvite] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", email: "", role: "agent" as "agent" | "principal" });
  const queryClient = useQueryClient();

  const { data: staff, isLoading } = useGetStaff();
  const inviteStaff = useInviteStaff({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetStaffQueryKey() });
        setShowInvite(false);
        setForm({ name: "", email: "", role: "agent" });
      },
    },
  });
  const removeStaff = useRemoveStaff({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetStaffQueryKey() });
        setConfirmDelete(null);
      },
    },
  });

  const principalCount = staff?.filter(s => s.role === "principal").length ?? 0;
  const agentCount = staff?.filter(s => s.role === "agent").length ?? 0;
  const totalSeats = staff?.length ?? 0;
  const monthlyTotal = 299 + Math.max(0, totalSeats - 1) * 89;

  function RoleBadge({ role }: { role: string }) {
    return (
      <span className={`text-xs px-2 py-0.5 rounded border font-medium capitalize inline-flex items-center gap-1 ${
        role === "principal"
          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
          : "bg-blue-500/10 text-blue-400 border-blue-500/20"
      }`}>
        {role === "principal" ? <Crown className="w-3 h-3" /> : <User className="w-3 h-3" />}
        {role}
      </span>
    );
  }

  function StatusBadge({ status }: { status: string }) {
    const map: Record<string, string> = {
      active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      invited: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      inactive: "bg-muted text-muted-foreground border-border",
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded border font-medium capitalize ${map[status] || map.active}`}>
        {status}
      </span>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Seat Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Invite agents · Set-password flow · Stripe seat billing · Access control</p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Invite Agent
        </button>
      </div>

      {/* Seat Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-2xl font-bold text-foreground">{totalSeats}</div>
          <div className="text-sm text-muted-foreground">Total Seats</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-2xl font-bold text-primary">${monthlyTotal}</div>
          <div className="text-sm text-muted-foreground">Monthly Cost (AUD)</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-2xl font-bold text-foreground">{principalCount} / {agentCount}</div>
          <div className="text-sm text-muted-foreground">Principals / Agents</div>
        </div>
      </div>

      <div className="bg-muted/30 border border-border rounded-lg px-4 py-3 mb-6 text-sm text-muted-foreground space-y-1">
        <div>Seat billing is prorated automatically to your Stripe subscription cycle. Each invite triggers an immediate charge for the remaining days in the current period.</div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs">
          <span>• Agents: access to Leads, Transcripts &amp; Listings only</span>
          <span>• Billing, Staff &amp; Protocols: owner-only</span>
          <span>• Invite link expires in 48 hours</span>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />)}
          </div>
        ) : !staff?.length ? (
          <div className="py-16 text-center">
            <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <div className="text-muted-foreground">No staff members yet. Invite your first agent.</div>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {staff.map(member => (
              <div key={member.id} className="flex items-center gap-4 px-6 py-4">
                <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-foreground">{member.name[0]?.toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground">{member.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Mail className="w-3 h-3" />
                    {member.email}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <RoleBadge role={member.role} />
                  <StatusBadge status={member.status} />
                  {member.role !== "principal" && (
                    <button
                      onClick={() => setConfirmDelete(member.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      title="Remove member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowInvite(false)}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Invite Team Member</h3>
              <button onClick={() => setShowInvite(false)} className="text-muted-foreground hover:text-foreground p-1"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Full Name</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Email Address</label>
                <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Role</label>
                <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value as "agent" | "principal" }))}
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                  <option value="agent">Agent</option>
                  <option value="principal">Principal</option>
                </select>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground space-y-1">
                <div>The agent will receive a set-password email with a 48-hour activation link.</div>
                <div>One additional seat is added to your Stripe subscription, prorated immediately.</div>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setShowInvite(false)} className="flex-1 bg-muted border border-border text-muted-foreground hover:text-foreground py-2 rounded-lg text-sm font-medium transition-colors">Cancel</button>
              <button
                onClick={() => inviteStaff.mutate({ data: form })}
                disabled={inviteStaff.isPending || !form.name || !form.email}
                className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {inviteStaff.isPending ? "Sending..." : "Send Invitation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setConfirmDelete(null)}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-sm shadow-2xl p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-foreground mb-2">Remove Staff Member</h3>
            <p className="text-sm text-muted-foreground mb-6">This will revoke their access and remove the seat from your billing.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 bg-muted border border-border text-muted-foreground py-2 rounded-lg text-sm font-medium transition-colors">Cancel</button>
              <button
                onClick={() => removeStaff.mutate({ id: confirmDelete })}
                disabled={removeStaff.isPending}
                className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {removeStaff.isPending ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
