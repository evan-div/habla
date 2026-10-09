import { entries, present } from "./helpers";

type Group = "ar" | "er" | "ir";
const regular = (inf: string, group: Group, forms: [string, string, string, string, string], translation: string) => ({
  infinitive: inf,
  translation,
  regularOrIrregular: "regular" as const,
  group,
  conjugations: present(forms),
});

export const ACTIONS = entries("actions", [
  { id: "trabajar", es: "trabajar", en: "to work", pos: "verb", ex: ["Trabajo todos los días.", "I work every day."], pron: "trah-bah-HAR", verb: regular("trabajar", "ar", ["trabajo", "trabajas", "trabaja", "trabajamos", "trabajan"], "to work") },
  { id: "estudiar", es: "estudiar", en: "to study", pos: "verb", ex: ["Estudio español.", "I study Spanish."], pron: "ehs-too-DYAR", verb: regular("estudiar", "ar", ["estudio", "estudias", "estudia", "estudiamos", "estudian"], "to study") },
  { id: "cocinar", es: "cocinar", en: "to cook", pos: "verb", ex: ["Mi abuela cocina muy bien.", "My grandmother cooks very well."], pron: "koh-see-NAR", verb: regular("cocinar", "ar", ["cocino", "cocinas", "cocina", "cocinamos", "cocinan"], "to cook") },
  { id: "escuchar", es: "escuchar", en: "to listen (to)", pos: "verb", ex: ["Escucho música.", "I listen to music."], pron: "ehs-koo-CHAR", note: "No “to” needed: escucho música = I listen to music.", verb: regular("escuchar", "ar", ["escucho", "escuchas", "escucha", "escuchamos", "escuchan"], "to listen") },
  { id: "bailar", es: "bailar", en: "to dance", pos: "verb", ex: ["Bailamos los sábados.", "We dance on Saturdays."], pron: "by-LAR", verb: regular("bailar", "ar", ["bailo", "bailas", "baila", "bailamos", "bailan"], "to dance") },
  { id: "musica", es: "música", en: "music", pos: "noun", g: "f", ex: ["Escucho música en casa.", "I listen to music at home."], pron: "MOO-see-kah", note: "From mariachi and norteño to cumbia and reggaeton, music is everywhere in Mexico." },
  { id: "todos-los-dias", es: "todos los días", en: "every day", pos: "expression", ex: ["Estudio español todos los días.", "I study Spanish every day."], pron: "TOH-dohs lohs DEE-ahs" },
  { id: "beber", es: "beber", en: "to drink", pos: "verb", ex: ["Bebo agua todos los días.", "I drink water every day."], pron: "beh-BEHR", note: "Correct everywhere, but in Mexico tomar is the everyday word for drinking.", rel: ["tomar"], verb: regular("beber", "er", ["bebo", "bebes", "bebe", "bebemos", "beben"], "to drink") },
  { id: "aprender", es: "aprender", en: "to learn", pos: "verb", ex: ["Aprendo español.", "I'm learning Spanish."], pron: "ah-prehn-DEHR", verb: regular("aprender", "er", ["aprendo", "aprendes", "aprende", "aprendemos", "aprenden"], "to learn") },
  { id: "leer", es: "leer", en: "to read", pos: "verb", ex: ["Leo un libro.", "I read a book."], pron: "leh-EHR", note: "Regular, but watch the spelling: yo leo, tú lees, ella lee, nosotros leemos.", verb: regular("leer", "er", ["leo", "lees", "lee", "leemos", "leen"], "to read") },
  { id: "escribir", es: "escribir", en: "to write", pos: "verb", ex: ["Escribo en español.", "I write in Spanish."], pron: "ehs-kree-BEER", verb: regular("escribir", "ir", ["escribo", "escribes", "escribe", "escribimos", "escriben"], "to write") },
  { id: "abrir", es: "abrir", en: "to open", pos: "verb", ex: ["Abro la puerta.", "I open the door."], pron: "ah-BREER", verb: regular("abrir", "ir", ["abro", "abres", "abre", "abrimos", "abren"], "to open") },
  { id: "libro", es: "libro", en: "book", pos: "noun", g: "m", pl: "libros", ex: ["Leo un libro.", "I'm reading a book."], pron: "LEE-broh" },
  { id: "puerta", es: "puerta", en: "door", pos: "noun", g: "f", pl: "puertas", ex: ["Abro la puerta.", "I open the door."], pron: "PWEHR-tah" },
  {
    id: "hacer", es: "hacer", en: "to do / to make", pos: "verb", d: 2, ex: ["¿Qué haces hoy?", "What are you doing today?"], pron: "ah-SEHR",
    note: "Only the yo form is irregular: hago. Also used for weather and “make” expressions.",
    verb: { infinitive: "hacer", translation: "to do / make", regularOrIrregular: "irregular", group: "er", stemChange: "yo hago", conjugations: present(["hago", "haces", "hace", "hacemos", "hacen"]) },
  },
  {
    id: "saber", es: "saber", en: "to know (a fact / how to)", pos: "verb", d: 2, ex: ["No sé.", "I don't know."], pron: "sah-BEHR",
    note: "Yo sé — the accent separates it from se. Use saber for facts and skills (sé hablar español).",
    verb: { infinitive: "saber", translation: "to know", regularOrIrregular: "irregular", group: "er", stemChange: "yo sé", conjugations: present(["sé", "sabes", "sabe", "sabemos", "saben"]) },
  },
  {
    id: "ver", es: "ver", en: "to see / to watch", pos: "verb", d: 2, ex: ["No veo el banco.", "I don't see the bank."], pron: "behr",
    verb: { infinitive: "ver", translation: "to see", regularOrIrregular: "irregular", group: "er", stemChange: "yo veo", conjugations: present(["veo", "ves", "ve", "vemos", "ven"]) },
  },
  {
    id: "salir", es: "salir", en: "to leave / to go out", pos: "verb", d: 2, ex: ["Salgo de casa los lunes.", "I leave home on Mondays."], pron: "sah-LEER",
    verb: { infinitive: "salir", translation: "to leave / go out", regularOrIrregular: "irregular", group: "ir", stemChange: "yo salgo", conjugations: present(["salgo", "sales", "sale", "salimos", "salen"]) },
  },
  {
    id: "venir", es: "venir", en: "to come", pos: "verb", d: 2, ex: ["Vengo del trabajo.", "I'm coming from work."], pron: "beh-NEER",
    verb: { infinitive: "venir", translation: "to come", regularOrIrregular: "irregular", group: "ir", stemChange: "e → ie, and yo vengo", conjugations: present(["vengo", "vienes", "viene", "venimos", "vienen"]) },
  },
  { id: "que-haces", es: "¿qué haces?", en: "what are you doing? / what do you do?", pos: "expression", ex: ["Hola, ¿qué haces?", "Hi, what are you up to?"], pron: "keh AH-sehs", note: "Formal: ¿qué hace usted?", rel: ["hacer"] },
  {
    id: "poder", es: "poder", en: "to be able to / can", pos: "verb", d: 2, ex: ["¿Puedes venir?", "Can you come?"], pron: "poh-DEHR", note: "Followed by an infinitive: puedo hablar = I can speak.",
    verb: { infinitive: "poder", translation: "can / be able to", regularOrIrregular: "stem-changing", group: "er", stemChange: "o → ue", conjugations: present(["puedo", "puedes", "puede", "podemos", "pueden"]) },
  },
  {
    id: "dormir", es: "dormir", en: "to sleep", pos: "verb", d: 2, ex: ["Duermo muy bien.", "I sleep very well."], pron: "dohr-MEER",
    verb: { infinitive: "dormir", translation: "to sleep", regularOrIrregular: "stem-changing", group: "ir", stemChange: "o → ue", conjugations: present(["duermo", "duermes", "duerme", "dormimos", "duermen"]) },
  },
  {
    id: "pensar", es: "pensar", en: "to think", pos: "verb", d: 2, ex: ["Pienso en mi familia.", "I think about my family."], pron: "pehn-SAR",
    verb: { infinitive: "pensar", translation: "to think", regularOrIrregular: "stem-changing", group: "ar", stemChange: "e → ie", conjugations: present(["pienso", "piensas", "piensa", "pensamos", "piensan"]) },
  },
  {
    id: "volver", es: "volver", en: "to return / to go back", pos: "verb", d: 2, ex: ["Vuelvo a casa mañana.", "I'm going back home tomorrow."], pron: "bohl-BEHR",
    verb: { infinitive: "volver", translation: "to return", regularOrIrregular: "stem-changing", group: "er", stemChange: "o → ue", conjugations: present(["vuelvo", "vuelves", "vuelve", "volvemos", "vuelven"]) },
  },
  {
    id: "pedir", es: "pedir", en: "to ask for / to order", pos: "verb", d: 2, ex: ["Pido un café.", "I order a coffee."], pron: "peh-DEER", note: "Pedir asks for a thing (pido agua); preguntar asks a question.",
    verb: { infinitive: "pedir", translation: "to ask for / order", regularOrIrregular: "stem-changing", group: "ir", stemChange: "e → i", conjugations: present(["pido", "pides", "pide", "pedimos", "piden"]) },
  },
  {
    id: "empezar", es: "empezar", en: "to begin / to start", pos: "verb", d: 2, ex: ["Empiezo a trabajar.", "I start working."], pron: "ehm-peh-SAR", note: "Empezar a + infinitive = “to start doing”.",
    verb: { infinitive: "empezar", translation: "to start", regularOrIrregular: "stem-changing", group: "ar", stemChange: "e → ie", conjugations: present(["empiezo", "empiezas", "empieza", "empezamos", "empiezan"]) },
  },
  { id: "siempre", es: "siempre", en: "always", pos: "adverb", ex: ["Siempre como en casa.", "I always eat at home."], pron: "SYEHM-preh" },
  { id: "a-veces", es: "a veces", en: "sometimes", pos: "expression", ex: ["A veces estoy cansado.", "Sometimes I'm tired."], pron: "ah BEH-sehs" },
  { id: "nunca", es: "nunca", en: "never", pos: "adverb", ex: ["Nunca bebo café.", "I never drink coffee."], pron: "NOON-kah", note: "With nunca after the verb you need no too: No bebo café nunca." },
  { id: "por-la-manana", es: "por la mañana", en: "in the morning", pos: "expression", ex: ["Por la mañana estudio.", "In the morning I study."], pron: "por lah mah-NYAH-nah" },
  { id: "por-la-tarde", es: "por la tarde", en: "in the afternoon", pos: "expression", ex: ["Por la tarde trabajo.", "In the afternoon I work."], pron: "por lah TAR-deh" },
  { id: "por-la-noche", es: "por la noche", en: "at night / in the evening", pos: "expression", ex: ["Por la noche como en casa.", "In the evening I eat at home."], pron: "por lah NOH-cheh" },
]);
