import { X, Zap } from "lucide-react";
import { usePromo } from "@/context/promo-context";

const DIRECTIVE_URL = "/";

export default function AgencyPromoBar() {
  const { promoVisible, dismissPromo } = usePromo();
  if (!promoVisible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-10 flex items-center"
      style={{
        background: "linear-gradient(135deg, #0a0e1a 0%, #0f1e2d 100%)",
        borderBottom: "1px solid rgba(0,209,178,0.25)",
      }}
    >
      <div className="max-w-7xl mx-auto w-full px-4 flex items-center gap-3">
        {/* Live indicator */}
        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-400">Live Demo</span>
        </div>
        <div className="h-3 w-px bg-white/15 hidden sm:block shrink-0" />

        {/* Message */}
        <p className="flex-1 text-xs text-white/70 text-center sm:text-left truncate">
          <span className="text-white font-semibold">This is a Directive OS demo site.</span>
          {" "}Your agency website is{" "}
          <span className="text-emerald-400 font-semibold">free</span>
          {" "}— included with your subscription.
        </p>

        {/* CTA */}
        <a
          href={DIRECTIVE_URL}
          className="shrink-0 flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full transition-all whitespace-nowrap"
          style={{ background: "#00d1b2", color: "#0a0e1a" }}
        >
          <Zap className="w-3 h-3" />
          Get Started Free
        </a>

        {/* Dismiss */}
        <button
          onClick={dismissPromo}
          className="shrink-0 text-white/30 hover:text-white/70 transition-colors ml-1"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
