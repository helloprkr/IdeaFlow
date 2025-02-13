import { renderHook, act } from "@testing-library/react"
import { useIdeas } from "../use-ideas"
import { supabase } from "@/lib/supabaseClient"

// Mock useAuth hook
jest.mock("../use-auth", () => ({
  useAuth: () => ({
    user: { id: "test-user" },
    loading: false,
  }),
}))

// Mock Supabase client
jest.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: {
          id: "test-idea",
          title: "Test Idea",
          description: "Test Description",
          status: "draft",
          user_id: "test-user",
        },
      }),
    })),
    channel: jest.fn(() => ({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn(),
    })),
  },
}))

describe("useIdeas", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should create an idea", async () => {
    const { result } = renderHook(() => useIdeas())

    await act(async () => {
      const { data, error } = await result.current.createIdea({
        title: "Test Idea",
        description: "Test Description",
      })

      expect(error).toBeNull()
      expect(data).toEqual({
        id: "test-idea",
        title: "Test Idea",
        description: "Test Description",
        status: "draft",
        user_id: "test-user",
      })
    })
  })

  it("should update an idea", async () => {
    const { result } = renderHook(() => useIdeas())

    await act(async () => {
      const { data, error } = await result.current.updateIdea("test-idea", {
        title: "Updated Title",
      })

      expect(error).toBeNull()
      expect(data).toBeTruthy()
    })
  })

  it("should handle real-time updates", async () => {
    const { result } = renderHook(() => useIdeas())
    
    await act(async () => {
      const channel = supabase.channel('ideas-changes')
      const onHandler = channel.on.mock.calls[0][2]
      onHandler({
        eventType: 'INSERT',
        new: {
          id: 'new-idea',
          title: 'New Idea',
          description: 'New Description',
          status: 'draft',
          user_id: 'test-user'
        }
      })
    })

    expect(result.current.ideas).toHaveLength(1)
  })

  it("should handle errors gracefully", async () => {
    const mockError = new Error("Database error")
    jest.spyOn(supabase, 'from').mockImplementationOnce(() => {
      throw mockError
    })

    const { result } = renderHook(() => useIdeas())

    await act(async () => {
      const { error } = await result.current.createIdea({
        title: "Test Idea",
        description: "Test Description",
      })

      expect(error).toBeTruthy()
    })
  })
})