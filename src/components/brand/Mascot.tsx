import { cn } from "@/lib/util/cn";

export type MascotMood = "happy" | "cheer" | "thinking" | "sleepy";

interface MascotProps {
  mood?: MascotMood;
  size?: number;
  /** Idle bobbing + blinking. Disabled automatically for reduced motion. */
  animated?: boolean;
  className?: string;
}

/**
 * Lolo, the axolotl — Habla's original mascot. Pure SVG so it themes and scales
 * crisply. Decorative by default (aria-hidden).
 */
export function Mascot({ mood = "happy", size = 120, animated = false, className }: MascotProps) {
  const eyeY = 72;
  return (
    <svg
      viewBox="0 0 160 140"
      width={size}
      height={(size * 140) / 160}
      className={cn(animated && "animate-float", className)}
      aria-hidden="true"
      focusable="false"
    >
      {/* gills */}
      <g fill="#F0558A">
        <ellipse cx="30" cy="42" rx="17" ry="6.5" transform="rotate(-28 30 42)" />
        <ellipse cx="20" cy="64" rx="18" ry="6.5" />
        <ellipse cx="30" cy="86" rx="17" ry="6.5" transform="rotate(28 30 86)" />
        <ellipse cx="130" cy="42" rx="17" ry="6.5" transform="rotate(28 130 42)" />
        <ellipse cx="140" cy="64" rx="18" ry="6.5" />
        <ellipse cx="130" cy="86" rx="17" ry="6.5" transform="rotate(-28 130 86)" />
      </g>
      <g fill="#FF8FB6" opacity="0.8">
        <circle cx="13" cy="64" r="4" />
        <circle cx="147" cy="64" r="4" />
        <circle cx="20" cy="38" r="3.4" />
        <circle cx="140" cy="38" r="3.4" />
        <circle cx="20" cy="90" r="3.4" />
        <circle cx="140" cy="90" r="3.4" />
      </g>
      {/* head */}
      <ellipse cx="80" cy="78" rx="52" ry="44" fill="#FFB9D0" />
      <ellipse cx="80" cy="60" rx="34" ry="16" fill="#FFD2E1" opacity="0.7" />
      {/* belly peek */}
      <ellipse cx="80" cy="118" rx="26" ry="10" fill="#FFB9D0" />
      {/* cheeks */}
      <circle cx="50" cy="90" r="7.5" fill="#FF86AE" opacity="0.55" />
      <circle cx="110" cy="90" r="7.5" fill="#FF86AE" opacity="0.55" />

      {/* eyes */}
      {mood === "sleepy" ? (
        <g stroke="#1B1F3B" strokeWidth="3.2" strokeLinecap="round" fill="none">
          <path d="M55 74 Q62 80 69 74" />
          <path d="M91 74 Q98 80 105 74" />
        </g>
      ) : mood === "cheer" ? (
        <g stroke="#1B1F3B" strokeWidth="3.4" strokeLinecap="round" fill="none">
          <path d="M55 76 Q62 66 69 76" />
          <path d="M91 76 Q98 66 105 76" />
        </g>
      ) : (
        <g className={cn(animated && "animate-blink")} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <circle cx="62" cy={eyeY} r="6" fill="#1B1F3B" />
          <circle cx="98" cy={eyeY} r="6" fill="#1B1F3B" />
          <circle cx="64" cy={eyeY - 2} r="2" fill="#fff" />
          <circle cx="100" cy={eyeY - 2} r="2" fill="#fff" />
        </g>
      )}
      {mood === "thinking" && (
        <path d="M54 60 Q62 54 70 59" stroke="#1B1F3B" strokeWidth="3" strokeLinecap="round" fill="none" />
      )}

      {/* mouth */}
      {mood === "cheer" ? (
        <g>
          <path d="M64 88 Q80 112 96 88 Z" fill="#7A1E3F" stroke="#1B1F3B" strokeWidth="2.6" strokeLinejoin="round" />
          <path d="M72 101 Q80 94 88 101 Q80 108 72 101Z" fill="#FF7A9E" />
        </g>
      ) : mood === "thinking" ? (
        <ellipse cx="82" cy="96" rx="5" ry="4.2" fill="#7A1E3F" />
      ) : mood === "sleepy" ? (
        <path d="M72 94 Q80 98 88 94" stroke="#1B1F3B" strokeWidth="3" strokeLinecap="round" fill="none" />
      ) : (
        <path d="M66 90 Q80 104 94 90" stroke="#1B1F3B" strokeWidth="3.4" strokeLinecap="round" fill="none" />
      )}

      {mood === "sleepy" && (
        <g fill="#8E91AB" fontFamily="var(--font-display), sans-serif" fontWeight="800">
          <text x="118" y="38" fontSize="16">z</text>
          <text x="130" y="24" fontSize="12">z</text>
        </g>
      )}
      {mood === "cheer" && (
        <g fill="#F7B500">
          <path d="M18 18 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" />
          <path d="M140 10 l2.4 5.6 5.6 2.4 -5.6 2.4 -2.4 5.6 -2.4 -5.6 -5.6 -2.4 5.6 -2.4z" />
        </g>
      )}
    </svg>
  );
}
