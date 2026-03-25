# Phase 08 - Create CLAUDE.md

## Context Links
- [Plan Overview](./plan.md)
- [Scout Report](../reports/scout-260325-0005-codebase-analysis.md)
- Global CLAUDE.md: `~/.claude/CLAUDE.md`
- Global workflows: `~/.claude/workflows/`

## Overview
- **Priority**: P1
- **Status**: pending
- **Effort**: 20m
- **Depends on**: Phases 02-07 (references all docs)

Create project-level `CLAUDE.md` at repository root with iWiki-specific instructions for Claude Agent.

## Key Insights

- Global CLAUDE.md already defines workflows, orchestration, documentation management
- Project CLAUDE.md should NOT duplicate global rules - only project-specific context
- Must reference `docs/` files for architecture, standards, etc.
- Must include: project description, tech stack, key commands, file structure, conventions
- Must flag critical issues (API key exposure, no backend)

## Architecture / Structure for the Doc

```markdown
# CLAUDE.md - iWiki

## Project Overview
  - iWiki: Internal Wiki for iKame company
  - Frontend-only SPA (backend planned)
  - Vietnamese UI content, English technical docs

## Tech Stack
  - React 19 + TypeScript 5.8 + Vite 6
  - Tiptap 3.x + Yjs (collaboration)
  - Tailwind CSS 4
  - Google Gemini API (AI features)
  - Vendored: @frontend-team/tiptap-kit, @frontend-team/ui-kit

## Quick Commands
  - `npm run dev` - Start dev server (port 3000)
  - `npm run build` - Production build
  - `npm run lint` - Type check (tsc --noEmit)
  - `npm run clean` - Remove dist/

## Project Structure
  - Brief directory tree with purposes
  - Key files to read first

## Documentation
  - Link to all docs/ files with descriptions
  - Reference global workflows at ~/.claude/workflows/

## Architecture Decisions
  - Screen-based routing (no react-router), uses APP_SCREENS constants
  - Centralized state: AppContext + useReducer
  - localStorage for persistence (temporary)
  - Vendored packages to avoid Vercel deploy timeouts

## Conventions
  - Reference docs/code-standards.md
  - File naming: kebab-case
  - Components: PascalCase function components
  - State changes: dispatch typed actions

## Critical Notes
  - NO backend exists - all data is mock/localStorage
  - GEMINI_API_KEY exposed in client bundle - do NOT add more secrets
  - No authentication - Login component is mock
  - No tests configured
  - useAppStore.ts is 1033 lines - needs splitting (priority refactor)

## Workflows
  Follow global workflows at ~/.claude/workflows/:
  - primary-workflow.md
  - development-rules.md
  - orchestration-protocol.md
  - documentation-management.md
```

## Related Code Files

- All config files: `package.json`, `vite.config.ts`, `tsconfig.json`
- Entry points: `src/main.tsx`, `src/App.tsx`
- All docs created in Phases 02-07

## Implementation Steps

1. Verify all docs/ files exist (from Phases 02-07)
2. Create `CLAUDE.md` at project root
3. Document project overview and tech stack
4. Document quick commands from package.json scripts
5. Document project structure (brief, link to codebase-summary.md for details)
6. Link to all docs/ files
7. Document architecture decisions unique to this project
8. Reference (not duplicate) global workflows
9. Add critical notes section for gotchas
10. Keep concise - under 150 lines (this is a quick reference, not full docs)

## Todo List

- [ ] Create `/Users/tommac/workwithai/iWiki/CLAUDE.md`
- [ ] Document project overview and tech stack
- [ ] Document all quick commands
- [ ] Document project structure overview
- [ ] Link to all docs/ files
- [ ] Document key architecture decisions
- [ ] Add critical notes (no backend, exposed API key, etc.)
- [ ] Reference global workflows (not duplicate)
- [ ] Verify all doc links are valid

## Success Criteria

- File exists at project root `CLAUDE.md`
- All docs/ links are valid
- Global workflows referenced, not duplicated
- Critical issues (API key, no backend, no auth) clearly flagged
- Under 150 lines (concise quick reference)
- A developer or agent reading only this file can understand the project context

## Risk Assessment

- **Dependency risk**: Must wait for Phases 02-07 to complete for accurate doc links
- **Staleness risk**: CLAUDE.md must be updated when architecture changes
- Mitigation: Add a "Last updated" date

## Security Considerations

- CLAUDE.md must NOT contain any secrets
- Must warn agents about the exposed API key issue
- Must instruct agents to never add secrets to client-side code
