"use client";

import { LevelBadge } from "@/components/gamification/LevelBadge";
import { PageContainer, PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { levelInfo } from "@/lib/gamification/levels";
import { useLearner } from "@/lib/state/hooks";
import { DataCard } from "./DataCard";
import { DeveloperTools } from "./DeveloperTools";
import { PlacementCard } from "./PlacementCard";
import { PreferencesCard } from "./PreferencesCard";
import { ProfileCard } from "./ProfileCard";

export function ProfileSettings() {
  const learner = useLearner();
  if (!learner) {
    return (
      <PageContainer className="max-w-3xl">
        <Skeleton className="mb-6 h-12 w-64" />
        <Skeleton className="h-72" />
      </PageContainer>
    );
  }
  const { state, now } = learner;
  const level = levelInfo(state.totalXp);

  return (
    <PageContainer className="max-w-3xl">
      <PageHeader title="Profile & settings" />
      <div className="space-y-5">
        <Card tone="violet" padding="md" className="flex items-center gap-4">
          <LevelBadge level={level.level} size={60} />
          <div className="min-w-0">
            <p className="truncate font-display text-2xl font-extrabold">{state.profile.displayName || "Learner"}</p>
            <p className="text-muted">Level {level.level} · {level.title} · {state.totalXp.toLocaleString()} XP</p>
          </div>
          <Badge tone="neutral" className="ml-auto hidden sm:inline-flex">Mexican Spanish</Badge>
        </Card>
        <ProfileCard key={state.profile.displayName} profile={state.profile} />
        <PlacementCard placement={state.placement} />
        <PreferencesCard settings={state.settings} />
        <DataCard state={state} />
        <DeveloperTools state={state} now={now} />
      </div>
    </PageContainer>
  );
}
