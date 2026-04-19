import { Phone } from "lucide-react";

const DEMO_NUMBER  = import.meta.env.VITE_BOOKOS_DEMO_NUMBER  ?? "02 5850 4038";
const DEMO_DISPLAY = import.meta.env.VITE_BOOKOS_DEMO_DISPLAY ?? "02 5850 4038";

export default function Demo() {
  return (
    <div className="pt-28 pb-20">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="text-xs font-bold tracking-widest mb-3" style={{ color: "rgba(0,201,167,0.7)" }}>LIVE DEMO</div>
        <h1 className="text-4xl font-bold text-white mb-4">Talk to Sarah right now</h1>
        <p className="text-base mb-10" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
          This is a live demo line. Call the number below and experience exactly what your customers will hear.
          Sarah will greet you, ask how she can help, and demonstrate the full call flow.
        </p>

        <a
          href={`tel:${DEMO_NUMBER.replace(/\s/g, "")}`}
          className="inline-flex items-center gap-3 px-8 py-5 rounded-2xl font-bold text-xl glow-teal transition-all mb-6"
          style={{ background: "#00c9a7", color: "#06111f" }}
        >
          <Phone className="w-6 h-6" />
          Call {DEMO_DISPLAY}
        </a>

        <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          Australian number · Standard call rates apply · Available 24/7
        </p>

        <div className="mt-16 p-6 rounded-2xl border text-left" style={{ background: "rgba(10,28,48,0.6)", borderColor: "rgba(0,201,167,0.12)" }}>
          <div className="text-xs font-bold tracking-wider mb-4" style={{ color: "rgba(0,201,167,0.7)" }}>WHAT TO EXPECT</div>
          <ul className="space-y-2 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
            {[
              "Sarah answers in under 2 seconds",
              "She asks how she can help — just respond naturally",
              "She'll capture your name, number, and email",
              "After the call, you'll receive a text with a booking link",
              "Try asking about pricing, services, or bookings",
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <span style={{ color: "#00c9a7" }}>→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
