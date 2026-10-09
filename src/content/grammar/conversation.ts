import type { GrammarConcept } from "../types";

/** Reflexive verbs (Unit 16), object pronouns (Unit 17), commands (Unit 18). */
export const CONVERSATION_CONCEPTS: GrammarConcept[] = [
  {
    id: "reflexive-verbs",
    title: "Reflexive verbs",
    tagline: "Me levanto, te bañas — actions you do to yourself.",
    status: "available",
    summary: {
      heading: "A little pronoun before the verb",
      body: [
        "With a **reflexive verb** the action comes back to the person doing it. The infinitive ends in **-se** (**levantarse**), and in every sentence you add a pronoun: **me, te, se, nos, se**.",
      ],
      table: {
        caption: "levantarse — present tense",
        headers: ["", "levantarse"],
        rows: [["yo", "me levanto"], ["tú", "te levantas"], ["él / ella / usted", "se levanta"], ["nosotros", "nos levantamos"], ["ellos / ustedes", "se levantan"]],
      },
      examples: [
        { es: "Me levanto a las seis.", en: "I get up at six." },
        { es: "Mis padres se acuestan temprano.", en: "My parents go to bed early." },
      ],
    },
    deepDive: [
      {
        heading: "Yourself vs. someone else",
        body: ["Compare **Lavo el coche** (I wash the car) with **Me lavo** (I wash myself). Without the pronoun, the action lands on something else. With it, the action returns to the subject."],
        examples: [{ es: "Acuesto a mi hijo. / Me acuesto.", en: "I put my son to bed. / I go to bed." }],
      },
      {
        heading: "Stem changes still happen",
        body: ["Reflexive verbs follow the usual patterns: **despertarse** (e → ie) → **me despierto**; **vestirse** (e → i) → **me visto**; **acostarse** (o → ue) → **me acuesto**. Nosotros never changes: **nos acostamos**."],
      },
      {
        heading: "Body parts and clothes",
        body: ["With parts of your body, use **el / la / los / las**, not **mi**: **Me lavo las manos.** **Me lavo los dientes.** The reflexive pronoun already says whose they are."],
      },
      {
        heading: "Meanings that shift",
        body: ["Many verbs change a little: **dormir** (to sleep) vs. **dormirse** (to fall asleep); **ir** vs. **irse** (to leave). You've already used one: **me llamo** (“I call myself”)."],
      },
    ],
    commonMistakes: [
      { wrong: "Yo levanto a las seis.", right: "Me levanto a las seis.", why: "Reflexive verbs need their pronoun: me levanto." },
      { wrong: "Me lavo mis manos.", right: "Me lavo las manos.", why: "Use the article, not mi, for body parts." },
    ],
    related: ["present-regular", "stem-changing", "reflexive-position"],
  },
  {
    id: "reflexive-position",
    title: "Reflexive pronouns: where they go",
    tagline: "Before the verb — or attached to the infinitive.",
    status: "available",
    summary: {
      heading: "Before a conjugated verb, or on the end of an infinitive",
      body: ["Put the pronoun **before** a conjugated verb. When there's an infinitive (**ir a, querer, poder**), you can put it before the whole group **or** attach it to the infinitive."],
      examples: [
        { es: "Me voy a acostar. / Voy a acostarme.", en: "I'm going to go to bed." },
        { es: "No me levanto temprano.", en: "I don't get up early." },
        { es: "Ayer me levanté tarde.", en: "Yesterday I got up late." },
      ],
    },
    deepDive: [
      { heading: "Match the pronoun to the subject", body: ["The pronoun must agree with **who is acting**: **Quiero acostarme** (I want to go to bed), **Quieres acostarte** (you want to…), **Queremos acostarnos** (we want to…)."] },
      { heading: "Negatives", body: ["**No** goes before the pronoun: **No me levanto. No me quiero levantar. No quiero levantarme.**"] },
      { heading: "In the past tenses", body: ["Same rules: **me levanté** (preterite), **me levantaba** (imperfect). The pronoun stays right before the verb."] },
    ],
    commonMistakes: [{ wrong: "Me voy a levantarme.", right: "Me voy a levantar. / Voy a levantarme.", why: "Use the pronoun once — either before the whole group or on the infinitive." }],
    related: ["reflexive-verbs"],
  },
  {
    id: "direct-object-pronouns",
    title: "Direct object pronouns",
    tagline: "Lo, la, los, las — it, him, her, them.",
    status: "available",
    summary: {
      heading: "Replace the thing (or person) the verb acts on",
      body: ["Instead of repeating a noun, use a pronoun that matches its gender and number. It goes **before the conjugated verb**."],
      table: {
        headers: ["", "Singular", "Plural"],
        rows: [["me / us", "me", "nos"], ["you (tú)", "te", "—"], ["him / it (m.)", "lo", "los"], ["her / it (f.)", "la", "las"]],
      },
      examples: [
        { es: "Compro el libro. → Lo compro.", en: "I buy the book. → I buy it." },
        { es: "¿Ves a Ana? —Sí, la veo.", en: "Do you see Ana? —Yes, I see her." },
        { es: "Mi madre me llama.", en: "My mother calls me." },
      ],
    },
    deepDive: [
      { heading: "Gender and number matter", body: ["The pronoun copies the noun: **el libro → lo**, **la camisa → la**, **los tacos → los**, **las llaves → las**."] },
      { heading: "People and the personal a", body: ["With people, the noun takes the personal **a** (**Veo a Ana**) but the pronoun doesn't: **La veo.**"] },
      { heading: "Negatives", body: ["**No** goes in front: **No lo compro. No la veo.**"] },
    ],
    commonMistakes: [
      { wrong: "Compro lo.", right: "Lo compro.", why: "The pronoun goes before the conjugated verb." },
      { wrong: "Veo la.", right: "La veo.", why: "Same rule: the pronoun comes first." },
    ],
    related: ["personal-a", "gender", "object-pronoun-position"],
  },
  {
    id: "indirect-object-pronouns",
    title: "Indirect object pronouns",
    tagline: "Me, te, le, nos, les — to or for someone.",
    status: "available",
    summary: {
      heading: "Who receives it?",
      body: ["Indirect object pronouns say **to whom or for whom** something is done. You've been using one all along: **me gusta** (“it pleases me”)."],
      table: {
        headers: ["", "Singular", "Plural"],
        rows: [["1st person", "me", "nos"], ["2nd person (tú)", "te", "—"], ["3rd person", "le", "les"]],
      },
      examples: [
        { es: "Te doy un regalo.", en: "I'm giving you a gift." },
        { es: "Le mando un mensaje a Ana.", en: "I'm sending Ana a message." },
        { es: "¿Me prestas tu libro?", en: "Can you lend me your book?" },
      ],
    },
    deepDive: [
      { heading: "Le and les are for everybody", body: ["**Le** means to him, to her, or to you (usted); **les** means to them or to you all. Add **a + person** to clarify: **Le doy el libro a Ana.** Spanish often uses both together."] },
      { heading: "Verbs of giving and telling", body: ["Look for these: **dar** (to give), **decir** (to say/tell), **mandar** (to send), **prestar** (to lend), **regalar**, **traer**, **mostrar**. They usually take an indirect object."] },
      { heading: "Meet gustar again", body: ["**Me gusta, te gusta, le gusta, nos gusta, les gusta**: the same pronouns, the same idea (the thing pleases *someone*)."] },
    ],
    commonMistakes: [{ wrong: "Yo doy a ti un regalo.", right: "Te doy un regalo.", why: "Use the short pronoun before the verb." }],
    related: ["gustar", "direct-object-pronouns"],
  },
  {
    id: "object-pronoun-position",
    title: "Object pronouns: order and position",
    tagline: "Te lo mando — and what happens with infinitives.",
    status: "available",
    summary: {
      heading: "Before the verb or on the infinitive, and two at once",
      body: [
        "Like reflexives, object pronouns go **before a conjugated verb** or **attached to an infinitive**. When you use two together, the **indirect (me, te, le…) comes first**, then the direct (lo, la, los, las).",
      ],
      examples: [
        { es: "Lo voy a comprar. / Voy a comprarlo.", en: "I'm going to buy it." },
        { es: "Te lo mando mañana.", en: "I'll send it to you tomorrow." },
        { es: "Se lo doy a Ana.", en: "I give it to Ana." },
      ],
    },
    deepDive: [
      { heading: "Le + lo = se lo", body: ["Two pronouns that start with **l** can't sit side by side, so **le / les** becomes **se**: **Le doy el libro → Se lo doy.**"] },
      { heading: "Order: RID", body: ["Remember **R**eflexive, **I**ndirect, **D**irect: **Me lo pongo** (I put it on myself), **Te lo doy** (I give it to you)."] },
    ],
    commonMistakes: [{ wrong: "Lo te mando.", right: "Te lo mando.", why: "Indirect comes before direct: te lo." }],
    related: ["direct-object-pronouns", "indirect-object-pronouns", "reflexive-position"],
  },
  {
    id: "commands-tu",
    title: "Commands with tú",
    tagline: "Habla, come, ven — telling a friend what to do.",
    status: "available",
    summary: {
      heading: "Affirmative tú commands = the él form",
      body: ["To tell a friend to do something, use the **he / she / it form** of the present tense: **hablar → habla, comer → come, escribir → escribe**."],
      table: {
        headers: ["Infinitive", "Command", "Means"],
        rows: [["hablar", "¡Habla!", "Speak!"], ["comer", "¡Come!", "Eat!"], ["escribir", "¡Escribe!", "Write!"], ["esperar", "¡Espera!", "Wait!"], ["mirar", "¡Mira!", "Look!"]],
      },
      examples: [
        { es: "Espera un momento.", en: "Wait a moment." },
        { es: "Come más tacos.", en: "Eat more tacos." },
      ],
    },
    deepDive: [
      {
        heading: "Eight irregular commands",
        body: ["A handful are different — they're worth memorizing: **ven** (venir), **ve** (ir), **di** (decir), **haz** (hacer), **sal** (salir), **pon** (poner), **ten** (tener), **sé** (ser)."],
        table: { headers: ["Infinitive", "Command"], rows: [["venir", "ven"], ["ir", "ve"], ["decir", "di"], ["hacer", "haz"], ["salir", "sal"], ["poner", "pon"], ["tener", "ten"], ["ser", "sé"]] },
      },
      { heading: "Politeness", body: ["Commands can sound bossy. Soften them with **por favor**, or use a question: **¿Me ayudas?** In Mexico, friends also say **ándale** and **órale** for “go ahead”."] },
    ],
    commonMistakes: [{ wrong: "¡Hablas!", right: "¡Habla!", why: "A tú command drops the -s of the present form: habla." }],
    related: ["present-regular", "commands-negative"],
  },
  {
    id: "commands-negative",
    title: "Negative commands",
    tagline: "No hables, no comas — switch the vowel.",
    status: "available",
    summary: {
      heading: "Take the yo form, drop -o, add the opposite ending",
      body: ["Negative tú commands flip the vowel: **-ar verbs take -es; -er / -ir verbs take -as**. Put **no** in front."],
      table: {
        headers: ["Infinitive", "yo form", "No + command"],
        rows: [["hablar", "hablo", "no hables"], ["comer", "como", "no comas"], ["escribir", "escribo", "no escribas"], ["hacer", "hago", "no hagas"], ["decir", "digo", "no digas"]],
      },
      examples: [
        { es: "No hables tan rápido.", en: "Don't talk so fast." },
        { es: "No te preocupes.", en: "Don't worry." },
      ],
    },
    deepDive: [
      { heading: "Irregular yo forms carry over", body: ["Because the stem comes from **yo**, irregular verbs stay irregular: **hago → no hagas, digo → no digas, pongo → no pongas, vengo → no vengas, salgo → no salgas**."] },
      { heading: "Pronouns come first", body: ["In negative commands, pronouns go before the verb: **No te preocupes. No me digas. No lo hagas.**"] },
      { heading: "A few oddballs", body: ["**ir → no vayas**, **ser → no seas**, **dar → no des**, **estar → no estés**."] },
    ],
    commonMistakes: [
      { wrong: "No habla tan rápido.", right: "No hables tan rápido.", why: "A negative tú command uses -es for -ar verbs." },
      { wrong: "No comes eso.", right: "No comas eso.", why: "A negative tú command uses -as for -er verbs." },
    ],
    related: ["commands-tu", "commands-pronouns"],
  },
  {
    id: "commands-usted",
    title: "Commands with usted",
    tagline: "Siga, doble, pase — polite and formal.",
    status: "available",
    summary: {
      heading: "The same vowel flip: -ar → -e, -er / -ir → -a",
      body: ["Formal commands (one person) use the **usted** form: the vowel flips from the **yo** form. For several people, add **-n**: **hablen, coman, escriban**."],
      table: {
        headers: ["Infinitive", "usted", "ustedes"],
        rows: [["hablar", "hable", "hablen"], ["comer", "coma", "coman"], ["seguir", "siga", "sigan"], ["doblar", "doble", "doblen"], ["cruzar", "cruce", "crucen"], ["pasar", "pase", "pasen"]],
      },
      examples: [
        { es: "Siga derecho y doble a la izquierda.", en: "Go straight and turn left." },
        { es: "Pase, por favor.", en: "Please come in." },
      ],
    },
    deepDive: [
      { heading: "Perfect for directions", body: ["You're usually speaking to a stranger when you give or get directions, so **usted** is the right level: **Siga derecho, doble a la derecha, cruce la calle.**"] },
      { heading: "Spelling changes", body: ["To keep the sound: **cruzar → cruce** (z → c), **llegar → llegue**, **buscar → busque** — the same logic as the preterite yo form."] },
      { heading: "Usted is usually dropped", body: ["Add **usted** after the verb only for extra politeness: **Pase usted.**"] },
    ],
    commonMistakes: [{ wrong: "Dobla a la izquierda, señor.", right: "Doble a la izquierda, señor.", why: "A stranger gets the usted command: doble." }],
    related: ["tu-vs-usted", "commands-tu"],
  },
  {
    id: "commands-pronouns",
    title: "Commands with pronouns",
    tagline: "Dame, dime, ayúdame — attached at the end.",
    status: "available",
    summary: {
      heading: "Attach for yes-commands, put before for no-commands",
      body: ["In an **affirmative** command, the pronoun attaches to the end: **Dame, Dime, Espérame**. In a **negative** command, it goes **before**: **No me digas, No te preocupes**."],
      examples: [
        { es: "Dame tu número.", en: "Give me your number." },
        { es: "Ayúdame, por favor.", en: "Help me, please." },
        { es: "No me digas.", en: "You don't say! / No way!" },
      ],
    },
    deepDive: [
      { heading: "Accent marks", body: ["Adding a pronoun can push the stress back, so a written accent keeps it in place: **ayuda → ayúdame**, **espera → espérame**, **pasa → pásame**. Short ones like **dame, dime, ven** need none."] },
      { heading: "Reflexive commands", body: ["Reflexive verbs follow the rule too: **Levántate** (get up), **Siéntate** (sit down), **Cálmate** (calm down). Negative: **No te levantes.**"] },
      { heading: "Two pronouns", body: ["**Dámelo** (give it to me), **Mándamelo** (send it to me). Indirect first, direct second, accent on the original stressed syllable."] },
    ],
    commonMistakes: [
      { wrong: "Me da tu número.", right: "Dame tu número.", why: "A command to a friend attaches the pronoun: dame." },
      { wrong: "No dime.", right: "No me digas.", why: "In a negative command the pronoun goes before the verb." },
    ],
    related: ["commands-tu", "commands-negative", "object-pronoun-position"],
  },
];
