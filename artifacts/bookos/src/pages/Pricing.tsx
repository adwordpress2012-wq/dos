import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const tiers = [
  {
    id: "solo",
    name: "Solo",
    setup: 499,
    monthly: 99,
    minutes: 200,
    best: false,
    features: [
      "200 AI voice minutes / month",
      "1 business number",
      "Instant Calendly SMS after every call",
      "Lead capture + email summaries",
      "24/7 answering",
    ],
  },
  {
    id: "studio",
    name: "Studio",
    setup: 799,
    monthly: 149,
    minutes: 400,
    best: true,
    features: [
      "400 AI voice minutes / month",
      "1 business number",
      "Instant Calendly SMS after every call",
      "Lead capture + email summaries",
      "24/7 answering",
      "Additional seats +$25/mo each",
    ],
  },
  {
    id: "multi",
    name: "Multi-Location",
    setup: 1499,
    monthly: 249,
    minutes: 800,
    best: false,
    features: [
      "800 AI voice minutes / month",
      "Up to 3 locations",
      "Instant Calendly SMS after every call",
      "Lead capture + email summaries",
      "24/7 answering",
      "Additional seats +$25/mo each",
      "Priority support",
    ],
  },
];

export default function Pricing() {
  return (
    <div className="pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="text-xs font-bold tracking-widest mb-3" style={{ color: "rgba(0,201,167,0.7)" }}>PRICING</div>
          <h1 className="text-4xl font-bold text-white mb-4">Simple, transparent pricing</h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
            One-time setup fee + low monthly subscription. No lock-in. Cancel any time.
            Voice overage: $20 per 10 extra minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map(t => (
            <div
              key={t.id}
              className="relative rounded-2xl p-6 flex flex-col border"
              style={{
                background: t.best ? "rgba(0,201,167,0.05)" : "rgba(10,28,48,0.7)",
                borderColor: t.best ? "rgba(0,201,167,0.45)" : "rgba(0,201,167,0.12)",
                boxShadow: t.best ? "0 0 32px rgba(0,201,167,0.12)" : undefined,
              }}
            >
              {t.best && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-bold rounded-full"
                  style={{ background: "#00c9a7", color: "#06111f" }}
                >
                  MOST POPULAR
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-lg font-bold text-white mb-4">{t.name}</h2>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-bold text-white">${t.monthly}</span>
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>/mo</span>
                </div>
                <div className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                  + ${t.setup} setup fee (one-time)
                </div>
                <div className="text-xs mt-1" style={{ color: "#00c9a7" }}>
                  {t.minutes} AI voice minutes included
                </div>
              </div>

              <ul className="space-y-2 mb-8 flex-1">
                {t.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                    <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#00c9a7" }} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to={`/signup?tier=${t.id}`}
                className="block text-center py-3 rounded-xl font-bold text-sm transition-all"
                style={t.best
                  ? { background: "#00c9a7", color: "#06111f" }
                  : { background: "rgba(0,201,167,0.1)", border: "1px solid rgba(0,201,167,0.3)", color: "#00c9a7" }
                }
              >
                Choose {t.name}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ note */}
        <div className="mt-12 text-center p-6 rounded-2xl border" style={{ background: "rgba(10,28,48,0.5)", borderColor: "rgba(0,201,167,0.1)" }}>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            All prices in AUD ex-GST. Voice overage billed at $20 per additional 10-minute block.
            Seat add-ons available on Studio and Multi-Location plans at +$25/mo per seat.
            Have questions? <Link to="/contact" className="underline" style={{ color: "#00c9a7" }}>Contact us</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
