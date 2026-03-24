import React, { useState } from 'react';
import { Shield, Users, Check, X, Search, Plus, Edit2, Trash2, Settings, Database, Folder, UserPlus, Save } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { can } from '../lib/permissions';

export default function PermissionManagement() {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('roles');
  if (!can(state.currentUser, 'admin.access')) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Bạn không có quyền truy cập cấu hình phân quyền.
      </div>
    );
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
      ]
    },
    {
      name: 'Hệ thống & Phân quyền',
      permissions: [
        { id: 'manage_users', name: 'Quản lý người dùng', admin: true, manager: false, editor: false, viewer: false },
        { id: 'manage_roles', name: 'Phân quyền (Role-based)', admin: true, manager: false, editor: false, viewer: false },
        { id: 'system_settings', name: 'Cài đặt hệ thống', admin: true, manager: false, editor: false, viewer: false },
      ]
    }
  ]);

  const [dataPermissions, setDataPermissions] = useState([
    { id: 'dept-hr', name: 'Dữ liệu phòng Nhân sự', type: 'department', access: { admin: 'full', manager: 'full', editor: 'write', viewer: 'read' } },
    { id: 'dept-tech', name: 'Dữ liệu phòng Kỹ thuật', type: 'department', access: { admin: 'full', manager: 'full', editor: 'write', viewer: 'read' } },
    { id: 'folder-board', name: 'Tài liệu Ban Giám Đốc', type: 'folder', access: { admin: 'full', manager: 'none', editor: 'none', viewer: 'none' } }
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

  const openRoleModal = (role: any = null) => {
    setEditingRole(role);
    setIsRoleModalOpen(true);
  };

  const roleColors: Record<string, { icon: string; bg: string }> = {
    admin: { icon: 'text-indigo-600', bg: 'from-indigo-50 to-purple-50' },
    manager: { icon: 'text-blue-600', bg: 'from-blue-50 to-cyan-50' },
    editor: { icon: 'text-green-600', bg: 'from-green-50 to-emerald-50' },
    viewer: { icon: 'text-gray-600', bg: 'from-gray-50 to-slate-50' },
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 animate-slide-up">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl text-white shadow-md shadow-indigo-500/20">
              <Shield size={24} />
            </div>
            Phân quyền hệ thống
          </h1>
          <p className="text-gray-500">Quản lý vai trò (Roles), quyền tính năng và quyền dữ liệu linh hoạt.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsUserModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow active:scale-95"
          >
            <UserPlus size={18} />
            Thêm người dùng
          </button>
          <button
            onClick={() => openRoleModal()}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-200 shadow-md active:scale-95"
          >
            <Plus size={18} />
            Tạo vai trò mới
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-px animate-slide-up stagger-1">
        <div className="flex items-center gap-1">
          {[
            { id: 'roles', label: 'Danh sách vai trò', icon: Users },
            { id: 'matrix', label: 'Phân quyền tính năng', icon: Settings },
            { id: 'data', label: 'Phân quyền dữ liệu', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200 flex items-center gap-2 ${activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <Icon size={18} /> {tab.label}
              </button>
            );
          })}
        </div>

        {(activeTab === 'matrix' || activeTab === 'data') && (
          <button
            onClick={() => setIsEditingMatrix(!isEditingMatrix)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-all duration-200 active:scale-95 ${isEditingMatrix
                ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white hover:shadow-md hover:shadow-green-500/20'
                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
              }`}
          >
            {isEditingMatrix ? <><Save size={16} /> Lưu thay đổi</> : <><Edit2 size={16} /> Chỉnh sửa quyền</>}
          </button>
        )}
      </div>

      {activeTab === 'roles' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up stagger-2">
          {roles.map((role) => {
            const colors = roleColors[role.id] || roleColors.viewer;
            return (
              <div key={role.id} className="card-premium p-6 relative group">
                <div className="absolute top-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => openRoleModal(role)}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 active:scale-90"
                  >
                    <Edit2 size={16} />
                  </button>
                  {role.id !== 'admin' && (
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 active:scale-90">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 bg-gradient-to-br ${colors.bg} ${colors.icon} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <Shield size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{role.name}</h3>
                    <div className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                      <Users size={14} /> {role.users} người dùng
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {role.description}
                </p>
              </div>
            );
          })}
        </div>
      ) : activeTab === 'matrix' ? (
        <div className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm animate-slide-up stagger-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200">
                  <th className="p-4 font-bold text-gray-900 w-1/3">Quyền hạn / Module</th>
                  {roles.map(role => (
                    <th key={role.id} className="p-4 font-bold text-gray-900 text-center w-1/6">{role.name.split(' ')[0]}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {modules.map((module, mIdx) => (
                  <React.Fragment key={mIdx}>
                    <tr className="bg-gray-50/50">
                      <td colSpan={roles.length + 1} className="p-4 font-bold text-gray-700 text-sm uppercase tracking-wider">
                        {module.name}
                      </td>
                    </tr>
                    {module.permissions.map((perm, pIdx) => (
                      <tr key={perm.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="p-4 text-sm text-gray-700 font-medium pl-8">{perm.name}</td>
                        {roles.map(role => (
                          <td key={role.id} className="p-4 text-center">
                            <button
                              disabled={!isEditingMatrix || role.id === 'admin'}
                              onClick={() => handleTogglePermission(mIdx, pIdx, role.id)}
                              className={`p-1.5 rounded-lg transition-all duration-200 ${(perm as any)[role.id]
                                  ? 'text-green-500 bg-green-50 hover:bg-green-100'
                                  : 'text-gray-300 hover:bg-gray-100'
                                } ${(!isEditingMatrix || role.id === 'admin') ? 'cursor-default opacity-70' : 'cursor-pointer active:scale-90'}`}
                            >
                              {(perm as any)[role.id] ? <Check size={20} className="mx-auto" /> : <X size={20} className="mx-auto" />}
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm animate-slide-up stagger-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200">
                  <th className="p-4 font-bold text-gray-900 w-1/3">Nguồn dữ liệu</th>
                  {roles.map(role => (
                    <th key={role.id} className="p-4 font-bold text-gray-900 text-center w-1/6">{role.name.split(' ')[0]}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dataPermissions.map((data, dIdx) => (
                  <tr key={data.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {data.type === 'department' ? <Users size={18} className="text-blue-500" /> : <Folder size={18} className="text-orange-500" />}
                        <span className="text-sm font-medium text-gray-900">{data.name}</span>
                      </div>
                    </td>
                    {roles.map(role => (
                      <td key={role.id} className="p-4 text-center">
                        <select
                          disabled={!isEditingMatrix || role.id === 'admin'}
                          value={(data.access as any)[role.id]}
                          onChange={(e) => handleDataPermissionChange(dIdx, role.id, e.target.value)}
                          className={`text-sm border-transparent hover:border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-transparent hover:bg-white px-2 py-1 border outline-none transition-all duration-200 ${(!isEditingMatrix || role.id === 'admin') ? 'cursor-default opacity-70 appearance-none' : 'cursor-pointer'
                            }`}
                        >
                          <option value="full">Toàn quyền</option>
                          <option value="write">Chỉnh sửa</option>
                          <option value="read">Chỉ xem</option>
                          <option value="none">Không có quyền</option>
                        </select>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Role Modal */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-modal-backdrop">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-modal-enter">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">{editingRole ? 'Chỉnh sửa vai trò' : 'Tạo vai trò mới'}</h3>
              <button onClick={() => setIsRoleModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-all duration-200 active:scale-90">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Tên vai trò</label>
                <input type="text" defaultValue={editingRole?.name} placeholder="VD: Content Creator" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 hover:border-gray-400" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Mô tả</label>
                <textarea defaultValue={editingRole?.description} placeholder="Mô tả quyền hạn của vai trò này..." className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none h-24 resize-none transition-all duration-200 hover:border-gray-400"></textarea>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50/80 flex justify-end gap-3">
              <button onClick={() => setIsRoleModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-xl transition-all duration-200 active:scale-95">Hủy</button>
              <button onClick={() => setIsRoleModalOpen(false)} className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-md hover:shadow-indigo-500/20 rounded-xl transition-all duration-200 shadow-sm active:scale-95">Lưu vai trò</button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-modal-backdrop">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-modal-enter">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Thêm người dùng</h3>
              <button onClick={() => setIsUserModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-all duration-200 active:scale-90">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email người dùng</label>
                <input type="email" placeholder="VD: nguyen.van.a@ikame.com" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 hover:border-gray-400" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Gán vai trò</label>
                <select className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white transition-all duration-200 hover:border-gray-400">
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50/80 flex justify-end gap-3">
              <button onClick={() => setIsUserModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-xl transition-all duration-200 active:scale-95">Hủy</button>
              <button onClick={() => setIsUserModalOpen(false)} className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-md hover:shadow-indigo-500/20 rounded-xl transition-all duration-200 shadow-sm active:scale-95">Thêm người dùng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
