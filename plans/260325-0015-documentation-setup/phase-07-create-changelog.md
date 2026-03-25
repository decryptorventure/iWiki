# Phase 07 - Create Changelog

## Context Links
- [Plan Overview](./plan.md)
- [Scout Report](../reports/scout-260325-0005-codebase-analysis.md)
- Git log: 2 commits on main

## Overview
- **Priority**: P3
- **Status**: pending
- **Effort**: 15m

Create `docs/project-changelog.md` - a record of significant changes, initialized from git history and codebase analysis.

## Key Insights

- Only 2 git commits exist:
  1. `d5855bc` - "pushing code to iWiki" (initial commit)
  2. `62534e0` - "fix: vendor private packages to resolve Vercel deployment network timeout"
- No release tags, no versioning scheme yet
- This will be a living document updated with each significant change

## Architecture / Structure for the Doc

```markdown
# iWiki - Project Changelog

## Format
All notable changes documented here. Format follows Keep a Changelog.
Versioning follows Semantic Versioning once releases begin.

## [Unreleased]
### Added
- Documentation structure (docs/, CLAUDE.md)

## [0.1.0] - 2026-03-25
### Added
- Initial frontend prototype with 26 components
- Article management (create, edit, draft, review, approve, publish)
- RBAC system (admin, manager, editor, viewer)
- Folder-based content organization
- Tiptap rich text editor with collaboration support
- AI assistant (IWikiAI) with Gemini integration
- AI document editor (AIDocEditor)
- RAG implementation for knowledge retrieval
- Gamification: XP, levels, coins, badges
- Bounty system for knowledge contribution
- Dashboard with personalized feed
- Search with history
- Favorites and custom feed
- Notifications system
- User profile with badges and stats
- Admin and Manager dashboards
- Document and Permission management
- Data Janitor tools
- Onboarding tour for new users
- localStorage persistence
- Mobile toolbar for editor

### Fixed
- Vendored @frontend-team/tiptap-kit and @frontend-team/ui-kit to resolve Vercel deploy timeout

### Known Issues
- No backend (mock data only)
- API key exposed in client bundle
- No authentication
- No tests
- Some components exceed 200 line limit
- `any` type usage in permissions.ts
```

## Implementation Steps

1. Review git log for commit history
2. Compile feature list from scout report and component analysis
3. Create initial changelog entry with all existing features
4. Add [Unreleased] section for upcoming doc changes
5. Document known issues
6. Keep under 800 lines

## Todo List

- [ ] Create `docs/project-changelog.md`
- [ ] Document initial release (v0.1.0) with all features
- [ ] Add [Unreleased] section
- [ ] Document known issues
- [ ] Establish changelog format going forward

## Success Criteria

- File exists at `docs/project-changelog.md`
- All existing features are cataloged
- Known issues match scout report findings
- Format follows Keep a Changelog standard
- Under 800 lines
