"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface TopContributorsProps {
  data?: {
    name: string
    avatar: string
    count: number
  }[]
  isLoading?: boolean
}

export function TopContributors({ data = [], isLoading }: TopContributorsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Contributors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="animate-pulse bg-muted h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <div className="animate-pulse bg-muted h-4 w-24" />
                  <div className="animate-pulse bg-muted h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Contributors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((contributor, index) => (
            <div key={index} className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={contributor.avatar} />
                <AvatarFallback>
                  {contributor.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{contributor.name}</p>
                <p className="text-sm text-muted-foreground">
                  {contributor.count} contributions
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}