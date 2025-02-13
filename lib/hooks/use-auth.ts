"use client"

import { useEffect, useState, useCallback, useRef } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useNetwork } from './use-network'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const isOnline = useNetwork()
  const authCheckTimeout = useRef<NodeJS.Timeout>()
  const mounted = useRef(true)

  const handleAuthStateChange = useCallback((_event: string, session: any) => {
    if (!mounted.current) return
    
    const newUser = session?.user ?? null
    console.log('Auth state changed:', newUser?.id || 'No user')
    setUser(newUser)
    
    // Cache user data for offline access
    if (newUser) {
      localStorage.setItem('cached_user', JSON.stringify(newUser))
    } else {
      localStorage.removeItem('cached_user')
    }
  }, [])

  useEffect(() => {
    console.log('AuthProvider: Checking initial session')

    const initializeAuth = async () => {
      try {
        // Clear any existing timeout
        if (authCheckTimeout.current) {
          clearTimeout(authCheckTimeout.current)
        }

        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        
        if (mounted.current) {
          console.log('Initial session:', session?.user?.id)
          setUser(session?.user ?? null)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        toast.error('Failed to initialize authentication')
        
        // Retry auth check after delay
        authCheckTimeout.current = setTimeout(initializeAuth, 5000)
      } finally {
        if (mounted.current) {
          setLoading(false)
        }
      }
    }

    // Load cached user data if offline
    if (!isOnline) {
      const cachedUser = localStorage.getItem('cached_user')
      if (cachedUser) {
        setUser(JSON.parse(cachedUser))
        setLoading(false)
      }
    }

    initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange)

    return () => {
      mounted.current = false
      if (authCheckTimeout.current) {
        clearTimeout(authCheckTimeout.current)
      }
      subscription.unsubscribe()
      console.log('Cleaning up subscription')
    }
  }, [handleAuthStateChange, isOnline])

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setUser(null)
      localStorage.removeItem('cached_user')
      router.push('/auth/signin')
      toast.success('Signed out successfully')
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error('Failed to sign out')
    }
  }

  return {
    user,
    loading,
    signOut,
    isOnline
  }
}