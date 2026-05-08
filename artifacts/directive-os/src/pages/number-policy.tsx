import { AppLayout } from "@/components/layout/MarketingLayout";

export default function NumberPolicyPage() {
  return (
    <AppLayout>
      <section className="py-20">
        <div className="container mx-auto max-w-3xl px-4">
          <h1 className="text-3xl font-bold text-foreground">Number Policy</h1>
          <p className="mt-4 text-muted-foreground">
            Dedicated service numbers remain under approved operational use for active subscriptions.
            Any reassignment, suspension, or release follows billing status, compliance checks, and written notice.
          </p>
        </div>
      </section>
    </AppLayout>
  );
}
