import type { GrammarTable as GrammarTableData } from "@/content/types";
import { cn } from "@/lib/util/cn";

export function GrammarTable({ table, className }: { table: GrammarTableData; className?: string }) {
  return (
    <div className={cn("overflow-x-auto rounded-2xl border-2 border-line bg-surface", className)}>
      <table className="w-full min-w-[16rem] text-left">
        {table.caption && <caption className="bg-soft-violet px-4 py-2 text-left text-sm font-extrabold uppercase tracking-wide text-on-violet">{table.caption}</caption>}
        <thead>
          <tr className="bg-surface-2 text-xs uppercase tracking-wide text-muted">
            {table.headers.map((h, i) => <th key={i} scope="col" className="px-4 py-2 font-bold">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, r) => (
            <tr key={r} className="border-t border-line">
              {row.map((cell, c) =>
                c === 0 ? (
                  <th key={c} scope="row" className="px-4 py-2 text-sm font-semibold text-muted">{cell}</th>
                ) : (
                  <td key={c} className="px-4 py-2 font-display text-[17px] font-bold">{cell}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
