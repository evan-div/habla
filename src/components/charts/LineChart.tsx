"use client";

import { useState, type KeyboardEvent, type PointerEvent } from "react";
import { niceMax, ticksFor } from "./scale";
import { useElementWidth } from "./useElementWidth";

export interface LinePoint {
  /** Short x label ("Oct 5"). */
  label: string;
  /** Longer label for the tooltip. */
  detail: string;
  /** null = no data that day (the line breaks). */
  value: number | null;
}

interface LineChartProps {
  points: LinePoint[];
  /** Stroke/fill color (a CSS color or var). */
  color: string;
  format?: (v: number) => string;
  unit: string;
  yMax?: number;
  height?: number;
  /** Fill under the line with a ~10% wash (single contiguous series). */
  area?: boolean;
  ariaLabel: string;
}

const PAD = { left: 38, right: 22, top: 14, bottom: 26 };

/** Single-series line chart: 2px line, ≥8px end dot with a surface ring, crosshair tooltip. */
export function LineChart({ points, color, format = String, unit, yMax, height = 210, area = false, ariaLabel }: LineChartProps) {
  const { ref, width } = useElementWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);

  const values = points.map((p) => p.value ?? 0);
  const max = yMax ?? niceMax(Math.max(1, ...values));
  const innerW = Math.max(0, width - PAD.left - PAD.right);
  const innerH = height - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (points.length <= 1 ? innerW / 2 : (i / (points.length - 1)) * innerW);
  const y = (v: number) => PAD.top + innerH - (v / max) * innerH;

  // Break the line wherever a day has no data.
  const segments: Array<Array<{ i: number; v: number }>> = [];
  points.forEach((p, i) => {
    if (p.value === null) return;
    const last = segments[segments.length - 1];
    if (last && last[last.length - 1].i === i - 1) last.push({ i, v: p.value });
    else segments.push([{ i, v: p.value }]);
  });
  const pathOf = (seg: Array<{ i: number; v: number }>) => seg.map((p, k) => `${k === 0 ? "M" : "L"}${x(p.i).toFixed(1)} ${y(p.v).toFixed(1)}`).join(" ");

  const lastIndex = points.reduce((acc, p, i) => (p.value !== null ? i : acc), -1);
  const tickEvery = Math.max(1, Math.ceil(points.length / 6));

  function nearest(clientX: number, rect: DOMRect) {
    const rel = clientX - rect.left - PAD.left;
    const idx = Math.round((rel / Math.max(1, innerW)) * (points.length - 1));
    return Math.min(points.length - 1, Math.max(0, idx));
  }
  const onMove = (e: PointerEvent<SVGSVGElement>) => setActive(nearest(e.clientX, e.currentTarget.getBoundingClientRect()));
  const onKey = (e: KeyboardEvent<SVGSVGElement>) => {
    if (e.key === "ArrowRight") { e.preventDefault(); setActive((a) => Math.min(points.length - 1, (a ?? -1) + 1)); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); setActive((a) => Math.max(0, (a ?? points.length) - 1)); }
    else if (e.key === "Escape") setActive(null);
  };

  const tip = active !== null ? points[active] : null;

  return (
    <div ref={ref} className="relative w-full" style={{ height }}>
      {width > 0 && (
        <svg
          width={width}
          height={height}
          role="img"
          aria-label={`${ariaLabel}. Use left and right arrow keys to read each point.`}
          tabIndex={0}
          onPointerMove={onMove}
          onPointerLeave={() => setActive(null)}
          onFocus={() => setActive((a) => a ?? lastIndex)}
          onBlur={() => setActive(null)}
          onKeyDown={onKey}
          className="touch-pan-y overflow-visible rounded-lg"
        >
          {ticksFor(max).map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} stroke="var(--line)" strokeWidth={1} />
              <text x={PAD.left - 8} y={y(t) + 4} textAnchor="end" fontSize={11} fill="var(--muted)" className="tabular-nums">{Math.round(t)}</text>
            </g>
          ))}
          {points.map((p, i) => (i % tickEvery === 0 || i === points.length - 1) && (i === points.length - 1 || points.length - 1 - i >= tickEvery / 2) ? (
            <text key={i} x={x(i)} y={height - 6} textAnchor="middle" fontSize={11} fill="var(--muted)">{p.label}</text>
          ) : null)}

          {area && segments.map((seg, k) => (
            <path key={`a${k}`} d={`${pathOf(seg)} L${x(seg[seg.length - 1].i)} ${y(0)} L${x(seg[0].i)} ${y(0)} Z`} fill={color} opacity={0.1} />
          ))}
          {segments.map((seg, k) => (
            <path key={`l${k}`} d={pathOf(seg)} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          ))}

          {/* Isolated single-day segments still need a visible mark. */}
          {segments.filter((s) => s.length === 1).map((s) => (
            <circle key={`d${s[0].i}`} cx={x(s[0].i)} cy={y(s[0].v)} r={4} fill={color} stroke="var(--surface)" strokeWidth={2} />
          ))}

          {active !== null && points[active].value !== null && (
            <g pointerEvents="none">
              <line x1={x(active)} x2={x(active)} y1={PAD.top} y2={y(0)} stroke="var(--line-strong)" strokeWidth={1} />
              <circle cx={x(active)} cy={y(points[active].value!)} r={5} fill={color} stroke="var(--surface)" strokeWidth={2} />
            </g>
          )}
          {lastIndex >= 0 && active === null && (
            <g pointerEvents="none">
              <circle cx={x(lastIndex)} cy={y(points[lastIndex].value!)} r={5} fill={color} stroke="var(--surface)" strokeWidth={2} />
              <text x={x(lastIndex)} y={y(points[lastIndex].value!) - 11} textAnchor="end" fontSize={12} fontWeight={800} fill="var(--ink)" className="tabular-nums">{format(points[lastIndex].value!)}</text>
            </g>
          )}
        </svg>
      )}
      {tip && active !== null && (
        <div
          role="tooltip"
          className="pointer-events-none absolute z-10 -translate-x-1/2 whitespace-nowrap rounded-xl bg-ink px-3 py-1.5 text-xs text-bg shadow-pop"
          style={{ left: Math.min(Math.max(x(active), 60), width - 60), top: 0 }}
        >
          <span className="block font-extrabold tabular-nums">{tip.value === null ? "No practice" : `${format(tip.value)} ${unit}`}</span>
          <span className="block opacity-80">{tip.detail}</span>
        </div>
      )}
    </div>
  );
}
