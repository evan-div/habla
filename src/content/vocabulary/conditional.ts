import { entries, present } from "./helpers";

type Forms = [string, string, string, string, string];

/** Polite wishes, advice and "would" (Unit 21). */
export const WOULD = entries("would", [
  { id: "me-gustaria", es: "me gustaría", en: "I would like", pos: "expression", d: 2, ex: ["Me gustaría viajar a Japón.", "I'd like to travel to Japan."], pron: "meh goos-tah-REE-ah", note: "The conditional of me gusta: softer and more polite than quiero." },
  {
    id: "preferir", es: "preferir", en: "to prefer", pos: "verb", d: 2, ex: ["Prefiero el té.", "I prefer tea."], pron: "preh-feh-REER", note: "A boot verb (e → ie): prefiero, prefieres… but preferimos.",
    verb: { infinitive: "preferir", translation: "to prefer", regularOrIrregular: "stem-changing", group: "ir", stemChange: "e → ie", conjugations: present(["prefiero", "prefieres", "prefiere", "preferimos", "prefieren"] as Forms) },
  },
  { id: "ojala", es: "¡ojalá!", en: "I hope so! / if only!", pos: "expression", d: 2, ex: ["—¿Vienes mañana? —¡Ojalá!", "—Are you coming tomorrow? —I hope so!"], pron: "oh-hah-LAH", note: "From Arabic “may God will it”. On its own it means “I hope so”; with a subjunctive verb it introduces wishes — that's coming later in the course." },
  {
    id: "deber", es: "deber", en: "should / must / to owe", pos: "verb", ex: ["Debes descansar.", "You should rest."], pron: "deh-BEHR", note: "Deber + infinitive = should: debo estudiar, debes comer.",
    verb: { infinitive: "deber", translation: "should / must", regularOrIrregular: "regular", group: "er", conjugations: present(["debo", "debes", "debe", "debemos", "deben"] as Forms) },
  },
  { id: "consejo", es: "consejo", en: "(piece of) advice", pos: "noun", g: "m", pl: "consejos", d: 2, ex: ["Te doy un consejo.", "I'll give you some advice."], pron: "kohn-SEH-hoh", note: "English says “some advice”; Spanish counts it: un consejo, dos consejos." },
  { id: "idea", es: "idea", en: "idea", pos: "noun", g: "f", pl: "ideas", ex: ["Es una buena idea.", "It's a good idea."], pron: "ee-DEH-ah" },
  { id: "lugar", es: "lugar", en: "place", pos: "noun", g: "m", pl: "lugares", ex: ["Es un lugar muy bonito.", "It's a very nice place."], pron: "loo-GAR", note: "En tu lugar = in your place (“if I were you”)." },
  {
    id: "descansar", es: "descansar", en: "to rest", pos: "verb", ex: ["Necesito descansar.", "I need to rest."], pron: "dehs-kahn-SAR",
    verb: { infinitive: "descansar", translation: "to rest", regularOrIrregular: "regular", group: "ar", conjugations: present(["descanso", "descansas", "descansa", "descansamos", "descansan"] as Forms) },
  },
]);
