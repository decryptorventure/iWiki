# Phase 03 - Create System Architecture

## Context Links
- [Plan Overview](./plan.md)
- [Scout Report](../reports/scout-260325-0005-codebase-analysis.md)
- Source: `vite.config.ts`, `tsconfig.json`, `package.json`

## Overview
- **Priority**: P1
- **Status**: pending
- **Effort**: 30m

Create `docs/system-architecture.md` documenting the current system architecture and planned future architecture.

## Key Insights

- **Current state**: Client-side SPA only, no backend
- **State management**: React Context + useReducer (single store pattern)
- **Persistence**: localStorage only
- **Editor**: Tiptap 3.x with Yjs collaboration (Hocuspocus provider)
- **AI**: Google Gemini API called directly from client (API key exposed)
- **Build**: Vite 6 + TypeScript 5.8 + Tailwind CSS 4
- **Vendored packages**: @frontend-team/tiptap-kit, @frontend-team/ui-kit (local .tgz)
- **Path alias**: `@/*` maps to project root

## Architecture / Structure for the Doc

```markdown
# iWiki - System Architecture

## 1. Architecture Overview
  - High-level diagram (ASCII)
  - Current: SPA-only architecture
  - Target: Client + API + Database + Collaboration Server

## 2. Technology Stack
  ### 2.1 Frontend
  - React 19, TypeScript 5.8, Vite 6
  - Tailwind CSS 4 (via @tailwindcss/vite plugin)
  - Tiptap 3.x (rich text editor)
  - Yjs + Hocuspocus (real-time collaboration)
  - Motion (animations)
  - Lucide React (icons)

  ### 2.2 AI Integration
  - Google Gemini API (@google/genai)
  - RAG implementation (src/lib/rag.ts)

  ### 2.3 Vendored Packages
  - @frontend-team/tiptap-kit v0.2.7
  - @frontend-team/ui-kit v1.1.1
  - Reason: avoid network timeout on Vercel deploy

  ### 2.4 Future Backend (Planned)
  - Express.js (already in dependencies)
  - better-sqlite3 (already in dependencies)

## 3. Application Architecture
  ### 3.1 Directory Structure
  - Full tree with descriptions

  ### 3.2 State Management
  - AppContext (React Context)
  - appReducer (useReducer)
  - AppState interface
  - Action types (37 actions)
  - localStorage persistence

  ### 3.3 Routing
  - Screen-based navigation (no react-router)
  - APP_SCREENS constants
  - renderScreen() switch pattern

  ### 3.4 Component Architecture
  - 26 page/feature components
  - 5 UI primitives (Button, Card, Input, Modal, IconButton)
  - 6 Tiptap editor components
  - cn() utility for class merging

## 4. Data Models
  - User, Article, Folder, Bounty, Notification
  - Article status lifecycle diagram
  - Permission model (roles, scopes, access levels)

## 5. Security Considerations
  - Current: API key exposed in client bundle
  - Current: No authentication
  - Current: No server-side validation
  - Needed: Move API key to backend, implement auth

## 6. Deployment
  - Build: `vite build`
  - Lint: `tsc --noEmit`
  - Target: Vercel (static SPA)
  - Environment: GEMINI_API_KEY

## 7. Future Architecture (Target)
  - ASCII diagram of full-stack target
  - API layer, database, auth, file storage
  - WebSocket for collaboration
```

## Related Code Files

Files to reference when writing:
- `vite.config.ts` - Build config, aliases, env vars
- `tsconfig.json` - TypeScript config, path aliases
- `package.json` - All dependencies, scripts
- `src/App.tsx` - Application structure, routing
- `src/context/AppContext.tsx` - Context provider pattern
- `src/store/useAppStore.ts` - State shape, reducer, all 37 action types, data models
- `src/lib/permissions.ts` - Permission system
- `src/lib/rag.ts` - RAG implementation
- `src/lib/analytics.ts` - Analytics tracking
- `src/constants/screens.ts` - Screen constants
- `src/tiptap/notion-like-editor.tsx` - Editor implementation

## Implementation Steps

1. Read all config files (vite.config.ts, tsconfig.json, package.json)
2. Catalog all 37 AppAction types from `useAppStore.ts`
3. Map the full directory structure with file purposes
4. Create ASCII architecture diagrams (current + target)
5. Document state management flow: dispatch -> reducer -> localStorage
6. Document the screen-based routing pattern
7. Document data model relationships
8. Document security gaps identified in scout report
9. Keep under 800 lines

## Todo List

- [ ] Create `docs/system-architecture.md`
- [ ] Document current SPA architecture with ASCII diagram
- [ ] Document technology stack with versions
- [ ] Document application architecture (state, routing, components)
- [ ] Document data models and relationships
- [ ] Document security considerations
- [ ] Document deployment configuration
- [ ] Document target full-stack architecture
- [ ] Review for accuracy against actual config files

## Success Criteria

- File exists at `docs/system-architecture.md`
- All dependencies from package.json are documented
- State management pattern accurately described
- Directory structure matches actual codebase
- Under 800 lines

## Risk Assessment

- **Low risk**: Documentation-only
- **Detail risk**: Large store file (1033 lines) - must capture all action types
