# Phase 05 — Performance Optimization

**Priority**: Medium
**Status**: Pending
**Effort**: ~1.5h
**Depends on**: Phase 04 (components must be split before lazy-loading)

---

## Context Links

- Source: [src/App.tsx](../../src/App.tsx)
- Screen router: `src/components/app-screen-router.tsx` (created in Phase 04)
- Plan: [plan.md](./plan.md)

---

## Overview

With components split (Phase 04), apply three performance layers:
1. **Code splitting** via `React.lazy()` — reduce initial bundle
2. **Memoization** via `React.memo` + `useMemo` — reduce re-renders
3. **Search debounce** — reduce search execution on keystroke

---

## 1. Code Splitting — `React.lazy()`

Currently all 15+ page components are eagerly imported in `App.tsx`. Apply lazy loading so only the current screen's code is loaded.

**Change in `src/components/app-screen-router.tsx`:**

```typescript
import React, { lazy, Suspense } from 'react';

// Lazy load all page-level components
const Dashboard = lazy(() => import('./Dashboard'));
const IWikiAI = lazy(() => import('./IWikiAI'));
const Editor = lazy(() => import('./Editor'));
const ManagerDashboard = lazy(() => import('./ManagerDashboard'));
const AdminDashboard = lazy(() => import('./AdminDashboard'));
const Profile = lazy(() => import('./Profile'));
const MyArticles = lazy(() => import('./MyArticles'));
const Bounties = lazy(() => import('./Bounties'));
const Favorites = lazy(() => import('./Favorites'));
const CustomFeed = lazy(() => import('./CustomFeed'));
const SearchResult = lazy(() => import('./SearchResult'));
const Notifications = lazy(() => import('./Notifications'));
const DocumentManagement = lazy(() => import('./DocumentManagement'));
const PermissionManagement = lazy(() => import('./PermissionManagement'));
const DataJanitor = lazy(() => import('./DataJanitor'));
const FolderView = lazy(() => import('./FolderView'));
const ArticleFullView = lazy(() => import('./ArticleFullView'));
const EmptyFolderBounty = lazy(() => import('./EmptyFolderBounty'));

// Keep Sidebar, NotificationBell, Login, ArticleModal, OnboardingTour EAGER
// (always shown / shown before content loads)

function ScreenFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
    </div>
  );
}

export function renderScreen(currentScreen: string, state: AppState, dispatch: Dispatch) {
  return (
    <Suspense fallback={<ScreenFallback />}>
      {/* switch statement here */}
    </Suspense>
  );
}
```

**Expected bundle impact**: Initial JS payload reduced by ~60% (Tiptap editor alone is large).

---

## 2. Memoization

### `React.memo` candidates

Components that receive stable props but re-render due to parent state updates:

| Component | Wrap with memo? | Reason |
|-----------|----------------|--------|
| `Sidebar` | Yes | Only re-renders on role/screen change |
| `dashboard-featured-articles.tsx` | Yes | Articles list rarely changes |
| `profile-badge-grid.tsx` | Yes | Badges are static per session |
| `my-article-card.tsx` | Yes | Per-article card, only rerenders when that article changes |
| `article-action-bar.tsx` | Yes | Pure UI based on article props |

**Pattern:**
```typescript
export default React.memo(function MyArticleCard({ article, onEdit, onDelete }: Props) {
  // ...
});
```

### `useMemo` candidates

| Location | Computation |
|----------|-------------|
| `use-search.ts` | Filter articles list |
| `dashboard-article-feed.tsx` | Sort articles by tab (Recent/Popular/Trending) |
| `ManagerDashboard` | Filter `in_review` articles by scope |
| `Favorites` | Filter favorited articles |
| `CustomFeed` | Filter articles by user prefs |

**Pattern:**
```typescript
const sortedArticles = useMemo(() =>
  [...articles].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
  [articles]
);
```

---

## 3. Search Debounce

Currently search filters on every keystroke. Add 300ms debounce in `use-search.ts`:

```typescript
// src/hooks/use-search.ts
import { useState, useMemo, useEffect } from 'react';

export function useSearch() {
  const [rawQuery, setRawQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(rawQuery), 300);
    return () => clearTimeout(timer);
  }, [rawQuery]);

  const results = useMemo(() =>
    filterArticles(articles, debouncedQuery),
    [articles, debouncedQuery]
  );

  return { query: rawQuery, setQuery: setRawQuery, results, ... };
}
```

---

## Implementation Steps

1. Add `React.lazy()` imports + `<Suspense>` wrapper in `app-screen-router.tsx`
2. Create `ScreenFallback` spinner component (inline or in `src/ui/`)
3. Add `React.memo()` to: `Sidebar`, `my-article-card.tsx`, `profile-badge-grid.tsx`, `article-action-bar.tsx`, `dashboard-featured-articles.tsx`
4. Add `useMemo` in `dashboard-article-feed.tsx` for sort
5. Add `useMemo` in `use-search.ts` for filter results
6. Add 300ms debounce to `use-search.ts`
7. Run `npm run build` — verify bundle splits (check `dist/` for separate chunks)
8. Run `npm run lint`

---

## Todo List

- [ ] Add `React.lazy()` to `app-screen-router.tsx`
- [ ] Add `<Suspense>` with `ScreenFallback`
- [ ] `React.memo` on `Sidebar`
- [ ] `React.memo` on `my-article-card.tsx`, `profile-badge-grid.tsx`, `article-action-bar.tsx`, `dashboard-featured-articles.tsx`
- [ ] `useMemo` for article sort in feed
- [ ] `useMemo` for filter in `use-search.ts`
- [ ] 300ms debounce in `use-search.ts`
- [ ] `npm run build` — verify chunks created

---

## Success Criteria

- Vite build produces separate chunks for lazily-loaded pages (visible in `dist/assets/`)
- Initial bundle does NOT include `Editor` / `IWikiAI` / `ManagerDashboard` chunks
- `npm run build` and `npm run lint` pass

---

## Risk

- Low: `React.lazy()` is standard React pattern
- Edge case: `ArticleModal` is shown from many screens — keep it eager (it's in `App.tsx` always mounted)
- Keep `Login`, `Sidebar`, `OnboardingTour` eager (always needed on first paint)
