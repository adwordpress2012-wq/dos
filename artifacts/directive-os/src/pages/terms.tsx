import { AppLayout } from "@/components/layout/MarketingLayout";

export default function Terms() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground mb-2">SaaS Terms of Service</h1>
        <p className="text-muted-foreground text-sm mb-8">Last updated: April 2026 | Version 1.0 | Governed by the laws of New South Wales, Australia</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-8 text-muted-foreground">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-foreground font-semibold text-lg mb-3">1. Parties and Agreement</h2>
            <p>These Terms of Service ("Terms") constitute a legally binding agreement between Directive OS Pty Ltd (ACN [000 000 000]) ("Directive OS", "we", "us") and the agency or business entity ("Customer", "you") that subscribes to the Directive OS software-as-a-service platform. By registering, paying, or using the Service, you accept these Terms on behalf of your organisation.</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-foreground font-semibold text-lg mb-3">2. Description of Service</h2>
            <p>Directive OS provides an AI-powered receptionist and lead management platform including: voice AI (powered by Vapi.ai and Twilio), chat AI (powered by OpenAI GPT-4o), VaultRE CRM integration, automated tenancy form delivery, lead inbox management, and billing management tools. The Service is provided on a software-as-a-service (SaaS) basis.</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-foreground font-semibold text-lg mb-3">3. Fees and Billing</h2>
            <p><strong className="text-foreground">3.1 Setup Fee:</strong> A one-time onboarding and training fee of $1,800 AUD (excluding GST) is charged upon initial subscription.</p>
            <p className="mt-2"><strong className="text-foreground">3.2 Monthly Subscription:</strong> A recurring monthly fee of $299 AUD (excluding GST) for the base license, which includes one (1) user seat. Each additional seat is charged at $89 AUD (excluding GST) per month per seat.</p>
            <p className="mt-2"><strong className="text-foreground">3.3 Usage-Based Charges:</strong> The Service includes 100 AI minutes per month. Usage exceeding this limit is billed at $25 AUD per 10-minute block, or part thereof.</p>
            <p className="mt-2"><strong className="text-foreground">3.4 GST:</strong> All prices exclude Goods and Services Tax (GST). GST will be added where applicable under the A New Tax System (Goods and Services Tax) Act 1999 (Cth).</p>
            <p className="mt-2"><strong className="text-foreground">3.5 Tax Invoices:</strong> Directive OS will issue GST-compliant Tax Invoices as required under Australian tax law, including the Customer's ABN, the GST amount payable, and all other required disclosures.</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-foreground font-semibold text-lg mb-3">4. AI Data Disclosure</h2>
            <p>The Customer acknowledges and agrees that:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>The AI Receptionist is an automated system. Callers and chat users may interact with AI without direct human involvement.</li>
              <li>Conversations may be recorded, transcribed, and stored for lead management purposes.</li>
              <li>AI-generated responses are not legal, financial, or professional advice.</li>
              <li>The Customer is responsible for ensuring their end users are aware that they may be interacting with an AI system, in compliance with applicable Australian consumer protection laws.</li>
              <li>OpenAI processes conversation data in accordance with OpenAI's privacy policy and data processing agreement.</li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-foreground font-semibold text-lg mb-3">5. Data and Privacy</h2>
            <p>Directive OS collects and processes personal information in accordance with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs). By using the Service, Customers agree to Directive OS's Privacy Policy, which forms part of these Terms.</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-foreground font-semibold text-lg mb-3">6. Intellectual Property</h2>
            <p>All intellectual property rights in the Service, including software, algorithms, and documentation, are owned by Directive OS Pty Ltd. The Customer is granted a limited, non-exclusive, non-transferable licence to use the Service during the subscription term.</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-foreground font-semibold text-lg mb-3">7. Limitation of Liability</h2>
            <p>To the maximum extent permitted by Australian law, Directive OS's total liability to the Customer for any claim arising under or in connection with these Terms will not exceed the total fees paid by the Customer in the 12 months immediately preceding the claim. Directive OS excludes all implied warranties to the extent permitted by the Australian Consumer Law.</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-foreground font-semibold text-lg mb-3">8. Termination</h2>
            <p>Either party may terminate this agreement with 30 days written notice. Directive OS may suspend or terminate access immediately for material breach, non-payment, or conduct that is unlawful or harmful to third parties.</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-foreground font-semibold text-lg mb-3">9. Governing Law</h2>
            <p>These Terms are governed by the laws of New South Wales, Australia. The parties submit to the non-exclusive jurisdiction of the courts of New South Wales.</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-foreground font-semibold text-lg mb-3">10. Contact</h2>
            <p className="mb-3">Directive OS Pty Ltd | ABN 87 754 544 171</p>
            <table className="text-sm w-full">
              <tbody className="space-y-1">
                <tr><td className="text-foreground font-medium pr-4 py-1">General Support</td><td><a href="mailto:support@directiveos.com.au" className="text-primary hover:underline">support@directiveos.com.au</a></td></tr>
                <tr><td className="text-foreground font-medium pr-4 py-1">Billing Enquiries</td><td><a href="mailto:billing@directiveos.com.au" className="text-primary hover:underline">billing@directiveos.com.au</a></td></tr>
                <tr><td className="text-foreground font-medium pr-4 py-1">Legal Notices</td><td><a href="mailto:legal@directiveos.com.au" className="text-primary hover:underline">legal@directiveos.com.au</a></td></tr>
                <tr><td className="text-foreground font-medium pr-4 py-1">Privacy Officer</td><td><a href="mailto:privacy@directiveos.com.au" className="text-primary hover:underline">privacy@directiveos.com.au</a></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
