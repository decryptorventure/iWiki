import React from 'react';
import { Sparkles, Eye, Flame, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getAccessibleArticles } from '../lib/permissions';
import { Button } from '@frontend-team/ui-kit';

export default function PersonalizedFeed({ onOpenArticle }: { onOpenArticle: (id: string) => void }) {
  const { state } = useApp();
  const articles = getAccessibleArticles(state);
  const publishedArts = articles.filter(a => a.status === 'published');
  
  // Logic for Cho bạn (For You)
  const forYouArticles = [...publishedArts]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  return (
    <div className="w-full space-y-8 animate-slide-up stagger-3 mt-4 mb-12">
      {/* 1. Cho bạn */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-yellow-500" size={20} />
            <h2 className="text-xl font-bold text-gray-900">Dành cho bạn</h2>
          </div>
          <Button
            variant="subtle"
            size="s"
            className="text-sm text-gray-500 hover:text-[#f76226] font-medium transition-colors flex items-center gap-1 group border-none shadow-none h-auto p-0"
          >
            Xem tất cả <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {forYouArticles.map((article) => (
            <div key={article.id} onClick={() => onOpenArticle(article.id)}
              className="bg-gradient-to-br from-orange-50/50 via-amber-50/50 to-white p-5 rounded-2xl border border-orange-100/50 cursor-pointer hover:shadow-lg hover:border-orange-300 transition-all duration-300 hover:-translate-y-1 relative group">
              <div className="absolute top-3 right-3 bg-white/80 backdrop-blur px-2 py-0.5 rounded-full text-[10px] font-bold text-orange-600 shadow-sm border border-orange-100">Vì bạn ở team Kỹ thuật</div>
              <div className="flex items-center gap-2 mb-3 mt-2">
                <img src={article.author.avatar} alt="Avatar" className="w-8 h-8 rounded-full ring-2 ring-white" referrerPolicy="no-referrer" />
                <div>
                  <div className="text-xs font-bold text-gray-900">{article.author.name}</div>
                  <div className="text-[10px] text-gray-500">{article.author.role}</div>
                </div>
              </div>
              <h4 className="font-bold text-base text-gray-900 mb-2 line-clamp-2 group-hover:text-[#f76226] transition-colors">{article.title}</h4>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{article.excerpt}</p>
              <div className="flex items-center gap-3 text-[11px] text-gray-500">
                <span className="flex items-center gap-1"><Eye size={12} /> {article.views}</span>
                <span className="flex items-center gap-1"><Flame size={12} className="text-[#f76226]" /> {article.likes}</span>
              </div>
            </div>
          ))}
        </div>
      </section>


    </div>
  );
}
