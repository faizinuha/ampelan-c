
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
      console.log("Loading profile for user:", userId, userEmail)

      let profileData
      const { data: fetchedProfileData, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (error) {
        console.error("Error loading profile:", error)

        // If profile doesn't exist, create one for verified users
        if (error.code === "PGRST116") {
          console.log("Profile not found, creating new profile")

          // Get user email from auth if not provided
          let email = userEmail
          if (!email) {
            const {
              data: { user: authUser },
            } = await supabase.auth.getUser()
            email = authUser?.email || ""
          }

          if (email) {
            const { data: newProfile, error: createError } = await supabase
              .from("profiles")
              .insert([
                {
                  id: userId,
                  full_name: email.split("@")[0], // Use email prefix as default name
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
