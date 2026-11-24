-- PyMarker cloud sync: run this once in Supabase → SQL Editor → New query → Run.
-- One row per signed-in person; row-level security means people can only read and write their own row.

create table if not exists public.progress (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  data       jsonb not null check (octet_length(data::text) < 400000),   -- ~400 KB cap per person
  updated_at timestamptz not null default now()
);

alter table public.progress enable row level security;

drop policy if exists "read own"   on public.progress;
drop policy if exists "insert own" on public.progress;
drop policy if exists "update own" on public.progress;
create policy "read own"   on public.progress for select to authenticated using ((select auth.uid()) = user_id);
create policy "insert own" on public.progress for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "update own" on public.progress for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

revoke all on public.progress from anon;
revoke delete, truncate on public.progress from authenticated;

-- The server sets the timestamp, not the browser.
create or replace function public.progress_touch() returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end $$;
drop trigger if exists progress_touch on public.progress;
create trigger progress_touch before insert or update on public.progress for each row execute function public.progress_touch();
