# iWiki Frontend Refactoring Plan

**Created**: 2026-03-25
**Status**: In Progress
**Branch**: main
**Scope**: Frontend only (React/TypeScript)

---

## Goals

1. Break all files >200 lines into focused modules
2. Extract business logic into custom hooks
3. Centralize TypeScript types in `src/types/`
4. Add code splitting with `React.lazy()` for performance

---

## Phases

| Phase | Description | Status | Files |
|-------|-------------|--------|-------|
| 01 | [Types Extraction](./phase-01-types-extraction.md) | Pending | `src/types/*.ts` |
| 02 | [Store Split](./phase-02-store-split.md) | Pending | `src/store/*.ts` |
| 03 | [Custom Hooks](./phase-03-custom-hooks.md) | Pending | `src/hooks/*.ts` |
| 04 | [Component Split](./phase-04-component-split.md) | Pending | `src/components/**` |
| 05 | [Performance](./phase-05-performance.md) | Pending | `App.tsx`, components |

---

## Problem Summary

| File | Lines | Issue |
|------|-------|-------|
| `src/store/useAppStore.ts` | 1039 | Types + reducer + actions all mixed |
| `src/components/Editor.tsx` | 905 | Monolithic, no hook separation |
| `src/components/IWikiAI.tsx` | 517 | AI logic + UI tightly coupled |
| `src/components/ManagerDashboard.tsx` | 534 | Approval UI + logic inline |
| `src/components/Dashboard.tsx` | 481 | Search + feed + UI all in one |
| `src/components/ArticleFullView.tsx` | 450 | Display + actions inline |
| `src/components/ArticleModal.tsx` | 372 | Large modal with inline logic |
| `src/components/MyArticles.tsx` | 263 | Filters + actions inline |
| `src/components/Profile.tsx` | 233 | Stats + badges inline |
| `src/App.tsx` | 223 | All 15+ screen imports are eager |

---

## Target Structure

```
src/
├── types/                     # NEW: all interfaces/types
│   ├── user.ts
│   ├── article.ts
│   ├── folder.ts
│   ├── notification.ts
│   ├── bounty.ts
│   └── index.ts
├── store/                     # Split into domain slices
│   ├── slices/
│   │   ├── auth-slice.ts
│   │   ├── article-slice.ts
│   │   ├── navigation-slice.ts
│   │   ├── notification-slice.ts
│   │   ├── ai-slice.ts
│   │   └── user-slice.ts
│   ├── useAppStore.ts         # Root: compose slices + persist
│   └── initial-state.ts
├── hooks/                     # NEW: custom hooks
│   ├── use-editor.ts
│   ├── use-search.ts
│   ├── use-article-actions.ts
│   ├── use-iwiki-ai.ts
│   ├── use-approval.ts
│   └── use-notifications.ts
├── components/
│   ├── editor/                # Split Editor.tsx
│   │   ├── editor-container.tsx
│   │   ├── editor-toolbar.tsx
│   │   └── editor-settings-panel.tsx
│   ├── dashboard/             # Split Dashboard.tsx
│   │   ├── dashboard-header.tsx
│   │   ├── dashboard-feed.tsx
│   │   └── dashboard-featured.tsx
│   ├── iwiki-ai/              # Split IWikiAI.tsx
│   │   ├── ai-chat-panel.tsx
│   │   ├── ai-doc-panel.tsx
│   │   └── ai-starter-cards.tsx
│   ├── manager-dashboard/     # Split ManagerDashboard.tsx
│   │   ├── approval-queue.tsx
│   │   └── approval-detail.tsx
│   └── article/               # Split ArticleModal + ArticleFullView
│       ├── article-meta.tsx
│       ├── article-actions.tsx
│       └── article-comments.tsx
└── App.tsx                    # Lazy-loaded routes
```

---

## Key Dependencies

- Phase 01 must complete before Phase 02 (store uses types)
- Phase 02 must complete before Phase 03 (hooks use store)
- Phase 03 must complete before Phase 04 (components use hooks)
- Phase 05 is independent (can run after Phase 04)
