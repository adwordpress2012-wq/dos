import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";

export const quoteLinksTable = pgTable("quote_links", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  stripeUrl: text("stripe_url").notNull(),
  agencyName: text("agency_name"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type QuoteLink = typeof quoteLinksTable.$inferSelect;
