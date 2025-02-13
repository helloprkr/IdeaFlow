```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorBoundary } from '@/components/error-boundary'

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('should render error UI when there is an error', () => {
    const ThrowError = () => {
      throw new Error('Test error')
    }

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )
    
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument()
    expect(screen.getByText(/Test error/i)).toBeInTheDocument()
  })

  it('should call onError when provided', () => {
    const onError = jest.fn()
    const error = new Error('Test error')
    
    const ThrowError = () => {
      throw error
    }

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError />
      </ErrorBoundary>
    )
    
    expect(onError).toHaveBeenCalledWith(error)
  })

  it('should allow retry', () => {
    const error = new Error('Test error')
    
    const ThrowError = () => {
      throw error
    }

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )
    
    // Mock window.location.reload
    const { reload } = window.location
    Object.defineProperty(window.location, 'reload', {
      value: jest.fn()
    })

    fireEvent.click(screen.getByText(/Try again/i))
    
    expect(window.location.reload).toHaveBeenCalled()
    
    // Restore original reload
    Object.defineProperty(window.location, 'reload', {
      value: reload
    })
  })
})
```