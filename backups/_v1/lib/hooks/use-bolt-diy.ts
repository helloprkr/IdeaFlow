"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useAuth } from "./use-auth"
import { toast } from "sonner"

interface BoltDIYProject {
  id: string
  title: string
  description: string
  status: "draft" | "in_progress" | "completed"
  created_at: string
  user_id: string
  components: string[]
  instructions: string
  materials: string[]
}

export function useBoltDIY() {
  const [projects, setProjects] = useState<BoltDIYProject[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from("bolt_diy_projects")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) throw error
        setProjects(data || [])
      } catch (error) {
        console.error("Error fetching DIY projects:", error)
        toast.error("Failed to load DIY projects")
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()

    const subscription = supabase
      .channel("bolt_diy_changes")
      .on("postgres_changes", 
        { event: "*", schema: "public", table: "bolt_diy_projects" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setProjects(prev => [payload.new as BoltDIYProject, ...prev])
          } else if (payload.eventType === "UPDATE") {
            setProjects(prev => 
              prev.map(project => 
                project.id === payload.new.id ? payload.new as BoltDIYProject : project
              )
            )
          } else if (payload.eventType === "DELETE") {
            setProjects(prev => 
              prev.filter(project => project.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user])

  const createProject = async (data: Omit<BoltDIYProject, "id" | "created_at" | "user_id">) => {
    if (!user) return { error: new Error("Not authorized") }

    try {
      const { data: project, error } = await supabase
        .from("bolt_diy_projects")
        .insert({
          ...data,
          user_id: user.id,
          status: "draft"
        })
        .select()
        .single()

      if (error) throw error

      toast.success("Project created successfully")
      return { data: project, error: null }
    } catch (error) {
      console.error("Failed to create project:", error)
      toast.error("Failed to create project")
      return { data: null, error }
    }
  }

  return {
    projects,
    loading,
    createProject
  }
}