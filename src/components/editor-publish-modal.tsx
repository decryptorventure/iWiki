// Publish settings modal for Editor — folder, tags, permissions
import React, { useState, useRef, useEffect } from 'react';
import { Folder, Tag, Shield, Globe, Lock, Check, Send, Search, X } from 'lucide-react';
import { Button, Input, Modal } from '@frontend-team/ui-kit';

interface FolderItem { id: string; name: string; }

interface EditorPublishModalProps {
  allFolders: FolderItem[];
  selectedFolderId: string;
  onFolderChange: (id: string) => void;
  tags: string[];
  tagInput: string;
  onTagInputChange: (val: string) => void;
  onTagKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onRemoveTag: (tag: string) => void;
  viewPermission: 'public' | 'restricted';
  onViewPermissionChange: (val: 'public' | 'restricted') => void;
  allowComments: boolean;
  onAllowCommentsChange: (val: boolean) => void;
  isPublishing: boolean;
  isEditing: boolean;
  canPublish: boolean;
  onPublish: (sharedWith: string[]) => void;
  onClose: () => void;
}

const RECENT_FOLDERS_KEY = 'recentFolders';

function getRecentFolderIds(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_FOLDERS_KEY) || '[]'); }
  catch { return []; }
}

function saveRecentFolderId(id: string) {
  const prev = getRecentFolderIds().filter(x => x !== id);
  localStorage.setItem(RECENT_FOLDERS_KEY, JSON.stringify([id, ...prev].slice(0, 5)));
}

export default function EditorPublishModal({
  allFolders, selectedFolderId, onFolderChange,
  tags, tagInput, onTagInputChange, onTagKeyDown, onRemoveTag,
  viewPermission, onViewPermissionChange,
  allowComments, onAllowCommentsChange,
  isPublishing, isEditing, canPublish,
  onPublish, onClose,
}: EditorPublishModalProps) {
  const [folderSearch, setFolderSearch] = useState('');
  const [folderDropdownOpen, setFolderDropdownOpen] = useState(false);
  const [sharedWith, setSharedWith] = useState<string[]>([]);
  const [sharedInput, setSharedInput] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedFolder = allFolders.find(f => f.id === selectedFolderId);
  const recentIds = getRecentFolderIds();
  const recentFolders = recentIds.map(id => allFolders.find(f => f.id === id)).filter(Boolean) as FolderItem[];
  const filteredFolders = folderSearch
    ? allFolders.filter(f => f.name.toLowerCase().includes(folderSearch.toLowerCase()))
    : allFolders;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setFolderDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelectFolder = (id: string) => {
    onFolderChange(id);
    saveRecentFolderId(id);
    setFolderDropdownOpen(false);
    setFolderSearch('');
  };

  const handleSharedInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && sharedInput.trim()) {
      e.preventDefault();
      const val = sharedInput.trim().replace(/,$/, '');
      if (val && !sharedWith.includes(val)) setSharedWith(prev => [...prev, val]);
      setSharedInput('');
    }
  };

  return (
    <Modal
      open={true}
      onOpenChange={(open) => { if (!open) onClose(); }}
      title="Cài đặt xuất bản"
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="subtle" size="s" onClick={onClose} disabled={isPublishing}>Hủy</Button>
          <Button variant="primary" size="s" onClick={() => onPublish(sharedWith)} disabled={!selectedFolderId || isPublishing}>
            {isPublishing
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Đang xuất bản...</>
              : <><Send size={16} /> {isEditing ? 'Cập nhật bài viết' : 'Xác nhận xuất bản'}</>
            }
          </Button>
        </div>
      }
    >
      <p className="text-sm text-gray-500 mb-6">Phân loại và thiết lập quyền truy cập cho bài viết.</p>
      <div className="space-y-6">
        {/* Folder — searchable picker */}
        <section>
          <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><Folder size={16} className="text-indigo-500" /> Vị trí lưu trữ <span className="text-red-500">*</span></h4>
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setFolderDropdownOpen(o => !o)}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            >
              <span className={selectedFolder ? 'text-gray-900' : 'text-gray-400'}>
                {selectedFolder ? selectedFolder.name : 'Chọn thư mục...'}
              </span>
              <Search size={15} className="text-gray-400 shrink-0" />
            </button>

            {folderDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                <div className="p-2 border-b border-gray-100">
                  <Input
                    autoFocus
                    type="text"
                    value={folderSearch}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFolderSearch(e.target.value)}
                    placeholder="Tìm thư mục..."
                    className="w-full"
                  />
                </div>
                <div className="max-h-52 overflow-y-auto">
                  {!folderSearch && recentFolders.length > 0 && (
                    <div>
                      <p className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Gần đây</p>
                      {recentFolders.map(f => (
                        <button key={f.id} type="button" onClick={() => handleSelectFolder(f.id)}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-indigo-50 transition-colors ${selectedFolderId === f.id ? 'text-indigo-600 font-semibold' : 'text-gray-700'}`}>
                          {f.name}
                        </button>
                      ))}
                      <hr className="my-1 border-gray-100" />
                    </div>
                  )}
                  {!folderSearch && <p className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tất cả</p>}
                  {filteredFolders.map(f => (
                    <button key={f.id} type="button" onClick={() => handleSelectFolder(f.id)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-indigo-50 transition-colors ${selectedFolderId === f.id ? 'text-indigo-600 font-semibold' : 'text-gray-700'}`}>
                      {f.name}
                    </button>
                  ))}
                  {filteredFolders.length === 0 && <p className="px-3 py-3 text-sm text-gray-400 text-center">Không tìm thấy thư mục</p>}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Tags */}
        <section>
          <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><Tag size={16} className="text-orange-500" /> Tags</h4>
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all hover:border-gray-300">
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-xs font-medium text-gray-700 shadow-sm">
                  {tag}
                  <button onClick={() => onRemoveTag(tag)} className="text-gray-400 hover:text-red-500 transition-colors active:scale-90"><X size={12} /></button>
                </span>
              ))}
            </div>
            <input type="text" value={tagInput} onChange={e => onTagInputChange(e.target.value)} onKeyDown={onTagKeyDown} placeholder="Nhập tag và nhấn Enter..." className="w-full bg-transparent border-none focus:ring-0 text-sm p-0 outline-none" />
          </div>
        </section>

        {/* Permissions */}
        <section>
          <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><Shield size={16} className="text-green-500" /> Quyền truy cập</h4>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {([{ val: 'public', icon: Globe, label: 'Công khai', desc: 'Mọi người trong iKame' }, { val: 'restricted', icon: Lock, label: 'Hạn chế', desc: 'Chỉ người được cấp quyền' }] as const).map(opt => {
              const Icon = opt.icon;
              return (
                <label key={opt.val} className={`flex cursor-pointer rounded-xl border p-4 transition-all ${viewPermission === opt.val ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'}`}>
                  <input type="radio" name="view_permission" value={opt.val} className="sr-only" checked={viewPermission === opt.val} onChange={() => onViewPermissionChange(opt.val)} />
                  <span className="flex flex-1 flex-col">
                    <span className="text-sm font-medium text-gray-900 flex items-center gap-2"><Icon size={16} className={viewPermission === opt.val ? 'text-indigo-600' : 'text-gray-400'} />{opt.label}</span>
                    <span className="mt-1 text-xs text-gray-500">{opt.desc}</span>
                  </span>
                  {viewPermission === opt.val && <Check size={20} className="text-indigo-600 shrink-0" />}
                </label>
              );
            })}
          </div>

          {viewPermission === 'restricted' && (
            <div className="mb-4 p-4 border border-indigo-100 rounded-xl bg-indigo-50/40">
              <h5 className="text-sm font-semibold text-gray-900 mb-2">Người được chia sẻ</h5>
              <div className="p-3 bg-white border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                <div className="flex flex-wrap gap-2 mb-2">
                  {sharedWith.map(user => (
                    <span key={user} className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium">
                      {user}
                      <button onClick={() => setSharedWith(prev => prev.filter(u => u !== user))} className="text-orange-400 hover:text-red-500 active:scale-90"><X size={11} /></button>
                    </span>
                  ))}
                </div>
                <input type="text" value={sharedInput} onChange={e => setSharedInput(e.target.value)} onKeyDown={handleSharedInputKeyDown} placeholder="Nhập tên hoặc email, nhấn Enter..." className="w-full bg-transparent border-none focus:ring-0 text-sm p-0 outline-none" />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-white hover:border-gray-300 transition-colors">
            <div>
              <h5 className="text-sm font-medium text-gray-900">Cho phép bình luận</h5>
              <p className="text-xs text-gray-500 mt-0.5">Người đọc có thể để lại bình luận.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={allowComments} onChange={e => onAllowCommentsChange(e.target.checked)} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </section>
      </div>
    </Modal>
  );
}
