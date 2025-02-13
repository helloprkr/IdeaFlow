"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/config"
import type { AnalyticsData } from "@/types/analytics"
import { calculateAnalytics } from "@/lib/utils/analytics"

export function useAnalytics(dateRange: string) {
  const [data, setData] = useState<AnalyticsData>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error>()

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setIsLoading(true)
        const { data: ideas, error: ideasError } = await supabase
          .from("ideas")
          .select("*")
        
        if (ideasError) throw ideasError

        const analytics = calculateAnalytics(ideas, dateRange)
        setData(analytics)
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()

    const subscription = supabase
      .channel("ideas_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "ideas" }, 
        () => {
          fetchAnalytics()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [dateRange])

  return { data, isLoading, error }
}