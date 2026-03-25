// Article template definitions used in the Editor template picker
export interface EditorTemplate {
  id: string;
  title: string;
  description: string;
  content: string;
}

export const EDITOR_TEMPLATES: EditorTemplate[] = [
  {
    id: 'process',
    title: 'Process & Guidelines',
    description: 'Chuẩn hóa quy trình vận hành, hướng dẫn thực hiện công việc.',
    content: '# Quy trình / Hướng dẫn: [Tên quy trình]\n\n## 1. Mục tiêu\nMô tả mục đích của quy trình này...\n\n## 2. Đối tượng áp dụng\nAi cần thực hiện quy trình này...\n\n## 3. Các bước thực hiện\n### Bước 1: [Tên bước]\n- Nội dung chi tiết...\n\n### Bước 2: [Tên bước]\n- Nội dung chi tiết...\n\n## 4. Lưu ý & Checklist\n- [ ] Kiểm tra bước A\n- [ ] Kiểm tra bước B\n',
  },
  {
    id: 'knowledge',
    title: 'Knowledge',
    description: 'Chia sẻ kiến thức, kinh nghiệm và các thông tin hữu ích.',
    content: '# Kiến thức về: [Chủ đề]\n\n## 1. Tổng quan\nGiới thiệu khái quát về chủ đề này...\n\n## 2. Các nội dung chính\n### 2.1. [Nội dung 1]\nChi tiết...\n\n### 2.2. [Nội dung 2]\nChi tiết...\n\n## 3. Ứng dụng thực tế\nLàm thế nào để áp dụng kiến thức này vào công việc...\n\n## 4. Tài liệu tham khảo\n- [Link 1]\n- [Link 2]\n',
  },
  {
    id: 'best_practices',
    title: 'Best practices & Case studies',
    description: 'Tổng hợp các cách làm tốt nhất và bài học từ các dự án thực tế.',
    content: '# Best Practices / Case Study: [Tên dự án/Chủ đề]\n\n## 1. Bối cảnh (Context)\nMô tả tình huống hoặc dự án...\n\n## 2. Thách thức (Challenges)\nNhững khó khăn gặp phải...\n\n## 3. Giải pháp & Cách làm tốt nhất (Solutions & Best Practices)\n- Giải pháp đã áp dụng...\n- Tại sao đây là cách làm tốt nhất...\n\n## 4. Kết quả & Bài học (Results & Lessons Learned)\n- Kết quả đạt được...\n- Bài học rút ra cho các lần sau...\n',
  },
];
