"use client";

import { useState } from "react";
import { cn } from "@/lib/util/cn";
import { niceMax, ticksFor } from "./scale";

export interface Column {
  label: string;
  /** Full label for the tooltip, e.g. "Monday, Oct 5". */
  detail: string;
  value: number;
  highlight?: boolean;
}

interface ColumnChartProps {
  columns: Column[];
  unit: string;
  /** Reference line (e.g. the daily goal). */
  goal?: number;
  goalLabel?: string;
  height?: number;
  ariaLabel: string;
}

/** Single-series column chart: thin rounded-top columns, hairline grid, per-column tooltip. */
export function ColumnChart({ columns, unit, goal, goalLabel = "Goal", height = 190, ariaLabel }: ColumnChartProps) {
  const [active, setActive] = useState<number | null>(null);
  const max = niceMax(Math.max(goal ?? 0, ...columns.map((c) => c.value)));
  const pct = (v: number) => `${(v / max) * 100}%`;

  return (
    <div role="group" aria-label={ariaLabel} className="flex gap-2" style={{ height: height + 28 }}>
      <div className="flex flex-col justify-between pb-7 text-right text-xs tabular-nums text-muted" style={{ height }} aria-hidden="true">
        {[...ticksFor(max)].reverse().map((t) => <span key={t} className="leading-none">{t}</span>)}
      </div>
      <div className="relative flex-1">
        <div className="absolute inset-x-0 top-0" style={{ height }} aria-hidden="true">
          {ticksFor(max).map((t) => (
            <div key={t} className="absolute inset-x-0 border-t border-line" style={{ bottom: pct(t) }} />
          ))}
          {goal !== undefined && goal > 0 && (
            <div className="absolute inset-x-0 border-t border-ink/50" style={{ bottom: pct(goal) }}>
              <span className="absolute -top-5 right-0 rounded bg-surface px-1.5 text-xs font-bold text-muted">{goalLabel} {goal}</span>
            </div>
          )}
        </div>

        <div className="absolute inset-x-0 top-0 flex" style={{ height: height + 28 }}>
          {columns.map((c, i) => (
            <div key={c.label + i} className="relative flex flex-1 flex-col items-center">
              <button
                type="button"
                className="group relative flex w-full flex-1 items-end justify-center rounded-md outline-offset-0"
                style={{ height }}
                onPointerEnter={() => setActive(i)}
                onPointerLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                aria-label={`${c.detail}: ${c.value} ${unit}`}
              >
                <span
                  className={cn("w-full max-w-6 rounded-t-[4px] transition-[height,filter] duration-500", c.highlight ? "bg-teal-500" : "bg-teal-500/55", active === i && "brightness-110")}
                  style={{ height: c.value > 0 ? `max(3px, ${pct(c.value)})` : 0, marginInline: 1 }}
                />
                {c.highlight && c.value > 0 && (
                  <span className="absolute left-1/2 -translate-x-1/2 text-xs font-extrabold tabular-nums text-ink" style={{ bottom: `calc(${pct(c.value)} + 4px)` }}>{c.value}</span>
                )}
                {active === i && (
                  <span role="tooltip" className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-xl bg-ink px-3 py-1.5 text-xs text-bg shadow-pop" style={{ bottom: `calc(${pct(c.value)} + 14px)` }}>
                    <span className="block font-extrabold tabular-nums">{c.value} {unit}</span>
                    <span className="block opacity-80">{c.detail}</span>
                  </span>
                )}
              </button>
              <span className={cn("mt-2 h-5 text-xs", c.highlight ? "font-extrabold text-ink" : "font-semibold text-muted")}>{c.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
