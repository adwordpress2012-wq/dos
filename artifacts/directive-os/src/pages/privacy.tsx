import { AppLayout } from "@/components/layout/MarketingLayout";

export default function Privacy() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm mb-8">Last updated: April 2026 | Compliant with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs)</p>

        <div className="space-y-6 text-muted-foreground">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-foreground font-semibold text-lg mb-3">1. Introduction</h2>
            <p>Directive OS Pty Ltd ("we", "our", "Directive OS") is committed to protecting the privacy of individuals and organisations that use or interact with our AI Receptionist platform. This Privacy Policy explains how we collect, use, disclose, and manage personal information in accordance with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-foreground font-semibold text-lg mb-3">2. What Personal Information We Collect</h2>
            <p className="mb-2">We collect personal information including but not limited to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Agency contact details (name, email, phone, ABN, address)</li>
              <li>Staff member details (name, email, role)</li>
              <li>Lead information captured by the AI Receptionist (caller name, email, phone number, enquiry details)</li>
              <li>Voice call recordings and transcripts</li>
              <li>Chat session content and message history</li>
              <li>Billing and payment information (processed by Stripe; we do not store card numbers)</li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-foreground font-semibold text-lg mb-3">3. AI Data Collection Disclosure</h2>
            <p>Directive OS uses artificial intelligence systems provided by third parties, including OpenAI (GPT-4o) and Vapi.ai. When a person interacts with our AI Receptionist:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Their conversation may be processed by OpenAI's servers outside of Australia.</li>
              <li>Conversation data is used to generate AI responses and may be stored to create transcripts in our platform.</li>
              <li>We do not use conversation data to train AI models without explicit consent.</li>
              <li>Agencies using Directive OS are responsible for informing their callers that they may be interacting with an AI system.</li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-foreground font-semibold text-lg mb-3">4. How We Use Personal Information</h2>
            <p>We use personal information to: provide and improve the Service; process payments; send GST-compliant tax invoices; enable real estate agencies to manage leads and listings; deliver automated tenancy application forms; comply with legal obligations; and communicate service updates.</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-foreground font-semibold text-lg mb-3">5. Disclosure to Third Parties</h2>
            <p>We may disclose personal information to: Stripe (payment processing); OpenAI (AI language model processing); Vapi.ai (voice AI); Twilio (telephony); SendGrid (email delivery); Clerk (authentication). All third-party service providers are contractually bound to maintain appropriate data security standards.</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-foreground font-semibold text-lg mb-3">6. Overseas Disclosure</h2>
            <p>Some of our third-party providers may process data outside Australia (including the United States). We take reasonable steps to ensure these providers maintain privacy protections consistent with Australian standards. By using the Service, you consent to this overseas processing.</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-foreground font-semibold text-lg mb-3">7. Data Security</h2>
            <p>We implement industry-standard security measures including encryption in transit (TLS), encryption at rest, access controls, and regular security reviews. Data is hosted on secure cloud infrastructure within Australia where feasible.</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-foreground font-semibold text-lg mb-3">8. Access and Correction</h2>
            <p>You have the right to access personal information we hold about you and request corrections. To exercise these rights, contact us at privacy@directiveos.com.au. We will respond within 30 days.</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-foreground font-semibold text-lg mb-3">9. Data Retention</h2>
            <p>We retain personal information for as long as necessary to provide the Service and comply with legal obligations. Lead data and transcripts are retained for a minimum of 7 years for tax and legal compliance purposes, unless a Customer requests earlier deletion subject to legal requirements.</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-foreground font-semibold text-lg mb-3">10. Complaints</h2>
            <p>If you believe we have breached the Australian Privacy Principles, you may lodge a complaint with us at privacy@directiveos.com.au. If your complaint is not resolved to your satisfaction, you may contact the Office of the Australian Information Commissioner (OAIC) at www.oaic.gov.au.</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-foreground font-semibold text-lg mb-3">11. Contact</h2>
            <p>Privacy Officer | Directive OS Pty Ltd | privacy@directiveos.com.au | ABN [000 000 000]</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
