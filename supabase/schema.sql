-- ¡Habla! cloud progress. Run once in the Supabase SQL editor (Dashboard → SQL Editor → New query).
--
-- One row per account holding the learner's whole progress as JSON. `revision` lets the app detect
-- that another device wrote first (optimistic concurrency) and merge instead of overwriting.

create table if not exists public.learner_state (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  state      jsonb       not null,
  revision   integer     not null default 1,
  updated_at timestamptz not null default now()
);

alter table public.learner_state enable row level security;

-- Each person can only ever see and change their own row.
create policy "learner_state: read own"   on public.learner_state for select using ((select auth.uid()) = user_id);
create policy "learner_state: insert own" on public.learner_state for insert with check ((select auth.uid()) = user_id);
create policy "learner_state: update own" on public.learner_state for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "learner_state: delete own" on public.learner_state for delete using ((select auth.uid()) = user_id);
