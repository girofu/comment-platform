## Context

「達達運動」教練評估平台目前僅有 Next.js 15 App Router + Supabase 的初始空殼架構（pnpm、TypeScript strict mode、Tailwind CSS）。需要從零建立 MVP 所有核心功能，涵蓋資料庫、認證、評價流程、教練管理與管理後台。

技術約束：

- Supabase 作為唯一後端（Auth、Database、Storage、Edge Functions）
- Next.js App Router（Server Components + Server Actions）
- Vercel 部署，需考慮 Edge Runtime 限制
- 台灣使用者為主，需考慮繁體中文 i18n

## Goals / Non-Goals

**Goals:**

- 建立穩固的資料庫 schema，支援所有核心業務邏輯與 RLS 安全政策
- 實作完整的認證流程與信任分數系統
- 建立對話式評價提交流程的前後端
- 實作教練 Profile 頁面與雙軌制評分
- 建立 PoS 照片安全生命週期管理
- 提供基本的管理後台功能

**Non-Goals:**

- Pro 方案訂閱付費功能（Stripe 整合延後）
- 搜尋引擎 SEO 最佳化（MVP 後期處理）
- 行動端 App（僅 RWD 網頁）
- 大量資料的效能最佳化（MVP 階段資料量小）
- 完整的 Analytics 後台流量分析
- IG Webhook 自動驗證的完整實作（MVP 可用手動驗證替代）

## Decisions

### 1. 資料庫層：Supabase PostgreSQL + Drizzle ORM

**選擇**: 使用 Supabase Migration 管理 schema，搭配 Drizzle ORM 進行 type-safe 查詢。
**替代方案**: Prisma（較重、與 Supabase RLS 整合較差）、Raw SQL（缺乏 type safety）。
**理由**: Drizzle 輕量、與 Supabase 原生 types 生成工具相容，且支援 Edge Runtime。

### 2. 認證層：Supabase Auth + Custom Claims

**選擇**: 使用 Supabase Auth 的 Google/Apple SSO，透過 `app_metadata` 存放角色（STUDENT/COACH/ADMIN）。
**替代方案**: NextAuth.js（增加複雜度且與 Supabase RLS 整合不佳）。
**理由**: Supabase Auth 原生支援 RLS 的 `auth.uid()` 與 `auth.jwt()`，減少自訂 middleware。

### 3. 狀態管理：Server Components + React Query

**選擇**: 頁面層級用 Server Components 直接查詢，客戶端互動用 React Query 管理。
**替代方案**: Zustand（全域狀態管理過重）、純 Server Actions（客戶端互動不足）。
**理由**: 對話式評價流程需要客戶端即時互動，React Query 的 mutation/cache 非常適合。

### 4. 評價狀態機：資料庫 Enum + Edge Function 觸發

**選擇**: 狀態定義為 PostgreSQL Enum，狀態轉換透過 Database Trigger + Edge Function 執行。
**替代方案**: 前端控制狀態轉換（安全性不足）、Temporal/Step Functions（MVP 過重）。
**理由**: Database Trigger 確保狀態轉換的原子性，Edge Function 處理 OCR 等非同步任務。

### 5. PoS 照片管理：Supabase Storage Private Bucket

**選擇**: 使用 Supabase Storage 的 Private Bucket，透過 `createSignedUrl` 核發 5 分鐘存取 URL。
**替代方案**: 直接用 S3（增加基礎設施複雜度）。
**理由**: Supabase Storage 原生整合 RLS，且內建 image transformation。

### 6. 設備指紋：FingerprintJS Open Source

**選擇**: 使用 FingerprintJS 開源版本收集瀏覽器指紋。
**替代方案**: FingerprintJS Pro（付費，MVP 不需要）、自建指紋邏輯（不穩定）。
**理由**: 開源版已足夠 MVP 的 Sybil Attack 防禦需求，未來可升級 Pro。

### 7. 前端架構：Next.js App Router 路由結構

**選擇**:

```
app/
├── (public)/           # 公開頁面
│   ├── coaches/[id]/   # 教練 Profile
│   └── search/         # 搜尋
├── (auth)/             # 需登入
│   ├── review/         # 評價提交
│   └── dashboard/      # 學員/教練 Dashboard
├── admin/              # 管理後台
└── api/                # API Routes
```

**理由**: Route Groups 分離公開/認證/管理三個區塊，清晰且易於 RLS 對應。

## Risks / Trade-offs

- **[FingerprintJS 開源版精確度有限]** → MVP 階段可接受，上線後監控偵測率再決定是否升級 Pro
- **[IG Webhook 需要 Meta 商業帳號審核]** → MVP 先用手動驗證碼確認流程，後期再接 Webhook 自動化
- **[Vision AI OCR 辨識率不穩定]** → 設計 fallback 至人工審核，確保流程不中斷
- **[Supabase Edge Functions 冷啟動延遲]** → 非同步任務（OCR、Hash）對延遲不敏感，可接受
- **[30 天硬刪除排程]** → 使用 Supabase 的 pg_cron 擴充套件，需確認 Free Tier 是否支援
- **[RLS 政策複雜度]** → 評價可見性規則（認領/未認領、登入/未登入）需仔細測試邊界條件

## Migration Plan

1. **Phase 1 - Database**: 建立所有 migration 檔案，本地 Supabase 驗證
2. **Phase 2 - Auth**: 設定 Supabase Auth providers，建立登入/註冊流程
3. **Phase 3 - Core Pages**: 教練 Profile 頁面、評價列表、搜尋頁面
4. **Phase 4 - Review Flow**: 對話式評價提交 + PoS 上傳
5. **Phase 5 - Admin**: 基本管理後台
6. **Rollback**: 每個 Phase 可獨立 rollback（Supabase Migration down + git revert）

## Open Questions

- Supabase Free Tier 的 pg_cron 限制是否足夠 30 天排程刪除？
- SMS OTP 服務選用哪家？（Twilio vs 台灣在地服務商）
- Vision AI OCR 選用哪個模型？（Google Cloud Vision vs OpenAI Vision vs Claude Vision）
