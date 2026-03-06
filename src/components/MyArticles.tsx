import React, { useState } from 'react';
import { Plus, Search, Eye, Heart, MessageSquare, Edit3, Trash2, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../App';
import { Article } from '../store/useAppStore';
import { motion, AnimatePresence } from 'motion/react';

export default function MyArticles() {
  const { state, dispatch } = useApp();
  const { addToast } = useToast();
  const { articles, currentUser } = state;
  const [activeTab, setActiveTab] = useState<'published' | 'draft'>('published');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const myArticles = articles.filter(a => a.author.id === currentUser.id);
  const published = myArticles.filter(a => a.status === 'published');
  const drafts = myArticles.filter(a => a.status === 'draft');
  const filtered = (activeTab === 'published' ? published : drafts).filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalViews = published.reduce((s, a) => s + a.views, 0);
  const totalLikes = published.reduce((s, a) => s + a.likes, 0);
  const totalComments = published.reduce((s, a) => s + a.comments.length, 0);

  const handleEdit = (article: Article) => dispatch({ type: 'OPEN_EDITOR', article });
  const handleDelete = (id: string) => { dispatch({ type: 'DELETE_ARTICLE', articleId: id }); addToast('Đã xóa bài viết', 'success'); setConfirmDeleteId(null); };
  const handleView = (id: string) => { dispatch({ type: 'SET_SELECTED_ARTICLE', articleId: id }); dispatch({ type: 'INCREMENT_VIEWS', articleId: id }); };

  return (
    <div className="max-w-4xl mx-auto px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Bài viết của tôi</h1>
          <p className="text-sm text-gray-400 mt-0.5">Quản lý các bài viết bạn đã đăng và nháp</p>
        </div>
        <button
          onClick={() => dispatch({ type: 'OPEN_EDITOR', article: {} })}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md text-sm font-medium hover:bg-orange-600 transition-colors"
        >
          <Plus size={14} /> Viết bài mới
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Lượt xem', value: totalViews },
          { label: 'Lượt thích', value: totalLikes },
          { label: 'Bình luận', value: totalComments },
        ].map(s => (
          <div key={s.label} className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-center">
            <p className="text-xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs + Search */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center border-b border-gray-200">
          {[
            { key: 'published', label: `Đã đăng (${published.length})` },
            { key: 'draft', label: `Nháp (${drafts.length})` },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === tab.key
                  ? 'border-orange-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Tìm bài viết..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-orange-400 w-52"
          />
        </div>
      </div>

      {/* Articles List */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <FileText size={32} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Không có bài viết nào</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((article, i) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-start gap-4 p-4 bg-white border border-gray-100 rounded-lg hover:border-orange-200 hover:bg-orange-50/20 transition-all group"
                >
                  {article.coverUrl && (
                    <img src={article.coverUrl} className="w-20 h-14 object-cover rounded-md shrink-0 border border-gray-100" referrerPolicy="no-referrer" />
                  )}
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => handleView(article.id)}
                      className="text-sm font-medium text-gray-900 hover:text-orange-600 transition-colors line-clamp-2 text-left leading-snug mb-2 block"
                    >
                      {article.title}
                    </button>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>{article.updatedAt}</span>
                      <span className="flex items-center gap-1"><Eye size={11} /> {article.views}</span>
                      <span className="flex items-center gap-1"><Heart size={11} /> {article.likes}</span>
                      <span className="flex items-center gap-1"><MessageSquare size={11} /> {article.comments.length}</span>
                      {article.viewPermission === 'restricted' && <span className="text-orange-400">Riêng tư</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button onClick={() => handleEdit(article)} className="p-2 hover:bg-orange-50 text-gray-400 hover:text-orange-500 rounded-md transition-colors"><Edit3 size={14} /></button>
                    <button onClick={() => setConfirmDeleteId(article.id)} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-md transition-colors"><Trash2 size={14} /></button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {confirmDeleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirmDeleteId(null)} className="absolute inset-0 bg-black/40" />
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="relative bg-white rounded-lg w-full max-w-sm shadow-xl p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-2">Xoá bài viết?</h3>
              <p className="text-sm text-gray-500 mb-6">Bài viết sẽ bị xoá vĩnh viễn và không thể khôi phục.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDeleteId(null)} className="flex-1 py-2.5 text-sm text-gray-500 hover:bg-gray-100 rounded-md transition-colors">Huỷ</button>
                <button onClick={() => handleDelete(confirmDeleteId)} className="flex-1 py-2.5 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors">Xoá</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
