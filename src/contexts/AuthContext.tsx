
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Profile, AuthContextType } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      const profileData: Profile = {
        ...data,
        role: data.role as 'admin' | 'user'
      };
      
      setProfile(profileData);
      
      if (profileData && session?.user) {
        setUser({
          id: profileData.id,
          email: session.user.email || '',
          name: profileData.full_name,
          role: profileData.role,
          avatar: profileData.avatar_url || undefined
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        
        if (session?.user) {
          // Show welcome message for successful auth
          if (event === 'SIGNED_IN') {
            toast({
              title: "Selamat Datang!",
              description: "Anda berhasil masuk ke akun",
            });
          }
          
          // Defer profile fetching to avoid blocking
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setUser(null);
          setProfile(null);
          
          // Show message for sign out
          if (event === 'SIGNED_OUT') {
            toast({
              title: "Sampai Jumpa!",
              description: "Anda telah keluar dari akun",
            });
          }
        }
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setTimeout(() => {
          fetchProfile(session.user.id);
        }, 0);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (error) {
        console.error('Login error:', error);
        
        let errorMessage = 'Terjadi kesalahan saat login';
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email atau password salah. Silakan coba lagi.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Email belum dikonfirmasi. Silakan cek email Anda untuk link konfirmasi.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Terlalu banyak percobaan. Silakan tunggu beberapa menit.';
        }
        
        toast({
          title: "Login Gagal",
          description: errorMessage,
          variant: "destructive",
        });
        return false;
      }

      if (data.user && data.session) {
        return true;
      }
      
      return false;
    } catch (error: unknown) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan yang tidak terduga",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Get current origin for email redirect
      const redirectTo = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            full_name: name.trim(),
          },
          emailRedirectTo: redirectTo
        }
      });

      if (error) {
        console.error('Register error:', error);
        
        let errorMessage = 'Terjadi kesalahan saat mendaftar';
        
        if (error.message.includes('User already registered')) {
          errorMessage = 'Email sudah terdaftar. Silakan gunakan email lain atau login.';
        } else if (error.message.includes('Password should be')) {
          errorMessage = 'Password terlalu lemah. Minimal 6 karakter.';
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Format email tidak valid.';
        } else if (error.message.includes('Signup is disabled')) {
          errorMessage = 'Pendaftaran sedang dinonaktifkan. Silakan coba lagi nanti.';
        }
        
        toast({
          title: "Registrasi Gagal",
          description: errorMessage,
          variant: "destructive",
        });
        return false;
      }

      if (data.user) {
        // Check if email confirmation is required
        if (!data.session) {
          toast({
            title: "Registrasi Berhasil!",
            description: "Silakan cek email Anda untuk link konfirmasi. Setelah dikonfirmasi, Anda akan otomatis masuk ke sistem.",
            duration: 10000,
          });
        } else {
          toast({
            title: "Berhasil!",
            description: "Akun berhasil dibuat dan Anda telah masuk.",
          });
        }
        
        return true;
      }
      return false;
    } catch (error: unknown) {
      console.error('Register error:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan yang tidak terduga saat mendaftar",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat logout",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<Profile>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);

      if (error) throw error;

      // Refresh profile data
      await fetchProfile(user.id);
      
      toast({
        title: "Berhasil!",
        description: "Profil berhasil diperbarui",
      });
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      toast({
        title: "Error",
        description: "Gagal memperbarui profil",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const oauthLogin = async (provider: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as Parameters<typeof supabase.auth.signInWithOAuth>[0]['provider'],
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        console.error('OAuth error:', error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      return true;
    } catch (error: unknown) {
      console.error('OAuth Login error:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat login via OAuth",
        variant: "destructive",
      });
      return false;
    } finally {
      // Don't set loading false here as auth state change will handle it
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      login, 
      register, 
      logout, 
      updateProfile,
      oauthLogin,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
