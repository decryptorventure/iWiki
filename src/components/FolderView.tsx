import React, { useState } from 'react';
import { ArrowLeft, Search, Plus, Eye, Flame, MessageSquare, Users, FolderOpen, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../App';

interface FolderViewProps {
  folderId: string;
  title: string;
  description?: string;
  breadcrumbs?: string[];
}

export default function FolderView({ folderId, title, description, breadcrumbs = [] }: FolderViewProps) {
  const { state, dispatch } = useApp();
  const { addToast } = useToast();
  const { articles, folders, currentUser } = state;
  const [searchQuery, setSearchQuery] = useState('');

  // Get this folder's subfolders
  const parentFolder = folders.find(f => f.id === folderId);
  const subfolders = parentFolder?.children || folders.flatMap(f => f.children || []).filter(f => f.parentId === folderId) || [];

  // Get articles in this folder
  const folderArticles = articles.filter(a => a.folderId === folderId && a.status === 'published').filter(a =>
    !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase()) || (a.author.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredArticle = folderArticles[0] || null;
  const otherArticles = folderArticles.slice(1);

  const openArticle = (id: string) => {
    dispatch({ type: 'SET_SELECTED_ARTICLE', articleId: id });
    dispatch({ type: 'INCREMENT_VIEWS', articleId: id });
  };

  const handleNewArticle = () => {
    dispatch({ type: 'OPEN_EDITOR', article: { folderId } });
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-10 animate-fade-in">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm font-medium mb-8 backdrop-blur-sm animate-slide-up">
        <button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'dashboard' })} className="text-gray-500 hover:text-[#FF6B4A] transition-colors active:scale-95">Trang chủ</button>
        {breadcrumbs.map((crumb, i) => (
          <React.Fragment key={i}>
            <span className="text-gray-300">/</span>
            <span className={i === breadcrumbs.length - 1 ? 'text-gray-900 font-bold' : 'text-gray-500'}>{crumb}</span>
          </React.Fragment>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 animate-slide-up stagger-1">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{title}</h1>
          {description && <p className="text-gray-500 max-w-2xl">{description}</p>}
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
            <span className="flex items-center gap-1.5"><BookOpen size={15} /> {folderArticles.length} bài viết</span>
            {subfolders.length > 0 && <span className="flex items-center gap-1.5"><FolderOpen size={15} /> {subfolders.length} thư mục con</span>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Tìm trong thư mục..."
              className="pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A]/50 outline-none transition-all hover:border-gray-300 w-52"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button onClick={handleNewArticle} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6A] text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-[#FF6B4A]/20 transition-all duration-200 shadow-md active:scale-95">
            <Plus size={18} /> Viết bài mới
          </button>
        </div>
      </div>

      {/* Subfolders */}
      {subfolders.length > 0 && !searchQuery && (
        <div className="mb-10 animate-slide-up stagger-2">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Thư mục con</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {subfolders.map((sub, i) => {
              const subArticleCount = articles.filter(a => a.folderId === sub.id && a.status === 'published').length;
              return (
                <div
                  key={sub.id}
                  onClick={() => {
                    if (subArticleCount === 0) {
                      dispatch({ type: 'SET_CURRENT_FOLDER', folderId: sub.id });
                      dispatch({ type: 'SET_SCREEN', screen: 'empty-folder' });
                    } else {
                      dispatch({ type: 'SET_SCREEN', screen: `folder-${sub.id}` });
                    }
                  }}
                  className={`card-premium p-5 cursor-pointer flex items-center gap-3 group animate-slide-up stagger-${i + 2}`}
                >
                  <div className="p-3 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl text-[#FF6B4A] group-hover:scale-110 transition-transform duration-300">
                    <FolderOpen size={22} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate group-hover:text-[#FF6B4A] transition-colors">{sub.name}</p>
                    <p className="text-xs text-gray-400">{subArticleCount} bài viết</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {folderArticles.length === 0 ? (
        <div className="text-center py-20 animate-fade-in">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-50 to-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
            <BookOpen size={32} className="text-[#FF6B4A]" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{searchQuery ? 'Không tìm thấy bài viết' : 'Thư mục chưa có bài viết'}</h3>
          <p className="text-gray-500 mb-6">{searchQuery ? 'Thử tìm từ khóa khác' : 'Hãy là người đầu tiên đóng góp kiến thức!'}</p>
          {!searchQuery && (
            <button onClick={handleNewArticle} className="px-5 py-2.5 bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6A] text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg hover:shadow-[#FF6B4A]/20 transition-all duration-200 active:scale-95">
              <Plus size={16} className="inline mr-2" />Viết bài đầu tiên
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up stagger-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Featured Article */}
            {featuredArticle && !searchQuery && (
              <div onClick={() => openArticle(featuredArticle.id)} className="rounded-2xl overflow-hidden bg-white border border-gray-200/80 shadow-sm cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                {featuredArticle.coverUrl && (
                  <div className="h-48 overflow-hidden relative">
                    <img src={featuredArticle.coverUrl} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="text-xs font-semibold bg-[#FF6B4A]/90 backdrop-blur-sm px-2 py-0.5 rounded-full mb-2 inline-block">Bài viết nổi bật</div>
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <img src={featuredArticle.author.avatar} alt="Avatar" className="w-7 h-7 rounded-full" referrerPolicy="no-referrer" />
                    <span className="text-sm font-semibold text-gray-900">{featuredArticle.author.name}</span>
                    <span className="text-xs text-gray-400">· {featuredArticle.createdAt}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#FF6B4A] transition-colors">{featuredArticle.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">{featuredArticle.excerpt || featuredArticle.content?.slice(0, 120)}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Eye size={14} /> {featuredArticle.views}</span>
                    <span className="flex items-center gap-1"><Flame size={14} className="text-[#FF6B4A]" /> {featuredArticle.likes}</span>
                    <span className="flex items-center gap-1"><MessageSquare size={14} /> {featuredArticle.comments.length}</span>
                    {featuredArticle.tags.slice(0, 2).map(t => <span key={t} className="px-2 py-0.5 bg-orange-50 text-[#FF6B4A] rounded-full font-medium">{t}</span>)}
                  </div>
                </div>
              </div>
            )}

            {/* Other Articles */}
            <div className="space-y-3">
              {(searchQuery ? folderArticles : otherArticles).map((article, i) => (
                <div key={article.id} onClick={() => openArticle(article.id)} className={`card-premium p-4 cursor-pointer flex items-start gap-4 animate-slide-up stagger-${i + 3}`}>
                  {article.coverUrl && (
                    <div className="w-16 h-14 rounded-lg overflow-hidden shrink-0 hidden sm:block">
                      <img src={article.coverUrl} alt="Cover" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2 hover:text-[#FF6B4A] transition-colors">{article.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>{article.author.name}</span>
                      <span>{article.createdAt}</span>
                      <span className="flex items-center gap-1"><Eye size={12} /> {article.views}</span>
                      <span className="flex items-center gap-1"><Flame size={12} className="text-[#FF6B4A]" /> {article.likes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Contributors */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><Users size={16} className="text-indigo-500" /> Top đóng góp</h3>
              <div className="space-y-3">
                {Array.from(new Set(folderArticles.map(a => a.author.id))).slice(0, 4).map(authorId => {
                  const authorArticles = folderArticles.filter(a => a.author.id === authorId);
                  const author = authorArticles[0]?.author;
                  if (!author) return null;
                  return (
                    <div key={authorId} className="flex items-center gap-3">
                      <img src={author.avatar} alt={author.name} className="w-8 h-8 rounded-full ring-1 ring-gray-100" referrerPolicy="no-referrer" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{author.name}</div>
                        <div className="text-xs text-gray-400">{authorArticles.length} bài viết</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Trending in folder */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><Flame size={16} className="text-[#FF6B4A]" /> Được xem nhiều</h3>
              <div className="space-y-3">
                {[...folderArticles].sort((a, b) => b.views - a.views).slice(0, 5).map((article, i) => (
                  <button key={article.id} onClick={() => openArticle(article.id)} className="w-full text-left flex items-start gap-3 group">
                    <span className="text-lg font-extrabold text-gray-200 leading-none">{String(i + 1).padStart(2, '0')}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-[#FF6B4A] transition-colors">{article.title}</p>
                      <span className="text-xs text-gray-400 flex items-center gap-1 mt-1"><Eye size={12} /> {article.views}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
