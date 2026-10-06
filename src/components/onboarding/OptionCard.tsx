import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/util/cn";

interface OptionCardProps {
  selected: boolean;
  onSelect: () => void;
  title: string;
  detail?: string;
  icon?: ReactNode;
  /** "radio" for single choice, "checkbox" for multi-select. */
  role?: "radio" | "checkbox";
}

export function OptionCard({ selected, onSelect, title, detail, icon, role = "radio" }: OptionCardProps) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "tactile flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left shadow-[0_3px_0_var(--line-strong)] [--edge:var(--line-strong)]",
        selected ? "border-teal-500 bg-soft-teal text-on-teal shadow-[0_3px_0_var(--color-teal-500)] [--edge:var(--color-teal-500)]" : "border-line bg-surface hover:bg-surface-2",
      )}
    >
      {icon && <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-surface text-2xl">{icon}</span>}
      <span className="min-w-0 flex-1">
        <span className="block text-lg font-extrabold leading-tight text-ink">{title}</span>
        {detail && <span className="block text-[15px] text-muted">{detail}</span>}
      </span>
      <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-full border-2", selected ? "border-teal-500 bg-teal-500 text-white" : "border-line-strong")} aria-hidden="true">
        {selected && <Check size={16} strokeWidth={3.5} />}
      </span>
    </button>
  );
}
