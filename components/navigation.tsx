"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Lightbulb, UserCircle, PenTool as Tool } from "lucide-react"
import { useAuth } from "@/lib/hooks/use-auth"

export function Navigation() {
  const { user, signOut } = useAuth()

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2">
              <Lightbulb className="h-6 w-6" />
              <span className="font-bold text-xl">IdeaFlow</span>
            </Link>
            
            {user && (
              <Link href="/bolt-diy" className="flex items-center space-x-2">
                <Tool className="h-5 w-5" />
                <span>Bolt.DIY</span>
              </Link>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <ModeToggle />
            {user ? (
              <>
                <Link href="/profile">
                  <Button variant="ghost" size="icon">
                    <UserCircle className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="outline" onClick={() => signOut()}>
                  Sign out
                </Button>
              </>
            ) : (
              <Link href="/auth/signin">
                <Button>Sign in</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}