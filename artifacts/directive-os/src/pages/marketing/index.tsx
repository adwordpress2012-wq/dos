import { Link } from "wouter";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Phone, MessageSquare, Building2, FileText, Zap, BarChart3, Smartphone,
  Download, CreditCard, Mail, PenLine, ClipboardList, Globe, BookOpen,
  ChevronDown, ChevronUp, ExternalLink, Star, Users, Layers, CheckCircle2,
  Shield, ArrowRight
} from "lucide-react";

const TEAL = "#00d1b2";
const NAVY = "#0a0f1a";
const NAVY2 = "#0d1424";
const NAVY3 = "#111827";
const SLATE = "#94a3b8";
const BORDER = "#1e293b";

const PRODUCTS = [
  {
    num: 1,
    icon: <Phone size={24} />,
    name: "Voice AI Receptionist — Sarah",
    tag: "Core · Included",
    tagColor: TEAL,
    price: "Included in all plans",
    pitch: "Your agency never misses a call again.",
    desc: "Sarah is a natural-sounding AI that answers every inbound call 24/7 — even at 2am on a Sunday. She qualifies the caller, answers property questions, books inspection times, and emails you the full transcript plus contact details the moment the call ends.",
    bullets: [
      "Answers every call in under 3 seconds",
      "Qualifies buyer intent (price range, timeline, urgency)",
      "Books inspection times directly from your VaultRE calendar",
      "Emails full call transcript + lead profile to you instantly",
      "Hot-transfers urgent callers to the listing agent's mobile",
      "Handles after-hours, overflow, and weekend calls"
    ],
    sell: "\"Every missed call is a missed commission. Sarah costs less than one missed sale per year.\""
  },
  {
    num: 2,
    icon: <MessageSquare size={24} />,
    name: "Live Chat Widget",
    tag: "Core · Included",
    tagColor: TEAL,
    price: "Included in all plans",
    pitch: "Capture leads from your website 24/7.",
    desc: "The same AI that answers your phones is embedded on your website as a chat widget. Visitors can ask about listings, request appraisals, or enquire about rentals — and get an instant, intelligent response at any hour.",
    bullets: [
      "One line of code installs it on any website",
      "Responds instantly to listing enquiries",
      "Captures name, number, and email automatically",
      "Hands off hot leads to your team with full context",
      "Matches your agency's branding and tone"
    ],
    sell: "\"Your website gets thousands of visitors. Right now, most of them leave without a conversation. The chat widget fixes that.\""
  },
  {
    num: 3,
    icon: <Building2 size={24} />,
    name: "VaultRE CRM Sync",
    tag: "Core · Included",
    tagColor: TEAL,
    price: "Included in all plans",
    pitch: "Sarah always has live, accurate data.",
    desc: "Directive OS connects directly to your VaultRE account via API. Every listing, every agent's contact details, every open home time — synced in real time. Sarah never quotes old prices or wrong inspection times.",
    bullets: [
      "Bi-directional sync — updates flow both ways",
      "Listings, prices, agent contacts always current",
      "New leads from Sarah appear in your VaultRE pipeline",
      "No manual data entry. Ever.",
      "Works with your existing VaultRE setup — no migration"
    ],
    sell: "\"Other AI tools use static scripts. Sarah reads your actual live data — she knows about the listing that just came on market this morning.\""
  },
  {
    num: 4,
    icon: <FileText size={24} />,
    name: "NSW Tenancy Automation",
    tag: "Core · Included",
    tagColor: TEAL,
    price: "Included in all plans",
    pitch: "Tenancy forms emailed the moment someone asks to apply.",
    desc: "When a prospective tenant calls or chats and expresses interest in applying for a rental, Sarah immediately emails them the NSW Fair Trading Standard Form of Lease. Zero admin. Zero follow-up. No property manager involvement needed.",
    bullets: [
      "Auto-triggers when rental interest is detected",
      "Sends NSW Fair Trading standard tenancy form",
      "Captures tenant contact details for your records",
      "Works outside business hours",
      "Property managers save 30–60 min per enquiry"
    ],
    sell: "\"Your property managers spend half their day answering the same rental questions. This automates all of it.\""
  },
  {
    num: 5,
    icon: <Zap size={24} />,
    name: "Hot Lead Routing",
    tag: "Core · Included",
    tagColor: TEAL,
    price: "Included in all plans",
    pitch: "High-intent buyers reach your agents in real time.",
    desc: "When Sarah detects a highly motivated caller — ready to buy, urgent timeline, specific property in mind — she doesn't take a message. She live-transfers the call directly to the listing agent's mobile number, pulled in real time from VaultRE.",
    bullets: [
      "Instant call transfer — buyer never hangs up",
      "Agent's number pulled live from VaultRE",
      "Configurable intent thresholds",
      "Fall-through to voicemail if agent unavailable",
      "Every transfer logged with transcript"
    ],
    sell: "\"A buyer who calls at 7pm on a Friday is serious. Sarah connects them to your agent immediately — before they call the competitor.\""
  },
  {
    num: 6,
    icon: <BarChart3 size={24} />,
    name: "Command Bridge Dashboard",
    tag: "Core · Included",
    tagColor: TEAL,
    price: "Included in all plans",
    pitch: "Full visibility over every lead, call, and conversation.",
    desc: "The agency's web-based control panel. Every call recording, every chat transcript, every lead profile — searchable, filterable, and downloadable. Agents can also log in individually to see their own lead feed.",
    bullets: [
      "Call recordings with full transcripts",
      "Lead database with status tracking",
      "Per-agent logins ($89/seat/mo)",
      "Real-time activity feed",
      "Billing management and usage reports",
      "Sarah's script and persona customisation"
    ],
    sell: "\"Your principal can see every lead, every conversation, and exactly how many calls were handled — all without chasing anyone for updates.\""
  },
  {
    num: 7,
    icon: <Smartphone size={24} />,
    name: "Branded Mobile App — iOS & Android",
    tag: "Add-on",
    tagColor: "#f59e0b",
    price: "$4,500 setup + $149/mo flat",
    pitch: "Your agency's own app. On the App Store. Under your name.",
    desc: "A fully branded mobile app published under the agency's name on the Apple App Store and Google Play — not Directive OS. Buyers download \"Ray White Castle Hill\" or \"First National Hills\". They see your listings, book inspections, and chat with Sarah, all inside your app.",
    bullets: [
      "Published under your agency's name (not ours)",
      "Custom icon, colours, and branding",
      "Buyers search all live listings",
      "Book inspections in-app",
      "Sarah AI built in — chat and call 24/7",
      "Push notifications: \"New listing — open Saturday\"",
      "QR code at opens — buyers scan to download your app",
      "Flat $149/mo — no per-user or per-buyer fees"
    ],
    sell: "\"Domain and REA charge you to list on THEIR platform. This puts your brand in every buyer's pocket — permanently.\""
  }
];

const APPS = [
  {
    label: "Command Bridge",
    sublabel: "Agent & Staff App",
    who: "Your team",
    icon: <BarChart3 size={28} />,
    color: TEAL,
    badge: "Included in all plans",
    badgeColor: "rgba(0,209,178,0.15)",
    badgeBorder: "rgba(0,209,178,0.3)",
    description: "The internal operations app used by agents, PMs, and reception staff. Connects to the Command Bridge Dashboard so your team can manage Sarah, monitor leads, and view call transcripts — from their phone.",
    points: [
      "Agents log in with their own seat",
      "View lead feed, call recordings, transcripts",
      "Get notified when Sarah captures a hot lead",
      "Adjust Sarah's settings and scripts",
      "Published under Directive OS — no App Store account needed",
      "Available on iOS and Android"
    ],
    note: "This is Directive OS's app, published under our developer account. Agents download it to manage the AI system. Buyers never see or use this app."
  },
  {
    label: "Branded Buyer App",
    sublabel: "Your Agency's App for Buyers",
    who: "Buyers & renters",
    icon: <Smartphone size={28} />,
    color: "#f59e0b",
    badge: "Add-on — $4,500 + $149/mo",
    badgeColor: "rgba(245,158,11,0.15)",
    badgeBorder: "rgba(245,158,11,0.3)",
    description: "A completely separate app — published under YOUR agency's name on the App Store and Google Play. Buyers search your listings, book inspections, and chat with Sarah, all inside an app that looks like it was built by your agency.",
    points: [
      "Published as \"[Your Agency Name]\" — not Directive OS",
      "Custom icon, splash screen, colours to match your brand",
      "Buyers browse live listings from your VaultRE",
      "Book inspections in-app",
      "Chat or call Sarah 24/7 without leaving the app",
      "Push notifications directly to every buyer who downloaded it",
      "QR code for open home signs — buyers scan and download",
      "Flat $149/mo — no per-buyer fees ever"
    ],
    note: "This is the premium add-on. Your agency gets its own app in the App Store, just like Domain or REA — but it's entirely yours. One Apple Developer account ($149 AUD/yr) covers unlimited apps."
  }
];

const MATERIALS = [
  { href: "/marketing/brochure", icon: <BookOpen size={20} />, title: "Trifold Brochure", desc: "A4 trifold · door-knocking tool · print-ready" },
  { href: "/marketing/one-pager", icon: <FileText size={20} />, title: "Sales One-Pager", desc: "A4 pitch sheet · print or email to prospects" },
  { href: "/marketing/business-card", icon: <CreditCard size={20} />, title: "Business Card", desc: "Print-ready front & back · 3.5\" × 2\"" },
  { href: "/marketing/proposal", icon: <ClipboardList size={20} />, title: "Proposal Template", desc: "Editable client proposal · 3 plan options" },
  { href: "/marketing/email-campaign", icon: <Mail size={20} />, title: "Email Campaign", desc: "3-part cold outreach sequence · copy & paste ready" },
  { href: "/marketing/email-signature", icon: <PenLine size={20} />, title: "Email Signature", desc: "HTML signature · Gmail & Outlook ready" },
  { href: "/marketing/health-check", icon: <ClipboardList size={20} />, title: "Website Health Check", desc: "Audit a prospect's site · auto-score · build quote" },
  { href: "/marketing/web-quote", icon: <Globe size={20} />, title: "Website Quote Builder", desc: "Live price calculator · internal use only" },
];

function ProductCard({ p, open, toggle }: { p: typeof PRODUCTS[0]; open: boolean; toggle: () => void }) {
  return (
    <div style={{ background: NAVY3, border: `1px solid ${open ? TEAL : BORDER}`, borderRadius: 16, overflow: "hidden", transition: "border-color 0.2s", marginBottom: 12 }}>
      <button
        onClick={toggle}
        style={{ width: "100%", padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, background: "none", border: "none", cursor: "pointer", color: "#fff", textAlign: "left" }}
      >
        <div style={{ width: 44, height: 44, borderRadius: 10, background: open ? "rgba(0,209,178,0.15)" : "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: open ? TEAL : SLATE, flexShrink: 0 }}>
          {p.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#475569" }}>0{p.num}</span>
            <span style={{ fontWeight: 700, fontSize: 16, color: "#fff" }}>{p.name}</span>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, padding: "2px 8px", borderRadius: 20, background: p.tagColor === TEAL ? "rgba(0,209,178,0.1)" : "rgba(245,158,11,0.12)", color: p.tagColor, border: `1px solid ${p.tagColor}44` }}>
              {p.tag}
            </span>
          </div>
          <div style={{ fontSize: 13, color: SLATE, marginTop: 3 }}>{p.pitch}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
          <span style={{ fontSize: 12, color: p.tagColor, fontWeight: 600 }}>{p.price}</span>
          <span style={{ color: SLATE }}>{open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>
        </div>
      </button>

      {open && (
        <div style={{ padding: "0 24px 24px", borderTop: `1px solid ${BORDER}` }}>
          <p style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 1.7, marginTop: 20, marginBottom: 16 }}>{p.desc}</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
            {p.bullets.map(b => (
              <div key={b} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <CheckCircle2 size={14} style={{ color: TEAL, flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 13, color: SLATE, lineHeight: 1.5 }}>{b}</span>
              </div>
            ))}
          </div>

          <div style={{ background: "rgba(0,209,178,0.06)", border: "1px solid rgba(0,209,178,0.15)", borderRadius: 10, padding: "14px 18px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: TEAL, marginBottom: 6 }}>YOUR PITCH LINE</div>
            <div style={{ fontSize: 13, color: "#e2e8f0", fontStyle: "italic", lineHeight: 1.6 }}>{p.sell}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MarketingHub() {
  const [openProduct, setOpenProduct] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"products" | "apps" | "materials" | "demo">("products");

  const tabs = [
    { id: "products" as const, label: "7 Products", icon: <Layers size={15} /> },
    { id: "apps" as const, label: "The 2 Apps", icon: <Smartphone size={15} /> },
    { id: "materials" as const, label: "Print & Digital", icon: <Download size={15} /> },
    { id: "demo" as const, label: "Live Demo", icon: <Phone size={15} /> },
  ];

  return (
    <div style={{ minHeight: "100vh", background: NAVY, color: "#fff", fontFamily: "Inter, sans-serif" }}>

      {/* Header */}
      <div style={{ background: NAVY2, borderBottom: `1px solid ${BORDER}`, padding: "28px 32px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: TEAL, marginBottom: 6 }}>DIRECTIVE OS — SALES COMMAND CENTRE</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, lineHeight: 1.2 }}>Marketing Hub</h1>
            <p style={{ color: SLATE, margin: "6px 0 0", fontSize: 14 }}>Everything you need to sell, demo, and close — in one place.</p>
          </div>
          <a href="tel:0258504038"
            style={{ display: "inline-flex", alignItems: "center", gap: 10, background: TEAL, color: "#000", fontWeight: 800, padding: "12px 22px", borderRadius: 10, textDecoration: "none", fontSize: 15, boxShadow: "0 0 24px rgba(0,209,178,0.3)" }}>
            <Phone size={18} />
            Demo Sarah Now — 02 5850 4038
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: NAVY2, borderBottom: `1px solid ${BORDER}`, position: "sticky", top: 0, zIndex: 20 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", padding: "0 32px" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "16px 20px", border: "none", background: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, color: activeTab === t.id ? TEAL : SLATE, borderBottom: `2px solid ${activeTab === t.id ? TEAL : "transparent"}`, transition: "all 0.2s" }}>
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 32px" }}>

        {/* ─── TAB: 7 Products ─── */}
        {activeTab === "products" && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Our 7 Products & Services</h2>
              <p style={{ color: SLATE, fontSize: 14, lineHeight: 1.7, marginBottom: 0 }}>
                Products 1–6 are included in every plan. Product 7 (Branded Mobile App) is a premium add-on.
                Click any product to see the full description and your pitch line.
              </p>
            </div>

            {/* Pricing Summary Banner */}
            <div style={{ background: "rgba(0,209,178,0.06)", border: "1px solid rgba(0,209,178,0.2)", borderRadius: 14, padding: "20px 24px", marginBottom: 28, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 16 }}>
              {[
                { label: "Setup Fee", value: "$1,800", note: "One-off onboarding" },
                { label: "Base Plan", value: "$299/mo", note: "Sarah + Dashboard + CRM sync" },
                { label: "Per Seat", value: "$89/mo", note: "Per additional agent login" },
                { label: "Overage", value: "$25/10 min", note: "After included call minutes" },
                { label: "App Add-on", value: "$4,500 + $149/mo", note: "Branded buyer app" },
              ].map(p => (
                <div key={p.label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: SLATE, marginBottom: 4 }}>{p.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: TEAL }}>{p.value}</div>
                  <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{p.note}</div>
                </div>
              ))}
            </div>

            {/* Product Accordion */}
            <div>
              {PRODUCTS.map(p => (
                <ProductCard
                  key={p.num}
                  p={p}
                  open={openProduct === p.num}
                  toggle={() => setOpenProduct(openProduct === p.num ? null : p.num)}
                />
              ))}
            </div>

            <div style={{ marginTop: 32, padding: "20px 24px", background: NAVY3, borderRadius: 14, border: `1px solid ${BORDER}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Quick Reference — What's in the base plan?</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["Sarah Voice AI", "Live Chat Widget", "VaultRE Sync", "Tenancy Automation", "Hot Lead Routing", "Command Bridge Dashboard"].map(item => (
                  <span key={item} style={{ padding: "4px 12px", background: "rgba(0,209,178,0.08)", border: "1px solid rgba(0,209,178,0.2)", borderRadius: 20, fontSize: 12, color: TEAL }}>✓ {item}</span>
                ))}
                <span style={{ padding: "4px 12px", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 20, fontSize: 12, color: "#f59e0b" }}>+ Branded Mobile App (Add-on)</span>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB: The 2 Apps ─── */}
        {activeTab === "apps" && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>The Two Apps — What's the Difference?</h2>
              <p style={{ color: SLATE, fontSize: 14, lineHeight: 1.7 }}>
                We have two mobile apps. They are completely different products with different purposes and different users. Here's how to explain them to a prospect.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
              {APPS.map(app => (
                <div key={app.label} style={{ background: NAVY3, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 28 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: `${app.color}18`, display: "flex", alignItems: "center", justifyContent: "center", color: app.color }}>
                      {app.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 18, color: "#fff" }}>{app.label}</div>
                      <div style={{ fontSize: 13, color: SLATE }}>{app.sublabel}</div>
                    </div>
                  </div>

                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 20, background: app.badgeColor, border: `1px solid ${app.badgeBorder}`, fontSize: 11, fontWeight: 700, color: app.color, marginBottom: 16 }}>
                    {app.badge}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <Users size={14} style={{ color: app.color }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8" }}>WHO USES IT: <span style={{ color: "#fff" }}>{app.who}</span></span>
                  </div>

                  <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>{app.description}</p>

                  <ul style={{ listStyle: "none", margin: 0, padding: 0, marginBottom: 20 }}>
                    {app.points.map(pt => (
                      <li key={pt} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
                        <CheckCircle2 size={13} style={{ color: app.color, flexShrink: 0, marginTop: 2 }} />
                        <span style={{ fontSize: 13, color: SLATE, lineHeight: 1.5 }}>{pt}</span>
                      </li>
                    ))}
                  </ul>

                  <div style={{ background: `${app.color}0a`, border: `1px solid ${app.color}22`, borderRadius: 10, padding: "12px 16px" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: app.color, marginBottom: 6 }}>IMPORTANT NOTE</div>
                    <div style={{ fontSize: 12, color: SLATE, lineHeight: 1.6 }}>{app.note}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Simple comparison table */}
            <div style={{ background: NAVY3, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: "hidden" }}>
              <div style={{ padding: "16px 24px", borderBottom: `1px solid ${BORDER}` }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>At-a-Glance Comparison</div>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                    <th style={{ padding: "12px 24px", textAlign: "left", color: SLATE, fontWeight: 600 }}>Feature</th>
                    <th style={{ padding: "12px 24px", textAlign: "center", color: TEAL, fontWeight: 700 }}>Command Bridge App</th>
                    <th style={{ padding: "12px 24px", textAlign: "center", color: "#f59e0b", fontWeight: 700 }}>Branded Buyer App</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Who downloads it", "Your agents & staff", "Buyers & renters"],
                    ["Published under", "Directive OS", "Your agency's name"],
                    ["Visible in App Store as", "Command Bridge", "e.g. \"Ray White Castle Hill\""],
                    ["Purpose", "Manage the AI system", "Search listings & contact Sarah"],
                    ["Cost", "Included in plan", "$4,500 setup + $149/mo"],
                    ["Push notifications to", "Agent alerts", "Buyer broadcasts"],
                    ["Sarah AI built in", "Yes — for agents", "Yes — for buyers"],
                  ].map(([feature, cmd, buyer], i) => (
                    <tr key={feature} style={{ borderTop: `1px solid ${BORDER}`, background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                      <td style={{ padding: "12px 24px", color: "#e2e8f0", fontWeight: 500 }}>{feature}</td>
                      <td style={{ padding: "12px 24px", textAlign: "center", color: SLATE }}>{cmd}</td>
                      <td style={{ padding: "12px 24px", textAlign: "center", color: SLATE }}>{buyer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pitch box */}
            <div style={{ marginTop: 20, background: "rgba(0,209,178,0.06)", border: "1px solid rgba(0,209,178,0.2)", borderRadius: 14, padding: "20px 24px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: TEAL, marginBottom: 10 }}>HOW TO PITCH THE BUYER APP ADD-ON</div>
              <p style={{ color: "#e2e8f0", fontSize: 14, lineHeight: 1.7, margin: "0 0 10px" }}>
                <strong style={{ color: "#fff" }}>The setup:</strong> Every plan includes Command Bridge — that's the agent app. Most agencies don't need anything else.
              </p>
              <p style={{ color: "#e2e8f0", fontSize: 14, lineHeight: 1.7, margin: "0 0 10px" }}>
                <strong style={{ color: "#fff" }}>The upgrade:</strong> "Would you like your own branded app on the App Store? Instead of buyers contacting you through Domain or REA, they download YOUR app — it has your logo, your branding, and Sarah is built in. One-off $4,500 to build and publish it, then $149 flat per month forever. No per-user fees."
              </p>
              <p style={{ color: "#e2e8f0", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                <strong style={{ color: "#fff" }}>The closer:</strong> "Think about open homes — your buyers scan a QR code and download YOUR app. They never need to go to Domain again."
              </p>
            </div>
          </div>
        )}

        {/* ─── TAB: Print & Digital ─── */}
        {activeTab === "materials" && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Print & Digital Materials</h2>
              <p style={{ color: SLATE, fontSize: 14, lineHeight: 1.7 }}>
                All tools are print-ready. Open, adjust, and print directly from your browser. Save as PDF using your browser's print dialog.
              </p>
            </div>

            {/* Logo Download */}
            <div style={{ background: NAVY3, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24, marginBottom: 20, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
              <img src="/logo-hires.png" alt="Logo" style={{ width: 64, height: 56, objectFit: "contain", filter: "drop-shadow(0 0 10px rgba(0,209,178,0.5))" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Directive OS Logo — High Resolution</div>
                <div style={{ color: SLATE, fontSize: 13 }}>1104 × 974 px PNG · suitable for print, embroidery, and digital use</div>
              </div>
              <a href="/logo-hires.png" download="directive-os-logo.png"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, background: TEAL, color: "#000", fontWeight: 700, padding: "10px 20px", borderRadius: 8, textDecoration: "none", fontSize: 14 }}>
                <Download size={16} /> Download PNG
              </a>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {MATERIALS.map(item => (
                <Link key={item.href} href={item.href}>
                  <div style={{ background: NAVY3, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "18px 20px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer", transition: "border-color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = TEAL)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = BORDER)}
                  >
                    <div style={{ color: TEAL }}>{item.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{item.title}</div>
                      <div style={{ color: "#64748b", fontSize: 12 }}>{item.desc}</div>
                    </div>
                    <ArrowRight size={16} style={{ color: "#475569" }} />
                  </div>
                </Link>
              ))}
            </div>

            <div style={{ marginTop: 20, padding: "16px 20px", background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 12 }}>
              <div style={{ fontSize: 12, color: "#f59e0b", fontWeight: 700, marginBottom: 4 }}>⚠ Internal only — Website Quote Builder</div>
              <div style={{ fontSize: 13, color: SLATE }}>The Web Quote Builder is for internal use. Never send the link directly to a prospect — use the Proposal Template instead, and send them a PDF.</div>
            </div>
          </div>
        )}

        {/* ─── TAB: Live Demo ─── */}
        {activeTab === "demo" && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Live Demo Tools</h2>
              <p style={{ color: SLATE, fontSize: 14, lineHeight: 1.7 }}>
                Use these when you're in front of a prospect — door knocking, at an open home, or on a call.
              </p>
            </div>

            {/* Call Sarah */}
            <div style={{ background: "linear-gradient(135deg, #003d35, #005a4e)", border: "2px solid rgba(0,209,178,0.4)", borderRadius: 20, padding: "32px", marginBottom: 20, textAlign: "center" }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: "#4dd9c6", marginBottom: 16 }}>LIVE AI DEMO — CALL RIGHT NOW</div>
              <div style={{ fontSize: 15, color: "#94a3b8", marginBottom: 12 }}>Hand the prospect your phone and say: "Call this number — this is the exact same AI your agency would get."</div>
              <a href="tel:0258504038"
                style={{ display: "inline-flex", alignItems: "center", gap: 14, background: TEAL, color: "#000", fontWeight: 900, fontSize: 28, padding: "18px 40px", borderRadius: 14, textDecoration: "none", boxShadow: "0 0 40px rgba(0,209,178,0.5)", letterSpacing: 1 }}>
                <Phone size={28} />
                02 5850 4038
              </a>
              <div style={{ fontSize: 12, color: "#4dd9c6", marginTop: 14 }}>This is a live AI — not a recording · Answers 24/7 · Handles real estate enquiries</div>
            </div>

            {/* Ray White Demo Site */}
            <div style={{ background: NAVY3, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24, marginBottom: 16, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "#FFD000", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Star size={24} style={{ color: "#000" }} />
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Ray White Castle Hill — Demo Site</div>
                <div style={{ color: SLATE, fontSize: 13, marginBottom: 8 }}>A fully branded agency website powered by Directive OS. Show prospects what their agency would look like with the full system live.</div>
                <div style={{ fontSize: 11, color: "#475569" }}>directiveos.com.au/realestate-demo</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <a href="/realestate-demo" target="_blank"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#FFD000", color: "#000", fontWeight: 700, padding: "9px 18px", borderRadius: 8, textDecoration: "none", fontSize: 14 }}>
                  <ExternalLink size={15} /> Open Demo
                </a>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <QRCodeSVG value="https://directiveos.com.au/realestate-demo" size={80} bgColor="transparent" fgColor="#fff" level="M" />
                </div>
              </div>
            </div>

            {/* QR Codes */}
            <div style={{ background: NAVY3, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Main Website</div>
              <div style={{ color: SLATE, fontSize: 13, marginBottom: 16 }}>Show the full Directive OS homepage to a prospect. Scan to open on their phone.</div>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-start" }}>
                <div style={{ textAlign: "center" }}>
                  <QRCodeSVG value="https://directiveos.com.au/directive-os" size={120} bgColor={NAVY3} fgColor="#fff" level="M" />
                  <div style={{ fontSize: 11, color: "#475569", marginTop: 8 }}>directiveos.com.au</div>
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: "grid", gap: 8 }}>
                    {[
                      { label: "QR tip 1", text: "At open homes: \"Scan this to see what we can do for your agency\"" },
                      { label: "QR tip 2", text: "On business cards: Print the QR and point it to your demo site" },
                      { label: "QR tip 3", text: "In email: Use the brochure QR code so they can see Sarah in action" },
                    ].map(tip => (
                      <div key={tip.label} style={{ display: "flex", gap: 10, padding: "10px 14px", background: "rgba(0,209,178,0.04)", borderRadius: 8, border: "1px solid rgba(0,209,178,0.1)" }}>
                        <CheckCircle2 size={14} style={{ color: TEAL, flexShrink: 0, marginTop: 2 }} />
                        <span style={{ fontSize: 13, color: SLATE, lineHeight: 1.5 }}>{tip.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Demo Script */}
            <div style={{ background: NAVY3, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>5-Minute Demo Script</div>
              {[
                { step: "1", title: "Open with a question", text: "\"Quick question — when someone calls your office at 7pm Friday night, what happens to that call right now?\"" },
                { step: "2", title: "Let them answer, then show the problem", text: "\"Most agencies — that call goes to voicemail. That buyer calls the next agent on their list. That's a commission you'll never know you lost.\"" },
                { step: "3", title: "Introduce Sarah", text: "\"Here's what we do — call this number right now. This is Sarah. She's a live AI receptionist. Hand your phone to me if you like and I'll ask her about your listings.\"" },
                { step: "4", title: "Demo the call", text: "Call 02 5850 4038 live. Ask about a property. Show the email transcript that arrives in 30 seconds." },
                { step: "5", title: "Show the dashboard", text: "\"Every call, every transcript, every lead — right here in your dashboard. Your principal can see everything.\"" },
                { step: "6", title: "Close with pricing", text: "\"It's $1,800 to set up — we handle everything, go-live in 48 hours — then $299 a month. That's less than one missed commission.\"" },
              ].map(s => (
                <div key={s.step} style={{ display: "flex", gap: 16, marginBottom: 16, alignItems: "flex-start" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: TEAL, color: "#000", fontWeight: 900, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.step}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 4 }}>{s.title}</div>
                    <div style={{ fontSize: 13, color: SLATE, lineHeight: 1.6, fontStyle: "italic" }}>{s.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
