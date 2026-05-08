import { Link } from "wouter";

export default function MicahPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/20 via-slate-900 to-purple-600/20 p-8 shadow-[0_0_60px_rgba(16,185,129,0.22)]">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Micah Voice</p>
          <h1 className="mt-3 text-4xl font-semibold md:text-5xl">Micah Receptionist Reference</h1>
          <p className="mt-4 max-w-3xl text-white/80">
            Micah is the warm, conversion-focused receptionist persona optimized for directive
            call handling and lead qualification flows.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/marketing/proposal"
              className="rounded-xl bg-emerald-400 px-5 py-3 font-medium text-slate-950"
            >
              View Proposal Template
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
