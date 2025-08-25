-- Remove the security vulnerability policy that allows all users to view all profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- The remaining policies will ensure users can only:
-- - SELECT their own profile (auth.uid() = id)
-- - INSERT their own profile (auth.uid() = id) 
-- - UPDATE their own profile (auth.uid() = id)
-- This maintains functionality while protecting personal data