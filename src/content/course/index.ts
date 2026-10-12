import type { Course, Exercise, Lesson, Section, Unit } from "../types";
import { unit01 } from "./units/unit-01-hello";
import { unit02 } from "./units/unit-02-introductions";
import { unit03 } from "./units/unit-03-verbs";
import { unit04 } from "./units/unit-04-people";
import { unit05 } from "./units/unit-05-food";
import { unit06 } from "./units/unit-06-questions";
import { unit07 } from "./units/unit-07-places";
import { unit08 } from "./units/unit-08-verbs";
import { unit09 } from "./units/unit-09-plans";
import { unit10 } from "./units/unit-10-shopping";
import { unit11 } from "./units/unit-11-work";
import { unit12 } from "./units/unit-12-social";
import { unit13 } from "./units/unit-13-preterite";
import { unit14 } from "./units/unit-14-imperfect";
import { unit15 } from "./units/unit-15-travel";
import { unit16 } from "./units/unit-16-routine";
import { unit17 } from "./units/unit-17-pronouns";
import { unit18 } from "./units/unit-18-commands";
import { unit19 } from "./units/unit-19-future";
import { unit20 } from "./units/unit-20-compare";
import { unit21 } from "./units/unit-21-conditional";
import { unit22 } from "./units/unit-22-progress";
import { unit23 } from "./units/unit-23-subjunctive";
import { unit24 } from "./units/unit-24-connect";
import { unit25 } from "./units/unit-25-perfect";
import { unit26 } from "./units/unit-26-hypothetical";
import { unit27 } from "./units/unit-27-se";
import { unit28 } from "./units/unit-28-perfects";
import { unit29 } from "./units/unit-29-unreal";
import { unit30 } from "./units/unit-30-reported";

const section1: Section = {
  id: "section-1-foundations",
  number: 1,
  title: "Foundations",
  description: "Greetings, introductions and the verbs that hold Spanish together.",
  units: [unit01, unit02, unit03, unit04],
};

const section2: Section = {
  id: "section-2-sentences",
  number: 2,
  title: "Building Sentences",
  description: "Food, questions and everything you need to say what you mean.",
  units: [
    unit05,
    unit06,
    unit07,
    unit08,
  ],
};

const section3: Section = {
  id: "section-3-everyday",
  number: 3,
  title: "Everyday Spanish",
  description: "Make plans, shop, work and hang out like a local.",
  units: [
    unit09,
    unit10,
    unit11,
    unit12,
  ],
};

const section4: Section = {
  id: "section-4-stories",
  number: 4,
  title: "Telling Stories",
  description: "Talk about the past: what happened, how things used to be, and trips you've taken.",
  units: [unit13, unit14, unit15],
};

const section5: Section = {
  id: "section-5-conversation",
  number: 5,
  title: "Real Conversations",
  description: "Daily routines, object pronouns and commands: the grammar that makes you sound like a speaker.",
  units: [unit16, unit17, unit18],
};

const section6: Section = {
  id: "section-6-further",
  number: 6,
  title: "Beyond the Present",
  description: "Future plans, comparisons and polite hypotheticals: what's next, what's better, and what you would do.",
  units: [unit19, unit20, unit21],
};

const section7: Section = {
  id: "section-7-nuance",
  number: 7,
  title: "Speaking With Nuance",
  description: "What's happening, what you've done, what you hope — and the glue words that connect your ideas.",
  units: [unit22, unit23, unit24],
};

const section8: Section = {
  id: "section-8-finetune",
  number: 8,
  title: "Fine-Tuning",
  description: "Order of events, hypotheticals and the se constructions that make Spanish sound natural.",
  units: [unit25, unit26, unit27],
};

const section9: Section = {
  id: "section-9-mastery",
  number: 9,
  title: "Mastery",
  description: "Regrets, unreal pasts and reporting what others said: the last steps to following any conversation.",
  units: [unit28, unit29, unit30],
};

export const COURSE: Course = {
  id: "spanish-foundations",
  title: "Spanish Foundations",
  tagline: "Mexican Spanish for English speakers",
  language: "es",
  dialect: "es-MX",
  sections: [section1, section2, section3, section4, section5, section6, section7, section8, section9],
};

/* ------------------------------------------------------------------ */
/* Derived lookups                                                     */
/* ------------------------------------------------------------------ */

export const ALL_UNITS: readonly Unit[] = COURSE.sections.flatMap((s) => s.units);
/** Every playable lesson, in course order. */
export const ALL_LESSONS: readonly Lesson[] = ALL_UNITS.flatMap((u) => u.lessons);

const LESSON_BY_ID = new Map(ALL_LESSONS.map((l) => [l.id, l]));
const UNIT_BY_ID = new Map(ALL_UNITS.map((u) => [u.id, u]));
const LESSON_INDEX = new Map(ALL_LESSONS.map((l, i) => [l.id, i]));

export const getLesson = (id: string): Lesson | undefined => LESSON_BY_ID.get(id);
export const getUnit = (id: string): Unit | undefined => UNIT_BY_ID.get(id);
export const lessonIndex = (id: string): number => LESSON_INDEX.get(id) ?? -1;

export function unitOfLesson(lessonId: string): Unit | undefined {
  const lesson = getLesson(lessonId);
  return lesson ? getUnit(lesson.unitId) : undefined;
}

export function sectionOfUnit(unitId: string): Section | undefined {
  return COURSE.sections.find((s) => s.units.some((u) => u.id === unitId));
}

/** Vocabulary a lesson introduces to the learner (intro cards + "how people say it" cards). */
export function introducedWordIds(exercises: readonly Exercise[]): string[] {
  const ids: string[] = [];
  for (const ex of exercises) {
    if (ex.type === "vocabularyIntroduction") ids.push(...ex.wordIds);
    else if (ex.type === "naturalSpeech") ids.push(...(ex.vocabIds ?? []));
  }
  return [...new Set(ids)];
}

export function grammarTaught(lesson: Lesson): string[] {
  return lesson.exercises.flatMap((e) => (e.type === "grammarNote" ? [e.grammarId] : []));
}

/** First lesson (in course order) that introduces each word. */
export const INTRODUCED_IN: ReadonlyMap<string, string> = (() => {
  const map = new Map<string, string>();
  for (const lesson of ALL_LESSONS) {
    for (const id of introducedWordIds(lesson.exercises)) if (!map.has(id)) map.set(id, lesson.id);
  }
  return map;
})();

export function unitLessonIds(unitId: string): string[] {
  return getUnit(unitId)?.lessons.map((l) => l.id) ?? [];
}
