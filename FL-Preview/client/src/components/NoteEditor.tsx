import { useState, useEffect } from "react";
import { useProjectNote, useSaveNote } from "@/hooks/use-notes";
import { Loader2, Save, PenLine } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NoteEditorProps {
  projectName: string;
}

export function NoteEditor({ projectName }: NoteEditorProps) {
  const { data: note, isLoading: isLoadingNote } = useProjectNote(projectName);
  const { mutate: saveNote, isPending: isSaving } = useSaveNote();
  const [content, setContent] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (note) {
      setContent(note.content);
      setIsDirty(false);
    }
  }, [note]);

  const handleSave = () => {
    saveNote({ projectName, content }, {
      onSuccess: () => setIsDirty(false)
    });
  };

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <PenLine className="w-5 h-5 text-secondary" />
          Project Notes
        </h3>
        
        <AnimatePresence>
          {isDirty && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 rounded-lg bg-secondary/10 text-secondary hover:bg-secondary/20 disabled:opacity-50 text-sm font-semibold flex items-center gap-2 transition-colors"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSaving ? "Saving..." : "Save Changes"}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-br from-secondary/20 to-transparent rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setIsDirty(true);
          }}
          placeholder="Jot down ideas, mixing notes, or tasks for this project..."
          className="relative w-full h-40 bg-card/50 p-4 rounded-xl border border-white/5 focus:outline-none focus:ring-1 focus:ring-secondary/50 placeholder:text-muted-foreground/50 font-mono text-sm resize-none"
        />
      </div>

      <p className="text-xs text-muted-foreground text-right">
        {isLoadingNote ? "Loading notes..." : note ? `Last edited ${new Date(note.updatedAt || "").toLocaleDateString()}` : "No notes yet"}
      </p>
    </div>
  );
}
