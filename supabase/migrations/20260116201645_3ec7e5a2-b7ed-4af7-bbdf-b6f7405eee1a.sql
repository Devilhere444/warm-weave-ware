-- Create product_options table to store customization options for products
CREATE TABLE public.product_options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  option_type TEXT NOT NULL, -- 'finish', 'paper', 'binding'
  option_value TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(product_id, option_type, option_value)
);

-- Enable RLS
ALTER TABLE public.product_options ENABLE ROW LEVEL SECURITY;

-- Everyone can view product options
CREATE POLICY "Product options are viewable by everyone"
ON public.product_options
FOR SELECT
USING (true);

-- Only admins can insert product options
CREATE POLICY "Admins can insert product options"
ON public.product_options
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update product options
CREATE POLICY "Admins can update product options"
ON public.product_options
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete product options
CREATE POLICY "Admins can delete product options"
ON public.product_options
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger to update updated_at
CREATE TRIGGER update_product_options_updated_at
BEFORE UPDATE ON public.product_options
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_product_options_product_id ON public.product_options(product_id);
CREATE INDEX idx_product_options_type ON public.product_options(option_type);