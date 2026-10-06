import { cn } from "@/lib/util/cn";

export type BarTone = "brand" | "sol" | "leaf" | "rosa" | "violet" | "chili";

const fills: Record<BarTone, string> = {
  brand: "bg-teal-500",
  sol: "bg-sol-400",
  leaf: "bg-leaf-500",
  rosa: "bg-rosa-500",
  violet: "bg-violet-500",
  chili: "bg-chili-500",
};

const heights = { sm: "h-2", md: "h-3", lg: "h-4" } as const;

interface ProgressBarProps {
  /** 0–100 (or relative to `max`). */
  value: number;
  max?: number;
  tone?: BarTone;
  size?: keyof typeof heights;
  /** Accessible name — always provide one. */
  label: string;
  className?: string;
}

export function ProgressBar({ value, max = 100, tone = "brand", size = "md", label, className }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={Math.round(Math.min(value, max))}
      className={cn("w-full overflow-hidden rounded-full bg-surface-2 ring-1 ring-inset ring-line", heights[size], className)}
    >
      <div
        className={cn("h-full rounded-full transition-[width] duration-700 ease-out", fills[tone])}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
