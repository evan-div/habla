"use client";

import { Eye, Snail, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AudioButton } from "@/components/audio/AudioButton";
import { useAudio } from "@/components/audio/useAudio";
import { Button } from "@/components/ui/Button";
import { TranslatedText } from "@/components/ui/TranslatedText";
import type { AudioSpeed, ListeningExercise } from "@/content/types";
import { useLearnerState } from "@/lib/state/hooks";
import { cn } from "@/lib/util/cn";
import { ChoiceList } from "./ChoiceList";
import { ExerciseHeading } from "./ExerciseHeading";
import { TextAnswer } from "./TextAnswer";
import type { ExerciseViewProps } from "./types";

export function Listening({ exercise, response, onRespond, evaluation }: ExerciseViewProps<ListeningExercise>) {
  const settings = useLearnerState()?.settings;
  const { supported, playingKey, play } = useAudio();
  const [showText, setShowText] = useState(false);
  const [speed, setSpeed] = useState<AudioSpeed>(exercise.startSpeed ?? settings?.defaultAudioSpeed ?? "normal");
  const autoPlayed = useRef(false);
  const locked = evaluation !== null;
  const textShown = showText || locked || !supported;

  // Auto-play once when the exercise appears (if the learner allows it). The flag flips only when
  // playback actually starts, so a cleaned-up first effect (Strict Mode) can't swallow it.
  useEffect(() => {
    if (autoPlayed.current || !settings || !supported || !settings.autoPlayAudio) return;
    const t = setTimeout(() => {
      autoPlayed.current = true;
      void play(exercise.audio, speed, `${exercise.audio.text}:${speed}`);
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings, supported]);

  const playing = playingKey !== null;
  const choiceValue = response?.kind === "choice" ? response.value : null;
  const textValue = response?.kind === "text" ? response.value : "";

  return (
    <div>
      <ExerciseHeading eyebrow="Listening" title={exercise.question} />

      <div className="mb-6 flex flex-col items-center gap-4 rounded-3xl bg-soft-teal p-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            disabled={!supported}
            onClick={() => { setSpeed("normal"); void play(exercise.audio, "normal", `${exercise.audio.text}:normal`); }}
            aria-label="Play at normal speed"
            className={cn(
              "tactile grid h-24 w-24 place-items-center rounded-full bg-brand text-on-brand shadow-[0_5px_0_var(--brand-edge)] [--edge:var(--brand-edge)] hover:bg-brand-hover disabled:opacity-40",
              playing && speed === "normal" && "[animation:ring-pulse_1s_ease-out_infinite]",
            )}
          >
            <Volume2 size={40} aria-hidden="true" />
          </button>
          <button
            type="button"
            disabled={!supported}
            onClick={() => { setSpeed("slow"); void play(exercise.audio, "slow", `${exercise.audio.text}:slow`); }}
            aria-label="Play slowly"
            className="tactile grid h-14 w-14 place-items-center rounded-full border-2 border-line-strong bg-surface text-on-teal shadow-[0_3px_0_var(--line-strong)] [--edge:var(--line-strong)] disabled:opacity-40"
          >
            <Snail size={26} aria-hidden="true" />
          </button>
        </div>
        <p className="text-sm font-bold text-muted">
          {supported ? <>Tap <span className="text-ink">Normal</span> or the snail for <span className="text-ink">Slow</span></> : "Audio isn't available in this browser — the text is shown instead."}
        </p>

        {textShown ? (
          <div className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 ring-1 ring-line">
            {supported && <AudioButton clip={exercise.audio} size="sm" label="Play again" />}
            <div>
              <p lang="es" className="font-display text-2xl font-extrabold">{exercise.audio.text}</p>
              {exercise.translation && locked && <TranslatedText en={exercise.translation} alwaysShow className="text-sm" />}
            </div>
          </div>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => setShowText(true)} leadingIcon={<Eye size={16} aria-hidden="true" />}>Can&apos;t listen right now? Show the text</Button>
        )}
      </div>

      {exercise.mode === "choose" && exercise.options ? (
        <ChoiceList
          options={exercise.options}
          value={choiceValue}
          onChange={(v) => onRespond({ kind: "choice", value: v })}
          evaluation={evaluation}
          label={exercise.question}
        />
      ) : (
        <TextAnswer
          value={textValue}
          onChange={(v) => onRespond(v.trim() ? { kind: "text", value: v } : null)}
          evaluation={evaluation}
          lang="es"
          label="What you heard"
          placeholder="Escribe lo que escuchas"
        />
      )}
    </div>
  );
}
