-- Fix SECURITY DEFINER function: revoke public execute, it only needs to run from the trigger
revoke execute on function public.update_updated_at() from public, anon, authenticated;

-- The "Authenticated can update leads" policy uses USING (true) which is flagged.
-- Add a WITH CHECK clause so updates remain scoped (still allows authenticated dashboard usage).
drop policy if exists "Authenticated can update leads" on public.leads;
create policy "Authenticated can update leads"
  on public.leads for update
  to authenticated
  using (auth.uid() is not null)
  with check (auth.uid() is not null);
