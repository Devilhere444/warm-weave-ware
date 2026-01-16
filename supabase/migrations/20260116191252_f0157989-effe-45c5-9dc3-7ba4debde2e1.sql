-- Fix overly permissive RLS policies for INSERT operations
-- These policies currently use WITH CHECK (true) which is flagged as too permissive

-- 1. Fix quote_requests INSERT policy
-- Allow anyone to create quote requests, but if authenticated, set user_id to their ID
DROP POLICY IF EXISTS "Anyone can create quote requests" ON quote_requests;
CREATE POLICY "Anyone can create quote requests"
ON quote_requests
FOR INSERT
WITH CHECK (
  -- If user is authenticated, ensure user_id matches auth.uid() or is null
  -- If not authenticated, user_id must be null
  (auth.uid() IS NULL AND user_id IS NULL) OR
  (auth.uid() IS NOT NULL AND (user_id = auth.uid() OR user_id IS NULL))
);

-- 2. Fix quote_request_items INSERT policy  
-- Only allow inserting items to quote requests owned by the current user (or anonymous quotes)
DROP POLICY IF EXISTS "Anyone can create quote request items" ON quote_request_items;
CREATE POLICY "Users can create own quote request items"
ON quote_request_items
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM quote_requests qr 
    WHERE qr.id = quote_request_id 
    AND (
      -- Anonymous users can add items to anonymous quotes
      (auth.uid() IS NULL AND qr.user_id IS NULL) OR
      -- Authenticated users can add items to their own quotes
      (auth.uid() IS NOT NULL AND (qr.user_id = auth.uid() OR qr.user_id IS NULL))
    )
  )
);

-- 3. Fix page_views INSERT policy
-- Page views are analytics data - restrict to prevent abuse while still allowing tracking
-- Allow inserts but require session_id and visitor_id to be non-empty
DROP POLICY IF EXISTS "Anyone can insert page views" ON page_views;
CREATE POLICY "Anyone can insert page views"
ON page_views
FOR INSERT
WITH CHECK (
  -- Basic validation to prevent empty/null required fields
  session_id IS NOT NULL AND session_id <> '' AND
  visitor_id IS NOT NULL AND visitor_id <> '' AND
  page_path IS NOT NULL AND page_path <> ''
);