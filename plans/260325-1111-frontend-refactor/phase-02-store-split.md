# Phase 02 — Store Split

**Priority**: High (blocks Phase 03)
**Status**: Pending
**Effort**: ~2h
**Depends on**: Phase 01 (types must be extracted first)

---

## Context Links

- Source: [src/store/useAppStore.ts](../../src/store/useAppStore.ts) (1039 lines)
- Context: [src/context/AppContext.tsx](../../src/context/AppContext.tsx)
- Plan: [plan.md](./plan.md)

---

## Overview

`useAppStore.ts` (1039 lines) mixes types, initial data, reducer logic, and localStorage persistence. Split into domain slices + a root composer.

---

## Key Insights

- Reducer has 37 action types across 8 domains — natural slice boundaries
- `saveState()` / `loadState()` (localStorage) should stay in root store
- `AppState` and `AppAction` (discriminated union) stay in root store as they compose slices
- Each slice exports: `initialState`, `reducer` function, action type constants

---

## Target Structure

```
src/store/
├── slices/
│   ├── auth-slice.ts          # LOGIN, LOGOUT, SET_ROLE, UPDATE_USER, COMPLETE_ONBOARDING
│   ├── article-slice.ts       # OPEN_EDITOR, SAVE_ARTICLE, DELETE_ARTICLE, SUBMIT/APPROVE/REJECT/PUBLISH, etc.
│   ├── navigation-slice.ts    # SET_SCREEN, SET_SEARCH_QUERY, SET_SELECTED_ARTICLE, SET_CURRENT_FOLDER
│   ├── notification-slice.ts  # ADD/MARK_READ/DELETE/MARK_ALL_READ notifications
│   ├── ai-slice.ts            # SAVE_AI_SESSION, DELETE_AI_SESSION
│   ├── user-data-slice.ts     # favorites, searchHistory, customFeedPrefs, recentReads
│   └── analytics-slice.ts     # TRACK_EVENT
├── initial-state.ts           # Default AppState value (mock data)
├── persist.ts                 # saveState() / loadState() localStorage logic
└── useAppStore.ts             # Root: composeSlices, AppState type, AppAction union, useReducer
```

---

## Slice Pattern

Each slice file follows this pattern:

```typescript
// slices/auth-slice.ts
import type { AppState } from '../useAppStore';

export type AuthAction =
  | { type: 'LOGIN'; userId: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_ROLE'; role: UserRole };

export function authReducer(state: AppState, action: AuthAction): Partial<AppState> {
  switch (action.type) {
    case 'LOGIN': { ... }
    case 'LOGOUT': { ... }
    default: return {};
  }
}
```

Root `useAppStore.ts` composes them:

```typescript
function appReducer(state: AppState, action: AppAction): AppState {
  return {
    ...state,
    ...authReducer(state, action as AuthAction),
    ...articleReducer(state, action as ArticleAction),
    // ...
  };
}
```

---

## Files to Create

| File | Lines (est.) | Action types |
|------|-------------|--------------|
| `src/store/slices/auth-slice.ts` | ~80 | LOGIN, LOGOUT, SET_ROLE, UPDATE_USER, COMPLETE_ONBOARDING |
| `src/store/slices/article-slice.ts` | ~180 | OPEN_EDITOR, SAVE_ARTICLE, DELETE_ARTICLE, SUBMIT_ARTICLE_REVIEW, APPROVE_ARTICLE, REJECT_ARTICLE, PUBLISH_APPROVED_ARTICLE, SET_ARTICLE_VIEW_PERMISSION, ADD_APPROVAL_COMMENT, TOGGLE_LIKE, ADD_COMMENT, INCREMENT_VIEWS, CREATE_BOUNTY, ACCEPT_BOUNTY, SET_SCOPE_ACCESS |
| `src/store/slices/navigation-slice.ts` | ~40 | SET_SCREEN, SET_SEARCH_QUERY, SET_SELECTED_ARTICLE, SET_CURRENT_FOLDER |
| `src/store/slices/notification-slice.ts` | ~60 | ADD_NOTIFICATION, MARK_NOTIFICATION_READ, DELETE_NOTIFICATION, MARK_ALL_READ |
| `src/store/slices/ai-slice.ts` | ~40 | SAVE_AI_SESSION, DELETE_AI_SESSION |
| `src/store/slices/user-data-slice.ts` | ~80 | TOGGLE_FAVORITE, ADD/REMOVE/CLEAR_SEARCH_HISTORY, UPDATE_CUSTOM_FEED_PREFS |
| `src/store/slices/analytics-slice.ts` | ~30 | TRACK_EVENT |
| `src/store/initial-state.ts` | ~120 | Mock users/articles/folders/bounties default data |
| `src/store/persist.ts` | ~40 | saveState(), loadState() |

## Files to Modify

| File | Change |
|------|--------|
| `src/store/useAppStore.ts` | Reduce to ~100 lines: compose slices, export AppState/AppAction |
| `src/context/AppContext.tsx` | Import path update only (no logic change) |

---

## Implementation Steps

1. Create `src/store/persist.ts` — move `saveState()` / `loadState()` from useAppStore
2. Create `src/store/initial-state.ts` — move all mock data / default state
3. Create `src/store/slices/navigation-slice.ts` (simplest, start here)
4. Create `src/store/slices/auth-slice.ts`
5. Create `src/store/slices/notification-slice.ts`
6. Create `src/store/slices/ai-slice.ts`
7. Create `src/store/slices/analytics-slice.ts`
8. Create `src/store/slices/user-data-slice.ts`
9. Create `src/store/slices/article-slice.ts` (largest, do last)
10. Rewrite `src/store/useAppStore.ts` to compose slices (~100 lines)
11. Add `RESET_DEMO_STATE` and `TOGGLE_THEME` handling in root reducer
12. Run `npm run lint` — zero errors

---

## Todo List

- [ ] Create `persist.ts`
- [ ] Create `initial-state.ts`
- [ ] Create `navigation-slice.ts`
- [ ] Create `auth-slice.ts`
- [ ] Create `notification-slice.ts`
- [ ] Create `ai-slice.ts`
- [ ] Create `analytics-slice.ts`
- [ ] Create `user-data-slice.ts`
- [ ] Create `article-slice.ts`
- [ ] Rewrite root `useAppStore.ts`
- [ ] Run lint — zero errors

---

## Success Criteria

- Root `useAppStore.ts` ≤ 100 lines
- Each slice ≤ 200 lines
- All reducer logic preserved (no behavioral change)
- `npm run lint` passes

---

## Risk

- Medium: large refactor with many moving parts
- Mitigation: TypeScript discriminated union will catch missing action handlers
- RESET_DEMO_STATE touches all state slices — handle in root reducer, not slices
