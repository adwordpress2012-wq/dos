import { useState, useMemo, useEffect } from "react";

const TEAL = "#00d1b2";
const NAVY = "#0a0f1a";

const today = new Date();
const DATE = today.toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
const EXPIRY = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });

const BASE_PACKAGES = {
  new: [
    { id: "starter", name: "Starter", pages: "Up to 5 pages", price: 2500, desc: "Home, About, Services, Contact + 1 more" },
    { id: "business", name: "Business", pages: "Up to 10 pages", price: 4500, desc: "Full business site with service sub-pages" },
    { id: "professional", name: "Professional", pages: "Up to 15 pages", price: 6500, desc: "Comprehensive site with advanced sections" },
    { id: "enterprise", name: "Enterprise", pages: "20+ pages", price: 9500, desc: "Large-scale site, multiple departments" },
  ],
  rebuild: [
    { id: "starter", name: "Starter Rebuild", pages: "Up to 5 pages", price: 1800, desc: "Redesign & modernise existing 5-page site" },
    { id: "business", name: "Business Rebuild", pages: "Up to 10 pages", price: 3500, desc: "Full redesign with content migration" },
    { id: "professional", name: "Professional Rebuild", pages: "Up to 15 pages", price: 5200, desc: "Premium redesign + performance overhaul" },
    { id: "enterprise", name: "Enterprise Rebuild", pages: "20+ pages", price: 7500, desc: "Complete platform rebuild & migration" },
  ],
};

const ADDONS = [
  { id: "ecommerce", label: "E-Commerce / Online Shop", price: 1500, unit: "one-off", category: "Features" },
  { id: "booking", label: "Booking System / Calendar", price: 800, unit: "one-off", category: "Features" },
  { id: "members", label: "Members Area / Client Login", price: 1200, unit: "one-off", category: "Features" },
  { id: "blog", label: "Blog / News Section", price: 400, unit: "one-off", category: "Features" },
  { id: "forms", label: "Custom Forms & Lead Capture", price: 350, unit: "one-off", category: "Features" },
  { id: "chat", label: "Live Chat Integration", price: 300, unit: "one-off", category: "Features" },
  { id: "ai", label: "AI Receptionist — Directive OS (Sarah)", price: 1800, unit: "one-off", category: "AI & Automation", monthly: 299 },
  { id: "seo", label: "SEO Foundation Package", price: 600, unit: "one-off", category: "Marketing" },
  { id: "analytics", label: "Google Analytics + Search Console", price: 200, unit: "one-off", category: "Marketing" },
  { id: "logo", label: "Logo Design", price: 500, unit: "one-off", category: "Design" },
  { id: "copywriting", label: "Copywriting (per page)", price: 150, unit: "per page", category: "Content" },
  { id: "vaultre", label: "VaultRE CRM Integration", price: 900, unit: "one-off", category: "Integrations" },
  { id: "rex", label: "Rex Software CRM Integration", price: 900, unit: "one-off", category: "Integrations" },
  { id: "propertyme", label: "PropertyMe Integration", price: 800, unit: "one-off", category: "Integrations" },
  { id: "rea", label: "realestate.com.au Listing Feed", price: 500, unit: "one-off", category: "Integrations" },
  { id: "domain", label: "Domain.com.au Listing Feed", price: 500, unit: "one-off", category: "Integrations" },
  { id: "crm", label: "Custom CRM / API Integration", price: 1200, unit: "one-off", category: "Integrations" },
  { id: "speed", label: "Speed & Performance Optimisation", price: 400, unit: "one-off", category: "Technical" },
  { id: "security", label: "Security Hardening & SSL Setup", price: 150, unit: "one-off", category: "Technical" },
  { id: "hosting", label: "Domain & Hosting Setup", price: 99, unit: "one-off", category: "Technical" },
  { id: "maintenance", label: "Monthly Maintenance & Support", price: 199, unit: "per month", category: "Ongoing" },
];

const CATEGORIES = ["Features", "AI & Automation", "Marketing", "Design", "Content", "Integrations", "Technical", "Ongoing"];

const DEFAULT_TIMELINE = [
  { week: "Week 1",      title: "Discovery & Design Brief",       desc: "Kick-off call, gather all content, photos, brand assets. Present homepage design mockup for approval." },
  { week: "Week 2",      title: "Design Sign-Off & Build Begins", desc: "Full design approved. Development starts across all pages. Any integrations (CRM, feeds) initiated." },
  { week: "Weeks 3–4",   title: "Full Site Build",                desc: "All pages built. Live listing sync and integrations tested. Suburb SEO pages written and loaded." },
  { week: "Week 5",      title: "Testing & Client Walkthrough",   desc: "Full QA testing across all devices and browsers. Walkthrough call with your team. Revisions actioned." },
  { week: "Week 6",      title: "Launch & Go Live",               desc: "DNS migration from current host. Zero-downtime handover. SSL, CDN, and daily backups confirmed." },
  { week: "Post-launch", title: "30-Day Support Period",          desc: "Priority response on all issues. Weekly check-in. Fine-tune based on real-world performance." },
];

function fmt(n: number) {
  return "$" + n.toLocaleString("en-AU");
}

export default function WebQuote() {
  const [projectType, setProjectType] = useState<"new" | "rebuild">("new");
  const [selectedPackage, setSelectedPackage] = useState("business");
  const [addons, setAddons] = useState<Record<string, boolean>>({});
  const [copywritingPages, setCopywritingPages] = useState(5);
  const [discount, setDiscount] = useState(0);
  const [clientName, setClientName] = useState("Client Business Name");
  const [contactName, setContactName] = useState("Contact Name");
  const [projectTitle, setProjectTitle] = useState("Website Project");
  const [notes, setNotes] = useState("");
  const [editing, setEditing] = useState(false);
  const [timeline, setTimeline] = useState(DEFAULT_TIMELINE);

  const updateMilestone = (i: number, field: "week" | "title" | "desc", val: string) =>
    setTimeline(prev => prev.map((m, idx) => idx === i ? { ...m, [field]: val } : m));

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const type    = p.get("type") as "new" | "rebuild" | null;
    const pkg     = p.get("pkg");
    const client  = p.get("client");
    const contact = p.get("contact");
    const addonsP = p.get("addons");
    if (type)    setProjectType(type);
    if (pkg)     setSelectedPackage(pkg);
    if (client)  setClientName(decodeURIComponent(client));
    if (contact) setContactName(decodeURIComponent(contact));
    if (addonsP) {
      const ids = addonsP.split(",").filter(Boolean);
      setAddons(prev => { const n = { ...prev }; ids.forEach(id => { n[id] = true; }); return n; });
    }
  }, []);

  const packages = BASE_PACKAGES[projectType];
  const basePkg = packages.find(p => p.id === selectedPackage) || packages[1];

  const addonTotal = useMemo(() => {
    return ADDONS.reduce((sum, a) => {
      if (!addons[a.id]) return sum;
      if (a.id === "copywriting") return sum + a.price * copywritingPages;
      return sum + a.price;
    }, 0);
  }, [addons, copywritingPages]);

  const monthlyTotal = useMemo(() => {
    return ADDONS.reduce((sum, a) => {
      if (!addons[a.id] || !a.monthly) return sum;
      return sum + a.monthly;
    }, addons["maintenance"] ? 199 : 0);
  }, [addons]);

  const subtotal = basePkg.price + addonTotal;
  const discountAmt = Math.round(subtotal * (discount / 100));
  const total = subtotal - discountAmt;
  const deposit = Math.round(total * 0.5);
  const balance = total - deposit;

  const selectedAddons = ADDONS.filter(a => addons[a.id]);

  const toggleAddon = (id: string) => setAddons(prev => ({ ...prev, [id]: !prev[id] }));

  const inputStyle = (editing: boolean): React.CSSProperties => ({
    background: "transparent",
    border: "none",
    borderBottom: editing ? `1px dashed ${TEAL}` : "none",
    outline: "none",
    color: "inherit",
    font: "inherit",
    width: "100%",
    cursor: editing ? "text" : "default",
  });

  return (
    <div style={{ minHeight: "100vh", background: NAVY, fontFamily: "Inter, sans-serif", color: "#fff" }}>
      <style>{`
        @media print {
          @page { size: A4; margin: 10mm 12mm; }
          body { margin: 0 !important; background: #0d1424 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .page { box-shadow: none !important; border-radius: 0 !important; max-width: 100% !important; margin: 0 !important; }
        }
        input, textarea { background: transparent; border: none; outline: none; color: inherit; font: inherit; }
        input:focus, textarea:focus { border-bottom: 1px dashed ${TEAL}; }
        .addon-row:hover { background: rgba(0,209,178,0.05); }
      `}</style>

      {/* Controls bar */}
      <div className="no-print" style={{ padding: "16px 24px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", background: "#0d1424", position: "sticky", top: 0, zIndex: 10 }}>
        <a href="/marketing" style={{ color: "#64748b", fontSize: 13, textDecoration: "none", marginRight: 8 }}>← Marketing</a>

        <div style={{ display: "flex", gap: 0, border: "1px solid #1e293b", borderRadius: 8, overflow: "hidden" }}>
          {(["new", "rebuild"] as const).map(t => (
            <button key={t} onClick={() => setProjectType(t)} style={{ padding: "7px 16px", border: "none", background: projectType === t ? TEAL : "transparent", color: projectType === t ? "#000" : "#94a3b8", fontWeight: 700, cursor: "pointer", fontSize: 12, textTransform: "capitalize" }}>
              {t === "new" ? "New Build" : "Rebuild"}
            </button>
          ))}
        </div>

        <span style={{ fontSize: 12, color: "#475569" }}>Package:</span>
        {packages.map(p => (
          <button key={p.id} onClick={() => setSelectedPackage(p.id)} style={{ padding: "6px 12px", borderRadius: 7, border: `1px solid ${selectedPackage === p.id ? TEAL : "#1e293b"}`, background: selectedPackage === p.id ? "rgba(0,209,178,0.1)" : "transparent", color: selectedPackage === p.id ? TEAL : "#64748b", fontWeight: 600, cursor: "pointer", fontSize: 12 }}>
            {p.name.replace(" Rebuild", "")}
          </button>
        ))}

        <button onClick={() => setEditing(!editing)} style={{ marginLeft: "auto", padding: "7px 14px", borderRadius: 7, border: `1px solid ${editing ? TEAL : "#1e293b"}`, background: editing ? "rgba(0,209,178,0.1)" : "transparent", color: editing ? TEAL : "#94a3b8", fontWeight: 600, cursor: "pointer", fontSize: 12 }}>
          {editing ? "✓ Done" : "✏ Edit Client"}
        </button>
        <button onClick={() => window.print()} style={{ padding: "7px 16px", borderRadius: 7, border: "none", background: TEAL, color: "#000", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>
          🖨 Print / Save PDF
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", minHeight: "calc(100vh - 57px)" }}>

        {/* LEFT — Add-on selector (no-print) */}
        <div className="no-print" style={{ borderRight: "1px solid #1e293b", overflowY: "auto", maxHeight: "calc(100vh - 57px)", position: "sticky", top: 57 }}>
          <div style={{ padding: "20px" }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Add-Ons & Options</div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 20 }}>Tick to include in the quote</div>

            {CATEGORIES.map(cat => {
              const items = ADDONS.filter(a => a.category === cat);
              return (
                <div key={cat} style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>{cat}</div>
                  {items.map(a => (
                    <div key={a.id} className="addon-row" style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8, cursor: "pointer", marginBottom: 2 }} onClick={() => toggleAddon(a.id)}>
                      <div style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${addons[a.id] ? TEAL : "#334155"}`, background: addons[a.id] ? TEAL : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                        {addons[a.id] && <span style={{ color: "#000", fontSize: 10, fontWeight: 900 }}>✓</span>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 500, color: addons[a.id] ? "#fff" : "#94a3b8" }}>{a.label}</div>
                        <div style={{ fontSize: 10, color: "#475569" }}>
                          {a.id === "copywriting" ? `${fmt(a.price)} × ${copywritingPages} pages = ${fmt(a.price * copywritingPages)}` : fmt(a.price)}
                          {a.monthly ? ` + ${fmt(a.monthly)}/mo` : ""}
                          {a.unit !== "one-off" && a.id !== "copywriting" ? ` (${a.unit})` : ""}
                        </div>
                      </div>
                    </div>
                  ))}
                  {cat === "Content" && addons["copywriting"] && (
                    <div style={{ padding: "6px 10px 6px 36px", display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 11, color: "#64748b" }}>Pages:</span>
                      <input type="number" min={1} max={50} value={copywritingPages} onChange={e => setCopywritingPages(Number(e.target.value))} style={{ width: 60, background: "#111827", border: "1px solid #334155", borderRadius: 5, padding: "3px 8px", color: "#fff", fontSize: 12, textAlign: "center" }} onClick={e => e.stopPropagation()} />
                    </div>
                  )}
                </div>
              );
            })}

            <div style={{ borderTop: "1px solid #1e293b", paddingTop: 16, marginTop: 8 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>Discount (%)</div>
              <input type="number" min={0} max={50} value={discount} onChange={e => setDiscount(Math.min(50, Math.max(0, Number(e.target.value))))} style={{ width: "100%", background: "#111827", border: "1px solid #334155", borderRadius: 7, padding: "8px 12px", color: "#fff", fontSize: 14, fontWeight: 700 }} />
              {discount > 0 && <div style={{ fontSize: 11, color: TEAL, marginTop: 6 }}>Saving: {fmt(discountAmt)}</div>}
            </div>
          </div>
        </div>

        {/* RIGHT — Quote document */}
        <div style={{ overflowY: "auto", padding: "28px 24px 60px" }}>
          <div className="page" style={{ maxWidth: 720, margin: "0 auto", background: "#0d1424", borderRadius: 12, overflow: "hidden", boxShadow: "0 0 40px rgba(0,0,0,0.5)" }}>

            {/* Header */}
            <div style={{ background: "linear-gradient(135deg, #0a0f1a 0%, #0d1f2d 100%)", padding: "36px 44px 28px", borderBottom: `3px solid ${TEAL}`, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -40, right: -40, width: 150, height: 150, borderRadius: "50%", background: "rgba(0,209,178,0.04)", border: "1px solid rgba(0,209,178,0.08)" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <img src="/logo.png" alt="Directive OS" style={{ width: 48, height: 48, objectFit: "contain", filter: "drop-shadow(0 0 8px rgba(0,209,178,0.55))" }} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 18 }}>Directive OS</div>
                    <div style={{ color: TEAL, fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>Web Solutions & AI Services</div>
                  </div>
                </div>
                <div style={{ textAlign: "right", fontSize: 11, color: "#64748b", lineHeight: 1.9 }}>
                  <div>jayson@directiveos.com.au</div>
                  <div>02 5850 4038</div>
                  <div>directiveos.com.au</div>
                </div>
              </div>

              <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid #1e293b" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: 10, color: TEAL, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4 }}>
                      {projectType === "new" ? "Website Build Quote" : "Website Rebuild Quote"} — Prepared For
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 2 }}>
                      <input readOnly={!editing} value={clientName} onChange={e => setClientName(e.target.value)} style={inputStyle(editing)} />
                    </div>
                    <div style={{ fontSize: 13, color: "#94a3b8" }}>
                      Attn: <input readOnly={!editing} value={contactName} onChange={e => setContactName(e.target.value)} style={{ ...inputStyle(editing), width: 200, display: "inline" }} />
                    </div>
                    <div style={{ fontSize: 12, color: "#475569", marginTop: 6, fontStyle: "italic" }}>
                      Project: <input readOnly={!editing} value={projectTitle} onChange={e => setProjectTitle(e.target.value)} style={{ ...inputStyle(editing), width: 240, display: "inline", fontStyle: "italic" }} />
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: "#475569", textAlign: "right", lineHeight: 2 }}>
                    <div>Date: {DATE}</div>
                    <div>Valid: {EXPIRY}</div>
                    <div>Ref: DOS-WEB-{String(today.getTime()).slice(-4)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Base Package */}
            <div style={{ padding: "24px 44px", borderBottom: "1px solid #1e293b" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14 }}>
                Base Package — {basePkg.name}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0a0f1a", border: "1px solid rgba(0,209,178,0.2)", borderRadius: 10, padding: "16px 20px" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{basePkg.name}</div>
                  <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>{basePkg.pages} · {basePkg.desc}</div>
                  <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {["Custom responsive design", "Mobile optimised", "CMS / easy editing", "Contact form", "Basic SEO setup", "1 month support"].map(f => (
                      <span key={f} style={{ fontSize: 10, color: "#64748b", background: "#111827", border: "1px solid #1e293b", borderRadius: 5, padding: "2px 8px" }}>{f}</span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 16 }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: "#fff" }}>{fmt(basePkg.price)}</div>
                  <div style={{ fontSize: 10, color: "#475569" }}>one-time</div>
                </div>
              </div>
            </div>

            {/* Add-ons table */}
            {selectedAddons.length > 0 && (
              <div style={{ padding: "24px 44px", borderBottom: "1px solid #1e293b" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14 }}>Selected Add-Ons</div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #1e293b" }}>
                      <th style={{ textAlign: "left", fontSize: 10, color: "#475569", padding: "6px 0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Item</th>
                      <th style={{ textAlign: "right", fontSize: 10, color: "#475569", padding: "6px 0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedAddons.map(a => (
                      <tr key={a.id} style={{ borderBottom: "1px solid #0f172a" }}>
                        <td style={{ padding: "10px 0", fontSize: 12, color: "#cbd5e1" }}>
                          {a.label}
                          {a.id === "copywriting" && <span style={{ color: "#475569", fontSize: 11 }}> × {copywritingPages} pages</span>}
                          {a.monthly && <span style={{ color: TEAL, fontSize: 10, marginLeft: 6 }}>+ {fmt(a.monthly)}/mo ongoing</span>}
                        </td>
                        <td style={{ padding: "10px 0", textAlign: "right", fontSize: 13, fontWeight: 600, color: "#fff" }}>
                          {a.id === "copywriting" ? fmt(a.price * copywritingPages) : fmt(a.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Totals */}
            <div style={{ padding: "24px 44px", borderBottom: "1px solid #1e293b" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14 }}>Project Summary</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#94a3b8" }}>
                  <span>Base package — {basePkg.name}</span>
                  <span>{fmt(basePkg.price)}</span>
                </div>
                {selectedAddons.length > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#94a3b8" }}>
                    <span>Add-ons ({selectedAddons.length} selected)</span>
                    <span>{fmt(addonTotal)}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#94a3b8", paddingTop: 8, borderTop: "1px solid #1e293b" }}>
                  <span>Subtotal</span>
                  <span>{fmt(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: TEAL }}>
                    <span>Discount ({discount}%)</span>
                    <span>− {fmt(discountAmt)}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: "2px solid rgba(0,209,178,0.3)", marginTop: 4 }}>
                  <span style={{ fontSize: 16, fontWeight: 700 }}>Total Project Investment</span>
                  <span style={{ fontSize: 28, fontWeight: 800, color: TEAL }}>{fmt(total)}</span>
                </div>
              </div>

              {/* Payment schedule */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 }}>
                {[
                  { label: "Deposit (50%)", sublabel: "Due to commence project", value: fmt(deposit), accent: true },
                  { label: "Balance (50%)", sublabel: "Due on project completion", value: fmt(balance), accent: false },
                ].map(({ label, sublabel, value, accent }) => (
                  <div key={label} style={{ background: accent ? "rgba(0,209,178,0.08)" : "#0a0f1a", border: `1px solid ${accent ? "rgba(0,209,178,0.25)" : "#1e293b"}`, borderRadius: 10, padding: "14px 16px" }}>
                    <div style={{ fontSize: 11, color: accent ? TEAL : "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 22, fontWeight: 800 }}>{value}</div>
                    <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>{sublabel}</div>
                  </div>
                ))}
              </div>

              {/* Monthly if applicable */}
              {monthlyTotal > 0 && (
                <div style={{ marginTop: 12, background: "rgba(0,209,178,0.05)", border: "1px solid rgba(0,209,178,0.15)", borderRadius: 8, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>Ongoing Monthly</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>Billed monthly after project delivery</div>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: TEAL }}>{fmt(monthlyTotal)}<span style={{ fontSize: 12, fontWeight: 400, color: "#64748b" }}>/mo</span></div>
                </div>
              )}
            </div>

            {/* Project Timeline */}
            <div style={{ padding: "24px 44px", borderBottom: "1px solid #1e293b" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 18 }}>Project Timeline</div>
              <div style={{ position: "relative" }}>
                {/* Vertical line */}
                <div style={{ position: "absolute", left: 52, top: 12, bottom: 12, width: 2, background: "linear-gradient(to bottom, rgba(0,209,178,0.6), rgba(0,209,178,0.05))", borderRadius: 1 }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {timeline.map((m, i) => {
                    const isLast = i === timeline.length - 1;
                    return (
                      <div key={i} style={{ display: "flex", gap: 0, alignItems: "flex-start", paddingBottom: isLast ? 0 : 20 }}>
                        {/* Week badge */}
                        <div style={{ width: 105, flexShrink: 0, paddingTop: 2, zIndex: 1 }}>
                          <input
                            readOnly={!editing}
                            value={m.week}
                            onChange={e => updateMilestone(i, "week", e.target.value)}
                            style={{ fontSize: 9, fontWeight: 800, color: TEAL, background: "rgba(0,209,178,0.1)", border: editing ? `1px dashed rgba(0,209,178,0.5)` : "1px solid rgba(0,209,178,0.2)", borderRadius: 20, padding: "3px 8px", outline: "none", textAlign: "center", width: "100%", letterSpacing: "0.05em", textTransform: "uppercase", cursor: editing ? "text" : "default", boxSizing: "border-box" }}
                          />
                        </div>
                        {/* Dot */}
                        <div style={{ width: 12, height: 12, borderRadius: "50%", background: i === 0 ? TEAL : "#1e3a4a", border: `2px solid ${TEAL}`, flexShrink: 0, marginTop: 3, marginLeft: -6, marginRight: 14, zIndex: 2, boxShadow: i === 0 ? `0 0 8px rgba(0,209,178,0.5)` : "none" }} />
                        {/* Content */}
                        <div style={{ flex: 1, background: "#0a0f1a", border: "1px solid #1e293b", borderRadius: 9, padding: "11px 14px" }}>
                          <input
                            readOnly={!editing}
                            value={m.title}
                            onChange={e => updateMilestone(i, "title", e.target.value)}
                            style={{ fontSize: 13, fontWeight: 700, color: "#fff", background: "transparent", border: "none", outline: "none", width: "100%", cursor: editing ? "text" : "default", borderBottom: editing ? `1px dashed rgba(0,209,178,0.4)` : "none", marginBottom: 5, display: "block" }}
                          />
                          <textarea
                            readOnly={!editing}
                            value={m.desc}
                            onChange={e => updateMilestone(i, "desc", e.target.value)}
                            rows={2}
                            style={{ fontSize: 11, color: "#64748b", lineHeight: 1.6, background: "transparent", border: "none", outline: "none", width: "100%", cursor: editing ? "text" : "default", resize: editing ? "vertical" : "none", fontFamily: "Inter, sans-serif", padding: 0, display: "block" }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div style={{ padding: "20px 44px", borderBottom: "1px solid #1e293b" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>Notes & Scope</div>
              {editing ? (
                <textarea
                  value={notes || "Enter project notes, scope details, or client-specific requirements here..."}
                  onChange={e => setNotes(e.target.value)}
                  onFocus={e => { if (!notes) setNotes(""); }}
                  rows={4}
                  style={{ width: "100%", background: "#0a0f1a", border: "1px solid #334155", borderRadius: 8, padding: "10px 12px", color: "#94a3b8", fontSize: 12, lineHeight: 1.7, resize: "vertical", fontFamily: "Inter, sans-serif", boxSizing: "border-box" }}
                />
              ) : (
                <p style={{ color: "#64748b", fontSize: 12, lineHeight: 1.7, margin: 0 }}>
                  {notes || "All prices are in AUD. Quote is valid for 30 days from the date above. Work commences upon receipt of deposit. Timeline and scope to be confirmed during onboarding. Any additional pages or features outside the agreed scope will be quoted separately."}
                </p>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: "20px 44px", background: "rgba(0,209,178,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>Questions? Let's talk.</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>Reply to this quote or book a call to get started.</div>
              </div>
              <div style={{ textAlign: "right", fontSize: 11, color: "#475569" }}>
                <div style={{ color: TEAL, fontWeight: 700 }}>directiveos.com.au</div>
                <div>jayson@directiveos.com.au · 02 5850 4038</div>
                <div style={{ marginTop: 3 }}>Australian owned &amp; operated · No lock-in contracts</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
