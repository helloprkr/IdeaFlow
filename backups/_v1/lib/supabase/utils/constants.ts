export const IDEA_STATUS = {
  DRAFT: 'draft',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid login credentials',
  EMAIL_TAKEN: 'Email already registered',
  WEAK_PASSWORD: 'Password is too weak',
  INVALID_EMAIL: 'Invalid email format',
} as const

export const REALTIME_SUBSCRIPTIONS = {
  IDEAS: 'ideas_changes',
  PROFILES: 'profile_changes',
} as const