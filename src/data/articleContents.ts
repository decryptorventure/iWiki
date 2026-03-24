/**
 * Nội dung chi tiết và hình ảnh thật cho từng bài viết (markdown).
 * Dùng ảnh Unsplash cho demo.
 */
export const ARTICLE_CONTENTS: Record<string, string> = {
  'a-1': `# Performance Checkpoint tại iKame

Bài viết tổng hợp mọi thứ iKamer cần biết để có một kỳ Checkpoint hiệu quả: quy trình, tiêu chí đánh giá và cách chuẩn bị.

![Kỳ đánh giá Performance tại iKame](https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=900)

## 1. Checkpoint là gì?

Performance Checkpoint tại iKame là chu kỳ đánh giá hiệu suất làm việc **6 tháng một lần** (tháng 6 và tháng 12), giúp mỗi nhân viên và quản lý nhìn lại mức độ hoàn thành OKRs, năng lực chuyên môn và sự gắn kết với văn hóa công ty.

## 2. Quy trình 4 bước

- **Bước 1 — Tự đánh giá:** Nhân viên điền form self-assessment trên HRM, nêu rõ achievements, số liệu và điểm cần cải thiện.
- **Bước 2 — 1-on-1 với quản lý:** Buổi trò chuyện trực tiếp 45–60 phút để thảo luận kết quả, feedback và kế hoạch phát triển.
- **Bước 3 — Peer Review (nếu có):** Một số vai trò có thêm vòng nhận feedback từ đồng nghiệp làm việc gần.
- **Bước 4 — HR duyệt:** Bộ phận Nhân sự tổng hợp và phê duyệt, lock kết quả và gắn với lộ trình thăng tiến / tăng lương.

![Làm việc nhóm và đánh giá](https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=900)

## 3. Tiêu chí đánh giá

| Thành phần | Tỷ trọng | Mô tả |
|------------|----------|--------|
| Kết quả công việc (OKRs) | 50% | Mức độ hoàn thành mục tiêu đã cam kết |
| Năng lực chuyên môn | 30% | Kỹ năng kỹ thuật, tư duy, chất lượng deliver |
| Alignment văn hóa | 20% | Hành vi phù hợp giá trị iKame, collaboration |

## 4. Mẹo chuẩn bị

- Chuẩn bị **số liệu cụ thể** (%, số task, impact) cho từng OKR.
- Ghi lại **feedback** đã nhận trong kỳ để dùng trong self-assessment.
- Đặt **mục tiêu phát triển** rõ ràng cho 6 tháng tới và trao đổi với quản lý.

> Checkpoint không chỉ là đánh giá — đây là cơ hội để align với quản lý và tổ chức về hướng phát triển của bạn.`,

  'a-2': `# Hướng dẫn kết nối VPN iKame qua FortiClient

Hướng dẫn từng bước cài đặt FortiClient và kết nối VPN để làm việc từ xa an toàn với hệ thống nội bộ iKame.

![Bảo mật và kết nối từ xa](https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=900)

## 1. Cài đặt FortiClient

- Tải **FortiClient** (bản VPN) từ trang chính thức Fortinet hoặc qua link nội bộ IT cung cấp.
- Chạy file cài đặt và làm theo wizard. Khuyến nghị cài đặt **chỉ VPN** nếu bạn chỉ cần kết nối từ xa.
- Sau khi cài xong, mở FortiClient và chọn mục **VPN**.

## 2. Cấu hình VPN

- Chọn **Remote Access** → **Create New**.
- Điền **Connection name:** ví dụ \`iKame VPN\`.
- **Remote gateway:** nhập địa chỉ gateway do IT cung cấp (dạng \`vpn.ikame.vn\` hoặc IP).
- **Authentication:** chọn Username & Password (hoặc certificate nếu IT đã cấp).

![Cấu hình VPN](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=900)

## 3. Đăng nhập và OTP

- Nhập **username** (email công ty) và **mật khẩu**.
- Khi được yêu cầu, nhập mã **OTP** từ ứng dụng xác thực hai yếu tố (Google Authenticator / Microsoft Authenticator hoặc SMS theo quy định IT).
- Sau khi kết nối thành công, icon VPN sẽ hiển thị trạng thái **Connected**. Bạn có thể truy cập các tài nguyên nội bộ (Jira, Git, wiki, shared drive) như khi ở văn phòng.

## 4. Lưu ý

- Không chia sẻ thông tin VPN và OTP với bất kỳ ai.
- Ngắt VPN khi không làm việc để tránh lãng phí tài nguyên và giảm rủi ro bảo mật.`,

  'a-6': `# Quy trình xin nghỉ phép và chính sách PTO

Hướng dẫn đầy đủ về số ngày phép được hưởng, cách đăng ký trên HRM và quy trình phê duyệt tại iKame.

![Nghỉ phép và work-life balance](https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&q=80&w=900)

## 1. Số ngày PTO theo thâm niên

| Thâm niên | Số ngày phép năm |
|-----------|------------------|
| Dưới 1 năm | 12 ngày |
| Từ 1 đến dưới 3 năm | 14 ngày |
| Từ 3 đến dưới 5 năm | 16 ngày |
| Từ 5 năm trở lên | 18 ngày |

Ngày nghỉ lễ theo quy định Nhà nước được tính riêng, không trừ vào PTO.

## 2. Cách đăng ký nghỉ phép

- Đăng nhập **HRM** (hệ thống nhân sự nội bộ) → mục **Leave / Nghỉ phép**.
- Chọn **Tạo yêu cầu** → loại nghỉ (Nghỉ phép năm, Nghỉ ốm, Nghỉ việc riêng…), ngày bắt đầu – kết thúc và ghi chú (nếu cần).
- **Nghỉ từ 3 ngày trở lên:** cần đăng ký ít nhất **3 ngày làm việc** trước để Line Manager và HR có thời gian duyệt.
- **Nghỉ ốm đột xuất:** có thể báo qua Slack/email cho quản lý và HR, sau đó bổ sung request trên HRM trong ngày làm việc tiếp theo (kèm giấy bác sĩ nếu quy định nội bộ yêu cầu).

![Lịch và kế hoạch nghỉ phép](https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=900)

## 3. Quy trình phê duyệt

- Line Manager nhận thông báo và duyệt/từ chối trên HRM.
- Sau khi Manager duyệt, HR xác nhận và khóa lịch. Bạn nhận email/notification khi request được duyệt.
- Nên **bàn giao công việc** rõ ràng (Jira, Slack, backup person) trước khi nghỉ.

## 4. Lưu ý

- Không chuyển toàn bộ PTO sang năm sau; số ngày không dùng hết sẽ được quy định theo chính sách (hoàn tiền hoặc mất tùy policy hiện hành).
- Nghỉ ốm kéo dài cần có xác nhận y tế theo quy định công ty.`,

  'a-7': `# Code style và linting cho React/TypeScript

Chuẩn code style của team Frontend iKame: ESLint, Prettier, quy ước đặt tên và cách viết component/hook an toàn kiểu.

![Code và development](https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=900)

## 1. Công cụ bắt buộc

- **ESLint:** bộ rule \`eslint-config-react-typescript\` (hoặc config nội bộ), bật rule React Hooks và TypeScript.
- **Prettier:** format code thống nhất. Dùng \`.prettierrc\` với \`singleQuote: true\`, \`trailingComma: es5\`, \`printWidth: 100\`.
- **Husky + lint-staged:** chạy lint & format trước khi commit để tránh code lỗi chuẩn lên repo.

## 2. Quy ước đặt tên

- **Component:** PascalCase — \`UserProfile.tsx\`, \`ArticleCard.tsx\`.
- **Hook:** camelCase, bắt đầu bằng \`use\` — \`useAuth\`, \`useDebounce\`.
- **File component:** trùng tên component; folder cho component phức tạp: \`UserProfile/UserProfile.tsx\` + \`UserProfile.styles.ts\`.
- **Constant:** UPPER_SNAKE_CASE — \`API_BASE_URL\`, \`MAX_RETRY\`.

## 3. TypeScript

- Bật \`strict: true\` trong \`tsconfig.json\`.
- Ưu tiên \`interface\` cho object, \`type\` cho union/utility. Export type kèm component khi cần dùng bên ngoài.
- Tránh \`any\`; dùng \`unknown\` hoặc generic khi kiểu chưa rõ.

![TypeScript và React](https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=900)

## 4. Component và Hook

- Function component + hook only; không dùng class component cho code mới.
- Một component một trách nhiệm; tách logic phức tạp vào custom hook.
- Props interface đặt ngay trên file component hoặc trong file \`.types.ts\` nếu dùng chung.

> Mọi PR cần pass ESLint và Prettier. CI sẽ fail nếu có file vi phạm.`,

  'a-10': `# Giá trị cốt lõi và văn hóa iKame

Các giá trị định hướng cách chúng ta làm việc, ra quyết định và đối xử với khách hàng và đồng nghiệp mỗi ngày.

![Văn hóa và teamwork](https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=900)

## 1. Khách hàng làm trung tâm

Mọi sản phẩm và dịch vụ đều hướng đến việc **giải quyết đúng vấn đề của khách hàng**. Chúng ta lắng nghe, đo lường và cải thiện liên tục thay vì chỉ “làm xong feature”.

- Đặt câu hỏi: “Điều này có thực sự giúp khách hàng không?”
- Ưu tiên chất lượng và trải nghiệm trên số lượng task.

## 2. Minh bạch

Thông tin được chia sẻ rõ ràng trong nội bộ: **OKRs, kết quả, rủi ro và quyết định** được truyền đạt đúng đối tượng, đúng thời điểm.

- Cập nhật tiến độ, blocker trên Jira/Slack; không giấu bad news.
- Retrospective và post-mortem không đổ lỗi mà tập trung học hỏi.

![Minh bạch và hợp tác](https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=900)

## 3. Học hỏi liên tục

iKame khuyến khích mỗi người **học kỹ năng mới, thử nghiệm và chia sẻ lại** cho team. Thất bại được xem như cơ hội để rút kinh nghiệm.

- Tech talk, internal wiki (iWiki), khóa học và conference được hỗ trợ.
- Feedback mang tính xây dựng; mọi người có quyền đặt câu hỏi và thử nghiệm trong phạm vi an toàn.

## 4. Sống với giá trị mỗi ngày

Giá trị không chỉ treo trên tường — chúng được phản ánh trong cách chúng ta họp, review code, làm việc với khách hàng và đối xử với đồng nghiệp. Mỗi iKamer đều là đại sứ văn hóa.`,

  'a-16': `# Hướng dẫn sử dụng iWiki cho thành viên mới

iWiki là kho tri thức nội bộ của iKame. Bài viết này giúp bạn nhanh chóng biết cách tìm đọc tài liệu, đóng góp nội dung và dùng AI hỗ trợ.

![iWiki - Kho tri thức nội bộ](https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=900)

## 1. Tìm kiếm và đọc bài

- **Trang chủ:** Hiển thị bài nổi bật và danh sách bài gần đây. Dùng ô tìm kiếm trên đầu trang để tìm theo từ khóa.
- **Thư mục:** Sidebar bên trái có cây thư mục (Công ty iKame, Phòng Kỹ thuật, Know-How, Product…). Click vào thư mục để xem bài trong đó.
- **Kết quả tìm kiếm:** Gõ từ khóa → chọn bài phù hợp. Bạn có thể lọc theo thư mục hoặc tag.

Quyền xem phụ thuộc vào role và scope của bạn: bài **public** thì mọi người đều đọc được; bài **restricted** chỉ người có quyền truy cập thư mục mới thấy.

## 2. Đóng góp nội dung

- Vào **Bài viết của tôi** → **Viết bài mới** (hoặc chỉnh sửa bản nháp).
- Chọn **thư mục** và **tag**, điền tiêu đề và nội dung (hỗ trợ markdown và ảnh).
- **Nhân viên chính thức:** có thể gửi duyệt hoặc (nếu có quyền) xuất bản trực tiếp. **Nhân viên mới:** thường gửi duyệt, quản lý/Admin duyệt và publish.

![Viết bài và cộng tác](https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=900)

## 3. iWiki AI

- Mục **iWiki AI** trên sidebar: trợ lý tri thức — bạn có thể hỏi quy trình, chính sách, hoặc nhờ tạo draft PRD/SOP/tóm tắt.
- Trong **bài viết**, nút “Hỏi AI” cho phép đặt câu hỏi ngữ cảnh theo nội dung bài đang xem.

## 4. Cá nhân hóa

- **Yêu thích:** Bấm nút yêu thích trên bài để lưu vào mục **Favorites**.
- **Custom Feed:** Cấu hình tag và thư mục ưa thích để trang chủ gợi ý bài phù hợp hơn.

Chúc bạn tìm được thông tin hữu ích và đóng góp nhiều bài chất lượng cho iWiki.`,

  'a-8': `# Kiến trúc microservices và cách triển khai tại iKame

Tổng quan kiến trúc microservices: service discovery, API gateway và chuẩn REST/gRPC nội bộ đang được team Backend iKame áp dụng.

![Microservices và cloud](https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=900)

## 1. Tại sao microservices?

- Cho phép **deploy độc lập** từng service, scale theo từng phần.
- Team có thể **sở hữu full stack** một domain (ownership rõ ràng).
- Công nghệ **đa dạng** (Node, Go, Python) phù hợp từng bài toán.

## 2. Các thành phần chính

- **API Gateway:** điểm vào duy nhất (Kong / custom gateway), xử lý auth, rate limit, routing.
- **Service discovery:** Consul hoặc Kubernetes DNS để service tìm nhau qua tên.
- **Message queue:** RabbitMQ / Kafka cho event-driven và async giữa các service.

![Kiến trúc hệ thống](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=900)

## 3. Chuẩn API nội bộ

- **REST** cho CRUD và resource-oriented; **gRPC** cho high-throughput, internal service-to-service.
- Versioning qua URL (\`/v1/\`) hoặc header. Tài liệu OpenAPI/Swagger bắt buộc cho mọi service public.`,

  'a-9': `# CI/CD với GitHub Actions và deploy staging

Cấu hình workflow GitHub Actions: chạy test, build và deploy lên môi trường staging (và production) cho các repo chính của iKame.

![CI/CD pipeline](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=900)

## 1. Workflow cơ bản

- **Trigger:** push vào \`main\` hoặc \`develop\`, hoặc pull request vào \`main\`.
- **Jobs:** Lint → Unit test → Build → (tuỳ branch) Deploy staging hoặc production.
- **Secrets:** \`AWS_ACCESS_KEY\`, \`SSH_KEY\`, \`API_KEYS\` được lưu trong GitHub Secrets, không hardcode trong workflow.

## 2. Ví dụ job deploy staging

\`\`\`
- name: Deploy to Staging
  run: |
    npm run build
    ./scripts/deploy-staging.sh
\`\`\`

Staging thường deploy tự động từ \`develop\`; production từ \`main\` với approval thủ công (environment protection rules).

## 3. Lưu ý

- Cache \`node_modules\` và build output để job chạy nhanh hơn.
- Notify Slack/email khi deploy fail. Log và artifact được lưu trong Actions để debug.`,

  'a-11': `# Mindset Growth — Học từ thất bại và phản hồi

Cách chuyển phản hồi và thất bại thành cơ hội học hỏi, cùng thực hành retrospective cá nhân.

![Growth mindset](https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=900)

## 1. Thất bại là thông tin

Thất bại cho biết **cách làm hiện tại chưa đúng** — không phải bản thân bạn “kém”. Tách bạch sự kiện và đánh giá con người giúp bạn bình tĩnh phân tích và rút ra bài học.

## 2. Phản hồi là quà tặng

- Feedback (từ sếp, đồng nghiệp, khách hàng) cung cấp góc nhìn bạn không tự thấy.
- Luyện thói quen **hỏi thêm** (“Có ví dụ cụ thể không?”, “Bạn mong đợi điều gì khác?”) thay vì phòng thủ.
- Cảm ơn người cho feedback dù bạn có đồng ý hay không — điều đó khuyến khích văn hóa feedback lành mạnh.

## 3. Retrospective cá nhân

- Định kỳ (cuối tuần / cuối sprint) dành 15–30 phút tự hỏi: Điều gì làm tốt? Điều gì chưa? Lần sau sẽ thử gì khác?
- Ghi chép ngắn để theo dõi tiến độ và không lặp lại sai lầm tương tự.`,

  'a-12': `# Checklist review code và merge request

Checklist trước khi tạo MR, tiêu chí review và quy ước approve. SLA review trong team Frontend/Backend iKame.

![Code review](https://images.unsplash.com/photo-1556075798-4825dfaaf498?auto=format&fit=crop&q=80&w=900)

## 1. Trước khi tạo MR

- Code đã **chạy local**, pass lint và test.
- Branch tách từ \`develop\` (hoặc \`main\`) mới nhất, tên branch rõ ràng (ví dụ \`feat/search-filters\`, \`fix/login-timeout\`).
- Mô tả MR: **Mục đích thay đổi**, link ticket, hướng test (steps) và ảnh chụp (nếu là UI).

## 2. Tiêu chí review

- **Đúng yêu cầu:** Logic và UI khớp ticket/spec.
- **Chất lượng code:** Đặt tên rõ, không duplicate, test coverage hợp lý.
- **Bảo mật & performance:** Không lộ secret, không N+1, không block UI.

## 3. SLA

- **Normal:** Phản hồi trong **1 ngày làm việc**.
- **Urgent:** Tag \`urgent\` trong MR, ưu tiên review trong 4 giờ.
- Tối thiểu **1 approve** từ người có quyền trước khi merge; CI phải pass.`,

  'a-13': `# Kỹ năng thuyết trình và trình bày ý tưởng

Cấu trúc slide, storytelling, xử lý Q&A và tips cho demo nội bộ và khách hàng.

![Thuyết trình chuyên nghiệp](https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=900)

## 1. Cấu trúc slide

- **Mở:** Vấn đề / câu hỏi bạn sẽ trả lời (1–2 slide).
- **Thân:** 3–5 ý chính, mỗi ý 1 slide; dùng bullet ngắn, số liệu và hình minh họa.
- **Kết:** Tóm tắt và next steps / call to action.

Tránh chữ dày đặc; slide là “gợi ý” cho người nói, không phải bản văn đọc.

## 2. Storytelling

- Bắt đầu bằng **tình huống hoặc câu chuyện** người nghe dễ hình dung.
- Dẫn dắt “Vấn đề → Giải pháp → Kết quả” để mạch lạc và dễ nhớ.

## 3. Q&A và demo

- Dự đoán câu hỏi khó và chuẩn bị câu trả lời ngắn gọn.
- Demo: chuẩn bị data mẫu, backup video nếu mạng kém; luôn có plan B.`,

  'a-14': `# Template PRD (Product Requirements Document)

Mẫu PRD chuẩn dùng cho sản phẩm tại iKame: problem statement, user stories, acceptance criteria, metrics và timeline.

![Product và tài liệu](https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=900)

## 1. Problem Statement

- **Vấn đề:** Mô tả rõ vấn đề hoặc cơ hội (kèm số liệu nếu có).
- **Đối tượng:** User/segment chịu ảnh hưởng.
- **Mục tiêu:** Kết quả mong muốn sau khi ship (metric cụ thể).

## 2. User Stories & Acceptance Criteria

- Format: “Là [role], tôi muốn [hành động] để [lợi ích].”
- Mỗi story có **Acceptance Criteria** dạng checklist, test được.

## 3. Metrics & Timeline

- **Success metrics:** MAU, conversion, NPS… và cách đo.
- **Timeline:** Milestone và ngày release dự kiến; dependencies và rủi ro.

PRD được review với Engineering và Design trước khi vào sprint.`,

  'a-15': `# Quy trình phê duyệt tài liệu và xuất bản

Luồng từ draft → gửi duyệt → approve/reject → publish. Role và quyền theo từng thư mục trên iWiki.

![Quy trình và phê duyệt](https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=900)

## 1. Các trạng thái bài viết

- **Draft:** Đang soạn, chưa gửi duyệt.
- **In Review:** Đã gửi, chờ người có quyền duyệt.
- **Approved:** Đã duyệt, có thể publish.
- **Rejected:** Từ chối, kèm lý do; author chỉnh sửa và gửi lại.
- **Published:** Đã xuất bản, mọi người (có quyền) đọc được.

## 2. Ai được duyệt?

- Theo **scope** từng thư mục: Manager/Admin có quyền \`approve\` trong scope được cấp.
- Admin có quyền duyệt toàn hệ thống.

## 3. SLA

- Mục tiêu phản hồi **trong 2 ngày làm việc**. Author có thể nhắc trên Slack nếu quá hạn.`,

  'a-17': `# Quy trình release sản phẩm và go-live

Checklist trước go-live, rollback plan, communication và post-launch review cho các sản phẩm iKame.

![Release và launch](https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=900)

## 1. Trước go-live

- **Feature complete:** Toàn bộ AC đã pass, QA sign-off.
- **Staging ổn định:** Không critical bug; performance và security scan pass.
- **Rollback plan:** Cách quay lại bản cũ (DB migration rollback, feature flag tắt…).
- **Communication:** Thông báo nội bộ và (nếu cần) khách hàng về thời điểm và nội dung release.

## 2. Trong ngày release

- Deploy theo **runbook** đã chuẩn bị; có người trực để xử lý sự cố.
- Smoke test ngay sau deploy; monitor log và metric.

## 3. Post-launch

- **Review sau 24–48h:** Số liệu thực tế, lỗi báo về, feedback. Ghi nhận lesson learned và cập nhật runbook.`,

  'a-18': `# Bảo mật thông tin và quy tắc bảo mật nội bộ

Phân loại dữ liệu, quy tắc lưu trữ, chia sẻ và xử lý khi có sự cố tại iKame.

![Bảo mật thông tin](https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=900)

## 1. Phân loại dữ liệu

- **Public:** Có thể chia sẻ ngoài công ty (blog, marketing).
- **Nội bộ:** Chỉ trong iKame (tài liệu, quy trình, roadmap).
- **Confidential:** Chỉ nhóm cần biết (hợp đồng, tài chính, nhân sự).
- **Restricted:** Mật khẩu, key, token; không lưu trên chat/email, dùng vault hoặc secret manager.

## 2. Quy tắc chung

- Không gửi dữ liệu confidential qua kênh không mã hóa; không tải về máy cá nhân trừ khi được phép.
- Khi có nghi ngờ rò rỉ hoặc sự cố bảo mật: báo ngay cho IT Security và quản lý trực tiếp.

## 3. Xử lý sự cố

- IT/Security sẽ đánh giá mức độ, cách ly và khắc phục; thông báo nội bộ theo chính sách. Mọi nhân viên có trách nhiệm tuân thủ và tham gia đào tạo bảo mật định kỳ.`,

  'a-3': `# OKR Framework — Hỏi đáp thực tế từ team Product

Mẫu triển khai OKR theo quý cho Product team và các câu hỏi thường gặp trong thực tế tại iKame.

![OKR và mục tiêu](https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=900)

## OKRs trong thực tế

- **O (Objective):** Mục tiêu định tính, truyền cảm hứng — ví dụ “Trở thành kênh tra cứu tri thức số 1 cho nhân viên”.
- **KR (Key Results):** 2–5 kết quả đo được, có số, có thời hạn — ví dụ “MAU iWiki đạt 60% vào Q4”, “NPS search >= 4.0”.

## Mẹo viết OKR

- KR nên **ambitious but achievable**; tránh quá dễ hoặc bất khả thi.
- Review giữa kỳ để điều chỉnh; sau mỗi quý làm retrospective và gắn với Checkpoint.`,

  'a-4': `# Playbook onboarding nhân sự mới

Checklist tuần đầu cho nhân viên mới và các bước HR/Manager cần thực hiện.

![Onboarding](https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=900)

## Tuần đầu tiên

- Nhận laptop, email, Slack, Jira; 1-on-1 với Line Manager; đọc Culture & Values.
- Shadow sessions với đồng nghiệp; tham gia standup/sprint planning.
- *Lưu ý: Tài liệu này đang cần bổ sung quy trình bàn giao tài khoản và SLA hỗ trợ theo feedback từ Manager.*`,

  'a-5': `# API v3.0 — Work In Progress

Tài liệu kỹ thuật API phiên bản 3.0 đang được cập nhật. Nội dung sẽ bao gồm authentication, versioning và danh sách endpoint.

![API và development](https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=900)

## Trạng thái

- Đang draft; dự kiến publish sau khi hoàn thành review với Backend team.`,
};
