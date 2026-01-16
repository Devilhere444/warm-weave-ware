-- Create email verification tokens table for quote submissions
CREATE TABLE public.email_verification_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_request_id UUID NOT NULL REFERENCES public.quote_requests(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '24 hours'),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add verification status to quote_requests
ALTER TABLE public.quote_requests 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT false;

-- Create index for token lookups
CREATE INDEX idx_email_verification_token ON public.email_verification_tokens(token);
CREATE INDEX idx_email_verification_quote ON public.email_verification_tokens(quote_request_id);

-- Enable RLS
ALTER TABLE public.email_verification_tokens ENABLE ROW LEVEL SECURITY;

-- Allow anyone to verify tokens (read by token value)
CREATE POLICY "Anyone can verify tokens"
ON public.email_verification_tokens
FOR SELECT
USING (
  expires_at > now() AND verified_at IS NULL
);

-- Allow system to insert tokens (via edge function with service role)
-- No insert policy for public - edge function uses service role key

-- Admins can view all tokens
CREATE POLICY "Admins can view all tokens"
ON public.email_verification_tokens
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);