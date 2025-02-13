import { supabase } from '@/lib/supabaseClient'

interface RetryConfig {
  maxRetries?: number
  delayMs?: number
  shouldRetry?: (error: any) => boolean
}

const defaultConfig: RetryConfig = {
  maxRetries: 3,
  delayMs: 1000,
  shouldRetry: (error) => {
    return error?.status === 429 || error?.status === 503
  }
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  config: RetryConfig = {}
): Promise<T> {
  const { maxRetries, delayMs, shouldRetry } = { ...defaultConfig, ...config }
  let lastError: any
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      
      if (attempt === maxRetries || !shouldRetry(error)) {
        throw error
      }
      
      await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, attempt)))
    }
  }
  
  throw lastError
}

export const apiClient = {
  async get(path: string, options = {}) {
    return withRetry(() => supabase.from(path).select(), options)
  },
  
  async post(path: string, data: any, options = {}) {
    return withRetry(() => supabase.from(path).insert(data), options)
  },
  
  async put(path: string, data: any, options = {}) {
    return withRetry(() => supabase.from(path).update(data), options)
  },
  
  async delete(path: string, options = {}) {
    return withRetry(() => supabase.from(path).delete(), options)
  }
}