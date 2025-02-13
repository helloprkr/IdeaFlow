export class SupabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: string
  ) {
    super(message)
    this.name = 'SupabaseError'
  }
}

export function handleSupabaseError(error: any): SupabaseError {
  if (error instanceof SupabaseError) {
    return error
  }

  // Handle Supabase-specific error format
  if (error.code && error.message) {
    return new SupabaseError(error.message, error.code, error.details)
  }

  // Handle generic errors
  return new SupabaseError(
    error.message || 'An unexpected error occurred',
    'UNKNOWN_ERROR'
  )
}