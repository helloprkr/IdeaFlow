"use client"

import { useEffect } from 'react'
import { supabase } from '../config'
import { REALTIME_SUBSCRIPTIONS } from '../utils/constants'
import type { Database } from '@/types/supabase'

type RealtimeCallback<T> = (payload: {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new: T
  old: T
}) => void

export function useRealtimeSubscription<T>(
  table: keyof Database['public']['Tables'],
  callback: RealtimeCallback<T>,
  filter?: string
) {
  useEffect(() => {
    const channel = supabase
      .channel(REALTIME_SUBSCRIPTIONS[table.toUpperCase()])
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table, filter },
        payload => {
          callback(payload as any)
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [table, callback, filter])
}