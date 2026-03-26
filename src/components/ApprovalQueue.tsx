import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, Clock, ArrowRight, User, Folder as FolderIcon, MessageSquare, Search, Filter, Calendar, Eye, XCircle } from 'lucide-react';
import { Button, Badge, Input, Select, toast } from '@frontend-team/ui-kit';
import { APP_SCREENS } from '../constants/screens';
import { useToast } from '../App';
import { ArticleModal } from './ArticleModal';

export default function ApprovalQueue() {
  const { state, dispatch } = useApp();
  const { addToast } = useToast();
  const [filterAuthor, setFilterAuthor] = useState('all');
  const [filterTime, setFilterTime] = useState('all');
  const [quickViewArticleId, setQuickViewArticleId] = useState<string | null>(null);

  const authors = useMemo(() => {
    const list = state.articles
      .filter(a => a.status === 'in_review')
      .map(a => a.author);
    // Unique authors
    const unique = Array.from(new Map(list.map(item => [item.id, item])).values());
    return unique;
  }, [state.articles]);

  const pendingArticles = useMemo(() => {
    return state.articles.filter(a => {
      const isPending = a.status === 'in_review';
      const matchesAuthor = filterAuthor === 'all' || a.author.id === filterAuthor;
      
      // Simple time filter logic
      let matchesTime = true;
      if (filterTime === 'today') {
        const todayStr = new Date().toISOString().split('T')[0];
        matchesTime = a.updatedAt.includes(todayStr);
      } else if (filterTime === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        matchesTime = new Date(a.updatedAt) >= weekAgo;
      }

      return isPending && matchesAuthor && matchesTime;
    });
  }, [state.articles, filterAuthor, filterTime]);

  const handleReview = (id: string) => {
    dispatch({ type: 'SET_SELECTED_ARTICLE', articleId: id });
    dispatch({ type: 'SET_SCREEN', screen: 'article-review' }); 
    setQuickViewArticleId(null);
  };

  const handleQuickApprove = (id: string) => {
    dispatch({ type: 'APPROVE_ARTICLE', articleId: id, approverId: state.currentUser.id });
    // In our simplified store, APPROVE_ARTICLE might already handle status change, but let's make sure
    dispatch({ type: 'TRACK_EVENT', event: { type: 'approve', userId: state.currentUser.id, articleId: id } });
    addToast('Đã phê duyệt nhanh bài viết thành công!', 'success');
    setQuickViewArticleId(null);
  };

  const quickViewArticle = quickViewArticleId ? state.articles.find(a => a.id === quickViewArticleId) : null;

  const authorOptions = [
    { value: 'all', label: 'Tất cả tác giả' },
    ...authors.map(a => ({ value: a.id, label: a.name }))
  ];

  const timeOptions = [
    { value: 'all', label: 'Mọi lúc' },
    { value: 'today', label: 'Hôm nay' },
    { value: 'week', label: '7 ngày qua' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-8 py-10 animate-fade-in text-[var(--ds-text-primary)]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
           <h1 className="text-4xl font-black tracking-tight flex items-center gap-4">
             <div className="w-14 h-14 bg-[var(--ds-bg-accent-primary)] rounded-[22px] text-white shadow-2xl flex items-center justify-center transform hover:rotate-6 transition-transform">
               <CheckCircle size={32} strokeWidth={3} />
             </div>
             Duyệt bài viết
           </h1>
           <p className="text-[var(--ds-text-secondary)] mt-3 font-medium text-lg">Quản lý và phê duyệt nội dung từ Contributor.</p>
        </div>
        
        {/* Filters Interaction Zone */}
        <div className="flex items-center gap-3 bg-[var(--ds-bg-subtle)] p-2 rounded-[24px] border border-[var(--ds-border-subtle)]">
           <div className="flex items-center gap-2 pl-3">
             <Filter size={16} className="text-[var(--ds-text-tertiary)]" />
             <span className="text-xs font-black uppercase tracking-widest text-[var(--ds-text-tertiary)]">Bộ lọc:</span>
           </div>
           
           <div className="flex items-center bg-[var(--ds-bg-primary)] px-1 rounded-2xl shadow-sm border border-[var(--ds-border-secondary)]">
             <Select 
               options={authorOptions}
               value={filterAuthor}
               onValueChange={setFilterAuthor}
               size="s"
               className="border-none w-[170px] bg-transparent"
             />
             <div className="w-px h-6 bg-[var(--ds-border-subtle)] mx-1" />
             <Select 
               options={timeOptions}
               value={filterTime}
               onValueChange={setFilterTime}
               size="s"
               className="border-none w-[130px] bg-transparent"
             />
           </div>
        </div>
      </div>

      {pendingArticles.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-24 bg-[var(--ds-bg-subtle)] rounded-[48px] border-2 border-dashed border-[var(--ds-border-subtle)]">
           <div className="w-24 h-24 bg-[var(--ds-bg-primary)] rounded-full flex items-center justify-center text-[var(--ds-fg-success)] shadow-xl mb-6 transform hover:scale-110 transition-transform">
             <CheckCircle size={48} />
           </div>
           <h3 className="text-2xl font-black text-[var(--ds-text-primary)]">Tất cả bài viết đã được duyệt!</h3>
           <p className="text-[var(--ds-text-secondary)] mt-2 text-lg font-medium">Anh có thể nghỉ ngơi hoặc xem lại các bài viết cũ.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {pendingArticles.map(article => (
            <div 
              key={article.id}
              onClick={() => setQuickViewArticleId(article.id)}
              className="group bg-[var(--ds-bg-primary)] border border-[var(--ds-border-subtle)] rounded-[32px] p-6 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] hover:border-[var(--ds-border-accent-primary-subtle)] transition-all duration-500 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-7 flex-1 min-w-0">
                <div className="relative">
                  <div className="w-20 h-20 bg-[var(--ds-bg-subtle)] rounded-3xl flex items-center justify-center text-4xl shadow-inner group-hover:bg-[var(--ds-bg-accent-primary-subtle)] transition-colors">
                     {article.title.toLowerCase().includes('it') ? '💻' : article.title.toLowerCase().includes('ai') ? '🤖' : '📝'}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye size={16} className="text-[var(--ds-fg-accent-primary)]" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="warning" size="xs" className="px-3 py-1 font-black rounded-lg">Chờ duyệt</Badge>
                    <span className="text-[11px] font-bold text-[var(--ds-text-tertiary)] flex items-center gap-1.5 bg-[var(--ds-bg-subtle)] px-2 py-0.5 rounded-md uppercase tracking-tight"><Clock size={12}/> {article.updatedAt}</span>
                  </div>
                  <h3 className="text-2xl font-black truncate text-[var(--ds-text-primary)] group-hover:text-[var(--ds-fg-accent-primary)] transition-colors leading-tight">{article.title}</h3>
                  <div className="flex items-center gap-5 mt-3">
                     <div className="flex items-center gap-2 text-sm text-[var(--ds-text-secondary)]">
                        <div className="w-6 h-6 rounded-full bg-[var(--ds-bg-subtle)] overflow-hidden border border-white shadow-sm ring-2 ring-[var(--ds-bg-subtle)]">
                          <img src={article.author.avatar} alt="" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-bold">{article.author.name}</span>
                     </div>
                     <div className="flex items-center gap-2 text-sm text-[var(--ds-text-tertiary)] font-bold">
                        <FolderIcon size={16} />
                        <span className="uppercase tracking-tight">{article.folderName || article.folderId || 'General'}</span>
                     </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 ml-6 shrink-0" onClick={e => e.stopPropagation()}>
                <Button 
                  variant="border" 
                  size="m" 
                  onClick={() => handleQuickApprove(article.id)}
                  className="rounded-2xl font-bold px-5 border-[var(--ds-border-success-subtle)] text-[var(--ds-fg-success)] hover:bg-[var(--ds-bg-success-subtle)] hover:text-white hover:bg-[var(--ds-fg-success)] transition-all"
                >
                  <CheckCircle size={18} className="mr-2" /> Duyệt nhanh
                </Button>
                <Button 
                  variant="primary" 
                  size="m" 
                  onClick={() => handleReview(article.id)}
                  className="rounded-2xl font-black px-6 shadow-xl shadow-[var(--ds-fg-accent-primary)]/10"
                >
                  Review chi tiết <ArrowRight size={18} className="ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick View Modal Overlay */}
      {quickViewArticle && (
        <ArticleModal 
          open={!!quickViewArticle}
          article={quickViewArticle}
          onOpenChange={(open) => !open && setQuickViewArticleId(null)}
          footerActions={
            <div className="flex gap-4 w-full animate-slide-up pt-4">
              <Button 
                variant="border" 
                fullWidth 
                size="l" 
                onClick={() => handleQuickApprove(quickViewArticle.id)}
                className="rounded-2xl font-black border-[var(--ds-border-success-subtle)] text-[var(--ds-fg-success)] hover:bg-[var(--ds-bg-success-subtle)] py-7 text-lg"
              >
                <CheckCircle size={22} className="mr-2" /> Duyệt nhanh bài viết
              </Button>
              <Button 
                variant="primary" 
                fullWidth 
                size="l" 
                onClick={() => handleReview(quickViewArticle.id)}
                className="rounded-2xl font-black bg-[var(--ds-fg-accent-primary)] shadow-2xl shadow-[var(--ds-fg-accent-primary)]/20 py-7 text-lg"
              >
                Vào Review Chi tiết <ArrowRight size={22} className="ml-2" />
              </Button>
            </div>
          }
        />
      )}

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-[var(--ds-bg-accent-secondary-subtle)] border border-[var(--ds-border-accent-secondary-subtle)] p-8 rounded-[36px] hover:shadow-lg transition-all group relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 -mr-16 -mt-16 rounded-full" />
           <p className="text-xs font-black uppercase tracking-widest text-[var(--ds-fg-accent-secondary)] mb-2 group-hover:scale-110 origin-left transition-transform">SLA Duyệt</p>
           <p className="text-4xl font-black text-[var(--ds-text-primary)]">~2.4h</p>
           <p className="text-sm font-bold text-[var(--ds-text-tertiary)] mt-2">Nhanh hơn 15% so với tuần trước</p>
        </div>
        <div className="bg-[var(--ds-bg-accent-primary-subtle)] border border-[var(--ds-border-accent-primary-subtle)] p-8 rounded-[36px] hover:shadow-lg transition-all group relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 -mr-16 -mt-16 rounded-full" />
           <p className="text-xs font-black uppercase tracking-widest text-[var(--ds-fg-accent-primary)] mb-2 group-hover:scale-110 origin-left transition-transform">Tỉ lệ Phản hồi</p>
           <p className="text-4xl font-black text-[var(--ds-text-primary)]">84%</p>
           <p className="text-sm font-bold text-[var(--ds-text-tertiary)] mt-2">Đánh giá cao chất lượng feedback</p>
        </div>
        <div className="bg-[var(--ds-bg-success-subtle)] border border-[var(--ds-border-success-subtle)] p-8 rounded-[36px] hover:shadow-lg transition-all group relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 -mr-16 -mt-16 rounded-full" />
           <p className="text-xs font-black uppercase tracking-widest text-[var(--ds-fg-success)] mb-2 group-hover:scale-110 origin-left transition-transform">Đã Publish</p>
           <p className="text-4xl font-black text-[var(--ds-text-primary)]">215</p>
           <p className="text-sm font-bold text-[var(--ds-text-tertiary)] mt-2">+12 bài viết trong sáng nay</p>
        </div>
      </div>
    </div>
  );
}
