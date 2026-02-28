## Why

台灣運動教練評價散落於社群且缺乏客觀性，進階訓練者（健美備賽、週期化訓練、傷後復健）試錯成本極高。「達達運動」需要建立 MVP 基礎建設，包含核心資料庫、認證系統、評價流程與教練管理，作為整個平台的技術底座。目前專案僅有 Next.js + Supabase 的空殼架構，需要從零建立所有核心功能。

## What Changes

- 建立核心資料庫 schema（Users、Coach_Profiles、Reviews 表）含 RLS 政策與 Enum types
- 實作 Supabase Auth SSO 登入（Google/Apple）與 session 管理
- 建立 Trust Score 沙盒機制：新帳號前 3 筆評價權重為 0
- 實作設備指紋追蹤與 Shadowban 邏輯
- 建立對話式評價提交流程（Chatbot 引導 → Draft 暫存 → PoS 上傳）
- 實作 PoS 照片管理：Private Bucket + Pre-signed URL + 30 天硬刪除 + SHA-256 Hash 防偽
- 建立教練 Profile 頁面與雙軌制評分顯示（歷史總評 + 近半年 🔥）
- 實作教練認領流程（IG Webhook 驗證 + 手機 OTP 去重）
- 建立未認領教練的 FOMO 機制（登入會員可見、搜尋引擎不索引）
- 實作教練官方回覆與 DISPUTED 申訴流程
- 建立 Admin 後台：OCR 失敗人工審核、法律下架操作

## Capabilities

### New Capabilities

- `database-schema`: 核心資料庫 schema 設計，包含 Users、Coach_Profiles、Reviews 表、Enum types、indexes 與 RLS 政策
- `auth-system`: Supabase Auth SSO 登入（Google/Apple）、session 管理、角色權限控制
- `trust-scoring`: 漸進式信任權重系統，沙盒機制、Trust Score 計算與設備指紋防禦
- `review-flow`: 對話式評價提交流程，包含 Chatbot 引導、Draft 暫存、狀態機轉換
- `proof-of-service`: PoS 照片上傳與生命週期管理，Private Bucket、Pre-signed URL、30 天硬刪除、SHA-256 Hash 防偽
- `coach-profile`: 教練 Profile CRUD、雙軌制評分計算、未認領 FOMO 機制、精選釘選
- `coach-claim`: 教練認領驗證流程（IG Webhook + 手機 OTP 去重）與 Profile 合併
- `dispute-system`: 評價申訴與下架機制，教練官方回覆、DISPUTED 狀態處理
- `admin-panel`: 管理後台，OCR 失敗人工審核、法律下架、Shadowban 管理

### Modified Capabilities

<!-- 無現有 capabilities，此為全新專案 -->

## Impact

- **資料庫**: 建立完整 Supabase PostgreSQL schema，包含 9+ 個核心資料表與 RLS 政策
- **前端**: 建立 Next.js App Router 頁面架構，包含學員端、教練端與管理後台
- **後端**: Supabase Edge Functions 處理 OCR、Hash 計算、排程刪除等非同步任務
- **外部依賴**: Supabase Auth、Supabase Storage、Vision AI (OCR)、IG Webhook API、SMS OTP 服務
- **部署**: Vercel (Next.js) + Supabase Cloud，需設定環境變數與 secrets
