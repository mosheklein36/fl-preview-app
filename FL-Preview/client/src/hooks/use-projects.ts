import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type Project } from "@shared/schema";

// GET /api/projects
export function useProjects() {
  return useQuery({
    queryKey: [api.projects.list.path],
    queryFn: async () => {
      const res = await fetch(api.projects.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data = await res.json();
      return api.projects.list.responses[200].parse(data);
    },
    // Keep data fresh but don't refetch excessively on focus
    staleTime: 1000 * 60, // 1 minute
  });
}

// Helper to find a specific project from the cache or list
export function useProject(projectName?: string) {
  const { data: projects, ...rest } = useProjects();
  
  const project = projects?.find(p => p.name === projectName);
  
  return {
    project,
    ...rest
  };
}

// POST /api/projects/refresh
export function useRefreshProjects() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.projects.refresh.path, { 
        method: api.projects.refresh.method,
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Failed to refresh projects");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.projects.list.path] });
    },
  });
}
