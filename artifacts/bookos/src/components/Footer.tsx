import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t mt-24" style={{ borderColor: "rgba(0,201,167,0.1)", background: "rgba(6,17,31,0.8)" }}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs" style={{ background: "rgba(0,201,167,0.15)", border: "1px solid rgba(0,201,167,0.3)", color: "#00c9a7" }}>B</div>
              <span className="font-bold text-white">BookOS</span>
            </div>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
              AI receptionist for salons, trade businesses, and wellness services across Australia.
              Sarah answers every call — your customers book themselves.
            </p>
            <p className="text-xs mt-4" style={{ color: "rgba(255,255,255,0.25)" }}>
              Powered by <a href="https://directiveos.com.au" className="underline" target="_blank" rel="noreferrer">Directive OS</a>
            </p>
          </div>
          <div>
            <div className="text-xs font-bold tracking-wider mb-3" style={{ color: "rgba(0,201,167,0.7)" }}>PRODUCT</div>
            <div className="space-y-2">
              {[["How It Works", "/how-it-works"], ["Pricing", "/pricing"], ["Demo", "/demo"]].map(([l, h]) => (
                <Link key={h} to={h} className="block text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{l}</Link>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold tracking-wider mb-3" style={{ color: "rgba(0,201,167,0.7)" }}>ACCOUNT</div>
            <div className="space-y-2">
              {[["Sign Up", "/signup"], ["Login", "/login"], ["Contact", "/contact"]].map(([l, h]) => (
                <Link key={h} to={h} className="block text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{l}</Link>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-2" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>© {new Date().getFullYear()} BookOS / Directive OS Pty Ltd · ABN 87 754 544 171</p>
          <div className="flex gap-4">
            {[["Privacy", "/privacy"], ["Terms", "/terms"]].map(([l, h]) => (
              <Link key={h} to={h} className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
