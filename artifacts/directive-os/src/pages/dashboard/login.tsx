import { useState } from "react";
import { useLocation } from "wouter";
import { Shield, Eye, EyeOff, Zap, AlertTriangle } from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL ?? "/api";

export default function DashboardLogin() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (localStorage.getItem("clientToken")) {
    navigate("/dashboard");
    return null;
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/client/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json();
      if (data.ok) {
        localStorage.setItem("clientToken", data.token);
        navigate("/dashboard");
      } else {
        setError(data.error || "Invalid email or password");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "radial-gradient(ellipse at center, #060d1a 0%, #020508 100%)" }}
    >
      {/* Starfield */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() > 0.8 ? 2 : 1,
              height: Math.random() > 0.8 ? 2 : 1,
              background: "rgba(255,255,255,0.5)",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.6 + 0.1,
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-md">
        <div
          className="absolute -top-8 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, #00d1b2, transparent)" }}
        />

        <div
          className="rounded-2xl p-8 relative overflow-hidden"
          style={{
            background: "rgba(4,9,18,0.95)",
            border: "1px solid rgba(0,209,178,0.3)",
            boxShadow: "0 0 60px rgba(0,209,178,0.08), inset 0 1px 0 rgba(0,209,178,0.1)",
          }}
        >
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-xl" style={{ borderColor: "#00d1b2" }} />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 rounded-tr-xl" style={{ borderColor: "#00d1b2" }} />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 rounded-bl-xl" style={{ borderColor: "#00d1b2" }} />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 rounded-br-xl" style={{ borderColor: "#00d1b2" }} />

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{ background: "rgba(0,209,178,0.1)", border: "2px solid rgba(0,209,178,0.4)" }}>
              <Shield className="w-7 h-7" style={{ color: "#00d1b2" }} />
            </div>
            <div className="text-xs font-mono font-bold tracking-widest mb-1" style={{ color: "rgba(0,209,178,0.6)" }}>
              DIRECTIVE OS // COMMAND BRIDGE
            </div>
            <h1 className="text-2xl font-bold text-white">Agency Login</h1>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
              Sign in to your Command Centre
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold mb-2 tracking-wider" style={{ color: "rgba(0,209,178,0.7)" }}>
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@youragency.com.au"
                className="w-full px-4 py-3 text-sm rounded-lg outline-none transition-all"
                style={{
                  background: "rgba(0,209,178,0.05)",
                  border: "1px solid rgba(0,209,178,0.2)",
                  color: "#fff",
                }}
                autoFocus
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold mb-2 tracking-wider" style={{ color: "rgba(0,209,178,0.7)" }}>
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password..."
                  className="w-full px-4 py-3 pr-10 text-sm font-mono rounded-lg outline-none transition-all"
                  style={{
                    background: "rgba(0,209,178,0.05)",
                    border: "1px solid rgba(0,209,178,0.2)",
                    color: "#00d1b2",
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "rgba(0,209,178,0.5)" }}
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span className="text-xs text-red-400 font-mono">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full py-3 rounded-lg font-bold text-sm tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{ background: "#00d1b2", color: "#040912" }}
            >
              <Zap className="w-4 h-4" />
              {loading ? "SIGNING IN..." : "ACCESS COMMAND CENTRE"}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t text-center space-y-2" style={{ borderColor: "rgba(0,209,178,0.1)" }}>
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
              Forgot your password? Contact{" "}
              <a href="mailto:support@directiveos.com.au" style={{ color: "rgba(0,209,178,0.6)" }}>
                support@directiveos.com.au
              </a>
            </p>
            <p className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.15)" }}>
              DIRECTIVE OS · SECURE ACCESS · ABN 87 754 544 171
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
