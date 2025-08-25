
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"

export const useAuthOperations = () => {
  const { toast } = useToast()
  const navigate = useNavigate()

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
        return false
      }

      toast({
        title: "Berhasil!",
        description: "Selamat datang!",
      })
      navigate("/")
      return true
    } catch (error) {
      console.error("❌ Login error:", error)
      return false
    }
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
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
      }

      return true
    } catch (error) {
      console.error("❌ Register error:", error)
      return false
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      toast({
        title: "Berhasil",
        description: "Anda telah keluar dari akun",
      })
      navigate("/")
    } catch (error) {
      console.error("❌ Logout error:", error)
    }
  }

  const oauthLogin = async (provider: "google" | "github" | "facebook" | "twitter"): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider })
      return !error
    } catch (error) {
      console.error("❌ OAuth error:", error)
      return false
    }
  }

  return { login, register, logout, oauthLogin }
}
