import { renderHook, act } from '@testing-library/react'
import { useProfile } from '../use-profile'
import { supabase } from '@/lib/supabaseClient'

// Mock useAuth hook
jest.mock('../use-auth', () => ({
  useAuth: () => ({
    user: { id: 'test-user' },
    loading: false
  })
}))

// Mock Supabase client
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: {
          id: 'test-user',
          username: 'testuser',
          full_name: 'Test User',
          avatar_url: null,
          bio: null
        }
      })
    })),
    channel: jest.fn(() => ({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn()
    })),
    removeChannel: jest.fn()
  }
}))

describe('useProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch profile data', async () => {
    const { result } = renderHook(() => useProfile())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.profile).toEqual({
      id: 'test-user',
      username: 'testuser',
      full_name: 'Test User',
      avatar_url: null,
      bio: null
    })
  })

  it('should update profile', async () => {
    const { result } = renderHook(() => useProfile())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    const updates = { username: 'newusername' }
    await act(async () => {
      await result.current.updateProfile(updates)
    })

    expect(supabase.from).toHaveBeenCalledWith('profiles')
  })
})