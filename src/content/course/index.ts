import type { Course, Exercise, Lesson, Section, Unit } from "../types";
import { unit01 } from "./units/unit-01-hello";
import { unit02 } from "./units/unit-02-introductions";
import { unit03 } from "./units/unit-03-verbs";
import { unit04 } from "./units/unit-04-people";
import { unit05 } from "./units/unit-05-food";
import { unit06 } from "./units/unit-06-questions";
import { unit07 } from "./units/unit-07-places";

function comingSoon(id: string, sectionId: string, number: number, title: string, description: string, icon: string, preview: string[], accent: Unit["accent"]): Unit {
  return { id, sectionId, number, title, description, icon, accent, lessons: [], comingSoon: true, preview };
}

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
    comingSoon("unit-08-verbs", "section-2-sentences", 8, "Present-Tense Verbs", "Go deeper: dozens of regular and irregular verbs.", "zap", ["-ar / -er / -ir in depth", "Daily routines", "Irregular yo forms"], "sol"),
  ],
};

const section3: Section = {
  id: "section-3-everyday",
  number: 3,
  title: "Everyday Spanish",
  description: "Make plans, shop, work and hang out like a local.",
  units: [
    comingSoon("unit-09-plans", "section-3-everyday", 9, "Making Plans", "Invite friends and arrange to meet.", "calendar", ["Days & times", "Ir a + infinitive", "Accepting & declining"], "rosa"),
    comingSoon("unit-10-shopping", "section-3-everyday", 10, "Shopping", "Prices, sizes and bargaining at the mercado.", "shopping-bag", ["Numbers to 1,000", "Clothes & colors", "¿Cuánto cuesta?"], "leaf"),
    comingSoon("unit-11-work", "section-3-everyday", 11, "Work & School", "Talk about your day, job and studies.", "briefcase", ["Occupations", "Schedules", "Telling time"], "teal"),
    comingSoon("unit-12-social", "section-3-everyday", 12, "Friends & Social Life", "Parties, music and casual conversation.", "party-popper", ["Slang & humor", "Invitations", "Likes & dislikes"], "rosa"),
  ],
};

export const COURSE: Course = {
  id: "spanish-foundations",
  title: "Spanish Foundations",
  tagline: "Mexican Spanish for English speakers",
  language: "es",
  dialect: "es-MX",
  sections: [section1, section2, section3],
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
