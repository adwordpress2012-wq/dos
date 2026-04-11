import { CheckCircle, CalendarCheck } from "lucide-react";

export default function BillingSuccess() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[#00d1b2]/10 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-[#00d1b2]" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-3">
          Welcome to Directive OS
        </h1>
        <p className="text-muted-foreground mb-2">
          Your subscription is now active. Your account has been set up and you're ready to go.
        </p>
        <p className="text-muted-foreground mb-8">
          Book your onboarding session below so we can get your AI receptionist configured and live as quickly as possible.
        </p>

        <a
          href="https://calendly.com/adwordpress2012/directive-os-agency-onboarding"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-base transition-all hover:opacity-90 active:scale-95"
          style={{ backgroundColor: "#00d1b2", color: "#0a0a0a" }}
        >
          <CalendarCheck className="w-5 h-5" />
          Book Your Onboarding Session
        </a>

        <div className="mt-8">
          <a
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
