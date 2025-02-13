"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { PenTool as Tool, Package, Clock } from "lucide-react"

interface ProjectCardProps {
  project: {
    title: string
    description: string
    status: string
    created_at: string
    materials: string[]
    components: string[]
    author: {
      name: string
      avatar: string
    }
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  const statusColors = {
    draft: "default",
    "in_progress": "secondary",
    completed: "success"
  } as const

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Badge variant={statusColors[project.status as keyof typeof statusColors]}>
          {project.status}
        </Badge>
        <time className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
        </time>
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold truncate mb-2">{project.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {project.description}
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <Tool className="h-4 w-4 text-muted-foreground" />
            <span>{project.materials.length} materials needed</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span>{project.components.length} components</span>
          </div>

          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={project.author.avatar} />
              <AvatarFallback>
                {project.author.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{project.author.name}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}