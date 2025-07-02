
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
        // Get current session first
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error("Error getting session:", error)
          if (mounted) {
            setIsLoading(false)
          }
          return
        }

        if (session?.user) {
          console.log("Session found on init:", session.user.email)
          await loadUserProfile(session.user.id, session.user.email, setProfile, setUser)
        } else {
          console.log("No session found on init")
        }
        
        if (mounted) {
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email)

      if (!mounted) return

      // Skip initial session event as we handle it above
      if (event === 'INITIAL_SESSION') {
        return
      }

      if (session?.user) {
        setIsLoading(true)
        await loadUserProfile(session.user.id, session.user.email, setProfile, setUser)
        setIsLoading(false)
      } else {
        setUser(null)
        setProfile(null)
        setIsLoading(false)
      }
    })

    // Initialize auth
    initializeAuth()

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [loadUserProfile])

  const updateProfile = async (data: Partial<Profile>): Promise<boolean> => {
    if (!user) return false

    const success = await updateProfileData(data, user.id)
    if (success) {
      await loadUserProfile(user.id, user.email, setProfile, setUser)
    }
    return success
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
