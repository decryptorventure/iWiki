import React, { useMemo, useState } from 'react';
import { Search, Plus, Eye, Flame, MessageSquare, FolderOpen, BookOpen, ArrowRight, Layers } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { can } from '../lib/permissions';
import { Button, Input } from '@frontend-team/ui-kit';

interface FolderViewProps {
  folderId: string;
  title: string;
  description?: string;
  breadcrumbs?: string[];
}

export default function FolderView({ folderId, title, description, breadcrumbs = [] }: FolderViewProps) {
  const { state, dispatch } = useApp();
  const { articles, folders, currentUser } = state;
  const [searchQuery, setSearchQuery] = useState('');

  const parentFolder = folders.find(f => f.id === folderId);
  const isParentFolder = Boolean(parentFolder);
  const subfolders = parentFolder?.children || [];
  const childFolderIds = subfolders.map((item) => item.id);

  const scopedArticles = useMemo(() => {
    return articles
      .filter((article) => {
        if (article.status !== 'published') return false;
        if (!can(currentUser, 'article.read', article)) return false;
        if (isParentFolder) return childFolderIds.includes(article.folderId);
        return article.folderId === folderId;
      })
      .filter((article) => {
        if (!searchQuery.trim()) return true;
        const needle = searchQuery.toLowerCase();
        return (
          article.title.toLowerCase().includes(needle) ||
          (article.author.name || '').toLowerCase().includes(needle) ||
          article.tags.some((tag) => tag.toLowerCase().includes(needle))
        );
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [articles, childFolderIds, currentUser, folderId, isParentFolder, searchQuery]);

  const featuredArticle = scopedArticles[0] || null;

  const groupedBySubfolder = useMemo(() => {
    if (!isParentFolder) return [];
    return subfolders
      .map((subfolder) => ({
        subfolder,
        articles: scopedArticles.filter((item) => item.folderId === subfolder.id),
      }))
      .filter((item) => item.articles.length > 0);
  }, [isParentFolder, scopedArticles, subfolders]);

  const openArticle = (id: string) => {
    dispatch({ type: 'SET_SELECTED_ARTICLE', articleId: id });
    dispatch({ type: 'INCREMENT_VIEWS', articleId: id });
    dispatch({ type: 'TRACK_EVENT', event: { type: 'open_article', userId: currentUser.id, articleId: id } });
  };

  const handleNewArticle = () => {
    dispatch({ type: 'OPEN_EDITOR', article: { folderId: isParentFolder ? subfolders[0]?.id || folderId : folderId } });
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-10 animate-fade-in">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm font-medium mb-8 backdrop-blur-sm animate-slide-up">
        <button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'dashboard' })} className="text-[var(--ds-text-secondary)] hover:text-[var(--ds-fg-accent-primary)] transition-colors">Trang chủ</button>
        {breadcrumbs.map((crumb, i) => (
          <React.Fragment key={i}>
            <span className="text-[var(--ds-border-tertiary)]">/</span>
            <span className={i === breadcrumbs.length - 1 ? 'text-[var(--ds-text-primary)] font-bold' : 'text-[var(--ds-text-secondary)]'}>{crumb}</span>
          </React.Fragment>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 animate-slide-up stagger-1">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--ds-text-primary)] mb-2">{title}</h1>
          {description && <p className="text-[var(--ds-text-secondary)] max-w-2xl">{description}</p>}
          <div className="flex items-center gap-4 mt-3 text-sm text-[var(--ds-text-secondary)]">
            <span className="flex items-center gap-1.5"><BookOpen size={15} /> {scopedArticles.length} bài viết</span>
            {isParentFolder && (
              <span className="flex items-center gap-1.5"><Layers size={15} /> {subfolders.length} danh mục con</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ds-text-secondary)]" size={16} />
            <Input type="text" placeholder="Tìm trong thư mục..." className="pl-9 pr-4 w-52" value={searchQuery} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)} />
          </div>
          <Button variant="primary" onClick={handleNewArticle}>
            <Plus size={18} /> Viết bài mới
          </Button>
        </div>
      </div>

      {/* Category Cards (for parent folders) */}
      {isParentFolder && !searchQuery && (
        <div className="mb-10 animate-slide-up stagger-2">
          <h2 className="text-lg font-bold text-[var(--ds-text-primary)] mb-4">Danh mục nổi bật</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subfolders.map((sub, i) => {
              const subArticleCount = scopedArticles.filter((article) => article.folderId === sub.id).length;
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
                  className={`card-premium p-5 cursor-pointer flex items-center justify-between gap-3 group animate-slide-up stagger-${i + 2}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[var(--ds-bg-accent-primary-subtle)] rounded-xl text-[var(--ds-fg-accent-primary)] group-hover:scale-110 transition-transform duration-300">
                      <FolderOpen size={22} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[var(--ds-text-primary)] text-sm truncate group-hover:text-[var(--ds-fg-accent-primary)] transition-colors">{sub.name}</p>
                      <p className="text-xs text-[var(--ds-text-secondary)]">{subArticleCount} bài viết</p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-[var(--ds-text-tertiary)] group-hover:text-[var(--ds-fg-accent-primary)] transition-colors" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {scopedArticles.length === 0 ? (
        <div className="text-center py-20 animate-fade-in">
          <div className="w-20 h-20 bg-[var(--ds-bg-accent-primary-subtle)] rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
            <BookOpen size={32} className="text-[var(--ds-fg-accent-primary)]" />
          </div>
          <h3 className="text-xl font-bold text-[var(--ds-text-primary)] mb-2">{searchQuery ? 'Không tìm thấy bài viết' : 'Thư mục chưa có bài viết'}</h3>
          <p className="text-[var(--ds-text-secondary)] mb-6">{searchQuery ? 'Thử tìm từ khóa khác' : 'Hãy là người đầu tiên đóng góp kiến thức!'}</p>
          {!searchQuery && (
            <Button variant="primary" onClick={handleNewArticle}>
              <Plus size={16} /> Viết bài đầu tiên
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-8 animate-slide-up stagger-3">
          {/* Featured Article */}
          {featuredArticle && !searchQuery && (
            <div onClick={() => openArticle(featuredArticle.id)} className="rounded-2xl overflow-hidden bg-[var(--ds-bg-primary)] border border-[var(--ds-border-secondary)] shadow-sm cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              {featuredArticle.coverUrl && (
                <div className="h-52 overflow-hidden relative">
                  <img src={featuredArticle.coverUrl} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="text-xs font-semibold bg-[var(--ds-bg-accent-primary)] px-2 py-0.5 rounded-full mb-2 inline-block shadow-sm">
                      Bài viết nổi bật
                    </div>
                  </div>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <img src={featuredArticle.author.avatar} alt="Avatar" className="w-7 h-7 rounded-full" referrerPolicy="no-referrer" />
                  <span className="text-sm font-semibold text-[var(--ds-text-primary)]">{featuredArticle.author.name}</span>
                  <span className="text-xs text-[var(--ds-text-secondary)]">· {featuredArticle.createdAt}</span>
                </div>
                <h3 className="text-xl font-bold text-[var(--ds-text-primary)] mb-2 group-hover:text-[var(--ds-fg-accent-primary)] transition-colors">{featuredArticle.title}</h3>
                <p className="text-sm text-[var(--ds-text-secondary)] line-clamp-2 mb-4">{featuredArticle.excerpt || featuredArticle.content?.slice(0, 120)}</p>
                <div className="flex items-center gap-4 text-xs text-[var(--ds-text-secondary)]">
                  <span className="flex items-center gap-1"><Eye size={14} /> {featuredArticle.views}</span>
                  <span className="flex items-center gap-1"><Flame size={14} className="text-[var(--ds-fg-accent-primary)]" /> {featuredArticle.likes}</span>
                  <span className="flex items-center gap-1"><MessageSquare size={14} /> {featuredArticle.comments.length}</span>
                  {featuredArticle.tags.slice(0, 2).map(t => <span key={t} className="px-2 py-0.5 bg-[var(--ds-bg-accent-primary-subtle)] text-[var(--ds-fg-accent-primary)] rounded-full font-medium">{t}</span>)}
                </div>
              </div>
            </div>
          )}

          {/* Magazine-style sections by category */}
          {isParentFolder && groupedBySubfolder.length > 0 ? (
            groupedBySubfolder.map((group, idx) => (
              <section key={group.subfolder.id} className={`bg-[var(--ds-bg-primary)] border border-[var(--ds-border-secondary)] rounded-2xl p-5 animate-slide-up stagger-${Math.min(idx + 2, 6)}`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[var(--ds-text-primary)] flex items-center gap-2">
                    <FolderOpen size={18} className="text-[var(--ds-fg-accent-primary)]" />
                    {group.subfolder.name}
                  </h2>
                  <button
                    onClick={() => dispatch({ type: 'SET_SCREEN', screen: `folder-${group.subfolder.id}` })}
                    className="text-xs font-bold text-[var(--ds-fg-accent-primary)] hover:text-[var(--ds-fg-accent-primary-hover)] transition-colors"
                  >
                    Xem tất cả
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {group.articles.slice(0, 4).map((article) => (
                    <button
                      key={article.id}
                      onClick={() => openArticle(article.id)}
                      className="text-left border border-[var(--ds-border-secondary)] hover:border-[var(--ds-border-accent-primary-subtle)] rounded-xl p-4 transition-all hover:shadow-sm"
                    >
                      <p className="font-bold text-sm text-[var(--ds-text-primary)] line-clamp-2">{article.title}</p>
                      <p className="text-xs text-[var(--ds-text-secondary)] mt-1 line-clamp-2">{article.excerpt || article.content.slice(0, 90)}</p>
                      <div className="flex items-center gap-3 text-xs text-[var(--ds-text-secondary)] mt-2">
                        <span className="flex items-center gap-1"><Eye size={12} /> {article.views}</span>
                        <span className="flex items-center gap-1"><Flame size={12} className="text-[var(--ds-fg-accent-primary)]" /> {article.likes}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className="space-y-3">
              {scopedArticles.slice(searchQuery ? 0 : 1).map((article, i) => (
                <div key={article.id} onClick={() => openArticle(article.id)} className={`card-premium p-4 cursor-pointer flex items-start gap-4 animate-slide-up stagger-${i + 3}`}>
                  {article.coverUrl && (
                    <div className="w-16 h-14 rounded-lg overflow-hidden shrink-0 hidden sm:block">
                      <img src={article.coverUrl} alt="Cover" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[var(--ds-text-primary)] text-sm mb-1 line-clamp-2 hover:text-[var(--ds-fg-accent-primary)] transition-colors">{article.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-[var(--ds-text-secondary)]">
                      <span>{article.author.name}</span>
                      <span>{article.createdAt}</span>
                      <span className="flex items-center gap-1"><Eye size={12} /> {article.views}</span>
                      <span className="flex items-center gap-1"><Flame size={12} className="text-[var(--ds-fg-accent-primary)]" /> {article.likes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Search results in parent mode */}
          {isParentFolder && searchQuery && (
            <section className="bg-[var(--ds-bg-primary)] border border-[var(--ds-border-secondary)] rounded-2xl p-5">
              <h2 className="text-lg font-bold text-[var(--ds-text-primary)] mb-3">Kết quả tìm kiếm</h2>
              <div className="space-y-3">
                {scopedArticles.map((article) => (
                  <button key={article.id} onClick={() => openArticle(article.id)} className="w-full text-left border border-[var(--ds-border-secondary)] hover:border-[var(--ds-border-accent-primary-subtle)] rounded-xl p-4 transition-all">
                    <p className="font-bold text-sm text-[var(--ds-text-primary)]">{article.title}</p>
                    <p className="text-xs text-[var(--ds-text-secondary)] mt-1">{article.folderName || article.folderId}</p>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
