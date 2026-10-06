# Authoring content

Everything a learner sees in the course lives in `src/content/`. You never touch UI code to add a lesson.

## 1. Add vocabulary

`src/content/vocabulary/*.ts` — use the `entries(topic, [...])` helper.

```ts
{ id: "madre", es: "madre", en: "mother", pos: "noun", g: "f", pl: "madres",
  ex: ["Mi madre es maestra.", "My mother is a teacher."], pron: "MAH-dreh",
  note: "…teaching note…", rel: ["mama"] }
```

- `reg`: `"standard"` (default) · `"informal"` · `"slang"` · `"vulgar"`. Slang and vulgar words **must** have
  `regions` (the test enforces it) and a note on when *not* to use them.
- `regions: ["mx"]` marks regional words; `rn: [["es", "In Spain…"]]` adds regional notes.
- Verbs take `verb: { …, conjugations: present([yo, tú, él/ella/usted, nosotros, ellos/ustedes]) }`.
  (Vosotros is deliberately omitted for Mexican Spanish and explained in the grammar notes.)
- Gendered adjectives/people use `fem`. Pairs the course teaches separately (madre/padre) are two entries.
- Register the file in `vocabulary/index.ts`.

## 2. Add grammar

`src/content/grammar/*.ts` — a `GrammarConcept` has a short `summary` (shown in lessons), a `deepDive`
(behind "Learn more"), and `commonMistakes`. `**bold**` and `*italic*` work in body text.
Roadmap topics use the `planned(...)` helper and show as "Coming soon".

## 3. Write a lesson

`src/content/course/units/unit-XX-*.ts`. Use the builders from `course/builders.ts`:

| Builder | Exercise |
|---|---|
| `intro(ids)` | vocabulary introduction cards (teaching) |
| `grammarNote(id)` | the grammar card (teaching) |
| `natural(...)` | "How people actually say it" — textbook vs. natural (teaching) |
| `meaning` / `sayIt` / `ask` | multiple choice (`ask` accepts a dialogue `context`) |
| `gq` | grammar question (a sentence with `___` and options) |
| `toEn` / `toEs` | typed translation (list every accepted answer) |
| `buildEs` / `buildEn` | tile-based sentence building (add `distractors`) |
| `blank` | fill in the blank (typed, or choose with `options`) |
| `match` | matching round `[vocabId, shortEnglish]` |
| `heard` / `dictate` | listening: choose the meaning / type what you hear |

Options for every exercise: `v` (vocab ids it practices — **this drives mastery and review**), `g` (grammar
ids), `why` (shown after a miss), `fb` (feedback for specific wrong answers).

A good lesson: intro → recognition → matching → listening → production → a grammar note and questions →
a "how people say it" card → mixed review including **earlier** vocabulary. Aim for 12–20 exercises.
Kinds: `standard`, `checkpoint` (unit wrap-up), `real-talk` (slang; add a `warning`).

Register the unit in `course/index.ts`. Units marked `comingSoon` appear on the map but can't be started.

## 4. Run the content linter

```bash
npx vitest run src/content
```

It fails with a precise message when a reference is missing, an answer isn't in its options, a tile bank
can't build an accepted sentence, a word is tested before it's introduced, or new words aren't practiced
enough. Fix the content, not the test.

## Adding an exercise type

1. Add an interface to the `Exercise` union in `content/types.ts`.
2. Handle it in `lib/engine/evaluate.ts` (and `recallKindOf`).
3. Build a view in `components/lesson/exercises/` and register it in `ExerciseRenderer.tsx`.
4. Add a builder in `course/builders.ts` and a round-trip case in `content.test.ts`.
