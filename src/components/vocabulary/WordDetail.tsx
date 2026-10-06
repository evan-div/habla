"use client";

import Link from "next/link";
import { AudioButton } from "@/components/audio/AudioButton";
import { ConjugationTable } from "@/components/grammar/ConjugationTable";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { TranslatedText } from "@/components/ui/TranslatedText";
import { INTRODUCED_IN, getLesson } from "@/content/course";
import { getVocab, vocabClip } from "@/content/vocabulary";
import { masteryAt, masteryBand } from "@/lib/mastery/mastery";
import type { WordProgress } from "@/lib/state/types";
import { formatDue, formatRelative } from "@/lib/util/dates";
import { MasteryMeter, BAND_LABEL } from "./MasteryMeter";
import { WordTags } from "./WordTags";

const REGION_NAME = { mx: "Mexico", es: "Spain", ar: "Argentina", co: "Colombia", caribbean: "the Caribbean" } as const;

interface WordDetailProps {
  vocabId: string | null;
  progress: WordProgress | undefined;
  now: number;
  onClose: () => void;
}

export function WordDetail({ vocabId, progress, now, onClose }: WordDetailProps) {
  const vocab = vocabId ? getVocab(vocabId) : undefined;
  return (
    <Modal open={Boolean(vocab)} onClose={onClose} title={vocab?.spanish ?? "Word"} hideTitle size="md">
      {vocab && <WordDetailBody vocabId={vocab.id} progress={progress} now={now} />}
    </Modal>
  );
}

function WordDetailBody({ vocabId, progress, now }: { vocabId: string; progress: WordProgress | undefined; now: number }) {
  const vocab = getVocab(vocabId)!;
  const mastery = progress ? masteryAt(progress, now) : 0;
  const band = masteryBand(mastery);
  const lessonId = progress?.introducedInLesson ?? INTRODUCED_IN.get(vocab.id);
  const lesson = lessonId ? getLesson(lessonId) : undefined;
  const clip = vocabClip(vocab);
  const display = vocab.feminine ? `${vocab.spanish} / ${vocab.feminine}` : vocab.spanish;

  return (
    <div className="space-y-6">
      <header>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">{display}</h3>
            <p className="mt-1 text-xl text-muted">{vocab.english}</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <AudioButton clip={clip} size="md" label={`Hear ${vocab.spanish}`} />
            <AudioButton clip={clip} speed="slow" size="md" label={`Hear ${vocab.spanish} slowly`} />
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <WordTags vocab={vocab} showStandard showGender />
        </div>
        <p className="mt-3 text-sm text-muted">
          Pronounced <span className="rounded-lg bg-surface-2 px-2 py-0.5 font-mono font-bold text-ink">{vocab.pronunciation}</span>
          {vocab.plural && <> · Plural: <span className="font-bold text-ink">{vocab.plural}</span></>}
        </p>
      </header>

      <section aria-label="Mastery" className="rounded-2xl border-2 border-line bg-surface-2/60 p-4">
        {progress ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <MasteryMeter score={mastery} />
              <Badge tone={band === "strong" ? "leaf" : band === "learning" ? "sol" : "chili"}>{BAND_LABEL[band]}</Badge>
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
              <Stat label="Seen" value={progress.timesSeen} />
              <Stat label="Correct" value={progress.timesCorrect} />
              <Stat label="Missed" value={progress.timesIncorrect} />
            </dl>
            <dl className="mt-3 grid gap-1 text-sm text-muted sm:grid-cols-2">
              <div>Last reviewed: <span className="font-bold text-ink">{formatRelative(progress.lastReviewed, now)}</span></div>
              <div>Next review: <span className="font-bold text-ink">{formatDue(progress.nextReview, now)}</span></div>
            </dl>
          </>
        ) : (
          <p className="text-sm text-muted">You haven&apos;t met this word yet — it appears in a lesson ahead.</p>
        )}
      </section>

      <section aria-label="Example">
        <h4 className="mb-2 text-sm font-extrabold uppercase tracking-wide text-muted">In a sentence</h4>
        <div className="flex items-start gap-3 rounded-2xl bg-soft-teal p-4">
          <AudioButton clip={{ text: vocab.exampleSentence }} size="sm" label="Hear the example sentence" />
          <div>
            <p className="font-display text-xl font-bold text-ink">{vocab.exampleSentence}</p>
            <TranslatedText en={vocab.exampleTranslation} />
          </div>
        </div>
      </section>

      {vocab.note && (
        <section aria-label="Note" className="rounded-2xl bg-soft-sol p-4 text-on-sol">
          <h4 className="mb-1 text-sm font-extrabold uppercase tracking-wide">Good to know</h4>
          <p className="text-ink">{vocab.note}</p>
        </section>
      )}

      {vocab.regionalNotes?.map((n) => (
        <p key={n.region} className="rounded-2xl border-2 border-line p-3 text-sm">
          <span className="font-extrabold">{REGION_NAME[n.region]}: </span>
          {n.text}
        </p>
      ))}

      {vocab.verb && (
        <section aria-label="Conjugation">
          <h4 className="mb-2 flex flex-wrap items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-muted">
            Conjugation
            <Badge tone={vocab.verb.regularOrIrregular === "regular" ? "leaf" : "rosa"}>{vocab.verb.regularOrIrregular}</Badge>
            <Badge tone="neutral">-{vocab.verb.group} verb</Badge>
            {vocab.verb.stemChange && <Badge tone="violet">{vocab.verb.stemChange}</Badge>}
          </h4>
          <ConjugationTable title={vocab.verb.infinitive} forms={vocab.verb.conjugations.present} />
        </section>
      )}

      {vocab.related && vocab.related.length > 0 && (
        <section aria-label="Related words">
          <h4 className="mb-2 text-sm font-extrabold uppercase tracking-wide text-muted">Related</h4>
          <ul className="flex flex-wrap gap-2">
            {vocab.related.map((id) => {
              const r = getVocab(id);
              return r ? (
                <li key={id} className="rounded-xl bg-surface-2 px-3 py-1.5 text-sm"><span className="font-bold">{r.spanish}</span> <span className="text-muted">· {r.english}</span></li>
              ) : null;
            })}
          </ul>
        </section>
      )}

      {lesson && (
        <p className="text-sm text-muted">
          First met in <Link href={`/course`} className="font-bold text-on-teal underline underline-offset-2">{lesson.title}</Link>.
        </p>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-surface p-2">
      <dt className="text-xs font-bold uppercase tracking-wide text-muted">{label}</dt>
      <dd className="font-display text-2xl font-extrabold">{value}</dd>
    </div>
  );
}
