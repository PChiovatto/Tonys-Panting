-- Remove old trigger and function
drop trigger if exists on_lead_created_notify on public.leads;
drop function if exists public.notify_new_lead();

-- New webhook function that calls the notify-new-lead edge function
create or replace function public.notify_new_lead_webhook()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  perform net.http_post(
    url := 'https://ghznuutonacttnmqtiil.supabase.co/functions/v1/notify-new-lead',
    headers := jsonb_build_object(
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object('record', row_to_json(new))
  );
  return new;
end;
$$;

revoke execute on function public.notify_new_lead_webhook() from public, anon, authenticated;

drop trigger if exists on_lead_insert on public.leads;
create trigger on_lead_insert
after insert on public.leads
for each row execute function public.notify_new_lead_webhook();