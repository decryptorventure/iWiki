import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../App';
import { Eye, FileText, Search, Edit3, ChevronRight, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Profile() {
  const { state, dispatch } = useApp();
  const { addToast } = useToast();
  const { currentUser, articles } = state;

  const [activeTab, setActiveTab] = useState<'published' | 'pending' | 'draft' | 'saved'>('published');
  const [searchQuery, setSearchQuery] = useState('');

  const myArticles = articles.filter(a => a.author.id === currentUser.id);
  const publishedArticles = myArticles.filter(a => a.status === 'published');
  const draftArticles = myArticles.filter(a => a.status === 'draft');
  const totalViews = myArticles.reduce((s, a) => s + a.views, 0);
  const totalLikes = myArticles.reduce((s, a) => s + a.likes, 0);

  const tabArticles = {
    published: publishedArticles,
    pending: [],
    draft: draftArticles,
    saved: [],
  }[activeTab];

  const filteredArticles = tabArticles.filter(a =>
    !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { key: 'published', label: 'Đã đăng', count: publishedArticles.length },
    { key: 'pending', label: 'Chờ duyệt', count: 0 },
    { key: 'draft', label: 'Nháp', count: draftArticles.length },
    { key: 'saved', label: 'Đã lưu', count: 0 },
  ] as const;

  return (
    <div>
      {/* Banner */}
      <div className="w-full h-36 bg-amber-400 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-300 to-orange-400" />
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="text-9xl">🐵</div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-6 pb-0">
        <div className="flex items-end gap-6 -mt-10 mb-4">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-md"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="pb-2">
            <h1 className="text-xl font-bold text-gray-900">{currentUser.name}</h1>
          </div>
        </div>

        <div className="flex flex-col gap-1 mb-4 ml-1">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>✉️</span>
            <span className="text-orange-500">{currentUser.name.toLowerCase().replace(' ', '.')}@ikameglobal.com</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>🏢</span>
            <span>{currentUser.title}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>👤</span>
            <span>--</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>🔒</span>
            <span>{currentUser.role === 'admin' ? 'Admin' : 'Technology'}</span>
          </div>
        </div>

        <div className="mb-4 space-y-1 border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Tất cả bài viết</span>
            <span className="font-medium text-gray-900">{myArticles.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm pl-4">
            <span className="text-gray-500">— Đã đăng</span>
            <span className="text-gray-900">{publishedArticles.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm pl-4">
            <span className="text-gray-500">— Chờ duyệt</span>
            <span className="text-orange-500 font-medium">0</span>
          </div>
          <div className="flex items-center justify-between text-sm pl-4">
            <span className="text-gray-500">— Nháp</span>
            <span className="text-gray-900">{draftArticles.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm pl-4">
            <span className="text-gray-500">— Đã lưu</span>
            <span className="text-orange-500 font-medium">0</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2 pt-2 border-t border-gray-100">
            <span className="text-gray-600">Tổng lượt xem</span>
            <span className="font-medium text-gray-900">{totalViews}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Tổng lượt thích</span>
            <span className="font-medium text-gray-900">{totalLikes}</span>
          </div>
        </div>

        <button
          onClick={() => dispatch({ type: 'OPEN_EDITOR' })}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors mb-4"
        >
          <Plus size={16} /> Tạo bài viết
        </button>
      </div>

      {/* Article Tabs - Right Panel */}
      <div className="border-t border-gray-200 mt-2">
        <div className="flex items-center justify-between px-6 pt-4 pb-0">
          <div className="flex items-center gap-0">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.key
                    ? 'border-orange-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                {tab.label} <span className="ml-1 text-xs">{tab.count}</span>
              </button>
            ))}
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-md text-gray-400 transition-colors">
            <Search size={16} />
          </button>
        </div>

        <div className="px-6 py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {filteredArticles.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText size={24} className="text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium mb-1">Chưa có bài viết đã đăng</p>
                  <p className="text-gray-400 text-sm">Bạn chưa có bài viết nào được đăng. Hãy tạo bài viết mới để chia sẻ kiến thức của bạn.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredArticles.map(article => (
                    <div
                      key={article.id}
                      onClick={() => { dispatch({ type: 'SET_SELECTED_ARTICLE', articleId: article.id }); dispatch({ type: 'INCREMENT_VIEWS', articleId: article.id }); }}
                      className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg hover:border-orange-200 hover:bg-orange-50/30 cursor-pointer transition-all group"
                    >
                      {article.coverUrl && (
                        <img src={article.coverUrl} className="w-20 h-14 object-cover rounded-md shrink-0" referrerPolicy="no-referrer" />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 mb-2">
                          {article.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span>{article.updatedAt}</span>
                          <span className="flex items-center gap-1"><Eye size={11} /> {article.views}</span>
                        </div>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); dispatch({ type: 'OPEN_EDITOR', article }); }}
                        className="p-2 hover:bg-orange-100 hover:text-orange-500 text-gray-400 rounded transition-colors"
                      >
                        <Edit3 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
