-- Room/session infrastructure for multiplayer mystery gameplay.

create extension if not exists pgcrypto;

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  room_code text not null unique,
  story_id text not null,
  host_id text not null,
  stage text not null default 'room_lobby',
  phase_id text not null default 'briefing',
  session_version bigint not null default 1,
  last_event_id text,
  state_snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.room_players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  player_id text not null,
  nickname text not null,
  color text,
  is_host boolean not null default false,
  is_connected boolean not null default true,
  joined_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (room_id, player_id)
);

create table if not exists public.room_events (
  id text primary key,
  room_id uuid not null references public.rooms(id) on delete cascade,
  actor text not null,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  session_version bigint not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_room_events_room_created_at
  on public.room_events(room_id, created_at desc);

create table if not exists public.room_snapshots (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  session_version bigint not null,
  snapshot jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_room_snapshots_room_version
  on public.room_snapshots(room_id, session_version desc);

-- Optional gameplay artifacts for analytics/moderation
create table if not exists public.room_votes (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  voter_id text not null,
  voted_character_id text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.room_annotations (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  actor text not null,
  note text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.room_pings (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  actor text not null,
  message text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Triggers for updated_at
create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_rooms_updated_at on public.rooms;
create trigger trg_rooms_updated_at
before update on public.rooms
for each row execute function public.touch_updated_at();

drop trigger if exists trg_room_players_updated_at on public.room_players;
create trigger trg_room_players_updated_at
before update on public.room_players
for each row execute function public.touch_updated_at();

-- RLS baselines (tighten in production with authenticated users or signed room tokens)
alter table public.rooms enable row level security;
alter table public.room_players enable row level security;
alter table public.room_events enable row level security;
alter table public.room_snapshots enable row level security;
alter table public.room_votes enable row level security;
alter table public.room_annotations enable row level security;
alter table public.room_pings enable row level security;

drop policy if exists rooms_read on public.rooms;
create policy rooms_read on public.rooms for select using (true);

drop policy if exists rooms_write on public.rooms;
create policy rooms_write on public.rooms for all using (true) with check (true);

drop policy if exists room_players_rw on public.room_players;
create policy room_players_rw on public.room_players for all using (true) with check (true);

drop policy if exists room_events_rw on public.room_events;
create policy room_events_rw on public.room_events for all using (true) with check (true);

drop policy if exists room_snapshots_rw on public.room_snapshots;
create policy room_snapshots_rw on public.room_snapshots for all using (true) with check (true);

drop policy if exists room_votes_rw on public.room_votes;
create policy room_votes_rw on public.room_votes for all using (true) with check (true);

drop policy if exists room_annotations_rw on public.room_annotations;
create policy room_annotations_rw on public.room_annotations for all using (true) with check (true);

drop policy if exists room_pings_rw on public.room_pings;
create policy room_pings_rw on public.room_pings for all using (true) with check (true);
