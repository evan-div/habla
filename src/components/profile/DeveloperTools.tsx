"use client";

import { Button } from "@/components/ui/Button";
import { devAdvanceDays, devLoadSample, devResetClock } from "@/lib/state/actions";
import type { LearnerState } from "@/lib/state/types";
import { DAY } from "@/lib/util/dates";

/** Testing aids: time travel for spaced repetition, and sample data to preview dashboards. */
export function DeveloperTools({ state, now }: { state: LearnerState; now: number }) {
  const shifted = state.clockOffsetMs !== 0;
  return (
    <details className="group rounded-3xl border-2 border-dashed border-line-strong bg-surface-2/50 p-5">
      <summary className="cursor-pointer list-none font-extrabold [&::-webkit-details-marker]:hidden">
        Testing tools <span className="ml-1 font-semibold text-muted">· preview spaced repetition and dashboards</span>
      </summary>
      <div className="mt-4 space-y-5">
        <div>
          <p className="font-bold">Time travel</p>
          <p className="text-sm text-muted">
            Pretend days pass so words come due for review. App date: <span className="font-bold text-ink">{new Date(now).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</span>
            {shifted && ` (${Math.round(state.clockOffsetMs / DAY)} days ahead)`}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={() => devAdvanceDays(1)}>+1 day</Button>
            <Button size="sm" variant="secondary" onClick={() => devAdvanceDays(3)}>+3 days</Button>
            <Button size="sm" variant="secondary" onClick={() => devAdvanceDays(7)}>+1 week</Button>
            <Button size="sm" variant="ghost" disabled={!shifted} onClick={devResetClock}>Back to today</Button>
          </div>
        </div>
        <div>
          <p className="font-bold">Sample progress</p>
          <p className="text-sm text-muted">Replaces your progress with two weeks of realistic practice, so Home, Progress, Vocabulary and Review all have something to show. Your profile and settings are kept.</p>
          <Button size="sm" variant="secondary" className="mt-2" onClick={devLoadSample}>Load sample progress</Button>
        </div>
      </div>
    </details>
  );
}
