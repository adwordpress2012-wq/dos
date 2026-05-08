import { Link } from "wouter";

const REBUILD_ITEMS = [
  "Brand refresh with DOS futuristic purple/green glow",
  "Conversion-first hero, product sections, and social proof",
  "Integrated COS and BOS positioning with shared Directive OS stack",
  "SEO-safe routing, legal pages, and onboarding handoff paths",
];

export default function WebsiteRebuildsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-purple-700/20 via-slate-900 to-emerald-500/20 p-8 shadow-[0_0_60px_rgba(99,102,241,0.28)]">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Website Rebuilds</p>
          <h1 className="mt-3 text-4xl font-semibold md:text-5xl">Production Rebuild Scope</h1>
          <ul className="mt-6 space-y-3 text-white/85">
            {REBUILD_ITEMS.map((item) => (
              <li key={item} className="rounded-xl border border-white/10 bg-white/5 p-3">
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/marketing/web-quote" className="rounded-xl bg-emerald-400 px-5 py-3 font-medium text-slate-950">
              Open Web Quote
            </Link>
            <Link href="/" className="rounded-xl border border-white/20 px-5 py-3 font-medium text-white">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
