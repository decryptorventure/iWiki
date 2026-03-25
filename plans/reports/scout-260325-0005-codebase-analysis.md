# Scout Report - iWiki Codebase Analysis

**Ngày**: 25/03/2026
**Phạm vi**: Toàn bộ dự án iWiki
**Tổng dòng code**: ~10,515 dòng TypeScript/TSX

---

## Tổng Quan Dự Án

**iWiki** là ứng dụng Wiki nội bộ cho công ty iKame, được xây dựng với React + TypeScript + Vite.

### Stack Công Nghệ
- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Rich Text Editor**: Tiptap 3.x với collaboration (Hocuspocus)
- **AI Integration**: Google Gemini API
- **UI Libraries**:
  - Custom UI components (@frontend-team/ui-kit, @frontend-team/tiptap-kit - vendored)
  - Tailwind CSS 4
  - Lucide React icons
  - Motion (Framer Motion)
- **State Management**: React Context + useReducer
- **Collaboration**: Yjs + Hocuspocus Provider

---

## Cấu Trúc Thư Mục

```
src/
├── components/      (26 components)
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   ├── Sidebar.tsx
│   ├── Editor.tsx
│   ├── AIDocEditor.tsx
│   ├── IWikiAI.tsx
│   ├── MyArticles.tsx
│   ├── Bounties.tsx
│   ├── DataJanitor.tsx
│   ├── Favorites.tsx
│   ├── CustomFeed.tsx
│   ├── FolderView.tsx
│   ├── Profile.tsx
│   ├── Notifications.tsx
│   ├── ArticleModal.tsx
│   ├── ArticleFullView.tsx
│   ├── DocumentManagement.tsx
│   ├── PermissionManagement.tsx
│   ├── AdminDashboard.tsx
│   ├── ManagerDashboard.tsx
│   └── ...
├── context/
│   └── AppContext.tsx
├── store/
│   └── useAppStore.ts
├── lib/
│   ├── permissions.ts
│   ├── analytics.ts
│   └── rag.ts
├── tiptap/
│   ├── notion-like-editor.tsx
│   ├── notion-like-editor-header.tsx
│   ├── notion-like-editor-toolbar-floating.tsx
│   ├── notion-like-editor-mobile-toolbar.tsx
│   └── data/
├── ui/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Card.tsx
│   ├── IconButton.tsx
│   └── cn.ts
├── constants/
│   └── screens.ts
├── data/
│   └── articleContents.ts
├── App.tsx
└── main.tsx
```

---

## Tính Năng Chính

### 1. **Quản Lý Bài Viết (Articles)**
- Dashboard với feed cá nhân hóa
- Tạo/chỉnh sửa bài viết với Tiptap editor
- Hệ thống folder phân cấp:
  - Know-How
  - Công ty iKame
  - Phòng Kỹ thuật
- Trạng thái: draft, in_review, approved, rejected, published
- Quy trình phê duyệt (approval workflow)
- Comments và inline comments
- Full-text search

### 2. **Hệ Thống Phân Quyền**
- **Roles**: admin, manager, editor, viewer
- **Access Levels**: none, read, write, approve, admin
- **Scope-based permissions**: Phân quyền theo folder
- **Actions**:
  - article.read
  - article.write
  - article.submit_review
  - article.approve
  - admin.access
  - manager.access

### 3. **Collaboration Features**
- Real-time collaborative editing (Yjs + Hocuspocus)
- User presence indicators
- Collaborative cursors

### 4. **Gamification**
- User levels và XP system
- Coins system
- Badges
- Bounties (thưởng cho việc viết bài)

### 5. **AI Features**
- IWikiAI - AI assistant
- AIDocEditor - AI-powered document editor
- RAG (Retrieval-Augmented Generation) integration
- Gemini API integration

### 6. **Admin/Manager Tools**
- Admin Dashboard
- Manager Dashboard
- Document Management
- Permission Management
- Data Janitor (data quality tools)
- Analytics

### 7. **User Features**
- Profile management
- My Articles
- Favorites
- Custom Feed
- Notifications
- Onboarding Tour

---

## Files Quan Trọng

### Core Application
- `src/App.tsx` - Main app component với routing logic
- `src/main.tsx` - Entry point
- `src/context/AppContext.tsx` - React Context provider
- `src/store/useAppStore.ts` - State management (reducer + types)

### Business Logic
- `src/lib/permissions.ts` - Permission system (52 lines)
- `src/lib/analytics.ts` - Analytics tracking
- `src/lib/rag.ts` - RAG implementation cho AI features

### UI Components
- `src/components/Editor.tsx` - Article editor wrapper
- `src/tiptap/notion-like-editor.tsx` - Tiptap editor implementation
- `src/components/Sidebar.tsx` - Navigation sidebar
- `src/components/Dashboard.tsx` - Main dashboard

### Configuration
- `package.json` - Dependencies
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `.env.example` - Environment variables template

---

## Vendored Packages (libs/)

Dự án vendor 2 private packages để tránh network timeout khi deploy lên Vercel:

1. **@frontend-team/tiptap-kit** (v0.2.7)
2. **@frontend-team/ui-kit** (v1.1.1)

---

## Thiếu Sót & Cần Bổ Sung

### ❌ Chưa Có

1. **Documentation Structure**
   - Không có thư mục `docs/`
   - Không có `CLAUDE.md` trong project
   - Không có technical documentation
   - Không có architecture diagrams

2. **Testing**
   - Không thấy test files
   - Không có test configuration
   - Không có test scripts trong package.json

3. **Backend**
   - Frontend-only application
   - Không có API layer thực
   - Data được mock trong code

4. **Database**
   - Không có database schema
   - Không có migrations
   - State chỉ tồn tại trong memory

5. **Deployment**
   - Không có deployment configuration
   - Không có CI/CD pipeline

---

## Vấn Đề Tiềm Ẩn

### 🔴 Critical
1. **API Key bị expose**: File `.env.example` chứa API key thật → cần remove ngay
2. **Không có persistent storage**: Tất cả data sẽ mất khi reload
3. **No authentication**: Login component chỉ là mock

### 🟡 Warning
1. **Large components**: Một số components >200 lines (vi phạm quy tắc modularization)
2. **Type safety**: Nhiều chỗ dùng `any` type
3. **No error boundaries**: Không có error handling ở component level
4. **No loading states**: Thiếu loading indicators

---

## Khuyến Nghị Tiếp Theo

### Ưu tiên 1: Thiết Lập Documentation Structure

```bash
mkdir -p docs plans
```

Tạo các file documentation cần thiết:
- `docs/project-overview-pdr.md` - Product Development Requirements
- `docs/system-architecture.md` - Kiến trúc hệ thống
- `docs/code-standards.md` - Chuẩn coding
- `docs/codebase-summary.md` - Tóm tắt codebase
- `docs/development-roadmap.md` - Lộ trình phát triển
- `CLAUDE.md` - Instructions cho Claude Agent

### Ưu tiên 2: Remove API Key Exposure

Fix file `.env.example` để không chứa API key thật.

### Ưu tiên 3: Implement Backend

Các options:
1. **Node.js + Express + SQLite** (simplest, local)
2. **Node.js + Express + PostgreSQL** (production-ready)
3. **Next.js API Routes** (full-stack React framework)
4. **Supabase** (backend-as-a-service)

Cần implement:
- REST API hoặc GraphQL
- Database schema
- Authentication (OAuth, JWT, session)
- File storage cho images/attachments
- WebSocket server cho real-time collaboration

### Ưu tiên 4: Add Testing

- Unit tests cho business logic (permissions, utilities)
- Component tests với React Testing Library
- E2E tests với Playwright
- Coverage reporting

### Ưu tiên 5: Refactoring

- Split large components (<200 lines each)
- Extract reusable hooks
- Improve type safety (remove `any`)
- Add error boundaries
- Implement proper loading states

---

## Câu Hỏi Chưa Giải Đáp

1. **Backend strategy**: User muốn dùng stack gì cho backend?
2. **Database**: PostgreSQL, MySQL, SQLite, hay NoSQL?
3. **Hosting**: Vercel, Netlify, AWS, GCP, hay self-hosted?
4. **Authentication**: OAuth (Google, GitHub), email/password, hay SSO?
5. **File storage**: Local filesystem, S3, Cloudflare R2, hay GCS?
6. **Collaboration server**: Tự host Hocuspocus hay dùng service?
7. **Priority**: Nên bắt đầu từ feature nào?

---

**Next Actions**: Chờ user clarification về backend strategy và priority để tiếp tục.
