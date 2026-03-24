---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - prd.md
  - ux-design-specification.md
scope: prototype
---

# iWiki 4.0 Prototype - Epic Breakdown

## Overview

Tài liệu này phân rã requirements từ PRD và UX Design Specification thành các epics và stories cho việc xây dựng **PROTOTYPE UI/UX** với mock data. Mục đích: PO build prototype demo → Dev dựa vào đó để làm giao diện thật + tích hợp backend.

## Requirements Inventory

### Functional Requirements

- FR1: Viewer can search articles using natural language queries in Vietnamese (including typos, missing diacritics, synonyms)
- FR2: Viewer can filter search results by space/BU, author, date range, content type, and tags
- FR3: Viewer can view AI-generated summary snippets for each search result
- FR4: Viewer can ask questions in natural language to an AI Chatbot and receive answers with cited source articles
- FR5: AI Chatbot can refuse to answer or indicate uncertainty when no relevant source exists
- FR6: AI Chatbot can restrict answers to only articles the requesting user has RBAC permission to view
- FR7: Viewer can view personalized content recommendations on homepage based on role, BU, reading history
- FR8: Viewer can view recently read articles and bookmarked articles from their personal section
- FR9: Contributor can create articles using pre-built content templates
- FR10: Contributor can select text and invoke AI Write to expand bullet points into formatted paragraphs
- FR11: Contributor can invoke AI Write to summarize, suggest titles, and standardize formatting
- FR12: AI Write can generate content following iKame writing style without fabricating facts
- FR13: Contributor can save article drafts with reliable auto-save
- FR14: Contributor can upload and embed images within articles
- FR15: Contributor can add tags and metadata to articles
- FR16: Contributor can view version history and restore previous versions
- FR17: Contributor can delete articles with 5-second undo; deleted articles go to Recycle Bin
- FR18: Contributor can submit articles for review with a single action
- FR19: Reviewer/Manager can approve or reject articles directly from article view
- FR20: Reviewer can add inline comments on specific paragraphs
- FR21: Contributor can see clear status labels (Nháp, Chờ duyệt, Đã đăng, Cần cập nhật, Archived)
- FR22: System can send notifications to reviewers and contributors
- FR23: KM can view articles organized by taxonomy
- FR24: KM can bulk-move articles between categories using migration tool
- FR25: KM can merge duplicate articles and archive outdated ones
- FR26: Admin can configure RBAC permissions
- FR27: Admin can manage folder/taxonomy structure
- FR28: System can maintain breadcrumb navigation
- FR29: System can flag articles not updated for >6 months
- FR30: System can detect potentially duplicate articles
- FR31: System can send automatic reminders to authors
- FR32: System can transition articles through lifecycle states
- FR33: Admin can restore articles from Recycle Bin
- FR34: System can maintain audit trail
- FR35: User can earn XP points for actions
- FR36: User can earn badges for milestones
- FR37: User can view leaderboard of top contributors
- FR38: User can view their own contribution profile
- FR39: User can create bounty requests for missing knowledge topics
- FR40: Contributor can claim and fulfill bounty requests
- FR41: User can like and comment on published articles
- FR42: Manager can view dashboard showing team article statistics
- FR43: Manager can view knowledge gap reports
- FR44: Manager can trigger reminder notifications
- FR45: Admin can view system-wide analytics
- FR46: Admin can view search analytics
- FR47: Admin can monitor AI API usage and costs
- FR48: Admin can view and manage user roles and permissions
- FR49: System can send in-app notifications
- FR50: User can configure notification preferences
- FR51: System can send notifications via in-app + Slack
- FR52: User can view notification center with history

### Non-Functional Requirements

- NFR-P1: Trang đọc bài load <2s (P95)
- NFR-P2: Keyword search <500ms (P95)
- NFR-P3: Semantic search <3s (P95)
- NFR-P4: AI Chatbot first token <3s, complete <8s
- NFR-P5: AI Write response <5s
- NFR-P6: API CRUD <200ms (P95)
- NFR-P7: 100 concurrent users
- NFR-P8: Auto-save mỗi 30 giây
- NFR-S1-S7: Security requirements (Keycloak SSO, RBAC, audit trail, rate limiting)
- NFR-SC1-SC4: Scalability (200→500 users, 10K articles)
- NFR-R1-R4: Reliability (99.5% uptime, zero data loss, graceful degradation)
- NFR-I1-I5: Integration (Keycloak, User service, GCS, Gemini API)
- NFR-A1-A4: Accessibility (keyboard nav, contrast, semantic HTML, alt text)

### Additional Requirements

- Prototype scope: UI/UX với mock data, không cần backend thật
- Design System: @frontend-team/ui-kit + @frontend-team/tiptap-kit
- Design Direction: C — AI-First (AI Chat Hero + Personalized Feed)
- Progressive Enhancement: nâng cấp trên nền tảng v3, không rebuild

### UX Design Requirements

- UX-DR1: AI-First Homepage — AIChatHero + PersonalizedFeed + QuickActions
- UX-DR2: AI Chat Panel — Streaming response mock, citations, feedback buttons
- UX-DR3: Article Reading View — Typography 720px, TOC, reaction bar, related articles
- UX-DR4: NotionEditor + AI Write — Template gallery, AI expand, slash commands
- UX-DR5: Search Command Palette — Cmd+K, tabs (articles/AI/people)
- UX-DR6: Knowledge Tree Sidebar — Collapsible, spaces/categories
- UX-DR7: KM Dashboard — Health score, action items, review queue, analytics
- UX-DR8: Gamification UI — XP, badges, leaderboard, contributor profile
- UX-DR9: Notification Panel — Dropdown, categories, history
- UX-DR10: Design System Migration — ui-kit tokens, custom components
- UX-DR11: Responsive Layout — Desktop primary, tablet functional, mobile read-only
- UX-DR12: Empty States — No dead-ends, AI suggestions everywhere
- UX-DR13: Loading States — Skeleton, streaming, progress indicators

### FR Coverage Map

| FR | Epic | Mô tả |
|---|---|---|
| FR1 | Epic 4 | Search natural language Vietnamese |
| FR2 | Epic 4 | Filter search results |
| FR3 | Epic 4 | AI summary snippets |
| FR4 | Epic 3 | AI Chatbot Q&A |
| FR5 | Epic 3 | AI refuse/uncertainty |
| FR6 | Epic 3 | AI RBAC-aware |
| FR7 | Epic 2 | Personalized recommendations |
| FR8 | Epic 2 | Recently read + bookmarks |
| FR9 | Epic 6 | Content templates |
| FR10 | Epic 6 | AI Write expand |
| FR11 | Epic 6 | AI Write summarize/format |
| FR12 | Epic 6 | AI iKame style |
| FR13 | Epic 6 | Auto-save |
| FR14 | Epic 6 | Upload images |
| FR15 | Epic 6 | Tags/metadata |
| FR16 | Epic 6 | Version history |
| FR17 | Epic 6 | Delete + undo + Recycle Bin |
| FR18 | Epic 7 | Submit for review |
| FR19 | Epic 7 | Approve/reject |
| FR20 | Epic 7 | Inline comments |
| FR21 | Epic 7 | Status labels |
| FR22 | Epic 7 | Review notifications |
| FR23 | Epic 8 | Taxonomy view |
| FR24 | Epic 8 | Bulk-move articles |
| FR25 | Epic 8 | Merge/archive |
| FR26 | Epic 8 | RBAC config |
| FR27 | Epic 8 | Taxonomy management |
| FR28 | Epic 1 | Breadcrumb navigation |
| FR29 | Epic 10 | Auto-flag outdated |
| FR30 | Epic 10 | Duplicate detection |
| FR31 | Epic 10 | Auto-reminders |
| FR32 | Epic 10 | Lifecycle states |
| FR33 | Epic 10 | Recycle Bin restore |
| FR34 | Epic 10 | Audit trail |
| FR35 | Epic 9 | XP points |
| FR36 | Epic 9 | Badges |
| FR37 | Epic 9 | Leaderboard |
| FR38 | Epic 9 | Contribution profile |
| FR39 | Epic 9 | Bounty requests |
| FR40 | Epic 9 | Claim bounties |
| FR41 | Epic 5 | Like/comment |
| FR42 | Epic 10 | Manager dashboard |
| FR43 | Epic 10 | Knowledge gap reports |
| FR44 | Epic 10 | Trigger reminders |
| FR45 | Epic 10 | System analytics |
| FR46 | Epic 10 | Search analytics |
| FR47 | Epic 10 | AI cost monitoring |
| FR48 | Epic 10 | User roles management |
| FR49 | Epic 11 | In-app notifications |
| FR50 | Epic 11 | Notification preferences |
| FR51 | Epic 11 | Multi-channel notifications |
| FR52 | Epic 11 | Notification center |

## Epic List

### Epic 1: Project Setup & Design System Foundation
Thiết lập project prototype, cài đặt ui-kit + tiptap-kit, tạo layout shell (topbar, sidebar, routing) — nền tảng để build mọi page.
**FRs covered:** FR28
**UX-DRs covered:** UX-DR10, UX-DR11

### Epic 2: AI-First Homepage
User mở iWiki → thấy AI Chat Hero + Personalized Feed + Quick Actions — trang chủ hoàn chỉnh với mock data.
**FRs covered:** FR7, FR8
**UX-DRs covered:** UX-DR1, UX-DR12, UX-DR13

### Epic 3: AI Chat Experience
User hỏi câu hỏi → nhận câu trả lời streaming với citations + feedback — trải nghiệm "Hỏi là có" hoàn chỉnh (mock AI response).
**FRs covered:** FR4, FR5, FR6
**UX-DRs covered:** UX-DR2

### Epic 4: Search & Discovery
User nhấn Cmd+K → Search Command Palette mở ra → tìm bài viết, hỏi AI, tìm người — với mock results.
**FRs covered:** FR1, FR2, FR3
**UX-DRs covered:** UX-DR5

### Epic 5: Article Reading Experience
User click bài viết → đọc bài với typography 720px, TOC, related articles, reaction bar — trải nghiệm đọc tối ưu.
**FRs covered:** FR41
**UX-DRs covered:** UX-DR3

### Epic 6: Content Creation & AI Write
User tạo bài mới → chọn template → viết với NotionEditor + AI Write assist → preview → publish — luồng viết bài hoàn chỉnh.
**FRs covered:** FR9, FR10, FR11, FR12, FR13, FR14, FR15, FR16, FR17
**UX-DRs covered:** UX-DR4

### Epic 7: Review & Approval Workflow
Contributor submit bài → Reviewer thấy trong queue → approve/reject với inline comments → status thay đổi — luồng duyệt bài hoàn chỉnh.
**FRs covered:** FR18, FR19, FR20, FR21, FR22

### Epic 8: Knowledge Organization & Navigation
User navigate qua sidebar tree → thấy taxonomy spaces/categories → breadcrumb → KM có bulk actions — tổ chức tri thức rõ ràng.
**FRs covered:** FR23, FR24, FR25, FR26, FR27
**UX-DRs covered:** UX-DR6

### Epic 9: Gamification & Engagement
User thấy XP, badges, leaderboard → contributor thấy profile stats → bounty system — motivation loop hoàn chỉnh.
**FRs covered:** FR35, FR36, FR37, FR38, FR39, FR40
**UX-DRs covered:** UX-DR8

### Epic 10: KM Dashboard & Analytics
KM mở dashboard → thấy health score, action items, review queue, gap analysis, contributor analytics — tool quản lý tri thức.
**FRs covered:** FR29, FR30, FR31, FR32, FR33, FR34, FR42, FR43, FR44, FR45, FR46, FR47, FR48
**UX-DRs covered:** UX-DR7

### Epic 11: Notifications
User thấy notification icon với badge count → mở panel → thấy history, categories, preferences — hệ thống thông báo.
**FRs covered:** FR49, FR50, FR51, FR52
**UX-DRs covered:** UX-DR9

---

## Epic 1: Project Setup & Design System Foundation

Thiết lập project prototype, cài đặt ui-kit + tiptap-kit, tạo layout shell (topbar, sidebar, routing) — nền tảng để build mọi page.

### Story 1.1: Khởi tạo Project & Cài đặt Design System

As a **Developer**,
I want thiết lập project React với ui-kit và tiptap-kit đã cài đặt và cấu hình đúng,
So that tôi có nền tảng sẵn sàng để build mọi component và page.

**Acceptance Criteria:**

**Given** project React mới được khởi tạo
**When** chạy `npm install` và `npm run dev`
**Then** app chạy thành công với `TooltipProvider` + `Toaster` ở root
**And** `@frontend-team/ui-kit/style.css` và `@frontend-team/tiptap-kit/styles.css` được import
**And** render được 1 `Button` variant="primary" để verify ui-kit hoạt động

### Story 1.2: Layout Shell — Topbar, Sidebar, Main Content

As a **User**,
I want thấy layout chuẩn với topbar, sidebar collapsible, và main content area,
So that tôi có thể navigate giữa các trang của iWiki.

**Acceptance Criteria:**

**Given** user mở app
**When** trang load xong
**Then** hiển thị Topbar (56px) với: Logo "iWiki", nút ☰ hamburger, Search bar placeholder, nút +, nút 🔔, Avatar user
**And** Sidebar (260px) ẩn mặc định trên homepage, mở khi click ☰
**And** Main content area chiếm full width khi sidebar ẩn
**And** Breadcrumb component hiển thị khi navigate vào sub-pages (FR28)

### Story 1.3: Routing & Page Stubs

As a **Developer**,
I want routing đã setup với tất cả page stubs,
So that navigation giữa các pages hoạt động và mỗi epic có page sẵn để build.

**Acceptance Criteria:**

**Given** app đã có layout shell
**When** navigate qua router
**Then** các routes sau hoạt động: `/` (Home), `/chat` (AI Chat full), `/search` (Search), `/articles/:id` (Article View), `/editor/new` (New Article), `/editor/:id` (Edit Article), `/spaces/:id` (Space View), `/dashboard` (KM Dashboard), `/profile` (User Profile), `/notifications` (Notifications), `/admin` (Admin)
**And** mỗi page hiển thị placeholder text với tên page
**And** Topbar và Sidebar (khi mở) persist across navigation

### Story 1.4: Responsive Layout Foundation

As a **User trên tablet/mobile**,
I want layout tự adapt theo kích thước màn hình,
So that tôi có trải nghiệm phù hợp trên mọi thiết bị.

**Acceptance Criteria:**

**Given** app đã có layout shell
**When** viewport ≥1280px (Desktop)
**Then** layout full với sidebar có thể mở, right panel optional
**When** viewport 768-1279px (Tablet)
**Then** sidebar ẩn mặc định, mở overlay khi toggle
**When** viewport ≤767px (Mobile)
**Then** bottom navigation hiển thị: Home, Search, AI Chat, Profile
**And** sidebar không khả dụng, content full-width

---

## Epic 2: AI-First Homepage

User mở iWiki → thấy AI Chat Hero + Personalized Feed + Quick Actions — trang chủ hoàn chỉnh với mock data.

### Story 2.1: AI Chat Hero Section

As a **Viewer**,
I want thấy AI Chat Hero ngay khi mở iWiki với lời chào cá nhân hóa,
So that tôi có thể hỏi câu hỏi ngay lập tức.

**Acceptance Criteria:**

**Given** user mở trang chủ `/`
**When** page load xong
**Then** hiển thị AI Chat Hero ở trung tâm: icon gradient ✨ (48px), text "Xin chào [Tên]! Hôm nay bạn cần gì?", subtitle muted, input bar với placeholder, nút "Hỏi AI ✨" (purple gradient)
**And** Quick Action chips bên dưới: 4 chips mock ("Quy trình onboarding", "Deploy checklist", "Viết bài mới với AI", "Đang trending")
**When** user click vào input
**Then** input focus với purple glow border
**When** user gõ text và nhấn Enter hoặc click "Hỏi AI"
**Then** navigate sang `/chat` với query đã gõ

### Story 2.2: Personalized Feed — "Cho bạn"

As a **Viewer**,
I want thấy feed bài viết được cá nhân hóa bên dưới AI Hero,
So that nội dung tôi cần đọc đã ở ngay trước mắt mà không cần tìm. (FR7)

**Acceptance Criteria:**

**Given** user ở trang chủ, scroll xuống dưới AI Hero
**When** section "✨ Cho bạn" hiển thị
**Then** hiển thị 4 ArticleCards dạng grid 2x2 với mock data
**And** mỗi card có: avatar author, tên + space + thời gian, tiêu đề (h3), excerpt (2 dòng), footer stats (views, likes, comments, read time)
**And** ít nhất 1 card có tag AI reason "🤖 Vì bạn ở team Engineering"
**And** có link "Xem tất cả →" ở header section

### Story 2.3: Feed Sections — "Mới nhất" & "Đang hot"

As a **Viewer**,
I want thấy thêm sections "Mới nhất" và "Đang hot" trong feed,
So that tôi có nhiều cách khám phá nội dung. (FR7)

**Acceptance Criteria:**

**Given** user scroll tiếp xuống dưới "Cho bạn"
**When** section "🕐 Mới nhất" hiển thị
**Then** hiển thị 4 ArticleCards chronological với mock data
**When** section "🔥 Đang hot trong Engineering" hiển thị
**Then** hiển thị 3 compact ArticleCards dạng grid 3 cột với stats (views, likes)
**And** mỗi section có header + "Xem tất cả →"

### Story 2.4: Bookmarks & Recently Read

As a **Viewer**,
I want truy cập nhanh bài đã đọc và đã bookmark,
So that tôi không mất thời gian tìm lại. (FR8)

**Acceptance Criteria:**

**Given** user ở trang chủ
**When** sidebar mở (click ☰)
**Then** sidebar hiển thị section "📌 Bookmarks" với 3-4 mock bookmarked articles
**And** section "🕐 Đọc gần đây" với 3-4 mock recently read articles
**When** click vào item
**Then** navigate sang `/articles/:id`

### Story 2.5: Loading & Empty States cho Homepage

As a **Viewer**,
I want thấy skeleton loading khi feed đang tải, và empty states khi chưa có data,
So that tôi luôn biết hệ thống đang làm gì. (UX-DR12, UX-DR13)

**Acceptance Criteria:**

**Given** feed đang load (mock 1.5s delay)
**When** data chưa sẵn sàng
**Then** hiển thị Skeleton cards (4 cards) thay vì blank
**Given** feed trống (mock empty state)
**When** không có bài viết nào
**Then** hiển thị: "Chào mừng! Hãy theo dõi một vài spaces" + button [Khám phá Spaces]
**And** KHÔNG BAO GIỜ hiển thị trang trắng

---

## Epic 3: AI Chat Experience

User hỏi câu hỏi → nhận câu trả lời streaming với citations + feedback — trải nghiệm "Hỏi là có" hoàn chỉnh (mock AI response).

### Story 3.1: AI Chat Full Page — Conversation UI

As a **Viewer**,
I want chat với AI trên full page với giao diện conversation,
So that tôi có thể hỏi đáp tự nhiên như hỏi đồng nghiệp. (FR4)

**Acceptance Criteria:**

**Given** user navigate sang `/chat` (hoặc từ AI Hero)
**When** page load
**Then** hiển thị layout: Sidebar trái (chat history), Main area (conversation, max 720px centered), Input bar dưới cùng
**And** Sidebar hiển thị mock chat history: 4-5 conversations
**And** Input bar: input (border 2px, focus purple glow) + nút "Gửi ✨" (purple gradient)

### Story 3.2: Mock AI Streaming Response

As a **Viewer**,
I want thấy AI trả lời dạng streaming với typing animation,
So that tôi cảm nhận AI đang "suy nghĩ" và xử lý. (FR4)

**Acceptance Criteria:**

**Given** user gõ câu hỏi và nhấn Gửi
**When** message gửi đi
**Then** user message hiển thị bubble cam (align right)
**And** typing indicator "AI đang tìm kiếm..." hiển thị 1.5s
**Then** AI response hiển thị dạng streaming (mock: từng ký tự xuất hiện, 30ms/ký tự) trong bubble xám (align left)
**And** response có format: bold headings, bullet points, numbered steps
**And** cuối response có 1-2 source chips: "📄 Nguồn: [Tên bài] — [Tác giả]" (clickable, blue)

### Story 3.3: AI Feedback & No-Result Handling

As a **Viewer**,
I want đánh giá chất lượng AI response và không bao giờ gặp dead-end,
So that AI liên tục cải thiện và tôi luôn có bước tiếp theo. (FR5)

**Acceptance Criteria:**

**Given** AI response đã hiển thị xong
**When** user nhìn cuối response
**Then** hiển thị 👍 👎 buttons (inline, muted)
**When** user click 👍
**Then** button highlight green + toast "Cảm ơn phản hồi!"
**When** user click 👎
**Then** button highlight red + toast "Phản hồi đã được ghi nhận"
**Given** AI không tìm thấy thông tin (mock trigger: gõ "xyz không tồn tại")
**When** AI response
**Then** hiển thị: "Tôi chưa tìm thấy thông tin về chủ đề này trong kho tri thức." + 2 CTA buttons: [Tạo yêu cầu nội dung] [Hỏi câu khác]

### Story 3.4: AI Chat Floating Panel

As a **Viewer đang đọc bài**,
I want mở AI Chat dạng floating panel từ bất kỳ trang nào,
So that tôi có thể hỏi AI mà không rời khỏi trang hiện tại.

**Acceptance Criteria:**

**Given** user đang ở bất kỳ page nào
**When** click nút AI ✨ ở topbar HOẶC nhấn Ctrl+J
**Then** floating panel mở bên phải (280px wide) với full chat UI
**And** panel có header: "✨ AI Assistant [−] [×]"
**When** click [−] thì minimize, click [×] thì đóng
**And** conversation context giữ nguyên khi mở lại

---

## Epic 4: Search & Discovery

User nhấn Cmd+K → Search Command Palette mở ra → tìm bài viết, hỏi AI, tìm người — với mock results.

### Story 4.1: Search Command Palette — UI Shell

As a **Viewer**,
I want nhấn Cmd+K để mở search modal từ bất kỳ đâu,
So that tôi tìm được thông tin trong vài giây. (FR1)

**Acceptance Criteria:**

**Given** user ở bất kỳ page nào
**When** nhấn `Cmd+K` (Mac) hoặc `Ctrl+K` (Windows) HOẶC click search bar trên topbar
**Then** Modal search mở ra ở trung tâm (max-width 640px)
**And** input auto-focus, placeholder "Tìm kiếm bài viết, hỏi AI..."
**And** 3 tabs: [📄 Bài viết] [✨ Hỏi AI] [👤 Người]
**When** nhấn `Esc`
**Then** modal đóng

### Story 4.2: Search Results — Bài viết Tab

As a **Viewer**,
I want tìm bài viết với kết quả instant và AI snippets,
So that tôi thấy được bài phù hợp nhất ngay lập tức. (FR1, FR2, FR3)

**Acceptance Criteria:**

**Given** Command Palette đang mở, tab "Bài viết" active
**When** user gõ query (debounce 300ms)
**Then** hiển thị skeleton → mock results (5 items) với: title (highlight match), excerpt, author, space, read time
**And** mỗi result có AI summary snippet (1 dòng, italic)
**When** gõ "xyz không tồn tại"
**Then** hiển thị: "Không tìm thấy" + [✨ Hỏi AI] + [📝 Tạo yêu cầu]
**When** nhấn `↑↓` navigate, `Enter` select
**Then** đóng palette, navigate sang article

### Story 4.3: Search — Hỏi AI Tab & Người Tab

As a **Viewer**,
I want chuyển sang tab AI hoặc Người,
So that search palette là nơi duy nhất tìm mọi thứ.

**Acceptance Criteria:**

**Given** Command Palette đang mở
**When** click tab "✨ Hỏi AI"
**Then** placeholder đổi "Hỏi AI về tri thức iKame..."
**When** Enter
**Then** navigate sang `/chat` với query
**Given** tab "👤 Người" active
**When** gõ tên
**Then** mock user results: avatar, tên, role, BU

### Story 4.4: Search Filters

As a **Viewer**,
I want filter kết quả theo space, author, date,
So that tôi thu hẹp tìm kiếm. (FR2)

**Acceptance Criteria:**

**Given** search results hiển thị
**When** nhìn dưới input
**Then** filter row: [Space ▼] [Tác giả ▼] [Thời gian ▼]
**When** chọn filter
**Then** results update mock + filter chip hiển thị

---

## Epic 5: Article Reading Experience

User click bài viết → đọc bài với typography 720px, TOC, related articles, reaction bar.

### Story 5.1: Article View — Layout & Typography

As a **Viewer**,
I want đọc bài với typography đẹp, thoáng,
So that trải nghiệm đọc tối ưu.

**Acceptance Criteria:**

**Given** user navigate sang `/articles/:id`
**When** page load
**Then** layout 3 cột: Sidebar (200px) | Main (720px centered) | Right panel (280px, TOC)
**And** Main: Breadcrumb → Title (28px) → Meta (avatar, author, time, read time) → Body (16px, line-height 1.8)

### Story 5.2: Table of Contents & Scroll Tracking

As a **Viewer**,
I want mục lục bên phải tự highlight khi scroll,
So that tôi biết đang ở phần nào.

**Acceptance Criteria:**

**Given** article có 5+ headings
**When** render
**Then** TOC sticky bên phải, active heading highlighted cam
**When** scroll
**Then** active state cập nhật
**When** click heading trong TOC
**Then** smooth scroll đến heading

### Story 5.3: Reaction Bar & Interactions

As a **Viewer**,
I want react, bookmark, hỏi AI về bài,
So that tương tác với nội dung. (FR41)

**Acceptance Criteria:**

**Given** cuối article
**Then** buttons: [❤️ 18] [👏 Hữu ích] [🔖 Lưu] [💬 5 bình luận] [✨ Hỏi AI về bài này]
**When** click ❤️ → count +1, toast
**When** click 🔖 → icon fill, toast
**When** click ✨ → mở AI floating panel

### Story 5.4: Related Articles & Comments

As a **Viewer**,
I want thấy bài liên quan và comments,
So that khám phá thêm nội dung.

**Acceptance Criteria:**

**Given** article view
**Then** Right panel dưới TOC: 3 related mini cards
**And** Comment section cuối: 3 mock comments + SimpleEditor input

---

## Epic 6: Content Creation & AI Write

User tạo bài → template → editor + AI → publish.

### Story 6.1: Template Gallery Modal

As a **Contributor**,
I want chọn template khi tạo bài mới,
So that không bắt đầu từ trang trắng. (FR9)

**Acceptance Criteria:**

**Given** click "+" ở topbar
**Then** Modal Template Gallery: 6 cards grid 3x2
**When** click template
**Then** mở editor với template pre-loaded

### Story 6.2: NotionEditor — Block-based Editing

As a **Contributor**,
I want viết trong block editor giống Notion,
So that trải nghiệm viết mượt. (FR13, FR14)

**Acceptance Criteria:**

**Given** editor mở
**Then** NotionEditor + title field + metadata sidebar + topbar ([← Back] [Auto-save] [Preview] [Gửi duyệt])
**When** gõ `/`
**Then** slash command menu hiển thị
**And** auto-save indicator cập nhật mỗi 5s

### Story 6.3: AI Write — Expand & Rewrite

As a **Contributor**,
I want AI expand bullet points và rewrite text,
So that viết nhanh hơn. (FR10, FR11, FR12)

**Acceptance Criteria:**

**Given** trong editor
**When** `/ai` hoặc AI Write từ slash menu
**Then** inline panel: textarea + "AI Viết ✨"
**When** submit → mock streaming output chèn vào editor
**Given** select text → floating AI toolbar: [Viết lại] [Mở rộng] [Tóm tắt] [Dịch]
**When** click → mock AI replace/expand streaming

### Story 6.4: Article Metadata & Tags

As a **Contributor**,
I want thêm tags và metadata,
So that bài được phân loại đúng. (FR15)

**Acceptance Criteria:**

**Given** editor sidebar
**Then** Space selector, Tags multi-input, Category AI-suggest, Read time, Word count

### Story 6.5: Preview & Publish Flow

As a **Contributor**,
I want preview và publish bài,
So that kiểm tra trước khi đăng. (FR18)

**Acceptance Criteria:**

**Given** click Preview → full-screen article view
**When** click "Gửi duyệt" → confirm modal → toast "🎉 Bài đã gửi duyệt!" + status "Chờ duyệt"

### Story 6.6: Version History & Delete

As a **Contributor**,
I want xem history và xóa có undo,
So that an tâm sửa bài. (FR16, FR17)

**Acceptance Criteria:**

**Given** menu ⋯ → "Lịch sử" → Drawer 5 versions
**When** click version → preview + [Khôi phục]
**Given** "Xóa bài" → confirm → toast "Đã xóa [Hoàn tác]" (5s)

---

## Epic 7: Review & Approval Workflow

Contributor submit → Reviewer approve/reject → status change.

### Story 7.1: Review Queue

As a **Reviewer**,
I want thấy danh sách bài chờ duyệt,
So that biết cần review gì. (FR19)

**Acceptance Criteria:**

**Given** role Reviewer
**Then** list 3-4 mock bài "Chờ duyệt" + badge count sidebar

### Story 7.2: Inline Review & Comments

As a **Reviewer**,
I want comment inline trên từng đoạn,
So that contributor biết sửa ở đâu. (FR20)

**Acceptance Criteria:**

**Given** mở bài "Chờ duyệt"
**Then** banner amber + [Approve] [Yêu cầu chỉnh sửa] [Từ chối]
**When** hover paragraph → 💬 icon → inline comment input

### Story 7.3: Approve & Reject Actions

As a **Reviewer**,
I want approve/reject 1 click,
So that duyệt nhanh. (FR19, FR21, FR22)

**Acceptance Criteria:**

**When** Approve → confirm modal → status "Đã đăng" (green) + toast
**When** Yêu cầu chỉnh sửa → modal + required comment → status "Cần chỉnh sửa" (amber)
**When** Từ chối → modal + required lý do → status "Bị từ chối" (red)

### Story 7.4: Article Status Labels

As a **Contributor**,
I want thấy rõ status bài viết,
So that biết bài ở giai đoạn nào. (FR21)

**Acceptance Criteria:**

**Given** danh sách bài
**Then** badges: Nháp (gray), Chờ duyệt (amber), Đã đăng (green), Cần cập nhật (orange), Archived (muted)

---

## Epic 8: Knowledge Organization & Navigation

Sidebar tree + taxonomy management.

### Story 8.1: Knowledge Tree Sidebar

As a **Viewer**,
I want navigate qua cây tri thức,
So that tìm bài theo cấu trúc. (FR23)

**Acceptance Criteria:**

**Given** sidebar mở
**Then** tree: L1 BU → expand → L2 Categories → L3 Sub-categories
**When** click item → navigate + active highlight + breadcrumb update

### Story 8.2: Space View — Article List

As a **Viewer**,
I want xem bài viết trong space,
So that browse theo chủ đề.

**Acceptance Criteria:**

**Given** `/spaces/:id`
**Then** Space header + Tabs [Tất cả | Mới | Phổ biến] + article list + Pagination

### Story 8.3: KM — Bulk Move & Taxonomy Management

As a **Knowledge Manager**,
I want di chuyển nhiều bài và quản lý taxonomy,
So that tổ chức tri thức nhanh. (FR24, FR25, FR27)

**Acceptance Criteria:**

**Given** KM role, Space View → "Quản lý" mode
**Then** checkboxes + toolbar [Chọn tất cả] [Di chuyển] [Merge] [Archive]
**When** actions → modals + toast + undo

### Story 8.4: RBAC Config UI

As a **Admin**,
I want cấu hình quyền truy cập,
So that tài liệu sensitive đúng người xem. (FR26)

**Acceptance Criteria:**

**Given** Admin → "Quyền truy cập"
**Then** AdvancedTable spaces + visibility settings + edit modal

---

## Epic 9: Gamification & Engagement

XP, badges, leaderboard, bounty.

### Story 9.1: User Contribution Profile

As a **User**,
I want xem profile XP, badges, stats,
So that thấy giá trị đóng góp. (FR38)

**Acceptance Criteria:**

**Given** `/profile`
**Then** Avatar + Stats row + XP progress bar + Badges grid + Article list

### Story 9.2: Leaderboard

As a **User**,
I want xem bảng xếp hạng,
So that có động lực. (FR37)

**Acceptance Criteria:**

**Given** leaderboard page
**Then** SegmentedControl [Tuần | Tháng | Quý] + Top 3 nổi bật + Table 4-20 + highlight current user

### Story 9.3: XP & Badge Earn Animations

As a **Contributor**,
I want animation khi nhận XP/badge,
So that cảm thấy được ghi nhận. (FR35, FR36)

**Acceptance Criteria:**

**Given** publish thành công
**Then** toast đặc biệt "🎉 +50 XP" + badge toast nếu milestone

### Story 9.4: Bounty System

As a **User**,
I want tạo/claim bounty,
So that knowledge gaps được lấp. (FR39, FR40)

**Acceptance Criteria:**

**Given** Bounty page: Tabs [Đang mở | Đã claim | Hoàn thành]
**And** "Tạo Bounty" form modal + "Nhận bounty" button trên cards

---

## Epic 10: KM Dashboard & Analytics

Dashboard quản lý tri thức.

### Story 10.1: KM Dashboard — Overview & Health Score

As a **Knowledge Manager**,
I want health score tổng quan,
So that biết tình trạng tri thức. (FR42)

**Acceptance Criteria:**

**Given** `/dashboard`
**Then** KM nav sidebar + 4 metric cards + action items section

### Story 10.2: KM Dashboard — Action Items & Review Queue

As a **Knowledge Manager**,
I want xử lý action items nhanh,
So that quản lý hiệu quả. (FR29, FR31, FR44)

**Acceptance Criteria:**

**Given** action items section
**Then** "3 bài chờ review [Xem]", "Docker setup 45 search [AI draft]", "12 bài cần update [Nhắc]"
**When** actions → modals + toasts

### Story 10.3: Knowledge Gap Analysis

As a **Knowledge Manager**,
I want AI phân tích knowledge gaps,
So that biết chủ đề cần bổ sung. (FR43, FR46)

**Acceptance Criteria:**

**Given** click "Knowledge Gaps"
**Then** AdvancedTable: Chủ đề | Search count | Results | Actions [AI draft] [Bounty] [Assign]

### Story 10.4: Content Lifecycle & Audit

As a **Knowledge Manager**,
I want quản lý lifecycle bài viết,
So that nội dung cập nhật. (FR29, FR30, FR32, FR33, FR34)

**Acceptance Criteria:**

**Given** tab "Content Lifecycle"
**Then** Tabs: [Cần update | Trùng lặp | Archived | Recycle Bin] + actions per tab

### Story 10.5: Analytics Dashboard

As a **Admin**,
I want analytics toàn hệ thống,
So that đo lường adoption. (FR45, FR46, FR47)

**Acceptance Criteria:**

**Given** tab "Analytics"
**Then** DateRangePicker + metric cards + top articles table + search analytics + engagement by BU

---

## Epic 11: Notifications

Hệ thống thông báo.

### Story 11.1: Notification Bell & Panel

As a **User**,
I want notification badge và panel,
So that không bỏ lỡ cập nhật. (FR49, FR52)

**Acceptance Criteria:**

**Given** topbar 🔔 với badge "3"
**When** click
**Then** Popover panel (360px): header + 8 mock notifications + read/unread states
**When** click notification → navigate + mark read

### Story 11.2: Notification Center Full Page

As a **User**,
I want xem toàn bộ lịch sử thông báo,
So that tìm lại khi cần. (FR52)

**Acceptance Criteria:**

**Given** `/notifications`
**Then** Tabs [Tất cả | Bài viết | Bình luận | Hệ thống] + 20 mock items + pagination

### Story 11.3: Notification Preferences

As a **User**,
I want cấu hình loại thông báo,
So that không bị spam. (FR50)

**Acceptance Criteria:**

**Given** Settings → Notifications
**Then** list notification types với Switch toggles (ON/OFF)
**When** toggle → animate + toast
