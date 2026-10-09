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

/** Commands, directions and a third batch of Mexican slang (Unit 18). */
export const COMMANDS = entries("commands", [
  { id: "esperar", es: "esperar", en: "to wait / to hope", pos: "verb", ex: ["Espera un momento.", "Wait a moment."], pron: "ehs-peh-RAR", verb: verb("esperar", "ar", "regular", ["espero", "esperas", "espera", "esperamos", "esperan"], "to wait / hope") },
  { id: "mirar", es: "mirar", en: "to look at / to watch", pos: "verb", ex: ["Mira, es muy fácil.", "Look, it's very easy."], pron: "mee-RAR", note: "“¡Mira!” is also a friendly attention-getter, like “look…” in English.", verb: verb("mirar", "ar", "regular", ["miro", "miras", "mira", "miramos", "miran"], "to look at / watch") },
  { id: "poner", es: "poner", en: "to put / to place", pos: "verb", d: 2, ex: ["Pongo el libro en la mesa.", "I put the book on the table."], pron: "poh-NEHR", note: "Only yo is irregular: pongo.", verb: verb("poner", "er", "irregular", ["pongo", "pones", "pone", "ponemos", "ponen"], "to put", "yo pongo") },
  { id: "oye", es: "oye", en: "hey / listen", pos: "expression", ex: ["Oye, ¿tienes tiempo?", "Hey, do you have time?"], pron: "OH-yeh", note: "A command form of oír (“to hear”). Formally: oiga.", rel: ["perdon"] },
  { id: "preocuparse", es: "preocuparse", en: "to worry", pos: "verb", d: 2, ex: ["No te preocupes.", "Don't worry."], pron: "preh-oh-koo-PAR-seh", verb: verb("preocuparse", "ar", "regular", ["me preocupo", "te preocupas", "se preocupa", "nos preocupamos", "se preocupan"], "to worry") },
  { id: "tranquilo", es: "tranquilo", en: "calm / relaxed", pos: "adjective", fem: "tranquila", ex: ["Estoy tranquilo.", "I'm calm."], pron: "trahn-KEE-loh", note: "“¡Tranquilo!” / “¡Tranquila!” = calm down, relax, it's okay." },
  { id: "cuidado", es: "cuidado", en: "care / careful", pos: "noun", g: "m", ex: ["¡Cuidado!", "Careful!"], pron: "kwee-DAH-doh", note: "Ten cuidado = be careful." },
  { id: "rapido", es: "rápido", en: "fast / quickly", pos: "adjective", fem: "rápida", ex: ["Habla muy rápido.", "He talks very fast."], pron: "RAH-pee-doh", note: "Used as an adverb it doesn't change: habla rápido." },
  { id: "seguir", es: "seguir", en: "to continue / to follow", pos: "verb", d: 3, ex: ["Sigo derecho.", "I keep going straight."], pron: "seh-GEER", note: "Seguir derecho = to go straight on. Stem-changing (e → i) with yo sigo.", verb: verb("seguir", "ir", "stem-changing", ["sigo", "sigues", "sigue", "seguimos", "siguen"], "to continue / follow", "e → i, yo sigo") },
  { id: "doblar", es: "doblar", en: "to turn", pos: "verb", ex: ["Doblo a la derecha.", "I turn right."], pron: "doh-BLAR", note: "In Mexico you'll also hear dar vuelta: “Da vuelta a la izquierda.”", verb: verb("doblar", "ar", "regular", ["doblo", "doblas", "dobla", "doblamos", "doblan"], "to turn") },
  { id: "cruzar", es: "cruzar", en: "to cross", pos: "verb", ex: ["Cruzo la calle.", "I cross the street."], pron: "kroo-SAR", verb: verb("cruzar", "ar", "regular", ["cruzo", "cruzas", "cruza", "cruzamos", "cruzan"], "to cross") },
  { id: "pasar", es: "pasar", en: "to come in / to pass / to happen", pos: "verb", d: 2, ex: ["Pase, por favor.", "Please come in."], pron: "pah-SAR", note: "A very flexible verb: pasar = to pass by, to come in, to spend (time), to happen (¿qué pasó?).", verb: verb("pasar", "ar", "regular", ["paso", "pasas", "pasa", "pasamos", "pasan"], "to pass / come in / happen") },

  /* ---- Real Talk 3 ---- */
  { id: "andale", es: "¡ándale!", en: "come on! / hurry up! / that's right!", pos: "expression", reg: "slang", regions: ["mx"], d: 3, ex: ["¡Ándale, que se hace tarde!", "Come on, it's getting late!"], pron: "AHN-dah-leh", note: "Like ¡órale!, it changes with tone: urging (“hurry up”), agreeing (“that's it!”), or encouraging (“go for it!”)." },
  { id: "ni-modo", es: "ni modo", en: "oh well / too bad", pos: "expression", reg: "informal", regions: ["mx"], d: 2, ex: ["No hay boletos. Ni modo.", "There are no tickets. Oh well."], pron: "nee MOH-doh", note: "The all-purpose shrug: it can't be helped. Very Mexican." },
  { id: "aguas", es: "¡aguas!", en: "watch out!", pos: "expression", reg: "slang", regions: ["mx"], d: 3, ex: ["¡Aguas! Viene un coche.", "Watch out! A car is coming."], pron: "AH-gwahs", note: "Literally “waters”. Shouted as a quick warning in Mexico." },
  { id: "echame-la-mano", es: "échame la mano", en: "give me a hand", pos: "expression", reg: "informal", regions: ["mx"], d: 3, ex: ["¿Me echas la mano con esto?", "Can you give me a hand with this?"], pron: "EH-chah-meh lah MAH-noh", note: "A friendly way to ask for help: ¿me echas la mano?" },
  { id: "que-flojera", es: "¡qué flojera!", en: "ugh, can't be bothered!", pos: "expression", reg: "slang", regions: ["mx"], d: 3, ex: ["¡Qué flojera salir hoy!", "Ugh, I can't be bothered to go out today!"], pron: "keh floh-HEH-rah", note: "Flojo = lazy. Use it for that heavy “I really don't feel like it” feeling." },
  { id: "chingon", es: "chingón", en: "awesome / badass", pos: "adjective", fem: "chingona", reg: "vulgar", regions: ["mx"], d: 3, ex: ["Ese concierto estuvo chingón.", "That concert was awesome."], pron: "cheen-GOHN", note: "Very common in Mexico — and vulgar (it comes from chingar). Fine among close friends; not for work, elders or strangers.", rel: ["chido", "padrisimo"] },
]);
