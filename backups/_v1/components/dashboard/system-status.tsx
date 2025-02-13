"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSystemStatus } from "@/lib/hooks/use-system-status"
import { Activity, Signal, Waves, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

export function SystemStatus() {
  const { status, loading } = useSystemStatus()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-2">
            <Signal className={cn(
              "h-4 w-4",
              status.connectionStatus === 'connected' ? "text-green-500" : "text-red-500"
            )} />
            <span className="text-sm font-medium">
              {status.connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">
              {status.responseTime.toFixed(2)}ms
            </span>
          </div>

          <div className="flex items-center gap-2">
            <AlertTriangle className={cn(
              "h-4 w-4",
              status.errorRate > 0.1 ? "text-red-500" : "text-yellow-500"
            )} />
            <span className="text-sm font-medium">
              {(status.errorRate * 100).toFixed(2)}% Errors
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Waves className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium">
              {status.dataFlowRate.toFixed(2)} req/s
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}