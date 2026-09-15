-- Restore the missing schema migration before appointments realtime is enabled.
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  notes text,
  scheduled_at timestamptz not null,
  lead_id uuid references public.leads(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.appointments enable row level security;
create index if not exists appointments_scheduled_at_idx on public.appointments(scheduled_at);
