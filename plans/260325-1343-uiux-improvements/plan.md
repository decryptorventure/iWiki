---
title: "UI/UX Improvements: Fast Fixes, Layout, Dark Mode"
description: "6 UI/UX fixes across 3 phases — icon visibility, modal cleanup, layout, editor UX, folder picker, dark mode"
status: completed
priority: P1
effort: 6h
branch: main
tags: [ui, ux, dark-mode, tailwind-v4, layout]
created: 2026-03-25
completed: 2026-03-25
---

# UI/UX Improvements Plan

## Key Technical Note
- Project uses **Tailwind CSS v4** via `@tailwindcss/vite` — NO `tailwind.config.ts`
- Dark mode config goes in `src/index.css` using `@custom-variant`, not a config file
- Lint command: `tsc --noEmit`

## Phases

### Phase 1 — Fast Fixes (1h) ✓ COMPLETED
Quick, isolated fixes with zero risk of regression.

| # | Issue | File | Status |
|---|-------|------|--------|
| 1 | Stats icons invisible (SVG gradient bug) | `MyArticles.tsx` | Done |
| 2 | Remove "Lien ket Tri thuc" sidebar | `ArticleModal.tsx` | Done |
| 3 | ArticleFullView col-span gap on lg screens | `ArticleFullView.tsx` | Done |

**Details:** [phase-01-fast-fixes.md](./phase-01-fast-fixes.md)

### Phase 2 — Editor UX + Publish Modal (3h) ✓ COMPLETED
Toolbar restructuring, content alignment, folder picker, restricted-user sharing.

| # | Issue | File | Status |
|---|-------|------|--------|
| 4 | Editor toolbar/layout restructure | `Editor.tsx` | Done |
| 5 | Publish modal: folder picker + shared users | `editor-publish-modal.tsx` | Done |

**Details:** [phase-02-editor-and-publish.md](./phase-02-editor-and-publish.md)

### Phase 3 — Dark Mode Foundation (2h) ✓ COMPLETED
Layout-shell dark mode only (Sidebar, App wrapper, main containers).

| # | Issue | File(s) | Status |
|---|-------|---------|--------|
| 6 | Dark mode toggle + shell variants | `index.css`, new hook, `Sidebar.tsx`, `App.tsx` | Done |

**Details:** [phase-03-dark-mode.md](./phase-03-dark-mode.md)

## Dependencies
- Phase 1: independent, do first
- Phase 2: independent of Phase 1, can parallel
- Phase 3: should run last (touches layout shells modified in Phase 1)

## Success Criteria
- All 6 issues resolved, `tsc --noEmit` passes after each phase
- Icons visible, modal cleaner, layout centered, editor UX improved, dark mode toggleable
