import { Link } from "wouter";
import { type Project } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { Music, Clock, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link href={`/project/${project.name}`} className="block group">
        <div className="glass hover:bg-card/90 transition-all duration-300 rounded-2xl p-5 border border-white/5 hover:border-primary/30 relative overflow-hidden">
          
          {/* Subtle gradient accent on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="relative flex justify-between items-center">
            <div className="flex items-start gap-4">
              {/* Icon Box */}
              <div className="w-12 h-12 rounded-xl bg-accent/50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                <Music className="w-6 h-6" />
              </div>

              {/* Text Info */}
              <div className="space-y-1">
                <h3 className="text-lg font-bold font-display text-foreground group-hover:text-primary transition-colors">
                  {project.name}
                </h3>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDistanceToNow(new Date(project.lastUpdated), { addSuffix: true })}
                  </span>
                  <span className="bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                    v{project.versions.length}
                  </span>
                </div>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
