import { renderHook, act } from '@testing-library/react-hooks'
import { useAuth } from '@/lib/hooks/use-auth'
import { supabase } from '@/lib/supabaseClient'

jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } }
      })),
      signOut: jest.fn()
    }
  }
}))

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('should initialize auth state correctly', async () => {
    const mockUser = { id: 'test-user', email: 'test@example.com' }
    ;(supabase.auth.getSession as jest.Mock).mockResolvedValueOnce({
      data: { session: { user: mockUser } },
      error: null
    })

    const { result, waitForNextUpdate } = renderHook(() => useAuth())
    
    expect(result.current.loading).toBe(true)
    await waitForNextUpdate()
    
    expect(result.current.loading).toBe(false)
    expect(result.current.user).toEqual(mockUser)
  })

  it('should handle auth errors gracefully', async () => {
    const mockError = new Error('Auth error')
    ;(supabase.auth.getSession as jest.Mock).mockRejectedValueOnce(mockError)

    const { result, waitForNextUpdate } = renderHook(() => useAuth())
    
    await waitForNextUpdate()
    
    expect(result.current.loading).toBe(false)
    expect(result.current.user).toBeNull()
  })

  it('should handle sign out', async () => {
    ;(supabase.auth.getSession as jest.Mock).mockResolvedValueOnce({
      data: { session: null },
      error: null
    })

    const { result, waitForNextUpdate } = renderHook(() => useAuth())
    
    await waitForNextUpdate()
    
    await act(async () => {
      await result.current.signOut()
    })
    
    expect(supabase.auth.signOut).toHaveBeenCalled()
    expect(result.current.user).toBeNull()
  })
})