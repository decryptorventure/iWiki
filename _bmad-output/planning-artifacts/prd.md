---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-02c-executive-summary
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-06-innovation-skipped
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
  - step-12-complete
inputDocuments:
  - product-brief-iWiki-ikm.md
  - product-brief-iWiki-ikm-distillate.md
  - tech-spec.md
documentCounts:
  briefs: 2
  research: 0
  brainstorming: 0
  projectDocs: 1
classification:
  projectType: web_app
  domain: enterprise_knowledge_management
  complexity: medium
  projectContext: brownfield
workflowType: 'prd'
---

# Product Requirements Document - iWiki-ikm

**Author:** Tom
**Date:** 2026-03-20

## Executive Summary

iWiki là nền tảng tri thức nội bộ tự xây dựng của iKame (200 nhân sự, lộ trình 500+), hiện đang ở v3.0.2. Sản phẩm chưa đạt kỳ vọng: điểm hài lòng 2.48/5, MAU dưới 30%, chỉ ~20 contributors/tháng. Nguyên nhân gốc: tìm kiếm trả kết quả không liên quan (48.1%), editor khó dùng (44.4%), nội dung lỗi thời không có cơ chế phát hiện (51.9%).

**iWiki 4.0** nâng cấp có hệ thống trên nền tảng đang vận hành (progressive enhancement, không rebuild) trong 8 sprint / 16 tuần (16/3 – 3/7/2026). Hai tính năng cốt lõi non-negotiable:

1. **AI Chatbot Q&A** — hỏi-đáp tự nhiên trên kho tri thức nội bộ, tuân thủ RBAC, trích dẫn nguồn, response <3s
2. **AI Write** — hỗ trợ viết bài đúc kết từ 2 giờ xuống 30 phút, theo template chuẩn iKame, tích hợp vào editor hiện tại

Triển khai qua 4 phases compressed: Phase 1 (Sprint 1-2) Foundation + Search + AI Write → Phase 2 (Sprint 3-4) AI Chatbot + Personalization → Phase 3 (Sprint 5-6) Gamification + Dashboards → Phase 4 (Sprint 7-8) Polish + Go-live. Team gồm 2 Senior Fullstack Dev, 1 AI Engineer, 1 UI/UX Designer, 1 QA — tất cả ứng dụng AI tools để tăng throughput 1.5-2x. GĐ1+2 được compress vào 4 tuần đầu để đáp ứng kế hoạch IKM của P&OD.

**Mục tiêu cuối dự án:** MAU >60%, hài lòng >4.0/5, tỷ lệ tìm kiếm thành công >90%, ≥80% core roles coi iWiki là kênh tri thức chính.

### Điểm Khác biệt

- **AI hiểu context iKame** — không phải ChatGPT generic. AI được train trên chính kho tri thức đã kiểm duyệt, hiểu thuật ngữ nội bộ, tuân thủ RBAC. Nhân sự tìm được câu trả lời áp dụng ngay — điều Google và ChatGPT không thể.
- **Hạ rào cản đóng góp triệt để** — AI Write + template chuẩn biến chuyên gia "ngại viết" thành contributor hiệu quả. Chất lượng output cao hơn vì AI đảm bảo cấu trúc và formatting.
- **Nền tảng tự xây = toàn quyền kiểm soát** — phát triển Vietnamese-first NLP, gamification, dashboard theo đúng nhu cầu iKame. Không phụ thuộc roadmap Confluence/Notion, không per-seat licensing khi scale 500+.
- **Cam kết cấp công ty** — BOD (anh Quyết, chị Nguyệt, anh Nghĩa) sponsor trực tiếp. Đây không phải upgrade kỹ thuật mà là đầu tư chiến lược vào tài sản tri thức tổ chức.

## Project Classification

| Thuộc tính | Giá trị |
|---|---|
| **Loại sản phẩm** | Web Application (SPA) — internal tool |
| **Domain** | Enterprise Knowledge Management |
| **Độ phức tạp** | Medium — AI/NLP integration, RBAC theo cơ cấu tổ chức, content lifecycle; không có compliance nặng |
| **Bối cảnh** | Brownfield — v3.0.2 đang live, progressive enhancement only |
| **Tech stack** | NestJS 10 + MongoDB + RediSearch + Gemini 2.0 Flash + Keycloak SSO |
| **Deployment** | Docker + Kubernetes + GitLab CI/CD |

## Success Criteria

### User Success

| Tiêu chí | Đo bằng gì | Mục tiêu |
|---|---|---|
| **Tìm được câu trả lời ngay** | Tỷ lệ tìm kiếm thành công (user click vào kết quả hoặc AI trả lời đúng) | >90% (hiện ~52%) |
| **Viết bài nhanh hơn** | Thời gian trung bình tạo bài viết (từ mở editor → submit) | Giảm 60% so với baseline (target: 30 phút cho bài đúc kết) |
| **Hài lòng tổng thể** | Survey NPS/satisfaction score (lặp lại survey n=27 sau mỗi GĐ) | >4.0/5 (hiện 2.48/5) |
| **Tự giải quyết vấn đề** | % câu hỏi AI Chatbot được đánh giá "hữu ích" bởi user (thumbs up/down) | >75% |
| **Quay lại thường xuyên** | WAU/MAU ratio (stickiness) | >40% (user dùng ít nhất 2 lần/tuần) |

### Business Success

| Tiêu chí | Đo bằng gì | Mục tiêu | Mốc thời gian |
|---|---|---|---|
| **Adoption toàn công ty** | MAU (Monthly Active Users) | >60% (~120/200) | Cuối GĐ4 (3/7/2026) |
| **Văn hóa đóng góp** | Contributors tích cực/tháng | ≥40 (tăng 100%) | Cuối GĐ4 |
| **Kênh tri thức chính** | % core roles (PM, Lead, Senior) coi iWiki là nguồn đầu tiên | ≥80% | Cuối GĐ4 |
| **Giảm thời gian onboard** | Thời gian nhân sự mới tự tìm hiểu quy trình (đo qua survey onboarding) | Giảm 30% | 3 tháng sau go-live |
| **Retention tri thức** | % bài viết được cập nhật trong 6 tháng (không bị flag "Cần cập nhật") | >70% | Liên tục |

### Technical Success

| Tiêu chí | Đo bằng gì | Mục tiêu |
|---|---|---|
| **Zero critical bugs** | Số lỗi 500/blank page/data loss trên production | 0 (hiện có nhiều) |
| **Performance** | P95 page load time | <2s cho trang đọc bài, <3s cho AI response |
| **Search latency** | P95 search response time | <500ms keyword, <3s semantic/AI |
| **Uptime** | Availability trong giờ làm việc (8h-18h UTC+7) | >99.5% |
| **AI cost efficiency** | Chi phí AI API / active user / tháng | Thiết lập baseline GĐ2, set ceiling GĐ3 |

### Measurable Outcomes (theo từng giai đoạn)

| Phase | Sprint | Milestone | KR cụ thể |
|---|---|---|---|
| **Phase 1** | 1-2 | "Wow + Tìm cái gì cũng ra!" | Hài lòng >3.0/5; lỗi kỹ thuật giảm 70%; tìm kiếm thành công >70%; AI Write live; ≥3 templates; event tracking hoạt động |
| **Phase 2** | 3-4 | "iWiki biết mình cần gì" | Tìm kiếm thành công >90%; ≥50% core roles dùng AI Chatbot; content audit quét 100% bài |
| **Phase 3** | 5-6 | "Ai cũng muốn đóng góp" | MAU >50%; gamification live; manager dashboard active |
| **Phase 4** | 7-8 | "Go-live toàn công ty" | MAU >60%; ≥80% core roles = kênh chính; hài lòng >4.0/5 |

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Problem-Solving MVP — fix pain points nghiêm trọng nhất trước để rebuild trust, đồng thời ship Search + AI Write sớm để P&OD bắt đầu IKM plan.

**Tại sao compress GĐ1+2?** P&OD có kế hoạch IKM cần taxonomy + Search + AI Write + Templates sẵn sàng sớm nhất có thể. Compress 4 giai đoạn ban đầu thành timeline nhanh hơn, P&OD có tool cuối tuần 4.

**Resource Requirements:**
- 2 Senior Fullstack Dev: 1 FE-focused (Track A), 1 BE-focused (Track B) — song song
- 1 AI Engineer: research Sprint 1, ship Sprint 2+ (Track C)
- 1 UI/UX Designer: design đi trước 1 sprint
- 1 QA: test từ Sprint 1, regression mỗi sprint

### Phase 1: Foundation + Search + AI Write (Sprint 1-2, MVP)

**Sprint 1 — "Fix & Wow" (tuần 1-2)**

| Task | Owner | Track |
|---|---|---|
| Fix critical bugs (500, blank page, auto-save) | Dev 1 | A |
| Event tracking foundation | Dev 2 | B |
| Homepage redesign | Dev 1 (sau bug fixes) | A |
| Article reading page redesign | Dev 2 (sau event tracking) | B |
| Bookmark + Reading History | Dev 2 | B |
| Approval workflow rút gọn + inline comment | Dev 1 | A |
| Design Sprint 2 features | Designer | Đi trước |
| Research + prototype Semantic Search | AI Engineer | C |

**Sprint 2 — "Search & AI" (tuần 3-4)**

| Task | Owner | Track |
|---|---|---|
| RBAC theo cơ cấu mới | Dev 1 | A |
| Folder taxonomy restructure | Dev 1 | A |
| KM Migration Tool | Dev 2 | B |
| Recycle Bin (soft delete) | Dev 2 | B |
| Semantic Search ship | AI Engineer + Dev 2 | B+C |
| AI Write MVP (tích hợp editor) | AI Engineer | C |
| Content Templates (≥3) | Dev 1 | A |

**Core Journeys Supported:** J1 (Viewer search), J2 (Contributor viết bài), J3 partial (KM migration), J5 (Edge case)

**P&OD Milestone:** Cuối Sprint 2 → taxonomy + Search + AI Write + Templates sẵn sàng cho content migration và contributor training.

### Phase 2: Intelligence (Sprint 3-4, Growth)

| Feature | Sprint | Owner |
|---|---|---|
| AI Chatbot Q&A (RAG, RBAC-aware) | 3-4 | AI Engineer + Dev 2 |
| Personalized Newsfeed | 3 | Dev 1 |
| AI Content Auditing | 3-4 | AI Engineer |
| Content Lifecycle (states + auto-remind) | 3 | Dev 1 |

### Phase 3: Culture & Scale (Sprint 5-6, Vision)

| Feature | Sprint | Owner |
|---|---|---|
| Gamification (XP, coins, badges, leaderboard) | 5 | Dev 1 + Dev 2 |
| Bounty Program | 5-6 | Dev 2 |
| Manager Dashboard | 5 | Dev 1 |
| Analytics Dashboard | 6 | Dev 1 |

### Phase 4: Polish + Go-live (Sprint 7-8)

- Performance optimization + bug fixes từ feedback
- Go-live toàn công ty + training sessions
- Buffer cho scope creep
- Retrospective + plan post-4.0

### Post-4.0 (Backlog — evaluate Q3 2026)

- Collaborative editing real-time
- Mobile responsive deep optimization
- HR system integration (iPerform)
- Multi-language support
- Public API cho third-party integrations

### Dependencies Chain

```
Bug fixes (S1) → UI redesign (S1) → RBAC + Taxonomy (S2) → AI Chatbot (S3-4)
                                                          ↗
AI Engineer prototype (S1) → Search + AI Write (S2) ────
                                                          ↘
Event tracking (S1) ──────────────────────────────────→ Analytics (S6)
```

### Risk Mitigation Strategy

**Technical Risks:**

| Rủi ro | Xác suất | Impact | Giảm thiểu |
|---|---|---|---|
| Semantic Search chất lượng thấp cho tiếng Việt | Medium | High | AI Engineer prototype Sprint 1, evaluate RediSearch vs Elasticsearch. Fallback: keyword search vẫn hoạt động |
| AI Chatbot hallucinate | Medium | High | Mandatory citation, confidence threshold, "không tìm thấy" fallback |
| Sprint 2 overload (RBAC + Search + AI Write) | High | Medium | AI Engineer prototype Sprint 1 giảm risk. Dev 2 handle Search UI/API, AI Engineer focus AI Write |
| Frontend refactor phức tạp hơn dự kiến | Medium | Medium | Giữ layout structure, chỉ thay visual. Không thay framework |
| RBAC migration gây mất quyền truy cập | Low | High | Dry-run staging, rollback plan, migration script có undo |

**Resource Risks:**

| Rủi ro | Giảm thiểu |
|---|---|
| Dev bị kéo sang dự án khác | BOD sponsor — Tom escalate nếu resource conflict |
| AI Engineer bottleneck (1 người cho 3+ AI features) | Sequence: Search (S2) → AI Write (S2) → Chatbot (S3-4) → Audit (S3-4). Không song song quá 2 AI features |
| Designer đi trước nhưng design bị reject | Weekly design review với Tom + stakeholder feedback sớm |

**Scope Risks:**

| Rủi ro | Giảm thiểu |
|---|---|
| Phase 3 (Gamification) bị cắt do timeline | Core value đã delivered Phase 1-2. Gamification ship simplified version |
| Content seeding không kịp cho Phase 1 | Phối hợp P&OD từ Sprint 1. Target 50 bài top |

## User Journeys

### Journey 1: Linh — Nhân sự mới tìm câu trả lời (Viewer, Success Path)

**Linh**, 24 tuổi, vừa join iKame Apps được 1 tuần. Ngày thứ 3, Linh cần biết quy trình xin nghỉ phép nhưng ngại hỏi đồng nghiệp vì sợ "hỏi ngu".

**Opening Scene:** Linh mở iWiki, trang chủ hiển thị mục "Dành cho bạn" với các bài viết liên quan đến onboarding iKame Apps. Linh thấy ngay bài "Hướng dẫn tạo tài khoản" mà tuần trước buddy gửi link.

**Rising Action:** Linh gõ vào ô chat AI: "Quy trình xin nghỉ phép như thế nào?" AI trả lời trong 2 giây: tóm tắt 3 bước, link đến bài gốc "Giờ làm việc, Chấm công, Ngày phép", trích dẫn đúng phần relevant.

**Climax:** Linh click vào bài gốc, đọc chi tiết, thấy có cả template đơn xin phép. Linh bookmark bài này. Toàn bộ quá trình mất 2 phút.

**Resolution:** Linh tự giải quyết được mà không phải hỏi ai. Buổi chiều, Linh search thêm "quy trình performance review" — lại tìm được ngay. Linh bắt đầu tin tưởng iWiki là nơi đầu tiên tìm thông tin.

> **Capabilities revealed:** AI Chatbot Q&A, Personalized Newsfeed, Bookmark, Search, Vietnamese NLP

---

### Journey 2: Huy — Senior Dev đúc kết kinh nghiệm (Contributor, Success Path)

**Huy**, Solution BE Developer, 3 năm ở iKame Technology. Vừa hoàn thành migration hệ thống VPN lên FortiClient. Manager yêu cầu viết bài đúc kết lên iWiki nhưng Huy ngại vì "viết lách không phải thế mạnh".

**Opening Scene:** Huy mở iWiki, click "Tạo bài viết", chọn template "Đúc kết kinh nghiệm / Case Study". Template hiện ra với structure rõ ràng: Bối cảnh → Vấn đề → Giải pháp → Bài học → Khuyến nghị.

**Rising Action:** Huy gõ bullet points vào mỗi phần — ngắn gọn, style developer. Huy bôi đen phần "Bối cảnh" và click "AI Viết giúp" → AI expand bullet points thành đoạn văn mạch lạc, giữ nguyên thông tin kỹ thuật, thêm context cho người đọc non-tech hiểu được.

**Climax:** Huy review lại — "ồ, viết hay hơn mình tưởng". Huy chỉnh vài chỗ, thêm 1 ảnh screenshot. Bài viết hoàn thiện trong 25 phút thay vì 2 tiếng trước đây. Click "Gửi duyệt".

**Resolution:** Manager nhận notification, đọc bài, comment inline "phần này thêm link tới VPN guide nhé", approve. Bài publish trong ngày. Huy nhận +50 XP và badge "First Article". Thấy tên mình trên leaderboard tuần.

> **Capabilities revealed:** AI Write, Content Templates, Inline Comment Approval, Gamification (XP, badge), Notifications

---

### Journey 3: Thảo — L&OD Manager quản lý tri thức team (Knowledge Manager)

**Thảo**, L&OD Manager tại P&OD, chịu trách nhiệm đào tạo và phát triển nhân sự. Cần đảm bảo tài liệu chính sách HR luôn cập nhật và dễ tìm.

**Opening Scene:** Thảo mở KM Migration Tool. Hệ thống hiển thị danh sách 47 bài viết P&OD chưa được phân loại theo taxonomy mới. Thảo nhìn thấy ngay bài nào thuộc "Process & Guidelines", bài nào thuộc "Knowledge".

**Rising Action:** Thảo dùng bulk action để drag 20 bài chính sách vào "P&OD > Norms & Rules > Process & Guidelines". Với 15 bài đào tạo, Thảo kéo vào "P&OD > WeLearn > Knowledge". 12 bài còn lại được AI flag là "Có thể trùng lặp" — Thảo merge 4 cặp, archive 4 bài quá cũ.

**Climax:** Thảo mở Manager Dashboard: thấy team mình có 3 bài bị flag "Cần cập nhật" (>6 tháng không edit). Thảo click "Nhắc tác giả" — hệ thống gửi notification tự động. Dashboard cũng cho thấy "top failed searches" trong P&OD space: nhân sự đang tìm "chính sách remote work" nhưng chưa có bài → Thảo tạo bounty request.

**Resolution:** Sau 1 tuần, taxonomy P&OD gọn gàng, 3 bài được cập nhật, 1 bài mới về remote work được contributor viết từ bounty. Thảo report cho chị Nguyệt: "100% tài liệu P&OD đã phân loại đúng, 0 bài outdate".

> **Capabilities revealed:** KM Migration Tool, Content Audit, Manager Dashboard, Bounty Program, Content Lifecycle, Taxonomy Management, Notifications

---

### Journey 4: Dũng — Product Manager vận hành hệ thống (Admin/System)

**Dũng**, PM phụ trách iWiki, cần giám sát sức khỏe hệ thống và đo lường adoption.

**Opening Scene:** Sáng thứ Hai, Dũng mở Analytics Dashboard. Nhìn ngay: MAU tuần này 45% (tăng từ 38% tuần trước), 12 bài mới được publish, AI Chatbot xử lý 340 câu hỏi (87% rated "hữu ích").

**Rising Action:** Dũng drill down vào Search Analytics: top 10 search queries không có kết quả → "quy trình review game", "template báo cáo tháng". Dũng tag Knowledge Champions của iKame Games và Technology để tạo content. Dũng check AI cost: $47 tháng này cho Gemini API — trong budget.

**Climax:** Dũng thấy iKame Games BU có MAU chỉ 25% trong khi công ty là 45%. Dũng mở chi tiết: team này chỉ có 3 bài viết, không có Champion assigned. Dũng escalate với Manager bên đó và đề xuất seeding 5 bài quan trọng nhất.

**Resolution:** Dũng gửi weekly report cho BOD: dashboard screenshot + 3 key insights + 2 action items. Anh Nghĩa reply: "Good progress, push iKame Games team harder."

> **Capabilities revealed:** Analytics Dashboard, Search Analytics, AI Cost Monitoring, User Segmentation by BU, Admin Tools

---

### Journey 5: Linh gặp lỗi — Edge Case & Recovery

**Linh** (nhân sự mới từ Journey 1) search "cach conect VPN" — gõ sai chính tả, thiếu dấu tiếng Việt.

**Opening Scene:** Semantic Search vẫn hiểu ý và trả về bài "How to connect VPN iKAME using FortiClient" của Huy. Kết quả hiện đúng mặc dù query thiếu dấu và sai chính tả.

**Rising Action:** Linh click vào bài nhưng bài chỉ viết tiếng Anh, Linh đọc khó hiểu. Linh quay lại chat AI: "hướng dẫn kết nối VPN bằng tiếng Việt". AI tóm tắt nội dung bài bằng tiếng Việt, step-by-step.

**Climax:** Linh làm theo nhưng bị lỗi ở bước 3. Linh comment trực tiếp dưới bài viết: "Bước 3 bị lỗi 'connection timeout', ai giúp được không?" Huy nhận notification, reply comment hướng dẫn thêm.

**Resolution:** Linh giải quyết được vấn đề. Huy nhận ra bài thiếu phần troubleshooting → cập nhật bài viết, thêm section FAQ.

> **Capabilities revealed:** Vietnamese NLP (typo tolerance, diacritics), AI multilingual summary, Comments, Notifications, Content update flow

---

### Journey Requirements Summary

| Capability | J1 (Viewer) | J2 (Contributor) | J3 (KM) | J4 (Admin) | J5 (Edge) | Phase (Sprint) |
|---|---|---|---|---|---|---|
| Homepage Redesign | ✓ | | | | | P1 (S1) |
| Personalized Feed | ✓ | | | | | P2 (S3) |
| AI Chatbot Q&A (RAG, RBAC) | ✓ | | | | ✓ | P2 (S3-4) |
| Semantic Search (Vietnamese NLP) | ✓ | | | | ✓ | P1 (S2) |
| AI Write (expand, format, template) | | ✓ | | | | P1 (S2) |
| Content Templates | | ✓ | | | | P1 (S2) |
| Approval Workflow (inline comment) | | ✓ | | | | P1 (S1) |
| Gamification (XP, badges, leaderboard) | | ✓ | | | | P3 (S5) |
| KM Migration Tool | | | ✓ | | | P1 (S2) |
| Content Audit + Lifecycle | | | ✓ | | | P2 (S3-4) |
| Manager Dashboard | | | ✓ | | | P3 (S5) |
| Bounty Program | | | ✓ | | | P3 (S5-6) |
| Analytics Dashboard | | | | ✓ | | P3 (S6) |
| AI Cost Monitoring | | | | ✓ | | P1 (S2) |
| Bookmark + Reading History | ✓ | | | | | P1 (S1) |
| Comments + Notifications | | | | | ✓ | P1 (S1) |
| Event Tracking | ✓ | ✓ | ✓ | ✓ | ✓ | P1 (S1) |

## Domain-Specific Requirements

### Bảo mật & Quyền truy cập Tri thức

- **RBAC tuân thủ cơ cấu tổ chức**: Tài liệu mật (C&B, Legal, chiến lược kinh doanh) chỉ visible cho đúng BU/role. AI Chatbot **không được leak** nội dung từ bài user không có quyền xem.
- **Keycloak SSO**: Tất cả access thông qua SSO hiện tại — không tạo auth system riêng.
- **Audit trail**: Ai xem gì, ai sửa gì, ai xóa gì — cần log cho compliance nội bộ.

### Quản trị Nội dung Nội bộ

- **Content accuracy**: Tri thức nội bộ sai = nhân sự làm sai. Content lifecycle + review cycle bắt buộc cho tài liệu chính sách (Norms & Rules).
- **Soft delete + 30-day retention**: Không cho phép permanent delete nhầm. Admin-only permanent delete.
- **Version history**: Giữ lịch sử chỉnh sửa — rollback khi cần.

### Vietnamese NLP Specifics

- **Diacritics handling**: "nghỉ phép" = "nghi phep" = "nghĩ phép" (user hay gõ sai dấu).
- **Compound words**: Tiếng Việt không có word boundary rõ ràng — tokenizer phải handle "quản lý dự án", "đánh giá hiệu suất".
- **Internal terminology**: "EKS" = Employee Key Success, "iPerform" = hệ thống đánh giá nội bộ — AI cần hiểu thuật ngữ iKame.

### AI Governance

- **AI không tạo nội dung mới từ "không khí"**: AI Write chỉ expand/format/summarize input của user — không hallucinate facts.
- **AI Chatbot trích dẫn nguồn bắt buộc**: Mỗi câu trả lời phải kèm link bài gốc. Nếu không tìm được source → nói rõ "Tôi không tìm thấy thông tin này trong kho tri thức".
- **Cost ceiling**: Thiết lập monthly budget cap cho Gemini API trước khi scale GĐ3.

> **Rủi ro chi tiết:** Xem mục [Risk Mitigation Strategy](#risk-mitigation-strategy) trong phần Project Scoping.

## Web Application Specific Requirements

### Project-Type Overview

iWiki là Single Page Application (SPA) nội bộ, truy cập qua browser tại `iwiki.ikameglobal.com`. Không cần SEO (internal tool). Real-time capabilities đã có sẵn (Socket.io). Focus chính: **performance, responsive design, và accessibility cơ bản** cho 200→500 users.

### Technical Architecture Considerations

| Câu hỏi | Trả lời | Chi tiết |
|---|---|---|
| **SPA or MPA?** | SPA | Frontend hiện tại là SPA (cần confirm framework khi có source code). Backend: NestJS monolith REST API `api/v2` |
| **Browser support?** | Modern browsers | Chrome (primary — iKame standard), Firefox, Edge. Không cần IE11. Mobile browser: responsive web |
| **SEO needed?** | Không | Internal tool, đăng nhập Keycloak SSO trước khi xem content |
| **Real-time?** | Có — Socket.io đã sẵn sàng | Dùng cho: notifications (approval, comment, bounty), future: collaborative editing |
| **Accessibility?** | Level A cơ bản | Internal tool. Focus: keyboard navigation, contrast ratio, screen reader cho headings |

### Browser Matrix

| Browser | Phiên bản | Mức hỗ trợ |
|---|---|---|
| Chrome | 2 phiên bản mới nhất | Primary — fully tested |
| Firefox | 2 phiên bản mới nhất | Supported — functional testing |
| Edge (Chromium) | 2 phiên bản mới nhất | Supported — functional testing |
| Safari | 2 phiên bản mới nhất | Best effort — iKame dùng Windows/Chrome chủ yếu |
| Mobile Chrome/Safari | Latest | Responsive web — functional testing |

### Responsive Design

- **Desktop-first** — đa số users truy cập từ laptop/desktop tại văn phòng
- **Responsive breakpoints**: Desktop (≥1280px, primary), Tablet (768-1279px), Mobile (≤767px, read-only optimized)
- **Mobile priority**: Đọc bài + search + AI chat. Không cần mobile editor (viết bài dùng desktop)
- **Progressive enhancement**: Responsive CSS trên layout hiện tại — không rebuild UI framework

### Performance Targets

> Xem chi tiết đầy đủ tại [Non-Functional Requirements — Performance](#performance). Tóm tắt: page load <2s, keyword search <500ms, AI response <3s first token, bundle <500KB gzipped.

### Implementation Considerations

**Frontend (cần confirm khi có source code):**
- Giữ nguyên frontend framework hiện tại — progressive enhancement
- UI component library: nâng cấp visual, giữ interaction patterns quen
- State management: evaluate nếu cần thêm cho AI chat real-time + notifications
- Code splitting: lazy load AI Chat panel, Admin Dashboard, KM tools

**Backend (confirmed từ tech spec):**
- NestJS Clean Architecture — thêm modules mới:
  - `modules/ai-chat/` — AI Chatbot Q&A
  - `modules/gamification/` — XP, coins, badges
  - `modules/analytics/` — event tracking, dashboards
  - `modules/content-lifecycle/` — audit, states, reminders
- API versioning: tiếp tục `api/v2`, tạo `api/v3` cho breaking changes nếu cần
- Bull queue: mở rộng cho AI batch processing, content audit cron

**Infrastructure:**
- Docker + K8s: không thay đổi pipeline
- Feature flags: thêm env vars hoặc config collection trong MongoDB
- Monitoring: thêm health check endpoint + Prometheus metrics

## Functional Requirements

### Content Discovery & Search (FR1-FR8)

- **FR1:** Viewer can search articles using natural language queries in Vietnamese (including typos, missing diacritics, synonyms)
- **FR2:** Viewer can filter search results by space/BU, author, date range, content type, and tags
- **FR3:** Viewer can view AI-generated summary snippets for each search result
- **FR4:** Viewer can ask questions in natural language to an AI Chatbot and receive answers with cited source articles
- **FR5:** AI Chatbot can refuse to answer or indicate uncertainty when no relevant source exists in the knowledge base
- **FR6:** AI Chatbot can restrict answers to only articles the requesting user has RBAC permission to view
- **FR7:** Viewer can view personalized content recommendations on homepage based on role, BU, reading history, and interests
- **FR8:** Viewer can view recently read articles and bookmarked articles from their personal section

### Content Creation & Editing (FR9-FR17)

- **FR9:** Contributor can create articles using pre-built content templates (SOP/Hướng dẫn, Báo cáo, Đúc kết kinh nghiệm, Biên bản họp, Weekly Report, PRD)
- **FR10:** Contributor can select text and invoke AI Write to expand bullet points into formatted paragraphs
- **FR11:** Contributor can invoke AI Write to summarize, suggest titles, and standardize formatting of selected content
- **FR12:** AI Write can generate content following iKame writing style and template structure without fabricating facts
- **FR13:** Contributor can save article drafts with reliable auto-save (no data loss)
- **FR14:** Contributor can upload and embed images within articles
- **FR15:** Contributor can add tags and metadata to articles for discoverability
- **FR16:** Contributor can view version history of their articles and restore previous versions
- **FR17:** Contributor can delete articles with a 5-second undo option; deleted articles go to Recycle Bin (30-day soft delete)

### Review & Approval Workflow (FR18-FR22)

- **FR18:** Contributor can submit articles for review with a single action
- **FR19:** Reviewer/Manager can approve or reject articles directly from the article view
- **FR20:** Reviewer can add inline comments on specific paragraphs of an article under review
- **FR21:** Contributor can see clear status labels on their articles (Nháp, Chờ duyệt, Đã đăng, Cần cập nhật, Archived)
- **FR22:** System can send notifications to reviewers when articles are submitted and to contributors when articles are approved/rejected

### Knowledge Organization & Taxonomy (FR23-FR28)

- **FR23:** Knowledge Manager can view all articles in their BU space organized by the new taxonomy (L1: BU → L2: Category → L3: Sub-category with Process & Guidelines / Knowledge / Best Practices folders)
- **FR24:** Knowledge Manager can bulk-move articles between taxonomy categories using a migration tool
- **FR25:** Knowledge Manager can merge duplicate articles and archive outdated ones
- **FR26:** Admin can configure RBAC permissions based on organizational structure (BU, role, team)
- **FR27:** Admin can manage the folder/taxonomy structure (create, rename, reorganize categories)
- **FR28:** System can maintain breadcrumb navigation reflecting the taxonomy hierarchy

### Content Lifecycle & Quality (FR29-FR34)

- **FR29:** System can automatically flag articles not updated for >6 months as "Cần cập nhật"
- **FR30:** System can detect potentially duplicate articles and flag them for Knowledge Manager review
- **FR31:** System can send automatic reminders to article authors when their articles are flagged for update
- **FR32:** System can transition articles through lifecycle states: Draft → In Review → Published → Needs Update → Archived
- **FR33:** Admin can restore articles from Recycle Bin within 30 days; permanently delete after 30 days
- **FR34:** System can maintain audit trail of article views, edits, and deletions

### Engagement & Gamification (FR35-FR41)

- **FR35:** User can earn XP points for actions (creating articles, receiving likes, answering questions via contributions)
- **FR36:** User can earn badges for milestones (First Article, Knowledge Sharer, Top Contributor)
- **FR37:** User can view a leaderboard of top contributors (weekly, monthly, quarterly)
- **FR38:** User can view their own contribution profile (articles written, XP, badges, view/like counts)
- **FR39:** Any user can create a bounty request for missing knowledge topics with category tags and optional deadline
- **FR40:** Contributor can claim and fulfill bounty requests, earning coins upon completion
- **FR41:** User can like and comment on published articles

### Manager & Admin Tools (FR42-FR48)

- **FR42:** Manager can view a dashboard showing their team's article statistics by status, top read articles, and active contributors
- **FR43:** Manager can view "knowledge gap" reports showing top failed search queries within their BU space
- **FR44:** Manager can trigger reminder notifications to specific article authors
- **FR45:** Admin can view system-wide analytics: MAU, new articles, top search terms, most read articles, engagement metrics
- **FR46:** Admin can view search analytics: successful vs failed searches, trending queries, knowledge gaps
- **FR47:** Admin can monitor AI API usage and costs
- **FR48:** Admin can view and manage all user roles and permissions

### Notifications & Communication (FR49-FR52)

- **FR49:** System can send in-app notifications for: article approvals, comments, bounty claims, content flags, reminders
- **FR50:** User can configure notification preferences (which events trigger notifications)
- **FR51:** System can send notifications via existing channels (in-app + existing Slack integration where applicable)
- **FR52:** User can view a notification center with history of all received notifications

## Non-Functional Requirements

### Performance

| NFR | Requirement | Đo bằng | Lý do |
|---|---|---|---|
| **NFR-P1** | Trang đọc bài load <2s (P95) | Server logs + RUM | 80% thời gian user ở đây |
| **NFR-P2** | Keyword search trả kết quả <500ms (P95) | Server logs | User kỳ vọng search instant |
| **NFR-P3** | Semantic search trả kết quả <3s (P95) | Server logs | AI processing cần thời gian nhưng phải chấp nhận được |
| **NFR-P4** | AI Chatbot: first token <3s, complete response <8s | Server logs | Streaming response — user thấy phản hồi ngay |
| **NFR-P5** | AI Write: response <5s cho 1 đoạn văn | Server logs | Inline trong editor, user đang chờ |
| **NFR-P6** | API CRUD operations <200ms (P95) | Server logs | Standard web app expectation |
| **NFR-P7** | Concurrent users: hỗ trợ 100 users đồng thời không degradation | Load testing | Peak usage giờ hành chính |
| **NFR-P8** | Auto-save: save draft mỗi 30 giây, không block typing | Client-side measurement | Fix pain point data loss |

### Security

| NFR | Requirement | Lý do |
|---|---|---|
| **NFR-S1** | Tất cả API endpoints require authentication (Keycloak SSO hoặc API Key) | Không có anonymous access |
| **NFR-S2** | RBAC enforcement: user chỉ xem được articles thuộc BU/role được assign | Tài liệu sensitive |
| **NFR-S3** | AI Chatbot RBAC: RAG pipeline filter kết quả theo ACL trước khi generate response | Ngăn information leak qua AI |
| **NFR-S4** | Audit trail: log tất cả article CRUD operations với user ID, timestamp, action | Compliance nội bộ |
| **NFR-S5** | Session timeout: auto-logout sau 8 giờ không hoạt động | Bảo mật khi rời máy |
| **NFR-S6** | File upload: validate file type + size limit (max 10MB/file, chỉ image/pdf) | Ngăn upload malware |
| **NFR-S7** | API rate limiting: max 100 requests/phút/user cho AI endpoints | Ngăn abuse + kiểm soát AI cost |

### Scalability

| NFR | Requirement | Lý do |
|---|---|---|
| **NFR-SC1** | Hỗ trợ scale từ 200 → 500 users không cần thay đổi architecture | Kế hoạch mở rộng công ty |
| **NFR-SC2** | MongoDB: hỗ trợ tới 10,000 articles không degradation search | Growth trajectory 3 năm |
| **NFR-SC3** | AI API: cost monitoring + monthly ceiling alert tại threshold | Budget control khi scale |
| **NFR-SC4** | K8s horizontal scaling: tăng replicas không downtime | Peak traffic handling |

### Reliability

| NFR | Requirement | Lý do |
|---|---|---|
| **NFR-R1** | Uptime >99.5% trong giờ làm việc (8h-18h UTC+7, Mon-Fri) | Internal tool — downtime ngoài giờ OK |
| **NFR-R2** | Zero data loss: auto-save + database backup daily | Article content là tài sản tri thức |
| **NFR-R3** | Graceful degradation: nếu AI service down, search fallback về keyword, editor vẫn hoạt động | AI là enhancement, không phải core dependency |
| **NFR-R4** | Database backup: daily automated, retention 30 ngày, restore <2 giờ | Disaster recovery |

### Integration

| NFR | Requirement | Lý do |
|---|---|---|
| **NFR-I1** | Keycloak SSO: authentication response <500ms | Login experience |
| **NFR-I2** | User service (GraphQL): sync user profiles, org structure mỗi 24h hoặc on-demand | RBAC accuracy |
| **NFR-I3** | Google Cloud Storage: upload/download files <3s cho file ≤10MB | UX khi embed images |
| **NFR-I4** | Gemini API: failover — retry 2 lần, timeout 30s, fallback message nếu fail | AI reliability |
| **NFR-I5** | Internal AI endpoint: health check mỗi 5 phút, alert nếu down | Dependency monitoring |

### Accessibility (Basic)

| NFR | Requirement | Lý do |
|---|---|---|
| **NFR-A1** | Keyboard navigation: tất cả actions có thể thực hiện bằng keyboard | Basic usability |
| **NFR-A2** | Color contrast ratio ≥4.5:1 cho text content | Readability |
| **NFR-A3** | Semantic HTML headings (h1-h6) cho article content | Screen reader compatibility |
| **NFR-A4** | Alt text cho images trong articles (editor nhắc nhở nếu thiếu) | Content accessibility |
