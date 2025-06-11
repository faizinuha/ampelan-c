// stores/useAuthStore.ts
import { create } from 'zustand'
import { supabase } from '../integrations/supabase/client'
import type { Session, User } from '@supabase/supabase-js'
import type { Profile } from '@/types/auth'
import { toast } from '@/hooks/use-toast'
import { redirect } from 'next/navigation'

interface AuthState {
  session: Session | null
  user: User | null
  profile: Profile | null
  isLoading: boolean
  setSession: (session: Session | null) => void
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => Promise<void>
  oauthLogin: (provider: 'google' | 'facebook') => Promise<boolean>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  profile: null,
  isLoading: false,

  setSession: (session) => {
    set({ session, user: session?.user ?? null })
  },

  login: async (email, password) => {
    set({ isLoading: true })
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
      set({ isLoading: false })
      return false
    }

    get().setSession(data.session)
    toast({
      title: 'Berhasil!',
      description: 'Selamat datang kembali!',
    })

    return true
  },

  register: async (email, password, name) => {
    set({ isLoading: true })
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
      set({ isLoading: false })
      return false
    }

    if (data.user && !data.user.confirmed_at) {
      toast({
        title: 'Registrasi Berhasil!',
        description: 'Silakan cek email Anda untuk verifikasi.',
      })
      set({ isLoading: false })
      return true
    }

    toast({
      title: 'Registrasi Berhasil!',
      description: 'Akun berhasil dibuat. Silakan login.',
    })

    set({ isLoading: false })
    return true
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
      return
    }

    set({ session: null, user: null, profile: null })
    toast({
      title: 'Berhasil Keluar',
      description: 'Anda telah keluar dari akun.',
    })
    redirect('/')
  },

  oauthLogin: async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({ provider })
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
      return false
    }
    return true
  },
}))
