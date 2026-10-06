# ¡Habla! — learn Mexican Spanish

A structured Spanish course for English speakers: a real curriculum with vocabulary, explicit grammar,
listening, spaced-repetition review and light gamification — built around **Mexican Spanish**.

The first version is a local-first web app (Next.js App Router) designed to grow into a mobile app.
It has no backend and never calls an AI API; both can be added without rewriting the product.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run check      # typecheck + lint + tests (run before every commit)
npm run build      # production build
```

The first visit walks through onboarding. To preview a lived-in app, open **Profile → Testing tools** and
use **Load sample progress**; use **+1 day** there to watch spaced repetition bring words back.

## What's in the course

5 playable units (26 lessons, ~480 exercises, ~175 words and phrases) — Hello · Introducing Yourself ·
Essential Verbs · People & Family (with an uncensored, clearly labeled *Real Talk* lesson) · Food & Drink —
plus a 12-unit map showing where the course is heading. 16 grammar topics are taught and explained;
11 more are on the roadmap.

## Architecture

```
src/
  content/        Static, authored data — the course. No UI.
    types.ts        The content schema (exercise union, lessons, vocab, grammar…)
    vocabulary/     Word entries (Spanish, English, gender, register, region, conjugations…)
    grammar/        Grammar concepts: short summary + deep dive + common mistakes
    course/         builders.ts (authoring DSL) and units/*.ts (the lessons)
  lib/            Pure, tested learning logic. No React.
    engine/         Answer checking (accent/typo tolerance), session reducer, tile banks
    mastery/        Word-mastery model (strength × forgetting × encounters)
    srs/            SM-2-inspired scheduler, review queue, review-exercise generator
    gamification/   XP rules, levels, forgiving streak, achievements
    state/          Learner state, commitSession(), selectors, external store + hooks
    storage/        Repository interface + localStorage implementation + migrations
    audio/          Speech synthesis behind a recorded-audio-ready clip model
  config/         Every tunable number: XP, levels, mastery, SRS
  components/     UI: ui/ (design system) · lesson/ (player + exercise views) · charts/ · …
  app/            Routes. (app) has the shell; (focus) is distraction-free (lessons, onboarding)
```

### Key ideas

- **Data-driven lessons.** A lesson is plain data (`Exercise[]`). The UI never knows about specific
  lessons: `ExerciseRenderer` maps `exercise.type` → component. New content needs no UI change; a new
  exercise *type* is one schema entry, one evaluator case and one registered view.
- **Mastery, not a boolean.** Each word has recall strength that grows with correct answers (more for
  typing than recognizing, less for harder words), drops on a miss, decays with time since last review, and
  is capped by how many times the word has been seen. See `config/mastery.ts`.
- **Spaced repetition.** Scheduling advances once per *session* per word (SM-2 learning steps), misses
  return in minutes, and early practice never inflates intervals. Review sessions are generated from due
  words — recognition drills for weak words, production (typing, dictation, cloze, conjugation) for strong
  ones — so any new vocabulary is reviewable automatically. See `lib/srs/`.
- **Gentle feedback.** You answer first; then you see *Your answer / Better / Why?*. Missed exercises
  come back once at the end of the lesson. Accent-only slips and one-letter typos are accepted with a note.
- **Forgiving gamification.** One rest day per week is built into the streak; XP rules are centralized in
  `config/xp.ts`; there are no leaderboards.
- **Adaptive English.** `settings.translationSupport` (always / on tap / minimal) controls how much English
  appears next to Spanish; `TranslatedText` is the single place that honors it.
- **Dialects.** The course declares `dialect: "es-MX"`; words carry `register` (standard / informal / slang /
  vulgar) and `regions`, plus per-region notes. Adding Spain or Argentina means a new course (or regional
  overlays) — not a new engine.
- **Persistence & accounts.** Progress lives behind `LearnerRepository` (localStorage today, with schema
  migrations). `lib/auth/session.ts` is the seam where a signed-in user will plug in; a cloud repository can
  wrap the same interface.
- **Audio.** `AudioRef { text, sources? }` — speech synthesis today (prefers an `es-MX` voice); drop recorded
  files into `sources.slow/normal` and they win automatically.

### Not built yet (by design)

AI tutoring/conversation, speech recognition/pronunciation scoring, accounts and cloud sync, leaderboards.
The exercise schema, audio model and repository seam are shaped so each can be added cleanly.

## Quality gates

- `npm run check` runs TypeScript, ESLint and Vitest.
- `src/content/content.test.ts` is the **content linter**: every reference resolves, every exercise is
  answerable, no word is tested before it's introduced, each new word is practiced twice in its lesson and
  three times overall, and grammar is taught before it's tested.

See [docs/AUTHORING.md](docs/AUTHORING.md) to add vocabulary, grammar and lessons.
