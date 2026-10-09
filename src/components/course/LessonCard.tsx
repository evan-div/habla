import { ArrowRight, Check, Clock, Lock, MessageCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { buttonStyles } from "@/components/ui/button-styles";
import { introducedWordIds, grammarTaught } from "@/content/course";
import { getGrammar } from "@/content/grammar";
import type { Lesson } from "@/content/types";
import type { LessonStatus } from "@/lib/state/selectors";
import { cn } from "@/lib/util/cn";

interface LessonCardProps {
  lesson: Lesson;
  /** 1-based position within the unit. */
  index: number;
  status: LessonStatus;
  isNext: boolean;
  /** Title of the lesson that must be finished first (for locked rows). */
  blockedBy?: string;
  /** Marked done by the placement check rather than played. */
  placedOut?: boolean;
}

export function LessonCard({ lesson, index, status, isNext, blockedBy, placedOut }: LessonCardProps) {
  const words = introducedWordIds(lesson.exercises).length;
  const grammar = grammarTaught(lesson).map((id) => getGrammar(id)?.title).filter(Boolean) as string[];
  const locked = status === "locked";

  const body = (
    <>
      <span
        className={cn(
          "grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 font-display text-lg font-extrabold",
          status === "completed" && "border-transparent bg-leaf-500 text-white",
          status === "available" && (isNext ? "border-transparent bg-brand text-on-brand [animation:ring-pulse_1.8s_ease-out_infinite]" : "border-line-strong bg-surface text-ink"),
          locked && "border-line bg-surface-2 text-faint",
        )}
        aria-hidden="true"
      >
        {status === "completed" ? <Check size={22} strokeWidth={3} /> : locked ? <Lock size={18} /> : index}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className={cn("text-lg font-extrabold leading-tight", locked && "text-muted")}>{lesson.title}</span>
          {lesson.kind === "checkpoint" && <Badge tone="violet" icon={<ShieldCheck size={12} aria-hidden="true" />}>Checkpoint</Badge>}
          {lesson.kind === "real-talk" && <Badge tone="rosa" icon={<MessageCircle size={12} aria-hidden="true" />}>Real Talk</Badge>}
        </span>
        <span className="mt-0.5 block text-[15px] text-muted">{lesson.subtitle}</span>
        <span className="mt-2 flex flex-wrap items-center gap-1.5">
          {placedOut && <Badge tone="sol">Skipped · placement</Badge>}
          <Badge tone="neutral" icon={<Clock size={12} aria-hidden="true" />}>~{lesson.estimatedMinutes} min</Badge>
          {words > 0 && <Badge tone="teal">{words} new {words === 1 ? "word" : "words"}</Badge>}
          {grammar.map((g) => <Badge key={g} tone="violet">{g}</Badge>)}
        </span>
        {locked && blockedBy && <span className="mt-2 block text-sm font-semibold text-muted">Finish “{blockedBy}” to unlock.</span>}
      </span>

      {!locked && (
        <span
          className={cn(
            buttonStyles({ variant: isNext ? "primary" : status === "completed" ? "ghost" : "secondary", size: "sm" }),
            "hidden shrink-0 sm:inline-flex",
          )}
          aria-hidden="true"
        >
          {isNext ? "Start" : status === "completed" ? (placedOut ? "Play" : "Practice") : "Start"}
          <ArrowRight size={16} />
        </span>
      )}
    </>
  );

  const shared = "flex items-start gap-4 rounded-2xl border-2 p-4 transition-colors";

  if (locked) {
    return <li><div aria-disabled="true" className={cn(shared, "border-dashed border-line bg-surface-2/50")}>{body}</div></li>;
  }
  return (
    <li>
      <Link
        href={`/learn/${lesson.id}`}
        className={cn(shared, isNext ? "border-teal-500 bg-surface shadow-card hover:bg-soft-teal" : "border-line bg-surface hover:bg-surface-2")}
        aria-label={`${status === "completed" ? "Practice" : "Start"} lesson ${index}: ${lesson.title}`}
      >
        {body}
      </Link>
    </li>
  );
}
