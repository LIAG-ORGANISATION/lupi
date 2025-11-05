export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      conversations: {
        Row: {
          created_at: string
          dog_id: string | null
          id: string
          last_message_at: string | null
          owner_id: string
          professional_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dog_id?: string | null
          id?: string
          last_message_at?: string | null
          owner_id: string
          professional_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dog_id?: string | null
          id?: string
          last_message_at?: string | null
          owner_id?: string
          professional_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "patients_for_pro"
            referencedColumns: ["id"]
          },
        ]
      }
      dog_calendar_events: {
        Row: {
          created_at: string | null
          description: string | null
          dog_id: string
          event_date: string
          event_time: string | null
          event_type: string
          id: string
          owner_id: string
          professional_id: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          dog_id: string
          event_date: string
          event_time?: string | null
          event_type: string
          id?: string
          owner_id: string
          professional_id?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          dog_id?: string
          event_date?: string
          event_time?: string | null
          event_type?: string
          id?: string
          owner_id?: string
          professional_id?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dog_calendar_events_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dog_calendar_events_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "patients_for_pro"
            referencedColumns: ["id"]
          },
        ]
      }
      dog_documents: {
        Row: {
          category: string | null
          created_at: string
          dog_id: string
          file_name: string
          file_size: number | null
          file_type: string
          id: string
          owner_id: string
          professional_type: string | null
          storage_path: string
          title: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          dog_id: string
          file_name: string
          file_size?: number | null
          file_type: string
          id?: string
          owner_id: string
          professional_type?: string | null
          storage_path: string
          title?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          dog_id?: string
          file_name?: string
          file_size?: number | null
          file_type?: string
          id?: string
          owner_id?: string
          professional_type?: string | null
          storage_path?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dog_documents_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dog_documents_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "patients_for_pro"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dog_documents_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["user_id"]
          },
        ]
      }
      dog_health_alerts: {
        Row: {
          alert_date: string
          created_at: string
          description: string
          dog_id: string
          id: string
          owner_id: string
          symptoms: string | null
          updated_at: string
        }
        Insert: {
          alert_date: string
          created_at?: string
          description: string
          dog_id: string
          id?: string
          owner_id: string
          symptoms?: string | null
          updated_at?: string
        }
        Update: {
          alert_date?: string
          created_at?: string
          description?: string
          dog_id?: string
          id?: string
          owner_id?: string
          symptoms?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dog_health_alerts_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dog_health_alerts_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "patients_for_pro"
            referencedColumns: ["id"]
          },
        ]
      }
      dog_medications: {
        Row: {
          active: boolean
          created_at: string
          dog_id: string
          dosage_detail: string
          duration_days: number | null
          end_date: string | null
          frequency: string
          id: string
          medication_name: string
          notes: string | null
          owner_id: string
          start_date: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          dog_id: string
          dosage_detail: string
          duration_days?: number | null
          end_date?: string | null
          frequency: string
          id?: string
          medication_name: string
          notes?: string | null
          owner_id: string
          start_date: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          dog_id?: string
          dosage_detail?: string
          duration_days?: number | null
          end_date?: string | null
          frequency?: string
          id?: string
          medication_name?: string
          notes?: string | null
          owner_id?: string
          start_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      dog_professional_access: {
        Row: {
          created_at: string
          dog_id: string
          granted_at: string | null
          id: string
          professional_id: string
          requested_at: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dog_id: string
          granted_at?: string | null
          id?: string
          professional_id: string
          requested_at?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dog_id?: string
          granted_at?: string | null
          id?: string
          professional_id?: string
          requested_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dog_professional_access_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dog_professional_access_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "patients_for_pro"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dog_professional_access_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["user_id"]
          },
        ]
      }
      dog_questionnaires: {
        Row: {
          completed_at: string
          created_at: string
          dog_id: string
          id: string
          owner_id: string
          questionnaire_data: Json
          updated_at: string
        }
        Insert: {
          completed_at?: string
          created_at?: string
          dog_id: string
          id?: string
          owner_id: string
          questionnaire_data: Json
          updated_at?: string
        }
        Update: {
          completed_at?: string
          created_at?: string
          dog_id?: string
          id?: string
          owner_id?: string
          questionnaire_data?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dog_questionnaires_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dog_questionnaires_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "patients_for_pro"
            referencedColumns: ["id"]
          },
        ]
      }
      dog_shares: {
        Row: {
          created_at: string | null
          dog_id: string
          expires_at: string | null
          id: string
          permission: Database["public"]["Enums"]["share_permission"]
          professional_id: string
          status: Database["public"]["Enums"]["share_status"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dog_id: string
          expires_at?: string | null
          id?: string
          permission?: Database["public"]["Enums"]["share_permission"]
          professional_id: string
          status?: Database["public"]["Enums"]["share_status"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dog_id?: string
          expires_at?: string | null
          id?: string
          permission?: Database["public"]["Enums"]["share_permission"]
          professional_id?: string
          status?: Database["public"]["Enums"]["share_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dog_shares_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dog_shares_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "patients_for_pro"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dog_shares_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["user_id"]
          },
        ]
      }
      dog_vaccinations: {
        Row: {
          created_at: string
          dog_id: string
          id: string
          owner_id: string
          reminders: string[] | null
          updated_at: string
          vaccination_date: string
          vaccine_name: string
        }
        Insert: {
          created_at?: string
          dog_id: string
          id?: string
          owner_id: string
          reminders?: string[] | null
          updated_at?: string
          vaccination_date: string
          vaccine_name: string
        }
        Update: {
          created_at?: string
          dog_id?: string
          id?: string
          owner_id?: string
          reminders?: string[] | null
          updated_at?: string
          vaccination_date?: string
          vaccine_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "dog_vaccinations_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dog_vaccinations_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "patients_for_pro"
            referencedColumns: ["id"]
          },
        ]
      }
      dogs: {
        Row: {
          avatar_url: string | null
          birth_date: string | null
          breed: string | null
          created_at: string
          gender: string | null
          id: string
          medical_notes: string | null
          name: string
          owner_id: string
          updated_at: string
          weight: number | null
        }
        Insert: {
          avatar_url?: string | null
          birth_date?: string | null
          breed?: string | null
          created_at?: string
          gender?: string | null
          id?: string
          medical_notes?: string | null
          name: string
          owner_id: string
          updated_at?: string
          weight?: number | null
        }
        Update: {
          avatar_url?: string | null
          birth_date?: string | null
          breed?: string | null
          created_at?: string
          gender?: string | null
          id?: string
          medical_notes?: string | null
          name?: string
          owner_id?: string
          updated_at?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "dogs_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["user_id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          read: boolean
          sender_id: string
          sender_type: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          read?: boolean
          sender_id: string
          sender_type: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          read?: boolean
          sender_id?: string
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      owners: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profession_specialisation: {
        Row: {
          created_at: string | null
          id: string
          profession_id: string
          specialisation_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          profession_id: string
          specialisation_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          profession_id?: string
          specialisation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profession_specialisation_profession_id_fkey"
            columns: ["profession_id"]
            isOneToOne: false
            referencedRelation: "professions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profession_specialisation_specialisation_id_fkey"
            columns: ["specialisation_id"]
            isOneToOne: false
            referencedRelation: "specialisations"
            referencedColumns: ["id"]
          },
        ]
      }
      professionals: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string
          full_name: string
          localisation: string | null
          phone: string | null
          photo_url: string | null
          preferences_contact: string[] | null
          profession: string
          profession_id: string | null
          specialisations_ids: string[] | null
          tarifs: string | null
          updated_at: string
          user_id: string
          website: string | null
          zone: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email: string
          full_name: string
          localisation?: string | null
          phone?: string | null
          photo_url?: string | null
          preferences_contact?: string[] | null
          profession: string
          profession_id?: string | null
          specialisations_ids?: string[] | null
          tarifs?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
          zone: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          full_name?: string
          localisation?: string | null
          phone?: string | null
          photo_url?: string | null
          preferences_contact?: string[] | null
          profession?: string
          profession_id?: string | null
          specialisations_ids?: string[] | null
          tarifs?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
          zone?: string
        }
        Relationships: [
          {
            foreignKeyName: "professional_profiles_profession_id_fkey"
            columns: ["profession_id"]
            isOneToOne: false
            referencedRelation: "professions"
            referencedColumns: ["id"]
          },
        ]
      }
      professions: {
        Row: {
          created_at: string | null
          id: string
          label: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          label: string
        }
        Update: {
          created_at?: string | null
          id?: string
          label?: string
        }
        Relationships: []
      }
      seasonal_alerts: {
        Row: {
          active: boolean
          alert_type: string
          content: string
          created_at: string
          end_month: number | null
          icon: string
          id: string
          severity: string
          start_month: number | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          alert_type: string
          content: string
          created_at?: string
          end_month?: number | null
          icon?: string
          id?: string
          severity?: string
          start_month?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          alert_type?: string
          content?: string
          created_at?: string
          end_month?: number | null
          icon?: string
          id?: string
          severity?: string
          start_month?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      specialisations: {
        Row: {
          created_at: string | null
          id: string
          label: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          label: string
        }
        Update: {
          created_at?: string | null
          id?: string
          label?: string
        }
        Relationships: []
      }
    }
    Views: {
      patients_for_pro: {
        Row: {
          avatar_url: string | null
          birth_date: string | null
          breed: string | null
          created_at: string | null
          gender: string | null
          id: string | null
          medical_notes: string | null
          name: string | null
          owner_id: string | null
          updated_at: string | null
          weight: number | null
        }
        Relationships: [
          {
            foreignKeyName: "dogs_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Functions: {
      professional_has_dog_access: {
        Args: { _dog_id: string; _professional_id: string }
        Returns: boolean
      }
    }
    Enums: {
      share_permission: "read" | "write_notes"
      share_status: "pending" | "accepted" | "revoked" | "expired"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      share_permission: ["read", "write_notes"],
      share_status: ["pending", "accepted", "revoked", "expired"],
    },
  },
} as const
