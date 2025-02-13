"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

let client: ReturnType<typeof createClient<Database>> | null = null

export function useSupabase() {
  const [supabase] = useState(() => {
    if (!client) {
      client = createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
          },
          db: {
            schema: 'public'
          }
        }
      )
    }
    return client
  })

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        // Handle auth state changes
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return { supabase }
}