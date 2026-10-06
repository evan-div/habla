import type { GrammarConcept } from "../types";

export const FOUNDATIONS: GrammarConcept[] = [
  {
    id: "tu-vs-usted",
    title: "Tú vs. usted",
    tagline: "Two ways to say “you” — friendly or respectful.",
    status: "available",
    summary: {
      heading: "Which “you”?",
      body: [
        "Spanish has two ways to say “you” to one person. **Tú** is for friends, family, kids and people your age. **Usted** is for elders, strangers and anyone you want to treat with respect.",
        "The verb changes with it: **¿Cómo estás?** (tú) becomes **¿Cómo está?** (usted).",
      ],
      examples: [
        { es: "¿Cómo estás, Luis?", en: "How are you, Luis? (a friend)" },
        { es: "¿Cómo está usted, señora?", en: "How are you, ma'am? (respectful)" },
      ],
      table: {
        headers: ["", "Tú", "Usted"],
        rows: [
          ["Feels", "friendly, casual", "polite, respectful"],
          ["Use with", "friends, family, peers, kids", "elders, strangers, customers, bosses"],
          ["How are you?", "¿Cómo estás?", "¿Cómo está?"],
        ],
      },
    },
    deepDive: [
      {
        heading: "Mexico likes usted",
        body: [
          "Mexicans use **usted** more than many learners expect — with older people, in shops and restaurants, with someone's parents. Some families even use usted between children and grandparents.",
          "If you're unsure, start with usted. If the other person wants you to relax, they'll say “tutéame” or “háblame de tú”.",
        ],
      },
      {
        heading: "What about vos?",
        body: [
          "In some countries (Argentina, Uruguay, much of Central America) **vos** replaces or joins tú. In Mexico it's tú, so that's what this course teaches.",
        ],
      },
    ],
    commonMistakes: [
      { wrong: "¿Cómo estás usted?", right: "¿Cómo está usted?", why: "Usted takes the same verb form as él/ella (está), not the tú form (estás)." },
    ],
    related: ["subject-pronouns"],
  },
  {
    id: "subject-pronouns",
    title: "Subject pronouns",
    tagline: "Who's doing it — and why you can often skip it.",
    status: "available",
    summary: {
      heading: "Yo, tú, él…",
      body: [
        "Spanish verbs change to show who's acting, so the pronoun is often **dropped**: **Soy Ana** is more natural than “Yo soy Ana”. Use the pronoun to contrast or emphasize: **Yo** soy de México, ¿y **tú**?",
      ],
      table: {
        headers: ["", "Singular", "Plural"],
        rows: [
          ["1st person", "yo (I)", "nosotros / nosotras (we)"],
          ["2nd person", "tú (you) · usted (you, formal)", "ustedes (you all)"],
          ["3rd person", "él (he) · ella (she)", "ellos / ellas (they)"],
        ],
      },
    },
    deepDive: [
      {
        heading: "Ustedes, not vosotros",
        body: [
          "In Mexico and all of Latin America, **ustedes** is the only plural “you”. Spain also uses **vosotros** for informal groups — you'll see it in textbooks, but you won't need it here.",
        ],
      },
      {
        heading: "Usted and ustedes borrow the “he/she/they” verb",
        body: [
          "Usted uses the same verb ending as **él/ella**; ustedes uses the same as **ellos/ellas**. That's why every conjugation table in this course has just five rows: yo, tú, él/ella/usted, nosotros, ellos/ustedes.",
        ],
      },
    ],
    commonMistakes: [{ wrong: "Tú es mi amigo.", right: "Tú eres mi amigo.", why: "Each pronoun needs its own verb ending: tú → eres, él/ella → es." }],
    related: ["tu-vs-usted", "ser"],
  },
  {
    id: "questions",
    title: "Asking questions",
    tagline: "¿Cómo? ¿Dónde? ¿Cuántos? — and the upside-down mark.",
    status: "available",
    summary: {
      heading: "Question words",
      body: [
        "Spanish questions open with **¿** and close with **?**. Question words always carry an accent. Unlike English, you don't need “do/does”: **¿Dónde vives?** = “Where do you live?”",
      ],
      table: {
        headers: ["Word", "Means", "Example"],
        rows: [
          ["¿Cómo…?", "how / what", "¿Cómo te llamas?"],
          ["¿Dónde…?", "where", "¿Dónde vives?"],
          ["¿De dónde…?", "from where", "¿De dónde eres?"],
          ["¿Cuántos…?", "how many", "¿Cuántos años tienes?"],
          ["¿Qué…?", "what", "¿Qué quieres comer?"],
        ],
      },
    },
    deepDive: [
      {
        heading: "Yes/no questions",
        body: ["Take a statement and raise your voice at the end — and add the ¿ ? marks in writing. **Hablas inglés.** → **¿Hablas inglés?**"],
      },
      {
        heading: "Accents mark the question",
        body: [
          "**Dónde**, **cómo**, **qué** have an accent when they ask a question, and lose it otherwise: *Vivo donde vive mi familia.* The accent is how Spanish tells the two apart.",
        ],
      },
    ],
    commonMistakes: [{ wrong: "¿Donde vives?", right: "¿Dónde vives?", why: "Question words keep their accent mark." }],
    related: ["ser"],
  },
  {
    id: "adjective-agreement",
    title: "Adjective agreement",
    tagline: "Describing words match the person or thing they describe.",
    status: "available",
    summary: {
      heading: "Match the ending",
      body: [
        "Adjectives change to match the gender of what they describe: **-o** for masculine, **-a** for feminine. Adjectives ending in **-e** (and most ending in a consonant) stay the same for both.",
      ],
      table: {
        headers: ["Masculine", "Feminine", "Same for both"],
        rows: [
          ["mexicano", "mexicana", "canadiense"],
          ["cansado", "cansada", "grande"],
          ["contento", "contenta", "estadounidense"],
        ],
      },
      examples: [
        { es: "Él es mexicano.", en: "He is Mexican." },
        { es: "Ella es mexicana.", en: "She is Mexican." },
        { es: "Ella es canadiense.", en: "She is Canadian." },
      ],
    },
    deepDive: [
      {
        heading: "You are the one being described",
        body: [
          "When you describe yourself, the ending depends on **you**: a man says **Soy mexicano** and **Estoy cansado**; a woman says **Soy mexicana** and **Estoy cansada**.",
          "Same with “pleased to meet you”: men say **encantado**, women say **encantada**.",
        ],
      },
      {
        heading: "Plural too",
        body: ["Add **-s** for plural: **mexicanos**, **cansadas**. Adjectives agree in gender *and* number: **Ellos son mexicanos. Ellas están cansadas.**"],
      },
    ],
    commonMistakes: [{ wrong: "Ana es mexicano.", right: "Ana es mexicana.", why: "Ana is female, so the adjective takes -a." }],
    related: ["gender", "plurals"],
  },
  {
    id: "gender",
    title: "Noun gender",
    tagline: "Every noun is masculine or feminine — even tables.",
    status: "available",
    summary: {
      heading: "El or la?",
      body: [
        "Every Spanish noun has a grammatical gender. Most nouns ending in **-o** are masculine and most ending in **-a** are feminine. For people, gender follows the person.",
      ],
      table: {
        headers: ["Masculine (el)", "Feminine (la)"],
        rows: [
          ["el hermano", "la hermana"],
          ["el amigo", "la amiga"],
          ["el niño", "la niña"],
          ["el hombre", "la mujer"],
        ],
      },
    },
    deepDive: [
      {
        heading: "Learn the article with the noun",
        body: ["Don't memorize “madre”. Memorize **la madre**. The article is your gender cheat sheet — you'll hear it every time the word is used."],
      },
      {
        heading: "Common exceptions",
        body: [
          "A few nouns break the -o/-a pattern: **el día** (day), **el mapa**, **la mano** (hand). Many words ending in **-ción** and **-dad** are feminine: **la canción**, **la ciudad**.",
          "Some nouns serve both genders with only the article changing: **el estudiante / la estudiante**.",
        ],
      },
    ],
    commonMistakes: [{ wrong: "el madre", right: "la madre", why: "Madre is feminine, so it takes la." }],
    related: ["articles", "adjective-agreement"],
  },
  {
    id: "articles",
    title: "Articles: el, la, un, una",
    tagline: "“The” and “a” — four forms each.",
    status: "available",
    summary: {
      heading: "Match gender and number",
      body: [
        "Articles match the noun. **El** niño, **la** niña, **los** niños, **las** niñas. For “a/an” use **un** (masculine) or **una** (feminine).",
      ],
      table: {
        headers: ["", "Masculine", "Feminine"],
        rows: [
          ["the (singular)", "el", "la"],
          ["the (plural)", "los", "las"],
          ["a / an", "un", "una"],
          ["some", "unos", "unas"],
        ],
      },
    },
    deepDive: [
      {
        heading: "When Spanish skips the article",
        body: [
          "After **ser**, jobs don't take an article: **Soy maestra** (not “soy una maestra”). Languages after **hablar** don't either: **Hablo español**.",
        ],
      },
      {
        heading: "al and del",
        body: ["**a + el** merges to **al**: *Voy al trabajo.* **de + el** merges to **del**: *la casa del niño*. Only with **el** — never with la, los or las."],
      },
    ],
    commonMistakes: [{ wrong: "Hablo el español.", right: "Hablo español.", why: "After hablar, the language name usually appears without an article." }],
    related: ["gender", "plurals"],
  },
  {
    id: "plurals",
    title: "Plurals",
    tagline: "Add -s or -es — and everything agrees.",
    status: "available",
    summary: {
      heading: "More than one",
      body: [
        "After a vowel add **-s**; after a consonant add **-es**. Articles and adjectives turn plural too: **los** niños simpático**s**.",
      ],
      table: {
        headers: ["Singular", "Plural"],
        rows: [
          ["el amigo", "los amigos"],
          ["la mujer", "las mujeres"],
          ["un niño", "unos niños"],
          ["la persona", "las personas"],
        ],
      },
    },
    deepDive: [
      {
        heading: "Mixed groups",
        body: ["A group with at least one male (or of unknown gender) uses the masculine plural: **hermanos** can mean “brothers” or “brothers and sisters”; **padres** means “parents”."],
      },
      {
        heading: "Spelling changes",
        body: ["Words ending in **-z** change to **-ces**: *lápiz → lápices*. Accents can drop or appear to keep the stress: *canción → canciones*."],
      },
    ],
    commonMistakes: [{ wrong: "los mujeres", right: "las mujeres", why: "Mujer is feminine, so the plural article is las." }],
    related: ["articles", "gender"],
  },
  {
    id: "possessives",
    title: "Possessives: mi, tu, su",
    tagline: "My, your, his, her — matching the thing owned.",
    status: "available",
    summary: {
      heading: "Whose is it?",
      body: [
        "Possessives agree with **what is owned**, not with the owner: **mi** hermano, **mis** hermanos. They only change for number (and nuestro/a for gender).",
      ],
      table: {
        headers: ["", "one thing", "several things"],
        rows: [
          ["my", "mi", "mis"],
          ["your (informal)", "tu", "tus"],
          ["his / her / their / your (formal)", "su", "sus"],
        ],
      },
      examples: [
        { es: "Mi madre es maestra.", en: "My mother is a teacher." },
        { es: "Tus amigos son simpáticos.", en: "Your friends are nice." },
      ],
    },
    deepDive: [
      {
        heading: "Su can be anyone",
        body: ["**Su casa** can mean his, her, their or your (formal) house. Context usually decides; to be clear, say **la casa de Ana**."],
      },
      {
        heading: "Watch the accent",
        body: ["**tu** = your; **tú** = you. **mi** = my; **mí** = me (after para: *para mí*). The accent is the whole difference."],
      },
    ],
    commonMistakes: [{ wrong: "mi amigos", right: "mis amigos", why: "Several friends → plural possessive: mis." }],
    related: ["plurals", "articles"],
  },
];
