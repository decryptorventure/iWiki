import React from 'react';
import { useApp } from '../context/AppContext';
import { PRESET_USERS } from '../store/useAppStore';
import { Flame, UserPlus, UserCheck, Shield } from 'lucide-react';

const ROLES: { key: 'viewer' | 'editor' | 'admin'; label: string; description: string; icon: React.ElementType }[] = [
  {
    key: 'viewer',
    label: 'Nhân viên mới',
    description: 'Chỉ xem tài liệu, tìm kiếm và đọc bài viết công khai.',
    icon: UserPlus,
  },
  {
    key: 'editor',
    label: 'Nhân viên chính thức',
    description: 'Đọc, viết bài, gửi duyệt và tham gia đóng góp nội dung.',
    icon: UserCheck,
  },
  {
    key: 'admin',
    label: 'Admin',
    description: 'Toàn quyền: quản lý tài liệu, phê duyệt bài viết và cấu hình hệ thống.',
    icon: Shield,
  },
];

export default function Login() {
  const { dispatch } = useApp();

  const handleLogin = (role: 'viewer' | 'editor' | 'admin') => {
    dispatch({ type: 'LOGIN', role });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#fef7f4] via-[#fefbf9] to-orange-50/30 p-6">
      <div className="w-full max-w-2xl text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF6B4A] to-[#FF8A6A] text-white shadow-lg shadow-[#FF6B4A]/25 mb-6">
          <Flame size={32} strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">iWiki · iKame</h1>
        <p className="text-gray-500 text-sm">Chọn vai trò để đăng nhập vào hệ thống</p>
      </div>

      <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-4">
        {ROLES.map(({ key, label, description, icon: Icon }) => {
          const user = PRESET_USERS[key];
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleLogin(key)}
              className="group flex flex-col items-center text-left p-6 rounded-2xl border-2 border-gray-200/80 bg-white hover:border-[#FF6B4A]/40 hover:shadow-xl hover:shadow-[#FF6B4A]/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/50 focus:ring-offset-2"
            >
              <div className="w-14 h-14 rounded-xl bg-gray-100 group-hover:bg-orange-50 flex items-center justify-center mb-4 transition-colors">
                <img
                  src={user.avatar}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover ring-2 ring-white shadow-sm"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Icon size={18} className="text-[#FF6B4A] shrink-0" />
                <span className="font-bold text-gray-900">{label}</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
              <span className="mt-4 text-xs font-medium text-[#FF6B4A] opacity-0 group-hover:opacity-100 transition-opacity">
                Đăng nhập →
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-10 text-xs text-gray-400">Demo: không cần mật khẩu. Chọn vai trò để trải nghiệm quyền tương ứng.</p>
    </div>
  );
}
