
import React, { useState } from 'react';
import { Layout, Edit2, Save, Trash2, Plus, ChevronRight, Folder as FolderIcon, Settings, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Folder } from '../store/useAppStore';
import { Button, Input, Textarea, Badge } from '@frontend-team/ui-kit';

export function PermissionSpaceConfig() {
  const { state } = useApp();
  const { folders } = state;
  const [selectedFid, setSelectedFid] = useState<string | null>(folders[0]?.id || null);
  const [expanded, setExpanded] = useState<string[]>(folders.map(f => f.id));

  const selectedFolder = findFolderById(folders, selectedFid);

  function findFolderById(list: Folder[], id: string | null): Folder | undefined {
    if (!id) return undefined;
    for (const f of list) {
      if (f.id === id) return f;
      if (f.children) {
        const found = findFolderById(f.children, id);
        if (found) return found;
      }
    }
    return undefined;
  }

  const toggleExpand = (id: string) => {
    setExpanded(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const renderConfigTree = (list: Folder[], depth = 0) => {
    return list.map(folder => (
      <div key={folder.id} className="flex flex-col">
        <div
          onClick={() => setSelectedFid(folder.id)}
          className={`flex items-center justify-between py-2 px-3 rounded-xl cursor-pointer transition-all ${
            selectedFid === folder.id
              ? 'bg-[var(--ds-bg-accent-primary-subtle)] text-[var(--ds-fg-accent-primary)] ring-1 ring-[var(--ds-fg-accent-primary)] shadow-sm'
              : 'hover:bg-[var(--ds-bg-subtle)] text-[var(--ds-text-secondary)]'
          }`}
          style={{ marginLeft: `${depth * 1.25}rem` }}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            {folder.children && folder.children.length > 0 ? (
               <button
                 onClick={(e) => { e.stopPropagation(); toggleExpand(folder.id); }}
                 className={`p-0.5 rounded transition-transform ${expanded.includes(folder.id) ? 'rotate-90' : ''}`}
               >
                 <ChevronRight size={14} />
               </button>
            ) : <div className="w-5" />}
            <span className="text-lg">{folder.icon || '📁'}</span>
            <span className="text-xs font-bold truncate uppercase tracking-tight">{folder.name}</span>
          </div>
          <Badge variant="dim" size="xs">{folder.children?.length || 0}</Badge>
        </div>
        {folder.children && expanded.includes(folder.id) && (
          <div className="mt-1">{renderConfigTree(folder.children, depth + 1)}</div>
        )}
      </div>
    ));
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Standards Tooltip - Moved to TOP */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-6 flex items-start gap-4 shadow-sm">
        <div className="p-3 bg-blue-500 rounded-2xl text-white shadow-md">
          <Info size={24} />
        </div>
        <div>
          <h4 className="text-lg font-bold text-blue-900 mb-1">Tuân thủ tiêu chuẩn iWiki</h4>
          <p className="text-sm text-blue-700 leading-relaxed opacity-90 max-w-4xl">
            Đảm bảo các thay đổi về cấu trúc Space và Folder tuân thủ quy tắc <strong>7 Space</strong>. 
            Mọi folder nghiệp vụ đích (leaf node) bắt buộc phải bao gồm 3 tiểu mục chuẩn: 
            <strong> Process & Guidelines</strong>, <strong>Knowledge</strong>, và <strong>Best Practices</strong> để đảm bảo sự đồng bộ trong trải nghiệm tra cứu của toàn bộ nhân sự iKame.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 min-h-[600px]">
        {/* Left Tree Navigator */}
      <div className="w-full lg:w-80 flex flex-col gap-4 border-r border-[var(--ds-border-subtle)] pr-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--ds-text-tertiary)]">Cấu trúc Folder</h3>
          <Button variant="dim" size="xs"><Plus size={14}/> Thêm Space</Button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
          {renderConfigTree(folders)}
        </div>
      </div>

      {/* Right Content Editor */}
      <div className="flex-1">
        {selectedFolder ? (
          <div className="space-y-8 animate-slide-up">
            {/* Header / Meta */}
            <div className="flex items-start justify-between">
               <div className="flex items-center gap-4">
                  <div className="text-5xl p-5 bg-[var(--ds-bg-subtle)] rounded-3xl border border-[var(--ds-border-subtle)] shadow-inner">
                    {selectedFolder.icon || '📁'}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-[var(--ds-text-primary)]">{selectedFolder.name}</h2>
                    <p className="text-[var(--ds-text-secondary)] font-medium">Cấu hình định danh và cấu trúc thư mục con</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="primary" size="s">ID: {selectedFolder.id}</Badge>
                      <Badge variant="subtle" size="s">{selectedFolder.parentId ? `Parent: ${selectedFolder.parentId}` : 'Root Space'}</Badge>
                    </div>
                  </div>
               </div>
               <div className="flex gap-2">
                 <Button variant="border" size="s"><Trash2 size={16} className="text-red-500" /> Gỡ bỏ</Button>
                 <Button variant="primary" size="s"><Plus size={16} /> Thêm Folder con</Button>
               </div>
            </div>

            {/* Editor Forms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Identity Section */}
               <div className="bg-white dark:bg-zinc-900 border border-[var(--ds-border-subtle)] rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 mb-2 text-orange-500">
                    <Settings size={18} />
                    <h3 className="font-bold">Định danh & Hiển thị</h3>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--ds-text-tertiary)] mb-1.5">Tên hiển thị</label>
                    <Input defaultValue={selectedFolder.name} className="w-full" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--ds-text-tertiary)] mb-1.5">Biểu tượng (Emoji/Token)</label>
                    <Input defaultValue={selectedFolder.icon} className="w-full" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--ds-text-tertiary)] mb-1.5">Mô tả thư mục</label>
                    <Textarea defaultValue={selectedFolder.description} className="w-full h-24" />
                  </div>
                  <Button variant="primary" fullWidth size="m"><Save size={18} /> Cập nhật thông tin</Button>
               </div>

               {/* Children Section */}
               <div className="bg-[var(--ds-bg-subtle)] rounded-3xl p-6 border border-dashed border-[var(--ds-border-subtle)] flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-[var(--ds-text-primary)]">Folders con ({selectedFolder.children?.length || 0})</h3>
                    <Button variant="border" size="xs">Quản lý nhanh</Button>
                  </div>
                  <div className="flex-1 space-y-2 overflow-y-auto max-h-64 pr-2">
                    {selectedFolder.children?.map(child => (
                      <div key={child.id} className="flex items-center justify-between bg-white dark:bg-zinc-800 p-3 rounded-xl border border-[var(--ds-border-subtle)] group">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{child.icon || '📁'}</span>
                          <span className="text-sm font-bold text-[var(--ds-text-secondary)]">{child.name}</span>
                        </div>
                        <Button variant="dim" size="xs" className="opacity-0 group-hover:opacity-100"><Edit2 size={12}/></Button>
                      </div>
                    ))}
                    {(!selectedFolder.children || selectedFolder.children.length === 0) && (
                      <div className="h-full flex flex-col items-center justify-center text-[var(--ds-text-tertiary)] p-8">
                        <FolderIcon size={32} />
                        <p className="text-xs mt-2 italic">Thư mục này chưa có folder con</p>
                      </div>
                    )}
                  </div>
                  <Button variant="border" fullWidth size="s" className="mt-4"><Plus size={16} /> Tạo Folder chuẩn (Process/Know/Case)</Button>
                </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white dark:bg-zinc-900 rounded-3xl border border-[var(--ds-border-subtle)] border-dashed animate-fade-in">
             <div className="w-16 h-16 bg-[var(--ds-bg-subtle)] rounded-full flex items-center justify-center text-[var(--ds-text-tertiary)] mb-4">
               <FolderIcon size={32} />
             </div>
             <h3 className="text-xl font-bold text-[var(--ds-text-primary)] mb-2">Chọn một thư mục để cấu hình</h3>
             <p className="text-[var(--ds-text-secondary)] max-w-sm">Chọn bất kỳ Space hoặc folder con nào từ cây thư mục bên trái để bắt đầu chỉnh sửa cấu trúc.</p>
          </div>
        )}
      </div>
    </div>
  </div>
  );
}
