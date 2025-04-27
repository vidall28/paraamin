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
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          full_name: string | null
          avatar_url: string | null
          birthday: string | null
          relationship_date: string | null
          bio: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
          birthday?: string | null
          relationship_date?: string | null
          bio?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
          birthday?: string | null
          relationship_date?: string | null
          bio?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          created_at: string
          user_id: string
          content: string
          is_special: boolean
          read: boolean
          category: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          content: string
          is_special?: boolean
          read?: boolean
          category?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          content?: string
          is_special?: boolean
          read?: boolean
          category?: string | null
        }
      }
      relationship_milestones: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string | null
          date: string
          image_url: string | null
          importance: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description?: string | null
          date: string
          image_url?: string | null
          importance?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string | null
          date?: string
          image_url?: string | null
          importance?: number | null
        }
      }
      special_dates: {
        Row: {
          id: string
          created_at: string
          title: string
          date: string
          recurrence: string | null
          reminder_days: number | null
          description: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          date: string
          recurrence?: string | null
          reminder_days?: number | null
          description?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          date?: string
          recurrence?: string | null
          reminder_days?: number | null
          description?: string | null
        }
      }
      wishlist: {
        Row: {
          id: string
          created_at: string
          user_id: string
          item_name: string
          description: string | null
          link: string | null
          priority: number | null
          fulfilled: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          item_name: string
          description?: string | null
          link?: string | null
          priority?: number | null
          fulfilled?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          item_name?: string
          description?: string | null
          link?: string | null
          priority?: number | null
          fulfilled?: boolean
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
