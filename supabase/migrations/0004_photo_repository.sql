-- Photo repository — pastors upload raw photos into a campus pool, admin
-- curates which goes into which structural slot (hero, gallery, pastor, kids).
--
-- Pastor permission: write to intake_repository_photo only.
-- Admin permission:  write to intake_photo (the assignment table) — that's
-- where the public campus page reads from.
--
-- Storage paths live in storage.objects bucket 'intake' under
-- repository/<campus-slug>/<filename>. Same bucket as intake form photos
-- so signed-URL helpers don't need to learn a new path.

create extension if not exists pgcrypto;

create table intake_repository_photo (
  id uuid primary key default gen_random_uuid(),
  campus_slug text not null references intake_campus(slug) on delete cascade,
  storage_path text not null,
  file_name text,
  mime_type text,
  size_bytes int,
  width int,
  height int,
  caption text,
  -- 'people' | 'kids' | 'venue' | 'worship' | 'event' | 'pastors' | 'other'
  category text not null default 'other',
  notes text,
  uploaded_by text,
  uploaded_at timestamptz not null default now()
);
create index on intake_repository_photo (campus_slug, uploaded_at desc);
create index on intake_repository_photo (campus_slug, category);

-- Add a foreign-key column on the existing intake_photo table so each
-- assignment can point back to its source in the repository. Nullable for
-- legacy / event-cover rows that don't go through the repo.
alter table intake_photo
  add column if not exists repository_photo_id uuid references intake_repository_photo(id) on delete set null;
create index if not exists intake_photo_repo_photo_idx on intake_photo (repository_photo_id);

alter table intake_repository_photo enable row level security;
