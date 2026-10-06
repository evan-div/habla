"use client";

import { GraduationCap } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Skeleton } from "@/components/ui/Skeleton";
import { ALL_LESSONS, COURSE } from "@/content/course";
import { useLearner } from "@/lib/state/hooks";
import { lessonsCompletedCount, nextLesson } from "@/lib/state/selectors";
import { UnitCard } from "./UnitCard";

export function CourseMap() {
  const learner = useLearner();
  if (!learner) {
    return (
      <PageContainer>
        <Skeleton className="mb-6 h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </PageContainer>
    );
  }
  const { state } = learner;
  const up = nextLesson(state);
  const done = lessonsCompletedCount(state);

  return (
    <PageContainer className="max-w-4xl">
      <PageHeader
        eyebrow={COURSE.tagline}
        title={COURSE.title}
        subtitle="A structured path from your first “hola” to real conversations. Lessons unlock in order, and everything you learn comes back in review."
        actions={
          <ButtonLink href="/grammar" variant="secondary" leadingIcon={<GraduationCap size={18} aria-hidden="true" />}>Grammar reference</ButtonLink>
        }
      />

      <Card padding="md" className="mb-8 flex flex-wrap items-center gap-x-8 gap-y-3">
        <div className="min-w-48 flex-1">
          <p className="text-sm font-bold text-muted">Course progress</p>
          <ProgressBar value={done} max={ALL_LESSONS.length} label="Course progress" size="lg" className="mt-1.5" />
        </div>
        <p className="font-display text-3xl font-extrabold">
          {done}<span className="text-xl text-muted"> / {ALL_LESSONS.length} lessons</span>
        </p>
        {up && <ButtonLink href={`/learn/${up.lesson.id}`}>{done === 0 ? "Start Unit 1" : "Continue"}</ButtonLink>}
      </Card>

      <div className="space-y-10">
        {COURSE.sections.map((section) => (
          <section key={section.id} aria-labelledby={`${section.id}-title`}>
            <div className="mb-4">
              <p className="text-xs font-extrabold uppercase tracking-widest text-on-teal">Section {section.number}</p>
              <h2 id={`${section.id}-title`} className="text-2xl font-extrabold">{section.title}</h2>
              <p className="text-muted">{section.description}</p>
            </div>
            <div className="space-y-4">
              {section.units.map((unit) => (
                <UnitCard
                  key={unit.id}
                  unit={unit}
                  state={state}
                  nextLessonId={up?.lesson.id ?? null}
                  defaultOpen={up?.unit.id === unit.id}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageContainer>
  );
}
