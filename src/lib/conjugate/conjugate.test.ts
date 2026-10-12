import { describe, expect, it } from "vitest";
import { VOCABULARY } from "@/content/vocabulary";
import { acceptedForms, conjugate, inferStemChange, PERSONS, TENSES, type StemChange, type Tense } from "./conjugate";
import { hasIrregularEntry } from "./irregulars";

const five = (infinitive: string, tense: Tense, stemChange?: StemChange) => {
  const forms = conjugate({ infinitive, stemChange }, tense);
  return PERSONS.map((p) => forms[p]);
};

const VERBS = VOCABULARY.filter((v) => v.verb);

describe("present tense matches every hand-written table", () => {
  it.each(VERBS.map((v) => [v.verb!.infinitive, v.verb!] as const))("%s", (infinitive, data) => {
    const stemChange = inferStemChange(infinitive, data.conjugations.present.el);
    expect(conjugate({ infinitive, stemChange }, "present")).toEqual(data.conjugations.present);
  });
});

describe("every vocabulary verb conjugates in every tense", () => {
  it("produces a non-empty form for each person", () => {
    for (const v of VERBS) {
      const stemChange = inferStemChange(v.verb!.infinitive, v.verb!.conjugations.present.el);
      for (const tense of TENSES) {
        const forms = conjugate({ infinitive: v.verb!.infinitive, stemChange }, tense);
        for (const p of PERSONS) expect(forms[p], `${v.id} ${tense} ${p}`).toMatch(/^[a-záéíóúüñ ]+$/);
      }
    }
  });

  it("knows the quirks of every verb the vocabulary marks irregular", () => {
    const missing = VERBS.filter((v) => v.verb!.regularOrIrregular === "irregular" && !hasIrregularEntry(v.verb!.infinitive.replace(/se$/, "")));
    expect(missing.map((v) => v.id)).toEqual([]);
  });
});

describe("stem changes are read off the él form", () => {
  it.each([
    ["pensar", "piensa", "e>ie"],
    ["poder", "puede", "o>ue"],
    ["jugar", "juega", "u>ue"],
    ["pedir", "pide", "e>i"],
    ["graduarse", "se gradúa", "accent"],
    ["hablar", "habla", undefined],
    ["estar", "está", undefined],
  ] as const)("%s", (inf, el, expected) => {
    expect(inferStemChange(inf, el)).toBe(expected);
  });
});

describe("regular patterns", () => {
  it.each<[string, Tense, string[]]>([
    ["hablar", "preterite", ["hablé", "hablaste", "habló", "hablamos", "hablaron"]],
    ["comer", "preterite", ["comí", "comiste", "comió", "comimos", "comieron"]],
    ["vivir", "preterite", ["viví", "viviste", "vivió", "vivimos", "vivieron"]],
    ["hablar", "imperfect", ["hablaba", "hablabas", "hablaba", "hablábamos", "hablaban"]],
    ["vivir", "imperfect", ["vivía", "vivías", "vivía", "vivíamos", "vivían"]],
    ["hablar", "future", ["hablaré", "hablarás", "hablará", "hablaremos", "hablarán"]],
    ["comer", "conditional", ["comería", "comerías", "comería", "comeríamos", "comerían"]],
    ["hablar", "presentSubjunctive", ["hable", "hables", "hable", "hablemos", "hablen"]],
    ["vivir", "presentSubjunctive", ["viva", "vivas", "viva", "vivamos", "vivan"]],
    ["hablar", "imperfectSubjunctive", ["hablara", "hablaras", "hablara", "habláramos", "hablaran"]],
    ["comer", "imperfectSubjunctive", ["comiera", "comieras", "comiera", "comiéramos", "comieran"]],
    ["hablar", "presentProgressive", ["estoy hablando", "estás hablando", "está hablando", "estamos hablando", "están hablando"]],
    ["comer", "presentPerfect", ["he comido", "has comido", "ha comido", "hemos comido", "han comido"]],
    ["vivir", "pastPerfect", ["había vivido", "habías vivido", "había vivido", "habíamos vivido", "habían vivido"]],
    ["hablar", "futurePerfect", ["habré hablado", "habrás hablado", "habrá hablado", "habremos hablado", "habrán hablado"]],
    ["comer", "conditionalPerfect", ["habría comido", "habrías comido", "habría comido", "habríamos comido", "habrían comido"]],
    ["vivir", "pastPerfectSubjunctive", ["hubiera vivido", "hubieras vivido", "hubiera vivido", "hubiéramos vivido", "hubieran vivido"]],
  ])("%s · %s", (inf, tense, expected) => {
    expect(five(inf, tense)).toEqual(expected);
  });
});

describe("irregular verbs", () => {
  it.each<[string, StemChange | undefined, Tense, string[]]>([
    ["ser", undefined, "preterite", ["fui", "fuiste", "fue", "fuimos", "fueron"]],
    ["ser", undefined, "imperfect", ["era", "eras", "era", "éramos", "eran"]],
    ["ser", undefined, "imperfectSubjunctive", ["fuera", "fueras", "fuera", "fuéramos", "fueran"]],
    ["ir", undefined, "imperfect", ["iba", "ibas", "iba", "íbamos", "iban"]],
    ["ir", undefined, "presentSubjunctive", ["vaya", "vayas", "vaya", "vayamos", "vayan"]],
    ["ir", undefined, "future", ["iré", "irás", "irá", "iremos", "irán"]],
    ["ir", undefined, "presentProgressive", ["estoy yendo", "estás yendo", "está yendo", "estamos yendo", "están yendo"]],
    ["estar", undefined, "preterite", ["estuve", "estuviste", "estuvo", "estuvimos", "estuvieron"]],
    ["estar", undefined, "presentSubjunctive", ["esté", "estés", "esté", "estemos", "estén"]],
    ["tener", "e>ie", "preterite", ["tuve", "tuviste", "tuvo", "tuvimos", "tuvieron"]],
    ["tener", "e>ie", "future", ["tendré", "tendrás", "tendrá", "tendremos", "tendrán"]],
    ["tener", "e>ie", "presentSubjunctive", ["tenga", "tengas", "tenga", "tengamos", "tengan"]],
    ["tener", "e>ie", "imperfectSubjunctive", ["tuviera", "tuvieras", "tuviera", "tuviéramos", "tuvieran"]],
    ["hacer", undefined, "preterite", ["hice", "hiciste", "hizo", "hicimos", "hicieron"]],
    ["hacer", undefined, "conditional", ["haría", "harías", "haría", "haríamos", "harían"]],
    ["hacer", undefined, "presentPerfect", ["he hecho", "has hecho", "ha hecho", "hemos hecho", "han hecho"]],
    ["decir", "e>i", "preterite", ["dije", "dijiste", "dijo", "dijimos", "dijeron"]],
    ["decir", "e>i", "future", ["diré", "dirás", "dirá", "diremos", "dirán"]],
    ["decir", "e>i", "presentSubjunctive", ["diga", "digas", "diga", "digamos", "digan"]],
    ["decir", "e>i", "presentProgressive", ["estoy diciendo", "estás diciendo", "está diciendo", "estamos diciendo", "están diciendo"]],
    ["decir", "e>i", "imperfectSubjunctive", ["dijera", "dijeras", "dijera", "dijéramos", "dijeran"]],
    ["poder", "o>ue", "preterite", ["pude", "pudiste", "pudo", "pudimos", "pudieron"]],
    ["poder", "o>ue", "presentSubjunctive", ["pueda", "puedas", "pueda", "podamos", "puedan"]],
    ["poder", "o>ue", "presentProgressive", ["estoy pudiendo", "estás pudiendo", "está pudiendo", "estamos pudiendo", "están pudiendo"]],
    ["querer", "e>ie", "preterite", ["quise", "quisiste", "quiso", "quisimos", "quisieron"]],
    ["querer", "e>ie", "future", ["querré", "querrás", "querrá", "querremos", "querrán"]],
    ["saber", undefined, "preterite", ["supe", "supiste", "supo", "supimos", "supieron"]],
    ["saber", undefined, "presentSubjunctive", ["sepa", "sepas", "sepa", "sepamos", "sepan"]],
    ["venir", "e>ie", "preterite", ["vine", "viniste", "vino", "vinimos", "vinieron"]],
    ["venir", "e>ie", "conditional", ["vendría", "vendrías", "vendría", "vendríamos", "vendrían"]],
    ["poner", undefined, "preterite", ["puse", "pusiste", "puso", "pusimos", "pusieron"]],
    ["salir", undefined, "future", ["saldré", "saldrás", "saldrá", "saldremos", "saldrán"]],
    ["salir", undefined, "presentSubjunctive", ["salga", "salgas", "salga", "salgamos", "salgan"]],
    ["traer", undefined, "preterite", ["traje", "trajiste", "trajo", "trajimos", "trajeron"]],
    ["traer", undefined, "presentPerfect", ["he traído", "has traído", "ha traído", "hemos traído", "han traído"]],
    ["dar", undefined, "preterite", ["di", "diste", "dio", "dimos", "dieron"]],
    ["dar", undefined, "presentSubjunctive", ["dé", "des", "dé", "demos", "den"]],
    ["ver", undefined, "preterite", ["vi", "viste", "vio", "vimos", "vieron"]],
    ["ver", undefined, "imperfect", ["veía", "veías", "veía", "veíamos", "veían"]],
    ["ver", undefined, "presentSubjunctive", ["vea", "veas", "vea", "veamos", "vean"]],
    ["ver", undefined, "pastPerfect", ["había visto", "habías visto", "había visto", "habíamos visto", "habían visto"]],
    ["conocer", undefined, "presentSubjunctive", ["conozca", "conozcas", "conozca", "conozcamos", "conozcan"]],
    ["caer", undefined, "preterite", ["caí", "caíste", "cayó", "caímos", "cayeron"]],
    ["caer", undefined, "presentSubjunctive", ["caiga", "caigas", "caiga", "caigamos", "caigan"]],
  ])("%s · %s", (inf, change, tense, expected) => {
    expect(five(inf, tense, change)).toEqual(expected);
  });
});

describe("stem and spelling changes outside the present", () => {
  it.each<[string, StemChange | undefined, Tense, string[]]>([
    ["dormir", "o>ue", "preterite", ["dormí", "dormiste", "durmió", "dormimos", "durmieron"]],
    ["dormir", "o>ue", "presentSubjunctive", ["duerma", "duermas", "duerma", "durmamos", "duerman"]],
    ["dormir", "o>ue", "presentProgressive", ["estoy durmiendo", "estás durmiendo", "está durmiendo", "estamos durmiendo", "están durmiendo"]],
    ["pedir", "e>i", "preterite", ["pedí", "pediste", "pidió", "pedimos", "pidieron"]],
    ["pedir", "e>i", "presentSubjunctive", ["pida", "pidas", "pida", "pidamos", "pidan"]],
    ["preferir", "e>ie", "imperfectSubjunctive", ["prefiriera", "prefirieras", "prefiriera", "prefiriéramos", "prefirieran"]],
    ["seguir", "e>i", "preterite", ["seguí", "seguiste", "siguió", "seguimos", "siguieron"]],
    ["seguir", "e>i", "presentSubjunctive", ["siga", "sigas", "siga", "sigamos", "sigan"]],
    ["pensar", "e>ie", "presentSubjunctive", ["piense", "pienses", "piense", "pensemos", "piensen"]],
    ["volver", "o>ue", "presentPerfect", ["he vuelto", "has vuelto", "ha vuelto", "hemos vuelto", "han vuelto"]],
    ["jugar", "u>ue", "preterite", ["jugué", "jugaste", "jugó", "jugamos", "jugaron"]],
    ["jugar", "u>ue", "presentSubjunctive", ["juegue", "juegues", "juegue", "juguemos", "jueguen"]],
    ["empezar", "e>ie", "preterite", ["empecé", "empezaste", "empezó", "empezamos", "empezaron"]],
    ["empezar", "e>ie", "presentSubjunctive", ["empiece", "empieces", "empiece", "empecemos", "empiecen"]],
    ["buscar", undefined, "preterite", ["busqué", "buscaste", "buscó", "buscamos", "buscaron"]],
    ["buscar", undefined, "presentSubjunctive", ["busque", "busques", "busque", "busquemos", "busquen"]],
    ["llegar", undefined, "presentSubjunctive", ["llegue", "llegues", "llegue", "lleguemos", "lleguen"]],
    ["cruzar", undefined, "preterite", ["crucé", "cruzaste", "cruzó", "cruzamos", "cruzaron"]],
    ["leer", undefined, "preterite", ["leí", "leíste", "leyó", "leímos", "leyeron"]],
    ["leer", undefined, "imperfectSubjunctive", ["leyera", "leyeras", "leyera", "leyéramos", "leyeran"]],
    ["creer", undefined, "presentProgressive", ["estoy creyendo", "estás creyendo", "está creyendo", "estamos creyendo", "están creyendo"]],
    ["abrir", undefined, "presentPerfect", ["he abierto", "has abierto", "ha abierto", "hemos abierto", "han abierto"]],
    ["escribir", undefined, "futurePerfect", ["habré escrito", "habrás escrito", "habrá escrito", "habremos escrito", "habrán escrito"]],
    ["romper", undefined, "pastPerfect", ["había roto", "habías roto", "había roto", "habíamos roto", "habían roto"]],
  ])("%s · %s", (inf, change, tense, expected) => {
    expect(five(inf, tense, change)).toEqual(expected);
  });
});

describe("reflexive and prefixed verbs", () => {
  it.each<[string, StemChange | undefined, Tense, string[]]>([
    ["levantarse", undefined, "presentPerfect", ["me he levantado", "te has levantado", "se ha levantado", "nos hemos levantado", "se han levantado"]],
    ["levantarse", undefined, "future", ["me levantaré", "te levantarás", "se levantará", "nos levantaremos", "se levantarán"]],
    ["sentirse", "e>ie", "preterite", ["me sentí", "te sentiste", "se sintió", "nos sentimos", "se sintieron"]],
    ["sentirse", "e>ie", "presentSubjunctive", ["me sienta", "te sientas", "se sienta", "nos sintamos", "se sientan"]],
    ["vestirse", "e>i", "presentProgressive", ["me estoy vistiendo", "te estás vistiendo", "se está vistiendo", "nos estamos vistiendo", "se están vistiendo"]],
    ["graduarse", "accent", "preterite", ["me gradué", "te graduaste", "se graduó", "nos graduamos", "se graduaron"]],
    ["graduarse", "accent", "presentSubjunctive", ["me gradúe", "te gradúes", "se gradúe", "nos graduemos", "se gradúen"]],
    ["descomponerse", undefined, "preterite", ["me descompuse", "te descompusiste", "se descompuso", "nos descompusimos", "se descompusieron"]],
    ["descomponerse", undefined, "future", ["me descompondré", "te descompondrás", "se descompondrá", "nos descompondremos", "se descompondrán"]],
    ["descomponerse", undefined, "presentPerfect", ["me he descompuesto", "te has descompuesto", "se ha descompuesto", "nos hemos descompuesto", "se han descompuesto"]],
    ["devolver", "o>ue", "presentPerfect", ["he devuelto", "has devuelto", "ha devuelto", "hemos devuelto", "han devuelto"]],
    ["descubrir", undefined, "pastPerfect", ["había descubierto", "habías descubierto", "había descubierto", "habíamos descubierto", "habían descubierto"]],
  ])("%s · %s", (inf, change, tense, expected) => {
    expect(five(inf, tense, change)).toEqual(expected);
  });
});

describe("alternate answers", () => {
  it("accepts the -se imperfect subjunctive after the -ra form", () => {
    const forms = acceptedForms({ infinitive: "hablar" }, "imperfectSubjunctive");
    expect(forms.yo).toEqual(["hablara", "hablase"]);
    expect(forms.nosotros).toEqual(["habláramos", "hablásemos"]);
    expect(acceptedForms({ infinitive: "hablar" }, "pastPerfectSubjunctive").el).toEqual(["hubiera hablado", "hubiese hablado"]);
  });

  it("accepts the pronoun attached to the gerund", () => {
    const forms = acceptedForms({ infinitive: "levantarse" }, "presentProgressive");
    expect(forms.yo).toEqual(["me estoy levantando", "estoy levantándome"]);
    expect(acceptedForms({ infinitive: "divertirse", stemChange: "e>ie" }, "presentProgressive").nosotros).toEqual([
      "nos estamos divirtiendo",
      "estamos divirtiéndonos",
    ]);
  });
});
