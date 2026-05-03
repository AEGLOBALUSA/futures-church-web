-- Per-key rate limit counters. Cheap counter table indexed by a string
-- key (typically "chat:<ip>" or "form:<route>:<ip>") and a bucket timestamp.
-- Each request upserts +1 in the current bucket; the helper rejects if the
-- count for that key+bucket exceeds the limit.
--
-- Old rows can be cleaned up periodically — see the SQL block at the bottom.

create extension if not exists pgcrypto;

create table if not exists rate_limit_counter (
  key text not null,
  -- Bucket — usually `date_trunc('minute', now())` or `date_trunc('hour', now())`
  -- so multiple requests in the same window collapse to one row.
  bucket timestamptz not null,
  count int not null default 1,
  updated_at timestamptz not null default now(),
  primary key (key, bucket)
);
create index if not exists rate_limit_counter_recent_idx on rate_limit_counter (updated_at desc);

alter table rate_limit_counter enable row level security;

-- Optional: a stored procedure that the API can call to atomically increment.
-- Postgres handles concurrent upserts via the unique key, so plain upsert is fine.
