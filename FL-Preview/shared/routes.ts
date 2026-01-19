import { z } from 'zod';
import { projectSchema, userNotes } from './schema';

export const api = {
  projects: {
    list: {
      method: 'GET' as const,
      path: '/api/projects',
      responses: {
        200: z.array(projectSchema),
      },
    },
    upload: {
      method: 'POST' as const,
      path: '/api/upload',
      responses: {
        200: z.object({ message: z.string(), filename: z.string() }),
        400: z.object({ message: z.string() }),
      },
    }
  },
  notes: {
    get: {
      method: 'GET' as const,
      path: '/api/notes/:projectName',
      responses: {
        200: z.custom<typeof userNotes.$inferSelect>().nullable(),
      },
    },
    save: {
      method: 'POST' as const,
      path: '/api/notes',
      input: z.object({
        projectName: z.string(),
        content: z.string(),
      }),
      responses: {
        200: z.custom<typeof userNotes.$inferSelect>(),
      },
    }
  }
};

export type Project = z.infer<typeof projectSchema>;

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, String(value));
    });
  }
  return url;
}
