import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import type { User, Profile, AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check current session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await loadUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        return;
      }

      if (profileData) {
        // Type-safe conversion from database response to Profile type
        const typedProfile: Profile = {
          id: profileData.id,
          full_name: profileData.full_name,
          phone: profileData.phone,
          address: profileData.address,
          rt_rw: profileData.rt_rw,
          occupation: profileData.occupation,
          role: profileData.role as 'admin' | 'user', // Type assertion for role
          avatar_url: profileData.avatar_url,
          created_at: profileData.created_at,
          updated_at: profileData.updated_at
        };

        setProfile(typedProfile);
        setUser({
          id: profileData.id,
          email: '', // We don't store email in profiles table
          name: profileData.full_name,
          role: profileData.role as 'admin' | 'user',
          avatar: profileData.avatar_url || undefined
        });
      }
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (data.user) {
        await loadUserProfile(data.user.id);
        toast({
          title: "Berhasil!",
          description: "Selamat datang! Anda berhasil masuk ke akun.",
        });
        // Redirect to home page after successful login
        navigate('/');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat login",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (data.user) {
        // Create profile after successful registration
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              full_name: name,
              role: 'user',
            },
          ]);

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }

        toast({
          title: "Berhasil!",
          description: "Akun berhasil dibuat! Silakan cek email Anda untuk verifikasi.",
        });
        // Redirect to home page after successful registration
        navigate('/');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Register error:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat mendaftar",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setUser(null);
        setProfile(null);
        toast({
          title: "Berhasil",
          description: "Anda telah keluar dari akun",
        });
        // Redirect to home page after logout
        navigate('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (data: Partial<Profile>): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      await loadUserProfile(user.id);
      toast({
        title: "Berhasil",
        description: "Profil berhasil diperbarui",
      });
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    }
  };

  const oauthLogin = async (provider: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('OAuth login error:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    login,
    register,
    logout,
    updateProfile,
    oauthLogin,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
