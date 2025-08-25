
"use client"

import type { AuthContextType, Profile, User } from "@/types/auth"
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const navigate = useNavigate()

  // Simple profile loader with better error handling
  const loadProfile = async (authUser: any) => {
    try {
      console.log("🔄 Loading profile for:", authUser.email)
      
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .maybeSingle()

      if (error) {
        console.error("❌ Error loading profile:", error)
        // Don't throw error, just create default profile
      }

      if (!profileData) {
        // Create profile if not exists
        console.log("📝 Creating new profile")
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert([{
            id: authUser.id,
            full_name: authUser.email?.split("@")[0] || "User",
            role: "user",
          }])
          .select()
          .maybeSingle()

        if (createError) {
          console.error("❌ Error creating profile:", createError)
          // Set basic user data even if profile creation fails
          setUser({
            id: authUser.id,
            email: authUser.email || "",
            name: authUser.email?.split("@")[0] || "User",
            role: "user",
            avatar: undefined,
          })
          setProfile(null)
          return
        }

        if (newProfile) {
          const typedProfile: Profile = {
            id: newProfile.id,
            full_name: newProfile.full_name || "",
            phone: newProfile.phone,
            address: newProfile.address,
            rt_rw: newProfile.rt_rw,
            occupation: newProfile.occupation,
            role: "user",
            avatar_url: newProfile.avatar_url,
            created_at: newProfile.created_at,
            updated_at: newProfile.updated_at,
          }

          setProfile(typedProfile)
          setUser({
            id: newProfile.id,
            email: authUser.email || "",
            name: newProfile.full_name || "",
            role: "user",
            avatar: newProfile.avatar_url || undefined,
          })
        }
        return
      }

      // Profile exists
      const userRole = profileData.role === "admin" ? "admin" : "user"
      
      const typedProfile: Profile = {
        id: profileData.id,
        full_name: profileData.full_name || "",
        phone: profileData.phone,
        address: profileData.address,
        rt_rw: profileData.rt_rw,
        occupation: profileData.occupation,
        role: userRole,
        avatar_url: profileData.avatar_url,
        created_at: profileData.created_at,
        updated_at: profileData.updated_at,
      }

      setProfile(typedProfile)
      setUser({
        id: profileData.id,
        email: authUser.email || "",
        name: profileData.full_name || "",
        role: userRole,
        avatar: profileData.avatar_url || undefined,
      })

      console.log("✅ Profile loaded successfully")
    } catch (error) {
      console.error("❌ Error in loadProfile:", error)
      // Set basic user data even if profile loading fails
      setUser({
        id: authUser.id,
        email: authUser.email || "",
        name: authUser.email?.split("@")[0] || "User",
        role: "user",
        avatar: undefined,
      })
      setProfile(null)
    }
  }

  useEffect(() => {
    let mounted = true
    let initComplete = false

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error("❌ Session error:", error)
          setIsLoading(false)
          return
        }

        if (session?.user && mounted) {
          await loadProfile(session.user)
        } else {
          console.log("📭 No active session found")
        }
      } catch (error) {
        console.error("❌ Init auth error:", error)
      } finally {
        if (mounted) {
          initComplete = true
          setIsLoading(false)
        }
      }
    }

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      console.log("🔄 Auth event:", event)

      // Don't process events during initial load
      if (!initComplete && event === 'INITIAL_SESSION') {
        return
      }

      if (session?.user) {
        setIsLoading(true)
        await loadProfile(session.user)
        setIsLoading(false)
      } else {
        setUser(null)
        setProfile(null)
        setIsLoading(false)
      }
    })

    // Initialize auth
    initializeAuth()

    // Cleanup timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (mounted && isLoading) {
        console.log("⚠️ Auth loading timeout, forcing completion")
        setIsLoading(false)
      }
    }, 5000)

    return () => {
      mounted = false
      subscription.unsubscribe()
      clearTimeout(timeoutId)
    }
  }, [])

  // Auth operations with simplified error handling
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
        setIsLoading(false)
        return false
      }

      toast({
        title: "Berhasil!",
        description: "Selamat datang! Anda berhasil masuk ke akun.",
      })
      
      // Don't navigate immediately, let auth state change handle it
      return true
    } catch (error) {
      console.error("❌ Login error:", error)
      setIsLoading(false)
      return false
    }
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: `${window.location.origin}/`
        },
      })

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
        return false
      }

      if (data.user && !data.user.confirmed_at) {
        toast({
          title: "Registrasi Berhasil!",
          description: "Silakan cek email untuk verifikasi.",
          duration: 8000,
        })
        return true
      }

      return true
    } catch (error) {
      console.error("❌ Register error:", error)
      return false
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      setIsLoading(false)
      
      toast({
        title: "Berhasil",
        description: "Anda telah keluar dari akun",
      })
      navigate("/")
    } catch (error) {
      console.error("❌ Logout error:", error)
      setIsLoading(false)
    }
  }

  const oauthLogin = async (provider: "google" | "github" | "facebook" | "twitter"): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ 
        provider,
        options: {
          redirectTo: `${window.location.origin}/`
        }
      })
      return !error
    } catch (error) {
      console.error("❌ OAuth error:", error)
      return false
    }
  }

  const updateProfile = async (data: Partial<Profile>): Promise<boolean> => {
    if (!user) return false

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", user.id)

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
        return false
      }

      // Reload profile
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        await loadProfile(authUser)
      }

      toast({
        title: "Berhasil",
        description: "Profil berhasil diperbarui",
      })
      return true
    } catch (error) {
      console.error("❌ Update profile error:", error)
      return false
    }
  }

  const value: AuthContextType = {
    user,
    profile,
    login,
    register,
    logout,
    updateProfile,
    oauthLogin,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
