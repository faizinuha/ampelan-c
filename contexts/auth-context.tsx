"use client"

import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import type { AuthContextType, Profile, User } from "@/types/auth"
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    // Check current session
    const getSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          console.log("Session found:", session.user.email)
          await loadUserProfile(session.user.id, session.user.email)
        } else {
          console.log("No session found")
        }
      } catch (error) {
        console.error("Error getting session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email)

      if (session?.user) {
        await loadUserProfile(session.user.id, session.user.email)
      } else {
        setUser(null)
        setProfile(null)
      }
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (userId: string, userEmail?: string) => {
    try {
      console.log("Loading profile for user:", userId, userEmail)

      let profileData
      const { data: fetchedProfileData, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (error) {
        console.error("Error loading profile:", error)

        // If profile doesn't exist, create one for verified users
        if (error.code === "PGRST116") {
          console.log("Profile not found, creating new profile")

          // Get user email from auth if not provided
          if (!userEmail) {
            const {
              data: { user: authUser },
            } = await supabase.auth.getUser()
            userEmail = authUser?.email
          }

          if (userEmail) {
            const { data: newProfile, error: createError } = await supabase
              .from("profiles")
              .insert([
                {
                  id: userId,
                  full_name: userEmail.split("@")[0], // Use email prefix as default name
                  role: "user",
                },
              ])
              .select()
              .single()

            if (createError) {
              console.error("Error creating profile:", createError)
              return
            }

            console.log("Profile created:", newProfile)
            profileData = newProfile
          } else {
            console.error("No email found for user")
            return
          }
        } else {
          return
        }
      } else {
        profileData = fetchedProfileData
      }

      if (profileData) {
        console.log("Profile loaded:", profileData)

        // Ensure role is properly typed
        const userRole =
          profileData.role === "admin" || profileData.role === "user"
            ? (profileData.role as "admin" | "user")
            : ("user" as const)

        // Type-safe conversion from database response to Profile type
        const typedProfile: Profile = {
          id: profileData.id,
          full_name: profileData.full_name,
          phone: profileData.phone,
          address: profileData.address,
          rt_rw: profileData.rt_rw,
          occupation: profileData.occupation,
          role: userRole,
          avatar_url: profileData.avatar_url,
          created_at: profileData.created_at,
          updated_at: profileData.updated_at,
        }

        // Get email from auth session if not provided
        let email = userEmail
        if (!email) {
          const {
            data: { user: authUser },
          } = await supabase.auth.getUser()
          email = authUser?.email || ""
        }

        setProfile(typedProfile)
        setUser({
          id: profileData.id,
          email: email || "",
          name: profileData.full_name,
          role: userRole,
          avatar: profileData.avatar_url || undefined,
        })

        console.log("User state set:", {
          id: profileData.id,
          email: email,
          name: profileData.full_name,
          role: userRole,
        })
      }
    } catch (error) {
      console.error("Error in loadUserProfile:", error)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Attempting login for:", email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Login error:", error)
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
        return false
      }

      if (data.user) {
        console.log("Login successful for:", data.user.email)
        await loadUserProfile(data.user.id, data.user.email)

        toast({
          title: "Berhasil!",
          description: "Selamat datang! Anda berhasil masuk ke akun.",
        })

        // Redirect to home page after successful login
        navigate("/")
        return true
      }

      return false
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat login",
        variant: "destructive",
      })
      return false
    }
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      console.log("Attempting registration for:", email)

      let { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      })

      // Jika error 500, coba ulang tanpa custom data (debug only)
      if (error && error.status === 500) {
        console.error(
          "Supabase 500 error, retrying without custom data:",
          error,
        )(
          ({ data, error } = await supabase.auth.signUp({
            email,
            password,
          })),
        )
      }

      if (error) {
        console.error("Registration error:", error)
        toast({
          title: "Error",
          description: error.message + (error.status === 500 ? " (Hubungi admin jika masalah berlanjut)" : ""),
          variant: "destructive",
        })
        return false
      }

      // Jika user harus verifikasi email, jangan insert ke profiles dulu
      if (data.user && !data.user.confirmed_at) {
        console.log("User needs email verification")
        toast({
          title: "Registrasi Berhasil!",
          description: "Akun berhasil dibuat! Silakan cek email Anda untuk verifikasi sebelum bisa login.",
          duration: 8000,
        })
        return true
      }

      // Jika user sudah terverifikasi (misal, email magic link, atau auto-confirm di Supabase)
      if (data.user && data.user.confirmed_at) {
        console.log("User is verified, creating profile")

        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: data.user.id,
            full_name: name,
            role: "user",
          },
        ])

        if (profileError) {
          console.error("Error creating profile:", profileError)
          toast({
            title: "Error",
            description: profileError.message,
            variant: "destructive",
          })
          return false
        }

        toast({
          title: "Registrasi & Verifikasi Berhasil!",
          description: "Akun Anda sudah aktif. Silakan login.",
        })
        // Redirect ke login page, bukan home
        navigate("/login")
        return true
      }

      // Fallback jika tidak ada user
      toast({
        title: "Error",
        description: "Registrasi gagal. Silakan coba lagi.",
        variant: "destructive",
      })
      return false
    } catch (error: any) {
      console.error("Register error:", error)
      toast({
        title: "Error",
        description: error?.message || "Terjadi kesalahan saat mendaftar",
        variant: "destructive",
      })
      return false
    }
  }

  const logout = async () => {
    try {
      console.log("Logging out user")
      const { error } = await supabase.auth.signOut()
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      } else {
        setUser(null)
        setProfile(null)
        toast({
          title: "Berhasil",
          description: "Anda telah keluar dari akun",
        })
        // Redirect to home page after logout
        navigate("/")
      }
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const updateProfile = async (data: Partial<Profile>): Promise<boolean> => {
    if (!user) return false

    try {
      const { error } = await supabase.from("profiles").update(data).eq("id", user.id)

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
        return false
      }

      await loadUserProfile(user.id, user.email)
      toast({
        title: "Berhasil",
        description: "Profil berhasil diperbarui",
      })
      return true
    } catch (error) {
      console.error("Update profile error:", error)
      return false
    }
  }

  type OAuthProvider = "google" | "github" | "facebook" | "twitter"

  const oauthLogin = async (provider: OAuthProvider): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
      })

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
        return false
      }

      return true
    } catch (error) {
      console.error("OAuth login error:", error)
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
