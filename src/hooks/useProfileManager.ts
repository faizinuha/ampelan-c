
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import type { Profile, User } from "@/types/auth"
import { useCallback } from "react"

export const useProfileManager = () => {
  const { toast } = useToast()

  const loadUserProfile = useCallback(async (
    userId: string, 
    userEmail: string,
    setProfile: (profile: Profile | null) => void,
    setUser: (user: User | null) => void
  ) => {
    try {
      console.log("Loading profile for user:", userId, userEmail)

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (error) {
        console.error("Error loading profile:", error)

        // Create profile if it doesn't exist
        if (error.code === "PGRST116") {
          console.log("Profile not found, creating new profile")

          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert([
              {
                id: userId,
                full_name: userEmail.split("@")[0],
                role: "user",
              },
            ])
            .select()
            .single()

          if (createError) {
            console.error("Error creating profile:", createError)
            return
          }

          console.log("Profile created successfully:", newProfile)
          await processProfileData(newProfile, userEmail, setProfile, setUser)
        }
        return
      }

      await processProfileData(profileData, userEmail, setProfile, setUser)
    } catch (error) {
      console.error("Error in loadUserProfile:", error)
    }
  }, [])

  const processProfileData = async (
    profileData: any,
    userEmail: string,
    setProfile: (profile: Profile | null) => void,
    setUser: (user: User | null) => void
  ) => {
    if (!profileData) return

    console.log("Processing profile data:", profileData.full_name)

    // Ensure role is properly typed
    const userRole = profileData.role === "admin" || profileData.role === "user"
      ? (profileData.role as "admin" | "user")
      : ("user" as const)

    // Type-safe conversion
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

    setProfile(typedProfile)
    setUser({
      id: profileData.id,
      email: userEmail,
      name: profileData.full_name,
      role: userRole,
      avatar: profileData.avatar_url || undefined,
    })

    console.log("Profile and user state updated successfully")
  }

  const updateProfile = async (data: Partial<Profile>, userId: string): Promise<boolean> => {
    if (!userId) return false

    try {
      const { error } = await supabase.from("profiles").update(data).eq("id", userId)

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
        return false
      }

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

  return {
    loadUserProfile,
    updateProfile,
  }
}
