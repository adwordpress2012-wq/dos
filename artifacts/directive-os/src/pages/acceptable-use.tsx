import { AppLayout } from "@/components/layout/MarketingLayout";

export default function AcceptableUsePage() {
  return (
    <AppLayout>
      <section className="py-20">
        <div className="container mx-auto max-w-3xl px-4">
          <h1 className="text-3xl font-bold text-foreground">Acceptable Use Policy</h1>
          <p className="mt-4 text-muted-foreground">
            Directive OS services must not be used for unlawful, deceptive, abusive, or harmful activity.
            Automated outreach and conversational flows must comply with Australian law and platform terms.
          </p>
        </div>
      </section>
    </AppLayout>
  );
}
