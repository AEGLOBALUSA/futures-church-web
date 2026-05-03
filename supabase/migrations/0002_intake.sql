-- Intake portal — collaborative content collection from each campus.
-- One row per campus in intake_campus, granular field rows in intake_response,
-- photos in intake_photo, comments in intake_comment, audit in intake_activity.

create extension if not exists pgcrypto;

create table intake_campus (
  slug text primary key,
  display_name text not null,
  region text not null,
  language text not null default 'en',
  access_token text not null unique,
  primary_pastor_email text,
  primary_pastor_name text,
  -- 'invited' | 'started' | 'submitted' | 'published'
  status text not null default 'invited',
  progress_pct int not null default 0,
  invited_at timestamptz,
  last_activity_at timestamptz,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on intake_campus (status);
create index on intake_campus (last_activity_at desc nulls last);

create table intake_response (
  id uuid primary key default gen_random_uuid(),
  campus_slug text not null references intake_campus(slug) on delete cascade,
  section_key text not null,
  field_key text not null,
  value jsonb,
  last_edited_by text,
  last_edited_at timestamptz not null default now(),
  unique (campus_slug, section_key, field_key)
);
create index on intake_response (campus_slug);
create index on intake_response (campus_slug, section_key);

create table intake_photo (
  id uuid primary key default gen_random_uuid(),
  campus_slug text not null references intake_campus(slug) on delete cascade,
  -- 'hero' | 'gallery' | 'pastors' | 'kids' | 'welcome-video'
  section_key text not null,
  storage_path text not null,
  file_name text,
  mime_type text,
  size_bytes int,
  caption text,
  sort_order int not null default 0,
  uploaded_by text,
  uploaded_at timestamptz not null default now()
);
create index on intake_photo (campus_slug, section_key, sort_order);

create table intake_comment (
  id uuid primary key default gen_random_uuid(),
  campus_slug text not null references intake_campus(slug) on delete cascade,
  section_key text not null,
  author_name text,
  body text not null,
  created_at timestamptz not null default now()
);
create index on intake_comment (campus_slug, section_key, created_at);

create table intake_activity (
  id bigserial primary key,
  campus_slug text references intake_campus(slug) on delete set null,
  -- 'invited' | 'opened' | 'field_saved' | 'photo_uploaded' | 'comment_added' | 'submitted' | 'reminder_sent'
  event_type text not null,
  description text not null,
  actor_name text,
  metadata jsonb,
  created_at timestamptz not null default now()
);
create index on intake_activity (created_at desc);
create index on intake_activity (campus_slug, created_at desc);

create table intake_admin (
  email text primary key,
  display_name text,
  created_at timestamptz not null default now()
);

create table intake_admin_session (
  token text primary key,
  email text not null references intake_admin(email) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  used_at timestamptz
);
create index on intake_admin_session (email, created_at desc);

-- RLS — service role only. All intake reads/writes go through API routes.
alter table intake_campus enable row level security;
alter table intake_response enable row level security;
alter table intake_photo enable row level security;
alter table intake_comment enable row level security;
alter table intake_activity enable row level security;
alter table intake_admin enable row level security;
alter table intake_admin_session enable row level security;

-- Storage bucket for intake photos. Private — served via signed URLs from API routes.
insert into storage.buckets (id, name, public)
values ('intake', 'intake', false)
on conflict (id) do nothing;
