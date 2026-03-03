# 達達運動教練評估平台 — 架構流程圖總覽

> 所有圖表使用 Mermaid 語法，可在 GitHub、VSCode、Notion 等工具中預覽。

---

## 系統架構總覽

```mermaid
flowchart TB
    subgraph Frontend["🖥️ Frontend — Next.js App Router"]
        direction TB
        Pages["Pages"]
        UI["UI Components"]
        Middleware["Auth Middleware"]
    end

    subgraph Backend["⚙️ Backend — Supabase"]
        direction TB
        Auth["Supabase Auth<br/>(Google/LINE/Apple SSO)"]
        DB["PostgreSQL"]
        Storage["Storage<br/>(proof-photos bucket)"]
        RLS["Row Level Security"]
        Edge["Edge Functions<br/>(OCR / Cron)"]
    end

    subgraph External["🌐 External Services"]
        IG["Instagram Webhook<br/>(教練認領驗證)"]
        AI["Vision AI (OCR)<br/>(PoS 單據辨識)"]
        SMS["SMS OTP<br/>(手機去重)"]
    end

    Frontend <-->|SSR + Server Actions| Backend
    Edge --> AI
    Edge --> IG
    Auth --> SMS
```

---

## 開發 Phase 路線圖

```mermaid
flowchart LR
    P0["Phase 0<br/>🏗️ 基礎建設"]
    P1["Phase 1<br/>📖 瀏覽流程"]
    P2["Phase 2<br/>✍️ 評價提交"]
    P3["Phase 3<br/>🔐 安全機制"]
    P4["Phase 4<br/>👨‍🏫 教練認領"]
    P5["Phase 5<br/>💼 Pro SaaS"]
    P6["Phase 6<br/>🛡️ Admin 後台"]

    P0 --> P1 --> P2 --> P3
    P2 --> P4 --> P5
    P3 --> P6

    style P0 fill:#e3f2fd,color:#0d47a1
    style P1 fill:#e8f5e9,color:#1b5e20
    style P2 fill:#fff3e0,color:#e65100
    style P3 fill:#fce4ec,color:#880e4f
    style P4 fill:#f3e5f5,color:#4a148c
    style P5 fill:#e0f7fa,color:#006064
    style P6 fill:#fff8e1,color:#f57f17
```

---

## 核心使用者流程

### 1. 學員註冊 → 信任建立

```mermaid
flowchart TD
    A([訪客]) --> B[SSO 登入<br/>Google / LINE / Apple]
    B --> C[建立 users<br/>trust_score=0]
    C --> D{沙盒期<br/>前 3 筆評價}
    D --> E[trust_weight=0<br/>不計入教練總分]
    E --> F{綁定手機?}
    F -->|是| G[trust_score ↑]
    F -->|否| H[維持低分]
    G & H --> I{累積驗證通過}
    I -->|達標| J[✅ 脫離沙盒]
    I -->|未達標| E
```

---

### 2. 對話式評價提交（核心流程）

```mermaid
flowchart TD
    A([學員]) --> B[選擇教練]
    B --> C[Chatbot 引導]

    subgraph chat ["💬 對話式評分"]
        C --> D["Q1: 動作代償敏銳度 ⭐"]
        D --> E["Q2: 專業知識 ⭐"]
        E --> F["Q3: 溝通管理 ⭐"]
        F --> G["Q4: 文字補充 📝"]
    end

    G --> H["暫存 INCOMPLETE"]
    H --> I{上傳 PoS?}
    I -->|稍後| J[保留草稿]
    I -->|上傳| K[SHA-256 Hash 檢查]
    K --> L{重複?}
    L -->|是| M["❌ 攔截"]
    L -->|否| N[存入 Storage]
    N --> O["PENDING_OCR"]
    O --> P{AI OCR}
    P -->|成功| Q["✅ PUBLISHED"]
    P -->|失敗| R["PENDING_ADMIN"]
    R --> S{人工審核}
    S -->|通過| Q
    S -->|拒絕| T["❌ HIDDEN"]
    Q --> U["30 天後刪除照片<br/>保留 Hash"]
```

---

### 3. 評價狀態機

```mermaid
stateDiagram-v2
    [*] --> INCOMPLETE : 建立草稿
    INCOMPLETE --> PENDING_OCR : 上傳 PoS
    PENDING_OCR --> PUBLISHED : AI OCR 通過
    PENDING_OCR --> PENDING_ADMIN : AI OCR 失敗
    PENDING_ADMIN --> PUBLISHED : 人工通過
    PENDING_ADMIN --> HIDDEN : 人工拒絕
    PUBLISHED --> DISPUTED : 教練申訴
    DISPUTED --> PUBLISHED : 不成立
    DISPUTED --> HIDDEN : 成立/法律公文
```

---

### 4. 教練認領流程

```mermaid
flowchart TD
    A([教練]) --> B[點擊認領]
    B --> C[產生 verification_code]
    C --> D[用官方 IG 私訊驗證碼]
    D --> E{Webhook 比對}
    E -->|成功| F["✅ VERIFIED"]
    E -->|失敗| G["❌ REJECTED"]
    F --> H[強制綁手機 OTP]
    H --> I{號碼已存在?}
    I -->|是| J[自動 Merge Profile]
    I -->|否| K[寫入 phone_number]
    J & K --> L["🎉 認領完成"]
    L --> M[評價公開 + Google 索引]
    L --> N[解鎖官方回覆權]
    L --> O[可升級 Pro]
```

---

### 5. 安全防禦體系

```mermaid
flowchart TD
    subgraph defense ["🛡️ 零信任安全防禦"]
        A["設備指紋偵測"] --> B{同設備多帳號?}
        B -->|是| C["Shadowban<br/>前端顯示成功<br/>後端 → HIDDEN"]
        B -->|否| D[正常]

        E["SHA-256 Hash 防偽"] --> F{照片重複?}
        F -->|是| G["❌ 攔截上傳"]
        F -->|否| H[允許]

        I["信任沙盒"] --> J["新帳號前 3 筆<br/>weight=0"]
        J --> K["逐步累積 trust_score"]
    end
```

---

### 6. 三方角色互動總覽

```mermaid
flowchart LR
    subgraph Student ["👨‍🎓 學員端"]
        S1[SSO 註冊]
        S2[搜尋教練]
        S3[對話式評價]
        S4[上傳 PoS]
    end

    subgraph System ["⚙️ 系統"]
        SYS1[AI OCR]
        SYS2[設備指紋偵測]
        SYS3[信任分數計算]
        SYS4[30 天照片清理]
        SYS5[Hash 防偽]
    end

    subgraph Coach ["👨‍🏫 教練端"]
        C1[IG 認領 Profile]
        C2[官方回覆]
        C3[違規申訴]
        C4[Pro 訂閱]
    end

    subgraph Admin ["🔧 管理員"]
        A1[人工審核 PoS]
        A2[爭議處理]
        A3[Shadowban 管理]
    end

    S1 --> SYS3
    S3 --> S4 --> SYS1
    S4 --> SYS5
    SYS1 -->|失敗| A1
    SYS2 -->|異常| A3
    C3 --> A2
    S4 --> SYS4
    C1 --> C2 & C4
```

---

## 頁面路由架構

```mermaid
flowchart TD
    Root["/"] --> AuthLogin["/auth/login<br/>SSO 登入"]
    Root --> Coach["/coach/[slug]<br/>教練頁面"]
    Coach --> Review["/coach/[slug]/review<br/>對話式評價"]
    Root --> Claim["/coach/claim<br/>教練認領"]
    Root --> Dashboard["/dashboard<br/>學員儀表板"]
    Dashboard --> MyReviews["/dashboard/reviews<br/>我的評價"]
    Root --> CoachDash["/coach/dashboard<br/>教練後台"]
    CoachDash --> CoachReviews["/coach/dashboard/reviews<br/>評價管理 & 回覆"]
    Root --> AdminReviews["/admin/reviews<br/>審核後台"]
    Root --> AdminDisputes["/admin/disputes<br/>爭議處理"]

    style Root fill:#e3f2fd,color:#0d47a1
    style AuthLogin fill:#f3e5f5,color:#4a148c
    style Coach fill:#e8f5e9,color:#1b5e20
    style Review fill:#fff3e0,color:#e65100
    style Dashboard fill:#e0f7fa,color:#006064
    style CoachDash fill:#e8f5e9,color:#1b5e20
    style AdminReviews fill:#fff8e1,color:#f57f17
    style AdminDisputes fill:#fce4ec,color:#880e4f
```

---

## 目前開發進度

| Phase    | 名稱                                | 狀態            |
| -------- | ----------------------------------- | --------------- |
| Phase 0  | 基礎建設（設計系統、Auth、Layout）  | 🔲 尚未開始     |
| Phase 1  | 瀏覽流程（搜尋、教練頁、FOMO）      | 🔲 等待 Phase 0 |
| Phase 2  | 評價提交（Chatbot、PoS 上傳）       | 🔲 等待 Phase 1 |
| Phase 3+ | 安全機制、教練認領、Pro SaaS、Admin | 🔲 Backlog      |
