import React, { useState } from 'react';
import { Search, Sparkles, Eye, MessageSquare, Flame, Trophy, Medal, TrendingUp, BookOpen, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Dashboard({ onSearch }: { onSearch: (q: string) => void }) {
  const { state, dispatch } = useApp();
  const { articles, currentUser } = state;
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) onSearch(query);
  };

  const publishedArticles = articles.filter(a => a.status === 'published');
  const featuredArticles = publishedArticles.slice(0, 5);
  const allArticles = publishedArticles.slice(0, 10);
  const recentArticles = articles
    .filter(a => a.status === 'published')
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const leaderboard = [
    { rank: 1, name: 'Nguyễn Văn A', role: 'Product Manager', score: currentUser.xp, avatar: currentUser.avatar },
    { rank: 2, name: 'Trần Hoàng Huy', role: 'Solution BE Developer', score: 980, avatar: 'https://picsum.photos/seed/huy/100/100' },
    { rank: 3, name: 'Phạm Thùy Mai', role: 'Admin & Event', score: 850, avatar: 'https://picsum.photos/seed/mai/100/100' },
    { rank: 4, name: 'Lê Thị B', role: 'Designer', score: 720, avatar: 'https://picsum.photos/seed/user2/100/100' },
    { rank: 5, name: 'Trần Đức Bo', role: 'QA Engineer', score: 640, avatar: 'https://picsum.photos/seed/user1/100/100' },
  ];

  const getMedalStyle = (rank: number) => {
    if (rank === 1) return 'text-yellow-500 bg-yellow-50 ring-2 ring-yellow-200';
    if (rank === 2) return 'text-gray-400 bg-gray-50 ring-2 ring-gray-200';
    if (rank === 3) return 'text-amber-600 bg-amber-50 ring-2 ring-amber-200';
    return '';
  };

  const openArticle = (id: string) => {
    dispatch({ type: 'SET_SELECTED_ARTICLE', articleId: id });
    dispatch({ type: 'INCREMENT_VIEWS', articleId: id });
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-12 relative">
      {/* Hero Search Section */}
      <div className="flex flex-col items-center justify-center pb-14 text-center">
        <div className="flex items-center gap-6 mb-8 animate-fade-in">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 text-sm">
            <BookOpen size={16} className="text-[#FF6B4A]" />
            <span className="text-gray-600"><strong className="text-gray-900">{publishedArticles.length}</strong> bài viết</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 text-sm">
            <TrendingUp size={16} className="text-green-500" />
            <span className="text-gray-600"><strong className="text-gray-900">+{publishedArticles.filter(a => {
              const d = new Date(a.createdAt); const now = new Date();
              return now.getTime() - d.getTime() < 7 * 24 * 60 * 60 * 1000;
            }).length}</strong> tuần này</span>
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

        <div className={`w-full max-w-3xl relative group animate-slide-up stagger-2 ${isFocused ? 'z-50' : 'z-10'}`}>
          <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6B4A]/20 to-orange-300/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Sparkles className="h-5 w-5 text-[#FF6B4A]" />
            </div>
            <input
              type="text"
              className="block w-full pl-14 pr-14 py-4 text-base text-gray-900 bg-white border border-gray-200 rounded-full focus:ring-4 focus:ring-[#FF6B4A]/15 focus:border-[#FF6B4A]/50 shadow-sm transition-all duration-300 hover:shadow-md hover:border-gray-300 placeholder:text-gray-400"
              placeholder="Hỏi AI hoặc tìm kiếm bài viết..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <button onClick={() => query.trim() && onSearch(query)} className="p-2.5 text-white bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6A] rounded-full hover:shadow-md hover:shadow-[#FF6B4A]/25 transition-all duration-200 active:scale-95">
                <Search size={18} />
              </button>
            </div>

            {/* Recent Articles Dropdown */}
            {isFocused && !query && recentArticles.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in py-2">
                <div className="px-5 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Flame size={12} className="text-[#FF6B4A]" />
                  Bài viết xem gần đây
                </div>
                {recentArticles.map((article) => (
                  <button
                    key={article.id}
                    onClick={() => openArticle(article.id)}
                    className="w-full px-5 py-3 flex items-center gap-3 hover:bg-orange-50/50 transition-colors text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-[#FF6B4A] transition-colors shrink-0">
                      <BookOpen size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900 truncate group-hover:text-[#FF6B4A] transition-colors">{article.title}</div>
                      <div className="text-xs text-gray-500 truncate mt-0.5 flex items-center gap-2">
                        <span>{article.author.name}</span>
                        <span>•</span>
                        <span>{article.views} lượt xem</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Featured Articles */}
      <div className="mb-12 animate-slide-up stagger-3">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Flame size={20} className="text-[#FF6B4A]" />Bài viết nổi bật
          </h2>
          <button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'my-articles' })} className="text-sm text-gray-500 hover:text-[#FF6B4A] font-medium transition-colors">Xem thêm →</button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Large Card */}
          {featuredArticles[0] && (
            <div onClick={() => openArticle(featuredArticles[0].id)} className="lg:col-span-1 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-2xl p-8 cursor-pointer hover:shadow-xl transition-all duration-300 border border-orange-100/50 flex flex-col justify-between min-h-[400px] hover:-translate-y-1">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <img src={featuredArticles[0].author.avatar} alt="Avatar" className="w-10 h-10 rounded-full ring-2 ring-white shadow-sm" referrerPolicy="no-referrer" />
                  <div>
                    <div className="text-sm font-bold text-gray-900">{featuredArticles[0].author.name}</div>
                    <div className="text-xs text-gray-500">{featuredArticles[0].author.role}</div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">{featuredArticles[0].title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{featuredArticles[0].excerpt}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500 mt-8">
                <span>{featuredArticles[0].createdAt}</span>
                <span className="flex items-center gap-1"><Eye size={14} /> {featuredArticles[0].views}</span>
                <span className="flex items-center gap-1"><Flame size={14} className="text-[#FF6B4A]" /> {featuredArticles[0].likes}</span>
                <span className="flex items-center gap-1"><MessageSquare size={14} /> {featuredArticles[0].comments.length}</span>
              </div>
            </div>
          )}
          {/* Small Cards Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {featuredArticles.slice(1, 5).map((article, i) => (
              <div key={article.id} onClick={() => openArticle(article.id)}
                className={`bg-white rounded-2xl border border-gray-200/80 overflow-hidden cursor-pointer hover:shadow-lg hover:border-[#FF6B4A]/30 transition-all duration-300 flex flex-col hover:-translate-y-1 animate-slide-up stagger-${i + 2}`}>
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
                    <h4 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 hover:text-[#FF6B4A] transition-colors">{article.title}</h4>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                    <span>{article.createdAt}</span>
                    <span className="flex items-center gap-1"><Eye size={12} /> {article.views}</span>
                    <span className="flex items-center gap-1"><Flame size={12} className="text-[#FF6B4A]" /> {article.likes}</span>
                    <span className="flex items-center gap-1"><MessageSquare size={12} /> {article.comments.length}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up stagger-4">
        {/* All Articles */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Tất cả bài viết</h2>
            <button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'folder-f-company' })} className="text-sm text-gray-500 hover:text-[#FF6B4A] font-medium transition-colors">Xem thêm →</button>
          </div>
          <div className="space-y-4">
            {allArticles.map((article) => (
              <div key={article.id} onClick={() => openArticle(article.id)} className="card-premium p-6 cursor-pointer flex gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={article.author.avatar} alt="Avatar" className="w-8 h-8 rounded-full ring-1 ring-gray-100" referrerPolicy="no-referrer" />
                    <div>
                      <div className="text-sm font-bold text-gray-900">{article.author.name}</div>
                      <div className="text-xs text-gray-500">{article.author.role}</div>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-[#FF6B4A] transition-colors">{article.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{article.excerpt || article.content.slice(0, 120) + '...'}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{article.createdAt}</span>
                    <span className="flex items-center gap-1"><Eye size={14} /> {article.views}</span>
                    <span className="flex items-center gap-1"><Flame size={14} className="text-[#FF6B4A]" /> {article.likes}</span>
                    <span className="flex items-center gap-1"><MessageSquare size={14} /> {article.comments.length}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Leaderboard */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2"><Trophy className="text-yellow-500" size={20} /><h2 className="text-xl font-bold text-gray-900">Bảng xếp hạng</h2></div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm">
              {leaderboard.map((user, index) => (
                <div key={user.rank} className={`flex items-center gap-3 p-4 ${index !== leaderboard.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50/80 transition-all duration-200 group`}>
                  <div className="w-8 font-bold text-center flex justify-center shrink-0">
                    {user.rank <= 3 ? (
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center ${getMedalStyle(user.rank)}`}><Medal size={16} /></div>
                    ) : (
                      <span className="text-gray-400 text-sm">{user.rank}</span>
                    )}
                  </div>
                  <img src={user.avatar} alt="Avatar" className={`w-10 h-10 rounded-full border-2 shrink-0 ${user.rank === 1 ? 'border-yellow-300 shadow-md shadow-yellow-500/20' : 'border-gray-100'}`} referrerPolicy="no-referrer" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-gray-900 truncate group-hover:text-[#FF6B4A] transition-colors">{user.name}</div>
                    <div className="text-[10px] text-gray-500 truncate">{user.role}</div>
                  </div>
                  <div className="text-sm font-bold text-[#FF6B4A] whitespace-nowrap">{user.score} <span className="text-xs text-gray-500 font-normal">pts</span></div>
                </div>
              ))}
            </div>
          </div>

          {/* For You */}
          <div>
            <div className="flex items-center gap-2 mb-6"><Sparkles className="text-yellow-500" size={20} /><h2 className="text-xl font-bold text-gray-900">Dành cho bạn</h2></div>
            <div className="space-y-4">
              {allArticles.slice(0, 3).map((article) => (
                <div key={article.id} onClick={() => openArticle(article.id)}
                  className="bg-white p-5 rounded-2xl border border-gray-200/80 cursor-pointer hover:shadow-lg hover:border-yellow-300/50 transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-400/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="flex items-center gap-2 mb-3 relative">
                    <img src={article.author.avatar} alt="Avatar" className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
                    <div>
                      <div className="text-xs font-bold text-gray-900">{article.author.name}</div>
                      <div className="text-[10px] text-gray-500">{article.author.role}</div>
                    </div>
                  </div>
                  <h4 className="font-bold text-sm text-gray-900 mb-2 hover:text-yellow-600 transition-colors relative">{article.title}</h4>
                  <div className="text-xs text-gray-500 relative">{article.createdAt}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
