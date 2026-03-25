# Phase 04 - Create Code Standards

## Context Links
- [Plan Overview](./plan.md)
- [Scout Report](../reports/scout-260325-0005-codebase-analysis.md)
- Global rules: `~/.claude/rules/development-rules.md`

## Overview
- **Priority**: P2
- **Status**: pending
- **Effort**: 25m

Create `docs/code-standards.md` documenting coding conventions extracted from the existing codebase patterns.

## Key Insights from Codebase Analysis

- **File naming**: kebab-case for components (e.g., `notion-like-editor-header.tsx`), PascalCase for component names
- **Component style**: Function components with hooks, no class components
- **State pattern**: Context + useReducer, centralized in AppContext
- **Exports**: Mix of default and named exports
- **Types**: Defined alongside store in `useAppStore.ts`, some `any` usage
- **Styling**: Tailwind CSS 4, utility-first, cn() helper for class merging
- **Lint command**: `tsc --noEmit` (type checking only, no ESLint configured)
- **No testing framework** configured
- **No ESLint/Prettier** configured

## Architecture / Structure for the Doc

```markdown
# iWiki - Code Standards

## 1. General Principles
  - YAGNI, KISS, DRY
  - Files under 200 lines (split large components)
  - Self-documenting code, meaningful names

## 2. File & Directory Conventions
  ### 2.1 Naming
  - Files: kebab-case (e.g., `article-full-view.tsx`)
  - Components: PascalCase (e.g., `ArticleFullView`)
  - Hooks: camelCase with `use` prefix
  - Constants: SCREAMING_SNAKE_CASE
  - Types/Interfaces: PascalCase

  ### 2.2 Directory Structure
  - `src/components/` - Page-level and feature components
  - `src/ui/` - Reusable UI primitives
  - `src/lib/` - Business logic utilities
  - `src/store/` - State management
  - `src/context/` - React context providers
  - `src/constants/` - App-wide constants
  - `src/data/` - Static/mock data
  - `src/tiptap/` - Editor-related components

## 3. TypeScript Standards
  - Strict mode target: ES2022
  - Prefer explicit types over `any` (refactor goal)
  - Use interfaces for object shapes, types for unions
  - Export types from store file for shared usage
  - Path alias: `@/*` maps to project root

## 4. React Patterns
  ### 4.1 Components
  - Function components only
  - Props interface defined above component
  - Default export for page components
  - Named export for utility/shared components

  ### 4.2 State Management
  - AppContext for global state
  - useReducer with typed actions
  - No prop drilling beyond 2 levels
  - dispatch actions follow: { type: 'VERB_NOUN', ...payload }

  ### 4.3 Hooks
  - Custom hooks in component file if single-use
  - Shared hooks in `src/lib/` or dedicated hook file
  - useApp() for global state access
  - useNavigate() for screen navigation

## 5. Styling
  - Tailwind CSS 4 (utility-first)
  - cn() utility for conditional classes
  - No CSS modules, no styled-components
  - Component-level CSS only for Tiptap editor overrides

## 6. Quality Checks
  - Lint: `npm run lint` (tsc --noEmit)
  - Build: `npm run build`
  - No test framework yet (planned)

## 7. Git Conventions
  - Conventional commits: feat:, fix:, docs:, refactor:, test:, chore:
  - No AI references in commits
  - No secrets in commits (.env files in .gitignore)

## 8. Security
  - Never commit API keys or secrets
  - Use .env files for sensitive config
  - Validate user input before dispatch
```

## Related Code Files

- `tsconfig.json` - TypeScript config
- `package.json` - Scripts, dependencies
- `src/ui/cn.ts` - Class merging utility
- `src/context/AppContext.tsx` - Context pattern example
- `src/store/useAppStore.ts` - State management pattern
- `src/lib/permissions.ts` - Clean utility example (52 lines)
- `src/constants/screens.ts` - Constants pattern

## Implementation Steps

1. Review existing code patterns across multiple files
2. Document observed naming conventions
3. Document component patterns (function components, exports)
4. Document state management conventions
5. Document Tailwind CSS usage patterns
6. Document build/lint commands
7. Document git conventions per global rules
8. Note areas for improvement (any types, missing ESLint)
9. Keep under 800 lines

## Todo List

- [ ] Create `docs/code-standards.md`
- [ ] Document file/directory naming conventions
- [ ] Document TypeScript standards
- [ ] Document React component patterns
- [ ] Document state management conventions
- [ ] Document styling conventions
- [ ] Document quality checks and git conventions
- [ ] Review against actual codebase patterns

## Success Criteria

- File exists at `docs/code-standards.md`
- Conventions match actual codebase patterns (not aspirational)
- Clear distinction between current state and improvement goals
- Under 800 lines
