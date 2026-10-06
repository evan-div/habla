import { entries, present } from "./helpers";

export const VERBS = entries("verbs", [
  {
    id: "ser", es: "ser", en: "to be (who/what something is)", pos: "verb", d: 2,
    ex: ["Yo soy estudiante.", "I'm a student."], pron: "sehr",
    note: "For identity and lasting characteristics: who you are, where you're from, what something is like.",
    rel: ["estar"],
    verb: { infinitive: "ser", translation: "to be", regularOrIrregular: "irregular", group: "er", conjugations: present(["soy", "eres", "es", "somos", "son"]) },
  },
  {
    id: "estar", es: "estar", en: "to be (how/where something is)", pos: "verb", d: 2,
    ex: ["Estoy cansado.", "I'm tired."], pron: "ehs-TAR",
    note: "For temporary states, feelings and locations: how you are right now, and where things are.",
    rel: ["ser"],
    verb: { infinitive: "estar", translation: "to be", regularOrIrregular: "irregular", group: "ar", conjugations: present(["estoy", "estás", "está", "estamos", "están"]) },
  },
  {
    id: "tener", es: "tener", en: "to have", pos: "verb", d: 2,
    ex: ["Tengo un amigo en México.", "I have a friend in Mexico."], pron: "teh-NEHR",
    note: "Also used for age and many physical feelings: tengo hambre, tengo frío, tengo prisa.",
    verb: { infinitive: "tener", translation: "to have", regularOrIrregular: "irregular", group: "er", stemChange: "e → ie (and yo tengo)", conjugations: present(["tengo", "tienes", "tiene", "tenemos", "tienen"]) },
  },
  {
    id: "querer", es: "querer", en: "to want", pos: "verb", d: 2,
    ex: ["Quiero comer.", "I want to eat."], pron: "keh-REHR",
    note: "Followed by an infinitive it means “want to do something”. With people it can mean “to love”: Te quiero is a warm, everyday “I love you”.",
    verb: { infinitive: "querer", translation: "to want", regularOrIrregular: "stem-changing", group: "er", stemChange: "e → ie", conjugations: present(["quiero", "quieres", "quiere", "queremos", "quieren"]) },
  },
  {
    id: "ir", es: "ir", en: "to go", pos: "verb", d: 2,
    ex: ["Voy a casa.", "I'm going home."], pron: "eer",
    note: "Completely irregular — just memorize voy, vas, va, vamos, van. “Vamos” also means “Let's go!”",
    verb: { infinitive: "ir", translation: "to go", regularOrIrregular: "irregular", group: "ir", conjugations: present(["voy", "vas", "va", "vamos", "van"]) },
  },
  {
    id: "hablar", es: "hablar", en: "to speak / to talk", pos: "verb",
    ex: ["Hablo español.", "I speak Spanish."], pron: "ah-BLAR",
    note: "A regular -ar verb: a model for hundreds of others.",
    verb: { infinitive: "hablar", translation: "to speak", regularOrIrregular: "regular", group: "ar", conjugations: present(["hablo", "hablas", "habla", "hablamos", "hablan"]) },
  },
  {
    id: "comer", es: "comer", en: "to eat", pos: "verb",
    ex: ["Como tacos.", "I eat tacos."], pron: "koh-MEHR",
    note: "A regular -er verb. Watch the accent: yo como = “I eat”, while ¿cómo? = “how?”.",
    verb: { infinitive: "comer", translation: "to eat", regularOrIrregular: "regular", group: "er", conjugations: present(["como", "comes", "come", "comemos", "comen"]) },
  },
  {
    id: "vivir", es: "vivir", en: "to live", pos: "verb",
    ex: ["Vivo en México.", "I live in Mexico."], pron: "bee-BEER",
    note: "A regular -ir verb. In the nosotros form it's -imos: vivimos.",
    verb: { infinitive: "vivir", translation: "to live", regularOrIrregular: "regular", group: "ir", conjugations: present(["vivo", "vives", "vive", "vivimos", "viven"]) },
  },
  {
    id: "tomar", es: "tomar", en: "to drink / to take", pos: "verb",
    ex: ["¿Qué quieres tomar?", "What do you want to drink?"], pron: "toh-MAR",
    note: "A regular -ar verb.", rn: [["mx", "In Mexico, tomar is the everyday word for “to drink” (beber is correct but sounds more formal)."]],
    verb: { infinitive: "tomar", translation: "to drink / to take", regularOrIrregular: "regular", group: "ar", conjugations: present(["tomo", "tomas", "toma", "tomamos", "toman"]) },
  },
  { id: "quiero", es: "quiero", en: "I want", pos: "expression", ex: ["Quiero agua, por favor.", "I want water, please."], pron: "KYEH-roh", note: "The yo form of querer — the one you'll use most.", rel: ["querer"] },
]);

export const DESCRIBING = entries("describing", [
  { id: "estudiante", es: "estudiante", en: "student", pos: "noun", ex: ["Soy estudiante.", "I'm a student."], pron: "ehs-too-DYAHN-teh", note: "Same word for men and women: el estudiante, la estudiante. And no “a” before jobs: Soy estudiante, not “soy un estudiante”." },
  { id: "maestro", es: "maestro", en: "teacher", pos: "noun", g: "m", fem: "maestra", ex: ["Mi hermana es maestra.", "My sister is a teacher."], pron: "mah-EHS-troh", rn: [["mx", "In Mexico, maestro/maestra is the everyday word for a teacher."]] },
  { id: "doctor", es: "doctor", en: "doctor", pos: "noun", g: "m", fem: "doctora", ex: ["Ella es doctora.", "She's a doctor."], pron: "dohk-TOR" },
  { id: "alto", es: "alto", en: "tall", pos: "adjective", fem: "alta", ex: ["Mi hermano es alto.", "My brother is tall."], pron: "AHL-toh" },
  { id: "simpatico", es: "simpático", en: "nice / friendly", pos: "adjective", fem: "simpática", d: 2, ex: ["Ana es muy simpática.", "Ana is very nice."], pron: "seem-PAH-tee-koh", note: "It means friendly or likeable — not “sympathetic”." },
  { id: "cansado", es: "cansado", en: "tired", pos: "adjective", fem: "cansada", ex: ["Estoy muy cansado.", "I'm very tired."], pron: "kahn-SAH-doh" },
  { id: "contento", es: "contento", en: "happy / glad", pos: "adjective", fem: "contenta", ex: ["Estoy contento.", "I'm happy."], pron: "kohn-TEHN-toh" },
  { id: "ocupado", es: "ocupado", en: "busy", pos: "adjective", fem: "ocupada", d: 2, ex: ["Hoy estoy muy ocupado.", "Today I'm very busy."], pron: "oh-koo-PAH-doh" },
  { id: "nuevo", es: "nuevo", en: "new", pos: "adjective", fem: "nueva", ex: ["Soy nuevo aquí.", "I'm new here."], pron: "NWEH-boh" },
  { id: "grande", es: "grande", en: "big / large", pos: "adjective", ex: ["Mi familia es grande.", "My family is big."], pron: "GRAHN-deh", note: "Ends in -e, so it's the same for masculine and feminine." },
  { id: "pequeno", es: "pequeño", en: "small / little", pos: "adjective", fem: "pequeña", ex: ["Mi casa es pequeña.", "My house is small."], pron: "peh-KEH-nyoh" },
  { id: "muy", es: "muy", en: "very", pos: "adverb", ex: ["Estoy muy bien.", "I'm very well."], pron: "mwee" },
  { id: "un-poco", es: "un poco", en: "a little", pos: "expression", ex: ["Hablo un poco de español.", "I speak a little Spanish."], pron: "oon POH-koh" },
  { id: "aqui", es: "aquí", en: "here", pos: "adverb", ex: ["Estoy aquí.", "I'm here."], pron: "ah-KEE" },
  { id: "hoy", es: "hoy", en: "today", pos: "adverb", ex: ["Hoy estoy cansado.", "Today I'm tired."], pron: "oy" },
  { id: "casa", es: "casa", en: "home / house", pos: "noun", g: "f", pl: "casas", ex: ["Estoy en casa.", "I'm at home."], pron: "KAH-sah", note: "“En casa” = at home; “a casa” = (to) home." },
  { id: "trabajo", es: "trabajo", en: "work / job", pos: "noun", g: "m", ex: ["Estoy en el trabajo.", "I'm at work."], pron: "trah-BAH-hoh" },
  { id: "espanol", es: "español", en: "Spanish (language)", pos: "noun", g: "m", ex: ["Hablo español.", "I speak Spanish."], pron: "ehs-pah-NYOHL", note: "Language names are lowercase in Spanish and don't need “the” after hablar." },
  { id: "ingles", es: "inglés", en: "English (language)", pos: "noun", g: "m", ex: ["¿Hablas inglés?", "Do you speak English?"], pron: "een-GLEHS" },
  { id: "a", es: "a", en: "to / at", pos: "preposition", ex: ["Voy a casa.", "I'm going home."], pron: "ah", note: "After ir it points to the destination: voy a casa. Voy a + infinitive means “I'm going to (do something)”." },
]);

export const TENER_EXPRESSIONS = entries("tener-expressions", [
  { id: "tengo-sueno", es: "tengo sueño", en: "I'm sleepy", pos: "expression", d: 2, ex: ["Hoy tengo sueño.", "Today I'm sleepy."], pron: "TEHN-goh SWEH-nyoh", note: "Spanish “has” sleepiness: tener sueño.", rel: ["tener"] },
  { id: "tengo-frio", es: "tengo frío", en: "I'm cold", pos: "expression", d: 2, ex: ["Tengo frío. ¿Y tú?", "I'm cold. And you?"], pron: "TEHN-goh FREE-oh", note: "Never “estoy frío” — that would mean you're a cold person (or cold to the touch)!", rel: ["tener"] },
  { id: "tengo-calor", es: "tengo calor", en: "I'm hot", pos: "expression", d: 2, ex: ["Aquí tengo calor.", "I'm hot here."], pron: "TEHN-goh kah-LOR", rel: ["tener"] },
  { id: "tengo-prisa", es: "tengo prisa", en: "I'm in a hurry", pos: "expression", d: 2, ex: ["Perdón, tengo prisa.", "Sorry, I'm in a hurry."], pron: "TEHN-goh PREE-sah", rel: ["tener"] },
]);
