-- Fix 1: Quote requests RLS - prevent PII exposure to all authenticated users
DROP POLICY IF EXISTS "Users can view own quote requests" ON quote_requests;

-- Users can only view their own quote requests
CREATE POLICY "Users can view own quote requests"
ON quote_requests FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Admins can view all quote requests
CREATE POLICY "Admins can view all quote requests"
ON quote_requests FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Fix 2: Quote request items RLS - restrict to owners and admins
DROP POLICY IF EXISTS "Users can view quote request items" ON quote_request_items;

-- Users can view items for their own quote requests
CREATE POLICY "Users can view own quote request items"
ON quote_request_items FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM quote_requests qr 
    WHERE qr.id = quote_request_items.quote_request_id 
    AND qr.user_id = auth.uid()
  )
);

-- Admins can view all quote request items
CREATE POLICY "Admins can view all quote request items"
ON quote_request_items FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Fix 3: Products table - restrict write operations to admins only
DROP POLICY IF EXISTS "Authenticated users can insert products" ON products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON products;

CREATE POLICY "Admins can insert products"
ON products FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update products"
ON products FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete products"
ON products FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'));