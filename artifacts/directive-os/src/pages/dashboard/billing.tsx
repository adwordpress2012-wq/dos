import { useEffect } from "react";
import { useLocation } from "wouter";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  useGetBillingSubscription, useGetBillingUsage, useGetBillingInvoices,
  useCreateBillingPortal, useCreateCheckout
} from "@workspace/api-client-react";
import { useClientAuth } from "@/hooks/useClientAuth";
import { CreditCard, Zap, FileText, ExternalLink, Check, AlertCircle, Rocket } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    past_due: "bg-red-500/10 text-red-400 border-red-500/20",
    canceled: "bg-muted text-muted-foreground border-border",
    trialing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded border font-medium capitalize ${map[status] || map.active}`}>
      {status.replace("_", " ")}
    </span>
  );
}

function InvoiceStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    open: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    void: "bg-muted text-muted-foreground border-border",
    draft: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded border font-medium capitalize ${map[status] || map.paid}`}>
      {status}
    </span>
  );
}

export default function Billing() {
  const { isAgencyOwner, staff, loading: authLoading } = useClientAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    const canAccess = isAgencyOwner || staff?.role === "principal" || staff?.role === "admin";
    if (!authLoading && !canAccess) navigate("/dashboard");
  }, [authLoading, isAgencyOwner, staff]);

  const { data: subscription, isLoading: subLoading } = useGetBillingSubscription();
  const { data: usage, isLoading: usageLoading } = useGetBillingUsage();
  const { data: invoices, isLoading: invoicesLoading } = useGetBillingInvoices();
  const createPortal = useCreateBillingPortal();
  const createCheckout = useCreateCheckout();

  const aiPct = usage ? Math.min(100, Math.round((usage.minutesUsed / usage.minutesIncluded) * 100)) : 0;

  const handlePortal = async () => {
    try {
      const result = await createPortal.mutateAsync({});
      window.open(result.url, "_blank");
    } catch {
      alert("Unable to open billing portal at this time.");
    }
  };

  const handleCheckout = async () => {
    try {
      const result = await createCheckout.mutateAsync();
      if (result.url) {
        window.location.href = result.url;
      }
    } catch {
      alert("Unable to start checkout at this time. Please try again.");
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Billing Command</h1>
        <p className="text-muted-foreground text-sm mt-1">Subscription, usage, and invoice management</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Subscription Card */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Current License</h3>
            </div>
            {subscription && <StatusBadge status={subscription.status} />}
          </div>
          {subLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => <div key={i} className="h-6 bg-muted rounded animate-pulse" />)}
            </div>
          ) : subscription ? (
            <>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="text-foreground font-medium">{subscription.planName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Seats</span>
                  <span className="text-foreground font-medium">{subscription.seatCount}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-border pt-3">
                  <span className="text-muted-foreground">Base Fee</span>
                  <span className="text-foreground font-medium">${subscription.baseFeeAud}/mo</span>
                </div>
                {subscription.seatCount > 1 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{subscription.seatCount - 1} additional seat{subscription.seatCount > 2 ? "s" : ""}</span>
                    <span className="text-foreground font-medium">${(subscription.seatCount - 1) * subscription.perSeatFeeAud}/mo</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-border pt-3">
                  <span className="font-semibold text-foreground">Monthly Total</span>
                  <span className="text-xl font-bold text-primary">${subscription.totalMonthlyAud}/mo</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                {subscription.setupFeePaid ? (
                  <><Check className="w-3.5 h-3.5 text-primary" /> Onboarding fee paid</>
                ) : (
                  <><AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Onboarding fee pending</>
                )}
              </div>
              {subscription.status === "pending" || !subscription.setupFeePaid ? (
                <button
                  onClick={handleCheckout}
                  disabled={createCheckout.isPending}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90 active:scale-95 mb-2"
                  style={{ backgroundColor: "#00d1b2", color: "#0a0a0a" }}
                >
                  <Rocket className="w-4 h-4" />
                  {createCheckout.isPending ? "Redirecting..." : "Activate License"}
                </button>
              ) : null}
              <button
                onClick={handlePortal}
                disabled={createPortal.isPending}
                className="w-full flex items-center justify-center gap-2 bg-muted border border-border hover:border-primary/40 text-foreground py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                {createPortal.isPending ? "Opening..." : "Manage Billing"}
              </button>
            </>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">No active license yet. Get started with a one-time onboarding fee of $1,800 AUD and a $299/mo subscription.</p>
              <button
                onClick={handleCheckout}
                disabled={createCheckout.isPending}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
                style={{ backgroundColor: "#00d1b2", color: "#0a0a0a" }}
              >
                <Rocket className="w-4 h-4" />
                {createCheckout.isPending ? "Redirecting..." : "Get Started"}
              </button>
            </div>
          )}
        </div>

        {/* AI Usage Card */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">AI Minute Usage</h3>
            </div>
          </div>
          {usageLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <div key={i} className="h-6 bg-muted rounded animate-pulse" />)}
            </div>
          ) : usage ? (
            <>
              <div className="mb-4">
                <div className="text-4xl font-bold text-foreground mb-1">
                  {usage.minutesUsed}
                  <span className="text-xl text-muted-foreground font-normal">/{usage.minutesIncluded}</span>
                </div>
                <div className="text-sm text-muted-foreground">minutes used this billing period</div>
              </div>
              <div className="w-full bg-muted rounded-full h-3 mb-2">
                <div
                  className={`h-3 rounded-full transition-all ${aiPct >= 90 ? "bg-red-500" : aiPct >= 70 ? "bg-amber-500" : "bg-primary"}`}
                  style={{ width: `${aiPct}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mb-6">
                <span>{aiPct}% used</span>
                <span>{usage.minutesIncluded - usage.minutesUsed} mins remaining</span>
              </div>
              <div className="space-y-2 text-sm border-t border-border pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Included Minutes</span>
                  <span className="text-foreground font-medium">{usage.minutesIncluded} mins/mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Overage Rate</span>
                  <span className="text-foreground font-medium">$25 per 10-min block</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Overage Blocks Used</span>
                  <span className="text-foreground font-medium">{usage.overageBlocks}</span>
                </div>
                {usage.overageCostAud > 0 && (
                  <div className="flex justify-between border-t border-border pt-2">
                    <span className="font-semibold text-foreground">Overage Charge</span>
                    <span className="font-bold text-amber-400">${usage.overageCostAud} AUD</span>
                  </div>
                )}
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                Period: {new Date(usage.periodStart).toLocaleDateString("en-AU", { day: "numeric", month: "short" })} —{" "}
                {new Date(usage.periodEnd).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
              </div>
            </>
          ) : (
            <div className="text-muted-foreground text-sm">No usage data available.</div>
          )}
        </div>
      </div>

      {/* Invoice History */}
      <div className="bg-card border border-border rounded-xl">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
          <FileText className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-foreground">Invoice History</h3>
        </div>
        {invoicesLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />)}
          </div>
        ) : !invoices?.length ? (
          <div className="py-12 text-center text-muted-foreground text-sm">No invoices yet.</div>
        ) : (
          <div className="divide-y divide-border">
            {invoices.map(inv => (
              <div key={inv.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <div className="font-medium text-foreground text-sm">{inv.description}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {inv.number} • {new Date(inv.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <InvoiceStatusBadge status={inv.status} />
                  <span className="font-semibold text-foreground">${inv.amountAud.toLocaleString()} AUD</span>
                  {inv.pdfUrl && (
                    <a href={inv.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="px-6 py-3 border-t border-border bg-muted/20">
          <p className="text-xs text-muted-foreground">All invoices include GST and comply with Australian Tax Invoice requirements. ABN: 87 754 544 171.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
