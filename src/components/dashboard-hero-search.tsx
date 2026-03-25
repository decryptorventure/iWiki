// Hero search section with smart dropdown for Dashboard
import React, { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, BookOpen, Clock, Flame, ArrowRight, Target, Zap, TrendingUp, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getAccessibleArticles } from '../lib/permissions';
import { Button } from '@frontend-team/ui-kit';

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
      <div className="mb-6 animate-fade-in">
        {/* Stats removed as requested */}
      </div>

      <h1 className="text-4xl font-bold text-[var(--ds-text-primary)] mb-3 leading-tight animate-slide-up">
        Xin chào, <span className="text-[var(--ds-fg-orange-strong)]">{currentUser.name}</span> 👋
      </h1>
      <p className="text-lg text-[var(--ds-text-secondary)] mb-8 animate-slide-up stagger-1">Tìm kiếm kiến thức, hướng dẫn và tài liệu nội bộ</p>

      <div ref={searchRef} className={`w-full max-w-3xl relative group animate-slide-up stagger-2 ${isFocused ? 'z-50' : 'z-10'}`}>
        <div className="absolute -inset-1 bg-[var(--ds-bg-accent-primary-subtle)] rounded-full blur-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500" />
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <Sparkles className={`h-5 w-5 transition-colors ${isFocused ? 'text-[var(--ds-fg-accent-primary)]' : 'text-[var(--ds-fg-accent-primary)]'}`} />
          </div>
          <input
            type="text"
            className={`block w-full pl-14 pr-14 py-4 text-base text-[var(--ds-text-primary)] bg-[var(--ds-bg-primary)] border ${isFocused ? 'border-[var(--ds-border-accent-primary)] ring-4 ring-[var(--ds-bg-accent-primary-subtle)] rounded-t-3xl rounded-b-none shadow-md' : 'border-[var(--ds-border-secondary)] rounded-full focus:ring-4 focus:ring-[var(--ds-bg-accent-primary-subtle)] focus:border-[var(--ds-border-accent-primary)] shadow-sm'} transition-all duration-300 hover:shadow-md hover:border-[var(--ds-border-tertiary)] placeholder:text-[var(--ds-text-secondary)] outline-none`}
            placeholder="Tìm kiếm thông minh hoặc đặt câu hỏi cho AI..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(query); }}
            onFocus={() => setIsFocused(true)}
          />
          <div className="absolute inset-y-0 right-0 pr-1 flex items-center pr-2">
            <Button
              variant="primary"
              size="icon-m"
              onClick={() => query.trim() && handleSearch(query)}
              className="bg-[var(--ds-bg-accent-primary)] rounded-full hover:shadow-md transition-all duration-200 active:scale-95 border-none h-10 w-10 p-0"
            >
              <Search size={18} />
            </Button>
          </div>

          {isFocused && (
            <div className="absolute top-full left-0 right-0 bg-[var(--ds-bg-primary)] shadow-xl border border-[var(--ds-border-tertiary)] rounded-b-3xl overflow-hidden z-50 animate-slide-down origin-top custom-scrollbar max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--ds-border-tertiary)]">
                <div className="p-4 space-y-6">
                  {!query && (
                    <div>
                      <div className="text-xs font-bold text-[var(--ds-text-secondary)] uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Target size={14} className="text-[var(--ds-fg-accent-primary)]" /> Gợi ý theo ngữ cảnh
                      </div>
                      <div className="space-y-1">
                        {smartSuggestions.map((item, idx) => (
                          <Button
                            key={idx}
                            variant="subtle"
                            onClick={() => { setQuery(item.text); handleSearch(item.text); }}
                            className="w-full text-left px-3 py-2 text-sm text-[var(--ds-text-primary)] hover:bg-[var(--ds-bg-accent-primary-subtle)] hover:text-[var(--ds-fg-accent-primary)] rounded-xl transition-all flex items-center justify-start gap-3 group h-auto border-none shadow-none"
                          >
                            <div className="w-8 h-8 rounded-lg bg-[var(--ds-bg-accent-primary-subtle)] flex items-center justify-center text-[var(--ds-fg-accent-primary)] group-hover:bg-white group-hover:shadow-sm transition-all shrink-0">
                              <item.icon size={16} />
                            </div>
                            <span className="font-medium">{item.text}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  {!query && searchHistory.length > 0 && (
                    <div>
                      <div className="text-xs font-bold text-[var(--ds-text-tertiary)] uppercase tracking-wider mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2"><Clock size={14} /> Tìm kiếm gần đây</div>
                        <button onClick={() => dispatch({ type: 'CLEAR_SEARCH_HISTORY' })} className="text-[var(--ds-text-tertiary)] hover:text-[var(--ds-fg-danger)] lowercase text-[10px]">Xóa lịch sử</button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {searchHistory.slice(0, 5).map((h, idx) => (
                          <Button
                            key={idx}
                            variant="border"
                            size="s"
                            onClick={() => { setQuery(h); handleSearch(h); }}
                            className="px-3 py-1.5 bg-[var(--ds-bg-secondary)] hover:bg-[var(--ds-bg-secondary)] text-[var(--ds-text-secondary)] border border-[var(--ds-border-tertiary)] rounded-lg text-xs transition-colors flex items-center gap-1.5 h-auto font-normal"
                          >
                            <Clock size={12} className="text-[var(--ds-text-tertiary)]" />{h}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="bg-[var(--ds-bg-secondary)]/50 p-4">
                  <div className="text-xs font-bold text-[var(--ds-text-secondary)] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Flame size={14} className={query ? 'text-[var(--ds-fg-accent-primary)]' : 'text-[var(--ds-text-tertiary)]'} />
                    {query ? 'Kết quả tri thức liên quan' : 'Đang nổi bật trong tuần'}
                  </div>
                  <div className="space-y-2">
                    {searchResults.slice(0, 4).map((article) => (
                      <button key={article.id} onClick={() => onOpenArticle(article.id)} className="w-full p-3 bg-[var(--ds-bg-primary)] border border-[var(--ds-border-secondary)] hover:border-[var(--ds-border-accent-primary)] hover:shadow-md rounded-xl transition-all text-left group flex gap-3 items-start">
                        <div className="w-8 h-8 rounded-lg bg-[var(--ds-bg-secondary)] flex items-center justify-center text-[var(--ds-text-secondary)] group-hover:bg-[var(--ds-bg-accent-primary-subtle)] group-hover:text-[var(--ds-fg-accent-primary)] transition-colors shrink-0 mt-0.5">
                          <BookOpen size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-[var(--ds-text-primary)] line-clamp-2 group-hover:text-[var(--ds-fg-accent-primary)] transition-colors mb-1">{article.title}</div>
                          <div className="flex items-center gap-2 text-[10px] text-[var(--ds-text-tertiary)]">
                            <span className="font-medium text-[var(--ds-text-secondary)]">{article.author.name}</span>
                            <span>•</span><span>{article.folderName}</span>
                          </div>
                        </div>
                        <ArrowRight size={14} className="text-[var(--ds-text-tertiary)]/50 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all" />
                      </button>
                    ))}
                    {query && (
                      <Button
                        variant="subtle"
                        size="s"
                        onClick={() => handleSearch(query)}
                        className="w-full mt-2 py-2 text-xs font-bold text-[var(--ds-fg-accent-primary)] hover:bg-[var(--ds-bg-accent-primary-subtle)] rounded-lg transition-colors flex items-center justify-center gap-1 border-none shadow-none"
                      >
                        Xem tất cả kết quả <ArrowRight size={12} />
                      </Button>
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
