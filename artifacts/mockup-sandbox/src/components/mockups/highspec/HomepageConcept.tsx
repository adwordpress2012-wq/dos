export function HomepageConcept() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Georgia', serif" }}>
      {/* Nav */}
      <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-10 py-6">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 flex items-center justify-center rounded-sm text-white text-xs font-bold"
            style={{ background: "#C9A96E", fontFamily: "sans-serif", letterSpacing: "0.05em" }}
          >
            HSP
          </div>
          <span className="text-white text-sm tracking-widest uppercase font-light" style={{ fontFamily: "sans-serif" }}>
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
            className="px-5 py-2.5 text-xs tracking-widest uppercase text-white transition-colors"
            style={{ background: "#C9A96E", fontFamily: "sans-serif" }}
          >
            Start Search
          </a>
        </div>
      </nav>

      {/* Hero — full bleed property photography */}
      <div className="relative h-screen flex items-end overflow-hidden">
        {/* Main background: luxury Sydney/Gold Coast property */}
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=85&fit=crop"
          alt="Luxury property"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 60%" }}
        />
        {/* Dark gradient overlay — heavier at bottom for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.75) 100%)",
          }}
        />
        {/* Subtle left vignette */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to right, rgba(0,0,0,0.4) 0%, transparent 60%)" }}
        />

        {/* Trust badges — top right */}
        <div className="absolute top-24 right-10 flex flex-col items-end gap-3 z-10">
          <div className="flex items-center gap-2 px-4 py-2 rounded-sm" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)", border: "1px solid rgba(201,169,110,0.4)" }}>
            <span style={{ color: "#C9A96E" }}>★</span>
            <span className="text-white/90 text-xs tracking-widest uppercase" style={{ fontFamily: "sans-serif" }}>As seen on Channel 9</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-sm" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)", border: "1px solid rgba(201,169,110,0.4)" }}>
            <span style={{ color: "#C9A96E" }}>✦</span>
            <span className="text-white/90 text-xs tracking-widest uppercase" style={{ fontFamily: "sans-serif" }}>REI Award Winner 2023</span>
          </div>
        </div>

        {/* Hero text — bottom left */}
        <div className="relative z-10 px-12 pb-16 max-w-3xl">
          <p className="text-xs tracking-[0.45em] uppercase mb-5" style={{ color: "#C9A96E", fontFamily: "sans-serif" }}>
            Sydney · Byron Bay · Gold Coast
          </p>
          <h1 className="text-white leading-tight mb-6" style={{ fontSize: "4.5rem", fontWeight: 300, lineHeight: 1.05 }}>
            Your property<br />
            <span style={{ color: "#C9A96E", fontStyle: "italic" }}>secret agent.</span>
          </h1>
          <p className="text-white/70 text-base mb-10 max-w-lg leading-relaxed" style={{ fontFamily: "sans-serif", fontWeight: 300 }}>
            Three decades of market intelligence. Access to prestige properties 
            before they list. A team working exclusively in your corner.
          </p>
          <div className="flex items-center gap-5">
            <a
              href="#"
              className="px-8 py-4 text-xs tracking-widest uppercase text-white"
              style={{ background: "#C9A96E", fontFamily: "sans-serif" }}
            >
              Start Your Property Search
            </a>
            <a href="#" className="text-white/60 text-xs tracking-widest uppercase pb-0.5" style={{ fontFamily: "sans-serif", borderBottom: "1px solid rgba(255,255,255,0.35)" }}>
              Meet the Team →
            </a>
          </div>
        </div>

        {/* Bottom right: stat */}
        <div className="absolute bottom-16 right-12 text-right z-10">
          <div className="text-5xl font-light text-white mb-1">30<span style={{ color: "#C9A96E" }}>+</span></div>
          <div className="text-white/50 text-xs tracking-widest uppercase" style={{ fontFamily: "sans-serif" }}>Years of industry network</div>
        </div>
      </div>

      {/* Property preview strip — 3 markets */}
      <div className="grid grid-cols-3" style={{ height: "260px" }}>
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
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 60%)" }} />
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="text-white text-base font-medium mb-1 tracking-wide" style={{ fontFamily: "sans-serif" }}>{m.city}</h3>
              <p className="text-white/60 text-xs leading-relaxed" style={{ fontFamily: "sans-serif" }}>{m.tag}</p>
              <div className="mt-3 text-xs tracking-widest uppercase" style={{ color: "#C9A96E", fontFamily: "sans-serif" }}>
                Search →
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Amanda / Trust Section */}
      <div className="flex" style={{ minHeight: "380px" }}>
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
              <div className="text-3xl font-light text-white mb-1">500<span style={{ color: "#C9A96E" }}>+</span></div>
              <div className="text-white/40 text-xs tracking-widest uppercase" style={{ fontFamily: "sans-serif" }}>Properties secured</div>
            </div>
            <div>
              <div className="text-3xl font-light text-white mb-1">$2<span style={{ color: "#C9A96E" }}>B+</span></div>
              <div className="text-white/40 text-xs tracking-widest uppercase" style={{ fontFamily: "sans-serif" }}>In property purchased</div>
            </div>
          </div>
        </div>
        <div
          className="w-1/2 relative overflow-hidden"
          style={{ background: "#111122" }}
        >
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80&fit=crop"
            alt="Luxury interior"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="relative z-10 flex flex-col justify-end h-full p-14">
            <p className="text-white/70 text-sm italic leading-relaxed mb-6" style={{ fontSize: "1.05rem" }}>
              "Finding the right property isn't about searching harder — 
              it's about knowing where to look before everyone else does."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm" style={{ background: "#C9A96E", fontFamily: "sans-serif" }}>AG</div>
              <div>
                <div className="text-white text-sm font-medium" style={{ fontFamily: "sans-serif" }}>Amanda Gould</div>
                <div className="text-white/40 text-xs tracking-wide" style={{ fontFamily: "sans-serif" }}>Director & Principal Buyer's Agent</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Footer Banner */}
      <div className="flex items-center justify-between px-16 py-12 border-t border-stone-100">
        <div>
          <h3 className="text-2xl font-light text-stone-800 mb-1">Ready to find your next property?</h3>
          <p className="text-stone-400 text-sm" style={{ fontFamily: "sans-serif" }}>Start with a free 30-minute strategy call with Amanda.</p>
        </div>
        <a
          href="#"
          className="px-8 py-4 text-sm tracking-widest uppercase text-white whitespace-nowrap"
          style={{ background: "#0d0d1a", fontFamily: "sans-serif" }}
        >
          Book a Free Consultation
        </a>
      </div>
    </div>
  );
}
