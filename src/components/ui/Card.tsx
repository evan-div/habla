import type { ElementType, HTMLAttributes } from "react";
import { cn } from "@/lib/util/cn";

export type CardTone = "default" | "teal" | "rosa" | "sol" | "leaf" | "chili" | "violet" | "brand";

const tones: Record<CardTone, string> = {
  default: "bg-surface border-line",
  teal: "bg-soft-teal border-transparent",
  rosa: "bg-soft-rosa border-transparent",
  sol: "bg-soft-sol border-transparent",
  leaf: "bg-soft-leaf border-transparent",
  chili: "bg-soft-chili border-transparent",
  violet: "bg-soft-violet border-transparent",
  brand: "bg-brand text-on-brand border-transparent",
};

const paddings = { none: "", sm: "p-4", md: "p-5 sm:p-6", lg: "p-6 sm:p-8" } as const;

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  tone?: CardTone;
  padding?: keyof typeof paddings;
  /** Subtle lift on hover — for cards that are (or contain) a link. */
  interactive?: boolean;
}

export function Card({ as: Tag = "div", tone = "default", padding = "md", interactive = false, className, ...rest }: CardProps) {
  return (
    <Tag
      className={cn(
        "rounded-3xl border-2 shadow-card",
        tones[tone],
        paddings[padding],
        interactive && "transition-transform hover:-translate-y-0.5 focus-within:-translate-y-0.5",
        className,
      )}
      {...rest}
    />
  );
}

export function SectionHeading({ title, action, className, id }: { title: string; action?: React.ReactNode; className?: string; id?: string }) {
  return (
    <div className={cn("mb-3 flex items-end justify-between gap-3", className)}>
      <h2 id={id} className="text-xl font-extrabold text-ink">{title}</h2>
      {action}
    </div>
  );
}
