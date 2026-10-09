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
];
