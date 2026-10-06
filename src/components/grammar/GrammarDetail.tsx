"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { GrammarConcept } from "@/content/types";
import { useLearnerState } from "@/lib/state/hooks";
import { grammarMastery } from "@/lib/state/selectors";
import { GrammarLesson } from "./GrammarLesson";

export function GrammarDetail({ concept }: { concept: GrammarConcept }) {
  const state = useLearnerState();
  const progress = state?.grammar[concept.id];
  const mastery = grammarMastery(progress);

  return (
    <PageContainer className="max-w-3xl">
      <Link href="/grammar" className="mb-4 inline-flex items-center gap-1.5 font-bold text-muted hover:text-ink">
        <ArrowLeft size={18} aria-hidden="true" /> All grammar topics
      </Link>
      <header className="mb-6">
        <p className="text-xs font-extrabold uppercase tracking-widest text-on-violet">Grammar</p>
        <h1 className="mt-1 text-4xl font-extrabold">{concept.title}</h1>
        <p className="mt-1 text-xl text-muted">{concept.tagline}</p>
        {state && (
          <div className="mt-4 flex items-center gap-3">
            {progress ? (
              <>
                <ProgressBar value={mastery} tone={mastery >= 80 ? "leaf" : "brand"} label="Your mastery of this topic" className="max-w-56" />
                <span className="text-sm font-bold text-muted">{progress.attempts === 0 ? "Learned in a lesson" : `${mastery}% mastery`}</span>
              </>
            ) : (
              <Badge tone="neutral">You haven&apos;t met this in a lesson yet</Badge>
            )}
          </div>
        )}
      </header>
      <GrammarLesson concept={concept} />
    </PageContainer>
  );
}
