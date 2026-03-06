import React, { useState } from 'react';
import { Folder as FolderIcon, FileText, ChevronDown, Plus, Search, Shield, Edit3, Trash2, Lock, X, FolderPlus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../App';
import { motion, AnimatePresence } from 'motion/react';

export default function DocumentManagement() {
  const { state, dispatch } = useApp();
  const { addToast } = useToast();
  const { folders, articles } = state;

  const [expandedFolders, setExpandedFolders] = useState<string[]>(['f-company', 'f-tech']);
  const [selectedFolderId, setSelectedFolderId] = useState<string>('f-hr');
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [createSubfolderOf, setCreateSubfolderOf] = useState<string | null>(null);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [selectedItemForPermission, setSelectedItemForPermission] = useState<{ id: string, name: string } | null>(null);

  const toggleFolder = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const findFolderInTree = (fs: any[], id: string): any => {
    for (const f of fs) {
      if (f.id === id) return f;
      if (f.children) { const found = findFolderInTree(f.children, id); if (found) return found; }
    }
    return null;
  };

  const selectedFolder = findFolderInTree(folders, selectedFolderId);
  const folderArticles = articles.filter(a => a.folderId === selectedFolderId);

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    dispatch({ type: 'CREATE_FOLDER', folder: { id: `f-${Math.random().toString(36).substr(2, 9)}`, name: newFolderName, parentId: createSubfolderOf || undefined, children: [] } });
    addToast(`Đã tạo thư mục "${newFolderName}"`, 'success');
    setNewFolderName('');
    setIsNewFolderModalOpen(false);
  };

  const handleMoveArticle = (articleId: string, targetFolderId: string) => {
    dispatch({ type: 'MOVE_ARTICLE', articleId, targetFolderId });
    addToast('Đã chuyển bài viết', 'success');
  };

  const renderFolderItem = (folder: any, depth = 0) => {
    const isExpanded = expandedFolders.includes(folder.id);
    const isSelected = selectedFolderId === folder.id;
    const hasChildren = folder.children?.length > 0;

    return (
      <div key={folder.id}>
        <div
          onClick={() => setSelectedFolderId(folder.id)}
          className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors group ${isSelected ? 'bg-orange-50 text-orange-600' : 'hover:bg-gray-100 text-gray-700'}`}
          style={{ paddingLeft: `${12 + depth * 12}px` }}
        >
          <div className="flex items-center gap-2 min-w-0">
            {hasChildren && (
              <button onClick={e => toggleFolder(folder.id, e)} className="shrink-0 p-0.5">
                <ChevronDown size={13} className={`transition-transform ${isExpanded ? '' : '-rotate-90'} ${isSelected ? 'text-orange-400' : 'text-gray-400'}`} />
              </button>
            )}
            {!hasChildren && <div className="w-5" />}
            <FolderIcon size={14} className={isSelected ? 'text-orange-500' : 'text-gray-400'} />
            <span className="text-sm truncate">{folder.name}</span>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              onClick={e => { e.stopPropagation(); setCreateSubfolderOf(folder.id); setIsNewFolderModalOpen(true); }}
              className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-700"
            >
              <Plus size={12} />
            </button>
          </div>
        </div>
        <AnimatePresence>
          {isExpanded && folder.children && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              {folder.children.map((child: any) => renderFolderItem(child, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="flex h-full overflow-hidden bg-white">
      {/* Folder Sidebar */}
      <aside className="w-64 border-r border-gray-200 flex flex-col shrink-0">
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">Quản lý thư mục</h2>
            <button onClick={() => { setCreateSubfolderOf(null); setIsNewFolderModalOpen(true); }} className="p-1.5 hover:bg-gray-100 rounded-md text-gray-400 hover:text-gray-700 transition-colors">
              <FolderPlus size={16} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
            <input type="text" placeholder="Tìm thư mục..." className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-xs focus:outline-none focus:border-orange-400" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {folders.map(f => renderFolderItem(f))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
              <span>Kho tài liệu</span>
              <span>›</span>
              <span className="text-gray-700">{selectedFolder?.name || 'Chọn thư mục'}</span>
            </div>
            <h1 className="text-base font-semibold text-gray-900">{selectedFolder?.name || 'Central Workspace'}</h1>
          </div>
          <button
            onClick={() => dispatch({ type: 'OPEN_EDITOR', article: { folderId: selectedFolderId } })}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            <Plus size={14} /> Tạo tài liệu
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {folderArticles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <FileText size={32} className="text-gray-200 mb-3" />
              <p className="text-gray-500 text-sm font-medium">Thư mục trống</p>
              <p className="text-gray-400 text-xs mt-1">Chưa có tài liệu nào trong thư mục này</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-500 pb-3 pr-4">Tên tài liệu</th>
                  <th className="text-left text-xs font-semibold text-gray-500 pb-3 pr-4">Tác giả</th>
                  <th className="text-left text-xs font-semibold text-gray-500 pb-3 pr-4">Trạng thái</th>
                  <th className="text-right text-xs font-semibold text-gray-500 pb-3">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <AnimatePresence>
                  {folderArticles.map((doc, i) => (
                    <motion.tr
                      key={doc.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="group hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-3">
                          <FileText size={16} className="text-gray-400 shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 group-hover:text-orange-600 transition-colors">{doc.title}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{doc.updatedAt}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-2">
                          <img src={doc.author.avatar} className="w-6 h-6 rounded-full border border-gray-100" referrerPolicy="no-referrer" />
                          <span className="text-xs text-gray-600">{doc.author.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${doc.status === 'published' ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span className="text-xs text-gray-600">{doc.status === 'published' ? 'Đã đăng' : 'Nháp'}</span>
                          {doc.viewPermission === 'restricted' && <Lock size={11} className="text-orange-400" />}
                        </div>
                      </td>
                      <td className="py-3.5">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <select
                            defaultValue=""
                            onChange={e => handleMoveArticle(doc.id, e.target.value)}
                            className="text-xs text-gray-500 bg-transparent border border-gray-200 rounded px-1.5 py-1 focus:outline-none focus:border-orange-400 mr-1"
                          >
                            <option value="" disabled>Di chuyển...</option>
                            {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                          </select>
                          <button onClick={() => { setSelectedItemForPermission({ id: doc.id, name: doc.title }); setIsPermissionModalOpen(true); }} className="p-1.5 hover:bg-blue-50 hover:text-blue-500 text-gray-400 rounded transition-colors"><Shield size={14} /></button>
                          <button onClick={() => dispatch({ type: 'OPEN_EDITOR', article: doc })} className="p-1.5 hover:bg-orange-50 hover:text-orange-500 text-gray-400 rounded transition-colors"><Edit3 size={14} /></button>
                          <button className="p-1.5 hover:bg-red-50 hover:text-red-500 text-gray-400 rounded transition-colors"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* New Folder Modal */}
      <AnimatePresence>
        {isNewFolderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsNewFolderModalOpen(false)} className="absolute inset-0 bg-black/40" />
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="relative bg-white rounded-lg w-full max-w-sm shadow-xl p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">{createSubfolderOf ? 'Thêm thư mục con' : 'Tạo thư mục mới'}</h3>
              <input
                autoFocus
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreateFolder()}
                placeholder="Tên thư mục..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 mb-4"
              />
              <div className="flex gap-3">
                <button onClick={() => setIsNewFolderModalOpen(false)} className="flex-1 py-2.5 text-sm text-gray-500 hover:bg-gray-100 rounded-md transition-colors">Huỷ</button>
                <button onClick={handleCreateFolder} className="flex-1 py-2.5 bg-orange-500 text-white rounded-md text-sm font-medium hover:bg-orange-600 transition-colors">Tạo</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Permission Modal */}
      <AnimatePresence>
        {isPermissionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPermissionModalOpen(false)} className="absolute inset-0 bg-black/40" />
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="relative bg-white rounded-lg w-full max-w-md shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Phân quyền truy cập</h3>
                <button onClick={() => setIsPermissionModalOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-md text-gray-400"><X size={16} /></button>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-4 font-medium">{selectedItemForPermission?.name}</p>
                <div className="space-y-3 mb-6">
                  {[
                    { name: 'Admin Hub', role: 'Toàn quyền' },
                    { name: 'Engineering Corps', role: 'Đọc & Viết' },
                  ].map((u, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.role}</p>
                      </div>
                      <select className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-orange-400 bg-white">
                        <option>Người duy trì</option>
                        <option>Chỉ xem</option>
                        <option>Hạn chế</option>
                      </select>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setIsPermissionModalOpen(false)} className="flex-1 py-2.5 text-sm text-gray-500 hover:bg-gray-100 rounded-md transition-colors">Huỷ</button>
                  <button onClick={() => { setIsPermissionModalOpen(false); addToast('Đã cập nhật quyền truy cập', 'success'); }} className="flex-1 py-2.5 bg-orange-500 text-white rounded-md text-sm font-medium hover:bg-orange-600 transition-colors">Lưu</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
