-- Create site_settings table for full website control
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can view site settings (needed for frontend)
CREATE POLICY "Anyone can view site settings"
  ON public.site_settings
  FOR SELECT
  USING (true);

-- Only admins can modify site settings
CREATE POLICY "Admins can insert site settings"
  ON public.site_settings
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update site settings"
  ON public.site_settings
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete site settings"
  ON public.site_settings
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.site_settings (key, value) VALUES
  ('site_name', 'Litho Art Press'),
  ('site_tagline', 'Premium Printing Solutions'),
  ('contact_email', ''),
  ('contact_phone', ''),
  ('contact_address', ''),
  ('whatsapp_number', ''),
  ('facebook_url', ''),
  ('instagram_url', ''),
  ('twitter_url', ''),
  ('business_hours', 'Mon-Fri: 9AM-6PM'),
  ('hero_title', 'Premium Printing Excellence'),
  ('hero_subtitle', 'Discover our range of high-quality printing solutions'),
  ('about_text', ''),
  ('footer_text', 'Quality printing services for all your needs');