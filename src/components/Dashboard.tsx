import React, { useState } from 'react';
import { Search, Eye, Heart, MessageSquare, ChevronRight, TrendingUp, Clock, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Input } from '../ui/Input';

export default function Dashboard({ onSearch }: { onSearch: (q: string) => void }) {
  const { state, dispatch } = useApp();
  const { articles } = state;
  const [query, setQuery] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) onSearch(query);
  };

  const published = articles.filter(a => a.status === 'published');
  const featured = published.slice(0, 5);
  const latest = [...published].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8);

  const openArticle = (id: string) => {
    dispatch({ type: 'SET_SELECTED_ARTICLE', articleId: id });
    dispatch({ type: 'INCREMENT_VIEWS', articleId: id });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Hero Header */}
      <div className="flex flex-col items-center text-center mb-12">
        <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 border border-orange-100 shadow-sm">
          <Sparkles className="text-orange-500" size={32} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
          Chào mừng đến với iWiki 🐵
        </h1>
        <p className="text-gray-500 text-sm max-w-lg leading-relaxed mb-10">
          Nơi lưu giữ toàn bộ tri thức, quy trình và các cập nhật mới nhất từ iKame.
          Hãy bắt đầu hành trình khám phá ngay!
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-2xl relative group">
          <Input
            size="lg"
            rounded="full"
            placeholder="Tìm kiếm tài liệu, hướng dẫn, Checklist..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-12 shadow-sm group-hover:shadow-md transition-shadow"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            <button onClick={() => onSearch(query)} className="px-5 py-2 bg-gray-900 text-white text-xs font-bold rounded-full hover:bg-orange-500 transition-colors">Tìm kiếm</button>
          </div>
        </div>
      </div>

      {/* Featured Grid */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp size={18} className="text-orange-500" />
            Nổi bật trong tuần
          </h2>
          <button
            onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'my-articles' })}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors flex items-center gap-1"
          >
            TẤT CẢ BÀI VIẾT <ChevronRight size={14} />
          </button>
        </div>

        {featured.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Highlight */}
            {featured[0] && (
              <div
                onClick={() => openArticle(featured[0].id)}
                className="lg:col-span-7 bg-white border border-gray-100 rounded-lg overflow-hidden cursor-pointer hover:border-orange-200 transition-all flex flex-col group"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img src={featured[0].coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute bottom-4 left-4">
                    <span className="px-2 py-1 bg-gray-900/80 backdrop-blur-sm text-white text-[10px] font-bold rounded uppercase">Featured</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2.5 mb-4">
                    <img src={featured[0].author.avatar} className="w-8 h-8 rounded-full border border-gray-100" />
                    <div>
                      <p className="text-sm font-bold text-gray-800 leading-none">{featured[0].author.name}</p>
                      <p className="text-[11px] text-gray-400 mt-1">{featured[0].author.role}</p>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors leading-tight">
                    {featured[0].title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                    <span className="flex items-center gap-1.5"><Eye size={14} /> {featured[0].views}</span>
                    <span className="flex items-center gap-1.5"><Heart size={14} /> {featured[0].likes}</span>
                    <span className="flex items-center gap-1.5"><MessageSquare size={14} /> {featured[0].comments.length}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Side Grid */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {featured.slice(1, 4).map((a) => (
                <div
                  key={a.id}
                  onClick={() => openArticle(a.id)}
                  className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-lg cursor-pointer hover:border-orange-200 transition-all group"
                >
                  <img src={a.coverUrl} className="w-24 h-24 object-cover rounded shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-orange-600 uppercase mb-1">{a.folderName}</p>
                    <h4 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-orange-600 transition-colors line-clamp-2 mb-2">{a.title}</h4>
                    <div className="flex items-center gap-3 text-[11px] text-gray-400">
                      <span>{a.createdAt}</span>
                      <span className="flex items-center gap-1"><Eye size={12} /> {a.views}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-20 bg-gray-50 rounded-lg text-center border border-dashed border-gray-200">
            <p className="text-sm text-gray-400 font-medium">Chưa có bài viết nổi bật</p>
          </div>
        )}
      </section>

      {/* Latest Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Clock size={18} className="text-orange-500" />
            Mới cập nhật
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {latest.map(article => (
            <div
              key={article.id}
              onClick={() => openArticle(article.id)}
              className="group bg-white border border-gray-100 rounded-lg overflow-hidden cursor-pointer hover:border-orange-200 transition-all flex flex-col"
            >
              <div className="h-32 bg-gray-100">
                <img src={article.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">{article.folderName}</p>
                <h4 className="text-sm font-bold text-gray-900 line-clamp-2 mb-4 group-hover:text-orange-600 transition-colors leading-snug flex-1">
                  {article.title}
                </h4>
                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <div className="flex items-center gap-1.5">
                    <img src={article.author.avatar} className="w-5 h-5 rounded-full" />
                    <span className="text-[10px] text-gray-500 font-medium">{article.author.name}</span>
                  </div>
                  <span className="text-[10px] text-gray-400">{article.createdAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
