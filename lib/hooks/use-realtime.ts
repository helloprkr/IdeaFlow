"use client"

import { useEffect, useCallback } from 'react'
import { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'

type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE'

interface RealtimeOptions<T> {
  table: string
  filter?: string
  onInsert?: (payload: T) => void
  onUpdate?: (payload: T) => void
  onDelete?: (payload: T) => void
}

export function useRealtime<T>({
  table,
  filter,
  onInsert,
  onUpdate,
  onDelete
}: RealtimeOptions<T>) {
  const handleChange = useCallback((payload: {
    eventType: RealtimeEvent
    new: T
    old: T | null
  }) => {
    switch (payload.eventType) {
      case 'INSERT':
        onInsert?.(payload.new)
        break
      case 'UPDATE':
        onUpdate?.(payload.new)
        break
      case 'DELETE':
        onDelete?.(payload.old as T)
        break
    }
  }, [onInsert, onUpdate, onDelete])

  useEffect(() => {
    let channel: RealtimeChannel

    const setupSubscription = async () => {
      channel = supabase.channel(`${table}-changes`)
        .on(
          'postgres_changes',
          { 
            event: '*',
            schema: 'public',
            table,
            filter
          },
          handleChange
        )
        .subscribe()
    }

    setupSubscription()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [table, filter, handleChange])
}