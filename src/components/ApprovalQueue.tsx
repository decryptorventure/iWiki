
import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, Clock, ArrowRight, User, Folder as FolderIcon, MessageSquare } from 'lucide-react';
import { Button, Badge } from '@frontend-team/ui-kit';
import { APP_SCREENS } from '../constants/screens';

export default function ApprovalQueue() {
  const { state, dispatch } = useApp();
  const pendingArticles = state.articles.filter(a => a.status === 'in_review');

  const handleReview = (id: string) => {
    dispatch({ type: 'SET_SELECTED_ARTICLE', articleId: id });
    dispatch({ type: 'SET_SCREEN', screen: 'article-review' }); 
  };

  return (
    <div className="max-w-5xl mx-auto px-8 py-10 animate-fade-in text-[var(--ds-text-primary)]">
      <div className="flex items-center justify-between mb-10">
        <div>
           <h1 className="text-3xl font-black flex items-center gap-3">
             <div className="p-2 bg-[var(--ds-bg-accent-primary)] rounded-xl text-white shadow-lg">
               <CheckCircle size={28} />
             </div>
             Duyệt bài viết (KM Review)
           </h1>
           <p className="text-[var(--ds-text-secondary)] mt-2 font-medium">Phê duyệt hoặc phản hồi bài viết từ các Contributor.</p>
        </div>
        <div className="flex items-center gap-2">
           <Badge variant="dim" size="s">{pendingArticles.length} bài chờ duyệt</Badge>
        </div>
      </div>

      {pendingArticles.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 bg-gray-50 dark:bg-zinc-900 rounded-[40px] border-2 border-dashed border-gray-100">
           <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-green-500 shadow-sm mb-4">
             <CheckCircle size={40} />
           </div>
           <h3 className="text-xl font-bold">Mọi thứ đã gọn gàng!</h3>
           <p className="text-[var(--ds-text-secondary)] mt-1">Hiện không có bài viết nào đang chờ được duyệt.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {pendingArticles.map(article => (
            <div 
              key={article.id}
              className="group bg-white dark:bg-zinc-900 border border-[var(--ds-border-subtle)] rounded-3xl p-6 hover:shadow-xl hover:border-[var(--ds-border-accent-primary-subtle)] transition-all duration-300 flex items-center justify-between"
            >
              <div className="flex items-center gap-6 flex-1 min-w-0">
                <div className="w-16 h-16 bg-[var(--ds-bg-subtle)] rounded-2xl flex items-center justify-center text-3xl shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                   {article.title.toLowerCase().includes('it') ? '💻' : article.title.toLowerCase().includes('ai') ? '🤖' : '📝'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="warning" size="xs">Chờ duyệt</Badge>
                    <span className="text-xs text-[var(--ds-text-tertiary)] flex items-center gap-1"><Clock size={12}/> {article.updatedAt}</span>
                  </div>
                  <h3 className="text-xl font-extrabold truncate group-hover:text-[var(--ds-fg-accent-primary)] transition-colors">{article.title}</h3>
                  <div className="flex items-center gap-4 mt-2">
                     <div className="flex items-center gap-1.5 text-sm text-[var(--ds-text-secondary)]">
                        <div className="w-5 h-5 rounded-full bg-gray-200 overflow-hidden">
                          <img src={article.author.avatar} alt="" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-bold">{article.author.name}</span>
                     </div>
                     <div className="flex items-center gap-1.5 text-sm text-[var(--ds-text-tertiary)]">
                        <FolderIcon size={14} />
                        <span>{article.folderName || 'General'}</span>
                     </div>
                  </div>
                </div>
              </div>
              <Button 
                variant="primary" 
                size="m" 
                onClick={() => handleReview(article.id)}
                className="gap-2 shadow-lg shadow-orange-500/10"
              >
                Bắt đầu Review <ArrowRight size={18} />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Workflow Stats (Small Widget) */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-orange-50/50 border border-orange-100 p-6 rounded-3xl">
           <p className="text-xs font-bold uppercase text-orange-600 mb-1">SLA Duyệt</p>
           <p className="text-2xl font-black text-orange-950">~2.4 Giờ</p>
           <p className="text-[10px] text-orange-700 mt-1 italic">Nhanh hơn 15% so với tuần trước</p>
        </div>
        <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-3xl">
           <p className="text-xs font-bold uppercase text-blue-600 mb-1">Tỉ lệ Phản hồi</p>
           <p className="text-2xl font-black text-blue-950">84%</p>
           <p className="text-[10px] text-blue-700 mt-1 italic">Hầu hết bài viết được feedback inline</p>
        </div>
        <div className="bg-green-50/50 border border-green-100 p-6 rounded-3xl">
           <p className="text-xs font-bold uppercase text-green-600 mb-1">Đã Publish</p>
           <p className="text-2xl font-black text-green-950">215</p>
           <p className="text-[10px] text-green-700 mt-1 italic">Tổng cộng trong 30 ngày qua</p>
        </div>
      </div>
    </div>
  );
}
