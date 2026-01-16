-- Allow admins to insert admin emails
CREATE POLICY "Admins can insert admin emails"
ON public.admin_emails
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete admin emails
CREATE POLICY "Admins can delete admin emails"
ON public.admin_emails
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));