import type { Belt } from "@/lib/dojo/catalog";
import { cn } from "@/lib/util/cn";

interface BeltIconProps {
  belt: Belt;
  size?: number;
  /** Not earned yet: drawn faded. */
  muted?: boolean;
  className?: string;
}

/** A tied martial-arts belt in the belt's color. Decorative; pair it with the belt's name. */
export function BeltIcon({ belt, size = 48, muted = false, className }: BeltIconProps) {
  const stroke = { stroke: belt.ink, strokeWidth: 1.6, strokeLinejoin: "round" as const };
  return (
    <svg
      viewBox="0 0 64 46"
      width={size}
      height={(size * 46) / 64}
      aria-hidden="true"
      className={cn("shrink-0", muted && "opacity-35 grayscale", className)}
    >
      <rect x="2" y="9" width="60" height="11" rx="3.5" fill={belt.color} {...stroke} />
      <path d="M28.5 19 L19 42 L27 43.5 L33 22 Z" fill={belt.color} {...stroke} />
      <path d="M35.5 19 L45 42 L37 43.5 L31 22 Z" fill={belt.color} {...stroke} />
      {belt.id === "black" && (
        <>
          <path d="M20.4 38.6 L27.9 40.1" stroke={belt.ink} strokeWidth="2.4" />
          <path d="M43.6 38.6 L36.1 40.1" stroke={belt.ink} strokeWidth="2.4" />
        </>
      )}
      <rect x="24" y="5" width="16" height="18" rx="4.5" fill={belt.color} {...stroke} />
    </svg>
  );
}
