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

/** Regrets, missed chances and guessing (Units 28–29). */
export const REGRETS = entries("regrets", [
  { id: "oportunidad", es: "oportunidad", en: "opportunity / chance", pos: "noun", g: "f", pl: "oportunidades", d: 2, ex: ["Perdí una buena oportunidad.", "I lost a good opportunity."], pron: "oh-pohr-too-nee-DAHD" },
  { id: "error", es: "error", en: "mistake", pos: "noun", g: "m", pl: "errores", d: 2, ex: ["Fue un error.", "It was a mistake."], pron: "eh-RROR", note: "Cometer un error = to make a mistake." },
  { id: "suerte", es: "suerte", en: "luck", pos: "noun", g: "f", ex: ["¡Buena suerte!", "Good luck!"], pron: "SWEHR-teh", note: "Tener suerte = to be lucky; ¡qué suerte! = how lucky!" },
  { id: "arrepentirse", es: "arrepentirse", en: "to regret", pos: "verb", d: 3, ex: ["Me arrepiento de no haber ido.", "I regret not having gone."], pron: "ah-rreh-pehn-TEER-seh", note: "A boot verb (e → ie). Arrepentirse de + infinitive.", verb: verb("arrepentirse", "ir", "stem-changing", ["me arrepiento", "te arrepientes", "se arrepiente", "nos arrepentimos", "se arrepienten"], "to regret", "e → ie") },
  { id: "lamentar", es: "lamentar", en: "to regret / to be sorry about", pos: "verb", d: 2, ex: ["Lamento no haber venido.", "I'm sorry I didn't come."], pron: "lah-mehn-TAR", note: "Lamento que + subjunctive: Lamento que no puedas venir.", verb: verb("lamentar", "ar", "regular", ["lamento", "lamentas", "lamenta", "lamentamos", "lamentan"], "to regret") },
  { id: "aprovechar", es: "aprovechar", en: "to take advantage of / to make the most of", pos: "verb", d: 3, ex: ["Hay que aprovechar la oportunidad.", "You have to take advantage of the opportunity."], pron: "ah-proh-beh-CHAR", note: "¡Que aproveche! is also what you say to someone eating (like buen provecho).", verb: verb("aprovechar", "ar", "regular", ["aprovecho", "aprovechas", "aprovecha", "aprovechamos", "aprovechan"], "to take advantage of") },
  { id: "seguramente", es: "seguramente", en: "surely / probably", pos: "adverb", d: 3, ex: ["Seguramente ya llegó.", "He has surely arrived by now."], pron: "seh-goo-rah-MEHN-teh" },
  { id: "probablemente", es: "probablemente", en: "probably", pos: "adverb", d: 3, ex: ["Probablemente llueva mañana.", "It will probably rain tomorrow."], pron: "proh-bah-bleh-MEHN-teh" },
  { id: "a-estas-horas", es: "a estas horas", en: "by now / at this hour", pos: "expression", d: 3, ex: ["A estas horas ya habrán llegado.", "By now they will have arrived."], pron: "ah EHS-tahs OH-rahs" },
  { id: "por-poco", es: "por poco", en: "almost / nearly", pos: "expression", d: 2, ex: ["Por poco pierdo el vuelo.", "I almost missed the flight."], pron: "por POH-koh", note: "Por poco + present = “almost did something”: por poco me caigo." },
  { id: "casi", es: "casi", en: "almost", pos: "adverb", ex: ["Casi llego tarde.", "I almost arrived late."], pron: "KAH-see" },

  /* ---- Unit 29 ---- */
  { id: "culpa", es: "culpa", en: "fault / blame", pos: "noun", g: "f", d: 2, ex: ["No fue mi culpa.", "It wasn't my fault."], pron: "KOOL-pah", note: "Tener la culpa = to be to blame." },
  { id: "culpar", es: "culpar", en: "to blame", pos: "verb", d: 2, ex: ["No me culpes.", "Don't blame me."], pron: "kool-PAR", verb: verb("culpar", "ar", "regular", ["culpo", "culpas", "culpa", "culpamos", "culpan"], "to blame") },
  { id: "perdonar", es: "perdonar", en: "to forgive", pos: "verb", ex: ["Perdóname, por favor.", "Forgive me, please."], pron: "pehr-doh-NAR", verb: verb("perdonar", "ar", "regular", ["perdono", "perdonas", "perdona", "perdonamos", "perdonan"], "to forgive") },
  { id: "disculparse", es: "disculparse", en: "to apologize", pos: "verb", d: 2, ex: ["Me disculpo por llegar tarde.", "I apologize for arriving late."], pron: "dees-kool-PAR-seh", verb: verb("disculparse", "ar", "regular", ["me disculpo", "te disculpas", "se disculpa", "nos disculpamos", "se disculpan"], "to apologize") },
  { id: "pena", es: "pena", en: "pity / sorrow / embarrassment", pos: "noun", g: "f", d: 2, ex: ["¡Qué pena!", "What a shame!"], pron: "PEH-nah", note: "In Mexico pena also means “embarrassment”: me da pena (I'm embarrassed / shy)." },
  { id: "sin-querer", es: "sin querer", en: "unintentionally / by accident", pos: "expression", d: 2, ex: ["Lo rompí sin querer.", "I broke it by accident."], pron: "seen keh-REHR", note: "Literally “without wanting”. Also fue sin querer = it was an accident." },
  { id: "ni-siquiera", es: "ni siquiera", en: "not even", pos: "expression", d: 3, ex: ["Ni siquiera llamó.", "He didn't even call."], pron: "nee see-KYEH-rah" },
  { id: "razon", es: "razón", en: "reason", pos: "noun", g: "f", d: 2, ex: ["Tienes razón.", "You're right."], pron: "rah-SOHN", note: "Tener razón = to be right (literally “to have reason”): tienes razón, no tengo razón." },
  { id: "por-si-acaso", es: "por si acaso", en: "just in case", pos: "expression", d: 3, ex: ["Lleva un paraguas, por si acaso.", "Take an umbrella, just in case."], pron: "por see ah-KAH-soh" },
  { id: "a-proposito", es: "a propósito", en: "on purpose / by the way", pos: "expression", d: 3, ex: ["No lo hice a propósito.", "I didn't do it on purpose."], pron: "ah proh-POH-see-toh", note: "Two meanings: on purpose (lo hizo a propósito) and “by the way” (a propósito, ¿vienes mañana?)." },
]);
