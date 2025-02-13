```typescript
"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useAuth } from "./use-auth"
import { toast } from "sonner"

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true
    let retryCount = 0
    const MAX_RETRIES = 3
    const RETRY_DELAY = 1000

    const fetchProfile = async () => {
      if (!user?.id) return

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select()
          .eq('id', user.id)
          .maybeSingle()

        if (error) throw error
        
        if (mounted) {
          setProfile(data)
          setError(null)
        }
      } catch (err) {
        console.error('Profile fetch error:', err)
        setError(err as Error)
        
        // Implement retry logic
        if (retryCount < MAX_RETRIES) {
          retryCount++
          setTimeout(fetchProfile, RETRY_DELAY * retryCount)
        } else {
          toast.error('Failed to load profile')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchProfile()

    return () => {
      mounted = false
    }
  }, [user?.id])

  return { profile, loading, error }
}
```