import { entries, present } from "./helpers";

type Group = "ar" | "er" | "ir";
type Forms = [string, string, string, string, string];

const verb = (inf: string, group: Group, kind: "regular" | "irregular" | "stem-changing", forms: Forms, translation: string, stemChange?: string) => ({
  infinitive: inf,
  translation,
  regularOrIrregular: kind,
  group,
  stemChange,
  conjugations: present(forms),
});

/** Daily routine and reflexive verbs (Unit 16). Reflexive forms include the pronoun: me levanto. */
export const ROUTINE = entries("routine", [
  { id: "rutina", es: "rutina", en: "routine", pos: "noun", g: "f", pl: "rutinas", ex: ["Mi rutina es muy simple.", "My routine is very simple."], pron: "roo-TEE-nah" },
  { id: "despertarse", es: "despertarse", en: "to wake up", pos: "verb", d: 2, ex: ["Me despierto a las seis.", "I wake up at six."], pron: "dehs-pehr-TAR-seh", note: "A boot verb (e → ie): me despierto, but nos despertamos.", verb: verb("despertarse", "ar", "stem-changing", ["me despierto", "te despiertas", "se despierta", "nos despertamos", "se despiertan"], "to wake up", "e → ie") },
  { id: "levantarse", es: "levantarse", en: "to get up", pos: "verb", d: 2, ex: ["Me levanto temprano.", "I get up early."], pron: "leh-bahn-TAR-seh", verb: verb("levantarse", "ar", "regular", ["me levanto", "te levantas", "se levanta", "nos levantamos", "se levantan"], "to get up") },
  { id: "banarse", es: "bañarse", en: "to take a bath / shower", pos: "verb", d: 2, ex: ["Me baño por la mañana.", "I shower in the morning."], pron: "bah-NYAR-seh", note: "In Mexico bañarse covers both a bath and a shower.", rn: [["es", "In Spain ducharse is the usual word for taking a shower."]], verb: verb("bañarse", "ar", "regular", ["me baño", "te bañas", "se baña", "nos bañamos", "se bañan"], "to bathe / shower") },
  { id: "vestirse", es: "vestirse", en: "to get dressed", pos: "verb", d: 2, ex: ["Me visto rápido.", "I get dressed quickly."], pron: "behs-TEER-seh", note: "A stem-changing verb (e → i): me visto, te vistes — but nos vestimos.", verb: verb("vestirse", "ir", "stem-changing", ["me visto", "te vistes", "se viste", "nos vestimos", "se visten"], "to get dressed", "e → i") },
  { id: "desayunar", es: "desayunar", en: "to have breakfast", pos: "verb", ex: ["Desayuno a las siete.", "I have breakfast at seven."], pron: "deh-sah-yoo-NAR", verb: verb("desayunar", "ar", "regular", ["desayuno", "desayunas", "desayuna", "desayunamos", "desayunan"], "to have breakfast") },
  { id: "cenar", es: "cenar", en: "to have dinner", pos: "verb", ex: ["Ceno con mi familia.", "I have dinner with my family."], pron: "seh-NAR", note: "In Mexico la cena is usually a lighter, later meal than la comida (the main midday meal).", verb: verb("cenar", "ar", "regular", ["ceno", "cenas", "cena", "cenamos", "cenan"], "to have dinner") },
  { id: "lavarse", es: "lavarse", en: "to wash (oneself)", pos: "verb", d: 2, ex: ["Me lavo las manos.", "I wash my hands."], pron: "lah-BAR-seh", note: "Body parts take el / la / los / las, not mi: me lavo las manos. Lavarse los dientes = to brush your teeth.", verb: verb("lavarse", "ar", "regular", ["me lavo", "te lavas", "se lava", "nos lavamos", "se lavan"], "to wash (oneself)") },
  { id: "acostarse", es: "acostarse", en: "to go to bed", pos: "verb", d: 2, ex: ["Me acuesto a las once.", "I go to bed at eleven."], pron: "ah-kohs-TAR-seh", note: "A boot verb (o → ue): me acuesto, but nos acostamos.", verb: verb("acostarse", "ar", "stem-changing", ["me acuesto", "te acuestas", "se acuesta", "nos acostamos", "se acuestan"], "to go to bed", "o → ue") },
  { id: "primero", es: "primero", en: "first", pos: "adverb", ex: ["Primero me levanto.", "First I get up."], pron: "pree-MEH-roh" },
  { id: "por-fin", es: "por fin", en: "finally / at last", pos: "expression", ex: ["¡Por fin es viernes!", "Finally it's Friday!"], pron: "por feen" },
  { id: "sentirse", es: "sentirse", en: "to feel", pos: "verb", d: 2, ex: ["Me siento muy bien.", "I feel very good."], pron: "sehn-TEER-seh", note: "A boot verb (e → ie): me siento. Don't confuse it with lo siento (“I'm sorry”).", verb: verb("sentirse", "ir", "stem-changing", ["me siento", "te sientes", "se siente", "nos sentimos", "se sienten"], "to feel", "e → ie") },
  { id: "quedarse", es: "quedarse", en: "to stay", pos: "verb", ex: ["Me quedo en casa.", "I'm staying home."], pron: "keh-DAR-seh", note: "Related to quedamos (“let's meet”) from Unit 9.", verb: verb("quedarse", "ar", "regular", ["me quedo", "te quedas", "se queda", "nos quedamos", "se quedan"], "to stay") },
  { id: "divertirse", es: "divertirse", en: "to have fun", pos: "verb", d: 2, ex: ["Me divierto mucho en las fiestas.", "I have a lot of fun at parties."], pron: "dee-behr-TEER-seh", note: "A boot verb (e → ie): me divierto.", rel: ["divertido"], verb: verb("divertirse", "ir", "stem-changing", ["me divierto", "te diviertes", "se divierte", "nos divertimos", "se divierten"], "to have fun", "e → ie") },
]);
