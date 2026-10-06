"use client";

import { Snail, Volume2 } from "lucide-react";
import type { AudioRef, AudioSpeed } from "@/content/types";
import { cn } from "@/lib/util/cn";
import { useAudio } from "./useAudio";

interface AudioButtonProps {
  clip: AudioRef;
  speed?: AudioSpeed;
  size?: "sm" | "md" | "lg";
  /** Accessible name; defaults to "Play audio". */
  label?: string;
  className?: string;
  onPlay?: () => void;
}

const sizes = { sm: "h-9 w-9", md: "h-12 w-12", lg: "h-16 w-16" } as const;
const iconSizes = { sm: 18, md: 22, lg: 30 } as const;

/** Round speaker button. Speed "slow" shows a snail so the two variants are distinguishable. */
export function AudioButton({ clip, speed = "normal", size = "md", label, className, onPlay }: AudioButtonProps) {
  const { supported, playingKey, play } = useAudio();
  const playing = playingKey === `${clip.text}:${speed}`;
  const Icon = speed === "slow" ? Snail : Volume2;
  const name = label ?? (speed === "slow" ? "Play slowly" : "Play audio");

  return (
    <button
      type="button"
      aria-label={supported ? name : `${name} (not available in this browser)`}
      title={supported ? name : "Audio isn't available in this browser"}
      disabled={!supported}
      onClick={() => {
        onPlay?.();
        void play(clip, speed, `${clip.text}:${speed}`);
      }}
      className={cn(
        "tactile grid shrink-0 place-items-center rounded-full bg-soft-teal text-on-teal shadow-[0_3px_0_var(--line-strong)] [--edge:var(--line-strong)] hover:brightness-95 disabled:opacity-40",
        sizes[size],
        playing && "bg-brand text-on-brand [animation:ring-pulse_1s_ease-out_infinite]",
        className,
      )}
    >
      <Icon size={iconSizes[size]} aria-hidden="true" />
    </button>
  );
}
