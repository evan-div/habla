"use client";

import { GraduationCap, Lightbulb } from "lucide-react";
import { useState } from "react";
import { AudioButton } from "@/components/audio/AudioButton";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { RichText } from "@/components/ui/RichText";
import { TranslatedText } from "@/components/ui/TranslatedText";
import type { GrammarConcept, GrammarExample } from "@/content/types";
import { cn } from "@/lib/util/cn";
import { GrammarLesson } from "./GrammarLesson";
import { GrammarTable } from "./GrammarTable";

export function ExampleList({ examples }: { examples: GrammarExample[] }) {
  return (
    <ul className="space-y-2">
      {examples.map((ex) => (
        <li key={ex.es} className="flex items-start gap-3 rounded-2xl bg-surface p-3 ring-1 ring-line">
          <AudioButton clip={{ text: ex.es }} size="sm" label={`Hear: ${ex.es}`} />
          <div className="min-w-0">
            <p className="font-display text-lg font-bold leading-snug">{ex.es}</p>
            {/* The English gloss is the lesson here (it carries the nuance), so it is always shown. */}
            <TranslatedText en={ex.en} alwaysShow className="text-sm" />
          </div>
        </li>
      ))}
    </ul>
  );
}

interface GrammarCardProps {
  concept: GrammarConcept;
  className?: string;
}

/** Short, visual grammar explanation with an optional deeper "Learn more". */
export function GrammarCard({ concept, className }: GrammarCardProps) {
  const [open, setOpen] = useState(false);
  const { summary } = concept;
  const hasDeepDive = concept.deepDive.length > 0 || (concept.commonMistakes?.length ?? 0) > 0;

  return (
    <section aria-label={`Grammar: ${concept.title}`} className={cn("rounded-3xl border-2 border-transparent bg-soft-violet p-5 sm:p-6", className)}>
      <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-on-violet">
        <GraduationCap size={16} aria-hidden="true" /> Grammar
      </p>
      <h2 className="mt-1 text-3xl font-extrabold">{concept.title}</h2>
      <p className="mt-0.5 text-lg text-muted">{concept.tagline}</p>

      <div className="mt-4 space-y-3 text-[17px] leading-relaxed">
        {summary.body.map((p, i) => <p key={i}><RichText text={p} /></p>)}
      </div>

      {summary.table && <GrammarTable table={summary.table} className="mt-4" />}
      {summary.examples && <div className="mt-4"><ExampleList examples={summary.examples} /></div>}

      {concept.commonMistakes?.[0] && (
        <p className="mt-4 flex items-start gap-2 rounded-2xl bg-surface p-3 text-sm ring-1 ring-line">
          <Lightbulb size={18} className="mt-0.5 shrink-0 text-sol-500" aria-hidden="true" />
          <span>
            Watch out: <span className="font-bold text-on-chili line-through decoration-2">{concept.commonMistakes[0].wrong}</span>{" "}
            → <span className="font-extrabold text-on-leaf">{concept.commonMistakes[0].right}</span>
          </span>
        </p>
      )}

      {hasDeepDive && (
        <>
          <Button variant="secondary" size="sm" className="mt-5" onClick={() => setOpen(true)}>Learn more</Button>
          <Modal open={open} onClose={() => setOpen(false)} title={concept.title} size="lg">
            <GrammarLesson concept={concept} showSummary={false} />
          </Modal>
        </>
      )}
    </section>
  );
}
