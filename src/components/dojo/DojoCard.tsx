import { Swords } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { currentBelt, nextBeltStatus, unlockedTenses } from "@/lib/dojo/selectors";
import type { LearnerState } from "@/lib/state/types";
import { cn } from "@/lib/util/cn";
import { BeltIcon } from "./BeltIcon";

/** Compact way into the Conjugation Dojo, for Home and Review. */
export function DojoCard({ state, className }: { state: LearnerState; className?: string }) {
  const open = unlockedTenses(state).length > 0;
  const belt = currentBelt(state);
  const next = nextBeltStatus(state);

  return (
    <Card tone="violet" padding="md" className={cn("flex flex-col gap-4 sm:flex-row sm:items-center", className)}>
      {belt ? <BeltIcon belt={belt} size={72} /> : <span className="grid h-14 w-[72px] place-items-center text-on-violet"><Swords size={40} aria-hidden="true" /></span>}
      <div className="min-w-0 flex-1">
        <h2 className="text-xl font-extrabold">Conjugation Dojo</h2>
        <p className="text-muted">
          {!open
            ? "A conjugation mini game. It opens once the course teaches the present tense."
            : next?.ready
              ? `Your ${next.belt.name.toLowerCase()} test is ready — ${next.belt.focus.toLowerCase()}.`
              : belt
                ? `${belt.spanish}. Keep your forms sharp with a 60-second spar.`
                : "Just you and the verbs. Drill forms, beat your high score, earn belts."}
        </p>
      </div>
      <ButtonLink href="/dojo" variant={open ? "primary" : "secondary"} className="shrink-0">
        {open ? "Enter the Dojo" : "Take a look"}
      </ButtonLink>
    </Card>
  );
}
