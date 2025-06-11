
// hooks/useInitAuth.ts
import { useEffect } from 'react'
import { supabase } from '../integrations/supabase/client'
import { useAuthStore } from '@/stores/useAuthStore'

export function useInitAuth() {
  const setSession = useAuthStore((s) => s.setSession)

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
    }

    loadSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [setSession])
}
