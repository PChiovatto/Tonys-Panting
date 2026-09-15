// @vitest-environment node
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { it, expect } from 'vitest';
it('saves partial leads, completes once, and protects other inquiries', async () => {
  const db = new PGlite();
  try {
    await db.exec(`create role anon; create role authenticated;
      create table public.leads(id uuid primary key default gen_random_uuid(), name text, phone text, email text, message text, status text);
      alter table public.leads enable row level security;
      grant select on public.leads to anon;`);
    await db.exec(readFileSync('supabase/migrations/20260915060000_two_step_inquiries.sql', 'utf8'));
    await db.exec('set role anon');
    const token = 'a'.repeat(64);
    const save = (key: string, details: unknown = null) => db.query('select public.save_website_inquiry($1,$2,$3,$4::jsonb)', [key, 'Jane', '5085550123', details === null ? null : JSON.stringify(details)]);
    await save(token); await save(token);
    expect((await db.query('select * from public.leads')).rows).toHaveLength(0);
    await expect(db.query('select * from public.inquiry_sessions')).rejects.toThrow();
    const details = { email: 'jane@example.com', zip: '02108', address: '123 Test Street' };
    await expect(save('b'.repeat(64), details)).rejects.toThrow();
    await expect(save(token, { ...details, zip: 'invalid' })).rejects.toThrow();
    await db.exec('reset role');
    expect((await db.query('select name, email from public.leads')).rows).toEqual([{ name: 'Jane', email: null }]);
    await db.exec('set role anon');
    await save(token, details); await save(token, details);
    await db.exec('reset role');
    expect((await db.query('select name, email, message from public.leads')).rows).toEqual([{ name: 'Jane', email: 'jane@example.com', message: 'Address: 123 Test Street\n\nZIP code: 02108' }]);
  } finally { await db.close(); }
}, 30000);
