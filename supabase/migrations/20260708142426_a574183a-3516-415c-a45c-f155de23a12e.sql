
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='storage' AND tablename='objects'
      AND policyname='Authenticated can read project photos'
  ) THEN
    CREATE POLICY "Authenticated can read project photos"
      ON storage.objects FOR SELECT
      TO authenticated
      USING (bucket_id = 'project-photos');
  END IF;
END $$;
