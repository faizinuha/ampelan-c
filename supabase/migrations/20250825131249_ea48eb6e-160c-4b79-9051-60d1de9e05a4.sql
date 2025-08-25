
-- Hapus semua kebijakan RLS yang ada pada tabel profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can select their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Buat function untuk mendapatkan role user tanpa rekursi
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();
    RETURN COALESCE(user_role, 'user');
EXCEPTION
    WHEN OTHERS THEN
        RETURN 'user';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Buat kebijakan RLS yang bersih dan aman
-- Users dapat melihat profil mereka sendiri
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Users dapat membuat profil mereka sendiri
CREATE POLICY "Users can create own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Users dapat mengupdate profil mereka sendiri
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Admin dapat melihat semua profil (menggunakan function untuk menghindari rekursi)
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (public.get_current_user_role() = 'admin');

-- Admin dapat mengupdate semua profil
CREATE POLICY "Admins can update all profiles" ON public.profiles
    FOR UPDATE USING (public.get_current_user_role() = 'admin');
