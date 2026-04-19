import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const listingsTable = pgTable("listings", {
  id: serial("id").primaryKey(),
  agencyId: integer("agency_id").notNull(),
  address: text("address").notNull(),
  suburb: text("suburb").notNull(),
  state: text("state").notNull(),
  postcode: text("postcode").notNull(),
  price: text("price"),
  listingType: text("listing_type").notNull().default("sale"),
  listingMethod: text("listing_method").notNull().default("private_treaty"),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  carSpaces: integer("car_spaces"),
  agentName: text("agent_name").notNull(),
  agentMobile: text("agent_mobile").notNull(),
  inspectionTimes: text("inspection_times").array().notNull().default([]),
  auctionDate: text("auction_date"),
  auctionTime: text("auction_time"),
  vaultreId: text("vaultre_id"),
  status: text("status").notNull().default("active"),
  photoUrl: text("photo_url"),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertListingSchema = createInsertSchema(listingsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertListing = z.infer<typeof insertListingSchema>;
export type Listing = typeof listingsTable.$inferSelect;
