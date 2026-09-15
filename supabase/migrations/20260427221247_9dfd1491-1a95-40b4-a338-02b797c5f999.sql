-- Enable pg_net for HTTP calls from triggers
create extension if not exists pg_net with schema extensions;

-- Function that calls the send-push edge function
create or replace function public.notify_new_lead()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  payload jsonb;
begin
  payload := jsonb_build_object(
    'title', 'New Lead',
    'body', new.name || coalesce(' - ' || new.service_type, '')
  );

  perform net.http_post(
    url := 'https://ghznuutonacttnmqtiil.supabase.co/functions/v1/send-push',
    headers := jsonb_build_object(
      'Content-Type', 'application/json'
    ),
    body := payload
  );

  return new;
end;
$$;

drop trigger if exists on_lead_created_notify on public.leads;
create trigger on_lead_created_notify
after insert on public.leads
for each row
execute function public.notify_new_lead();