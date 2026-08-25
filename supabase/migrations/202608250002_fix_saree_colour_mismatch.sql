BEGIN;

-- The seeded "Handloom saree" product still carried the old placeholder colour
-- (Sand Gold) even though its photo is a pink saree. Correct the colour metadata
-- and seed a matching colour variant so the storefront swatch/filter reflect reality.
UPDATE public.products
SET
  color = 'Rani Pink',
  color_hex = '#D6006D',
  color_variants = jsonb_build_array(
    jsonb_build_object(
      'id', 'variant-' || id,
      'name', 'Rani Pink',
      'hex', '#D6006D',
      'images', images
    )
  )
WHERE name = 'Handloom saree'
  AND color = 'Sand Gold';

COMMIT;
