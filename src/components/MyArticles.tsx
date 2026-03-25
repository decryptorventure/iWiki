import React, { useState } from 'react';
import { Plus, Search, Eye, Flame, MessageSquare, Trash2, BookOpen, FileText, CheckCircle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../App';
import { Article } from '../store/useAppStore';
import { can } from '../lib/permissions';
import MyArticleCard from './my-article-card';

export default function MyArticles() {
  const { state, dispatch } = useApp();
  const { addToast } = useToast();
  const { articles, currentUser } = state;
  const [activeTab, setActiveTab] = useState<'published' | 'draft' | 'in_review' | 'rejected' | 'approved'>('published');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const myArticles = articles.filter(a => a.author.id === currentUser.id);
  const published = myArticles.filter(a => a.status === 'published');
  const drafts = myArticles.filter(a => a.status === 'draft');
  const inReview = myArticles.filter(a => a.status === 'in_review');
  const rejected = myArticles.filter(a => a.status === 'rejected');
  const approved = myArticles.filter(a => a.status === 'approved');
  const source = activeTab === 'published'
    ? published
    : activeTab === 'draft'
      ? drafts
      : activeTab === 'in_review'
        ? inReview
        : activeTab === 'approved'
          ? approved
          : rejected;
  const filtered = source.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalViews = published.reduce((s, a) => s + a.views, 0);
  const totalLikes = published.reduce((s, a) => s + a.likes, 0);
  const totalComments = published.reduce((s, a) => s + a.comments.length, 0);

  const handleNewArticle = () => {
    dispatch({ type: 'OPEN_EDITOR', article: {} });
  };

  const handleEdit = (article: Article) => {
    dispatch({ type: 'OPEN_EDITOR', article });
    setOpenMenuId(null);
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_ARTICLE', articleId: id });
    addToast('Đã xóa bài viết thành công', 'success');
    setConfirmDeleteId(null);
    setOpenMenuId(null);
  };

  const handleView = (id: string) => {
    dispatch({ type: 'SET_SELECTED_ARTICLE', articleId: id });
    dispatch({ type: 'INCREMENT_VIEWS', articleId: id });
    setOpenMenuId(null);
  };

  const tabs = [
    { id: 'published', label: 'Đã xuất bản', icon: CheckCircle, count: published.length },
    { id: 'draft', label: 'Bản nháp', icon: FileText, count: drafts.length },
    { id: 'in_review', label: 'Chờ duyệt', icon: Eye, count: inReview.length },
    { id: 'approved', label: 'Đã duyệt', icon: CheckCircle, count: approved.length },
    { id: 'rejected', label: 'Bị từ chối', icon: X, count: rejected.length },
  ] as const;

  const submitForReview = (article: Article) => {
    if (!can(currentUser, 'article.submit_review', article)) {
      addToast('Bạn không có quyền gửi bài này để duyệt', 'warning');
      return;
    }
    dispatch({ type: 'SUBMIT_ARTICLE_REVIEW', articleId: article.id, userId: currentUser.id });
    dispatch({
      type: 'TRACK_EVENT',
      event: { type: 'submit_review', userId: currentUser.id, articleId: article.id },
    });
    addToast('Đã gửi bài viết sang hàng chờ duyệt', 'success');
  };

  return (
    <div className="max-w-5xl mx-auto px-8 py-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 animate-slide-up">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-[#f76226] to-orange-400 rounded-xl text-white shadow-md shadow-[#f76226]/20">
              <FileText size={24} />
            </div>
            Bài viết của tôi
          </h1>
          <p className="text-gray-500">Quản lý tất cả bài viết và bản nháp của bạn.</p>
        </div>
        <button
          onClick={handleNewArticle}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#f76226] to-[#FF8A6A] text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-[#f76226]/20 transition-all duration-200 shadow-md active:scale-95"
        >
          <Plus size={18} /> Viết bài mới
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-slide-up stagger-1">
        {[
          { label: 'Bài viết', value: published.length, icon: BookOpen, color: 'from-blue-500 to-indigo-500', bg: 'from-blue-50 to-indigo-50' },
          { label: 'Lượt xem', value: totalViews.toLocaleString(), icon: Eye, color: 'from-green-500 to-emerald-500', bg: 'from-green-50 to-emerald-50' },
          { label: 'Được thắp lửa', value: totalLikes, icon: Flame, color: 'from-orange-500 to-red-500', bg: 'from-orange-50 to-red-50' },
          { label: 'Bình luận', value: totalComments, icon: MessageSquare, color: 'from-purple-500 to-pink-500', bg: 'from-purple-50 to-pink-50' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card-premium p-5 group">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2.5 bg-gradient-to-br ${stat.bg} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={20} className={`bg-gradient-to-br ${stat.color} bg-clip-text`} style={{ color: 'transparent', WebkitBackgroundClip: 'text' }} />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 animate-slide-up stagger-2">
        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Icon size={16} />
                {tab.label}
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${activeTab === tab.id ? 'bg-[#f76226]/10 text-[#f76226]' : 'bg-gray-200 text-gray-500'}`}>{tab.count}</span>
              </button>
            );
          })}
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#f76226]/20 focus:border-[#f76226]/50 outline-none transition-all hover:border-gray-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Article List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 animate-fade-in">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
            <FileText size={28} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{searchQuery ? 'Không tìm thấy bài viết' : activeTab === 'published' ? 'Chưa có bài viết nào' : 'Không có bản nháp'}</h3>
          <p className="text-gray-500 mb-6">{searchQuery ? 'Thử tìm kiếm với từ khóa khác' : 'Hãy bắt đầu viết bài đầu tiên của bạn!'}</p>
          {!searchQuery && (
            <button onClick={handleNewArticle} className="px-5 py-2.5 bg-gradient-to-r from-[#f76226] to-[#FF8A6A] text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg hover:shadow-[#f76226]/20 transition-all duration-200 active:scale-95">
              <Plus size={16} className="inline mr-2" />Viết bài mới
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4 animate-slide-up stagger-3">
          {filtered.map((article: Article) => (
            <React.Fragment key={article.id}>
              <MyArticleCard
                article={article}
                isMenuOpen={openMenuId === article.id}
                onToggleMenu={() => setOpenMenuId(openMenuId === article.id ? null : article.id)}
                onView={() => handleView(article.id)}
                onEdit={() => handleEdit(article)}
                onSubmitReview={() => submitForReview(article)}
                onPublish={() => {
                  dispatch({ type: 'PUBLISH_APPROVED_ARTICLE', articleId: article.id });
                  dispatch({ type: 'TRACK_EVENT', event: { type: 'publish', userId: currentUser.id, articleId: article.id } });
                  addToast('Bài viết đã được xuất bản', 'success');
                  setOpenMenuId(null);
                }}
                onDeleteRequest={() => { setConfirmDeleteId(article.id); setOpenMenuId(null); }}
              />
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Click outside to close menu */}
      {openMenuId && <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />}

      {/* Delete Confirm Dialog */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-modal-backdrop">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-modal-enter p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-xl"><Trash2 size={20} className="text-red-600" /></div>
              <h3 className="text-lg font-bold text-gray-900">Xóa bài viết?</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">Hành động này không thể hoàn tác. Bài viết sẽ bị xóa vĩnh viễn.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmDeleteId(null)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 active:scale-95">Hủy</button>
              <button onClick={() => handleDelete(confirmDeleteId)} className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-red-600 to-rose-500 rounded-xl hover:shadow-md transition-all duration-200 active:scale-95">Xóa bài viết</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
