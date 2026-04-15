import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useGetStaff, useInviteStaff, useRemoveStaff, getGetStaffQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useClientAuth } from "@/hooks/useClientAuth";
import { Users, Plus, X, Trash2, Crown, User, Mail, Shield, Headphones } from "lucide-react";

type StaffRole = "principal" | "admin" | "sales_executive" | "sales_support";

const ROLE_LABELS: Record<StaffRole, string> = {
  principal: "Principal",
  admin: "Admin",
  sales_executive: "Sales Executive",
  sales_support: "Sales Support",
};

const ROLE_ACCESS: Record<StaffRole, string> = {
  principal: "Full access — Billing, Staff, Protocols, Leads, Transcripts, Listings",
  admin: "Billing, Leads, Transcripts, Listings",
  sales_executive: "Leads, Transcripts, Listings",
  sales_support: "Leads & Transcripts only",
};

export default function Staff() {
  const { isAgencyOwner, staff, loading: authLoading } = useClientAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    const canAccess = isAgencyOwner || staff?.role === "principal";
    if (!authLoading && !canAccess) navigate("/dashboard");
  }, [authLoading, isAgencyOwner, staff]);

  const [showInvite, setShowInvite] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", email: "", role: "sales_executive" as StaffRole });
  const queryClient = useQueryClient();

  const { data: staffList, isLoading } = useGetStaff();
  const inviteStaff = useInviteStaff({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetStaffQueryKey() });
        setShowInvite(false);
        setForm({ name: "", email: "", role: "sales_executive" });
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

  const totalSeats = staffList?.length ?? 0;
  const monthlyTotal = 299 + Math.max(0, totalSeats - 1) * 89;

  function RoleBadge({ role }: { role: string }) {
    const label = ROLE_LABELS[role as StaffRole] ?? role;
    const styles: Record<string, string> = {
      principal: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      admin: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      sales_executive: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      sales_support: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    };
    const icons: Record<string, React.ReactNode> = {
      principal: <Crown className="w-3 h-3" />,
      admin: <Shield className="w-3 h-3" />,
      sales_executive: <User className="w-3 h-3" />,
      sales_support: <Headphones className="w-3 h-3" />,
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded border font-medium inline-flex items-center gap-1 ${styles[role] ?? "bg-muted text-muted-foreground border-border"}`}>
        {icons[role]}
        {label}
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
          <p className="text-muted-foreground text-sm mt-1">Invite team members · Role-based access · Stripe seat billing</p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      {/* Seat Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-2xl font-bold text-foreground">{totalSeats}</div>
          <div className="text-sm text-muted-foreground">Total Seats</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-2xl font-bold text-primary">${monthlyTotal}</div>
          <div className="text-sm text-muted-foreground">Monthly Cost (AUD)</div>
        </div>
      </div>

      {/* Role Access Guide */}
      <div className="bg-muted/30 border border-border rounded-lg px-4 py-3 mb-6 text-xs text-muted-foreground space-y-1.5">
        <div className="font-medium text-foreground text-sm mb-2">Role Access Levels</div>
        {(Object.entries(ROLE_ACCESS) as [StaffRole, string][]).map(([role, desc]) => (
          <div key={role} className="flex items-start gap-2">
            <RoleBadge role={role} />
            <span className="text-muted-foreground mt-0.5">{desc}</span>
          </div>
        ))}
        <div className="mt-2 pt-2 border-t border-border text-xs">Invite link expires in 48 hours. Each invite adds one prorated seat to your Stripe subscription.</div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />)}
          </div>
        ) : !staffList?.length ? (
          <div className="py-16 text-center">
            <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <div className="text-muted-foreground">No team members yet. Invite your first member.</div>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {staffList.map(member => (
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
                <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value as StaffRole }))}
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                  <option value="principal">Principal — Full access</option>
                  <option value="admin">Admin — Billing, Leads, Transcripts, Listings</option>
                  <option value="sales_executive">Sales Executive — Leads, Transcripts, Listings</option>
                  <option value="sales_support">Sales Support — Leads &amp; Transcripts only</option>
                </select>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
                An invitation email will be sent with a 48-hour activation link. One seat is added to your Stripe subscription immediately, prorated.
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
            <h3 className="font-semibold text-foreground mb-2">Remove Team Member</h3>
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
