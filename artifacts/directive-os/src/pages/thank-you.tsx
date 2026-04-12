import { Link } from "wouter";
import { AppLayout } from "@/components/layout/MarketingLayout";
import { CheckCircle, Calendar, ArrowRight } from "lucide-react";

const CALENDLY = "https://calendly.com/adwordpress2012/directive-os-agency-onboarding";

export default function ThankYou() {
  return (
    <AppLayout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: "rgba(0,209,178,0.12)", border: "2px solid rgba(0,209,178,0.4)" }}>
              <CheckCircle className="w-10 h-10" style={{ color: "#00d1b2" }} />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 border"
            style={{ color: "#00d1b2", borderColor: "rgba(0,209,178,0.3)", background: "rgba(0,209,178,0.08)" }}>
            YOU'RE IN
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-4 leading-tight">
            Thanks — we'll be in touch shortly.
          </h1>

          <p className="text-muted-foreground text-base leading-relaxed mb-8">
            A member of the Directive OS team will reach out within 1 business day. 
            In the meantime, book a free strategy call to skip the queue.
          </p>

          <a
            href={CALENDLY}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-bold px-8 py-3.5 rounded-lg transition-all hover:opacity-90 mb-4 text-sm"
            style={{ background: "linear-gradient(135deg, #00d1b2, #00b89c)", color: "#0a0a0a" }}
          >
            <Calendar className="w-4 h-4" />
            Book a Free Strategy Call
            <ArrowRight className="w-4 h-4" />
          </a>

          <div className="mt-4">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
