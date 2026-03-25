# iWiki - Codebase Summary

**Document Version**: 2.0
**Last Updated**: 2026-03-25
**Status**: Active
**Owner**: Engineering Team

---

## 1. Project Overview

iWiki is a React 19 + TypeScript SPA (Single Page Application) serving as an intelligent knowledge hub for internal documentation. The application enables employees to create, search, approve, and gamify knowledge sharing.

**Key Stats** (as of v0.2.0 - Post Refactoring):
- **Frontend Bundle**: 611 kB (down from 2,710 kB with code-splitting)
- **TypeScript**: 100% type coverage
- **Components**: 26 page/feature components + 5 UI primitives
- **Custom Hooks**: 6 reusable hooks for business logic
- **Type Modules**: 9 domain-specific type files
- **Helper Libraries**: 6 utility/data modules

---

## 2. Directory Structure

### 2.1 Root-Level Organization

```
iWiki/
├── docs/                          # Project documentation (specs, architecture, roadmap)
│   ├── project-overview-pdr.md    # Product requirements document
│   ├── system-architecture.md     # Technical architecture & design
│   ├── code-standards.md          # Coding conventions & best practices
│   ├── codebase-summary.md        # This file (file catalog)
│   ├── development-roadmap.md     # Project milestones & timeline (planned)
│   └── project-changelog.md       # Change history & releases (planned)
├── plans/                         # Implementation plans & research
│   ├── reports/                   # Scout, planner, and analysis reports
│   │   ├── scout-260325-codebase-analysis.md
│   │   └── planner-260325-documentation-setup.md
│   └── 260325-1111-frontend-refactor/
│       ├── plan.md                # Phase overview
│       ├── phase-01-types-extraction.md
│       ├── phase-02-store-split.md
│       ├── phase-03-custom-hooks.md
│       ├── phase-04-component-split.md
│       └── phase-05-performance.md
├── libs/                          # Vendored packages (.tgz)
│   ├── tiptap-kit-0.2.7.tgz       # Custom Tiptap extensions
│   └── ui-kit-1.1.1.tgz           # Toast notifications, UI components
├── public/                        # Static assets
├── src/
│   ├── components/                # 26 page/feature components
│   ├── hooks/                     # 6 custom React hooks
│   ├── lib/                       # Utility & helper modules
│   ├── store/                     # State management (Zustand-style)
│   ├── types/                     # TypeScript type definitions
│   ├── ui/                        # 5 reusable UI primitives
│   ├── tiptap/                    # Rich text editor components
│   ├── context/                   # React Context providers
│   ├── constants/                 # Application constants
│   ├── data/                      # Mock data & seed data
│   ├── App.tsx                    # Root component (216 lines)
│   └── main.tsx                   # Entry point
├── .env.example                   # Environment variables template
├── vite.config.ts                 # Build configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies & scripts
├── tailwind.config.cjs            # Tailwind CSS configuration
└── CLAUDE.md                      # Claude Agent instructions
```

---

## 3. Source Organization (`src/`)

### 3.1 Components (`src/components/`)

26 components organized by feature domain:

#### Page/Screen Components
These are full-screen layouts rendered by `app-screen-router.tsx`:

| Component | Lines | Purpose | Status |
|-----------|-------|---------|--------|
| **Dashboard.tsx** | ~180 | Main hub: featured articles, search | Refactored |
| **Editor.tsx** | ~150 | Article creation/editing wrapper | Refactored |
| **IWikiAI.tsx** | ~140 | AI assistant chat interface | Refactored |
| **MyArticles.tsx** | ~140 | User's articles with filters | Refactored |
| **Profile.tsx** | ~160 | User profile, stats, badges | Active |
| **Bounties.tsx** | ~170 | Bounty browsing & management | Active |
| **AdminDashboard.tsx** | ~150 | Admin analytics & management | Active |
| **ManagerDashboard.tsx** | ~130 | Manager approval queue | Active |
| **FolderView.tsx** | ~120 | Folder browsing with pagination | Active |
| **CustomFeed.tsx** | ~100 | Personalized content feed | Active |
| **Favorites.tsx** | ~90 | Bookmarked articles grid | Active |
| **Notifications.tsx** | ~85 | Notification center | Active |
| **DataJanitor.tsx** | ~140 | Data quality & cleanup tools | Active |
| **DocumentManagement.tsx** | ~150 | Bulk article operations | Active |
| **PermissionManagement.tsx** | ~140 | User-folder access control | Active |
| **SearchResult.tsx** | ~100 | Full-text search results | Active |
| **ArticleFullView.tsx** | ~180 | Article detail page | Refactored |
| **Login.tsx** | ~120 | Mock login (preset users) | Active |
| **OnboardingTour.tsx** | ~110 | First-time user guide | Active |
| **PersonalizedFeed.tsx** | ~120 | Smart recommendations | Active |
| **ComingSoonModal.tsx** | ~30 | Placeholder for future features | Active |
| **ArticleModal.tsx** | ~80 | Modal article preview | Refactored |
| **AIDocEditor.tsx** | ~160 | Rich editor for AI-generated docs | Active |
| **EmptyFolderBounty.tsx** | ~90 | Empty folder state with bounty | Active |
| **NotificationBell.tsx** | ~60 | Bell icon + dropdown | Active |
| **Sidebar.tsx** | ~180 | Navigation sidebar | Refactored |

#### Sub-Components (Post-Refactoring)

Extracted from large parent components:

**Dashboard Sub-Components**:
- `dashboard-hero-search.tsx` (~80 lines) - Search banner
- `dashboard-featured-articles.tsx` (~100 lines, React.memo) - Featured articles grid
- `dashboard-all-articles.tsx` (~110 lines, React.memo) - All articles list
- `dashboard-right-sidebar.tsx` (~90 lines, React.memo) - Info sidebar

**Editor Sub-Components**:
- `editor-ai-chat-panel.tsx` (~120 lines) - AI assistant chat
- `editor-publish-modal.tsx` (~100 lines) - Publish dialog
- `editor-template-modal.tsx` (~90 lines) - Template selector

**IWikiAI Sub-Components**:
- `iwiki-ai-history-sidebar.tsx` (~100 lines) - Chat history panel

**Shared Components**:
- `article-markdown-renderer.tsx` (~120 lines) - Markdown rendering (used by ArticleModal + ArticleFullView)
- `my-article-card.tsx` (~80 lines) - Article card component
- `profile-badge-grid.tsx` (~70 lines) - Badge display grid

**Router**:
- `app-screen-router.tsx` (~150 lines) - Screen routing with lazy loading

---

### 3.2 Hooks (`src/hooks/`)

6 custom React hooks extracting business logic:

| Hook | Lines | Purpose |
|------|-------|---------|
| **use-search.ts** | ~50 | Search query + debouncing (200ms) |
| **use-article-actions.ts** | ~60 | Create, edit, delete, submit articles |
| **use-approval.ts** | ~35 | Approve/reject article workflows |
| **use-editor.ts** | ~65 | Editor state & template management |
| **use-iwiki-ai.ts** | ~50 | AI chat history & responses |
| **use-notifications.ts** | ~20 | Notification CRUD operations |

**Usage Pattern**:
```typescript
// Components call hooks for business logic
const { search, results } = useSearch(query);
const { saveArticle, deleteArticle } = useArticleActions();
```

---

### 3.3 Types (`src/types/`)

9 modular type definition files (post-refactoring):

| File | Lines | Exports |
|------|-------|---------|
| **index.ts** | ~20 | Central re-exports |
| **user.ts** | ~30 | `User`, `UserRole`, `ScopeAccess` |
| **article.ts** | ~50 | `Article`, `ArticleStatus`, `ApprovalRecord` |
| **folder.ts** | ~15 | `Folder` |
| **bounty.ts** | ~20 | `Bounty`, `BountyStatus` |
| **notification.ts** | ~15 | `Notification`, `NotificationType` |
| **ai.ts** | ~10 | `AIChatSession`, `AIMessage` |
| **analytics.ts** | ~15 | `AnalyticsEvent`, `EventType` |
| **feed.ts** | ~10 | `CustomFeedPrefs`, `RecentReadItem` |

**Before Refactoring**: All types in `useAppStore.ts` (~200 lines of type definitions)
**After Refactoring**: Dedicated module per domain, clean imports

---

### 3.4 Store (`src/store/`)

State management using React Context + useReducer pattern:

| File | Lines | Purpose |
|------|-------|---------|
| **useAppStore.ts** | ~500 | Core reducer logic, state initialization |
| **persist.ts** | ~30 | localStorage persistence helper |

**State Structure**:
```typescript
interface AppState {
  // Auth & User
  isLoggedIn, currentUser, userRole

  // Navigation
  currentScreen, searchQuery, selectedArticleId, currentFolderId

  // Content
  articles, folders, bounties, notifications

  // Editor
  editorData

  // AI
  aiHistory

  // User Data
  searchHistory, favoritesByUser, customFeedPrefs, recentReadsByUser

  // Analytics
  analyticsEvents
}
```

**Reducer Actions**: 37 typed action creators

---

### 3.5 Libraries (`src/lib/`)

Utility modules for business logic, AI, and data:

| File | Lines | Purpose |
|------|-------|---------|
| **permissions.ts** | ~50 | RBAC logic: `can()` permission checks |
| **analytics.ts** | ~60 | Event tracking utilities |
| **rag.ts** | ~120 | RAG (Retrieval-Augmented Generation) implementation |
| **editor-templates-data.ts** | ~50 | Template definitions for editor |
| **editor-ai-helpers.ts** | ~70 | AI prompt templates & helpers |
| **iwiki-ai-mock-responses.ts** | ~250 | Mock AI responses for demo |

---

### 3.6 UI Primitives (`src/ui/`)

5 reusable, unstyled UI components:

| Component | Purpose |
|-----------|---------|
| **Button.tsx** | Styled button with variants |
| **Input.tsx** | Text input field |
| **Modal.tsx** | Modal dialog wrapper |
| **Card.tsx** | Card container |
| **IconButton.tsx** | Icon-only button |
| **cn.ts** | Class name merger (Tailwind utility) |

---

### 3.7 Tiptap (`src/tiptap/`)

Rich text editor configuration and components:

| File | Purpose |
|------|---------|
| **notion-like-editor.tsx** | Main editor instance |
| **notion-like-editor-header.tsx** | Editor toolbar |
| **notion-like-editor-toolbar-floating.tsx** | Floating toolbar |
| **notion-like-editor-mobile-toolbar.tsx** | Mobile toolbar |
| **data/content.json** | Rich content example |

**Extensions**: 25+ Tiptap extensions (heading, bold, italic, table, math, emoji, etc.)

---

### 3.8 Context (`src/context/`)

React Context providers:

| File | Purpose |
|------|---------|
| **AppContext.tsx** | Global state provider + `useApp()` hook |

---

### 3.9 Constants (`src/constants/`)

Application-wide constants:

| File | Purpose |
|------|---------|
| **screens.ts** | Screen identifiers (dashboard, ai, profile, etc.) |

---

### 3.10 Data (`src/data/`)

Mock data and seed data:

| File | Lines | Purpose |
|------|-------|---------|
| **mock-data.ts** | ~300 | Initial articles, users, bounties |
| **articleContents.ts** | ~200 | Rich content examples in Tiptap JSON |

---

## 4. Performance Optimizations (v0.2.0)

### 4.1 Code-Splitting with React.lazy()

Implemented in `app-screen-router.tsx`:

```typescript
const Dashboard = lazy(() => import('./Dashboard'));
const Editor = lazy(() => import('./Editor'));
const IWikiAI = lazy(() => import('./IWikiAI'));
// ... 23 more lazy imports

<Suspense fallback={<ScreenFallback />}>
  {/* Rendered screen */}
</Suspense>
```

**Results**:
- Main bundle: 2,710 kB → 611 kB (77% reduction)
- Each screen loads on-demand
- Suspense fallback shows loading spinner

### 4.2 Component Memoization

Applied `React.memo()` to expensive components:

```typescript
export default React.memo(DashboardFeaturedArticles);
export default React.memo(DashboardAllArticles);
export default React.memo(DashboardRightSidebar);
```

**Benefits**: Prevents unnecessary re-renders when parent re-renders

### 4.3 Search Debouncing

200ms debounce in `use-search.ts`:

```typescript
const debouncedSearch = useMemo(
  () => debounce((q: string) => search(q), 200),
  [search]
);
```

**Benefits**: Reduces API calls during rapid typing

---

## 5. Data Models

### 5.1 User Model
```typescript
interface User {
  id: string;
  name: string;
  role: 'admin' | 'manager' | 'editor' | 'viewer';
  title: string;
  avatar: string;
  level: number; // Gamification
  xp: number;
  coins: number;
  badges: Badge[];
  scopes: ScopeAccess[]; // Folder permissions
}
```

### 5.2 Article Model
```typescript
interface Article {
  id: string;
  title: string;
  content: string; // Tiptap JSON
  excerpt?: string;
  coverUrl?: string;
  folderId: string;
  tags: string[];
  author: User;
  status: 'draft' | 'in_review' | 'approved' | 'rejected' | 'published';
  viewPermission: 'public' | 'restricted';
  views: number;
  likes: number;
  likedBy: string[];
  comments: Comment[];
  approval?: ApprovalRecord;
  createdAt: string;
  updatedAt: string;
}
```

### 5.3 Bounty Model
```typescript
interface Bounty {
  id: string;
  title: string;
  description: string;
  requester: string; // Team name
  requesterId: string;
  reward: number; // Coins
  deadline: string;
  tags: string[];
  hot: boolean; // Featured
  acceptedBy: string[];
  status: 'open' | 'accepted' | 'completed';
  createdAt: string;
}
```

---

## 6. Dependencies

### 6.1 Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | 19.0.0 | UI framework |
| typescript | 5.8.2 | Type safety |
| vite | 6.2.0 | Build tool |

### 6.2 UI & Styling

| Package | Version | Purpose |
|---------|---------|---------|
| tailwindcss | 4.1.14 | Utility-first CSS |
| @ariakit/react | 0.4.24 | Accessible UI primitives |
| lucide-react | 0.546.0 | Icon library |
| motion | 12.23.24 | Animations (Framer Motion) |

### 6.3 Rich Text Editor

| Package | Version | Purpose |
|---------|---------|---------|
| @tiptap/react | 3.20.4 | Headless editor |
| @tiptap/starter-kit | 3.20.4 | Essential extensions |
| yjs | 13.6.30 | Real-time collaboration CRDT |

### 6.4 AI Integration

| Package | Version | Purpose |
|---------|---------|---------|
| @google/genai | 1.29.0 | Gemini API client |

### 6.5 Vendored Packages

```
libs/
├── tiptap-kit-0.2.7.tgz     # @frontend-team/tiptap-kit
└── ui-kit-1.1.1.tgz         # @frontend-team/ui-kit
```

Installed locally to avoid network timeouts during Vercel deployment.

---

## 7. Build & Deployment

### 7.1 Build Process

```bash
npm run build  # Vite → dist/
npm run dev    # Dev server with HMR
npm run lint   # TypeScript type check (tsc --noEmit)
```

### 7.2 Deployment

- **Frontend**: Vercel (static hosting)
- **Environment**: `.env.local` with `GEMINI_API_KEY`
- **Build Output**: `dist/` directory
- **Status**: Live at https://ai.studio/apps/bd6dfae7-2286-488e-a0c0-a287f2d022e7

---

## 8. Key Patterns & Conventions

### 8.1 Component Patterns

```typescript
// Function components with hooks
export default function ComponentName() {
  const { state, dispatch } = useApp(); // Global state
  const [localState, setLocalState] = useState(); // Local state

  useEffect(() => {}, [deps]);

  return <div>...</div>;
}

// Sub-components with memoization
export const SubComponent = React.memo(function SubComponent(props) {
  return <div>...</div>;
});
```

### 8.2 State Access Pattern

```typescript
// All components use AppContext hook
const { state, dispatch } = useApp();

// State changes via actions
dispatch({ type: 'SAVE_ARTICLE', payload: article });
dispatch({ type: 'TOGGLE_LIKE', articleId, userId });
```

### 8.3 Type Safety

- 100% TypeScript, no `any` (except where necessary)
- Strict mode enabled
- Interfaces for all data structures
- Union types for status fields

### 8.4 File Naming

- Components: PascalCase (e.g., `Dashboard.tsx`)
- Sub-components: kebab-case (e.g., `dashboard-hero-search.tsx`)
- Hooks: kebab-case with `use-` prefix (e.g., `use-search.ts`)
- Utilities: kebab-case (e.g., `editor-templates-data.ts`)

---

## 9. Testing & Quality

**Current Status**: No automated tests

**Planned**:
- Vitest for unit tests
- Playwright for e2e tests
- React Testing Library for component tests

---

## 10. Known Issues & Technical Debt

| Issue | Priority | Status |
|-------|----------|--------|
| API key exposed in client bundle | P0 | Pending backend implementation |
| No backend/database | P0 | Design phase |
| useAppStore.ts large (500 lines) | P1 | Post-refactor, monitor |
| No error boundaries | P2 | Planned |
| No automated tests | P2 | Not started |

---

## 11. Glossary

| Term | Definition |
|------|-----------|
| **RBAC** | Role-Based Access Control |
| **RAG** | Retrieval-Augmented Generation |
| **CRDT** | Conflict-free Replicated Data Type (Yjs) |
| **SPA** | Single Page Application |
| **Tiptap** | Headless rich text editor |
| **Yjs** | CRDT library for real-time collaboration |

---

## Related Documents

- [Product Overview & PDR](./project-overview-pdr.md)
- [System Architecture](./system-architecture.md)
- [Code Standards](./code-standards.md)
- [Development Roadmap](./development-roadmap.md)
- [Project Changelog](./project-changelog.md)

---

**Document End**
