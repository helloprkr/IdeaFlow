import { renderHook, act } from '@testing-library/react'
import { useAnalyticsRealtime } from '../use-analytics-realtime'
import { supabase } from '@/lib/supabaseClient'

// Mock Supabase client
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockResolvedValue({
        data: [
          { id: 1, status: 'draft', user_id: 'user1' },
          { id: 2, status: 'in_progress', user_id: 'user2' },
          { id: 3, status: 'completed', user_id: 'user1' }
        ]
      })
    })),
    channel: jest.fn(() => ({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn()
    })),
    removeChannel: jest.fn()
  }
}))

describe('useAnalyticsRealtime', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch initial data', async () => {
    const { result } = renderHook(() => useAnalyticsRealtime())

    // Wait for initial data fetch
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.data).toBeTruthy()
    expect(result.current.data?.totalIdeas).toBe(3)
    expect(result.current.data?.inProgressIdeas).toBe(1)
    expect(result.current.data?.completedIdeas).toBe(1)
  })

  it('should update data on real-time events', async () => {
    const { result } = renderHook(() => useAnalyticsRealtime())

    // Wait for initial data fetch
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    // Simulate real-time insert
    act(() => {
      const channel = supabase.channel('ideas-changes')
      const onHandler = channel.on.mock.calls[0][2]
      onHandler({
        eventType: 'INSERT',
        new: { id: 4, status: 'draft', user_id: 'user3' }
      })
    })

    expect(result.current.data?.totalIdeas).toBe(4)
  })

  it('should handle errors gracefully', async () => {
    const mockError = new Error('Database error')
    jest.spyOn(supabase, 'from').mockImplementationOnce(() => {
      throw mockError
    })

    const { result } = renderHook(() => useAnalyticsRealtime())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.data).toBeNull()
  })
})