import { useState, useEffect } from "react";
import { useLocation } from "wouter";

const API = import.meta.env.VITE_API_BASE_URL ?? "/api";

export default function SetPasswordPage() {
  const token = new URLSearchParams(window.location.search).get("token") ?? "";
  const [, navigate] = useLocation();

  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [agentName, setAgentName] = useState("");
  const [agencyName, setAgencyName] = useState("");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) { setValidating(false); return; }
    fetch(`${API}/staff/verify-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(r => r.json())
      .then(d => {
        if (d.ok) {
          setTokenValid(true);
          setAgentName(d.name ?? "");
          setAgencyName(d.agencyName ?? "");
        }
      })
      .finally(() => setValidating(false));
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/staff/activate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (data.ok) { setDone(true); }
      else { setError(data.error ?? "Something went wrong. Please try again."); }
    } catch { setError("Connection error. Please try again."); }
    finally { setSubmitting(false); }
  }

  const cardStyle: React.CSSProperties = {
    background: "rgba(5,14,26,0.95)",
    border: "1px solid rgba(0,209,178,0.15)",
    borderRadius: 16,
    padding: "40px 36px",
    width: "100%",
    maxWidth: 420,
    backdropFilter: "blur(20px)",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(0,209,178,0.2)",
    borderRadius: 8,
    padding: "11px 14px",
    color: "#fff",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050e1a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <div style={{ color: "#00d1b2", fontSize: 11, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", marginBottom: 6 }}>Directive OS</div>
        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, fontFamily: "monospace" }}>COMMAND CENTRE · AGENT ACTIVATION</div>
      </div>

      <div style={cardStyle}>
        {validating ? (
          <div style={{ textAlign: "center", color: "rgba(0,209,178,0.6)", fontFamily: "monospace", fontSize: 13 }}>VERIFYING LINK...</div>
        ) : !token || !tokenValid ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#ef4444", fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Link Invalid or Expired</div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 24 }}>This invitation link has expired or already been used. Contact your agency administrator for a new invite.</p>
            <button onClick={() => navigate("/dashboard/login")} style={{ background: "rgba(0,209,178,0.1)", border: "1px solid rgba(0,209,178,0.3)", color: "#00d1b2", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontSize: 13 }}>
              Go to Login
            </button>
          </div>
        ) : done ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>✅</div>
            <div style={{ color: "#00d1b2", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Password Set!</div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 24 }}>
              Welcome to {agencyName}'s Command Centre, {agentName}. You can now log in with your email and new password.
            </p>
            <button onClick={() => navigate("/dashboard/login")} style={{ width: "100%", background: "#00d1b2", border: "none", borderRadius: 8, padding: "12px 0", color: "#050e1a", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              Go to Login →
            </button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 28 }}>
              <div style={{ color: "#fff", fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
                Welcome, {agentName}
              </div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
                Set your password to access {agencyName}'s Command Centre.
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", color: "rgba(0,209,178,0.7)", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  required
                  style={inputStyle}
                  autoFocus
                />
              </div>
              <div>
                <label style={{ display: "block", color: "rgba(0,209,178,0.7)", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Confirm Password</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Repeat your password"
                  required
                  style={inputStyle}
                />
              </div>

              {error && (
                <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px", color: "#ef4444", fontSize: 13 }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                style={{ background: submitting ? "rgba(0,209,178,0.4)" : "#00d1b2", border: "none", borderRadius: 8, padding: "12px 0", color: "#050e1a", fontWeight: 700, fontSize: 14, cursor: submitting ? "not-allowed" : "pointer", marginTop: 4 }}
              >
                {submitting ? "Setting Password..." : "Set Password & Activate →"}
              </button>
            </form>
          </>
        )}
      </div>

      <div style={{ marginTop: 24, color: "rgba(255,255,255,0.15)", fontSize: 11, fontFamily: "monospace" }}>
        DIRECTIVE OS · ABN 87 754 544 171 · directiveos.com.au
      </div>
    </div>
  );
}
