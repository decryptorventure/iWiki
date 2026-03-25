// Publish settings modal for Editor — folder, tags, permissions
import React from 'react';
import { X, Folder, Tag, Shield, Globe, Lock, Check, Send } from 'lucide-react';

interface Folder { id: string; name: string; }

interface EditorPublishModalProps {
  allFolders: Folder[];
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
  onPublish: () => void;
  onClose: () => void;
}

export default function EditorPublishModal({
  allFolders, selectedFolderId, onFolderChange,
  tags, tagInput, onTagInputChange, onTagKeyDown, onRemoveTag,
  viewPermission, onViewPermissionChange,
  allowComments, onAllowCommentsChange,
  isPublishing, isEditing, canPublish,
  onPublish, onClose,
}: EditorPublishModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-modal-backdrop">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-modal-enter">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Cài đặt xuất bản</h3>
            <p className="text-sm text-gray-500 mt-1">Phân loại và thiết lập quyền truy cập cho bài viết.</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-all duration-200 active:scale-90"><X size={20} /></button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          {/* Folder */}
          <section>
            <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><Folder size={16} className="text-indigo-500" /> Vị trí lưu trữ <span className="text-red-500">*</span></h4>
            <select value={selectedFolderId} onChange={e => onFolderChange(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all hover:border-gray-300">
              <option value="" disabled>Chọn thư mục...</option>
              {allFolders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </section>

          {/* Tags */}
          <section>
            <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><Tag size={16} className="text-orange-500" /> Tags</h4>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all hover:border-gray-300">
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-xs font-medium text-gray-700 shadow-sm">
                    {tag}<button onClick={() => onRemoveTag(tag)} className="text-gray-400 hover:text-red-500 transition-colors active:scale-90"><X size={12} /></button>
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

        <div className="p-4 border-t border-gray-100 bg-gray-50/80 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} disabled={isPublishing} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-xl transition-all active:scale-95">Hủy</button>
          <button onClick={onPublish} disabled={!selectedFolderId || isPublishing} className="px-6 py-2 text-sm font-bold text-white bg-gradient-to-r from-[#f76226] to-[#FF8A6A] hover:shadow-lg hover:shadow-[#f76226]/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-md flex items-center gap-2 active:scale-95">
            {isPublishing ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Đang xuất bản...</> : <><Send size={16} /> {isEditing ? 'Cập nhật bài viết' : 'Xác nhận xuất bản'}</>}
          </button>
        </div>
      </div>
    </div>
  );
}
