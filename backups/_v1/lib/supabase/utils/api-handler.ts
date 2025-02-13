import { NextResponse } from 'next/server'
import { handleSupabaseError } from './error-handler'

type ApiHandler = (req: Request) => Promise<Response>

export function withErrorHandler(handler: ApiHandler) {
  return async (req: Request) => {
    try {
      return await handler(req)
    } catch (error) {
      const supabaseError = handleSupabaseError(error)
      return NextResponse.json(
        { error: supabaseError.message },
        { status: 500 }
      )
    }
  }
}