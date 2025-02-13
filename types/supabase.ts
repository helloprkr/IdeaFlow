export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      ideas: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          status: 'draft' | 'in_progress' | 'completed'
          user_id: string
          category: string | null
          priority: 'low' | 'medium' | 'high' | null
          expected_impact: string | null
          required_resources: string | null
          timeline: Json | null
          department: string | null
          last_status_change: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          status?: 'draft' | 'in_progress' | 'completed'
          user_id: string
          category?: string | null
          priority?: 'low' | 'medium' | 'high' | null
          expected_impact?: string | null
          required_resources?: string | null
          timeline?: Json | null
          department?: string | null
          last_status_change?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          status?: 'draft' | 'in_progress' | 'completed'
          user_id?: string
          category?: string | null
          priority?: 'low' | 'medium' | 'high' | null
          expected_impact?: string | null
          required_resources?: string | null
          timeline?: Json | null
          department?: string | null
          last_status_change?: string | null
        }
      }
      idea_versions: {
        Row: {
          id: string
          idea_id: string
          title: string
          description: string
          changes: Json
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          idea_id: string
          title: string
          description: string
          changes: Json
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          idea_id?: string
          title?: string
          description?: string
          changes?: Json
          created_at?: string
          created_by?: string
        }
      }
      idea_comments: {
        Row: {
          id: string
          idea_id: string
          user_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          idea_id: string
          user_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          idea_id?: string
          user_id?: string
          content?: string
          created_at?: string
        }
      }
      idea_attachments: {
        Row: {
          id: string
          idea_id: string
          name: string
          file_path: string
          file_type: string
          size: number
          uploaded_by: string
          uploaded_at: string
        }
        Insert: {
          id?: string
          idea_id: string
          name: string
          file_path: string
          file_type: string
          size: number
          uploaded_by: string
          uploaded_at?: string
        }
        Update: {
          id?: string
          idea_id?: string
          name?: string
          file_path?: string
          file_type?: string
          size?: number
          uploaded_by?: string
          uploaded_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}