```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { OAuthButtons } from '@/components/auth/oauth-buttons'
import { supabase } from '@/lib/supabaseClient'

jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithOAuth: jest.fn()
    }
  }
}))

describe('OAuthButtons', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render all provider buttons', () => {
    render(<OAuthButtons />)
    
    expect(screen.getByText(/Continue with GitHub/i)).toBeInTheDocument()
    expect(screen.getByText(/Continue with Google/i)).toBeInTheDocument()
    expect(screen.getByText(/Continue with Twitter/i)).toBeInTheDocument()
    expect(screen.getByText(/Continue with Apple/i)).toBeInTheDocument()
  })

  it('should handle OAuth sign in', async () => {
    ;(supabase.auth.signInWithOAuth as jest.Mock).mockResolvedValueOnce({ error: null })
    
    render(<OAuthButtons />)
    
    fireEvent.click(screen.getByText(/Continue with GitHub/i))
    
    expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'github',
      options: {
        redirectTo: expect.any(String)
      }
    })
  })

  it('should handle OAuth errors', async () => {
    const mockError = new Error('OAuth error')
    ;(supabase.auth.signInWithOAuth as jest.Mock).mockRejectedValueOnce(mockError)
    
    render(<OAuthButtons />)
    
    fireEvent.click(screen.getByText(/Continue with GitHub/i))
    
    // Verify error handling
    expect(supabase.auth.signInWithOAuth).toHaveBeenCalled()
  })
})
```