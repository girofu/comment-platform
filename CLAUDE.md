# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Skills

Read and follow these skills before writing any code:

- .claude/skills/base/SKILL.md
- .claude/skills/security/SKILL.md
- .claude/skills/project-tooling/SKILL.md
- .claude/skills/session-management/SKILL.md
- .claude/skills/typescript/SKILL.md
- .claude/skills/react-web/SKILL.md
- .claude/skills/supabase/SKILL.md
- .claude/skills/supabase-nextjs/SKILL.md
- .claude/skills/ui-web/SKILL.md
- .claude/skills/database-schema/SKILL.md

## Project Overview

「達達運動」教練評估平台 — 台灣首個具備公信力的運動教練評價系統。
採零信任架構，透過 AI 輔助 OCR 驗證、漸進式信任評分、設備指紋防禦等機制，確保評價真實性。
MVP 鎖定進階訓練者（健美備賽、週期化訓練、傷後復健），解決「試錯成本極高」的痛點。

## Tech Stack

- **Language**: TypeScript (strict mode)
- **Framework**: Next.js (App Router)
- **Database**: Supabase (PostgreSQL + Auth + Storage + RLS)
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + Prettier
- **Deployment**: Vercel (TBD)

## Key Commands

```bash
# 驗證開發工具
./scripts/verify-tooling.sh

# 安裝依賴
pnpm install

# 開發伺服器
pnpm dev

# 建置
pnpm build

# 測試
pnpm test                    # 全部測試
pnpm test -- --watch         # 監聽模式
pnpm test -- path/to/file    # 單一測試檔

# Lint & 格式化
pnpm lint
pnpm format

# Type check
pnpm typecheck

# Supabase 本地開發
pnpm db:start                # 啟動本地 Supabase
pnpm db:stop                 # 停止本地 Supabase
pnpm db:migrate              # 執行 migration
pnpm db:reset                # 重置資料庫
pnpm db:gen-types            # 從 schema 生成 TypeScript types
```

## Architecture

### 核心領域模型

- **Users**: SSO 登入 + 信任分數系統 + 設備指紋防禦
- **Coach_Profiles**: 教練檔案，支援認領 (Claim) 與去重 (Dedup)
- **Reviews**: 評價生命週期 (INCOMPLETE → PENDING_OCR → PUBLISHED → HIDDEN)
- **PoS (Proof of Service)**: 上課證明照片，存入 Supabase Storage (Private Bucket)

### 評價狀態機

```
INCOMPLETE → PENDING_OCR → PUBLISHED
                ↓
          PENDING_ADMIN → PUBLISHED
                           ↓
                        DISPUTED → HIDDEN
```

### 關鍵安全機制

1. **PoS 照片**: Private Bucket + 5 分鐘 Pre-signed URL + 30 天硬刪除
2. **SHA-256 Hash 防偽**: 照片刪除後保留 hash，攔截重複上傳
3. **Shadowban**: 異常設備不報錯，評價靜默轉入 HIDDEN
4. **Trust Score 沙盒**: 新帳號前 3 筆評價權重為 0

### 雙軌制評分

- 歷史總評分: 所有評價加權平均
- 近半年評分: 最近 6 個月的評價 (帶 🔥 標示)

## Documentation

- `PRD.md` - 產品需求文件（完整版）
- `docs/` - 技術文件
- `_project_specs/` - 專案規格與待辦事項

## Atomic Todos

All work is tracked in `_project_specs/todos/`:

- `active.md` - Current work
- `backlog.md` - Future work
- `completed.md` - Done (for reference)

## Session Management

### State Tracking

Maintain session state in `_project_specs/session/`:

- `current-state.md` - Live session state (update every 15-20 tool calls)
- `decisions.md` - Key architectural/implementation decisions (append-only)
- `code-landmarks.md` - Important code locations for quick reference
- `archive/` - Past session summaries

### Resuming Work

1. Read `_project_specs/session/current-state.md`
2. Check `_project_specs/todos/active.md`
3. Review recent entries in `decisions.md` if context needed
4. Continue from "Next Steps" in current-state.md

## Project-Specific Patterns

### 評價提交流程 (Conversational Review Flow)

放棄傳統表單，採用 Chatbot 式漸進引導 + 後置證明上傳，降低跳出率。

### 未認領教練檔案的 FOMO 機制

- 未認領: 評價僅限登入會員可見，不被搜尋引擎索引
- 已認領: 完整公開，教練獲得回覆權與 Pro 功能

### 教練認領驗證

透過 IG Webhook 自動驗證 + 手機 OTP 去重，防止假冒與重複 Profile。
