-- Site-wide content slots — every editable copy block on the public site
-- that's NOT per-campus. Each slot has a stable id, a current value, an
-- assigned owner, and a status. Empty slots show as warm dashed boxes in
-- review mode; filled slots render the value.
--
-- Default owner is "Josh Greenwood (or appointee)" per Ashley's call —
-- Josh re-delegates anything he doesn't want to write himself.

create table if not exists content_slot (
  id text primary key,
  value text not null default '',
  owner text not null default 'Josh Greenwood (or appointee)',
  status text not null default 'empty' check (status in ('empty', 'draft', 'filled')),
  updated_at timestamptz not null default now(),
  updated_by text
);

-- Lightweight history so we can roll back without leaning on Supabase
-- point-in-time recovery for what should be a small number of edits.
create table if not exists content_slot_history (
  id bigserial primary key,
  slot_id text not null,
  value text not null,
  updated_by text,
  updated_at timestamptz not null default now()
);

create index if not exists idx_content_slot_history_slot
  on content_slot_history (slot_id, updated_at desc);
