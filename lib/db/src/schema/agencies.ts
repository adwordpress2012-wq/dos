import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const agenciesTable = pgTable("agencies", {
  id: serial("id").primaryKey(),
  clerkOrgId: text("clerk_org_id").notNull().unique(),
  name: text("name").notNull(),
  abn: text("abn").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone"),
  address: text("address"),
  logoUrl: text("logo_url"),
  stripeCustomerId: text("stripe_customer_id"),
  subscriptionStatus: text("subscription_status").notNull().default("pending"),
  setupFeePaid: boolean("setup_fee_paid").notNull().default(false),
  termsAccepted: boolean("terms_accepted").notNull().default(false),
  seatCount: integer("seat_count").notNull().default(1),
  aiMinutesUsed: integer("ai_minutes_used").notNull().default(0),
  aiMinutesIncluded: integer("ai_minutes_included").notNull().default(100),
  mobileToken: text("mobile_token").unique(),
  passwordHash: text("password_hash"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertAgencySchema = createInsertSchema(agenciesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertAgency = z.infer<typeof insertAgencySchema>;
export type Agency = typeof agenciesTable.$inferSelect;
