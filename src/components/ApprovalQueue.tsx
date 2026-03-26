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
  const [searchQuery, setSearchQuery] = useState('');
  const [quickViewArticleId, setQuickViewArticleId] = useState<string | null>(null);

  const authors = useMemo(() => {
    const list = state.articles
      .filter(a => a.status === 'in_review')
      .map(a => a.author);
    const unique = Array.from(new Map(list.map(item => [item.id, item])).values());
    return unique;
  }, [state.articles]);

  const pendingArticles = useMemo(() => {
    return state.articles.filter(a => {
      const isPending = a.status === 'in_review';
      const matchesAuthor = filterAuthor === 'all' || a.author.id === filterAuthor;
      
      const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           a.author.name.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesTime = true;
      if (filterTime === 'today') {
        const todayStr = new Date().toISOString().split('T')[0];
        matchesTime = a.updatedAt.includes(todayStr);
      } else if (filterTime === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        matchesTime = new Date(a.updatedAt) >= weekAgo;
      }
      return isPending && matchesAuthor && matchesTime && matchesSearch;
    });
  }, [state.articles, filterAuthor, filterTime, searchQuery]);

  const handleReview = (id: string) => {
    dispatch({ type: 'SET_SELECTED_ARTICLE', articleId: id });
    dispatch({ type: 'SET_SCREEN', screen: 'article-review' }); 
    setQuickViewArticleId(null);
  };

  const handleQuickApprove = (id: string) => {
    dispatch({ type: 'APPROVE_ARTICLE', articleId: id, approverId: state.currentUser.id });
    dispatch({ type: 'TRACK_EVENT', event: { type: 'approve', userId: state.currentUser.id, articleId: id } });
    addToast('Đã phê duyệt nhanh bài viết thành công!', 'success');
    setQuickViewArticleId(null);
  };

  const quickViewArticle = quickViewArticleId ? state.articles.find(a => a.id === quickViewArticleId) : null;

  const authorOptions = [
    { value: 'all', label: 'Tác giả: Tất cả' },
    ...authors.map(a => ({ value: a.id, label: a.name }))
  ];

  const timeOptions = [
    { value: 'all', label: 'Thời gian: Mọi lúc' },
    { value: 'today', label: 'Hôm nay' },
    { value: 'week', label: '7 ngày qua' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 animate-fade-in text-[var(--ds-text-primary)] font-sans">
      {/* Header Section */}
      <div className="mb-10 border-b border-[var(--ds-border-subtle)] pb-8">
        <h1 className="text-2xl font-bold tracking-tight flex items-center justify-start gap-3">
          <div className="w-9 h-9 bg-[var(--ds-fg-accent-primary)] rounded-xl text-white shadow-md flex items-center justify-center">
            <CheckCircle size={20} />
          </div>
          Duyệt bài viết
          <Badge variant="dim" size="s" className="ml-2 bg-[var(--ds-bg-subtle)] text-[var(--ds-text-tertiary)] font-medium">{pendingArticles.length}</Badge>
        </h1>
        <p className="text-[var(--ds-text-secondary)] mt-2 font-medium text-left text-sm">Phê duyệt hoặc phản hồi bài viết từ các Contributor.</p>
        
        {/* Filters & Search - Left Aligned & Unified Font */}
        <div className="mt-8 flex flex-col items-start gap-4">
           {/* Search Input Wrapper */}
           <div className="relative w-full max-w-md">
             <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-[var(--ds-text-tertiary)] flex items-center justify-center">
               <Search size={18} />
             </div>
             <Input 
               placeholder="Tìm theo tiêu đề hoặc tác giả..." 
               value={searchQuery}
               onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
               className="!pl-12 pr-4 py-2 bg-[var(--ds-bg-subtle)] border-[var(--ds-border-subtle)] rounded-xl w-full h-10 text-sm focus:bg-[var(--ds-bg-primary)] transition-all font-medium"
             />
             {searchQuery && (
               <button 
                 onClick={() => setSearchQuery('')}
                 className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--ds-text-tertiary)] hover:text-[var(--ds-text-primary)] z-10"
               >
                 <XCircle size={16} />
               </button>
             )}
           </div>

           <div className="flex items-center bg-[var(--ds-bg-subtle)] p-0.5 rounded-xl border border-[var(--ds-border-subtle)] shadow-sm h-10 shrink-0">
             <div className="flex items-center gap-2 pl-3 mr-1">
               <Filter size={14} className="text-[var(--ds-text-tertiary)]" />
             </div>
             <Select 
               options={authorOptions}
               value={filterAuthor}
               onValueChange={setFilterAuthor}
               size="xs"
               className="border-none min-w-[130px] bg-transparent font-medium text-xs"
             />
             <div className="w-px h-4 bg-[var(--ds-border-secondary)] opacity-50 mx-1" />
             <Select 
               options={timeOptions}
               value={filterTime}
               onValueChange={setFilterTime}
               size="xs"
               className="border-none min-w-[120px] bg-transparent font-medium text-xs"
             />
           </div>
           
           {(filterAuthor !== 'all' || filterTime !== 'all' || searchQuery) && (
             <button 
               onClick={() => {setFilterAuthor('all'); setFilterTime('all'); setSearchQuery('');}} 
               className="text-xs font-semibold text-[var(--ds-fg-accent-primary)] hover:underline ml-1"
             >
               Đặt lại bộ lọc
             </button>
           )}
        </div>
      </div>

      {pendingArticles.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 bg-[var(--ds-bg-subtle)]/30 rounded-[24px] border border-dashed border-[var(--ds-border-subtle)]">
           <div className="w-14 h-14 bg-[var(--ds-bg-primary)] rounded-full flex items-center justify-center text-[var(--ds-fg-success)] shadow-sm mb-4">
             {searchQuery ? <Search size={28} /> : <CheckCircle size={28} />}
           </div>
           <h3 className="text-lg font-bold text-[var(--ds-text-primary)]">
             {searchQuery ? 'Không tìm thấy kết quả' : 'Tất cả đã xong!'}
           </h3>
           <p className="text-[var(--ds-text-secondary)] mt-1 font-medium text-center text-sm">
             {searchQuery ? 'Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.' : 'Mọi bài viết đã được duyệt.'}
           </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingArticles.map(article => (
            <div 
              key={article.id}
              onClick={() => setQuickViewArticleId(article.id)}
              className="group bg-[var(--ds-bg-primary)] border border-[var(--ds-border-subtle)] rounded-xl p-4 hover:shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:border-[var(--ds-border-accent-primary-subtle)] transition-all flex items-center gap-5 cursor-pointer relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--ds-fg-status-warning)] opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="w-10 h-10 bg-[var(--ds-bg-subtle)] rounded-lg flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform bg-gradient-to-br from-[var(--ds-bg-subtle)] to-[var(--ds-bg-primary)] shadow-sm">
                 {article.title.toLowerCase().includes('it') ? '💻' : 
                  article.title.toLowerCase().includes('ai') ? '🤖' : 
                  article.title.toLowerCase().includes('sql') ? '📊' :
                  article.title.toLowerCase().includes('design') ? '🎨' : '📝'}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <Badge variant="warning" size="xs" className="px-1.5 py-0 text-[9px] font-bold uppercase tracking-wider h-4">Chờ duyệt</Badge>
                  <span className="text-[10px] text-[var(--ds-text-tertiary)] font-medium flex items-center gap-1"><Clock size={10}/> {article.updatedAt}</span>
                </div>
                <h3 className="text-base font-semibold truncate text-[var(--ds-text-primary)] group-hover:text-[var(--ds-fg-accent-primary)] transition-colors leading-snug">{article.title}</h3>
                <div className="flex items-center gap-4 mt-1">
                   <div className="flex items-center gap-1.5 text-[11px] font-medium">
                      <img src={article.author.avatar} alt="" className="w-4 h-4 rounded-full object-cover ring-1 ring-white" />
                      <span className="text-[var(--ds-text-secondary)]">{article.author.name}</span>
                   </div>
                   <div className="flex items-center gap-1.5 text-[11px] font-medium">
                      <FolderIcon size={12} className="text-[var(--ds-text-tertiary)]" />
                      <span className="text-[var(--ds-text-tertiary)] uppercase">{article.folderName || 'General'}</span>
                   </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4 shrink-0" onClick={e => e.stopPropagation()}>
                <Button 
                  variant="subtle" 
                  size="s" 
                  onClick={() => handleQuickApprove(article.id)}
                  className="rounded-lg font-semibold px-3.5 h-8 bg-[var(--ds-bg-success-subtle)] text-[var(--ds-fg-success)] border-none hover:bg-[var(--ds-fg-success)] hover:text-white transition-all text-xs"
                >
                  Duyệt nhanh
                </Button>
                <Button 
                  variant="primary" 
                  size="s" 
                  onClick={() => handleReview(article.id)}
                  className="rounded-lg font-semibold px-3.5 h-8 shadow-sm text-xs"
                >
                  Review chi tiết
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {quickViewArticle && (
        <ArticleModal 
          open={!!quickViewArticle}
          article={quickViewArticle}
          onOpenChange={(open) => !open && setQuickViewArticleId(null)}
          footerActions={
            <div className="flex gap-3 w-full animate-slide-up bg-[var(--ds-bg-subtle)] p-4 rounded-xl border border-[var(--ds-border-subtle)]">
              <Button 
                variant="border" 
                fullWidth 
                size="l" 
                onClick={() => handleQuickApprove(quickViewArticle.id)}
                className="rounded-xl font-bold border-[var(--ds-border-success-subtle)] text-[var(--ds-fg-success)] py-5 shadow-sm hover:bg-[var(--ds-bg-success-subtle)]"
              >
                Duyệt nhanh ngay
              </Button>
              <Button 
                variant="primary" 
                fullWidth 
                size="l" 
                onClick={() => handleReview(quickViewArticle.id)}
                className="rounded-xl font-bold bg-[var(--ds-fg-accent-primary)] py-5 shadow-lg shadow-[var(--ds-fg-accent-primary)]/10"
              >
                Review Chi tiết
              </Button>
            </div>
          }
        />
      )}
    </div>
  );
}
