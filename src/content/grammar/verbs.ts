import type { GrammarConcept } from "../types";

export const VERB_CONCEPTS: GrammarConcept[] = [
  {
    id: "ser",
    title: "SER — to be",
    tagline: "Who or what something is.",
    status: "available",
    summary: {
      heading: "SER",
      body: [
        "Use **ser** for identity and characteristics that don't change quickly: who you are, where you're from, your job, what something is like.",
      ],
      table: {
        caption: "ser — present tense",
        headers: ["", "ser"],
        rows: [
          ["yo", "soy"],
          ["tú", "eres"],
          ["él / ella / usted", "es"],
          ["nosotros", "somos"],
          ["ellos / ustedes", "son"],
        ],
      },
      examples: [
        { es: "Soy estudiante.", en: "I'm a student." },
        { es: "Ella es de México.", en: "She's from Mexico." },
      ],
    },
    deepDive: [
      {
        heading: "When to use SER",
        body: ["Think **DOCTOR**: **D**escription, **O**ccupation, **C**haracteristic, **T**ime, **O**rigin, **R**elationship."],
        examples: [
          { es: "Mi hermano es alto.", en: "My brother is tall. (description)" },
          { es: "Ana es maestra.", en: "Ana is a teacher. (occupation)" },
          { es: "Somos de México.", en: "We're from Mexico. (origin)" },
          { es: "Ella es mi amiga.", en: "She's my friend. (relationship)" },
        ],
      },
      {
        heading: "It's irregular",
        body: ["**Ser** doesn't follow any pattern — you simply have to learn soy, eres, es, somos, son. Because you'll use them constantly, they'll stick fast."],
      },
    ],
    commonMistakes: [{ wrong: "Yo estoy estudiante.", right: "Yo soy estudiante.", why: "Being a student is part of who you are — that's ser." }],
    related: ["estar", "ser-vs-estar"],
  },
  {
    id: "estar",
    title: "ESTAR — to be",
    tagline: "How you feel and where things are.",
    status: "available",
    summary: {
      heading: "ESTAR",
      body: ["Use **estar** for temporary states and feelings (tired, happy, busy) and for **where** things and people are."],
      table: {
        caption: "estar — present tense",
        headers: ["", "estar"],
        rows: [
          ["yo", "estoy"],
          ["tú", "estás"],
          ["él / ella / usted", "está"],
          ["nosotros", "estamos"],
          ["ellos / ustedes", "están"],
        ],
      },
      examples: [
        { es: "Estoy cansado.", en: "I'm tired." },
        { es: "Estamos en casa.", en: "We're at home." },
      ],
    },
    deepDive: [
      {
        heading: "When to use ESTAR",
        body: ["Think **PLACE**: **P**osition, **L**ocation, **A**ction in progress, **C**ondition, **E**motion."],
        examples: [
          { es: "Estoy aquí.", en: "I'm here. (location)" },
          { es: "Hoy estoy ocupado.", en: "Today I'm busy. (condition)" },
          { es: "Estoy contento.", en: "I'm happy. (emotion)" },
        ],
      },
      {
        heading: "Accents on estar",
        body: ["Most forms carry an accent: **estás, está, están**. The accent keeps the stress where it belongs — and tells **está** (is) apart from **esta** (this)."],
      },
    ],
    commonMistakes: [
      {
        wrong: "Yo soy cansado.",
        right: "Yo estoy cansado.",
        why: "SER usually describes identity or inherent characteristics. ESTAR is used for temporary states such as being tired.",
      },
    ],
    related: ["ser", "ser-vs-estar"],
  },
  {
    id: "ser-vs-estar",
    title: "SER vs. ESTAR",
    tagline: "The most famous choice in Spanish.",
    status: "available",
    summary: {
      heading: "Ask yourself one question",
      body: ["Is it **who or what it is** (ser) — or **how or where it is right now** (estar)?"],
      table: {
        headers: ["", "ser", "estar"],
        rows: [
          ["Think", "identity, traits", "states, location"],
          ["Lasts", "lasting", "temporary"],
          ["Example", "Ana es simpática.", "Ana está cansada."],
        ],
      },
    },
    deepDive: [
      {
        heading: "Same adjective, different meaning",
        body: ["Some adjectives change meaning with the verb — a great way to feel the difference."],
        examples: [
          { es: "Él es aburrido.", en: "He is boring. (his nature)" },
          { es: "Él está aburrido.", en: "He is bored. (how he feels now)" },
          { es: "Ella es lista.", en: "She is smart." },
          { es: "Ella está lista.", en: "She is ready." },
        ],
      },
      {
        heading: "Location vs. events",
        body: ["Use **estar** for where things *are*: **El taco está en la mesa.** But use **ser** for where an *event* takes place: **La fiesta es en mi casa.**"],
      },
    ],
    commonMistakes: [{ wrong: "Ella es en casa.", right: "Ella está en casa.", why: "Where a person is located → estar." }],
    related: ["ser", "estar"],
  },
  {
    id: "tener",
    title: "TENER — to have",
    tagline: "Have — and age, hunger, cold…",
    status: "available",
    summary: {
      heading: "TENER",
      body: ["**Tener** means “to have”. Spanish also uses it where English uses “to be”: for age and for many physical feelings."],
      table: {
        caption: "tener — present tense",
        headers: ["", "tener"],
        rows: [
          ["yo", "tengo"],
          ["tú", "tienes"],
          ["él / ella / usted", "tiene"],
          ["nosotros", "tenemos"],
          ["ellos / ustedes", "tienen"],
        ],
      },
      examples: [
        { es: "Tengo treinta años.", en: "I'm thirty years old." },
        { es: "Tengo sueño.", en: "I'm sleepy." },
      ],
    },
    deepDive: [
      {
        heading: "Spanish “has” feelings",
        body: ["Where English says “I am hungry/cold/hot”, Spanish says “I have hunger/cold/heat”:"],
        examples: [
          { es: "Tengo hambre.", en: "I'm hungry." },
          { es: "Tengo sed.", en: "I'm thirsty." },
          { es: "Tengo frío / calor.", en: "I'm cold / hot." },
          { es: "Tengo prisa.", en: "I'm in a hurry." },
        ],
      },
      {
        heading: "A boot verb",
        body: ["Tener changes its stem vowel (e → ie) in most forms — **tienes, tiene, tienen** — and has an irregular **tengo**. Only **tenemos** stays regular."],
      },
    ],
    commonMistakes: [
      { wrong: "Soy treinta años.", right: "Tengo treinta años.", why: "Age uses tener (“I have thirty years”), never ser." },
      { wrong: "Estoy hambre.", right: "Tengo hambre.", why: "Hunger is something you “have” in Spanish." },
    ],
    related: ["stem-changing"],
  },
  {
    id: "stem-changing",
    title: "Stem-changing verbs",
    tagline: "Verbs with a “boot” — the vowel shifts.",
    status: "available",
    summary: {
      heading: "The boot",
      body: [
        "In some verbs the vowel in the stem changes in every form **except nosotros**. For **querer**, e → ie. Draw a line around the changing forms and they make a boot shape.",
      ],
      table: {
        caption: "querer (e → ie)",
        headers: ["", "querer"],
        rows: [
          ["yo", "quiero"],
          ["tú", "quieres"],
          ["él / ella / usted", "quiere"],
          ["nosotros", "queremos"],
          ["ellos / ustedes", "quieren"],
        ],
      },
      examples: [{ es: "Quiero comer.", en: "I want to eat." }],
    },
    deepDive: [
      {
        heading: "Three common patterns",
        body: [
          "**e → ie**: querer (quiero), tener (tienes), pensar (pienso)",
          "**o → ue**: poder (puedo), dormir (duermo), volver (vuelvo)",
          "**e → i**: pedir (pido), servir (sirvo)",
        ],
      },
      {
        heading: "Verb + infinitive",
        body: ["After **querer**, the next verb stays in its infinitive: **Quiero hablar**, **Queremos comer**. One conjugated verb, one infinitive — that's the whole pattern."],
      },
    ],
    commonMistakes: [{ wrong: "Yo quero comer.", right: "Yo quiero comer.", why: "The stem changes e → ie, even in the yo form." }],
    related: ["present-regular", "tener"],
  },
  {
    id: "ir-a-infinitive",
    title: "IR + a + verb",
    tagline: "Going to… — the easiest way to talk about the future.",
    status: "available",
    summary: {
      heading: "Voy a comer",
      body: ["Conjugate **ir**, add **a**, then an infinitive: **Voy a comer** = “I'm going to eat.” You get the future without learning a new tense."],
      table: {
        caption: "ir — present tense",
        headers: ["", "ir"],
        rows: [
          ["yo", "voy"],
          ["tú", "vas"],
          ["él / ella / usted", "va"],
          ["nosotros", "vamos"],
          ["ellos / ustedes", "van"],
        ],
      },
      examples: [
        { es: "Voy a casa.", en: "I'm going home." },
        { es: "Vamos a comer.", en: "We're going to eat. / Let's eat." },
      ],
    },
    deepDive: [
      {
        heading: "Two jobs for ir + a",
        body: [
          "**Ir a + place**: *Voy a casa. Vamos al trabajo.*",
          "**Ir a + infinitive**: *Voy a hablar con mi madre.* (I'm going to talk to my mother.)",
        ],
      },
      {
        heading: "“Vamos” means let's",
        body: ["**¡Vamos!** = “Let's go!” and **Vamos a comer** = “Let's eat.” Same form as “we go”."],
      },
    ],
    commonMistakes: [{ wrong: "Voy comer.", right: "Voy a comer.", why: "Don't drop the a — ir a + infinitive." }],
    related: ["stem-changing"],
  },
  {
    id: "present-regular",
    title: "Regular present tense",
    tagline: "One pattern, hundreds of verbs.",
    status: "available",
    summary: {
      heading: "Drop the ending, add yours",
      body: ["Remove **-ar / -er / -ir** from the infinitive and add the endings below. This one pattern covers hundreds of verbs."],
      table: {
        headers: ["", "hablar", "comer", "vivir"],
        rows: [
          ["yo", "hablo", "como", "vivo"],
          ["tú", "hablas", "comes", "vives"],
          ["él / ella / usted", "habla", "come", "vive"],
          ["nosotros", "hablamos", "comemos", "vivimos"],
          ["ellos / ustedes", "hablan", "comen", "viven"],
        ],
      },
    },
    deepDive: [
      {
        heading: "The endings at a glance",
        body: [
          "**-ar** verbs: -o, -as, -a, -amos, -an",
          "**-er** verbs: -o, -es, -e, -emos, -en",
          "**-ir** verbs: -o, -es, -e, -imos, -en",
          "Notice that -er and -ir are almost identical — only nosotros differs.",
        ],
      },
      {
        heading: "One verb, two English meanings",
        body: ["Spanish present covers both English forms: **Hablo español** = “I speak Spanish” and “I'm speaking Spanish”."],
      },
      {
        heading: "More verbs for the pattern",
        body: ["**-ar**: trabajar, estudiar, tomar, necesitar. **-er**: beber, aprender, leer. **-ir**: escribir, abrir, vivir."],
      },
    ],
    commonMistakes: [{ wrong: "Yo hablas español.", right: "Yo hablo español.", why: "The ending must match the subject: yo → -o." }],
    related: ["stem-changing", "subject-pronouns"],
  },
  {
    id: "polite-requests",
    title: "Polite requests",
    tagline: "Quiero vs. quisiera — asking without sounding blunt.",
    status: "available",
    summary: {
      heading: "Soften your request",
      body: [
        "**Quiero** (“I want”) is direct but perfectly fine with friends. In restaurants and shops, **quisiera** (“I'd like”) and **por favor** sound warmer.",
      ],
      examples: [
        { es: "Quiero un café.", en: "I want a coffee. (direct)" },
        { es: "Quisiera un café, por favor.", en: "I'd like a coffee, please. (polite)" },
        { es: "Para mí, unos tacos.", en: "For me, some tacos. (ordering)" },
      ],
    },
    deepDive: [
      {
        heading: "How servers talk to you",
        body: ["Servers use **usted**: **¿Qué desea?** (What would you like?) or **¿Qué van a tomar?** (What will you all drink?). You can answer with **quisiera…** or **para mí…**."],
      },
      {
        heading: "Mexican restaurant manners",
        body: ["Greet first (**Buenas tardes**), order, and say **gracias**. The check won't arrive until you ask: **La cuenta, por favor.** Say **¡buen provecho!** to people who are eating."],
      },
    ],
    related: ["stem-changing"],
  },
];
