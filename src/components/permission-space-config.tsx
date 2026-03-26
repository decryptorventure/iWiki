
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
    <div className="flex flex-col gap-10 animate-fade-in">
      {/* 1. Standards Tooltip */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-6 flex items-start gap-4 shadow-sm">
        <div className="p-3 bg-blue-500 rounded-2xl text-white shadow-md">
          <Info size={24} />
        </div>
        <div>
          <h4 className="text-lg font-bold text-blue-900 mb-1">Tuân thủ tiêu chuẩn iWiki</h4>
          <p className="text-sm text-blue-700 leading-relaxed opacity-90 max-w-4xl">
            Đảm bảo các cấu trúc Space và Folder tuân thủ quy tắc <strong>7 Space</strong>. 
            Mọi folder nghiệp vụ đích bắt buộc phải bao gồm 3 tiểu mục chuẩn: 
            <strong> Process & Guidelines</strong>, <strong>Knowledge</strong>, và <strong>Best Practices</strong>.
          </p>
        </div>
      </div>

      {/* 2. Selected Folder Editor (Now at TOP) */}
      <div className="flex-1">
        {selectedFolder ? (
          <div className="space-y-8 animate-slide-up">
            {/* Header / Meta */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
               <div className="flex items-center gap-6">
                  <div className="text-5xl p-6 bg-[var(--ds-bg-subtle)] rounded-[32px] border border-[var(--ds-border-subtle)] shadow-inner">
                    {selectedFolder.icon || '📁'}
                  </div>
                  <div>
                    <h2 className="text-4xl font-black text-[var(--ds-text-primary)] mb-1">{selectedFolder.name}</h2>
                    <p className="text-lg text-[var(--ds-text-secondary)] font-medium">Cấu hình định danh và cấu trúc thư mục con</p>
                    <div className="flex gap-2 mt-3">
                      <Badge variant="primary" size="s">ID: {selectedFolder.id}</Badge>
                      <Badge variant="subtle" size="s">{selectedFolder.parentId ? `Parent: ${selectedFolder.parentId}` : 'Root Space'}</Badge>
                    </div>
                  </div>
               </div>
               <div className="flex gap-3">
                 <Button variant="border" size="m"><Trash2 size={18} className="text-red-500" /> Gỡ bỏ</Button>
                 <Button variant="primary" size="m" className="shadow-lg shadow-orange-500/20"><Plus size={18} /> Thêm Folder con</Button>
               </div>
            </div>

            {/* Editor Forms Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               {/* Identity Section (7 cols) */}
               <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-[var(--ds-border-subtle)] rounded-[32px] p-8 shadow-sm space-y-6">
                  <div className="flex items-center gap-2 mb-2 text-orange-500">
                    <Settings size={22} />
                    <h3 className="text-xl font-extrabold tracking-tight">Định danh & Hiển thị</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase text-[var(--ds-text-tertiary)] mb-2 tracking-widest">Tên hiển thị</label>
                      <Input defaultValue={selectedFolder.name} className="w-full text-lg h-12" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-[var(--ds-text-tertiary)] mb-2 tracking-widest">Biểu tượng (Emoji/Token)</label>
                      <Input defaultValue={selectedFolder.icon} className="w-full text-lg h-12 text-center" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--ds-text-tertiary)] mb-2 tracking-widest">Mô tả thư mục</label>
                    <Textarea defaultValue={selectedFolder.description} className="w-full h-32 text-base leading-relaxed" placeholder="Mục đích của thư mục này là gì?" />
                  </div>
                  <Button variant="primary" fullWidth size="m" className="h-12 text-lg font-bold"><Save size={20} /> Cập nhật thông tin</Button>
               </div>

               {/* Children Section (5 cols) */}
               <div className="lg:col-span-5 bg-[var(--ds-bg-subtle)] rounded-[32px] p-8 border border-dashed border-[var(--ds-border-subtle)] flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-extrabold text-[var(--ds-text-primary)]">Folders con ({selectedFolder.children?.length || 0})</h3>
                    <Button variant="border" size="xs">Quản lý nhanh</Button>
                  </div>
                  <div className="flex-1 space-y-3 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                    {selectedFolder.children?.map(child => (
                      <div key={child.id} className="flex items-center justify-between bg-white dark:bg-zinc-800 p-4 rounded-2xl border border-[var(--ds-border-subtle)] group hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl">{child.icon || '📁'}</span>
                          <span className="text-base font-bold text-[var(--ds-text-primary)]">{child.name}</span>
                        </div>
                        <Button variant="dim" size="xs" className="opacity-0 group-hover:opacity-100 transition-opacity"><Edit2 size={14}/></Button>
                      </div>
                    ))}
                    {(!selectedFolder.children || selectedFolder.children.length === 0) && (
                      <div className="flex-1 flex flex-col items-center justify-center text-[var(--ds-text-tertiary)] py-12">
                        <FolderIcon size={48} className="opacity-20 mb-4" />
                        <p className="text-sm italic">Thư mục này chưa có folder con</p>
                      </div>
                    )}
                  </div>
                  <Button variant="border" fullWidth size="m" className="mt-6 font-bold"><Plus size={18} /> Tạo Folder chuẩn (Process/Know/Case)</Button>
               </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-20 bg-white dark:bg-zinc-900 rounded-[40px] border border-[var(--ds-border-subtle)] border-dashed animate-fade-in shadow-inner">
             <div className="w-24 h-24 bg-[var(--ds-bg-subtle)] rounded-full flex items-center justify-center text-[var(--ds-text-tertiary)] mb-6">
               <FolderIcon size={48} />
             </div>
             <h3 className="text-2xl font-black text-[var(--ds-text-primary)] mb-3">Chọn một thư mục để cấu hình</h3>
             <p className="text-lg text-[var(--ds-text-secondary)] max-w-sm">Duyệt qua "Bảng cấu trúc thư mục" bên dưới để chỉnh sửa cấu hình chi tiết của từng Space.</p>
          </div>
        )}
      </div>

      {/* 3. Folder Tree Navigator (Now at BOTTOM) */}
      <div className="bg-white dark:bg-zinc-900 border border-[var(--ds-border-subtle)] rounded-[40px] p-8 shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-black uppercase tracking-widest text-[var(--ds-text-primary)]">Bảng cấu trúc thư mục</h3>
            <p className="text-sm text-[var(--ds-text-secondary)]">Sử dụng cây thư mục này để chọn folder anh muốn cấu hình ở phía trên.</p>
          </div>
          <Button variant="dim" size="s" className="font-bold"><Plus size={16}/> Thêm Root Space mới</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {folders.map(space => (
             <div key={space.id} className="space-y-4">
                <div 
                  onClick={() => { setSelectedFid(space.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`p-4 rounded-2xl cursor-pointer border-2 transition-all ${selectedFid === space.id ? 'border-[var(--ds-fg-accent-primary)] bg-[var(--ds-bg-accent-primary-subtle)] shadow-lg' : 'border-transparent bg-[var(--ds-bg-subtle)] hover:border-gray-300'}`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{space.icon}</span>
                    <span className="font-black truncate uppercase">{space.name}</span>
                  </div>
                </div>
                {expanded.includes(space.id) && space.children && (
                  <div className="pl-4 border-l-2 border-gray-100 ml-6 space-y-1">
                    {renderConfigTree(space.children, 0)}
                  </div>
                )}
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
