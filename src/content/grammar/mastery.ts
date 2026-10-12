import type { GrammarConcept } from "../types";

/** Conditional and future perfect (Unit 28), unreal past (Unit 29) and reported speech (Unit 30). */
export const MASTERY_CONCEPTS: GrammarConcept[] = [
  {
    id: "conditional-perfect",
    title: "Conditional perfect: habría ido",
    tagline: "What would have happened.",
    status: "available",
    summary: {
      heading: "habría + past participle",
      body: ["The **conditional perfect** says what **would have happened** (but didn't). Use the **conditional of haber** — **habría, habrías, habría, habríamos, habrían** — plus the **past participle**."],
      table: {
        caption: "haber — conditional",
        headers: ["", "haber", "Example"],
        rows: [["yo", "habría", "Habría ido."], ["tú", "habrías", "Habrías llegado."], ["él / ella / usted", "habría", "Habría comido."], ["nosotros", "habríamos", "Habríamos viajado."], ["ellos / ustedes", "habrían", "Habrían venido."]],
      },
      examples: [
        { es: "Habría ido, pero tenía trabajo.", en: "I would have gone, but I had work." },
        { es: "Sin tu ayuda, no habríamos terminado.", en: "Without your help, we wouldn't have finished." },
      ],
    },
    deepDive: [
      { heading: "Same participles as always", body: ["**-ado / -ido**, plus the irregulars: **hecho, dicho, visto, escrito, abierto, puesto, vuelto, roto, descubierto, devuelto**."] },
      { heading: "Missed chances and regrets", body: ["It's the tense of “what might have been”: **Habría aprovechado la oportunidad** (I would have taken the opportunity). Often followed by **pero** to say why it didn't happen."] },
      { heading: "Pronouns", body: ["Pronouns go before **habría**: **Lo habría hecho.** (I would have done it.)"] },
      { heading: "Reported speech", body: ["It's also how you report a future perfect: **Dijo que para el lunes habría terminado.**"] },
    ],
    commonMistakes: [{ wrong: "Habría hacido.", right: "Habría hecho.", why: "Hacer has an irregular participle: hecho." }],
    related: ["conditional-regular", "past-perfect", "si-hubiera"],
  },
  {
    id: "future-perfect",
    title: "Future perfect: habré terminado",
    tagline: "What will have happened — and what must have happened.",
    status: "available",
    summary: {
      heading: "habré + past participle",
      body: ["The **future perfect** uses the **future of haber** (**habré, habrás, habrá, habremos, habrán**) + the participle. It says what **will have happened by a certain time** — and, very commonly, what **must have happened**."],
      table: {
        caption: "haber — future",
        headers: ["", "haber", "Example"],
        rows: [["yo", "habré", "Habré terminado."], ["tú", "habrás", "Habrás llegado."], ["él / ella / usted", "habrá", "Habrá salido."], ["nosotros", "habremos", "Habremos comido."], ["ellos / ustedes", "habrán", "Habrán llegado."]],
      },
      examples: [
        { es: "Para el viernes habré terminado.", en: "By Friday I'll have finished." },
        { es: "Ya habrán llegado.", en: "They must have arrived by now." },
      ],
    },
    deepDive: [
      { heading: "Guessing about the past", body: ["A very common use: **¿Dónde está Ana? — Habrá salido.** (She must have gone out.) **Seguramente** and **probablemente** often join in."] },
      { heading: "By then", body: ["With **para** + a time: **Para mañana, ya habré hablado con él.** (By tomorrow I'll have talked to him.)"] },
      { heading: "In everyday speech", body: ["Mexicans often use **ya** + present or **seguramente** + preterite instead: **Seguramente ya llegaron.** Both are fine."] },
    ],
    commonMistakes: [{ wrong: "Habré terminar.", right: "Habré terminado.", why: "After habré, always use the participle." }],
    related: ["future-regular", "present-perfect", "past-perfect"],
  },
  {
    id: "past-perfect-subjunctive",
    title: "Past perfect subjunctive: hubiera hablado",
    tagline: "What would have been — the unreal past.",
    status: "available",
    summary: {
      heading: "hubiera + past participle",
      body: ["Use the **imperfect subjunctive of haber** (**hubiera, hubieras, hubiera, hubiéramos, hubieran**) + the participle. It's the subjunctive of the past perfect: **a past situation that didn't happen**."],
      table: {
        caption: "haber — imperfect subjunctive",
        headers: ["", "haber", "Example"],
        rows: [["yo", "hubiera", "Si hubiera sabido…"], ["tú", "hubieras", "Si hubieras venido…"], ["él / ella / usted", "hubiera", "Si hubiera llovido…"], ["nosotros", "hubiéramos", "Si hubiéramos salido…"], ["ellos / ustedes", "hubieran", "Si hubieran llegado…"]],
      },
      examples: [
        { es: "Ojalá hubiera estudiado más.", en: "I wish I had studied more." },
        { es: "Habla como si hubiera vivido allí.", en: "He talks as if he had lived there." },
      ],
    },
    deepDive: [
      { heading: "Wishes about the past", body: ["**Ojalá hubiera + participle** = “I wish I had…”: **Ojalá hubiera ido. Ojalá no hubiera dicho eso.**"] },
      { heading: "Como si", body: ["After **como si** it describes a past that didn't happen: **Hace como si no hubiera pasado nada.**"] },
      { heading: "The accent", body: ["Only **nosotros** takes an accent: **hubiéramos**."] },
      { heading: "-se variant", body: ["There's an alternative, **hubiese**; it's more literary. Mexican speech uses **hubiera**."] },
    ],
    commonMistakes: [{ wrong: "Ojalá habría ido.", right: "Ojalá hubiera ido.", why: "After ojalá, use the subjunctive (hubiera), never the conditional." }],
    related: ["imperfect-subjunctive", "past-perfect", "si-hubiera"],
  },
  {
    id: "si-hubiera",
    title: "Si hubiera…, habría…",
    tagline: "Si hubiera sabido, habría venido.",
    status: "available",
    summary: {
      heading: "Si + hubiera + participle, habría + participle",
      body: ["For an **impossible past “if”** — something that didn't happen — use **si** + **hubiera + participle** and the **conditional perfect** for the result."],
      table: {
        headers: ["Kind of “if”", "si-clause", "Result"],
        rows: [["Possible (future)", "Si llueve (present)", "me quedaré (future)"], ["Hypothetical (now)", "Si lloviera (imperfect subj.)", "me quedaría (conditional)"], ["Impossible (past)", "Si hubiera llovido (past perf. subj.)", "me habría quedado (cond. perfect)"]],
      },
      examples: [
        { es: "Si hubiera sabido, habría venido.", en: "If I had known, I would have come." },
        { es: "Si hubiéramos salido antes, no habríamos llegado tarde.", en: "If we had left earlier, we wouldn't have arrived late." },
      ],
    },
    deepDive: [
      { heading: "Never the conditional after si", body: ["**Si habría sabido** is wrong: after **si**, use **hubiera**. The conditional goes in the other half."] },
      { heading: "Mixed conditions", body: ["A past condition with a present result: **Si hubiera estudiado, ahora tendría un buen trabajo.**"] },
      { heading: "Either order", body: ["**Habría venido si hubiera sabido.** Use a comma when **si** comes first."] },
    ],
    commonMistakes: [{ wrong: "Si habría sabido, habría venido.", right: "Si hubiera sabido, habría venido.", why: "After si, use hubiera + participle." }],
    related: ["si-hypothetical", "conditional-perfect", "past-perfect-subjunctive"],
  },
  {
    id: "should-have",
    title: "Should have, could have",
    tagline: "Debería haber…, podría haber…",
    status: "available",
    summary: {
      heading: "debería / podría / tendría que + haber + participle",
      body: ["To say what you **should have**, **could have** or **would have had to** do, use **deber / poder / tener que** in the conditional + **haber** + the participle."],
      table: {
        headers: ["Spanish", "Means"],
        rows: [["Debería haber estudiado.", "I should have studied."], ["Podrías haber llamado.", "You could have called."], ["Tendríamos que haber salido antes.", "We should have left earlier."], ["No debiste decir eso.", "You shouldn't have said that."]],
      },
      examples: [
        { es: "Debería haber llamado antes.", en: "I should have called earlier." },
        { es: "Me disculpo; no debí haberlo dicho.", en: "I apologize; I shouldn't have said it." },
      ],
    },
    deepDive: [
      { heading: "The infinitive haber stays put", body: ["**Haber** doesn't conjugate here: **debería haber hecho**, **podríamos haber ido**. Pronouns can go on the front: **Lo debería haber hecho** or **Debería habérmelo dicho**."] },
      { heading: "Shortcut: debí + infinitive", body: ["In everyday speech, **debí hacerlo** (preterite of deber) = “I should have done it”. Likewise **pude haber**…"] },
      { heading: "Regrets with ojalá and arrepentirse", body: ["**Me arrepiento de no haber ido** and **Ojalá hubiera ido** express the same feeling."] },
    ],
    commonMistakes: [{ wrong: "Debería haber estudiando.", right: "Debería haber estudiado.", why: "After haber, use the participle (-ado / -ido)." }],
    related: ["conditional-perfect", "polite-conditional"],
  },
  {
    id: "reported-speech",
    title: "Reported speech: dijo que…",
    tagline: "Telling what someone said — and shifting the tense.",
    status: "available",
    summary: {
      heading: "Said that + a step back in time",
      body: ["After a **past** reporting verb (**dijo que, me contó que, aseguró que**), the verbs usually **step back in time**."],
      table: {
        headers: ["They said…", "You report…"],
        rows: [["“Tengo hambre.” (present)", "Dijo que tenía hambre. (imperfect)"], ["“Voy a venir.” / “Iré.”", "Dijo que iba a venir. / Dijo que iría."], ["“Comí.” / “He comido.”", "Dijo que había comido."], ["“Estoy cansado.”", "Dijo que estaba cansado."]],
      },
      examples: [
        { es: "Ana dijo que tenía hambre.", en: "Ana said that she was hungry." },
        { es: "Me aseguró que vendría.", en: "He assured me he would come." },
      ],
    },
    deepDive: [
      { heading: "The tense map", body: ["present → imperfect; preterite / present perfect → past perfect; future → conditional; ir a → iba a; present subjunctive → imperfect subjunctive."] },
      { heading: "When you don't shift", body: ["If the reporting verb is **present** (**dice que, dicen que**) or the information is still true and fresh, the tense can stay: **Dice que tiene hambre.**"] },
      { heading: "Time and place words", body: ["**hoy → ese día; ayer → el día anterior; mañana → al día siguiente; ahora → entonces; aquí → allí.**"] },
      { heading: "Según", body: ["**Según Ana, viene mañana.** (According to Ana…) needs no tense shift."] },
    ],
    commonMistakes: [{ wrong: "Dijo que tiene hambre ayer.", right: "Dijo que tenía hambre.", why: "After a past reporting verb, step the tense back: tenía." }],
    related: ["preterite-vs-imperfect", "past-perfect", "conditional-regular"],
  },
  {
    id: "reported-questions",
    title: "Reported questions and requests",
    tagline: "Preguntó si… Me pidió que…",
    status: "available",
    summary: {
      heading: "Preguntó + si / question word; pidió que + subjunctive",
      body: ["Report a yes/no question with **si** (“whether”) and a question-word question with the **question word** (no **que**). Report a request or command with **pedir / decir que** + the **imperfect subjunctive** (after a past verb)."],
      table: {
        headers: ["They said…", "You report…"],
        rows: [["“¿Tienes hermanos?”", "Me preguntó si tenía hermanos."], ["“¿Dónde vives?”", "Me preguntó dónde vivía."], ["“Ven mañana.”", "Me pidió que viniera al día siguiente."], ["“No hables.”", "Me dijo que no hablara."]],
      },
      examples: [
        { es: "Me preguntó dónde vivía.", en: "He asked me where I lived." },
        { es: "Me pidió que la ayudara.", en: "She asked me to help her." },
      ],
    },
    deepDive: [
      { heading: "Si = whether", body: ["A yes/no question needs **si**: **Preguntó si venía.** (He asked whether I was coming.)"] },
      { heading: "Question words keep their accent", body: ["**Preguntó qué quería, dónde estaba, cuándo llegaba, por qué se iba.** Never add **que**."] },
      { heading: "Commands become subjunctive", body: ["**Pedir / decir que + subjunctive** reports orders and requests, and shifts to the **imperfect subjunctive** after a past verb: **Me dijo que viniera.**"] },
    ],
    commonMistakes: [{ wrong: "Preguntó que dónde vivía.", right: "Preguntó dónde vivía.", why: "Don't add que before a question word." }],
    related: ["reported-speech", "imperfect-subjunctive", "questions"],
  },
];
