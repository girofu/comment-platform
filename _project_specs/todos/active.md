# Active Todos

Current work in progress. Each todo follows the atomic todo format.

---

## Phase 0：基礎建設 (Foundation)

> 所有 Flow 的共用前置依賴。完成後才能開始 Phase 1。

### TODO-001：建立設計系統與共用元件庫

- **Status**: 🔲 TODO
- **Priority**: P0
- **Flow**: 全域
- **Description**:
  建立 `src/components/ui/` 共用元件，供所有頁面使用。
- **Subtasks**:
  - [ ] 建立 Tailwind 設計 tokens（色彩、間距、字型）
  - [ ] Button 元件（primary / secondary / ghost / danger）
  - [ ] Input 元件（text / search / textarea）
  - [ ] Card 元件
  - [ ] Badge / Tag 元件（評價狀態標籤）
  - [ ] StarRating 元件（顯示用 + 互動用）
  - [ ] Avatar 元件
  - [ ] Modal / Dialog 元件
  - [ ] Toast / Notification 元件
- **Files**:
  - `src/components/ui/*.tsx`
  - `src/app/globals.css`（design tokens）
- **Acceptance Criteria**:
  - 所有元件支援 dark mode
  - 所有互動元件有 keyboard accessibility
  - 元件可被 Storybook 或獨立頁面預覽

### TODO-002：設定 Supabase Auth（SSO 登入）

- **Status**: 🔲 TODO
- **Priority**: P0
- **Flow**: Flow 1
- **Description**:
  設定 Google SSO 登入，建立 auth callback 與 middleware 保護路由。
- **Subtasks**:
  - [ ] 設定 Supabase Auth provider（Google）
  - [ ] 建立 `/auth/callback` route handler（處理 OAuth redirect）
  - [ ] 建立 `/auth/login` 頁面（SSO 登入按鈕）
  - [ ] 更新 `src/middleware.ts`（保護需登入路由）
  - [ ] 建立 auth hook：`useUser()` / `useSession()`
  - [ ] 登入後自動建立 `users` 記錄（若不存在）
  - [ ] 登出功能
- **Files**:
  - `src/app/auth/login/page.tsx`
  - `src/app/auth/callback/route.ts`
  - `src/middleware.ts`
  - `src/hooks/useUser.ts`
  - `src/lib/supabase/auth.ts`
- **Acceptance Criteria**:
  - Google SSO 完整流程可運作
  - 登入後 `users` 表有對應記錄（trust_score=0, role=STUDENT）
  - 未登入用戶訪問保護路由會被導向登入頁

### TODO-003：建立全站 Layout 與導航

- **Status**: 🔲 TODO
- **Priority**: P0
- **Flow**: 全域
- **Description**:
  建立 Header / Footer / Mobile BottomNav，含登入狀態切換。
- **Subtasks**:
  - [ ] Header（Logo、搜尋入口、登入/用戶頭像）
  - [ ] Mobile BottomNav（首頁、搜尋、評價、我的）
  - [ ] Footer（關於、隱私權政策、使用條款）
  - [ ] 更新 `layout.tsx`（metadata、lang="zh-TW"、font）
  - [ ] Responsive breakpoints 確認（mobile / tablet / desktop）
- **Files**:
  - `src/components/layout/Header.tsx`
  - `src/components/layout/Footer.tsx`
  - `src/components/layout/MobileNav.tsx`
  - `src/app/layout.tsx`
- **Acceptance Criteria**:
  - 已登入 → 顯示頭像 + dropdown
  - 未登入 → 顯示登入按鈕
  - Mobile 寬度切換為 BottomNav

---

## Phase 1：核心瀏覽流程 (Read Flows)

> 對應 Flow 2。使用者可以搜尋、瀏覽教練頁面。
> **依賴**: Phase 0 完成

### TODO-004：首頁與教練搜尋列表

- **Status**: 🔲 TODO
- **Priority**: P0
- **Flow**: Flow 2
- **Description**:
  建立首頁搜尋欄、分類標籤、教練卡片列表。
- **Subtasks**:
  - [ ] 首頁 Hero 區塊（標語 + 搜尋欄）
  - [ ] 分類快捷標籤（specialties 篩選）
  - [ ] CoachCard 元件（頭像、名稱、雙軌評分、地區、評價數）
  - [ ] 教練列表 Server Component（從 Supabase 查詢 coach_profiles）
  - [ ] 搜尋功能（名稱 / 專長 / 地區）
  - [ ] 分頁或 infinite scroll
  - [ ] 平台數據統計區塊
- **Files**:
  - `src/app/page.tsx`（首頁重寫）
  - `src/components/coach/CoachCard.tsx`
  - `src/components/coach/CoachList.tsx`
  - `src/components/coach/SearchBar.tsx`
  - `src/components/coach/DualRating.tsx`
- **Acceptance Criteria**:
  - 訪客可搜尋教練
  - CoachCard 顯示雙軌評分（歷史 + 近期 🔥）
  - 搜尋結果依 RLS 正確過濾（已認領 vs 未認領）

### TODO-005：教練公開頁面（已認領）

- **Status**: 🔲 TODO
- **Priority**: P0
- **Flow**: Flow 2, 5
- **Description**:
  教練 Profile 完整頁面，含評價列表、雙軌評分、官方回覆。
- **Subtasks**:
  - [ ] `/coach/[slug]` 動態路由頁面
  - [ ] 教練 Profile Header（頭像、名稱、認證標記、專長、地區）
  - [ ] DualRating 元件（歷史 + 近期，放大版）
  - [ ] 教練簡介區塊
  - [ ] 評價列表（排序：最新 / 最高 / 最低）
  - [ ] 單則評價卡片（四維評分、文字、驗證標記、官方回覆）
  - [ ] 精選釘選評價區塊（is_pinned_by_coach=true 置頂）
  - [ ] SEO metadata（generateMetadata）
  - [ ] 「撰寫評價」CTA 按鈕
- **Files**:
  - `src/app/coach/[slug]/page.tsx`
  - `src/components/review/ReviewCard.tsx`
  - `src/components/review/ReviewList.tsx`
  - `src/components/review/PinnedReviews.tsx`
  - `src/components/coach/CoachProfileHeader.tsx`
- **Acceptance Criteria**:
  - 已認領教練頁面完整公開，有 SEO metadata
  - 精選評價置頂，標註「教練精選」
  - 官方回覆高亮顯示於評價下方

### TODO-006：教練頁面（未認領 — FOMO 版本）

- **Status**: 🔲 TODO
- **Priority**: P1
- **Flow**: Flow 2
- **Description**:
  未認領教練的 FOMO 機制頁面，驅動學員註冊 + 教練認領。
- **Subtasks**:
  - [ ] 同一路由 `/coach/[slug]` 根據 `is_claimed` 切換版本
  - [ ] FOMO 標籤元件（「🔥 N 筆學員真實評價等待解鎖」）
  - [ ] 訪客 → 引導註冊登入（看不到評價）
  - [ ] 已登入學員 → 顯示評價內容
  - [ ] 教練認領 CTA 區塊（列出認領後的權益）
  - [ ] 加上 `noindex` meta（未認領不被搜尋引擎索引）
- **Files**:
  - `src/app/coach/[slug]/page.tsx`（條件渲染）
  - `src/components/coach/FomoBanner.tsx`
  - `src/components/coach/ClaimCTA.tsx`
- **Acceptance Criteria**:
  - 未登入訪客看不到評價，只看到 FOMO 計數
  - 已登入學員可看到評價
  - 頁面有 `noindex` robots meta

---

## Phase 2：核心評價提交 (Write Flows)

> 對應 Flow 3。學員可以提交對話式評價。
> **依賴**: Phase 0 + Phase 1 完成

### TODO-007：對話式評價 — Chatbot 引導介面

- **Status**: 🔲 TODO
- **Priority**: P0
- **Flow**: Flow 3 (Step 1-2)
- **Description**:
  以 Chatbot 形式引導學員逐步完成四維評分 + 文字評價。
- **Subtasks**:
  - [ ] `/coach/[slug]/review` 頁面（需登入保護）
  - [ ] ChatBubble 元件（系統訊息 vs 用戶回應）
  - [ ] InteractiveStarRating 元件（可點擊評分）
  - [ ] 逐題引導流程（Q1→Q2→Q3→Q4，每題一個對話氣泡）
  - [ ] 文字補充 textarea（選填）
  - [ ] 匿名開關 checkbox
  - [ ] 進度指示器（步驟 1/2）
  - [ ] 暫存至 DB（status=INCOMPLETE）的 Server Action
- **Files**:
  - `src/app/coach/[slug]/review/page.tsx`
  - `src/components/review/ChatBubble.tsx`
  - `src/components/review/InteractiveStarRating.tsx`
  - `src/components/review/ReviewChatFlow.tsx`
  - `src/app/coach/[slug]/review/actions.ts`（Server Actions）
- **Acceptance Criteria**:
  - 完成四維評分後，reviews 記錄建立（status=INCOMPLETE）
  - 對話體驗流暢，每題自動滾動
  - 使用者可選擇匿名

### TODO-008：後置證明上傳（PoS Upload）

- **Status**: 🔲 TODO
- **Priority**: P0
- **Flow**: Flow 3 (Step 3-4), Flow 7
- **Description**:
  評價完成後引導上傳 PoS 照片，含 SHA-256 hash 防偽。
- **Subtasks**:
  - [ ] 證明上傳頁面（步驟 2/2）
  - [ ] FileUpload 元件（拖拽 + 點擊、預覽、格式/大小檢查）
  - [ ] 前端計算 SHA-256 hash（Web Crypto API）
  - [ ] 上傳至 Supabase Storage `proof-photos/{uid}/{filename}`
  - [ ] Server Action：比對 hash → 存在則攔截、不存在則寫入
  - [ ] 狀態轉換：INCOMPLETE → PENDING_OCR
  - [ ] 「稍後再傳」選項（保留 INCOMPLETE）
  - [ ] 隱私提示文字（驗證用途、30 天自動刪除）
- **Files**:
  - `src/components/review/ProofUpload.tsx`
  - `src/components/ui/FileUpload.tsx`
  - `src/lib/hash.ts`（SHA-256 工具函式）
  - `src/app/coach/[slug]/review/actions.ts`（擴充）
- **Acceptance Criteria**:
  - 照片上傳至 Storage private bucket
  - hash 重複時攔截並顯示提示
  - 上傳成功後 status 轉為 PENDING_OCR

### TODO-009：學員儀表板（我的評價）

- **Status**: 🔲 TODO
- **Priority**: P1
- **Flow**: Flow 1, 3
- **Description**:
  學員個人儀表板，可管理已提交評價、查看信任等級。
- **Subtasks**:
  - [ ] `/dashboard` 頁面（需登入保護）
  - [ ] 評價統計摘要（已發布 / 草稿中 / 信任分數）
  - [ ] 評價列表（依狀態分組顯示，INCOMPLETE 可繼續完成）
  - [ ] 信任等級進度條（trust_score 視覺化 + 升級指引）
  - [ ] `/dashboard/reviews` 子頁面（完整評價管理）
- **Files**:
  - `src/app/dashboard/page.tsx`
  - `src/app/dashboard/reviews/page.tsx`
  - `src/components/dashboard/ReviewStatusList.tsx`
  - `src/components/dashboard/TrustScoreProgress.tsx`
- **Acceptance Criteria**:
  - 學員可看到所有自己的評價及其狀態
  - INCOMPLETE 評價可點擊「繼續完成」
  - 信任等級進度條正確反映 trust_score
