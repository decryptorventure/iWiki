import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Check, X, Shield, Lock, Save, Edit2, AlertCircle, Info } from 'lucide-react';
import { Button, Badge, Modal } from '@frontend-team/ui-kit';
import { AtomicPermission, UserRole, SpaceRole } from '../../types/user';

interface PermissionDefinition {
  id: AtomicPermission;
  name: string;
  description: string;
  category: 'Article' | 'Space' | 'AI' | 'Global';
}

const ALL_PERMISSIONS: PermissionDefinition[] = [
  { id: 'article.read', name: 'Xem bài viết', description: 'Có thể đọc nội dung bài viết đã xuất bản.', category: 'Article' },
  { id: 'article.create', name: 'Tạo bài viết mới', description: 'Có thể tạo draft và gửi bài chờ duyệt.', category: 'Article' },
  { id: 'article.edit', name: 'Chỉnh sửa bài viết', description: 'Có thể sửa bài viết của mình hoặc người khác.', category: 'Article' },
  { id: 'article.approve', name: 'Duyệt bài (+Xóa bài)', description: 'Có thể duyệt bài hoặc xóa bài viết.', category: 'Article' },
  { id: 'article.delete', name: 'Xóa bài viết', description: 'Có thể xóa bài viết trong Space.', category: 'Article' },
  { id: 'space.manage_members', name: 'Quản lý thành viên', description: 'Có thể thêm/xóa người trong Space.', category: 'Space' },
  { id: 'space.manage_settings', name: 'Cài đặt Space', description: 'Có thể sửa tên, logo, folder gốc của Space.', category: 'Space' },
  { id: 'ai.write', name: 'AI Write', description: 'Sử dụng AI để viết bài/tóm tắt.', category: 'AI' },
  { id: 'ai.chat', name: 'AI Chat', description: 'Sử dụng AI Assistant để tìm kiếm.', category: 'AI' },
];

export function RolePermissionMatrix() {
  const { state, dispatch } = useApp();
  const { roles } = state;
  const [isEditing, setIsEditing] = useState(false);
  
  // Local state for editing matrix before saving
  const [localRoles, setLocalRoles] = useState(roles);

  const handleToggle = (roleId: string, permId: AtomicPermission) => {
    if (!isEditing) return;
    if (roleId === 'super_admin' || roleId === 'admin') return; // Fixed roles

    const nextRoles = localRoles.map(r => {
      if (r.id !== roleId) return r;
      const current = r.permissions || [];
      const updated = current.includes(permId)
        ? current.filter(p => p !== permId)
        : [...current, permId];
      return { ...r, permissions: updated };
    });
    setLocalRoles(nextRoles);
  };

  const handleSave = () => {
    localRoles.forEach(role => {
       dispatch({ type: 'UPDATE_ROLE_PERMISSIONS', roleId: role.id, permissions: role.permissions });
    });
    setIsEditing(false);
  };

  const categories = Array.from(new Set(ALL_PERMISSIONS.map(p => p.category)));

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xl font-black text-gray-900 mb-1">Ma trận quyền Atomic</h2>
          <p className="text-xs text-gray-500 font-medium tracking-tight">Cấu hình chi tiết các hành động được phép cho từng Role</p>
        </div>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <Button variant="subtle" size="s" onClick={() => { setIsEditing(false); setLocalRoles(roles); }}>Hủy bỏ</Button>
              <Button variant="primary" size="s" className="bg-green-600 hover:bg-green-700" onClick={handleSave}>
                <Save size={16} /> Lưu cấu hình mới
              </Button>
            </>
          ) : (
            <Button variant="border" size="s" onClick={() => setIsEditing(true)}>
              <Edit2 size={16} /> Chỉnh sửa ma trận
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-gray-200/80 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-100/50 border-b border-gray-200">
                <th className="p-6 font-black text-gray-900 w-1/4 sticky left-0 bg-gray-100/50 z-20 shadow-[2px_0_10px_rgba(0,0,0,0.05)]">
                   Hành động / Quyền hạn
                </th>
                {localRoles.map(role => (
                   <th key={role.id} className="p-6 font-black text-gray-900 text-center w-1/5">
                      <div className="flex flex-col items-center">
                        <span className="uppercase tracking-widest text-[10px] text-[var(--ds-fg-accent-primary)] mb-1">{role.id.replace('_', ' ')}</span>
                        <span className="text-sm">{role.name.split(' ')[0]}</span>
                      </div>
                   </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
               {categories.map(cat => (
                 <React.Fragment key={cat}>
                    <tr className="bg-gray-50/70">
                      <td colSpan={localRoles.length + 1} className="p-4 px-6 font-black text-gray-700 text-[10px] uppercase tracking-[0.2em]">
                        {cat} Management
                      </td>
                    </tr>
                    {ALL_PERMISSIONS.filter(p => p.category === cat).map(perm => (
                      <tr key={perm.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="p-5 px-6 sticky left-0 bg-white group-hover:bg-gray-50 z-10 shadow-[2px_0_10px_rgba(0,0,0,0.02)]">
                           <div className="flex flex-col">
                             <span className="text-sm font-bold text-gray-900 mb-0.5">{perm.name}</span>
                             <span className="text-[10px] text-gray-500 font-medium leading-tight">{perm.description}</span>
                           </div>
                        </td>
                        {localRoles.map(role => {
                           const isChecked = role.permissions.includes(perm.id);
                           const isStatic = role.id === 'super_admin' || role.id === 'admin';
                           
                           return (
                             <td key={role.id} className="p-4 text-center">
                               <button
                                 disabled={!isEditing || isStatic}
                                 onClick={() => handleToggle(role.id, perm.id)}
                                 className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto transition-all duration-300 relative group/cell ${
                                   isChecked 
                                     ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-sm' 
                                     : 'bg-white text-gray-200 border border-gray-100 hover:border-gray-200'
                                 } ${(!isEditing || isStatic) && isChecked ? 'opacity-100' : (!isEditing || isStatic) ? 'opacity-30' : 'cursor-pointer hover:scale-105 active:scale-90 hover:shadow-md'}`}
                               >
                                 {isChecked ? <Check size={22} strokeWidth={3} /> : <X size={22} strokeWidth={2} />}
                                 {isStatic && isChecked && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-900 rounded-full flex items-center justify-center ring-2 ring-white">
                                       <Lock size={8} className="text-white" />
                                    </div>
                                 )}
                               </button>
                             </td>
                           );
                        })}
                      </tr>
                    ))}
                 </React.Fragment>
               ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-6 flex gap-4 shadow-sm animate-slide-up stagger-4">
         <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0 border border-blue-200 shadow-sm">
            <Info className="text-blue-500" size={24} />
         </div>
         <div className="flex-1">
           <h4 className="font-extrabold text-sm text-blue-900 mb-1 uppercase tracking-tight">Ghi chú về Logic Phân quyền</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
             <p className="text-xs text-blue-700/80 leading-relaxed">• <strong>Super Admin & Admin</strong> là các System Role, luôn có toàn quyền (Bypass check).</p>
             <p className="text-xs text-blue-700/80 leading-relaxed">• <strong>KM & Member</strong> là các Space Role. Phải được gán trong Space Member table.</p>
             <p className="text-xs text-blue-700/80 leading-relaxed">• Quyền thực tế là phép <strong>AND</strong> giữa Atomic Role và Folder Visibility.</p>
             <p className="text-xs text-blue-700/80 leading-relaxed">• Quyền Author (sửa bài mình viết) được tự động gán mở rộng mặc định.</p>
           </div>
         </div>
      </div>
    </div>
  );
}
