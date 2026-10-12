import type { GrammarConcept } from "../types";

/** Progressive and perfect (Unit 22), the subjunctive (Unit 23), prepositions and connectors (Unit 24). */
export const NUANCE_CONCEPTS: GrammarConcept[] = [
  {
    id: "present-progressive",
    title: "Present progressive: estoy hablando",
    tagline: "What is happening right now.",
    status: "available",
    summary: {
      heading: "estar + gerund",
      body: ["To say what is happening **right now**, use **estar** + the **gerund**. Gerunds end in **-ando** (for -ar verbs) and **-iendo** (for -er and -ir verbs)."],
      table: {
        headers: ["Infinitive", "Gerund", "Example"],
        rows: [["hablar", "hablando", "Estoy hablando."], ["comer", "comiendo", "Estás comiendo."], ["vivir", "viviendo", "Está viviendo en México."]],
      },
      examples: [
        { es: "Ahora mismo estoy estudiando.", en: "Right now I'm studying." },
        { es: "Mis padres están cocinando.", en: "My parents are cooking." },
      ],
    },
    deepDive: [
      { heading: "Irregular gerunds", body: ["When the stem ends in a vowel, **-iendo** becomes **-yendo**: **leer → leyendo, ir → yendo**. Boot **-ir** verbs change their stem vowel: **dormir → durmiendo, pedir → pidiendo, decir → diciendo, venir → viniendo, seguir → siguiendo**."] },
      { heading: "Reflexive pronouns", body: ["Put the pronoun before **estar** or attach it to the gerund (adding an accent): **Me estoy bañando.** / **Estoy bañándome.**"] },
      { heading: "Progressive vs. simple present", body: ["Spanish uses the simple present for habits and general facts (**Estudio español**) and the progressive only for what is in progress at this moment (**Estoy estudiando ahora mismo**). It's **not** used for future plans: say **Mañana viajo**, not “estoy viajando mañana”."] },
      { heading: "A Mexican favorite", body: ["**Ahorita estoy comiendo** (“I'm eating right now”). People answer the phone with it all day long."] },
    ],
    commonMistakes: [
      { wrong: "Estoy hablo.", right: "Estoy hablando.", why: "After estar, use the gerund, not a conjugated verb." },
      { wrong: "Estoy leiendo.", right: "Estoy leyendo.", why: "i between vowels becomes y." },
    ],
    related: ["estar", "past-progressive"],
  },
  {
    id: "past-progressive",
    title: "Past progressive: estaba comiendo",
    tagline: "What was in progress back then.",
    status: "available",
    summary: {
      heading: "estaba + gerund",
      body: ["To say what **was happening** at a moment in the past, use the **imperfect of estar** + the gerund: **estaba, estabas, estaba, estábamos, estaban**."],
      table: {
        headers: ["", "estar (imperfect)", "Example"],
        rows: [["yo", "estaba", "Estaba comiendo."], ["tú", "estabas", "Estabas durmiendo."], ["él / ella / usted", "estaba", "Estaba trabajando."], ["nosotros", "estábamos", "Estábamos bailando."], ["ellos / ustedes", "estaban", "Estaban cocinando."]],
      },
      examples: [
        { es: "Estaba comiendo cuando llamaste.", en: "I was eating when you called." },
        { es: "¿Qué estabas haciendo?", en: "What were you doing?" },
      ],
    },
    deepDive: [
      { heading: "Background + interruption", body: ["It sets the scene, just like the imperfect: **Estaba cocinando** (background) **cuando llegó mi hermano** (preterite: the interruption)."] },
      { heading: "Imperfect or progressive?", body: ["Often both work: **Comía** and **Estaba comiendo** both mean “I was eating”. The progressive stresses that it was in progress at that very moment."] },
    ],
    commonMistakes: [{ wrong: "Estuve comiendo cuando llamaste.", right: "Estaba comiendo cuando llamaste.", why: "The ongoing background action uses the imperfect: estaba." }],
    related: ["present-progressive", "preterite-vs-imperfect"],
  },
  {
    id: "present-perfect",
    title: "Present perfect: he comido",
    tagline: "What you have done — experiences and recent news.",
    status: "available",
    summary: {
      heading: "haber + past participle",
      body: ["Use a form of **haber** plus the **past participle** (**-ado** for -ar verbs, **-ido** for -er/-ir). The participle never changes for gender or number."],
      table: {
        caption: "haber — present",
        headers: ["", "haber", "Example"],
        rows: [["yo", "he", "He comido."], ["tú", "has", "Has viajado."], ["él / ella / usted", "ha", "Ha vivido aquí."], ["nosotros", "hemos", "Hemos trabajado."], ["ellos / ustedes", "han", "Han salido."]],
      },
      examples: [
        { es: "Nunca he probado el mole.", en: "I've never tried mole." },
        { es: "¿Has viajado a México alguna vez?", en: "Have you ever traveled to Mexico?" },
      ],
    },
    deepDive: [
      { heading: "Irregular participles", body: ["A few are irregular: **hacer → hecho, decir → dicho, ver → visto, escribir → escrito, abrir → abierto, poner → puesto, volver → vuelto, romper → roto**."], table: { headers: ["Infinitive", "Participle"], rows: [["hacer", "hecho"], ["decir", "dicho"], ["ver", "visto"], ["escribir", "escrito"], ["abrir", "abierto"], ["poner", "puesto"], ["volver", "vuelto"]] } },
      { heading: "Accents", body: ["After a vowel, **-ido** takes an accent: **leer → leído, traer → traído, oír → oído**."] },
      { heading: "Pronouns go before haber", body: ["**Lo he visto. Ya me he levantado. Todavía no lo he hecho.** Never between haber and the participle."] },
      { heading: "How Mexicans use it", body: ["For **life experience** (¿Has probado…?) and unfinished periods (esta semana he trabajado mucho) it's everywhere. For finished events, Mexican Spanish usually prefers the preterite: **Ayer comí**, not “he comido ayer”."] },
    ],
    commonMistakes: [
      { wrong: "He hacido la tarea.", right: "He hecho la tarea.", why: "Hacer has an irregular participle: hecho." },
      { wrong: "He lo visto.", right: "Lo he visto.", why: "Pronouns come before haber." },
    ],
    related: ["preterite-ar", "preterite-er-ir"],
  },
  {
    id: "subjunctive-present",
    title: "The present subjunctive",
    tagline: "Hable, coma, viva — the “wish and doubt” mood.",
    status: "available",
    summary: {
      heading: "Take the yo form, drop the -o, flip the vowel",
      body: ["The **subjunctive** is a mood, not a tense. You've already met its forms in **negative commands** (no hables) and **usted commands** (hable). Take the **yo** form of the present, drop **-o**, then add the **opposite vowel**: **-ar → -e**, **-er/-ir → -a**."],
      table: {
        headers: ["", "hablar", "comer", "vivir"],
        rows: [["yo", "hable", "coma", "viva"], ["tú", "hables", "comas", "vivas"], ["él / ella / usted", "hable", "coma", "viva"], ["nosotros", "hablemos", "comamos", "vivamos"], ["ellos / ustedes", "hablen", "coman", "vivan"]],
      },
      examples: [
        { es: "Es importante que estudies.", en: "It's important that you study." },
        { es: "Ojalá que no llueva.", en: "I hope it doesn't rain." },
      ],
    },
    deepDive: [
      { heading: "What it's for", body: ["Use the subjunctive in **que**-clauses when the main verb expresses **wishes, requests, emotions, doubt or necessity** and the two verbs have **different subjects**: **Quiero que vengas.** (I want you to come.)"] },
      { heading: "Irregular yo forms carry over", body: ["Because it starts from **yo**: **tengo → tenga, hago → haga, vengo → venga, salgo → salga, digo → diga, pongo → ponga, conozco → conozca**."] },
      { heading: "Spelling and stem changes", body: ["Spelling keeps the sound: **busque, llegue, empiece**. Boot verbs: **pienso → piense**, **duermo → duerma** (and **-ir** boot verbs change in nosotros too: **durmamos, pidamos**)."] },
      { heading: "Six true irregulars", body: ["**ser → sea, ir → vaya, estar → esté, saber → sepa, dar → dé, haber → haya.**"], table: { headers: ["Infinitive", "yo", "nosotros"], rows: [["ser", "sea", "seamos"], ["ir", "vaya", "vayamos"], ["estar", "esté", "estemos"], ["saber", "sepa", "sepamos"], ["dar", "dé", "demos"]] } },
    ],
    commonMistakes: [
      { wrong: "Es importante que estudias.", right: "Es importante que estudies.", why: "After es importante que, use the subjunctive." },
      { wrong: "Ojalá que no llueve.", right: "Ojalá que no llueva.", why: "Ojalá is followed by the subjunctive." },
    ],
    related: ["commands-negative", "commands-usted", "subjunctive-wishes"],
  },
  {
    id: "subjunctive-wishes",
    title: "Wishes, requests and advice",
    tagline: "Quiero que vengas, espero que puedas.",
    status: "available",
    summary: {
      heading: "Trigger + que + subjunctive (when the subject changes)",
      body: ["When one person wants, hopes or asks something of **another person**, use **que** and the subjunctive. If it's the **same** person, just use an **infinitive**."],
      table: {
        headers: ["Different subject", "Same subject"],
        rows: [["Quiero que vengas.", "Quiero venir."], ["Espero que puedas.", "Espero poder."], ["Prefiero que te quedes.", "Prefiero quedarme."]],
      },
      examples: [
        { es: "Mis padres quieren que estudie.", en: "My parents want me to study." },
        { es: "Te recomiendo que pruebes el mole.", en: "I recommend that you try the mole." },
      ],
    },
    deepDive: [
      { heading: "Common triggers", body: ["**querer que, esperar que, preferir que, pedir que, recomendar que, necesitar que, dejar que**, plus impersonal ones: **es importante / necesario / mejor que**. And **ojalá (que)**: **Ojalá que vengas.**"] },
      { heading: "Same subject = infinitive", body: ["**Quiero que yo vaya** sounds odd; say **Quiero ir**. The subjunctive appears when the subject switches."] },
      { heading: "Dejar and pedir", body: ["**Mis padres me dejan salir** (they let me go out). With a different subject: **Me piden que llegue temprano** (they ask me to arrive early)."] },
    ],
    commonMistakes: [{ wrong: "Quiero que vienes.", right: "Quiero que vengas.", why: "After querer que, the verb is subjunctive: vengas." }],
    related: ["subjunctive-present", "subjunctive-emotion-doubt"],
  },
  {
    id: "subjunctive-emotion-doubt",
    title: "Emotions and doubt",
    tagline: "Me alegro de que vengas, dudo que pueda.",
    status: "available",
    summary: {
      heading: "Feelings and doubt trigger the subjunctive; certainty doesn't",
      body: ["Express **emotion** (me alegro de que…) or **doubt** (dudo que…) with the subjunctive. Express **certainty** (creo que, estoy seguro de que, sé que) with the regular **indicative**."],
      table: {
        headers: ["Subjunctive", "Indicative"],
        rows: [["Dudo que venga.", "Creo que viene."], ["No creo que tenga tiempo.", "Estoy seguro de que tiene tiempo."], ["Es posible que llueva.", "Es verdad que llueve."], ["Me alegro de que estés aquí.", "Sé que estás aquí."]],
      },
      examples: [
        { es: "Me alegro de que vengas a mi fiesta.", en: "I'm glad you're coming to my party." },
        { es: "Dudo que llegue a tiempo.", en: "I doubt he'll arrive on time." },
      ],
    },
    deepDive: [
      { heading: "Creer: yes vs. no", body: ["**Creo que viene** (I think he's coming — indicative) but **No creo que venga** (I don't think he'll come — subjunctive). Doubt flips the mood."] },
      { heading: "Common emotion phrases", body: ["**me alegro de que, me gusta que, es una lástima que, tengo miedo de que, me sorprende que.**"] },
      { heading: "Tal vez and quizás", body: ["**Tal vez venga** (maybe he'll come) uses the subjunctive when you're expressing real doubt."] },
    ],
    commonMistakes: [{ wrong: "Dudo que viene.", right: "Dudo que venga.", why: "Doubt takes the subjunctive: venga." }],
    related: ["subjunctive-wishes", "subjunctive-present"],
  },
  {
    id: "prepositions-place",
    title: "Prepositions of place",
    tagline: "Sobre, debajo de, entre, detrás de, junto a.",
    status: "available",
    summary: {
      heading: "Where is it?",
      body: ["Prepositions of place tell you **where** something is. Many are followed by **de**, and **de + el = del**."],
      table: {
        headers: ["Spanish", "Means"],
        rows: [["sobre / encima de", "on top of"], ["debajo de", "under"], ["entre", "between"], ["detrás de", "behind"], ["delante de / enfrente de", "in front of"], ["junto a / al lado de", "next to"], ["dentro de / fuera de", "inside / outside"]],
      },
      examples: [
        { es: "El libro está sobre la mesa.", en: "The book is on the table." },
        { es: "La escuela está detrás del parque.", en: "The school is behind the park." },
      ],
    },
    deepDive: [
      { heading: "De and a contractions", body: ["**detrás de + el = detrás del**; **junto a + el = junto al**; **fuera de + el = fuera del**."] },
      { heading: "Entre", body: ["**Entre** takes no **de** and uses yo/tú-style pronouns: **entre tú y yo** (between you and me)."] },
      { heading: "Sobre has two jobs", body: ["**Sobre** means “on top of” (**sobre la mesa**) and “about” (**un libro sobre México**)."] },
    ],
    commonMistakes: [{ wrong: "La escuela está detrás el parque.", right: "La escuela está detrás del parque.", why: "Detrás needs de, and de + el = del." }],
    related: ["al-del", "hay"],
  },
  {
    id: "prepositions-time-motion",
    title: "Prepositions of time and motion",
    tagline: "Desde, hasta, hacia, durante — and what follows them.",
    status: "available",
    summary: {
      heading: "When, how long, and which direction",
      body: ["Use **desde** (since/from), **hasta** (until), **hacia** (toward), **durante** (during). After a preposition, a verb is always an **infinitive**: **antes de comer, después de cenar, sin hablar**."],
      table: {
        headers: ["Spanish", "Means", "Example"],
        rows: [["desde", "from / since", "Trabajo desde las ocho."], ["hasta", "until / as far as", "Estudio hasta las diez."], ["hacia", "toward", "Camino hacia el parque."], ["durante", "during / for", "Duermo durante la tarde."], ["antes de + inf.", "before …ing", "Antes de comer, me lavo."], ["después de + inf.", "after …ing", "Después de cenar, descanso."], ["sin + inf.", "without …ing", "Salí sin desayunar."]],
      },
      examples: [
        { es: "Me lavo las manos antes de comer.", en: "I wash my hands before eating." },
        { es: "Trabajo desde las ocho hasta las cinco.", en: "I work from eight until five." },
      ],
    },
    deepDive: [
      { heading: "English uses -ing, Spanish uses the infinitive", body: ["“Before eating” is **antes de comer** — never **antes de comiendo**. The infinitive is the only verb form that can follow a preposition."] },
      { heading: "Hasta and hacia", body: ["**Hasta** has an end point (**hasta la esquina** = as far as the corner). **Hacia** is just a direction (**hacia el norte**)."] },
      { heading: "Para + infinitive", body: ["You know **para + infinitive** already (para viajar). It follows the same rule: **para** + infinitive = “in order to”."] },
    ],
    commonMistakes: [{ wrong: "Después de comiendo, descanso.", right: "Después de comer, descanso.", why: "After a preposition, use the infinitive." }],
    related: ["prepositions-place", "por-vs-para"],
  },
  {
    id: "relative-que",
    title: "Joining ideas: que, lo que, donde, quien",
    tagline: "El libro que compré, lo que dices.",
    status: "available",
    summary: {
      heading: "Que connects, and you can never drop it",
      body: ["**Que** joins a description to a noun: **el libro que compré** (the book that I bought). Unlike English, you can't leave it out. **Lo que** means “what / the thing that”: **no entiendo lo que dices**."],
      table: {
        headers: ["Word", "Means", "Example"],
        rows: [["que", "that / which / who", "La persona que vive aquí."], ["lo que", "what / the thing that", "Lo que dices es verdad."], ["donde", "where", "El lugar donde vivo."], ["quien", "who (after a preposition)", "La chica con quien hablé."]],
      },
      examples: [
        { es: "El libro que compré es muy bueno.", en: "The book (that) I bought is very good." },
        { es: "No entiendo lo que dices.", en: "I don't understand what you're saying." },
      ],
    },
    deepDive: [
      { heading: "Never drop que", body: ["English says “the book I bought”. Spanish must say **el libro que compré**."] },
      { heading: "Lo que vs. qué", body: ["**¿Qué?** with an accent asks a question. **Lo que** (no accent) connects: **Dime lo que quieres** (tell me what you want)."] },
      { heading: "Quien after prepositions", body: ["For people after a preposition, use **quien**: **la chica con quien hablé**, **el amigo de quien te hablé**."] },
    ],
    commonMistakes: [{ wrong: "El libro compré es bueno.", right: "El libro que compré es bueno.", why: "Spanish needs que — it can't be dropped." }],
    related: ["questions", "connectors"],
  },
  {
    id: "connectors",
    title: "Connectors: porque, por eso, aunque…",
    tagline: "The glue that connects your ideas.",
    status: "available",
    summary: {
      heading: "Link ideas like a native speaker",
      body: ["These small words make your Spanish flow: **porque** (because), **por eso** (that's why), **además** (besides), **sin embargo** (however), **aunque** (although), **entonces** (so, then)."],
      table: {
        headers: ["Spanish", "Means", "Example"],
        rows: [["porque", "because", "Estoy cansado porque trabajé mucho."], ["por eso", "that's why", "Trabajé mucho; por eso estoy cansado."], ["además", "besides", "Es barato y además es rico."], ["sin embargo", "however", "Es caro; sin embargo, vale la pena."], ["aunque", "although / even if", "Voy aunque llueva."], ["entonces", "so / then", "Entonces, ¿vamos?"]],
      },
      examples: [
        { es: "Es caro; sin embargo, es muy bueno.", en: "It's expensive; however, it's very good." },
        { es: "Estoy cansado; por eso me acuesto.", en: "I'm tired; that's why I'm going to bed." },
      ],
    },
    deepDive: [
      { heading: "Porque, por qué, por eso", body: ["**¿Por qué?** asks, **porque** answers, **por eso** states a consequence: cause (**porque**) vs. result (**por eso**)."] },
      { heading: "Aunque and the subjunctive", body: ["**Aunque** + indicative states a fact: **Voy aunque estoy cansado** (I'm tired, but I'm going). **Aunque** + subjunctive is hypothetical: **Voy aunque llueva** (even if it rains)."] },
      { heading: "Punctuation", body: ["**Sin embargo** and **además** are usually followed by a comma; put a semicolon or period before them."] },
    ],
    commonMistakes: [{ wrong: "Estoy cansado por eso trabajé mucho.", right: "Estoy cansado porque trabajé mucho.", why: "Cause = porque; result = por eso." }],
    related: ["por-que", "subjunctive-present"],
  },
];
