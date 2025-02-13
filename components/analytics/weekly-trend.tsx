"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartWrapper } from "@/components/dashboard/charts/chart-wrapper"

interface WeeklyTrendProps {
  data?: {
    date: string
    count: number
  }[]
  isLoading?: boolean
}

export function WeeklyTrend({ data = [], isLoading }: WeeklyTrendProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-pulse bg-muted w-full h-48" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartWrapper data={data} xKey="date" yKey="count" />
        </div>
      </CardContent>
    </Card>
  )
}