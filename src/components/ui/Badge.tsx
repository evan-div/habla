import type { ReactNode } from "react";
import { cn } from "@/lib/util/cn";

export type BadgeTone = "neutral" | "teal" | "rosa" | "sol" | "leaf" | "chili" | "violet";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-surface-2 text-muted",
  teal: "bg-soft-teal text-on-teal",
  rosa: "bg-soft-rosa text-on-rosa",
  sol: "bg-soft-sol text-on-sol",
  leaf: "bg-soft-leaf text-on-leaf",
  chili: "bg-soft-chili text-on-chili",
  violet: "bg-soft-violet text-on-violet",
};

export function Badge({ tone = "neutral", icon, children, className }: { tone?: BadgeTone; icon?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold leading-5", tones[tone], className)}>
      {icon}
      {children}
    </span>
  );
}
