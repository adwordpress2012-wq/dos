import { AppLayout } from "@/components/layout/MarketingLayout";

export default function CancellationPolicyPage() {
  return (
    <AppLayout>
      <section className="py-20">
        <div className="container mx-auto max-w-3xl px-4">
          <h1 className="text-3xl font-bold text-foreground">Cancellation Policy</h1>
          <p className="mt-4 text-muted-foreground">
            Subscriptions can be canceled with written notice in line with your service agreement. Platform
            access and service numbers remain active through the paid period, then transition to offboarding.
          </p>
        </div>
      </section>
    </AppLayout>
  );
}
