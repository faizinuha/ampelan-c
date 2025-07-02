
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"

export const useAuthOperations = () => {
  const { toast } = useToast()
  const navigate = useNavigate()

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
        )
        ;({ data, error } = await supabase.auth.signUp({
          email,
          password,
        }))
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
    } catch (error) {
      console.error("Register error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat mendaftar",
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

  const oauthLogin = async (provider: "google" | "github" | "facebook" | "twitter"): Promise<boolean> => {
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

  return {
    login,
    register,
    logout,
    oauthLogin,
  }
}
