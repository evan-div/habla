import { Lock } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { AchievementTone } from "@/lib/gamification/achievements";
import { cn } from "@/lib/util/cn";

const tiles: Record<AchievementTone, string> = {
  teal: "bg-teal-500 text-white",
  rosa: "bg-rosa-500 text-white",
  sol: "bg-sol-300 text-[#4a3300]",
  leaf: "bg-leaf-500 text-white",
  violet: "bg-violet-500 text-white",
};

interface AchievementCardProps {
  title: string;
  description: string;
  icon: string;
  tone: AchievementTone;
  unlocked: boolean;
  progress: number;
  target: number;
  className?: string;
}

export function AchievementCard({ title, description, icon, tone, unlocked, progress, target, className }: AchievementCardProps) {
  return (
    <div className={cn("flex items-start gap-3 rounded-2xl border-2 p-3.5", unlocked ? "border-line bg-surface" : "border-dashed border-line bg-surface-2/60", className)}>
      <span className={cn("relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl", unlocked ? tiles[tone] : "bg-line text-faint")}>
        {unlocked ? <Icon name={icon} size={24} /> : <Lock size={20} aria-hidden="true" />}
      </span>
      <div className="min-w-0 flex-1">
        <p className={cn("font-extrabold leading-tight", !unlocked && "text-muted")}>{title}</p>
        <p className="text-sm text-muted">{description}</p>
        {!unlocked && target > 1 && (
          <div className="mt-2 flex items-center gap-2">
            <ProgressBar value={progress} max={target} size="sm" label={`${title} progress`} tone="brand" />
            <span className="shrink-0 text-xs font-bold text-muted">{progress}/{target}</span>
          </div>
        )}
        {unlocked && <p className="mt-1 text-xs font-bold uppercase tracking-wide text-on-leaf">Unlocked</p>}
      </div>
    </div>
  );
}
