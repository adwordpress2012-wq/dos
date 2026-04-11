import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0F1623] text-white/80">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-sm bg-gold flex items-center justify-center">
              <span className="text-white font-serif font-bold text-sm">M</span>
            </div>
            <div className="leading-none">
              <div className="font-serif text-base font-bold text-white tracking-wide">MERIDIAN</div>
              <div className="text-[9px] text-white/50 tracking-[0.2em] uppercase font-sans">Property Group</div>
            </div>
          </div>
          <p className="text-sm text-white/60 leading-relaxed">
            Western Sydney's most trusted boutique real estate agency. Dedicated to delivering exceptional results for buyers, sellers, and landlords across the Hills District.
          </p>
          {/* Powered by badge */}
          <a
            href="https://directiveos.com.au"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-5 px-3 py-1.5 rounded-full bg-white/8 border border-white/12 text-xs text-white/50 hover:text-white/80 hover:border-white/25 transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Powered by Directive OS
          </a>
        </div>

        {/* Buy & Sell */}
        <div>
          <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-white/40 mb-4">Buy & Sell</h4>
          <ul className="space-y-2.5 text-sm">
            <li><a href={`${base}/listings?type=sale`} className="hover:text-white transition-colors">Properties for Sale</a></li>
            <li><a href={`${base}/listings?type=sale&status=under_offer`} className="hover:text-white transition-colors">Under Offer</a></li>
            <li><a href={`${base}/contact`} className="hover:text-white transition-colors">Request an Appraisal</a></li>
            <li><a href={`${base}/contact`} className="hover:text-white transition-colors">Auction Services</a></li>
          </ul>
        </div>

        {/* Rent */}
        <div>
          <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-white/40 mb-4">Rent</h4>
          <ul className="space-y-2.5 text-sm">
            <li><a href={`${base}/listings?type=rental`} className="hover:text-white transition-colors">Rentals</a></li>
            <li><a href={`${base}/listings?type=rental`} className="hover:text-white transition-colors">Apply Online</a></li>
            <li><a href={`${base}/contact`} className="hover:text-white transition-colors">Landlord Services</a></li>
            <li><a href={`${base}/about`} className="hover:text-white transition-colors">Property Management</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-white/40 mb-4">Get in Touch</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-gold mt-0.5 shrink-0" />
              <span>Level 2, 36 Terminus Street<br />Castle Hill NSW 2154</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-gold shrink-0" />
              <a href="tel:0258504038" className="hover:text-white transition-colors">02 5850 4038</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-gold shrink-0" />
              <a href="mailto:hello@meridianproperty.com.au" className="hover:text-white transition-colors">hello@meridianproperty.com.au</a>
            </li>
          </ul>
          <p className="text-xs text-white/40 mt-4 leading-relaxed">
            Mon – Fri: 9:00am – 5:30pm<br />
            Sat: 9:00am – 1:00pm
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/35">
          <span>© {year} Meridian Property Group Pty Ltd. ABN 47 123 456 789. Licence No. 12345</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white/60 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white/60 transition-colors">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
