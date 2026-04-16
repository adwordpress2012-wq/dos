import { useEffect, useState } from "react";
import { useParams } from "wouter";

const API = import.meta.env.VITE_API_BASE_URL ?? "/api";

export default function QuoteRedirect() {
  const { code } = useParams<{ code: string }>();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!code) return;
    fetch(`${API}/q/${code}`)
      .then(r => r.json())
      .then(data => {
        if (data.url) {
          window.location.href = data.url;
        } else {
          setError("This link is invalid or has expired.");
        }
      })
      .catch(() => setError("Could not load the payment link. Please try again."));
  }, [code]);

  if (error) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#050e1a", color: "#fff", fontFamily: "sans-serif", gap: 16 }}>
        <div style={{ fontSize: 48 }}>⚠️</div>
        <div style={{ fontSize: 18, fontWeight: 600 }}>{error}</div>
        <a href="https://directiveos.com.au" style={{ color: "#00d1b2", fontSize: 14 }}>Return to Directive OS</a>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#050e1a", color: "#fff", fontFamily: "sans-serif", gap: 16 }}>
      <div style={{ width: 40, height: 40, border: "3px solid rgba(0,209,178,0.3)", borderTopColor: "#00d1b2", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Loading your payment link…</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
