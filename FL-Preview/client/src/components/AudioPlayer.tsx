import { Play, Pause, AlertCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useAudio } from "@/hooks/use-audio";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AudioPlayerProps {
  url: string;
  filename: string;
  autoPlay?: boolean; // Note: Browser might block, but we can try
}

export function AudioPlayer({ url, filename, autoPlay = false }: AudioPlayerProps) {
  const { 
    isPlaying, 
    duration, 
    currentTime, 
    isLoading, 
    error, 
    togglePlay, 
    seek 
  } = useAudio(url);

  // Simple formatter for mm:ss
  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full bg-card border border-border/50 rounded-2xl p-6 shadow-xl shadow-black/20">
      <div className="flex flex-col gap-6">
        
        {/* Top Info Row */}
        <div className="flex items-center justify-between">
          <div className="overflow-hidden">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Now Playing</h3>
            <p className="text-base font-bold text-foreground truncate font-mono">{filename}</p>
          </div>
          {isLoading && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
        </div>

        {/* Visualizer / Progress Area */}
        <div className="relative w-full h-16 flex items-center justify-center bg-black/20 rounded-lg border border-white/5 overflow-hidden group cursor-pointer">
          {/* Fake waveform bars visualization - just for aesthetic */}
          <div className="absolute inset-0 flex items-end justify-between px-1 opacity-30 gap-1">
            {Array.from({ length: 40 }).map((_, i) => (
              <motion.div
                key={i}
                className={cn(
                  "w-1 rounded-t-sm transition-colors duration-300",
                  isPlaying ? "bg-primary" : "bg-muted-foreground/40"
                )}
                initial={{ height: "20%" }}
                animate={{ 
                  height: isPlaying ? [`${20 + Math.random() * 60}%`, `${20 + Math.random() * 60}%`] : "20%" 
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 0.5, 
                  ease: "easeInOut",
                  delay: i * 0.05 
                }}
              />
            ))}
          </div>

          {/* Actual Progress Overlay */}
          <div 
            className="absolute left-0 top-0 bottom-0 bg-primary/10 transition-all duration-100 ease-linear pointer-events-none"
            style={{ width: `${progressPercent}%` }}
          />
          
          {/* Scrubber Input */}
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={(e) => seek(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            disabled={isLoading || !!error}
          />
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-muted-foreground w-12 text-left">
            {formatTime(currentTime)}
          </span>

          <button
            onClick={togglePlay}
            disabled={isLoading || !!error}
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg",
              isPlaying 
                ? "bg-secondary text-secondary-foreground shadow-secondary/20 scale-95" 
                : "bg-primary text-primary-foreground shadow-primary/20 hover:scale-105 active:scale-95"
            )}
          >
            {error ? (
              <AlertCircle className="w-6 h-6" />
            ) : isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-1" />
            )}
          </button>

          <span className="text-xs font-mono text-muted-foreground w-12 text-right">
            {formatTime(duration)}
          </span>
        </div>

        {error && (
          <p className="text-xs text-destructive text-center font-medium bg-destructive/10 py-2 rounded">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
