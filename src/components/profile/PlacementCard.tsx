import { Compass } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ALL_UNITS } from "@/content/course";
import type { LearnerState } from "@/lib/state/types";

export function PlacementCard({ placement }: { placement: LearnerState["placement"] }) {
  const unit = placement ? ALL_UNITS.find((u) => u.number === placement.startUnitNumber) : undefined;
  return (
    <Card padding="md" as="section" aria-labelledby="placement-heading" className="flex flex-wrap items-center justify-between gap-4">
      <div className="min-w-0 sm:max-w-md">
        <h2 id="placement-heading" className="flex items-center gap-2 text-xl font-extrabold"><Compass size={22} aria-hidden="true" /> Course starting point</h2>
        <p className="mt-1 text-sm text-muted">
          {placement && unit
            ? `Your last check placed you at Unit ${unit.number}: ${unit.title} (${placement.correct} of ${placement.answered} correct). Know more than you thought? Take it again.`
            : "Already know some Spanish? A two-minute check can skip the lessons you don't need. Skipped words join your review, so nothing slips through."}
        </p>
      </div>
      <ButtonLink href="/placement" variant="secondary">{placement ? "Retake the check" : "Find my starting point"}</ButtonLink>
    </Card>
  );
}
