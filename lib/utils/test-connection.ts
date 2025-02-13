import { supabase } from '@/lib/supabaseClient'

export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('ideas')
      .select('count')
      .single()

    if (error) {
      console.error('Connection test failed:', error)
      return false
    }

    console.log('Connection test successful')
    return true
  } catch (error) {
    console.error('Supabase connection error:', error)
    return false
  }
}