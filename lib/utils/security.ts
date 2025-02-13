"use client"

import { toast } from "sonner"
import { supabase } from "@/lib/supabaseClient"

// Rate limiting implementation
const rateLimits = new Map<string, { count: number; timestamp: number }>()
const RATE_LIMIT_WINDOW = 60000 // 1 minute
const MAX_REQUESTS = 5 // Limit login attempts

export function checkRateLimit(identifier: string): boolean {
  const now = Date.now()
  const userLimit = rateLimits.get(identifier)

  if (!userLimit) {
    rateLimits.set(identifier, { count: 1, timestamp: now })
    return true
  }

  if (now - userLimit.timestamp > RATE_LIMIT_WINDOW) {
    rateLimits.set(identifier, { count: 1, timestamp: now })
    return true
  }

  if (userLimit.count >= MAX_REQUESTS) {
    return false
  }

  userLimit.count++
  return true
}

// Input validation
export function validateInput(input: string, type: "email" | "username" | "password"): boolean {
  const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    username: /^[a-zA-Z0-9_-]{3,20}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  }

  return patterns[type].test(input)
}

// Security logging
export async function logSecurityEvent(
  userId: string,
  event: string,
  details: Record<string, any>
) {
  try {
    const { error } = await supabase.from("security_logs").insert({
      user_id: userId,
      event,
      details,
      timestamp: new Date().toISOString(),
    })

    if (error) throw error
  } catch (error) {
    console.error("Failed to log security event:", error)
  }
}