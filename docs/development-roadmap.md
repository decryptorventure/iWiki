# iWiki Development Roadmap

**Last Updated**: 2026-03-25
**Version**: 1.0
**Status**: Active Development

---

## Executive Summary

iWiki frontend is production-ready (v0.2.0) with solid architecture, performance optimization, and modern UI/UX. Current focus: backend implementation, real authentication, and advanced AI features.

---

## Phase 1: Foundation & Architecture ✓ COMPLETED

**Timeline**: Q1 2026 (Jan - Mar)
**Status**: COMPLETED
**Progress**: 100%

### Completed Milestones

#### 1.1 Initial Frontend Build (Complete)
- React 19 + TypeScript 5.7 + Vite 6 setup
- Tailwind CSS 4.0 integration
- TipTap 3.x rich text editor
- Mock data with localStorage persistence
- 20 demo articles, 6 demo users

**Files Created**:
- `src/App.tsx`, `src/main.tsx`, `src/index.css`
- `src/store/useAppStore.ts`, `src/store/persist.ts`
- `src/types/` (9 type modules)

#### 1.2 Frontend Refactoring (Complete)
- Types extracted to modular structure (9 files)
- Store optimized: 1033 → ~500 lines
- Components split into sub-components
- Code-splitting: 2,710 kB → 611 kB (77% reduction)
- 6 custom hooks for business logic
- Performance: 200ms search debouncing

**Progress**:
- Bundle optimization: ✓
- Custom hooks: ✓
- Component split: ✓
- Type modularization: ✓

#### 1.3 UI/UX Improvements (Complete)
- Phase 1: Icon fixes, modal cleanup, layout gap resolution (3 issues)
- Phase 2: Editor toolbar restructure, searchable folder picker, shared users input (2 issues)
- Phase 3: Dark mode foundation with toggle, CSS variables, FOUC prevention (1 issue)
- Total: 6 UI/UX improvements resolved

**Status**: All phases completed, `tsc --noEmit` passing

#### 1.4 UI Component Migration (Complete)
- Migrated 23 files from internal components to `@frontend-team/ui-kit`
- Consolidated 40+ instances of Button, Modal, Input, Select, Textarea
- Zero TypeScript errors (1 pre-existing unrelated error)
- Full compatibility achieved

**Files Migrated**:
- Bounties.tsx, Profile.tsx, MyArticles.tsx, SearchResult.tsx
- Editor.tsx, AIDocEditor.tsx, IWikiAI.tsx, ManagerDashboard.tsx
- ArticleFullView.tsx, ArticleModal.tsx, OnboardingTour.tsx
- dashboard-all-articles.tsx, FolderView.tsx, Notifications.tsx
- And 8 more support components

**Architecture Achievement**:
- Clean separation of concerns
- Vendor code isolated (`src/vendor/`)
- All @frontend-team packages vendored for deployment stability
- No external package manager bloat

### Deliverables

- Production-ready frontend at Vercel (611 kB bundle)
- All core features implemented: articles, editor, folders, AI, gamification, search
- Dark mode toggle with localStorage persistence
- Responsive design (mobile-first)
- FOUC prevention in HTML shell

---

## Phase 2: Backend & Authentication (In Planning)

**Timeline**: Q2 2026 (Apr - Jun)
**Status**: PLANNED
**Progress**: 0%

### 2.1 Backend Setup (Not Started)
- Choose stack: Node.js + Express + PostgreSQL (recommended)
- Database schema design
- Connection pooling setup
- CI/CD pipeline (GitHub Actions)

**Effort**: 1 week
**Dependencies**: Decision on stack

### 2.2 Authentication System (Not Started)
- OAuth 2.0 integration (Google, GitHub)
- Session management with JWT
- User login/logout flows
- HTTPS enforcement

**Effort**: 1 week
**Priority**: P0 (blocks all other backend work)

### 2.3 Core API Endpoints (Not Started)
- Article CRUD endpoints
- Folder management API
- Permission validation middleware
- Rate limiting

**Effort**: 2 weeks
**Dependencies**: Auth system complete

### 2.4 Real-time Collaboration (Not Started)
- Hocuspocus WebSocket server deployment
- Yjs sync for collaborative editing
- Conflict resolution testing

**Effort**: 1 week
**Dependencies**: Backend infrastructure ready

### Success Criteria
- All API endpoints tested with Postman
- Auth tokens working end-to-end
- WebSocket connection stable
- Zero data loss on concurrent edits

---

## Phase 3: Advanced Features (In Planning)

**Timeline**: Q3 2026 (Jul - Sep)
**Status**: PLANNED
**Progress**: 0%

### 3.1 RAG Implementation (Not Started)
- Vector embeddings with pgvector
- Semantic search setup
- AI-powered answer generation
- Citation tracking

**Effort**: 2 weeks
**Tech Stack**: OpenAI embeddings API, Pinecone (or PostgreSQL pgvector)

### 3.2 Analytics Dashboard (Not Started)
- User activity metrics (DAU, MAU, session length)
- Content metrics (article creation rate, approval rate)
- Engagement metrics (search queries, bounty completions)
- Admin reports

**Effort**: 1 week

### 3.3 Advanced AI Features (Not Started)
- Auto-tagging for articles
- Content quality scoring
- ML-based notifications
- Search optimization

**Effort**: 2 weeks
**Tech Stack**: Google Gemini API, fine-tuning (optional)

### Success Criteria
- Semantic search working with <500ms latency
- Analytics dashboard live
- Auto-tagging accuracy >80%

---

## Phase 4: Scale & Optimization (In Planning)

**Timeline**: Q4 2026 (Oct - Dec)
**Status**: PLANNED
**Progress**: 0%

### 4.1 Performance Optimization (Not Started)
- Database query optimization
- Redis caching layer for hot articles
- CDN edge caching
- Image optimization

**Effort**: 1 week

### 4.2 Mobile App (Not Started)
- React Native or Flutter evaluation
- iOS/Android builds
- App store deployment

**Effort**: 4-6 weeks
**Priority**: P2 (lower priority, post-MVP)

### 4.3 Integrations (Not Started)
- Slack bot for search
- Google Drive sync
- Jira import
- Email notifications

**Effort**: 2 weeks

### Success Criteria
- 500+ concurrent users supported
- Page load <2s (target: current 1.5s)
- Mobile app available on App Store/Play Store

---

## Current Technical Debt

### Low Priority
1. One pre-existing TypeScript error in `notion-like-editor-mobile-toolbar.tsx` (unrelated to migrations)
2. `.env` file contains exposed Gemini API key → Need .env.local and .gitignore

### Medium Priority
1. No unit tests (0% coverage) - Phase 2 pre-requisite
2. Yjs configured but WebSocket server not deployed
3. Full-text search still basic (keyword matching only)

### High Priority
1. Backend not implemented (all data in localStorage)
2. No real authentication (mock users only)
3. No database (data lost on page refresh)

---

## Success Metrics

### Adoption Targets (Q4 2026)
- MAU: 60%+ (baseline: 30%)
- DAU/MAU Ratio: 30% (baseline: 15%)
- Articles/Month: 50+ (baseline: 10)
- Session Duration: 8 min (baseline: 3 min)

### Engagement Targets
- Articles per active user: 2+ per quarter
- Search queries: 5+ per week per user
- AI usage: 40% of users monthly
- Bounty completion: 70%+

### Quality Targets
- Article quality score: ≥4.0/5
- Approval rate: 70%+ (first submission)
- Time-to-approval: <48h
- Outdated content: <10%

---

## Risk Assessment

### High Risk
1. **Backend Implementation Complexity**
   - Mitigation: Evaluate Supabase (backend-as-a-service) for faster launch

2. **Real-time Collaboration Scaling**
   - Mitigation: Load testing with 100+ concurrent editors before production

3. **AI/RAG Accuracy**
   - Mitigation: Start with keyword matching, iterate with embeddings

### Medium Risk
1. **Data Migration** (if switching from localStorage to PostgreSQL)
   - Mitigation: Plan migration script, backup strategy

2. **Authentication Security**
   - Mitigation: Use well-tested libraries (next-auth, passport.js)

### Low Risk
1. **Performance** (frontend already optimized)
   - Mitigation: Continue monitoring bundle size

---

## Resource Allocation

### Current (Q1 Complete)
- 1 Frontend Engineer (architecture & refactoring)
- 1 UI/UX Designer (fast fixes & dark mode)

### Q2 2026 (Backend Phase)
- 1 Backend Engineer (new hire recommended)
- 1 DevOps Engineer (infrastructure setup)
- 1 Frontend Engineer (API integration, testing)

### Q3 2026 (Advanced Features)
- Maintain core team
- +1 Data Engineer (RAG/embeddings)
- +1 ML Engineer (optional, for auto-tagging)

---

## Dependencies & Blockers

### Frontend Complete ✓
- No blockers

### Backend Phase (Q2)
- **Blocker**: Backend stack decision (recommend Node.js + PostgreSQL)
- **Blocker**: API contract documentation
- **Dependency**: Frontend refactoring complete ✓

### Advanced Features (Q3)
- **Dependency**: Backend + Auth complete
- **Blocker**: Embedding service selection (OpenAI vs. Gemini vs. open-source)

---

## Next Steps

1. **Immediate (This Week)**
   - [ ] Update `.env.local` and `.gitignore` (remove API key exposure)
   - [ ] Add unit tests for core hooks (priority: useArticleActions, useSearch)
   - [ ] Documentation: Update codebase-summary.md with migration details

2. **Short-term (Next Sprint)**
   - [ ] Backend stack RFP (Node.js + Express vs. Next.js vs. Supabase)
   - [ ] Database schema design document
   - [ ] API contract specification

3. **Medium-term (Q2)**
   - [ ] Backend setup and deployment
   - [ ] OAuth integration
   - [ ] API testing suite

---

## Document Links

- [System Architecture](./system-architecture.md) - Technical implementation details
- [Code Standards](./code-standards.md) - Coding conventions and patterns
- [Codebase Summary](./codebase-summary.md) - File catalog and module descriptions
- [Project Changelog](./project-changelog.md) - Detailed change history

---

**Document End**
