# 達達運動 — 使用者流程圖 (Mermaid)

> 所有流程的視覺化 Mermaid 圖表。可在 GitHub、VSCode 或任何支援 Mermaid 的工具中預覽。

---

## Flow 1：學員註冊與信任建立

```mermaid
flowchart TD
    A([訪客]) --> B[SSO 登入<br/>Google / LINE / Apple]
    B --> C[建立 users 記錄<br/>trust_score=0<br/>role=STUDENT]
    C --> D{進入沙盒期}
    D --> E[前 3 筆評價<br/>trust_weight=0<br/>不計入教練總分]
    E --> F{綁定手機 SMS?}
    F -->|是| G[trust_score +20]
    F -->|否| H[維持低信任分數]
    G --> I{累積評價被確認}
    H --> I
    I -->|trust_score 達標| J[脫離沙盒<br/>trust_weight 開始生效]
    I -->|未達標| E

    style A fill:#e8f5e9,color:#1b5e20
    style J fill:#c8e6c9,color:#1b5e20
    style D fill:#fff3e0,color:#e65100
```

---

## Flow 2：學員瀏覽教練（FOMO 機制）

```mermaid
flowchart TD
    A([使用者進入平台]) --> B{已登入?}

    B -->|否 - 訪客| C[搜尋教練列表]
    C --> D{教練已認領?}
    D -->|是| E[顯示完整 Profile<br/>+ 雙軌評分]
    D -->|否| F[顯示 FOMO 標籤<br/>🔥 N 筆評價等待解鎖]
    F --> G[引導註冊登入]

    B -->|是 - 已登入| H[搜尋教練列表]
    H --> I{教練已認領?}
    I -->|是| J[顯示完整 Profile<br/>+ 評價 + 雙軌評分]
    I -->|否| K[顯示未認領 Profile<br/>+ 評價內容<br/>不被搜尋引擎索引]

    J --> L[雙軌評分]
    L --> M[歷史總評分<br/>rating_overall]
    L --> N[近半年評分 🔥<br/>rating_recent]

    style F fill:#fff3e0,color:#e65100
    style G fill:#e3f2fd,color:#0d47a1
    style K fill:#fce4ec,color:#880e4f
```

---

## Flow 3：對話式評價提交（核心流程）

```mermaid
flowchart TD
    A([學員登入]) --> B[搜尋選擇教練]
    B --> C[進入對話式評價]

    subgraph chatbot [Chatbot 漸進引導]
        C --> D[Q1: 動作代償敏銳度<br/>⭐ 星級評分]
        D --> E[Q2: 專業知識<br/>⭐ 星級評分]
        E --> F[Q3: 溝通與情緒管理<br/>⭐ 星級評分]
        F --> G[Q4: 文字補充<br/>📝 自由輸入]
    end

    G --> H[暫存草稿<br/>status=INCOMPLETE]

    H --> I{上傳 PoS 證明?}
    I -->|稍後再傳| J[保留 INCOMPLETE<br/>可隨時回來繼續]
    I -->|立即上傳| K[上傳匯款紀錄/對話截圖]

    K --> L[計算 SHA-256 Hash]
    L --> M{Hash 已存在?}
    M -->|是| N[❌ 攔截<br/>重複上傳防禦]
    M -->|否| O[存入 Storage<br/>proof-photos bucket]

    O --> P[status=PENDING_OCR]
    P --> Q{AI OCR 驗證}
    Q -->|辨識成功| R[status=PUBLISHED ✅]
    Q -->|辨識失敗| S[status=PENDING_ADMIN]

    S --> T{人工審核}
    T -->|通過| R
    T -->|拒絕| U[status=HIDDEN ❌]

    R --> V[設定 proof_expires_at<br/>NOW + 30 天]
    V --> W[30 天後自動刪除照片<br/>保留 proof_photo_hash]

    style chatbot fill:#e8f5e9,stroke:#4caf50,color:#1b5e20
    style R fill:#c8e6c9,color:#1b5e20
    style U fill:#ffcdd2,color:#b71c1c
    style N fill:#ffcdd2,color:#b71c1c
```

---

## Flow 3a：評價狀態機

```mermaid
stateDiagram-v2
    [*] --> INCOMPLETE : 建立草稿

    INCOMPLETE --> PENDING_OCR : 上傳 PoS 證明
    PENDING_OCR --> PUBLISHED : AI OCR 通過
    PENDING_OCR --> PENDING_ADMIN : AI OCR 失敗

    PENDING_ADMIN --> PUBLISHED : 人工審核通過
    PENDING_ADMIN --> HIDDEN : 人工審核拒絕

    PUBLISHED --> DISPUTED : 教練提出客觀違規申訴
    DISPUTED --> PUBLISHED : 申訴不成立
    DISPUTED --> HIDDEN : 申訴成立 / 法律公文

    note right of INCOMPLETE : 學員可隨時回來繼續
    note right of HIDDEN : Shadowban 評價也直接進入此狀態
    note right of PUBLISHED : 30 天後自動清除 PoS 照片
```

---

## Flow 4：教練認領 Profile

```mermaid
flowchart TD
    A([教練]) --> B[在前台找到自己的 Profile]
    B --> C[點擊「認領此教練頁面」]
    C --> D[系統產生唯一 verification_code<br/>建立 coach_claim_verifications]

    D --> E[顯示指示：<br/>請用官方 IG 私訊驗證碼<br/>至 @dada_sport]

    E --> F{教練操作}
    F -->|發送私訊| G[IG Webhook 接收]
    F -->|超時未操作| H[expires_at 到期<br/>claim_status=REJECTED ❌]

    G --> I{比對驗證碼 + IG 帳號}
    I -->|成功| J[claim_status=VERIFIED ✅]
    I -->|失敗| K[claim_status=REJECTED ❌<br/>可重新申請]

    J --> L[強制綁定手機 OTP]
    L --> M{手機號碼已被使用?}
    M -->|是| N[自動 Merge Profile<br/>底層去重]
    M -->|否| O[寫入 phone_number]

    N --> P[認領完成]
    O --> P

    P --> Q[解鎖功能]
    Q --> R[評價對外網公開]
    Q --> S[Google 可索引]
    Q --> T[官方回覆權]
    Q --> U[可升級 Pro]

    style J fill:#c8e6c9,color:#1b5e20
    style H fill:#ffcdd2,color:#b71c1c
    style K fill:#ffcdd2,color:#b71c1c
    style P fill:#e8f5e9,color:#1b5e20
```

---

## Flow 5：教練互動（回覆 & Pro 功能）

```mermaid
flowchart TD
    A([已認領教練]) --> B[教練後台]

    B --> C{選擇操作}

    C --> D[查看評價列表]
    D --> E{對單則評價操作}

    E --> F[撰寫官方回覆<br/>每則限一次]
    F --> G[coach_official_reply 寫入<br/>高亮顯示於評價下方]

    E --> H{發現客觀違規?}
    H -->|單據造假| I[提出申訴]
    H -->|人身攻擊| I
    H -->|隱私洩露| I
    I --> J[status=DISPUTED<br/>Admin 介入審核]

    C --> K{Pro 訂閱?}
    K -->|是| L[Pro 功能面板]
    L --> M[精選釘選<br/>最多 3 則]
    L --> N[關閉競品推薦]
    L --> O[流量分析後台]

    K -->|否| P[引導升級 Pro<br/>顯示功能預覽]

    style A fill:#e3f2fd,color:#0d47a1
    style L fill:#e8f5e9,color:#1b5e20
    style J fill:#fff3e0,color:#e65100
```

---

## Flow 6：設備指紋防禦 & Shadowban

```mermaid
flowchart TD
    A([頁面載入]) --> B[前端收集設備指紋]
    B --> C[寫入 users.device_fingerprint]

    C --> D{系統偵測}
    D --> E{同一 fingerprint<br/>對應多個 user ID?}

    E -->|否| F[正常使用]
    E -->|是| G{短時間內<br/>切換帳號?}

    G -->|否| F
    G -->|是| H[觸發 Shadowban ⚠️]

    H --> I[is_shadowbanned=TRUE]
    I --> J[前端顯示「提交成功」<br/>不報錯]
    J --> K[後端自動<br/>status=HIDDEN]
    K --> L[不計入教練分數<br/>不公開顯示]

    style H fill:#ffcdd2,color:#b71c1c
    style F fill:#c8e6c9,color:#1b5e20
    style J fill:#fff3e0,color:#e65100
```

---

## Flow 7：PoS 照片生命週期

```mermaid
flowchart TD
    A([學員上傳照片]) --> B[存入 Storage<br/>proof-photos bucket<br/>Private]
    B --> C[寫入 proof_photo_path]

    C --> D[前端調閱]
    D --> E[產生 Pre-signed URL<br/>5 分鐘有效]

    C --> F{評價 PUBLISHED?}
    F -->|否| G[照片持續保存<br/>等待審核]
    F -->|是| H[設定 proof_expires_at<br/>NOW + 30 天]

    H --> I[倒數 30 天]
    I --> J[計算 SHA-256 Hash]
    J --> K[hash 永久存入<br/>proof_photo_hash]
    K --> L[刪除 Storage 實體照片 🗑️]
    L --> M[清空 proof_photo_path]

    M --> N{未來有新上傳}
    N --> O[比對 proof_photo_hash]
    O --> P{Hash 命中?}
    P -->|是| Q[❌ 攔截<br/>重複上傳]
    P -->|否| R[✅ 允許上傳]

    style L fill:#ffcdd2,color:#b71c1c
    style Q fill:#ffcdd2,color:#b71c1c
    style R fill:#c8e6c9,color:#1b5e20
```

---

## 全系統角色互動總覽

```mermaid
flowchart LR
    subgraph 學員端
        S1[註冊登入]
        S2[瀏覽教練]
        S3[對話式評價]
        S4[上傳 PoS]
    end

    subgraph 系統
        SYS1[AI OCR 驗證]
        SYS2[設備指紋偵測]
        SYS3[信任分數計算]
        SYS4[30 天照片清理]
        SYS5[Hash 防偽比對]
    end

    subgraph 教練端
        C1[認領 Profile]
        C2[官方回覆]
        C3[違規申訴]
        C4[Pro 訂閱功能]
    end

    subgraph 管理員
        A1[人工審核 PoS]
        A2[爭議處理]
        A3[Shadowban 管理]
    end

    S1 --> SYS3
    S3 --> S4
    S4 --> SYS1
    S4 --> SYS5
    SYS1 -->|失敗| A1
    SYS2 -->|異常| A3
    C3 --> A2
    S4 --> SYS4
    C1 --> C2
    C1 --> C4

    style 學員端 fill:#e3f2fd,color:#0d47a1
    style 系統 fill:#f3e5f5,color:#4a148c
    style 教練端 fill:#e8f5e9,color:#1b5e20
    style 管理員 fill:#fff3e0,color:#e65100
```
