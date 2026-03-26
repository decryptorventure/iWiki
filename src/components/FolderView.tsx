import React, { useMemo, useState } from 'react';
import { Search, Plus, Eye, Flame, MessageSquare, FolderOpen, BookOpen, ArrowRight, Layers, Share2, FolderPlus, Settings2, Trash2, Edit2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { can } from '../lib/permissions';
import { Folder, Article } from '../store/useAppStore';
import { Button, Input, Modal, Badge } from '@frontend-team/ui-kit';
import SharingModal from './SharingModal';

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
  const [isSharingModalOpen, setIsSharingModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderModalData, setFolderModalData] = useState<{ id?: string, name: string, parentId?: string }>({ name: '' });

  const findFolderRecursive = (fList: Folder[], id: string): Folder | undefined => {
    for (const f of fList) {
      if (f.id === id) return f;
      if (f.children && f.children.length > 0) {
        const found = findFolderRecursive(f.children, id);
        if (found) return found;
      }
    }
    return undefined;
  };

  const parentFolder = useMemo(() => findFolderRecursive(folders, folderId), [folders, folderId]);
  const isParentFolder = Boolean(parentFolder);
  
  const getDescendantIds = (folder: Folder): string[] => {
    let ids: string[] = [folder.id];
    if (folder.children) {
      folder.children.forEach(child => {
        ids = [...ids, ...getDescendantIds(child)];
      });
    }
    return ids;
  };

  const allRelevantFolderIds = useMemo(() => {
    if (!parentFolder) return [folderId];
    return getDescendantIds(parentFolder);
  }, [parentFolder, folderId]);

  const scopedArticles = useMemo(() => {
    const raw = articles
      .filter((article) => {
        if (searchQuery && !article.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        
        if (parentFolder?.isPersonal && parentFolder?.ownerId === currentUser.id) {
          return allRelevantFolderIds.includes(article.folderId);
        }
        
        if (article.status !== 'published') return false;
        return allRelevantFolderIds.includes(article.folderId);
      })
      .sort((a, b) => (b.views || 0) - (a.views || 0));
    return raw;
  }, [articles, allRelevantFolderIds, searchQuery, parentFolder, currentUser.id]);

  const subfolders = useMemo(() => {
    return parentFolder?.children || [];
  }, [parentFolder]);

  const groupedBySubfolder = useMemo(() => {
    if (!isParentFolder) return [];
    return subfolders.map(sub => ({
      subfolder: sub,
      articles: articles.filter(a => {
        const descIds = getDescendantIds(sub);
        return descIds.includes(a.folderId) && (a.status === 'published' || (sub.isPersonal && sub.ownerId === currentUser.id));
      })
    })).filter(group => group.articles.length > 0);
  }, [isParentFolder, subfolders, articles, currentUser.id]);

  const navigate = (screen: string) => dispatch({ type: 'SET_SCREEN', screen });
  const openArticle = (id: string) => {
    dispatch({ type: 'SET_SELECTED_ARTICLE', articleId: id });
    dispatch({ type: 'INCREMENT_VIEWS', articleId: id });
  };

  const handleNewArticle = () => {
    dispatch({ type: 'OPEN_EDITOR', article: { folderId, isPersonal: parentFolder?.isPersonal } });
  };

  const handleNewFolder = () => {
    setFolderModalData({ name: '', parentId: folderId });
    setIsFolderModalOpen(true);
  };

  const handleEditFolder = () => {
    if (parentFolder) {
      setFolderModalData({ id: folderId, name: parentFolder.name });
      setIsFolderModalOpen(true);
    }
  };

  const handleDeleteFolder = () => {
    if (confirm('Bạn có chắc chắn muốn xóa thư mục này?')) {
      dispatch({ type: 'DELETE_FOLDER', folderId });
      dispatch({ type: 'SET_SCREEN', screen: 'dashboard' });
    }
  };

  const handleSaveFolder = () => {
    if (!folderModalData.name.trim()) return;
    if (folderModalData.id) {
      dispatch({ type: 'EDIT_FOLDER', folderId: folderModalData.id, name: folderModalData.name });
    } else {
      dispatch({ type: 'CREATE_PERSONAL_FOLDER', userId: currentUser.id, name: folderModalData.name, parentId: folderModalData.parentId });
    }
    setIsFolderModalOpen(false);
  };

  const featuredArticle = !searchQuery && scopedArticles.length > 0 ? scopedArticles[0] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in min-h-full flex flex-col">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-[var(--ds-text-tertiary)] mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide text-left w-full">
        <button onClick={() => navigate('dashboard')} className="hover:text-[var(--ds-fg-accent-primary)] transition-colors">Trang chủ</button>
        {breadcrumbs.map((crumb, i) => (
          <React.Fragment key={i}>
            <span className="text-[var(--ds-text-tertiary)]">/</span>
            <span className={i === breadcrumbs.length - 1 ? 'font-bold text-[var(--ds-text-primary)]' : ''}>{crumb}</span>
          </React.Fragment>
        ))}
      </div>

      <div className="flex flex-col items-start justify-start gap-6 mb-10 w-full">
        <div className="text-left w-full">
          <h1 className="text-3xl font-bold text-[var(--ds-text-primary)] mb-3 tracking-tight">{title}</h1>
          <div className="flex items-center gap-4 text-sm text-[var(--ds-text-secondary)] font-medium justify-start">
            <span className="flex items-center gap-1.5"><BookOpen size={16} /> {scopedArticles.length} bài viết</span>
            <span className="flex items-center gap-1.5"><Layers size={16} /> {subfolders.length} danh mục con</span>
          </div>
          {description && <p className="mt-4 text-[var(--ds-text-secondary)] max-w-2xl leading-relaxed text-left">{description}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full justify-start">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ds-text-secondary)]" size={16} />
            <Input type="text" placeholder="Tìm trong thư mục..." className="pl-9 pr-4 w-52" value={searchQuery} onChange={(e: any) => setSearchQuery(e.target.value)} />
          </div>
          {parentFolder?.isPersonal && parentFolder?.ownerId === currentUser.id && (
            <div className="flex items-center gap-2">
              <Button variant="border" onClick={handleEditFolder} title="Cài đặt thư mục">
                <Settings2 size={18} />
              </Button>
              <Button variant="border" onClick={handleDeleteFolder} title="Xóa thư mục" className="text-red-500 hover:text-red-600">
                <Trash2 size={18} />
              </Button>
              <Button variant="border" onClick={handleNewFolder} title="Tạo thư mục con">
                <FolderPlus size={18} /> Thư mục con
              </Button>
              <Button variant="border" onClick={() => setIsSharingModalOpen(true)}>
                <Share2 size={18} /> Chia sẻ
              </Button>
            </div>
          )}
          <Button variant="primary" onClick={(e) => { e.stopPropagation(); handleNewArticle(); }}>
            <Plus size={18} /> Viết bài mới
          </Button>
        </div>
      </div>

      {parentFolder && (
        <SharingModal 
          open={isSharingModalOpen} 
          onOpenChange={setIsSharingModalOpen} 
          itemId={parentFolder.id} 
          itemType="folder"
          initialSharedWith={parentFolder.sharedWith}
        />
      )}

      <div className="flex-1">
        {/* Unified Magazine View for ALL Spaces */}
        <div className="space-y-12">
          {isParentFolder && !searchQuery && subfolders.length > 0 && (
            <div className="mb-10 animate-slide-up">
              <h2 className="text-lg font-bold text-[var(--ds-text-primary)] mb-4 text-left">Danh mục con</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subfolders.map((sub) => {
                  const descendantIds = getDescendantIds(sub);
                  const subArticleCount = articles.filter((article) => descendantIds.includes(article.folderId)).length;
                  return (
                    <div
                      key={sub.id}
                      onClick={() => dispatch({ type: 'SET_SCREEN', screen: `folder-${sub.id}` })}
                      className="card-premium p-5 cursor-pointer flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                         <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 ${sub.isPersonal ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
                            <FolderOpen size={20} />
                          </div>
                          <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm truncate text-left">{sub.name}</p>
                            <p className="text-xs text-gray-500 text-left">{subArticleCount} bài viết</p>
                          </div>
                        </div>
                        {sub.isPersonal && sub.ownerId === currentUser.id && (
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                            <Button variant="subtle" size="icon-s" onClick={(e) => { e.stopPropagation(); dispatch({ type: 'DELETE_FOLDER', folderId: sub.id }); }}>
                               <Trash2 size={14} className="text-red-500" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <ArrowRight size={16} className={`shrink-0 transition-colors ${sub.isPersonal ? 'text-indigo-400 group-hover:text-indigo-600' : 'text-orange-400 group-hover:text-orange-600'}`} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {featuredArticle && !searchQuery && (
            <div onClick={() => openArticle(featuredArticle.id)} className="rounded-2xl overflow-hidden bg-[var(--ds-bg-primary)] border border-[var(--ds-border-secondary)] shadow-sm cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all group relative">
              {featuredArticle.coverUrl && (
                <div className="h-64 overflow-hidden relative">
                  <img src={featuredArticle.coverUrl} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/20" />
                </div>
              )}
              <div className="p-8">
                <div className="flex items-center gap-2 mb-3 justify-start">
                  <img src={featuredArticle.author.avatar} alt="Avatar" className="w-7 h-7 rounded-full" referrerPolicy="no-referrer" />
                  <span className="text-sm font-semibold text-[var(--ds-text-primary)]">{featuredArticle.author.name}</span>
                  <span className="text-xs text-[var(--ds-text-secondary)]">· {featuredArticle.createdAt}</span>
                </div>
                <h3 className="text-2xl font-bold text-[var(--ds-text-primary)] mb-3 group-hover:text-[var(--ds-fg-accent-primary)] transition-colors text-left">{featuredArticle.title}</h3>
                <p className="text-[var(--ds-text-secondary)] line-clamp-2 mb-6 text-left">{featuredArticle.excerpt || featuredArticle.content?.slice(0, 160)}</p>
                <div className="flex items-center gap-4 text-xs text-[var(--ds-text-secondary)] justify-start">
                  <span className="flex items-center gap-1"><Eye size={14} /> {featuredArticle.views}</span>
                  <span className="flex items-center gap-1"><Flame size={14} className="text-orange-500" /> {featuredArticle.likes}</span>
                  <span className="flex items-center gap-1"><MessageSquare size={14} /> {featuredArticle.comments.length}</span>
                </div>
              </div>
              
              {featuredArticle.isPersonal && featuredArticle.author.id === currentUser.id && (
                <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="primary" size="icon-s" onClick={(e) => { e.stopPropagation(); dispatch({ type: 'OPEN_EDITOR', article: featuredArticle }); }}>
                    <Edit2 size={16} />
                  </Button>
                </div>
              )}
            </div>
          )}

          <div className="space-y-12">
            {groupedBySubfolder.map((group) => (
              <section key={group.subfolder.id} className="animate-slide-up">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[var(--ds-border-secondary)]">
                  <h2 className="text-lg font-bold text-[var(--ds-text-primary)] flex items-center gap-2 text-left">
                     <FolderOpen size={18} className={group.subfolder.isPersonal ? 'text-indigo-500' : 'text-orange-500'} /> {group.subfolder.name}
                  </h2>
                  <button onClick={() => dispatch({ type: 'SET_SCREEN', screen: `folder-${group.subfolder.id}` })} className={`text-xs font-bold ${group.subfolder.isPersonal ? 'text-indigo-600' : 'text-orange-600'}`}>Xem tất cả</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.articles.slice(0, 4).map(a => (
                    <div key={a.id} className="group/item flex items-center justify-between gap-4 p-4 rounded-xl border border-[var(--ds-border-secondary)] hover:border-[var(--ds-border-accent-primary-subtle)] hover:bg-[var(--ds-bg-secondary)]/50 transition-all">
                      <div onClick={() => openArticle(a.id)} className="flex-1 min-w-0 cursor-pointer text-left">
                        <p className="font-semibold text-sm text-[var(--ds-text-primary)] line-clamp-1 group-hover/item:text-[var(--ds-fg-accent-primary)] transition-colors">{a.title}</p>
                        <p className="text-xs text-[var(--ds-text-secondary)] mt-1 line-clamp-2">{a.excerpt || a.content.slice(0, 100)}</p>
                        <div className="flex items-center gap-3 mt-3 text-[10px] text-[var(--ds-text-tertiary)]">
                          <span className="flex items-center gap-1"><Eye size={12} /> {a.views}</span>
                          <span className="flex items-center gap-1"><Flame size={12} className={a.isPersonal ? 'text-indigo-500' : 'text-orange-500'} /> {a.likes}</span>
                        </div>
                      </div>
                      {a.isPersonal && a.author.id === currentUser.id && (
                        <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0">
                          <Button variant="subtle" size="icon-s" onClick={() => dispatch({ type: 'OPEN_EDITOR', article: a })}>
                            <Edit2 size={14} className="text-blue-500" />
                          </Button>
                          <Button variant="subtle" size="icon-s" onClick={() => { if (confirm('Xóa bài viết?')) dispatch({ type: 'DELETE_ARTICLE', articleId: a.id }); }}>
                            <Trash2 size={14} className="text-red-500" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {!searchQuery && scopedArticles.length > 0 && groupedBySubfolder.length === 0 && (
            <div className="space-y-4">
               {scopedArticles.slice(1).map((article) => (
                  <div key={article.id} className="group/item bg-[var(--ds-bg-primary)] border border-[var(--ds-border-secondary)] rounded-2xl p-4 flex items-center justify-between hover:border-[var(--ds-border-accent-primary-subtle)] transition-all">
                    <div className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer text-left" onClick={() => openArticle(article.id)}>
                       <div className="p-2 bg-[var(--ds-bg-secondary)] rounded-lg text-[var(--ds-text-tertiary)] uppercase text-[10px] font-black">
                         DOC
                       </div>
                       <div className="min-w-0 text-left flex-1">
                          <p className="font-semibold text-sm text-[var(--ds-text-primary)] truncate text-left group-hover/item:text-[var(--ds-fg-accent-primary)] transition-colors">{article.title}</p>
                          <div className="flex items-center gap-4 mt-1 justify-start">
                             <div className="flex items-center gap-3 text-[10px] text-[var(--ds-text-tertiary)]">
                              <span className="flex items-center gap-1"><Eye size={12} /> {article.views}</span>
                              <span className="flex items-center gap-1"><Flame size={12} className={article.isPersonal ? 'text-indigo-500' : 'text-orange-500'} /> {article.likes}</span>
                            </div>
                            {article.isPersonal && <Badge color="gray" size="xs">Cá nhân</Badge>}
                            <span className="text-[10px] text-[var(--ds-text-tertiary)]">{article.createdAt}</span>
                          </div>
                       </div>
                    </div>
                    {article.isPersonal && article.author.id === currentUser.id && (
                      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity">
                        <Button variant="subtle" size="icon-s" onClick={(e) => { e.stopPropagation(); dispatch({ type: 'OPEN_EDITOR', article }); }}>
                          <Edit2 size={16} className="text-blue-500" />
                        </Button>
                        <Button variant="subtle" size="icon-s" onClick={(e) => { e.stopPropagation(); if (confirm('Xóa bài viết?')) dispatch({ type: 'DELETE_ARTICLE', articleId: article.id }); }}>
                          <Trash2 size={16} className="text-red-500" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}

          {scopedArticles.length === 0 && (
            <div className="text-center py-20 bg-[var(--ds-bg-primary)] rounded-2xl border border-dashed border-[var(--ds-border-secondary)]">
              <div className="w-16 h-16 bg-[var(--ds-bg-secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen size={28} className="text-[var(--ds-text-tertiary)]" />
              </div>
              <h3 className="text-lg font-bold text-[var(--ds-text-primary)] mb-1">Chưa có bài viết</h3>
              <p className="text-sm text-[var(--ds-text-secondary)] mb-6">Hãy bắt đầu viết nội dung đầu tiên cho thư mục này.</p>
              <Button variant="primary" size="s" onClick={handleNewArticle}>
                <Plus size={16} /> Bắt đầu viết bài
              </Button>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={isFolderModalOpen}
        onOpenChange={setIsFolderModalOpen}
        title={folderModalData.id ? 'Chỉnh sửa thư mục' : 'Tạo thư mục mới'}
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="subtle" size="s" onClick={() => setIsFolderModalOpen(false)}>Hủy</Button>
            <Button variant="primary" size="s" onClick={handleSaveFolder}>
              {folderModalData.id ? 'Xác nhận' : 'Tạo mới'}
            </Button>
          </div>
        }
      >
        <div className="p-4">
           <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Tên thư mục</label>
           <Input 
             autoFocus 
             value={folderModalData.name} 
             onChange={e => setFolderModalData({ ...folderModalData, name: e.target.value })} 
             placeholder="Nhập tên thư mục..."
             onKeyDown={e => e.key === 'Enter' && handleSaveFolder()}
           />
        </div>
      </Modal>
    </div>
  );
}
