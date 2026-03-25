// Mock AI response generators and constants for IWikiAI component
import { Globe, BookOpen, FileText, MessageSquare, Sparkles, Image } from 'lucide-react';
import type { ComponentType } from 'react';

export const STARTER_CARDS = [
  { icon: Sparkles, title: 'Tra cứu chính sách nghỉ phép', desc: 'Hỏi AI về quy trình xin phép', prompt: 'Quy trình xin nghỉ phép tại iKame như thế nào?', gradient: 'from-orange-500/10 to-amber-500/10' },
  { icon: FileText, title: 'Viết PRD cho dự án', desc: 'Tạo Product Requirements Document', prompt: 'Viết PRD cho dự án iWiki 4.0 — Knowledge Hub', gradient: 'from-blue-500/10 to-indigo-500/10' },
  { icon: Image, title: 'Tóm tắt tài liệu', desc: 'Tóm gọn nội dung dài', prompt: 'Hãy hướng dẫn tôi cách viết một tài liệu kỹ thuật tốt', gradient: 'from-purple-500/10 to-pink-500/10' },
  { icon: MessageSquare, title: 'Viết SOP quy trình', desc: 'Tạo quy trình chuẩn SOP', prompt: 'Viết SOP cho quy trình onboarding nhân viên mới tại iKame', gradient: 'from-green-500/10 to-emerald-500/10' },
] as { icon: ComponentType<{ size: number; className?: string }>; title: string; desc: string; prompt: string; gradient: string }[];

export const DATA_CONNECTORS = [
  { id: 'drive', name: 'Google Drive', icon: Globe, color: 'text-blue-500', desc: 'Import Docs, Sheets' },
  { id: 'notebook', name: 'NotebookLM', icon: BookOpen, color: 'text-purple-500', desc: 'Sync sources' },
  { id: 'local', name: 'Local PDF/Docs', icon: FileText, color: 'text-orange-500', desc: 'Upload direct' },
] as { id: string; name: string; icon: ComponentType<{ size: number; className?: string }>; color: string; desc: string }[];

export const MODELS = [
  { id: 'auto', name: 'Auto', badge: '' },
  { id: 'gemini-pro', name: 'Gemini 1.5 Pro', badge: 'Smart' },
  { id: 'gemini-flash', name: 'Gemini 1.5 Flash', badge: 'Fast' },
  { id: 'gpt-4o', name: 'GPT-4o', badge: 'Powerful' },
  { id: 'claude-3-5', name: 'Claude 3.5 Sonnet', badge: 'Creative' },
];

const DOC_KEYWORDS = ['viết', 'tạo', 'soạn', 'draft', 'write', 'prd', 'sop', 'document', 'docs', 'tài liệu', 'báo cáo', 'report', 'proposal', 'template'];

export function isDocRequest(message: string): boolean {
  const q = message.toLowerCase();
  return DOC_KEYWORDS.some(kw => q.includes(kw)) && (q.includes('viết') || q.includes('tạo') || q.includes('soạn') || q.includes('draft') || q.includes('write') || q.includes('prd') || q.includes('sop') || q.includes('report') || q.includes('báo cáo'));
}

export function extractDocTitle(message: string): string {
  const q = message.toLowerCase();
  if (q.includes('prd')) { const m = message.match(/(?:prd|PRD)\s+(?:cho\s+)?(.+)/i); return m ? `${m[1].trim()} PRD` : 'iWiki Document'; }
  if (q.includes('sop')) { const m = message.match(/(?:sop|SOP)\s+(?:cho\s+)?(.+)/i); return m ? `SOP — ${m[1].trim()}` : 'Standard Operating Procedure'; }
  const m = message.match(/(?:viết|tạo|soạn|draft|write)\s+(.+)/i);
  return m ? m[1].trim().slice(0, 60) : 'iWiki Document';
}

export function generateDocContent(userMessage: string): string {
  const q = userMessage.toLowerCase();
  const topic = extractDocTitle(userMessage);

  if (q.includes('prd') || q.includes('product requirement')) {
    return `# ${topic}\n\n## Problem\n\niWiki hiện chỉ đạt 30–40% kỳ vọng ban đầu, với MAU dưới 30% và điểm hài lòng chỉ 2.48/5. Theo khảo sát nội bộ, 92.6% người dùng truy cập dưới 2 lần/tuần.\n\n## High Level Approach\n\nTái kiến trúc iWiki thành Knowledge Hub thông minh với lộ trình tuần tự bốn giai đoạn.\n\n## Features & Requirements\n\n### Phase 1: Foundation (Q2 2026)\n\n| Feature | Priority | Description |\n|---------|----------|-------------|\n| Smart Search | P0 | AI-powered search với semantic understanding |\n| Rich Editor | P0 | Block-based editor hỗ trợ markdown, media |\n| Approval Flow | P1 | Quy trình duyệt bài linh hoạt theo role |\n\n### Phase 2: AI Integration (Q3 2026)\n\n| Feature | Priority | Description |\n|---------|----------|-------------|\n| AI Chatbot | P0 | RAG-based chatbot trả lời câu hỏi từ knowledge base |\n| Auto-suggest | P1 | Gợi ý nội dung khi viết bài |\n\n## Timeline & Milestones\n\n- **Q2 2026:** Phase 1 launch\n- **Q3 2026:** Phase 2 launch\n- **Q4 2026:** Phase 3 — Gamification`;
  }

  if (q.includes('sop') || q.includes('quy trình') || q.includes('onboarding')) {
    return `# SOP — ${topic}\n\n## 1. Mục đích\n\nQuy trình này nhằm chuẩn hóa các bước onboarding cho nhân viên mới tại iKame.\n\n## 2. Phạm vi áp dụng\n\nÁp dụng cho tất cả nhân viên mới tại tất cả các phòng ban.\n\n## 3. Người chịu trách nhiệm\n\n| Vai trò | Trách nhiệm |\n|---------|-------------|\n| HR Team | Chuẩn bị tài liệu, lịch trình |\n| Line Manager | Mentoring, assign task |\n| Buddy | Hỗ trợ hòa nhập văn hóa |\n\n## 4. Quy trình chi tiết\n\n### Ngày đầu tiên\n- [ ] Welcome session với HR\n- [ ] Setup thiết bị và tài khoản\n- [ ] 1-on-1 với Line Manager\n\n### Tuần đầu tiên\n- [ ] Đọc Culture & Values\n- [ ] Shadow sessions với stakeholders\n\n## 5. KPIs\n\n- Time-to-Productivity <= 30 ngày\n- Onboarding Satisfaction Score >= 4.0/5`;
  }

  if (q.includes('báo cáo') || q.includes('report') || q.includes('weekly')) {
    return `# Báo cáo tuần\n\n## 1. Tóm tắt tổng quan\n\nSprint hoàn thành 85% story points cam kết.\n\n## 2. Việc đã hoàn thành\n\n- [x] Feature: Smart Search v2\n- [x] Bug fix: Notification badge\n\n## 3. Blockers & Risks\n\n| Issue | Impact | Status |\n|-------|--------|--------|\n| API Gateway rate limit | Block AI features | Escalated |\n\n## 4. Kế hoạch tuần tới\n\n- Hoàn thành AI Chatbot integration\n- Launch Custom Feed beta`;
  }

  return `# ${topic}\n\n## Giới thiệu\n\nTài liệu này được tạo tự động bởi iWiki AI. Nội dung bên dưới là bản draft đầu tiên.\n\n## Nội dung chính\n\n### Mục tiêu\n- Mục tiêu 1: Mô tả mục tiêu chính\n- Mục tiêu 2: Mô tả mục tiêu phụ\n\n### Chi tiết triển khai\nMô tả các bước triển khai cụ thể...\n\n## Kết luận\n\nTóm tắt lại các điểm chính và next steps.\n\n---\n*Tài liệu được tạo bởi iWiki AI. Vui lòng review và chỉnh sửa trước khi publish.*`;
}

export function generateAIResponse(userMessage: string): string {
  const q = userMessage.toLowerCase();

  if (q.includes('đúc kết') || q.includes('tóm tắt') || q.includes('phân tích')) {
    return `### Kết quả Phân tích & Đúc kết Tri thức\n\n**1. Tóm lược mục tiêu:**\n- Tập trung vào "Single Source of Truth" cho toàn bộ tổ chức.\n\n**2. Các trụ cột kiến thức:**\n- 🚀 **Hiệu suất:** Quy tắc 80/20 để tối ưu output.\n- 🤝 **Cộng tác:** Đồng bộ giữa các phòng ban qua iWiki.\n- 🛠️ **Công cụ:** Tận dụng AI và Automation.`;
  }

  if (q.includes('drive') || q.includes('notebook') || q.includes('import')) {
    const src = q.includes('drive') ? 'Google Drive' : q.includes('notebook') ? 'NotebookLM' : 'Dữ liệu nội bộ';
    return `### Tích hợp ${src}\n\nĐã kết nối thành công và đang đồng bộ tri thức từ **${src}**.\n\n- 🔄 Đang quét các tệp tin mới nhất.\n- ⚡ Đã phân loại 15 tài liệu quan trọng.\n- 🧠 AI đang tiến hành embedding.`;
  }

  if (q.includes('nghỉ phép') || q.includes('xin phép')) {
    return `Để xin nghỉ phép tại iKame:\n\n**1. Đăng ký trên HRM**\n- Tạo request ít nhất 3 ngày trước\n\n**2. Thông báo Line Manager**\n- Ping qua Slack để duyệt nhanh\n\n**3. Bàn giao công việc**\n- Cập nhật status trên Jira\n- Tag người hỗ trợ`;
  }

  if (q.includes('meeting') || q.includes('họp')) {
    return `Template **Meeting Agenda** cho Sprint Planning 1 giờ:\n\n⚡ **0:00–0:05** — Check-in\n📊 **0:05–0:20** — Review Sprint trước\n🎯 **0:20–0:45** — Sprint Planning\n✅ **0:45–0:55** — Q&A & Blockers\n📝 **0:55–1:00** — Wrap-up`;
  }

  const responses = [
    `Tôi là iWiki AI, trợ lý tri thức nội bộ iKame. Tôi có thể giúp:\n\n- 🔍 **Tra cứu** chính sách, quy trình\n- ✍️ **Soạn thảo** tài liệu, email\n- 📊 **Tóm tắt** tài liệu dài\n\nBạn cần hỗ trợ gì hôm nay?`,
    `Tôi đã hiểu yêu cầu. Bạn có muốn tôi **đúc kết các insight quan trọng nhất** không?`,
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}
