# 達達運動 — 使用者流程規劃

> 根據 PRD.md 與資料庫 Schema 定義，涵蓋所有角色的完整操作流程。

## 角色定義

| 角色   | Enum 值   | 說明                               |
| ------ | --------- | ---------------------------------- |
| 學員   | `STUDENT` | 搜尋教練、提交評價、上傳 PoS 證明  |
| 教練   | `COACH`   | 認領 Profile、回覆評價、管理頁面   |
| 管理員 | `ADMIN`   | 審核 PoS、處理爭議、Shadowban 管理 |

---

## Flow 1：學員註冊與信任建立

### 目的

建立帳號並透過漸進式信任機制，從「沙盒」狀態逐步取得完整評價權重。

### 步驟

1. **SSO 登入**：訪客透過 Google / LINE / Apple 進行社群登入
2. **建立帳號**：系統自動建立 `users` 記錄（`trust_score=0`, `role=STUDENT`）
3. **進入沙盒期**：前 3 筆評價的 `trust_weight=0`，不計入教練總分
4. **綁定手機 SMS**（選擇性）：寫入 `phone_number`，`trust_score` 提升
5. **評價被確認**：每筆評價通過驗證後，`trust_score` 逐步累積
6. **脫離沙盒**：`trust_weight` 開始影響教練評分

### 對應 Schema 欄位

- `users.trust_score` — 信任分數
- `users.device_fingerprint` — 設備指紋
- `reviews.trust_weight` — 評價權重

---

## Flow 2：學員瀏覽教練（FOMO 機制）

### 目的

透過資訊分級策略，驅動訪客註冊、教練主動認領。

### 步驟

1. **訪客搜尋教練**：可看到已認領（`is_claimed=TRUE`）的教練 Profile
2. **點進未認領教練**：看到 FOMO 標籤（「🔥 該教練目前有 N 筆學員真實評價等待解鎖」），但無法查看評價內容
3. **引導註冊登入**：提示「登入後即可查看完整評價」
4. **已登入學員**：可查看未認領教練的評價（RLS: `auth.role()='authenticated'`）
5. **雙軌評分顯示**：
   - 歷史總評分（`rating_overall`）
   - 近半年評分（`rating_recent`）帶 🔥 標示

### RLS 對照

- `Anyone can read claimed coach profiles` — 公開可讀已認領教練
- `Authenticated users can read unclaimed coach profiles` — 登入可讀未認領教練

---

## Flow 3：對話式評價提交（核心流程）

### 目的

以 Chatbot 漸進引導取代傳統長表單，降低跳出率，並將摩擦最大的 PoS 上傳移至最後。

### 步驟

1. **選擇教練**：學員搜尋並選定一位 `coach_profile`
2. **對話互動**（Chatbot 引導）：
   - 「您覺得這位教練在動作代償的敏銳度如何？」→ 星級評分
   - 「專業知識方面呢？」→ 星級評分
   - 「溝通與情緒管理如何？」→ 星級評分
   - 「有什麼想補充的嗎？」→ 文字輸入
3. **暫存草稿**：建立 `reviews` 記錄，`status=INCOMPLETE`
4. **後置證明上傳**：
   - 上傳匯款紀錄或對話截圖
   - 存入 Storage `proof-photos/{auth_uid}/{filename}`
   - 計算 SHA-256 hash → 寫入 `proof_photo_hash`
   - 若 hash 已存在 → 攔截（重複上傳防禦）
   - `status` 轉為 `PENDING_OCR`
5. **AI OCR 驗證**：
   - 辨識成功 → `status=PUBLISHED`，設定 `proof_expires_at`
   - 辨識失敗 → `status=PENDING_ADMIN`，等待人工審核
6. **已發布**：`status=PUBLISHED`
7. **30 天後自動清理**：刪除 Storage 照片實體，保留 `proof_photo_hash`

### 評價狀態機

```
INCOMPLETE → PENDING_OCR → PUBLISHED → DISPUTED → HIDDEN
                 ↓                         ↑
           PENDING_ADMIN → PUBLISHED   (教練申訴)
                 ↓
              HIDDEN (審核不通過)
```

### 對應 Schema 欄位

- `reviews.status` — 評價狀態（7 種 enum）
- `reviews.score_overall/professional/emotional/communication` — 四維評分
- `reviews.proof_photo_path` — 照片路徑
- `reviews.proof_photo_hash` — 防偽 hash
- `reviews.proof_expires_at` — 照片過期時間

---

## Flow 4：教練認領 Profile

### 目的

透過 IG Webhook 自動驗證 + 手機 OTP 去重，確保教練身分真實且唯一。

### 步驟

1. **發起認領**：教練在前台點擊「認領此教練頁面」
2. **產生驗證碼**：系統建立 `coach_claim_verifications` 記錄，生成唯一 `verification_code`，設定 `expires_at`
3. **IG 驗證**：教練用官方 IG 帳號私訊驗證碼至平台官方 IG
4. **Webhook 比對**：系統比對 `verification_code` + `ig_handle`
   - 成功 → `claim_status=VERIFIED`，`coach_profiles.is_claimed=TRUE`
   - 失敗/過期 → `claim_status=REJECTED`
5. **強制綁定手機 OTP**：寫入 `users.phone_number`
6. **認領完成**：
   - 評價對外網公開（Google 可索引）
   - 解鎖官方回覆權
   - 可升級 Pro 方案

### 去重邏輯

同一手機號碼認領多個 Profile → 系統底層自動 Merge。

### 對應 Schema

- `coach_claim_verifications` — 驗證記錄表
- `coach_profiles.is_claimed` / `claimed_by` / `claim_status`

---

## Flow 5：教練互動（回覆 & Pro 功能）

### 目的

教練管理自己的評價，行使回覆權與 Pro 訂閱功能。

### 5a. 官方回覆（所有已認領教練）

1. 查看名下 `status=PUBLISHED` 的評價
2. 對每則評價撰寫一次「官方回覆」
3. 寫入 `reviews.coach_official_reply`，記錄 `coach_replied_at`
4. UI 高亮顯示於評價下方

### 5b. 客觀違規申訴

1. 教練發現評價包含：單據造假 / 人身攻擊 / 隱私洩露
2. 提出申訴 → `reviews.status=DISPUTED`
3. Admin 介入審核
   - 違規屬實 → `status=HIDDEN`
   - 不成立 → 維持 `PUBLISHED`

### 5c. Pro 訂閱功能

- **精選釘選**：從已發布評價中挑選最多 3 則，`is_pinned_by_coach=TRUE`，置頂顯示
- **關閉競品推薦**：頁面不顯示其他教練推薦
- **流量分析後台**：Profile Views、搜尋關鍵字等數據

### 對應 Schema

- `reviews.coach_official_reply` / `coach_replied_at`
- `reviews.is_pinned_by_coach`
- `coach_profiles.is_pro` / `pro_expires_at`

---

## Flow 6：設備指紋防禦 & Shadowban

### 目的

偵測並阻止同一設備切換多個帳號惡意洗負評。

### 步驟

1. **前端埋碼**：頁面載入時收集設備指紋，寫入 `users.device_fingerprint`
2. **異常偵測**：同一 `device_fingerprint` 短時間內對應多個 `users.id`
3. **觸發 Shadowban**：`users.is_shadowbanned=TRUE`
4. **靜默處理**：
   - 前端顯示「提交成功」（不報錯）
   - 後端自動將評價 `status` 轉為 `HIDDEN`
   - 不計入教練分數

### 對應 Schema

- `users.device_fingerprint`
- `users.is_shadowbanned`
- Index: `idx_users_device`

---

## Flow 7：PoS 照片生命週期

### 目的

遵循資料最小化原則，在驗證完成後定期清除敏感 PII。

### 步驟

1. **上傳**：照片存入 Storage `proof-photos` bucket（Private）
2. **調閱**：透過 Pre-signed URL（5 分鐘有效）存取
3. **倒數啟動**：評價 `PUBLISHED` 後設定 `proof_expires_at = NOW() + 30 天`
4. **到期清理**：
   - 計算 SHA-256 hash 永久存入 `proof_photo_hash`
   - 刪除 Storage 實體照片
   - 清空 `proof_photo_path`
5. **防偽比對**：未來上傳的照片先比對 hash，命中則攔截

### Storage 設定

- Bucket: `proof-photos`（Private, 5MB limit）
- 允許格式: `image/jpeg`, `image/png`, `image/webp`
- RLS: 用戶只能上傳/讀取自己目錄

---

## 頁面路由對照表

| 路由                       | 頁面                | 對應 Flow | 存取權限  |
| -------------------------- | ------------------- | --------- | --------- |
| `/`                        | 首頁 / 教練搜尋     | Flow 2    | 公開      |
| `/auth/login`              | SSO 登入            | Flow 1    | 公開      |
| `/coach/[slug]`            | 教練公開頁面        | Flow 2, 5 | 公開/登入 |
| `/coach/[slug]/review`     | 對話式評價提交      | Flow 3    | 需登入    |
| `/dashboard`               | 學員儀表板          | Flow 1, 3 | 需登入    |
| `/dashboard/reviews`       | 我的評價管理        | Flow 3    | 需登入    |
| `/coach/claim`             | 教練認領入口        | Flow 4    | 需登入    |
| `/coach/dashboard`         | 教練後台            | Flow 5    | 教練      |
| `/coach/dashboard/reviews` | 教練評價管理 & 回覆 | Flow 5    | 教練      |
| `/admin/reviews`           | 管理員審核後台      | Flow 3    | Admin     |
| `/admin/disputes`          | 爭議處理            | Flow 5    | Admin     |
