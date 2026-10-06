import { masteryBand, type MasteryBand } from "@/lib/mastery/mastery";
import { cn } from "@/lib/util/cn";

const BAND_COLOR: Record<MasteryBand, string> = {
  weak: "bg-band-weak",
  learning: "bg-band-learning",
  strong: "bg-band-strong",
};

export const BAND_LABEL: Record<MasteryBand, string> = { weak: "Weak", learning: "Learning", strong: "Strong" };

interface MasteryMeterProps {
  score: number;
  /** Show the numeric percentage next to the meter. */
  showValue?: boolean;
  className?: string;
  segments?: number;
}

/** Ten-block meter: ████████░░ 82% */
export function MasteryMeter({ score, showValue = true, className, segments = 10 }: MasteryMeterProps) {
  const band = masteryBand(score);
  const filled = Math.round((score / 100) * segments);
  return (
    <div className={cn("flex items-center gap-2", className)} role="meter" aria-label="Mastery" aria-valuemin={0} aria-valuemax={100} aria-valuenow={score} aria-valuetext={`${score}% — ${BAND_LABEL[band]}`}>
      <div className="flex gap-[3px]" aria-hidden="true">
        {Array.from({ length: segments }, (_, i) => (
          <span key={i} className={cn("h-3 w-2 rounded-[3px]", i < filled ? BAND_COLOR[band] : "bg-line")} />
        ))}
      </div>
      {showValue && <span className="w-10 text-sm font-extrabold tabular-nums text-ink">{score}%</span>}
    </div>
  );
}
