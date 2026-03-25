// AI writing assistant reply generator for Editor AI chat panel
export function buildEditorAiReply(message: string): string {
  const q = message.toLowerCase();

  if (q.includes('dàn ý') || q.includes('outline')) {
    return `Đây là một dàn ý gợi ý cho bài viết của bạn:\n\n## 1. Bối cảnh & vấn đề\n- Mô tả ngắn gọn hiện trạng\n- Tại sao cần tài liệu này\n\n## 2. Mục tiêu chính\n- Mục tiêu 1\n- Mục tiêu 2\n\n## 3. Nội dung chi tiết\n### 3.1. Phần 1\n- Các ý chính\n\n### 3.2. Phần 2\n- Các ý chính\n\n## 4. Kết luận & next steps\n- Tóm tắt lại\n- Đề xuất hành động tiếp theo`;
  }

  if (q.includes('sop') || q.includes('quy trình') || q.includes('process')) {
    return `Tôi gợi ý cấu trúc SOP như sau:\n\n# SOP — [Tên quy trình]\n\n## 1. Mục đích\nGiải thích tại sao cần quy trình này.\n\n## 2. Phạm vi áp dụng\nAi / bộ phận nào sử dụng.\n\n## 3. Vai trò & trách nhiệm\n- Role 1 — trách nhiệm\n- Role 2 — trách nhiệm\n\n## 4. Quy trình chi tiết\n### Bước 1\n- Mô tả\n\n### Bước 2\n- Mô tả\n\n## 5. Chỉ số & kiểm soát\n- KPI / tiêu chí đánh giá`;
  }

  if (q.includes('báo cáo') || q.includes('report') || q.includes('weekly')) {
    return `Bạn có thể bắt đầu với khung báo cáo sau:\n\n# Báo cáo [Tên/Thời gian]\n\n## 1. Tóm tắt\n- 2–3 dòng về tình hình tổng quan\n\n## 2. Việc đã hoàn thành\n- Mục 1\n- Mục 2\n\n## 3. Việc đang triển khai\n- Mục 1\n\n## 4. Khó khăn / Blocker\n- Mục 1\n\n## 5. Kế hoạch tiếp theo\n- Mục 1`;
  }

  if (q.includes('viết giúp') || q.includes('viết hộ') || q.includes('write for me')) {
    return `Dưới đây là một đoạn mở đầu gợi ý:\n\n> Trong quá trình làm việc tại iKame, chúng ta thường gặp tình huống cần tra cứu nhanh kiến thức hoặc quy trình đã được đúc kết trước đó. Tài liệu này được tạo ra nhằm giúp đội ngũ có một điểm tham chiếu chung, rõ ràng và dễ áp dụng.\n\nNếu bạn muốn, tôi có thể tiếp tục mở rộng thêm các phần nội dung chi tiết.`;
  }

  return `Tôi có thể hỗ trợ bạn theo 2 hướng:\n\n1. **Gợi ý cấu trúc/dàn ý** cho bài viết (SOP, báo cáo, tài liệu quy trình,...)\n2. **Viết nháp một đoạn nội dung cụ thể** để bạn chỉnh sửa lại.\n\nHãy mô tả rõ hơn: bạn đang muốn viết loại tài liệu gì, cho đối tượng nào?`;
}
