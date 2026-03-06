import React, { useState } from 'react';
import { Shield, Users, Check, X, Search, Plus, Edit2, ShieldCheck, ShieldAlert, Lock, Activity, Layout } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../App';
import { motion, AnimatePresence } from 'motion/react';

export default function PermissionManagement() {
  const { state, dispatch } = useApp();
  const { addToast } = useToast();
  const { roles } = state;

  const [activeTab, setActiveTab] = useState('roles');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [isEditingMatrix, setIsEditingMatrix] = useState(false);

  const modules = [
    {
      name: 'Nội dung',
      permissions: [
        { id: 'view_docs', name: 'Xem tài liệu', desc: 'Có quyền đọc các tài liệu công khai' },
        { id: 'create_docs', name: 'Tạo tài liệu', desc: 'Có quyền xuất bản bài viết mới' },
        { id: 'edit_docs', name: 'Sửa tài liệu', desc: 'Có quyền chỉnh sửa nội dung hiện có' },
        { id: 'delete_docs', name: 'Xoá tài liệu', desc: 'Có quyền xoá bài viết vĩnh viễn' },
        { id: 'manage_folders', name: 'Quản lý thư mục', desc: 'Quản lý cấu trúc thư mục' },
      ]
    },
    {
      name: 'Hệ thống',
      permissions: [
        { id: 'manage_users', name: 'Quản lý người dùng', desc: 'Mời và chỉnh sửa tài khoản' },
        { id: 'manage_roles', name: 'Quản lý vai trò', desc: 'Cấu hình quyền cho các vai trò' },
        { id: 'system_settings', name: 'Cài đặt hệ thống', desc: 'Quản lý các thông số toàn cục' },
      ]
    }
  ];

  const handleTogglePermission = (roleId: string, permId: string) => {
    if (!isEditingMatrix) return;
    const role = roles.find(r => r.id === roleId);
    if (!role) return;
    const newPerms = { ...role.permissions, [permId]: !role.permissions[permId] };
    dispatch({ type: 'UPDATE_ROLE_PERMISSIONS', roleId, permissions: newPerms });
  };

  const roleMeta: Record<string, { color: string; bg: string; icon: any }> = {
    admin: { color: 'text-blue-600', bg: 'bg-blue-50', icon: ShieldCheck },
    manager: { color: 'text-orange-600', bg: 'bg-orange-50', icon: ShieldAlert },
    editor: { color: 'text-emerald-600', bg: 'bg-emerald-50', icon: Shield },
    viewer: { color: 'text-gray-400', bg: 'bg-gray-50', icon: Lock },
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Quản lý Phân Quyền 🛡️</h1>
          <p className="text-sm text-gray-500">Cấu hình vai trò và quyền truy cập vào hệ thống tri thức.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setEditingRole(null); setIsRoleModalOpen(true); }}
            className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-semibold hover:bg-orange-500 transition-colors flex items-center gap-2"
          >
            <Plus size={16} /> Thêm vai trò
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mb-8 border-b border-gray-100 pb-px">
        {[
          { id: 'roles', label: 'Vai trò', icon: Shield },
          { id: 'matrix', label: 'Ma trận quyền', icon: Activity },
          { id: 'logs', label: 'Nhật ký bảo mật', icon: Layout },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm font-semibold relative transition-colors ${activeTab === tab.id ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
              }`}
          >
            <span className="flex items-center gap-2"><tab.icon size={16} /> {tab.label}</span>
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500" />}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'roles' ? (
          <motion.div key="roles" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roles.map(role => {
              const meta = roleMeta[role.id] || roleMeta.viewer;
              const Icon = meta.icon;
              return (
                <div key={role.id} className="group bg-white border border-gray-100 p-6 rounded-lg hover:border-orange-200 hover:bg-orange-50/10 transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 ${meta.bg} ${meta.color} rounded-lg`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-900">{role.name}</h3>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mt-0.5 flex items-center gap-1.5">
                          <Users size={12} /> {role.userCount} thành viên
                        </p>
                      </div>
                    </div>
                    <button onClick={() => { setEditingRole(role); setIsRoleModalOpen(true); }} className="p-2 text-gray-300 hover:text-orange-500 rounded-md transition-opacity opacity-0 group-hover:opacity-100">
                      <Edit2 size={16} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed mb-6">{role.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(role.permissions).filter(([_, v]) => v).slice(0, 3).map(([k]) => (
                      <span key={k} className="px-2 py-0.5 bg-gray-50 text-gray-400 text-[10px] font-bold uppercase rounded border border-gray-100">
                        {k.replace('_', ' ')}
                      </span>
                    ))}
                    {Object.values(role.permissions).filter(v => v).length > 3 && (
                      <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-bold uppercase rounded">
                        +{Object.values(role.permissions).filter(v => v).length - 3} quyền khác
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        ) : activeTab === 'matrix' ? (
          <motion.div key="matrix" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-gray-100 rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <p className="text-xs text-gray-500 font-medium">Bấm vào biểu tượng để thay đổi quyền (sau khi mở khoá)</p>
              <button
                onClick={() => isEditingMatrix ? (setIsEditingMatrix(false), addToast('Đã lưu thay đổi', 'success')) : setIsEditingMatrix(true)}
                className={`px-4 py-2 rounded text-xs font-bold transition-colors ${isEditingMatrix ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {isEditingMatrix ? 'Lưu thay đổi' : 'Mở khoá cấu hình'}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white">
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Quyền hạn</th>
                    {roles.map(role => (
                      <th key={role.id} className="px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">{role.name.split(' ')[0]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {modules.map((module, mIdx) => (
                    <React.Fragment key={mIdx}>
                      <tr className="bg-orange-50/30">
                        <td colSpan={roles.length + 1} className="px-6 py-2 text-[10px] font-bold text-orange-600 uppercase tracking-widest">{module.name}</td>
                      </tr>
                      {module.permissions.map((perm) => (
                        <tr key={perm.id} className="hover:bg-gray-50/50">
                          <td className="px-6 py-4">
                            <p className="text-sm font-bold text-gray-800">{perm.name}</p>
                            <p className="text-[11px] text-gray-400">{perm.desc}</p>
                          </td>
                          {roles.map(role => (
                            <td key={role.id} className="px-4 py-4 text-center">
                              <button
                                disabled={!isEditingMatrix || role.id === 'admin'}
                                onClick={() => handleTogglePermission(role.id, perm.id)}
                                className={`p-2 rounded transition-all ${role.permissions[perm.id] ? 'text-green-500 bg-green-50' : 'text-gray-200 bg-gray-50'}`}
                              >
                                {role.permissions[perm.id] ? <Check size={18} /> : <Lock size={18} />}
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
          </motion.div>
        ) : (
          <div className="text-center py-24 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <Layout size={40} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-bold">Lịch sử bảo mật</p>
            <p className="text-xs text-gray-400 mt-1">Các hoạt động đăng nhập và thay đổi quyền sẽ hiển thị ở đây.</p>
          </div>
        )}
      </AnimatePresence>

      {/* Role Modal */}
      <AnimatePresence>
        {isRoleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsRoleModalOpen(false)} className="absolute inset-0 bg-black/40" />
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="relative bg-white rounded-lg w-full max-w-sm shadow-xl p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">{editingRole ? 'Chỉnh sửa vai trò' : 'Thêm vai trò mới'}</h3>
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Tên vai trò</label>
                  <input defaultValue={editingRole?.name} placeholder="VD: Lead Researcher" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:border-orange-400" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Mô tả</label>
                  <textarea defaultValue={editingRole?.description} placeholder="Mô tả phạm vi quyền hạn..." className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:border-orange-400 h-24 resize-none" />
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setIsRoleModalOpen(false)} className="flex-1 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded">Huỷ</button>
                <button onClick={() => { setIsRoleModalOpen(false); addToast('Đã lưu vai trò', 'success'); }} className="flex-1 py-2 bg-gray-900 text-white text-sm font-semibold rounded hover:bg-orange-500">Lưu</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
