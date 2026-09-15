-- LEADS table
create table public.leads (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  phone text,
  email text,
  service_type text,
  message text,
  status text not null default 'new',
  scheduled_at timestamptz,
  notes text default '',
  prefer_phone boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- updated_at trigger
create or replace function public.update_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger leads_updated_at
  before update on public.leads
  for each row execute function public.update_updated_at();

-- Realtime
alter table public.leads replica identity full;
alter publication supabase_realtime add table public.leads;

-- RLS
alter table public.leads enable row level security;

create policy "Authenticated can view leads"
  on public.leads for select
  to authenticated
  using (true);

create policy "Authenticated can update leads"
  on public.leads for update
  to authenticated
  using (true);

create policy "Anyone can insert leads"
  on public.leads for insert
  to anon, authenticated
  with check (true);

-- PUSH SUBSCRIPTIONS
create table public.push_subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz default now()
);

alter table public.push_subscriptions enable row level security;

create policy "Users manage own subscriptions"
  on public.push_subscriptions for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
