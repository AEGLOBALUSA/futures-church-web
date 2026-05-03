-- Inbox — durable persistence for messages from /api/contact, /api/visit,
-- /api/capture, /api/prayer (in addition to whatever email/CRM provider
-- the env keys point at). When RESEND_API_KEY isn't set yet, this is the
-- only place these messages exist. Once email is wired, they're a safety net.

create extension if not exists pgcrypto;

create table if not exists inbox_messages (
  id uuid primary key default gen_random_uuid(),
  -- 'contact' | 'visit' | 'capture' | 'prayer' | 'newsletter'
  source text not null,
  name text,
  email text,
  phone text,
  campus_slug text,
  -- For contact: which team (pastoral, partnerships, etc.). Null otherwise.
  team text,
  -- Full original payload, in case we need fields we didn't denormalise.
  body jsonb not null,
  urgent boolean not null default false,
  -- 'new' | 'in-progress' | 'replied' | 'archived'
  status text not null default 'new',
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  responded_by text
);
create index if not exists inbox_messages_status_idx on inbox_messages (status, created_at desc);
create index if not exists inbox_messages_source_idx on inbox_messages (source, created_at desc);
create index if not exists inbox_messages_urgent_idx on inbox_messages (urgent, created_at desc) where urgent = true;

alter table inbox_messages enable row level security;
