"use client"

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../config'
import type { Database } from '@/types/supabase'

type Idea = Database['public']['Tables']['ideas']['Row']
type NewIdea = Database['public']['Tables']['ideas']['Insert']

export function useIdeas() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Fetch ideas
  const fetchIdeas = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setIdeas(data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Create idea
  const createIdea = useCallback(async (newIdea: NewIdea) => {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .insert(newIdea)
        .select()
        .single()

      if (error) throw error
      setIdeas(prev => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err as Error }
    }
  }, [])

  // Update idea
  const updateIdea = useCallback(async (id: string, updates: Partial<Idea>) => {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setIdeas(prev => prev.map(idea => idea.id === id ? data : idea))
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err as Error }
    }
  }, [])

  // Delete idea
  const deleteIdea = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', id)

      if (error) throw error
      setIdeas(prev => prev.filter(idea => idea.id !== id))
      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  }, [])

  // Subscribe to changes
  useEffect(() => {
    fetchIdeas()

    const subscription = supabase
      .channel('ideas_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'ideas' },
        payload => {
          if (payload.eventType === 'INSERT') {
            setIdeas(prev => [payload.new as Idea, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setIdeas(prev => 
              prev.map(idea => 
                idea.id === payload.new.id ? payload.new as Idea : idea
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setIdeas(prev => 
              prev.filter(idea => idea.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchIdeas])

  return {
    ideas,
    loading,
    error,
    createIdea,
    updateIdea,
    deleteIdea,
  }
}