"use client";

import { BookOpen, MessageCircle } from "lucide-react";
import { AudioButton } from "@/components/audio/AudioButton";
import { REGISTER_LABEL } from "@/components/vocabulary/WordTags";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { TranslatedText } from "@/components/ui/TranslatedText";
import type { NaturalSpeechExercise } from "@/content/types";
import { ExerciseHeading } from "./ExerciseHeading";
import type { ExerciseViewProps } from "./types";

const LABEL_TONE: Record<string, BadgeTone> = { Standard: "neutral", Informal: "sol", Slang: "rosa", Vulgar: "chili" };

/** “How people actually say it” — textbook Spanish vs. natural conversation. */
export function NaturalSpeech({ exercise }: ExerciseViewProps<NaturalSpeechExercise>) {
  return (
    <div>
      <ExerciseHeading eyebrow="How people actually say it" title={exercise.situation} />
      <div className="space-y-4">
        <section aria-label="Textbook" className="rounded-3xl border-2 border-line bg-surface-2 p-5">
          <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-muted"><BookOpen size={16} aria-hidden="true" /> Textbook</p>
          <div className="mt-2 flex items-center gap-3">
            <AudioButton clip={{ text: exercise.textbook.es }} size="sm" label={`Hear ${exercise.textbook.es}`} />
            <div>
              <p className="font-display text-2xl font-extrabold">{exercise.textbook.es}</p>
              <TranslatedText en={exercise.textbook.en} className="text-sm" />
            </div>
          </div>
        </section>

        <section aria-label="Natural conversation" className="rounded-3xl bg-soft-sol p-5">
          <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-on-sol"><MessageCircle size={16} aria-hidden="true" /> Natural conversation</p>
          <ul className="mt-3 space-y-3">
            {exercise.natural.map((v) => (
              <li key={v.es} className="flex items-center gap-3 rounded-2xl bg-surface p-3 ring-1 ring-line">
                <AudioButton clip={{ text: v.es }} size="sm" label={`Hear ${v.es}`} />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-2xl font-extrabold leading-tight">{v.es}</p>
                  {v.en && <TranslatedText en={v.en} className="text-sm" />}
                </div>
                <span className="flex shrink-0 flex-col items-end gap-1">
                  <Badge tone={LABEL_TONE[v.label]}>{REGISTER_LABEL[v.label.toLowerCase() as keyof typeof REGISTER_LABEL]}</Badge>
                  {v.region === "mx" && <Badge tone="teal">Regional — Mexico</Badge>}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {exercise.note && <p className="rounded-2xl border-2 border-dashed border-line p-4 text-[17px] leading-relaxed">{exercise.note}</p>}
      </div>
    </div>
  );
}
