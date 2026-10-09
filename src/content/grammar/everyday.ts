import type { GrammarConcept } from "../types";

export const EVERYDAY: GrammarConcept[] = [
  {
    id: "por-que",
    title: "¿Por qué? vs. porque",
    tagline: "Why you ask, and because you answer.",
    status: "available",
    summary: {
      heading: "Two words to ask, one to answer",
      body: ["To ask “why?”, write **¿por qué?** — two words, accent on qué. To answer “because…”, write **porque** — one word, no accent."],
      table: {
        headers: ["", "Spanish", "Used to"],
        rows: [["why?", "¿Por qué?", "ask"], ["because", "porque", "answer"]],
      },
      examples: [
        { es: "¿Por qué estás cansado?", en: "Why are you tired?" },
        { es: "Porque tengo mucho trabajo.", en: "Because I have a lot of work." },
      ],
    },
    deepDive: [
      { heading: "Why the accent?", body: ["Question words carry an accent so you can tell them from their calm cousins: **qué** (what?) vs **que** (that). The same trick separates ¿por qué? from porque."] },
      { heading: "A natural answer", body: ["People often skip the question and just say **Porque…** — or even just **Porque sí.** (“Just because.”)."] },
    ],
    commonMistakes: [{ wrong: "¿Porque estás cansado?", right: "¿Por qué estás cansado?", why: "A question needs two words and an accent: ¿por qué?" }],
    related: ["questions"],
  },
  {
    id: "days-of-week",
    title: "Days of the week",
    tagline: "El lunes, los martes — and no capital letters.",
    status: "available",
    summary: {
      heading: "Monday to Sunday",
      body: ["Days are lowercase in Spanish. Put **el** before a day to say “on that day”: **el lunes** = “on Monday”. Use **los** for “every” (**los lunes** = “on Mondays”)."],
      table: {
        headers: ["Day", "Spanish"],
        rows: [["Monday", "lunes"], ["Tuesday", "martes"], ["Wednesday", "miércoles"], ["Thursday", "jueves"], ["Friday", "viernes"], ["Saturday", "sábado"], ["Sunday", "domingo"]],
      },
    },
    deepDive: [
      { heading: "Singular and plural look alike", body: ["Monday to Friday end in **-s** and don't change: **el lunes**, **los lunes**. Only the article tells you one day or every day. Saturday and Sunday add -s: **los sábados**, **los domingos**."] },
      { heading: "Asking the day", body: ["**¿Qué día es hoy?** — “What day is it today?” Answer: **Hoy es martes.** (No article here.)"] },
    ],
    commonMistakes: [{ wrong: "Lunes voy al trabajo.", right: "El lunes voy al trabajo.", why: "“On Monday” needs el in Spanish." }],
    related: ["articles", "plurals"],
  },
  {
    id: "hay",
    title: "Hay — there is, there are",
    tagline: "One word that never changes.",
    status: "available",
    summary: {
      heading: "Hay + something",
      body: ["Use **hay** to say something exists: **Hay un banco aquí.** It's the same for one or many — **hay un banco**, **hay dos bancos**. It never becomes “son” or “están”."],
      examples: [
        { es: "Hay un hotel cerca.", en: "There's a hotel nearby." },
        { es: "Hay dos farmacias.", en: "There are two pharmacies." },
      ],
    },
    deepDive: [
      { heading: "Hay vs. está", body: ["**Hay** introduces something new or unspecified (**un** banco, **dos** bancos, no article). **Está / están** locates something specific you both know (**el** banco, **la** escuela)."], examples: [{ es: "Hay un banco en la calle.", en: "There's a bank on the street." }, { es: "El banco está en la calle.", en: "The bank is on the street." }] },
      { heading: "Questions", body: ["**¿Hay un baño aquí?** = “Is there a bathroom here?” — a very handy question to know."] },
    ],
    commonMistakes: [{ wrong: "Hay los bancos aquí.", right: "Hay bancos aquí.", why: "Hay introduces something new, so it takes un/una/numbers or nothing — not el/la/los/las." }],
    related: ["estar", "articles"],
  },
  {
    id: "al-del",
    title: "al and del",
    tagline: "Two little contractions you'll use all the time.",
    status: "available",
    summary: {
      heading: "a + el = al · de + el = del",
      body: ["When **a** or **de** meets **el**, they squash together: **voy al mercado** (not “a el”), **al lado del banco** (not “de el”). It only happens with **el** — never la, los or las."],
      table: {
        headers: ["", "with el", "with la"],
        rows: [["to / at", "al", "a la"], ["of / from", "del", "de la"]],
      },
      examples: [
        { es: "Voy al mercado.", en: "I'm going to the market." },
        { es: "Voy a la escuela.", en: "I'm going to school." },
      ],
    },
    deepDive: [{ heading: "Not with people's names", body: ["The contraction needs **el** to be a real article. **Voy a El Paso** keeps the capital E because it's part of a name."] }],
    commonMistakes: [{ wrong: "Voy a el mercado.", right: "Voy al mercado.", why: "a + el always contracts to al." }],
    related: ["articles", "ir-a-infinitive"],
  },
  {
    id: "irregular-yo",
    title: "Irregular “yo” verbs",
    tagline: "Only the I-form breaks the pattern: hago, salgo, veo.",
    status: "available",
    summary: {
      heading: "Just one odd form",
      body: ["Many common verbs are completely regular **except** the **yo** form. Every other form follows the normal endings."],
      table: {
        headers: ["", "hacer", "salir", "ver", "saber"],
        rows: [["yo", "hago", "salgo", "veo", "sé"], ["tú", "haces", "sales", "ves", "sabes"], ["él / ella / usted", "hace", "sale", "ve", "sabe"], ["nosotros", "hacemos", "salimos", "vemos", "sabemos"], ["ellos / ustedes", "hacen", "salen", "ven", "saben"]],
      },
    },
    deepDive: [
      { heading: "The “-go” family", body: ["Many verbs add **-g-** in the yo form: **tengo, hago, salgo, vengo, pongo**. You already know **tengo**."] },
      { heading: "Venir does two things", body: ["**Venir** has the -go yo form *and* the boot change: **vengo, vienes, viene, venimos, vienen**."] },
    ],
    commonMistakes: [{ wrong: "Yo hacer la tarea.", right: "Yo hago la tarea.", why: "Conjugate the verb: the yo form of hacer is hago." }, { wrong: "Yo salo de casa.", right: "Yo salgo de casa.", why: "Salir takes -g- in the yo form: salgo." }],
    related: ["present-regular", "stem-changing", "tener"],
  },
  {
    id: "negation",
    title: "Saying no: no, nunca",
    tagline: "Put no before the verb — and Spanish happily doubles up.",
    status: "available",
    summary: {
      heading: "No + verb",
      body: ["To make a sentence negative, put **no** right before the verb: **No hablo inglés.** There's no “do not” — just **no**. Spanish also allows (and expects) **double negatives**: **No bebo café nunca** = **Nunca bebo café.**"],
      examples: [
        { es: "No trabajo los domingos.", en: "I don't work on Sundays." },
        { es: "Nunca como carne.", en: "I never eat meat." },
        { es: "No como carne nunca.", en: "I never eat meat. (same meaning)" },
      ],
    },
    deepDive: [
      { heading: "Nunca before or after", body: ["If **nunca** comes **before** the verb, you don't need **no**: *Nunca bebo café.* If it comes **after**, add **no** first: *No bebo café nunca.*"] },
      { heading: "Answering a question", body: ["Spanish often says no twice: **¿Hablas inglés? — No, no hablo inglés.** The first **no** is the answer; the second negates the verb."] },
    ],
    commonMistakes: [{ wrong: "Yo no hablo no inglés.", right: "No hablo inglés.", why: "Only one no goes before the verb." }],
    related: ["present-regular"],
  },
  {
    id: "telling-time",
    title: "Telling time",
    tagline: "Es la una, son las tres — and y media, y cuarto.",
    status: "available",
    summary: {
      heading: "Es la una · Son las…",
      body: ["Use **es la** for one o'clock and **son las** for every other hour. Add **y cuarto** (+15), **y media** (+30) or **menos cuarto** (−15, counting down to the next hour). To say “at”, use **a la / a las**."],
      table: {
        headers: ["Time", "Spanish"],
        rows: [["1:00", "Es la una."], ["3:00", "Son las tres."], ["3:15", "Son las tres y cuarto."], ["3:30", "Son las tres y media."], ["3:45", "Son las cuatro menos cuarto."], ["at 8:00", "a las ocho"]],
      },
    },
    deepDive: [
      { heading: "Asking", body: ["**¿Qué hora es?** asks the time now. **¿A qué hora…?** asks when something happens: **¿A qué hora es la fiesta?** — **A las nueve.**"] },
      { heading: "Morning, afternoon, night", body: ["Instead of a.m./p.m., Spanish adds **de la mañana**, **de la tarde** or **de la noche**: **las ocho de la mañana**, **las ocho de la noche**. Mexican schedules often use the 24-hour clock in writing."] },
    ],
    commonMistakes: [{ wrong: "Es las tres.", right: "Son las tres.", why: "Plural hours (2–12) use son las; only one o'clock is es la una." }],
    related: ["ser", "ir-a-infinitive"],
  },
  {
    id: "big-numbers",
    title: "Big numbers",
    tagline: "Thirty-five, a hundred, a thousand — and the y in the middle.",
    status: "available",
    summary: {
      heading: "Tens, y, units",
      body: ["From 31 up, join tens and units with **y**: **treinta y cinco** (35). Twenty-one to twenty-nine are a single word (**veintiuno… veintinueve**). Exactly 100 is **cien**; with more it's **ciento**: ciento diez."],
      table: {
        headers: ["", "Spanish"],
        rows: [["35", "treinta y cinco"], ["99", "noventa y nueve"], ["100", "cien"], ["110", "ciento diez"], ["200", "doscientos"], ["500", "quinientos"], ["1,000", "mil"]],
      },
    },
    deepDive: [
      { heading: "Hundreds agree", body: ["200–900 change with the noun: **doscientos pesos**, **doscientas casas**. Memorize the odd one: **quinientos** (500), **setecientos** (700), **novecientos** (900)."] },
      { heading: "A thousand", body: ["**Mil** doesn't take a plural: **mil pesos**, **dos mil pesos**. Years are said as numbers: 1985 = mil novecientos ochenta y cinco."] },
    ],
    commonMistakes: [{ wrong: "treinta cinco", right: "treinta y cinco", why: "From 31 onward, tens and units are joined by y." }],
    related: ["plurals", "adjective-agreement"],
  },
  {
    id: "personal-a",
    title: "The personal “a”",
    tagline: "A tiny word before people: llamo a mi jefe.",
    status: "available",
    summary: {
      heading: "A before a person",
      body: ["When the thing receiving the action is a **specific person** (or a pet), put **a** before it: **Llamo a mi jefe.** For things, no **a**: **Veo el banco.** English has nothing like it — it just has to become a habit."],
      examples: [
        { es: "Ayudo a mi compañero.", en: "I help my coworker." },
        { es: "Veo a Ana.", en: "I see Ana." },
        { es: "Veo el banco.", en: "I see the bank." },
      ],
    },
    deepDive: [
      { heading: "With al", body: ["The personal **a** contracts with **el**: **Llamo al jefe.** (a + el = al)."] },
      { heading: "Questions", body: ["Ask about the person with **¿a quién?**: **¿A quién llamas?** — **Llamo a mi jefe.**"] },
      { heading: "When it's missing", body: ["After **tener** you usually drop it: **Tengo dos hermanos.** And it's not used with **ser** or **estar**."] },
    ],
    commonMistakes: [{ wrong: "Llamo mi jefe.", right: "Llamo a mi jefe.", why: "A person receiving the action needs the personal a." }],
    related: ["al-del", "present-regular"],
  },
  {
    id: "gustar",
    title: "Gustar — saying what you like",
    tagline: "Spanish says “it pleases me”.",
    status: "available",
    summary: {
      heading: "Me gusta / me gustan",
      body: ["Spanish doesn't say “I like tacos” — it says “tacos please me”. The **thing you like** is the subject, so the verb matches **it**: **gusta** for one thing (or an action), **gustan** for several."],
      table: {
        headers: ["Who likes it", "one thing / action", "several things"],
        rows: [["I", "me gusta", "me gustan"], ["you", "te gusta", "te gustan"], ["he / she / you (formal)", "le gusta", "le gustan"], ["we", "nos gusta", "nos gustan"], ["they / you all", "les gusta", "les gustan"]],
      },
      examples: [
        { es: "Me gusta el café.", en: "I like coffee." },
        { es: "Me gustan los tacos.", en: "I like tacos." },
        { es: "Me gusta bailar.", en: "I like to dance." },
      ],
    },
    deepDive: [
      { heading: "Saying no, and loving things", body: ["Put **no** first: **No me gusta el café.** For stronger feelings use **encantar**: **Me encanta bailar** (I love dancing), **Me encantan los tacos**."] },
      { heading: "Adding “me too”", body: ["To contrast, add **a mí / a ti**: **A mí me gusta el café, ¿y a ti?** — “I like coffee; do you?”"] },
    ],
    commonMistakes: [{ wrong: "Me gusta los tacos.", right: "Me gustan los tacos.", why: "Tacos is plural, so the verb is plural: gustan." }, { wrong: "Yo gusto el café.", right: "Me gusta el café.", why: "Gustar doesn't take yo — the thing you like is the subject." }],
    related: ["negation", "plurals"],
  },
];
