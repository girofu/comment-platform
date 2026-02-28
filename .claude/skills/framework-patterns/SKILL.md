---
name: framework-patterns
description: Next.js 16 App Router 框架模式與慣例
tags:
  - nextjs
  - react
  - patterns
---

# Next.js Patterns

## 路由模式

- 使用 App Router (`src/app/`)
- Turbopack 開發模式 (`next dev --turbopack`)

<!-- TODO: 補充專案的路由結構，例如：
- /coaches/[id] - 教練檔案頁
- /reviews/new - 新增評價
- /api/* - API routes
-->

## Server vs Client Components

<!-- TODO: 描述專案中 Server/Client Component 的使用策略
- 預設 Server Component
- 需要互動的元件才使用 'use client'
- 表單、動態互動使用 Client Component
-->

## 資料獲取

- Supabase SSR (`@supabase/ssr`) 用於 Server Component 資料獲取
- Server Actions 用於表單提交和資料變更

<!-- TODO: 補充具體的資料獲取模式 -->

## 樣式系統

- Tailwind CSS v4
- PostCSS 整合 (`@tailwindcss/postcss`)

<!-- TODO: 補充樣式慣例，如：
- 元件樣式使用 Tailwind utility classes
- 全域樣式定義位置
- 色彩/間距/字型系統
-->

## 狀態管理

<!-- TODO: 描述狀態管理方案
- URL state (searchParams)
- React state (useState/useReducer)
- Server state (Supabase real-time?)
-->
