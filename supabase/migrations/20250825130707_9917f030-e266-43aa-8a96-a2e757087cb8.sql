-- Create a secure admin-only policy for viewing all profiles
-- This allows admins to manage users while protecting regular users' privacy
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);