import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone } from "lucide-react";

const navLinks = [
  { label: "Buy", href: "/listings?type=sale" },
  { label: "Rent", href: "/listings?type=rental" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  const base = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <header
      className="fixed left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm"
      style={{ top: "var(--promo-h, 40px)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo — Ray White wordmark style */}
          <Link href="/" className="flex items-center gap-0 group">
            <div className="flex items-center">
              <div
                style={{
                  background: "#FFD000",
                  padding: "6px 10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    color: "#1a1a1a",
                    fontWeight: 900,
                    fontSize: 13,
                    letterSpacing: "0.08em",
                    fontFamily: "Inter, sans-serif",
                    lineHeight: 1,
                  }}
                >
                  RAY WHITE
                </span>
              </div>
              <div
                style={{
                  background: "#1a1a1a",
                  padding: "6px 10px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    color: "#FFD000",
                    fontWeight: 700,
                    fontSize: 11,
                    letterSpacing: "0.12em",
                    fontFamily: "Inter, sans-serif",
                    lineHeight: 1,
                  }}
                >
                  CASTLE HILL
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={`${base}${link.href}`}
                className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:0258504038"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="font-medium">02 5850 4038</span>
            </a>
            <a
              href={`${base}/contact`}
              className="text-sm font-bold px-4 py-2 rounded transition-colors"
              style={{ background: "#FFD000", color: "#1a1a1a" }}
            >
              Appraise My Property
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={`${base}${link.href}`}
              className="text-sm font-medium text-foreground/80 hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="tel:0258504038"
            className="flex items-center gap-1.5 text-sm text-muted-foreground"
          >
            <Phone className="w-3.5 h-3.5" />
            02 5850 4038
          </a>
          <a
            href={`${base}/contact`}
            className="text-sm font-bold px-4 py-2 rounded text-center"
            style={{ background: "#FFD000", color: "#1a1a1a" }}
          >
            Appraise My Property
          </a>
        </div>
      )}
    </header>
  );
}
