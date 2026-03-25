import React, { useState, useEffect, useRef } from 'react';
import { X, Flame, MessageSquare, Share2, Eye, Bookmark, Send, Sparkles, Clock, Maximize2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../App';
import { useArticleActions } from '../hooks/use-article-actions';
import { Article } from '../store/useAppStore';
import { Button } from '@frontend-team/ui-kit';

import ArticleMarkdownRenderer from './article-markdown-renderer';

interface ArticleModalProps {
  open: boolean;
  article: Article | null;
  onOpenChange: (open: boolean) => void;
}

export function ArticleModal({ open, article, onOpenChange }: ArticleModalProps) {
  const { state, dispatch } = useApp();
  const { addToast } = useToast();
  const { currentUser } = state;
  const actions = useArticleActions(article?.id ?? '');
  const { isLiked, isFavorited: bookmarked } = actions;
  const [comment, setComment] = useState('');
  const commentRef = useRef<HTMLTextAreaElement>(null);

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
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4 animate-modal-backdrop" style={{ background: 'var(--ds-bg-overlay)' }} onClick={(e) => { if (e.target === e.currentTarget) onOpenChange(false); }}>
      <div className="bg-[var(--ds-bg-primary)] rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden animate-modal-enter relative flex flex-col md:flex-row max-h-[90vh]">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          {/* Cover Image */}
          {article.coverUrl && (
            <div className="h-48 md:h-64 overflow-hidden relative group">
              <img src={article.coverUrl} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          )}

        {/* Close Button */}
        <Button variant="subtle" size="icon-m" onClick={() => onOpenChange(false)} className="absolute top-4 right-4 bg-[var(--ds-bg-primary)]/90 backdrop-blur-sm shadow-md z-10">
          <X size={20} />
        </Button>

            <div className="p-8 md:p-12">
            {/* Meta Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-[var(--ds-border-secondary)]">
              <div className="flex items-center gap-4">
                <img src={article.author.avatar || `https://picsum.photos/seed/${article.author.id}/100/100`} alt="Avatar" className="w-12 h-12 rounded-2xl shadow-sm object-cover ring-2 ring-[var(--ds-border-tertiary)] shrink-0" referrerPolicy="no-referrer" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[var(--ds-text-primary)] text-base">{article.author.name}</span>
                    <span className="px-2 py-0.5 bg-[var(--ds-bg-accent-primary-subtle)] text-[var(--ds-fg-accent-primary)] text-[10px] font-bold rounded-md uppercase tracking-wider">{article.author.role}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--ds-text-secondary)] mt-1">
                    <span className="flex items-center gap-1"><Clock size={14}/> {article.createdAt}</span>
                    <span>•</span>
                    <span>{article.folderName}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="subtle" size="icon-m" onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'article-detail' })} title="Xem toàn trang"><Maximize2 size={20} /></Button>
                <Button variant="subtle" size="icon-m" onClick={handleShare} title="Chia sẻ"><Share2 size={20} /></Button>
                <Button
                  variant="subtle"
                  size="icon-m"
                  onClick={() => { actions.toggleFavorite(); addToast(bookmarked ? 'Đã bỏ lưu' : 'Đã lưu bài viết 📌', 'info'); }}
                  className={bookmarked ? 'bg-[var(--ds-bg-accent-primary-subtle)] text-[var(--ds-fg-accent-primary)]' : ''}
                  title="Lưu bài viết"
                >
                  <Bookmark size={20} className={bookmarked ? 'fill-current' : ''} />
                </Button>
              </div>
            </div>

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-[var(--ds-bg-accent-primary-subtle)] hover:bg-[var(--ds-bg-accent-primary-hover)] text-[var(--ds-fg-accent-primary)] text-xs font-bold rounded-lg border border-[var(--ds-border-accent-primary-subtle)] cursor-pointer transition-colors">#{tag}</span>
                ))}
              </div>
            )}

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-black text-[var(--ds-text-primary)] mb-8 leading-tight tracking-tight">{article.title}</h1>

          {/* Personalized Badge Mock */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--ds-bg-info-subtle)] border border-[var(--ds-border-info-subtle)] text-[var(--ds-fg-info)] rounded-2xl text-xs font-bold mb-10 shadow-sm">
            <Sparkles size={14} className="animate-pulse" /> Gợi ý riêng cho {currentUser.role} • iWiki AI
          </div>

          {/* Content */}
          <div className="mb-8">
            {article.content ? (
              <ArticleMarkdownRenderer content={article.content} />
            ) : (
              <p className="text-[var(--ds-text-tertiary)] italic">Nội dung bài viết đang được cập nhật...</p>
            )}
          </div>

          {/* Action Footer Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-6 border-t border-[var(--ds-border-tertiary)] mb-10 gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant={isLiked ? 'primary' : 'border'}
                onClick={handleLike}
                className={isLiked ? '' : 'hover:border-[var(--ds-border-accent-primary)] hover:text-[var(--ds-fg-accent-primary)]'}
              >
                <Flame size={20} className={isLiked ? 'fill-current animate-bounce' : 'text-[var(--ds-fg-accent-primary)]'} />
                {isLiked ? 'Đã Thắp Lửa' : 'Thắp Lửa'}
                <span className={`ml-1 ${isLiked ? 'text-[var(--ds-fg-on-contrast)]' : 'text-[var(--ds-text-secondary)]'}`}>{article.likes}</span>
              </Button>

              <Button variant="border" onClick={() => commentRef.current?.focus()} className="hover:border-[var(--ds-border-info)] hover:text-[var(--ds-fg-info)]">
                <MessageSquare size={20} className="text-[var(--ds-fg-info)]" />
                Bình thảo luận
                <span className="ml-1 text-[var(--ds-text-secondary)] font-medium">{article.comments.length}</span>
              </Button>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm font-medium text-[var(--ds-text-tertiary)]">
                <Eye size={18} />
                <span>{article.views.toLocaleString()} lượt đọc</span>
              </div>
            </div>
          </div>

          {/* Comments */}
          <div>
            <h3 className="text-lg font-bold text-[var(--ds-text-primary)] mb-4">Bình luận ({article.comments.length})</h3>

            {/* Comment Input */}
            {article.allowComments && (
              <div className="flex gap-3 mb-6">
                <img src={currentUser.avatar} alt="Me" className="w-8 h-8 rounded-full ring-2 ring-[var(--ds-bg-accent-primary-subtle)] shrink-0" referrerPolicy="no-referrer" />
                <div className="flex-1 relative">
                  <textarea
                    ref={commentRef}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Viết bình luận của bạn..."
                    className="w-full px-4 py-3 pr-12 bg-[var(--ds-bg-secondary)] border border-[var(--ds-border-secondary)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--ds-bg-accent-primary-subtle)] focus:border-[var(--ds-border-accent-primary)] outline-none resize-none transition-all duration-200 hover:border-[var(--ds-border-tertiary)]"
                    rows={2}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmitComment(); } }}
                  />
                  <button onClick={handleSubmitComment} disabled={!comment.trim()} className={`absolute bottom-3 right-3 p-1.5 rounded-lg transition-all duration-200 active:scale-90 ${comment.trim() ? 'bg-[var(--ds-bg-accent-primary)] text-[var(--ds-fg-on-contrast)] shadow-sm hover:shadow-md' : 'bg-[var(--ds-bg-secondary)] text-[var(--ds-text-secondary)] cursor-not-allowed'}`}>
                    <Send size={16} />
                  </button>
                </div>
              </div>
            )}

              {article.comments.length === 0 ? (
                <div className="text-center py-6 bg-[var(--ds-bg-secondary)] rounded-2xl border border-[var(--ds-border-tertiary)] border-dashed">
                  <MessageSquare size={24} className="mx-auto text-[var(--ds-text-tertiary)]/50 mb-2" />
                  <p className="text-[var(--ds-text-tertiary)] text-sm font-medium">Chưa có bình luận nào. Hãy là người đầu tiên thảo luận!</p>
                </div>
              ) : (
                article.comments.map((c) => (
                  <div key={c.id} className="flex gap-3 group">
                    <img src={c.authorAvatar || `https://picsum.photos/seed/${c.authorId}/100/100`} alt={c.authorName} className="w-8 h-8 rounded-full ring-1 ring-[var(--ds-border-tertiary)] shrink-0 mt-1" referrerPolicy="no-referrer" />
                    <div className="flex-1 bg-[var(--ds-bg-secondary)] rounded-2xl px-5 py-4 border border-[var(--ds-border-secondary)]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-bold text-[var(--ds-text-primary)]">{c.authorName}</span>
                        <span className="text-[10px] text-[var(--ds-text-secondary)] font-medium px-2 py-0.5 bg-[var(--ds-bg-primary)] rounded-md border border-[var(--ds-border-secondary)]">{c.createdAt}</span>
                      </div>
                      <p className="text-sm text-[var(--ds-text-secondary)] leading-relaxed">{c.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
