# Phase 06 - Create Development Roadmap

## Context Links
- [Plan Overview](./plan.md)
- [Scout Report](../reports/scout-260325-0005-codebase-analysis.md)

## Overview
- **Priority**: P2
- **Status**: pending
- **Effort**: 25m

Create `docs/development-roadmap.md` - a living document tracking project phases and milestones.

## Key Insights

- Project is in early stage: frontend prototype with mock data
- express + better-sqlite3 already in package.json (backend intent)
- Collaboration infra (Yjs/Hocuspocus) already wired but needs server
- AI integration exists but API key is client-exposed
- No tests, no CI/CD, no deployment pipeline

## Architecture / Structure for the Doc

```markdown
# iWiki - Development Roadmap

## Current Status
  - Phase 1 (Frontend Prototype): ~85% complete
  - Overall project: ~20% toward production

## Phase 1: Frontend Prototype (Current)
  - Status: In Progress (~85%)
  - Components: 26/26 built
  - Missing: Error boundaries, loading states, responsive polish
  - Milestone: Demo-ready SPA

## Phase 2: Documentation & Code Quality
  - Status: In Progress
  - Tasks:
    - Set up docs/ structure
    - Create CLAUDE.md
    - Add ESLint + Prettier
    - Split large files (<200 lines)
    - Remove `any` types
    - Add error boundaries

## Phase 3: Backend Foundation
  - Status: Not Started
  - Tasks:
    - Design database schema (SQLite -> PostgreSQL migration path)
    - Implement Express API layer
    - Authentication (TBD: OAuth, JWT, SSO)
    - Move Gemini API key to server
    - API endpoints for CRUD operations

## Phase 4: Data Migration
  - Status: Not Started
  - Tasks:
    - Migrate mock data to database
    - Implement data seeding
    - Connect frontend to real API
    - Remove mock data from client bundle

## Phase 5: Collaboration Server
  - Status: Not Started
  - Tasks:
    - Set up Hocuspocus server
    - Document versioning
    - Conflict resolution
    - User presence

## Phase 6: Testing
  - Status: Not Started
  - Tasks:
    - Set up Vitest
    - Unit tests for permissions, analytics, store
    - Component tests with React Testing Library
    - E2E tests with Playwright

## Phase 7: CI/CD & Deployment
  - Status: Not Started
  - Tasks:
    - GitHub Actions pipeline
    - Staging environment
    - Production deployment
    - Monitoring

## Phase 8: Production Polish
  - Status: Not Started
  - Tasks:
    - Performance optimization
    - Accessibility audit
    - Security audit
    - User feedback integration

## Milestones
  - M1: Demo-ready prototype (Phase 1)
  - M2: Clean codebase with docs (Phase 2)
  - M3: Backend MVP with auth (Phase 3-4)
  - M4: Real-time collaboration (Phase 5)
  - M5: Tested & deployed (Phase 6-7)
  - M6: Production release (Phase 8)

## Open Questions
  - Backend tech: Express + SQLite or different stack?
  - Auth provider: Google OAuth, email/password, SSO?
  - Hosting: Vercel (frontend) + where for backend?
  - File storage: S3, R2, or local?
```

## Implementation Steps

1. Assess current completion percentages from scout report
2. Define phases based on scout report recommendations
3. Assign estimated timelines (relative, not absolute dates)
4. List open questions that need user decisions
5. Create milestone tracking table
6. Keep under 800 lines

## Todo List

- [ ] Create `docs/development-roadmap.md`
- [ ] Document current status with completion percentages
- [ ] Define 8 development phases with tasks
- [ ] Create milestone tracking table
- [ ] List open questions requiring decisions
- [ ] Add progress tracking format (checkboxes or percentages)

## Success Criteria

- File exists at `docs/development-roadmap.md`
- Phases align with scout report recommendations
- Current status accurately reflects codebase analysis
- Open questions from scout report are captured
- Under 800 lines
