import { entries, present } from "./helpers";

type Forms = [string, string, string, string, string];
const verb = (inf: string, group: "ar" | "er" | "ir", kind: "regular" | "irregular" | "stem-changing", forms: Forms, translation: string, stemChange?: string) => ({
  infinitive: inf,
  translation,
  regularOrIrregular: kind,
  group,
  stemChange,
  conjugations: present(forms),
});

/** The past perfect and "just did" (Unit 25). */
export const PERFECT = entries("perfect", [
  { id: "ya-no", es: "ya no", en: "no longer / not anymore", pos: "expression", d: 2, ex: ["Ya no vivo en Puebla.", "I don't live in Puebla anymore."], pron: "yah noh" },
  { id: "otra-vez", es: "otra vez", en: "again", pos: "expression", ex: ["Lo intento otra vez.", "I'll try it again."], pron: "OH-trah behs", note: "Also de nuevo. Both mean “again”." },
  { id: "para-entonces", es: "para entonces", en: "by then", pos: "expression", d: 3, ex: ["Para entonces, ya habíamos comido.", "By then, we had already eaten."], pron: "PAH-rah ehn-TOHN-sehs" },
  { id: "romper", es: "romper", en: "to break", pos: "verb", d: 2, ex: ["Rompí un plato.", "I broke a plate."], pron: "rohm-PEHR", note: "Irregular participle: roto (he roto, había roto).", verb: verb("romper", "er", "regular", ["rompo", "rompes", "rompe", "rompemos", "rompen"], "to break") },
  { id: "descubrir", es: "descubrir", en: "to discover", pos: "verb", d: 3, ex: ["Descubrí un restaurante muy bueno.", "I discovered a very good restaurant."], pron: "dehs-koo-BREER", note: "Irregular participle: descubierto.", verb: verb("descubrir", "ir", "regular", ["descubro", "descubres", "descubre", "descubrimos", "descubren"], "to discover") },
  { id: "devolver", es: "devolver", en: "to return (an item)", pos: "verb", d: 3, ex: ["Devuelvo el libro mañana.", "I'll return the book tomorrow."], pron: "deh-bohl-BEHR", note: "A boot verb (o → ue) like volver; participle devuelto. For going back, use volver.", rel: ["volver"], verb: verb("devolver", "er", "stem-changing", ["devuelvo", "devuelves", "devuelve", "devolvemos", "devuelven"], "to return (an item)", "o → ue") },
  { id: "acabar", es: "acabar", en: "to finish / to run out", pos: "verb", d: 2, ex: ["Acabo de llegar.", "I just arrived."], pron: "ah-kah-BAR", note: "Acabar de + infinitive = to have just done something: acabo de comer.", verb: verb("acabar", "ar", "regular", ["acabo", "acabas", "acaba", "acabamos", "acaban"], "to finish") },
  { id: "apenas", es: "apenas", en: "barely / just", pos: "adverb", d: 3, ex: ["Apenas llegué.", "I just got here."], pron: "ah-PEH-nahs", note: "In Mexico apenas often means “just” or “only just”: apenas son las tres." },
  { id: "por-primera-vez", es: "por primera vez", en: "for the first time", pos: "expression", d: 2, ex: ["Probé el mole por primera vez.", "I tried mole for the first time."], pron: "por pree-MEH-rah behs" },
]);
