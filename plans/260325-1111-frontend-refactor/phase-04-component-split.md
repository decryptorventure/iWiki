# Phase 04 — Component Split

**Priority**: High
**Status**: Pending
**Effort**: ~3h
**Depends on**: Phase 03 (hooks must be extracted first)

---

## Context Links

- Sources: [src/components/](../../src/components/)
- Hooks: [src/hooks/](../../src/hooks/) (created in Phase 03)
- Plan: [plan.md](./plan.md)

---

## Overview

Split 9 components that exceed 200 lines into smaller focused sub-components. After Phase 03 extracts logic into hooks, components become mostly JSX — easier to split cleanly.

---

## Components to Split

### 1. `Editor.tsx` (905 → ~5 files)

**Target**: `src/components/editor/`

| File | Responsibility | Est. Lines |
|------|---------------|-----------|
| `editor-container.tsx` | Orchestrator, uses `useEditor` hook | ~80 |
| `editor-header.tsx` | Title input + back button + save actions | ~60 |
| `editor-settings-panel.tsx` | Folder, tags, cover image, permissions | ~80 |
| `editor-cover-image.tsx` | Cover image upload/preview | ~50 |
| `editor-publish-modal.tsx` | Confirm publish dialog | ~40 |

Old `Editor.tsx` → re-export from `editor-container.tsx` for backward compat:
```typescript
// src/components/Editor.tsx
export { default } from './editor/editor-container';
```

---

### 2. `IWikiAI.tsx` (517 → ~4 files)

**Target**: `src/components/iwiki-ai/`

| File | Responsibility | Est. Lines |
|------|---------------|-----------|
| `iwiki-ai-container.tsx` | Layout + split panel, uses `useIWikiAI` | ~60 |
| `iwiki-ai-chat-panel.tsx` | Messages list + input + history sidebar | ~100 |
| `iwiki-ai-starter-cards.tsx` | Initial suggestion cards grid | ~60 |
| `iwiki-ai-doc-panel.tsx` | AI doc editor panel (save to iWiki) | ~80 |

Old `IWikiAI.tsx` → re-export.

---

### 3. `ManagerDashboard.tsx` (534 → ~3 files)

**Target**: `src/components/manager-dashboard/`

| File | Responsibility | Est. Lines |
|------|---------------|-----------|
| `manager-dashboard-container.tsx` | Layout + stats header, uses `useApproval` | ~60 |
| `approval-queue-list.tsx` | List of pending articles | ~80 |
| `approval-detail-panel.tsx` | Article preview + approve/reject form + inline comments | ~120 |

Old `ManagerDashboard.tsx` → re-export.

---

### 4. `Dashboard.tsx` (481 → ~4 files)

**Target**: `src/components/dashboard/`

| File | Responsibility | Est. Lines |
|------|---------------|-----------|
| `dashboard-container.tsx` | Layout + search bar, uses `useSearch` | ~70 |
| `dashboard-featured-articles.tsx` | Hero card + 4 small cards grid | ~80 |
| `dashboard-article-feed.tsx` | Recent/Popular/Trending tabs + list | ~80 |
| `dashboard-search-dropdown.tsx` | Search results dropdown overlay | ~60 |

Old `Dashboard.tsx` → re-export.

---

### 5. `ArticleFullView.tsx` (450 → ~3 files)

**Target**: `src/components/article/`

| File | Responsibility | Est. Lines |
|------|---------------|-----------|
| `article-full-view-container.tsx` | Layout + metadata header, uses `useArticleActions` | ~80 |
| `article-comments-section.tsx` | Comment list + add comment form | ~80 |
| `article-action-bar.tsx` | Like, favorite, share, edit buttons | ~50 |

Old `ArticleFullView.tsx` → re-export.

---

### 6. `ArticleModal.tsx` (372 → ~3 files)

**Target**: Share `src/components/article/` folder with above

| File | Responsibility | Est. Lines |
|------|---------------|-----------|
| `article-modal-container.tsx` | Modal shell + layout, uses `useArticleActions` | ~60 |
| `article-modal-content.tsx` | Article body rendering (Tiptap JSON → HTML) | ~80 |
| `article-modal-sidebar.tsx` | Author info, tags, related articles | ~60 |

Old `ArticleModal.tsx` → re-export named export `ArticleModal`.

---

### 7. `MyArticles.tsx` (263 → ~2 files)

| File | Responsibility | Est. Lines |
|------|---------------|-----------|
| `MyArticles.tsx` (keep, slim down) | Filter tabs + article list | ~120 |
| `my-article-card.tsx` | Single article card with status badge + actions | ~80 |

---

### 8. `Profile.tsx` (233 → ~2 files)

| File | Responsibility | Est. Lines |
|------|---------------|-----------|
| `Profile.tsx` (keep, slim down) | Stats + XP bar + badges section | ~120 |
| `profile-badge-grid.tsx` | Badge collection grid | ~60 |

---

### 9. `App.tsx` (223 → ~2 files)

| File | Responsibility | Est. Lines |
|------|---------------|-----------|
| `App.tsx` (keep) | Provider + AppInner shell | ~80 |
| `app-screen-router.tsx` | `renderScreen()` switch logic | ~100 |

---

## Implementation Steps

1. Split `App.tsx` → extract `renderScreen()` to `src/components/app-screen-router.tsx`
2. Split `MyArticles.tsx` → extract `my-article-card.tsx`
3. Split `Profile.tsx` → extract `profile-badge-grid.tsx`
4. Split `ArticleModal.tsx` → `src/components/article/` folder
5. Split `ArticleFullView.tsx` → add to `src/components/article/`
6. Split `Dashboard.tsx` → `src/components/dashboard/`
7. Split `ManagerDashboard.tsx` → `src/components/manager-dashboard/`
8. Split `IWikiAI.tsx` → `src/components/iwiki-ai/`
9. Split `Editor.tsx` → `src/components/editor/`
10. Verify all old import paths still work via re-exports
11. Run `npm run lint`
12. Run `npm run build` — verify zero bundle errors

---

## Re-export Strategy

For every moved component, keep the original file as a re-export shim:

```typescript
// src/components/Editor.tsx  (shim)
export { default } from './editor/editor-container';
```

This ensures App.tsx and any other consumers need zero import changes.

---

## Todo List

- [ ] Split `App.tsx` → `app-screen-router.tsx`
- [ ] Split `MyArticles.tsx` → `my-article-card.tsx`
- [ ] Split `Profile.tsx` → `profile-badge-grid.tsx`
- [ ] Split `ArticleModal.tsx` → `src/components/article/`
- [ ] Split `ArticleFullView.tsx` → `src/components/article/`
- [ ] Split `Dashboard.tsx` → `src/components/dashboard/`
- [ ] Split `ManagerDashboard.tsx` → `src/components/manager-dashboard/`
- [ ] Split `IWikiAI.tsx` → `src/components/iwiki-ai/`
- [ ] Split `Editor.tsx` → `src/components/editor/`
- [ ] Run lint + build — zero errors

---

## Success Criteria

- Every `.tsx` file ≤ 200 lines
- All existing imports resolve (via re-export shims)
- `npm run build` passes with no errors

---

## Risk

- Medium: JSX splits can break component prop drilling
- Mitigation: re-export shims keep external API unchanged; TypeScript catches prop mismatches
- Start with smallest splits (MyArticles, Profile) to build confidence
