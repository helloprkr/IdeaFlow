import { supabase } from '@/lib/supabaseClient'
import { ActivityDay } from './activity'

export async function getActivityData(userId: string, days: number = 365): Promise<ActivityDay[]> {
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - days)
  
  try {
    const { data, error } = await supabase
      .from('ideas')
      .select('created_at')
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString())
      .eq('user_id', userId)

    if (error) throw error

    // Create a map of dates to count
    const activityMap = new Map<string, number>()
    
    // Initialize all dates with 0
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      activityMap.set(d.toISOString().split('T')[0], 0)
    }

    // Count activities per day
    data?.forEach(item => {
      const date = new Date(item.created_at).toISOString().split('T')[0]
      activityMap.set(date, (activityMap.get(date) || 0) + 1)
    })

    // Convert map to array of ActivityDay objects
    return Array.from(activityMap.entries()).map(([date, count]) => ({
      date,
      count
    }))
  } catch (error) {
    console.error('Error fetching activity data:', error)
    return []
  }
}