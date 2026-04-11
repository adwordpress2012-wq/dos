import { useEffect, useState } from "react";
import { CheckCircle, Shield, ArrowRight, Loader2 } from "lucide-react";

export default function OnboardSubscribe() {
  const params = new URLSearchParams(window.location.search);
  const orgId = params.get("orgId") ?? "";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startSubscription() {
    if (!orgId) { setError("Missing organisation ID. Please contact support."); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/checkout/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-clerk-org-id": orgId,
        },
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to start subscription."); setLoading(false); return; }
      window.location.href = data.url;
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  useEffect(() => {
    if (orgId) startSubscription();
  }, [orgId]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1b2a 50%, #0a1628 100%)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8 text-center"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(24px)",
        }}
      >
        {error ? (
          <>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)" }}>
              <Shield className="w-7 h-7 text-red-400" />
            </div>
            <h1 className="text-xl font-bold text-white mb-2">Something went wrong</h1>
            <p className="text-sm text-muted-foreground mb-6">{error}</p>
            <button
              onClick={startSubscription}
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "#00d1b2", color: "#000" }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              Try again
            </button>
          </>
        ) : (
          <>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "rgba(0,209,178,0.12)", border: "1px solid rgba(0,209,178,0.25)" }}>
              <CheckCircle className="w-7 h-7" style={{ color: "#00d1b2" }} />
            </div>
            <h1 className="text-xl font-bold text-white mb-2">Setup fee received</h1>
            <p className="text-sm text-muted-foreground mb-2">
              Your $1,500 onboarding payment is confirmed.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              One more step — set up your monthly licence so Sarah can start taking calls for your agency.
            </p>

            <div className="rounded-xl p-4 mb-6 text-left space-y-2"
              style={{ background: "rgba(0,209,178,0.05)", border: "1px solid rgba(0,209,178,0.12)" }}>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Directive OS Licence</span>
                <span className="text-white font-medium">$299/mo</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Cancel anytime · Klarna available · Billed monthly
              </div>
            </div>

            <button
              onClick={startSubscription}
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "#00d1b2", color: "#000" }}
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Redirecting to Stripe…</>
                : <><ArrowRight className="w-4 h-4" /> Continue to monthly subscription</>
              }
            </button>
            <p className="text-xs text-muted-foreground mt-4">
              Secure checkout · GST added at Stripe
            </p>
          </>
        )}
      </div>
    </div>
  );
}
