export interface AnalyticsData {
  totalIdeas: number
  totalIdeasChange: number
  inProgressIdeas: number
  inProgressIdeasChange: number
  completedIdeas: number
  completedIdeasChange: number
  totalContributors: number
  totalContributorsChange: number
  statusBreakdown: {
    name: string
    value: number
  }[]
  weeklyTrend: {
    date: string
    count: number
  }[]
  topContributors: {
    name: string
    avatar: string
    count: number
  }[]
}