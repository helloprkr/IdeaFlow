```typescript
import { render, screen } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import AuthCallback from '@/app/auth/callback/page'
import { supabase } from '@/lib/supabaseClient'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: jest.fn()
    }
  }
}))

describe('AuthCallback', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
  })

  it('should handle successful callback', async () => {
    ;(supabase.auth.getSession as jest.Mock).mockResolvedValueOnce({
      data: { session: { user: { id: 'test' } } },
      error: null
    })

    render(<AuthCallback />)
    
    expect(screen.getByText(/Completing sign in/i)).toBeInTheDocument()
    
    // Wait for navigation
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(mockPush).toHaveBeenCalledWith('/')
  })

  it('should handle callback errors', async () => {
    ;(supabase.auth.getSession as jest.Mock).mockResolvedValueOnce({
      data: { session: null },
      error: new Error('Auth error')
    })

    render(<AuthCallback />)
    
    // Wait for navigation
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(mockPush).toHaveBeenCalledWith('/auth/signin?error=callback-failed')
  })
})
```