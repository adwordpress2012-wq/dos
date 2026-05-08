import { useEffect, useState } from "react";
import { CheckCircle, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

export default function OnboardSubscribe() {
  const [, navigate] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const orgId = params.get("orgId") ?? "";
  const sessionId = params.get("session_id") ?? "";

  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  async function activate() {
    if (!orgId || !sessionId) {
      setError("Missing payment information. Please contact support.");
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("/api/billing/create-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-clerk-org-id": orgId,
        },
        body: JSON.stringify({ sessionId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Could not activate subscription.");
        setStatus("error");
        return;
      }

      setStatus("done");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch {
      setError("Network error. Please contact support or try again.");
      setStatus("error");
    }
  }

  useEffect(() => {
    activate();
  }, []);

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
        {status === "loading" && (
          <>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "rgba(0,209,178,0.12)", border: "1px solid rgba(0,209,178,0.25)" }}>
              <Loader2 className="w-7 h-7 animate-spin" style={{ color: "#00d1b2" }} />
            </div>
            <h1 className="text-xl font-bold text-white mb-2">Activating your account</h1>
            <p className="text-sm text-muted-foreground">
              Payment received — setting up your Micah subscription now.
            </p>
          </>
        )}

        {status === "done" && (
          <>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "rgba(0,209,178,0.12)", border: "1px solid rgba(0,209,178,0.25)" }}>
              <CheckCircle className="w-7 h-7" style={{ color: "#00d1b2" }} />
            </div>
            <h1 className="text-xl font-bold text-white mb-2">You're live</h1>
            <p className="text-sm text-muted-foreground mb-1">
              Sarah is ready to take calls for your agency.
            </p>
            <p className="text-xs text-muted-foreground">
              Taking you to your Command Bridge now…
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)" }}>
              <AlertCircle className="w-7 h-7 text-red-400" />
            </div>
            <h1 className="text-xl font-bold text-white mb-2">Activation issue</h1>
            <p className="text-sm text-muted-foreground mb-6">{error}</p>
            <p className="text-xs text-muted-foreground mb-4">
              Your payment was collected successfully. If this error persists, contact us and we'll activate your account manually.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={activate}
                className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                style={{ background: "#00d1b2", color: "#000" }}
              >
                <ArrowRight className="w-4 h-4" /> Try again
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full py-3 rounded-xl font-semibold text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Continue to dashboard anyway
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
