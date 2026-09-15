-- Keep scheduling from the lead card and the calendar in one transaction.
begin;
alter table public.appointments add column if not exists source text not null default 'manual';
create unique index if not exists appointments_lead_schedule_idx
  on public.appointments(lead_id) where source = 'lead_schedule';

create or replace function public.sync_lead_appointment()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.scheduled_at is not distinct from old.scheduled_at then return new; end if;
  if new.scheduled_at is null then
    delete from public.appointments where lead_id = new.id and source = 'lead_schedule';
  else
    insert into public.appointments(lead_id, title, scheduled_at, source)
    values(new.id, 'Visit: ' || new.name, new.scheduled_at, 'lead_schedule')
    on conflict (lead_id) where source = 'lead_schedule'
    do update set scheduled_at = excluded.scheduled_at, title = excluded.title, updated_at = now();
  end if;
  return new;
end;
$$;
revoke all on function public.sync_lead_appointment() from public, anon, authenticated;
create trigger sync_lead_appointment after update of scheduled_at on public.leads
  for each row execute function public.sync_lead_appointment();

-- Deleting a generated visit must also remove its date from the lead card.
create or replace function public.clear_deleted_lead_appointment()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if old.source = 'lead_schedule' and old.lead_id is not null then
    update public.leads
    set scheduled_at = null, status = case when status = 'scheduled' then 'in_contact' else status end
    where id = old.lead_id and scheduled_at = old.scheduled_at;
  end if;
  return old;
end;
$$;
revoke all on function public.clear_deleted_lead_appointment() from public, anon, authenticated;
create trigger clear_deleted_lead_appointment after delete on public.appointments
  for each row execute function public.clear_deleted_lead_appointment();
commit;
