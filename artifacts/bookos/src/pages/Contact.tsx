import { Mail, Phone } from "lucide-react";

export default function Contact() {
  return (
    <div className="pt-28 pb-20">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="text-xs font-bold tracking-widest mb-3" style={{ color: "rgba(0,201,167,0.7)" }}>CONTACT</div>
        <h1 className="text-4xl font-bold text-white mb-4">Get in touch</h1>
        <p className="text-base mb-12" style={{ color: "rgba(255,255,255,0.5)" }}>
          Questions about BookOS? We're happy to help.
        </p>

        <div className="grid md:grid-cols-2 gap-4 text-left">
          <a
            href="mailto:jayson@directiveos.com.au"
            className="flex items-start gap-4 p-6 rounded-2xl border transition-all hover:border-teal-400"
            style={{ background: "rgba(10,28,48,0.7)", borderColor: "rgba(0,201,167,0.15)" }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(0,201,167,0.1)", border: "1px solid rgba(0,201,167,0.2)" }}>
              <Mail className="w-5 h-5" style={{ color: "#00c9a7" }} />
            </div>
            <div>
              <div className="font-semibold text-white mb-1">Email us</div>
              <div className="text-sm" style={{ color: "#00c9a7" }}>jayson@directiveos.com.au</div>
              <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>We respond within a few hours</div>
            </div>
          </a>

          <a
            href="tel:+61285504038"
            className="flex items-start gap-4 p-6 rounded-2xl border transition-all hover:border-teal-400"
            style={{ background: "rgba(10,28,48,0.7)", borderColor: "rgba(0,201,167,0.15)" }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(0,201,167,0.1)", border: "1px solid rgba(0,201,167,0.2)" }}>
              <Phone className="w-5 h-5" style={{ color: "#00c9a7" }} />
            </div>
            <div>
              <div className="font-semibold text-white mb-1">Call the demo</div>
              <div className="text-sm" style={{ color: "#00c9a7" }}>02 5850 4038</div>
              <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>Speak to Sarah directly</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
