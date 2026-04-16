import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import Stripe from "stripe";
import router from "./routes";
import { logger } from "./lib/logger";
import { sendNewClientNotification, sendClientWelcomeEmail, sendPaymentFailedAlert, sendSubscriptionCanceledAlert } from "./lib/email";
import { db, agenciesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const app: Express = express();

// ─── Stripe Webhook (MUST be before express.json() — needs raw body) ──────────
app.post("/api/billing/webhook", express.raw({ type: "application/json" }), async (req: Request, res: Response): Promise<void> => {
  const sig = req.headers["stripe-signature"] as string | undefined;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    logger.warn("STRIPE_WEBHOOK_SECRET not set — webhook ignored");
    res.status(200).json({ received: true, warning: "Webhook secret not configured" });
    return;
  }

  const stripeKey = process.env.STRIPE_KEY_ACTIVE;
  if (!stripeKey) { res.status(500).json({ error: "Stripe not configured" }); return; }
  const stripe = new Stripe(stripeKey, { apiVersion: "2025-03-31.basil" });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig ?? "", webhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    logger.warn({ msg }, "Stripe webhook signature verification failed");
    res.status(400).json({ error: `Webhook error: ${msg}` });
    return;
  }

  logger.info({ type: event.type }, "Stripe webhook received");

  // ── New signup via landing page ────────────────────────────────────────────
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata ?? {};

    if (meta.source === "landing_page") {
      const { agencyName, agencySlug, contactName, phone } = meta;
      const clientEmail = session.customer_email ?? meta.email ?? "";
      const amountPaid = (session.amount_total ?? 0) / 100;

      logger.info({ agencyName, clientEmail }, "New prospect payment from landing page");

      void sendNewClientNotification({
        agencyName: agencyName ?? "Unknown Agency",
        agencySlug: agencySlug ?? "",
        contactName: contactName ?? "",
        email: clientEmail,
        phone: phone ?? "",
        amountPaid,
        stripeSessionId: session.id,
      });

      if (clientEmail) {
        void sendClientWelcomeEmail({
          contactName: contactName ?? agencyName ?? "there",
          agencyName: agencyName ?? "",
          email: clientEmail,
          agencySlug: agencySlug ?? "",
        });
      }

      try {
        const slug = agencySlug ?? agencyName?.toLowerCase().replace(/\s+/g, "-") ?? "unknown";
        const existing = await db.select().from(agenciesTable)
          .where(eq(agenciesTable.clerkOrgId, `prospect_${slug}`));
        if (existing.length === 0) {
          await db.insert(agenciesTable).values({
            clerkOrgId: `prospect_${slug}`,
            name: agencyName ?? "Pending Agency",
            contactEmail: clientEmail,
            subscriptionStatus: "pending_setup",
            setupFeePaid: true,
            seatCount: 1,
            aiMinutesIncluded: 100,
            aiMinutesUsed: 0,
          });
          logger.info({ slug, clientEmail }, "Pending agency record created");
        }
      } catch (dbErr) {
        logger.warn({ dbErr }, "Could not create pending agency record");
      }
    }
  }

  // ── Monthly payment failed ──────────────────────────────────────────────────
  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice;
    const customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
    if (customerId) {
      try {
        const [agency] = await db.select().from(agenciesTable)
          .where(eq(agenciesTable.stripeCustomerId, customerId));

        if (agency) {
          // Mark as past_due in our DB
          await db.update(agenciesTable)
            .set({ subscriptionStatus: "past_due" })
            .where(eq(agenciesTable.id, agency.id));

          const attemptCount = invoice.attempt_count ?? 1;
          const nextRetry = invoice.next_payment_attempt
            ? new Date(invoice.next_payment_attempt * 1000).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })
            : undefined;

          void sendPaymentFailedAlert({
            agencyName: agency.name,
            contactEmail: agency.contactEmail ?? "",
            amountCents: invoice.amount_due ?? 0,
            attemptCount,
            nextRetryDate: nextRetry,
          });

          logger.info({ agencyName: agency.name, attemptCount }, "Payment failed — marked past_due");
        }
      } catch (err) {
        logger.warn({ err }, "Failed to handle invoice.payment_failed");
      }
    }
  }

  // ── Subscription cancelled by Stripe (after all retries exhausted) ──────────
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id;
    if (customerId) {
      try {
        const [agency] = await db.select().from(agenciesTable)
          .where(eq(agenciesTable.stripeCustomerId, customerId));

        if (agency) {
          await db.update(agenciesTable)
            .set({ subscriptionStatus: "cancelled" })
            .where(eq(agenciesTable.id, agency.id));

          const reason = subscription.cancellation_details?.reason ?? "non_payment";

          void sendSubscriptionCanceledAlert({
            agencyName: agency.name,
            contactEmail: agency.contactEmail ?? "",
            reason,
          });

          logger.info({ agencyName: agency.name, reason }, "Subscription cancelled — marked cancelled");
        }
      } catch (err) {
        logger.warn({ err }, "Failed to handle customer.subscription.deleted");
      }
    }
  }

  // ── Subscription updated (e.g. Stripe re-activates after payment succeeds) ──
  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id;
    if (customerId) {
      try {
        const [agency] = await db.select().from(agenciesTable)
          .where(eq(agenciesTable.stripeCustomerId, customerId));

        if (agency) {
          const stripeStatus = subscription.status; // active, past_due, canceled, trialing, etc.
          const ourStatus = stripeStatus === "active" ? "active"
            : stripeStatus === "past_due" ? "past_due"
            : stripeStatus === "canceled" ? "cancelled"
            : stripeStatus === "trialing" ? "trialing"
            : agency.subscriptionStatus; // leave unchanged for other statuses

          if (ourStatus !== agency.subscriptionStatus) {
            await db.update(agenciesTable)
              .set({ subscriptionStatus: ourStatus })
              .where(eq(agenciesTable.id, agency.id));
            logger.info({ agencyName: agency.name, from: agency.subscriptionStatus, to: ourStatus }, "Subscription status synced from Stripe");
          }
        }
      } catch (err) {
        logger.warn({ err }, "Failed to handle customer.subscription.updated");
      }
    }
  }

  res.json({ received: true });
});

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
