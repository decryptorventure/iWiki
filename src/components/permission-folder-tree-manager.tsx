
import React, { useState } from 'react';
import { Folder as FolderIcon, ChevronRight, Shield, Check, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Folder, AccessLevel } from '../store/useAppStore';
import { Select, Button, Badge } from '@frontend-team/ui-kit';

const ACCESS_OPTIONS = [
  { value: 'admin', label: 'Admin (Quản trị)', color: 'red' },
  { value: 'approve', label: 'Approve (Duyệt)', color: 'orange' },
  { value: 'write', label: 'Write (Viết)', color: 'blue' },
  { value: 'read', label: 'Read (Đọc)', color: 'green' },
  { value: 'none', label: 'None (Không)', color: 'gray' },
];

export function PermissionFolderTreeManager() {
  const { state, dispatch } = useApp();
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(state.folders[0]?.id || null);
  const [expandedFolders, setExpandedFolders] = useState<string[]>(state.folders.map(f => f.id));

  const selectedFolder = findFolderById(state.folders, selectedFolderId);

  function findFolderById(folders: Folder[], id: string | null): Folder | undefined {
    if (!id) return undefined;
    for (const f of folders) {
      if (f.id === id) return f;
      if (f.children) {
        const found = findFolderById(f.children, id);
        if (found) return found;
      }
    }
    return undefined;
  }

  const toggleExpand = (id: string) => {
    setExpandedFolders(prev =>
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const renderTree = (folders: Folder[], depth = 0) => {
    return folders.map(folder => (
      <div key={folder.id} className="flex flex-col">
        <div
          onClick={() => setSelectedFolderId(folder.id)}
          className={`group flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 ${
            selectedFolderId === folder.id
              ? 'bg-[var(--ds-bg-info)] text-white shadow-md'
              : 'hover:bg-[var(--ds-bg-subtle)] text-[var(--ds-text-secondary)]'
          }`}
          style={{ marginLeft: `${depth * 1.25}rem` }}
        >
          <div className="flex items-center gap-2 overflow-hidden">
             {folder.children && folder.children.length > 0 ? (
               <button
                 onClick={(e) => { e.stopPropagation(); toggleExpand(folder.id); }}
                 className={`p-0.5 rounded transition-transform ${expandedFolders.includes(folder.id) ? 'rotate-90' : ''}`}
               >
                 <ChevronRight size={14} />
               </button>
             ) : <div className="w-5" />}
             <span className="text-xl leading-none">{folder.icon || '📁'}</span>
             <span className="text-sm font-semibold truncate">{folder.name}</span>
          </div>
          {state.currentUser.scopes?.find(s => s.folderId === folder.id) && (
            <Shield size={12} className={selectedFolderId === folder.id ? 'text-blue-100' : 'text-blue-500'} />
          )}
        </div>
        {folder.children && expandedFolders.includes(folder.id) && (
          <div className="mt-1">{renderTree(folder.children, depth + 1)}</div>
        )}
      </div>
    ));
  };

  const handleLevelChange = (fid: string, level: AccessLevel) => {
    dispatch({ type: 'SET_SCOPE_ACCESS', folderId: fid, level });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[500px] animate-fade-in p-2">
      {/* Sidebar Tree */}
      <div className="w-full lg:w-80 flex flex-col gap-4 border-r border-[var(--ds-border-subtle)] pr-6">
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--ds-text-tertiary)]">Cấu trúc 7 Space</h3>
          <Badge variant="subtle" size="xs">{state.folders.length} Spaces</Badge>
        </div>
        <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar pr-2 pb-8">
          {renderTree(state.folders)}
        </div>
      </div>

      {/* Detail Panel */}
      <div className="flex-1 space-y-8 animate-slide-up">
        {selectedFolder ? (
          <>
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-[var(--ds-border-subtle)] shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-12 -mt-4 -mr-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                 <Shield size={160} />
               </div>

               <div className="flex items-start gap-6 relative z-10">
                 <div className="text-5xl p-5 bg-[var(--ds-bg-subtle)] rounded-2xl shadow-inner min-w-[100px] flex items-center justify-center">
                   {selectedFolder.icon || '📁'}
                 </div>
                 <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-3xl font-extrabold text-[var(--ds-text-primary)]">{selectedFolder.name}</h2>
                      <Badge variant={selectedFolder.parentId ? 'subtle' : 'primary'} size="s">
                        {selectedFolder.parentId ? 'Folder con' : 'Root Space'}
                      </Badge>
                    </div>
                    <p className="text-[var(--ds-text-secondary)] mb-6 text-lg max-w-2xl">{selectedFolder.description || 'Không có mô tả cho thư mục này.'}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="p-4 bg-[var(--ds-bg-success-subtle)] border border-[var(--ds-bg-success-border)] rounded-2xl flex items-center gap-4">
                         <div className="p-2 bg-green-500 rounded-lg text-white"><Check size={20}/></div>
                         <div>
                            <p className="text-xs font-bold uppercase text-green-700">Quyền hiện tại</p>
                            <p className="text-lg font-bold text-green-900">
                              {state.currentUser.scopes?.find(s => s.folderId === selectedFolder.id)?.level || 'Inherited/None'}
                            </p>
                         </div>
                       </div>
                       <div className="p-4 bg-[var(--ds-bg-info-subtle)] border border-[var(--ds-bg-info-border)] rounded-2xl flex items-center gap-4">
                         <div className="p-2 bg-blue-500 rounded-lg text-white"><Info size={20}/></div>
                         <div>
                            <p className="text-xs font-bold uppercase text-blue-700">Thừa kế từ</p>
                            <p className="text-lg font-bold text-blue-900">{selectedFolder.parentId || 'None (Root)'}</p>
                         </div>
                       </div>
                    </div>
                 </div>
               </div>
            </div>

            <div className="space-y-4">
               <div className="flex items-center justify-between">
                 <h3 className="text-xl font-bold text-[var(--ds-text-primary)]">Phân quyền chi tiết của bạn</h3>
                 <div className="flex items-center gap-2 text-xs text-[var(--ds-text-tertiary)] italic">
                    * Lưu ý: Admin luôn có toàn quyền (admin)
                 </div>
               </div>

               <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-[var(--ds-border-subtle)] overflow-hidden shadow-lg p-6">
                 <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1">
                      <h4 className="font-bold text-[var(--ds-text-primary)] mb-2">Gán quyền cho Folder này</h4>
                      <p className="text-sm text-[var(--ds-text-tertiary)] max-w-md">Thay đổi quyền truy cập của bạn đối với folder hiện tại. Quyền này sẽ được thừa kế cho các folder con.</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Select
                        options={ACCESS_OPTIONS}
                        value={state.currentUser.scopes?.find(s => s.folderId === selectedFolder.id)?.level || 'none'}
                        onValueChange={(v) => handleLevelChange(selectedFolder.id, v as AccessLevel)}
                        className="w-56"
                        size="m"
                      />
                      <Button variant="primary" size="m">Cập nhật</Button>
                    </div>
                 </div>
               </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white dark:bg-zinc-900 rounded-3xl border border-[var(--ds-border-subtle)] border-dashed">
             <div className="w-16 h-16 bg-[var(--ds-bg-subtle)] rounded-full flex items-center justify-center text-[var(--ds-text-tertiary)] mb-4">
               <FolderIcon size={32} />
             </div>
             <h3 className="text-xl font-bold text-[var(--ds-text-primary)] mb-2">Chọn một thư mục để cấu hình</h3>
             <p className="text-[var(--ds-text-secondary)] max-w-sm">Chọn một trong 7 Space hoặc các thư mục con từ menu bên trái để quản lý quyền truy cập.</p>
          </div>
        )}
      </div>
    </div>
  );
}
