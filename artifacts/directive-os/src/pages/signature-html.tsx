import { AppLayout } from "@/components/layout/MarketingLayout";

const signatureHtml = `
<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,sans-serif;color:#0f172a;max-width:560px;">
  <tr>
    <td style="padding:0 18px 0 0;vertical-align:middle;">
      <img src="https://directiveos.com.au/logo.png" alt="Directive OS" width="92" height="92" style="display:block;border-radius:999px;" />
    </td>
    <td style="border-left:3px solid #00d1b2;padding:0 0 0 18px;vertical-align:middle;">
      <div style="font-size:22px;line-height:1.1;font-weight:700;color:#0f172a;">Jayson Ocampo</div>
      <div style="font-size:13px;letter-spacing:1.8px;text-transform:uppercase;color:#00d1b2;font-weight:700;margin-top:3px;">Directive OS</div>
      <div style="height:1px;background:#e5e7eb;margin:14px 0;max-width:320px;"></div>
      <div style="font-size:14px;line-height:1.7;color:#0f172a;">
        📱 <strong>0434 666 080</strong><br />
        ✉️ <a href="mailto:jayson@directiveos.com.au" style="color:#0f172a;text-decoration:none;font-weight:700;">jayson@directiveos.com.au</a><br />
        🌐 <a href="https://directiveos.com.au" style="color:#00d1b2;text-decoration:none;font-weight:700;">directiveos.com.au</a>
      </div>
    </td>
  </tr>
  <tr>
    <td colspan="2" style="padding-top:18px;">
      <div style="background:#0f172a;color:#ffffff;border-radius:12px;padding:12px 16px;font-size:13px;line-height:1.4;">
        <span style="opacity:0.82;">AI Receptionist & Web Solutions for Australian Real Estate</span>
        <span style="color:#00d1b2;font-weight:700;"> · Never miss a call. Never miss a lead.</span>
      </div>
    </td>
  </tr>
</table>`;

export default function SignatureHtml() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Email Signature HTML</h1>
          <p className="text-muted-foreground text-sm">Copy this into your Outlook signature editor.</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 md:p-6 shadow-sm space-y-4">
          <textarea readOnly value={signatureHtml} className="w-full min-h-[340px] rounded-xl border border-border bg-background p-4 text-xs font-mono text-foreground resize-y" />
          <div className="text-sm text-muted-foreground">Tip: in Outlook, paste the HTML into a signature editor or use the image version at <a href="/signature" className="text-primary hover:underline">/signature</a>.</div>
        </div>
      </div>
    </AppLayout>
  );
}
