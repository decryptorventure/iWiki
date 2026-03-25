# Phase 02 - Create Project Overview PDR

## Context Links
- [Plan Overview](./plan.md)
- [Scout Report](../reports/scout-260325-0005-codebase-analysis.md)
- Source: `src/store/useAppStore.ts` (data models), `src/App.tsx` (routing/screens)

## Overview
- **Priority**: P1
- **Status**: pending
- **Effort**: 30m

Create `docs/project-overview-pdr.md` - the Product Development Requirements document defining what iWiki is, who it serves, and what it does.

## Key Insights

- iWiki is an internal knowledge management wiki for iKame company
- Currently frontend-only with mock data; backend TBD
- Target users: iKame employees across all departments
- Core value prop: centralized knowledge sharing with gamification + AI
- Vietnamese language for UI content; English for technical docs

## Requirements

### Functional (extract from codebase analysis)
- Article lifecycle: create -> draft -> submit_review -> approve/reject -> publish
- RBAC with 4 roles: admin, manager, editor, viewer
- Folder-based content organization (Know-How, Company, Tech Dept, Product Guild)
- Real-time collaborative editing via Tiptap + Yjs
- AI assistant (Gemini) for writing and search
- Gamification: XP, levels, coins, badges, bounties
- Search, favorites, custom feeds, notifications

### Non-Functional
- SPA (no SSR currently)
- Responsive design (mobile toolbar exists)
- localStorage for persistence (temporary)
- Vercel deployment target

## Architecture / Structure for the Doc

```markdown
# iWiki - Product Development Requirements

## 1. Product Overview
  - Vision & mission
  - Target users (iKame internal employees)
  - Key value propositions

## 2. User Roles & Personas
  - Admin, Manager, Editor, Viewer
  - Permission matrix summary

## 3. Feature Requirements
  ### 3.1 Article Management
  ### 3.2 Folder Organization
  ### 3.3 Approval Workflow
  ### 3.4 Collaboration (Real-time editing)
  ### 3.5 AI Features (IWikiAI, AIDocEditor, RAG)
  ### 3.6 Gamification (XP, Coins, Badges, Bounties)
  ### 3.7 Search & Discovery
  ### 3.8 User Features (Profile, Favorites, Custom Feed, Notifications)
  ### 3.9 Admin & Manager Tools

## 4. Non-Functional Requirements
  - Performance targets
  - Security requirements
  - Accessibility
  - Internationalization (Vietnamese primary)

## 5. Technical Constraints
  - Current: frontend-only, mock data
  - Target: full-stack with backend API + database

## 6. Success Metrics
  - User adoption rate
  - Articles published per month
  - AI usage metrics
  - Knowledge retrieval time

## 7. Out of Scope (Current Phase)
  - Backend implementation
  - Authentication (OAuth/SSO)
  - File storage
  - Mobile native app
```

## Related Code Files

Files to reference when writing:
- `src/store/useAppStore.ts` - All TypeScript interfaces (User, Article, Folder, Bounty, Notification, etc.)
- `src/lib/permissions.ts` - RBAC model and permission actions
- `src/App.tsx` - All screens/routes
- `src/constants/screens.ts` - Screen constants
- `src/components/Dashboard.tsx` - Main dashboard features
- `src/components/IWikiAI.tsx` - AI assistant features
- `src/components/Bounties.tsx` - Gamification bounties
- `src/components/Editor.tsx` - Article editor

## Implementation Steps

1. Read key source files listed above for accurate feature extraction
2. Create `docs/project-overview-pdr.md` following structure above
3. Document all 4 user roles with their permission levels from `permissions.ts`
4. Document article statuses: draft, in_review, approved, rejected, published
5. Document folder hierarchy from INITIAL_FOLDERS in `useAppStore.ts`
6. Document gamification system (XP, coins, badges, bounties) from User interface
7. Document AI features from component analysis
8. Keep under 800 lines; use concise language
9. Use Vietnamese for section headers/descriptions where it adds clarity for iKame team

## Todo List

- [ ] Create `docs/project-overview-pdr.md`
- [ ] Document product vision and target users
- [ ] Document all user roles and permission matrix
- [ ] Document feature requirements (9 categories)
- [ ] Document non-functional requirements
- [ ] Document technical constraints and current limitations
- [ ] Document success metrics
- [ ] Review for accuracy against codebase

## Success Criteria

- File exists at `docs/project-overview-pdr.md`
- All features from scout report are documented
- Permission model accurately reflects `permissions.ts`
- Article lifecycle accurately reflects `useAppStore.ts` actions
- Under 800 lines

## Risk Assessment

- **Low risk**: Documentation-only change, no code modifications
- **Accuracy risk**: Must cross-reference actual code, not assumptions
