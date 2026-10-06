"use client";

import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Switch } from "@/components/ui/Switch";
import { updateSettings } from "@/lib/state/actions";
import type { LearnerState, Settings } from "@/lib/state/types";

function Row({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
      <div className="min-w-0 sm:max-w-md">
        <p className="font-extrabold">{title}</p>
        <p className="text-sm text-muted">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export function PreferencesCard({ settings }: { settings: LearnerState["settings"] }) {
  return (
    <Card padding="md" as="section" aria-labelledby="prefs-heading">
      <h2 id="prefs-heading" className="mb-4 text-xl font-extrabold">Learning preferences</h2>
      <div className="divide-y-2 divide-line">
        <Row title="English support" description="How much English you see next to Spanish examples. Lower it as you improve — you can always reveal a translation.">
          <SegmentedControl<Settings["translationSupport"]>
            label="English support"
            value={settings.translationSupport}
            onChange={(v) => updateSettings({ translationSupport: v })}
            options={[{ value: "full", label: "Always" }, { value: "tap", label: "On tap" }, { value: "minimal", label: "Minimal" }]}
          />
        </Row>
        <Row title="Play audio automatically" description="Listening exercises start playing as soon as they appear.">
          <Switch label="Play audio automatically" checked={settings.autoPlayAudio} onChange={(v) => updateSettings({ autoPlayAudio: v })} />
        </Row>
        <Row title="Listening speed" description="Which speed listening exercises start with. You can switch any time.">
          <SegmentedControl<Settings["defaultAudioSpeed"]>
            label="Default listening speed"
            value={settings.defaultAudioSpeed}
            onChange={(v) => updateSettings({ defaultAudioSpeed: v })}
            options={[{ value: "normal", label: "Natural" }, { value: "slow", label: "Slow" }]}
          />
        </Row>
        <Row title="Open course" description="Unlock every lesson so you can jump ahead. Lessons are designed to build on each other, so we recommend keeping this off unless you already know some Spanish.">
          <Switch label="Open course" checked={settings.openCourse} onChange={(v) => updateSettings({ openCourse: v })} />
        </Row>
        <Row title="Appearance" description="Match your device, or pick light or dark.">
          <SegmentedControl<Settings["theme"]>
            label="Theme"
            value={settings.theme}
            onChange={(v) => updateSettings({ theme: v })}
            options={[{ value: "system", label: "Auto" }, { value: "light", label: "Light" }, { value: "dark", label: "Dark" }]}
          />
        </Row>
      </div>
    </Card>
  );
}
