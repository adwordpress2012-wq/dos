import { useState } from "react";
import { Link } from "wouter";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded bg-primary flex items-center justify-center font-bold text-primary-foreground">
              D
            </div>
            <Link href="/" className="font-bold text-xl tracking-tight">Directive OS</Link>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/resources" className="hover:text-foreground transition-colors">Resources</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/book" className="hover:text-foreground transition-colors" style={{ color: "#00d1b2" }}>Free Consultation</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="text-sm font-medium hover:text-primary transition-colors">Sign In</Link>
            <Link href="/sign-up" className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {children}
      </main>
      <footer className="border-t py-12 md:py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="size-6 rounded bg-primary flex items-center justify-center font-bold text-primary-foreground text-xs">
                D
              </div>
              <span className="font-bold tracking-tight">Directive OS</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Mission-critical infrastructure for Australian Real Estate Agencies.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Features</li>
              <li>Pricing</li>
              <li>Integrations</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/resources" className="hover:text-foreground">Documentation</Link></li>
              <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/book" className="hover:text-foreground transition-colors" style={{ color: "#00d1b2" }}>
                  Book a Free Consultation
                </Link>
              </li>
              <li>
                <a href="https://calendly.com/adwordpress2012/directive-os-agency-onboarding" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  Strategy Call
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
