
"use client"

import type { AuthContextType, Profile, User } from "@/types/auth"
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useAuthOperations } from "@/hooks/useAuthOperations"
import { useProfileManager } from "@/hooks/useProfileManager"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const { login, register, logout, oauthLogin } = useAuthOperations()
  const { loadUserProfile, updateProfile: updateProfileData } = useProfileManager()

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        console.log("🔄 Initializing auth state...")
        
        // Get current session with error handling
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error("❌ Error getting session:", error)
          if (mounted) {
            setUser(null)
            setProfile(null)
            setIsLoading(false)
          }
          return
        }

        if (session?.user) {
          console.log("✅ Session found, user:", session.user.email)
          if (mounted) {
            setIsLoading(true)
            try {
              await loadUserProfile(session.user.id, session.user.email || "", setProfile, setUser)
              console.log("✅ Profile loaded successfully")
            } catch (profileError) {
              console.error("❌ Error loading profile:", profileError)
            } finally {
              setIsLoading(false)
            }
          }
        } else {
          console.log("ℹ️ No active session found")
          if (mounted) {
            setUser(null)
            setProfile(null)
            setIsLoading(false)
          }
        }
      } catch (error) {
        console.error("❌ Error initializing auth:", error)
        if (mounted) {
          setUser(null)
          setProfile(null)
          setIsLoading(false)
        }
      }
    }

    // Set up auth state listener with improved error handling
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔄 Auth state changed:", event, session?.user?.email)

      if (!mounted) return

      try {
        if (session?.user) {
          console.log("✅ User authenticated, loading profile...")
          setIsLoading(true)
          
          // Use setTimeout to avoid blocking auth state change
          setTimeout(async () => {
            if (mounted) {
              try {
                await loadUserProfile(session.user.id, session.user.email || "", setProfile, setUser)
                console.log("✅ Profile loaded via auth state change")
              } catch (error) {
                console.error("❌ Error loading profile in auth state change:", error)
                setUser(null)
                setProfile(null)
              } finally {
                setIsLoading(false)
              }
            }
          }, 0)
        } else {
          console.log("🚪 User signed out, clearing state...")
          setUser(null)
          setProfile(null)
          setIsLoading(false)
        }
      } catch (error) {
        console.error("❌ Error in auth state change handler:", error)
        setUser(null)
        setProfile(null)
        setIsLoading(false)
      }
    })

    // Initialize auth after setting up listener
    initializeAuth()

    return () => {
      mounted = false
      subscription.unsubscribe()
      console.log("🧹 Auth context cleanup completed")
    }
  }, [loadUserProfile])

  const updateProfile = async (data: Partial<Profile>): Promise<boolean> => {
    if (!user) {
      console.warn("⚠️ Cannot update profile: no user found")
      return false
    }

    try {
      const success = await updateProfileData(data, user.id)
      if (success) {
        console.log("✅ Profile updated, reloading...")
        await loadUserProfile(user.id, user.email, setProfile, setUser)
      }
      return success
    } catch (error) {
      console.error("❌ Error updating profile:", error)
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
