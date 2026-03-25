import React, { useState, useEffect, useRef } from 'react';
import { X, Flame, MessageSquare, Share2, Eye, Bookmark, Send, Sparkles, Clock, ChevronRight, Maximize2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../App';
import { useArticleActions } from '../hooks/use-article-actions';
import { Article } from '../store/useAppStore';

import ArticleMarkdownRenderer from './article-markdown-renderer';

interface ArticleModalProps {
  open: boolean;
  article: Article | null;
  onOpenChange: (open: boolean) => void;
}

export function ArticleModal({ open, article, onOpenChange }: ArticleModalProps) {
  const { state, dispatch } = useApp();
  const { addToast } = useToast();
  const { articles, currentUser } = state;
  const actions = useArticleActions(article?.id ?? '');
  const { isLiked, isFavorited: bookmarked } = actions;
  const [comment, setComment] = useState('');
  const commentRef = useRef<HTMLTextAreaElement>(null);

  // Lấy các bài viết liên quan (Mock: cùng thư mục hoặc cùng tác giả, loại trừ bài hiện tại)
  const relatedArticles = article
    ? articles.filter(a => a.id !== article.id && (a.folderId === article.folderId || a.author.id === article.author.id)).slice(0, 3)
    : [];

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onOpenChange(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onOpenChange]);

  if (!open || !article) return null;

  const handleLike = () => {
    actions.toggleLike();
    if (!isLiked) addToast('Đã thắp lửa cho bài viết! 🔥', 'success');
  };

  const handleShare = () => {
    const text = `${article.title} — iWiki iKame`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => addToast('Đã sao chép liên kết', 'success'));
    } else {
      addToast('Đã sao chép liên kết', 'success');
    }
  };

  const handleSubmitComment = () => {
    if (!comment.trim()) return;
    actions.addComment(comment.trim());
    setComment('');
    addToast('Đã đăng bình luận', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4 animate-modal-backdrop" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={(e) => { if (e.target === e.currentTarget) onOpenChange(false); }}>
      <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden animate-modal-enter relative flex flex-col md:flex-row max-h-[90vh]">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          {/* Cover Image */}
          {article.coverUrl && (
            <div className="h-48 md:h-64 overflow-hidden relative group">
              <img src={article.coverUrl} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          )}

        {/* Close Button */}
        <button onClick={() => onOpenChange(false)} className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white rounded-full transition-all duration-200 shadow-md active:scale-90 z-10">
          <X size={20} />
        </button>

            <div className="p-8 md:p-12">
            {/* Meta Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <img src={article.author.avatar || `https://picsum.photos/seed/${article.author.id}/100/100`} alt="Avatar" className="w-12 h-12 rounded-2xl shadow-sm object-cover ring-2 ring-gray-50 shrink-0" referrerPolicy="no-referrer" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-base">{article.author.name}</span>
                    <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-bold rounded-md uppercase tracking-wider">{article.author.role}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                    <span className="flex items-center gap-1"><Clock size={14}/> {article.createdAt}</span>
                    <span>•</span>
                    <span>{article.folderName}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'article-detail' })} className="p-2.5 hover:bg-gray-100 text-gray-500 rounded-xl transition-all active:scale-90" title="Xem toàn trang"><Maximize2 size={20} /></button>
                <button onClick={handleShare} className="p-2.5 hover:bg-gray-100 text-gray-500 rounded-xl transition-all active:scale-90" title="Chia sẻ"><Share2 size={20} /></button>
                <button
                  onClick={() => {
                    actions.toggleFavorite();
                    addToast(bookmarked ? 'Đã bỏ lưu' : 'Đã lưu bài viết 📌', 'info');
                  }}
                  className={`p-2.5 rounded-xl transition-all active:scale-90 ${bookmarked ? 'bg-orange-50 text-orange-600' : 'hover:bg-gray-100 text-gray-500'}`}
                  title="Lưu bài viết"
                >
                  <Bookmark size={20} className={bookmarked ? 'fill-current' : ''} />
                </button>
              </div>
            </div>

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-orange-50/80 hover:bg-orange-100 text-[#f76226] text-xs font-bold rounded-lg border border-orange-100/50 cursor-pointer transition-colors">#{tag}</span>
                ))}
              </div>
            )}

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-8 leading-tight tracking-tight">{article.title}</h1>

          {/* Personalized Badge Mock */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 text-blue-700 rounded-2xl text-xs font-bold mb-10 shadow-sm">
            <Sparkles size={14} className="animate-pulse" /> Gợi ý riêng cho {currentUser.role} • iWiki AI
          </div>

          {/* Content */}
          <div className="mb-8">
            {article.content ? (
              <ArticleMarkdownRenderer content={article.content} />
            ) : (
              <p className="text-gray-500 italic">Nội dung bài viết đang được cập nhật...</p>
            )}
          </div>

          {/* Action Footer Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-6 border-t border-gray-100 mb-10 gap-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={handleLike} 
                className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 active:scale-95 shadow-sm hover:shadow-md ${isLiked ? 'bg-orange-500 text-white shadow-orange-200' : 'bg-white border border-gray-200 text-gray-700 hover:border-orange-200 hover:text-orange-600'}`}
              >
                <Flame size={20} className={isLiked ? 'fill-current animate-bounce' : 'text-orange-500'} />
                {isLiked ? 'Đã Thắp Lửa' : 'Thắp Lửa'}
                <span className={`ml-1 ${isLiked ? 'text-white/90' : 'text-gray-400'}`}>{article.likes}</span>
              </button>
              
              <button onClick={() => commentRef.current?.focus()} className="flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-bold bg-white border border-gray-200 text-gray-700 hover:border-blue-200 hover:text-blue-600 transition-all duration-300 active:scale-95 shadow-sm">
                <MessageSquare size={20} className="text-blue-500" />
                Bình thảo luận
                <span className="ml-1 text-gray-400 font-medium">{article.comments.length}</span>
              </button>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
                <Eye size={18} />
                <span>{article.views.toLocaleString()} lượt đọc</span>
              </div>
            </div>
          </div>

          {/* Comments */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Bình luận ({article.comments.length})</h3>

            {/* Comment Input */}
            {article.allowComments && (
              <div className="flex gap-3 mb-6">
                <img src={currentUser.avatar} alt="Me" className="w-8 h-8 rounded-full ring-2 ring-[#f76226]/20 shrink-0" referrerPolicy="no-referrer" />
                <div className="flex-1 relative">
                  <textarea
                    ref={commentRef}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Viết bình luận của bạn..."
                    className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#f76226]/20 focus:border-[#f76226]/50 outline-none resize-none transition-all duration-200 hover:border-gray-300"
                    rows={2}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmitComment(); } }}
                  />
                  <button onClick={handleSubmitComment} disabled={!comment.trim()} className={`absolute bottom-3 right-3 p-1.5 rounded-lg transition-all duration-200 active:scale-90 ${comment.trim() ? 'bg-gradient-to-r from-[#f76226] to-[#FF8A6A] text-white shadow-sm hover:shadow-md' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                    <Send size={16} />
                  </button>
                </div>
              </div>
            )}

              {article.comments.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                  <MessageSquare size={24} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-400 text-sm font-medium">Chưa có bình luận nào. Hãy là người đầu tiên thảo luận!</p>
                </div>
              ) : (
                article.comments.map((c) => (
                  <div key={c.id} className="flex gap-3 group">
                    <img src={c.authorAvatar || `https://picsum.photos/seed/${c.authorId}/100/100`} alt={c.authorName} className="w-8 h-8 rounded-full ring-1 ring-gray-100 shrink-0 mt-1" referrerPolicy="no-referrer" />
                    <div className="flex-1 bg-gray-50/80 rounded-2xl px-5 py-4 border border-gray-100">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-bold text-gray-900">{c.authorName}</span>
                        <span className="text-[10px] text-gray-400 font-medium px-2 py-0.5 bg-white rounded-md border border-gray-100">{c.createdAt}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{c.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        {/* Right Sidebar: Knowledge Context (Related Articles) */}
        <div className="w-full md:w-80 bg-gray-50 border-l border-gray-100 flex flex-col overflow-y-auto custom-scrollbar">
          <div className="p-6 sticky top-0 bg-gray-50/90 backdrop-blur-md z-10 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2 uppercase tracking-wide">
              <Sparkles size={16} className="text-orange-500" />
              Liên kết Tri thức
            </h3>
          </div>
          
          <div className="p-6 space-y-6 flex-1">
            {/* Outline / Mục lục (Giả lập) */}
            <div className="space-y-3">
               <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mục lục</h4>
               <ul className="space-y-2 text-sm">
                 <li className="text-orange-600 font-bold border-l-2 border-orange-500 pl-3">Performance Checkpoint tại iKame</li>
                 <li className="text-gray-500 hover:text-gray-900 pl-3 cursor-pointer transition-colors border-l-2 border-transparent">Quy trình triển khai</li>
                 <li className="text-gray-500 hover:text-gray-900 pl-3 cursor-pointer transition-colors border-l-2 border-transparent">Tiêu chí đánh giá</li>
                 <li className="text-gray-500 hover:text-gray-900 pl-3 cursor-pointer transition-colors border-l-2 border-transparent">Lưu ý quan trọng</li>
               </ul>
            </div>

            <hr className="border-gray-200/60" />

            {/* Thống kê đóng góp (Mock) */}
             <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
               <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Đóng góp & Cập nhật</h4>
               <p className="text-sm text-gray-900 mb-1">Cập nhật lần cuối: <span className="font-bold">{article.updatedAt}</span></p>
               <p className="text-xs text-gray-500">Bởi: {article.author.name}</p>
             </div>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mở rộng tri thức</h4>
                <div className="space-y-4">
                  {relatedArticles.map(ral => (
                    <div key={ral.id} className="group cursor-pointer bg-white p-3 rounded-xl border border-transparent hover:border-orange-100 hover:shadow-sm transition-all duration-300">
                       <h5 className="text-sm font-bold text-gray-800 leading-snug group-hover:text-orange-600 transition-colors line-clamp-2 mb-2">{ral.title}</h5>
                       <div className="flex items-center justify-between text-[10px] text-gray-400">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1"><Eye size={12}/> {ral.views}</span>
                            <span>•</span>
                            <span className="font-medium">{ral.author.name}</span>
                          </div>
                          <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
  );
}
