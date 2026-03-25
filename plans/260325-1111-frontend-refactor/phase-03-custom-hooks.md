# Phase 03 — Custom Hooks

**Priority**: High (unblocks Phase 04 component splitting)
**Status**: Pending
**Effort**: ~2h
**Depends on**: Phase 02 (hooks consume store slices)

---

## Context Links

- Source components: [src/components/](../../src/components/)
- Store: [src/store/useAppStore.ts](../../src/store/useAppStore.ts)
- Plan: [plan.md](./plan.md)

---

## Overview

Business logic is currently inlined inside large components. Extract to `src/hooks/` so components become thin rendering shells. Each hook owns one domain of logic.

---

## Hooks to Create

### `src/hooks/use-search.ts`
Extracted from: `Dashboard.tsx`

```typescript
export function useSearch() {
  const { state, dispatch } = useApp();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const results = useMemo(() =>
    state.articles.filter(a =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, 4),
    [state.articles, query]
  );

  const submitSearch = (q: string) => {
    dispatch({ type: 'ADD_SEARCH_HISTORY', query: q });
    dispatch({ type: 'SET_SEARCH_QUERY', query: q });
    dispatch({ type: 'SET_SCREEN', screen: 'search' });
  };

  return { query, setQuery, results, isOpen, setIsOpen, submitSearch,
           history: state.searchHistory };
}
```

---

### `src/hooks/use-article-actions.ts`
Extracted from: `ArticleModal.tsx`, `ArticleFullView.tsx`, `MyArticles.tsx`

```typescript
export function useArticleActions(articleId: string) {
  const { state, dispatch } = useApp();
  const article = state.articles.find(a => a.id === articleId);
  const currentUser = state.currentUser;

  const isLiked = article?.likedBy.includes(currentUser.id) ?? false;
  const isFavorited = (state.favoritesByUser[currentUser.id] ?? []).includes(articleId);

  return {
    article,
    isLiked,
    isFavorited,
    toggleLike: () => dispatch({ type: 'TOGGLE_LIKE', articleId, userId: currentUser.id }),
    toggleFavorite: () => dispatch({ type: 'TOGGLE_FAVORITE', articleId, userId: currentUser.id }),
    addComment: (content: string) => dispatch({ type: 'ADD_COMMENT', articleId, content, author: currentUser }),
    deleteArticle: () => dispatch({ type: 'DELETE_ARTICLE', articleId }),
    submitReview: () => dispatch({ type: 'SUBMIT_ARTICLE_REVIEW', articleId }),
  };
}
```

---

### `src/hooks/use-editor.ts`
Extracted from: `Editor.tsx`

```typescript
export function useEditor(initialData: Partial<Article> | null) {
  const { state, dispatch } = useApp();
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [content, setContent] = useState(initialData?.content ?? '');
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? []);
  const [folderId, setFolderId] = useState(initialData?.folderId ?? '');
  const [coverUrl, setCoverUrl] = useState(initialData?.coverUrl ?? '');
  const [isDirty, setIsDirty] = useState(false);

  const isEdit = !!initialData?.id;

  const save = (status: ArticleStatus = 'draft') => {
    dispatch({ type: 'SAVE_ARTICLE', article: { ...initialData, title, content, tags, folderId, coverUrl, status } });
  };

  return { title, setTitle, content, setContent, tags, setTags,
           folderId, setFolderId, coverUrl, setCoverUrl, isDirty, setIsDirty,
           isEdit, save, folders: state.folders };
}
```

---

### `src/hooks/use-iwiki-ai.ts`
Extracted from: `IWikiAI.tsx`

```typescript
export function useIWikiAI() {
  const { state, dispatch } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const sendMessage = async (text: string) => { ... };
  const newSession = () => { ... };
  const loadSession = (sessionId: string) => { ... };
  const deleteSession = (sessionId: string) => dispatch({ type: 'DELETE_AI_SESSION', sessionId });

  return { messages, input, setInput, isLoading, activeSessionId,
           sessions: state.aiHistory, sendMessage, newSession, loadSession, deleteSession };
}
```

---

### `src/hooks/use-approval.ts`
Extracted from: `ManagerDashboard.tsx`

```typescript
export function useApproval() {
  const { state, dispatch } = useApp();

  const pendingArticles = state.articles.filter(a => a.status === 'in_review');

  const approve = (articleId: string, summary: string) =>
    dispatch({ type: 'APPROVE_ARTICLE', articleId, reviewedBy: state.currentUser.id, summary });

  const reject = (articleId: string, reason: string) =>
    dispatch({ type: 'REJECT_ARTICLE', articleId, reviewedBy: state.currentUser.id, reason });

  const addInlineComment = (articleId: string, comment: ApprovalInlineComment) =>
    dispatch({ type: 'ADD_APPROVAL_COMMENT', articleId, comment });

  return { pendingArticles, approve, reject, addInlineComment };
}
```

---

### `src/hooks/use-notifications.ts`
Extracted from: `NotificationBell.tsx`, `Notifications.tsx`

```typescript
export function useNotifications() {
  const { state, dispatch } = useApp();

  const unreadCount = state.notifications.filter(n => !n.isRead).length;

  return {
    notifications: state.notifications,
    unreadCount,
    markRead: (id: string) => dispatch({ type: 'MARK_NOTIFICATION_READ', notificationId: id }),
    markAllRead: () => dispatch({ type: 'MARK_ALL_READ' }),
    deleteNotification: (id: string) => dispatch({ type: 'DELETE_NOTIFICATION', notificationId: id }),
  };
}
```

---

## Files to Create

| File | Extracted From | Est. Lines |
|------|---------------|-----------|
| `src/hooks/use-search.ts` | `Dashboard.tsx` | ~50 |
| `src/hooks/use-article-actions.ts` | `ArticleModal.tsx`, `ArticleFullView.tsx`, `MyArticles.tsx` | ~60 |
| `src/hooks/use-editor.ts` | `Editor.tsx` | ~80 |
| `src/hooks/use-iwiki-ai.ts` | `IWikiAI.tsx` | ~100 |
| `src/hooks/use-approval.ts` | `ManagerDashboard.tsx` | ~50 |
| `src/hooks/use-notifications.ts` | `NotificationBell.tsx`, `Notifications.tsx` | ~40 |

## Files to Modify

Each component that owns the extracted logic — replace inline logic with hook call.

---

## Implementation Steps

1. Create `src/hooks/use-notifications.ts` (simplest)
2. Update `NotificationBell.tsx` and `Notifications.tsx` to use hook
3. Create `src/hooks/use-search.ts`
4. Update `Dashboard.tsx` search section to use hook
5. Create `src/hooks/use-article-actions.ts`
6. Update `ArticleModal.tsx`, `ArticleFullView.tsx`, `MyArticles.tsx`
7. Create `src/hooks/use-approval.ts`
8. Update `ManagerDashboard.tsx`
9. Create `src/hooks/use-editor.ts`
10. Update `Editor.tsx` to use hook
11. Create `src/hooks/use-iwiki-ai.ts`
12. Update `IWikiAI.tsx` to use hook
13. Run `npm run lint`

---

## Todo List

- [ ] Create `use-notifications.ts` + update consumers
- [ ] Create `use-search.ts` + update Dashboard
- [ ] Create `use-article-actions.ts` + update consumers
- [ ] Create `use-approval.ts` + update ManagerDashboard
- [ ] Create `use-editor.ts` + update Editor
- [ ] Create `use-iwiki-ai.ts` + update IWikiAI
- [ ] Run lint — zero errors

---

## Success Criteria

- Each hook is ≤ 120 lines
- Components call hook and use returned values only (no inline dispatch logic)
- `npm run lint` passes

---

## Risk

- Low-Medium: hooks are pure extractions, same logic/state
- Watch for closure issues in `useCallback` / `useMemo` dependencies
