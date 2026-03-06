import React, { useState } from 'react';
import { Search, Eye, Heart, MessageSquare, ChevronRight, FolderOpen, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../App';
import { motion, AnimatePresence } from 'motion/react';

interface FolderViewProps {
  folderId: string;
  title: string;
  description?: string;
  breadcrumbs?: string[];
}

export default function FolderView({ folderId, title, description, breadcrumbs = [] }: FolderViewProps) {
  const { state, dispatch } = useApp();
  const { articles, folders } = state;
  const [searchQuery, setSearchQuery] = useState('');

  const findFolderById = (fs: any[], id: string): any => {
    for (const f of fs) {
      if (f.id === id) return f;
      if (f.children) { const found = findFolderById(f.children, id); if (found) return found; }
    }
    return null;
  };

  const currentFolder = findFolderById(folders, folderId);
  const subfolders = currentFolder?.children || [];
  const folderArticles = articles.filter(a => a.folderId === folderId && a.status === 'published').filter(a =>
    !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openArticle = (id: string) => {
    dispatch({ type: 'SET_SELECTED_ARTICLE', articleId: id });
    dispatch({ type: 'INCREMENT_VIEWS', articleId: id });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1 text-xs text-gray-400 mb-4">
        <button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'dashboard' })} className="hover:text-orange-500 transition-colors">
          Trang chủ
        </button>
        {breadcrumbs.map((crumb, i) => (
          <React.Fragment key={i}>
            <ChevronRight size={12} />
            <span className={i === breadcrumbs.length - 1 ? 'text-gray-700' : 'hover:text-orange-500 cursor-pointer'}>{crumb}</span>
          </React.Fragment>
        ))}
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Tìm bài viết..."
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 w-52"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => dispatch({ type: 'OPEN_EDITOR', article: { folderId } })}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            <Plus size={14} /> Đóng góp
          </button>
        </div>
      </div>

      {/* Subfolders */}
      {subfolders.length > 0 && !searchQuery && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Thư mục con</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {subfolders.map((sub: any) => {
              const count = articles.filter(a => a.folderId === sub.id && a.status === 'published').length;
              return (
                <button
                  key={sub.id}
                  onClick={() => dispatch({ type: 'SET_SCREEN', screen: `folder-${sub.id}` })}
                  className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all text-left"
                >
                  <FolderOpen size={18} className="text-orange-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{sub.name}</p>
                    <p className="text-xs text-gray-400">{count} bài viết</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Articles */}
      <AnimatePresence mode="wait">
        {folderArticles.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <p className="text-gray-400 text-sm mb-2">Thư mục đang trống</p>
            <p className="text-gray-300 text-xs">Hãy là người đầu tiên đóng góp kiến thức</p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {folderArticles.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => openArticle(article.id)}
                className="flex items-start gap-4 p-4 bg-white border border-gray-100 rounded-lg cursor-pointer hover:border-orange-200 hover:bg-orange-50/30 transition-all group"
              >
                {article.coverUrl && (
                  <img
                    src={article.coverUrl}
                    className="w-24 h-16 object-cover rounded-md shrink-0 border border-gray-100"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 mb-2 leading-snug">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <img src={article.author.avatar} className="w-4 h-4 rounded-full" referrerPolicy="no-referrer" />
                      <span>{article.author.name}</span>
                    </div>
                    <span>·</span>
                    <span>{article.createdAt}</span>
                    <span className="flex items-center gap-1"><Eye size={11} /> {article.views}</span>
                    <span className="flex items-center gap-1"><Heart size={11} /> {article.likes}</span>
                    <span className="flex items-center gap-1"><MessageSquare size={11} /> {article.comments.length}</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-orange-400 transition-colors shrink-0 mt-1" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
