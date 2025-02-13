"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { supabase } from "@/lib/supabaseClient"

export default function UpdatePassword() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const updatePassword = async () => {
      try {
        const { error } = await supabase.auth.updateUser({
          password: "ThenWhat2024!"
        })

        if (error) {
          toast.error("Failed to update password")
          return
        }

        toast.success("Password updated successfully")
        router.push("/")
      } catch (error) {
        toast.error("An unexpected error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    updatePassword()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Updating password...</h2>
          <p className="text-muted-foreground">Please wait while we process your request.</p>
        </div>
      </div>
    )
  }

  return null
}