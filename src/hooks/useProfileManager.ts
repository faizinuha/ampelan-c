
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import type { Profile, User } from "@/types/auth"

export const useProfileManager = () => {
  const { toast } = useToast()

  const loadUserProfile = async (
    userId: string, 
    userEmail: string,
    setProfile: (profile: Profile | null) => void,
    setUser: (user: User | null) => void
  ) => {
    try {
      console.log("🔄 Loading profile for user:", userId, userEmail)

      if (!userId) {
        console.error("❌ No user ID provided")
        return
      }

      // Fetch profile with retry mechanism
      let profileData
      let retryCount = 0
      const maxRetries = 3

      while (retryCount < maxRetries) {
        try {
          const { data: fetchedProfileData, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single()

          if (error) {
            if (error.code === "PGRST116") {
              console.log("📝 Profile not found, creating new profile...")
              
              // Get user email from auth if not provided
              let email = userEmail
              if (!email) {
                const { data: { user: authUser } } = await supabase.auth.getUser()
                email = authUser?.email || ""
              }

              if (email) {
                const { data: newProfile, error: createError } = await supabase
                  .from("profiles")
                  .insert([
                    {
                      id: userId,
                      full_name: email.split("@")[0],
                      role: "user",
                    },
                  ])
                  .select()
                  .single()

                if (createError) {
                  console.error("❌ Error creating profile:", createError)
                  throw createError
                }

                console.log("✅ Profile created:", newProfile)
                profileData = newProfile
                break
              } else {
                console.error("❌ No email found for user")
                return
              }
            } else {
              console.error("❌ Error loading profile:", error)
              throw error
            }
          } else {
            profileData = fetchedProfileData
            break
          }
        } catch (retryError) {
          retryCount++
          if (retryCount >= maxRetries) {
            throw retryError
          }
          console.warn(`⚠️ Retry ${retryCount}/${maxRetries} loading profile...`)
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount))
        }
      }

      if (profileData) {
        console.log("✅ Profile loaded:", profileData)

        // Ensure role is properly typed
        const userRole =
          profileData.role === "admin" || profileData.role === "user"
            ? (profileData.role as "admin" | "user")
            : ("user" as const)

        // Type-safe conversion from database response to Profile type
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

        // Get email from auth session if not provided
        let email = userEmail
        if (!email) {
          const { data: { user: authUser } } = await supabase.auth.getUser()
          email = authUser?.email || ""
        }

        setProfile(typedProfile)
        setUser({
          id: profileData.id,
          email: email || "",
          name: profileData.full_name || "",
          role: userRole,
          avatar: profileData.avatar_url || undefined,
        })

        console.log("✅ User state set successfully:", {
          id: profileData.id,
          email: email,
          name: profileData.full_name,
          role: userRole,
        })
      }
    } catch (error) {
      console.error("❌ Error in loadUserProfile:", error)
      // Don't clear the state on error, let the UI handle it gracefully
      toast({
        title: "Peringatan",
        description: "Gagal memuat profil pengguna. Silakan muat ulang halaman.",
        variant: "destructive",
      })
    }
  }

  const updateProfile = async (data: Partial<Profile>, userId: string): Promise<boolean> => {
    if (!userId) {
      console.error("❌ No user ID provided for profile update")
      return false
    }

    try {
      console.log("🔄 Updating profile for user:", userId, data)
      
      const { error } = await supabase
        .from("profiles")
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      if (error) {
        console.error("❌ Error updating profile:", error)
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
        return false
      }

      console.log("✅ Profile updated successfully")
      toast({
        title: "Berhasil",
        description: "Profil berhasil diperbarui",
      })
      return true
    } catch (error) {
      console.error("❌ Update profile error:", error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memperbarui profil",
        variant: "destructive",
      })
      return false
    }
  }

  return {
    loadUserProfile,
    updateProfile,
  }
}
