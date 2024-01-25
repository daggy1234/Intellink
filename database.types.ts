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
      Approvals: {
        Row: {
          approved: boolean | null
          created_at: string
          id: number
          note: string | null
          post_author: string | null
          post_id: string | null
          request_author: string | null
        }
        Insert: {
          approved?: boolean | null
          created_at?: string
          id?: number
          note?: string | null
          post_author?: string | null
          post_id?: string | null
          request_author?: string | null
        }
        Update: {
          approved?: boolean | null
          created_at?: string
          id?: number
          note?: string | null
          post_author?: string | null
          post_id?: string | null
          request_author?: string | null
        }
        Relationships: []
      }
      Labs: {
        Row: {
          bio: string | null
          created_at: string
          field: string | null
          id: number
          name: string | null
          url: string | null
          uuid: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          field?: string | null
          id?: number
          name?: string | null
          url?: string | null
          uuid?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          field?: string | null
          id?: number
          name?: string | null
          url?: string | null
          uuid?: string | null
        }
        Relationships: []
      }
      Post: {
        Row: {
          ask: string | null
          author_id: string | null
          created_at: string
          extended_description: string | null
          field: string | null
          id: number
          post_id: string | null
          request: string | null
          summary: string | null
          title: string | null
        }
        Insert: {
          ask?: string | null
          author_id?: string | null
          created_at?: string
          extended_description?: string | null
          field?: string | null
          id?: number
          post_id?: string | null
          request?: string | null
          summary?: string | null
          title?: string | null
        }
        Update: {
          ask?: string | null
          author_id?: string | null
          created_at?: string
          extended_description?: string | null
          field?: string | null
          id?: number
          post_id?: string | null
          request?: string | null
          summary?: string | null
          title?: string | null
        }
        Relationships: []
      }
      Users: {
        Row: {
          bio: string | null
          category: string | null
          created_at: string
          CV: string | null
          gender: string | null
          id: number
          interests: string | null
          lab_id: string
          links: string
          name: string | null
          position: string | null
          university: string | null
          user_id: string
        }
        Insert: {
          bio?: string | null
          category?: string | null
          created_at?: string
          CV?: string | null
          gender?: string | null
          id?: number
          interests?: string | null
          lab_id: string
          links: string
          name?: string | null
          position?: string | null
          university?: string | null
          user_id: string
        }
        Update: {
          bio?: string | null
          category?: string | null
          created_at?: string
          CV?: string | null
          gender?: string | null
          id?: number
          interests?: string | null
          lab_id?: string
          links?: string
          name?: string | null
          position?: string | null
          university?: string | null
          user_id?: string
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
