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

/** Reported speech and gossip (Unit 30). */
export const REPORTED = entries("reported", [
  { id: "contar", es: "contar", en: "to tell / to count", pos: "verb", d: 2, ex: ["Me contó una historia.", "He told me a story."], pron: "kohn-TAR", note: "A boot verb (o → ue): cuento. Contar means both “to tell (a story)” and “to count”.", verb: verb("contar", "ar", "stem-changing", ["cuento", "cuentas", "cuenta", "contamos", "cuentan"], "to tell / count", "o → ue") },
  { id: "responder", es: "responder", en: "to answer / to reply", pos: "verb", ex: ["Respondió que sí.", "She answered yes."], pron: "rehs-pohn-DEHR", verb: verb("responder", "er", "regular", ["respondo", "respondes", "responde", "respondemos", "responden"], "to answer") },
  { id: "avisar", es: "avisar", en: "to let (someone) know / to warn", pos: "verb", d: 2, ex: ["Avísame cuando llegues.", "Let me know when you arrive."], pron: "ah-bee-SAR", verb: verb("avisar", "ar", "regular", ["aviso", "avisas", "avisa", "avisamos", "avisan"], "to let know") },
  { id: "asegurar", es: "asegurar", en: "to assure / to promise", pos: "verb", d: 3, ex: ["Me aseguró que vendría.", "He assured me he would come."], pron: "ah-seh-goo-RAR", verb: verb("asegurar", "ar", "regular", ["aseguro", "aseguras", "asegura", "aseguramos", "aseguran"], "to assure") },
  { id: "segun", es: "según", en: "according to", pos: "preposition", d: 2, ex: ["Según Ana, viene mañana.", "According to Ana, he's coming tomorrow."], pron: "seh-GOON", note: "Según yo / según tú use subject pronouns, not mí / ti." },
  { id: "chisme", es: "chisme", en: "gossip", pos: "noun", g: "m", pl: "chismes", reg: "informal", regions: ["mx"], d: 2, ex: ["Me contaron un chisme.", "They told me a piece of gossip."], pron: "CHEES-meh", note: "A chismoso / chismosa is a gossip. ¿Cuál es el chisme? = What's the gossip?" },
  { id: "dizque", es: "dizque", en: "supposedly", pos: "adverb", reg: "informal", regions: ["mx"], d: 3, ex: ["Dizque va a venir.", "Supposedly he's going to come."], pron: "DEES-keh", note: "From dice que. Used all over Mexico for second-hand claims you doubt a little." },
  { id: "resulta-que", es: "resulta que", en: "it turns out that", pos: "expression", d: 3, ex: ["Resulta que ya se fue.", "It turns out he already left."], pron: "reh-SOOL-tah keh", note: "The classic opener for a story with a twist: Pues resulta que…" },
]);
