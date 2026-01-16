-- Fix overly permissive RLS policies for quote_request_items and quote_requests INSERT
-- These need WITH CHECK (true) for anonymous users to submit quotes, which is the intended behavior
-- But we need to ensure admin_emails has proper policies

-- Drop and recreate the admin_emails SELECT policy to be admin-only
DROP POLICY IF EXISTS "Authenticated users can view admin emails" ON public.admin_emails;

-- Only admins should see admin emails
CREATE POLICY "Admins can view admin emails" 
ON public.admin_emails 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Ensure user_roles table has restrictive SELECT - only own role viewing
-- This is already correct but let's ensure the INSERT is restricted
-- Check if there's an INSERT policy that's too permissive
DROP POLICY IF EXISTS "Users can insert own roles" ON public.user_roles;

-- Ensure no one except admins can insert roles (prevents privilege escalation)
-- The existing "Admins can manage all roles" policy handles INSERT for admins