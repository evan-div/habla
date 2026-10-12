/** Five forms in the order yo · tú · él/ella/usted · nosotros · ellos/ellas/ustedes. */
export type Five = readonly [string, string, string, string, string];

/**
 * What the rules in conjugate.ts can't work out on their own. Anything left out
 * falls back to the regular pattern (plus the stem change read from the
 * vocabulary's present tense). Add a verb here when it's irregular outside the
 * present — the content test fails for any vocabulary verb marked "irregular"
 * that's missing.
 */
export interface Irregular {
  /** Whole present tense (ser, estar, ir). */
  present?: Five;
  /** Present-tense yo form. The present subjunctive is built on it (tengo → tenga). */
  yo?: string;
  /** Whole preterite (ser, ir, dar, ver). */
  preterite?: Five;
  /** Strong preterite stem taking the unstressed endings -e, -iste, -o, -imos, -ieron (tuv-, hic-, dij-). */
  preteriteStem?: string;
  imperfect?: Five;
  /** Future and conditional stem (tendr-, har-). */
  futureStem?: string;
  /** Whole present subjunctive (ser, estar, ir, dar, saber). */
  subjunctive?: Five;
  participle?: string;
  gerund?: string;
}

const SER_IR_PRETERITE: Five = ["fui", "fuiste", "fue", "fuimos", "fueron"];

export const IRREGULARS: Readonly<Record<string, Irregular>> = {
  ser: {
    present: ["soy", "eres", "es", "somos", "son"],
    preterite: SER_IR_PRETERITE,
    imperfect: ["era", "eras", "era", "éramos", "eran"],
    subjunctive: ["sea", "seas", "sea", "seamos", "sean"],
  },
  ir: {
    present: ["voy", "vas", "va", "vamos", "van"],
    preterite: SER_IR_PRETERITE,
    imperfect: ["iba", "ibas", "iba", "íbamos", "iban"],
    subjunctive: ["vaya", "vayas", "vaya", "vayamos", "vayan"],
    gerund: "yendo",
  },
  estar: {
    present: ["estoy", "estás", "está", "estamos", "están"],
    preteriteStem: "estuv",
    subjunctive: ["esté", "estés", "esté", "estemos", "estén"],
  },
  dar: {
    yo: "doy",
    preterite: ["di", "diste", "dio", "dimos", "dieron"],
    subjunctive: ["dé", "des", "dé", "demos", "den"],
  },
  ver: {
    yo: "veo",
    preterite: ["vi", "viste", "vio", "vimos", "vieron"],
    imperfect: ["veía", "veías", "veía", "veíamos", "veían"],
    participle: "visto",
  },
  saber: {
    yo: "sé",
    preteriteStem: "sup",
    futureStem: "sabr",
    subjunctive: ["sepa", "sepas", "sepa", "sepamos", "sepan"],
  },
  tener: { yo: "tengo", preteriteStem: "tuv", futureStem: "tendr" },
  venir: { yo: "vengo", preteriteStem: "vin", futureStem: "vendr" },
  poner: { yo: "pongo", preteriteStem: "pus", futureStem: "pondr", participle: "puesto" },
  hacer: { yo: "hago", preteriteStem: "hic", futureStem: "har", participle: "hecho" },
  decir: { yo: "digo", preteriteStem: "dij", futureStem: "dir", participle: "dicho" },
  traer: { yo: "traigo", preteriteStem: "traj" },
  salir: { yo: "salgo", futureStem: "saldr" },
  caer: { yo: "caigo" },
  conocer: { yo: "conozco" },
  querer: { preteriteStem: "quis", futureStem: "querr" },
  poder: { preteriteStem: "pud", futureStem: "podr", gerund: "pudiendo" },
  // Irregular only in the past participle.
  abrir: { participle: "abierto" },
  cubrir: { participle: "cubierto" },
  escribir: { participle: "escrito" },
  romper: { participle: "roto" },
  volver: { participle: "vuelto" },
  morir: { participle: "muerto" },
};

/** Bases whose quirks carry over to prefixed verbs: descomponer → descompuse, devolver → devuelto. */
const PREFIXABLE = ["poner", "tener", "venir", "hacer", "traer", "volver", "cubrir", "escribir"] as const;

function prefixed(irr: Irregular, prefix: string): Irregular {
  const one = (s: string | undefined) => (s === undefined ? undefined : prefix + s);
  const five = (f: Five | undefined) => f?.map((s) => prefix + s) as Five | undefined;
  return {
    present: five(irr.present),
    yo: one(irr.yo),
    preterite: five(irr.preterite),
    preteriteStem: one(irr.preteriteStem),
    imperfect: five(irr.imperfect),
    futureStem: one(irr.futureStem),
    subjunctive: five(irr.subjunctive),
    participle: one(irr.participle),
    gerund: one(irr.gerund),
  };
}

/** The irregularities for an infinitive (without -se); empty for regular verbs. */
export function irregularFor(infinitive: string): Irregular {
  const direct = IRREGULARS[infinitive];
  if (direct) return direct;
  for (const base of PREFIXABLE) {
    if (infinitive.length > base.length && infinitive.endsWith(base)) {
      return prefixed(IRREGULARS[base], infinitive.slice(0, -base.length));
    }
  }
  return {};
}

export function hasIrregularEntry(infinitive: string): boolean {
  return Object.values(irregularFor(infinitive)).some((v) => v !== undefined);
}
