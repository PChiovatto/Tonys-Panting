
-- Extend leads with NFC + campaign fields (all additive, nullable unless noted)
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS source_type text,
  ADD COLUMN IF NOT EXISTS tag_code text,
  ADD COLUMN IF NOT EXISTS campaign_name text,
  ADD COLUMN IF NOT EXISTS project_type text,
  ADD COLUMN IF NOT EXISTS timeline text,
  ADD COLUMN IF NOT EXISTS budget_range text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS state text,
  ADD COLUMN IF NOT EXISTS photo_count int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS nfc_scan_id text,
  ADD COLUMN IF NOT EXISTS created_from text;

-- Normalize source: readable label, NOT NULL default 'Website Form'
ALTER TABLE public.leads
  ALTER COLUMN status SET DEFAULT 'new';

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='leads' AND column_name='source'
  ) THEN
    EXECUTE 'ALTER TABLE public.leads ALTER COLUMN source SET DEFAULT ''Website Form''';
    EXECUTE 'UPDATE public.leads SET source = ''Website Form'' WHERE source IS NULL OR source = ''website''';
    EXECUTE 'ALTER TABLE public.leads ALTER COLUMN source SET NOT NULL';
  ELSE
    EXECUTE 'ALTER TABLE public.leads ADD COLUMN source text NOT NULL DEFAULT ''Website Form''';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS leads_source_idx ON public.leads (source);
CREATE INDEX IF NOT EXISTS leads_source_type_idx ON public.leads (source_type);
CREATE INDEX IF NOT EXISTS leads_tag_code_idx ON public.leads (tag_code);

-- project_photos table (private; served through signed URLs from the CRM)
CREATE TABLE IF NOT EXISTS public.project_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  file_path text NOT NULL,
  file_name text,
  file_type text,
  file_size int,
  uploaded_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.project_photos TO authenticated;
GRANT ALL ON public.project_photos TO service_role;

ALTER TABLE public.project_photos ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='project_photos'
      AND policyname='Authenticated can view project photos'
  ) THEN
    CREATE POLICY "Authenticated can view project photos"
      ON public.project_photos FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS project_photos_lead_id_idx ON public.project_photos (lead_id);
