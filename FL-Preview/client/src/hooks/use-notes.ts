import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertUserNote } from "@shared/schema";

// GET /api/notes/:projectName
export function useProjectNote(projectName: string) {
  return useQuery({
    queryKey: [api.notes.get.path, projectName],
    queryFn: async () => {
      if (!projectName) return null;
      const url = buildUrl(api.notes.get.path, { projectName });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch note");
      const data = await res.json();
      return api.notes.get.responses[200].parse(data);
    },
    enabled: !!projectName,
  });
}

// POST /api/notes
export function useSaveNote() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (note: InsertUserNote) => {
      const res = await fetch(api.notes.save.path, {
        method: api.notes.save.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to save note");
      return api.notes.save.responses[200].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      // Invalidate the specific note query
      const url = buildUrl(api.notes.get.path, { projectName: variables.projectName });
      // We use the query key pattern from useProjectNote: [path, projectName]
      queryClient.invalidateQueries({ 
        queryKey: [api.notes.get.path, variables.projectName] 
      });
    },
  });
}
