-- PoS (Proof of Service) 照片存儲設定
-- Private bucket: 所有訪問透過 Pre-signed URL (5 分鐘有效)

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'proof-photos',
    'proof-photos',
    FALSE,  -- Private bucket
    5242880,  -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Storage RLS: 只允許認證用戶上傳到自己的目錄
CREATE POLICY "Users can upload proof photos"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'proof-photos'
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = auth.uid()::TEXT
    );

-- Storage RLS: Admin 和 service_role 可以讀取所有照片 (用於 OCR 處理)
CREATE POLICY "Service role can read all proof photos"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'proof-photos'
        AND auth.role() = 'service_role'
    );

-- Storage RLS: 用戶只能讀取自己上傳的照片
CREATE POLICY "Users can read own proof photos"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'proof-photos'
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = auth.uid()::TEXT
    );
