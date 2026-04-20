import { useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { customFetch } from "@workspace/api-client-react";
import {
  Phone, CheckCircle, ArrowRight, Loader2, Zap, Shield, Clock,
} from "lucide-react";

// ─── Zod schema — mirrors ProspectCaptureBody on the server ──────────────────

const ProspectSchema = z.object({
  name:       z.string().min(2,  "Name must be at least 2 characters"),
  email:      z.string().email("Please enter a valid email address"),
  agencyName: z.string().min(2,  "Agency name must be at least 2 characters"),
});

type ProspectFields = z.infer<typeof ProspectSchema>;
type FieldErrors    = Partial<Record<keyof ProspectFields, string>>;

// ─── Constants ────────────────────────────────────────────────────────────────

const BENEFITS = [
  { icon: Phone,        text: "Sarah answers every call in under 2 seconds — 24 hours, 7 days" },
  { icon: CheckCircle,  text: "Full lead transcript emailed to you after every conversation" },
  { icon: Clock,        text: "Setup in under 48 hours — no IT team required" },
  { icon: Zap,          text: "Live VaultRE sync — leads go straight into your CRM" },
  { icon: Shield,       text: "Australian-hosted, Privacy Act compliant" },
  { icon: ArrowRight,   text: "Cancel any time — no lock-in contracts" },
];

const STEPS = [
  { n: "01", title: "Tell us about your agency",  desc: "Name, email, and agency — takes 30 seconds." },
  { n: "02", title: "Choose your plan & seats",   desc: "Pick the right size for your team." },
  { n: "03", title: "Sarah goes live",             desc: "We configure and activate your number within 48 hours." },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function GetStarted() {
  const [, navigate] = useLocation();

  const [form, setForm]             = useState<ProspectFields>({ name: "", email: "", agencyName: "" });
  const [errors, setErrors]         = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function update(key: keyof ProspectFields) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(f => ({ ...f, [key]: e.target.value }));
      if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    // ── Client-side Zod validation ──────────────────────────────────────────
    const result = ProspectSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof ProspectFields;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    // ── POST to /api/prospects, then forward to /onboard wizard ────────────
    setSubmitting(true);
    try {
      await customFetch("/api/prospects", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(result.data),
      });

      // Pass details as query params so /onboard can pre-fill Step 1
      const qs = new URLSearchParams({
        name:       result.data.name,
        email:      result.data.email,
        agencyName: result.data.agencyName,
      });
      navigate(`/onboard?${qs.toString()}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong — please try again.";
      setServerError(message);
      setSubmitting(false);
    }
  }

  function inputClass(hasError: boolean) {
    return [
      "w-full bg-muted border rounded-lg px-3 py-2.5 text-sm text-foreground",
      "placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors",
      hasError
        ? "border-destructive focus:ring-destructive/30"
        : "border-border focus:ring-primary/30 focus:border-primary",
    ].join(" ");
  }

  return (
    <div className="min-h-screen bg-background">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header className="border-b border-border/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center font-bold text-primary-foreground text-sm select-none">
            D
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">Directive OS</span>
        </div>
        <a
          href="tel:0285504038"
          className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <Phone className="w-3.5 h-3.5" />
          02 5850 4038
        </a>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* ── Left — pitch copy ──────────────────────────────────────── */}
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 border"
              style={{ background: "rgba(0,209,178,0.06)", borderColor: "rgba(0,209,178,0.25)", color: "#00d1b2" }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-primary" />
              Sarah is answering calls right now
            </div>

            <h1 className="text-4xl font-bold text-foreground leading-tight mb-4">
              Your agency's AI receptionist.{" "}
              <span className="text-primary">Live in 48 hours.</span>
            </h1>

            <p className="text-muted-foreground text-base leading-relaxed mb-10">
              Sarah answers every call, captures every lead, and emails you a full summary before
              you've even looked at your phone. No missed calls. No voicemail. No lost commissions.
            </p>

            <ul className="space-y-3 mb-12">
              {BENEFITS.map(b => (
                <li key={b.text} className="flex items-start gap-3">
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "rgba(0,209,178,0.1)", border: "1px solid rgba(0,209,178,0.2)" }}
                  >
                    <b.icon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">{b.text}</span>
                </li>
              ))}
            </ul>

            <div className="border border-border/60 rounded-2xl p-6 bg-card">
              <p className="text-xs font-bold tracking-wider text-muted-foreground mb-5 uppercase">
                How it works
              </p>
              <div className="space-y-5">
                {STEPS.map((s, i) => (
                  <div key={s.n} className="flex gap-4">
                    <div
                      className="text-2xl font-black font-mono leading-none mt-0.5"
                      style={{ color: "rgba(0,209,178,0.35)" }}
                    >
                      {s.n}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground mb-0.5">{s.title}</div>
                      <div className="text-xs text-muted-foreground">{s.desc}</div>
                      {i < STEPS.length - 1 && (
                        <div className="w-px h-4 bg-border/50 ml-0.5 mt-2" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right — lead capture form ───────────────────────────────── */}
          <div className="lg:sticky lg:top-8">
            <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
              <h2 className="text-xl font-bold text-foreground mb-1">Get started today</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Free to set up. We'll have Sarah answering your calls within 48 hours.
              </p>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Your name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    autoComplete="name"
                    placeholder="Jane Smith"
                    value={form.name}
                    onChange={update("name")}
                    className={inputClass(!!errors.name)}
                  />
                  {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Work email <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="jane@youragency.com.au"
                    value={form.email}
                    onChange={update("email")}
                    className={inputClass(!!errors.email)}
                  />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Agency name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    autoComplete="organization"
                    placeholder="Pinnacle Real Estate"
                    value={form.agencyName}
                    onChange={update("agencyName")}
                    className={inputClass(!!errors.agencyName)}
                  />
                  {errors.agencyName && <p className="text-xs text-destructive mt-1">{errors.agencyName}</p>}
                </div>

                {serverError && (
                  <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3">
                    <p className="text-xs text-destructive">{serverError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-semibold py-3 rounded-lg text-sm transition-colors mt-2"
                >
                  {submitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving your details...</>
                  ) : (
                    <>Continue to setup <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-border/60 space-y-2">
                {[
                  "No credit card required to get started",
                  "Setup completed by our team — not you",
                  "Australian-owned and operated",
                ].map(t => (
                  <div key={t} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    {t}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Phone className="w-3.5 h-3.5" />
              <span>
                Want to hear Sarah first?{" "}
                <a href="tel:0285504038" className="text-primary hover:text-primary/80 font-semibold">
                  Call 02 5850 4038
                </a>
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
