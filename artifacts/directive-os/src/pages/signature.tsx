import { AppLayout } from "@/components/layout/MarketingLayout";
import signatureImg from "@assets/dos-email-signature_1776414853088.png";

export default function Signature() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Email Signature</h1>
            <p className="text-muted-foreground text-sm">Professional, branded signature for Directive OS</p>
          </div>
          <a href="mailto:billing@directiveos.com.au" className="text-primary hover:underline text-sm">billing@directiveos.com.au</a>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 md:p-6 shadow-sm">
          <img src={signatureImg} alt="Directive OS email signature" className="w-full h-auto rounded-lg" />
        </div>
      </div>
    </AppLayout>
  );
}
