import { entries, present } from "./helpers";

type Forms = [string, string, string, string, string];
const verb = (inf: string, group: "ar" | "er" | "ir", kind: "regular" | "stem-changing", forms: Forms, translation: string, stemChange?: string) => ({
  infinitive: inf,
  translation,
  regularOrIrregular: kind,
  group,
  stemChange,
  conjugations: present(forms),
});

/** What's happening and what has happened (Unit 22). */
export const PROGRESS = entries("progress", [
  { id: "ahora-mismo", es: "ahora mismo", en: "right now", pos: "expression", ex: ["Ahora mismo estoy estudiando.", "Right now I'm studying."], pron: "ah-OH-rah MEES-moh" },
  { id: "en-este-momento", es: "en este momento", en: "at the moment", pos: "expression", d: 2, ex: ["En este momento estoy ocupado.", "At the moment I'm busy."], pron: "ehn EHS-teh moh-MEHN-toh" },
  { id: "todavia", es: "todavía", en: "still / yet", pos: "adverb", d: 2, ex: ["Todavía estoy en casa.", "I'm still at home."], pron: "toh-dah-BEE-ah", note: "Todavía no = not yet: Todavía no he comido." },
  { id: "alguna-vez", es: "alguna vez", en: "ever", pos: "expression", d: 2, ex: ["¿Has viajado a México alguna vez?", "Have you ever traveled to Mexico?"], pron: "ahl-GOO-nah behs" },
  { id: "esta-semana", es: "esta semana", en: "this week", pos: "expression", ex: ["Esta semana he trabajado mucho.", "This week I've worked a lot."], pron: "EHS-tah seh-MAH-nah" },
  { id: "probar", es: "probar", en: "to try / to taste", pos: "verb", d: 2, ex: ["Quiero probar el mole.", "I want to try the mole."], pron: "proh-BAR", note: "A boot verb (o → ue): pruebo, pruebas… Also “to try on” clothes.", verb: verb("probar", "ar", "stem-changing", ["pruebo", "pruebas", "prueba", "probamos", "prueban"], "to try / taste", "o → ue") },
  { id: "olvidar", es: "olvidar", en: "to forget", pos: "verb", ex: ["Olvidé mi llave.", "I forgot my key."], pron: "ohl-bee-DAR", note: "In Mexico you'll often hear “se me olvidó” (“it slipped my mind”).", verb: verb("olvidar", "ar", "regular", ["olvido", "olvidas", "olvida", "olvidamos", "olvidan"], "to forget") },
  { id: "encontrar", es: "encontrar", en: "to find", pos: "verb", d: 2, ex: ["No encuentro mi llave.", "I can't find my key."], pron: "ehn-kohn-TRAR", note: "A boot verb (o → ue): encuentro, encuentras…", verb: verb("encontrar", "ar", "stem-changing", ["encuentro", "encuentras", "encuentra", "encontramos", "encuentran"], "to find", "o → ue") },
]);
