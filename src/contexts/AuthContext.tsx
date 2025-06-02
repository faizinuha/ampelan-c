
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
      
      if (error) throw error;
      
      // Type cast the data to ensure it matches our Profile interface
      const profileData: Profile = {
        ...data,
        role: data.role as 'admin' | 'user'
      };
      
      setProfile(profileData);
      
      // Update user state with profile data
      if (profileData) {
        setUser({
          id: profileData.id,
          email: session?.user?.email || '',
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
          // Defer profile fetching to avoid blocking
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setUser(null);
          setProfile(null);
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
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
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
        toast({
          title: "Berhasil!",
          description: "Login berhasil",
        });
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: error.message || "Terjadi kesalahan saat login",
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: `${window.location.origin}/`
        }
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
        toast({
          title: "Berhasil!",
          description: "Akun berhasil dibuat. Silakan cek email untuk verifikasi.",
        });
        // Automatically fetch profile after successful registration
        setTimeout(() => {
          if (data.user) fetchProfile(data.user.id);
        }, 0);
        return true;
      }
      return false;
    } catch (error: any) { // Added type annotation
      console.error('Register error:', error);
      toast({
        title: "Error",
        description: error.message || "Terjadi kesalahan saat mendaftar", // Improved error message
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
      toast({
        title: "Berhasil",
        description: "Logout berhasil",
      });
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
    }
  };

  // Add oauthLogin implementation
  const oauthLogin = async (provider: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as any, // Type assertion might be needed based on Supabase types
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      // OAuth sign-in typically handles session/user via the redirect and auth state change listener
      // No explicit user/profile setting needed here, it's handled by the effect hook.
      
      // The redirect will happen, so no need for a success toast here.
      return true;
    } catch (error: any) {
      console.error('OAuth Login error:', error);
      toast({
        title: "Error",
        description: error.message || "Terjadi kesalahan saat login via OAuth",
        variant: "destructive",
      });
      return false;
    } finally {
      // isLoading will be set to false by the auth state change listener
      // setIsLoading(false);
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
      oauthLogin, // Added oauthLogin
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
