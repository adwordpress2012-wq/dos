import { Link } from "wouter";
import { Download, CreditCard, FileText, Mail, PenLine, ClipboardList, Globe } from "lucide-react";

export default function MarketingHub() {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1a", color: "#fff", fontFamily: "Inter, sans-serif", padding: "48px 24px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ marginBottom: 40 }}>
          <img src="/logo.png" alt="Directive OS" style={{ width: 64, height: 64, marginBottom: 16, filter: "drop-shadow(0 0 12px rgba(0,209,178,0.6))" }} />
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 8px" }}>Marketing Materials</h1>
          <p style={{ color: "#94a3b8", margin: 0 }}>Download and use these assets to promote Directive OS.</p>
        </div>

        {/* Logo Download */}
        <div style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 16, padding: 28, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <img src="/logo-hires.png" alt="Logo" style={{ width: 72, height: 64, objectFit: "contain", filter: "drop-shadow(0 0 10px rgba(0,209,178,0.5))" }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>Directive OS Logo</div>
                <div style={{ color: "#94a3b8", fontSize: 13 }}>High-resolution PNG · 1104 × 974 px · suitable for print & embroidery</div>
              </div>
            </div>
            <a
              href="/logo-hires.png"
              download="directive-os-logo.png"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#00d1b2", color: "#000", fontWeight: 700, padding: "10px 20px", borderRadius: 8, textDecoration: "none", fontSize: 14 }}
            >
              <Download size={16} /> Download Logo
            </a>
          </div>
        </div>

        {/* Materials Grid */}
        <div style={{ display: "grid", gap: 12 }}>
          {[
            { href: "/marketing/business-card", icon: <CreditCard size={22} />, title: "Business Card", desc: "Print-ready front & back · 3.5\" × 2\" · save as PDF" },
            { href: "/marketing/one-pager", icon: <FileText size={22} />, title: "Sales One-Pager", desc: "A4 pitch sheet · print or email to prospects" },
            { href: "/marketing/email-campaign", icon: <Mail size={22} />, title: "Email Campaign", desc: "3-part cold outreach sequence · copy & paste ready" },
            { href: "/marketing/email-signature", icon: <PenLine size={22} />, title: "Email Signature", desc: "Branded HTML signature · Gmail & Outlook compatible" },
            { href: "/marketing/proposal", icon: <ClipboardList size={22} />, title: "Proposal Template", desc: "Editable client proposal · 3 plan options · print to PDF" },
            { href: "/marketing/web-quote", icon: <Globe size={22} />, title: "Website Quote Builder", desc: "New build & rebuild · live price calculator · print to PDF" },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <div style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 16, padding: "20px 24px", display: "flex", alignItems: "center", gap: 20, cursor: "pointer", transition: "border-color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "#00d1b2")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#1e293b")}
              >
                <div style={{ color: "#00d1b2" }}>{item.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 3 }}>{item.title}</div>
                  <div style={{ color: "#64748b", fontSize: 13 }}>{item.desc}</div>
                </div>
                <div style={{ marginLeft: "auto", color: "#475569" }}>→</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
