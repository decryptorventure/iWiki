import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Sparkles, AlignLeft, Type, Table, Languages, ArrowLeft, Save, Send, Folder, Tag, Shield, Globe, Lock, X, Check, Bold, Italic, List, Heading, FileText, ChevronDown, MessageSquare, ArrowUp, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../App';
import { Article } from '../store/useAppStore';
import { can } from '../lib/permissions';
import { NotionEditor } from '../tiptap/notion-like-editor';

const AUTOSAVE_KEY = 'iwiki_editor_autosave';

type EditorAIMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
};

export default function Editor({ initialData, onBack }: { initialData?: Partial<Article> | null, onBack?: () => void }) {
  const { state, dispatch } = useApp();
  const { addToast } = useToast();
  const { folders, currentUser } = state;

  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [showAiMenu, setShowAiMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [isStreaming, setIsStreaming] = useState(false);
  const [ghostText, setGhostText] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const autosaveTimer = useRef<any>(null);



  // Publish Modal State
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState(initialData?.folderId || '');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [viewPermission, setViewPermission] = useState<'public' | 'restricted'>(initialData?.viewPermission || 'public');
  const [allowComments, setAllowComments] = useState(initialData?.allowComments ?? true);
  const [isPublishing, setIsPublishing] = useState(false);

  const isEditing = !!initialData?.id;
  const [showTemplates, setShowTemplates] = useState(false);
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);
  const [aiCitations, setAiCitations] = useState<string[]>([]);

  // Editor AI mode (chat panel)
  const [aiMode, setAiMode] = useState(false);
  const [collabMode, setCollabMode] = useState(true);
  const [aiMessages, setAiMessages] = useState<EditorAIMessage[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [aiIsTyping, setAiIsTyping] = useState(false);
  const aiMessagesEndRef = useRef<HTMLDivElement | null>(null);
  const aiTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const headings = useMemo(() => {
    return content
      .split('\n')
      .map((line, index) => {
        const match = line.match(/^(#{1,3})\s+(.*)/);
        if (!match) return null;
        const level = match[1].length;
        const text = match[2].trim();
        return { id: `${index}-${level}`, level, text };
      })
      .filter(Boolean) as { id: string; level: number; text: string }[];
  }, [content]);

  const templates = [
    {
      id: 't1',
      title: 'Biên bản họp (Meeting Minutes)',
      description: 'Ghi lại nhanh nội dung, quyết định và action items sau mỗi cuộc họp.',
      content:
        '# Meeting Minutes\n\n## 1. Thông tin chung\n- **Thời gian:** \n- **Địa điểm:** \n- **Thành phần tham gia:** \n\n## 2. Nội dung chính thảo luận\n- \n- \n\n## 3. Action Items\n| Việc cần làm | Người phụ trách | Deadline | Trạng thái |\n|---|---|---|---|\n| | | | |\n',
    },
    {
      id: 't2',
      title: 'SOP / Quy trình chuẩn',
      description: 'Chuẩn hóa quy trình vận hành, dễ theo dõi – phù hợp để share cho toàn team.',
      content:
        '# Quy trình [Tên quy trình]\n\n## 1. Mục đích\nQuy trình này nhằm...\n\n## 2. Phạm vi áp dụng\nÁp dụng cho bộ phận/cá nhân...\n\n## 3. Định nghĩa & Viết tắt\n- \n\n## 4. Nội dung chi tiết quy trình\n### Bước 1: [Tên bước]\n- **Người thực hiện:** \n- **Mô tả:** \n\n### Bước 2: ...\n',
    },
    {
      id: 't3',
      title: 'Weekly Report',
      description: 'Tổng hợp nhanh công việc đã làm, tiến độ OKR/KPI và kế hoạch tuần tới.',
      content:
        '# Báo cáo tuần [Số tuần/Tháng]\n\n## 1. Những việc đã hoàn thành\n- \n- \n\n## 2. OKRs / KPIs Progress\n- Mục tiêu 1: [Tiến độ %]\n- Mục tiêu 2: [Tiến độ %]\n\n## 3. Khó khăn & Blocker (Nếu có)\n- \n\n## 4. Kế hoạch tuần tới\n- \n',
    },
  ];

  const handleApplyTemplate = (templateContent: string) => {
    setContent(templateContent);
    // Note: NotionEditor uses Hocuspocus/Yjs, so initial push might be needed
    // or we just trust setContent if it trickles down. 
    setShowTemplates(false);
    addToast('Đã áp dụng mẫu thành công', 'success');
  };

  // Flat folder list for select
  const allFolders = folders.flatMap(f => [f, ...(f.children || [])]);

  useEffect(() => {
    // Load autosave if no initialData
    if (!isEditing) {
      const saved = localStorage.getItem(AUTOSAVE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.title || parsed.content) {
            setTitle(parsed.title || '');
            setContent(parsed.content || '');
          }
        } catch { }
      }
    }
  }, []);

  // Autosave every 2s
  useEffect(() => {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      if (title || content) {
        localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({ title, content }));
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      }
    }, 2000);
    return () => clearTimeout(autosaveTimer.current);
  }, [title, content]);

  // handleInput used for textarea is replaced by tiptapEditor's onUpdate
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {};

  const handleAiAction = (action: string) => {
    setShowAiMenu(false);
    
    setIsStreaming(true);

    const streamMap: Record<string, string[]> = {
      summarize: ['Đang tóm tắt...', '**Tóm tắt:**\n', '**Tóm tắt:**\nBài viết trình bày 3 điểm chính:\n', '**Tóm tắt:**\nBài viết trình bày 3 điểm chính:\n1. Nội dung chính\n2. Quy trình thực hiện\n3. Lưu ý quan trọng\n\n[Nguồn AI: Internal Knowledge Base]\n'],
      rewrite: ['Đang viết lại...', 'Đây là phiên bản được viết lại rõ ràng hơn:\n\n', 'Đây là phiên bản được viết lại rõ ràng hơn:\n\nNội dung đã được tái cấu trúc để dễ hiểu hơn...\n\n[Nguồn AI: Writing Assistant]\n'],
      table: ['Đang tạo bảng...', '| Cột 1 | Cột 2 | Cột 3 |\n|-------|-------|-------|\n', '| Cột 1 | Cột 2 | Cột 3 |\n|-------|-------|-------|\n| Dữ liệu 1 | Dữ liệu 2 | Dữ liệu 3 |\n'],
      translate: ['Đang dịch...', '**English translation:**\n\n', '**English translation:**\n\nThis document outlines the key processes and guidelines for...\n'],
      outline: ['Đang tạo dàn ý...', '## Dàn ý bài viết\n\n1. Giới thiệu\n', '## Dàn ý bài viết\n\n1. Giới thiệu\n2. Nội dung chính\n   - Mục 2.1\n   - Mục 2.2\n3. Kết luận\n']
    };

    const steps = streamMap[action] || streamMap.outline;
    let step = 0;
    setGhostText(steps[0]);

    const interval = setInterval(() => {
      step++;
      if (step < steps.length) {
        setGhostText(steps[step]);
      } else {
        clearInterval(interval);
        setIsStreaming(false);
        const finalText = steps[steps.length - 1];
        setContent(prev => prev + finalText);
        dispatch({
          type: 'TRACK_EVENT',
          event: { type: 'ai_write', userId: currentUser.id, meta: { action } },
        });
        setAiCitations(prev => [`AI action: ${action}`, ...prev].slice(0, 4));
        setGhostText('');
      }
    }, 700);
  };

  const scrollAiToBottom = () => {
    aiMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (aiMode) {
      scrollAiToBottom();
    }
  }, [aiMessages, aiMode]);

  const buildAiReply = (message: string): string => {
    const q = message.toLowerCase();

    if (q.includes('dàn ý') || q.includes('outline')) {
      return `Đây là một dàn ý gợi ý cho bài viết của bạn:\n\n## 1. Bối cảnh & vấn đề\n- Mô tả ngắn gọn hiện trạng\n- Tại sao cần tài liệu này\n\n## 2. Mục tiêu chính\n- Mục tiêu 1\n- Mục tiêu 2\n\n## 3. Nội dung chi tiết\n### 3.1. Phần 1\n- Các ý chính\n\n### 3.2. Phần 2\n- Các ý chính\n\n## 4. Kết luận & next steps\n- Tóm tắt lại\n- Đề xuất hành động tiếp theo`;
    }

    if (q.includes('sop') || q.includes('quy trình') || q.includes('process')) {
      return `Tôi gợi ý cấu trúc SOP như sau:\n\n# SOP — [Tên quy trình]\n\n## 1. Mục đích\nGiải thích tại sao cần quy trình này.\n\n## 2. Phạm vi áp dụng\nAi / bộ phận nào sử dụng.\n\n## 3. Vai trò & trách nhiệm\n- Role 1 — trách nhiệm\n- Role 2 — trách nhiệm\n\n## 4. Quy trình chi tiết\n### Bước 1\n- Mô tả\n\n### Bước 2\n- Mô tả\n\n## 5. Chỉ số & kiểm soát\n- KPI / tiêu chí đánh giá`;
    }

    if (q.includes('báo cáo') || q.includes('report') || q.includes('weekly')) {
      return `Bạn có thể bắt đầu với khung báo cáo sau:\n\n# Báo cáo [Tên/Thời gian]\n\n## 1. Tóm tắt\n- 2–3 dòng về tình hình tổng quan\n\n## 2. Việc đã hoàn thành\n- Mục 1\n- Mục 2\n\n## 3. Việc đang triển khai\n- Mục 1\n- Mục 2\n\n## 4. Khó khăn / Blocker\n- Mục 1\n\n## 5. Kế hoạch tiếp theo\n- Mục 1\n- Mục 2`;
    }

    if (q.includes('viết giúp') || q.includes('viết hộ') || q.includes('write for me')) {
      return `Dưới đây là một đoạn mở đầu gợi ý, bạn có thể chỉnh sửa lại cho phù hợp ngữ cảnh:\n\n> Trong quá trình làm việc tại iKame, chúng ta thường gặp tình huống cần tra cứu nhanh kiến thức hoặc quy trình đã được đúc kết trước đó. Tài liệu này được tạo ra nhằm giúp đội ngũ có một điểm tham chiếu chung, rõ ràng và dễ áp dụng vào thực tế.\n\nNếu bạn muốn, tôi có thể tiếp tục mở rộng thêm các phần nội dung chi tiết theo dàn ý bạn đưa ra.`;
    }

    return `Tôi có thể hỗ trợ bạn theo 2 hướng:\n\n1. **Gợi ý cấu trúc/dàn ý** cho bài viết (SOP, báo cáo, tài liệu quy trình,...)\n2. **Viết nháp một đoạn nội dung cụ thể** để bạn chỉnh sửa lại.\n\nHãy mô tả rõ hơn: bạn đang muốn viết loại tài liệu gì, cho đối tượng nào, và mong muốn chính là gì?`;
  };

  const handleAiSend = () => {
    if (!aiInput.trim()) return;
    const now = new Date().toISOString();
    const userMsg: EditorAIMessage = {
      id: `${Date.now()}-u`,
      role: 'user',
      content: aiInput.trim(),
      timestamp: now,
    };
    const nextMessages = [...aiMessages, userMsg];
    setAiMessages(nextMessages);
    setAiInput('');
    setAiIsTyping(true);
    scrollAiToBottom();

    const replyText = buildAiReply(userMsg.content);
    setTimeout(() => {
      const assistantMsg: EditorAIMessage = {
        id: `${Date.now()}-a`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toISOString(),
      };
      setAiMessages(prev => [...prev, assistantMsg]);
      setAiIsTyping(false);
      scrollAiToBottom();
    }, 650);
  };

  const handleAiKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAiSend();
    }
  };

  const handleInsertFromAI = (text: string) => {
    setContent(prev => prev + `<p>${text}</p>`);
    addToast('Đã chèn nội dung AI vào bài viết', 'success');
  };

  const handleSaveDraft = () => {
    if (!title.trim()) { addToast('Vui lòng nhập tiêu đề bài viết', 'warning'); return; }
    const article: Article = {
      id: initialData?.id || `a-${Date.now()}`,
      title: title.trim(),
      content,
      excerpt: content.slice(0, 150).replace(/[#*\n]/g, ' ').trim() + '...',
      folderId: selectedFolderId,
      folderName: allFolders.find(f => f.id === selectedFolderId)?.name,
      tags,
      author: { id: currentUser.id, name: currentUser.name, role: currentUser.title, avatar: currentUser.avatar },
      status: initialData?.status === 'rejected' ? 'rejected' : 'draft',
      viewPermission,
      allowComments,
      views: initialData?.views || 0,
      likes: initialData?.likes || 0,
      likedBy: initialData?.likedBy || [],
      comments: initialData?.comments || [],
      createdAt: initialData?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    dispatch({ type: 'SAVE_ARTICLE', article });
    localStorage.removeItem(AUTOSAVE_KEY);
    addToast('Đã lưu bản nháp thành công', 'success');
  };

  const handlePublish = () => {
    if (!title.trim()) { addToast('Vui lòng nhập tiêu đề bài viết', 'warning'); return; }
    if (!selectedFolderId) { addToast('Vui lòng chọn thư mục lưu trữ', 'warning'); return; }

    setIsPublishing(true);
    setTimeout(() => {
      const article: Article = {
        id: initialData?.id || `a-${Date.now()}`,
        title: title.trim(),
        content,
        excerpt: content.slice(0, 150).replace(/[#*\n]/g, ' ').trim() + '...',
        coverUrl: initialData?.coverUrl,
        folderId: selectedFolderId,
        folderName: allFolders.find(f => f.id === selectedFolderId)?.name,
        tags,
        author: { id: currentUser.id, name: currentUser.name, role: currentUser.title, avatar: currentUser.avatar },
        status: can(currentUser, 'article.approve', { ...initialData, folderId: selectedFolderId } as Article) || currentUser.role === 'admin'
          ? 'published'
          : 'in_review',
        viewPermission,
        allowComments,
        views: initialData?.views || 0,
        likes: initialData?.likes || 0,
        likedBy: initialData?.likedBy || [],
        comments: initialData?.comments || [],
        createdAt: initialData?.createdAt || new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      dispatch({ type: 'SAVE_ARTICLE', article });
      localStorage.removeItem(AUTOSAVE_KEY);
      setIsPublishing(false);
      setIsPublishModalOpen(false);
      if (currentUser.role === 'manager' || currentUser.role === 'admin') {
        addToast(isEditing ? 'Bài viết đã được cập nhật' : 'Bài viết đã được xuất bản thành công! 🎉', 'success');
        dispatch({ type: 'TRACK_EVENT', event: { type: 'publish', userId: currentUser.id, articleId: article.id } });
      } else {
        addToast('Bài viết đã được gửi duyệt thành công', 'success');
        dispatch({ type: 'TRACK_EVENT', event: { type: 'submit_review', userId: currentUser.id, articleId: article.id } });
      }
      dispatch({ type: 'UPDATE_USER', updates: { xp: Math.min(state.currentUser.xp + 150, state.currentUser.xpToNext) } });
    }, 1200);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleDraftFromBullets = () => {
    const bullets = content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith('- '))
      .map((line) => line.replace(/^- /, '').trim())
      .filter(Boolean);

    if (bullets.length < 2) {
      addToast('Cần ít nhất 2 bullet points để AI dựng draft', 'warning');
      return;
    }

    const draft = `## Bản nháp từ bullet points

### Mục tiêu
${bullets.slice(0, 2).map((item) => `- ${item}`).join('\n')}

### Triển khai chi tiết
${bullets.map((item, idx) => `${idx + 1}. ${item}`).join('\n')}

### Hành động tiếp theo
- [ ] Chốt owner cho từng hạng mục
- [ ] Bổ sung timeline và KPI
- [ ] Đính kèm nguồn tham chiếu`;

    setContent(prev => prev + `<br><br><h2>Bản nháp từ bullet points</h2>${draft}`);
    dispatch({
      type: 'TRACK_EVENT',
      event: { type: 'ai_write', userId: currentUser.id, meta: { action: 'bullets_to_draft', bulletCount: bullets.length } },
    });
    setAiCitations((prev) => [`AI action: bullets_to_draft (${bullets.length})`, ...prev].slice(0, 4));
    addToast('Đã tạo draft từ bullet points', 'success');
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-8 relative h-full flex flex-col animate-fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 text-gray-500 shrink-0 active:scale-90"><ArrowLeft size={20} /></button>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          {isSaved && <span className="flex items-center gap-1 text-green-600"><Check size={12} /> Đã lưu tự động</span>}
        </div>
        <div className="flex items-center gap-3">
          {!collabMode && (
            <button
              type="button"
              onClick={() => setCollabMode(true)}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
            >
              <Users size={14} />
              Bật Collab mode
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setAiMode(!aiMode);
              if (!aiMode) {
                setTimeout(() => {
                  aiTextareaRef.current?.focus();
                }, 150);
              }
            }}
            className={`hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 active:scale-95 ${
              aiMode
                ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            <Sparkles size={14} className={aiMode ? 'text-orange-300' : 'text-orange-500'} />
            {aiMode ? 'AI mode đang bật' : 'Bật AI mode'}
          </button>
          <button onClick={handleSaveDraft} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center gap-2 shadow-sm active:scale-95">
            <Save size={16} /> Lưu nháp
          </button>
          <button onClick={() => setIsPublishModalOpen(true)} className="px-4 py-2 bg-gradient-to-r from-[#f76226] to-[#FF8A6A] text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-[#f76226]/20 transition-all duration-200 flex items-center gap-2 shadow-md active:scale-95">
            <Send size={16} /> {currentUser.role === 'manager' || currentUser.role === 'admin' ? 'Xuất bản' : 'Gửi duyệt'}
          </button>
        </div>
      </div>
      {aiCitations.length > 0 && (
        <div className="mb-4 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-xl p-3">
          <div className="font-semibold text-gray-700 mb-1">AI Trace</div>
          {aiCitations.map(item => <div key={item}>- {item}</div>)}
        </div>
      )}
      {collabMode && (
        <div className="mb-4 p-3 rounded-xl border border-blue-100 bg-blue-50/40">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-blue-700 flex items-center gap-1.5">
              <Users size={14} />
              Collaborative editing demo mode
            </p>
            <button
              onClick={() => setCollabMode(false)}
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-800"
              type="button"
            >
              Ẩn
            </button>
          </div>
          {/* Markdown & Template Toolbar is native to NotionEditor */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">  </div>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-blue-900">
            <div className="rounded-lg bg-white border border-blue-100 px-2.5 py-2">
              Huy đang chỉnh phần "Checklist release"
            </div>
            <div className="rounded-lg bg-white border border-blue-100 px-2.5 py-2">
              Mai để lại inline comment ở đoạn "Mục tiêu"
            </div>
          </div>
        </div>
      )}

      {/* Markdown & Template Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
　　　　<div className="flex items-center gap-1 p-1.5 bg-gray-50 border border-gray-200 rounded-xl">
          <span className="text-xs text-gray-400 px-2 hidden sm:inline">Hỗ trợ Markdown • Gõ <kbd className="px-1 py-0.5 bg-gray-200 rounded text-[10px] font-mono">/ai</kbd> để gọi AI</span>
        </div>

        {/* Template Selector button (opens modal) */}
        <div className="relative">
          <button
            onClick={() => {
              if (!activeTemplateId && templates.length > 0) {
                setActiveTemplateId(templates[0].id);
              }
              setShowTemplates(true);
            }}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-xl transition-all shadow-sm active:scale-95"
          >
            <FileText size={16} className="text-gray-500" />
            Chọn biểu mẫu
            <ChevronDown size={14} className="text-gray-400" />
          </button>
        </div>
        <button
          onClick={handleDraftFromBullets}
          className="flex items-center gap-2 px-3 py-2 text-sm text-white bg-gray-900 hover:bg-black rounded-xl transition-all shadow-sm active:scale-95"
          type="button"
        >
          <Sparkles size={14} className="text-orange-300" />
          AI dựng draft từ bullets
        </button>
      </div>

      <div className="flex-1 flex gap-4 mt-1">
        {aiMode ? (
          <div className="w-[260px] shrink-0 flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gray-900 flex items-center justify-center shadow-sm">
                  <Sparkles size={16} className="text-orange-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                    AI mode
                    <span className="px-1.5 py-0.5 rounded-full bg-orange-50 text-[10px] font-bold text-orange-500 uppercase tracking-wider">Beta</span>
                  </p>
                  <p className="text-[11px] text-gray-500">Tra cứu & nháp nội dung song song khi viết.</p>
                </div>
              </div>
              <button
                onClick={() => setAiMode(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors active:scale-95"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex-1 min-h-0 flex flex-col">
              <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-3 space-y-3">
                {aiMessages.length === 0 && (
                  <div className="text-xs text-gray-500 bg-gray-50 border border-dashed border-gray-200 rounded-xl p-3">
                    <p className="font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                      <MessageSquare size={13} /> Gợi ý sử dụng
                    </p>
                    <ul className="list-disc list-inside space-y-0.5">
                      <li>Hỏi AI gợi ý **dàn ý** cho bài viết.</li>
                      <li>Xin **mẫu SOP / báo cáo** phù hợp.</li>
                      <li>Đề nghị AI **viết nháp đoạn mở đầu**.</li>
                    </ul>
                  </div>
                )}
                {aiMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-gray-900 text-white rounded-br-sm shadow-sm'
                          : 'bg-gray-50 border border-gray-100 text-gray-800 rounded-bl-sm'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                      <div
                        className={`mt-1 text-[9px] uppercase tracking-wide ${
                          msg.role === 'user' ? 'text-white/40 text-right' : 'text-gray-300'
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {msg.role === 'assistant' && (
                        <button
                          type="button"
                          onClick={() => handleInsertFromAI(msg.content)}
                          className="mt-1 inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/80 border border-gray-200 text-[10px] font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 active:scale-95"
                        >
                          <ArrowUp size={10} />
                          Chèn vào bài viết
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {aiIsTyping && (
                  <div className="flex justify-start">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 border border-gray-100 px-3 py-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '120ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '240ms' }} />
                    </div>
                  </div>
                )}
                <div ref={aiMessagesEndRef} />
              </div>

              <div className="border-t border-gray-100 p-2.5">
                <div className="relative">
                  <textarea
                    ref={aiTextareaRef}
                    value={aiInput}
                    onChange={e => setAiInput(e.target.value)}
                    onKeyDown={handleAiKeyDown}
                    placeholder="Hỏi AI về cấu trúc, ví dụ, mẫu nội dung..."
                    rows={2}
                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 pr-9 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-300 resize-none placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={handleAiSend}
                    disabled={!aiInput.trim() || aiIsTyping}
                    className={`absolute right-1.5 bottom-1.5 p-1.5 rounded-lg ${
                      aiInput.trim() && !aiIsTyping
                        ? 'bg-gray-900 text-white shadow-sm hover:bg-black active:scale-95'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    } transition-all duration-150`}
                  >
                    <ArrowUp size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="flex-1 flex flex-col">
          <input
            type="text"
            placeholder="Tiêu đề bài viết..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-4xl font-bold text-gray-900 placeholder:text-gray-300 border-none focus:ring-0 bg-transparent mb-4 outline-none w-full"
          />

          <div className="relative flex-1 editor-tiptap-container w-full" style={{ minHeight: '400px' }}>
            <NotionEditor 
              room={initialData?.id || 'new-article-room'} 
              placeholder="Bắt đầu viết nội dung bài viết, phân quyền, slash command (/) ..."
              onChange={(html) => setContent(html)}
            />

            {isStreaming && (
              <div className="absolute top-0 left-0 pointer-events-none text-gray-400 text-lg leading-relaxed whitespace-pre-wrap">
                <span className="opacity-0">{content}</span>
                <span className="bg-gradient-to-r from-orange-50 to-amber-50 text-orange-400 border-l-2 border-[#f76226] pl-1 animate-pulse">{ghostText}</span>
              </div>
            )}

            {showAiMenu && (
              <div className="absolute z-10 bg-white rounded-xl shadow-2xl border border-gray-200/80 w-60 overflow-hidden animate-scale-in" style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}>
                <div className="px-3 py-2.5 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100/50 text-xs font-semibold text-[#f76226] flex items-center gap-1.5">
                  <div className="p-0.5 bg-gradient-to-br from-[#f76226] to-orange-400 rounded text-white"><Sparkles size={10} /></div>
                  iWiki AI Assistant
                </div>
                <div className="p-1">
                  {[
                    { id: 'outline', label: 'Tạo dàn ý', icon: AlignLeft },
                    { id: 'rewrite', label: 'Viết lại rõ ràng hơn', icon: Type },
                    { id: 'summarize', label: 'Tóm tắt nội dung', icon: AlignLeft },
                    { id: 'table', label: 'Chuyển thành bảng', icon: Table },
                    { id: 'translate', label: 'Dịch sang tiếng Anh', icon: Languages },
                  ].map((item) => {
                    const Icon = item.icon; return (
                      <button key={item.id} onClick={() => handleAiAction(item.id)} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent hover:text-[#f76226] rounded-lg transition-all duration-200 text-left">
                        <Icon size={16} />{item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="hidden lg:flex w-[220px] shrink-0">
          <div className="h-full w-full rounded-2xl border border-gray-200 bg-white/60 px-3 py-3 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Mục lục
              </p>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar text-[12px] leading-relaxed">
              {headings.length === 0 ? (
                <p className="text-gray-400">
                  Dùng các thẻ <code className="px-1 py-0.5 bg-gray-100 rounded">#</code>,{' '}
                  <code className="px-1 py-0.5 bg-gray-100 rounded">##</code>,{' '}
                  <code className="px-1 py-0.5 bg-gray-100 rounded">###</code> để tạo mục lục tự động.
                </p>
              ) : (
                <ul className="space-y-1">
                  {headings.map(h => (
                    <li
                      key={h.id}
                      className={`text-gray-700 cursor-default ${
                        h.level === 1 ? 'font-semibold' : h.level === 2 ? 'pl-3' : 'pl-5 text-gray-500'
                      }`}
                    >
                      {h.text}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Publish Modal */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-modal-backdrop">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-modal-enter">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Cài đặt xuất bản</h3>
                <p className="text-sm text-gray-500 mt-1">Phân loại và thiết lập quyền truy cập cho bài viết.</p>
              </div>
              <button onClick={() => setIsPublishModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-all duration-200 active:scale-90"><X size={20} /></button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              {/* Folder */}
              <section>
                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><Folder size={16} className="text-indigo-500" /> Vị trí lưu trữ <span className="text-red-500">*</span></h4>
                <select value={selectedFolderId} onChange={(e) => setSelectedFolderId(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 hover:border-gray-300">
                  <option value="" disabled>Chọn thư mục...</option>
                  {allFolders.map(folder => <option key={folder.id} value={folder.id}>{folder.name}</option>)}
                </select>
              </section>

              {/* Tags */}
              <section>
                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><Tag size={16} className="text-orange-500" /> Tags</h4>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all duration-200 hover:border-gray-300">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map(tag => (
                      <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-xs font-medium text-gray-700 shadow-sm">
                        {tag}<button onClick={() => setTags(tags.filter(t => t !== tag))} className="text-gray-400 hover:text-red-500 transition-colors active:scale-90"><X size={12} /></button>
                      </span>
                    ))}
                  </div>
                  <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleAddTag} placeholder="Nhập tag và nhấn Enter..." className="w-full bg-transparent border-none focus:ring-0 text-sm p-0 outline-none" />
                </div>
              </section>

              {/* Permissions */}
              <section>
                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><Shield size={16} className="text-green-500" /> Quyền truy cập</h4>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { val: 'public', icon: Globe, label: 'Công khai', desc: 'Mọi người trong iKame' },
                    { val: 'restricted', icon: Lock, label: 'Hạn chế', desc: 'Chỉ người được cấp quyền' },
                  ].map(opt => {
                    const Icon = opt.icon; return (
                      <label key={opt.val} className={`flex cursor-pointer rounded-xl border p-4 transition-all duration-200 ${viewPermission === opt.val ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'}`}>
                        <input type="radio" name="view_permission" value={opt.val} className="sr-only" checked={viewPermission === opt.val} onChange={() => setViewPermission(opt.val as any)} />
                        <span className="flex flex-1 flex-col">
                          <span className="text-sm font-medium text-gray-900 flex items-center gap-2"><Icon size={16} className={viewPermission === opt.val ? 'text-indigo-600' : 'text-gray-400'} />{opt.label}</span>
                          <span className="mt-1 text-xs text-gray-500">{opt.desc}</span>
                        </span>
                        {viewPermission === opt.val && <Check size={20} className="text-indigo-600 shrink-0" />}
                      </label>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-white hover:border-gray-300 transition-colors">
                  <div>
                    <h5 className="text-sm font-medium text-gray-900">Cho phép bình luận</h5>
                    <p className="text-xs text-gray-500 mt-0.5">Người đọc có thể để lại bình luận.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={allowComments} onChange={(e) => setAllowComments(e.target.checked)} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </section>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50/80 flex justify-end gap-3 shrink-0">
              <button onClick={() => setIsPublishModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-xl transition-all duration-200 active:scale-95" disabled={isPublishing}>Hủy</button>
              <button onClick={handlePublish} disabled={!selectedFolderId || isPublishing} className="px-6 py-2 text-sm font-bold text-white bg-gradient-to-r from-[#f76226] to-[#FF8A6A] hover:shadow-lg hover:shadow-[#f76226]/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-200 shadow-md flex items-center gap-2 active:scale-95">
                {isPublishing ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Đang xuất bản...</> : <><Send size={16} /> {isEditing ? 'Cập nhật bài viết' : 'Xác nhận xuất bản'}</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template Modal with preview + AI assist */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-modal-backdrop">
          <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-modal-enter">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FileText size={18} className="text-[#f76226]" />
                  Chọn biểu mẫu bài viết
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Chọn template phù hợp, xem preview trước khi áp dụng. Có thể kết hợp cùng iWiki AI để sinh dàn ý tự động.
                </p>
              </div>
              <button
                onClick={() => setShowTemplates(false)}
                className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-all duration-200 active:scale-90"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Template list */}
              <div className="w-72 border-r border-gray-100 bg-gray-50/60 p-4 space-y-3 overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Biểu mẫu gợi ý
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-50 text-[10px] font-medium text-[#f76226] border border-orange-100">
                    <Sparkles size={10} /> AI friendly
                  </span>
                </div>
                {templates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTemplateId(t.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl border text-sm mb-1 transition-all flex flex-col gap-1 ${
                      (activeTemplateId || templates[0]?.id) === t.id
                        ? 'border-[#f76226]/70 bg-white shadow-sm'
                        : 'border-gray-200 bg-white/80 hover:bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-gray-900 line-clamp-2">{t.title}</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">{t.description}</p>
                  </button>
                ))}
              </div>

              {/* Preview + actions */}
              <div className="flex-1 flex flex-col">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Preview biểu mẫu
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5">
                      Nội dung chỉ là khung gợi ý. Bạn có thể chỉnh sửa lại toàn bộ sau khi áp dụng.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const activeTemplate =
                        templates.find((t) => t.id === (activeTemplateId || templates[0]?.id)) ||
                        templates[0];
                      return (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              if (!activeTemplate) return;
                              handleApplyTemplate(activeTemplate.content);
                            }}
                            className="px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
                          >
                            Dùng template
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (!activeTemplate) return;
                              handleApplyTemplate(activeTemplate.content);
                              handleAiAction('outline');
                            }}
                            className="px-3 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#f76226] to-[#FF8A6A] text-white shadow-md hover:shadow-lg hover:shadow-[#f76226]/25 transition-all active:scale-95 inline-flex items-center gap-1.5"
                          >
                            <Sparkles size={14} />
                            Dùng template + AI dàn ý
                          </button>
                        </>
                      );
                    })()}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-white">
                  {(() => {
                    const activeTemplate =
                      templates.find((t) => t.id === (activeTemplateId || templates[0]?.id)) ||
                      templates[0];
                    if (!activeTemplate) return null;
                    return (
                      <div className="border border-dashed border-gray-200 rounded-2xl bg-gray-50/70 p-4 h-full">
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            {activeTemplate.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {activeTemplate.description}
                          </p>
                        </div>
                        <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono leading-relaxed max-h-[380px] overflow-y-auto custom-scrollbar bg-white rounded-xl border border-gray-200 p-3">
{activeTemplate.content}
                        </pre>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
