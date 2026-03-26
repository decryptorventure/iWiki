import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserPlus, Trash2, Shield, User as UserIcon, MoreHorizontal, Search } from 'lucide-react';
import { Button, Input, Select, Modal, Badge } from '@frontend-team/ui-kit';
import { SpaceRole } from '../../types/user';

export function SpaceMemberManager() {
  const { state, dispatch } = useApp();
  const { spaceMembers, folders, roles, teams } = state;
  const [selectedSpaceId, setSelectedSpaceId] = useState(folders.filter(f => !f.parentId)[0]?.id);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentSpace = folders.find(f => f.id === selectedSpaceId);
  const spaceMembersList = spaceMembers.filter(m => m.spaceId === selectedSpaceId);
  
  // Mock users search (in real app, this would be an API call)
  const allKnownUsers = [
    { id: 'user-1', name: 'Nguyễn Văn A', email: 'a.nv@ikame.com', avatar: 'https://picsum.photos/seed/ikame/100/100' },
    { id: 'user-new', name: 'Nguyễn Thành Viên', email: 'vien.nt@ikame.com', avatar: 'https://picsum.photos/seed/newemp/100/100' },
    { id: 'user-official', name: 'Trần Nhân Viên', email: 'vien.t@ikame.com', avatar: 'https://picsum.photos/seed/official/100/100' },
    { id: 'user-admin', name: 'Admin iKame', email: 'admin@ikame.com', avatar: 'https://picsum.photos/seed/admin/100/100' },
  ];

  const handleUpdateRole = (userId: string, roleId: SpaceRole) => {
    dispatch({ type: 'SET_SPACE_ROLE', userId, spaceId: selectedSpaceId!, roleId });
  };

  const currentSpaceOptions = folders
    .filter(f => !f.parentId)
    .map(f => ({ value: f.id, label: `${f.icon} ${f.name}` }));

  const roleOptions = [
    { value: 'admin', label: 'Admin (Quản trị Space)' },
    { value: 'km', label: 'KM (Knowledge Manager)' },
    { value: 'member', label: 'Member' },
  ];

  return (
    <div className="bg-white rounded-3xl border border-[var(--ds-border-subtle)] shadow-xl overflow-hidden animate-slide-up">
      <div className="p-6 border-b border-[var(--ds-border-secondary)] bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-48">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Chọn Space</label>
            <Select 
              value={selectedSpaceId} 
              onValueChange={setSelectedSpaceId} 
              options={currentSpaceOptions}
              className="w-full"
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--ds-text-primary)]">Thành viên Space</h3>
            <p className="text-xs text-[var(--ds-text-secondary)]">{spaceMembersList.length} nhân sự có quyền truy cập</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <Input 
              placeholder="Tìm thành viên..." 
              value={searchQuery} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Button variant="primary" size="s" onClick={() => setIsAddModalOpen(true)}>
            <UserPlus size={16} /> Thêm người vào Space
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/30 border-b border-gray-100">
              <th className="p-4 pl-6 font-bold text-gray-500 uppercase text-[10px] tracking-widest">Thành viên</th>
              <th className="p-4 font-bold text-gray-500 uppercase text-[10px] tracking-widest">Role trong Space</th>
              <th className="p-4 font-bold text-gray-500 uppercase text-[10px] tracking-widest">Team</th>
              <th className="p-4 font-bold text-gray-500 uppercase text-[10px] tracking-widest text-right pr-6">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {spaceMembersList.map((member) => {
              const user = allKnownUsers.find(u => u.id === member.userId);
              const team = teams.find(t => t.id === (state.currentUser.id === user?.id ? state.currentUser.teamId : '')); // Mock team
              if (!user) return null;
              
              return (
                <tr key={member.userId} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} className="w-8 h-8 rounded-full border border-gray-200" alt="" />
                      <div>
                        <p className="font-bold text-sm text-gray-900 leading-tight">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="w-40">
                      <Select 
                        value={member.roleId} 
                        onValueChange={(val) => handleUpdateRole(member.userId, val as SpaceRole)}
                        options={roleOptions}
                        size="s"
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="subtle" color="gray">Production</Badge>
                  </td>
                  <td className="p-4 text-right pr-6">
                    <Button variant="subtle" size="icon-s" className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        title="Thêm thành viên vào Space"
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="subtle" size="s" onClick={() => setIsAddModalOpen(false)}>Hủy</Button>
            <Button variant="primary" size="s" onClick={() => setIsAddModalOpen(false)}>Thêm ngay</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email / Tên nhân sự</label>
            <Input placeholder="VD: nguyen.van.a@ikame.com" className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Gán Role</label>
            <Select options={roleOptions} defaultValue="member" className="w-full" />
          </div>
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
            <Shield className="text-blue-500 shrink-0" size={20} />
            <p className="text-xs text-blue-700 leading-relaxed">
              <strong>Lưu ý:</strong> Quyền này chỉ áp dụng trong phạm vi Space <strong>{currentSpace?.name}</strong>. Cấu trúc folder con sẽ được kế thừa từ role này trừ khi có giới hạn Team cụ thể.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
