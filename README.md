# ¡Habla! — learn Mexican Spanish

A structured Spanish course for English speakers: a real curriculum with vocabulary, explicit grammar,
listening, spaced-repetition review and light gamification — built around **Mexican Spanish**.

The first version is a local-first web app (Next.js App Router) designed to grow into a mobile app.
It never calls an AI API. Progress is saved on the device first; an optional Supabase account syncs it across devices (see *Accounts & sync*).

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

30 playable units (151 lessons, ~3,750 exercises, ~620 words and phrases) — Hello · Introducing Yourself ·
Essential Verbs · People & Family · Food & Drink · Question Words · Places & Directions · Present-Tense Verbs ·
Making Plans · Shopping · Work & School · Friends & Social Life · What Happened (preterite) · How Things Were
(imperfect) · Travel & Culture · My Day (reflexive verbs) · Lo, La, Me, Te (object pronouns) · Do This, Don't Do That
(commands) · What Will Happen (future) · Better, Bigger, Faster (comparisons) · Would You…? (conditional) · Happening Now, Done Already (progressive and present perfect) · I Hope That… (subjunctive) · Connecting Ideas (prepositions and connectors) · Had Already Happened (past perfect) · If I Were You (imperfect subjunctive) · Se Habla Español (se constructions) · What Would Have Happened (conditional and future perfect) · If Only I Had Known (unreal past) · He Said That… (reported speech) — with four uncensored, clearly labeled *Real Talk*
lessons (slang and vulgar expressions behind a heads-up screen). 79 grammar topics are taught and explained; 3 more
(dialect variants and idioms) are on the roadmap.

**Placement.** Learners who say they know some Spanish get a short, no-feedback check (two questions per unit across all 30 units,
easiest first; it stops at the first level not fully passed). Accepting the result marks earlier lessons
"skipped" and adds their words to the library at moderate mastery, spread over the next days of review so the
assumption is checked gently. It's re-takeable from Profile. See `src/content/placement.ts` and `src/lib/placement.ts`.

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
    auth/           Supabase sign-in/up/out, password reset, account state
    sync/           Merge + cloud sync engine (progress follows the account across devices)
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
- **Persistence & accounts.** Local-first: progress is always written to `localStorage` (behind
  `LearnerRepository`, with schema migrations), so the app works offline and signed out. Signing in adds
  cloud sync on top — see below.
- **Audio.** `AudioRef { text, sources? }` — speech synthesis today (prefers an `es-MX` voice); drop recorded
  files into `sources.slow/normal` and they win automatically.

### Not built yet (by design)

AI tutoring/conversation, speech recognition/pronunciation scoring, leaderboards.
The exercise schema and audio model are shaped so each can be added cleanly.

## Accounts & sync

Email + password accounts (Supabase) let progress follow a learner from phone to desktop. Without the
setup below the app still works exactly as before — progress stays on the device and the account screens
say accounts aren't set up.

**One-time setup**

1. Create a project at [supabase.com](https://supabase.com).
2. **SQL Editor** → paste and run [`supabase/schema.sql`](supabase/schema.sql) (one table, with row-level
   security so each person can only reach their own row).
3. **Authentication → Providers → Email**: set *minimum password length* to 8 (the app enforces 8 too).
   Leave *Confirm email* on for production; turn it off to sign up instantly while testing.
4. **Authentication → URL Configuration**: set *Site URL* to the deployed app's URL and add it plus
   `http://localhost:3000` to *Redirect URLs*. Confirmation and password-reset emails link back to the app.
5. **Project Settings → API**: copy the project URL and the anon/publishable key into `.env.local`
   (template: [`.env.example`](.env.example)). On your host (e.g. Vercel) set the same two variables —
   they are baked in at build time, so redeploy after changing them.

**How it works** (`src/lib/sync/`, `src/lib/auth/`)

- Every change is saved locally first, then pushed to the account a moment later. The app pulls when it
  returns to the foreground or the network comes back, so switching devices picks up where you left off.
- **Merging, not overwriting.** If two devices were used apart, progress is merged record by record
  (`sync/merge.ts`): each word/lesson/day keeps whichever copy is more recent, achievements are unioned,
  and profile/settings take the most recent *edit*. Writes use a revision check, so a device that is behind
  re-reads, merges and retries instead of clobbering the other.
- **Reset and import** start a new `epoch`, which other devices adopt instead of merging old progress back.
- **Signing out** pushes pending progress, then removes it from that device (so a shared device starts
  clean). If it can't be saved (offline) you're asked before it's discarded.
- Signing in on a device with signed-out progress folds that progress into the account; signing in as a
  *different* account on the same device never mixes the two.

## Quality gates

- `npm run check` runs TypeScript, ESLint and Vitest.
- `src/content/content.test.ts` is the **content linter**: every reference resolves, every exercise is
  answerable, no word is tested before it's introduced, each new word is practiced twice in its lesson and
  three times overall, and grammar is taught before it's tested.

See [docs/AUTHORING.md](docs/AUTHORING.md) to add vocabulary, grammar and lessons.
