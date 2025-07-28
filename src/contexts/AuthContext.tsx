
"use client"

import type { AuthContextType, Profile, User } from "@/types/auth"
import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useAuthOperations } from "@/hooks/useAuthOperations"
import { useProfileManager } from "@/hooks/useProfileManager"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  
  const { login, register, logout, oauthLogin } = useAuthOperations()
  const { loadUserProfile, updateProfile: updateProfileData } = useProfileManager()

  const handleAuthStateChange = useCallback(async (event: string, session: any) => {
    console.log("Auth state changed:", event, session?.user?.email)

    if (session?.user) {
      console.log("User session found, loading profile...")
      await loadUserProfile(session.user.id, session.user.email || "", setProfile, setUser)
    } else {
      console.log("No user session, clearing state...")
      setUser(null)
      setProfile(null)
    }
    
    // Only set loading to false after handling auth state
    setIsLoading(false)
  }, [loadUserProfile])

  useEffect(() => {
    if (isInitialized) return

    const initializeAuth = async () => {
      try {
        console.log("Initializing auth state...")
        setIsInitialized(true)
        
        // Set up auth state listener
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(handleAuthStateChange)

        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error("Error getting session:", error)
          setIsLoading(false)
          return () => subscription.unsubscribe()
        }

        // Handle current session
        if (session?.user) {
          console.log("Current session found on init:", session.user.email)
          await loadUserProfile(session.user.id, session.user.email || "", setProfile, setUser)
        } else {
          console.log("No current session found")
        }
        
        setIsLoading(false)

        return () => subscription.unsubscribe()
      } catch (error) {
        console.error("Error initializing auth:", error)
        setIsLoading(false)
      }
    }

    const cleanup = initializeAuth()
    
    return () => {
      cleanup?.then(cleanupFn => cleanupFn?.())
    }
  }, [isInitialized, handleAuthStateChange, loadUserProfile])

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
