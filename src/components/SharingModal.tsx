import React, { useState } from 'react';
import { Search, User as UserIcon, X, Check } from 'lucide-react';
import { Modal, Button, Input } from '@frontend-team/ui-kit';
import { useApp } from '../context/AppContext';
import { PRESET_USERS } from '../data/mock-data';

interface SharingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: string;
  itemType: 'folder' | 'article';
  initialSharedWith?: string[];
}

export default function SharingModal({ open, onOpenChange, itemId, itemType, initialSharedWith = [] }: SharingModalProps) {
  const { state, dispatch } = useApp();
  const [selectedUsers, setSelectedUsers] = useState<string[]>(initialSharedWith);
  const [search, setSearch] = useState('');

  const handleToggleUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleSave = () => {
    if (itemType === 'folder') {
      dispatch({ type: 'SHARE_FOLDER', folderId: itemId, userIds: selectedUsers });
    } else {
      dispatch({ type: 'SHARE_ARTICLE', articleId: itemId, userIds: selectedUsers });
    }
    onOpenChange(false);
  };

  const allUsers = Object.values(PRESET_USERS);
  const filteredUsers = allUsers.filter(u => 
    u.id !== state.currentUser.id && 
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.role.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Modal 
      open={open} 
      onOpenChange={onOpenChange} 
      title="Chia sẻ quyền truy cập" 
      size="sm"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="subtle" onClick={() => onOpenChange(false)}>Hủy</Button>
          <Button variant="primary" onClick={handleSave}>Lưu thay đổi</Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="relative">
          <Input 
            placeholder="Tìm kiếm người dùng..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>
        
        <div className="max-h-[300px] overflow-y-auto space-y-1 pr-1 custom-scrollbar">
          {filteredUsers.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-sm">Không tìm thấy người dùng phù hợp</div>
          ) : (
            filteredUsers.map(user => (
              <div 
                key={user.id} 
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                  selectedUsers.includes(user.id) 
                    ? 'bg-[var(--ds-bg-accent-primary-subtle)] border border-[var(--ds-border-accent-primary-subtle)]' 
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
                onClick={() => handleToggleUser(user.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={user.avatar} className="w-9 h-9 rounded-full object-cover border border-gray-100" alt={user.name} />
                    {selectedUsers.includes(user.id) && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[var(--ds-fg-accent-primary)] rounded-full flex items-center justify-center text-white border-2 border-white">
                        <Check size={10} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{user.name}</p>
                    <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">{user.role}</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  selectedUsers.includes(user.id)
                    ? 'bg-[var(--ds-fg-accent-primary)] border-[var(--ds-fg-accent-primary)] text-white'
                    : 'border-gray-200 bg-white'
                }`}>
                  {selectedUsers.includes(user.id) && <Check size={14} strokeWidth={3} />}
                </div>
              </div>
            ))
          )}
        </div>

        {selectedUsers.length > 0 && (
          <div className="pt-2">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Đã chọn ({selectedUsers.length})</p>
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map(id => {
                const u = allUsers.find(user => user.id === id);
                return (
                  <div key={id} className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-700">
                    <span>{u?.name}</span>
                    <button onClick={(e) => { e.stopPropagation(); handleToggleUser(id); }} className="hover:text-red-500">
                      <X size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
