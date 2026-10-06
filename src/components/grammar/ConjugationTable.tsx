import type { Person } from "@/content/types";
import { cn } from "@/lib/util/cn";

export const PERSON_LABEL: Record<Person, string> = {
  yo: "yo",
  tu: "tú",
  el: "él / ella / usted",
  nosotros: "nosotros",
  ellos: "ellos / ustedes",
};

const ORDER: Person[] = ["yo", "tu", "el", "nosotros", "ellos"];

export function ConjugationTable({ title, forms, className }: { title: string; forms: Record<Person, string>; className?: string }) {
  return (
    <table className={cn("w-full overflow-hidden rounded-2xl border-2 border-line text-left", className)}>
      <caption className="sr-only">{title} — present tense</caption>
      <thead>
        <tr className="bg-surface-2 text-xs uppercase tracking-wide text-muted">
          <th scope="col" className="px-4 py-2 font-bold">Who</th>
          <th scope="col" className="px-4 py-2 font-bold">{title}</th>
        </tr>
      </thead>
      <tbody>
        {ORDER.map((p) => (
          <tr key={p} className="border-t border-line">
            <th scope="row" className="px-4 py-2 text-sm font-semibold text-muted">{PERSON_LABEL[p]}</th>
            <td className="px-4 py-2 font-display text-lg font-extrabold">{forms[p]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
