"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Search, SlidersHorizontal } from "lucide-react"
import { ProjectCard } from "@/components/bolt-diy/project-card"
import { useBoltDIY } from "@/lib/hooks/use-bolt-diy"

export default function BoltDIYPage() {
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("date-desc")
  const { projects, loading } = useBoltDIY()

  const filteredProjects = projects?.filter(project => 
    project.title.toLowerCase().includes(search.toLowerCase()) ||
    project.description.toLowerCase().includes(search.toLowerCase())
  )

  const sortedProjects = [...(filteredProjects || [])].sort((a, b) => {
    switch (sort) {
      case "date-desc":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case "date-asc":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      case "status":
        return a.status.localeCompare(b.status)
      default:
        return 0
    }
  })

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Bolt.DIY Projects</h1>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Newest first</SelectItem>
            <SelectItem value="date-asc">Oldest first</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-4" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-5/6" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : sortedProjects.length > 0 ? (
          sortedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>No projects found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {search ? "Try adjusting your search terms" : "Create your first DIY project to get started"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}