"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useAuth } from "./use-auth"
import { toast } from "sonner"
import type { Database } from "@/types/supabase"

type Idea = Database["public"]["Tables"]["ideas"]["Row"]
type IdeaVersion = Database["public"]["Tables"]["idea_versions"]["Row"]
type IdeaComment = Database["public"]["Tables"]["idea_comments"]["Row"]
type IdeaAttachment = Database["public"]["Tables"]["idea_attachments"]["Row"]

export function useIdeaTracking(ideaId?: string) {
  const { user } = useAuth()
  const [idea, setIdea] = useState<Idea | null>(null)
  const [versions, setVersions] = useState<IdeaVersion[]>([])
  const [comments, setComments] = useState<IdeaComment[]>([])
  const [attachments, setAttachments] = useState<IdeaAttachment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!ideaId || !user) return

    const fetchIdeaData = async () => {
      try {
        // Fetch idea details
        const { data: ideaData, error: ideaError } = await supabase
          .from("ideas")
          .select()
          .eq("id", ideaId)
          .single()

        if (ideaError) throw ideaError
        setIdea(ideaData)

        // Fetch versions
        const { data: versionData, error: versionError } = await supabase
          .from("idea_versions")
          .select()
          .eq("idea_id", ideaId)
          .order("created_at", { ascending: false })

        if (versionError) throw versionError
        setVersions(versionData)

        // Fetch comments
        const { data: commentData, error: commentError } = await supabase
          .from("idea_comments")
          .select()
          .eq("idea_id", ideaId)
          .order("created_at", { ascending: true })

        if (commentError) throw commentError
        setComments(commentData)

        // Fetch attachments
        const { data: attachmentData, error: attachmentError } = await supabase
          .from("idea_attachments")
          .select()
          .eq("idea_id", ideaId)
          .order("uploaded_at", { ascending: false })

        if (attachmentError) throw attachmentError
        setAttachments(attachmentData)
      } catch (error) {
        toast.error("Failed to load idea data")
      } finally {
        setLoading(false)
      }
    }

    fetchIdeaData()

    // Subscribe to real-time updates
    const ideaSubscription = supabase
      .channel(`idea:${ideaId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ideas", filter: `id=eq.${ideaId}` },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            setIdea(payload.new as Idea)
          }
        }
      )
      .subscribe()

    const commentSubscription = supabase
      .channel(`idea_comments:${ideaId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "idea_comments", filter: `idea_id=eq.${ideaId}` },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setComments(prev => [...prev, payload.new as IdeaComment])
          } else if (payload.eventType === "UPDATE") {
            setComments(prev => prev.map(comment => 
              comment.id === payload.new.id ? payload.new as IdeaComment : comment
            ))
          } else if (payload.eventType === "DELETE") {
            setComments(prev => prev.filter(comment => comment.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(ideaSubscription)
      supabase.removeChannel(commentSubscription)
    }
  }, [ideaId, user])

  const updateIdea = async (updates: Partial<Idea>) => {
    if (!idea || !user) return { error: new Error("Not authorized") }

    try {
      const { data, error } = await supabase
        .from("ideas")
        .update(updates)
        .eq("id", idea.id)
        .select()
        .single()

      if (error) throw error

      // Create version record
      const versionData = {
        idea_id: idea.id,
        title: data.title,
        description: data.description,
        changes: updates,
        created_by: user.id
      }

      const { error: versionError } = await supabase
        .from("idea_versions")
        .insert(versionData)

      if (versionError) throw versionError

      toast.success("Idea updated successfully")
      return { data, error: null }
    } catch (error) {
      toast.error("Failed to update idea")
      return { data: null, error }
    }
  }

  const addComment = async (content: string) => {
    if (!idea || !user) return { error: new Error("Not authorized") }

    try {
      const { data, error } = await supabase
        .from("idea_comments")
        .insert({
          idea_id: idea.id,
          user_id: user.id,
          content
        })
        .select()
        .single()

      if (error) throw error

      toast.success("Comment added")
      return { data, error: null }
    } catch (error) {
      toast.error("Failed to add comment")
      return { data: null, error }
    }
  }

  const uploadAttachment = async (file: File) => {
    if (!idea || !user) return { error: new Error("Not authorized") }

    try {
      const fileExt = file.name.split(".").pop()
      const filePath = `${idea.id}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from("idea-attachments")
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from("idea-attachments")
        .getPublicUrl(filePath)

      const { data, error } = await supabase
        .from("idea_attachments")
        .insert({
          idea_id: idea.id,
          name: file.name,
          file_path: publicUrl,
          file_type: file.type,
          size: file.size,
          uploaded_by: user.id
        })
        .select()
        .single()

      if (error) throw error

      toast.success("File uploaded successfully")
      return { data, error: null }
    } catch (error) {
      toast.error("Failed to upload file")
      return { data: null, error }
    }
  }

  return {
    idea,
    versions,
    comments,
    attachments,
    loading,
    updateIdea,
    addComment,
    uploadAttachment
  }
}