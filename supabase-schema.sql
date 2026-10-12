-- LuggageLess database schema.
-- Run this in the Supabase dashboard: SQL Editor > New query > paste > Run.
-- It creates two tables (profiles, trips) with row-level security so each
-- user can only read and write their own rows.

-- Profiles: one row per user, holds the whole profile object as JSON.
create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- Trips: many rows per user, each holding the trip object as JSON.
create table if not exists public.trips (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references auth.users (id) on delete cascade,
  data jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists trips_user_id_idx on public.trips (user_id);

-- Enable row-level security.
alter table public.profiles enable row level security;
alter table public.trips enable row level security;

-- Profiles policies: a user manages only their own profile row.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid () = user_id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid () = user_id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid () = user_id);

-- Trips policies: a user manages only their own trips.
drop policy if exists "trips_select_own" on public.trips;
create policy "trips_select_own" on public.trips
  for select using (auth.uid () = user_id);

drop policy if exists "trips_insert_own" on public.trips;
create policy "trips_insert_own" on public.trips
  for insert with check (auth.uid () = user_id);

drop policy if exists "trips_update_own" on public.trips;
create policy "trips_update_own" on public.trips
  for update using (auth.uid () = user_id);

drop policy if exists "trips_delete_own" on public.trips;
create policy "trips_delete_own" on public.trips
  for delete using (auth.uid () = user_id);
