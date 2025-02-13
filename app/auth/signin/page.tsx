"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OAuthButtons } from "@/components/auth/oauth-buttons"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

export default function SignIn() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  useEffect(() => {
    if (error === 'callback-failed') {
      toast.error('Authentication failed. Please try again.')
    }
  }, [error])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <OAuthButtons />
      </CardContent>
    </Card>
  )
}