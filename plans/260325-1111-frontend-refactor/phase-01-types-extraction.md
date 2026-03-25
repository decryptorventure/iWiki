# Phase 01 — Types Extraction

**Priority**: Critical (blocks all other phases)
**Status**: Pending
**Effort**: ~1h

---

## Context Links

- Source: [src/store/useAppStore.ts](../../src/store/useAppStore.ts) (lines 1–120, all type definitions)
- Plan: [plan.md](./plan.md)

---

## Overview

All domain types are currently embedded in `useAppStore.ts`. Extracting them to `src/types/` decouples types from state logic, enables tree-shaking, and makes imports explicit across the codebase.

---

## Key Insights

- `useAppStore.ts` exports 20+ types/interfaces alongside reducer logic
- Many components import types directly from `useAppStore.ts` — imports must be updated
- `AppState` and `AppAction` stay in store layer, not in types (they are store-specific)

---

## Files to Create

| File | Contents |
|------|----------|
| `src/types/user.ts` | `UserRole`, `AccessLevel`, `Badge`, `ScopeAccess`, `User` |
| `src/types/article.ts` | `ArticleStatus`, `Comment`, `ApprovalRecord`, `ApprovalInlineComment`, `Article` |
| `src/types/folder.ts` | `Folder` |
| `src/types/notification.ts` | `NotificationType`, `Notification` |
| `src/types/bounty.ts` | `Bounty` |
| `src/types/analytics.ts` | `AnalyticsEvent` |
| `src/types/feed.ts` | `CustomFeedPrefs`, `RecentReadItem`, `AIChatSession`, `Citation` |
| `src/types/index.ts` | Re-export all from above |

## Files to Modify

| File | Change |
|------|--------|
| `src/store/useAppStore.ts` | Remove type definitions, import from `src/types/` |
| `src/lib/permissions.ts` | Update import path |
| `src/lib/rag.ts` | Update import path |
| `src/context/AppContext.tsx` | Update import path |
| All `src/components/*.tsx` | Update type imports |

---

## Implementation Steps

1. Create `src/types/user.ts` — extract `UserRole`, `AccessLevel`, `Badge`, `ScopeAccess`, `User`
2. Create `src/types/article.ts` — extract `ArticleStatus`, `Comment`, `ApprovalRecord`, `ApprovalInlineComment`, `Article`
3. Create `src/types/folder.ts` — extract `Folder`
4. Create `src/types/notification.ts` — extract `NotificationType`, `Notification`
5. Create `src/types/bounty.ts` — extract `Bounty`
6. Create `src/types/analytics.ts` — extract `AnalyticsEvent`
7. Create `src/types/feed.ts` — extract `CustomFeedPrefs`, `RecentReadItem`, `AIChatSession`, `Citation`
8. Create `src/types/index.ts` — re-export all types
9. Update `useAppStore.ts`: replace inline type defs with `import type { ... } from '../types'`
10. Update all files that import types from `useAppStore.ts`
11. Run `npm run lint` to verify no import errors

---

## Todo List

- [ ] Create `src/types/user.ts`
- [ ] Create `src/types/article.ts`
- [ ] Create `src/types/folder.ts`
- [ ] Create `src/types/notification.ts`
- [ ] Create `src/types/bounty.ts`
- [ ] Create `src/types/analytics.ts`
- [ ] Create `src/types/feed.ts`
- [ ] Create `src/types/index.ts`
- [ ] Update all import paths
- [ ] Run lint — zero errors

---

## Success Criteria

- All types live in `src/types/`
- `useAppStore.ts` has zero type definitions (only `AppState` and `AppAction` remain)
- `npm run lint` passes clean
- No runtime behavior change

---

## Risk

- Low: pure refactor, no logic change
- Risk: missing an import update → TypeScript catches it immediately
