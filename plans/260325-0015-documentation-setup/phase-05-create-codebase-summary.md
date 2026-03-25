# Phase 05 - Create Codebase Summary

## Context Links
- [Plan Overview](./plan.md)
- [Scout Report](../reports/scout-260325-0005-codebase-analysis.md)

## Overview
- **Priority**: P2
- **Status**: pending
- **Effort**: 20m

Create `docs/codebase-summary.md` - a quick reference map of the codebase for developers and AI agents.

## Key Insights

- 46 TypeScript/TSX files in `src/`
- 26 components, 5 UI primitives, 6 tiptap components
- 3 lib utilities, 1 store, 1 context, 1 constants file, 1 data file
- 2 vendored packages in `libs/`
- Single entry point: `src/main.tsx` -> `src/App.tsx`

## Architecture / Structure for the Doc

```markdown
# iWiki - Codebase Summary

## 1. Quick Stats
  - Total files, LOC, components count
  - Stack summary one-liner

## 2. Entry Points
  - src/main.tsx -> src/App.tsx -> AppProvider -> AppInner
  - vite.config.ts (build config)

## 3. Directory Map
  Full tree with one-line descriptions per file

## 4. Key Files (must-read for new developers)
  ### Core
  - src/App.tsx - Root component, routing, screen rendering
  - src/store/useAppStore.ts - State, types, reducer (largest file)
  - src/context/AppContext.tsx - Context provider + useApp hook

  ### Business Logic
  - src/lib/permissions.ts - RBAC permission checks
  - src/lib/analytics.ts - Event tracking
  - src/lib/rag.ts - AI RAG implementation

  ### Editor
  - src/tiptap/notion-like-editor.tsx - Main editor
  - src/components/Editor.tsx - Editor wrapper

  ### Config
  - package.json, vite.config.ts, tsconfig.json

## 5. Component Registry
  Table of all 26 components with:
  - File path
  - Purpose (one line)
  - Key dependencies

## 6. Data Models Quick Reference
  - User (roles, XP, coins, badges, scopes)
  - Article (status lifecycle, permissions)
  - Folder (hierarchical, 4 top-level)
  - Bounty (gamification rewards)
  - Notification (6 types)

## 7. Vendored Packages
  - @frontend-team/tiptap-kit v0.2.7 - Tiptap extensions
  - @frontend-team/ui-kit v1.1.1 - UI components (toast, etc.)

## 8. Environment Variables
  - GEMINI_API_KEY - Google Gemini API key
  - DISABLE_HMR - Disable HMR for AI Studio

## 9. Known Issues / Tech Debt
  - Large components >200 lines
  - `any` type usage in permissions.ts
  - No error boundaries
  - No loading states
  - API key exposed in client bundle
  - No backend, mock data only
```

## Related Code Files

All 46 files in `src/` plus config files. Key ones:
- `src/App.tsx` (216 lines)
- `src/store/useAppStore.ts` (1033 lines - largest file, needs splitting)
- `src/lib/permissions.ts` (52 lines)
- `src/context/AppContext.tsx` (33 lines)
- `src/constants/screens.ts` (22 lines)
- `package.json`

## Implementation Steps

1. Use glob to get complete file listing with line counts
2. Categorize all 46 files by purpose
3. Create component registry table
4. Document data model quick reference
5. Document environment variables
6. List known tech debt from scout report
7. Keep under 800 lines

## Todo List

- [ ] Create `docs/codebase-summary.md`
- [ ] Document full directory map with descriptions
- [ ] Create component registry table
- [ ] Document key files and entry points
- [ ] Document data models quick reference
- [ ] Document vendored packages and env vars
- [ ] List known issues and tech debt

## Success Criteria

- File exists at `docs/codebase-summary.md`
- All 46 source files are cataloged
- Component registry is complete and accurate
- Quick reference for data models matches actual TypeScript interfaces
- Under 800 lines
