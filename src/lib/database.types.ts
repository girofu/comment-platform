export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      coach_claim_verifications: {
        Row: {
          coach_profile_id: string
          created_at: string | null
          expires_at: string
          id: string
          ig_handle: string
          status: Database["public"]["Enums"]["claim_status"] | null
          user_id: string
          verification_code: string
          verified_at: string | null
        }
        Insert: {
          coach_profile_id: string
          created_at?: string | null
          expires_at: string
          id?: string
          ig_handle: string
          status?: Database["public"]["Enums"]["claim_status"] | null
          user_id: string
          verification_code: string
          verified_at?: string | null
        }
        Update: {
          coach_profile_id?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          ig_handle?: string
          status?: Database["public"]["Enums"]["claim_status"] | null
          user_id?: string
          verification_code?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coach_claim_verifications_coach_profile_id_fkey"
            columns: ["coach_profile_id"]
            isOneToOne: false
            referencedRelation: "coach_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coach_claim_verifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          claim_status: Database["public"]["Enums"]["claim_status"] | null
          claim_verified_at: string | null
          claimed_by: string | null
          created_at: string | null
          display_name: string
          id: string
          ig_handle: string | null
          is_claimed: boolean | null
          is_pro: boolean | null
          locations: string[] | null
          pro_expires_at: string | null
          rating_overall: number | null
          rating_recent: number | null
          review_count: number | null
          review_count_recent: number | null
          slug: string
          specialties: string[] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          claim_status?: Database["public"]["Enums"]["claim_status"] | null
          claim_verified_at?: string | null
          claimed_by?: string | null
          created_at?: string | null
          display_name: string
          id?: string
          ig_handle?: string | null
          is_claimed?: boolean | null
          is_pro?: boolean | null
          locations?: string[] | null
          pro_expires_at?: string | null
          rating_overall?: number | null
          rating_recent?: number | null
          review_count?: number | null
          review_count_recent?: number | null
          slug: string
          specialties?: string[] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          claim_status?: Database["public"]["Enums"]["claim_status"] | null
          claim_verified_at?: string | null
          claimed_by?: string | null
          created_at?: string | null
          display_name?: string
          id?: string
          ig_handle?: string | null
          is_claimed?: boolean | null
          is_pro?: boolean | null
          locations?: string[] | null
          pro_expires_at?: string | null
          rating_overall?: number | null
          rating_recent?: number | null
          review_count?: number | null
          review_count_recent?: number | null
          slug?: string
          specialties?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coach_profiles_claimed_by_fkey"
            columns: ["claimed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          coach_official_reply: string | null
          coach_profile_id: string
          coach_replied_at: string | null
          comment: string | null
          created_at: string | null
          id: string
          is_anonymous: boolean | null
          is_pinned_by_coach: boolean | null
          proof_expires_at: string | null
          proof_photo_hash: string | null
          proof_photo_path: string | null
          score_communication: number | null
          score_emotional: number | null
          score_overall: number | null
          score_professional: number | null
          status: Database["public"]["Enums"]["review_status"] | null
          student_id: string
          trust_weight: number | null
          updated_at: string | null
        }
        Insert: {
          coach_official_reply?: string | null
          coach_profile_id: string
          coach_replied_at?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_pinned_by_coach?: boolean | null
          proof_expires_at?: string | null
          proof_photo_hash?: string | null
          proof_photo_path?: string | null
          score_communication?: number | null
          score_emotional?: number | null
          score_overall?: number | null
          score_professional?: number | null
          status?: Database["public"]["Enums"]["review_status"] | null
          student_id: string
          trust_weight?: number | null
          updated_at?: string | null
        }
        Update: {
          coach_official_reply?: string | null
          coach_profile_id?: string
          coach_replied_at?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_pinned_by_coach?: boolean | null
          proof_expires_at?: string | null
          proof_photo_hash?: string | null
          proof_photo_path?: string | null
          score_communication?: number | null
          score_emotional?: number | null
          score_overall?: number | null
          score_professional?: number | null
          status?: Database["public"]["Enums"]["review_status"] | null
          student_id?: string
          trust_weight?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_coach_profile_id_fkey"
            columns: ["coach_profile_id"]
            isOneToOne: false
            referencedRelation: "coach_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          auth_id: string
          avatar_url: string | null
          created_at: string | null
          device_fingerprint: string | null
          display_name: string | null
          email: string
          id: string
          is_shadowbanned: boolean | null
          phone_number: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          trust_score: number | null
          updated_at: string | null
        }
        Insert: {
          auth_id: string
          avatar_url?: string | null
          created_at?: string | null
          device_fingerprint?: string | null
          display_name?: string | null
          email: string
          id?: string
          is_shadowbanned?: boolean | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          trust_score?: number | null
          updated_at?: string | null
        }
        Update: {
          auth_id?: string
          avatar_url?: string | null
          created_at?: string | null
          device_fingerprint?: string | null
          display_name?: string | null
          email?: string
          id?: string
          is_shadowbanned?: boolean | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          trust_score?: number | null
          updated_at?: string | null
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
      claim_status: "PENDING" | "VERIFIED" | "REJECTED"
      review_status:
        | "INCOMPLETE"
        | "PENDING_OCR"
        | "PENDING_ADMIN"
        | "PENDING_COACH"
        | "PUBLISHED"
        | "DISPUTED"
        | "HIDDEN"
      user_role: "STUDENT" | "COACH" | "ADMIN"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      claim_status: ["PENDING", "VERIFIED", "REJECTED"],
      review_status: [
        "INCOMPLETE",
        "PENDING_OCR",
        "PENDING_ADMIN",
        "PENDING_COACH",
        "PUBLISHED",
        "DISPUTED",
        "HIDDEN",
      ],
      user_role: ["STUDENT", "COACH", "ADMIN"],
    },
  },
} as const

