import { entries, present } from "./helpers";

type Forms = [string, string, string, string, string];
const reg = (inf: string, group: "ar" | "er" | "ir", forms: Forms, translation: string) => ({
  infinitive: inf,
  translation,
  regularOrIrregular: "regular" as const,
  group,
  conjugations: present(forms),
});

/** Hypotheticals, dreams and wishes (Unit 26). */
export const HYPOTHETICAL = entries("hypothetical", [
  { id: "imaginar", es: "imaginar", en: "to imagine", pos: "verb", ex: ["Imagino que tienes razón.", "I imagine you're right."], pron: "ee-mah-hee-NAR", verb: reg("imaginar", "ar", ["imagino", "imaginas", "imagina", "imaginamos", "imaginan"], "to imagine") },
  { id: "sueno", es: "sueño", en: "dream", pos: "noun", g: "m", pl: "sueños", d: 2, ex: ["Mi sueño es viajar por el mundo.", "My dream is to travel the world."], pron: "SWEH-nyoh", note: "The same word means “sleep / sleepiness” (tengo sueño)." },
  { id: "loteria", es: "lotería", en: "lottery", pos: "noun", g: "f", d: 2, ex: ["Si ganara la lotería, viajaría.", "If I won the lottery, I'd travel."], pron: "loh-teh-REE-ah", note: "La Lotería is also Mexico's beloved picture-card game, a bit like bingo." },
  { id: "millonario", es: "millonario", en: "millionaire", pos: "noun", g: "m", fem: "millonaria", d: 3, ex: ["Si fuera millonario, compraría una casa.", "If I were a millionaire, I'd buy a house."], pron: "mee-yoh-NAH-ryoh" },
  { id: "mundo", es: "mundo", en: "world", pos: "noun", g: "m", pl: "mundos", ex: ["Quiero viajar por todo el mundo.", "I want to travel all over the world."], pron: "MOON-doh", note: "Todo el mundo = everybody." },
  { id: "desear", es: "desear", en: "to wish / to want", pos: "verb", d: 2, ex: ["Deseo que seas feliz.", "I wish that you be happy."], pron: "deh-seh-AR", note: "Formal and warm: te deseo lo mejor (I wish you the best).", verb: reg("desear", "ar", ["deseo", "deseas", "desea", "deseamos", "desean"], "to wish") },
  { id: "como-si", es: "como si", en: "as if", pos: "conjunction", d: 3, ex: ["Habla como si fuera mexicano.", "He talks as if he were Mexican."], pron: "KOH-moh see", note: "Always followed by the imperfect subjunctive." },
]);
