import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useOnboardAgency } from "@workspace/api-client-react";
import { Check, ChevronRight, Shield, ArrowLeft } from "lucide-react";

const STEPS = ["Agency Details", "Select Seats", "Legal & Payment"];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold border-2 transition-colors ${
            i < current
              ? "bg-primary border-primary text-primary-foreground"
              : i === current
              ? "border-primary text-primary"
              : "border-border text-muted-foreground"
          }`}>
            {i < current ? <Check className="w-4 h-4" /> : i + 1}
          </div>
          <span className={`text-sm hidden sm:block ${i === current ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s}</span>
          {i < STEPS.length - 1 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
        </div>
      ))}
    </div>
  );
}

export default function Onboard() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({
    name: "",
    abn: "",
    contactEmail: "",
    contactPhone: "",
    seatCount: 1,
  });

  const onboard = useOnboardAgency();

  const BASE_PRICE = 299;
  const SEAT_PRICE = 89;
  const SETUP_FEE = 1500;
  const monthly = BASE_PRICE + Math.max(0, form.seatCount - 1) * SEAT_PRICE;

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    try {
      await onboard.mutateAsync({
        data: {
          clerkOrgId: `org_${Date.now()}`,
          name: form.name,
          abn: form.abn,
          contactEmail: form.contactEmail,
          contactPhone: form.contactPhone,
          seatCount: form.seatCount,
          termsAccepted: true,
        },
      });
      navigate("/dashboard");
    } catch (err) {
      alert("There was an error processing your request. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center font-bold text-primary-foreground text-sm">
            D
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">Directive OS</span>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          <StepIndicator current={step} />

          {/* Step 1: Agency Details */}
          {step === 0 && (
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">Agency Details</h2>
              <p className="text-muted-foreground text-sm mb-6">Enter your agency information to get started.</p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Agency Name *</label>
                  <input
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Pinnacle Real Estate"
                    className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">ABN (Australian Business Number) *</label>
                  <input
                    value={form.abn}
                    onChange={e => setForm(p => ({ ...p, abn: e.target.value }))}
                    placeholder="12 345 678 901"
                    className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Contact Email *</label>
                  <input
                    type="email"
                    value={form.contactEmail}
                    onChange={e => setForm(p => ({ ...p, contactEmail: e.target.value }))}
                    placeholder="principal@youragency.com.au"
                    className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Contact Phone</label>
                  <input
                    value={form.contactPhone}
                    onChange={e => setForm(p => ({ ...p, contactPhone: e.target.value }))}
                    placeholder="02 9000 0000"
                    className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <button
                onClick={handleNext}
                disabled={!form.name || !form.abn || !form.contactEmail}
                className="w-full mt-6 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground py-3 rounded-lg text-sm font-semibold transition-colors"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Select Seats */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">Select Your Seats</h2>
              <p className="text-muted-foreground text-sm mb-6">How many agents will use Directive OS?</p>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-foreground">Agent Seats</label>
                  <span className="text-2xl font-bold text-primary">{form.seatCount}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={form.seatCount}
                  onChange={e => setForm(p => ({ ...p, seatCount: Number(e.target.value) }))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1 seat</span>
                  <span>15 seats</span>
                </div>
              </div>
              <div className="bg-muted rounded-xl p-5 space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Base License (1st seat)</span>
                  <span className="font-medium">${BASE_PRICE}/mo</span>
                </div>
                {form.seatCount > 1 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{form.seatCount - 1} additional seat{form.seatCount > 2 ? "s" : ""} × $89</span>
                    <span className="font-medium">${(form.seatCount - 1) * SEAT_PRICE}/mo</span>
                  </div>
                )}
                <div className="flex justify-between text-sm border-t border-border pt-3">
                  <span className="font-semibold text-foreground">Monthly Total</span>
                  <span className="font-bold text-primary text-lg">${monthly}/mo</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>One-time setup fee</span>
                  <span>${SETUP_FEE} AUD</span>
                </div>
                <div className="text-xs text-muted-foreground">All prices shown exclude GST</div>
              </div>
              <div className="flex gap-3">
                <button onClick={handleBack} className="flex-1 flex items-center justify-center gap-1 bg-muted border border-border text-muted-foreground hover:text-foreground py-3 rounded-lg text-sm font-medium transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={handleNext} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg text-sm font-semibold transition-colors">
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Legal & Payment */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">Legal Agreement & Payment</h2>
              <p className="text-muted-foreground text-sm mb-6">Review and agree to proceed with your account activation.</p>

              <div className="bg-muted rounded-xl p-5 mb-6 space-y-2">
                <div className="text-sm font-medium text-foreground">{form.name}</div>
                <div className="text-xs text-muted-foreground">ABN: {form.abn}</div>
                <div className="text-xs text-muted-foreground">{form.contactEmail}</div>
                <div className="border-t border-border pt-3 mt-3 flex justify-between text-sm">
                  <span className="text-muted-foreground">{form.seatCount} seat{form.seatCount > 1 ? "s" : ""}</span>
                  <span className="font-bold text-primary">${monthly}/mo + ${SETUP_FEE} setup</span>
                </div>
              </div>

              <label className="flex items-start gap-3 mb-6 cursor-pointer group">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={e => setAgreed(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${agreed ? "bg-primary border-primary" : "border-border bg-muted group-hover:border-primary/50"}`}>
                    {agreed && <Check className="w-3 h-3 text-white" />}
                  </div>
                </div>
                <span className="text-sm text-muted-foreground leading-relaxed">
                  I agree to the Directive OS{" "}
                  <Link href="/terms" target="_blank" className="text-primary hover:text-primary/80 underline">SaaS Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="/privacy" target="_blank" className="text-primary hover:text-primary/80 underline">Privacy Policy</Link>.
                  I acknowledge that AI data collection and processing will occur in accordance with the Australian Privacy Act 1988 and the APP principles.
                </span>
              </label>

              <div className="flex items-start gap-2 text-xs text-muted-foreground mb-6 bg-muted/50 rounded-lg p-3">
                <Shield className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Your payment is processed securely by Stripe. The $1,500 setup fee will be charged immediately. Your monthly subscription begins after onboarding is complete.</span>
              </div>

              <div className="flex gap-3">
                <button onClick={handleBack} className="flex-1 flex items-center justify-center gap-1 bg-muted border border-border text-muted-foreground hover:text-foreground py-3 rounded-lg text-sm font-medium transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!agreed || onboard.isPending}
                  className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed text-primary-foreground py-3 rounded-lg text-sm font-semibold transition-colors"
                >
                  {onboard.isPending ? "Activating..." : "Proceed to Payment"}
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary hover:text-primary/80">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
