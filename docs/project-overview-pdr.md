# iWiki - Product Development Requirements

**Document Version**: 1.0
**Last Updated**: 2026-03-25
**Status**: Active
**Owner**: Product Team

---

## 1. Product Overview

### 1.1 Vision & Mission

**Vision**: Biến iWiki thành **Knowledge Hub thông minh** - điểm tra cứu duy nhất cho toàn bộ tri thức nội bộ của iKame, giúp mọi nhân viên tìm kiếm, học hỏi và đóng góp kiến thức một cách hiệu quả.

**Mission**: Xây dựng văn hóa chia sẻ tri thức thông qua:
- **Tìm kiếm thông minh**: AI-powered search giúp tìm đúng tài liệu trong vài giây
- **Đóng góp dễ dàng**: Rich editor, approval workflow linh hoạt, gamification khuyến khích viết bài
- **Chất lượng cao**: Quy trình review chặt chẽ, AI hỗ trợ cải thiện nội dung

### 1.2 Target Users

**Primary Users**: Toàn bộ nhân viên công ty iKame (cross-functional teams)
- **Viewers** (~40%): Nhân viên mới, intern - chỉ đọc tài liệu
- **Editors** (~45%): Nhân viên chính thức - có thể viết và đóng góp nội dung
- **Managers** (~10%): Team leads, department heads - phê duyệt tài liệu
- **Admins** (~5%): IT, product team - quản trị hệ thống

**Secondary Users**: External contractors với restricted access (chưa implement)

### 1.3 Key Value Propositions

1. **Single Source of Truth**: Tất cả tri thức tập trung tại một nơi, không còn Google Drive rải rác
2. **AI-Powered**: Tìm kiếm thông minh, AI assistant hỗ trợ viết tài liệu
3. **Gamification**: XP, levels, badges, bounties thúc đẩy động lực đóng góp
4. **Collaborative**: Real-time editing với Tiptap + Yjs
5. **Permission Control**: RBAC chi tiết theo role và folder

### 1.4 Current State

- **Status**: Frontend prototype with mock data (v1.0)
- **Tech Stack**: React 19 + TypeScript + Vite 6 + Tiptap 3.x
- **Deployment**: Vercel (frontend only)
- **Backend**: Not implemented yet (localStorage only)
- **Users**: Demo users only, no real authentication

---

## 2. User Roles & Personas

### 2.1 Role Definitions

| Role | Description | Access Level | Key Actions |
|------|-------------|--------------|-------------|
| **Admin** | System administrators, full control | admin (all folders) | All actions, manage users, configure system |
| **Manager** | Department heads, team leads | approve (assigned folders) | Read, write, approve/reject articles in scope |
| **Editor** | Regular contributors | write (assigned folders) | Read, write, submit for review |
| **Viewer** | Read-only users (new employees, interns) | read (assigned folders) | Read public articles only |

### 2.2 Permission Matrix

| Action | Admin | Manager | Editor | Viewer |
|--------|-------|---------|--------|--------|
| Read public articles | ✓ | ✓ | ✓ | ✓ |
| Read restricted articles | ✓ | ✓ (scope) | ✓ (scope) | ✗ |
| Create draft | ✓ | ✓ | ✓ | ✗ |
| Submit for review | ✓ | ✓ | ✓ | ✗ |
| Approve/reject articles | ✓ | ✓ (scope) | ✗ | ✗ |
| Publish articles | ✓ | ✓ (scope) | ✗ | ✗ |
| Manage users | ✓ | ✗ | ✗ | ✗ |
| Access analytics | ✓ | ✓ | ✗ | ✗ |

### 2.3 Access Levels

iWiki uses 5-level permission hierarchy:
- **none**: No access
- **read**: View articles only
- **write**: Create and edit drafts
- **approve**: Review and approve articles
- **admin**: Full control over folder

**Scope-based permissions**: Each user has access levels per folder (e.g., `write` in "Know-How", `read` in "Company Policy")

### 2.4 User Personas

#### Persona 1: Lan - Business Analyst (Editor)
- **Goal**: Tìm quy trình nghiệp vụ nhanh chóng, đóng góp tài liệu BA
- **Pain Points**: Tài liệu outdated, không biết tìm ở đâu, quy trình duyệt bài lâu
- **Usage**: Tìm kiếm hàng ngày, viết 2-3 bài/tháng

#### Persona 2: Huy - Backend Developer (Editor)
- **Goal**: Tra cứu technical docs, chia sẻ kinh nghiệm debug
- **Pain Points**: Thiếu tài liệu kỹ thuật, không có search tốt
- **Usage**: Tìm kiếm mỗi khi gặp issue, viết bài sau mỗi sprint

#### Persona 3: Nguyệt - CHRO (Manager)
- **Goal**: Quản lý tài liệu HR, phê duyệt policy documents
- **Pain Points**: Không có dashboard quản lý, không track được approval flow
- **Usage**: Duyệt bài hàng tuần, tạo policy docs hàng tháng

---

## 3. Feature Requirements

### 3.1 Article Management

#### 3.1.1 Article Lifecycle

Articles follow 5-state workflow:
1. **draft**: Author working on content (private)
2. **in_review**: Submitted for manager review
3. **approved**: Manager approved, ready to publish
4. **rejected**: Manager rejected with reason/comments
5. **published**: Public to all users with read permission

#### 3.1.2 Article Properties

```typescript
interface Article {
  id: string;
  title: string;
  content: string; // Tiptap JSON format
  excerpt?: string; // Short description
  coverUrl?: string; // Cover image
  folderId: string; // Parent folder
  tags: string[]; // Keywords
  author: User;
  status: ArticleStatus;
  viewPermission: 'public' | 'restricted';
  allowComments: boolean;
  views: number;
  likes: number;
  likedBy: string[]; // User IDs
  comments: Comment[];
  approval?: ApprovalRecord;
  createdAt: string;
  updatedAt: string;
}
```

#### 3.1.3 Core Actions

| Action | Description | Permission Required |
|--------|-------------|---------------------|
| **Create** | Start new draft | write |
| **Edit** | Modify own draft | write (owner only) |
| **Delete** | Remove own draft | write (owner only) |
| **Submit Review** | Send to manager for approval | write (owner) |
| **Approve** | Approve submitted article | approve |
| **Reject** | Reject with reason | approve |
| **Publish** | Make article public | approve |
| **Like** | Upvote article | read |
| **Comment** | Add comment | read (if allowComments) |
| **Favorite** | Bookmark article | read |

### 3.2 Folder Organization

#### 3.2.1 Folder Hierarchy

```
iWiki Root
├── Công ty iKame (f-company)
│   ├── Chính sách nhân sự (f-hr)
│   ├── Quy trình chung (f-process)
│   └── Văn hóa & Giá trị (f-culture)
├── Phòng Kỹ thuật (f-tech)
│   ├── Frontend Guidelines (f-fe)
│   ├── Backend Architecture (f-be)
│   └── DevOps & Infrastructure (f-devops)
├── Know-How (f-knowhow)
│   ├── Mindset (f-mindset)
│   ├── Process & Checklist (f-checklist)
│   └── Soft Skills (f-softskills)
└── Product Guild (f-product)
    ├── Product Processes (f-pm-process)
    └── Templates (f-pm-templates)
```

#### 3.2.2 Folder Properties

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

#### 3.2.3 Folder View

- **Breadcrumbs**: Show navigation path
- **Article List**: All articles in folder + subfolders
- **Filter**: By status, author, date
- **Sort**: By recent, popular, trending

### 3.3 Approval Workflow

#### 3.3.1 Submission Process

1. Author completes draft → clicks "Submit for Review"
2. System changes status to `in_review`
3. Manager receives notification
4. Manager reviews article:
   - Can add inline comments (line-by-line feedback)
   - Approves or rejects with reason
5. If approved: Article → `approved` state, ready to publish
6. If rejected: Article → `rejected`, author can revise and resubmit

#### 3.3.2 Approval Record

```typescript
interface ApprovalRecord {
  submittedAt?: string;
  submittedBy?: string; // User ID
  reviewedAt?: string;
  reviewedBy?: string; // Manager ID
  rejectionReason?: string;
  reviewSummary?: string;
  comments?: ApprovalInlineComment[];
}
```

#### 3.3.3 Inline Comments

Managers can add comments on specific lines of content:

```typescript
interface ApprovalInlineComment {
  id: string;
  lineNumber: number;
  quote: string; // Text being commented on
  content: string; // Manager's feedback
  authorId: string;
  authorName: string;
  createdAt: string;
}
```

### 3.4 Collaboration (Real-time Editing)

#### 3.4.1 Technology

- **Tiptap 3.x**: Block-based rich text editor
- **Yjs**: CRDT for conflict-free collaboration
- **Hocuspocus Provider**: WebSocket server for real-time sync

#### 3.4.2 Features

- **Collaborative Cursors**: See where others are typing
- **User Presence**: Show who's currently editing
- **Auto-save**: Changes saved every 5 seconds
- **Conflict Resolution**: Yjs handles merges automatically

#### 3.4.3 Editor Capabilities

- Rich text formatting (bold, italic, heading, lists)
- Block elements (code, quote, table)
- Media embeds (images, videos)
- Slash commands for quick insertion
- Markdown shortcuts
- Mobile toolbar for touch devices

### 3.5 AI Features

#### 3.5.1 IWikiAI - AI Assistant

**Purpose**: Chat-based AI assistant for knowledge search and document generation

**Key Features**:
- **Smart Search**: Natural language queries (e.g., "Quy trình nghỉ phép là gì?")
- **RAG (Retrieval-Augmented Generation)**: Answer based on iWiki knowledge base
- **Document Generation**: Auto-create PRD, SOP, reports from prompts
- **Data Connectors**: Import from Google Drive, NotebookLM (planned)

**Technology**:
- Google Gemini 1.5 Pro API
- RAG implementation with article embeddings
- Chat session history saved per user

**User Interface**:
- Starter cards for common tasks
- Model selection (Auto, Gemini Pro/Flash, GPT-4o, Claude 3.5)
- Split view: Chat + Document Editor
- Chat history sidebar

#### 3.5.2 AIDocEditor

**Purpose**: Rich text editor for AI-generated documents

**Features**:
- Live preview of generated content
- Inline editing
- Save to iWiki as article
- Copy to clipboard

#### 3.5.3 RAG Implementation

```typescript
function generateRagAnswer(
  user: User,
  articles: Article[],
  query: string
): { answer: string; citations: Citation[] }
```

**Logic**:
1. Filter accessible articles for user
2. Semantic search on titles + content (keyword matching)
3. Rank by relevance score
4. Extract top 3 citations
5. Generate answer with citations

**Limitations (Current)**:
- No actual embeddings (uses keyword matching)
- No vector database (in-memory search)
- English/Vietnamese mixed queries not optimized

### 3.6 Gamification

#### 3.6.1 XP & Levels

**XP Sources**:
- Write article: +100 XP
- Article published: +200 XP
- Article liked: +10 XP
- Bounty completed: +150 XP
- Comment helpful: +5 XP

**Level System**:
- Start: Level 1, 0 XP
- Level up every 500-1000 XP (progressive)
- Display user level everywhere (profile, leaderboard, comments)

**Visual**:
- Progress bar showing XP → next level
- Level badge next to username

#### 3.6.2 Coins System

**Coin Sources**:
- Bounty completion: +[reward amount]
- Article published: +50 coins
- Weekly quest completion: +200 coins

**Coin Usage** (Planned):
- Redeem swag/merch
- Exchange for PTO hours
- Unlock premium features

#### 3.6.3 Badges

**Badge Types**:
- **First Article** ✍️: Write first article
- **Knowledge Sharer** 📚: 10 published articles
- **Top Contributor** 🏆: Top 3 leaderboard
- **AI Pioneer** 🤖: Use AI features 20 times

**Badge Display**:
- Profile page
- User card on article
- Leaderboard

#### 3.6.4 Bounties (Quest System)

**Purpose**: Motivate users to fill knowledge gaps

**Bounty Properties**:
```typescript
interface Bounty {
  id: string;
  title: string; // "Best Practices tối ưu React Native 2024"
  description: string;
  requester: string; // Guild/team name
  requesterId: string;
  reward: number; // Coins
  deadline: string;
  tags: string[];
  hot: boolean; // Featured bounty
  acceptedBy: string[]; // Users working on it
  submittedArticleId?: string;
  status: 'open' | 'accepted' | 'completed';
  createdAt: string;
}
```

**Workflow**:
1. Manager creates bounty with reward
2. Editor accepts bounty
3. Editor writes article
4. Editor submits article linked to bounty
5. Manager approves → Editor receives coins

**UI Features**:
- Filter by tags, hot, status
- Search bounties
- Create bounty modal (managers only)
- "Quest tuần này" weekly challenge

### 3.7 Search & Discovery

#### 3.7.1 Dashboard Search

**Smart Search Interface**:
- Sparkles icon (AI-powered)
- Placeholder: "Tìm kiếm thông minh hoặc đặt câu hỏi cho AI..."
- Real-time dropdown with 2 columns:
  - Left: Smart suggestions + search history
  - Right: Live article results

**Smart Suggestions**:
- Context-aware (e.g., "Quy trình cho Product Manager" if user is PM)
- Quick links to common docs

**Search History**:
- Last 10 searches saved per user
- One-click to re-search
- Clear history option

**Live Results**:
- Show top 4 articles matching query
- Highlight in title/tags
- Click to open article modal

#### 3.7.2 Full-text Search

**Implementation** (Current):
```typescript
articles.filter(a =>
  a.title.toLowerCase().includes(query.toLowerCase()) ||
  a.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
)
```

**Planned Enhancements**:
- PostgreSQL full-text search
- Fuzzy matching for typos
- Synonym support (Vietnamese)
- Search filters (date, author, folder)

#### 3.7.3 Discovery Features

**Personalized Feed**:
- Articles tailored to user's role and interests
- Based on:
  - User's folder permissions
  - Recent reading history
  - Tags from favorited articles
  - Team/department alignment

**All Articles View**:
- 3 filters: Recent, Popular, Trending
- **Recent**: Sorted by `updatedAt` DESC
- **Popular**: Sorted by `views` DESC
- **Trending**: Sorted by engagement (likes + comments*2)

**Featured Articles**:
- Top 5 articles displayed on dashboard
- 1 large card + 4 small cards
- Curated by admins or auto-selected by engagement

### 3.8 User Features

#### 3.8.1 Profile Management

**Profile Properties**:
```typescript
interface User {
  id: string;
  name: string;
  role: UserRole;
  title: string; // Job title
  avatar: string;
  level: number;
  xp: number;
  xpToNext: number;
  coins: number;
  badges: Badge[];
  scopes: ScopeAccess[]; // Folder permissions
}
```

**Profile Page**:
- Avatar, name, title, level, coins
- XP progress bar
- Badge collection
- Activity stats (articles written, likes received, comments)
- Articles by this user

#### 3.8.2 My Articles

**View**: List all articles authored by current user

**Filters**:
- All | Draft | In Review | Approved | Rejected | Published

**Actions**:
- Edit draft
- Delete draft
- Submit for review
- View approval feedback (if rejected)

#### 3.8.3 Favorites

**Purpose**: Bookmark important articles for quick access

**Features**:
- Toggle favorite from article card/modal
- Favorites page: Grid view of bookmarked articles
- Remove from favorites

**Storage**: `favoritesByUser` map in state

#### 3.8.4 Custom Feed

**Purpose**: Personalize content feed by tags and folders

**Preferences**:
```typescript
interface CustomFeedPrefs {
  tags: string[]; // Interested tags
  folderIds: string[]; // Subscribed folders
}
```

**Feed Algorithm**:
- Show articles matching selected tags OR in subscribed folders
- Sorted by recent

#### 3.8.5 Notifications

**Notification Types**:
- **comment**: Someone commented on your article
- **like**: Article received likes milestone
- **reward**: Bounty reward received
- **bounty**: New bounty matching your skills
- **approval**: Article approved/rejected
- **system**: System announcements

**Properties**:
```typescript
interface Notification {
  id: string;
  title: string;
  content: string;
  type: NotificationType;
  time: string; // Human-readable (e.g., "2 giờ trước")
  isRead: boolean;
  link?: string; // Deep link (e.g., "article:a-4")
  createdAt: string;
}
```

**Features**:
- Bell icon with unread count badge
- Dropdown list (max 20 recent)
- Mark as read
- Mark all read
- Click to navigate to related page

#### 3.8.6 Onboarding Tour

**Purpose**: Guide new users through iWiki features

**Tour Steps**:
1. Dashboard overview
2. Search + AI assistant
3. Folder navigation
4. Write first article
5. Profile & gamification

**Trigger**: Show once per user (first login)

**Skip**: User can skip tour and won't be shown again

**Implementation**:
```typescript
onboardingCompletedForUsers: Record<string, boolean>
```

### 3.9 Admin & Manager Tools

#### 3.9.1 Admin Dashboard

**Access**: Admin role only

**Features**:
- **User Management**: Add/remove users, change roles
- **System Analytics**: DAU, MAU, article creation rate
- **Content Moderation**: Flag inappropriate content
- **Configuration**: Edit folder structure, badges

**Metrics Displayed**:
- Total users, articles, folders
- Monthly active users
- Top contributors leaderboard
- Articles pending approval
- Average time-to-approval

#### 3.9.2 Manager Dashboard

**Access**: Manager role + Admin

**Features**:
- **Approval Queue**: Articles pending review in manager's scope
- **Team Analytics**: Team's contribution stats
- **Content Quality**: Review feedback summary

**Approval Interface**:
- List of `in_review` articles
- Quick approve/reject buttons
- Add inline comments
- Rejection reason textarea

#### 3.9.3 Document Management

**Purpose**: Bulk manage articles (admin only)

**Features**:
- List all articles across folders
- Bulk actions: Delete, Change folder, Change permission
- Export to CSV
- Archive old articles

#### 3.9.4 Permission Management

**Purpose**: Configure folder-level permissions for users

**Interface**:
- User dropdown
- Folder tree view
- Access level selector per folder
- Save changes

**Example**:
- User: "Lan (BA)" → Folder: "Product Guild" → Level: `write`

#### 3.9.5 Data Janitor

**Purpose**: Data quality and consistency tools

**Features**:
- **Find duplicates**: Articles with similar titles
- **Outdated content**: Articles not updated in 6+ months
- **Broken links**: Check links in content
- **Missing metadata**: Articles without tags/excerpts

**Actions**:
- Flag for review
- Auto-suggest fixes
- Bulk update metadata

---

## 4. Non-Functional Requirements

### 4.1 Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| Page load time | < 2s | ~1.5s (frontend only) |
| Search response | < 500ms | ~100ms (mock data) |
| Editor input lag | < 50ms | ~30ms |
| Real-time sync delay | < 200ms | N/A (not deployed) |

### 4.2 Security Requirements

**Authentication**:
- OAuth 2.0 (Google, GitHub) - Planned
- Session management with JWT
- HTTPS only

**Authorization**:
- Role-based access control (RBAC)
- Scope-based permissions per folder
- API endpoint protection

**Data Protection**:
- No sensitive data in localStorage (prod)
- Encrypt API keys in .env
- CORS policy for API access

**Content Security**:
- XSS prevention (sanitize HTML)
- CSRF tokens
- Rate limiting on API

### 4.3 Accessibility

**WCAG 2.1 Level AA Compliance**:
- Keyboard navigation support
- Screen reader compatible
- Color contrast ratio ≥ 4.5:1
- Focus indicators
- Alt text for images

**Responsive Design**:
- Mobile-first approach
- Breakpoints: 320px, 768px, 1024px, 1440px
- Touch-friendly UI (mobile toolbar in editor)

### 4.4 Internationalization

**Primary Language**: Vietnamese
- UI labels, error messages, placeholders in Vietnamese
- User-facing content (articles, comments) in Vietnamese

**Secondary Language**: English
- Technical documentation
- API responses
- Code comments

**Date/Time Format**:
- Vietnamese locale: DD/MM/YYYY, HH:mm

### 4.5 Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 100+ |
| Safari | 15+ |
| Firefox | 100+ |
| Edge | 100+ |
| Mobile Safari | iOS 15+ |
| Chrome Mobile | Android 10+ |

### 4.6 Scalability

**Current State**: Frontend-only, localStorage, ~50 demo articles

**Target (Production)**:
- 500+ users
- 10,000+ articles
- 1,000+ daily active users
- 100+ concurrent real-time editors

**Architecture**:
- CDN for static assets (Vercel Edge Network)
- Database connection pooling
- Redis cache for hot articles
- WebSocket server auto-scaling

---

## 5. Technical Constraints

### 5.1 Current Implementation

**Frontend**:
- React 19.0.0
- TypeScript 5.7.3
- Vite 6.0.7
- Tiptap 3.x (rich text editor)
- @frontend-team/ui-kit 1.1.1 (vendored)
- @frontend-team/tiptap-kit 0.2.7 (vendored)
- Tailwind CSS 4.0.0
- Motion (Framer Motion)

**State Management**:
- React Context API
- `useReducer` for global state

**Storage**:
- localStorage (temporary, frontend-only)
- No database

**Authentication**:
- Mock login (preset users)
- No real auth system

**Collaboration**:
- Yjs + Hocuspocus Provider (configured but not deployed)

### 5.2 Target Architecture

**Backend** (To Be Implemented):
- **Options**:
  - Node.js + Express + PostgreSQL (recommended)
  - Next.js API Routes (full-stack)
  - Supabase (backend-as-a-service)
- **Database**: PostgreSQL with pgvector for embeddings
- **Authentication**: OAuth 2.0 (Google, GitHub)
- **File Storage**: Google Cloud Storage or Cloudflare R2
- **WebSocket Server**: Hocuspocus server for real-time collaboration

**Deployment**:
- **Frontend**: Vercel (current)
- **Backend**: Google Cloud Run or Railway
- **Database**: Supabase or Neon (serverless Postgres)

**CI/CD**:
- GitHub Actions for tests and builds
- Auto-deploy to staging on PR
- Manual approval for production deploy

### 5.3 Known Limitations

1. **No Backend**: All data in localStorage, lost on page reload
2. **No Real Auth**: Mock users, no sessions
3. **No Real Collaboration**: Yjs configured but server not deployed
4. **No Tests**: No unit/integration/e2e tests
5. **API Key Exposed**: `.env.example` contains real Gemini API key (SECURITY ISSUE)

---

## 6. Success Metrics

### 6.1 Adoption Metrics

| Metric | Baseline (Q1 2026) | Target (Q4 2026) |
|--------|-------------------|------------------|
| MAU (Monthly Active Users) | 30% | 60%+ |
| DAU/MAU Ratio | 15% | 30% |
| Articles Created per Month | 10 | 50+ |
| Average Session Duration | 3 min | 8 min |

### 6.2 Engagement Metrics

| Metric | Target |
|--------|--------|
| Articles per Active User | 2+ per quarter |
| Search Queries per User | 5+ per week |
| AI Usage Rate | 40% of users use AI features monthly |
| Bounty Completion Rate | 70% of posted bounties completed |

### 6.3 Content Quality Metrics

| Metric | Target |
|--------|--------|
| Average Article Quality Score | ≥ 4.0/5 |
| Approval Rate (First Submission) | 70%+ |
| Average Time-to-Approval | < 48 hours |
| Outdated Content Rate | < 10% (articles >6 months old) |

### 6.4 Knowledge Retrieval Metrics

| Metric | Target |
|--------|--------|
| Search Success Rate | 85%+ (users find what they need) |
| Average Time to Find Answer | < 2 minutes |
| Repeat Search Rate | < 20% (users don't re-search same query) |

---

## 7. Out of Scope (Current Phase)

### 7.1 Backend Implementation

- PostgreSQL database setup
- REST API / GraphQL endpoints
- Authentication system (OAuth)
- Session management

### 7.2 Mobile Native App

- iOS app (Swift/SwiftUI)
- Android app (Kotlin/Jetpack Compose)
- React Native version

### 7.3 Advanced AI Features

- Auto-tagging articles
- Content quality scoring (AI-based)
- Smart notifications (ML-based)
- Image/video search

### 7.4 Integrations

- Slack bot for iWiki search
- Google Drive sync
- Jira/Confluence import
- Email notifications

### 7.5 Analytics & Reporting

- Power BI dashboards
- Custom report builder
- Export to CSV/PDF
- Admin analytics API

---

## 8. Appendix

### 8.1 Related Documents

- `system-architecture.md` - Technical architecture details
- `code-standards.md` - Coding conventions
- `codebase-summary.md` - Key files and modules
- `development-roadmap.md` - Implementation timeline

### 8.2 Key Source Files

- `src/store/useAppStore.ts` - State management, data models
- `src/lib/permissions.ts` - RBAC implementation
- `src/App.tsx` - Main app routing
- `src/components/Dashboard.tsx` - Main dashboard
- `src/components/IWikiAI.tsx` - AI assistant
- `src/components/Editor.tsx` - Article editor
- `src/components/Bounties.tsx` - Bounty system

### 8.3 Glossary

- **RBAC**: Role-Based Access Control
- **RAG**: Retrieval-Augmented Generation
- **Yjs**: CRDT library for real-time collaboration
- **Tiptap**: Headless rich text editor
- **Gamification**: Game elements (XP, levels, badges) in non-game context
- **Bounty**: Reward-based task for creating missing content
- **Scope**: Folder-level permission assignment

---

**Document End**
