import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Save, Send, Folder, Tag, Globe, Lock, X, Bold, Italic, List, Heading, Sparkles, AlignLeft, Type, Table, Languages, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../App';
import { Article } from '../store/useAppStore';
import { AnimatePresence, motion } from 'motion/react';
import { generateRAGResponse } from '../lib/gemini';

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

  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState(initialData?.folderId || '');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [viewPermission, setViewPermission] = useState<'public' | 'restricted'>(initialData?.viewPermission || 'public');
  const [allowComments, setAllowComments] = useState(initialData?.allowComments ?? true);
  const [isPublishing, setIsPublishing] = useState(false);

  const isEditing = !!initialData?.id;
  const allFolders = folders.flatMap(f => [f, ...(f.children || [])]);

  useEffect(() => {
    if (!isEditing) {
      const saved = localStorage.getItem(AUTOSAVE_KEY);
      if (saved) {
        try { const parsed = JSON.parse(saved); if (parsed.title || parsed.content) { setTitle(parsed.title || ''); setContent(parsed.content || ''); } } catch { }
      }
    }
  }, []);

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

  const handleAiAction = async (action: string) => {
    setShowAiMenu(false);
    setContent(prev => prev.replace(/\/ai$/, ''));
    setIsStreaming(true);
    setGhostText('AI đang xử lý...');
    try {
      const promptMap: Record<string, string> = {
        summarize: "Please summarize the current text in a professional tone with bullet points.",
        rewrite: "Please rewrite the current text to be more engaging and clear.",
        table: "Please convert the key information into a Markdown table.",
        outline: "Please create a detailed structural outline for this document.",
        translate: "Please translate the text into English (or Vietnamese if it's already in English)."
      };
      const prompt = promptMap[action] || "Please assist with the following text.";
      const response = await generateRAGResponse(prompt + "\n\nTEXT:\n" + content, [{ title: title || 'Untitled', content: content }], (t) => setGhostText(t));
      setContent(prev => prev + '\n\n' + response);
    } catch (error: any) {
      addToast(error.message || "AI gặp lỗi. Kiểm tra API Key.", "error");
    } finally {
      setIsStreaming(false);
      setGhostText('');
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handlePublish = () => {
    if (!title.trim()) { addToast('Vui lòng nhập tiêu đề bài viết', 'warning'); return; }
    if (!selectedFolderId) { addToast('Vui lòng chọn thư mục', 'warning'); return; }
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
        createdAt: initialData?.createdAt || new Date().toLocaleDateString('vi-VN'),
        updatedAt: new Date().toLocaleDateString('vi-VN'),
      };
      dispatch({ type: 'SAVE_ARTICLE', article });
      localStorage.removeItem(AUTOSAVE_KEY);
      setIsPublishing(false);
      setIsPublishModalOpen(false);
      addToast(isEditing ? 'Cập nhật thành công!' : 'Bài viết đã được đăng! 🎉', 'success');
    }, 1200);
  };

  return (
    <div className="min-h-full bg-white flex flex-col">
      {/* Header */}
      <header className="h-14 shrink-0 flex items-center justify-between px-6 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-500">
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <span>Workspace</span>
            <ChevronRight size={12} />
            <span className="text-gray-700">{isEditing ? 'Chỉnh sửa' : 'Bài viết mới'}</span>
          </div>
          {isSaved && <span className="text-xs text-green-500 font-medium">Đã lưu</span>}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPublishModalOpen(true)}
            className="px-4 py-2 bg-orange-500 text-white rounded-md text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            Xuất bản
          </button>
        </div>
      </header>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 pt-10 pb-32">
          <textarea
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Tiêu đề bài viết..."
            rows={1}
            className="w-full text-3xl font-bold text-gray-900 placeholder:text-gray-200 border-none focus:ring-0 bg-transparent mb-6 outline-none resize-none leading-tight"
          />

          <div className="relative">
            <textarea
              ref={editorRef}
              value={content}
              onChange={handleInput}
              placeholder="Nội dung bài viết (gõ /ai để nhận trợ giúp từ AI)..."
              className="w-full min-h-[500px] resize-none border-none focus:ring-0 bg-transparent text-gray-700 text-base leading-relaxed outline-none placeholder:text-gray-300"
            />
            {isStreaming && (
              <div className="text-orange-500 text-sm mt-2 p-3 bg-orange-50 rounded-md border border-orange-100">
                <span className="font-medium">AI: </span>{ghostText}
              </div>
            )}
            <AnimatePresence>
              {showAiMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg w-60 overflow-hidden"
                  style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
                >
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} className="text-orange-500" />
                      <span className="text-xs font-semibold text-gray-700">Trợ giúp AI</span>
                    </div>
                  </div>
                  <div className="p-1">
                    {[
                      { id: 'outline', label: 'Tạo dàn ý', icon: AlignLeft },
                      { id: 'rewrite', label: 'Tối ưu văn phong', icon: Type },
                      { id: 'summarize', label: 'Tóm tắt', icon: Heading },
                      { id: 'table', label: 'Tạo bảng dữ liệu', icon: Table },
                      { id: 'translate', label: 'Dịch thuật', icon: Languages },
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => handleAiAction(item.id)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors"
                      >
                        <item.icon size={15} className="text-gray-400" />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Publish Modal */}
      <AnimatePresence>
        {isPublishModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPublishModalOpen(false)} className="absolute inset-0 bg-black/40" />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="relative bg-white rounded-lg w-full max-w-xl shadow-xl overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Thiết lập xuất bản</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Cấu hình trước khi đăng bài</p>
                </div>
                <button onClick={() => setIsPublishModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-md text-gray-400 transition-colors"><X size={18} /></button>
              </div>

              <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
                {/* Folder */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Thư mục lưu trữ *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {allFolders.slice(0, 8).map(f => (
                      <button
                        key={f.id}
                        onClick={() => setSelectedFolderId(f.id)}
                        className={`flex items-center gap-2 p-3 rounded-md border text-sm transition-colors text-left ${selectedFolderId === f.id
                            ? 'border-orange-400 bg-orange-50 text-orange-700'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                          }`}
                      >
                        <Folder size={14} className={selectedFolderId === f.id ? 'text-orange-500' : 'text-gray-400'} />
                        <span className="truncate">{f.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map(t => (
                      <span key={t} className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                        {t} <X size={12} className="cursor-pointer text-gray-400 hover:text-red-400" onClick={() => setTags(tags.filter(x => x !== t))} />
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Nhập tag, Enter để thêm..."
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"
                  />
                </div>

                {/* Permissions */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Quyền xem</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setViewPermission('public')}
                      className={`p-4 rounded-md border text-left transition-colors ${viewPermission === 'public' ? 'border-orange-400 bg-orange-50' : 'border-gray-200 hover:bg-gray-50'}`}
                    >
                      <Globe size={16} className={`mb-2 ${viewPermission === 'public' ? 'text-orange-500' : 'text-gray-400'}`} />
                      <p className="text-sm font-medium text-gray-900">Công khai</p>
                      <p className="text-xs text-gray-400">Toàn bộ workspace</p>
                    </button>
                    <button
                      onClick={() => setViewPermission('restricted')}
                      className={`p-4 rounded-md border text-left transition-colors ${viewPermission === 'restricted' ? 'border-orange-400 bg-orange-50' : 'border-gray-200 hover:bg-gray-50'}`}
                    >
                      <Lock size={16} className={`mb-2 ${viewPermission === 'restricted' ? 'text-orange-500' : 'text-gray-400'}`} />
                      <p className="text-sm font-medium text-gray-900">Riêng tư</p>
                      <p className="text-xs text-gray-400">Chỉ người được cấp quyền</p>
                    </button>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                <button onClick={() => setIsPublishModalOpen(false)} className="flex-1 py-2.5 text-sm text-gray-500 hover:bg-gray-100 rounded-md transition-colors">Lưu nháp</button>
                <button
                  onClick={handlePublish}
                  disabled={isPublishing || !selectedFolderId}
                  className="flex-1 py-2.5 bg-orange-500 text-white rounded-md text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isPublishing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={14} /> Xuất bản</>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
