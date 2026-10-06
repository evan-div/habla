import { cn } from "@/lib/util/cn";

interface DailyGoalRingProps {
  xp: number;
  goal: number;
  size?: number;
  className?: string;
}

export function DailyGoalRing({ xp, goal, size = 132, className }: DailyGoalRingProps) {
  const stroke = Math.max(10, size * 0.11);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, xp / goal);
  const done = xp >= goal;
  return (
    <div
      className={cn("relative grid place-items-center", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${xp} of ${goal} XP earned today${done ? ", goal reached" : ""}`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-2)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={done ? "var(--color-leaf-500)" : "var(--color-sol-400)"}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(0.2,0.8,0.2,1)" }}
        />
      </svg>
      <div className="absolute text-center leading-tight">
        <div className="font-display text-3xl font-extrabold text-ink">{xp}</div>
        <div className="text-xs font-bold text-muted">/ {goal} XP</div>
      </div>
    </div>
  );
}
