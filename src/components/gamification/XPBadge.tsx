import { Zap } from "lucide-react";
import { cn } from "@/lib/util/cn";

export function XPBadge({ xp, label = "XP", className, size = "md" }: { xp: number; label?: string; className?: string; size?: "sm" | "md" | "lg" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-sol-300 font-extrabold text-[#4a3300]",
        size === "sm" && "px-2.5 py-0.5 text-xs",
        size === "md" && "px-3 py-1 text-sm",
        size === "lg" && "px-4 py-1.5 text-lg",
        className,
      )}
    >
      <Zap size={size === "lg" ? 20 : 15} fill="currentColor" aria-hidden="true" />
      <span>{xp.toLocaleString()}</span>
      <span className="font-bold opacity-80">{label}</span>
    </span>
  );
}
