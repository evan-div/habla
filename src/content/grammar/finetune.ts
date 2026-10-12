import type { GrammarConcept } from "../types";

/** Past perfect (Unit 25), the imperfect subjunctive (Unit 26) and the se constructions (Unit 27). */
export const FINETUNE_CONCEPTS: GrammarConcept[] = [
  {
    id: "past-perfect",
    title: "Past perfect: había comido",
    tagline: "What had already happened.",
    status: "available",
    summary: {
      heading: "había + past participle",
      body: ["The **past perfect** says what **had already happened** before another moment in the past. Use the **imperfect of haber** (**había, habías, había, habíamos, habían**) + the **past participle** you already know."],
      table: {
        caption: "haber — imperfect",
        headers: ["", "haber", "Example"],
        rows: [["yo", "había", "Ya había comido."], ["tú", "habías", "Habías llegado."], ["él / ella / usted", "había", "Ya había salido."], ["nosotros", "habíamos", "Habíamos terminado."], ["ellos / ustedes", "habían", "Habían vuelto."]],
      },
      examples: [
        { es: "Cuando llegué, ya habían comido.", en: "When I arrived, they had already eaten." },
        { es: "Nunca había probado el mole.", en: "I had never tried mole." },
      ],
    },
    deepDive: [
      { heading: "Earlier than another past moment", body: ["It's the “past of the past”: **Cuando llegué** (preterite) **ya se había ido** (past perfect — he had left earlier)."] },
      { heading: "Same participles as before", body: ["**-ado / -ido** and the irregular ones: **hecho, dicho, visto, escrito, abierto, puesto, vuelto, roto, descubierto, devuelto**. They never change for gender or number."] },
      { heading: "Pronouns and words in between", body: ["Pronouns go before **había**: **Ya lo había visto.** Nothing goes between **había** and the participle except **nunca / ya / todavía no**, which go before **había**."] },
      { heading: "Don't overuse it", body: ["If the order of events is obvious, Spanish often just uses the preterite: **Comí y salí.** Reach for the past perfect when you need to say something happened **before** the other past event."] },
    ],
    commonMistakes: [
      { wrong: "Cuando llegué, ya comieron.", right: "Cuando llegué, ya habían comido.", why: "They ate before you arrived: past perfect." },
      { wrong: "Había hacido la tarea.", right: "Había hecho la tarea.", why: "Hacer has an irregular participle: hecho." },
    ],
    related: ["present-perfect", "preterite-vs-imperfect", "acabar-de"],
  },
  {
    id: "acabar-de",
    title: "Acabar de: “just did”",
    tagline: "Acabo de llegar — I just arrived.",
    status: "available",
    summary: {
      heading: "acabar de + infinitive",
      body: ["To say you **just** did something, use **acabar de** + an **infinitive**. Conjugate **acabar**; leave the second verb in the infinitive."],
      table: {
        headers: ["", "present", "imperfect"],
        rows: [["yo", "acabo de llegar", "acababa de llegar"], ["tú", "acabas de llegar", "acababas de llegar"], ["él / ella / usted", "acaba de llegar", "acababa de llegar"], ["nosotros", "acabamos de llegar", "acabábamos de llegar"], ["ellos / ustedes", "acaban de llegar", "acababan de llegar"]],
      },
      examples: [
        { es: "Acabo de comer.", en: "I just ate." },
        { es: "Acababa de llegar cuando llamaste.", en: "I had just arrived when you called." },
      ],
    },
    deepDive: [
      { heading: "Present = recent past", body: ["**Acabo de salir** = “I just left” — it describes a moment right before now, even though the English is past tense."] },
      { heading: "Imperfect = just before another moment", body: ["**Acababa de llegar cuando…** = “I had just arrived when…”. It's a lighter alternative to the past perfect."] },
      { heading: "Don't conjugate the second verb", body: ["Say **acabo de llegar**, never “acabo de llegué”."] },
    ],
    commonMistakes: [{ wrong: "Acabo de llegué.", right: "Acabo de llegar.", why: "After de, use the infinitive." }],
    related: ["past-perfect", "prepositions-time-motion"],
  },
  {
    id: "imperfect-subjunctive",
    title: "The imperfect subjunctive",
    tagline: "Hablara, comiera, tuviera — the “hypothetical” mood.",
    status: "available",
    summary: {
      heading: "Take the ellos preterite form, drop -ron, add -ra",
      body: ["Start with the **ellos / ustedes** form of the **preterite**, remove **-ron**, and add the endings **-ra, -ras, -ra, -ramos, -ran**. This works for **every** verb, regular and irregular."],
      table: {
        headers: ["Infinitive", "Preterite (ellos)", "Imperfect subjunctive (yo)"],
        rows: [["hablar", "hablaron", "hablara"], ["comer", "comieron", "comiera"], ["vivir", "vivieron", "viviera"], ["tener", "tuvieron", "tuviera"], ["ser / ir", "fueron", "fuera"], ["hacer", "hicieron", "hiciera"], ["decir", "dijeron", "dijera"]],
      },
      examples: [
        { es: "Si tuviera dinero, viajaría.", en: "If I had money, I would travel." },
        { es: "Quería que vinieras.", en: "I wanted you to come." },
      ],
    },
    deepDive: [
      { heading: "All the forms", body: ["**hablara, hablaras, hablara, habláramos, hablaran.** The **nosotros** form takes a written accent on the vowel before **-ramos**: **habláramos, comiéramos, tuviéramos**."] },
      { heading: "Why it's useful", body: ["The present subjunctive talks about now and the future; the **imperfect subjunctive** is for **hypotheticals** (si tuviera…), **wishes** that probably won't come true (ojalá pudiera…), and **past requests** (quería que vinieras)."] },
      { heading: "Polite quisiera", body: ["You've been using one for a long time: **quisiera** (“I would like”) is the imperfect subjunctive of **querer**. Same idea for **pudiera**: **¿Pudieras ayudarme?**"] },
      { heading: "The -se variant", body: ["There's an alternative set ending in **-se** (**hablase, comiese**). It's common in writing and in Spain; in Mexico everyday speech uses **-ra**."] },
    ],
    commonMistakes: [
      { wrong: "Si tendría dinero, viajaría.", right: "Si tuviera dinero, viajaría.", why: "After si, use the imperfect subjunctive — never the conditional." },
      { wrong: "Si tuvieramos dinero, viajaríamos.", right: "Si tuviéramos dinero, viajaríamos.", why: "The nosotros form needs a written accent: tuviéramos." },
    ],
    related: ["subjunctive-present", "preterite-ar", "si-hypothetical"],
  },
  {
    id: "si-hypothetical",
    title: "Si + imperfect subjunctive, conditional",
    tagline: "Si tuviera dinero, viajaría.",
    status: "available",
    summary: {
      heading: "Unreal or unlikely situations",
      body: ["For something **hypothetical or unlikely**, use **si** + the **imperfect subjunctive**, then the **conditional** for the result. (For real possibilities you used **si** + present → future.)"],
      table: {
        headers: ["Kind of “if”", "si-clause", "Result"],
        rows: [["Real possibility", "Si llueve (present)", "me quedaré (future)"], ["Hypothetical", "Si lloviera (imperfect subj.)", "me quedaría (conditional)"]],
      },
      examples: [
        { es: "Si ganara la lotería, compraría una casa.", en: "If I won the lottery, I would buy a house." },
        { es: "Si yo fuera tú, iría.", en: "If I were you, I'd go." },
      ],
    },
    deepDive: [
      { heading: "If I were you", body: ["Use **fuera**, not **era**: **Si yo fuera tú…** Spanish always uses the subjunctive here."] },
      { heading: "Either order", body: ["**Viajaría más si tuviera tiempo.** works as well. Never put the conditional right after **si**."] },
      { heading: "Real vs. hypothetical", body: ["**Si tengo tiempo, te llamaré** (it could happen). **Si tuviera tiempo, te llamaría** (but I don't — or I'm unlikely to)."] },
    ],
    commonMistakes: [{ wrong: "Si yo sería rico, viajaría.", right: "Si yo fuera rico, viajaría.", why: "After si, never use the conditional: fuera." }],
    related: ["imperfect-subjunctive", "future-conditions", "conditional-regular"],
  },
  {
    id: "imperfect-subjunctive-wishes",
    title: "Wishes, “as if” and past requests",
    tagline: "Ojalá pudiera, como si fuera, quería que vinieras.",
    status: "available",
    summary: {
      heading: "More jobs for the imperfect subjunctive",
      body: ["Use it for **wishes you doubt will come true** (**Ojalá pudiera…**), after **como si** (“as if”), and when the main verb is **past**: **Quería que vinieras. Esperaba que llegaras.**"],
      table: {
        headers: ["Use", "Example"],
        rows: [["Unlikely wish", "Ojalá tuviera más tiempo."], ["As if", "Habla como si fuera mexicano."], ["Past request / hope", "Quería que vinieras."], ["Polite request", "Quisiera un café."]],
      },
      examples: [
        { es: "Ojalá pudiera viajar más.", en: "I wish I could travel more." },
        { es: "Mis padres querían que estudiara medicina.", en: "My parents wanted me to study medicine." },
      ],
    },
    deepDive: [
      { heading: "Ojalá + present vs. imperfect", body: ["**Ojalá venga** (I hope he comes — it could happen) vs. **Ojalá viniera** (I wish he would come — doubtful)."] },
      { heading: "Matching tenses", body: ["Present main verb → present subjunctive (**quiero que vengas**). Past main verb → imperfect subjunctive (**quería que vinieras**)."] },
      { heading: "Como si", body: ["**Como si** always takes the imperfect subjunctive: **como si no pasara nada** (as if nothing were happening)."] },
    ],
    commonMistakes: [{ wrong: "Quería que vienes.", right: "Quería que vinieras.", why: "A past wish takes the imperfect subjunctive." }],
    related: ["imperfect-subjunctive", "subjunctive-wishes"],
  },
  {
    id: "se-impersonal",
    title: "Impersonal se: “one does…”",
    tagline: "Se habla español. ¿Cómo se dice…?",
    status: "available",
    summary: {
      heading: "se + singular verb, no specific subject",
      body: ["Use **se** + the **él / ella** verb to say what **people in general** do, without naming anyone: **Se habla español aquí.** **¿Cómo se dice “hello”?**"],
      examples: [
        { es: "En México se come muy bien.", en: "In Mexico, people eat very well." },
        { es: "Aquí no se fuma.", en: "Smoking isn't allowed here." },
        { es: "¿Cómo se dice “thank you” en español?", en: "How do you say “thank you” in Spanish?" },
      ],
    },
    deepDive: [
      { heading: "Like “one” or “you” in English", body: ["**Se vive bien aquí** = “you live well here / one lives well here”. It makes general statements about customs and rules."] },
      { heading: "Signs and rules", body: ["Signs love it: **No se permite fumar. Se prohíbe estacionarse.** Also **Prohibido fumar** (with the adjective)."] },
      { heading: "With people as objects", body: ["When the object is a person, add the personal **a** and keep the verb singular: **Se busca a un mesero.**"] },
    ],
    commonMistakes: [{ wrong: "En México uno come muy bien.", right: "En México se come muy bien.", why: "Both are understandable, but se is the natural everyday choice." }],
    related: ["se-passive", "personal-a"],
  },
  {
    id: "se-passive",
    title: "Passive se: se vende, se venden",
    tagline: "When the thing is the star, the verb agrees with it.",
    status: "available",
    summary: {
      heading: "se + verb that agrees with the noun",
      body: ["To say what is done to **things** (without saying who does it), use **se** + the verb, which **agrees with the noun** that follows: **Se vende una casa. / Se venden casas.**"],
      table: {
        headers: ["Singular", "Plural"],
        rows: [["Se vende coche.", "Se venden coches."], ["Se habla español.", "Se hablan dos idiomas."], ["Se corta la cebolla.", "Se cortan las cebollas."]],
      },
      examples: [
        { es: "Se rentan departamentos.", en: "Apartments for rent." },
        { es: "Se agrega sal y se sirve caliente.", en: "Salt is added and it's served hot." },
      ],
    },
    deepDive: [
      { heading: "Recipes and instructions", body: ["Recipes use it everywhere: **Se corta la cebolla. Se agrega la sal. Se sirve caliente.** It sounds like “you cut… you add… you serve”."] },
      { heading: "Agreement is the key", body: ["The noun is the true subject, so the verb matches it: **se vende / se venden**."] },
      { heading: "Why not “es vendido”?", body: ["Spanish has a regular passive (**es vendido**), but **se** is far more common in speech and signs."] },
    ],
    commonMistakes: [{ wrong: "Se vende coches.", right: "Se venden coches.", why: "The plural noun makes the verb plural: venden." }],
    related: ["se-impersonal", "plurals"],
  },
  {
    id: "se-accidental",
    title: "Accidental se: se me olvidó",
    tagline: "It happened to me — I didn't mean to.",
    status: "available",
    summary: {
      heading: "se + me / te / le / nos / les + verb",
      body: ["For **accidents and things that “just happened”**, Spanish removes the blame: not “I forgot the key” but “the key **forgot itself to me**”. The verb agrees with the **thing**: **Se me olvidó la llave. / Se me olvidaron las llaves.**"],
      table: {
        headers: ["Spanish", "Means"],
        rows: [["Se me olvidó la llave.", "I forgot my key."], ["Se me cayó el teléfono.", "I dropped my phone."], ["Se me perdieron las llaves.", "I lost my keys."], ["Se nos acabó el café.", "We ran out of coffee."], ["Se le descompuso el coche.", "His car broke down."]],
      },
      examples: [
        { es: "Perdón, se me hizo tarde.", en: "Sorry, I ran late." },
        { es: "Se me antoja un taco.", en: "I'm craving a taco." },
      ],
    },
    deepDive: [
      { heading: "Who it happened to", body: ["The pronoun tells you who it happened to: **me** (to me), **te** (to you), **le** (to him/her/you formal), **nos** (to us), **les** (to them)."] },
      { heading: "Agreement", body: ["The verb agrees with the **thing**: **se me cayó el vaso** but **se me cayeron los vasos**."] },
      { heading: "Very Mexican favorites", body: ["**Se me hizo tarde** (I ran late), **se me antoja…** (I feel like having…), **se me hace que…** (I get the feeling that…), **se me descompuso…** (it broke down on me)."] },
    ],
    commonMistakes: [{ wrong: "Se me olvidaron la llave.", right: "Se me olvidó la llave.", why: "The thing forgotten (la llave) is singular, so the verb is singular." }],
    related: ["se-passive", "indirect-object-pronouns"],
  },
];
