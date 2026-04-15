import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import {
  Activity, Users, BarChart3, GitBranch, Radio, LogOut,
  ChevronRight, Cpu, Wifi, Shield, Zap, Menu, Building2, FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STARDATE_BASE = 2401.1;

function stardate() {
  const now = new Date();
  const year = now.getFullYear();
  const dayOfYear = Math.floor((now.getTime() - new Date(year, 0, 0).getTime()) / 86400000);
  return `${year - 2000 + 78}.${String(dayOfYear).padStart(3, "0")}`;
}

const NAV = [
  { name: "BRIDGE OVERVIEW", href: "/admin/bridge", icon: Activity, sub: "STATUS" },
  { name: "FLEET MANIFEST", href: "/admin/clients", icon: Users, sub: "CLIENTS" },
  { name: "QUOTE BUILDER", href: "/admin/quote", icon: FileText, sub: "QUOTE" },
  { name: "LISTINGS OPS", href: "/admin/listings", icon: Building2, sub: "PROPS" },
  { name: "FINANCIAL OPS", href: "/admin/financials", icon: BarChart3, sub: "ECON" },
  { name: "STRATEGIC CMD", href: "/admin/pipeline", icon: GitBranch, sub: "CRM" },
  { name: "INTEL FEED", href: "/admin/activity", icon: Radio, sub: "AI LOG" },
];

function PulseBar() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setTick(t => (t + 1) % 8), 180);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="flex items-end gap-0.5 h-4">
      {[3,5,4,7,6,4,5,3].map((h, i) => (
        <div
          key={i}
          className="w-1 rounded-sm transition-all duration-150"
          style={{
            height: `${tick === i ? h * 2.5 : h * 1.5}px`,
            background: tick === i ? "#00d1b2" : "rgba(0,209,178,0.4)",
          }}
        />
      ))}
    </div>
  );
}

export function AdminLayout({ children, title }: { children: React.ReactNode; title?: string }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const iv = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  const sidebar = (
    <div
      className="flex flex-col h-full"
      style={{ background: "linear-gradient(180deg, #040912 0%, #050e1a 100%)" }}
    >
      {/* Logo / Header */}
      <div className="px-4 pt-6 pb-4 border-b" style={{ borderColor: "rgba(0,209,178,0.15)" }}>
        <div className="flex items-center gap-3 mb-3">
          <img src="/logo.png" alt="Directive OS" className="w-8 h-8 object-contain" />
          <div>
            <div className="text-xs font-bold tracking-widest uppercase" style={{ color: "#00d1b2" }}>
              DIRECTIVE OS
            </div>
            <div className="text-[10px] font-mono" style={{ color: "rgba(0,209,178,0.5)" }}>
              CAPTAIN&apos;S BRIDGE
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>
            STARDATE {stardate()}
          </div>
          <PulseBar />
        </div>
        <div className="text-[10px] font-mono mt-1" style={{ color: "rgba(255,255,255,0.2)" }}>
          {time.toLocaleTimeString("en-AU", { hour12: false })} AEST
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map((item) => {
          const active = location === item.href || location.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg group transition-all relative overflow-hidden",
                active
                  ? "text-white"
                  : "text-white/40 hover:text-white/80"
              )}
              style={active ? {
                background: "rgba(0,209,178,0.1)",
                border: "1px solid rgba(0,209,178,0.25)",
              } : {
                border: "1px solid transparent",
              }}
            >
              {active && (
                <div
                  className="absolute left-0 top-0 bottom-0 w-0.5 rounded-r"
                  style={{ background: "#00d1b2" }}
                />
              )}
              <div className="flex flex-col items-center w-4 shrink-0">
                <span className="text-[8px] font-mono font-bold leading-none mb-0.5" style={{ color: active ? "rgba(0,209,178,0.7)" : "rgba(255,255,255,0.2)" }}>
                  {item.sub}
                </span>
                <item.icon className="w-3.5 h-3.5" style={{ color: active ? "#00d1b2" : "inherit" }} />
              </div>
              <span className="text-[11px] font-bold tracking-wider">{item.name}</span>
              {active && <ChevronRight className="w-3 h-3 ml-auto" style={{ color: "#00d1b2" }} />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom status */}
      <div className="px-4 py-4 border-t space-y-2" style={{ borderColor: "rgba(0,209,178,0.1)" }}>
        <div className="flex items-center gap-2 px-2 py-1.5 rounded" style={{ background: "rgba(0,209,178,0.05)", border: "1px solid rgba(0,209,178,0.1)" }}>
          <Shield className="w-3 h-3" style={{ color: "#00d1b2" }} />
          <span className="text-[10px] font-mono" style={{ color: "#00d1b2" }}>PRIME DIRECTIVE ACTIVE</span>
        </div>
        <div className="flex items-center gap-2 px-2 py-1.5 rounded" style={{ background: "rgba(0,209,178,0.05)", border: "1px solid rgba(0,209,178,0.1)" }}>
          <Wifi className="w-3 h-3" style={{ color: "#00d1b2" }} />
          <span className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>ALL SYSTEMS NOMINAL</span>
        </div>
        <Link
          href="/admin"
          className="flex items-center gap-2 px-2 py-1.5 rounded text-white/30 hover:text-white/60 transition-colors"
          onClick={() => {
            sessionStorage.removeItem("adminAuth");
            sessionStorage.removeItem("adminSecret");
          }}
        >
          <LogOut className="w-3 h-3" />
          <span className="text-[10px] font-mono">SECURE LOGOUT</span>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen" style={{ background: "#040912" }}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col w-56 shrink-0 border-r" style={{ borderColor: "rgba(0,209,178,0.15)" }}>
        {sidebar}
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-56">
            {sidebar}
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div
          className="h-12 flex items-center px-4 gap-4 border-b shrink-0"
          style={{ background: "#040912", borderColor: "rgba(0,209,178,0.12)" }}
        >
          <button className="lg:hidden text-white/40 hover:text-white" onClick={() => setMobileOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5" style={{ color: "#00d1b2" }} />
            <span className="text-xs font-mono font-bold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>
              {title || "CAPTAIN'S BRIDGE"}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#00d1b2" }} />
              <span className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>LIVE</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded" style={{ background: "rgba(0,209,178,0.08)", border: "1px solid rgba(0,209,178,0.2)" }}>
              <Cpu className="w-3 h-3" style={{ color: "#00d1b2" }} />
              <span className="text-[10px] font-mono" style={{ color: "#00d1b2" }}>DIRECTIVE OS v2</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
