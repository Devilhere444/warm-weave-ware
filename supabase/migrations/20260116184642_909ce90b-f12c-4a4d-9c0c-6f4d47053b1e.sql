-- Add favicon_url to site_settings
INSERT INTO public.site_settings (key, value)
VALUES ('favicon_url', '')
ON CONFLICT (key) DO NOTHING;