import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";

const TEAL = "#00d1b2";

const SECTIONS = [
  { id: "design",     label: "Design & Visual Appeal",     icon: "🎨", defaultScore: 5,
    defaultNote: "WordPress theme with dated aesthetics. Dual navigation bars create visual clutter. Generic layout with no clear brand differentiation from competitors. Logo has scaling artefacts." },
  { id: "seo",        label: "SEO & Search Visibility",    icon: "🔍", defaultScore: 6,
    defaultNote: "Strong suburb-specific landing pages (Hinchinbrook, Liverpool, Bonnyrigg etc.) — smart local SEO. However duplicate nav menus create code bloat and meta descriptions need optimisation. No Schema markup detected." },
  { id: "mobile",     label: "Mobile & Responsiveness",    icon: "📱", defaultScore: 6,
    defaultNote: "Responsive hamburger menu in place. WebP image format is a positive. Heavy navigation structure and Calendly embed may create friction on smaller screens." },
  { id: "speed",      label: "Page Speed & Performance",   icon: "⚡", defaultScore: 4,
    defaultNote: "Multiple third-party scripts detected: Calendly, reCAPTCHA, property search widget. WordPress with likely heavy plugin load. Expected load time 5–10 seconds on mobile — well above the 3-second threshold that affects Google rankings." },
  { id: "content",    label: "Content Quality & Clarity",  icon: "📝", defaultScore: 6,
    defaultNote: "Solid local area focus with suburb-specific pages. Homepage copy is generic and fails to differentiate from competitors. No clear unique selling proposition above the fold." },
  { id: "conversion", label: "Trust & Conversion",         icon: "🎯", defaultScore: 5,
    defaultNote: "Contact details and social links visible. Calendly booking is a nice touch. However no testimonials or Google Reviews on the homepage, and reCAPTCHA on all forms adds friction that reduces conversions." },
  { id: "security",   label: "Security & Technical Health",icon: "🔒", defaultScore: 6,
    defaultNote: "HTTPS in place. Standard WordPress setup — inherent plugin vulnerability risk without regular hardening. PDF tenancy form hosted on-site is a minor security consideration. No critical red flags detected." },
];

const PACKAGES = [
  { id: "starter",      label: "Starter Rebuild",      price: "$1,800",  monthly: null },
  { id: "business",     label: "Business Rebuild",     price: "$3,500",  monthly: null },
  { id: "professional", label: "Professional Rebuild", price: "$5,200",  monthly: null },
  { id: "enterprise",   label: "Enterprise Rebuild",   price: "$7,500+", monthly: null },
];

const ADDON_LABELS: Record<string, string> = {
  ai: "AI Receptionist — Sarah (+$1,800 setup + $299/mo)",
  seo: "SEO Foundation Package (+$600)",
  analytics: "Google Analytics + Search Console (+$200)",
  speed: "Speed & Performance Optimisation (+$400)",
  copywriting: "Copywriting per page (+$150/pg)",
  forms: "Custom Forms & Lead Capture (+$350)",
  security: "Security Hardening & SSL (+$150)",
  chat: "Live Chat Integration (+$300)",
  vaultre: "VaultRE CRM Integration (+$900)",
  rex: "Rex Software CRM Integration (+$900)",
  propertyme: "PropertyMe Integration (+$800)",
  rea: "realestate.com.au Listing Feed (+$500)",
  domain: "Domain.com.au Listing Feed (+$500)",
  crm: "Custom CRM / API Integration (+$1,200)",
};

function getRec(avg: number): { type: "new"|"rebuild"; pkg: string; verdict: string; color: string; summary: string } {
  if (avg >= 8)   return { type: "new",     pkg: "starter",      verdict: "MINOR IMPROVEMENTS ONLY",   color: "#10b981", summary: "This site is in reasonable shape. Targeted improvements will deliver better ROI than a full rebuild right now." };
  if (avg >= 6.5) return { type: "rebuild", pkg: "starter",      verdict: "PARTIAL REFRESH RECOMMENDED", color: "#f59e0b", summary: "Solid foundations, but the design and some technical areas need a refresh to stay competitive." };
  if (avg >= 4.5) return { type: "rebuild", pkg: "business",     verdict: "FULL REBUILD RECOMMENDED",    color: "#f97316", summary: "Multiple structural issues identified. A full rebuild will outperform any attempt to patch the existing site." };
  return           { type: "rebuild", pkg: "professional",  verdict: "URGENT REBUILD REQUIRED",     color: "#ef4444", summary: "Critical issues across multiple areas. The current site is actively costing this business leads and revenue every day." };
}

function getPkgRating(pkgId: string, recPkg: string): { stars: number; note: string } {
  const order = ["starter", "business", "professional", "enterprise"];
  const diff = order.indexOf(pkgId) - order.indexOf(recPkg);
  if (diff === 0)  return { stars: 5, note: "RECOMMENDED — best fit for the issues identified" };
  if (diff === 1)  return { stars: 4, note: "Great choice if you want a premium finish and future-proofing" };
  if (diff === -1) return { stars: 3, note: "Works on a tighter budget, but may not resolve all issues fully" };
  if (diff === 2)  return { stars: 3, note: "Comprehensive — ideal if aggressive scaling is planned" };
  if (diff === -2) return { stars: 2, note: "Too limited for the scope of issues we found" };
  if (diff > 2)    return { stars: 2, note: "More than needed at this stage" };
  return                  { stars: 1, note: "Not suitable — wouldn't address the core issues found" };
}

function getSuggestedAddons(scores: Record<string, number>): string[] {
  const list: string[] = ["ai"];
  if (scores.seo      < 7) { list.push("seo"); list.push("analytics"); }
  if (scores.speed    < 7) list.push("speed");
  if (scores.content  < 6) list.push("copywriting");
  if (scores.conversion < 7) list.push("forms");
  if (scores.security < 7) list.push("security");
  return [...new Set(list)];
}

function ScoreBar({ score }: { score: number }) {
  const c = score >= 8 ? "#10b981" : score >= 6 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 5, background: "#1e293b", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${score * 10}%`, height: "100%", background: c, borderRadius: 3, transition: "width 0.3s" }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 800, color: c, minWidth: 36, textAlign: "right" }}>{score}/10</span>
    </div>
  );
}

function Stars({ n }: { n: number }) {
  return <span>{[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= n ? "#f59e0b" : "#1e293b", fontSize: 13 }}>★</span>)}</span>;
}

export default function HealthCheck() {
  const [clientName,   setClientName]   = useState("Elite Sydney Property");
  const [clientUrl,    setClientUrl]    = useState("elitesydneyproperty.com.au");
  const [contactName,  setContactName]  = useState("Khaled");
  const [editing,      setEditing]      = useState(false);
  const [scores,       setScores]       = useState<Record<string,number>>(Object.fromEntries(SECTIONS.map(s => [s.id, s.defaultScore])));
  const [notes,        setNotes]        = useState<Record<string,string>>(Object.fromEntries(SECTIONS.map(s => [s.id, s.defaultNote])));

  // Read URL params (when navigating from health check → quote → back)
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("client"))  setClientName(decodeURIComponent(p.get("client")!));
    if (p.get("contact")) setContactName(decodeURIComponent(p.get("contact")!));
  }, []);

  const avg = useMemo(() => {
    const v = Object.values(scores);
    return Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 10) / 10;
  }, [scores]);

  const rec             = useMemo(() => getRec(avg), [avg]);
  const suggestedAddons = useMemo(() => getSuggestedAddons(scores), [scores]);

  const quoteUrl = useMemo(() => {
    const p = new URLSearchParams({ type: rec.type, pkg: rec.pkg, client: clientName, contact: contactName, addons: suggestedAddons.join(",") });
    return `/marketing/web-quote?${p.toString()}`;
  }, [rec, clientName, contactName, suggestedAddons]);

  const DATE = new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
  const REF  = `DOS-HC-${String(Date.now()).slice(-4)}`;

  const inp = (editing: boolean): React.CSSProperties => ({
    background: "transparent", border: "none",
    borderBottom: editing ? `1px dashed ${TEAL}` : "none",
    outline: "none", color: "inherit", font: "inherit",
    width: "100%", cursor: editing ? "text" : "default",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1a", fontFamily: "Inter, sans-serif", color: "#fff" }}>
      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 8mm 10mm; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body { margin:0!important; background:#0d1424!important; }
          .np { display:none!important; }
          .print-outer-grid { display: block !important; min-height: unset !important; }
          .print-right-panel { overflow: visible !important; max-height: none !important; padding: 0 !important; }
          .page { max-width: 100% !important; width: 100% !important; margin: 0 !important; box-shadow: none !important; border-radius: 0 !important; overflow: visible !important; }
          .print-section { page-break-inside: avoid; break-inside: avoid; }
          .print-page-break { page-break-before: always; break-before: always; }
        }
        input,textarea { background:transparent; border:none; outline:none; color:inherit; font:inherit; }
        textarea:focus,input:focus { border-bottom:1px dashed ${TEAL}; }
        input[type=range] { -webkit-appearance:none; width:100%; height:4px; border-radius:2px; outline:none; cursor:pointer; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:16px; height:16px; border-radius:50%; background:${TEAL}; cursor:pointer; }
      `}</style>

      {/* Sticky top bar */}
      <div className="np" style={{ padding: "12px 20px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", gap: 12, background: "#0d1424", position: "sticky", top: 0, zIndex: 10, flexWrap: "wrap" }}>
        <Link href="/marketing" style={{ color: "#64748b", fontSize: 13, textDecoration: "none" }}>← Marketing</Link>
        <span style={{ color: "#1e293b" }}>|</span>
        <span style={{ fontWeight: 700, fontSize: 13 }}>Website Health Check Builder</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={() => setEditing(!editing)} style={{ padding: "6px 14px", borderRadius: 7, border: `1px solid ${editing ? TEAL : "#1e293b"}`, background: editing ? "rgba(0,209,178,0.1)" : "transparent", color: editing ? TEAL : "#94a3b8", fontWeight: 600, cursor: "pointer", fontSize: 12 }}>
            {editing ? "✓ Done" : "✏ Edit Client"}
          </button>
          <a href={quoteUrl} style={{ padding: "6px 16px", borderRadius: 7, background: "#f59e0b", color: "#000", fontWeight: 700, fontSize: 12, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
            💬 Build Quote →
          </a>
          <button onClick={() => window.print()} style={{ padding: "6px 16px", borderRadius: 7, border: "none", background: TEAL, color: "#000", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>
            🖨 Print / PDF
          </button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="print-outer-grid" style={{ display: "grid", gridTemplateColumns: "290px 1fr", minHeight: "calc(100vh - 49px)" }}>

        {/* LEFT — sliders + notes */}
        <div className="np" style={{ borderRight: "1px solid #1e293b", overflowY: "auto", maxHeight: "calc(100vh - 49px)", position: "sticky", top: 49, padding: "18px 16px" }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>Rate Each Section</div>
          <div style={{ fontSize: 11, color: "#475569", marginBottom: 16 }}>Drag sliders 1–10 · type notes below each</div>

          {SECTIONS.map(s => {
            const sc = scores[s.id];
            const c  = sc >= 8 ? "#10b981" : sc >= 6 ? "#f59e0b" : "#ef4444";
            return (
              <div key={s.id} style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 11, fontWeight: 600 }}>{s.icon} {s.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: c }}>{sc}/10</span>
                </div>
                <input type="range" min={1} max={10} value={sc}
                  onChange={e => setScores(p => ({ ...p, [s.id]: Number(e.target.value) }))}
                  style={{ background: `linear-gradient(to right, ${c} ${sc * 10}%, #1e293b ${sc * 10}%)` }}
                />
                <textarea value={notes[s.id]} onChange={e => setNotes(p => ({ ...p, [s.id]: e.target.value }))}
                  rows={2} placeholder="Add notes..." style={{ width: "100%", marginTop: 5, background: "#111827", border: "1px solid #1e293b", borderRadius: 6, padding: "5px 8px", color: "#64748b", fontSize: 10, lineHeight: 1.5, resize: "vertical", fontFamily: "Inter, sans-serif", boxSizing: "border-box" }} />
              </div>
            );
          })}

          {/* Live score card */}
          <div style={{ background: "#111827", border: "1px solid rgba(0,209,178,0.25)", borderRadius: 10, padding: "14px", marginTop: 4 }}>
            <div style={{ fontSize: 10, color: "#64748b" }}>Overall Score</div>
            <div style={{ fontSize: 30, fontWeight: 900, color: avg >= 7.5 ? "#10b981" : avg >= 5 ? "#f59e0b" : "#ef4444" }}>{avg}<span style={{ fontSize: 14, fontWeight: 400, color: "#475569" }}>/10</span></div>
            <div style={{ fontSize: 10, fontWeight: 700, color: rec.color, marginBottom: 10 }}>{rec.verdict}</div>
            <a href={quoteUrl} style={{ display: "block", textAlign: "center", padding: "8px", borderRadius: 7, background: "#f59e0b", color: "#000", fontWeight: 700, fontSize: 12, textDecoration: "none" }}>
              💬 Build Quote from this Report →
            </a>
          </div>
        </div>

        {/* RIGHT — printable report */}
        <div className="print-right-panel" style={{ overflowY: "auto", padding: "24px 16px 60px" }}>
          <div className="page" style={{ maxWidth: 700, margin: "0 auto", background: "#0d1424", borderRadius: 12, overflow: "hidden", boxShadow: "0 0 40px rgba(0,0,0,0.5)" }}>

            {/* Report header */}
            <div style={{ background: "linear-gradient(135deg, #0a0f1a, #0d1f2d)", padding: "30px 40px 22px", borderBottom: `3px solid ${TEAL}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <img src="/logo.png" alt="Directive OS" style={{ width: 42, height: 42, objectFit: "contain", filter: "drop-shadow(0 0 8px rgba(0,209,178,0.5))" }} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>Directive OS</div>
                    <div style={{ color: TEAL, fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>Web Solutions & AI Services</div>
                  </div>
                </div>
                <div style={{ textAlign: "right", fontSize: 10, color: "#64748b", lineHeight: 1.9 }}>
                  <div>{DATE}</div><div>Ref: {REF}</div><div>directiveos.com.au</div>
                </div>
              </div>
              <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid #1e293b" }}>
                <div style={{ fontSize: 9, color: TEAL, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", marginBottom: 4 }}>Website Health Check Report — Prepared For</div>
                <div style={{ fontSize: 20, fontWeight: 800 }}>
                  <input readOnly={!editing} value={clientName} onChange={e => setClientName(e.target.value)} style={inp(editing)} />
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                  🌐 <input readOnly={!editing} value={clientUrl} onChange={e => setClientUrl(e.target.value)} style={{ ...inp(editing), display: "inline", width: 200 }} />
                  &nbsp;·&nbsp; Attn: <input readOnly={!editing} value={contactName} onChange={e => setContactName(e.target.value)} style={{ ...inp(editing), display: "inline", width: 160 }} />
                </div>
              </div>
            </div>

            {/* Executive summary */}
            <div style={{ padding: "18px 40px", borderBottom: "1px solid #1e293b", background: "rgba(0,0,0,0.15)", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
              <div style={{ textAlign: "center", minWidth: 70 }}>
                <div style={{ fontSize: 44, fontWeight: 900, lineHeight: 1, color: avg >= 7.5 ? "#10b981" : avg >= 5 ? "#f59e0b" : "#ef4444" }}>{avg}</div>
                <div style={{ fontSize: 10, color: "#475569" }}>out of 10</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px", borderRadius: 100, background: rec.color + "22", border: `1px solid ${rec.color}`, marginBottom: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: rec.color, flexShrink: 0, display: "inline-block" }} />
                  <span style={{ color: rec.color, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>{rec.verdict}</span>
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>{rec.summary}</div>
              </div>
            </div>

            {/* Section audit */}
            <div style={{ padding: "22px 40px", borderBottom: "1px solid #1e293b" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 14 }}>Detailed Audit Results</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {SECTIONS.map(s => {
                  const sc = scores[s.id];
                  const c  = sc >= 8 ? "#10b981" : sc >= 6 ? "#f59e0b" : "#ef4444";
                  const lbl = sc >= 8 ? "Good" : sc >= 6 ? "Needs Work" : "Critical";
                  return (
                    <div key={s.id} style={{ background: "#0a0f1a", border: "1px solid #1e293b", borderRadius: 9, padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                        <span style={{ fontSize: 15 }}>{s.icon}</span>
                        <span style={{ fontWeight: 700, fontSize: 12, flex: 1 }}>{s.label}</span>
                        <span style={{ fontSize: 9, fontWeight: 700, color: c, background: c + "22", border: `1px solid ${c}33`, borderRadius: 20, padding: "2px 7px" }}>{lbl}</span>
                        <span style={{ fontSize: 15, fontWeight: 900, color: c, minWidth: 38, textAlign: "right" }}>{sc}/10</span>
                      </div>
                      <ScoreBar score={sc} />
                      <div style={{ marginTop: 7, fontSize: 11, color: "#64748b", lineHeight: 1.6 }}>{notes[s.id]}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Package recommendations */}
            <div style={{ padding: "22px 40px", borderBottom: "1px solid #1e293b" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 14 }}>Package Recommendations</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {PACKAGES.map(pkg => {
                  const r    = getPkgRating(pkg.id, rec.pkg);
                  const isR  = pkg.id === rec.pkg;
                  return (
                    <div key={pkg.id} style={{ background: isR ? "rgba(0,209,178,0.07)" : "#0a0f1a", border: `1px solid ${isR ? "rgba(0,209,178,0.35)" : "#1e293b"}`, borderRadius: 9, padding: "12px 14px", position: "relative" }}>
                      {isR && <div style={{ position: "absolute", top: -9, right: 8, background: TEAL, color: "#000", fontSize: 8, fontWeight: 800, padding: "2px 8px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.1em" }}>★ Recommended</div>}
                      <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 2 }}>{pkg.label}</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: isR ? TEAL : "#fff", marginBottom: 5 }}>{pkg.price}</div>
                      <Stars n={r.stars} />
                      <div style={{ fontSize: 10, color: "#64748b", marginTop: 5, lineHeight: 1.5 }}>{r.note}</div>
                    </div>
                  );
                })}
              </div>

              {/* Suggested add-ons */}
              {suggestedAddons.length > 0 && (
                <div style={{ marginTop: 12, background: "#0a0f1a", border: "1px solid #1e293b", borderRadius: 9, padding: "12px 14px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Also Recommended — Based on Audit Findings</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {suggestedAddons.map(id => (
                      <span key={id} style={{ fontSize: 10, color: TEAL, background: "rgba(0,209,178,0.08)", border: "1px solid rgba(0,209,178,0.2)", borderRadius: 6, padding: "3px 9px" }}>
                        {ADDON_LABELS[id] || id}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CTA — screen only */}
            <div className="np" style={{ padding: "18px 40px", background: "rgba(249,158,11,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>Ready to see the numbers?</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>This button opens the quote builder pre-filled based on this report.</div>
              </div>
              <a href={quoteUrl} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 22px", borderRadius: 8, background: "#f59e0b", color: "#000", fontWeight: 800, fontSize: 13, textDecoration: "none" }}>
                Build Quote from this Report →
              </a>
            </div>

            {/* Footer */}
            <div style={{ padding: "14px 40px", borderTop: "1px solid #1e293b", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
              <div style={{ fontSize: 9, color: "#475569" }}>Prepared by Directive OS · {DATE} · directiveos.com.au · 02 5850 4038</div>
              <div style={{ fontSize: 9, color: "#475569" }}>Confidential — prepared for {clientName} only</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
