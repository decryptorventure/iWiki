import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, ArrowUp, ChevronDown, Plus, Globe, FileText, Image, MessageSquare, Zap, Check, User, Trash2, BookOpen, Search, ExternalLink, Database } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../App';
import { AIChatMessage, AIChatSession } from '../store/useAppStore';

const STARTER_CARDS = [
  { icon: Sparkles, title: "Tra cứu chính sách nghỉ phép", desc: "Hỏi AI về quy trình xin phép", prompt: "Quy trình xin nghỉ phép tại iKame như thế nào?", gradient: 'from-orange-500/10 to-amber-500/10' },
  { icon: FileText, title: "Viết meeting agenda", desc: "Tạo agenda cho buổi họp", prompt: "Viết meeting agenda cho buổi sprint planning 1 giờ", gradient: 'from-blue-500/10 to-indigo-500/10' },
  { icon: Image, title: "Tóm tắt tài liệu", desc: "Tóm gọn nội dung dài", prompt: "Hãy hướng dẫn tôi cách viết một tài liệu kỹ thuật tốt", gradient: 'from-purple-500/10 to-pink-500/10' },
  { icon: MessageSquare, title: "Onboarding checklist", desc: "Checklist cho nhân viên mới", prompt: "Tạo checklist onboarding cho nhân viên mới tại iKame", gradient: 'from-green-500/10 to-emerald-500/10' },
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

// Simple mock AI responses based on context
function generateAIResponse(userMessage: string): string {
  const q = userMessage.toLowerCase();

  // Smart Knowledge Distillation handling
  if (q.includes('đúc kết') || q.includes('tóm tắt') || q.includes('phân tích') || q.includes('distill') || q.includes('summarize')) {
    return `### 🧠 Kết quả Phân tích & Đúc kết Tri thức Nâng cao\n\nDựa trên dữ liệu bạn cung cấp, tôi đã thực hiện đúc kết các điểm cốt lõi với hệ thống tư duy đa chiều:\n\n**1. Tóm lược mục tiêu & Tầm nhìn:**\n- Tài liệu hướng đến việc tối ưu hóa quy trình vận hành và nâng cao tính minh bạch trong team.\n- Tập trung vào việc xây dựng "Single Source of Truth" cho toàn bộ tổ chức.\n\n**2. Các trụ cột kiến thức (Key Pillars):**\n- 🚀 **Hiệu suất (Performance):** Quy tắc 80/20 được áp dụng triệt để để tối ưu output. Tập trung vào 20% công việc tạo ra 80% giá trị.\n- 🤝 **Cộng tác (Collaboration):** Sự đồng bộ giữa các phòng ban thông qua hệ thống iWiki là yếu tố sống còn.\n- 🛠️ **Công cụ (Tooling):** Tận dụng tối đa AI và Automation để giảm thiểu human error trong các task lặp lại.\n\n**3. Đánh giá chuyên sâu (AI Strategic Insights):**\n- *Khoảng trống tri thức:* Hiện tại chưa có quy trình xử lý khủng hoảng truyền thông nội bộ rõ ràng.\n- *Rủi ro tiềm ẩn:* Sự phụ thuộc quá lớn vào một số key members có thể tạo ra "bus factor" thấp.\n- *Cơ hội đột phá:* Có thể tích hợp thêm các mẫu template AI-ready để tăng tốc quá trình soạn thảo tài liệu thêm 50%.\n\n**4. Bản đồ hành động thực thi (Actionable Roadmap):**\n- [ ] Thiết lập buổi Workshop chuyên sâu về "Knowledge Sharing Culture" trong tuần tới.\n- [x] Cấu trúc lại thư mục "Company Policy" trên iWiki để dễ dàng tra cứu hơn.\n- [ ] Thử nghiệm bộ công cụ AI mới để tự động hóa việc tóm tắt các buổi họp hàng ngày.\n\n*Tôi có thể chuyển đổi toàn bộ insight này thành một biểu đồ Mindmap hoặc bảng so sánh chi tiết cho bạn không?*`;
  }

  if (q.includes('drive') || q.includes('notebook') || q.includes('import')) {
    const dataSource = q.includes('drive') ? 'Google Drive' : (q.includes('notebook') ? 'NotebookLM' : 'Dữ liệu nội bộ');
    return `### 📂 Tích hợp & Khai phá Dữ liệu: ${dataSource}\n\nTôi đã kết nối thành công và đang đồng bộ hóa tri thức từ nguồn **${dataSource}** của bạn.\n\n**Trạng thái xử lý tri thức:**\n- 🔄 Đang quét các tệp tin mới nhất trong thư mục "iKame Project Specs".\n- ⚡ Đã phân loại được 15 tài liệu quan trọng và 8 bảng tính liên quan đến ngân sách.\n- 🧠 AI đang tiến hành "embedding" để sẵn sàng cho các câu hỏi tra cứu sâu.\n\n**Bạn có thể yêu cầu tôi thực hiện các "Smart Actions" sau:**\n1. **Cross-Reference:** So sánh specs mới từ Drive với codebase thực tế trên iWiki.\n2. **Knowledge Synthesis:** Tổng hợp tất cả các ghi chú rời rạc từ NotebookLM thành một tài liệu quy trình hoàn chỉnh.\n3. **Query Engine:** Đặt bất kỳ câu hỏi nào, tôi sẽ truy xuất thông tin chính xác từ hàng ngàn trang tài liệu vừa import.\n\n*Gợi ý: "Hãy tìm các điểm mâu thuẫn giữa file Specs A và Specs B vừa import"*`;
  }

  if (q.includes('nghỉ phép') || q.includes('xin phép') || q.includes('leave')) {
    return `Để xin nghỉ phép tại iKame, bạn cần thực hiện các bước sau:\n\n**1. Đăng ký trên hệ thống HRM**\n- Truy cập portal nhân sự và tạo request nghỉ phép\n- Cần đăng ký ít nhất 3 ngày làm việc trước (với phép > 3 ngày)\n\n**2. Thông báo cho Line Manager**\n- Ping Line Manager qua Slack để được duyệt nhanh hơn\n\n**3. Bàn giao công việc**\n- Cập nhật status các task trên Jira\n- Tag người hỗ trợ (backup person) trong thời gian vắng mặt\n\n💡 *Lưu ý: Nghỉ ốm đột xuất chỉ cần thông báo qua Slack và bổ sung request sau.*`;
  }

  if (q.includes('agenda') || q.includes('meeting') || q.includes('họp')) {
    return `Dưới đây là template **Meeting Agenda** cho Sprint Planning 1 giờ:\n\n---\n\n**📅 Sprint Planning — [Ngày/Tháng]**\nThời gian: 60 phút | Địa điểm: [Link/Phòng họp]\n\n**Agenda:**\n\n⚡ **0:00 - 0:05** — Check-in & Mục tiêu buổi họp\n\n📊 **0:05 - 0:20** — Review Sprint trước\n- Những gì đã hoàn thành?\n- Các task chưa xong, lý do?\n- Velocity actual vs planned\n\n🎯 **0:20 - 0:45** — Sprint Planning\n- Review Product Backlog\n- Team estimate story points\n- Chọn tasks cho sprint mới\n- Xác nhận Sprint Goal\n\n✅ **0:45 - 0:55** — Q&A & Blockers\n\n📝 **0:55 - 1:00** — Wrap-up & Next steps\n\n---\n*Bạn muốn tôi điều chỉnh thời gian hoặc thêm agenda items không?*`;
  }

  if (q.includes('checklist') || q.includes('onboarding') || q.includes('nhân viên mới')) {
    return `**📋 Onboarding Checklist — Nhân viên mới iKame**\n\n**Ngày đầu tiên:**\n- [ ] Nhận laptop + thiết bị từ IT\n- [ ] Setup email, Slack, Jira, HRM\n- [ ] Meeting với HR: ký hợp đồng\n- [ ] Lunch welcome với team\n- [ ] Tour văn phòng\n\n**Tuần đầu tiên:**\n- [ ] 1-on-1 với Line Manager: roadmap 30-60-90 ngày\n- [ ] Đọc Culture & Values\n- [ ] Join các Slack channels liên quan\n- [ ] Shadow sessions với stakeholders\n- [ ] Attend sprint planning đầu tiên\n\n**Tuần 2-4:**\n- [ ] Complete domain knowledge deep dive\n- [ ] Thực hiện task nhỏ đầu tiên\n- [ ] Check-in với HR: feedback sau 30 ngày\n\n💡 *Bảng checklist này dựa trên quy trình hiện tại của iKame. Bạn có thể tùy chỉnh theo team.*`;
  }

  // Generic responses
  const responses = [
    `Tôi là iWiki AI, trợ lý tri thức nội bộ của iKame. Tôi có thể giúp bạn:\n\n- 🔍 **Tra cứu chính sách, quy trình** của iKame\n- ✍️ **Viết và soạn thảo** tài liệu, email, agenda\n- 📊 **Tóm tắt & Đúc kết** tài liệu dài một cách thông minh\n- 📂 **Kết nối** với Google Drive / NotebookLM để khai phá tri thức\n\nBạn cần hỗ trợ gì hôm nay?`,
    `Tôi đã hiểu yêu cầu của bạn. Dựa trên dữ liệu iWiki và các nguồn bạn đã kết nối, tôi có thể cung cấp phân tích sâu sắc hơn.\n\nBạn có muốn tôi thử **đúc kết các insight quan trọng nhất** bằng thuật toán suy luận mới không?`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
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

    // Simulate AI thinking delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 800));

    const aiResponse = generateAIResponse(content);
    const assistantMessage: AIChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date().toISOString()
    };

    const finalMessages = [...newMessages, assistantMessage];
    setMessages(finalMessages);
    setIsTyping(false);

    // Save to store
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
              <input
                type="text"
                placeholder="Tìm kiếm hội thoại..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-100 focus:border-orange-200 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-10 px-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageSquare size={20} className="text-gray-300" />
                </div>
                <p className="text-xs text-gray-400">
                  {historySearch ? 'Không tìm thấy kết quả' : 'Chưa có lịch sử trò chuyện'}
                </p>
              </div>
            ) : (
              filteredHistory.map((session) => (
                <div
                  key={session.id}
                  onClick={() => loadSession(session)}
                  className={`group relative w-full p-3 text-left rounded-xl transition-all duration-200 cursor-pointer border ${sessionId === session.id ? 'bg-white border-orange-100 shadow-sm ring-1 ring-orange-50' : 'border-transparent hover:bg-gray-100 text-gray-600'}`}
                >
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

      <div className="flex-1 flex flex-col h-full bg-white relative">
        {/* Header content */}
        <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between bg-white z-10 shadow-sm">
          <div className="flex items-center gap-3">
             <button
              onClick={() => setShowHistory(!showHistory)}
              className={`p-2 rounded-lg transition-all duration-200 ${showHistory ? 'bg-orange-50 text-orange-500' : 'text-gray-500 hover:bg-gray-100'}`}
              title="Lịch sử trò chuyện"
            >
              <Database size={20} />
            </button>
            <div className="h-4 w-px bg-gray-200 mx-1"></div>
            <div className="flex items-center gap-2 text-sm font-bold text-gray-800 tracking-tight">
              <Sparkles size={18} className="text-orange-500 animate-pulse" />
              iWiki AI <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded-md font-mono ml-1 uppercase">Beta</span>
            </div>
          </div>
          {isConversationStarted && (
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${i+10}`} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="h-4 w-px bg-gray-200 mx-1"></div>
              <button onClick={clearChat} className="px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all active:scale-95 flex items-center gap-2 text-xs font-bold border border-gray-100 shadow-sm">
                <Plus size={14} /> New Chat
              </button>
            </div>
          )}
        </div>

        {/* Landing / Messages Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {!isConversationStarted ? (
            /* Landing Screen */
            <div className="flex flex-col items-center justify-center p-6 max-w-3xl mx-auto w-full pt-16">
              <div className="mb-8 relative animate-float">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full blur-2xl opacity-20"></div>
                <div className="relative bg-white p-5 rounded-full shadow-lg border border-gray-100 ring-4 ring-gray-50">
                  <Sparkles size={44} className="text-gray-800" strokeWidth={1.5} />
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2 text-center text-gray-900 animate-slide-up">Xin chào, {state.currentUser.name.split(' ').pop()}!</h1>
              <p className="text-gray-400 text-sm mb-10 animate-slide-up stagger-1">iWiki AI — Trợ lý tri thức nội bộ iKame</p>

              {/* Landing UI: Data Connectors */}
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

              {/* Landing UI: Starter Cards */}
              <div className="w-full mb-12 animate-slide-up stagger-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Gợi ý câu hỏi</h3>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {STARTER_CARDS.map((card, index) => {
                    const Icon = card.icon;
                    return (
                      <button key={index} onClick={() => { setInput(card.prompt); textareaRef.current?.focus(); }}
                        className={`flex flex-col items-start p-4 bg-gradient-to-br ${card.gradient} border border-gray-200/60 rounded-xl hover:shadow-md hover:border-gray-300/80 transition-all duration-300 text-left group h-full hover:-translate-y-1 animate-slide-up `}>
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
            /* Chat Messages */
            <div className="max-w-4xl mx-auto w-full px-4 py-8 space-y-8">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 animate-slide-up ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {msg.role === 'assistant' ? (
                    <div className="w-9 h-9 rounded-xl bg-gray-900 flex items-center justify-center shrink-0 shadow-lg mt-1">
                      <Sparkles size={18} className="text-orange-400" />
                    </div>
                  ) : (
                    <img src={state.currentUser.avatar} alt="Me" className="w-9 h-9 rounded-xl ring-2 ring-orange-100 shadow-sm shrink-0 mt-1" referrerPolicy="no-referrer" />
                  )}
                  <div className={`max-w-[85%] rounded-2xl px-5 py-4 ${msg.role === 'user' ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-tr-sm shadow-md' : 'bg-gray-50 border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm'}`}>
                    <div className="text-[15px] leading-relaxed whitespace-pre-wrap distillation-container prose prose-sm max-w-none" dangerouslySetInnerHTML={{
                      __html: msg.content
                        .replace(/### ([^\n]+)/g, '<h3 class="text-base font-bold text-gray-900 mt-5 border-b border-gray-200 pb-1 mb-3">$1</h3>')
                        .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
                        .replace(/\*([^*]+)\*/g, '<em class="italic text-gray-500">$1</em>')
                        .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-mono font-bold">$1</code>')
                        .replace(/- \[ \] ([^\n]+)/g, '<div class="flex items-start gap-2.5 my-2"><div class="w-4.5 h-4.5 border-2 border-orange-200 rounded-md mt-0.5 flex-shrink-0"></div><span class="text-sm text-gray-600">$1</span></div>')
                        .replace(/- \[x\] ([^\n]+)/g, '<div class="flex items-start gap-2.5 my-2"><div class="w-4.5 h-4.5 bg-orange-500 border-2 border-orange-500 rounded-md mt-0.5 flex items-center justify-center flex-shrink-0 text-white"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div><span class="text-sm line-through text-gray-400">$1</span></div>')
                        .replace(/\n/g, '<br/>')
                    }} />
                    <div className={`text-[10px] mt-3 font-medium uppercase tracking-wider ${msg.role === 'user' ? 'text-white/40 text-right' : 'text-gray-300'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-4 animate-slide-up">
                  <div className="w-9 h-9 rounded-xl bg-gray-900 flex items-center justify-center shrink-0 shadow-lg">
                    <Sparkles size={18} className="text-orange-400" />
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm">
                    <div className="flex items-center gap-1.5 px-1 py-1">
                      <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className={`${isConversationStarted ? 'border-t border-gray-100' : ''} p-4 bg-white`}>
          <div className={`w-full relative group ${!isConversationStarted ? 'max-w-3xl mx-auto' : ''}`}>
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-400/20 via-amber-400/10 to-purple-500/20 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-gray-50 border border-gray-200 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md focus-within:shadow-xl focus-within:border-orange-200 focus-within:bg-white ring-offset-2 focus-within:ring-2 ring-orange-100">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Hỏi AI, đúc kết tri thức hoặc import dữ liệu..."
                className="w-full p-4 pb-2 bg-transparent border-none focus:ring-0 resize-none text-[15px] placeholder:text-gray-400 min-h-[60px] outline-none"
                rows={2}
              />
              <div className="px-4 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all duration-200 active:scale-90" title="Đính kèm file"><Plus size={20} /></button>
                  <div className="h-4 w-px bg-gray-200 mx-1"></div>
                  <div className="relative">
                    <button onClick={() => setShowModelDropdown(!showModelDropdown)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm group/btn">
                      <Zap size={12} className="text-orange-500" />
                      {selectedModel}
                      <ChevronDown size={12} className={`transition-transform duration-200 text-gray-400 ${showModelDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showModelDropdown && (
                      <div className="absolute bottom-full left-0 mb-2 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden py-1 animate-scale-in">
                        <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-1">Mô hình AI</div>
                        {MODELS.map((model) => (
                          <button key={model.id} onClick={() => { setSelectedModel(model.name); setShowModelDropdown(false); }} className="w-full px-3 py-2.5 text-left flex items-center justify-between hover:bg-gray-50 transition-all duration-150">
                            <span className="text-sm font-medium text-gray-700 flex items-center gap-2.5">
                              <div className={`p-1 rounded-md ${selectedModel === model.name ? 'bg-orange-50' : 'bg-gray-50'}`}>
                                <Zap size={13} className={selectedModel === model.name ? "text-orange-500" : "text-gray-400"} />
                              </div>
                              {model.name}
                            </span>
                            <div className="flex items-center gap-2">
                              {model.badge && <span className="text-[9px] font-black px-1.5 py-0.5 bg-orange-100 text-orange-600 rounded-full tracking-tighter uppercase">{model.badge}</span>}
                              {selectedModel === model.name && <Check size={14} className="text-orange-500" />}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <button onClick={() => sendMessage(input)} disabled={!input.trim() || isTyping}
                  className={`p-2.5 rounded-xl transition-all duration-200 ${input.trim() && !isTyping ? 'bg-gray-900 text-white shadow-lg hover:bg-black active:scale-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                  <ArrowUp size={20} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
          <div className="mt-3 text-center text-[10px] text-gray-400 font-medium tracking-wide flex items-center justify-center gap-1">
            <Sparkles size={10} /> iWiki AI - Powered by Gemini 1.5 Pro & iKame Intelligence
          </div>
        </div>
      </div>
    </div>
  );
}
