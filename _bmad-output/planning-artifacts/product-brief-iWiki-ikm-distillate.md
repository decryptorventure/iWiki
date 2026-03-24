---
title: "Product Brief Distillate: iWiki Knowledge Hub 4.0"
type: llm-distillate
source: "product-brief-iWiki-ikm.md"
created: "2026-03-20"
purpose: "Token-efficient context for downstream PRD creation"
---

# iWiki 4.0 — Detail Pack for PRD

## Team & Constraints

- **Team**: 2 Senior Fullstack Dev, 1 AI Engineer, 1 UI/UX Designer, 1 QA Tester
- **PM**: Tom (Product Manager, Technology division)
- **All team members use AI tools** for development — expect 1.5-2x throughput vs traditional
- **Timeline**: 8 sprints / 16 weeks (2026-03-16 → 2026-07-03). Sprint 1 already started.
- **Platform**: Custom-built web app at iwiki.ikameglobal.com, currently v3.0.2
- **Org size**: 200 now, plan to scale to 500+
- **iKame divisions**: iKame Games, iKame Apps, Technology, P&OD, Finance & Accounting, Legal & Compliance

## Critical Design Principle

- **PROGRESSIVE ENHANCEMENT ONLY** — do not rebuild. Product is live. Improve UI layer, add features, keep navigation familiar.
- Vibecode prototype (D:\iWiki-main) = aspirational target, not implementation spec
- Each sprint must deliver visible user-facing improvement
- Feature flags + gradual rollout (Managers first → core roles → all)

## Current State Data (from user survey, n=27)

- **Satisfaction**: 2.48/5 (77.7% scored 2-3)
- **Content quality**: 3.07/5
- **MAU**: <30% (target was 100%)
- **Active contributors/month**: ~20
- **Search problems**: 48.1% irrelevant results, 37% no priority ranking, 29.6% no auto-suggest
- **Editor problems**: 44.4% hard to use, 37% no templates, 25.9% no collaboration
- **Viewing problems**: 51.9% outdated content, 33.3% broken links, 29.6% no target audience clarity
- **Approval problems**: 48.1% too many permission steps, 25% no inline feedback (Managers), 25% no deadline reminders
- **Delete problems**: 18.5% permanent delete no recovery, 18.5% broken backlinks after delete

## Rejected Ideas / Out of Scope

- **Slack Bot for AI Q&A** — Tom explicitly said no. Chatbot lives on iWiki website only.
- **Rebuild from scratch** — must improve incrementally on existing platform
- **Collaborative real-time editing** — deprioritized, evaluate after GĐ2 if timeline allows
- **Mobile native app** — responsive web first
- **Deep HR system integration** — phase after 4.0
- **Content strategy ownership** — P&OD owns "Đúc kết Kho báu", Tech provides tools only

## Requirements Hints (from PRD + vibecode + feedback)

### GĐ1: Foundation & Experience (Sprint 1-2)
- **Homepage redesign**: Keep layout concept but modernize visual. Featured articles + "Dành cho bạn" section. Make title prominent, move author avatar to subtle position (hover for details).
- **Article reading page redesign**: Table of Contents (left sidebar), clean reading experience, breadcrumb navigation. Already exists but needs visual polish.
- **Fix critical bugs**: Error 500, blank pages, broken links, auto-save failures in editor
- **Approval workflow simplification**: Reduce steps. Add inline comment per paragraph (like Google Docs). Approval/Reject buttons inside article view (not outside). Show "Chờ duyệt" and "Nháp" labels clearly.
- **Bookmark + Reading History**: Simple features with high daily utility. Already partially exists.
- **RBAC overhaul**: Map to new org structure (BU-based). Current pain: permission setup too complex.
- **Folder/taxonomy restructure**: New structure defined in PDF (7 L1 categories: My iKame, iKame Apps, iKame Games, Technology, P&OD, Finance & Accounting, Legal & Compliance). Each L3+ has 3 sub-folders: Process & Guidelines, Knowledge, Best Practices & Case Studies.
- **KM migration tool**: UI for Knowledge Managers to bulk-move articles to new taxonomy categories.
- **Recycle Bin**: Soft delete with 30-day retention. Admin can restore or permanent delete.
- **Undo for delete**: 5-second undo popup after delete action.

### GĐ2: Content & Search (Sprint 3-4)
- **Semantic Search**: Vietnamese NLP with synonym expansion (vibecode has rag.ts with scoring: title 52pts > tag 24pts > content 12pts). Must handle Vietnamese accents, diacritics removal, compound words.
- **Advanced filters**: By space, author, date range, content type. Show on same page as results (not separate page).
- **AI Write MVP**: Integrate into existing editor (not replace). Capabilities: summarize, expand bullet points to paragraphs, suggest titles, standardize formatting. Template: iKame writing style.
- **Content Templates**: Pre-built for: SOP/Hướng dẫn, Báo cáo, Biên bản họp, Đúc kết kinh nghiệm, Weekly Report, PRD.
- **Search preview**: Show AI-generated 3-line summary under each result (not first lines of article).
- **Search UX**: Click search → type directly in expanded search bar (current: redirects to separate page, requires double click). Filter panel visible alongside results.

### GĐ3: Intelligent Assistant (Sprint 5-6)
- **AI Chatbot on iWiki**: RAG-based Q&A from knowledge base. Must respect RBAC (user only sees answers from articles they have access to). Show citations with links to source articles. Response time target: <3 seconds.
- **Personalized Newsfeed**: Homepage shows content ranked by: tag affinity + space membership + role hints + reading history + freshness. Vibecode scoring: 20 base + tag affinity + space match + role hints + recent read bonus + freshness.
- **AI Content Auditing**: Auto-scan and label articles: "Cần cập nhật" (>6 months no edit), "Có thể trùng lặp" (similar content detected), "Chất lượng thấp" (short/no structure). Notify authors.
- **Content Lifecycle states**: Draft → In Review → Published → Needs Update → Archived. Auto-remind author when article flagged for update.

### GĐ4: Culture & Adoption (Sprint 7-8)
- **Gamification**: XP for actions (create article, get likes, answer questions). Coins from bounties. Badges: First Article, Knowledge Sharer, Top Contributor, AI Pioneer. Leaderboard: weekly/monthly/quarterly.
- **Bounty Board**: Any user can request content on a topic. Reward in coins. Tags for categorization. Deadline tracking. "Hot" flag for urgent needs.
- **Manager Dashboard**: Team article stats by status. Top read articles. Active contributors. Pending approvals queue. Knowledge gap report (top failed searches).
- **Analytics Dashboard**: System-wide: MAU, new articles, top search terms, most read articles. Engagement: top contributors, top viewers, avg time on article. Search analytics: successful vs failed searches → identify knowledge gaps.

## Stakeholder Map (RASCI)

| Activity | Tech (Dũng) | Tech (Long) | P&OD (NA) | P&OD (Thảo) | BOD (Nguyệt) | BOD (Nghĩa) | BOD (Quyết) |
|---|---|---|---|---|---|---|---|
| Requirements & Expectations | I | C | R | A | C | C | C |
| Project Charter & Planning | R | A | I+S | I+S | I | I+C | I |
| Product Development | R | A | I+C | I+C | I+C | I+C | I+C |
| Acceptance Testing | I | I | R | A | C+S | I | I |
| User Operations | I+C | I+C | R | A | I+C | I | I |
| Product Operations | R | A | I | I | I | I+C | I |

## Technical Context

- **Current v3.0.2 features**: Article CRUD, folder navigation, basic keyword search, approval workflow (with bugs), author profile, likes, comments, bookmark (partial), Slack notifications (partially broken)
- **Known tech debt**: Error 500 occurrences, blank pages, broken auto-save, link errors, inconsistent Vietnamese/English UI labels, double-click-to-search issue
- **Vibecode tech stack** (aspirational): React 19 + Vite + TailwindCSS + Lucide icons + Google Gemini API + better-sqlite3. Reducer-based state management. This informs UI direction but is NOT the production stack.
- **AI model flexibility**: Vibecode shows multi-model support (Gemini, GPT-4o, Claude). PRD should allow model switching.

## Competitive Intelligence

- **Enterprise KM market**: USD 23.2B (2025), 13.8% CAGR to 2034
- **AI KM segment**: USD 3.1B (2025), 42.9% CAGR — explosive growth
- **Key competitors' AI features**: Guru (semantic search + Slack), Glean (RAG + summarization), Tettra (AI bot from conversations)
- **Industry benchmarks**: Enterprise software NPS median 44; B2B SaaS avg 40% MAU benchmark; 74% of SMBs adopted digital KM (2024)
- **#1 silent killer**: Content decay — stale content is worse than no content. AI maintenance is differentiator.
- **iWiki advantage over Confluence/Notion**: Custom-built = full UX control, Vietnamese-first NLP, iKame-specific AI training, no per-seat licensing cost at scale

## Adoption Strategy (for People Manager Team)

- **Content Seeding**: Pre-populate top 50 most-accessed docs before GĐ2 search launch
- **Champion Program**: 1-2 Knowledge Champions per BU, early access, training, empowered to suggest content
- **Executive Sponsorship**: BOD must visibly use iWiki (write, react, comment)
- **Onboarding Mandate**: All new hires complete "iWiki Orientation" in week 1
- **Manager Accountability**: iWiki contribution data feeds into Performance Review
- **Knowledge Gap Alerts**: Show managers what their team searches for but can't find
- **Gradual Rollout**: Managers → Core Roles → All Company
- **Celebration**: Monthly top contributors recognition, badges on internal profile

## Production Technical Stack (CONFIRMED)

Full details in `docs/tech-spec.md`. Key facts for PRD:

| Layer | Technology | PRD Implication |
|---|---|---|
| **Backend** | NestJS 10 + Node.js 20 + TypeScript | Clean Architecture — add features via new modules/usecases |
| **Database** | MongoDB (Mongoose 7) | Document model — flexible schema for new fields (gamification, analytics) |
| **Search** | RediSearch (`FT.SEARCH` on `documentIdx`) | Current: keyword match + Vietnamese diacritics removal. Upgrade path: Elasticsearch (installed, unused) for semantic/vector search |
| **AI** | Gemini 2.0 Flash (Genkit) + internal AI at `ai.ikamegroup.com` | AI Write & Chatbot: extend GeminiService. AI Search: extend/replace internal AI endpoint with RAG pipeline |
| **Auth** | Keycloak SSO + API Key fallback (Passport JWT) | RBAC: extend existing auth guards. No new auth system needed |
| **Real-time** | Socket.io (`@nestjs/websockets`) | Ready for: live notifications, future collaborative editing |
| **Job Queue** | Bull (Redis-backed) | AI batch processing already uses this (AiAgentProcessor). Extend for: content auditing cron jobs |
| **File Storage** | Google Cloud Storage | Document PDFs, images already handled |
| **Deployment** | Docker + Kubernetes + GitLab CI/CD | Fast ship cycle. Feature flags via env vars or config |
| **Analytics** | NONE — raw MongoDB only | **CRITICAL GAP**: Must add event tracking in GĐ1 to measure all KPIs |
| **AI Budget** | No limits configured | Must add token/cost monitoring before scaling AI features to 200+ users |

**Architecture decisions for PRD:**
- Semantic Search: Evaluate Elasticsearch (already installed) vs enhancing RediSearch with vector similarity. AI Engineer decision.
- AI Chatbot: Build as new NestJS module, leveraging existing GeminiService + Bull queue for async processing
- Analytics: Add lightweight event tracking (custom MongoDB collection or consider Posthog/Mixpanel for dashboard)
- Gamification: New MongoDB collections for XP, coins, badges, bounties. New NestJS module.
- Content Lifecycle: Extend existing document schema with status field + Bull cron job for auto-audit

**External service map (each feature must check dependencies):**
- `keycloak.ikameglobal.com` — all auth flows
- `users-dev.ikameglobal.com/graphql-dev` — user profiles, org structure (RBAC depends on this)
- `ai.ikamegroup.com` — current AI search (may be replaced/extended)
- `my-ikame.ikameglobal.com` — notifications (Slack + in-app)
- `vault.ikameglobal.com` — secrets management

## Remaining Open Questions

1. **Frontend tech stack** — What framework is the current iWiki frontend? (React? Vue? Angular?) Need source code access (scheduled for Monday)
2. **Database schema** — What are the current MongoDB collections and document schemas? (Will review from source code)
3. **AI internal endpoint** — What model powers `ai.ikamegroup.com`? Is it managed by iWiki team or a shared platform team?
4. **RediSearch vs Elasticsearch** — Team preference for semantic search upgrade path?
5. **Budget ceiling for AI APIs** — Need explicit monthly cost target from BOD before scaling
