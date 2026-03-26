import React, { useState } from 'react';
import { Shield, Users, Database, Layout, Lock, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Tabs } from '@frontend-team/ui-kit';
import { SpaceMemberManager } from './permissions/SpaceMemberManager';
import { FolderVisibilityManager } from './permissions/FolderVisibilityManager';
import { RolePermissionMatrix } from './permissions/RolePermissionMatrix';

export default function PermissionManagement() {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('spaces');

  if (state.currentUser.role !== 'admin' && state.currentUser.role !== 'super_admin') {
    return (
      <div className="h-full flex items-center justify-center p-20 animate-fade-in">
        <div className="text-center max-w-md bg-white border border-gray-200/50 p-10 rounded-3xl shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500" />
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-sm border border-red-100">
            <Lock size={32} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Truy cập bị từ chối</h2>
          <p className="text-sm font-medium text-gray-400">Bạn không có quyền quản trị hệ thống. Vui lòng liên hệ Admin để được cấp quyền.</p>
        </div>
      </div>
    );
  }

  const tabItems = [
    {
      value: 'spaces',
      label: <div className="flex items-center gap-2 px-1"><Users size={18} /> Quản lý Space Member</div>,
      content: <div className="mt-8">
          <SpaceMemberManager />
        </div>,
    },
    {
      value: 'visibility',
      label: <div className="flex items-center gap-2 px-1"><Layout size={18} /> Folder Visibility (Teams)</div>,
      content: <div className="mt-8">
          <FolderVisibilityManager />
        </div>,
    },
    {
      value: 'roles',
      label: <div className="flex items-center gap-2 px-1"><Settings size={18} /> Atomic Permissions</div>,
      content: <div className="mt-8">
          <RolePermissionMatrix />
        </div>,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-8 py-12 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-slide-up">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-3 bg-gradient-to-br from-[var(--ds-bg-info)] to-blue-600 rounded-2xl text-white shadow-xl rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
               <Shield size={28} strokeWidth={2.5} />
             </div>
             <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100/50">Admin Panel v2.0</div>
          </div>
          <h1 className="text-4xl font-extrabold text-[var(--ds-text-primary)] mb-3 leading-tight tracking-tight">
            Cấu hình Phân quyền Hierarchical
          </h1>
          <p className="text-[var(--ds-text-secondary)] text-md font-medium max-w-xl leading-relaxed">
            Thiết kế theo triết lý <strong>Open-by-Default</strong> của Confluence. Quản lý phân cấp 3 lớp: Space Membership, Atomic Role và Restrictive Folder Visibility.
          </p>
        </div>
        <div className="flex gap-4 p-4 bg-white/50 border border-white/20 rounded-3xl backdrop-blur-md shadow-sm">
           <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-widest">Global Admin</span>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-2xl border border-gray-700 shadow-xl">
                 <img src={state.currentUser.avatar} className="w-6 h-6 rounded-lg border border-gray-700" alt="" />
                 <span className="text-xs font-bold text-white">{state.currentUser.name}</span>
              </div>
           </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute top-0 left-[200px] w-[calc(100%-200px)] h-[1px] bg-gray-100 z-0 mt-6" />
        <Tabs items={tabItems} value={activeTab} onValueChange={setActiveTab} />
      </div>

      {/* Footer Info */}
      <div className="mt-20 border-t border-gray-100 pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-gray-400">
         <div className="flex items-center gap-6">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-green-500" />
             <span className="text-xs font-bold uppercase tracking-wider">Hệ thống Đã kích hoạt</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-blue-500" />
             <span className="text-xs font-bold uppercase tracking-wider">Audit Log On</span>
           </div>
         </div>
         <p className="text-[10px] font-medium max-w-sm text-center md:text-right">
           Thay đổi cấu hình quyền hạn sẽ có hiệu lực ngay lập tức cho toàn bộ người dùng đang online. Vui lòng cân nhắc kỹ trước khi chỉnh sửa Folder Visibility cho các phòng ban core.
         </p>
      </div>
    </div>
  );
}
