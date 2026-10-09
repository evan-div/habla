import type { GrammarConcept } from "../types";

/** The past tenses (Units 13–14) and por vs. para (Unit 15). */
export const PAST_CONCEPTS: GrammarConcept[] = [
  {
    id: "preterite-ar",
    title: "Preterite: -ar verbs",
    tagline: "What happened — hablé, trabajó, bailamos.",
    status: "available",
    summary: {
      heading: "Past tense for -ar verbs",
      body: [
        "The **preterite** talks about actions that happened and finished: **Ayer trabajé.** Drop **-ar** and add the endings below. Note the accents on **yo** and **él / ella / usted** — they change the meaning!",
      ],
      table: {
        caption: "hablar — preterite",
        headers: ["", "hablar"],
        rows: [["yo", "hablé"], ["tú", "hablaste"], ["él / ella / usted", "habló"], ["nosotros", "hablamos"], ["ellos / ustedes", "hablaron"]],
      },
      examples: [
        { es: "Ayer hablé con mi madre.", en: "Yesterday I talked with my mother." },
        { es: "Anoche bailamos mucho.", en: "Last night we danced a lot." },
      ],
    },
    deepDive: [
      {
        heading: "When to use the preterite",
        body: ["Use it for completed actions with a clear beginning or end: what you did yesterday, last week, last year. Time words like **ayer**, **anoche**, **la semana pasada** and **hace dos días** are your clues."],
      },
      {
        heading: "Watch the accent",
        body: ["**Hablo** (I speak, present) and **habló** (he/she spoke, past) differ only by the accent mark — and so does **hablé**. Stress falls on the last syllable: ha-**BLÓ**."],
        examples: [{ es: "Ella trabaja hoy. / Ella trabajó ayer.", en: "She works today. / She worked yesterday." }],
      },
      {
        heading: "Nosotros looks the same",
        body: ["For **-ar** verbs, **nosotros** is identical in the present and the preterite: **hablamos**. Context (ayer, anoche) tells you which one you mean."],
      },
      {
        heading: "Boot verbs don't boot here",
        body: ["Stem changes in **-ar** and **-er** verbs disappear in the preterite: **pienso** (I think) but **pensé** (I thought); **vuelvo** but **volví**."],
      },
    ],
    commonMistakes: [
      { wrong: "Ayer trabajo mucho.", right: "Ayer trabajé mucho.", why: "“Yesterday” needs the past tense: trabajé." },
      { wrong: "Ella hablo con él.", right: "Ella habló con él.", why: "Without the accent, hablo means “I speak”." },
    ],
    related: ["present-regular", "preterite-er-ir"],
  },
  {
    id: "preterite-er-ir",
    title: "Preterite: -er and -ir verbs",
    tagline: "Comí, bebiste, escribió, salimos.",
    status: "available",
    summary: {
      heading: "One set of endings for -er and -ir",
      body: ["Good news: **-er** and **-ir** verbs share the same preterite endings. Drop the ending and add:"],
      table: {
        caption: "comer / vivir — preterite",
        headers: ["", "comer", "vivir"],
        rows: [["yo", "comí", "viví"], ["tú", "comiste", "viviste"], ["él / ella / usted", "comió", "vivió"], ["nosotros", "comimos", "vivimos"], ["ellos / ustedes", "comieron", "vivieron"]],
      },
      examples: [
        { es: "Anoche comí tacos.", en: "Last night I ate tacos." },
        { es: "Mis padres salieron temprano.", en: "My parents left early." },
      ],
    },
    deepDive: [
      {
        heading: "Compare with -ar",
        body: ["The endings **-é, -aste, -ó, -amos, -aron** (-ar) become **-í, -iste, -ió, -imos, -ieron** (-er/-ir). The **-ió / -ieron** pair is the one to practice."],
      },
      {
        heading: "Nosotros with -ir",
        body: ["For **-ir** verbs, **nosotros** is the same in the present and preterite (**vivimos**, **salimos**). For **-er** verbs they differ: **comemos** (we eat) vs. **comimos** (we ate)."],
      },
      {
        heading: "Ver has no accents",
        body: ["**Ver** is regular but its short forms need no accent marks: **vi, viste, vio, vimos, vieron**."],
      },
      {
        heading: "Two small twists",
        body: [
          "With vowel-ending stems, the **i** becomes **y** in the third person: **leer → leyó, leyeron**.",
          "Boot **-ir** verbs change in third person only: **pedir → pidió, pidieron**; **dormir → durmió, durmieron**.",
        ],
      },
    ],
    commonMistakes: [{ wrong: "Ayer comé tacos.", right: "Ayer comí tacos.", why: "-er verbs use -í in the yo form, not -é." }],
    related: ["preterite-ar", "present-regular"],
  },
  {
    id: "preterite-ser-ir",
    title: "Preterite of ser and ir",
    tagline: "Fui, fuiste, fue — one form, two verbs.",
    status: "available",
    summary: {
      heading: "Ser and ir share one past tense",
      body: ["In the preterite, **ser** (to be) and **ir** (to go) have exactly the same forms. Context tells you which verb it is."],
      table: {
        caption: "ser / ir — preterite",
        headers: ["", "ser / ir"],
        rows: [["yo", "fui"], ["tú", "fuiste"], ["él / ella / usted", "fue"], ["nosotros", "fuimos"], ["ellos / ustedes", "fueron"]],
      },
      examples: [
        { es: "Ayer fui al mercado.", en: "Yesterday I went to the market. (ir)" },
        { es: "La fiesta fue muy divertida.", en: "The party was a lot of fun. (ser)" },
      ],
    },
    deepDive: [
      {
        heading: "How to tell them apart",
        body: ["If a place follows (**fui a** …), it's **ir**. If a description or noun follows (**fue divertido**, **fue mi maestro**), it's **ser**."],
      },
      {
        heading: "Fue is everywhere",
        body: ["**Fue** is how you review things: **Fue increíble. Fue muy caro. Fue una buena idea.** It's one of the most useful words for talking about the past."],
      },
    ],
    commonMistakes: [{ wrong: "Ayer yo iba al mercado.", right: "Ayer fui al mercado.", why: "A single completed trip uses the preterite: fui." }],
    related: ["ser", "ir-a-infinitive", "preterite-ar"],
  },
  {
    id: "preterite-spelling",
    title: "Preterite spelling changes",
    tagline: "Llegué, busqué, empecé — keeping the sound.",
    status: "available",
    summary: {
      heading: "yo form: c → qu, g → gu, z → c",
      body: ["Spanish spelling keeps consonant sounds steady. In the **yo** form of **-car, -gar, -zar** verbs, the last consonant changes so the sound stays the same:"],
      table: {
        headers: ["Ending", "Change", "Example (yo)"],
        rows: [["-car", "c → qu", "buscar → busqué"], ["-gar", "g → gu", "llegar → llegué"], ["-zar", "z → c", "empezar → empecé"]],
      },
      examples: [
        { es: "Busqué mi llave.", en: "I looked for my key." },
        { es: "Ayer llegué tarde.", en: "I arrived late yesterday." },
      ],
    },
    deepDive: [
      { heading: "Only yo", body: ["All the other forms are normal: **llegaste, llegó, llegamos, llegaron**. Only **yo** changes."] },
      { heading: "Why?", body: ["Without the change, **llegé** would be pronounced with a Spanish “h” sound (like *hay*). The extra **u** in **llegué** keeps the hard “g”."] },
    ],
    commonMistakes: [{ wrong: "Ayer llegé a las ocho.", right: "Ayer llegué a las ocho.", why: "-gar verbs add a u in the yo form." }],
    related: ["preterite-ar"],
  },
  {
    id: "preterite-irregular",
    title: "Irregular preterites: hacer, tener, estar",
    tagline: "Hice, tuve, estuve — new stems, no accents.",
    status: "available",
    summary: {
      heading: "A new stem and one set of endings",
      body: ["Some very common verbs get a new stem in the preterite and take special endings with **no accents**: **-e, -iste, -o, -imos, -ieron**."],
      table: {
        headers: ["", "hacer", "tener", "estar"],
        rows: [
          ["yo", "hice", "tuve", "estuve"],
          ["tú", "hiciste", "tuviste", "estuviste"],
          ["él / ella / usted", "hizo", "tuvo", "estuvo"],
          ["nosotros", "hicimos", "tuvimos", "estuvimos"],
          ["ellos / ustedes", "hicieron", "tuvieron", "estuvieron"],
        ],
      },
      examples: [
        { es: "Ayer tuve mucho trabajo.", en: "Yesterday I had a lot of work." },
        { es: "¿Qué hiciste el sábado?", en: "What did you do on Saturday?" },
      ],
    },
    deepDive: [
      { heading: "Why hizo?", body: ["**Hacer** becomes **hizo** (not *hico*) to keep the soft “s” sound — the same idea as the spelling changes you just learned."] },
      { heading: "A question to memorize", body: ["**¿Qué hiciste ayer?** (“What did you do yesterday?”) is the all-purpose conversation starter about the past."] },
      { heading: "More like these", body: ["**Poder → pude, querer → quise, venir → vine, decir → dije.** You'll meet them as you go."] },
    ],
    commonMistakes: [
      { wrong: "Ayer yo hací la tarea.", right: "Ayer hice la tarea.", why: "Hacer is irregular in the preterite: hice." },
      { wrong: "Estuvé en casa.", right: "Estuve en casa.", why: "These irregular preterites have no accent on yo." },
    ],
    related: ["preterite-ar", "preterite-er-ir", "tener", "estar"],
  },
  {
    id: "imperfect-regular",
    title: "Imperfect: regular verbs",
    tagline: "Hablaba, comía — how things used to be.",
    status: "available",
    summary: {
      heading: "The past for habits and background",
      body: [
        "The **imperfect** describes how things **used to be** or what was **going on**. **-ar** verbs take **-aba**; **-er / -ir** verbs take **-ía**.",
      ],
      table: {
        caption: "imperfect endings",
        headers: ["", "hablar", "comer / vivir"],
        rows: [["yo", "hablaba", "comía"], ["tú", "hablabas", "comías"], ["él / ella / usted", "hablaba", "comía"], ["nosotros", "hablábamos", "comíamos"], ["ellos / ustedes", "hablaban", "comían"]],
      },
      examples: [
        { es: "Cuando era niño, jugaba fútbol todos los días.", en: "When I was a kid, I played soccer every day." },
        { es: "Mi abuela vivía en un pueblo.", en: "My grandmother lived in a small town." },
      ],
    },
    deepDive: [
      {
        heading: "When to use it",
        body: ["Use the imperfect for **habits** (todos los días, siempre), **descriptions** (how it looked, felt or was), and **scenes** with no clear start or end (**Mientras comía, leía**)."],
      },
      {
        heading: "Easiest tense to form",
        body: ["There are no stem changes and only three irregular verbs (**ser, ir, ver**), so once you know the endings you can use them on any verb."],
      },
      {
        heading: "Note the accents",
        body: ["The **nosotros** form of -ar verbs has an accent (**hablábamos**), and every **-ía** ending carries one on the **í** — which also stops it from merging into one syllable."],
      },
      {
        heading: "Handy markers",
        body: ["**Siempre, todos los días, a veces, cuando era niño, antes, mientras** all hint at the imperfect."],
      },
    ],
    commonMistakes: [
      { wrong: "Yo comia mucho de niño.", right: "Yo comía mucho de niño.", why: "Don't forget the accent on -ía." },
      { wrong: "Nosotros jugabamos todos los días.", right: "Nosotros jugábamos todos los días.", why: "The nosotros form of -ar verbs is accented: -ábamos." },
    ],
    related: ["preterite-ar", "present-regular"],
  },
  {
    id: "imperfect-irregular",
    title: "Imperfect: ser, ir, ver",
    tagline: "Era, iba, veía — the only three irregulars.",
    status: "available",
    summary: {
      heading: "Three irregular verbs",
      body: ["Only three verbs are irregular in the imperfect. Learn them once and you know the whole tense."],
      table: {
        headers: ["", "ser", "ir", "ver"],
        rows: [
          ["yo", "era", "iba", "veía"],
          ["tú", "eras", "ibas", "veías"],
          ["él / ella / usted", "era", "iba", "veía"],
          ["nosotros", "éramos", "íbamos", "veíamos"],
          ["ellos / ustedes", "eran", "iban", "veían"],
        ],
      },
      examples: [
        { es: "Mi abuelo era muy simpático.", en: "My grandfather was very nice." },
        { es: "Íbamos a la playa en verano.", en: "We used to go to the beach in summer." },
      ],
    },
    deepDive: [
      { heading: "Era for descriptions", body: ["**Era** describes people and things in the past: **Era alto. Era una casa grande. Eran las ocho.** (Telling the time in the past always uses the imperfect.)"] },
      { heading: "Iba a + infinitive", body: ["**Iba a** + infinitive is “I was going to…”: **Iba a llamarte, pero no tenía tiempo.**"] },
    ],
    commonMistakes: [{ wrong: "Cuando era niño, yo ibía a la escuela.", right: "Cuando era niño, iba a la escuela.", why: "Ir is irregular: iba, ibas, iba…" }],
    related: ["imperfect-regular", "ser", "ir-a-infinitive"],
  },
  {
    id: "preterite-vs-imperfect",
    title: "Preterite vs. imperfect",
    tagline: "The event vs. the background.",
    status: "available",
    summary: {
      heading: "Two pasts, two jobs",
      body: [
        "Use the **preterite** for **events**: single, finished actions that move the story forward. Use the **imperfect** for the **background**: habits, descriptions, and what was going on.",
      ],
      table: {
        headers: ["", "Preterite", "Imperfect"],
        rows: [
          ["Job", "What happened", "What it was like"],
          ["Clues", "ayer, anoche, de repente, una vez", "siempre, todos los días, mientras, cuando era niño"],
          ["Example", "Llegué a las ocho.", "Llovía y hacía frío."],
        ],
      },
      examples: [
        { es: "Mientras comía, llegó mi hermano.", en: "While I was eating, my brother arrived." },
        { es: "Hacía calor y fuimos a la playa.", en: "It was hot, so we went to the beach." },
      ],
    },
    deepDive: [
      { heading: "The classic pattern", body: ["Something **was going on** (imperfect) when something else **happened** (preterite): **Dormía cuando sonó el teléfono.** The imperfect is the stage; the preterite is the action."] },
      { heading: "Habit vs. one time", body: ["**Todos los veranos íbamos a la playa** (we used to go — habit) vs. **El verano pasado fuimos a Cancún** (we went — one trip)."] },
      { heading: "Weather, age, and time", body: ["Descriptions in the past almost always use the imperfect: **Hacía frío. Tenía diez años. Eran las tres.**"] },
    ],
    commonMistakes: [
      { wrong: "Ayer iba al cine.", right: "Ayer fui al cine.", why: "One finished trip yesterday: preterite." },
      { wrong: "Cuando era niño, fui a la playa todos los veranos.", right: "Cuando era niño, iba a la playa todos los veranos.", why: "A repeated habit: imperfect." },
    ],
    related: ["preterite-ar", "imperfect-regular"],
  },
  {
    id: "por-vs-para",
    title: "Por vs. para",
    tagline: "Two words for “for” — each with a job.",
    status: "available",
    summary: {
      heading: "Para = purpose or destination · Por = through, because of, during",
      body: ["Both can be “for”. Use **para** for goals and destinations; use **por** for reasons, time periods and “through / by”."],
      table: {
        headers: ["", "para", "por"],
        rows: [
          ["Meaning", "in order to; destination; recipient; deadline", "because of; through; during; in exchange for"],
          ["Example", "Un regalo para ti.", "Gracias por todo."],
          ["Example", "Salgo para Oaxaca.", "Paso por el centro."],
        ],
      },
      examples: [
        { es: "Quiero una habitación para dos.", en: "I'd like a room for two. (recipient)" },
        { es: "Estudio para aprender.", en: "I study in order to learn. (purpose)" },
        { es: "Gracias por la ayuda.", en: "Thanks for the help. (reason)" },
      ],
    },
    deepDive: [
      { heading: "PARA — where it's headed", body: ["Goal or purpose (**para aprender**), a recipient (**para mi madre**), a destination (**voy para el aeropuerto**), a deadline (**para el lunes**)."] },
      { heading: "POR — what's behind or around it", body: ["Reason (**por eso**), movement through a place (**por la calle**), a stretch of time (**por una semana**, **por la mañana**), exchange (**pagué cien pesos por la maleta**), and fixed phrases (**por favor, por supuesto**)."] },
      { heading: "Where you've already met them", body: ["**Por favor, por supuesto, por la mañana, por la noche** and **¿por qué?** all use **por**; **para llevar** and **para mí** use **para**."] },
    ],
    commonMistakes: [
      { wrong: "Gracias para todo.", right: "Gracias por todo.", why: "Thanking for a reason uses por." },
      { wrong: "Un regalo por ti.", right: "Un regalo para ti.", why: "A recipient takes para." },
    ],
    related: ["polite-requests", "personal-a"],
  },
];
