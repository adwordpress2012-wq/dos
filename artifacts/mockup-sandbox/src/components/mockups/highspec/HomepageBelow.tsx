export function HomepageBelow() {
  return (
    <div className="bg-white" style={{ fontFamily: "'Georgia', serif" }}>
      {/* Property preview strip — 3 markets */}
      <div className="grid grid-cols-3" style={{ height: "300px" }}>
        {[
          {
            city: "Sydney",
            tag: "Eastern Suburbs · Lower North Shore · Inner West",
            img: "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=800&q=80&fit=crop",
          },
          {
            city: "Byron Bay Shire",
            tag: "Byron Bay · Bangalow · Mullumbimby",
            img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80&fit=crop",
          },
          {
            city: "Gold Coast",
            tag: "Broadbeach · Burleigh · Prestige Hinterland",
            img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80&fit=crop",
          },
        ].map((m, i) => (
          <div key={i} className="relative overflow-hidden group cursor-pointer" style={{ borderRight: i < 2 ? "1px solid rgba(255,255,255,0.2)" : "none" }}>
            <img
              src={m.img}
              alt={m.city}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.12) 60%)" }} />
            <div className="absolute bottom-0 left-0 p-7">
              <h3 className="text-white text-base font-medium mb-1 tracking-wide" style={{ fontFamily: "sans-serif" }}>{m.city}</h3>
              <p className="text-white/60 text-xs leading-relaxed" style={{ fontFamily: "sans-serif" }}>{m.tag}</p>
              <div className="mt-3 text-xs tracking-widest uppercase" style={{ color: "#C9A96E", fontFamily: "sans-serif" }}>
                Search this market →
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Amanda / Trust Section */}
      <div className="flex" style={{ minHeight: "400px" }}>
        <div className="w-1/2 flex flex-col justify-center px-16 py-14" style={{ background: "#0d0d1a" }}>
          <p className="text-xs tracking-[0.35em] uppercase mb-4" style={{ color: "#C9A96E", fontFamily: "sans-serif" }}>Why HighSpec</p>
          <h2 className="text-white text-3xl font-light mb-5 leading-snug">
            We work for you,<br />
            <span style={{ fontStyle: "italic", color: "#C9A96E" }}>not the vendor.</span>
          </h2>
          <p className="text-white/50 text-sm leading-relaxed mb-8" style={{ fontFamily: "sans-serif" }}>
            As Australia's bespoke buyer's agents, our loyalty sits entirely with you.
            We access off-market listings, negotiate hard, and only succeed when you do.
          </p>
          <div className="flex gap-10">
            <div>
              <div className="text-4xl font-light text-white mb-1">500<span style={{ color: "#C9A96E" }}>+</span></div>
              <div className="text-white/40 text-xs tracking-widest uppercase" style={{ fontFamily: "sans-serif" }}>Properties secured</div>
            </div>
            <div>
              <div className="text-4xl font-light text-white mb-1">$2<span style={{ color: "#C9A96E" }}>B+</span></div>
              <div className="text-white/40 text-xs tracking-widest uppercase" style={{ fontFamily: "sans-serif" }}>In property purchased</div>
            </div>
          </div>
        </div>
        <div className="w-1/2 relative overflow-hidden" style={{ background: "#111122" }}>
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80&fit=crop"
            alt="Luxury interior"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="relative z-10 flex flex-col justify-end h-full p-14">
            <p className="text-white/75 text-sm italic leading-relaxed mb-6" style={{ fontSize: "1.1rem" }}>
              "Finding the right property isn't about searching harder —
              it's about knowing where to look before everyone else does."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold text-sm" style={{ background: "#C9A96E", fontFamily: "sans-serif" }}>AG</div>
              <div>
                <div className="text-white text-sm font-medium" style={{ fontFamily: "sans-serif" }}>Amanda Gould</div>
                <div className="text-white/40 text-xs tracking-wide" style={{ fontFamily: "sans-serif" }}>Director & Principal Buyer's Agent · 30 years in the industry</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="flex items-center justify-between px-16 py-14" style={{ background: "#fafafa", borderTop: "1px solid #e5e5e5" }}>
        <div>
          <h3 className="text-2xl font-light text-stone-800 mb-1">Ready to find your next prestige property?</h3>
          <p className="text-stone-400 text-sm mt-1" style={{ fontFamily: "sans-serif" }}>Start with a free 30-minute strategy call. No obligation.</p>
        </div>
        <a
          href="#"
          className="px-9 py-4 text-sm tracking-widest uppercase text-white whitespace-nowrap"
          style={{ background: "#0d0d1a", fontFamily: "sans-serif" }}
        >
          Book a Free Consultation
        </a>
      </div>

      {/* Footer strip */}
      <div className="flex items-center justify-between px-16 py-6" style={{ background: "#0d0d1a" }}>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 flex items-center justify-center rounded-sm text-white text-xs font-bold" style={{ background: "#C9A96E", fontFamily: "sans-serif" }}>HSP</div>
          <span className="text-white/50 text-xs tracking-widest uppercase" style={{ fontFamily: "sans-serif" }}>HighSpec Properties</span>
        </div>
        <div className="text-white/30 text-xs" style={{ fontFamily: "sans-serif" }}>
          Sydney · Byron Bay · Gold Coast · © 2025 HighSpec Properties
        </div>
        <div className="flex gap-6 text-white/40 text-xs tracking-widest uppercase" style={{ fontFamily: "sans-serif" }}>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
      </div>
    </div>
  );
}
