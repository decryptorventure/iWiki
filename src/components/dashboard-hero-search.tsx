// Hero search section with smart dropdown for Dashboard
import React, { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, BookOpen, Clock, Flame, ArrowRight, Target, Zap, TrendingUp, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getAccessibleArticles } from '../lib/permissions';

interface DashboardHeroSearchProps {
  onSearch: (q: string) => void;
  onOpenArticle: (id: string) => void;
}

export default function DashboardHeroSearch({ onSearch, onOpenArticle }: DashboardHeroSearchProps) {
  const { state, dispatch } = useApp();
  const { currentUser, searchHistory } = state;
  const articles = getAccessibleArticles(state);
  const publishedArticles = articles.filter(a => a.status === 'published');
  const recentArticles = [...publishedArticles]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4);

  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (q: string) => {
    if (!q.trim()) return;
    dispatch({ type: 'ADD_SEARCH_HISTORY', query: q.trim() });
    dispatch({ type: 'TRACK_EVENT', event: { type: 'search', userId: currentUser.id, query: q.trim(), meta: { source: 'dashboard' } } });
    onSearch(q);
    setIsFocused(false);
  };

  const smartSuggestions = [
    { text: `Quy trình cho ${currentUser.role}`, icon: Target },
    { text: 'Kế hoạch quý này của Product Team', icon: Zap },
    { text: 'Hướng dẫn Onboarding cho người mới', icon: BookOpen },
  ];

  const searchResults = query
    ? articles.filter(a => a.title.toLowerCase().includes(query.toLowerCase()) || a.tags.some(t => t.toLowerCase().includes(query.toLowerCase())))
    : recentArticles;

  return (
    <div className="flex flex-col items-center justify-center pb-14 text-center">
      <div className="flex items-center gap-6 mb-8 animate-fade-in">
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 text-sm">
          <BookOpen size={16} className="text-[#f76226]" />
          <span className="text-gray-600"><strong className="text-gray-900">{publishedArticles.length}</strong> bài viết</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 text-sm">
          <TrendingUp size={16} className="text-green-500" />
          <span className="text-gray-600"><strong className="text-gray-900">+{publishedArticles.filter(a => { const d = new Date(a.createdAt); return Date.now() - d.getTime() < 7 * 24 * 3600 * 1000; }).length}</strong> tuần này</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 text-sm">
          <Award size={16} className="text-purple-500" />
          <span className="text-gray-600">Level <strong className="text-gray-900">{currentUser.level}</strong></span>
        </div>
      </div>

      <h1 className="text-4xl font-bold text-gray-900 mb-3 leading-tight animate-slide-up">
        Xin chào, <span className="gradient-text">{currentUser.name}</span> 👋
      </h1>
      <p className="text-lg text-gray-500 mb-8 animate-slide-up stagger-1">Tìm kiếm kiến thức, hướng dẫn và tài liệu nội bộ</p>

      <div ref={searchRef} className={`w-full max-w-3xl relative group animate-slide-up stagger-2 ${isFocused ? 'z-50' : 'z-10'}`}>
        <div className="absolute -inset-1 bg-gradient-to-r from-[#f76226]/20 to-orange-300/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500" />
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <Sparkles className={`h-5 w-5 transition-colors ${isFocused ? 'text-orange-500' : 'text-[#f76226]'}`} />
          </div>
          <input
            type="text"
            className={`block w-full pl-14 pr-14 py-4 text-base text-gray-900 bg-white border ${isFocused ? 'border-[#f76226]/50 ring-4 ring-[#f76226]/15 rounded-t-3xl rounded-b-none shadow-md' : 'border-gray-200 rounded-full focus:ring-4 focus:ring-[#f76226]/15 focus:border-[#f76226]/50 shadow-sm'} transition-all duration-300 hover:shadow-md hover:border-gray-300 placeholder:text-gray-400 outline-none`}
            placeholder="Tìm kiếm thông minh hoặc đặt câu hỏi cho AI..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(query); }}
            onFocus={() => setIsFocused(true)}
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <button onClick={() => query.trim() && handleSearch(query)} className="p-2.5 text-white bg-gradient-to-r from-[#f76226] to-[#FF8A6A] rounded-full hover:shadow-md hover:shadow-[#f76226]/25 transition-all duration-200 active:scale-95">
              <Search size={18} />
            </button>
          </div>

          {isFocused && (
            <div className="absolute top-full left-0 right-0 bg-white shadow-xl border border-gray-100 rounded-b-3xl overflow-hidden z-50 animate-slide-down origin-top custom-scrollbar max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                <div className="p-4 space-y-6">
                  {!query && (
                    <div>
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Target size={14} className="text-orange-500" /> Gợi ý theo ngữ cảnh
                      </div>
                      <div className="space-y-1">
                        {smartSuggestions.map((item, idx) => (
                          <button key={idx} onClick={() => { setQuery(item.text); handleSearch(item.text); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all flex items-center gap-3 group">
                            <div className="w-8 h-8 rounded-lg bg-orange-100/50 flex items-center justify-center text-orange-500 group-hover:bg-white group-hover:shadow-sm transition-all shrink-0">
                              <item.icon size={16} />
                            </div>
                            <span className="font-medium">{item.text}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {!query && searchHistory.length > 0 && (
                    <div>
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2"><Clock size={14} /> Tìm kiếm gần đây</div>
                        <button onClick={() => dispatch({ type: 'CLEAR_SEARCH_HISTORY' })} className="text-gray-400 hover:text-red-500 lowercase text-[10px]">Xóa lịch sử</button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {searchHistory.slice(0, 5).map((h, idx) => (
                          <button key={idx} onClick={() => { setQuery(h); handleSearch(h); }} className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 rounded-lg text-xs transition-colors flex items-center gap-1.5">
                            <Clock size={12} className="text-gray-400" />{h}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="bg-gray-50/50 p-4">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Flame size={14} className={query ? 'text-[#f76226]' : 'text-gray-400'} />
                    {query ? 'Kết quả tri thức liên quan' : 'Đang nổi bật trong tuần'}
                  </div>
                  <div className="space-y-2">
                    {searchResults.slice(0, 4).map((article) => (
                      <button key={article.id} onClick={() => onOpenArticle(article.id)} className="w-full p-3 bg-white border border-gray-100 hover:border-orange-200 hover:shadow-md rounded-xl transition-all text-left group flex gap-3 items-start">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors shrink-0 mt-0.5">
                          <BookOpen size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors mb-1">{article.title}</div>
                          <div className="flex items-center gap-2 text-[10px] text-gray-500">
                            <span className="font-medium text-gray-700">{article.author.name}</span>
                            <span>•</span><span>{article.folderName}</span>
                          </div>
                        </div>
                        <ArrowRight size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all" />
                      </button>
                    ))}
                    {query && (
                      <button onClick={() => handleSearch(query)} className="w-full mt-2 py-2 text-xs font-bold text-orange-600 hover:bg-orange-50 rounded-lg transition-colors flex items-center justify-center gap-1">
                        Xem tất cả kết quả <ArrowRight size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
