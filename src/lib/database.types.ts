// 此檔案由 Supabase CLI 自動生成
// 執行 `pnpm db:gen-types` 更新
// 在本地 Supabase 啟動前，使用以下手動定義

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          auth_id: string;
          email: string;
          display_name: string | null;
          avatar_url: string | null;
          phone_number: string | null;
          role: "STUDENT" | "COACH" | "ADMIN";
          trust_score: number;
          device_fingerprint: string | null;
          is_shadowbanned: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          auth_id: string;
          email: string;
          display_name?: string | null;
          avatar_url?: string | null;
          phone_number?: string | null;
          role?: "STUDENT" | "COACH" | "ADMIN";
          trust_score?: number;
          device_fingerprint?: string | null;
          is_shadowbanned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          auth_id?: string;
          email?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          phone_number?: string | null;
          role?: "STUDENT" | "COACH" | "ADMIN";
          trust_score?: number;
          device_fingerprint?: string | null;
          is_shadowbanned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      coach_profiles: {
        Row: {
          id: string;
          slug: string;
          display_name: string;
          bio: string | null;
          avatar_url: string | null;
          specialties: string[];
          locations: string[];
          ig_handle: string | null;
          is_claimed: boolean;
          claimed_by: string | null;
          claim_status: "PENDING" | "VERIFIED" | "REJECTED" | null;
          claim_verified_at: string | null;
          is_pro: boolean;
          pro_expires_at: string | null;
          rating_overall: number;
          rating_recent: number;
          review_count: number;
          review_count_recent: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          display_name: string;
          bio?: string | null;
          avatar_url?: string | null;
          specialties?: string[];
          locations?: string[];
          ig_handle?: string | null;
          is_claimed?: boolean;
          claimed_by?: string | null;
          claim_status?: "PENDING" | "VERIFIED" | "REJECTED" | null;
          claim_verified_at?: string | null;
          is_pro?: boolean;
          pro_expires_at?: string | null;
          rating_overall?: number;
          rating_recent?: number;
          review_count?: number;
          review_count_recent?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          display_name?: string;
          bio?: string | null;
          avatar_url?: string | null;
          specialties?: string[];
          locations?: string[];
          ig_handle?: string | null;
          is_claimed?: boolean;
          claimed_by?: string | null;
          claim_status?: "PENDING" | "VERIFIED" | "REJECTED" | null;
          claim_verified_at?: string | null;
          is_pro?: boolean;
          pro_expires_at?: string | null;
          rating_overall?: number;
          rating_recent?: number;
          review_count?: number;
          review_count_recent?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          student_id: string;
          coach_profile_id: string;
          status:
            | "INCOMPLETE"
            | "PENDING_OCR"
            | "PENDING_ADMIN"
            | "PENDING_COACH"
            | "PUBLISHED"
            | "DISPUTED"
            | "HIDDEN";
          score_overall: number | null;
          score_professional: number | null;
          score_emotional: number | null;
          score_communication: number | null;
          comment: string | null;
          proof_photo_path: string | null;
          proof_photo_hash: string | null;
          proof_expires_at: string | null;
          is_anonymous: boolean;
          coach_official_reply: string | null;
          coach_replied_at: string | null;
          is_pinned_by_coach: boolean;
          trust_weight: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          coach_profile_id: string;
          status?:
            | "INCOMPLETE"
            | "PENDING_OCR"
            | "PENDING_ADMIN"
            | "PENDING_COACH"
            | "PUBLISHED"
            | "DISPUTED"
            | "HIDDEN";
          score_overall?: number | null;
          score_professional?: number | null;
          score_emotional?: number | null;
          score_communication?: number | null;
          comment?: string | null;
          proof_photo_path?: string | null;
          proof_photo_hash?: string | null;
          proof_expires_at?: string | null;
          is_anonymous?: boolean;
          coach_official_reply?: string | null;
          coach_replied_at?: string | null;
          is_pinned_by_coach?: boolean;
          trust_weight?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          coach_profile_id?: string;
          status?:
            | "INCOMPLETE"
            | "PENDING_OCR"
            | "PENDING_ADMIN"
            | "PENDING_COACH"
            | "PUBLISHED"
            | "DISPUTED"
            | "HIDDEN";
          score_overall?: number | null;
          score_professional?: number | null;
          score_emotional?: number | null;
          score_communication?: number | null;
          comment?: string | null;
          proof_photo_path?: string | null;
          proof_photo_hash?: string | null;
          proof_expires_at?: string | null;
          is_anonymous?: boolean;
          coach_official_reply?: string | null;
          coach_replied_at?: string | null;
          is_pinned_by_coach?: boolean;
          trust_weight?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      coach_claim_verifications: {
        Row: {
          id: string;
          coach_profile_id: string;
          user_id: string;
          verification_code: string;
          ig_handle: string;
          status: "PENDING" | "VERIFIED" | "REJECTED";
          verified_at: string | null;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          coach_profile_id: string;
          user_id: string;
          verification_code: string;
          ig_handle: string;
          status?: "PENDING" | "VERIFIED" | "REJECTED";
          verified_at?: string | null;
          expires_at: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          coach_profile_id?: string;
          user_id?: string;
          verification_code?: string;
          ig_handle?: string;
          status?: "PENDING" | "VERIFIED" | "REJECTED";
          verified_at?: string | null;
          expires_at?: string;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: "STUDENT" | "COACH" | "ADMIN";
      review_status:
        | "INCOMPLETE"
        | "PENDING_OCR"
        | "PENDING_ADMIN"
        | "PENDING_COACH"
        | "PUBLISHED"
        | "DISPUTED"
        | "HIDDEN";
      claim_status: "PENDING" | "VERIFIED" | "REJECTED";
    };
  };
};
