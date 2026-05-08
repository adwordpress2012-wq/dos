import { useEffect } from "react";
import { AppLayout } from "@/components/layout/MarketingLayout";

const ITEMS = [
  "Website rebuilds and conversion-focused redesigns",
  "Micah AI Receptionist voice and chat setup",
  "COS (Chat OS) implementation and optimization",
  "BOS (Book OS) request capture and booking workflow handoff",
  "Business automation and workflow integrations",
  "Managed hosting and uptime support",
  "Command Centre rollout and team onboarding",
];

export default function ContactPage() {
  useEffect(() => {
    document.title = "DirectiveOS — Done-For-You AI Business Systems";
  }, []);

  return (
    <AppLayout>
      <section className="py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-8 md:p-10">
            <p className="text-xs uppercase tracking-[0.18em] text-emerald-300">Contact</p>
            <h1 className="mt-3 text-3xl font-bold text-white md:text-5xl">
              DirectiveOS — Done-For-You AI Business Systems
            </h1>
            <p className="mt-4 text-white/75">
              Tell us what you need and we will scope, build, and deploy the stack with your team.
            </p>

            <ul className="mt-8 space-y-3">
              {ITEMS.map((item) => (
                <li key={item} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white/85">
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              <a
                href="mailto:support@directiveos.com.au"
                className="rounded-lg bg-emerald-400 px-5 py-3 font-semibold text-black"
              >
                support@directiveos.com.au
              </a>
              <a
                href="tel:0258504038"
                className="rounded-lg border border-white/20 px-5 py-3 font-semibold text-white"
              >
                02 5850 4038
              </a>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
