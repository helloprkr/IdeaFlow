"use client"

import { Card } from "@/components/ui/card"
import Image from "next/image"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/10">
      <div className="max-w-md w-full p-4 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">IdeaFlow</h1>
          <p className="text-muted-foreground">Track your innovation journey</p>
        </div>
        <Card className="p-6">
          {children}
        </Card>
      </div>
    </div>
  )
}