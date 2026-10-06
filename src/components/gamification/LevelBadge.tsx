import { cn } from "@/lib/util/cn";

export function LevelBadge({ level, size = 44, className }: { level: number; size?: number; className?: string }) {
  return (
    <span
      className={cn("grid shrink-0 place-items-center rounded-2xl bg-violet-500 font-display font-extrabold text-white shadow-[0_3px_0_#4e2fa0]", className)}
      style={{ width: size, height: size, fontSize: size * 0.46 }}
      aria-label={`Level ${level}`}
    >
      {level}
    </span>
  );
}
