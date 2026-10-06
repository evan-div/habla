"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { DAILY_GOAL_OPTIONS } from "@/config/xp";
import { updateProfile } from "@/lib/state/actions";
import type { LearnerState, Reason, SelfLevel } from "@/lib/state/types";
import { cn } from "@/lib/util/cn";

const LEVELS: Array<{ value: SelfLevel; label: string }> = [
  { value: "new", label: "Completely new" },
  { value: "few-words", label: "A few words" },
  { value: "basic", label: "Basic Spanish" },
  { value: "simple-conversations", label: "Simple conversations" },
];

const REASONS: Array<{ value: Reason; label: string }> = [
  { value: "travel", label: "Travel" },
  { value: "conversation", label: "Conversation" },
  { value: "fluency", label: "Fluency" },
  { value: "family", label: "Friends / family" },
  { value: "work", label: "Work" },
  { value: "culture", label: "Culture" },
  { value: "other", label: "Other" },
];

export function ProfileCard({ profile }: { profile: LearnerState["profile"] }) {
  const [name, setName] = useState(profile.displayName);

  return (
    <Card padding="md" as="section" aria-labelledby="profile-heading">
      <h2 id="profile-heading" className="mb-4 text-xl font-extrabold">About you</h2>
      <div className="space-y-6">
        <div>
          <label htmlFor="display-name" className="font-extrabold">Name</label>
          <input
            id="display-name"
            value={name}
            maxLength={24}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => name.trim() !== profile.displayName && updateProfile({ displayName: name.trim() })}
            placeholder="What should we call you?"
            className="mt-1.5 h-12 w-full max-w-sm rounded-2xl border-2 border-line-strong bg-surface px-4 font-bold outline-none placeholder:font-medium placeholder:text-faint focus:border-teal-500"
          />
        </div>

        <div>
          <p className="font-extrabold">Daily XP goal</p>
          <p className="mb-2 text-sm text-muted">Steady beats intense — pick what you can keep up.</p>
          <SegmentedControl<string>
            label="Daily XP goal"
            value={String(profile.dailyGoalXp)}
            onChange={(v) => updateProfile({ dailyGoalXp: Number(v) })}
            options={DAILY_GOAL_OPTIONS.map((o) => ({ value: String(o.xp), label: `${o.xp} XP` }))}
          />
        </div>

        <div>
          <p className="font-extrabold">Your Spanish level</p>
          <p className="mb-2 text-sm text-muted">Used to personalize your course later on.</p>
          <div role="radiogroup" aria-label="Spanish level" className="flex flex-wrap gap-2">
            {LEVELS.map((l) => (
              <button
                key={l.value}
                type="button"
                role="radio"
                aria-checked={profile.selfLevel === l.value}
                onClick={() => updateProfile({ selfLevel: l.value })}
                className={cn("rounded-full border-2 px-4 py-1.5 text-sm font-bold", profile.selfLevel === l.value ? "border-transparent bg-brand text-on-brand" : "border-line bg-surface text-muted hover:bg-surface-2")}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="font-extrabold">Why you&apos;re learning</p>
          <div role="group" aria-label="Reasons" className="mt-2 flex flex-wrap gap-2">
            {REASONS.map((r) => {
              const on = profile.reasons.includes(r.value);
              return (
                <button
                  key={r.value}
                  type="button"
                  aria-pressed={on}
                  onClick={() => updateProfile({ reasons: on ? profile.reasons.filter((x) => x !== r.value) : [...profile.reasons, r.value] })}
                  className={cn("rounded-full border-2 px-4 py-1.5 text-sm font-bold", on ? "border-transparent bg-brand text-on-brand" : "border-line bg-surface text-muted hover:bg-surface-2")}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
