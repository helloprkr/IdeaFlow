```typescript
import { supabase } from '@/lib/supabaseClient'

export async function handleAuthError(error: any) {
  console.error('Auth error:', error)
  
  // Map error codes to user-friendly messages
  const errorMessages: Record<string, string> = {
    'auth/invalid-email': 'Invalid email address',
    'auth/user-disabled': 'This account has been disabled',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/email-already-in-use': 'Email already in use',
    'auth/weak-password': 'Password is too weak',
    'auth/popup-closed-by-user': 'Sign in was cancelled',
    'auth/network-request-failed': 'Network error. Please check your connection.',
  }

  return errorMessages[error.code] || 'An unexpected error occurred'
}

export async function validateSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  } catch (error) {
    console.error('Session validation error:', error)
    return null
  }
}

export function getAuthErrorFromURL() {
  if (typeof window === 'undefined') return null
  
  const params = new URLSearchParams(window.location.search)
  return params.get('error')
}
```