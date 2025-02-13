import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
})

export type Env = z.infer<typeof envSchema>

export function validateEnv(): Env {
  try {
    return envSchema.parse({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NODE_ENV: process.env.NODE_ENV,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missing = error.issues
        .filter(issue => issue.code === 'invalid_type' && issue.received === 'undefined')
        .map(issue => issue.path[0])
      
      const invalid = error.issues
        .filter(issue => issue.code !== 'invalid_type' || issue.received !== 'undefined')
        .map(issue => `${issue.path[0]}: ${issue.message}`)

      throw new Error(
        'Environment validation failed:\n' +
        (missing.length ? `Missing variables:\n${missing.map(v => `  - ${v}`).join('\n')}\n` : '') +
        (invalid.length ? `Invalid variables:\n${invalid.map(v => `  - ${v}`).join('\n')}` : '')
      )
    }
    throw error
  }
}

// Export validated environment variables
export const env = validateEnv()