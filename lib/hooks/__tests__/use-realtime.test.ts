import { renderHook } from '@testing-library/react'
import { useRealtime } from '../use-realtime'
import { supabase } from '@/lib/supabaseClient'

// Mock Supabase client
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    channel: jest.fn(() => ({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn()
    })),
    removeChannel: jest.fn()
  }
}))

describe('useRealtime', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should subscribe to real-time updates', () => {
    const onInsert = jest.fn()
    const onUpdate = jest.fn()
    const onDelete = jest.fn()

    renderHook(() => useRealtime({
      table: 'ideas',
      onInsert,
      onUpdate,
      onDelete
    }))

    expect(supabase.channel).toHaveBeenCalledWith('ideas-changes')
  })

  it('should clean up subscription on unmount', () => {
    const { unmount } = renderHook(() => useRealtime({
      table: 'ideas'
    }))

    unmount()

    expect(supabase.removeChannel).toHaveBeenCalled()
  })
})