// Filterable all-articles list section for Dashboard
import React, { memo, useState, useMemo } from 'react';
import { Flame, Eye, MessageSquare, Clock, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Article } from '../store/useAppStore';

interface DashboardAllArticlesProps {
  articles: Article[];
  onOpenArticle: (id: string) => void;
}

type FilterType = 'recent' | 'popular' | 'trending';

function DashboardAllArticles({ articles, onOpenArticle }: DashboardAllArticlesProps) {
  const { dispatch } = useApp();
  const [filter, setFilter] = useState<FilterType>('recent');

  const sorted = useMemo(() => {
    const base = [...articles];
    if (filter === 'recent') base.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    else if (filter === 'popular') base.sort((a, b) => b.views - a.views);
    else base.sort((a, b) => (b.likes + b.comments.length * 2) - (a.likes + a.comments.length * 2));
    return base.slice(0, 10);
  }, [articles, filter]);

  const filterButtons: { id: FilterType; label: string; icon: React.ComponentType<{ size: number; className?: string }> }[] = [
    { id: 'recent', label: 'Gần nhất', icon: Clock },
    { id: 'popular', label: 'Phổ biến nhất', icon: Eye },
    { id: 'trending', label: 'Xu hướng', icon: TrendingUp },
  ];

  return (
    <div className="lg:col-span-2">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-gray-900">Tất cả bài viết</h2>
          <button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'folder-f-company' })} className="text-sm text-gray-500 hover:text-[#f76226] font-medium transition-colors">Xem thêm →</button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {filterButtons.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setFilter(id)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${filter === id ? 'bg-[#f76226] text-white shadow-md shadow-[#f76226]/20' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'}`}>
              <Icon size={14} className="inline mr-1.5 -mt-0.5" />{label}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        {sorted.map((article) => (
          <div key={article.id} onClick={() => onOpenArticle(article.id)} className="card-premium p-6 cursor-pointer flex gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <img src={article.author.avatar} alt="Avatar" className="w-8 h-8 rounded-full ring-1 ring-gray-100" referrerPolicy="no-referrer" />
                <div>
                  <div className="text-sm font-bold text-gray-900">{article.author.name}</div>
                  <div className="text-xs text-gray-500">{article.author.role}</div>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-[#f76226] transition-colors">{article.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-4">{article.excerpt || article.content.slice(0, 120) + '...'}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>{article.createdAt}</span>
                <span className="flex items-center gap-1"><Eye size={14} /> {article.views}</span>
                <span className="flex items-center gap-1"><Flame size={14} className="text-[#f76226]" /> {article.likes}</span>
                <span className="flex items-center gap-1"><MessageSquare size={14} /> {article.comments.length}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(DashboardAllArticles);
