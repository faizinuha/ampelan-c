
"use client"

import type { AuthContextType, Profile, User } from "@/types/auth"
import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useAuthOperations } from "@/hooks/useAuthOperations"
import { useProfileManager } from "@/hooks/useProfileManager"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const initializingRef = useRef(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const { login, register, logout, oauthLogin } = useAuthOperations()
  const { loadUserProfile, updateProfile: updateProfileData } = useProfileManager()

  // Timeout untuk mencegah loading selamanya
  const startLoadingTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      console.warn("⏰ Loading timeout reached, setting loading to false")
      setIsLoading(false)
    }, 10000) // 10 detik timeout
  }, [])

  const clearLoadingTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const handleProfileLoad = useCallback(async (userId: string, userEmail: string) => {
    try {
      console.log("🔄 Loading profile for:", userId, userEmail)
      startLoadingTimeout()
      
      await loadUserProfile(userId, userEmail, setProfile, setUser)
      console.log("✅ Profile loaded successfully")
    } catch (error) {
      console.error("❌ Error loading profile:", error)
      // Jangan clear state pada error, biarkan user tetap bisa menggunakan app
    } finally {
      clearLoadingTimeout()
      setIsLoading(false)
    }
  }, [loadUserProfile, startLoadingTimeout, clearLoadingTimeout])

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      // Prevent multiple initialization
      if (initializingRef.current) {
        console.log("🔄 Auth already initializing, skipping...")
        return
      }

      initializingRef.current = true

      try {
        console.log("🔄 Initializing auth state...")
        startLoadingTimeout()
        
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error("❌ Error getting session:", error)
          if (mounted) {
            setUser(null)
            setProfile(null)
            setIsLoading(false)
            clearLoadingTimeout()
          }
          return
        }

        if (session?.user && mounted) {
          console.log("✅ Session found, user:", session.user.email)
          await handleProfileLoad(session.user.id, session.user.email || "")
        } else {
          console.log("ℹ️ No active session found")
          if (mounted) {
            setUser(null)
            setProfile(null)
            setIsLoading(false)
            clearLoadingTimeout()
          }
        }
      } catch (error) {
        console.error("❌ Error initializing auth:", error)
        if (mounted) {
          setUser(null)
          setProfile(null)
          setIsLoading(false)
          clearLoadingTimeout()
        }
      } finally {
        initializingRef.current = false
      }
    }

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔄 Auth state changed:", event, session?.user?.email)

      if (!mounted) return

      // Clear any existing timeout
      clearLoadingTimeout()

      try {
        if (session?.user) {
          console.log("✅ User authenticated, loading profile...")
          setIsLoading(true)
          await handleProfileLoad(session.user.id, session.user.email || "")
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

    // Initialize auth
    initializeAuth()

    return () => {
      mounted = false
      clearLoadingTimeout()
      subscription.unsubscribe()
      console.log("🧹 Auth context cleanup completed")
    }
  }, [handleProfileLoad, startLoadingTimeout, clearLoadingTimeout])

  const updateProfile = async (data: Partial<Profile>): Promise<boolean> => {
    if (!user) {
      console.warn("⚠️ Cannot update profile: no user found")
      return false
    }

    try {
      const success = await updateProfileData(data, user.id)
      if (success) {
        console.log("✅ Profile updated, reloading...")
        setIsLoading(true)
        await handleProfileLoad(user.id, user.email)
      }
      return success
    } catch (error) {
      console.error("❌ Error updating profile:", error)
      setIsLoading(false)
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
