import { entries } from "./helpers";

/** Comparing things (Unit 20). */
export const COMPARE = entries("compare", [
  { id: "mas", es: "más", en: "more", pos: "adverb", ex: ["Quiero más tacos.", "I want more tacos."], pron: "mahs", note: "With the accent it means “more”; without it, mas is a rare, formal “but”." },
  { id: "menos", es: "menos", en: "less / fewer", pos: "adverb", ex: ["Como menos carne ahora.", "I eat less meat now."], pron: "MEH-nohs" },
  { id: "tan", es: "tan", en: "so / as", pos: "adverb", d: 2, ex: ["No es tan caro.", "It's not so expensive."], pron: "tahn", note: "Tan + adjective: tan alto como tú = as tall as you." },
  { id: "tanto", es: "tanto", en: "so much / as much", pos: "adjective", fem: "tanta", d: 2, ex: ["No tengo tanto trabajo como tú.", "I don't have as much work as you."], pron: "TAHN-toh", note: "Agrees with the noun: tanta comida, tantos amigos, tantas fiestas." },
  { id: "mejor", es: "mejor", en: "better / best", pos: "adjective", pl: "mejores", d: 2, ex: ["Este café es mejor.", "This coffee is better."], pron: "meh-HOR", note: "The comparative of bueno and bien. Never say más bueno or más bien." },
  { id: "peor", es: "peor", en: "worse / worst", pos: "adjective", pl: "peores", d: 2, ex: ["Ayer fue peor.", "Yesterday was worse."], pron: "peh-OR", note: "The comparative of malo and mal." },
  { id: "mayor", es: "mayor", en: "older / greater", pos: "adjective", pl: "mayores", d: 2, ex: ["Mi hermano es mayor que yo.", "My brother is older than me."], pron: "mah-YOR", note: "The polite way to say “older” for people. Una persona mayor = an elderly person." },
  { id: "menor", es: "menor", en: "younger / lesser", pos: "adjective", pl: "menores", d: 2, ex: ["Mi hermana es menor que yo.", "My sister is younger than me."], pron: "meh-NOR" },
  { id: "viejo", es: "viejo", en: "old", pos: "adjective", fem: "vieja", ex: ["Mi casa es muy vieja.", "My house is very old."], pron: "BYEH-hoh", note: "For things. For people, mayor is gentler: viejo can sound rude." },
  { id: "joven", es: "joven", en: "young", pos: "adjective", pl: "jóvenes", ex: ["Mi madre es muy joven.", "My mother is very young."], pron: "HOH-behn", note: "Same form for men and women; the plural adds an accent: jóvenes." },
  { id: "bonito", es: "bonito", en: "pretty / nice", pos: "adjective", fem: "bonita", ex: ["La playa es muy bonita.", "The beach is very pretty."], pron: "boh-NEE-toh", note: "In Mexico lindo / linda is just as common.", rn: [["mx", "Lindo / linda is everywhere in Mexican speech: ¡qué lindo!"]] },
  { id: "feo", es: "feo", en: "ugly", pos: "adjective", fem: "fea", ex: ["Ese coche es feo.", "That car is ugly."], pron: "FEH-oh" },
  { id: "facil", es: "fácil", en: "easy", pos: "adjective", pl: "fáciles", ex: ["El español es fácil.", "Spanish is easy."], pron: "FAH-seel" },
  { id: "dificil", es: "difícil", en: "difficult", pos: "adjective", pl: "difíciles", ex: ["El examen es difícil.", "The exam is difficult."], pron: "dee-FEE-seel" },
  { id: "coche", es: "coche", en: "car", pos: "noun", g: "m", pl: "coches", ex: ["Mi coche es azul.", "My car is blue."], pron: "KOH-cheh", note: "In Mexico you'll hear coche, carro and auto." },
  { id: "dinero", es: "dinero", en: "money", pos: "noun", g: "m", ex: ["No tengo mucho dinero.", "I don't have much money."], pron: "dee-NEH-roh", rel: ["lana"] },
  { id: "favorito", es: "favorito", en: "favorite", pos: "adjective", fem: "favorita", ex: ["Mi comida favorita es el taco.", "My favorite food is the taco."], pron: "fah-boh-REE-toh" },
  { id: "increible", es: "increíble", en: "incredible", pos: "adjective", pl: "increíbles", ex: ["La vista es increíble.", "The view is incredible."], pron: "een-kreh-EE-bleh" },
]);
