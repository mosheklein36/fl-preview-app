import { db } from "./db";
import { uploads, userNotes, type Upload, type InsertUpload, type UserNote } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUploads(): Promise<Upload[]>;
  createUpload(upload: InsertUpload): Promise<Upload>;
  getUserNote(projectName: string): Promise<UserNote | undefined>;
  saveUserNote(note: { projectName: string; content: string }): Promise<UserNote>;
}

export class DatabaseStorage implements IStorage {
  async getUploads(): Promise<Upload[]> {
    return await db.select().from(uploads).orderBy(desc(uploads.createdAt));
  }

  async createUpload(upload: InsertUpload): Promise<Upload> {
    const [newUpload] = await db.insert(uploads).values(upload).returning();
    return newUpload;
  }

  async getUserNote(projectName: string): Promise<UserNote | undefined> {
    const [note] = await db
      .select()
      .from(userNotes)
      .where(eq(userNotes.projectName, projectName));
    return note;
  }

  async saveUserNote(note: { projectName: string; content: string }): Promise<UserNote> {
    const existing = await this.getUserNote(note.projectName);
    if (existing) {
      const [updated] = await db
        .update(userNotes)
        .set({ content: note.content, updatedAt: new Date() })
        .where(eq(userNotes.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(userNotes)
        .values(note)
        .returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();
