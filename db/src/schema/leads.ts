import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const leadsTable = pgTable("leads", {
  id: serial("id").primaryKey(),
  agencyId: integer("agency_id").notNull(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  leadType: text("lead_type").notNull().default("unknown"),
  status: text("status").notNull().default("new"),
  listingId: integer("listing_id"),
  listingAddress: text("listing_address"),
  notes: text("notes"),
  formRequested: boolean("form_requested").notNull().default(false),
  hotLead: boolean("hot_lead").notNull().default(false),
  channel: text("channel").notNull().default("chat"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertLeadSchema = createInsertSchema(leadsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leadsTable.$inferSelect;
