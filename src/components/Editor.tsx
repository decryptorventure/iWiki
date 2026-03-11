import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, AlignLeft, Type, Table, Languages, ArrowLeft, Save, Send, Folder, Tag, Shield, Globe, Lock, X, Check, Bold, Italic, List, Heading, FileText, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../App';
import { Article } from '../store/useAppStore';

const AUTOSAVE_KEY = 'iwiki_editor_autosave';

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

  const templates = [
    { id: 't1', title: 'Meeting Minutes', content: '# Meeting Minutes\n\n## 1. Thông tin chung\n- **Thời gian:** \n- **Địa điểm:** \n- **Thành phần tham gia:** \n\n## 2. Nội dung chính thảo luận\n- \n- \n\n## 3. Action Items\n| Việc cần làm | Người phụ trách | Deadline | Trạng thái |\n|---|---|---|---|\n| | | | |\n' },
    { id: 't2', title: 'Template SOP / Quy trình', content: '# Quy trình [Tên quy trình]\n\n## 1. Mục đích\nQuy trình này nhằm...\n\n## 2. Phạm vi áp dụng\nÁp dụng cho bộ phận/cá nhân...\n\n## 3. Định nghĩa & Viết tắt\n- \n\n## 4. Nội dung chi tiết quy trình\n### Bước 1: [Tên bước]\n- **Người thực hiện:** \n- **Mô tả:** \n\n### Bước 2: ...\n' },
    { id: 't3', title: 'Weekly Report', content: '# Báo cáo tuần [Số tuần/Tháng]\n\n## 1. Những việc đã hoàn thành\n- \n- \n\n## 2. OKRs / KPIs Progress\n- Mục tiêu 1: [Tiến độ %]\n- Mục tiêu 2: [Tiến độ %]\n\n## 3. Khó khăn & Blocker (Nếu có)\n- \n\n## 4. Kế hoạch tuần tới\n- \n' }
  ];

  const handleApplyTemplate = (templateContent: string) => {
    setContent(templateContent);
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

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    if (val.endsWith('/ai')) {
      const { selectionEnd } = e.target;
      const lines = val.substring(0, selectionEnd).split('\n');
      const currentLine = lines[lines.length - 1];
      setMenuPosition({ top: lines.length * 28 + 40, left: Math.min(currentLine.length * 8 + 40, 300) });
      setShowAiMenu(true);
    } else {
      setShowAiMenu(false);
    }
  };

  const handleAiAction = (action: string) => {
    setShowAiMenu(false);
    setContent(prev => prev.replace(/\/ai$/, ''));
    setIsStreaming(true);

    const streamMap: Record<string, string[]> = {
      summarize: ['Đang tóm tắt...', '**Tóm tắt:**\n', '**Tóm tắt:**\nBài viết trình bày 3 điểm chính:\n', '**Tóm tắt:**\nBài viết trình bày 3 điểm chính:\n1. Nội dung chính\n2. Quy trình thực hiện\n3. Lưu ý quan trọng\n'],
      rewrite: ['Đang viết lại...', 'Đây là phiên bản được viết lại rõ ràng hơn:\n\n', 'Đây là phiên bản được viết lại rõ ràng hơn:\n\nNội dung đã được tái cấu trúc để dễ hiểu hơn...\n'],
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
        setContent(prev => prev + '\n\n' + steps[steps.length - 1]);
        setGhostText('');
      }
    }, 700);
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
      status: 'draft',
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
        status: 'published',
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
      addToast(isEditing ? 'Bài viết đã được cập nhật' : 'Bài viết đã được xuất bản thành công! 🎉', 'success');
      dispatch({ type: 'UPDATE_USER', updates: { xp: Math.min(state.currentUser.xp + 150, state.currentUser.xpToNext) } });
    }, 1200);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const insertMarkdown = (prefix: string, suffix = '') => {
    const textarea = editorRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.slice(start, end);
    const newContent = content.slice(0, start) + prefix + selected + suffix + content.slice(end);
    setContent(newContent);
    setTimeout(() => textarea.focus(), 0);
  };

  return (
    <div className="max-w-4xl mx-auto px-8 py-8 relative h-full flex flex-col animate-fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 text-gray-500 shrink-0 active:scale-90"><ArrowLeft size={20} /></button>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          {isSaved && <span className="flex items-center gap-1 text-green-600"><Check size={12} /> Đã lưu tự động</span>}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSaveDraft} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center gap-2 shadow-sm active:scale-95">
            <Save size={16} /> Lưu nháp
          </button>
          <button onClick={() => setIsPublishModalOpen(true)} className="px-4 py-2 bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6A] text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-[#FF6B4A]/20 transition-all duration-200 flex items-center gap-2 shadow-md active:scale-95">
            <Send size={16} /> Xuất bản
          </button>
        </div>
      </div>

      {/* Markdown & Template Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-1 p-1.5 bg-gray-50 border border-gray-200 rounded-xl">
          {[
            { icon: Heading, action: () => insertMarkdown('## '), title: 'Tiêu đề' },
            { icon: Bold, action: () => insertMarkdown('**', '**'), title: 'In đậm' },
            { icon: Italic, action: () => insertMarkdown('*', '*'), title: 'In nghiêng' },
            { icon: List, action: () => insertMarkdown('\n- '), title: 'Danh sách' },
          ].map(({ icon: Icon, action, title }) => (
            <button key={title} title={title} onClick={action} className="p-2 text-gray-500 hover:text-gray-800 hover:bg-white rounded-lg transition-all duration-200 active:scale-90" type="button">
              <Icon size={16} />
            </button>
          ))}
          <div className="h-4 w-px bg-gray-200 mx-1" />
          <span className="text-xs text-gray-400 px-2 hidden sm:inline">Hỗ trợ Markdown • Gõ <kbd className="px-1 py-0.5 bg-gray-200 rounded text-[10px] font-mono">/ai</kbd> để gọi AI</span>
        </div>

        {/* Template Selector dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-xl transition-all shadow-sm active:scale-95"
          >
            <FileText size={16} className="text-gray-500" />
            Chọn biểu mẫu
            <ChevronDown size={14} className="text-gray-400" />
          </button>
          
          {showTemplates && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 animate-fade-in origin-top-right">
              <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 mb-1">
                Biểu mẫu nhanh
              </div>
              {templates.map(t => (
                <button
                  key={t.id}
                  onClick={() => handleApplyTemplate(t.content)}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors flex items-center gap-2 group"
                >
                  <FileText size={14} className="text-gray-400 group-hover:text-orange-500" />
                  {t.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <input
        type="text"
        placeholder="Tiêu đề bài viết..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-4xl font-bold text-gray-900 placeholder:text-gray-300 border-none focus:ring-0 bg-transparent mb-4 outline-none w-full"
      />

      <div className="relative flex-1">
        <textarea
          ref={editorRef}
          value={content}
          onChange={handleInput}
          placeholder="Bắt đầu viết nội dung bài viết, hoặc gõ '/ai' để gọi trợ lý AI..."
          className="w-full h-full resize-none border-none focus:ring-0 bg-transparent text-gray-700 text-lg leading-relaxed outline-none"
          style={{ minHeight: '400px' }}
        />

        {isStreaming && (
          <div className="absolute top-0 left-0 pointer-events-none text-gray-400 text-lg leading-relaxed whitespace-pre-wrap">
            <span className="opacity-0">{content}</span>
            <span className="bg-gradient-to-r from-orange-50 to-amber-50 text-orange-400 border-l-2 border-[#FF6B4A] pl-1 animate-pulse">{ghostText}</span>
          </div>
        )}

        {showAiMenu && (
          <div className="absolute z-10 bg-white rounded-xl shadow-2xl border border-gray-200/80 w-60 overflow-hidden animate-scale-in" style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}>
            <div className="px-3 py-2.5 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100/50 text-xs font-semibold text-[#FF6B4A] flex items-center gap-1.5">
              <div className="p-0.5 bg-gradient-to-br from-[#FF6B4A] to-orange-400 rounded text-white"><Sparkles size={10} /></div>
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
                  <button key={item.id} onClick={() => handleAiAction(item.id)} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent hover:text-[#FF6B4A] rounded-lg transition-all duration-200 text-left">
                    <Icon size={16} />{item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
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
              <button onClick={handlePublish} disabled={!selectedFolderId || isPublishing} className="px-6 py-2 text-sm font-bold text-white bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6A] hover:shadow-lg hover:shadow-[#FF6B4A]/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-200 shadow-md flex items-center gap-2 active:scale-95">
                {isPublishing ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Đang xuất bản...</> : <><Send size={16} /> {isEditing ? 'Cập nhật bài viết' : 'Xác nhận xuất bản'}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
