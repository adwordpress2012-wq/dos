import { AppLayout } from "@/components/layout/MarketingLayout";
import { Download, Play, BookOpen, Video, FileText, Users, Phone, Globe } from "lucide-react";

export default function Resources() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-2">Client Resources</h1>
          <p className="text-muted-foreground">Everything you need to get the most from Directive OS.</p>
        </div>

        {/* Downloads */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-6">Documentation</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                icon: <BookOpen className="w-5 h-5" />,
                title: "AI Agency Operations Manual",
                desc: "Complete guide to Directive OS: setup, configuration, lead management, and best practices for Australian real estate agencies.",
                size: "PDF, 2.4MB",
                color: "text-primary bg-primary/10"
              },
              {
                icon: <FileText className="w-5 h-5" />,
                title: "NSW Fair Trading Tenancy Form",
                desc: "The standard Residential Tenancy Agreement (Form 1) used by the AI Receptionist when emailing applications to prospective tenants.",
                size: "PDF, 320KB",
                color: "text-emerald-400 bg-emerald-500/10"
              },
              {
                icon: <Users className="w-5 h-5" />,
                title: "Agent Quick Reference Card",
                desc: "A one-page summary of the Lead Inbox, call transfer protocols, and form request workflow. Perfect for printing.",
                size: "PDF, 180KB",
                color: "text-blue-400 bg-blue-500/10"
              },
              {
                icon: <Globe className="w-5 h-5" />,
                title: "VaultRE Integration Guide",
                desc: "Step-by-step instructions for connecting your VaultRE account, syncing listings, and keeping agent data up to date.",
                size: "PDF, 890KB",
                color: "text-purple-400 bg-purple-500/10"
              },
            ].map(doc => (
              <div key={doc.title} className="bg-card border border-border rounded-xl p-5 flex items-start gap-4 hover:border-primary/30 transition-colors">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${doc.color}`}>
                  {doc.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-1">{doc.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{doc.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{doc.size}</span>
                    <button className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors">
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Training Videos */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-6">Training Videos</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: "Getting Started with Directive OS",
                duration: "12:34",
                desc: "Complete walkthrough of the Command Centre dashboard, lead inbox, and first-week setup checklist."
              },
              {
                title: "Lead Management & Follow-Up",
                duration: "8:15",
                desc: "How to review transcripts, update lead status, and set up automated follow-up workflows."
              },
              {
                title: "The Tenant Application Flow",
                duration: "6:42",
                desc: "How the AI identifies tenant leads, offers the tenancy form, and logs form requests in your inbox."
              },
              {
                title: "Hot Lead Transfer Protocol",
                duration: "5:28",
                desc: "Understanding the hot lead detection system and how calls are transferred to your listing agents."
              },
              {
                title: "Billing & Seat Management",
                duration: "4:55",
                desc: "How to add and remove seats, review your AI usage, and download GST-compliant tax invoices."
              },
              {
                title: "VaultRE Sync Setup",
                duration: "7:20",
                desc: "Connecting VaultRE, scheduling automatic syncs, and keeping your listing data current."
              },
            ].map(video => (
              <div key={video.title} className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-colors">
                <div className="bg-muted aspect-video flex items-center justify-center relative">
                  <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <Play className="w-5 h-5 text-primary ml-0.5" />
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">{video.duration}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-foreground text-sm mb-1">{video.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{video.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Support */}
        <section>
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <Phone className="w-8 h-8 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Need Help?</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">Our Australian support team is available Monday–Friday, 9am–5pm AEST. For urgent issues, email support@directiveos.com.au.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="mailto:support@directiveos.com.au" className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
                Email Support
              </a>
              <button className="bg-muted border border-border hover:border-primary/40 text-foreground px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
                Book a Training Call
              </button>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
