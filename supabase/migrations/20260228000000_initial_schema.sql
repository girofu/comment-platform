-- 達達運動 教練評估平台 - 初始資料庫 Schema
-- 根據 PRD.md 定義

-- ============================================================
-- Enums
-- ============================================================

CREATE TYPE user_role AS ENUM ('STUDENT', 'COACH', 'ADMIN');

CREATE TYPE review_status AS ENUM (
    'INCOMPLETE',       -- 對話表單進行中/尚未上傳證明
    'PENDING_OCR',      -- AI 輔助辨識中
    'PENDING_ADMIN',    -- AI 辨識失敗，等待人工審核
    'PENDING_COACH',    -- 雙盲等待教練確認
    'PUBLISHED',        -- 正式公開
    'DISPUTED',         -- 客觀違規申訴中
    'HIDDEN'            -- 法律下架或影子封鎖
);

CREATE TYPE claim_status AS ENUM (
    'PENDING',          -- 等待驗證
    'VERIFIED',         -- 已驗證
    'REJECTED'          -- 驗證失敗
);

-- ============================================================
-- Users
-- ============================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(100),
    avatar_url TEXT,
    phone_number VARCHAR(50) UNIQUE,
    role user_role DEFAULT 'STUDENT',
    trust_score INT DEFAULT 0 CHECK (trust_score >= 0),
    device_fingerprint VARCHAR(255),
    is_shadowbanned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Coach Profiles
-- ============================================================

CREATE TABLE coach_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    specialties TEXT[] DEFAULT '{}',
    locations TEXT[] DEFAULT '{}',
    ig_handle VARCHAR(100),
    is_claimed BOOLEAN DEFAULT FALSE,
    claimed_by UUID REFERENCES users(id),
    claim_status claim_status,
    claim_verified_at TIMESTAMPTZ,
    is_pro BOOLEAN DEFAULT FALSE,
    pro_expires_at TIMESTAMPTZ,
    -- 雙軌制評分 (由 trigger 或 application 計算更新)
    rating_overall NUMERIC(3, 2) DEFAULT 0,
    rating_recent NUMERIC(3, 2) DEFAULT 0,
    review_count INT DEFAULT 0,
    review_count_recent INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Reviews
-- ============================================================

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES users(id),
    coach_profile_id UUID NOT NULL REFERENCES coach_profiles(id),
    status review_status DEFAULT 'INCOMPLETE',

    -- 結構化評分 (0-5)
    score_overall INT CHECK (score_overall BETWEEN 0 AND 5),
    score_professional INT CHECK (score_professional BETWEEN 0 AND 5),
    score_emotional INT CHECK (score_emotional BETWEEN 0 AND 5),
    score_communication INT CHECK (score_communication BETWEEN 0 AND 5),
    comment TEXT,

    -- 防偽與隱私生命週期
    proof_photo_path TEXT,
    proof_photo_hash VARCHAR(256) UNIQUE,
    proof_expires_at TIMESTAMPTZ,
    is_anonymous BOOLEAN DEFAULT FALSE,

    -- 教練回覆與 SaaS 功能
    coach_official_reply TEXT,
    coach_replied_at TIMESTAMPTZ,
    is_pinned_by_coach BOOLEAN DEFAULT FALSE,

    -- 信任權重 (根據學員 trust_score 計算)
    trust_weight NUMERIC(3, 2) DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Coach Claim Verifications (IG Webhook 驗證記錄)
-- ============================================================

CREATE TABLE coach_claim_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_profile_id UUID NOT NULL REFERENCES coach_profiles(id),
    user_id UUID NOT NULL REFERENCES users(id),
    verification_code VARCHAR(20) NOT NULL,
    ig_handle VARCHAR(100) NOT NULL,
    status claim_status DEFAULT 'PENDING',
    verified_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_reviews_coach ON reviews(coach_profile_id);
CREATE INDEX idx_reviews_student ON reviews(student_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_created ON reviews(created_at DESC);
CREATE INDEX idx_reviews_recent ON reviews(coach_profile_id, created_at DESC)
    WHERE status = 'PUBLISHED';
CREATE INDEX idx_coach_profiles_slug ON coach_profiles(slug);
CREATE INDEX idx_coach_profiles_claimed ON coach_profiles(is_claimed);
CREATE INDEX idx_users_auth ON users(auth_id);
CREATE INDEX idx_users_device ON users(device_fingerprint)
    WHERE device_fingerprint IS NOT NULL;

-- ============================================================
-- Updated_at Trigger
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_coach_profiles_updated_at
    BEFORE UPDATE ON coach_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- RLS Policies
-- ============================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_claim_verifications ENABLE ROW LEVEL SECURITY;

-- Users: 只能讀寫自己的資料
CREATE POLICY "Users can read own profile"
    ON users FOR SELECT
    USING (auth.uid() = auth_id);

CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (auth.uid() = auth_id);

-- Coach Profiles: 公開可讀 (已認領) / 登入可讀 (未認領)
CREATE POLICY "Anyone can read claimed coach profiles"
    ON coach_profiles FOR SELECT
    USING (is_claimed = TRUE);

CREATE POLICY "Authenticated users can read unclaimed coach profiles"
    ON coach_profiles FOR SELECT
    USING (auth.role() = 'authenticated' AND is_claimed = FALSE);

CREATE POLICY "Coaches can update own profile"
    ON coach_profiles FOR UPDATE
    USING (claimed_by = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Reviews: 公開已發布的評價 / 學員可建立與編輯自己的
CREATE POLICY "Anyone can read published reviews"
    ON reviews FOR SELECT
    USING (status = 'PUBLISHED');

CREATE POLICY "Authenticated users can read reviews on unclaimed profiles"
    ON reviews FOR SELECT
    USING (
        auth.role() = 'authenticated'
        AND status = 'PUBLISHED'
        AND coach_profile_id IN (SELECT id FROM coach_profiles WHERE is_claimed = FALSE)
    );

CREATE POLICY "Students can create reviews"
    ON reviews FOR INSERT
    WITH CHECK (student_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Students can update own incomplete reviews"
    ON reviews FOR UPDATE
    USING (
        student_id = (SELECT id FROM users WHERE auth_id = auth.uid())
        AND status = 'INCOMPLETE'
    );

-- Coach claim verifications: 只能讀自己的
CREATE POLICY "Users can read own verifications"
    ON coach_claim_verifications FOR SELECT
    USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can create verifications"
    ON coach_claim_verifications FOR INSERT
    WITH CHECK (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));
