"use client"

import { useState, useEffect } from 'react'
import { useRealtime } from './use-realtime'
import { supabase } from '@/lib/supabaseClient'
import type { AnalyticsData } from '@/types/analytics'

export function useAnalyticsRealtime() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: ideas, error } = await supabase
          .from('ideas')
          .select('*')
        
        if (error) throw error

        // Transform data into analytics format
        // This would be replaced with your actual analytics calculation logic
        const analyticsData: AnalyticsData = {
          totalIdeas: ideas.length,
          totalIdeasChange: 0,
          inProgressIdeas: ideas.filter(i => i.status === 'in_progress').length,
          inProgressIdeasChange: 0,
          completedIdeas: ideas.filter(i => i.status === 'completed').length,
          completedIdeasChange: 0,
          totalContributors: new Set(ideas.map(i => i.user_id)).size,
          totalContributorsChange: 0,
          statusBreakdown: [
            { name: 'Draft', value: ideas.filter(i => i.status === 'draft').length },
            { name: 'In Progress', value: ideas.filter(i => i.status === 'in_progress').length },
            { name: 'Completed', value: ideas.filter(i => i.status === 'completed').length }
          ],
          weeklyTrend: [], // You would calculate this based on your requirements
          topContributors: [] // You would calculate this based on your requirements
        }

        setData(analyticsData)
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Subscribe to real-time updates
  useRealtime({
    table: 'ideas',
    onInsert: () => {
      // Update analytics when a new idea is created
      setData(prev => prev ? {
        ...prev,
        totalIdeas: prev.totalIdeas + 1,
        totalIdeasChange: ((prev.totalIdeas + 1) / prev.totalIdeas - 1) * 100
      } : null)
    },
    onUpdate: () => {
      // Refresh data when ideas are updated
      // In a production environment, you might want to be more selective about when to refresh
      const fetchData = async () => {
        const { data: ideas, error } = await supabase
          .from('ideas')
          .select('*')
        
        if (error) return

        // Update analytics data
        // This is a simplified example - you would need to implement your full analytics calculation
        setData(prev => prev ? {
          ...prev,
          inProgressIdeas: ideas.filter(i => i.status === 'in_progress').length,
          completedIdeas: ideas.filter(i => i.status === 'completed').length,
        } : null)
      }

      fetchData()
    }
  })

  return { data, loading }
}