"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { PageContainer, PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Card, SectionHeading } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { availableGrammar, plannedGrammar } from "@/content/grammar";
import { useLearnerState } from "@/lib/state/hooks";
import { grammarMastery } from "@/lib/state/selectors";

export function GrammarIndex() {
  const state = useLearnerState();
  const available = availableGrammar();
  const planned = plannedGrammar();

  return (
    <PageContainer className="max-w-4xl">
      <PageHeader title="Grammar" subtitle="Short, clear explanations of how Spanish actually works. Each topic is taught inside a lesson — and lives here for whenever you want a refresher." />

      <section aria-labelledby="available">
        <SectionHeading id="available" title="Topics you can study" />
        <ul className="grid gap-3 sm:grid-cols-2">
          {available.map((g) => {
            const p = state?.grammar[g.id];
            const mastery = grammarMastery(p);
            return (
              <li key={g.id}>
                <Link href={`/grammar/${g.id}`} className="group flex h-full flex-col gap-2 rounded-3xl border-2 border-line bg-surface p-5 shadow-card transition-transform hover:-translate-y-0.5">
                  <span className="flex items-start justify-between gap-2">
                    <span className="font-display text-xl font-extrabold leading-tight">{g.title}</span>
                    <ChevronRight size={20} className="mt-0.5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                  <span className="text-[15px] text-muted">{g.tagline}</span>
                  <span className="mt-auto pt-2">
                    {p ? (
                      <span className="flex items-center gap-3">
                        <ProgressBar value={mastery} size="sm" tone={mastery >= 80 ? "leaf" : "brand"} label={`${g.title} mastery`} />
                        <span className="shrink-0 text-xs font-bold text-muted">{p.attempts === 0 ? "Learned" : `${mastery}%`}</span>
                      </span>
                    ) : (
                      <Badge tone="neutral">Not met yet</Badge>
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="planned">
        <SectionHeading id="planned" title="On the roadmap" />
        <Card padding="sm" tone="default" className="border-dashed">
          <ul className="grid gap-x-6 sm:grid-cols-2">
            {planned.map((g) => (
              <li key={g.id} className="flex items-center justify-between gap-3 border-b border-line py-3 last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0">
                <span className="min-w-0">
                  <span className="block font-bold text-muted">{g.title}</span>
                  <span className="block truncate text-sm text-faint">{g.tagline}</span>
                </span>
                <Badge tone="neutral">Coming soon</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </PageContainer>
  );
}
