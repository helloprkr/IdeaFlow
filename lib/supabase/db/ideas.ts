import { supabase } from '../config'
import { Database } from '@/types/supabase'

type Idea = Database['public']['Tables']['ideas']['Row']
type NewIdea = Database['public']['Tables']['ideas']['Insert']

export async function getIdeas() {
  const { data, error } = await supabase
    .from('ideas')
    .select('*')
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export async function getIdeaById(id: string) {
  const { data, error } = await supabase
    .from('ideas')
    .select('*')
    .eq('id', id)
    .single()
  
  return { data, error }
}

export async function createIdea(idea: NewIdea) {
  const { data, error } = await supabase
    .from('ideas')
    .insert(idea)
    .select()
    .single()
  
  return { data, error }
}

export async function updateIdea(id: string, updates: Partial<Idea>) {
  const { data, error } = await supabase
    .from('ideas')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  return { data, error }
}

export async function deleteIdea(id: string) {
  const { error } = await supabase
    .from('ideas')
    .delete()
    .eq('id', id)
  
  return { error }
}