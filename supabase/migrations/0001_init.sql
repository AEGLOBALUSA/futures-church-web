-- enable extensions
create extension if not exists pgcrypto;

-- subscribers (newsletter, Selah waitlist, daily word, all email captures)
create table subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  phone text,
  source text not null,         -- 'homepage' | 'selah-waitlist' | 'daily-word' | 'launch-{slug}' | 'plan-a-visit'
  interests text[] default '{}',
  consent boolean not null default true,
  created_at timestamptz not null default now(),
  last_touch timestamptz not null default now()
);
create index on subscribers (source);
create index on subscribers (last_touch desc);

-- prayer requests
create table prayer_requests (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  request text not null,
  campus_slug text,
  anonymous boolean not null default false,
  status text not null default 'new',  -- 'new' | 'praying' | 'closed'
  created_at timestamptz not null default now()
);
create index on prayer_requests (status, created_at desc);

-- AI chat events (per-turn analytics, not full transcripts)
create table chat_events (
  id bigserial primary key,
  session_id uuid,
  role text not null,
  content text,
  created_at timestamptz not null default now()
);
create index on chat_events (session_id, created_at);

-- campuses (mirrors lib/content/campuses.ts; optional CMS path)
create table campuses (
  slug text primary key,
  name text not null,
  brand text not null,
  region text not null,
  country text not null,
  city text not null,
  address text,
  lead_pastors text,
  status text not null default 'active',
  lat numeric, lng numeric,
  instagram text, facebook text, spanish boolean default false,
  updated_at timestamptz not null default now()
);

-- leaders, books, sermons, media_assets — populate as the CMS matures
create table sermons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  speaker text,
  series text,
  video_url text,
  duration_seconds int,
  published_at timestamptz,
  campus_slug text references campuses(slug)
);

create table media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket text not null,
  path text not null,
  alt text,
  used_on text[],
  uploaded_at timestamptz not null default now()
);

-- RLS — only the service role writes. Anon role reads only public reference tables.
alter table subscribers enable row level security;
alter table prayer_requests enable row level security;
alter table chat_events enable row level security;
alter table campuses enable row level security;
alter table sermons enable row level security;
alter table media_assets enable row level security;

create policy "anon reads campuses" on campuses for select to anon using (true);
create policy "anon reads sermons"  on sermons  for select to anon using (true);
create policy "anon reads media"    on media_assets for select to anon using (true);
-- subscribers, prayer_requests, chat_events: NO anon policies. Server-only writes.
