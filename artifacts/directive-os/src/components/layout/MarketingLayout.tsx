import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Phone, Mail, Calendar, ArrowRight, X, Menu } from "lucide-react";

const CALENDLY = "https://calendly.com/adwordpress2012/directive-os-agency-onboarding";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [barDismissed, setBarDismissed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const showBar = scrolled && !barDismissed;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
            <img
              src="/logo.png"
              alt="Directive OS"
              className="w-14 h-14 object-contain flex-shrink-0"
              style={{ filter: "drop-shadow(0 0 10px rgba(0,209,178,0.65))" }}
            />
            <div className="flex flex-col leading-tight gap-0.5">
              <span className="font-extrabold text-lg text-white" style={{ letterSpacing: "0.04em" }}>Directive OS</span>
              {/* Running LED strip */}
              <div className="flex items-center justify-between w-full py-[2px]">
                {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map((i) => (
                  <span
                    key={i}
                    className={i % 2 === 0 ? "led-dot-teal" : "led-dot-white"}
                    style={{ animationDelay: `${i * 0.09}s` }}
                  />
                ))}
              </div>
              <span className="text-[9px] font-semibold uppercase tracking-[0.13em]" style={{ color: "#00d1b2" }}>24/7 Business Assistant</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="/#templates" className="hover:text-foreground transition-colors">Templates</a>
            <Link href="/demos" className="hover:text-foreground transition-colors">Live Demos</Link>
            <a href="/#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <Link href="/resources" className="hover:text-foreground transition-colors">Resources</Link>
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <a
              href={CALENDLY}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold transition-colors"
              style={{ color: "#00d1b2" }}
            >
              Free Consultation
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">Sign In</Link>
            <a
              href={CALENDLY}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-colors hover:opacity-90"
              style={{ background: "rgba(0,209,178,0.1)", border: "1px solid rgba(0,209,178,0.3)", color: "#00d1b2" }}
            >
              Book a Call
            </a>
            <Link href="/sign-up" className="hidden md:inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
              Get Started
            </Link>
            {/* Hamburger — mobile only */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors text-foreground"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border/50" style={{ background: "rgba(10,14,26,0.98)", backdropFilter: "blur(20px)" }}>
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
              <a href="/#templates" onClick={() => setMenuOpen(false)} className="px-3 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">Templates</a>
              <Link href="/demos" onClick={() => setMenuOpen(false)} className="px-3 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">Live Demos</Link>
              <a href="/#pricing" onClick={() => setMenuOpen(false)} className="px-3 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">Pricing</a>
              <Link href="/resources" onClick={() => setMenuOpen(false)} className="px-3 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">Resources</Link>
              <Link href="/blog" onClick={() => setMenuOpen(false)} className="px-3 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">Blog</Link>
              <Link href="/sign-in" onClick={() => setMenuOpen(false)} className="px-3 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">Sign In</Link>
              <div className="pt-2 pb-1 flex flex-col gap-2">
                <a
                  href={CALENDLY}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-center py-3 rounded-lg text-sm font-semibold transition-colors"
                  style={{ background: "rgba(0,209,178,0.1)", border: "1px solid rgba(0,209,178,0.3)", color: "#00d1b2" }}
                >
                  Free Consultation
                </a>
                <Link
                  href="/sign-up"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-center py-3 rounded-lg text-sm font-semibold bg-primary text-primary-foreground"
                >
                  Get Started
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main>
        {children}
      </main>

      {/* Floating Book-a-Call bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[45] transition-transform duration-500"
        style={{ transform: showBar ? "translateY(0)" : "translateY(100%)" }}
      >
        <div className="border-t" style={{ background: "rgba(10,14,26,0.97)", backdropFilter: "blur(20px)", borderColor: "rgba(0,209,178,0.25)" }}>
          <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse" style={{ background: "#00d1b2", boxShadow: "0 0 8px #00d1b2" }} />
              <div className="min-w-0">
                <p className="font-semibold text-foreground text-sm leading-tight">Ready to stop missing leads?</p>
                <p className="text-xs text-muted-foreground hidden sm:block">Book a free 15-min strategy call with Jayson — no commitment</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <a
                href={CALENDLY}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-bold text-sm px-5 py-2.5 rounded-lg transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #00d1b2, #00b89c)", color: "#0a0a0a" }}
              >
                <Calendar className="w-4 h-4" />
                Book Free Strategy Call
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setBarDismissed(true)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer when bar is visible */}
      {showBar && <div className="h-16" />}

      <footer className="border-t py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-3">
                <img src="/logo.png" alt="Directive OS" className="w-8 h-8 object-contain" />
                <span className="font-bold tracking-tight text-lg">Directive OS</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Mission-critical AI infrastructure for Australian Real Estate Agencies.
              </p>
              <div className="space-y-2">
                <a href="tel:0258504038" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#00d1b2" }} />
                  02 5850 4038
                </a>
                <a href="mailto:support@directiveos.com.au" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#00d1b2" }} />
                  support@directiveos.com.au
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Platform</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li><a href="/#templates" className="hover:text-foreground transition-colors">Website Templates</a></li>
                <li><a href="/#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><Link href="/demos" className="hover:text-foreground transition-colors">Live Demos</Link></li>
                <li><Link href="/resources" className="hover:text-foreground transition-colors">Resources</Link></li>
                <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Legal</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><span>NSW Privacy Act Compliant</span></li>
                <li><span>Australian Owned &amp; Operated</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Get Started</h4>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Book a free 15-minute strategy call. No commitment — just a conversation about what's costing your agency leads.
              </p>
              <a
                href={CALENDLY}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-lg transition-all hover:opacity-90 w-full justify-center"
                style={{ background: "linear-gradient(135deg, #00d1b2, #00b89c)", color: "#0a0a0a" }}
              >
                <Calendar className="w-4 h-4" />
                Book Free Strategy Call
              </a>
              <div className="mt-3 text-center">
                <a href="tel:0258504038" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Or call us: 02 5850 4038
                </a>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} Directive OS Pty Ltd. ABN 87 754 544 171. All rights reserved. Australian owned &amp; operated.</p>
            <p>Built for Australian Real Estate Agencies · NSW · VIC · QLD · WA · SA</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
