import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: "#1a1a1a", color: "rgba(255,255,255,0.75)" }}>
      {/* Yellow top accent bar */}
      <div style={{ background: "#FFD000", height: 5 }} />

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-0 mb-5">
            <div style={{ background: "#FFD000", padding: "5px 9px" }}>
              <span style={{ color: "#1a1a1a", fontWeight: 900, fontSize: 12, letterSpacing: "0.08em" }}>RAY WHITE</span>
            </div>
            <div style={{ background: "#FFD000", padding: "5px 9px", borderLeft: "1px solid rgba(0,0,0,0.12)" }}>
              <span style={{ color: "#1a1a1a", fontWeight: 700, fontSize: 10, letterSpacing: "0.12em" }}>CASTLE HILL</span>
            </div>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
            Castle Hill's leading real estate team. Dedicated to exceptional results for buyers, sellers, and landlords across The Hills District.
          </p>
          {/* Powered by badge */}
          <a
            href="https://directiveos.com.au"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-5 px-3 py-1.5 rounded-full text-xs transition-all hover:opacity-80"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)" }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Powered by Directive OS
          </a>
        </div>

        {/* Buy & Sell */}
        <div>
          <h4 className="text-xs font-semibold tracking-[0.15em] uppercase mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>Buy & Sell</h4>
          <ul className="space-y-2.5 text-sm">
            <li><a href={`${base}/listings?type=sale`} className="hover:text-white transition-colors">Properties for Sale</a></li>
            <li><a href={`${base}/listings?type=sale&status=under_offer`} className="hover:text-white transition-colors">Under Offer</a></li>
            <li><a href={`${base}/contact`} className="hover:text-white transition-colors">Request an Appraisal</a></li>
            <li><a href={`${base}/contact`} className="hover:text-white transition-colors">Auction Services</a></li>
          </ul>
        </div>

        {/* Rent */}
        <div>
          <h4 className="text-xs font-semibold tracking-[0.15em] uppercase mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>Rent</h4>
          <ul className="space-y-2.5 text-sm">
            <li><a href={`${base}/listings?type=rental`} className="hover:text-white transition-colors">Rentals</a></li>
            <li><a href={`${base}/listings?type=rental`} className="hover:text-white transition-colors">Apply Online</a></li>
            <li><a href={`${base}/contact`} className="hover:text-white transition-colors">Landlord Services</a></li>
            <li><a href={`${base}/about`} className="hover:text-white transition-colors">Property Management</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs font-semibold tracking-[0.15em] uppercase mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>Get in Touch</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#FFD000" }} />
              <span>Shop 14, 271 Old Northern Road<br />Castle Hill NSW 2154</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 shrink-0" style={{ color: "#FFD000" }} />
              <a href="tel:0258504038" className="hover:text-white transition-colors">02 5850 4038</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 shrink-0" style={{ color: "#FFD000" }} />
              <a href="mailto:castlehill@raywhite.com" className="hover:text-white transition-colors">castlehill@raywhite.com</a>
            </li>
          </ul>
          <p className="text-xs mt-4 leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
            Mon – Fri: 9:00am – 5:30pm<br />
            Sat: 9:00am – 1:00pm
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          <span>© {year} Ray White Castle Hill. ABN 47 123 456 789. Licence No. 12345678</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white/60 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white/60 transition-colors">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
