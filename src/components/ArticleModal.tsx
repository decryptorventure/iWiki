import React, { useState, useEffect, useRef } from 'react';
import { X, Heart, MessageSquare, Share2, Eye, Bookmark, Send, ArrowUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../App';
import { Article } from '../store/useAppStore';

// Simple Markdown renderer
function MarkdownContent({ content }: { content: string }) {
  const lines = content.split('\n');
  return (
    <div className="prose prose-sm md:prose-base max-w-none text-gray-700 leading-relaxed">
      {lines.map((line, i) => {
        if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold text-gray-900 mt-6 mb-3">{line.slice(2)}</h1>;
        if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-gray-900 mt-5 mb-2">{line.slice(3)}</h2>;
        if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-semibold text-gray-900 mt-4 mb-2">{line.slice(4)}</h3>;
        if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="ml-4 text-gray-700 mb-1">{renderInline(line.slice(2))}</li>;
        if (line.match(/^\d+\. /)) return <li key={i} className="ml-4 list-decimal text-gray-700 mb-1">{renderInline(line.replace(/^\d+\. /, ''))}</li>;
        if (line.startsWith('> ')) return <blockquote key={i} className="border-l-4 border-[#FF6B4A] pl-4 italic text-gray-600 my-3">{line.slice(2)}</blockquote>;
        if (line.startsWith('```') || line === '') return <br key={i} />;
        if (line.startsWith('| ')) {
          const cells = line.split('|').filter(c => c.trim());
          return <div key={i} className="flex gap-0 border-b border-gray-100">{cells.map((c, j) => <span key={j} className="flex-1 px-3 py-2 text-sm text-gray-700 border-r border-gray-100 last:border-r-0">{c.trim()}</span>)}</div>;
        }
        return <p key={i} className="mb-3 text-gray-700">{renderInline(line)}</p>;
      })}
    </div>
  );
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*')) return <em key={i} className="italic">{part.slice(1, -1)}</em>;
    if (part.startsWith('`') && part.endsWith('`')) return <code key={i} className="px-1.5 py-0.5 bg-gray-100 text-orange-600 rounded text-sm font-mono">{part.slice(1, -1)}</code>;
    return part;
  });
}

interface ArticleModalProps {
  open: boolean;
  article: Article | null;
  onOpenChange: (open: boolean) => void;
}

export function ArticleModal({ open, article, onOpenChange }: ArticleModalProps) {
  const { state, dispatch } = useApp();
  const { addToast } = useToast();
  const { currentUser } = state;
  const [comment, setComment] = useState('');
  const [bookmarked, setBookmarked] = useState(false);
  const commentRef = useRef<HTMLTextAreaElement>(null);

  const isLiked = article ? article.likedBy.includes(currentUser.id) : false;

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
    dispatch({ type: 'TOGGLE_LIKE', articleId: article.id, userId: currentUser.id });
    if (!isLiked) {
      addToast('Đã thích bài viết! ❤️', 'success');
    }
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
    dispatch({
      type: 'ADD_COMMENT',
      articleId: article.id,
      comment: {
        id: `c-${Date.now()}`,
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorAvatar: currentUser.avatar,
        content: comment.trim(),
        createdAt: new Date().toISOString().split('T')[0],
      }
    });
    setComment('');
    addToast('Đã đăng bình luận', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4 animate-modal-backdrop" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={(e) => { if (e.target === e.currentTarget) onOpenChange(false); }}>
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden animate-modal-enter relative">
        {/* Cover Image */}
        {article.coverUrl && (
          <div className="h-56 overflow-hidden relative group">
            <img src={article.coverUrl} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        )}

        {/* Close Button */}
        <button onClick={() => onOpenChange(false)} className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white rounded-full transition-all duration-200 shadow-md active:scale-90 z-10">
          <X size={20} />
        </button>

        <div className="p-8">
          {/* Author & Meta */}
          <div className="flex items-center gap-3 mb-4">
            <img src={article.author.avatar || `https://picsum.photos/seed/${article.author.id}/100/100`} alt="Avatar" className="w-10 h-10 rounded-full ring-2 ring-[#FF6B4A]/20" referrerPolicy="no-referrer" />
            <div>
              <div className="text-sm font-bold text-gray-900">{article.author.name}</div>
              <div className="text-xs text-gray-500">{article.author.role} · {article.createdAt}</div>
            </div>
          </div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.map(tag => (
                <span key={tag} className="px-2.5 py-1 bg-orange-50 text-[#FF6B4A] text-xs font-medium rounded-full">{tag}</span>
              ))}
            </div>
          )}

          {/* Title */}
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6 leading-snug">{article.title}</h2>

          {/* Content */}
          <div className="mb-8">
            {article.content ? (
              <MarkdownContent content={article.content} />
            ) : (
              <p className="text-gray-500 italic">Nội dung bài viết đang được cập nhật...</p>
            )}
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between py-4 border-t border-b border-gray-100 mb-6">
            <div className="flex items-center gap-4">
              <button onClick={handleLike} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 ${isLiked ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'}`}>
                <Heart size={18} className={isLiked ? 'fill-current' : ''} />
                {article.likes} Thích
              </button>
              <button onClick={() => commentRef.current?.focus()} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 active:scale-95">
                <MessageSquare size={18} />
                {article.comments.length} Bình luận
              </button>
              <button onClick={() => { setBookmarked(!bookmarked); addToast(bookmarked ? 'Đã bỏ lưu' : 'Đã lưu bài viết 📌', 'info'); }} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 ${bookmarked ? 'bg-yellow-50 text-yellow-600 border border-yellow-200' : 'bg-gray-100 text-gray-600 hover:bg-yellow-50 hover:text-yellow-600'}`}>
                <Bookmark size={18} className={bookmarked ? 'fill-current' : ''} />
              </button>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Eye size={14} /> {article.views}</span>
              <button onClick={handleShare} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition-all duration-200 active:scale-95"><Share2 size={14} /> Chia sẻ</button>
            </div>
          </div>

          {/* Comments */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Bình luận ({article.comments.length})</h3>

            {/* Comment Input */}
            {article.allowComments && (
              <div className="flex gap-3 mb-6">
                <img src={currentUser.avatar} alt="Me" className="w-8 h-8 rounded-full ring-2 ring-[#FF6B4A]/20 shrink-0" referrerPolicy="no-referrer" />
                <div className="flex-1 relative">
                  <textarea
                    ref={commentRef}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Viết bình luận của bạn..."
                    className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A]/50 outline-none resize-none transition-all duration-200 hover:border-gray-300"
                    rows={2}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmitComment(); } }}
                  />
                  <button onClick={handleSubmitComment} disabled={!comment.trim()} className={`absolute bottom-3 right-3 p-1.5 rounded-lg transition-all duration-200 active:scale-90 ${comment.trim() ? 'bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6A] text-white shadow-sm hover:shadow-md' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                    <Send size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {article.comments.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
              ) : (
                article.comments.map((c) => (
                  <div key={c.id} className="flex gap-3 group">
                    <img src={c.authorAvatar || `https://picsum.photos/seed/${c.authorId}/100/100`} alt={c.authorName} className="w-8 h-8 rounded-full ring-1 ring-gray-100 shrink-0" referrerPolicy="no-referrer" />
                    <div className="flex-1 bg-gray-50 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-gray-900">{c.authorName}</span>
                        <span className="text-xs text-gray-400">{c.createdAt}</span>
                      </div>
                      <p className="text-sm text-gray-700">{c.content}</p>
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
