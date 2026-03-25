// Featured articles grid section for Dashboard
import React, { memo } from 'react';
import { Flame, Eye, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Article } from '../store/useAppStore';

interface DashboardFeaturedArticlesProps {
  articles: Article[];
  onOpenArticle: (id: string) => void;
}

function DashboardFeaturedArticles({ articles, onOpenArticle }: DashboardFeaturedArticlesProps) {
  const { dispatch } = useApp();
  const featured = articles.slice(0, 5);

  return (
    <div className="mb-12 animate-slide-up stagger-3">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Flame size={20} className="text-[#f76226]" /> Bài viết nổi bật
        </h2>
        <button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'my-articles' })} className="text-sm text-gray-500 hover:text-[#f76226] font-medium transition-colors">Xem thêm →</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {featured[0] && (
          <div onClick={() => onOpenArticle(featured[0].id)} className="lg:col-span-1 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-2xl p-8 cursor-pointer hover:shadow-xl transition-all duration-300 border border-orange-100/50 flex flex-col justify-between min-h-[400px] hover:-translate-y-1">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <img src={featured[0].author.avatar} alt="Avatar" className="w-10 h-10 rounded-full ring-2 ring-white shadow-sm" referrerPolicy="no-referrer" />
                <div>
                  <div className="text-sm font-bold text-gray-900">{featured[0].author.name}</div>
                  <div className="text-xs text-gray-500">{featured[0].author.role}</div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">{featured[0].title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{featured[0].excerpt}</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500 mt-8">
              <span>{featured[0].createdAt}</span>
              <span className="flex items-center gap-1"><Eye size={14} /> {featured[0].views}</span>
              <span className="flex items-center gap-1"><Flame size={14} className="text-[#f76226]" /> {featured[0].likes}</span>
              <span className="flex items-center gap-1"><MessageSquare size={14} /> {featured[0].comments.length}</span>
            </div>
          </div>
        )}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {featured.slice(1, 5).map((article, i) => (
            <div key={article.id} onClick={() => onOpenArticle(article.id)}
              className={`bg-white rounded-2xl border border-gray-200/80 overflow-hidden cursor-pointer hover:shadow-lg hover:border-[#f76226]/30 transition-all duration-300 flex flex-col hover:-translate-y-1 animate-slide-up stagger-${i + 2}`}>
              {article.coverUrl && (
                <div className="h-32 overflow-hidden relative group">
                  <img src={article.coverUrl} alt="Cover" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              )}
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <img src={article.author.avatar} alt="Avatar" className="w-6 h-6 rounded-full ring-1 ring-gray-100" referrerPolicy="no-referrer" />
                    <div>
                      <div className="text-xs font-bold text-gray-900">{article.author.name}</div>
                      <div className="text-[10px] text-gray-500">{article.author.role}</div>
                    </div>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 hover:text-[#f76226] transition-colors">{article.title}</h4>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                  <span>{article.createdAt}</span>
                  <span className="flex items-center gap-1"><Eye size={12} /> {article.views}</span>
                  <span className="flex items-center gap-1"><Flame size={12} className="text-[#f76226]" /> {article.likes}</span>
                  <span className="flex items-center gap-1"><MessageSquare size={12} /> {article.comments.length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(DashboardFeaturedArticles);
