export function HomepageConcept() {
  return (
    <div className="min-h-screen bg-white font-sans" style={{ fontFamily: "'Georgia', serif" }}>
      {/* Nav */}
      <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-10 py-6">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 flex items-center justify-center rounded-sm text-white text-xs font-bold tracking-widest"
            style={{ background: "#C9A96E", fontFamily: "sans-serif" }}
          >
            HSP
          </div>
          <span className="text-white text-sm tracking-[0.25em] uppercase font-light" style={{ fontFamily: "sans-serif", letterSpacing: "0.2em" }}>
            HighSpec Properties
          </span>
        </div>
        <div className="flex items-center gap-8 text-white/80 text-xs tracking-widest uppercase" style={{ fontFamily: "sans-serif" }}>
          <a href="#" className="hover:text-white transition-colors">Buy</a>
          <a href="#" className="hover:text-white transition-colors">Our Story</a>
          <a href="#" className="hover:text-white transition-colors">Team</a>
          <a href="#" className="hover:text-white transition-colors">Journal</a>
          <a
            href="#"
            className="px-5 py-2.5 text-xs tracking-widest uppercase transition-colors"
            style={{ background: "#C9A96E", color: "white", fontFamily: "sans-serif" }}
          >
            Start Search
          </a>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative h-screen flex items-end pb-20 overflow-hidden">
        {/* Background gradient — simulates luxury property photography */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 35%, #16213e 65%, #0a0a0a 100%)",
          }}
        />
        {/* Subtle texture overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 2px,
              rgba(201,169,110,0.05) 2px,
              rgba(201,169,110,0.05) 4px
            )`,
          }}
        />
        {/* Gold accent line */}
        <div className="absolute left-10 top-0 bottom-0 w-px" style={{ background: "linear-gradient(to bottom, transparent, #C9A96E 30%, #C9A96E 70%, transparent)" }} />

        {/* Trust badges top-right */}
        <div className="absolute top-24 right-10 flex flex-col items-end gap-3">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-sm">
            <span className="text-yellow-400 text-xs">★</span>
            <span className="text-white/80 text-xs tracking-widest uppercase" style={{ fontFamily: "sans-serif" }}>
              As seen on Channel 9
            </span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-sm">
            <span style={{ color: "#C9A96E" }} className="text-xs">✦</span>
            <span className="text-white/80 text-xs tracking-widest uppercase" style={{ fontFamily: "sans-serif" }}>
              REI Award Winner 2023
            </span>
          </div>
        </div>

        {/* Main Hero Text */}
        <div className="relative z-10 px-10 max-w-4xl">
          <p className="text-xs tracking-[0.4em] uppercase mb-5" style={{ color: "#C9A96E", fontFamily: "sans-serif" }}>
            Sydney · Byron Bay · Gold Coast
          </p>
          <h1 className="text-white leading-tight mb-6" style={{ fontSize: "4.2rem", fontWeight: 300, lineHeight: 1.1 }}>
            Your property<br />
            <span style={{ color: "#C9A96E", fontStyle: "italic" }}>secret agent.</span>
          </h1>
          <p className="text-white/60 text-base mb-10 max-w-md leading-relaxed" style={{ fontFamily: "sans-serif", fontWeight: 300 }}>
            Three decades of market intelligence. Access to properties before they list. 
            A team of experts working exclusively for you — the buyer.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="px-8 py-4 text-xs tracking-widest uppercase text-white transition-all"
              style={{ background: "#C9A96E", fontFamily: "sans-serif" }}
            >
              Start Your Property Search
            </a>
            <a href="#" className="text-white/50 text-xs tracking-widest uppercase border-b border-white/30 pb-0.5" style={{ fontFamily: "sans-serif" }}>
              Meet the Team →
            </a>
          </div>
        </div>

        {/* Bottom right stat */}
        <div className="absolute bottom-20 right-10 text-right">
          <div className="text-5xl font-light text-white mb-1" style={{ fontFamily: "Georgia, serif" }}>30+</div>
          <div className="text-white/40 text-xs tracking-widest uppercase" style={{ fontFamily: "sans-serif" }}>Years of industry network</div>
        </div>
      </div>

      {/* Markets Strip */}
      <div className="grid grid-cols-3 border-t border-b border-stone-200">
        {[
          { city: "Sydney", desc: "Eastern Suburbs, Lower North Shore, Inner West", img: "🏙" },
          { city: "Byron Bay Shire", desc: "Byron Bay, Bangalow, Mullumbimby & surrounds", img: "🌊" },
          { city: "Gold Coast", desc: "Hinterland, Broadbeach, Burleigh & prestige corridors", img: "☀️" },
        ].map((m, i) => (
          <div key={i} className={`px-10 py-10 ${i < 2 ? "border-r border-stone-200" : ""} hover:bg-stone-50 transition-colors cursor-pointer group`}>
            <div className="text-2xl mb-4">{m.img}</div>
            <h3 className="text-base font-semibold text-stone-800 mb-2 tracking-wide" style={{ fontFamily: "sans-serif" }}>{m.city}</h3>
            <p className="text-stone-500 text-sm leading-relaxed" style={{ fontFamily: "sans-serif" }}>{m.desc}</p>
            <div className="mt-4 text-xs tracking-widest uppercase text-stone-400 group-hover:text-stone-600 transition-colors" style={{ fontFamily: "sans-serif", color: "#C9A96E" }}>
              Search this market →
            </div>
          </div>
        ))}
      </div>

      {/* Amanda / Trust Section */}
      <div className="flex" style={{ minHeight: "420px" }}>
        {/* Left: dark panel */}
        <div className="w-1/2 flex flex-col justify-center px-16 py-16" style={{ background: "#0f0f1a" }}>
          <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "#C9A96E", fontFamily: "sans-serif" }}>
            Why HighSpec
          </p>
          <h2 className="text-white text-3xl font-light mb-5 leading-snug" style={{ fontFamily: "Georgia, serif" }}>
            We work for you,<br />
            <span style={{ fontStyle: "italic", color: "#C9A96E" }}>not the vendor.</span>
          </h2>
          <p className="text-white/50 text-sm leading-relaxed mb-8" style={{ fontFamily: "sans-serif" }}>
            As Australia's bespoke buyer's agents, our loyalty sits entirely with you. 
            We access off-market listings, negotiate hard, and only succeed when you do.
          </p>
          <div className="flex gap-8">
            <div>
              <div className="text-3xl font-light text-white mb-1">500+</div>
              <div className="text-white/40 text-xs tracking-wider uppercase" style={{ fontFamily: "sans-serif" }}>Properties secured</div>
            </div>
            <div>
              <div className="text-3xl font-light text-white mb-1">$2B+</div>
              <div className="text-white/40 text-xs tracking-wider uppercase" style={{ fontFamily: "sans-serif" }}>In property purchased</div>
            </div>
          </div>
        </div>
        {/* Right: gradient panel with Amanda quote */}
        <div
          className="w-1/2 flex flex-col justify-end p-14 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 100%)" }}
        >
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10" style={{ background: "#C9A96E", transform: "translate(30%, -30%)" }} />
          <div className="relative z-10">
            <p className="text-white/70 text-sm italic leading-relaxed mb-6" style={{ fontFamily: "Georgia, serif", fontSize: "1.05rem" }}>
              "Finding the right property isn't about searching harder — 
              it's about knowing where to look before everyone else does."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm" style={{ background: "#C9A96E" }}>AG</div>
              <div>
                <div className="text-white text-sm font-medium" style={{ fontFamily: "sans-serif" }}>Amanda Gould</div>
                <div className="text-white/40 text-xs tracking-wider" style={{ fontFamily: "sans-serif" }}>Director & Principal Buyer's Agent</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Footer Banner */}
      <div className="flex items-center justify-between px-16 py-12 border-t border-stone-100">
        <div>
          <h3 className="text-2xl font-light text-stone-800 mb-1" style={{ fontFamily: "Georgia, serif" }}>
            Ready to find your next property?
          </h3>
          <p className="text-stone-400 text-sm" style={{ fontFamily: "sans-serif" }}>
            Start with a free 30-minute strategy call with Amanda.
          </p>
        </div>
        <a
          href="#"
          className="px-8 py-4 text-sm tracking-widest uppercase text-white whitespace-nowrap"
          style={{ background: "#0f0f1a", fontFamily: "sans-serif" }}
        >
          Book a Free Consultation
        </a>
      </div>
    </div>
  );
}
