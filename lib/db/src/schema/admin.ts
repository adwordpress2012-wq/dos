import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const adminExpensesTable = pgTable("admin_expenses", {
  id: serial("id").primaryKey(),
  category: text("category").notNull().default("other"),
  description: text("description").notNull(),
  amountCents: integer("amount_cents").notNull(),
  expenseDate: text("expense_date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const adminPipelineTable = pgTable("admin_pipeline", {
  id: serial("id").primaryKey(),
  agencyName: text("agency_name").notNull(),
  contactName: text("contact_name").notNull(),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  stage: text("stage").notNull().default("lead"),
  source: text("source").default("direct"),
  notes: text("notes"),
  estimatedValue: integer("estimated_value_cents").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertAdminExpenseSchema = createInsertSchema(adminExpensesTable).omit({ id: true, createdAt: true });
export type InsertAdminExpense = z.infer<typeof insertAdminExpenseSchema>;
export type AdminExpense = typeof adminExpensesTable.$inferSelect;

export const insertAdminPipelineSchema = createInsertSchema(adminPipelineTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertAdminPipeline = z.infer<typeof insertAdminPipelineSchema>;
export type AdminPipeline = typeof adminPipelineTable.$inferSelect;
