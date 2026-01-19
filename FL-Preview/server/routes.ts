import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api, type Project } from "@shared/routes";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase (Backend Side)
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

let supabase: any = null;
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log("Supabase initialized on server.");
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // GET /api/projects
  app.get(api.projects.list.path, async (req, res) => {
    if (!supabase) {
      return res.status(503).json({ message: "Supabase not configured on server." });
    }

    try {
      // List all files in the root of 'previews' bucket
      const { data: files, error } = await supabase.storage.from('previews').list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'desc' },
      });

      if (error) throw error;

      const jsonFiles = files.filter((f: any) => f.name.endsWith('.json'));
      const projectsMap = new Map<string, Project>();

      const fetchPromises = jsonFiles.map(async (file: any) => {
        try {
          const { data: blob, error: downloadError } = await supabase.storage
            .from('previews')
            .download(file.name);

          if (downloadError) throw downloadError;

          const jsonString = await blob.text();
          const metadata = JSON.parse(jsonString);

          const { data: urlData } = supabase.storage
            .from('previews')
            .getPublicUrl(metadata.filename);

          const preview = {
            project: metadata.project,
            timestamp: metadata.timestamp,
            filename: metadata.filename,
            url: urlData.publicUrl,
            parsedDate: parseTimestamp(metadata.timestamp),
          };

          if (!projectsMap.has(metadata.project)) {
            projectsMap.set(metadata.project, {
              name: metadata.project,
              versions: [],
              latestPreview: preview,
              lastUpdated: preview.parsedDate,
            });
          }

          const project = projectsMap.get(metadata.project)!;
          project.versions.push(preview);
          
          if (preview.parsedDate > project.lastUpdated) {
            project.lastUpdated = preview.parsedDate;
            project.latestPreview = preview;
          }
        } catch (err) {
          console.error(`Error processing ${file.name}`, err);
        }
      });

      await Promise.all(fetchPromises);

      projectsMap.forEach(p => {
        p.versions.sort((a, b) => b.parsedDate.localeCompare(a.parsedDate));
      });

      const projects = Array.from(projectsMap.values())
        .sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated));

      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects from Supabase:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get(api.notes.get.path, async (req, res) => {
    const note = await storage.getUserNote(req.params.projectName);
    res.json(note || null);
  });

  app.post(api.notes.save.path, async (req, res) => {
    try {
      const input = req.body;
      const note = await storage.saveUserNote(input);
      res.json(note);
    } catch (err) {
      res.status(500).json({ message: "Failed to save note" });
    }
  });

  return httpServer;
}

function parseTimestamp(ts: string): string {
  try {
    const parts = ts.split('_');
    const datePart = parts[0];
    const timePart = parts[1];
    const y = datePart.substring(0, 4);
    const m = datePart.substring(4, 6);
    const d = datePart.substring(6, 8);
    const h = timePart.substring(0, 2);
    const min = timePart.substring(2, 4);
    const s = timePart.substring(4, 6);
    return new Date(`${y}-${m}-${d}T${h}:${min}:${s}`).toISOString();
  } catch (e) {
    return new Date().toISOString();
  }
}
