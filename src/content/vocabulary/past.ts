import { entries, present } from "./helpers";

const reg = (inf: string, group: "ar" | "er" | "ir", forms: [string, string, string, string, string], translation: string) => ({
  infinitive: inf,
  translation,
  regularOrIrregular: "regular" as const,
  group,
  conjugations: present(forms),
});

/** Time words and descriptors for the past tenses (Units 13–14). */
export const PAST = entries("past", [
  { id: "ayer", es: "ayer", en: "yesterday", pos: "adverb", ex: ["Ayer trabajé mucho.", "Yesterday I worked a lot."], pron: "ah-YEHR", note: "Ayer por la tarde = yesterday afternoon; ayer por la noche = last night." },
  { id: "anoche", es: "anoche", en: "last night", pos: "adverb", ex: ["Anoche comí tacos.", "Last night I ate tacos."], pron: "ah-NOH-cheh" },
  { id: "anteayer", es: "anteayer", en: "the day before yesterday", pos: "adverb", d: 2, ex: ["Anteayer llamé a mi madre.", "The day before yesterday I called my mother."], pron: "ahn-teh-ah-YEHR", note: "Also written antier in Mexico, especially in speech." },
  { id: "la-semana-pasada", es: "la semana pasada", en: "last week", pos: "expression", d: 2, ex: ["La semana pasada viajé a Puebla.", "Last week I traveled to Puebla."], pron: "lah seh-MAH-nah pah-SAH-dah", note: "Pasado agrees with the noun: la semana pasada, el año pasado, el lunes pasado." },
  { id: "el-ano-pasado", es: "el año pasado", en: "last year", pos: "expression", d: 2, ex: ["El año pasado viví en Guadalajara.", "Last year I lived in Guadalajara."], pron: "ehl AH-nyoh pah-SAH-doh" },
  { id: "hace", es: "hace + time", en: "ago", pos: "expression", d: 2, ex: ["Llegué hace dos horas.", "I arrived two hours ago."], pron: "AH-seh", note: "Hace + a length of time = “ago”: hace una semana, hace tres años. Same word as hace (“he/she does”) — context tells them apart.", rel: ["hacer"] },
  { id: "buscar", es: "buscar", en: "to look for", pos: "verb", ex: ["Busco un hotel cerca.", "I'm looking for a hotel nearby."], pron: "boos-KAR", note: "No word for “for” is needed: busco un hotel = I'm looking for a hotel.", verb: reg("buscar", "ar", ["busco", "buscas", "busca", "buscamos", "buscan"], "to look for") },
  { id: "divertido", es: "divertido", en: "fun / funny", pos: "adjective", fem: "divertida", ex: ["La fiesta fue muy divertida.", "The party was a lot of fun."], pron: "dee-behr-TEE-doh", note: "Covers both “fun” and “funny”: un amigo divertido is a fun friend." },
  { id: "aburrido", es: "aburrido", en: "boring / bored", pos: "adjective", fem: "aburrida", ex: ["La película fue muy aburrida.", "The movie was very boring."], pron: "ah-boo-RREE-doh", note: "With ser it means boring (es aburrido); with estar it means bored (está aburrido)." },

  /* ---- Unit 14: the imperfect ---- */
  { id: "cuando-era-nino", es: "cuando era niño", en: "when I was a kid", pos: "expression", d: 2, ex: ["Cuando era niño, vivía en un pueblo.", "When I was a kid, I lived in a small town."], pron: "KWAHN-doh EH-rah NEE-nyoh", note: "A woman says cuando era niña." },
  { id: "infancia", es: "infancia", en: "childhood", pos: "noun", g: "f", d: 2, ex: ["Tuve una infancia muy feliz.", "I had a very happy childhood."], pron: "een-FAHN-syah" },
  { id: "pueblo", es: "pueblo", en: "town / village", pos: "noun", g: "m", pl: "pueblos", ex: ["Mi abuela vive en un pueblo pequeño.", "My grandmother lives in a small town."], pron: "PWEH-bloh", note: "A pueblo is smaller than a ciudad. Mexico even has an official list of “Pueblos Mágicos”." },
  { id: "ciudad", es: "ciudad", en: "city", pos: "noun", g: "f", pl: "ciudades", ex: ["Vivo en una ciudad grande.", "I live in a big city."], pron: "syoo-DAHD" },
  { id: "recordar", es: "recordar", en: "to remember", pos: "verb", d: 2, ex: ["Recuerdo mi infancia.", "I remember my childhood."], pron: "reh-kor-DAR", note: "A boot verb (o → ue): recuerdo, recuerdas… but recordamos.", verb: { infinitive: "recordar", translation: "to remember", regularOrIrregular: "stem-changing", group: "ar", stemChange: "o → ue", conjugations: present(["recuerdo", "recuerdas", "recuerda", "recordamos", "recuerdan"]) } },
  { id: "mientras", es: "mientras", en: "while", pos: "conjunction", ex: ["Mientras como, leo.", "While I eat, I read."], pron: "MYEHN-trahs" },
  { id: "de-repente", es: "de repente", en: "suddenly", pos: "expression", d: 2, ex: ["De repente, llegó mi hermano.", "Suddenly, my brother arrived."], pron: "deh reh-PEHN-teh" },
  { id: "hace-calor", es: "hace calor", en: "it's hot (weather)", pos: "expression", ex: ["Hoy hace mucho calor.", "It's very hot today."], pron: "AH-seh kah-LOR", note: "Weather uses hacer: hace calor, hace frío. Don't mix it up with tengo calor, which is how you feel.", rel: ["tengo-calor"] },
  { id: "hace-frio", es: "hace frío", en: "it's cold (weather)", pos: "expression", ex: ["En enero hace frío.", "In January it's cold."], pron: "AH-seh FREE-oh", rel: ["tengo-frio"] },
  { id: "juguete", es: "juguete", en: "toy", pos: "noun", g: "m", pl: "juguetes", ex: ["Tenía muchos juguetes.", "I had a lot of toys."], pron: "hoo-GEH-teh", note: "From jugar (to play)." },
]);
