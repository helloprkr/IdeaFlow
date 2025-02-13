const rateLimit = new Map<string, { count: number; timestamp: number }>()
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const MAX_REQUESTS = 100 // per window

export function checkRateLimit(identifier: string): boolean {
  const now = Date.now()
  const windowStart = now - WINDOW_MS
  
  // Clean up old entries
  for (const [key, data] of rateLimit.entries()) {
    if (data.timestamp < windowStart) {
      rateLimit.delete(key)
    }
  }

  const current = rateLimit.get(identifier)
  if (!current) {
    rateLimit.set(identifier, { count: 1, timestamp: now })
    return true
  }

  if (current.timestamp < windowStart) {
    rateLimit.set(identifier, { count: 1, timestamp: now })
    return true
  }

  if (current.count >= MAX_REQUESTS) {
    return false
  }

  current.count++
  return true
}