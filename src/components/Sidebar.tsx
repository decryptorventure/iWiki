import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Home, FileText, Target, AlertTriangle, User, FolderTree,
  Shield, ChevronDown, Plus, Sparkles, Bell, BarChart3, Settings,
  Search, ChevronLeft, ChevronRight, Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const NavItem = ({ icon: Icon, label, isActive, onClick, badge }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${isActive
        ? 'bg-orange-50 text-orange-600 font-medium'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
  >
    <div className="flex items-center gap-2.5">
      <Icon size={16} className={isActive ? 'text-orange-500' : 'text-gray-400'} />
      <span>{label}</span>
    </div>
    {badge && (
      <span className="bg-orange-500 text-white text-[10px] font-semibold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
        {badge}
      </span>
    )}
  </button>
);

export default function Sidebar() {
  const { state, dispatch } = useApp();
  const { currentScreen, currentUser, notifications, folders } = state;
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['f-company', 'f-knowhow']);
  const [collapsed, setCollapsed] = useState(false);

  const navigate = (screen: string) => dispatch({ type: 'SET_SCREEN', screen });
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const toggleFolder = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setExpandedFolders(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  if (collapsed) {
    return (
      <aside className="w-12 bg-white border-r border-gray-200 flex flex-col items-center py-4 gap-3 shrink-0">
        <button onClick={() => setCollapsed(false)} className="p-2 hover:bg-gray-100 rounded-md text-gray-400">
          <ChevronRight size={16} />
        </button>
        <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center shrink-0">
          <Flame size={12} fill="white" className="text-white" />
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col h-full overflow-hidden shrink-0">
      {/* Brand */}
      <div className="px-4 py-4 flex items-center justify-between border-b border-gray-100">
        <button
          onClick={() => navigate('dashboard')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-7 h-7 bg-orange-500 rounded-md flex items-center justify-center shrink-0">
            <Flame size={14} fill="white" className="text-white" />
          </div>
          <span className="font-bold text-gray-900 text-base tracking-tight">iWiki</span>
        </button>
        <button onClick={() => setCollapsed(true)} className="p-1 hover:bg-gray-100 rounded text-gray-400">
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-3 border-b border-gray-100">
        <button
          onClick={() => navigate('search')}
          className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-400 hover:bg-gray-100 transition-colors"
        >
          <Search size={14} />
          <span>Tìm kiếm</span>
        </button>
      </div>

      {/* Main Nav */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        <NavItem icon={User} label="Cá nhân" isActive={currentScreen === 'profile'} onClick={() => navigate('profile')} badge={unreadCount > 0 ? String(unreadCount) : undefined} />

        {/* Folder sections */}
        <div className="pt-3 pb-1">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1">Thư mục bài viết</p>
        </div>

        {folders.map(folder => (
          <div key={folder.id}>
            <button
              onClick={() => navigate(`folder-${folder.id}`)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${currentScreen === `folder-${folder.id}`
                  ? 'bg-orange-50 text-orange-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <FolderTree size={15} className={currentScreen === `folder-${folder.id}` ? 'text-orange-500' : 'text-gray-400 shrink-0'} />
                <span className="truncate">{folder.name}</span>
              </div>
              {folder.children && folder.children.length > 0 && (
                <div onClick={(e) => toggleFolder(e, folder.id)} className="shrink-0 p-0.5">
                  <ChevronDown size={13} className={`text-gray-400 transition-transform ${expandedFolders.includes(folder.id) ? '' : '-rotate-90'}`} />
                </div>
              )}
            </button>

            <AnimatePresence>
              {expandedFolders.includes(folder.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pl-5 mt-0.5 border-l border-gray-100 ml-5 space-y-0.5">
                    {(folder.children || []).map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => navigate(`folder-${sub.id}`)}
                        className={`w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${currentScreen === `folder-${sub.id}`
                            ? 'text-orange-600 bg-orange-50 font-medium'
                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {/* Other Nav */}
        <div className="pt-3 pb-1">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1">Công cụ</p>
        </div>
        <NavItem icon={Sparkles} label="iWiki AI" isActive={currentScreen === 'ai'} onClick={() => navigate('ai')} />
        <NavItem icon={Home} label="Bản tin tổng hợp" isActive={currentScreen === 'dashboard'} onClick={() => navigate('dashboard')} />
        <NavItem icon={FileText} label="Quản lý tài liệu" isActive={currentScreen === 'documents'} onClick={() => navigate('documents')} />
        <NavItem icon={Target} label="Nhiệm vụ săn thưởng" isActive={currentScreen === 'bounties'} onClick={() => navigate('bounties')} />
        <NavItem icon={AlertTriangle} label="Dọn dẹp hệ thống" isActive={currentScreen === 'janitor'} onClick={() => navigate('janitor')} />
        <NavItem icon={Bell} label="Thông báo" isActive={currentScreen === 'notifications'} onClick={() => navigate('notifications')} badge={unreadCount > 0 ? String(unreadCount) : undefined} />

        {currentUser.role === 'admin' && (
          <>
            <div className="pt-3 pb-1">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1">Quản trị</p>
            </div>
            <NavItem icon={BarChart3} label="Phân tích dữ liệu" isActive={currentScreen === 'analytics'} onClick={() => navigate('analytics')} />
            <NavItem icon={Shield} label="Quản lý quyền hạn" isActive={currentScreen === 'permissions'} onClick={() => navigate('permissions')} />
          </>
        )}
      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={() => navigate('profile')}
          className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors text-left"
        >
          <img src={currentUser.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-gray-200" referrerPolicy="no-referrer" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{currentUser.name}</p>
            <p className="text-xs text-gray-400 truncate">{currentUser.title}</p>
          </div>
        </button>
      </div>
    </aside>
  );
}
