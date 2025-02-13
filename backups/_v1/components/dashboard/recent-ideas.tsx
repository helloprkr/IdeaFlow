"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { useIdeas } from "@/lib/hooks/use-ideas"
import { Skeleton } from "@/components/ui/skeleton"

export function RecentIdeas() {
  const { ideas, loading } = useIdeas()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Ideas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-start justify-between space-x-4">
                <div className="space-y-1">
                  <Skeleton className="h-5 w-[200px]" />
                  <Skeleton className="h-4 w-[300px]" />
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                </div>
                <Skeleton className="h-6 w-[80px]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const recentIdeas = ideas?.slice(0, 3) || []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Ideas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {recentIdeas.map((idea) => (
            <div
              key={idea.id}
              className="flex items-start justify-between space-x-4"
            >
              <div className="space-y-1">
                <h4 className="font-semibold">{idea.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {idea.description}
                </p>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>
                      {idea.user_id.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(idea.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
              <Badge
                variant={
                  idea.status === "completed"
                    ? "default"
                    : idea.status === "in_progress"
                    ? "secondary"
                    : "outline"
                }
              >
                {idea.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}