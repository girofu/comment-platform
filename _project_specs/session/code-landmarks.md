<!--
UPDATE WHEN:
- Adding new entry points or key files
- Introducing new patterns
- Discovering non-obvious behavior

Helps quickly navigate the codebase when resuming work.
-->

# Code Landmarks

## Entry Points
| Location | Purpose |
|----------|---------|
| PRD.md | 產品需求文件 (完整版) |
| CLAUDE.md | Claude Code 開發指引 |

## Core Business Logic
| Location | Purpose |
|----------|---------|
| TBD | 評價提交流程 |
| TBD | 信任分數計算 |
| TBD | PoS 驗證 (OCR) |

## Configuration
| Location | Purpose |
|----------|---------|
| .env.example | 環境變數範本 |

## Key Patterns
| Pattern | Example Location | Notes |
|---------|------------------|-------|
| TBD | - | 待專案程式碼建立後更新 |

## Testing
| Location | Purpose |
|----------|---------|
| TBD | 測試檔案 |

## Gotchas & Non-Obvious Behavior
| Location | Issue | Notes |
|----------|-------|-------|
| PRD.md | 評價狀態機 | INCOMPLETE → PENDING_OCR → PUBLISHED，注意 Shadowban 的 HIDDEN 狀態 |
| PRD.md | PoS 照片 30 天硬刪除 | 刪除前需計算 SHA-256 hash 並永久保存 |
