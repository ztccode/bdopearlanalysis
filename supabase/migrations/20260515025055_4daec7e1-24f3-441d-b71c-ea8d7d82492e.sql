-- Lock down the unused public 'bdo-pearl-shop-analysis' bucket:
-- make it private and add deny-all RLS policies so the anon key cannot
-- upload, read, update, or delete arbitrary files.

UPDATE storage.buckets SET public = false WHERE id = 'bdo-pearl-shop-analysis';

DROP POLICY IF EXISTS "bdo_pearl_shop_analysis_no_select" ON storage.objects;
DROP POLICY IF EXISTS "bdo_pearl_shop_analysis_no_insert" ON storage.objects;
DROP POLICY IF EXISTS "bdo_pearl_shop_analysis_no_update" ON storage.objects;
DROP POLICY IF EXISTS "bdo_pearl_shop_analysis_no_delete" ON storage.objects;

CREATE POLICY "bdo_pearl_shop_analysis_no_select"
ON storage.objects FOR SELECT
USING (bucket_id <> 'bdo-pearl-shop-analysis');

CREATE POLICY "bdo_pearl_shop_analysis_no_insert"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id <> 'bdo-pearl-shop-analysis');

CREATE POLICY "bdo_pearl_shop_analysis_no_update"
ON storage.objects FOR UPDATE
USING (bucket_id <> 'bdo-pearl-shop-analysis');

CREATE POLICY "bdo_pearl_shop_analysis_no_delete"
ON storage.objects FOR DELETE
USING (bucket_id <> 'bdo-pearl-shop-analysis');