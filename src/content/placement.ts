import type { Exercise } from "./types";
import { ask, gq, lesson, meaning, type ExerciseDraft } from "./course/builders";

/**
 * The placement check: two questions per unit, easiest first. A learner "passes" a
 * level by answering both correctly; they start at the first level they don't pass.
 * Questions deliberately avoid typing and listening so the check works anywhere.
 */
const LEVELS: Array<{ unitNumber: number; questions: ExerciseDraft[] }> = [
  {
    unitNumber: 1,
    questions: [
      ask("It's 8 a.m. and you walk into a shop in Mexico. What do you say?", "Buenos días", ["Buenas noches", "Hasta mañana"]),
      meaning("de nada", "You're welcome", ["Please", "Excuse me", "Goodbye"]),
    ],
  },
  {
    unitNumber: 2,
    questions: [
      gq("Maria is a woman. How does she say “I'm Mexican”?", "Soy mexicana", ["Soy mexicano", "Soy mexicanas"], {}),
      ask("How do you say “I'm 30 years old”?", "Tengo treinta años", ["Soy treinta años", "Estoy treinta años"]),
    ],
  },
  {
    unitNumber: 3,
    questions: [
      gq("Choose the right verb.", "estoy", ["soy", "tengo"], { sentence: "Yo ___ cansado." }),
      gq("Choose the correct form.", "quieres", ["quiero", "queremos"], { sentence: "Tú ___ ir a casa." }),
    ],
  },
  {
    unitNumber: 4,
    questions: [
      gq("Choose the article.", "las", ["los", "la"], { sentence: "___ mujeres" }),
      gq("Choose the right ending.", "grandes", ["grande", "grandas"], { sentence: "Mis hermanos son ___." }),
    ],
  },
  {
    unitNumber: 5,
    questions: [
      gq("How do you say “I'm hungry”?", "Tengo hambre", ["Estoy hambre", "Soy hambre"], {}),
      ask("Which sounds the most polite when ordering?", "Quisiera un café, por favor", ["Quiero un café", "Un café"]),
    ],
  },
  {
    unitNumber: 6,
    questions: [
      gq("Choose the right word.", "porque", ["por qué", "qué"], { sentence: "Estoy cansado ___ tengo sueño." }),
      gq("Choose the article.", "el", ["la", "los"], { sentence: "___ lunes voy al trabajo." }),
    ],
  },
  {
    unitNumber: 7,
    questions: [
      gq("Hay or está?", "está", ["hay", "son"], { sentence: "El mercado ___ cerca." }),
      gq("Choose the correct form.", "al", ["a el", "a la"], { sentence: "Voy ___ mercado." }),
    ],
  },
];

export interface PlacementLevel {
  unitNumber: number;
  exercises: Exercise[];
}

export const PLACEMENT: readonly PlacementLevel[] = LEVELS.map((level) => ({
  unitNumber: level.unitNumber,
  exercises: lesson(
    { id: `placement-${level.unitNumber}`, unitId: `placement-${level.unitNumber}`, title: "Placement", subtitle: "" },
    level.questions,
  ).exercises,
}));
