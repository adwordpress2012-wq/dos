import { useState } from "react";
import { Loader2 } from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL ?? "https://directiveos.com.au/api";

const inputStyle = {
  background: "rgba(0,201,167,0.05)",
  border: "1px solid rgba(0,201,167,0.2)",
  color: "white",
  outline: "none",
  padding: "10px 14px",
  borderRadius: "10px",
  fontSize: "14px",
  width: "100%",
} as const;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/client-auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json() as { ok?: boolean; token?: string; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Invalid email or password.");
        return;
      }
      if (data.token) localStorage.setItem("bookosToken", data.token);
      window.location.href = "/dashboard";
    } catch {
      setError("Network error — please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-28 pb-20 min-h-screen flex items-start justify-center">
      <div className="w-full max-w-sm px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>Sign in to your BookOS account</p>
        </div>

        <form onSubmit={submit} className="space-y-4 p-6 rounded-2xl border" style={{ background: "rgba(10,28,48,0.7)", borderColor: "rgba(0,201,167,0.15)" }}>
          <div>
            <label className="block text-xs font-bold mb-2" style={{ color: "rgba(0,201,167,0.8)" }}>EMAIL</label>
            <input style={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@yourbusiness.com.au" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-2" style={{ color: "rgba(0,201,167,0.8)" }}>PASSWORD</label>
            <input style={inputStyle} type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Your password" />
          </div>

          {error && (
            <div className="text-sm p-3 rounded-xl" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}>{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
            style={{ background: loading ? "rgba(0,201,167,0.5)" : "#00c9a7", color: "#06111f", cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
