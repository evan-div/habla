import { X } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface LessonHeaderProps {
  title: string;
  progress: number;
  onClose: () => void;
}

export function LessonHeader({ title, progress, onClose }: LessonHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b-2 border-line bg-bg/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-3xl items-center gap-3 px-3 sm:gap-5 sm:px-6">
        <button
          type="button"
          onClick={onClose}
          aria-label="Leave lesson"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-ink"
        >
          <X size={26} aria-hidden="true" />
        </button>
        <ProgressBar value={progress * 100} size="lg" tone="brand" label={`${title} progress`} className="flex-1" />
      </div>
    </header>
  );
}
