---
name: domain-knowledge
description: 達達運動教練評估平台的業務邏輯和領域知識
tags:
  - domain
  - business-logic
  - coach-review
---

# Domain Knowledge - 達達運動教練評估平台

## 核心概念

- **教練評估平台**: 台灣首個具備公信力的運動教練評價系統
- **目標用戶**: 進階訓練者（健美備賽、週期化訓練、傷後復健）
- **核心痛點**: 試錯成本極高，需要可信賴的教練評價

## 資料模型

- **Users**: SSO 登入 + 信任分數 (Trust Score) + 設備指紋
- **Coach_Profiles**: 教練檔案，支援認領 (Claim) 與去重 (Dedup)
- **Reviews**: 評價生命週期管理
- **PoS (Proof of Service)**: 上課證明照片

## 業務規則

### 評價狀態機

```
INCOMPLETE → PENDING_OCR → PUBLISHED
                ↓
          PENDING_ADMIN → PUBLISHED
                           ↓
                        DISPUTED → HIDDEN
```

### 信任機制

- Trust Score 沙盒: 新帳號前 3 筆評價權重為 0
- Shadowban: 異常設備靜默轉 HIDDEN
- SHA-256 Hash 防偽: 照片刪除後保留 hash

### 雙軌制評分

- 歷史總評分: 所有評價加權平均
- 近半年評分: 最近 6 個月 (🔥 標示)

### FOMO 機制

- 未認領教練: 評價僅限登入會員可見
- 已認領教練: 完整公開 + Pro 功能

<!-- TODO: 補充更多具體的業務規則細節 -->

## 外部服務

- **Supabase Auth**: SSO 登入
- **Supabase Storage**: PoS 照片（Private Bucket + Pre-signed URL）
- **AI OCR**: 照片驗證
- **IG Webhook**: 教練認領驗證

<!-- TODO: 補充 API 整合細節 -->
