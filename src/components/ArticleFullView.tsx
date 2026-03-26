import React, { useState, useRef } from 'react';
import { Flame, MessageSquare, Share2, Eye, Bookmark, Send, ChevronRight, ArrowLeft, Edit3, UserPlus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../App';
import { useArticleActions } from '../hooks/use-article-actions';
import ArticleMarkdownRenderer from './article-markdown-renderer';
import { ArticleToc } from './article-toc';
import { Button, Textarea, Badge } from '@frontend-team/ui-kit';
import { Bot, Share2 as ShareIcon } from 'lucide-react';
import SharingModal from './SharingModal';

export default function ArticleFullView() {
  const { state, dispatch } = useApp();
  const { addToast } = useToast();
  const { articles, currentUser, selectedArticleId } = state;
  const article = articles.find(a => a.id === selectedArticleId);
  const actions = useArticleActions(selectedArticleId ?? '');
  const { isLiked, isFavorited: bookmarked } = actions;

  const [comment, setComment] = useState('');
  const [isSharingModalOpen, setIsSharingModalOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const commentRef = useRef<HTMLTextAreaElement>(null);

  const goHome = () => {
    dispatch({ type: 'SET_SCREEN', screen: 'dashboard' });
    dispatch({ type: 'SET_SELECTED_ARTICLE', articleId: null });
  };

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <Bot size={48} className="mb-4 opacity-20" />
        <p>Không tìm thấy bài viết hoặc bài viết đã bị xóa.</p>
        <Button
          variant="subtle"
          size="s"
          onClick={goHome}
          className="mt-4 text-orange-600 font-bold hover:underline border-none shadow-none"
        >
          Quay lại Trang chủ
        </Button>
      </div>
    );
  }

  const handleLike = () => {
    actions.toggleLike();
    if (!isLiked) addToast('Đã thắp lửa cho bài viết! 🔥', 'success');
  };

  const submitComment = () => {
    if (!comment.trim()) return;
    actions.addComment(comment.trim());
    setComment('');
    addToast('Đã đăng bình luận', 'success');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col animate-fade-in font-sans">
      {/* Header */}
      <header className="h-14 border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 bg-white/95 backdrop-blur-xl z-30 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="subtle" size="icon-m" onClick={goHome}>
            <ArrowLeft size={20} />
          </Button>
          <div className="h-6 w-[1px] bg-gray-200" />
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="text-gray-400 hover:text-gray-600 cursor-pointer" onClick={goHome}>Trang chủ</span>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-gray-900 truncate max-w-[300px]">{article.title}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {(article.isPersonal && article.ownerId === currentUser.id) && (
            <Button variant="subtle" size="icon-m" title="Chia sẻ quyền truy cập" onClick={() => setIsSharingModalOpen(true)}>
              <Share2 size={18} className="text-orange-500" />
            </Button>
          )}
          <Button variant="subtle" size="icon-m" title="Copy link bài viết" onClick={() => { navigator.clipboard.writeText(window.location.href); addToast('Đã copy link bài viết!', 'success'); }}>
            <ShareIcon size={18} />
          </Button>
          <Button variant={bookmarked ? 'border' : 'subtle'} size="icon-m"
            onClick={() => { actions.toggleFavorite(); addToast(bookmarked ? 'Đã bỏ lưu' : 'Đã lưu bài viết 📌', 'info'); }}
            className={bookmarked ? 'text-orange-600 border-orange-200' : ''}
          >
            <Bookmark size={18} className={bookmarked ? 'fill-current' : ''} />
          </Button>
          <Button variant="primary" size="s" onClick={() => dispatch({ type: 'OPEN_EDITOR', article })}>
            <Edit3 size={16} /> Chỉnh sửa
          </Button>
        </div>
      </header>

      {/* Scrollable body */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-5xl mx-auto px-6 py-10 flex gap-10 items-start">

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              {article.tags.map(t => (
                <Badge key={t} size="xs" color="orange" className="font-bold">#{t}</Badge>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-tight tracking-tight">{article.title}</h1>

            {/* Author + meta row */}
            <div className="flex items-center gap-3 mb-3">
              <img src={article.author.avatar} alt="Author" className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-100" referrerPolicy="no-referrer" />
              <div className="text-sm text-gray-600">
                <span className="font-bold text-gray-900">{article.author.name}</span>
                {article.author.role && <span className="text-gray-400"> • {article.author.role}</span>}
                <span className="text-gray-400"> • {article.createdAt}</span>
              </div>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-5 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
              <span className="flex items-center gap-1.5"><Flame size={15} className="text-orange-500" /> {article.likes}</span>
              <span className="flex items-center gap-1.5"><Eye size={15} /> {article.views.toLocaleString()}</span>
              <span className="flex items-center gap-1.5"><MessageSquare size={15} /> {article.comments.length}</span>
            </div>

            {/* Article body */}
            <article className="article-body mb-16 text-gray-800">
              <ArticleMarkdownRenderer content={article.content} />
            </article>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-8 border-t border-gray-100 mb-10">
              <div className="flex items-center gap-3">
                <Button variant={isLiked ? 'primary' : 'border'} onClick={handleLike}
                  className={isLiked ? '' : 'hover:border-orange-200 hover:text-orange-600'}>
                  <Flame size={18} className={isLiked ? 'fill-current' : 'text-orange-500'} />
                  {isLiked ? 'Đã Thắp Lửa' : 'Thắp Lửa'}
                  <span className="ml-1 opacity-60">{article.likes}</span>
                </Button>
              </div>
              <Button variant="border" size="s" onClick={() => addToast('Đã gửi yêu cầu cộng tác!', 'success')}>
                <UserPlus size={15} className="text-blue-500" /> Yêu cầu cộng tác
              </Button>
            </div>

            {/* Comment input */}
            <div className="bg-gray-50/80 p-5 rounded-2xl border border-gray-100 mb-10">
              <div className="flex gap-4">
                <img src={currentUser.avatar} alt="Me" className="w-9 h-9 rounded-full ring-2 ring-white shadow-sm shrink-0" referrerPolicy="no-referrer" />
                <div className="flex-1 relative">
                  <Textarea
                    ref={commentRef as any}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Viết bình luận của bạn..."
                    rows={1}
                    className="w-full px-4 py-3 pr-12 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 outline-none resize-none transition-all custom-scrollbar shrink-0 min-h-[48px]"
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitComment(); } }}
                  />
                  <Button
                    variant="subtle"
                    size="icon-s"
                    onClick={submitComment}
                    disabled={!comment.trim()}
                    className={`absolute right-2 top-2 p-1.5 rounded-lg transition-all border-none shadow-none ${comment.trim() ? 'text-orange-600 hover:bg-orange-50' : 'text-gray-300'}`}
                  >
                    <Send size={18} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Comments list */}
            <section className="space-y-4 mb-16">
              <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                <MessageSquare size={18} className="text-orange-500" />
                Thảo luận ({article.comments.length})
              </h3>
              {article.comments.length === 0 ? (
                <div className="text-center py-10 bg-gray-50/50 rounded-2xl border border-gray-100">
                  <p className="text-gray-400 text-sm italic">Chưa có bình luận nào. Hãy bắt đầu cuộc thảo luận!</p>
                </div>
              ) : article.comments.map(c => (
                <div key={c.id} className="flex gap-4 group">
                  <img src={c.authorAvatar || `https://picsum.photos/seed/${c.authorId}/100/100`} alt={c.authorName}
                    className="w-8 h-8 rounded-full border border-gray-100 shrink-0 mt-1" referrerPolicy="no-referrer" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900 text-xs">{c.authorName}</span>
                      <span className="text-[10px] text-gray-400">{c.createdAt}</span>
                    </div>
                    <div className="bg-gray-50/80 p-3.5 rounded-2xl rounded-tl-none border border-gray-100">
                      <p className="text-sm text-gray-700 leading-relaxed">{c.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Related articles */}
            {articles.filter(a => a.id !== article.id && a.folderId === article.folderId).length > 0 && (
              <section className="mb-10">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Mở rộng tri thức</h3>
                <div className="space-y-3">
                  {articles.filter(a => a.id !== article.id && a.folderId === article.folderId).slice(0, 3).map(r => (
                    <div key={r.id} onClick={() => dispatch({ type: 'SET_SELECTED_ARTICLE', articleId: r.id })}
                      className="group cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <h5 className="text-sm font-bold text-gray-700 group-hover:text-orange-600 transition-colors line-clamp-1">{r.title}</h5>
                      <div className="flex items-center gap-2 mt-1">
                        <img src={r.author.avatar} alt="" className="w-4 h-4 rounded-full" referrerPolicy="no-referrer" />
                        <span className="text-[10px] text-gray-400">{r.author.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>

          {/* Right TOC sidebar — sticky */}
          <aside className="hidden lg:block w-[220px] xl:w-[240px] shrink-0 sticky top-8 self-start max-h-[calc(100vh-6rem)] overflow-y-auto custom-scrollbar space-y-5">
            <ArticleToc content={article.content} scrollContainerRef={scrollRef} />

            {/* Stats widget */}
            <div className="bg-gray-50/80 rounded-2xl border border-gray-100 p-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm text-center">
                  <Flame size={14} className="text-orange-500 mx-auto mb-1" />
                  <div className="text-base font-black text-gray-900">{article.likes}</div>
                  <div className="text-[9px] text-gray-400 font-bold uppercase">Thắp lửa</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm text-center">
                  <Eye size={14} className="text-blue-500 mx-auto mb-1" />
                  <div className="text-base font-black text-gray-900">{article.views.toLocaleString()}</div>
                  <div className="text-[9px] text-gray-400 font-bold uppercase">Lượt đọc</div>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
      <SharingModal 
        open={isSharingModalOpen} 
        onOpenChange={setIsSharingModalOpen} 
        itemId={article.id} 
        itemType="article"
        initialSharedWith={article.sharedWith}
      />
    </div>
  );
}
