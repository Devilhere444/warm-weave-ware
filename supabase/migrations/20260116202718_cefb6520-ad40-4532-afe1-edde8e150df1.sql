-- Add full_description column to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS full_description TEXT DEFAULT NULL;

-- Create product_specifications table
CREATE TABLE IF NOT EXISTS public.product_specifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  spec_label TEXT NOT NULL,
  spec_value TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_specifications ENABLE ROW LEVEL SECURITY;

-- Everyone can view product specifications
CREATE POLICY "Product specifications are viewable by everyone"
ON public.product_specifications
FOR SELECT
USING (true);

-- Only admins can insert product specifications
CREATE POLICY "Admins can insert product specifications"
ON public.product_specifications
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update product specifications
CREATE POLICY "Admins can update product specifications"
ON public.product_specifications
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete product specifications
CREATE POLICY "Admins can delete product specifications"
ON public.product_specifications
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_product_specifications_product_id ON public.product_specifications(product_id);

-- Add trigger for updated_at
CREATE TRIGGER update_product_specifications_updated_at
BEFORE UPDATE ON public.product_specifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();