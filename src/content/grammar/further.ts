import type { GrammarConcept } from "../types";

/** Future (Unit 19), comparisons (Unit 20) and the conditional (Unit 21). */
export const FURTHER_CONCEPTS: GrammarConcept[] = [
  {
    id: "future-regular",
    title: "Future tense: regular verbs",
    tagline: "Hablaré, comerás, vivirá — what will happen.",
    status: "available",
    summary: {
      heading: "Infinitive + endings",
      body: ["The future is the easiest tense to build: keep the whole **infinitive** and add **-é, -ás, -á, -emos, -án**. It's the same for **-ar, -er and -ir** verbs."],
      table: {
        caption: "hablar — future",
        headers: ["", "hablar"],
        rows: [["yo", "hablaré"], ["tú", "hablarás"], ["él / ella / usted", "hablará"], ["nosotros", "hablaremos"], ["ellos / ustedes", "hablarán"]],
      },
      examples: [
        { es: "Mañana hablaré con mi jefe.", en: "Tomorrow I will talk to my boss." },
        { es: "Algún día viviremos en México.", en: "Someday we'll live in Mexico." },
      ],
    },
    deepDive: [
      { heading: "Stress and accents", body: ["Every form except **nosotros** carries a written accent: **hablaré, hablarás, hablará, hablarán**. Say them with the stress on the last syllable."] },
      { heading: "Future vs. ir a", body: ["You already know **ir a + infinitive** (“going to”). In everyday speech, Mexicans use it far more than the future for plans (**voy a viajar**). The true future sounds a little more formal, firmer or more distant: promises, predictions, plans for later in life."] },
      { heading: "Present for the near future", body: ["Like English, Spanish often uses the present for scheduled events: **Mañana salgo a las ocho.**"] },
      { heading: "Time words", body: ["Look for **mañana, pronto, la próxima semana, el año que viene, algún día, dentro de…**"] },
    ],
    commonMistakes: [
      { wrong: "Mañana hablare con mi jefe.", right: "Mañana hablaré con mi jefe.", why: "Don't drop the accent: it marks the stress." },
      { wrong: "Yo iré hablar.", right: "Yo hablaré. / Voy a hablar.", why: "Use the future OR ir a — not both." },
    ],
    related: ["ir-a-infinitive", "future-irregular"],
  },
  {
    id: "future-irregular",
    title: "Future tense: irregular stems",
    tagline: "Tendré, haré, saldré — same endings, new stems.",
    status: "available",
    summary: {
      heading: "A handful of verbs change their stem",
      body: ["A dozen common verbs use a shortened stem, but take the **same endings**: **-é, -ás, -á, -emos, -án**."],
      table: {
        headers: ["Infinitive", "Stem", "yo form"],
        rows: [["tener", "tendr-", "tendré"], ["venir", "vendr-", "vendré"], ["salir", "saldr-", "saldré"], ["poner", "pondr-", "pondré"], ["poder", "podr-", "podré"], ["saber", "sabr-", "sabré"], ["querer", "querr-", "querré"], ["hacer", "har-", "haré"], ["decir", "dir-", "diré"]],
      },
      examples: [
        { es: "Mañana tendré mucho trabajo.", en: "Tomorrow I'll have a lot of work." },
        { es: "¿Qué harás el sábado?", en: "What will you do on Saturday?" },
      ],
    },
    deepDive: [
      { heading: "Spot the pattern", body: ["Three groups: the vowel drops (**poder → podr-, saber → sabr-, querer → querr-**), a **d** replaces the vowel (**tener → tendr-, venir → vendr-, salir → saldr-, poner → pondr-**), or the ending is cut (**hacer → har-, decir → dir-**)."] },
      { heading: "Compounds follow", body: ["Verbs built on these do the same: **mantener → mantendré**, **deshacer → desharé**."] },
      { heading: "Regular ones stay regular", body: ["**Ser** (seré), **estar** (estaré) and **ir** (iré) look irregular in the present but are regular in the future."] },
    ],
    commonMistakes: [
      { wrong: "Mañana teneré trabajo.", right: "Mañana tendré trabajo.", why: "Tener has the stem tendr- in the future." },
      { wrong: "¿Qué haceré?", right: "¿Qué haré?", why: "Hacer shortens to har-." },
    ],
    related: ["future-regular", "irregular-yo"],
  },
  {
    id: "future-conditions",
    title: "If sentences: si + present, future",
    tagline: "Si llueve, me quedaré en casa.",
    status: "available",
    summary: {
      heading: "Possible conditions",
      body: ["For something that might really happen, use **si** (no accent!) + **present**, then the **future** (or present) in the result. Never put the future right after **si**."],
      examples: [
        { es: "Si llueve, me quedaré en casa.", en: "If it rains, I'll stay home." },
        { es: "Si estudias, aprenderás.", en: "If you study, you'll learn." },
        { es: "Si tengo tiempo, te llamo.", en: "If I have time, I'll call you." },
      ],
    },
    deepDive: [
      { heading: "Si vs. sí", body: ["**Si** (if) has no accent. **Sí** (yes) has one. Say them aloud and they sound the same — the accent tells you which is which."] },
      { heading: "Order is flexible", body: ["**Me quedaré en casa si llueve.** is just as good. Use a comma when **si** comes first."] },
      { heading: "The result can be a command", body: ["**Si tienes hambre, come algo.** (If you're hungry, eat something.)"] },
    ],
    commonMistakes: [{ wrong: "Si lloverá, me quedaré.", right: "Si llueve, me quedaré.", why: "After si, use the present — not the future." }],
    related: ["future-regular"],
  },
  {
    id: "comparisons-more-less",
    title: "Comparing: más … que, menos … que",
    tagline: "More than, less than.",
    status: "available",
    summary: {
      heading: "más / menos + adjective + que",
      body: ["To compare two things, put **más** (more) or **menos** (less) before the adjective, then **que** (than). The adjective still agrees with the first noun."],
      table: {
        headers: ["", "Spanish"],
        rows: [["more … than", "más + adjective + que"], ["less … than", "menos + adjective + que"], ["more than (a number)", "más de + number"]],
      },
      examples: [
        { es: "Mi casa es más grande que tu casa.", en: "My house is bigger than your house." },
        { es: "La playa es más bonita que el parque.", en: "The beach is prettier than the park." },
        { es: "Tengo más de cien pesos.", en: "I have more than a hundred pesos." },
      ],
    },
    deepDive: [
      { heading: "Works with adverbs and nouns", body: ["**Habla más rápido que yo** (adverb); **Tengo menos tiempo que tú** (noun). The pattern never changes."] },
      { heading: "Numbers take de", body: ["Before a number, use **de**: **más de diez, menos de cien**."] },
      { heading: "No “-er” endings", body: ["Spanish has no **bigger/taller**: always **más grande, más alto**."] },
    ],
    commonMistakes: [
      { wrong: "Mi casa es más grande de tu casa.", right: "Mi casa es más grande que tu casa.", why: "“Than” is que (de only before a number)." },
      { wrong: "Es más bueno.", right: "Es mejor.", why: "Bueno has an irregular comparative: mejor." },
    ],
    related: ["adjective-agreement", "comparisons-equal"],
  },
  {
    id: "comparisons-equal",
    title: "Comparing: tan … como, tanto … como",
    tagline: "As … as, as much … as.",
    status: "available",
    summary: {
      heading: "tan + adjective + como; tanto + noun + como",
      body: ["For things that are equal, use **tan … como** with adjectives and adverbs, and **tanto … como** with nouns (**tanto** agrees with the noun)."],
      table: {
        headers: ["", "Spanish"],
        rows: [["as … as", "tan + adjective + como"], ["as much / many … as", "tanto/a/os/as + noun + como"]],
      },
      examples: [
        { es: "Mi coche es tan rápido como el tuyo.", en: "My car is as fast as yours." },
        { es: "No tengo tanto dinero como tú.", en: "I don't have as much money as you." },
        { es: "Tiene tantos amigos como yo.", en: "He has as many friends as I do." },
      ],
    },
    deepDive: [
      { heading: "Que vs. como", body: ["Unequal comparisons use **que**; equal ones use **como**. **Más … que, tan … como.**"] },
      { heading: "Tanto agrees", body: ["**tanto dinero, tanta comida, tantos coches, tantas fiestas**."] },
      { heading: "In the negative", body: ["**No es tan difícil como parece.** (It's not as hard as it seems.)"] },
    ],
    commonMistakes: [{ wrong: "Es tan grande que mi casa.", right: "Es tan grande como mi casa.", why: "Equal comparisons use como." }],
    related: ["comparisons-more-less"],
  },
  {
    id: "comparisons-irregular",
    title: "Irregular comparisons: mejor, peor, mayor, menor",
    tagline: "Better, worse, older, younger.",
    status: "available",
    summary: {
      heading: "Four adjectives have their own comparative",
      body: ["Don't say **más bueno** or **más malo**. Use these instead (they don't add **más**):"],
      table: {
        headers: ["", "Comparative", "Means"],
        rows: [["bueno / bien", "mejor", "better"], ["malo / mal", "peor", "worse"], ["grande (age)", "mayor", "older"], ["pequeño (age)", "menor", "younger"]],
      },
      examples: [
        { es: "Este café es mejor que ese.", en: "This coffee is better than that one." },
        { es: "Mi hermana es menor que yo.", en: "My sister is younger than me." },
      ],
    },
    deepDive: [
      { heading: "Mayor and menor", body: ["For **age**, use **mayor** (older) and **menor** (younger). For **size**, stay with **más grande / más pequeño**. **Mayor** is also the polite word for elderly: **una persona mayor**."] },
      { heading: "Plurals", body: ["**mejores, peores, mayores, menores** — they don't change for gender: **las mejores tortillas**."] },
      { heading: "Mejor as an adverb", body: ["**Habla mejor que yo.** (He speaks better than I do.) **Peor** works the same way."] },
    ],
    commonMistakes: [{ wrong: "Es más mejor.", right: "Es mejor.", why: "Mejor already means “more good”; never add más." }],
    related: ["comparisons-more-less", "superlatives"],
  },
  {
    id: "superlatives",
    title: "The most…: superlatives and -ísimo",
    tagline: "El más caro, la mejor, riquísimo.",
    status: "available",
    summary: {
      heading: "el / la / los / las + más + adjective + de",
      body: ["For “the most / the -est”, put an article before the comparative and use **de** for “in / of”. For “very, very”, add **-ísimo** to the adjective."],
      table: {
        headers: ["", "Spanish"],
        rows: [["the most …", "el / la más + adjective (+ de)"], ["the best / worst", "el / la mejor, el / la peor"], ["extremely …", "adjective + -ísimo"]],
      },
      examples: [
        { es: "Es el restaurante más caro de la ciudad.", en: "It's the most expensive restaurant in the city." },
        { es: "Ella es la mejor maestra.", en: "She's the best teacher." },
        { es: "La comida estaba riquísima.", en: "The food was really, really tasty." },
      ],
    },
    deepDive: [
      { heading: "In = de", body: ["After a superlative, “in” is **de**: **el más alto de la clase**, **la ciudad más grande del país**."] },
      { heading: "Making -ísimo", body: ["Drop the final vowel and add **-ísimo/a/os/as**: **caro → carísimo**, **grande → grandísimo**. Spelling shifts keep the sound: **rico → riquísimo**, **largo → larguísimo**. Mexican slang you know already: **padre → padrísimo**."] },
      { heading: "Mucho becomes muchísimo", body: ["**Gracias, muchísimas gracias.** **Hace muchísimo calor.**"] },
    ],
    commonMistakes: [{ wrong: "Es el más caro en la ciudad.", right: "Es el más caro de la ciudad.", why: "After a superlative, “in” is de." }],
    related: ["comparisons-irregular", "comparisons-more-less"],
  },
  {
    id: "conditional-regular",
    title: "Conditional: regular verbs",
    tagline: "Hablaría, comería, viviría — would.",
    status: "available",
    summary: {
      heading: "Infinitive + -ía endings",
      body: ["The conditional means **“would”**. Like the future, you keep the infinitive and add endings — here they're the same as the imperfect's **-ía** set: **-ía, -ías, -ía, -íamos, -ían**."],
      table: {
        caption: "hablar — conditional",
        headers: ["", "hablar"],
        rows: [["yo", "hablaría"], ["tú", "hablarías"], ["él / ella / usted", "hablaría"], ["nosotros", "hablaríamos"], ["ellos / ustedes", "hablarían"]],
      },
      examples: [
        { es: "Me gustaría viajar a Japón.", en: "I'd like to travel to Japan." },
        { es: "Yo comería tacos todos los días.", en: "I would eat tacos every day." },
      ],
    },
    deepDive: [
      { heading: "Three big jobs", body: ["**Polite requests** (¿Podrías ayudarme?), **wishes** (Me gustaría…), and **advice / hypotheticals** (Yo en tu lugar iría)."] },
      { heading: "Don't confuse it with the imperfect", body: ["**Hablaría** (I would speak) is not **hablaba** (I used to speak). For past habits, English “would” = imperfect: **De niño jugaba fútbol** (I would play soccer as a kid)."] },
      { heading: "Accents", body: ["Every conditional form has an accent on the **í**: **hablaría, hablarías, hablaríamos**."] },
    ],
    commonMistakes: [{ wrong: "Me gustaria.", right: "Me gustaría.", why: "The í needs its written accent." }],
    related: ["future-regular", "imperfect-regular", "polite-requests"],
  },
  {
    id: "conditional-irregular",
    title: "Conditional: irregular stems",
    tagline: "Tendría, haría, saldría — same stems as the future.",
    status: "available",
    summary: {
      heading: "Same stems as the future + -ía endings",
      body: ["Any verb that is irregular in the future uses the **same stem** in the conditional. Just swap the ending for **-ía, -ías, -ía, -íamos, -ían**."],
      table: {
        headers: ["Infinitive", "Future (yo)", "Conditional (yo)"],
        rows: [["tener", "tendré", "tendría"], ["venir", "vendré", "vendría"], ["salir", "saldré", "saldría"], ["poder", "podré", "podría"], ["querer", "querré", "querría"], ["hacer", "haré", "haría"], ["decir", "diré", "diría"]],
      },
      examples: [
        { es: "¿Podrías ayudarme?", en: "Could you help me?" },
        { es: "Yo en tu lugar haría eso.", en: "In your place, I would do that." },
      ],
    },
    deepDive: [
      { heading: "Podría is the star", body: ["**¿Podría…?** / **¿Podrías…?** is the polite way to ask: **¿Podría darme la cuenta?** (formal) / **¿Podrías ayudarme?** (friendly)."] },
      { heading: "Querría vs. quisiera", body: ["**Querría** works, but **quisiera** (which you know) is more common for polite wishes. Both mean “I would like”."] },
    ],
    commonMistakes: [{ wrong: "Yo teneria más tiempo.", right: "Yo tendría más tiempo.", why: "Tener uses the stem tendr- in the conditional too." }],
    related: ["conditional-regular", "future-irregular"],
  },
  {
    id: "polite-conditional",
    title: "Polite requests and advice",
    tagline: "¿Podrías…? Deberías… Yo en tu lugar…",
    status: "available",
    summary: {
      heading: "Soften requests, give advice",
      body: ["The conditional makes you sound polite. Use **¿Podría(s)…?** to ask, **me gustaría** to say what you want, and **deberías** (or **yo en tu lugar…**) to give advice."],
      table: {
        headers: ["To…", "Say"],
        rows: [["ask politely", "¿Podría(s) ayudarme?"], ["express a wish", "Me gustaría viajar."], ["give advice", "Deberías descansar."], ["suggest", "Yo en tu lugar iría."]],
      },
      examples: [
        { es: "¿Podría traerme la cuenta, por favor?", en: "Could you bring me the check, please?" },
        { es: "Deberías descansar un poco.", en: "You should rest a little." },
        { es: "Yo en tu lugar no iría.", en: "In your place, I wouldn't go." },
      ],
    },
    deepDive: [
      { heading: "Deber + infinitive", body: ["**Debo estudiar** (I must study) is strong. **Deberías estudiar** (you should study) is advice — softer, friendlier."] },
      { heading: "Formal vs. friendly", body: ["Use **podría** with **usted** and **podrías** with **tú**. In a restaurant or shop, **¿Me podría…?** is perfect."] },
      { heading: "Yo que tú", body: ["**Yo que tú…** is the quick way to say “if I were you”: **Yo que tú descansaría.**"] },
    ],
    commonMistakes: [{ wrong: "Debes de descansar.", right: "Debes descansar.", why: "Deber + infinitive needs no de for “should”." }],
    related: ["conditional-regular", "conditional-irregular", "polite-requests"],
  },
];
