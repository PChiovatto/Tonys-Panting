// @vitest-environment node
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { beforeAll, afterAll, expect, it } from "vitest";

const db = new PGlite();
const migration = (name: string) => readFileSync(`supabase/migrations/${name}.sql`, "utf8");

beforeAll(async () => {
  // Minimal Supabase interfaces, with deliberately broad legacy policies.
  // Vault and pg_net are not exercised here; those require Supabase staging.
  await db.exec(`
    create role anon; create role authenticated; create role service_role bypassrls;
    create schema auth; create schema storage;
    create function auth.jwt() returns jsonb language sql stable as $$
      select coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb;
    $$;
    grant usage on schema public, auth, storage to anon, authenticated, service_role;
    create table public.leads (
      id uuid primary key default gen_random_uuid(), name text not null,
      message text, email text, phone text, notes text, scheduled_at timestamptz,
      status text not null default 'new'
    );
    create table public.project_photos (id uuid default gen_random_uuid());
    create table public.push_subscriptions (id uuid default gen_random_uuid());
    create table storage.objects (bucket_id text);
    insert into public.project_photos default values;
    insert into public.push_subscriptions default values;
    insert into storage.objects values ('project-photos'), ('public-assets');
    grant all on all tables in schema public, storage to anon, authenticated, service_role;
    alter table public.leads enable row level security;
    alter table public.project_photos enable row level security;
    alter table public.push_subscriptions enable row level security;
    alter table storage.objects enable row level security;
    create policy legacy on public.leads for all using (true) with check (true);
    create policy legacy on public.project_photos for all using (true) with check (true);
    create policy legacy on public.push_subscriptions for all using (true) with check (true);
    create policy legacy on storage.objects for all using (true) with check (true);
  `);
  await db.exec(migration("20260708142425_restore_appointments_schema"));
  await db.exec(`grant all on public.appointments to anon, authenticated, service_role;
    create policy legacy on public.appointments for all using (true) with check (true);`);
  await db.exec(migration("20260915050000_harden_staff_and_notifications"));
  await db.exec(migration("20260915050100_sync_lead_appointments"));
}, 30000);
afterAll(async () => { await db.close(); });

async function identity(role: "anon" | "authenticated" | "service_role", claims = {}) {
  await db.exec(`reset role; set role ${role};`);
  await db.query("select set_config('request.jwt.claims', $1, false)", [JSON.stringify(claims)]);
}

it("allows a public inquiry but blocks private fields and CRM access even with broad legacy policies", async () => {
  await identity("anon");
  await db.exec("insert into public.leads(name) values ('Public inquiry')");
  await expect(db.exec("insert into public.leads(name, notes) values ('Forged', 'private')")).rejects.toThrow();
  expect((await db.query("select * from public.leads")).rows).toHaveLength(0);
  expect((await db.query("select * from public.project_photos")).rows).toHaveLength(0);
  expect((await db.query("select * from public.push_subscriptions")).rows).toHaveLength(0);
  expect((await db.query("select * from storage.objects")).rows).toEqual([{ bucket_id: "public-assets" }]);
  await expect(db.exec("insert into storage.objects values ('project-photos')")).rejects.toThrow();
  await expect(db.exec("insert into public.appointments(title, scheduled_at) values ('Forged', now())")).rejects.toThrow();
  await identity("authenticated", { user_metadata: { role: "admin" } });
  expect((await db.query("select * from public.leads")).rows).toHaveLength(0);
  expect((await db.query("update public.leads set name = 'Forged' returning id")).rows).toHaveLength(0);
  await expect(db.exec("select * from public.get_tomorrows_appointments()")).rejects.toThrow();
});

it("keeps rescheduling and deletion consistent without deleting unrelated visits", async () => {
  await identity("authenticated", { app_metadata: { role: "staff" } });
  const { rows: [lead] } = await db.query<{ id: string }>("insert into public.leads(name) values ('Schedule test') returning id");
  await db.query("update public.leads set status = 'scheduled', scheduled_at = '2026-10-01T13:00:00Z' where id = $1", [lead.id]);
  await db.query("insert into public.appointments(title, scheduled_at, lead_id) values ('Manual visit', '2026-10-02T13:00:00Z', $1)", [lead.id]);
  await db.query("update public.leads set scheduled_at = '2026-10-03T13:00:00Z' where id = $1", [lead.id]);
  const generated = await db.query<{ source: string; scheduled_at: Date }>("select source, scheduled_at from public.appointments where lead_id = $1 and source = 'lead_schedule'", [lead.id]);
  expect(generated.rows).toHaveLength(1);
  expect(new Date(generated.rows[0].scheduled_at).toISOString()).toBe("2026-10-03T13:00:00.000Z");
  await db.query("delete from public.appointments where lead_id = $1 and source = 'lead_schedule'", [lead.id]);
  expect((await db.query("select scheduled_at, status from public.leads where id = $1", [lead.id])).rows).toEqual([{ scheduled_at: null, status: "in_contact" }]);
  expect((await db.query("select title from public.appointments where lead_id = $1", [lead.id])).rows).toEqual([{ title: "Manual visit" }]);
});

it("reserves reminder data for the service role", async () => {
  await identity("service_role");
  await expect(db.exec("select * from public.get_tomorrows_appointments()")).resolves.toBeDefined();
});
