import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const DEMO_NUMBER = import.meta.env.VITE_BOOKOS_DEMO_NUMBER ?? "02 5850 4038";

const links = [
  { to: "/how-it-works", label: "How It Works" },
  { to: "/pricing",      label: "Pricing" },
  { to: "/demo",         label: "Demo" },
  { to: "/contact",      label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{ background: "rgba(6,17,31,0.95)", borderColor: "rgba(0,201,167,0.12)", backdropFilter: "blur(12px)" }}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm"
            style={{ background: "rgba(0,201,167,0.15)", border: "1px solid rgba(0,201,167,0.4)", color: "#00c9a7" }}
          >
            B
          </div>
          <span className="font-bold text-white tracking-tight">BookOS</span>
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded"
            style={{ background: "rgba(0,201,167,0.12)", color: "#00c9a7", border: "1px solid rgba(0,201,167,0.25)" }}
          >
            AU
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm transition-colors"
              style={{ color: pathname === l.to ? "#00c9a7" : "rgba(255,255,255,0.6)" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={`tel:${DEMO_NUMBER.replace(/\s/g, "")}`}
            className="text-sm font-semibold transition-colors"
            style={{ color: "#00c9a7" }}
          >
            Call Sarah Now
          </a>
          <Link
            to="/signup"
            className="px-4 py-2 text-sm font-bold rounded-lg transition-all glow-teal"
            style={{ background: "#00c9a7", color: "#06111f" }}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-white p-1" onClick={() => setOpen(o => !o)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t" style={{ background: "rgba(6,17,31,0.98)", borderColor: "rgba(0,201,167,0.12)" }}>
          <div className="max-w-6xl mx-auto px-4 py-4 space-y-3">
            {links.map(l => (
              <Link key={l.to} to={l.to} className="block text-sm py-1" style={{ color: "rgba(255,255,255,0.7)" }} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <a href={`tel:${DEMO_NUMBER.replace(/\s/g, "")}`} className="text-sm font-semibold" style={{ color: "#00c9a7" }}>
                Call Sarah: {DEMO_NUMBER}
              </a>
              <Link to="/signup" className="text-center py-2 text-sm font-bold rounded-lg" style={{ background: "#00c9a7", color: "#06111f" }} onClick={() => setOpen(false)}>
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
