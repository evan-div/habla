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
  {
    unitNumber: 8,
    questions: [
      gq("Choose the correct form.", "salgo", ["salo", "sale"], { sentence: "Yo ___ de casa los lunes." }),
      gq("Which sentence is correct?", "Nunca como carne", ["Nunca no como carne", "No nunca como carne"], {}),
    ],
  },
  {
    unitNumber: 9,
    questions: [
      gq("Es or son?", "Son", ["Es", "Está"], { sentence: "___ las tres y media." }),
      ask("A friend invites you but you can't come. Which reply is most polite?", "Lo siento, no puedo. ¡Otro día!", ["No quiero", "Tal vez no"]),
    ],
  },
  {
    unitNumber: 10,
    questions: [
      gq("How do you say 35?", "treinta y cinco", ["treinta cinco", "tres y cinco"], {}),
      ask("You like a jacket at the market. How do you ask for a better price?", "¿Cuál es su último precio?", ["¿Dónde está el baño?", "¿Qué hora es?"]),
    ],
  },
  {
    unitNumber: 11,
    questions: [
      gq("Which sentence is correct?", "Llamo a mi jefe", ["Llamo mi jefe", "Llamo de mi jefe"], {}),
      ask("You didn't understand someone. What do you say?", "No entiendo. ¿Puede hablar más despacio?", ["No sé. ¿Quién es?", "Está bien, gracias"]),
    ],
  },
  {
    unitNumber: 12,
    questions: [
      gq("Gusta or gustan?", "gustan", ["gusta", "gusto"], { sentence: "Me ___ los tacos." }),
      ask("A friend can't come to your party. What do you say?", "¡Qué lástima!", ["¡Qué bueno!", "¡Qué rico!"]),
    ],
  },
  {
    unitNumber: 13,
    questions: [
      gq("Choose the correct form.", "comí", ["como", "comió"], { sentence: "Anoche yo ___ tacos." }),
      ask("How do you say “Yesterday I went to the market”?", "Ayer fui al mercado", ["Ayer voy al mercado", "Ayer fue al mercado"]),
    ],
  },
  {
    unitNumber: 14,
    questions: [
      gq("Choose the right verb.", "vivía", ["viví", "vivo"], { sentence: "Cuando era niño, yo ___ en un pueblo." }),
      gq("Choose the right verb.", "comía", ["comí", "comió"], { sentence: "Mientras yo ___, llegó mi hermano." }),
    ],
  },
  {
    unitNumber: 15,
    questions: [
      gq("Por or para?", "para", ["por", "pero"], { sentence: "Quiero una habitación ___ dos personas." }),
      ask("You lost your luggage at the airport. What do you say?", "Perdí mi maleta", ["Visité mi maleta", "Conocí mi maleta"]),
    ],
  },
  {
    unitNumber: 16,
    questions: [
      gq("Choose the right form.", "me levanto", ["levanto", "se levanta"], { sentence: "Yo ___ a las seis." }),
      gq("Choose the right form.", "se acuestan", ["me acuesto", "se acuesta"], { sentence: "Mis padres ___ temprano." }),
    ],
  },
  {
    unitNumber: 17,
    questions: [
      gq("Choose the pronoun.", "La", ["Lo", "Le"], { sentence: "¿La camisa? ___ compro." }),
      gq("Choose the pronouns.", "Te lo", ["Lo te", "Le lo"], { sentence: "___ mando mañana. (I'll send it to you.)" }),
    ],
  },
  {
    unitNumber: 18,
    questions: [
      gq("Choose the command (tú).", "Espera", ["Esperas", "Esperar"], { sentence: "¡___ un momento!" }),
      gq("Choose the formal command.", "Doble", ["Dobla", "Doblo"], { sentence: "(To a stranger) ___ a la izquierda." }),
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
