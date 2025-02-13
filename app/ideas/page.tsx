"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Search, SlidersHorizontal } from "lucide-react"
import { IdeaCard } from "@/components/ideas/idea-card"
import { NewIdeaDialog } from "@/components/ideas/new-idea-dialog"
import { useIdeas } from "@/lib/hooks/use-ideas"
import { IdeaCardSkeleton } from "@/components/ideas/idea-card-skeleton"

export default function IdeasPage() {
  const [isNewIdeaOpen, setIsNewIdeaOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("date-desc")
  const { ideas, loading } = useIdeas()

  const filteredIdeas = ideas?.filter(idea => 
    idea.title.toLowerCase().includes(search.toLowerCase()) ||
    idea.description.toLowerCase().includes(search.toLowerCase())
  )

  const sortedIdeas = [...(filteredIdeas || [])].sort((a, b) => {
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
        <h1 className="text-3xl font-bold tracking-tight">Ideas</h1>
        <Button onClick={() => setIsNewIdeaOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          New Idea
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search ideas..."
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
          Array(6).fill(0).map((_, i) => <IdeaCardSkeleton key={i} />)
        ) : sortedIdeas.length > 0 ? (
          sortedIdeas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))
        ) : (
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>No ideas found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {search ? "Try adjusting your search terms" : "Drop your first banger to get started" }
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <NewIdeaDialog
        open={isNewIdeaOpen}
        onOpenChange={setIsNewIdeaOpen}
      />
    </div>
  )
}