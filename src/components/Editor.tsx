import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Sparkles, AlignLeft, Type, Table, Languages, ArrowLeft, Save, Send, FileText, ChevronDown, Check, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../App';
import { Article } from '../store/useAppStore';
import { can } from '../lib/permissions';
import { Button } from '@frontend-team/ui-kit';
import { NotionEditor } from '../tiptap/notion-like-editor';
import { EDITOR_TEMPLATES } from '../lib/editor-templates-data';
import { buildEditorAiReply } from '../lib/editor-ai-helpers';
import EditorAIChatPanel, { EditorAIMessage } from './editor-ai-chat-panel';
import EditorPublishModal from './editor-publish-modal';
import EditorTemplateModal from './editor-template-modal';

const AUTOSAVE_KEY = 'iwiki_editor_autosave';

export default function Editor({ initialData, onBack }: { initialData?: Partial<Article> | null; onBack?: () => void }) {
  const { state, dispatch } = useApp();
  const { addToast } = useToast();
  const { folders, currentUser } = state;

  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [isStreaming, setIsStreaming] = useState(false);
  const [ghostText, setGhostText] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [showAiMenu, setShowAiMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const autosaveTimer = useRef<any>(null);

  // Publish modal state
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState(initialData?.folderId || '');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [viewPermission, setViewPermission] = useState<'public' | 'restricted'>(initialData?.viewPermission || 'public');
  const [allowComments, setAllowComments] = useState(initialData?.allowComments ?? true);
  const [isPublishing, setIsPublishing] = useState(false);

  // Template modal state
  const [showTemplates, setShowTemplates] = useState(false);
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);
  const [aiCitations, setAiCitations] = useState<string[]>([]);

  // AI chat panel state
  const [aiMode, setAiMode] = useState(false);
  const [collabMode, setCollabMode] = useState(true);
  const [aiMessages, setAiMessages] = useState<EditorAIMessage[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [aiIsTyping, setAiIsTyping] = useState(false);
  const aiMessagesEndRef = useRef<HTMLDivElement | null>(null);
  const aiTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const isEditing = !!initialData?.id;
  const allFolders = folders.flatMap(f => [f, ...(f.children || [])]);

  const headings = useMemo(() => content.split('\n').map((line, index) => {
    const match = line.match(/^(#{1,3})\s+(.*)/);
    if (!match) return null;
    return { id: `${index}-${match[1].length}`, level: match[1].length, text: match[2].trim() };
  }).filter(Boolean) as { id: string; level: number; text: string }[], [content]);

  useEffect(() => {
    if (!isEditing) {
      const saved = localStorage.getItem(AUTOSAVE_KEY);
      if (saved) {
        try { const p = JSON.parse(saved); if (p.title || p.content) { setTitle(p.title || ''); setContent(p.content || ''); } } catch { }
      }
    }
  }, []);

  useEffect(() => {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      if (title || content) { localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({ title, content })); setIsSaved(true); setTimeout(() => setIsSaved(false), 2000); }
    }, 2000);
    return () => clearTimeout(autosaveTimer.current);
  }, [title, content]);

  useEffect(() => { if (aiMode) aiMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [aiMessages, aiMode]);

  const handleAiAction = (action: string) => {
    setShowAiMenu(false);
    setIsStreaming(true);
    const streamMap: Record<string, string[]> = {
      summarize: ['Đang tóm tắt...', '**Tóm tắt:**\n', '**Tóm tắt:**\nBài viết trình bày 3 điểm chính:\n1. Nội dung chính\n2. Quy trình thực hiện\n3. Lưu ý quan trọng\n\n[Nguồn AI: Internal Knowledge Base]\n'],
      rewrite: ['Đang viết lại...', 'Đây là phiên bản được viết lại:\n\n', 'Đây là phiên bản được viết lại:\n\nNội dung đã được tái cấu trúc để dễ hiểu hơn...\n\n[Nguồn AI: Writing Assistant]\n'],
      table: ['Đang tạo bảng...', '| Cột 1 | Cột 2 | Cột 3 |\n|-------|-------|-------|\n', '| Cột 1 | Cột 2 | Cột 3 |\n|-------|-------|-------|\n| Dữ liệu 1 | Dữ liệu 2 | Dữ liệu 3 |\n'],
      translate: ['Đang dịch...', '**English translation:**\n\n', '**English translation:**\n\nThis document outlines the key processes...\n'],
      outline: ['Đang tạo dàn ý...', '## Dàn ý bài viết\n\n1. Giới thiệu\n', '## Dàn ý bài viết\n\n1. Giới thiệu\n2. Nội dung chính\n   - Mục 2.1\n3. Kết luận\n'],
    };
    const steps = streamMap[action] || streamMap.outline;
    let step = 0;
    setGhostText(steps[0]);
    const interval = setInterval(() => {
      step++;
      if (step < steps.length) { setGhostText(steps[step]); }
      else {
        clearInterval(interval); setIsStreaming(false);
        setContent(prev => prev + steps[steps.length - 1]);
        dispatch({ type: 'TRACK_EVENT', event: { type: 'ai_write', userId: currentUser.id, meta: { action } } });
        setAiCitations(prev => [`AI action: ${action}`, ...prev].slice(0, 4));
        setGhostText('');
      }
    }, 700);
  };

  const handleAiSend = () => {
    if (!aiInput.trim()) return;
    const now = new Date().toISOString();
    const userMsg: EditorAIMessage = { id: `${Date.now()}-u`, role: 'user', content: aiInput.trim(), timestamp: now };
    setAiMessages(prev => [...prev, userMsg]);
    setAiInput('');
    setAiIsTyping(true);
    aiMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      const reply: EditorAIMessage = { id: `${Date.now()}-a`, role: 'assistant', content: buildEditorAiReply(userMsg.content), timestamp: new Date().toISOString() };
      setAiMessages(prev => [...prev, reply]);
      setAiIsTyping(false);
      aiMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 650);
  };

  const handleInsertFromAI = (text: string) => {
    setContent(prev => prev + `<p>${text}</p>`);
    addToast('Đã chèn nội dung AI vào bài viết', 'success');
  };

  const handleSaveDraft = () => {
    if (!title.trim()) { addToast('Vui lòng nhập tiêu đề bài viết', 'warning'); return; }
    const article: Article = {
      id: initialData?.id || `a-${Date.now()}`, title: title.trim(), content,
      excerpt: content.slice(0, 150).replace(/[#*\n]/g, ' ').trim() + '...',
      folderId: selectedFolderId, folderName: allFolders.find(f => f.id === selectedFolderId)?.name, tags,
      author: { id: currentUser.id, name: currentUser.name, role: currentUser.title, avatar: currentUser.avatar },
      status: initialData?.status === 'rejected' ? 'rejected' : 'draft',
      viewPermission, allowComments, views: initialData?.views || 0, likes: initialData?.likes || 0,
      likedBy: initialData?.likedBy || [], comments: initialData?.comments || [],
      createdAt: initialData?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    dispatch({ type: 'SAVE_ARTICLE', article });
    localStorage.removeItem(AUTOSAVE_KEY);
    addToast('Đã lưu bản nháp thành công', 'success');
  };

  const handlePublish = (_sharedWith: string[] = []) => {
    if (!title.trim()) { addToast('Vui lòng nhập tiêu đề bài viết', 'warning'); return; }
    if (!selectedFolderId) { addToast('Vui lòng chọn thư mục lưu trữ', 'warning'); return; }
    setIsPublishing(true);
    setTimeout(() => {
      const article: Article = {
        id: initialData?.id || `a-${Date.now()}`, title: title.trim(), content,
        excerpt: content.slice(0, 150).replace(/[#*\n]/g, ' ').trim() + '...',
        coverUrl: initialData?.coverUrl, folderId: selectedFolderId,
        folderName: allFolders.find(f => f.id === selectedFolderId)?.name, tags,
        author: { id: currentUser.id, name: currentUser.name, role: currentUser.title, avatar: currentUser.avatar },
        status: can(currentUser, 'article.approve', { ...initialData, folderId: selectedFolderId } as Article) || currentUser.role === 'admin' ? 'published' : 'in_review',
        viewPermission, allowComments, views: initialData?.views || 0, likes: initialData?.likes || 0,
        likedBy: initialData?.likedBy || [], comments: initialData?.comments || [],
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
    const bullets = content.split('\n').map(l => l.trim()).filter(l => l.startsWith('- ')).map(l => l.replace(/^- /, '').trim()).filter(Boolean);
    if (bullets.length < 2) { addToast('Cần ít nhất 2 bullet points để AI dựng draft', 'warning'); return; }
    const draft = `## Bản nháp từ bullet points\n\n### Mục tiêu\n${bullets.slice(0, 2).map(b => `- ${b}`).join('\n')}\n\n### Triển khai chi tiết\n${bullets.map((b, i) => `${i + 1}. ${b}`).join('\n')}\n\n### Hành động tiếp theo\n- [ ] Chốt owner cho từng hạng mục\n- [ ] Bổ sung timeline và KPI`;
    setContent(prev => prev + `<br><br><h2>Bản nháp từ bullet points</h2>${draft}`);
    dispatch({ type: 'TRACK_EVENT', event: { type: 'ai_write', userId: currentUser.id, meta: { action: 'bullets_to_draft', bulletCount: bullets.length } } });
    setAiCitations(prev => [`AI action: bullets_to_draft (${bullets.length})`, ...prev].slice(0, 4));
    addToast('Đã tạo draft từ bullet points', 'success');
  };

  return (
    <div className="max-w-6xl w-full pl-6 pr-8 py-8 relative h-full flex flex-col animate-fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-500 shrink-0 active:scale-90"><ArrowLeft size={20} /></button>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          {isSaved && <span className="flex items-center gap-1 text-green-600"><Check size={12} /> Đã lưu tự động</span>}
        </div>
        <div className="flex items-center gap-3">
          {!collabMode && (
            <Button type="button" variant="border" size="s" onClick={() => setCollabMode(true)} className="hidden sm:inline-flex text-blue-700 border-blue-200 hover:bg-blue-50">
              <Users size={14} /> Bật Collab mode
            </Button>
          )}
          <Button variant="border" size="m" onClick={handleSaveDraft}>
            <Save size={16} /> Lưu nháp
          </Button>
          <Button variant="primary" size="m" onClick={() => setIsPublishModalOpen(true)}>
            <Send size={16} /> {currentUser.role === 'manager' || currentUser.role === 'admin' ? 'Xuất bản' : 'Gửi duyệt'}
          </Button>
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
            <p className="text-xs font-semibold text-blue-700 flex items-center gap-1.5"><Users size={14} /> Collaborative editing demo mode</p>
            <button onClick={() => setCollabMode(false)} className="text-[11px] font-semibold text-blue-600 hover:text-blue-800" type="button">Ẩn</button>
          </div>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-blue-900">
            <div className="rounded-lg bg-white border border-blue-100 px-2.5 py-2">Huy đang chỉnh phần "Checklist release"</div>
            <div className="rounded-lg bg-white border border-blue-100 px-2.5 py-2">Mai để lại inline comment ở đoạn "Mục tiêu"</div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        {/* Left group: Format + Template */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1.5 bg-gray-50 border border-gray-200 rounded-xl">
            <span className="text-xs text-gray-400 px-2 hidden sm:inline">Markdown • <kbd className="px-1 py-0.5 bg-gray-200 rounded text-[10px] font-mono">/ai</kbd></span>
          </div>
          <Button variant="border" size="s" onClick={() => { if (!activeTemplateId && EDITOR_TEMPLATES.length > 0) setActiveTemplateId(EDITOR_TEMPLATES[0].id); setShowTemplates(true); }}>
            <FileText size={16} className="text-gray-500" /> Mẫu <ChevronDown size={14} className="text-gray-400" />
          </Button>
        </div>
        {/* Right group: AI tools */}
        <div className="flex items-center gap-2">
          <Button type="button" variant="dim" size="s" onClick={handleDraftFromBullets}>
            <Sparkles size={14} className="text-orange-300" /> AI dựng draft
          </Button>
          <button type="button" onClick={() => { setAiMode(!aiMode); if (!aiMode) setTimeout(() => aiTextareaRef.current?.focus(), 150); }}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${aiMode ? 'bg-orange-500 text-white border-orange-500 shadow-md' : 'border-orange-300 text-orange-600 hover:bg-orange-50'}`}>
            <Sparkles size={14} className={aiMode ? 'text-white' : 'text-orange-500'} />
            {aiMode ? 'AI bật' : 'AI mode'}
          </button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex gap-4 mt-1">
        {aiMode && (
          <EditorAIChatPanel
            messages={aiMessages} isTyping={aiIsTyping}
            input={aiInput} onInputChange={setAiInput}
            onSend={handleAiSend}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAiSend(); } }}
            onInsert={handleInsertFromAI}
            onClose={() => setAiMode(false)}
            messagesEndRef={aiMessagesEndRef} inputRef={aiTextareaRef}
          />
        )}

        <div className="flex-1 flex flex-col">
          <input type="text" placeholder="Tiêu đề bài viết..." value={title} onChange={e => setTitle(e.target.value)}
            className="text-4xl font-bold text-gray-900 placeholder:text-gray-300 border-none focus:ring-0 bg-transparent mb-4 outline-none w-full" />
          <div className="relative flex-1 editor-tiptap-container w-full" style={{ minHeight: '400px' }}>
            <NotionEditor room={initialData?.id || 'new-article-room'} placeholder="Bắt đầu viết nội dung bài viết..." onChange={html => setContent(html)} />
            {isStreaming && (
              <div className="absolute top-0 left-0 pointer-events-none text-gray-400 text-lg leading-relaxed whitespace-pre-wrap">
                <span className="opacity-0">{content}</span>
                <span className="bg-gradient-to-r from-orange-50 to-amber-50 text-orange-400 border-l-2 border-[#f76226] pl-1 animate-pulse">{ghostText}</span>
              </div>
            )}
            {showAiMenu && (
              <div className="absolute z-10 bg-white rounded-xl shadow-2xl border border-gray-200/80 w-60 overflow-hidden animate-scale-in" style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}>
                <div className="px-3 py-2.5 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100/50 text-xs font-semibold text-[#f76226] flex items-center gap-1.5">
                  <div className="p-0.5 bg-gradient-to-br from-[#f76226] to-orange-400 rounded text-white"><Sparkles size={10} /></div> iWiki AI Assistant
                </div>
                <div className="p-1">
                  {[{ id: 'outline', label: 'Tạo dàn ý', icon: AlignLeft }, { id: 'rewrite', label: 'Viết lại rõ ràng hơn', icon: Type }, { id: 'summarize', label: 'Tóm tắt nội dung', icon: AlignLeft }, { id: 'table', label: 'Chuyển thành bảng', icon: Table }, { id: 'translate', label: 'Dịch sang tiếng Anh', icon: Languages }].map(item => {
                    const Icon = item.icon;
                    return <button key={item.id} onClick={() => handleAiAction(item.id)} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent hover:text-[#f76226] rounded-lg transition-all text-left"><Icon size={16} />{item.label}</button>;
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Outline Panel */}
        <div className="hidden lg:flex w-[220px] shrink-0">
          <div className="h-full w-full rounded-2xl border border-gray-200 bg-white/60 px-3 py-3 flex flex-col">
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Mục lục</p>
            <div className="flex-1 overflow-y-auto custom-scrollbar text-[12px] leading-relaxed">
              {headings.length === 0 ? (
                <p className="text-gray-400">Dùng các thẻ <code className="px-1 py-0.5 bg-gray-100 rounded">#</code>, <code className="px-1 py-0.5 bg-gray-100 rounded">##</code>, <code className="px-1 py-0.5 bg-gray-100 rounded">###</code> để tạo mục lục tự động.</p>
              ) : (
                <ul className="space-y-1">
                  {headings.map(h => <li key={h.id} className={`text-gray-700 cursor-default ${h.level === 1 ? 'font-semibold' : h.level === 2 ? 'pl-3' : 'pl-5 text-gray-500'}`}>{h.text}</li>)}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {isPublishModalOpen && (
        <EditorPublishModal
          allFolders={allFolders} selectedFolderId={selectedFolderId} onFolderChange={setSelectedFolderId}
          tags={tags} tagInput={tagInput} onTagInputChange={setTagInput} onTagKeyDown={handleAddTag}
          onRemoveTag={tag => setTags(tags.filter(t => t !== tag))}
          viewPermission={viewPermission} onViewPermissionChange={setViewPermission}
          allowComments={allowComments} onAllowCommentsChange={setAllowComments}
          isPublishing={isPublishing} isEditing={isEditing} canPublish={!!selectedFolderId}
          onPublish={handlePublish} onClose={() => setIsPublishModalOpen(false)}
        />
      )}

      {showTemplates && (
        <EditorTemplateModal
          templates={EDITOR_TEMPLATES} activeTemplateId={activeTemplateId}
          onSelectTemplate={setActiveTemplateId}
          onApplyTemplate={content => { setContent(content); setShowTemplates(false); addToast('Đã áp dụng mẫu thành công', 'success'); }}
          onApplyWithAI={content => { setContent(content); setShowTemplates(false); addToast('Đã áp dụng mẫu thành công', 'success'); handleAiAction('outline'); }}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </div>
  );
}
