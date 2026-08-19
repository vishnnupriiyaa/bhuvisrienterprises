BEGIN;

-- Create a dedicated bucket for product photography.
-- This keeps product images out of localStorage and in Supabase Storage.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Public product images can be viewed by storefront visitors.
DROP POLICY IF EXISTS "product_images_public_read" ON storage.objects;
CREATE POLICY "product_images_public_read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Only authenticated admin users may upload product images.
DROP POLICY IF EXISTS "product_images_admin_upload" ON storage.objects;
CREATE POLICY "product_images_admin_upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images'
  AND public.is_admin()
);

-- Only authenticated admin users may update or replace product images.
DROP POLICY IF EXISTS "product_images_admin_update" ON storage.objects;
CREATE POLICY "product_images_admin_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'product-images'
  AND public.is_admin()
)
WITH CHECK (
  bucket_id = 'product-images'
  AND public.is_admin()
);

-- Only authenticated admin users may delete product images.
DROP POLICY IF EXISTS "product_images_admin_delete" ON storage.objects;
CREATE POLICY "product_images_admin_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-images'
  AND public.is_admin()
);

COMMIT;
