import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RichText } from "@/components/ui/RichText";
import { getGrammar } from "@/content/grammar";
import type { GrammarConcept, GrammarSection } from "@/content/types";
import { ExampleList } from "./GrammarCard";
import { GrammarTable } from "./GrammarTable";

function Section({ section, level = 3 }: { section: GrammarSection; level?: 2 | 3 }) {
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <section className="space-y-3">
      <Heading className="text-xl font-extrabold">{section.heading}</Heading>
      {section.body.map((p, i) => <p key={i} className="text-[17px] leading-relaxed"><RichText text={p} /></p>)}
      {section.table && <GrammarTable table={section.table} />}
      {section.examples && <ExampleList examples={section.examples} />}
    </section>
  );
}

interface GrammarLessonProps {
  concept: GrammarConcept;
  /** Include the short summary above the deep dive (full page) or skip it (modal after a card). */
  showSummary?: boolean;
}

/** The full explanation: summary, deep-dive sections, common mistakes and related topics. */
export function GrammarLesson({ concept, showSummary = true }: GrammarLessonProps) {
  const related = (concept.related ?? []).map((id) => getGrammar(id)).filter((g) => g && g.status === "available");
  return (
    <div className="space-y-7">
      {showSummary && <Section section={concept.summary} />}
      {concept.deepDive.map((s) => <Section key={s.heading} section={s} />)}

      {concept.commonMistakes && concept.commonMistakes.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-xl font-extrabold">Common mistakes</h3>
          <ul className="space-y-3">
            {concept.commonMistakes.map((m) => (
              <li key={m.wrong} className="rounded-2xl border-2 border-line bg-surface-2/60 p-4">
                <p className="text-sm font-bold text-on-chili">✗ <span className="line-through decoration-2">{m.wrong}</span></p>
                <p className="mt-0.5 font-display text-lg font-extrabold text-on-leaf">✓ {m.right}</p>
                <p className="mt-1 text-muted">{m.why}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <section>
          <h3 className="mb-2 text-xl font-extrabold">Related</h3>
          <ul className="flex flex-wrap gap-2">
            {related.map((g) => (
              <li key={g!.id}>
                <Link href={`/grammar/${g!.id}`} className="inline-flex items-center gap-1.5 rounded-xl bg-soft-violet px-3 py-1.5 text-sm font-bold text-on-violet hover:brightness-95">
                  {g!.title} <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
