"use client";

import { AudioButton } from "@/components/audio/AudioButton";
import { Badge } from "@/components/ui/Badge";
import { TranslatedText } from "@/components/ui/TranslatedText";
import { WordTags } from "@/components/vocabulary/WordTags";
import type { VocabularyIntroductionExercise } from "@/content/types";
import { getVocab, vocabClip } from "@/content/vocabulary";
import { ExerciseHeading } from "./ExerciseHeading";
import type { ExerciseViewProps } from "./types";

export function VocabularyIntroduction({ exercise }: ExerciseViewProps<VocabularyIntroductionExercise>) {
  return (
    <div>
      <ExerciseHeading eyebrow="New words" title={exercise.title ?? "Meet the words"}>
        <p className="mt-1 text-muted">{exercise.intro ?? "Tap the speaker to hear each one — then say it out loud."}</p>
      </ExerciseHeading>
      <ul className="grid gap-3.5">
        {exercise.wordIds.map((id, i) => {
          const v = getVocab(id);
          if (!v) return null;
          const clip = vocabClip(v);
          return (
            <li
              key={id}
              className="animate-rise flex items-start gap-4 rounded-3xl border-2 border-line bg-surface p-4 shadow-card sm:p-5"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="flex flex-col gap-2">
                <AudioButton clip={clip} size="md" label={`Hear ${v.spanish}`} />
                <AudioButton clip={clip} speed="slow" size="sm" label={`Hear ${v.spanish} slowly`} className="self-center" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-3xl font-extrabold leading-tight">
                  {v.spanish}
                  {v.feminine && <span className="text-muted"> / {v.feminine}</span>}
                </p>
                <p className="text-lg font-semibold text-muted">{v.english}</p>
                <p className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  <Badge tone="neutral">{v.pronunciation}</Badge>
                  <WordTags vocab={v} showPos={false} showGender />
                </p>
                <div className="mt-3 rounded-2xl bg-soft-teal px-3.5 py-2.5">
                  <p className="font-display text-[17px] font-bold">{v.exampleSentence}</p>
                  <TranslatedText en={v.exampleTranslation} className="text-sm" />
                </div>
                {v.note && <p className="mt-2.5 text-sm text-muted"><span className="font-extrabold text-ink">Good to know: </span>{v.note}</p>}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
