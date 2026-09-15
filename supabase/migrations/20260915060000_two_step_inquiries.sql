begin;
-- Capability hashes stay separate from CRM records and are never exposed to clients.
create table public.inquiry_sessions (
  token_hash text primary key,
  lead_id uuid unique references public.leads(id) on delete cascade,
  expires_at timestamptz not null default now() + interval '24 hours',
  completed boolean not null default false
);
alter table public.inquiry_sessions enable row level security;
revoke all on public.inquiry_sessions from public, anon, authenticated;

create function public.save_website_inquiry(p_token text, p_name text, p_phone text, p_details jsonb default null)
returns void language plpgsql security definer set search_path = '' as $$
declare
  session_row public.inquiry_sessions;
  hashed text;
begin
  if p_token is null or p_token !~ '^[a-f0-9]{64}$' then raise exception 'Invalid session'; end if;
  if p_name is null or length(btrim(p_name)) not between 1 and 120
    or p_phone is null or length(p_phone) > 30 or p_phone !~ '^[+0-9 ().-]+$'
    or length(regexp_replace(p_phone, '[^0-9]', '', 'g')) not between 10 and 15
    then raise exception 'Invalid contact details'; end if;
  hashed := encode(sha256(convert_to(p_token, 'UTF8')), 'hex');
  if p_details is null then
    insert into public.inquiry_sessions(token_hash) values(hashed) on conflict do nothing;
  end if;
  select * into session_row from public.inquiry_sessions where token_hash = hashed for update;
  if not found or session_row.expires_at < now() then raise exception 'Session expired. Please contact us directly.'; end if;
  if session_row.completed then return; end if;
  if session_row.lead_id is null then
    insert into public.leads(name, phone, status) values(btrim(p_name), btrim(p_phone), 'new') returning id into session_row.lead_id;
    update public.inquiry_sessions set lead_id = session_row.lead_id where token_hash = hashed;
  end if;
  if p_details is not null then
    if jsonb_typeof(p_details) <> 'object'
      or coalesce(p_details->>'email', '') !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
      or length(p_details->>'email') > 254
      or coalesce(p_details->>'zip', '') !~ '^[0-9]{5}(-[0-9]{4})?$'
      or length(btrim(coalesce(p_details->>'address', ''))) not between 1 and 300
      then raise exception 'Invalid project details'; end if;
    update public.leads set email = btrim(p_details->>'email'),
      message = concat_ws(E'\n\n', nullif(message, ''), 'Address: ' || btrim(p_details->>'address'), 'ZIP code: ' || (p_details->>'zip'))
      where id = session_row.lead_id;
    update public.inquiry_sessions set completed = true where token_hash = hashed;
  end if;
end;
$$;
revoke all on function public.save_website_inquiry(text, text, text, jsonb) from public;
grant execute on function public.save_website_inquiry(text, text, text, jsonb) to anon, authenticated;
commit;
