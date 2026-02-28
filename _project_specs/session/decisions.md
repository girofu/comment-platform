<!--
LOG DECISIONS WHEN:
- Choosing between architectural approaches
- Selecting libraries or tools
- Making security-related choices
- Deviating from standard patterns

This is append-only. Never delete entries.
-->

# Decision Log

## [2026-02-28] Tech Stack Selection

**Decision**: Next.js (App Router) + Supabase + pnpm
**Context**: 新專案初始化，需選擇符合 PRD 需求的技術棧
**Options Considered**: Next.js+Supabase, Next.js+自選後端, FastAPI+React
**Choice**: Next.js + Supabase
**Reasoning**: PRD 需求（RLS、S3 Storage、Auth、即時功能）與 Supabase 原生功能高度匹配，減少自建基礎設施的成本
**Trade-offs**: 與 Supabase 的耦合較深，未來遷移成本較高
**References**: PRD.md
