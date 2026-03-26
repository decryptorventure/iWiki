import React, { useState } from 'react';
import { Shield, Users, Settings, Database, Plus, UserPlus, Save, Edit2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { can } from '../lib/permissions';
import { Button, Input, Textarea, Select, Modal, Tabs } from '@frontend-team/ui-kit';
import { PermissionRolesGrid } from './permission-roles-grid';
import { PermissionMatrixTable } from './permission-matrix-table';
import { PermissionFolderTreeManager } from './permission-folder-tree-manager';

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Quản trị viên (Admin)' },
  { value: 'manager', label: 'Trưởng phòng (Manager)' },
  { value: 'editor', label: 'Người viết (Editor)' },
  { value: 'viewer', label: 'Người đọc (Viewer)' },
];

export default function PermissionManagement() {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('roles');
  if (!can(state.currentUser, 'admin.access')) {
    return <div className="h-full flex items-center justify-center text-[var(--ds-text-tertiary)]">Bạn không có quyền truy cập cấu hình phân quyền.</div>;
  }

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [isEditingMatrix, setIsEditingMatrix] = useState(false);

  const [roles] = useState([
    { id: 'admin', name: 'Quản trị viên (Admin)', users: 3, description: 'Toàn quyền truy cập và cấu hình hệ thống' },
    { id: 'manager', name: 'Trưởng phòng (Manager)', users: 12, description: 'Quản lý tài liệu và phê duyệt trong phòng ban' },
    { id: 'editor', name: 'Người viết (Editor)', users: 45, description: 'Tạo, chỉnh sửa và xuất bản tài liệu' },
    { id: 'viewer', name: 'Người đọc (Viewer)', users: 128, description: 'Chỉ xem và bình luận tài liệu' },
  ]);

  const [modules, setModules] = useState([
    {
      name: 'Quản lý tài liệu',
      permissions: [
        { id: 'view_docs', name: 'Xem tài liệu', admin: true, manager: true, editor: true, viewer: true },
        { id: 'create_docs', name: 'Tạo tài liệu mới', admin: true, manager: true, editor: true, viewer: false },
        { id: 'edit_docs', name: 'Chỉnh sửa tài liệu', admin: true, manager: true, editor: true, viewer: false },
        { id: 'delete_docs', name: 'Xóa tài liệu', admin: true, manager: true, editor: false, viewer: false },
        { id: 'manage_folders', name: 'Quản lý cấu trúc thư mục', admin: true, manager: true, editor: false, viewer: false },
      ],
    },
    {
      name: 'Hệ thống & Phân quyền',
      permissions: [
        { id: 'manage_users', name: 'Quản lý người dùng', admin: true, manager: false, editor: false, viewer: false },
        { id: 'manage_roles', name: 'Phân quyền (Role-based)', admin: true, manager: false, editor: false, viewer: false },
        { id: 'system_settings', name: 'Cài đặt hệ thống', admin: true, manager: false, editor: false, viewer: false },
      ],
    },
  ]);

  const [dataPermissions, setDataPermissions] = useState([
    { id: 'dept-hr', name: 'Dữ liệu phòng Nhân sự', type: 'department' as const, access: { admin: 'full', manager: 'full', editor: 'write', viewer: 'read' } },
    { id: 'dept-tech', name: 'Dữ liệu phòng Kỹ thuật', type: 'department' as const, access: { admin: 'full', manager: 'full', editor: 'write', viewer: 'read' } },
    { id: 'folder-board', name: 'Tài liệu Ban Giám Đốc', type: 'folder' as const, access: { admin: 'full', manager: 'none', editor: 'none', viewer: 'none' } },
  ]);

  const handleTogglePermission = (moduleIndex: number, permIndex: number, roleId: string) => {
    if (!isEditingMatrix) return;
    const newModules = [...modules];
    const perm = newModules[moduleIndex].permissions[permIndex];
    (perm as any)[roleId] = !(perm as any)[roleId];
    setModules(newModules);
  };

  const handleDataPermissionChange = (dataIndex: number, roleId: string, value: string) => {
    if (!isEditingMatrix) return;
    const newData = [...dataPermissions];
    (newData[dataIndex].access as any)[roleId] = value;
    setDataPermissions(newData);
  };

  const openRoleModal = (role: any = null) => { setEditingRole(role); setIsRoleModalOpen(true); };

  const editToggleBtn = (activeTab === 'matrix' || activeTab === 'data') ? (
    <Button
      variant={isEditingMatrix ? 'primary' : 'border'}
      size="s"
      onClick={() => setIsEditingMatrix(!isEditingMatrix)}
      className={isEditingMatrix ? 'bg-[var(--ds-bg-success)] hover:bg-[var(--ds-bg-success-hover)] border-[var(--ds-bg-success)]' : ''}
    >
      {isEditingMatrix ? <><Save size={16} /> Lưu thay đổi</> : <><Edit2 size={16} /> Chỉnh sửa quyền</>}
    </Button>
  ) : null;

  const tabItems = [
    {
      value: 'roles',
      label: <div className="flex items-center gap-2 px-1"><Users size={18} /> Vai trò & Vai nhiệm</div>,
      content: <div className="mt-8 animate-slide-up bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-[var(--ds-border-subtle)] shadow-xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-12 -mt-4 -mr-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
            <Users size={160} />
          </div>
          <PermissionRolesGrid roles={roles} onEditRole={openRoleModal} />
        </div>,
    },
    {
      value: 'matrix',
      label: <div className="flex items-center gap-2 px-1"><Settings size={18} /> Quyền tính năng</div>,
      content: <div className="mt-8 animate-slide-up bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-[var(--ds-border-subtle)] shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2"><Settings size={20} className="text-orange-500"/> Quản lý quyền theo Module</h3>
            {editToggleBtn}
          </div>
          <PermissionMatrixTable roles={roles} modules={modules} isEditingMatrix={isEditingMatrix} onToggle={handleTogglePermission} />
        </div>,
    },
    {
      value: 'data',
      label: <div className="flex items-center gap-2 px-1"><Database size={18} /> Quyền dữ liệu (Spaces)</div>,
      content: <div className="mt-8 animate-slide-up">
          <PermissionFolderTreeManager />
        </div>,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 animate-slide-up">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--ds-text-primary)] flex items-center gap-3 mb-2">
            <div className="p-2 bg-[var(--ds-bg-info)] rounded-xl text-white shadow-md">
              <Shield size={24} />
            </div>
            Phân quyền hệ thống
          </h1>
          <p className="text-[var(--ds-text-secondary)]">Quản lý vai trò (Roles), quyền tính năng và quyền dữ liệu linh hoạt.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="border" size="s" onClick={() => setIsUserModalOpen(true)}>
            <UserPlus size={18} /> Thêm người dùng
          </Button>
          <Button variant="primary" size="s" onClick={() => openRoleModal()}>
            <Plus size={18} /> Tạo vai trò mới
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <div /> {/* spacer — Tabs renders its own list */}
        {editToggleBtn}
      </div>

      <Tabs items={tabItems} value={activeTab} onValueChange={setActiveTab} />

      {/* Role Modal */}
      <Modal
        open={isRoleModalOpen}
        onOpenChange={setIsRoleModalOpen}
        title={editingRole ? 'Chỉnh sửa vai trò' : 'Tạo vai trò mới'}
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="subtle" size="s" onClick={() => setIsRoleModalOpen(false)}>Hủy</Button>
            <Button variant="primary" size="s" onClick={() => setIsRoleModalOpen(false)}>Lưu vai trò</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-[var(--ds-text-primary)] mb-1">Tên vai trò</label>
            <Input type="text" defaultValue={editingRole?.name} placeholder="VD: Content Creator" className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-bold text-[var(--ds-text-primary)] mb-1">Mô tả</label>
            <Textarea defaultValue={editingRole?.description} placeholder="Mô tả quyền hạn của vai trò này..." className="w-full h-24" />
          </div>
        </div>
      </Modal>

      {/* Add User Modal */}
      <Modal
        open={isUserModalOpen}
        onOpenChange={setIsUserModalOpen}
        title="Thêm người dùng"
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="subtle" size="s" onClick={() => setIsUserModalOpen(false)}>Hủy</Button>
            <Button variant="primary" size="s" onClick={() => setIsUserModalOpen(false)}>Thêm người dùng</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-[var(--ds-text-primary)] mb-1">Email người dùng</label>
            <Input type="email" placeholder="VD: nguyen.van.a@ikame.com" className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-bold text-[var(--ds-text-primary)] mb-1">Gán vai trò</label>
            <Select options={ROLE_OPTIONS} placeholder="Chọn vai trò..." className="w-full" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
