import { Flame } from "lucide-react";
import { cn } from "@/lib/util/cn";

interface StreakBadgeProps {
  days: number;
  /** Streak is alive but today's practice would extend it. */
  pending?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StreakBadge({ days, pending = false, size = "md", className }: StreakBadgeProps) {
  const lit = days > 0 && !pending;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-extrabold",
        lit ? "bg-soft-rosa text-on-rosa" : "bg-surface-2 text-muted",
        size === "sm" && "px-2.5 py-0.5 text-xs",
        size === "md" && "px-3 py-1 text-sm",
        size === "lg" && "px-4 py-1.5 text-lg",
        className,
      )}
      aria-label={`${days} day streak${pending ? ", practice today to keep it going" : ""}`}
    >
      <Flame
        size={size === "lg" ? 22 : 16}
        className={lit ? "text-rosa-500" : "text-faint"}
        fill={lit ? "currentColor" : "none"}
        aria-hidden="true"
      />
      <span>{days}</span>
    </span>
  );
}
