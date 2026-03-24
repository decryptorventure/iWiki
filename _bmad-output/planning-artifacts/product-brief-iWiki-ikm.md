---
title: "Product Brief: iWiki Knowledge Hub 4.0"
status: "draft-v2"
created: "2026-03-20"
updated: "2026-03-20"
inputs:
  - "iKame _ iWiki 2026.pdf (research, survey, interview, folder structure, feedback, RASCI)"
  - "iWiki 4.0 PRD (2).docx (PRD with 7 pillars, roadmap, KPIs)"
  - "iWiki v3.0.2 screenshots (current production UI)"
  - "iWiki vibecode prototype source code (D:\\iWiki-main)"
  - "Web research: enterprise KM market landscape 2025-2026"
  - "PM feedback: team constraints, progressive enhancement principle, adoption strategy"
---

# Product Brief: iWiki Knowledge Hub 4.0

## Tóm tắt Điều hành

iWiki là nền tảng tri thức nội bộ tự xây dựng của iKame — công ty công nghệ 200 nhân sự (kế hoạch scale 500+) trong lĩnh vực Games và Apps. Sau nhiều phiên bản phát triển theo nhu cầu thời điểm, iWiki hiện chỉ đạt 30-40% kỳ vọng ban đầu: điểm hài lòng 2.48/5, MAU dưới 30%.

**iWiki 4.0** phá vỡ "vòng lặp đi xuống" bằng chiến lược **cải thiện dần dần trên nền tảng đang vận hành** — không đập đi xây lại mà nâng cấp có hệ thống, ưu tiên thay đổi nhìn thấy được ngay cho người dùng, tích hợp AI thông minh vào từng điểm chạm.

Dự án triển khai trong 8 sprint (16 tuần, 16/3 – 3/7/2026) với team gọn: 2 Senior Fullstack Dev, 1 AI Engineer, 1 UI/UX Designer, 1 QA — tất cả đều ứng dụng AI vào quy trình làm việc để tăng tốc delivery. Scope Tech phối hợp song song với chiến lược nội dung "Đúc kết Kho báu" do P&OD phụ trách.

## Vấn đề

Mỗi ngày, nhân sự iKame lãng phí thời gian tìm kiếm thông tin nội bộ vì:

- **Tìm kiếm vô dụng**: 48.1% người dùng cho rằng kết quả trả về không liên quan — hệ thống chỉ match keyword, không hiểu ý định.
- **Rào cản đóng góp**: 44.4% phàn nàn editor khó dùng, 48.1% nói quy trình phân quyền-duyệt bài quá phức tạp. Chỉ ~20 contributors tích cực/tháng.
- **Nội dung lỗi thời**: 51.9% cho rằng tài liệu không được cập nhật. Không có cơ chế tự động phát hiện bài outdate.
- **Không có lý do quay lại**: Thiếu cá nhân hóa, không có vòng lặp engagement. Người dùng chọn hỏi đồng nghiệp hoặc dùng ChatGPT.

Với kế hoạch scale lên 500+ người, vấn đề này sẽ nghiêm trọng hơn theo cấp số nhân — tri thức phân tán, onboard chậm, kinh nghiệm thực chiến "locked" trong đầu chuyên gia.

## Giải pháp — Cải thiện Dần dần, Tác động Tức thì

**Nguyên tắc cốt lõi**: Sản phẩm đang live với 200 người dùng. Không thay đổi quá nhiều cùng lúc — mỗi sprint phải cho ra output mà người dùng cảm nhận được ngay, trong khi giữ trải nghiệm quen thuộc.

### GĐ1 — "Wow, iWiki khác hẳn rồi!" (Sprint 1-2, 16/3 – 10/4)
*Focus: UI/UX impact rõ rệt + fix nền tảng*

- **Redesign trang chủ & trang đọc bài** — hiện đại, sạch sẽ, tập trung vào nội dung (giữ layout quen nhưng nâng cấp visual)
- **Fix critical bugs** — lỗi 500, trắng trang, link chết, auto-save lỗi
- **Rút gọn luồng duyệt bài** — từ nhiều bước → ít bước, inline comment khi duyệt
- **Bookmark + Lịch sử đọc gần đây** — 2 tính năng nhỏ nhưng tạo lý do quay lại
- **RBAC theo cơ cấu tổ chức mới** + tái cấu trúc folder taxonomy
- **Giao diện Knowledge Manager** để chuyển đổi tài liệu cũ về danh mục mới dễ dàng

*KR: Điểm hài lòng >3.0/5; tỷ lệ phàn nàn lỗi kỹ thuật giảm 70%*

### GĐ2 — "Tìm cái gì cũng ra!" (Sprint 3-4, 13/4 – 8/5)
*Focus: Phá vỡ điểm nghẽn lớn nhất — tìm kiếm*

- **Semantic Search** — hiểu ngữ nghĩa tiếng Việt, đồng nghĩa, ý định (AI Engineer chủ lực)
- **AI Write MVP** — tóm tắt, viết đoạn văn từ bullet points, gợi ý tiêu đề (tích hợp vào editor hiện tại, không thay editor mới)
- **Content Templates** — mẫu chuẩn cho hướng dẫn, báo cáo, đúc kết
- **Bộ lọc nâng cao** — theo space, tác giả, ngày, loại nội dung
- **Polish UX** trang kết quả tìm kiếm + trình soạn thảo

*KR: Tỷ lệ tìm kiếm thành công >70%; thời gian tạo tài liệu giảm 30%*

### GĐ3 — "iWiki biết mình cần gì" (Sprint 5-6, 11/5 – 5/6)
*Focus: Từ thụ động sang chủ động*

- **AI Chatbot trên iWiki** — hỏi-đáp tự nhiên, trích dẫn nguồn, tuân thủ RBAC (RAG trên kho tri thức)
- **Personalized Newsfeed** — trang chủ cá nhân hóa theo vị trí, lịch sử, quan tâm
- **AI Content Auditing** — quét & dán nhãn bài cũ, trùng lặp, đề xuất review
- **Content Lifecycle** — trạng thái bài viết + auto-remind tác giả cập nhật

*KR: Tỷ lệ tìm kiếm thành công >90%; ≥50% core roles dùng AI Chatbot*

### GĐ4 — "Ai cũng muốn đóng góp" (Sprint 7-8, 8/6 – 3/7)
*Focus: Văn hóa + Adoption toàn công ty*

- **Gamification** — XP, coins, badges, leaderboard contributors
- **Bounty Program** — đặt hàng tri thức còn thiếu, treo thưởng
- **Manager Dashboard** — theo dõi bài viết team, top bài đọc nhiều, thành viên tích cực
- **Analytics Dashboard** — MAU, top search, engagement metrics
- **Go-live toàn công ty** + training + truyền thông

*KR (= KR toàn dự án): MAU >60%; ≥80% core roles công nhận iWiki là kênh chính; Hài lòng >4.0/5*

### Tại sao Timeline Khả thi với Team 5 người?

| Lever | Impact |
|---|---|
| **AI-assisted development** | Cả team dùng AI coding tools (Cursor/Copilot) — ước tính tăng 1.5-2x throughput cho code generation, boilerplate, testing |
| **AI Engineer chuyên trách** | AI Search, Chatbot, Content Auditing được phát triển song song bởi 1 người chuyên biệt — không block dev team |
| **UI/UX Designer đi trước 1 sprint** | Design xong trước khi dev bắt tay vào — giảm thời gian chờ, giảm rework |
| **Progressive enhancement** | Không rewrite — nâng cấp trên codebase hiện tại, giữ data model, chỉ cải thiện UI layer và thêm tính năng mới |
| **Feature flag & gradual rollout** | Ship nhanh, rollout từng nhóm người dùng, thu feedback sớm |

## Điểm Khác biệt

- **Tri thức chỉ iKame mới có**: Kinh nghiệm thực chiến, quy trình nội bộ, bài học dự án — không tìm được trên Google hay ChatGPT.
- **AI hiểu context iKame**: AI Write viết theo template iKame, AI Search hiểu ngữ nghĩa tiếng Việt + thuật ngữ nội bộ, AI Chatbot trả lời dựa trên dữ liệu đã kiểm duyệt — tuân thủ RBAC.
- **Nền tảng tự xây dựng**: Toàn quyền kiểm soát UX, phát triển nhanh theo nhu cầu — không phụ thuộc roadmap Confluence/Notion.
- **Gamification + Bounty**: Biến đóng góp tri thức thành hành vi được ghi nhận, thúc đẩy văn hóa chia sẻ.

## Người dùng Mục tiêu

**Viewer (Người tra cứu)** — 200+ nhân sự, đặc biệt nhân sự mới. Cần tìm đúng thông tin nhanh chóng. *Thành công = tự giải quyết vấn đề mà không cần hỏi ai.*

**Contributor (Chuyên gia đúc kết)** — Chuyên gia, quản lý có kinh nghiệm muốn chia sẻ nhưng ngại viết. *Thành công = viết bài chất lượng trong 30 phút thay vì 2 giờ nhờ AI.*

**Knowledge Manager (Quản trị viên)** — Trưởng bộ phận cần quản lý, duyệt, đảm bảo chất lượng tri thức của team. *Thành công = nhìn toàn cảnh tri thức team trên 1 dashboard, dễ dàng chuyển đổi tài liệu về danh mục mới.*

## Chiến lược Adoption Nội bộ (cho People Manager Team)

Sản phẩm tốt chưa đủ — cần chiến lược "go-to-market nội bộ" để 200 người thực sự dùng:

### Growth Hacks

| Chiến thuật | Mô tả | Giai đoạn |
|---|---|---|
| **"First 5 minutes"** | Trang chủ mới phải ngay lập tức hữu ích — hiển thị bài liên quan đến role của người dùng, không cần tìm kiếm | GĐ1 |
| **Content Seeding** | Trước go-live GĐ2, phối hợp P&OD migrate + chuẩn hóa top 50 tài liệu được truy cập nhiều nhất. AI Search vô dụng nếu kho tri thức mỏng | GĐ1-2 |
| **iWiki Champion Program** | Mỗi BU chọn 1-2 "Knowledge Champion" được training trước, early access, quyền đề xuất nội dung — họ là người đi đầu kéo team theo | GĐ2-3 |
| **Manager Accountability** | Tích hợp dữ liệu đóng góp iWiki vào Performance Review. Manager nhận weekly digest về hoạt động tri thức của team | GĐ3-4 |
| **Knowledge Gap Alerts** | Cho Manager thấy "team bạn đang tìm kiếm những gì mà không có bài viết" — tạo urgency để đóng góp | GĐ3 |
| **Onboarding Mandate** | Mọi nhân sự mới phải hoàn thành "iWiki Orientation" trong tuần đầu — tạo thói quen từ ngày 1 | GĐ4 |
| **Executive Sponsorship** | BOD (anh Quyết, chị Nguyệt, anh Nghĩa) phải là người dùng visible — viết bài, react, comment. "Sếp dùng thì nhân viên dùng" | GĐ1→ |
| **Celebration & Social Proof** | Vinh danh top contributors hàng tháng trên kênh công ty, badges hiển thị trên profile nội bộ | GĐ4 |

### Kế hoạch Rollout

1. **GĐ1-2 (Soft launch)**: Rollout cho Managers + Knowledge Champions trước → thu feedback → fix nhanh
2. **GĐ3 (Expanded beta)**: Mở rộng cho core roles (PM, Lead, Senior) → tạo hiệu ứng "người quen dùng rồi"
3. **GĐ4 (Full launch)**: Go-live toàn công ty kèm training session, comms plan, và "iWiki Week" kick-off event

### People Manager Team cần làm gì?

- **Giai đoạn chuẩn bị (GĐ1-2)**: Xác định Knowledge Champions, chuẩn bị content seeding plan, thiết lập tiêu chí đánh giá contribution trong Performance Review
- **Giai đoạn launch (GĐ3-4)**: Tổ chức training sessions, truyền thông nội bộ, vận hành chương trình ghi nhận & khen thưởng, theo dõi adoption metrics
- **Liên tục**: Thu thập feedback, đề xuất cải tiến, duy trì văn hóa chia sẻ tri thức

## Chỉ số Thành công

| Chỉ số | Hiện tại | Mục tiêu 4.0 |
|---|---|---|
| MAU (Monthly Active Users) | <30% | >60% |
| Điểm hài lòng | 2.48/5 | >4.0/5 |
| Tỷ lệ tìm kiếm thành công | ~52% | >90% |
| Contributors tích cực/tháng | ~20 | ~40 (tăng 100%) |
| Core roles coi iWiki là kênh chính | Thấp | ≥80% |

## Phạm vi & Ranh giới

**Trong scope (Tech):**
- Cải thiện UI/UX trên codebase hiện tại (progressive enhancement)
- AI integrations: Semantic Search, AI Write, AI Chatbot (trên web), AI Content Auditing
- RBAC theo cơ cấu mới + giao diện KM chuyển đổi tài liệu
- Gamification & Bounty system
- Dashboard cho Admin, Manager
- Analytics cơ bản

**Ngoài scope:**
- Chiến lược nội dung "Đúc kết Kho báu" (P&OD phụ trách, Tech phối hợp)
- Slack Bot / AI ngoài iWiki
- Collaborative Editing real-time (đánh giá sau GĐ2 nếu timeline cho phép)
- Mobile native app (ưu tiên responsive web)
- Tích hợp sâu HR system (phase sau)

## Tầm nhìn

Nếu iWiki 4.0 thành công, trong 2-3 năm tới, iWiki sẽ trở thành **"bộ não số" của iKame** — nơi mỗi nhân sự mới được AI onboard bằng chính tri thức tổ chức, mỗi quyết định có căn cứ từ kinh nghiệm đúc kết có hệ thống, và tri thức không "ra đi" theo người nghỉ việc. Khi scale lên 500+, iWiki là lực nhân bản — giúp tổ chức lớn mà không mất tốc độ.

iWiki không chỉ là sản phẩm công nghệ — nó là nền tảng để iKame xây dựng **văn hóa học hỏi liên tục** và **competitive advantage thông qua tri thức tổ chức**.
