"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "sonner"

export interface Idea {
  id: string
  title: string
  description: string
  status: "draft" | "in_progress" | "completed"
  created_at: string
  user_id: string
}

export function useIdeas() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    let subscription: any = null

    const fetchIdeas = async () => {
      try {
        const { data, error } = await supabase
          .from("ideas")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) throw error
        
        if (mounted) {
          console.log('Fetched ideas:', data)
          setIdeas(data || [])
        }
      } catch (error) {
        console.error('Failed to load ideas:', error)
        toast.error("Failed to load ideas")
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    const setupRealtimeSubscription = () => {
      return supabase
        .channel("ideas_changes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "ideas" },
          (payload) => {
            console.log('Real-time update received:', payload)
            if (!mounted) return

            if (payload.eventType === "INSERT") {
              setIdeas((prev) => [payload.new as Idea, ...prev])
            } else if (payload.eventType === "UPDATE") {
              setIdeas((prev) =>
                prev.map((idea) =>
                  idea.id === payload.new.id ? (payload.new as Idea) : idea
                )
              )
            } else if (payload.eventType === "DELETE") {
              setIdeas((prev) =>
                prev.filter((idea) => idea.id !== payload.old.id)
              )
            }
          }
        )
        .subscribe()
    }

    fetchIdeas()
    subscription = setupRealtimeSubscription()

    return () => {
      mounted = false
      if (subscription) {
        console.log('Cleaning up subscription')
        subscription.unsubscribe()
      }
    }
  }, [])

  const createIdea = async (data: Pick<Idea, "title" | "description">) => {
    try {
      console.log('Creating new idea:', data)
      const { data: idea, error } = await supabase
        .from("ideas")
        .insert({
          ...data,
          user_id: 'd0d8c19c-3b3e-4f5a-a7b8-c9d0e1f2g3h4', // Use the test user ID
          status: "draft",
        })
        .select()
        .single()

      if (error) throw error

      console.log('Successfully created idea:', idea)
      toast.success("Idea created successfully")
      return { data: idea, error: null }
    } catch (error) {
      console.error('Failed to create idea:', error)
      toast.error("Failed to create idea")
      return { data: null, error }
    }
  }

  return {
    ideas,
    loading,
    createIdea,
  }
}