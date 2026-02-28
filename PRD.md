

# 達達運動 教練評估平台 - 最終版 PRD 與系統架構白皮書

## 一、 產品願景與 MVP 策略 (Vision & MVP Strategy)

台灣運動風氣盛行，但教練評價散落於社群且缺乏客觀性。「達達運動」旨在打造具備絕對公信力的專業服務評價平台。
在 MVP 階段，我們將鎖定容錯率極低的「進階訓練者」（如：健美備賽、肌肥大週期化訓練、特殊傷後復健等）作為冷啟動受眾，透過高信任度的評價機制解決他們「試錯成本極高」的痛點。

## 二、 核心防禦機制與信任邊界 (Core Defense & Trust Boundary)

平台採「零信任（Zero Trust）」架構，所有評價必須經過多層驗證：

1. **AI 輔助的服務事實證明 (PoS)**：
學員上傳匯款紀錄或對話截圖後，系統優先透過 Vision AI (OCR) 進行初步單據辨識。辨識成功率達標即推進狀態；若辨識失敗或模糊，才轉交人工後台審核，大幅降低營運成本。
2. **漸進式信任權重 (Progressive Trust Scoring) 隔離沙盒**：
新註冊帳號（無論是否經過 SSO）前 3 筆評價權重為 0，且需嚴格審核。隨著使用者綁定更多認證（如手機 SMS）且評價被教練承認，其 Trust Score 才會上升，逐步影響教練總分。
3. **設備指紋與防女巫攻擊 (Device Fingerprinting)**：
前端埋入設備追蹤套件。若偵測到同一設備（瀏覽器/手機）短時間內切換多個免洗帳號惡意洗負評，系統將觸發 Shadowban（影子封鎖），評價轉入 `HIDDEN` 狀態，前端看似成功送出，實則不計入資料庫公開展示。

## 三、 使用者流程與體驗設計 (User Flow & UX)

### 1. 學員端：對話式評價提交 (Conversational Review Flow)

為解決長表單高跳出率的問題，放棄傳統網頁表單，改採漸進式與後置證明的流程。

* **Step 1. 對話互動**：以 Chatbot 形式引導學員（例如：「您覺得這位教練在動作代償的敏銳度如何？」👉 點擊星星 👉「有什麼想補充的嗎？」👉 輸入文字）。
* **Step 2. 評價暫存 (Draft)**：完成文字與星級後，評價即存入資料庫（狀態：`INCOMPLETE`）。
* **Step 3. 後置證明上傳**：系統提示「上傳上課證明照片，您的評價才能正式公開並解鎖平台點數」。將摩擦力最大的上傳動作移至最後。

### 2. 未認領檔案的 FOMO 誘餌機制

若教練尚未認領 Profile，其名下的評價**不對外網公開（Google 搜尋不到）**。

* **對學員**：僅限「已註冊並登入」的會員可以查看這些未認領的評價，以此作為驅動散客註冊的強力誘因。
* **對教練**：教練的公開外網頁面會顯示巨大的 FOMO 標籤（例：「🔥 該教練目前有 15 筆學員真實評價等待解鎖」），迫使教練主動認領。

## 四、 教練端權益與營運邊界 (Coach Management & Operations)

### 1. 嚴格的身分認領與去重 (Claim & Deduplication)

* **IG Webhook 自動驗證**：教練在前台發起認領後，系統生成一組唯一驗證碼。教練必須使用其官方 IG 帳號「私訊」該驗證碼至平台的官方 IG，透過 Webhook 自動核准權限，杜絕假冒。
* **手機 OTP 底層去重**：認領成功後，強制教練綁定實體手機號碼。未來若學員重複建立了同一個教練的 Profile（例如不同上課地點），只要教練用同一支手機認領，系統將在底層自動 Merge 資料。

### 2. 雙軌制評分顯示 (Dual-track Rating)

為真實反映教練當前實力，UI 捨棄單一算術平均數，採用雙軌顯示：

* **歷史總評分**：生涯所有評價平均。
* **近半年評分**：僅計算過去 6 個月內的評價（加上 🔥 標示）。

### 3. 避風港原則與負評防禦 (Safe Harbor & Dispute)

平台堅守中立，不介入主觀教學品質的仲裁。

* **官方置頂回覆權**：教練對於每一則評價，皆有一次「官方回覆（Official Reply）」的權限，高亮顯示於該評價下方。
* **客觀違規申訴**：教練不可因「被給低分」要求刪除。僅在面臨「單據造假」、「人身攻擊髒話」或「隱私洩漏」等客觀違規時，平台客服才介入處理（狀態轉入 `DISPUTED`）。
* **法律公文下架**：面臨法律威脅時，平台僅在收到正式報案三聯單、律師函或法院公文後，才由 Admin 將評價切換為 `HIDDEN`。

## 五、 資安防護：隱私資料生命週期 (Data Retention Policy)

為避免 PII（個人可識別資訊）外洩引發集體訴訟，平台導入「資料最小化原則」：

1. **私有儲存與限時存取**：PoS 照片存入 S3 Private Bucket，前端調閱時僅核發「5 分鐘有效」的 Pre-signed URL。
2. **30 天硬刪除 (Hard Delete)**：當評價轉為 `PUBLISHED` 或爭議結案後啟動倒數。30 天後，系統自動將 S3 上的實體照片永久刪除。
3. **Hash 雜湊防偽**：刪除實體照片前，系統計算圖片的 `SHA-256 Hash` 值並永久存入資料庫。若未來有惡意用戶上傳同一張截圖企圖洗評價，系統比對 Hash 值後將自動攔截。

## 六、 獲利模式與 SaaS 邊界 (Monetization & SaaS)

平台嚴守「絕對不能花錢買橡皮擦」的信任底線。獲利主要來自教練端的 **Pro 方案訂閱 (B2B SaaS)**：

* **無權竄改**：付費教練**絕對無法**隱藏、刪除負評，也無法改變自然搜尋的評價排序。
* **版面客製與防護**：關閉頁面下方的「競品教練推薦」，解鎖進階後台流量分析（Profile Views、搜尋關鍵字）。
* **精選釘選 (Pinned Reviews)**：付費教練可從「已發布的真實評價」中，挑選 3 則最滿意的評價釘選於頁面最上方（UI 標註為「教練精選」），兼顧教練行銷需求與平台真實性。

---

## 七、 核心資料庫綱要更新 (Schema Evolution)

根據上述決策，核心 Table 的關鍵欄位更新如下：

```sql
-- Users 表更新：加入信任分數與設備防禦
CREATE TABLE Users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sso_provider VARCHAR(50) NOT NULL, 
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(50) UNIQUE NULL, -- 教練認領去重與學員進階驗證用
    role user_role DEFAULT 'STUDENT',
    trust_score INT DEFAULT 0, -- 新註冊為 0，通過沙盒後漸進提升
    device_fingerprint VARCHAR(255) NULL, -- 紀錄設備指紋防 Sybil Attack
    is_shadowbanned BOOLEAN DEFAULT FALSE, -- 影子封鎖標記
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews 表更新：加入對話式暫存、隱私保護與 Hash 防偽
CREATE TYPE review_status AS ENUM (
    'INCOMPLETE',       -- 對話表單進行中/尚未上傳證明
    'PENDING_OCR',      -- AI 輔助辨識中
    'PENDING_ADMIN',    -- AI 辨識失敗，等待人工審核
    'PENDING_COACH',    -- 雙盲等待教練確認
    'PUBLISHED',        -- 正式公開
    'DISPUTED',         -- 客觀違規申訴中
    'HIDDEN'            -- 法律下架或影子封鎖
);

CREATE TABLE Reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES Users(id) NOT NULL,
    coach_profile_id UUID REFERENCES Coach_Profiles(id) NOT NULL,
    status review_status DEFAULT 'INCOMPLETE',
    
    -- 結構化評分
    score_overall INT CHECK (score_overall BETWEEN 0 AND 5),
    score_professional INT CHECK (score_professional BETWEEN 0 AND 5),
    score_emotional INT CHECK (score_emotional BETWEEN 0 AND 5),
    score_communication INT CHECK (score_communication BETWEEN 0 AND 5),
    comment TEXT,
    
    -- 防偽與隱私生命週期
    proof_photo_url VARCHAR(512) NULL, 
    proof_photo_hash VARCHAR(256) UNIQUE NULL, -- 圖片 30 天刪除後保留的防偽 Hash
    is_proof_public BOOLEAN DEFAULT FALSE,
    is_anonymous BOOLEAN DEFAULT FALSE,
    
    -- 教練防禦權與 SaaS 功能
    coach_official_reply TEXT NULL, -- 教練官方回覆
    is_pinned_by_coach BOOLEAN DEFAULT FALSE, -- SaaS 訂閱的釘選功能
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

```

---

這份文件現在已經是具備極高商業成熟度的架構藍圖。
