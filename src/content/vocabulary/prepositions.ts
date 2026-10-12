import { entries } from "./helpers";

/** Prepositions, connectors and a fourth batch of Mexican slang (Unit 24). */
export const PREPOSITIONS = entries("prepositions", [
  { id: "debajo-de", es: "debajo de", en: "under / below", pos: "preposition", d: 2, ex: ["La llave está debajo de la mesa.", "The key is under the table."], pron: "deh-BAH-hoh deh" },
  { id: "sobre", es: "sobre", en: "on top of / about", pos: "preposition", ex: ["El libro está sobre la mesa.", "The book is on the table."], pron: "SOH-breh", note: "Also “about”: un libro sobre México." },
  { id: "entre", es: "entre", en: "between / among", pos: "preposition", ex: ["El banco está entre la farmacia y la escuela.", "The bank is between the pharmacy and the school."], pron: "EHN-treh" },
  { id: "detras-de", es: "detrás de", en: "behind", pos: "preposition", d: 2, ex: ["La escuela está detrás del parque.", "The school is behind the park."], pron: "deh-TRAHS deh", note: "de + el becomes del: detrás del parque." },
  { id: "junto-a", es: "junto a", en: "next to / beside", pos: "preposition", d: 2, ex: ["Vivo junto al parque.", "I live next to the park."], pron: "HOON-toh ah", note: "a + el becomes al: junto al parque. Similar to al lado de.", rel: ["al-lado-de"] },
  { id: "fuera-de", es: "fuera de", en: "outside (of)", pos: "preposition", ex: ["Estoy fuera de casa.", "I'm outside the house."], pron: "FWEH-rah deh" },
  { id: "hacia", es: "hacia", en: "toward", pos: "preposition", ex: ["Camino hacia el parque.", "I walk toward the park."], pron: "AH-syah" },
  { id: "durante", es: "durante", en: "during / for (a period)", pos: "preposition", d: 2, ex: ["Estudio durante dos horas.", "I study for two hours."], pron: "doo-RAHN-teh" },
  { id: "sin", es: "sin", en: "without", pos: "preposition", ex: ["Quiero un café sin azúcar.", "I'd like a coffee without sugar."], pron: "seen", note: "Sin + infinitive: sin hablar = without speaking." },
  { id: "antes-de", es: "antes de", en: "before (doing)", pos: "preposition", d: 2, ex: ["Me lavo las manos antes de comer.", "I wash my hands before eating."], pron: "AHN-tehs deh", note: "Followed by an infinitive: antes de comer — never “antes de comiendo”." },
  { id: "despues-de", es: "después de", en: "after (doing)", pos: "preposition", d: 2, ex: ["Después de cenar, me acuesto.", "After dinner I go to bed."], pron: "dehs-PWEHS deh" },
  { id: "ademas", es: "además", en: "besides / also", pos: "adverb", d: 2, ex: ["Es barato y, además, es rico.", "It's cheap and, what's more, it's tasty."], pron: "ah-deh-MAHS" },
  { id: "aunque", es: "aunque", en: "although / even if", pos: "conjunction", d: 3, ex: ["Voy, aunque estoy cansado.", "I'm going, even though I'm tired."], pron: "OWN-keh", note: "Aunque + indicative = a fact (even though). Aunque + subjunctive = a hypothetical (even if)." },
  { id: "por-eso", es: "por eso", en: "that's why", pos: "expression", ex: ["Tengo sueño; por eso me acuesto.", "I'm sleepy; that's why I'm going to bed."], pron: "por EH-soh" },
  { id: "sin-embargo", es: "sin embargo", en: "however", pos: "expression", d: 3, ex: ["Es caro; sin embargo, es muy bueno.", "It's expensive; however, it's very good."], pron: "seen ehm-BAR-goh" },
  { id: "entonces", es: "entonces", en: "so / then", pos: "adverb", ex: ["Entonces, ¿vamos?", "So, shall we go?"], pron: "ehn-TOHN-sehs" },
  { id: "lo-que", es: "lo que", en: "what / the thing that", pos: "expression", d: 3, ex: ["No entiendo lo que dices.", "I don't understand what you're saying."], pron: "loh keh", note: "Lo que = what (as a connector, no accent): lo que dices. ¿Qué? with an accent is the question word." },

  /* ---- Real Talk 4 ---- */
  { id: "buena-onda", es: "buena onda", en: "cool / good vibes", pos: "expression", reg: "slang", regions: ["mx"], d: 3, ex: ["Tu amigo es muy buena onda.", "Your friend is really cool."], pron: "BWEH-nah OHN-dah", note: "Literally “good wave”. Describes someone friendly and easygoing — or a good vibe. It doesn't change for gender." },
  { id: "mala-onda", es: "mala onda", en: "unfriendly / bad vibes", pos: "expression", reg: "slang", regions: ["mx"], d: 3, ex: ["No seas mala onda.", "Don't be unfriendly."], pron: "MAH-lah OHN-dah", note: "The opposite of buena onda: a rude, cold or unkind attitude." },
  { id: "no-hay-bronca", es: "no hay bronca", en: "no problem / no worries", pos: "expression", reg: "slang", regions: ["mx"], d: 3, ex: ["—¿Me ayudas? —No hay bronca.", "—Can you help me? —No problem."], pron: "noh eye BROHN-kah", note: "Bronca = hassle or trouble. A relaxed cousin of no pasa nada.", rel: ["no-pasa-nada"] },
  { id: "a-poco", es: "¿a poco?", en: "really?! / no way!", pos: "expression", reg: "slang", regions: ["mx"], d: 3, ex: ["¿A poco ya te vas?", "Really, you're leaving already?"], pron: "ah POH-koh", note: "A very Mexican way to say “really?!” or “you don't say!”. Similar to ¿en serio?", rel: ["en-serio"] },
  { id: "echale-ganas", es: "échale ganas", en: "give it your all", pos: "expression", reg: "informal", regions: ["mx"], d: 3, ex: ["¡Échale ganas en el examen!", "Give it your all on the exam!"], pron: "EH-chah-leh GAH-nahs", note: "The Mexican pep talk: literally “throw some desire at it”. Use it to encourage anyone." },
  { id: "me-late", es: "me late", en: "sounds good to me", pos: "expression", reg: "slang", regions: ["mx"], d: 3, ex: ["—¿Vamos al cine? —Me late.", "—Shall we go to the movies? —Sounds good."], pron: "meh LAH-teh", note: "From latir (“to beat”, like a heart): the plan makes your heart beat." },
  { id: "no-chingues", es: "no chingues", en: "no way! / quit messing with me", pos: "expression", reg: "vulgar", regions: ["mx"], d: 3, ex: ["¡No chingues! ¿Es en serio?", "No way! Seriously?"], pron: "noh CHEEN-gehs", note: "A vulgar exclamation, in the same family as no mames. Fine among close friends; never at work, with elders or with people you've just met.", rel: ["no-mames", "no-manches"] },
]);
