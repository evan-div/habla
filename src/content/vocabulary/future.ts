import { entries, present } from "./helpers";

type Forms = [string, string, string, string, string];
const verb = (inf: string, group: "ar" | "er" | "ir", forms: Forms, translation: string) => ({
  infinitive: inf,
  translation,
  regularOrIrregular: "regular" as const,
  group,
  conjugations: present(forms),
});

/** The future tense and "if" sentences (Unit 19). */
export const FUTURE = entries("future", [
  { id: "pronto", es: "pronto", en: "soon", pos: "adverb", ex: ["Nos vemos pronto.", "See you soon."], pron: "PROHN-toh", note: "Pronto can also mean “quickly”: ¡Ven pronto!" },
  { id: "proximo", es: "próximo", en: "next", pos: "adjective", fem: "próxima", d: 2, ex: ["La próxima semana viajo a Puebla.", "Next week I'm traveling to Puebla."], pron: "PROHK-see-moh", note: "La próxima semana, el próximo mes, el próximo año. You'll also hear el año que viene (“the year that's coming”)." },
  { id: "algun-dia", es: "algún día", en: "someday", pos: "expression", d: 2, ex: ["Algún día viviré en México.", "Someday I'll live in Mexico."], pron: "ahl-GOON DEE-ah" },
  { id: "dentro-de", es: "dentro de", en: "in / within (a time)", pos: "preposition", d: 2, ex: ["Llego dentro de una hora.", "I'll arrive in an hour."], pron: "DEHN-troh deh", note: "Dentro de dos días = in two days' time. Don't confuse it with hace (“ago”)." , rel: ["hace"] },
  { id: "seguro", es: "seguro", en: "sure / certain / safe", pos: "adjective", fem: "segura", ex: ["Estoy seguro de que vendrá.", "I'm sure she'll come."], pron: "seh-GOO-roh", note: "Estoy seguro de que… = I'm sure that… Also “safe”: un lugar seguro." },
  { id: "prometer", es: "prometer", en: "to promise", pos: "verb", ex: ["Te lo prometo.", "I promise you."], pron: "proh-meh-TEHR", verb: verb("prometer", "er", ["prometo", "prometes", "promete", "prometemos", "prometen"], "to promise") },
  { id: "planear", es: "planear", en: "to plan", pos: "verb", ex: ["Planeo viajar el próximo año.", "I plan to travel next year."], pron: "plah-neh-AR", note: "In everyday speech pensar + infinitive (“pienso viajar”) is just as common.", verb: verb("planear", "ar", ["planeo", "planeas", "planea", "planeamos", "planean"], "to plan") },
  { id: "mudarse", es: "mudarse", en: "to move (house)", pos: "verb", d: 2, ex: ["Me mudo a otra ciudad.", "I'm moving to another city."], pron: "moo-DAR-seh", verb: verb("mudarse", "ar", ["me mudo", "te mudas", "se muda", "nos mudamos", "se mudan"], "to move (house)") },
  { id: "casarse", es: "casarse", en: "to get married", pos: "verb", d: 2, ex: ["Mi hermana se casa en junio.", "My sister is getting married in June."], pron: "kah-SAR-seh", note: "Casarse con = to marry: Se casa con Luis.", verb: verb("casarse", "ar", ["me caso", "te casas", "se casa", "nos casamos", "se casan"], "to get married") },
  { id: "graduarse", es: "graduarse", en: "to graduate", pos: "verb", d: 3, ex: ["Me gradúo el año que viene.", "I graduate next year."], pron: "grah-DWAR-seh", note: "Watch the accent: me gradúo, te gradúas, se gradúa — but nos graduamos.", verb: verb("graduarse", "ar", ["me gradúo", "te gradúas", "se gradúa", "nos graduamos", "se gradúan"], "to graduate") },
  { id: "ganar", es: "ganar", en: "to earn / to win", pos: "verb", ex: ["Mi hermano gana mucho.", "My brother earns a lot."], pron: "gah-NAR", note: "Ganar covers both “to win” (ganar un partido) and “to earn” (ganar dinero).", verb: verb("ganar", "ar", ["gano", "ganas", "gana", "ganamos", "ganan"], "to earn / win") },
  { id: "futuro", es: "futuro", en: "future", pos: "noun", g: "m", ex: ["El futuro es muy importante.", "The future is very important."], pron: "foo-TOO-roh", note: "En el futuro = in the future." },
  { id: "si-if", es: "si", en: "if", pos: "conjunction", ex: ["Si llueve, me quedo en casa.", "If it rains, I stay home."], pron: "see", note: "No accent! Sí (with an accent) means “yes”." },
  { id: "llueve", es: "llueve", en: "it rains / it's raining", pos: "expression", d: 2, ex: ["Hoy llueve mucho.", "It's raining a lot today."], pron: "YWEH-beh", note: "From llover (o → ue), used only in the “it” form. You'll also hear está lloviendo." },
]);
