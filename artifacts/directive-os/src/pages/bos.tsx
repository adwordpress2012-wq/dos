import { Link } from "wouter";

export default function BosPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-purple-700/20 via-slate-900 to-emerald-400/20 p-8 shadow-[0_0_60px_rgba(139,92,246,0.25)]">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">BOS</p>
          <h1 className="mt-3 text-4xl font-semibold md:text-5xl">Book OS</h1>
          <p className="mt-4 max-w-3xl text-white/80">
            BOS is the SMB booking engine built on Directive OS infrastructure with Micah-powered
            voice and chat reception for service businesses.
          </p>
          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
            <h2 className="text-lg font-semibold">FAQ</h2>
            <p className="mt-2 text-sm text-white/80">
              Micah walks through date, time, party size, and contact details; once complete, the request is passed to your team to confirm — same flow as DOS deployments.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://www.bookos.com.au"
              className="rounded-xl bg-emerald-400 px-5 py-3 font-medium text-slate-950"
              target="_blank"
              rel="noreferrer"
            >
              Visit BookOS
            </a>
            <Link href="/" className="rounded-xl border border-white/20 px-5 py-3 font-medium text-white">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
