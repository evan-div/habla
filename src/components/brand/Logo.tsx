import { cn } from "@/lib/util/cn";
import { Mascot } from "./Mascot";

interface LogoProps {
  className?: string;
  /** Hide the wordmark and show only the mascot. */
  compact?: boolean;
}

export function Logo({ className, compact = false }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Mascot size={compact ? 40 : 38} />
      {!compact && (
        <span className="font-display text-2xl font-extrabold tracking-tight text-ink">
          <span className="text-rosa-500">¡</span>habla<span className="text-rosa-500">!</span>
        </span>
      )}
    </span>
  );
}
