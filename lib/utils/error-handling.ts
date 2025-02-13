import { toast } from "sonner"

export function handleError(error: unknown, customMessage?: string) {
  console.error(error)
  toast.error(customMessage || "An unexpected error occurred")
}

export function handleSuccess(message: string) {
  toast.success(message)
}

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message)
    this.name = "AppError"
  }
}