import type { Database } from '@/types/supabase'

export type Tables = Database['public']['Tables']
export type Idea = Tables['ideas']['Row']
export type NewIdea = Tables['ideas']['Insert']
export type IdeaUpdate = Tables['ideas']['Update']
export type Profile = Tables['profiles']['Row']
export type NewProfile = Tables['profiles']['Insert']
export type ProfileUpdate = Tables['profiles']['Update']

export type SupabaseResponse<T> = Promise<{
  data: T | null
  error: Error | null
}>