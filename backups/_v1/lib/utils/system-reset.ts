import { supabase } from '@/lib/supabaseClient'

export interface ResetStatus {
  success: boolean
  timestamp: string
  details: {
    ideas: boolean
    activities: boolean
    achievements: boolean
    metrics: boolean
  }
}

export async function resetSystem(): Promise<ResetStatus> {
  const timestamp = new Date().toISOString()
  const details = {
    ideas: false,
    activities: false,
    achievements: false,
    metrics: false
  }

  try {
    // Clear ideas table
    const { error: ideasError } = await supabase
      .from('ideas')
      .delete()
      .neq('id', 'placeholder') // Delete all rows

    if (ideasError) throw ideasError
    details.ideas = true

    // Clear idea versions
    const { error: versionsError } = await supabase
      .from('idea_versions')
      .delete()
      .neq('id', 'placeholder')

    if (versionsError) throw versionsError
    details.activities = true

    // Clear comments
    const { error: commentsError } = await supabase
      .from('idea_comments')
      .delete()
      .neq('id', 'placeholder')

    if (commentsError) throw commentsError
    details.achievements = true

    // Clear attachments
    const { error: attachmentsError } = await supabase
      .from('idea_attachments')
      .delete()
      .neq('id', 'placeholder')

    if (attachmentsError) throw attachmentsError
    details.metrics = true

    return {
      success: true,
      timestamp,
      details
    }
  } catch (error) {
    console.error('System reset failed:', error)
    return {
      success: false,
      timestamp,
      details
    }
  }
}