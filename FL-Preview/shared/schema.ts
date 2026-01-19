import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === DOMAIN TYPES ===
export const previewMetadataSchema = z.object({
  project: z.string(),
  timestamp: z.string(), // Format: YYYYMMDD_HHMMSS
  filename: z.string(),  // The MP3 filename
});

export type PreviewMetadata = z.infer<typeof previewMetadataSchema>;

// Enriched preview object with local file path
export const previewSchema = previewMetadataSchema.extend({
  url: z.string(),
  parsedDate: z.string(), // ISO string for easy sorting/display
});

export type Preview = z.infer<typeof previewSchema>;

// A project groups multiple previews
export const projectSchema = z.object({
  name: z.string(),
  latestPreview: previewSchema,
  versions: z.array(previewSchema),
  lastUpdated: z.string(), // ISO string
});

export type Project = z.infer<typeof projectSchema>;

// === DB TABLES ===
export const uploads = pgTable("uploads", {
  id: serial("id").primaryKey(),
  projectName: text("project_name").notNull(),
  filename: text("filename").notNull(),
  timestamp: text("timestamp").notNull(),
  url: text("url").notNull(),
  metadata: text("metadata").notNull(), // JSON string storage
  createdAt: timestamp("created_at").defaultNow(),
});

export const userNotes = pgTable("user_notes", {
  id: serial("id").primaryKey(),
  projectName: text("project_name").notNull(),
  content: text("content").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUploadSchema = createInsertSchema(uploads).omit({ 
  id: true, 
  createdAt: true 
});

export type Upload = typeof uploads.$inferSelect;
export type InsertUpload = z.infer<typeof insertUploadSchema>;
