import { useState } from "react";

const TEAL = "#00d1b2";

const signatureHtml = `<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #1a1a2e;">
  <tr>
    <td style="padding-right: 16px; border-right: 2px solid #00d1b2; vertical-align: middle;">
      <img src="https://directiveos.com.au/logo.png" width="52" height="52" alt="Directive OS" style="display:block;" />
    </td>
    <td style="padding-left: 16px; vertical-align: middle;">
      <div style="font-weight: 800; font-size: 15px; color: #0a0f1a; letter-spacing: 0.02em;">Jayson</div>
      <div style="font-size: 10px; font-weight: 700; color: #00d1b2; text-transform: uppercase; letter-spacing: 0.15em; margin: 2px 0 10px;">Founder &mdash; Directive OS</div>
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="padding-right: 8px; font-size: 11px; color: #555; padding-bottom: 3px;">📞</td>
          <td style="font-size: 11px; color: #555; padding-bottom: 3px;">02 5850 4038</td>
        </tr>
        <tr>
          <td style="padding-right: 8px; font-size: 11px; color: #555; padding-bottom: 3px;">✉</td>
          <td style="font-size: 11px; color: #555; padding-bottom: 3px;"><a href="mailto:jayson@directiveos.com.au" style="color:#00d1b2;text-decoration:none;">jayson@directiveos.com.au</a></td>
        </tr>
        <tr>
          <td style="padding-right: 8px; font-size: 11px; color: #555;">🌐</td>
          <td style="font-size: 11px;"><a href="https://directiveos.com.au" style="color:#00d1b2;text-decoration:none;">directiveos.com.au</a></td>
        </tr>
      </table>
      <div style="margin-top: 10px; padding: 6px 10px; background: #f0fdfb; border-left: 3px solid #00d1b2; font-size: 10px; color: #555; font-style: italic;">
        AI Receptionist · 24/7 Business Assistant · Never Miss a Lead
      </div>
    </td>
  </tr>
</table>`;

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      style={{ padding: "8px 20px", borderRadius: 8, border: `1px solid ${copied ? TEAL : "#334155"}`, background: copied ? "rgba(0,209,178,0.1)" : "#0a0f1a", color: copied ? TEAL : "#94a3b8", fontWeight: 700, cursor: "pointer", fontSize: 13 }}
    >
      {copied ? "✓ Copied!" : label}
    </button>
  );
}

export default function EmailSignature() {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1a", color: "#fff", fontFamily: "Inter, sans-serif", padding: "40px 24px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <a href="/marketing" style={{ color: "#64748b", fontSize: 13, textDecoration: "none" }}>← Back to Marketing</a>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "12px 0 4px" }}>Email Signature</h1>
        <p style={{ color: "#64748b", marginBottom: 32 }}>HTML signature compatible with Gmail and Outlook. Follow the install instructions below.</p>

        {/* Live Preview */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Preview</div>
          <div style={{ background: "#fff", borderRadius: 12, padding: "28px 32px", display: "inline-block", minWidth: 360 }}>
            <div dangerouslySetInnerHTML={{ __html: signatureHtml }} />
          </div>
        </div>

        {/* HTML Code */}
        <div style={{ marginBottom: 24, background: "#111827", border: "1px solid #1e293b", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>HTML Code</span>
            <CopyButton text={signatureHtml} label="Copy HTML" />
          </div>
          <pre style={{ margin: 0, padding: "20px", fontSize: 11, color: "#64748b", overflowX: "auto", lineHeight: 1.6, fontFamily: "monospace", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{signatureHtml}</pre>
        </div>

        {/* Install Instructions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            {
              title: "Gmail",
              steps: [
                "Open Gmail → Settings (⚙) → See all settings",
                "Go to the General tab",
                "Scroll to Signature → Create new",
                "Click the < > (source code) button in the editor",
                "Paste the HTML code and click Save changes",
              ],
            },
            {
              title: "Outlook",
              steps: [
                "Open Outlook → File → Options → Mail",
                "Click Signatures → New",
                "In the editor, click the HTML button",
                "Paste the HTML code",
                "Set as default for New messages and Save",
              ],
            },
          ].map(({ title, steps }) => (
            <div key={title} style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 12, padding: "20px 24px" }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: TEAL, display: "inline-block" }} />
                {title}
              </div>
              {steps.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                  <div style={{ color: TEAL, fontWeight: 700, fontSize: 11, flexShrink: 0, paddingTop: 1 }}>{i + 1}.</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>{s}</div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20, padding: "14px 20px", background: "rgba(0,209,178,0.05)", border: "1px solid rgba(0,209,178,0.15)", borderRadius: 10, fontSize: 12, color: "#64748b" }}>
          <strong style={{ color: TEAL }}>Note:</strong> The logo in the signature loads from directiveos.com.au — make sure the site is published and live for the image to appear in recipients' inboxes.
        </div>
      </div>
    </div>
  );
}
