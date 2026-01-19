import { useProjects, useRefreshProjects } from "@/hooks/use-projects";
import { ProjectCard } from "@/components/ProjectCard";
import { Loader2, RefreshCw, AudioWaveform } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Home() {
  const { data: projects, isLoading, isError } = useProjects();
  const { mutate: refresh, isPending: isRefreshing } = useRefreshProjects();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground font-mono text-sm animate-pulse">Loading Projects...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <AudioWaveform className="w-16 h-16 mx-auto text-destructive/50" />
          <h2 className="text-xl font-bold">Failed to load projects</h2>
          <p className="text-muted-foreground">Could not fetch the project list. Check your connection or try again.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-card border border-white/10 rounded-lg hover:bg-card/80 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-96 bg-primary/5 blur-[100px] pointer-events-none" />
      
      <div className="max-w-2xl mx-auto px-6 pt-12">
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              FL Preview
            </h1>
            <p className="text-sm text-muted-foreground mt-1 font-mono">
              {projects?.length || 0} Projects Available
            </p>
          </div>
          
          <button
            onClick={() => refresh()}
            disabled={isRefreshing}
            className={cn(
              "p-3 rounded-full bg-card border border-white/5 shadow-lg text-muted-foreground hover:text-primary transition-all active:scale-95",
              isRefreshing && "animate-spin text-primary"
            )}
            aria-label="Refresh Projects"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </header>

        {/* Project List */}
        <div className="space-y-4">
          {projects && projects.length > 0 ? (
            projects.map((project, idx) => (
              <ProjectCard key={project.name} project={project} index={idx} />
            ))
          ) : (
            <div className="text-center py-20 bg-card/30 rounded-3xl border border-dashed border-white/5">
              <AudioWaveform className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-medium">No projects found</p>
              <p className="text-xs text-muted-foreground/60 mt-2">Upload previews to Firebase to see them here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
