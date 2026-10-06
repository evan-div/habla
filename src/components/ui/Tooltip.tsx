import { useId, type ReactNode } from "react";
import { cn } from "@/lib/util/cn";

interface TooltipProps {
  content: string;
  children: ReactNode;
  className?: string;
  /** Which side of the trigger the bubble opens on. */
  side?: "top" | "bottom";
}

/**
 * Hover- *and* focus-activated hint. The wrapper is focusable so keyboard and
 * touch users get it too; anything essential should also appear as visible text.
 */
export function Tooltip({ content, children, className, side = "top" }: TooltipProps) {
  const id = useId();
  return (
    <span className={cn("group relative inline-flex", className)} tabIndex={0} aria-describedby={id}>
      {children}
      <span
        role="tooltip"
        id={id}
        className={cn(
          "pointer-events-none absolute left-1/2 z-30 w-max max-w-[16rem] -translate-x-1/2 rounded-xl bg-ink px-3 py-1.5 text-center text-xs font-semibold text-bg opacity-0 shadow-pop transition-opacity group-hover:opacity-100 group-focus:opacity-100",
          side === "top" ? "bottom-full mb-2" : "top-full mt-2",
        )}
      >
        {content}
      </span>
    </span>
  );
}
