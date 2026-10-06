"use client";

import { useState } from "react";
import { cn } from "@/lib/util/cn";

export interface MasterySegment {
  key: "weak" | "learning" | "strong";
  label: string;
  count: number;
  /** Tailwind background class (a validated band color). */
  className: string;
  range: string;
}

/** Part-to-whole stacked bar with 2px surface gaps, a legend, and sparse inline counts. */
export function MasteryBar({ segments }: { segments: MasterySegment[] }) {
  const total = segments.reduce((s, x) => s + x.count, 0);
  const [active, setActive] = useState<string | null>(null);
  if (total === 0) return <p className="rounded-2xl border-2 border-dashed border-line p-5 text-center text-muted">Words appear here once you start learning them.</p>;

  return (
    <div>
      <div className="flex h-6 w-full gap-0.5 overflow-hidden rounded-[6px]" role="group" aria-label="Mastery distribution">
        {segments.filter((s) => s.count > 0).map((s) => {
          const pct = (s.count / total) * 100;
          return (
            <button
              key={s.key}
              type="button"
              className={cn("relative grid place-items-center text-xs font-extrabold text-white outline-offset-2 transition-[filter]", s.className, active === s.key && "brightness-110")}
              style={{ width: `${pct}%` }}
              onPointerEnter={() => setActive(s.key)}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive(s.key)}
              onBlur={() => setActive(null)}
              aria-label={`${s.label}: ${s.count} ${s.count === 1 ? "word" : "words"}, ${Math.round(pct)}%`}
            >
              {pct >= 12 && <span className="tabular-nums">{s.count}</span>}
              {active === s.key && (
                <span role="tooltip" className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-xl bg-ink px-3 py-1.5 text-left text-xs font-normal text-bg shadow-pop">
                  <span className="block font-extrabold tabular-nums">{s.count} {s.count === 1 ? "word" : "words"} · {Math.round(pct)}%</span>
                  <span className="block opacity-80">{s.label} ({s.range})</span>
                </span>
              )}
            </button>
          );
        })}
      </div>
      <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2" aria-label="Legend">
        {segments.map((s) => (
          <li key={s.key} className="flex items-center gap-2 text-sm">
            <span className={cn("h-3 w-3 rounded-[3px]", s.className)} aria-hidden="true" />
            <span className="font-bold">{s.label}</span>
            <span className="tabular-nums text-muted">{s.count}</span>
            <span className="text-muted">· {s.range}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
