import { render, screen, fireEvent } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import NewIdea from '@/app/ideas/new/page'
import { useIdeas } from '@/lib/hooks/use-ideas'

// Mock the hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

jest.mock('@/lib/hooks/use-ideas', () => ({
  useIdeas: jest.fn()
}))

describe('NewIdea', () => {
  const mockPush = jest.fn()
  const mockCreateIdea = jest.fn()

  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
    ;(useIdeas as jest.Mock).mockReturnValue({ createIdea: mockCreateIdea })
  })

  it('should create a new idea and redirect', async () => {
    mockCreateIdea.mockResolvedValueOnce({ error: null })

    render(<NewIdea />)

    // Fill out the form
    fireEvent.change(screen.getByTestId('idea-title-input'), {
      target: { value: 'Test Idea' }
    })
    fireEvent.change(screen.getByTestId('idea-description-input'), {
      target: { value: 'Test Description' }
    })

    // Submit the form
    fireEvent.click(screen.getByTestId('submit-button'))

    // Verify createIdea was called
    expect(mockCreateIdea).toHaveBeenCalledWith({
      title: 'Test Idea',
      description: 'Test Description'
    })

    // Verify redirect
    expect(mockPush).toHaveBeenCalledWith('/')
  })

  it('should handle errors', async () => {
    mockCreateIdea.mockResolvedValueOnce({ error: new Error('Failed to create') })

    render(<NewIdea />)

    fireEvent.change(screen.getByTestId('idea-title-input'), {
      target: { value: 'Test Idea' }
    })
    fireEvent.change(screen.getByTestId('idea-description-input'), {
      target: { value: 'Test Description' }
    })

    fireEvent.click(screen.getByTestId('submit-button'))

    // Verify we stay on the page
    expect(mockPush).not.toHaveBeenCalled()
  })
})