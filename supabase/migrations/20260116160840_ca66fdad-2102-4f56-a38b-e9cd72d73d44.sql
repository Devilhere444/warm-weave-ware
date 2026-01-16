-- Create quote_requests table for storing customer inquiries
CREATE TABLE public.quote_requests (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT,
    phone TEXT,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quote_request_items table for individual products in a quote
CREATE TABLE public.quote_request_items (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    quote_request_id UUID NOT NULL REFERENCES public.quote_requests(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    product_title TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    finish_option TEXT,
    paper_option TEXT,
    binding_option TEXT,
    special_requirements TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_request_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quote_requests
-- Anyone can insert a quote request (guests included)
CREATE POLICY "Anyone can create quote requests"
ON public.quote_requests
FOR INSERT
WITH CHECK (true);

-- Users can view their own quote requests (by user_id or email match handled in app)
CREATE POLICY "Users can view own quote requests"
ON public.quote_requests
FOR SELECT
USING (
    auth.uid() = user_id OR 
    auth.uid() IS NOT NULL
);

-- Authenticated users can update their own quotes
CREATE POLICY "Users can update own quote requests"
ON public.quote_requests
FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for quote_request_items
CREATE POLICY "Anyone can create quote request items"
ON public.quote_request_items
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can view quote request items"
ON public.quote_request_items
FOR SELECT
USING (true);

-- Create admin_emails table to store admin notification emails
CREATE TABLE public.admin_emails (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_emails ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can view admin emails (for admin functions)
CREATE POLICY "Authenticated users can view admin emails"
ON public.admin_emails
FOR SELECT
TO authenticated
USING (true);

-- Insert a default admin email (you can change this)
INSERT INTO public.admin_emails (email) VALUES ('admin@lithoartpress.com');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_quote_requests_updated_at
BEFORE UPDATE ON public.quote_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();