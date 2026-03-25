import React, { useState } from 'react';
import { Plus, Search, Eye, Flame, MessageSquare, Trash2, BookOpen, FileText, CheckCircle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../App';
import { Article } from '../store/useAppStore';
import { can } from '../lib/permissions';
import { Button, Input, Modal, Tabs, Card, CardContent, Badge } from '@frontend-team/ui-kit';
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
  const source = activeTab === 'published' ? published : activeTab === 'draft' ? drafts : activeTab === 'in_review' ? inReview : activeTab === 'approved' ? approved : rejected;
  const filtered = source.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const totalViews = published.reduce((s, a) => s + a.views, 0);
  const totalLikes = published.reduce((s, a) => s + a.likes, 0);
  const totalComments = published.reduce((s, a) => s + a.comments.length, 0);

  const handleNewArticle = () => dispatch({ type: 'OPEN_EDITOR', article: {} });

  const handleEdit = (article: Article) => { dispatch({ type: 'OPEN_EDITOR', article }); setOpenMenuId(null); };

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
    if (!can(currentUser, 'article.submit_review', article)) { addToast('Bạn không có quyền gửi bài này để duyệt', 'warning'); return; }
    dispatch({ type: 'SUBMIT_ARTICLE_REVIEW', articleId: article.id, userId: currentUser.id });
    dispatch({ type: 'TRACK_EVENT', event: { type: 'submit_review', userId: currentUser.id, articleId: article.id } });
    addToast('Đã gửi bài viết sang hàng chờ duyệt', 'success');
  };

  return (
    <div className="max-w-5xl mx-auto px-8 py-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 animate-slide-up">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--ds-text-primary)] flex items-center gap-3 mb-2">
            <div className="p-2 bg-[var(--ds-bg-accent-primary)] rounded-xl text-white shadow-md"><FileText size={24} /></div>
            Bài viết của tôi
          </h1>
          <p className="text-[var(--ds-text-secondary)]">Quản lý tất cả bài viết và bản nháp của bạn.</p>
        </div>
        <Button variant="primary" onClick={handleNewArticle}>
          <Plus size={18} /> Viết bài mới
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-slide-up stagger-1">
        {[
          { label: 'Bài viết', value: published.length, icon: BookOpen, iconColor: 'text-[var(--ds-fg-info)]', bg: 'bg-[var(--ds-bg-info-subtle)]' },
          { label: 'Lượt xem', value: totalViews.toLocaleString(), icon: Eye, iconColor: 'text-[var(--ds-fg-success)]', bg: 'bg-[var(--ds-bg-success-subtle)]' },
          { label: 'Được thắp lửa', value: totalLikes, icon: Flame, iconColor: 'text-[var(--ds-fg-accent-primary)]', bg: 'bg-[var(--ds-bg-accent-primary-subtle)]' },
          { label: 'Bình luận', value: totalComments, icon: MessageSquare, iconColor: 'text-[var(--ds-fg-accent-secondary)]', bg: 'bg-[var(--ds-bg-accent-secondary-subtle)]' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card-premium p-5 group">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2.5 ${stat.bg} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={20} className={stat.iconColor} />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-[var(--ds-text-primary)]">{stat.value}</div>
              <div className="text-sm text-[var(--ds-text-secondary)]">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 animate-slide-up stagger-2">
        <Tabs
          value={activeTab}
          onValueChange={v => setActiveTab(v as any)}
          items={tabs.map(t => ({
            value: t.id,
            label: (
              <div className="flex items-center gap-2">
                <t.icon size={16} />
                {t.label}
                <Badge variant={activeTab === t.id ? 'primary' : 'default'} size="xs" className="ml-1">
                  {t.count}
                </Badge>
              </div>
            )
          }))}
          variant="default"
          className="flex-1"
        />
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ds-text-secondary)]" size={18} />
          <Input type="text" placeholder="Tìm kiếm bài viết..." className="w-full pl-9 pr-4" value={searchQuery} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)} />
        </div>
      </div>

      {/* Article List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 animate-fade-in">
          <div className="w-16 h-16 bg-[var(--ds-bg-secondary)] rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
            <FileText size={28} className="text-[var(--ds-text-secondary)]" />
          </div>
          <h3 className="text-lg font-bold text-[var(--ds-text-primary)] mb-2">{searchQuery ? 'Không tìm thấy bài viết' : activeTab === 'published' ? 'Chưa có bài viết nào' : 'Không có bản nháp'}</h3>
          <p className="text-[var(--ds-text-secondary)] mb-6">{searchQuery ? 'Thử tìm kiếm với từ khóa khác' : 'Hãy bắt đầu viết bài đầu tiên của bạn!'}</p>
          {!searchQuery && (
            <Button variant="primary" onClick={handleNewArticle}>
              <Plus size={16} /> Viết bài mới
            </Button>
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

      {openMenuId && <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />}

      {/* Delete Confirm Dialog */}
      <Modal
        open={!!confirmDeleteId}
        onOpenChange={(open) => { if (!open) setConfirmDeleteId(null); }}
        title="Xóa bài viết?"
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="subtle" size="s" onClick={() => setConfirmDeleteId(null)}>Hủy</Button>
            <Button variant="danger" size="s" onClick={() => confirmDeleteId && handleDelete(confirmDeleteId)}>Xóa bài viết</Button>
          </div>
        }
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-[var(--ds-bg-danger-subtle)] rounded-xl"><Trash2 size={20} className="text-[var(--ds-fg-danger)]" /></div>
          <p className="text-sm text-[var(--ds-text-secondary)]">Hành động này không thể hoàn tác. Bài viết sẽ bị xóa vĩnh viễn.</p>
        </div>
      </Modal>
    </div>
  );
}
