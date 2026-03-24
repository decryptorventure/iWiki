import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, ArrowUp, ChevronDown, Plus, Globe, FileText, Image, MessageSquare, Zap, Check, Trash2, BookOpen, Search, ExternalLink, Database, PanelRightOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../App';
import { AIChatMessage, AIChatSession } from '../store/useAppStore';
import { generateRagAnswer } from '../lib/rag';
import AIDocEditor from './AIDocEditor';

const STARTER_CARDS = [
  { icon: Sparkles, title: "Tra cứu chính sách nghỉ phép", desc: "Hỏi AI về quy trình xin phép", prompt: "Quy trình xin nghỉ phép tại iKame như thế nào?", gradient: 'from-orange-500/10 to-amber-500/10' },
  { icon: FileText, title: "Viết PRD cho dự án", desc: "Tạo Product Requirements Document", prompt: "Viết PRD cho dự án iWiki 4.0 — Knowledge Hub", gradient: 'from-blue-500/10 to-indigo-500/10' },
  { icon: Image, title: "Tóm tắt tài liệu", desc: "Tóm gọn nội dung dài", prompt: "Hãy hướng dẫn tôi cách viết một tài liệu kỹ thuật tốt", gradient: 'from-purple-500/10 to-pink-500/10' },
  { icon: MessageSquare, title: "Viết SOP quy trình", desc: "Tạo quy trình chuẩn SOP", prompt: "Viết SOP cho quy trình onboarding nhân viên mới tại iKame", gradient: 'from-green-500/10 to-emerald-500/10' },
];

const DATA_CONNECTORS = [
  { id: 'drive', name: 'Google Drive', icon: Globe, color: 'text-blue-500', desc: 'Import Docs, Sheets' },
  { id: 'notebook', name: 'NotebookLM', icon: BookOpen, color: 'text-purple-500', desc: 'Sync sources' },
  { id: 'local', name: 'Local PDF/Docs', icon: FileText, color: 'text-orange-500', desc: 'Upload direct' },
];

const MODELS = [
  { id: 'auto', name: 'Auto', badge: '' },
  { id: 'gemini-pro', name: 'Gemini 1.5 Pro', badge: 'Smart' },
  { id: 'gemini-flash', name: 'Gemini 1.5 Flash', badge: 'Fast' },
  { id: 'gpt-4o', name: 'GPT-4o', badge: 'Powerful' },
  { id: 'claude-3-5', name: 'Claude 3.5 Sonnet', badge: 'Creative' },
];

const DOC_KEYWORDS = ['viết', 'tạo', 'soạn', 'draft', 'write', 'prd', 'sop', 'document', 'docs', 'tài liệu', 'báo cáo', 'report', 'proposal', 'template'];

function isDocRequest(message: string): boolean {
  const q = message.toLowerCase();
  return DOC_KEYWORDS.some(kw => q.includes(kw)) && (q.includes('viết') || q.includes('tạo') || q.includes('soạn') || q.includes('draft') || q.includes('write') || q.includes('prd') || q.includes('sop') || q.includes('report') || q.includes('báo cáo'));
}

function extractDocTitle(message: string): string {
  const q = message.toLowerCase();
  if (q.includes('prd')) {
    const match = message.match(/(?:prd|PRD)\s+(?:cho\s+)?(.+)/i);
    return match ? `${match[1].trim()} PRD` : 'iWiki Document';
  }
  if (q.includes('sop')) {
    const match = message.match(/(?:sop|SOP)\s+(?:cho\s+)?(.+)/i);
    return match ? `SOP — ${match[1].trim()}` : 'Standard Operating Procedure';
  }
  const match = message.match(/(?:viết|tạo|soạn|draft|write)\s+(.+)/i);
  return match ? match[1].trim().slice(0, 60) : 'iWiki Document';
}

function generateDocContent(userMessage: string): string {
  const q = userMessage.toLowerCase();

  if (q.includes('prd') || q.includes('product requirement')) {
    const topic = extractDocTitle(userMessage);
    return `# ${topic}\n\n## Problem\n\niWiki hiện chỉ đạt 30–40% kỳ vọng ban đầu, với MAU dưới 30% và điểm hài lòng chỉ 2.48/5. Theo khảo sát nội bộ, 92.6% người dùng truy cập dưới 2 lần/tuần. Phân tích nguyên nhân cho thấy ba vấn đề chính: (1) tìm kiếm thất bại — 48.1% người dùng cho rằng kết quả không liên quan; (2) đóng góp nội dung bị nghẽn — thủ tục phê duyệt phức tạp (48.1%) và công cụ soạn thảo yếu (44.4%); (3) chất lượng nội dung thấp — điểm chất lượng trung bình 3.07/5, thiếu kiến thức chuyên môn thực chiến. Có cơ hội lớn để biến iWiki thành kênh kiểm tra cứu tri thức duy nhất, giảm thời gian tìm kiếm thông tin và nâng cao năng lực đúc kết tri thức của tổ chức.\n\n## High Level Approach\n\nSẽ tái kiến trúc iWiki thành Knowledge Hub thông minh với lộ trình tuần tự bốn giai đoạn: chuẩn hóa nền tảng UX & quy trình quản trị, tích hợp AI hỗ trợ tạo nội dung, triển khai AI Search & Chatbot dựa trên RAG, cuối cùng bồi đắp văn hóa chia sẻ tri thức thông qua Gamification. Hệ thống mới hướng đến MAU trên 60% và ít nhất 80% core roles công nhận iWiki là điểm tra cứu chính vào cuối 2026.\n\n## Narrative\n\n### Common use case\n\nLan, một Business Analyst mới tại iKame, cần gấp tài liệu quy trình nghiệp vụ. Sau 20 phút tìm kiếm không thành công do keyword không khớp, cô hỏi đồng nghiệp và được gửi link Google Drive cá nhân — tài liệu đã lỗi thời 6 tháng. Với iWiki 4.0, Lan chỉ cần gõ câu hỏi vào AI Search, hệ thống sẽ trả về đúng tài liệu đã được cập nhật, kèm tóm tắt nội dung và gợi ý bài viết liên quan.\n\n### Success metrics\n\n- MAU tăng từ 30% lên 60%+ trong 6 tháng\n- Thời gian tìm kiếm trung bình giảm 50%\n- Tỷ lệ đóng góp nội dung tăng 3x\n- Điểm chất lượng nội dung trung bình >= 4.0/5\n\n## Features & Requirements\n\n### Phase 1: Foundation (Q2 2026)\n\n| Feature | Priority | Description |\n|---------|----------|-------------|\n| Smart Search | P0 | AI-powered search với semantic understanding |\n| Rich Editor | P0 | Block-based editor hỗ trợ markdown, media |\n| Approval Flow | P1 | Quy trình duyệt bài linh hoạt theo role |\n| Folder Restructure | P1 | Tổ chức lại cây thư mục theo topic-based |\n\n### Phase 2: AI Integration (Q3 2026)\n\n| Feature | Priority | Description |\n|---------|----------|-------------|\n| AI Chatbot | P0 | RAG-based chatbot trả lời câu hỏi từ knowledge base |\n| Auto-suggest | P1 | Gợi ý nội dung khi viết bài |\n| Content Quality Score | P1 | Chấm điểm chất lượng bài viết tự động |\n\n### Phase 3: Gamification (Q4 2026)\n\n| Feature | Priority | Description |\n|---------|----------|-------------|\n| XP & Levels | P1 | Hệ thống điểm kinh nghiệm và cấp bậc |\n| Bounty Board | P2 | Bảng nhiệm vụ săn thưởng viết bài |\n| Leaderboard | P2 | Bảng xếp hạng đóng góp hàng tháng |\n\n## Technical Architecture\n\n- **Frontend:** React + TypeScript, TailwindCSS\n- **Backend:** Node.js + Express\n- **AI Layer:** Gemini 1.5 Pro for RAG, embedding via text-embedding-004\n- **Database:** PostgreSQL + pgvector cho semantic search\n- **Storage:** Google Cloud Storage cho media\n\n## Timeline & Milestones\n\n- **Q2 2026:** Phase 1 launch — Foundation\n- **Q3 2026:** Phase 2 launch — AI Integration\n- **Q4 2026:** Phase 3 launch — Gamification\n- **Q1 2027:** Full ecosystem với advanced analytics`;
  }

  if (q.includes('sop') || q.includes('quy trình') || q.includes('onboarding')) {
    const topic = extractDocTitle(userMessage);
    return `# SOP — ${topic}\n\n## 1. Mục đích\n\nQuy trình này nhằm chuẩn hóa các bước onboarding cho nhân viên mới tại iKame, đảm bảo trải nghiệm nhất quán và hiệu quả từ ngày đầu tiên đến khi hoàn thành thử việc.\n\n## 2. Phạm vi áp dụng\n\nÁp dụng cho tất cả nhân viên mới (full-time, part-time, intern) tại tất cả các phòng ban của iKame.\n\n## 3. Người chịu trách nhiệm\n\n| Vai trò | Trách nhiệm |\n|---------|-------------|\n| HR Team | Chuẩn bị tài liệu, lịch trình, thiết bị |\n| Line Manager | Mentoring, assign task, đánh giá |\n| Buddy | Hỗ trợ hòa nhập văn hóa, giải đáp thắc mắc |\n| IT Support | Setup accounts, devices, permissions |\n\n## 4. Quy trình chi tiết\n\n### Giai đoạn 1: Pre-boarding (1 tuần trước ngày bắt đầu)\n\n- [ ] Gửi Welcome Email kèm checklist chuẩn bị\n- [ ] Setup email công ty, Slack, Jira, HRM\n- [ ] Chuẩn bị laptop, badge, workspace\n- [ ] Assign Buddy cho nhân viên mới\n- [ ] Lên lịch meeting tuần đầu tiên\n\n### Giai đoạn 2: Ngày đầu tiên\n\n- [ ] Welcome session với HR (30 phút)\n- [ ] Ký hợp đồng lao động và các giấy tờ liên quan\n- [ ] Tour văn phòng và giới thiệu với team\n- [ ] Lunch welcome với team\n- [ ] Setup thiết bị và tài khoản\n- [ ] 1-on-1 với Line Manager: roadmap 30-60-90 ngày\n\n### Giai đoạn 3: Tuần đầu tiên\n\n- [ ] Đọc Culture & Values handbook\n- [ ] Join Slack channels liên quan\n- [ ] Shadow sessions với các stakeholders chính\n- [ ] Tham gia sprint planning/standup đầu tiên\n- [ ] Hoàn thành domain knowledge deep dive\n\n### Giai đoạn 4: Tháng đầu tiên (30 ngày)\n\n- [ ] Complete product walkthrough\n- [ ] Thực hiện task nhỏ đầu tiên\n- [ ] Check-in 1-on-1 với Manager (weekly)\n- [ ] Feedback session với HR tại ngày 30\n- [ ] Self-assessment: mức độ hiểu rõ về role và expectations\n\n### Giai đoạn 5: Thử việc (60-90 ngày)\n\n- [ ] Đảm nhận task/project độc lập\n- [ ] Đánh giá giữa kỳ thử việc (ngày 60)\n- [ ] Đánh giá cuối kỳ thử việc (ngày 90)\n- [ ] Quyết định chuyển chính thức\n\n## 5. KPIs đo lường hiệu quả\n\n- **Time-to-Productivity:** Thời gian từ ngày bắt đầu đến khi deliver output có giá trị (<= 30 ngày)\n- **Onboarding Satisfaction Score:** >= 4.0/5 từ survey nhân viên mới\n- **Retention Rate (6 tháng):** >= 90%\n- **Completion Rate:** 100% nhân viên mới hoàn thành checklist đúng hạn\n\n## 6. Tài liệu liên quan\n\n- Culture & Values Handbook\n- Employee Benefits Guide\n- IT Security Policy\n- Team-specific playbook (xem thư mục phòng ban trên iWiki)`;
  }

  if (q.includes('báo cáo') || q.includes('report') || q.includes('weekly')) {
    return `# Báo cáo tuần — Sprint 24\n\n## 1. Tóm tắt tổng quan\n\nSprint 24 hoàn thành 85% story points cam kết (34/40 SP). Delivery đúng hạn cho 3 features chính. Có 1 blocker liên quan đến API gateway cần escalate.\n\n## 2. Việc đã hoàn thành\n\n- [x] Feature: Smart Search v2 — semantic search với AI ranking\n- [x] Feature: Rich Editor toolbar — bold, italic, heading, list\n- [x] Bug fix: Notification badge count incorrect\n- [x] Chore: Database migration cho pgvector\n\n## 3. Việc đang triển khai\n\n- [ ] Feature: AI Chatbot integration (70% done)\n- [ ] Feature: Custom Feed preferences UI (50% done)\n\n## 4. Blockers & Risks\n\n| Issue | Impact | Owner | Status |\n|-------|--------|-------|--------|\n| API Gateway rate limit | Block AI features | Backend Team | Escalated |\n| Design review delay | Delay UI polish | Design Team | In progress |\n\n## 5. Metrics\n\n- Sprint Velocity: 34 SP (target 40)\n- Bug Escape Rate: 2%\n- Code Review Turnaround: 4 hours avg\n\n## 6. Kế hoạch tuần tới\n\n- Hoàn thành AI Chatbot integration\n- Launch Custom Feed beta\n- Performance testing cho Search\n- Sprint Retrospective Friday 5pm`;
  }

  const topic = extractDocTitle(userMessage);
  return `# ${topic}\n\n## Giới thiệu\n\nTài liệu này được tạo tự động bởi iWiki AI dựa trên yêu cầu của bạn. Nội dung bên dưới là bản draft đầu tiên, bạn có thể chỉnh sửa trực tiếp trên editor.\n\n## Nội dung chính\n\nĐây là phần nội dung chính của tài liệu. Hãy bổ sung thông tin chi tiết theo nhu cầu của bạn.\n\n### Mục tiêu\n\n- Mục tiêu 1: Mô tả mục tiêu chính\n- Mục tiêu 2: Mô tả mục tiêu phụ\n\n### Chi tiết triển khai\n\nMô tả các bước triển khai cụ thể...\n\n## Kết luận\n\nTóm tắt lại các điểm chính và next steps.\n\n---\n\n*Tài liệu được tạo bởi iWiki AI. Vui lòng review và chỉnh sửa trước khi publish.*`;
}

function generateAIResponse(userMessage: string): string {
  const q = userMessage.toLowerCase();

  if (q.includes('đúc kết') || q.includes('tóm tắt') || q.includes('phân tích') || q.includes('distill') || q.includes('summarize')) {
    return `### 🧠 Kết quả Phân tích & Đúc kết Tri thức Nâng cao\n\nDựa trên dữ liệu bạn cung cấp, tôi đã thực hiện đúc kết các điểm cốt lõi với hệ thống tư duy đa chiều:\n\n**1. Tóm lược mục tiêu & Tầm nhìn:**\n- Tài liệu hướng đến việc tối ưu hóa quy trình vận hành và nâng cao tính minh bạch trong team.\n- Tập trung vào việc xây dựng "Single Source of Truth" cho toàn bộ tổ chức.\n\n**2. Các trụ cột kiến thức (Key Pillars):**\n- 🚀 **Hiệu suất (Performance):** Quy tắc 80/20 được áp dụng triệt để để tối ưu output.\n- 🤝 **Cộng tác (Collaboration):** Sự đồng bộ giữa các phòng ban thông qua hệ thống iWiki là yếu tố sống còn.\n- 🛠️ **Công cụ (Tooling):** Tận dụng tối đa AI và Automation để giảm thiểu human error.`;
  }

  if (q.includes('drive') || q.includes('notebook') || q.includes('import')) {
    const dataSource = q.includes('drive') ? 'Google Drive' : (q.includes('notebook') ? 'NotebookLM' : 'Dữ liệu nội bộ');
    return `### 📂 Tích hợp & Khai phá Dữ liệu: ${dataSource}\n\nTôi đã kết nối thành công và đang đồng bộ hóa tri thức từ nguồn **${dataSource}** của bạn.\n\n**Trạng thái xử lý tri thức:**\n- 🔄 Đang quét các tệp tin mới nhất.\n- ⚡ Đã phân loại được 15 tài liệu quan trọng.\n- 🧠 AI đang tiến hành "embedding" để sẵn sàng cho tra cứu sâu.`;
  }

  if (q.includes('nghỉ phép') || q.includes('xin phép') || q.includes('leave')) {
    return `Để xin nghỉ phép tại iKame, bạn cần thực hiện các bước sau:\n\n**1. Đăng ký trên hệ thống HRM**\n- Truy cập portal nhân sự và tạo request nghỉ phép\n- Cần đăng ký ít nhất 3 ngày làm việc trước (với phép > 3 ngày)\n\n**2. Thông báo cho Line Manager**\n- Ping Line Manager qua Slack để được duyệt nhanh hơn\n\n**3. Bàn giao công việc**\n- Cập nhật status các task trên Jira\n- Tag người hỗ trợ (backup person) trong thời gian vắng mặt\n\n💡 *Lưu ý: Nghỉ ốm đột xuất chỉ cần thông báo qua Slack và bổ sung request sau.*`;
  }

  if (q.includes('agenda') || q.includes('meeting') || q.includes('họp')) {
    return `Dưới đây là template **Meeting Agenda** cho Sprint Planning 1 giờ:\n\n---\n\n**📅 Sprint Planning — [Ngày/Tháng]**\nThời gian: 60 phút | Địa điểm: [Link/Phòng họp]\n\n**Agenda:**\n\n⚡ **0:00 - 0:05** — Check-in & Mục tiêu buổi họp\n\n📊 **0:05 - 0:20** — Review Sprint trước\n\n🎯 **0:20 - 0:45** — Sprint Planning\n\n✅ **0:45 - 0:55** — Q&A & Blockers\n\n📝 **0:55 - 1:00** — Wrap-up & Next steps`;
  }

  if (q.includes('checklist') || q.includes('onboarding') || q.includes('nhân viên mới')) {
    return `**📋 Onboarding Checklist — Nhân viên mới iKame**\n\n**Ngày đầu tiên:**\n- [ ] Nhận laptop + thiết bị từ IT\n- [ ] Setup email, Slack, Jira, HRM\n- [ ] Meeting với HR: ký hợp đồng\n- [ ] Lunch welcome với team\n\n**Tuần đầu tiên:**\n- [ ] 1-on-1 với Line Manager\n- [ ] Đọc Culture & Values\n- [ ] Shadow sessions với stakeholders`;
  }

  const responses = [
    `Tôi là iWiki AI, trợ lý tri thức nội bộ của iKame. Tôi có thể giúp bạn:\n\n- 🔍 **Tra cứu chính sách, quy trình** của iKame\n- ✍️ **Viết và soạn thảo** tài liệu, email, agenda\n- 📊 **Tóm tắt & Đúc kết** tài liệu dài một cách thông minh\n- 📂 **Kết nối** với Google Drive / NotebookLM để khai phá tri thức\n\nBạn cần hỗ trợ gì hôm nay?`,
    `Tôi đã hiểu yêu cầu của bạn. Dựa trên dữ liệu iWiki và các nguồn bạn đã kết nối, tôi có thể cung cấp phân tích sâu sắc hơn.\n\nBạn có muốn tôi thử **đúc kết các insight quan trọng nhất** bằng thuật toán suy luận mới không?`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

interface DocPanel {
  title: string;
  content: string;
}

export default function IWikiAI() {
  const { state, dispatch } = useApp();
  const { addToast } = useToast();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState('Auto');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [docPanel, setDocPanel] = useState<DocPanel | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isConversationStarted = messages.length > 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!isConversationStarted) {
      textareaRef.current?.focus();
    }
  }, [isConversationStarted]);

  const startNewChat = () => {
    setMessages([]);
    setSessionId(null);
    setInput('');
    setDocPanel(null);
    textareaRef.current?.focus();
  };

  const loadSession = (session: AIChatSession) => {
    setMessages(session.messages);
    setSessionId(session.id);
    setShowHistory(false);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    dispatch({ type: 'DELETE_AI_SESSION', sessionId: id });
    if (sessionId === id) startNewChat();
    addToast('Đã xóa dữ liệu hội thoại', 'info');
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const currentSessionId = sessionId || Date.now().toString();
    if (!sessionId) setSessionId(currentSessionId);

    const userMessage: AIChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 800));

    const isDoc = isDocRequest(content);
    let aiResponse: string;

    if (isDoc) {
      const docTitle = extractDocTitle(content);
      const docContent = generateDocContent(content);
      setDocPanel({ title: docTitle, content: docContent });
      aiResponse = `Tôi đã đọc đầy đủ tài liệu. Để có nội dung cho một bản ${docTitle} hoàn chỉnh, tôi sẽ tạo ngay bây giờ.\n\n✅ **Create Document** — Completed\n\nTài liệu **"${docTitle}"** đã được tạo và hiển thị trong editor bên phải. Bạn có thể chỉnh sửa trực tiếp, hoặc yêu cầu tôi cải thiện thêm.`;
    } else {
      const rag = generateRagAnswer(state.currentUser, state.articles, content);
      aiResponse = `${generateAIResponse(content)}\n\n---\n**RAG answer:** ${rag.answer}\n${rag.citations.length > 0
        ? rag.citations.map((c, i) => `\n[${i + 1}] ${c.title} (score ${c.score})`).join('')
        : '\nKhông có citation khả dụng trong scope hiện tại.'}`;
    }

    dispatch({
      type: 'TRACK_EVENT',
      event: {
        type: isDoc ? 'ai_write' : 'ai_search',
        userId: state.currentUser.id,
        query: content,
        meta: { isDoc },
      },
    });

    const assistantMessage: AIChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date().toISOString()
    };

    const finalMessages = [...newMessages, assistantMessage];
    setMessages(finalMessages);
    setIsTyping(false);

    dispatch({
      type: 'SAVE_AI_SESSION',
      session: {
        id: currentSessionId,
        topic: content.trim().slice(0, 40) + (content.length > 40 ? '...' : ''),
        messages: finalMessages,
        updatedAt: new Date().toISOString()
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  const clearChat = () => {
    startNewChat();
    addToast('Bắt đầu cuộc trò chuyện mới', 'info');
  };

  const filteredHistory = state.aiHistory.filter(s =>
    s.topic.toLowerCase().includes(historySearch.toLowerCase()) ||
    s.messages.some(m => m.content.toLowerCase().includes(historySearch.toLowerCase()))
  );

  const renderMarkdown = (text: string) => {
    return text
      .replace(/### ([^\n]+)/g, '<h3 class="text-base font-bold text-gray-900 mt-5 border-b border-gray-200 pb-1 mb-3">$1</h3>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em class="italic text-gray-500">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-mono font-bold">$1</code>')
      .replace(/✅/g, '<span class="inline-flex items-center justify-center w-5 h-5 bg-green-100 rounded-full text-green-600 text-xs mr-1">✓</span>')
      .replace(/- \[ \] ([^\n]+)/g, '<div class="flex items-start gap-2.5 my-2"><div class="w-4 h-4 border-2 border-orange-200 rounded-md mt-0.5 shrink-0"></div><span class="text-sm text-gray-600">$1</span></div>')
      .replace(/- \[x\] ([^\n]+)/g, '<div class="flex items-start gap-2.5 my-2"><div class="w-4 h-4 bg-orange-500 border-2 border-orange-500 rounded-md mt-0.5 shrink-0 flex items-center justify-center text-white"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4"><polyline points="20 6 9 17 4 12"/></svg></div><span class="text-sm line-through text-gray-400">$1</span></div>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="flex h-full bg-white text-gray-900 relative overflow-hidden">
      {/* History Sidebar */}
      {showHistory && (
        <div className="w-80 border-r border-gray-100 flex flex-col bg-gray-50/50 animate-fade-in animate-slide-right z-20">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
            <span className="font-bold text-sm flex items-center gap-2">
              <Database size={14} className="text-gray-400" />
              Lịch sử trò chuyện
            </span>
            <button onClick={() => setShowHistory(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600">
              <ChevronDown size={18} className="rotate-90" />
            </button>
          </div>
          <div className="p-3">
            <div className="relative group">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
              <input type="text" placeholder="Tìm kiếm hội thoại..." value={historySearch} onChange={(e) => setHistorySearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-100 focus:border-orange-200 transition-all outline-none" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-10 px-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3"><MessageSquare size={20} className="text-gray-300" /></div>
                <p className="text-xs text-gray-400">{historySearch ? 'Không tìm thấy kết quả' : 'Chưa có lịch sử trò chuyện'}</p>
              </div>
            ) : (
              filteredHistory.map((session) => (
                <div key={session.id} onClick={() => loadSession(session)}
                  className={`group relative w-full p-3 text-left rounded-xl transition-all duration-200 cursor-pointer border ${sessionId === session.id ? 'bg-white border-orange-100 shadow-sm ring-1 ring-orange-50' : 'border-transparent hover:bg-gray-100 text-gray-600'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare size={14} className={sessionId === session.id ? "text-orange-500" : "text-gray-400"} />
                    <span className="text-xs font-bold truncate flex-1 leading-tight">{session.topic}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-gray-400 font-medium">{new Date(session.updatedAt).toLocaleDateString()}</span>
                    <span className="text-[10px] text-gray-300 tabular-nums">{session.messages.length} messages</span>
                  </div>
                  <button onClick={(e) => deleteSession(e, session.id)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="p-3 border-t border-gray-100 bg-white/50 backdrop-blur-md">
            <button onClick={clearChat} className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-200 active:scale-[0.98]">
              <Plus size={16} /> Trò chuyện mới
            </button>
          </div>
        </div>
      )}

      {/* Chat Panel */}
      <div className={`flex flex-col min-h-0 bg-white relative ${docPanel ? 'w-[480px] shrink-0 border-r border-gray-100' : 'flex-1'}`}>
        {/* Header */}
        <div className="shrink-0 px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-white shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowHistory(!showHistory)}
              className={`p-2 rounded-lg transition-all duration-200 ${showHistory ? 'bg-orange-50 text-orange-500' : 'text-gray-500 hover:bg-gray-100'}`}
              title="Lịch sử trò chuyện">
              <Database size={18} />
            </button>
            <div className="h-4 w-px bg-gray-200 mx-0.5" />
            <div className="flex items-center gap-2 text-sm font-bold text-gray-800 tracking-tight">
              <Sparkles size={16} className="text-orange-500 animate-pulse" />
              iWiki AI <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded-md font-mono ml-1 uppercase">Beta</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isConversationStarted && (
              <button onClick={clearChat} className="px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all active:scale-95 flex items-center gap-1.5 text-xs font-bold border border-gray-100 shadow-sm">
                <Plus size={14} /> New
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {!isConversationStarted ? (
            <div className="flex flex-col items-center justify-center p-6 max-w-3xl mx-auto w-full pt-16">
              <div className="mb-8 relative animate-float">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full blur-2xl opacity-20" />
                <div className="relative bg-white p-5 rounded-full shadow-lg border border-gray-100 ring-4 ring-gray-50">
                  <Sparkles size={44} className="text-gray-800" strokeWidth={1.5} />
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2 text-center text-gray-900 animate-slide-up">Xin chào, {state.currentUser.name.split(' ').pop()}!</h1>
              <p className="text-gray-400 text-sm mb-10 animate-slide-up stagger-1">iWiki AI — Trợ lý tri thức nội bộ iKame</p>

              <div className="w-full mb-8 animate-slide-up stagger-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                    <Database size={14} className="text-orange-500" /> Kết nối & Nhập liệu
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {DATA_CONNECTORS.map((conn) => (
                    <button key={conn.id} onClick={() => { setInput(`Hãy giúp tôi đúc kết dữ liệu từ ${conn.name}...`); sendMessage(`Hãy giúp tôi đúc kết dữ liệu từ ${conn.name}...`); }}
                      className="flex flex-col p-4 bg-white border border-gray-100 rounded-2xl hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 group text-left relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-orange-100/20 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className={`mb-3 p-2 w-fit rounded-xl bg-gray-50 ${conn.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}><conn.icon size={20} /></div>
                      <span className="text-sm font-bold text-gray-900 mb-1 flex items-center justify-between">
                        {conn.name}
                        <ExternalLink size={12} className="opacity-0 group-hover:opacity-40 transition-opacity" />
                      </span>
                      <span className="text-[11px] text-gray-400">{conn.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full mb-12 animate-slide-up stagger-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Gợi ý câu hỏi</h3>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {STARTER_CARDS.map((card, index) => {
                    const Icon = card.icon;
                    return (
                      <button key={index} onClick={() => { setInput(card.prompt); textareaRef.current?.focus(); }}
                        className={`flex flex-col items-start p-4 bg-gradient-to-br ${card.gradient} border border-gray-200/60 rounded-xl hover:shadow-md hover:border-gray-300/80 transition-all duration-300 text-left group h-full hover:-translate-y-1 animate-slide-up`}>
                        <div className="mb-3 p-2 bg-white rounded-lg text-gray-600 group-hover:shadow-md transition-all duration-300 group-hover:scale-110"><Icon size={18} /></div>
                        <span className="text-sm font-semibold text-gray-900 mb-0.5 line-clamp-1">{card.title}</span>
                        <span className="text-xs text-gray-500 line-clamp-2">{card.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className={`mx-auto w-full px-4 py-8 space-y-6 ${docPanel ? 'max-w-none' : 'max-w-4xl'}`}>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 animate-slide-up ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {msg.role === 'assistant' ? (
                    <div className="w-8 h-8 rounded-xl bg-gray-900 flex items-center justify-center shrink-0 shadow-lg mt-1">
                      <Sparkles size={14} className="text-orange-400" />
                    </div>
                  ) : (
                    <img src={state.currentUser.avatar} alt="Me" className="w-8 h-8 rounded-xl ring-2 ring-orange-100 shadow-sm shrink-0 mt-1" referrerPolicy="no-referrer" />
                  )}
                  <div className={`max-w-[90%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-tr-sm shadow-md' : 'bg-gray-50 border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm'}`}>
                    <div className="text-[14px] leading-relaxed whitespace-pre-wrap prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
                    <div className={`text-[10px] mt-2 font-medium uppercase tracking-wider ${msg.role === 'user' ? 'text-white/40 text-right' : 'text-gray-300'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 animate-slide-up">
                  <div className="w-8 h-8 rounded-xl bg-gray-900 flex items-center justify-center shrink-0 shadow-lg">
                    <Sparkles size={14} className="text-orange-400" />
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-1.5 px-1 py-1">
                      <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className={`${isConversationStarted ? 'border-t border-gray-100' : ''} p-3 bg-white overflow-visible`}>
          <div className={`w-full relative group overflow-visible ${!isConversationStarted ? 'max-w-3xl mx-auto' : ''}`}>
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-400/20 via-amber-400/10 to-purple-500/20 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-gray-50 border border-gray-200 rounded-2xl shadow-sm overflow-visible transition-all duration-300 hover:shadow-md focus-within:shadow-xl focus-within:border-orange-200 focus-within:bg-white ring-offset-2 focus-within:ring-2 ring-orange-100">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Hỏi AI, đúc kết tri thức hoặc import dữ liệu..."
                className="w-full p-4 pb-2 bg-transparent border-none focus:ring-0 resize-none text-[14px] placeholder:text-gray-400 min-h-[52px] outline-none"
                rows={2}
              />
              <div className="px-3 pb-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all duration-200 active:scale-90" title="Đính kèm file"><Plus size={18} /></button>
                  <div className="h-4 w-px bg-gray-200 mx-0.5" />
                  <div className="relative">
                    <button onClick={() => setShowModelDropdown(!showModelDropdown)} className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm">
                      <Zap size={11} className="text-orange-500" />
                      {selectedModel}
                      <ChevronDown size={11} className={`transition-transform duration-200 text-gray-400 ${showModelDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showModelDropdown && (
                      <div className="absolute bottom-full left-0 mb-2 w-52 max-h-[280px] flex flex-col bg-white border border-gray-200 rounded-xl shadow-2xl z-[100] py-1 animate-scale-in">
                        <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 shrink-0">Mô hình AI</div>
                        <div className="overflow-y-auto overflow-x-hidden min-h-0 py-1">
                        {MODELS.map((model) => (
                          <button key={model.id} onClick={() => { setSelectedModel(model.name); setShowModelDropdown(false); }} className="w-full px-3 py-2 text-left flex items-center justify-between hover:bg-gray-50 transition-all duration-150">
                            <span className="text-xs font-medium text-gray-700 flex items-center gap-2">
                              <div className={`p-1 rounded-md ${selectedModel === model.name ? 'bg-orange-50' : 'bg-gray-50'}`}>
                                <Zap size={11} className={selectedModel === model.name ? "text-orange-500" : "text-gray-400"} />
                              </div>
                              {model.name}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {model.badge && <span className="text-[9px] font-black px-1.5 py-0.5 bg-orange-100 text-orange-600 rounded-full tracking-tighter uppercase">{model.badge}</span>}
                              {selectedModel === model.name && <Check size={12} className="text-orange-500" />}
                            </div>
                          </button>
                        ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <button onClick={() => sendMessage(input)} disabled={!input.trim() || isTyping}
                  className={`p-2 rounded-xl transition-all duration-200 ${input.trim() && !isTyping ? 'bg-gray-900 text-white shadow-lg hover:bg-black active:scale-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                  <ArrowUp size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
          <div className="mt-2 text-center text-[10px] text-gray-400 font-medium tracking-wide flex items-center justify-center gap-1">
            <Sparkles size={10} /> iWiki AI · Powered by Gemini 1.5 Pro & iKame Intelligence
          </div>
        </div>
      </div>

      {/* Document Editor Panel */}
      {docPanel && (
        <div className="flex-1 min-w-0 animate-fade-in">
          <AIDocEditor
            title={docPanel.title}
            content={docPanel.content}
            onClose={() => setDocPanel(null)}
            onSave={(title, content) => {
              addToast(`Đã lưu "${title}"`, 'success');
            }}
          />
        </div>
      )}

      {/* Toggle doc panel hint when no panel is open but conversation has doc */}
      {!docPanel && isConversationStarted && messages.some(m => m.role === 'assistant' && m.content.includes('Create Document')) && (
        <button
          onClick={() => {
            const lastDoc = messages.filter(m => m.role === 'user').pop();
            if (lastDoc) {
              const title = extractDocTitle(lastDoc.content);
              const content = generateDocContent(lastDoc.content);
              setDocPanel({ title, content });
            }
          }}
          className="fixed bottom-20 right-6 z-30 flex items-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-xl shadow-xl hover:bg-black transition-all text-sm font-bold active:scale-95"
          title="Mở lại editor"
        >
          <PanelRightOpen size={18} />
          Mở Editor
        </button>
      )}
    </div>
  );
}
