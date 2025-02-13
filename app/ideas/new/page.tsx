"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useIdeas } from "@/lib/hooks/use-ideas"

export default function NewIdea() {
  const router = useRouter()
  const { createIdea } = useIdeas()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { error } = await createIdea({ title, description })
      if (error) throw error
      router.push("/")
    } catch (error) {
      console.error('Failed to create idea:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>New Idea</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your idea title"
                required
                data-testid="idea-title-input"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your idea in detail"
                required
                rows={5}
                data-testid="idea-description-input"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/")}
                data-testid="cancel-button"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
                data-testid="submit-button"
              >
                {isSubmitting ? "Creating..." : "Create Idea"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}