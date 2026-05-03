-- Campus events — the heartbeat of "what's coming up at our church."
-- Pastors add/edit events through the same intake_campus.access_token they
-- already have. RLS keeps everything service-role-only; API routes do the auth.

create extension if not exists pgcrypto;

create table campus_event (
  id uuid primary key default gen_random_uuid(),
  campus_slug text not null references intake_campus(slug) on delete cascade,
  -- 'service' | 'kids' | 'youth' | 'women' | 'men' | 'prayer' | 'special' | 'conference' | 'general'
  category text not null default 'general',
  title text not null,
  description text,
  -- Either timed (starts_at + ends_at) or all-day (starts_at = day 00:00, all_day = true).
  starts_at timestamptz not null,
  ends_at timestamptz,
  all_day boolean not null default false,
  -- Where it happens — defaults to the campus address if null.
  location text,
  -- Audience tags: 'everyone' | 'kids' | 'parents' | 'youth' | 'women' | 'men' | 'leaders'
  audience text[] not null default array['everyone']::text[],
  -- Optional cover image (supabase storage path in 'intake' bucket, prefixed events/<slug>/...).
  cover_image_path text,
  -- Optional external registration / sign-up.
  registration_url text,
  -- Highlights this event in the "Coming up" rail and on home upcoming.
  is_featured boolean not null default false,
  -- Drafts (false) don't show on public surfaces.
  is_published boolean not null default true,
  -- 'none' | 'weekly' | 'biweekly' | 'monthly' (V1: only 'none' and 'weekly' surface in UI)
  recurrence text not null default 'none',
  -- For recurring events: groups instances together so editing the parent updates all future ones.
  series_id uuid,
  -- Audit.
  created_by text,
  created_at timestamptz not null default now(),
  updated_by text,
  updated_at timestamptz not null default now()
);
create index on campus_event (campus_slug, starts_at);
create index on campus_event (starts_at) where is_published = true;
create index on campus_event (campus_slug) where is_published = true and is_featured = true;

-- Short-form announcements — "what's special this Sunday" type things that
-- aren't full calendar events. Render on campus page hero / "this Sunday" strip.
create table campus_announcement (
  id uuid primary key default gen_random_uuid(),
  campus_slug text not null references intake_campus(slug) on delete cascade,
  body text not null,
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  is_published boolean not null default true,
  created_by text,
  created_at timestamptz not null default now()
);
create index on campus_announcement (campus_slug, ends_at desc nulls last);

-- Audit log — every event edit, separate from intake_activity for cleaner analytics.
create table campus_event_activity (
  id bigserial primary key,
  event_id uuid references campus_event(id) on delete set null,
  campus_slug text,
  -- 'created' | 'updated' | 'deleted' | 'published' | 'unpublished'
  event_type text not null,
  description text,
  actor_name text,
  actor_role text,
  created_at timestamptz not null default now()
);
create index on campus_event_activity (campus_slug, created_at desc);

alter table campus_event enable row level security;
alter table campus_announcement enable row level security;
alter table campus_event_activity enable row level security;

-- Storage — events use the existing 'intake' bucket with path prefix events/<campus-slug>/...
-- No new bucket needed.
