import { useProject } from "@/hooks/use-projects";
import { Link, useRoute } from "wouter";
import { ArrowLeft, Clock, FileAudio, Calendar } from "lucide-react";
import { AudioPlayer } from "@/components/AudioPlayer";
import { NoteEditor } from "@/components/NoteEditor";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ProjectDetail() {
  const [, params] = useRoute("/project/:name");
  const projectName = decodeURIComponent(params?.name || "");
  const { project, isLoading } = useProject(projectName);

  // Default to latest version for player
  const [selectedVersionIndex, setSelectedVersionIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
        <Link href="/" className="text-primary hover:underline">Return Home</Link>
      </div>
    );
  }

  const currentPreview = project.versions[selectedVersionIndex];

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="max-w-2xl mx-auto">
        
        {/* Nav Header */}
        <div className="px-6 pt-8 pb-4">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group mb-6">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Library
          </Link>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-1"
          >
            <h1 className="text-3xl font-bold font-display tracking-tight text-white">
              {project.name}
            </h1>
            <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Updated {format(new Date(project.lastUpdated), "MMM d, yyyy")}
              </span>
              <span className="flex items-center gap-1.5">
                <FileAudio className="w-3.5 h-3.5" />
                {project.versions.length} versions
              </span>
            </div>
          </motion.div>
        </div>

        <div className="px-4 md:px-6 space-y-8">
          
          {/* Main Player */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <AudioPlayer 
              key={currentPreview.url} // Re-mount on URL change
              url={currentPreview.url}
              filename={currentPreview.filename}
              autoPlay={false}
            />
          </motion.div>

          {/* User Notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <NoteEditor projectName={project.name} />
          </motion.div>

          {/* Version History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              History
            </h3>
            
            <div className="bg-card border border-white/5 rounded-2xl overflow-hidden shadow-lg">
              {project.versions.map((version, idx) => (
                <button
                  key={version.filename}
                  onClick={() => setSelectedVersionIndex(idx)}
                  className={cn(
                    "w-full text-left px-5 py-4 flex items-center justify-between border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group",
                    idx === selectedVersionIndex && "bg-primary/10 hover:bg-primary/15"
                  )}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className={cn(
                      "text-sm font-mono truncate max-w-[200px] sm:max-w-sm",
                      idx === selectedVersionIndex ? "text-primary font-bold" : "text-foreground"
                    )}>
                      {version.filename}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(version.parsedDate), "MMM d, h:mm a")}
                    </span>
                  </div>
                  
                  {idx === selectedVersionIndex && (
                    <div className="flex items-center gap-2 text-xs font-bold text-primary px-2 py-1 bg-primary/10 rounded-full">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      PLAYING
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
