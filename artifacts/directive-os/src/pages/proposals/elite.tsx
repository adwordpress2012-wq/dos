import { useEffect } from "react";

const TODAY = new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
const EXPIRY = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });

export default function EliteProposal() {
  useEffect(() => {
    document.title = "Proposal — Elite Sydney Property × Directive OS";
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f4f5f7; font-family: Montserrat, sans-serif; }

        .proposal { max-width: 860px; margin: 0 auto; background: #fff; }

        /* ── Cover ── */
        .cover {
          background: linear-gradient(145deg, #002d6b 0%, #004391 60%, #1a5aad 100%);
          padding: 64px 64px 56px;
          position: relative; overflow: hidden;
        }
        .cover::after {
          content: '';
          position: absolute; bottom: -40px; left: 0; right: 0; height: 80px;
          background: #fff;
          clip-path: ellipse(55% 80px at 50% 80px);
        }
        .cover-grid { content: ''; position: absolute; inset: 0;
          background-image: repeating-linear-gradient(0deg,rgba(255,255,255,0.03) 0,rgba(255,255,255,0.03) 1px,transparent 1px,transparent 48px),
          repeating-linear-gradient(90deg,rgba(255,255,255,0.03) 0,rgba(255,255,255,0.03) 1px,transparent 1px,transparent 48px);
          pointer-events: none;
        }
        .logo-mark { font-size: 11px; font-weight: 900; letter-spacing: 4px; color: rgba(255,255,255,0.5); text-transform: uppercase; margin-bottom: 60px; }
        .logo-mark span { color: #fbb701; }
        .cover h1 { font-size: 42px; font-weight: 900; color: #fff; line-height: 1.1; margin-bottom: 16px; letter-spacing: -0.02em; }
        .cover h1 em { color: #fbb701; font-style: normal; }
        .cover-sub { color: rgba(255,255,255,0.65); font-size: 16px; line-height: 1.6; max-width: 500px; }
        .cover-meta { display: flex; gap: 32px; margin-top: 48px; }
        .cover-meta-item label { display: block; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.4); margin-bottom: 4px; }
        .cover-meta-item span { font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.85); }

        /* ── Body ── */
        .body { padding: 72px 64px 80px; }
        .section { margin-bottom: 56px; }
        .section-label { font-size: 10px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; color: #004391; margin-bottom: 14px; display: flex; align-items: center; gap: 10px; }
        .section-label::after { content: ''; flex: 1; height: 1px; background: #e8edf4; }
        h2 { font-size: 24px; font-weight: 800; color: #1a222c; margin-bottom: 12px; letter-spacing: -0.01em; }
        p { font-size: 14px; color: #4b5563; line-height: 1.75; }
        p + p { margin-top: 10px; }

        /* ── Scope table ── */
        .scope-table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13.5px; }
        .scope-table thead tr { background: #004391; }
        .scope-table thead th { color: #fff; font-weight: 700; text-align: left; padding: 12px 16px; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; }
        .scope-table tbody tr { border-bottom: 1px solid #e8edf4; }
        .scope-table tbody tr:nth-child(even) { background: #f6f9ff; }
        .scope-table tbody td { padding: 12px 16px; color: #374151; vertical-align: top; line-height: 1.55; }
        .scope-table tbody td:first-child { font-weight: 700; color: #1a222c; white-space: nowrap; width: 220px; }
        .check { color: #22c55e; font-size: 15px; margin-right: 6px; }

        /* ── Options ── */
        .options { display: flex; flex-direction: column; gap: 16px; margin-top: 20px; }
        .option { border-radius: 12px; overflow: hidden; border: 2px solid #e8edf4; }
        .option.recommended { border-color: #004391; }
        .option-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; }
        .option.recommended .option-header { background: linear-gradient(135deg, #002d6b, #004391); }
        .option:not(.recommended) .option-header { background: #f6f9ff; }
        .option-name { font-size: 16px; font-weight: 800; }
        .option.recommended .option-name { color: #fff; }
        .option:not(.recommended) .option-name { color: #1a222c; }
        .option-badge { font-size: 10px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; }
        .option.recommended .option-badge { background: #fbb701; color: #1a222c; }
        .option:not(.recommended) .option-badge { background: #e8edf4; color: #6b7280; }
        .option-body { padding: 16px 20px; background: #fff; }
        .option-pricing { display: flex; gap: 32px; margin-bottom: 14px; }
        .option-pricing-item label { display: block; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #9ca3af; margin-bottom: 2px; }
        .option-pricing-item .price { font-size: 22px; font-weight: 900; color: #004391; }
        .option-pricing-item .price-sub { font-size: 12px; color: #9ca3af; }
        .option-includes { display: flex; flex-wrap: wrap; gap: 6px; }
        .pill { font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px; background: #f0f5ff; color: #004391; border: 1px solid #c3d4f4; }
        .pill.gold { background: #fff8e6; color: #92600a; border-color: #f0d68f; }

        /* ── Timeline ── */
        .timeline { margin-top: 20px; display: flex; flex-direction: column; gap: 0; }
        .tl-item { display: flex; gap: 20px; }
        .tl-line { display: flex; flex-direction: column; align-items: center; }
        .tl-dot { width: 14px; height: 14px; border-radius: 50%; background: #004391; flex-shrink: 0; margin-top: 3px; }
        .tl-stem { width: 2px; background: #e8edf4; flex: 1; margin: 4px 0; min-height: 28px; }
        .tl-item:last-child .tl-stem { display: none; }
        .tl-content { padding-bottom: 20px; }
        .tl-week { font-size: 10px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #004391; margin-bottom: 2px; }
        .tl-title { font-size: 14px; font-weight: 700; color: #1a222c; margin-bottom: 2px; }
        .tl-desc { font-size: 12.5px; color: #6b7280; line-height: 1.55; }

        /* ── Deliverables checklist ── */
        .checklist { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
        .cl-item { display: flex; align-items: flex-start; gap: 10px; font-size: 13.5px; color: #374151; line-height: 1.5; }
        .cl-icon { width: 18px; height: 18px; border-radius: 50%; background: #004391; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
        .cl-icon svg { width: 10px; height: 10px; }

        /* ── Terms ── */
        .terms { background: #f6f9ff; border-radius: 10px; padding: 20px 22px; margin-top: 16px; }
        .terms ol { padding-left: 18px; }
        .terms li { font-size: 12.5px; color: #4b5563; line-height: 1.65; margin-bottom: 6px; }

        /* ── Signature ── */
        .sig-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 20px; }
        .sig-box { border: 1.5px solid #e8edf4; border-radius: 10px; padding: 20px; }
        .sig-label { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #9ca3af; margin-bottom: 40px; }
        .sig-line { border-top: 1.5px solid #d1d5db; padding-top: 8px; }
        .sig-name { font-size: 13px; font-weight: 700; color: #1a222c; }
        .sig-role { font-size: 11px; color: #9ca3af; }

        /* ── Footer ── */
        .footer { background: #002d6b; padding: 28px 64px; display: flex; justify-content: space-between; align-items: center; }
        .footer-left { font-size: 11px; color: rgba(255,255,255,0.45); line-height: 1.6; }
        .footer-right { font-size: 11px; color: rgba(255,255,255,0.45); text-align: right; }
        .footer .brand { font-size: 13px; font-weight: 800; color: #fbb701; letter-spacing: 0.08em; text-transform: uppercase; }

        /* ── Print button (screen only) ── */
        .print-bar { display: flex; justify-content: center; padding: 20px; gap: 12px; background: #1a222c; position: sticky; top: 0; z-index: 100; }
        .print-btn { background: #fbb701; color: #1a222c; font-weight: 800; font-size: 13px; border: none; border-radius: 8px; padding: 10px 24px; cursor: pointer; font-family: Montserrat, sans-serif; letter-spacing: 0.03em; }
        .print-hint { color: rgba(255,255,255,0.4); font-size: 12px; align-self: center; }

        @media print {
          body { background: #fff; }
          .print-bar { display: none !important; }
          .proposal { max-width: 100%; box-shadow: none; }
          .cover { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .scope-table thead { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .option.recommended .option-header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .footer { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .cl-icon { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { margin: 0; size: A4; }
        }
      `}</style>

      {/* Print bar — screen only */}
      <div className="print-bar">
        <button className="print-btn" onClick={() => window.print()}>⬇ Save as PDF / Print</button>
        <span className="print-hint">Use browser Print → Save as PDF · Set to A4, no margins</span>
      </div>

      <div className="proposal">

        {/* ── Cover ── */}
        <div className="cover">
          <div className="cover-grid" />
          <div style={{ position: "relative" }}>
            <div className="logo-mark">DIRECTIVE <span>OS</span> · AI Receptionist Platform</div>
            <h1>Full Website Rebuild<br />+ AI Integration<br /><em>Proposal</em></h1>
            <p className="cover-sub">
              Prepared exclusively for Elite Sydney Property — a comprehensive scope covering design, build, VaultRE live listings integration, and Sarah AI Receptionist deployment.
            </p>
            <div className="cover-meta">
              <div className="cover-meta-item"><label>Prepared for</label><span>Elite Sydney Property</span></div>
              <div className="cover-meta-item"><label>Prepared by</label><span>Jayson · Directive OS</span></div>
              <div className="cover-meta-item"><label>Date</label><span>{TODAY}</span></div>
              <div className="cover-meta-item"><label>Valid until</label><span>{EXPIRY}</span></div>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="body">

          {/* Executive Summary */}
          <div className="section">
            <div className="section-label">Executive Summary</div>
            <h2>A Modern, High-Performance Platform for Elite Sydney Property</h2>
            <p>
              Elite Sydney Property has established a strong reputation across Liverpool and Hinchinbrook. This proposal covers a full rebuild of your digital presence — replacing your current WordPress site with a purpose-built real estate platform, live VaultRE listing sync, and Sarah AI Receptionist deployed 24/7 across voice and chat.
            </p>
            <p>
              The result: a faster, mobile-first website with live property data, an AI receptionist that answers every enquiry instantly, and a platform that grows with your business — without the ongoing WordPress maintenance headaches.
            </p>
          </div>

          {/* Scope of Work */}
          <div className="section">
            <div className="section-label">Scope of Work</div>
            <h2>What We Build</h2>
            <table className="scope-table">
              <thead>
                <tr>
                  <th>Deliverable</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Homepage", "Hero, featured properties, suburb highlights, agent profiles, market appraisal CTA, Sarah AI chat widget"],
                  ["Buy", "Property search with live VaultRE listings, filters (beds/baths/price/suburb/type), open inspection schedule, auction calendar"],
                  ["Sell", "Vendor landing page, market appraisal request form, recent sales feed from VaultRE, agent pitch section"],
                  ["Rent", "Rental listings feed, rental appraisal form, tenancy application (PDF upload), open home schedule"],
                  ["Property Management", "Full PM service page, repair request form, landlord enquiry form"],
                  ["Calculators", "Mortgage, Stamp Duty, Refinance, Reverse Rent — interactive, mobile-optimised"],
                  ["About Us / Team", "Agency story, Meet the Team with agent profiles and contact, Careers page"],
                  ["Elite Home Loan Services", "Dedicated home loan page, enquiry/callback form"],
                  ["Blog", "Fully managed blog with categories, SEO metadata, author profiles"],
                  ["Suburb SEO Pages", "Liverpool, Hinchinbrook, Prestons, Casula, Green Valley, Bonnyrigg, Edmondson Park, Middleton Grange, Ashcroft, Mount Pritchard + 3 more — pre-optimised for Google"],
                  ["VaultRE Live Integration", "Real-time listing sync — all For Sale, Leased, Sold, For Rent properties automatically updated. Property detail pages, photo galleries, floor plans, location maps"],
                  ["Sarah AI Receptionist", "Dedicated Twilio phone number, voice AI (24/7 call answering), on-site chat widget, lead capture, inspection booking, vendor spotting, hot lead SMS alerts"],
                  ["QR Code System", "Print-ready QR codes for every listed property — signboard, DL flyer, social sizes. Buyers scan → Sarah responds instantly"],
                  ["Domain & Hosting Migration", "Transfer from WordPress hosting to Directive OS platform. Zero downtime migration. SSL, CDN, daily backups included"],
                  ["Analytics & Lead Dashboard", "Admin dashboard — all leads, transcripts, enquiries, inspection bookings, call recordings in one place"],
                ].map(([d, det]) => (
                  <tr key={d}>
                    <td><span className="check">✓</span>{d}</td>
                    <td>{det}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing Options */}
          <div className="section">
            <div className="section-label">Investment Options</div>
            <h2>Choose Your Package</h2>
            <div className="options">

              {/* Option A — Recommended */}
              <div className="option recommended">
                <div className="option-header">
                  <div className="option-name">Option A — Full Stack (Recommended)</div>
                  <div className="option-badge">Recommended</div>
                </div>
                <div className="option-body">
                  <div className="option-pricing">
                    <div className="option-pricing-item">
                      <label>One-Time Setup</label>
                      <div className="price">$12,800</div>
                      <div className="price-sub">excl. GST</div>
                    </div>
                    <div className="option-pricing-item">
                      <label>Monthly Ongoing</label>
                      <div className="price">$299<span style={{ fontSize: 14 }}>/mo</span></div>
                      <div className="price-sub">AI + hosting + support</div>
                    </div>
                  </div>
                  <div className="option-includes">
                    {["Full website design & build", "VaultRE live listings sync", "Sarah AI Voice Receptionist", "Dedicated Twilio number", "All suburb SEO pages", "All calculators & forms", "Domain migration", "QR code system", "Lead dashboard", "3 months priority support"].map(f => (
                      <span key={f} className="pill">{f}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Option B */}
              <div className="option">
                <div className="option-header">
                  <div className="option-name">Option B — Core Website + AI</div>
                  <div className="option-badge">No Listings Sync</div>
                </div>
                <div className="option-body">
                  <div className="option-pricing">
                    <div className="option-pricing-item">
                      <label>One-Time Setup</label>
                      <div className="price">$7,300</div>
                      <div className="price-sub">excl. GST</div>
                    </div>
                    <div className="option-pricing-item">
                      <label>Monthly Ongoing</label>
                      <div className="price">$299<span style={{ fontSize: 14 }}>/mo</span></div>
                      <div className="price-sub">AI + hosting + support</div>
                    </div>
                  </div>
                  <div className="option-includes">
                    {["Full website design & build", "Sarah AI Voice Receptionist", "Dedicated Twilio number", "All suburb SEO pages", "All calculators & forms", "Domain migration", "Lead dashboard", "VaultRE sync (add-on later: +$2,500)"].map(f => (
                      <span key={f} className="pill">{f}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Option C */}
              <div className="option">
                <div className="option-header">
                  <div className="option-name">Option C — AI Receptionist Only</div>
                  <div className="option-badge">Current Plan</div>
                </div>
                <div className="option-body">
                  <div className="option-pricing">
                    <div className="option-pricing-item">
                      <label>One-Time Setup</label>
                      <div className="price">$1,800</div>
                      <div className="price-sub">excl. GST</div>
                    </div>
                    <div className="option-pricing-item">
                      <label>Monthly Ongoing</label>
                      <div className="price">$299<span style={{ fontSize: 14 }}>/mo</span></div>
                      <div className="price-sub">Sarah AI only</div>
                    </div>
                  </div>
                  <div className="option-includes">
                    {["Sarah AI landing page", "Voice AI 24/7", "Chat widget", "Lead capture", "QR code print files", "Upgrade to A or B at any time"].map(f => (
                      <span key={f} className="pill gold">{f}</span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Timeline */}
          <div className="section">
            <div className="section-label">Project Timeline</div>
            <h2>From Brief to Launch in 6 Weeks</h2>
            <p style={{ marginBottom: 20 }}>All deadlines are contingent on timely content supply from Elite Sydney Property (photos, team bios, copy approvals).</p>
            <div className="timeline">
              {[
                ["Week 1", "Discovery & Design Brief", "Kick-off call, gather all content, photos, brand assets. Present homepage design mockup for approval."],
                ["Week 2", "Design Sign-Off & Build Begins", "Full design approved. Development starts across all pages. VaultRE API connection initiated."],
                ["Weeks 3–4", "Full Site Build + VaultRE Integration", "All pages built. Live listing sync tested with your Vault account. Suburb SEO pages written and loaded."],
                ["Week 5", "Sarah AI Deployment + Testing", "Dedicated Twilio number provisioned. Sarah configured with your agency's property knowledge. Full QA testing."],
                ["Week 6", "Review, Revisions & Launch", "Walkthrough with your team. Final revisions. DNS migration from your current host. Go live."],
                ["Post-launch", "30-Day Hyper-Support Period", "Priority response on all issues. Weekly check-in calls. Fine-tune Sarah's responses based on real conversations."],
              ].map(([week, title, desc]) => (
                <div className="tl-item" key={week}>
                  <div className="tl-line">
                    <div className="tl-dot" />
                    <div className="tl-stem" />
                  </div>
                  <div className="tl-content">
                    <div className="tl-week">{week}</div>
                    <div className="tl-title">{title}</div>
                    <div className="tl-desc">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What you get ongoing */}
          <div className="section">
            <div className="section-label">Ongoing Support</div>
            <h2>What's Included Every Month</h2>
            <div className="checklist">
              {[
                "Sarah AI voice and chat — 24/7, no holidays, no sick days",
                "Hosted on our platform — no WordPress plugins to update, no security patches, no crashes",
                "VaultRE listing sync — new listings appear automatically within minutes of going live in Vault",
                "Lead dashboard — all calls, chats, enquiries and transcripts logged and accessible",
                "Monthly reporting — lead volume, call analytics, top enquiry types",
                "Priority email/phone support — direct line to Jayson",
              ].map(item => (
                <div className="cl-item" key={item}>
                  <div className="cl-icon">
                    <svg viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Terms */}
          <div className="section">
            <div className="section-label">Terms & Conditions</div>
            <h2>Agreement Terms</h2>
            <div className="terms">
              <ol>
                <li><strong>Deposit:</strong> 50% of the one-time setup fee is due upon signing to commence work. The remaining 50% is due on launch day prior to DNS migration.</li>
                <li><strong>Monthly subscription:</strong> Billed monthly via credit card. Cancellation requires 30 days written notice. No lock-in contract.</li>
                <li><strong>Content supply:</strong> Elite Sydney Property is responsible for providing all photos, team bios, copy and brand assets within 5 business days of project kick-off. Delays in content supply will extend the timeline accordingly.</li>
                <li><strong>VaultRE access:</strong> Elite Sydney Property is responsible for provisioning Directive OS with appropriate API access to the VaultRE account. Directive OS will not access or store any client data beyond what is required to display property listings publicly.</li>
                <li><strong>Intellectual property:</strong> Upon final payment, Elite Sydney Property owns all website content and design files. Directive OS retains ownership of the underlying platform and AI infrastructure.</li>
                <li><strong>Liability:</strong> Directive OS is not liable for inaccuracies in property listing data supplied via VaultRE, nor for any content published at the direction of Elite Sydney Property without prior written proofing approval.</li>
                <li><strong>Proposal validity:</strong> This proposal is valid for 30 days from {TODAY} and expires on {EXPIRY}.</li>
              </ol>
            </div>
          </div>

          {/* Signature */}
          <div className="section">
            <div className="section-label">Acceptance</div>
            <h2>Sign to Proceed</h2>
            <p>By signing below, Elite Sydney Property confirms acceptance of the scope, pricing, and terms outlined in this proposal. Work commences upon receipt of the signed proposal and 50% deposit.</p>
            <div className="sig-grid">
              <div className="sig-box">
                <div className="sig-label">Authorised · Directive OS</div>
                <div className="sig-line">
                  <div className="sig-name">Jayson</div>
                  <div className="sig-role">Founder · Directive OS</div>
                  <div className="sig-role" style={{ marginTop: 4 }}>hello@directiveos.com.au · 02 5850 4038</div>
                </div>
              </div>
              <div className="sig-box">
                <div className="sig-label">Authorised · Elite Sydney Property</div>
                <div className="sig-line">
                  <div className="sig-name" style={{ color: "#d1d5db" }}>_________________________</div>
                  <div className="sig-role">Name &amp; Title</div>
                  <div className="sig-role" style={{ marginTop: 4 }}>Date: ___________________</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── Footer ── */}
        <div className="footer">
          <div className="footer-left">
            <div className="brand">Directive OS</div>
            hello@directiveos.com.au · 02 5850 4038<br />
            directiveos.com.au · ABN registered · GST included where applicable
          </div>
          <div className="footer-right">
            Confidential — prepared for Elite Sydney Property only<br />
            Valid until {EXPIRY}<br />
            Ref: DOS-ELITE-2025
          </div>
        </div>

      </div>
    </>
  );
}
