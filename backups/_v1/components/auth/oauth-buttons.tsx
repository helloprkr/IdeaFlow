"use client"

import { Button } from "@/components/ui/button"
import { Github, Twitter, Mail, Apple } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "sonner"

export function OAuthButtons() {
  const handleOAuthSignIn = async (provider: 'github' | 'twitter' | 'google' | 'apple') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) throw error
    } catch (error) {
      console.error('OAuth error:', error)
      toast.error('Failed to sign in with provider')
    }
  }

  return (
    <div className="grid gap-4">
      <Button
        variant="outline"
        onClick={() => handleOAuthSignIn('github')}
        className="flex items-center gap-2"
      >
        <Github className="h-4 w-4" />
        Continue with GitHub
      </Button>
      
      <Button
        variant="outline"
        onClick={() => handleOAuthSignIn('google')}
        className="flex items-center gap-2"
      >
        <Mail className="h-4 w-4" />
        Continue with Google
      </Button>
      
      <Button
        variant="outline"
        onClick={() => handleOAuthSignIn('twitter')}
        className="flex items-center gap-2"
      >
        <Twitter className="h-4 w-4" />
        Continue with Twitter
      </Button>
      
      <Button
        variant="outline"
        onClick={() => handleOAuthSignIn('apple')}
        className="flex items-center gap-2"
      >
        <Apple className="h-4 w-4" />
        Continue with Apple
      </Button>
    </div>
  )
}