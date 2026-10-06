"use client";

import { BarChart3, Table2 } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { Card } from "@/components/ui/Card";

export interface ChartTable {
  headers: string[];
  rows: Array<Array<string | number>>;
}

interface ChartFrameProps {
  title: string;
  subtitle?: string;
  table: ChartTable;
  /** Optional right-aligned summary figure (e.g. "142 XP this week"). */
  summary?: ReactNode;
  children: ReactNode;
}

/** Card with a title, a chart, and a "view as table" alternative for every chart. */
export function ChartFrame({ title, subtitle, table, summary, children }: ChartFrameProps) {
  const [asTable, setAsTable] = useState(false);
  const id = useId();
  return (
    <Card padding="md" aria-labelledby={id}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 id={id} className="text-lg font-extrabold">{title}</h3>
          {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          {summary}
          <button
            type="button"
            aria-pressed={asTable}
            onClick={() => setAsTable((v) => !v)}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border-2 border-line px-3 text-sm font-bold text-muted hover:bg-surface-2 hover:text-ink"
          >
            {asTable ? <BarChart3 size={16} aria-hidden="true" /> : <Table2 size={16} aria-hidden="true" />}
            {asTable ? "Chart" : "Table"}
          </button>
        </div>
      </div>
      {asTable ? (
        <div className="max-h-64 overflow-auto rounded-2xl border-2 border-line">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">{title}</caption>
            <thead className="sticky top-0 bg-surface-2 text-xs uppercase tracking-wide text-muted">
              <tr>{table.headers.map((h) => <th key={h} scope="col" className="px-3 py-2 font-bold">{h}</th>)}</tr>
            </thead>
            <tbody>
              {table.rows.map((row, i) => (
                <tr key={i} className="border-t border-line">
                  {row.map((cell, c) => (c === 0 ? <th key={c} scope="row" className="px-3 py-1.5 font-semibold">{cell}</th> : <td key={c} className="px-3 py-1.5 tabular-nums">{cell}</td>))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        children
      )}
    </Card>
  );
}
