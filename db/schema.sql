-- extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "vector";

-- enums
do $$ begin
  create type severity as enum ('mild','moderate','severe');
exception when duplicate_object then null; end $$;

-- tables
create table if not exists public.cameras (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  hls_url text not null,
  snapshot_url text,
  location jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.people (
  id uuid primary key default uuid_generate_v4(),
  label text not null,
  embedding vector(512),     -- optional for later face matching
  meta jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.alerts (
  id uuid primary key default uuid_generate_v4(),
  camera_id uuid references public.cameras(id) on delete set null,
  person_id uuid references public.people(id) on delete set null,
  severity severity not null default 'moderate',
  title text,
  description text,
  image_url text,
  video_url text,
  channels text[] default '{}', -- ['push','sms','email']
  location jsonb,
  created_at timestamptz not null default now()
);

-- basic RLS (open for now; we’ll lock down with auth later)
alter table public.cameras enable row level security;
alter table public.people  enable row level security;
alter table public.alerts  enable row level security;

create policy "anon read cameras" on public.cameras for select using (true);
create policy "anon read people"  on public.people  for select using (true);
create policy "anon read alerts"  on public.alerts  for select using (true);

create policy "server write cameras" on public.cameras for insert with check (true);
create policy "server write people"  on public.people  for insert with check (true);
create policy "server write alerts"  on public.alerts  for insert with check (true);

-- indexes
create index if not exists alerts_created_at_idx on public.alerts (created_at desc);
create index if not exists alerts_severity_idx on public.alerts (severity);
