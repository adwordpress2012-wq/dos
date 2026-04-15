import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const transcriptsTable = pgTable("transcripts", {
  id: serial("id").primaryKey(),
  agencyId: integer("agency_id").notNull(),
  leadId: integer("lead_id"),
  leadName: text("lead_name"),
  channel: text("channel").notNull().default("chat"),
  duration: integer("duration"),
  summary: text("summary"),
  recordingUrl: text("recording_url"),
  language: text("language"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const transcriptMessagesTable = pgTable("transcript_messages", {
  id: serial("id").primaryKey(),
  transcriptId: integer("transcript_id").notNull(),
  role: text("role").notNull().default("user"),
  content: text("content").notNull(),
  translatedContent: text("translated_content"),
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull().defaultNow(),
});

export const insertTranscriptSchema = createInsertSchema(transcriptsTable).omit({ id: true, createdAt: true });
export type InsertTranscript = z.infer<typeof insertTranscriptSchema>;
export type Transcript = typeof transcriptsTable.$inferSelect;

export const insertTranscriptMessageSchema = createInsertSchema(transcriptMessagesTable).omit({ id: true });
export type InsertTranscriptMessage = z.infer<typeof insertTranscriptMessageSchema>;
export type TranscriptMessage = typeof transcriptMessagesTable.$inferSelect;
