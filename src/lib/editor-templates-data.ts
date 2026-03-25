// Article template definitions used in the Editor template picker
export interface EditorTemplate {
  id: string;
  title: string;
  description: string;
  content: string;
}

export const EDITOR_TEMPLATES: EditorTemplate[] = [
  {
    id: 't1',
    title: 'Biên bản họp (Meeting Minutes)',
    description: 'Ghi lại nhanh nội dung, quyết định và action items sau mỗi cuộc họp.',
    content: '# Meeting Minutes\n\n## 1. Thông tin chung\n- **Thời gian:** \n- **Địa điểm:** \n- **Thành phần tham gia:** \n\n## 2. Nội dung chính thảo luận\n- \n- \n\n## 3. Action Items\n| Việc cần làm | Người phụ trách | Deadline | Trạng thái |\n|---|---|---|---|\n| | | | |\n',
  },
  {
    id: 't2',
    title: 'SOP / Quy trình chuẩn',
    description: 'Chuẩn hóa quy trình vận hành, dễ theo dõi – phù hợp để share cho toàn team.',
    content: '# Quy trình [Tên quy trình]\n\n## 1. Mục đích\nQuy trình này nhằm...\n\n## 2. Phạm vi áp dụng\nÁp dụng cho bộ phận/cá nhân...\n\n## 3. Định nghĩa & Viết tắt\n- \n\n## 4. Nội dung chi tiết quy trình\n### Bước 1: [Tên bước]\n- **Người thực hiện:** \n- **Mô tả:** \n\n### Bước 2: ...\n',
  },
  {
    id: 't3',
    title: 'Weekly Report',
    description: 'Tổng hợp nhanh công việc đã làm, tiến độ OKR/KPI và kế hoạch tuần tới.',
    content: '# Báo cáo tuần [Số tuần/Tháng]\n\n## 1. Những việc đã hoàn thành\n- \n- \n\n## 2. OKRs / KPIs Progress\n- Mục tiêu 1: [Tiến độ %]\n- Mục tiêu 2: [Tiến độ %]\n\n## 3. Khó khăn & Blocker (Nếu có)\n- \n\n## 4. Kế hoạch tuần tới\n- \n',
  },
];
