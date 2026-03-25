# iWiki - System Architecture

**Document Version**: 1.0
**Last Updated**: 2026-03-25
**Status**: Active
**Owner**: Engineering Team

---

## 1. Architecture Overview

### 1.1 Current Architecture (v0.1.0)

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                React SPA (iWiki)                      │  │
│  │                                                       │  │
│  │  ┌─────────────┐   ┌──────────────┐  ┌────────────┐ │  │
│  │  │  Dashboard  │   │   Editor     │  │  IWikiAI   │ │  │
│  │  │  (26 pages) │   │  (Tiptap)    │  │ (Gemini)   │ │  │
│  │  └─────────────┘   └──────────────┘  └────────────┘ │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐ │  │
│  │  │         AppContext + useReducer                 │ │  │
│  │  │         (Global State Management)               │ │  │
│  │  └─────────────────────────────────────────────────┘ │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐ │  │
│  │  │            localStorage Persistence             │ │  │
│  │  └─────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
│                            │                                 │
│                            │ HTTPS (direct API call)         │
│                            ▼                                 │
│                  ┌──────────────────┐                        │
│                  │  Google Gemini   │                        │
│                  │  API (AI)        │                        │
│                  └──────────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

**Key Characteristics**:
- **Client-side only**: No backend server
- **No database**: Data stored in browser localStorage
- **No authentication**: Mock login with preset users
- **Direct AI API calls**: Gemini API called from browser (API key exposed)

### 1.2 Target Architecture (Planned)

```
┌─────────────────────────────────────────────────────────────────────┐
│                              Browser                                 │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    React SPA (iWiki)                          │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐             │  │
│  │  │ Dashboard  │  │  Editor    │  │  IWikiAI   │             │  │
│  │  └────────────┘  └────────────┘  └────────────┘             │  │
│  │                                                               │  │
│  │  ┌─────────────────────────────────────────────────────────┐ │  │
│  │  │          AppContext (client state only)                 │ │  │
│  │  └─────────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                      │                │                              │
│                HTTPS │                │ WebSocket (Yjs)              │
│                      ▼                ▼                              │
│         ┌─────────────────┐   ┌──────────────────┐                  │
│         │  Express API    │   │  Hocuspocus WS   │                  │
│         │  (REST/GraphQL) │   │  (Collaboration) │                  │
│         └─────────────────┘   └──────────────────┘                  │
│                │                        │                            │
│                ├────────────────────────┤                            │
│                │                        │                            │
│         ┌──────▼──────┐      ┌─────────▼─────────┐                  │
│         │ PostgreSQL  │      │  Google Gemini    │                  │
│         │ + pgvector  │      │  API (server-side)│                  │
│         └─────────────┘      └───────────────────┘                  │
│                                                                      │
│         ┌───────────────────────────────────────┐                   │
│         │  Google Cloud Storage / Cloudflare R2 │                   │
│         │  (File uploads & attachments)         │                   │
│         └───────────────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

### 2.1 Frontend

#### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.0.0 | UI framework |
| TypeScript | 5.8.2 | Type safety |
| Vite | 6.2.0 | Build tool & dev server |

#### UI Libraries
| Technology | Version | Purpose |
|------------|---------|---------|
| Tailwind CSS | 4.1.14 | Styling (utility-first) |
| @tailwindcss/vite | 4.1.14 | Tailwind Vite plugin |
| Motion | 12.23.24 | Animations (Framer Motion) |
| Lucide React | 0.546.0 | Icon library |
| @ariakit/react | 0.4.24 | Accessible UI primitives |
| @floating-ui/react | 0.27.19 | Tooltips, popovers |

#### Rich Text Editor
| Technology | Version | Purpose |
|------------|---------|---------|
| @tiptap/react | 3.20.4 | Headless editor framework |
| @tiptap/starter-kit | 3.20.4 | Essential extensions |
| @tiptap/pm | 3.20.4 | ProseMirror core |
| 25+ @tiptap/extension-* | 3.20.4 | Blockquote, heading, table, math, emoji, etc. |

#### Real-time Collaboration
| Technology | Version | Purpose |
|------------|---------|---------|
| Yjs | 13.6.30 | CRDT library |
| @tiptap/y-tiptap | 3.0.2 | Tiptap + Yjs integration |
| @hocuspocus/provider | 3.4.4 | WebSocket client for Yjs |
| @hocuspocus/transformer | 3.4.4 | Document transformation |
| y-protocols | 1.0.7 | Yjs network protocols |

### 2.2 AI Integration

| Technology | Version | Purpose |
|------------|---------|---------|
| @google/genai | 1.29.0 | Google Gemini API client |
| Custom RAG | N/A | Retrieval-Augmented Generation (src/lib/rag.ts) |

### 2.3 Vendored Packages

To avoid network timeouts during Vercel deployment, two private packages are vendored as local `.tgz` files:

| Package | Version | Location | Purpose |
|---------|---------|----------|---------|
| @frontend-team/tiptap-kit | 0.2.7 | libs/tiptap-kit-0.2.7.tgz | Custom Tiptap extensions |
| @frontend-team/ui-kit | 1.1.1 | libs/ui-kit-1.1.1.tgz | UI components (toast, etc.) |

### 2.4 Future Backend (Planned)

Already included in `package.json` but not yet implemented:

| Technology | Version | Purpose |
|------------|---------|---------|
| Express | 4.21.2 | Web framework |
| better-sqlite3 | 12.4.1 | SQLite database (dev/test) |
| dotenv | 17.2.3 | Environment variables |

**Planned Production Stack**:
- PostgreSQL (with pgvector for embeddings)
- OAuth 2.0 (Google, GitHub)
- Google Cloud Storage / Cloudflare R2

### 2.5 Development Tools

| Tool | Version | Purpose |
|------|---------|---------|
| tsx | 4.21.0 | TypeScript executor |
| @types/* | Latest | TypeScript definitions |
| autoprefixer | 10.4.21 | CSS vendor prefixes |

---

## 3. Application Architecture

### 3.1 Directory Structure

```
iWiki/
├── docs/                          # Project documentation
│   ├── project-overview-pdr.md    # Product requirements
│   ├── system-architecture.md     # This file
│   ├── code-standards.md          # Coding conventions
│   ├── codebase-summary.md        # File catalog
│   ├── development-roadmap.md     # Project roadmap
│   └── project-changelog.md       # Change history
├── plans/                         # Implementation plans
│   └── reports/                   # Scout & analysis reports
├── libs/                          # Vendored packages (.tgz)
│   ├── tiptap-kit-0.2.7.tgz
│   └── ui-kit-1.1.1.tgz
├── public/                        # Static assets
├── src/
│   ├── components/                # 26 page/feature components
│   │   ├── Dashboard.tsx          # Main dashboard
│   │   ├── Login.tsx              # Mock login
│   │   ├── Editor.tsx             # Article editor wrapper
│   │   ├── IWikiAI.tsx            # AI assistant
│   │   ├── MyArticles.tsx         # User's articles
│   │   ├── Bounties.tsx           # Bounty system
│   │   ├── FolderView.tsx         # Folder browser
│   │   ├── Profile.tsx            # User profile
│   │   ├── AdminDashboard.tsx     # Admin panel
│   │   ├── ManagerDashboard.tsx   # Manager panel
│   │   └── ...                    # 16 more components
│   ├── ui/                        # 5 reusable UI primitives
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Card.tsx
│   │   ├── IconButton.tsx
│   │   └── cn.ts                  # Tailwind class merger
│   ├── tiptap/                    # 6 editor components
│   │   ├── notion-like-editor.tsx
│   │   ├── notion-like-editor-header.tsx
│   │   ├── notion-like-editor-toolbar-floating.tsx
│   │   ├── notion-like-editor-mobile-toolbar.tsx
│   │   └── data/
│   ├── context/
│   │   └── AppContext.tsx         # React Context provider
│   ├── store/
│   │   └── useAppStore.ts         # State types & reducer (1033 lines)
│   ├── lib/                       # Business logic utilities
│   │   ├── permissions.ts         # RBAC logic (52 lines)
│   │   ├── analytics.ts           # Event tracking
│   │   └── rag.ts                 # RAG implementation
│   ├── constants/
│   │   └── screens.ts             # Screen identifiers
│   ├── data/
│   │   └── articleContents.ts     # Mock article data
│   ├── App.tsx                    # Root component (216 lines)
│   └── main.tsx                   # Entry point (renders App)
├── .env.example                   # Environment template
├── vite.config.ts                 # Vite configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies & scripts
├── tailwind.config.cjs            # Tailwind configuration
└── CLAUDE.md                      # Claude Agent instructions
```

### 3.2 State Management

**Pattern**: React Context API + useReducer (centralized state)

#### State Flow

```
User Action (e.g., click "Like")
    ↓
Component calls dispatch()
    ↓
dispatch({ type: 'TOGGLE_LIKE', articleId, userId })
    ↓
appReducer() in useAppStore.ts
    ↓
Immutable state update
    ↓
saveState() → localStorage
    ↓
React re-renders affected components
```

#### AppState Interface

```typescript
interface AppState {
  // Auth & User
  isLoggedIn: boolean;
  currentUser: User;
  userRole: UserRole;

  // Navigation
  currentScreen: string;
  searchQuery: string;
  selectedArticleId: string | null;
  currentFolderId: string | null;

  // Content
  articles: Article[];
  folders: Folder[];
  bounties: Bounty[];
  notifications: Notification[];

  // Editor
  editorData: Partial<Article> | null;

  // AI
  aiHistory: AIChatSession[];

  // User Data
  searchHistory: string[];
  favoritesByUser: Record<string, string[]>;
  customFeedPrefs: CustomFeedPrefs;
  recentReadsByUser: Record<string, RecentReadItem[]>;
  onboardingCompletedForUsers: Record<string, boolean>;

  // Analytics
  analyticsEvents: AnalyticsEvent[];
}
```

#### Action Types (37 total)

State changes via typed actions dispatched to `appReducer()`:

**Authentication**:
- `LOGIN` - Log in with preset role
- `LOGOUT` - Clear session

**Navigation**:
- `SET_SCREEN` - Navigate to screen
- `SET_SEARCH_QUERY` - Update search query
- `SET_SELECTED_ARTICLE` - Open article modal
- `SET_CURRENT_FOLDER` - Navigate to folder

**Articles**:
- `OPEN_EDITOR` - Start editing article
- `SAVE_ARTICLE` - Create/update article
- `DELETE_ARTICLE` - Remove article
- `SUBMIT_ARTICLE_REVIEW` - Submit for approval
- `APPROVE_ARTICLE` - Manager approves
- `REJECT_ARTICLE` - Manager rejects
- `PUBLISH_APPROVED_ARTICLE` - Make public
- `SET_ARTICLE_VIEW_PERMISSION` - Change visibility
- `ADD_APPROVAL_COMMENT` - Inline review comment

**Engagement**:
- `TOGGLE_LIKE` - Like/unlike article
- `TOGGLE_FAVORITE` - Bookmark article
- `ADD_COMMENT` - Comment on article
- `INCREMENT_VIEWS` - Track article view

**User**:
- `SET_ROLE` - Change user role (demo)
- `UPDATE_USER` - Update user properties
- `COMPLETE_ONBOARDING` - Mark tour complete

**Bounties**:
- `CREATE_BOUNTY` - Post new bounty
- `ACCEPT_BOUNTY` - Accept bounty task

**Permissions**:
- `SET_SCOPE_ACCESS` - Update folder permissions

**Notifications**:
- `ADD_NOTIFICATION` - New notification
- `MARK_NOTIFICATION_READ` - Mark as read
- `DELETE_NOTIFICATION` - Remove notification
- `MARK_ALL_READ` - Mark all as read

**AI**:
- `SAVE_AI_SESSION` - Save chat history
- `DELETE_AI_SESSION` - Remove chat

**Search & Feed**:
- `ADD_SEARCH_HISTORY` - Track search
- `REMOVE_SEARCH_HISTORY` - Remove item
- `CLEAR_SEARCH_HISTORY` - Clear all
- `UPDATE_CUSTOM_FEED_PREFS` - Update feed settings

**Analytics**:
- `TRACK_EVENT` - Log user event

**System**:
- `RESET_DEMO_STATE` - Reset to initial state

#### Persistence Strategy

```typescript
// On every state change
appReducer() → saveState()

// saveState()
localStorage.setItem('iwiki_state', JSON.stringify({
  isLoggedIn,
  currentUser,
  articles,
  bounties,
  notifications,
  aiHistory,
  searchHistory,
  favoritesByUser,
  analyticsEvents,
  customFeedPrefs,
  recentReadsByUser,
  onboardingCompletedForUsers
}));

// On app init
initialState = {
  ...DEFAULTS,
  ...loadState() // Load from localStorage
}
```

### 3.3 Routing

**Pattern**: Screen-based navigation (no react-router)

#### Screen Constants

Defined in `src/constants/screens.ts`:

```typescript
export const APP_SCREENS = {
  DASHBOARD: 'dashboard',
  SEARCH: 'search',
  AI: 'ai',
  PROFILE: 'profile',
  MY_ARTICLES: 'my-articles',
  CUSTOM_FEED: 'custom-feed',
  FAVORITES: 'favorites',
  BOUNTIES: 'bounties',
  JANITOR: 'janitor',
  NOTIFICATIONS: 'notifications',
  DOCUMENTS: 'documents',
  PERMISSIONS: 'permissions',
  ADMIN_DASHBOARD: 'admin-dashboard',
  MANAGER_DASHBOARD: 'manager-dashboard',
  ARTICLE_DETAIL: 'article-detail',
  EDITOR: 'editor',
  EMPTY_FOLDER: 'empty-folder',
} as const;

export type AppScreen =
  | (typeof APP_SCREENS)[keyof typeof APP_SCREENS]
  | `folder-${string}`; // Dynamic folder routes
```

#### Navigation Flow

```typescript
// User clicks sidebar link
dispatch({ type: 'SET_SCREEN', screen: 'my-articles' })

// State updates
state.currentScreen = 'my-articles'

// App.tsx renders
<AppInner>
  {renderScreen() // Switch based on currentScreen}
</AppInner>

// renderScreen() switch
switch (currentScreen) {
  case 'dashboard': return <Dashboard />;
  case 'my-articles': return <MyArticles />;
  case 'ai': return <IWikiAI />;
  // ... 15+ more cases
  default: return <div>Coming soon...</div>;
}
```

**Dynamic Routes**:
- `folder-${folderId}` - Folder views (e.g., `folder-know-how`)
- Parsed in `renderScreen()` to extract folderId

### 3.4 Component Architecture

#### Component Types

1. **Page Components** (26 files in `src/components/`)
   - Default export
   - Full-screen layouts
   - Examples: `Dashboard`, `Editor`, `Profile`

2. **UI Primitives** (5 files in `src/ui/`)
   - Named exports
   - Reusable building blocks
   - Examples: `Button`, `Modal`, `Card`

3. **Editor Components** (6 files in `src/tiptap/`)
   - Tiptap-specific
   - Examples: `notion-like-editor`, `toolbar-floating`

#### Component Patterns

```typescript
// Function components with hooks
export default function Dashboard({ onSearch }: Props) {
  const { state, dispatch } = useApp(); // Global state
  const [localState, setLocalState] = useState(); // Local state

  useEffect(() => {
    // Side effects
  }, [dependencies]);

  return <div>...</div>;
}
```

#### Context Access

```typescript
// src/context/AppContext.tsx provides:
const { state, dispatch } = useApp();

// Used in every component to access global state
```

---

## 4. Data Models

### 4.1 Core Entities

#### User
```typescript
type UserRole = 'admin' | 'manager' | 'editor' | 'viewer';
type AccessLevel = 'none' | 'read' | 'write' | 'approve' | 'admin';

interface User {
  id: string;
  name: string;
  role: UserRole;
  title: string; // Job title
  avatar: string;
  level: number; // Gamification level
  xp: number;
  xpToNext: number;
  coins: number;
  badges: Badge[];
  scopes: ScopeAccess[]; // Folder permissions
}
```

#### Article
```typescript
type ArticleStatus = 'draft' | 'in_review' | 'approved' | 'rejected' | 'published';

interface Article {
  id: string;
  title: string;
  content: string; // Tiptap JSON
  excerpt?: string;
  coverUrl?: string;
  folderId: string;
  tags: string[];
  author: User;
  status: ArticleStatus;
  viewPermission: 'public' | 'restricted';
  allowComments: boolean;
  views: number;
  likes: number;
  likedBy: string[];
  comments: Comment[];
  approval?: ApprovalRecord;
  createdAt: string;
  updatedAt: string;
}
```

#### Folder
```typescript
interface Folder {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  icon?: string;
  color?: string;
  children?: Folder[];
  articleCount?: number;
}
```

### 4.2 Article Status Lifecycle

```
     draft
       │
       ↓ [Submit Review]
   in_review ←─────────────┐
       │                   │
       ↓ [Manager Action]  │ [Revise & Resubmit]
    ┌──┴──┐               │
    ↓     ↓               │
approved  rejected ────────┘
    │
    ↓ [Publish]
 published
```

### 4.3 Permission Model

```
User
  ├─ role: UserRole (global)
  │    ├─ admin → full access everywhere
  │    ├─ manager → approve in assigned folders
  │    ├─ editor → write in assigned folders
  │    └─ viewer → read only
  │
  └─ scopes: ScopeAccess[]
       └─ { folderId, level: AccessLevel }
            ├─ none → no access
            ├─ read → view articles
            ├─ write → create/edit
            ├─ approve → review/approve
            └─ admin → manage folder

Permission Check:
  can(user, 'article.write', article) → boolean
  → Check user.role (admin bypass)
  → Check user.scopes[article.folderId].level >= 'write'
```

---

## 5. Security Considerations

### 5.1 Current Security Issues

#### ❌ **CRITICAL: API Key Exposed**

**Issue**: Gemini API key embedded in client bundle

```typescript
// vite.config.ts
define: {
  'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
}
```

**Risk**: Anyone can extract API key from JavaScript bundle and abuse it

**Mitigation**: Move Gemini API calls to backend server

#### ❌ **No Authentication**

**Issue**: Mock login with hardcoded users

```typescript
// Login.tsx - anyone can switch roles
const PRESET_USERS = { viewer, editor, admin };
```

**Risk**: No real identity verification, anyone can become admin

**Mitigation**: Implement OAuth 2.0 (Google, GitHub) or JWT auth

#### ❌ **No Authorization on Data Access**

**Issue**: All articles and user data in client localStorage

**Risk**: Users can inspect localStorage and read restricted content

**Mitigation**: Server-side permission checks, encrypted API responses

#### ❌ **Client-side RBAC Only**

**Issue**: Permission checks in `src/lib/permissions.ts` can be bypassed

**Risk**: Browser dev tools can modify state to gain unauthorized access

**Mitigation**: Duplicate all permission checks on backend API

### 5.2 Planned Security Measures

1. **Backend Authentication**:
   - OAuth 2.0 (Google Workspace for iKame employees)
   - Session cookies with httpOnly flag
   - CSRF tokens

2. **API Security**:
   - JWT tokens for API requests
   - Rate limiting
   - Input validation & sanitization

3. **Data Protection**:
   - HTTPS only (already enforced by Vercel)
   - Encrypted database connections
   - No secrets in client bundle

4. **Content Security**:
   - XSS prevention (sanitize HTML in Tiptap editor)
   - Content Security Policy headers
   - CORS configuration

---

## 6. Deployment

### 6.1 Build Process

```bash
# Type check
npm run lint  # tsc --noEmit

# Production build
npm run build  # vite build → dist/
```

**Build Configuration** (`vite.config.ts`):
- **Plugins**: React, Tailwind CSS
- **Path Alias**: `@/*` maps to project root
- **Environment**: Injects `GEMINI_API_KEY` into bundle
- **HMR**: Disabled when `DISABLE_HMR=true` (for AI Studio)

### 6.2 Current Deployment

**Platform**: Vercel (frontend-only static hosting)

**Build Command**: `npm run build`

**Output Directory**: `dist/`

**Environment Variables**:
- `GEMINI_API_KEY` - Google Gemini API key (⚠️ exposed to client)

### 6.3 Future Deployment Architecture

**Frontend**:
- Vercel or Netlify (CDN distribution)
- Edge caching for static assets

**Backend API**:
- Google Cloud Run (serverless containers)
- Railway or Render (Node.js hosting)

**Database**:
- Neon (serverless PostgreSQL)
- Supabase (PostgreSQL + pgvector)

**Collaboration Server**:
- Hocuspocus deployed on Cloud Run
- WebSocket auto-scaling

**File Storage**:
- Google Cloud Storage
- Cloudflare R2

---

## 7. Future Architecture (Target)

### 7.1 Backend API Layer

**Technology**: Express.js (Node.js)

**Endpoints** (Planned):

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/login` | POST | OAuth callback |
| `/api/auth/logout` | POST | End session |
| `/api/articles` | GET | List articles (filtered by permissions) |
| `/api/articles/:id` | GET | Get article by ID |
| `/api/articles` | POST | Create new article |
| `/api/articles/:id` | PUT | Update article |
| `/api/articles/:id/approve` | POST | Manager approves |
| `/api/articles/:id/reject` | POST | Manager rejects |
| `/api/folders` | GET | List folders |
| `/api/users/me` | GET | Current user profile |
| `/api/bounties` | GET | List bounties |
| `/api/ai/chat` | POST | AI chat (Gemini proxy) |
| `/api/ai/rag` | POST | RAG query |

**Middleware**:
- Authentication (verify JWT)
- Authorization (check user permissions)
- Logging
- Error handling

### 7.2 Database Schema

**PostgreSQL** with pgvector extension for AI embeddings

**Core Tables**:
- `users` - User accounts, roles, XP, coins
- `articles` - Article content (JSON), status, metadata
- `article_versions` - Version history
- `folders` - Folder hierarchy
- `permissions` - User-folder access scopes
- `bounties` - Bounty tasks
- `notifications` - User notifications
- `comments` - Article comments
- `ai_sessions` - Chat history
- `analytics_events` - User event tracking

**Vector Search**:
- `article_embeddings` (pgvector) - Article semantic embeddings

### 7.3 Real-time Collaboration

**Hocuspocus Server** (self-hosted):
- WebSocket server for Yjs sync
- Document persistence to PostgreSQL
- User presence tracking
- Conflict resolution via CRDT

**Flow**:
```
Editor A ──────┐
               ├→ [Hocuspocus Server] ←→ [PostgreSQL]
Editor B ──────┘
```

### 7.4 File Storage

**Google Cloud Storage** or **Cloudflare R2**:
- Article cover images
- User avatars
- File attachments
- Image uploads in editor

**Flow**:
```
User uploads file
  ↓
Client → POST /api/upload
  ↓
Backend generates signed URL
  ↓
Client uploads directly to GCS/R2
  ↓
Backend saves URL to database
```

---

## 8. Performance Considerations

### 8.1 Current Performance

- **Initial Load**: ~1.5s (frontend-only SPA)
- **Bundle Size**: ~500KB gzipped (includes large Tiptap + 26 components)
- **Search**: ~100ms (in-memory keyword matching)

### 8.2 Optimization Strategies (Planned)

1. **Code Splitting**:
   - Lazy load pages with React.lazy()
   - Separate bundle for Tiptap editor

2. **State Optimization**:
   - Split large useAppStore.ts (1033 lines) into modules
   - Use React.memo() for expensive components
   - Virtualize long article lists

3. **Search Optimization**:
   - PostgreSQL full-text search
   - Debounced search input (300ms)
   - Cache search results

4. **Asset Optimization**:
   - Compress images (WebP format)
   - Lazy load images below fold
   - CDN caching (Vercel Edge Network)

---

## 9. Known Technical Debt

| Issue | Impact | Priority | Mitigation |
|-------|--------|----------|------------|
| API key exposed in bundle | Security | P0 | Move to backend |
| No backend/database | Functionality | P0 | Implement Express + PostgreSQL |
| No authentication | Security | P0 | Add OAuth 2.0 |
| useAppStore.ts too large (1033 lines) | Maintainability | P1 | Split into modules |
| `any` types in permissions.ts | Type safety | P2 | Add proper types |
| Components >200 lines | Maintainability | P2 | Split components |
| No error boundaries | UX | P2 | Add error handling |
| No tests | Quality | P2 | Add Vitest + Playwright |

---

## Appendix

### Related Documents

- [Product Overview PDR](./project-overview-pdr.md)
- [Code Standards](./code-standards.md)
- [Codebase Summary](./codebase-summary.md)
- [Development Roadmap](./development-roadmap.md)
- [Project Changelog](./project-changelog.md)

### Configuration Files

- `vite.config.ts` - Build configuration
- `tsconfig.json` - TypeScript configuration
- `package.json` - Dependencies and scripts
- `.env.example` - Environment variables template

---

**Document End**
