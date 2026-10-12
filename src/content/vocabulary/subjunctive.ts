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

/** Words that trigger the subjunctive (Unit 23). */
export const SUBJUNCTIVE_WORDS = entries("subjunctive", [
  { id: "importante", es: "importante", en: "important", pos: "adjective", pl: "importantes", ex: ["Es importante estudiar.", "It's important to study."], pron: "eem-pohr-TAHN-teh", note: "Es importante que + subjunctive: Es importante que estudies." },
  { id: "necesario", es: "necesario", en: "necessary", pos: "adjective", fem: "necesaria", d: 2, ex: ["Es necesario descansar.", "It's necessary to rest."], pron: "neh-seh-SAH-ryoh" },
  { id: "posible", es: "posible", en: "possible", pos: "adjective", pl: "posibles", d: 2, ex: ["Es posible que llueva.", "It's possible that it will rain."], pron: "poh-SEE-bleh", note: "Es posible que is a doubt expression, so the verb that follows is in the subjunctive." },
  { id: "recomendar", es: "recomendar", en: "to recommend", pos: "verb", d: 3, ex: ["Te recomiendo este restaurante.", "I recommend this restaurant to you."], pron: "reh-koh-mehn-DAR", note: "A boot verb (e → ie): recomiendo, recomiendas…", verb: verb("recomendar", "ar", "stem-changing", ["recomiendo", "recomiendas", "recomienda", "recomendamos", "recomiendan"], "to recommend", "e → ie") },
  { id: "dejar", es: "dejar", en: "to let / to leave (behind)", pos: "verb", d: 2, ex: ["Mis padres me dejan salir.", "My parents let me go out."], pron: "deh-HAR", note: "Dejar can mean “to allow” (me dejan salir) or “to leave something” (dejé mi llave en casa).", verb: verb("dejar", "ar", "regular", ["dejo", "dejas", "deja", "dejamos", "dejan"], "to let / leave") },
  { id: "alegrarse", es: "alegrarse", en: "to be glad", pos: "verb", d: 3, ex: ["Me alegro de verte.", "I'm glad to see you."], pron: "ah-leh-GRAR-seh", note: "Me alegro de que + subjunctive: Me alegro de que vengas.", verb: verb("alegrarse", "ar", "regular", ["me alegro", "te alegras", "se alegra", "nos alegramos", "se alegran"], "to be glad") },
  { id: "dudar", es: "dudar", en: "to doubt", pos: "verb", d: 2, ex: ["Dudo que venga.", "I doubt he'll come."], pron: "doo-DAR", note: "Doubt takes the subjunctive: dudo que venga. Certainty takes the indicative: sé que viene.", verb: verb("dudar", "ar", "regular", ["dudo", "dudas", "duda", "dudamos", "dudan"], "to doubt") },
  { id: "creer", es: "creer", en: "to believe / to think", pos: "verb", d: 2, ex: ["Creo que tienes razón.", "I think you're right."], pron: "kreh-EHR", note: "Creo que + indicative (I think it's true). No creo que + subjunctive (I doubt it).", rel: ["creo-que"], verb: verb("creer", "er", "regular", ["creo", "crees", "cree", "creemos", "creen"], "to believe / think") },
]);
