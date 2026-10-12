import { PERSON_LABEL } from "@/components/grammar/ConjugationTable";
import type { Person } from "@/content/types";
import { conjugate, PERSONS, type Tense } from "@/lib/conjugate/conjugate";
import { TENSE_INFO, type DojoVerb } from "@/lib/dojo/catalog";
import { cn } from "@/lib/util/cn";

export function PromptCard({ verb, tense, person }: { verb: DojoVerb; tense: Tense; person: Person }) {
  const info = TENSE_INFO[tense];
  return (
    <section aria-label="Conjugate this verb" className="text-center">
      <p className="inline-flex flex-wrap items-baseline justify-center gap-x-2 rounded-full bg-soft-violet px-4 py-1.5 text-on-violet">
        <span className="text-sm font-extrabold uppercase tracking-widest">{info.label}</span>
        <span className="text-sm font-semibold opacity-80">“{info.example}”</span>
      </p>
      <h1 lang="es" className="mt-4 break-words font-display text-5xl font-extrabold leading-none sm:text-6xl">{verb.infinitive}</h1>
      <p className="mt-2 text-muted">{verb.english}</p>
      <p className="mt-5 inline-flex items-center gap-2 rounded-2xl border-2 border-line-strong bg-surface px-4 py-2 shadow-card">
        <span className="text-xs font-extrabold uppercase tracking-widest text-muted">Who</span>
        <span lang="es" className="font-display text-2xl font-extrabold">{PERSON_LABEL[person]}</span>
      </p>
    </section>
  );
}

/** The whole tense for one verb, with the asked-for person highlighted. */
export function FormsTable({ verb, tense, person }: { verb: DojoVerb; tense: Tense; person: Person }) {
  const forms = conjugate(verb.spec, tense);
  return (
    <table className="w-full overflow-hidden rounded-2xl border-2 border-line text-left animate-rise">
      <caption className="sr-only">
        {verb.infinitive} — {TENSE_INFO[tense].label.toLowerCase()}
      </caption>
      <tbody>
        {PERSONS.map((p) => (
          <tr key={p} className={cn("border-t border-line first:border-t-0", p === person && "bg-soft-sol")}>
            <th scope="row" className="w-2/5 px-4 py-1.5 text-sm font-semibold text-muted">{PERSON_LABEL[p]}</th>
            <td lang="es" className={cn("px-4 py-1.5 font-display text-lg", p === person ? "font-extrabold text-on-sol" : "font-bold")}>{forms[p]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
