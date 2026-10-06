"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, type ReactNode } from "react";
import { learnedWords, reviewStats } from "@/lib/state/selectors";
import { useLearner, useLearnerState } from "@/lib/state/hooks";
import { LoadingScreen } from "./LoadingScreen";
import { MobileNav } from "./MobileNav";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const state = useLearnerState();
  const learner = useLearner();

  const dueCount = useMemo(() => (learner ? reviewStats(learnedWords(learner.state, learner.now), learner.now).due : 0), [learner]);

  // First-time visitors go through onboarding before anything else.
  const needsOnboarding = state !== null && state.profile.onboardedAt === null;
  useEffect(() => {
    if (needsOnboarding) router.replace("/onboarding");
  }, [needsOnboarding, router]);

  return (
    <div className="min-h-dvh">
      <a href="#main" className="sr-only z-50 rounded-xl bg-surface px-4 py-2 font-bold focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <Sidebar state={state} dueCount={dueCount} />
      <div className="md:pl-[5.5rem] lg:pl-64">
        <TopBar state={state} now={learner?.now ?? 0} />
        <main id="main" className="pb-24 md:pb-0">
          {state === null || needsOnboarding ? <LoadingScreen /> : children}
        </main>
      </div>
      <MobileNav dueCount={dueCount} />
    </div>
  );
}
