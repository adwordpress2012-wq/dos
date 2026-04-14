import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";

const TEAL  = "#00d1b2";
const NAVY  = "#0a0f1a";
const DARK  = "#0f172a";
const SLATE = "#64748b";

const SECTIONS = [
  { id: "design",     label: "Design & Visual Appeal",     icon: "🎨", defaultScore: 5,
    defaultNote: "WordPress theme with dated aesthetics. Dual navigation bars create visual clutter. Generic layout with no clear brand differentiation from competitors. Logo has scaling artefacts on mobile devices." },
  { id: "seo",        label: "SEO & Organic Search Traffic", icon: "🔍", defaultScore: 6,
    defaultNote: "Some suburb-specific landing pages in place — a positive foundation. However, duplicate navigation menus inflate code bloat, hurting page score. Meta descriptions need optimisation across all pages. No Schema markup detected, missing a significant ranking signal." },
  { id: "mobile",     label: "Mobile & Responsiveness",    icon: "📱", defaultScore: 6,
    defaultNote: "Responsive hamburger menu in place and WebP image format is a positive step. However, the heavy navigation structure and embedded third-party widgets may create friction on smaller screens where most buyer enquiries originate." },
  { id: "speed",      label: "Page Speed & Performance",   icon: "⚡", defaultScore: 4,
    defaultNote: "Multiple third-party scripts detected including Calendly, reCAPTCHA, and a property search widget. WordPress with likely heavy plugin load. Estimated load time 5–10 seconds on mobile — well above the 3-second threshold that directly affects Google rankings and lead conversion." },
  { id: "content",    label: "Content Quality & Clarity",  icon: "📝", defaultScore: 6,
    defaultNote: "Solid local area focus with suburb-specific pages. Homepage copy is generic and fails to differentiate from competitors. No clear unique value proposition visible above the fold — prospects will bounce to the next agency." },
  { id: "conversion", label: "Trust & Lead Conversion",    icon: "🎯", defaultScore: 5,
    defaultNote: "Contact details and social links visible. Calendly booking is a positive touch. However, no testimonials or Google Reviews are featured on the homepage, and reCAPTCHA on all forms adds friction that measurably reduces enquiry submissions." },
  { id: "security",   label: "Security & Technical Health", icon: "🔒", defaultScore: 6,
    defaultNote: "HTTPS is in place. WordPress setup carries inherent plugin vulnerability risk without regular hardening and updates. Each plugin update is a potential breaking point. An unmaintained WordPress site is one of the most common vectors for website hacking and defacement." },
];

const PACKAGES = [
  { id: "starter",      label: "Starter Rebuild",      price: "$1,800",  desc: "Up to 5 pages redesigned and rebuilt. Perfect for agencies wanting a modern, fast website without a full overhaul." },
  { id: "business",     label: "Business Rebuild",     price: "$3,500",  desc: "Up to 10 pages rebuilt. Full content migration, SEO structure, lead capture forms and CRM-ready contact pages." },
  { id: "professional", label: "Professional Rebuild", price: "$5,200",  desc: "Up to 15 pages. Premium design, suburb SEO landing pages, speed optimisation, and advanced integrations included." },
  { id: "enterprise",   label: "Enterprise Rebuild",   price: "$7,500+", desc: "20+ pages. Full platform rebuild with listing feeds, CRM integration, custom features and dedicated project manager." },
];

const ADDON_LABELS: Record<string, string> = {
  ai:          "AI Receptionist — Sarah (never miss a call, 24/7)",
  seo:         "SEO Foundation Package — suburb keyword targeting",
  analytics:   "Google Analytics + Search Console setup",
  speed:       "Speed & Performance Optimisation",
  copywriting: "Professional Copywriting (per page)",
  forms:       "Custom Lead Capture Forms",
  security:    "Security Hardening & SSL Optimisation",
  chat:        "Live Chat Integration",
  vaultre:     "VaultRE CRM Integration",
  rex:         "Rex Software CRM Integration",
  propertyme:  "PropertyMe Integration",
  rea:         "realestate.com.au Listing Feed",
  domain:      "Domain.com.au Listing Feed",
  crm:         "Custom CRM / API Integration",
};

function getRec(avg: number): { pkg: string; verdict: string; color: string; summary: string } {
  if (avg >= 8)   return { pkg: "starter",      verdict: "MINOR IMPROVEMENTS ONLY",    color: "#10b981", summary: "This site is in reasonable shape. Targeted improvements will deliver better ROI than a full rebuild right now." };
  if (avg >= 6.5) return { pkg: "starter",      verdict: "PARTIAL REFRESH RECOMMENDED", color: "#f97316", summary: "Solid foundations but the design and technical areas need a refresh to stay competitive in today's market." };
  if (avg >= 4.5) return { pkg: "business",     verdict: "FULL REBUILD RECOMMENDED",    color: "#f97316", summary: "Multiple structural issues identified. A purpose-built website will significantly outperform patching the existing site." };
  return           { pkg: "professional",  verdict: "URGENT REBUILD REQUIRED",     color: "#ef4444", summary: "Critical issues across multiple areas. This site is actively costing you leads and revenue every day it stays live." };
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
  const c = score >= 8 ? "#10b981" : score >= 6 ? "#f97316" : "#ef4444";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ flex: 1, height: 6, background: "#e2e8f0", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${score * 10}%`, height: "100%", background: c, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 800, color: c, minWidth: 38, textAlign: "right" }}>{score}/10</span>
    </div>
  );
}

function ScoreDot({ score }: { score: number }) {
  const c = score >= 8 ? "#10b981" : score >= 6 ? "#f97316" : "#ef4444";
  const lbl = score >= 8 ? "Good" : score >= 6 ? "Fair" : "Critical";
  return (
    <span style={{ fontSize: 9, fontWeight: 700, color: c, background: c + "18", border: `1px solid ${c}35`, borderRadius: 20, padding: "2px 9px", whiteSpace: "nowrap" }}>{lbl}</span>
  );
}

export default function HealthCheck() {
  const [clientName,  setClientName]  = useState("HighSpec Properties");
  const [clientUrl,   setClientUrl]   = useState("highspecproperties.com.au");
  const [contactName, setContactName] = useState("Amanda");
  const [editing,     setEditing]     = useState(false);
  const [showSliders, setShowSliders] = useState(false);
  const [scores,      setScores]      = useState<Record<string,number>>(Object.fromEntries(SECTIONS.map(s => [s.id, s.defaultScore])));
  const [notes,       setNotes]       = useState<Record<string,string>>(Object.fromEntries(SECTIONS.map(s => [s.id, s.defaultNote])));

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
    const p = new URLSearchParams({ type: "rebuild", pkg: rec.pkg, client: clientName, contact: contactName, addons: suggestedAddons.join(",") });
    return `/marketing/web-quote?${p.toString()}`;
  }, [rec, clientName, contactName, suggestedAddons]);

  const DATE   = new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
  const REF    = `DOS-HC-${String(Date.now()).slice(-4)}`;
  const scoreC = avg >= 7.5 ? "#10b981" : avg >= 5 ? "#f97316" : "#ef4444";

  const worstSections = [...SECTIONS].sort((a,b) => scores[a.id] - scores[b.id]).slice(0, 3);

  const inp = (active: boolean): React.CSSProperties => ({
    background: "transparent", border: "none",
    borderBottom: active ? `1px dashed ${TEAL}` : "none",
    outline: "none", color: "inherit", font: "inherit",
    width: "100%", cursor: active ? "text" : "default",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "Inter, sans-serif", color: DARK }}>
      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 8mm 12mm; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body { margin:0!important; background:#fff!important; }
          .np { display:none!important; }
          .print-break { page-break-before: always; break-before: always; }
          .no-break { page-break-inside: avoid; break-inside: avoid; }
          .page { max-width: 100% !important; width: 100% !important; margin: 0 !important;
            box-shadow: none !important; border-radius: 0 !important; overflow: visible !important; }
        }
        input, textarea { background:transparent; border:none; outline:none; color:inherit; font:inherit; }
        textarea:focus, input:focus { border-bottom:1px dashed ${TEAL}; }
        input[type=range] { -webkit-appearance:none; width:100%; height:5px; border-radius:3px; outline:none; cursor:pointer; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:16px; height:16px; border-radius:50%; background:${TEAL}; cursor:pointer; box-shadow:0 0 0 3px rgba(0,209,178,0.2); }
      `}</style>

      {/* ── Toolbar (screen only) ── */}
      <div className="np" style={{ padding: "10px 20px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 10, background: "#fff", position: "sticky", top: 0, zIndex: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", flexWrap: "wrap" }}>
        <Link href="/marketing" style={{ color: SLATE, fontSize: 12, textDecoration: "none" }}>← Marketing</Link>
        <span style={{ color: "#e2e8f0" }}>|</span>
        <span style={{ fontWeight: 700, fontSize: 13, color: DARK }}>Health Check Builder</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 7, flexWrap: "wrap" }}>
          <button onClick={() => setShowSliders(s => !s)} style={{ padding: "6px 12px", borderRadius: 7, border: `1px solid ${showSliders ? TEAL : "#e2e8f0"}`, background: showSliders ? "rgba(0,209,178,0.08)" : "#fff", color: showSliders ? TEAL : SLATE, fontWeight: 600, cursor: "pointer", fontSize: 12 }}>
            ⚙ Scores {showSliders ? "▲" : "▼"}
          </button>
          <button onClick={() => setEditing(e => !e)} style={{ padding: "6px 12px", borderRadius: 7, border: `1px solid ${editing ? TEAL : "#e2e8f0"}`, background: editing ? "rgba(0,209,178,0.08)" : "#fff", color: editing ? TEAL : SLATE, fontWeight: 600, cursor: "pointer", fontSize: 12 }}>
            {editing ? "✓ Done Editing" : "✏ Edit Details"}
          </button>
          <a href={quoteUrl} style={{ padding: "6px 14px", borderRadius: 7, background: TEAL, color: "#000", fontWeight: 700, fontSize: 12, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5 }}>
            Build Quote →
          </a>
          <button onClick={() => window.print()} style={{ padding: "6px 14px", borderRadius: 7, border: "none", background: NAVY, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>
            🖨 Print / PDF
          </button>
        </div>
      </div>

      {/* ── Score Sliders Panel (collapsible, screen only) ── */}
      {showSliders && (
        <div className="np" style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "16px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "14px 24px" }}>
            {SECTIONS.map(s => {
              const sc = scores[s.id];
              const c  = sc >= 8 ? "#10b981" : sc >= 6 ? "#f97316" : "#ef4444";
              return (
                <div key={s.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: SLATE }}>{s.icon} {s.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 800, color: c }}>{sc}/10</span>
                  </div>
                  <input type="range" min={1} max={10} value={sc}
                    onChange={e => setScores(p => ({ ...p, [s.id]: Number(e.target.value) }))}
                    style={{ background: `linear-gradient(to right, ${c} ${sc * 10}%, #e2e8f0 ${sc * 10}%)` }}
                  />
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: SLATE, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>Edit Section Notes (visible in report)</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 10 }}>
              {SECTIONS.map(s => (
                <div key={s.id}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: SLATE, marginBottom: 3 }}>{s.icon} {s.label}</div>
                  <textarea value={notes[s.id]} onChange={e => setNotes(p => ({ ...p, [s.id]: e.target.value }))}
                    rows={2} style={{ width: "100%", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 6, padding: "6px 10px", color: DARK, fontSize: 11, lineHeight: 1.55, resize: "vertical", fontFamily: "Inter, sans-serif", boxSizing: "border-box" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── REPORT DOCUMENT ── */}
      <div style={{ padding: "24px 20px 60px" }}>
        <div className="page" style={{ maxWidth: 800, margin: "0 auto", background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 24px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>

          {/* ═══ PAGE 1: HEADER + EXECUTIVE SUMMARY ═══ */}

          {/* Header — dark navy */}
          <div style={{ background: NAVY, padding: "30px 48px 26px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <img src="/logo.png" alt="Directive OS" style={{ width: 48, height: 48, objectFit: "contain", filter: "drop-shadow(0 0 10px rgba(0,209,178,0.4))" }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: 17, color: "#fff", letterSpacing: "-0.3px" }}>Directive OS</div>
                  <div style={{ color: TEAL, fontSize: 8, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", marginTop: 2 }}>Web Solutions & AI Services</div>
                </div>
              </div>
              <div style={{ textAlign: "right", lineHeight: 1.9 }}>
                <div style={{ fontSize: 10, color: "#94a3b8" }}>{DATE}</div>
                <div style={{ fontSize: 10, color: "#94a3b8" }}>Ref: {REF}</div>
                <div style={{ fontSize: 10, color: TEAL }}>directiveos.com.au</div>
                <div style={{ fontSize: 10, color: "#94a3b8" }}>02 5850 4038</div>
              </div>
            </div>
            <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ fontSize: 8, color: TEAL, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.22em", marginBottom: 6 }}>
                Website Health Check Report — Prepared For
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", lineHeight: 1.1 }}>
                <input readOnly={!editing} value={clientName} onChange={e => setClientName(e.target.value)} style={{ ...inp(editing), color: "#fff" }} />
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 6, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, color: "#64748b" }}>🌐 <input readOnly={!editing} value={clientUrl} onChange={e => setClientUrl(e.target.value)} style={{ ...inp(editing), display: "inline", width: 220, color: "#64748b" }} /></span>
                <span style={{ fontSize: 11, color: "#64748b" }}>Attention: <input readOnly={!editing} value={contactName} onChange={e => setContactName(e.target.value)} style={{ ...inp(editing), display: "inline", width: 160, color: "#64748b" }} /></span>
              </div>
            </div>
          </div>

          {/* Teal accent line */}
          <div style={{ height: 4, background: `linear-gradient(90deg, ${TEAL}, #00b4a0 60%, #009986)` }} />

          {/* Executive Summary */}
          <div className="no-break" style={{ padding: "28px 48px", background: "#fff", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 28, flexWrap: "wrap" }}>
              {/* Score circle */}
              <div style={{ textAlign: "center", flexShrink: 0 }}>
                <div style={{ width: 90, height: 90, borderRadius: "50%", border: `5px solid ${scoreC}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
                  <div style={{ fontSize: 32, fontWeight: 900, lineHeight: 1, color: scoreC }}>{avg}</div>
                  <div style={{ fontSize: 9, color: SLATE, marginTop: 1 }}>out of 10</div>
                </div>
                <div style={{ fontSize: 8, color: SLATE, marginTop: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Overall Score</div>
              </div>
              {/* Verdict + summary */}
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", borderRadius: 100, background: rec.color + "15", border: `1px solid ${rec.color}40`, marginBottom: 10 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: rec.color, display: "inline-block", flexShrink: 0 }} />
                  <span style={{ color: rec.color, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>{rec.verdict}</span>
                </div>
                <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.7 }}>{rec.summary}</div>
              </div>
            </div>
          </div>

          {/* Top 3 Critical Findings */}
          <div className="no-break" style={{ padding: "0 48px 28px", background: "#fff" }}>
            <div style={{ background: "#f8fafc", border: `1px solid ${TEAL}30`, borderLeft: `3px solid ${TEAL}`, borderRadius: 8, padding: "16px 20px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 12 }}>
                Key Areas Requiring Attention
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {worstSections.map(s => {
                  const sc = scores[s.id];
                  const c = sc >= 8 ? "#10b981" : sc >= 6 ? "#f97316" : "#ef4444";
                  return (
                    <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 14 }}>{s.icon}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: DARK, flex: 1 }}>{s.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 800, color: c }}>{sc}/10</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ═══ PAGE 2: DETAILED AUDIT ═══ */}
          <div className="print-break" style={{ background: "#f8fafc", borderTop: "2px solid #e2e8f0" }}>
            <div style={{ padding: "28px 48px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <span style={{ display: "inline-block", width: 28, height: 3, background: TEAL, borderRadius: 2 }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.16em" }}>Detailed Audit Results</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {SECTIONS.map(s => {
                  const sc = scores[s.id];
                  const c  = sc >= 8 ? "#10b981" : sc >= 6 ? "#f97316" : "#ef4444";
                  return (
                    <div key={s.id} className="no-break" style={{ background: "#fff", border: "1px solid #e2e8f0", borderLeft: `4px solid ${c}`, borderRadius: 9, padding: "14px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                        <span style={{ fontSize: 16 }}>{s.icon}</span>
                        <span style={{ fontWeight: 700, fontSize: 13, flex: 1, color: DARK }}>{s.label}</span>
                        <ScoreDot score={sc} />
                        <span style={{ fontSize: 18, fontWeight: 900, color: c, minWidth: 40, textAlign: "right" }}>{sc}/10</span>
                      </div>
                      <ScoreBar score={sc} />
                      <div style={{ marginTop: 10, fontSize: 11.5, color: "#475569", lineHeight: 1.75 }}>
                        {editing
                          ? <textarea value={notes[s.id]} onChange={e => setNotes(p => ({ ...p, [s.id]: e.target.value }))}
                              rows={3} style={{ width: "100%", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 5, padding: "6px 10px", color: DARK, fontSize: 11.5, lineHeight: 1.75, resize: "vertical", fontFamily: "Inter, sans-serif", boxSizing: "border-box" }} />
                          : notes[s.id]
                        }
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ═══ PAGE 3: VALUE PROPS + RECOMMENDATIONS ═══ */}

          {/* What this means for your business */}
          <div className="print-break" style={{ background: "#fff", borderTop: "2px solid #e2e8f0" }}>
            <div style={{ padding: "28px 48px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <span style={{ display: "inline-block", width: 28, height: 3, background: TEAL, borderRadius: 2 }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.16em" }}>What This Means For Your Business</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {/* SEO */}
                <div className="no-break" style={{ background: "#f0fdf9", border: `1px solid ${TEAL}30`, borderRadius: 10, padding: "18px 20px" }}>
                  <div style={{ fontSize: 20, marginBottom: 8 }}>📈</div>
                  <div style={{ fontWeight: 800, fontSize: 13, color: DARK, marginBottom: 6 }}>SEO & Organic Traffic</div>
                  <div style={{ fontSize: 11.5, color: "#334155", lineHeight: 1.75 }}>
                    Every website we build is structured for organic Google ranking from day one. We build suburb-specific landing pages, Schema markup, and page speed scores that put you in front of buyers actively searching — without paying for every click.
                  </div>
                </div>
                {/* Security & Updates */}
                <div className="no-break" style={{ background: "#f0fdf9", border: `1px solid ${TEAL}30`, borderRadius: 10, padding: "18px 20px" }}>
                  <div style={{ fontSize: 20, marginBottom: 8 }}>🔐</div>
                  <div style={{ fontWeight: 800, fontSize: 13, color: DARK, marginBottom: 6 }}>No More Updates. No More Security Risks.</div>
                  <div style={{ fontSize: 11.5, color: "#334155", lineHeight: 1.75 }}>
                    WordPress requires constant plugin updates — every one is a potential breaking point or security vulnerability. We build on a modern, managed platform with enterprise-grade security. You never touch the backend again. We handle everything.
                  </div>
                </div>
                {/* Hosting */}
                <div className="no-break" style={{ background: "#f0fdf9", border: `1px solid ${TEAL}30`, borderRadius: 10, padding: "18px 20px" }}>
                  <div style={{ fontSize: 20, marginBottom: 8 }}>☁️</div>
                  <div style={{ fontWeight: 800, fontSize: 13, color: DARK, marginBottom: 6 }}>Enterprise Hosting Included</div>
                  <div style={{ fontSize: 11.5, color: "#334155", lineHeight: 1.75 }}>
                    Your new website is hosted on our high-availability infrastructure — fast Australian servers, daily backups, SSL, and a 99.9% uptime guarantee. No separate hosting bills, no migrations, no surprises.
                  </div>
                </div>
                {/* Ownership */}
                <div className="no-break" style={{ background: "#f0fdf9", border: `1px solid ${TEAL}30`, borderRadius: 10, padding: "18px 20px" }}>
                  <div style={{ fontSize: 20, marginBottom: 8 }}>✅</div>
                  <div style={{ fontWeight: 800, fontSize: 13, color: DARK, marginBottom: 6 }}>You Own Your Website Files</div>
                  <div style={{ fontSize: 11.5, color: "#334155", lineHeight: 1.75 }}>
                    Every line of code, every image, every page we build belongs to you. At any time, you can take your files and host them anywhere. The AI platform (Sarah) is Directive OS — that stays with us. Your website is yours, always.
                  </div>
                </div>
              </div>
            </div>

            {/* Package Options */}
            <div style={{ padding: "8px 48px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <span style={{ display: "inline-block", width: 28, height: 3, background: TEAL, borderRadius: 2 }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.16em" }}>Your Options</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                {PACKAGES.map(pkg => {
                  const isR = pkg.id === rec.pkg;
                  return (
                    <div key={pkg.id} className="no-break" style={{ background: isR ? "#f0fdf9" : "#f8fafc", border: `1px solid ${isR ? TEAL : "#e2e8f0"}`, borderTop: isR ? `3px solid ${TEAL}` : "3px solid transparent", borderRadius: 9, padding: "16px 14px", position: "relative" }}>
                      {isR && (
                        <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%) translateY(-50%)", background: TEAL, color: "#000", fontSize: 8, fontWeight: 800, padding: "2px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
                          ★ Recommended
                        </div>
                      )}
                      <div style={{ fontWeight: 700, fontSize: 12, color: DARK, marginBottom: 4 }}>{pkg.label}</div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: isR ? TEAL : DARK, marginBottom: 8 }}>{pkg.price}</div>
                      <div style={{ fontSize: 10.5, color: SLATE, lineHeight: 1.65 }}>{pkg.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommended Add-ons */}
            {suggestedAddons.length > 0 && (
              <div style={{ padding: "0 48px 24px" }}>
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 9, padding: "16px 20px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: SLATE, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
                    Also Recommended — Based on Your Audit Findings
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                    {suggestedAddons.map(id => (
                      <span key={id} style={{ fontSize: 10.5, color: TEAL, background: "rgba(0,209,178,0.08)", border: "1px solid rgba(0,209,178,0.25)", borderRadius: 6, padding: "4px 12px", fontWeight: 500 }}>
                        {ADDON_LABELS[id] || id}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* What's Included in Every Build */}
            <div style={{ padding: "0 48px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ display: "inline-block", width: 28, height: 3, background: TEAL, borderRadius: 2 }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.16em" }}>What's Included in Every Build</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 24px" }}>
                {[
                  "Custom design — matched to your brand",
                  "Mobile-first responsive layout",
                  "On-page SEO optimisation (every page)",
                  "Google Analytics + Search Console setup",
                  "Australian hosting — fast, secure, reliable",
                  "SSL certificate included",
                  "Daily automated backups",
                  "30-day post-launch support period",
                  "No WordPress — no plugin headaches",
                  "You own 100% of your website files",
                ].map(item => (
                  <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 11, color: "#334155", lineHeight: 1.5 }}>
                    <span style={{ color: TEAL, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Next Step CTA */}
            <div className="np" style={{ margin: "0 48px 24px", background: `linear-gradient(135deg, ${NAVY}, #0d1f2d)`, borderRadius: 10, padding: "22px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, color: "#fff", marginBottom: 4 }}>Ready to see the full investment?</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>Build a detailed quote from this report — pre-filled and ready to send.</div>
              </div>
              <a href={quoteUrl} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 8, background: TEAL, color: "#000", fontWeight: 800, fontSize: 13, textDecoration: "none", whiteSpace: "nowrap" }}>
                Build Quote from this Report →
              </a>
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: "14px 48px", background: NAVY, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
            <div>
              <span style={{ fontSize: 9, color: "#475569" }}>Prepared by Directive OS · Web Solutions & AI Services</span>
              <span style={{ fontSize: 9, color: "#334155" }}> · {DATE} · directiveos.com.au · 02 5850 4038</span>
            </div>
            <div style={{ fontSize: 9, color: "#334155" }}>Confidential — prepared exclusively for {clientName}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
