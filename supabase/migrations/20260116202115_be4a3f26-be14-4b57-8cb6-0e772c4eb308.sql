-- Add quantity and lead time columns to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS min_quantity INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS max_quantity INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS lead_time TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS price_range TEXT DEFAULT NULL;