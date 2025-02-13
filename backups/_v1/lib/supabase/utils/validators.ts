import { z } from 'zod'

export const profileSchema = z.object({
  username: z.string().min(3).max(50),
  full_name: z.string().min(2).max(100),
  website: z.string().url().nullable(),
  bio: z.string().max(500).nullable(),
  avatar_url: z.string().url().nullable(),
})

export const ideaSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10),
  status: z.enum(['draft', 'in_progress', 'completed']),
})

export type ProfileFormData = z.infer<typeof profileSchema>
export type IdeaFormData = z.infer<typeof ideaSchema>