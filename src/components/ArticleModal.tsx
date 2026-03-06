import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../App';
import { Eye, X, Heart, MessageSquare, Send, Bookmark, ChevronRight } from 'lucide-react';
import { Article } from '../store/useAppStore';
import { AnimatePresence, motion } from 'motion/react';

// Lightweight markdown renderer
function MarkdownContent({ content }: { content: string }) {
  const renderLine = (line: string, i: number) => {
    if (line.startsWith('# ')) return <h1 key={i} className="text-xl font-bold text-gray-900 mt-4 mb-2">{line.slice(2)}</h1>;
    if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-semibold text-gray-900 mt-3 mb-1.5">{line.slice(3)}</h2>;
    if (line.startsWith('### ')) return <h3 key={i} className="text-base font-semibold text-gray-800 mt-2 mb-1">{line.slice(4)}</h3>;
    if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="ml-4 text-gray-700 list-disc">{line.slice(2)}</li>;
    if (/^\d+\./.test(line)) return <li key={i} className="ml-4 text-gray-700 list-decimal">{line.replace(/^\d+\.\s/, '')}</li>;
    if (line.startsWith('> ')) return <blockquote key={i} className="border-l-2 border-orange-400 pl-3 py-1 bg-orange-50 text-gray-600 text-sm my-2 rounded-r">{line.slice(2)}</blockquote>;
    if (line.startsWith('---')) return <hr key={i} className="border-gray-200 my-3" />;
    if (!line.trim()) return <div key={i} className="h-2" />;

    // Inline formatting
    const formatted = line
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded text-sm text-gray-800">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-orange-500 underline">$1</a>');

    return <p key={i} className="text-gray-700 leading-relaxed mb-1 text-[15px]" dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  const lines = content.split('\n');
  return <div className="space-y-0.5">{lines.map((line, i) => renderLine(line, i))}</div>;
}

// Simple Table of Contents
function TOC({ content }: { content: string }) {
  const headings = content.split('\n')
    .filter(l => l.startsWith('## ') || l.startsWith('### '))
    .map((l, i) => ({
      id: i,
      level: l.startsWith('### ') ? 3 : 2,
      text: l.replace(/^## |^### /, '')
    }));

  if (headings.length === 0) return null;

  return (
    <div className="sticky top-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Mục lục</p>
      <nav className="space-y-1">
        {headings.map(h => (
          <button
            key={h.id}
            className={`block text-left w-full text-sm text-orange-500 hover:text-orange-700 transition-colors leading-snug ${h.level === 3 ? 'pl-3' : ''}`}
          >
            {h.level}. {h.text}
          </button>
        ))}
      </nav>
    </div>
  );
}

interface Props {
  open: boolean;
  article: Article | null;
  onOpenChange: (open: boolean) => void;
}

export function ArticleModal({ open, article, onOpenChange }: Props) {
  const { state, dispatch } = useApp();
  const { addToast } = useToast();
  const { currentUser } = state;
  const [comment, setComment] = useState('');
  const [bookmarked, setBookmarked] = useState(false);

  if (!article) return null;

  const isLiked = article.likedBy.includes(currentUser.id);

  const handleLike = () => {
    dispatch({ type: 'LIKE_ARTICLE', articleId: article.id, userId: currentUser.id });
    addToast(isLiked ? 'Đã bỏ thích' : 'Đã thích bài viết! ❤️', isLiked ? 'info' : 'success');
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
        createdAt: new Date().toLocaleDateString('vi-VN'),
      }
    });
    setComment('');
    addToast('Đã gửi bình luận!', 'success');
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-black/40"
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="relative bg-white rounded-lg w-full max-w-5xl shadow-xl my-4 overflow-hidden"
          >
            {/* Cover Image */}
            {article.coverUrl && (
              <div className="w-full h-48 overflow-hidden">
                <img src={article.coverUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            )}

            {/* Header */}
            <div className="px-8 pt-6 pb-4 border-b border-gray-100">
              {/* Breadcrumb */}
              <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                <span>Trang chủ</span>
                <ChevronRight size={12} />
                <span>{article.folderName || 'Thư mục'}</span>
                <ChevronRight size={12} />
                <span className="text-gray-600 truncate">{article.title}</span>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-4">{article.title}</h1>

              {/* Author + Meta */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={article.author.avatar} className="w-8 h-8 rounded-full border border-gray-200" referrerPolicy="no-referrer" />
                  <div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-gray-900">{article.author.name}</span>
                      <span className="text-gray-300">·</span>
                      <span className="text-gray-500">{article.author.role}</span>
                      <span className="text-gray-300">·</span>
                      <span className="text-gray-400 text-xs">{article.createdAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <span className="flex items-center gap-1"><Eye size={14} /> {article.views}</span>
                  <span className="flex items-center gap-1"><Heart size={14} /> {article.likes}</span>
                  <span className="flex items-center gap-1"><MessageSquare size={14} /> {article.comments.length}</span>
                  <button onClick={() => setBookmarked(!bookmarked)} className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${bookmarked ? 'text-orange-500' : ''}`}>
                    <Bookmark size={16} fill={bookmarked ? 'currentColor' : 'none'} />
                  </button>
                  <button onClick={() => onOpenChange(false)} className="p-1.5 rounded hover:bg-gray-100 transition-colors">
                    <X size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex">
              {/* Left sidebar (summary) */}
              {article.excerpt && (
                <div className="w-48 shrink-0 p-6 border-r border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 mb-2">Tóm tắt</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{article.excerpt}</p>
                </div>
              )}

              {/* Main Content */}
              <div className="flex-1 px-8 py-6 min-w-0">
                {article.content ? (
                  <MarkdownContent content={article.content} />
                ) : (
                  <p className="text-gray-400 text-sm">Nội dung đang được cập nhật...</p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-100">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${isLiked
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                      }`}
                  >
                    <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
                    {isLiked ? 'Đã thích' : 'Thích'} {article.likes > 0 && `(${article.likes})`}
                  </button>
                </div>

                {/* Comments */}
                {article.allowComments && (
                  <div className="mt-8">
                    <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <MessageSquare size={16} className="text-gray-400" />
                      Bình luận ({article.comments.length})
                    </h3>

                    {/* Input */}
                    <div className="flex gap-3 mb-6">
                      <img src={currentUser.avatar} className="w-8 h-8 rounded-full border border-gray-200 shrink-0" referrerPolicy="no-referrer" />
                      <div className="flex-1 relative">
                        <textarea
                          value={comment}
                          onChange={e => setComment(e.target.value)}
                          placeholder="Viết bình luận của bạn..."
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 min-h-[80px]"
                        />
                        <button
                          onClick={handleSubmitComment}
                          disabled={!comment.trim()}
                          className={`absolute bottom-3 right-3 p-2 rounded-md transition-colors ${comment.trim() ? 'text-orange-500 hover:bg-orange-50' : 'text-gray-300 cursor-not-allowed'
                            }`}
                        >
                          <Send size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Comment list */}
                    <div className="space-y-4">
                      {article.comments.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-6">Hãy là người đầu tiên bình luận</p>
                      ) : (
                        article.comments.map(c => (
                          <div key={c.id} className="flex gap-3">
                            <img src={c.authorAvatar} className="w-8 h-8 rounded-full border border-gray-200 shrink-0" referrerPolicy="no-referrer" />
                            <div className="flex-1 bg-gray-50 rounded-lg px-4 py-3">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-gray-900">{c.authorName}</span>
                                <span className="text-xs text-gray-400">{c.createdAt}</span>
                              </div>
                              <p className="text-sm text-gray-700">{c.content}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* TOC Sidebar */}
              {article.content && (
                <div className="w-48 shrink-0 p-6 border-l border-gray-100">
                  <TOC content={article.content} />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
