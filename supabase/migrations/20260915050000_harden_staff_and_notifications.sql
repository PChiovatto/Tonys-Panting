-- Before applying: assign app_metadata.role = staff or admin to approved staff
-- through Supabase Auth admin tools. Never use user_metadata for authorization.
begin;

create or replace function public.is_staff()
returns boolean language sql stable set search_path = '' as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role' in ('staff', 'admin'), false);
$$;
revoke all on function public.is_staff() from public;
grant execute on function public.is_staff() to anon, authenticated;

drop policy if exists "Authenticated can view leads" on public.leads;
drop policy if exists "Authenticated can update leads" on public.leads;
create policy "Staff view leads" on public.leads for select to authenticated using (public.is_staff());
create policy "Staff update leads" on public.leads for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "Staff delete leads" on public.leads for delete to authenticated using (public.is_staff());
grant select, update, delete on public.leads to authenticated;

-- Restrictive policies also cover permissive policies configured outside Git.
create policy "Require staff for lead reads" on public.leads as restrictive for select to anon, authenticated using (public.is_staff());
create policy "Require staff for lead updates" on public.leads as restrictive for update to anon, authenticated using (public.is_staff()) with check (public.is_staff());
create policy "Require staff for lead deletes" on public.leads as restrictive for delete to anon, authenticated using (public.is_staff());

create policy "Validate public leads" on public.leads as restrictive for insert to anon, authenticated with check (
  length(btrim(name)) between 1 and 120
  and length(coalesce(message, '')) <= 6000
  and length(coalesce(email, '')) <= 254
  and length(coalesce(phone, '')) <= 30
  and (public.is_staff() or (status = 'new' and coalesce(notes, '') = '' and scheduled_at is null))
);

drop policy if exists "Authenticated can view project photos" on public.project_photos;
create policy "Staff view project photos" on public.project_photos for select to authenticated using (public.is_staff());
create policy "Require staff for project photos" on public.project_photos as restrictive for all to anon, authenticated using (public.is_staff()) with check (public.is_staff());
drop policy if exists "Authenticated can read project photos" on storage.objects;
create policy "Staff read project photos" on storage.objects for select to authenticated using (bucket_id = 'project-photos' and public.is_staff());
create policy "Protect project photo bucket" on storage.objects as restrictive for all to anon, authenticated using (bucket_id <> 'project-photos' or public.is_staff()) with check (bucket_id <> 'project-photos' or public.is_staff());

grant select, insert, update, delete on public.appointments to authenticated;
create policy "Staff manage appointments" on public.appointments for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "Require staff for appointments" on public.appointments as restrictive for all to anon, authenticated using (public.is_staff()) with check (public.is_staff());
create policy "Require staff for push subscriptions" on public.push_subscriptions as restrictive for all to anon, authenticated using (public.is_staff()) with check (public.is_staff());

create or replace function public.get_tomorrows_appointments()
returns table(id uuid, title text, notes text, scheduled_at timestamptz, lead_name text, lead_phone text)
language sql stable security definer set search_path = '' as $$
  select a.id, a.title, a.notes, a.scheduled_at, l.name, l.phone
  from public.appointments a left join public.leads l on l.id = a.lead_id
  where a.scheduled_at >= (((now() at time zone 'America/New_York')::date + 1)::timestamp at time zone 'America/New_York')
    and a.scheduled_at < (((now() at time zone 'America/New_York')::date + 2)::timestamp at time zone 'America/New_York')
  order by a.scheduled_at;
$$;
revoke all on function public.get_tomorrows_appointments() from public, anon, authenticated;
grant execute on function public.get_tomorrows_appointments() to service_role;

-- Add lead_webhook_secret and project_url to Supabase Vault before enabling notifications.
create or replace function public.notify_new_lead_webhook()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  webhook_secret text;
  project_url text;
begin
  select decrypted_secret into webhook_secret from vault.decrypted_secrets where name = 'lead_webhook_secret' limit 1;
  select decrypted_secret into project_url from vault.decrypted_secrets where name = 'project_url' limit 1;
  if coalesce(webhook_secret, '') = '' or coalesce(project_url, '') = '' then
    raise warning 'Lead notification skipped: configure Vault secrets';
    return new;
  end if;
  perform net.http_post(
    url := rtrim(project_url, '/') || '/functions/v1/notify-new-lead',
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-webhook-secret', webhook_secret),
    body := jsonb_build_object('record', row_to_json(new))
  );
  return new;
end;
$$;
revoke all on function public.notify_new_lead_webhook() from public, anon, authenticated;
commit;
