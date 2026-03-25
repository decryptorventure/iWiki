# iWiki Project Changelog

**Last Updated**: 2026-03-25
**Format**: Semantic Versioning
**Status**: Active Development

---

## [v0.2.0] - 2026-03-25

### Major Changes

#### Frontend Refactoring Complete
- **Types Extraction**: Modularized type system into 9 focused files
  - `types/article.ts` - Article-related types
  - `types/user.ts` - User and auth types
  - `types/folder.ts` - Folder hierarchy types
  - `types/approval.ts` - Approval workflow types
  - `types/bounty.ts` - Bounty system types
  - `types/comment.ts` - Comment and feedback types
  - `types/notification.ts` - Notification types
  - `types/ui.ts` - UI component state types
  - `types/app.ts` - Global app state types

- **Store Optimization**: Reduced from 1,033 to ~500 lines
  - Cleaner reducer logic
  - Better action organization
  - Improved maintainability

- **Component Split**: Large components broken into focused sub-components
  - Dashboard split into dashboard-*.tsx variants
  - Editor split into editor-*.tsx sub-components
  - Improved code reusability

- **Code-Splitting**: Bundle size reduced from 2,710 kB to 611 kB (77% reduction)
  - Lazy-loaded routes
  - Dynamic imports for heavy components
  - Better tree-shaking

#### UI Component Library Migration
- **Completed Migration**: 23 files migrated from internal components to `@frontend-team/ui-kit`
- **Components Migrated**:
  - Button (consolidated 15+ instances)
  - Modal (consolidated 8+ instances)
  - Input (consolidated 12+ instances)
  - Select (consolidated 3+ instances)
  - Textarea (consolidated 2+ instances)

- **Files Updated**:
  - `src/components/Bounties.tsx`
  - `src/components/Profile.tsx`
  - `src/components/MyArticles.tsx`
  - `src/components/SearchResult.tsx`
  - `src/components/editor-publish-modal.tsx`
  - `src/components/editor-template-modal.tsx`
  - `src/components/ArticleModal.tsx`
  - `src/components/ManagerDashboard.tsx`
  - `src/components/ArticleFullView.tsx`
  - `src/components/FolderView.tsx`
  - `src/components/my-article-card.tsx`
  - `src/components/EmptyFolderBounty.tsx`
  - `src/components/Notifications.tsx`
  - `src/components/AIDocEditor.tsx`
  - `src/components/Editor.tsx`
  - `src/components/DataJanitor.tsx`
  - `src/components/IWikiAI.tsx`
  - `src/components/editor-ai-chat-panel.tsx`
  - `src/components/iwiki-ai-history-sidebar.tsx`
  - `src/components/OnboardingTour.tsx`
  - `src/components/dashboard-all-articles.tsx`
  - And 2 additional support components

- **Quality Assurance**: 0 new TypeScript errors (1 pre-existing unrelated error in mobile toolbar)

#### UI/UX Improvements
- **Phase 1 — Fast Fixes (3 issues)**:
  - Fixed stats icons visibility by removing SVG gradient bug
  - Removed "Liên kết Tri thức" sidebar from article modal
  - Fixed ArticleFullView col-span gap for lg screens

- **Phase 2 — Editor UX + Publish Modal (2 issues)**:
  - Restructured Editor toolbar into left/right groups with labels
  - Changed content alignment to `max-w-6xl w-full pl-6 pr-8`
  - Made AI mode button always visible with orange styling
  - Replaced hardcoded select with searchable folder picker
  - Added recent/suggested/all folder sections with localStorage persistence
  - Added "Người được chia sẻ" tag input for restricted-permission articles
  - Updated publish handler to accept `sharedWith: string[]`

- **Phase 3 — Dark Mode Foundation (1 issue)**:
  - Added Tailwind v4 dark mode support via `@custom-variant dark`
  - Created dark-mode CSS variables: `--glass-bg`, `--glass-border`, `--glass-shadow`, `--shadow-soft`, `--shadow-medium`, `--shadow-glow`
  - Built `src/hooks/use-dark-mode.ts` hook (reads localStorage/system preference)
  - Added dark mode toggle in Sidebar (Sun/Moon icons)
  - Applied dark variants to: `App.tsx`, `Sidebar.tsx`, `Dashboard.tsx`
  - Added FOUC prevention script in `index.html`

**Total UI/UX Improvements**: 6 issues resolved across 10 files

### Features Added

#### Dark Mode
- Toggle button in sidebar
- localStorage persistence
- System preference fallback
- CSS variable overrides for glassmorphism in dark
- FOUC prevention

#### Searchable Folder Picker
- Recent folders (localStorage-tracked)
- Suggested folders (by department)
- All folders (searchable dropdown)
- Improved UX for publish modal

#### Shared Users Input
- Tag-input component for restricted-permission articles
- Shows "Người được chia sẻ" section when applicable
- Array format: `sharedWith: string[]`

### Fixed Issues

| ID | Issue | File | Status |
|---|-------|------|--------|
| 1 | Stats icons invisible (SVG gradient bug) | MyArticles.tsx | ✓ Fixed |
| 2 | Remove "Lien ket Tri thuc" sidebar | ArticleModal.tsx | ✓ Fixed |
| 3 | ArticleFullView col-span gap | ArticleFullView.tsx | ✓ Fixed |
| 4 | Editor toolbar/layout restructure | Editor.tsx | ✓ Fixed |
| 5 | Publish modal folder picker | editor-publish-modal.tsx | ✓ Fixed |
| 6 | Dark mode toggle + shell variants | Multiple | ✓ Fixed |

### Performance Improvements

- Bundle size: 2,710 kB → 611 kB (77% reduction)
- Code-splitting enabled for lazy routes
- Search debouncing: 200ms
- Store optimized: 1,033 → ~500 lines
- No performance regressions (all within target <50ms input lag)

### Quality

- TypeScript compilation: 0 new errors
- All changes verified with `tsc --noEmit`
- Visual inspection passed
- Dark mode toggle persists to localStorage
- No white-flash on dark mode load (FOUC prevention working)

### Architecture Improvements

- Modular type system (9 separate files)
- Clean store structure (half the lines)
- Component composition over monolithic files
- Lazy loading for performance
- Better code organization for maintainability

---

## [v0.1.0] - 2026-03-01

### Initial Release

#### Core Features Implemented
- **Article Management**: Create, edit, delete drafts; submit for review
- **Folder Organization**: Nested folder structure with breadcrumbs
- **Approval Workflow**: In-review, approved, rejected, published states
- **User Roles**: Admin, Manager, Editor, Viewer with permission levels
- **Gamification**: XP, levels, coins, badges, bounties
- **AI Features**: IWikiAI chat, AIDocEditor, RAG-based search
- **Collaboration**: Yjs + Hocuspocus setup (not deployed)
- **Search**: Dashboard search with live results and history
- **Dark Mode**: CSS variable support (foundation, not fully implemented)
- **Notifications**: Bell icon with unread count and dropdown

#### Tech Stack
- React 19.0.0
- TypeScript 5.7.3
- Vite 6.0.7
- Tailwind CSS 4.0.0
- TipTap 3.x (rich text editor)
- Yjs (CRDT for real-time collaboration)
- Google Gemini 1.5 Pro API

#### Frontend Deployment
- Vercel (production)
- Automatic deployments from main branch
- Support for staging environment

#### Storage
- localStorage for mock data
- 50 demo articles
- 6 demo users with different roles

#### Known Limitations
- No backend (data lost on refresh)
- No real authentication (mock users only)
- No real-time collaboration (server not deployed)
- No unit/integration/e2e tests
- API key exposed in .env.example

---

## Planned Changes (Q2 2026)

### Backend Implementation
- [ ] Node.js + Express + PostgreSQL setup
- [ ] User authentication with OAuth 2.0
- [ ] REST API endpoints for articles, folders, approvals
- [ ] Session management with JWT
- [ ] Real-time WebSocket server for collaboration

### Authentication System
- [ ] Google OAuth integration
- [ ] GitHub OAuth integration
- [ ] User registration flow
- [ ] Password reset functionality

### Testing
- [ ] Unit tests for hooks (useArticleActions, useSearch, etc.)
- [ ] Integration tests for API endpoints
- [ ] E2E tests for critical user flows
- [ ] Target: 70%+ code coverage

### Documentation
- [ ] API documentation (OpenAPI/Swagger)
- [ ] Database schema diagram
- [ ] Architecture decision records (ADRs)
- [ ] Deployment guide

---

## Technical Debt

### High Priority
- [ ] Implement backend (currently only localStorage)
- [ ] Add real authentication (currently mock users)
- [ ] Deploy WebSocket server for real-time collaboration

### Medium Priority
- [ ] Remove API key from .env.example (currently exposed)
- [ ] Add unit tests (0% coverage currently)
- [ ] Optimize full-text search (currently keyword-only)

### Low Priority
- [ ] Fix TypeScript error in `notion-like-editor-mobile-toolbar.tsx`
- [ ] Expand dark mode to all components (currently layout-shell only)
- [ ] Add image optimization service

---

## Security Notes

### Current Status
- No authentication system implemented
- API key exposed in `.env.example` (SECURITY ISSUE - needs immediate fix)
- localStorage not secured (frontend-only demo)
- No CSRF protection yet
- No rate limiting yet

### Planned Mitigations (Q2)
- [ ] OAuth 2.0 implementation
- [ ] JWT-based sessions
- [ ] HTTPS enforcement
- [ ] CORS policy setup
- [ ] Rate limiting on API endpoints
- [ ] Input sanitization
- [ ] XSS prevention

---

## Deployment Notes

### Vercel Configuration
- Auto-deploys from main branch
- Environment variables for API keys (to be configured)
- Edge caching enabled
- 611 kB bundle with code-splitting

### Environment Setup
- **Development**: `npm run dev` (Vite dev server)
- **Production**: `npm run build` → deployed to Vercel
- **Staging**: Manual trigger via Vercel dashboard

---

## Contributors

### Phase 1 (v0.1.0)
- Frontend Engineering: Architecture, components, state management
- UI/UX Design: Layouts, dark mode foundation
- Product: Feature specifications, user stories

### Phase 2 (v0.2.0)
- Frontend Engineering: Refactoring, code-splitting, UI kit migration
- UI/UX Design: Dark mode implementation, UX improvements
- QA: Component testing, visual verification

---

## Related Documents

- [Development Roadmap](./development-roadmap.md) - Upcoming phases and timeline
- [System Architecture](./system-architecture.md) - Technical details
- [Code Standards](./code-standards.md) - Coding conventions
- [Codebase Summary](./codebase-summary.md) - File catalog

---

**Document End**
