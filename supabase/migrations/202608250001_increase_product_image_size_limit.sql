BEGIN;

-- Modern phone camera photos routinely exceed 5MB; raise the bucket limit so uploads stop
-- silently failing/being skipped for large (but still reasonable) product photos.
UPDATE storage.buckets
SET file_size_limit = 15728640 -- 15MB
WHERE id = 'product-images';

COMMIT;
