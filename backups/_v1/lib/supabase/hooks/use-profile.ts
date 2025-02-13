"use client"

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../config'
import type { Database } from '@/types/supabase'
import { useAuth } from './use-auth'

type Profile = Database['public']['Tables']['profiles']['Row']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchProfile = useCallback(async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  const updateProfile = useCallback(async (updates: ProfileUpdate) => {
    if (!user?.id) return { error: new Error('No user logged in') }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error
      setProfile(data)
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err as Error }
    }
  }, [user?.id])

  useEffect(() => {
    fetchProfile()

    const subscription = supabase
      .channel('profile_changes')
      .on('postgres_changes', 
        { 
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user?.id}`,
        },
        payload => {
          setProfile(payload.new as Profile)
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchProfile, user?.id])

  return {
    profile,
    loading,
    error,
    updateProfile,
  }
}