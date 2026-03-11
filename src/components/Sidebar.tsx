import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Home, FileText, Target, AlertTriangle, User, Flame, FolderTree, Shield,
  ShieldCheck, ChevronDown, Plus, Edit, ChevronsUpDown, File, Sparkles, Settings, Bell
} from 'lucide-react';

const SidebarSection = ({ title, children, defaultExpanded = true, onAdd, badge }: { title: string, children: React.ReactNode, defaultExpanded?: boolean, onAdd?: () => void, badge?: string }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  return (
    <div className="mt-5 mb-1">
      <div className="group flex items-center justify-between px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider hover:bg-black/5 cursor-pointer transition-all duration-200 rounded-md" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-1.5">
          <span className="transition-transform duration-200" style={{ transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
            <ChevronDown size={12} className="text-gray-400" />
          </span>
          <span>{title}</span>
          {badge && <span className="ml-1 px-1.5 py-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded text-[9px] font-bold tracking-normal normal-case">{badge}</span>}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onAdd && (
            <button onClick={(e) => { e.stopPropagation(); onAdd(); }} className="p-0.5 hover:bg-black/10 rounded text-gray-400 hover:text-gray-700 transition-colors">
              <Plus size={14} />
            </button>
          )}
        </div>
      </div>
      <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-[1000px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
        <div className="space-y-0.5">{children}</div>
      </div>
    </div>
  );
};

const NavItem = ({ icon: Icon, label, isActive, onClick, indent = false, rightAction, badge }: any) => (
  <button
    onClick={onClick}
    className={`w-full group flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive
      ? 'bg-gradient-to-r from-[#FF6B4A]/10 to-orange-50 text-gray-900 font-semibold shadow-sm border border-[#FF6B4A]/10'
      : 'text-gray-600 hover:bg-black/5 hover:text-gray-900'
      } ${indent ? 'pl-9' : ''}`}
  >
    <div className="flex items-center gap-2.5 truncate">
      <div className={`transition-all duration-200 ${isActive ? 'text-[#FF6B4A]' : 'text-gray-400 group-hover:text-gray-600'}`}>
        <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
      </div>
      <span className="truncate">{label}</span>
    </div>
    <div className="flex items-center gap-1">
      {badge && <span className="text-[10px] font-bold px-1.5 py-0.5 bg-red-500 text-white rounded-full">{badge}</span>}
      {rightAction && <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">{rightAction}</div>}
    </div>
  </button>
);

export default function Sidebar() {
  const { state, dispatch } = useApp();
  const { currentScreen, currentUser, userRole, notifications, folders } = state;
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['f-company', 'f-knowhow']);

  const navigate = (screen: string) => dispatch({ type: 'SET_SCREEN', screen });
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const toggleFolder = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setExpandedFolders(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const recentArticles = state.articles
    .filter(a => a.status === 'published')
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  return (
    <aside className="w-64 bg-[#f8f8f6] border-r border-gray-200/80 flex flex-col h-full overflow-hidden text-[#37352f]">
      {/* Workspace Header */}
      <div className="px-3 pt-3 pb-2">
        <div className="px-2 py-2.5 hover:bg-black/5 cursor-pointer transition-all duration-200 flex items-center justify-between group rounded-lg">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-7 h-7 bg-gradient-to-br from-[#FF6B4A] to-[#FF8A6A] rounded-lg flex items-center justify-center text-white shrink-0 shadow-md shadow-[#FF6B4A]/20">
              <Flame size={14} strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-bold text-sm truncate block text-gray-900">iKame Workspace</span>
            </div>
            <ChevronsUpDown size={14} className="text-gray-400 shrink-0" />
          </div>
          <button className="p-1 hover:bg-black/10 rounded opacity-0 group-hover:opacity-100 transition-opacity text-gray-500">
            <Edit size={13} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-4">
        {/* Top Navigation */}
        <div className="px-2 mt-1 space-y-0.5">
          <NavItem icon={Sparkles} label="iWiki AI" isActive={currentScreen === 'ai'} onClick={() => navigate('ai')} />
          <NavItem icon={Home} label="Trang chủ" isActive={currentScreen === 'dashboard'} onClick={() => navigate('dashboard')} />
          <NavItem icon={FileText} label="Bài viết của tôi" isActive={currentScreen === 'my-articles'} onClick={() => navigate('my-articles')} />
          <NavItem icon={Target} label="Săn thưởng" isActive={currentScreen === 'bounties'} onClick={() => navigate('bounties')} />
          <NavItem icon={AlertTriangle} label="Dọn rác dữ liệu" isActive={currentScreen === 'janitor'} onClick={() => navigate('janitor')} />
          <NavItem icon={User} label="Hồ sơ cá nhân" isActive={currentScreen === 'profile'} onClick={() => navigate('profile')} />
          <NavItem
            icon={Bell}
            label="Thông báo"
            isActive={currentScreen === 'notifications'}
            onClick={() => navigate('notifications')}
            badge={unreadCount > 0 ? String(unreadCount) : undefined}
          />
        </div>

        {/* Folders */}
        <div className="px-2">
          <SidebarSection title="Tài liệu chung" onAdd={() => navigate('documents')}>
            {folders.map(folder => (
              <div key={folder.id}>
                <div
                  className={`w-full group flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 cursor-pointer ${currentScreen === `folder-${folder.id}` ? 'bg-gradient-to-r from-[#FF6B4A]/10 to-orange-50 text-gray-900 font-semibold shadow-sm border border-[#FF6B4A]/10' : 'text-gray-600 hover:bg-black/5'}`}
                  onClick={() => navigate(`folder-${folder.id}`)}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <button onClick={(e) => toggleFolder(e, folder.id)} className="p-0.5 hover:bg-black/10 rounded text-gray-400 transition-transform duration-200" style={{ transform: expandedFolders.includes(folder.id) ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
                      <ChevronDown size={14} />
                    </button>
                    <FolderTree size={18} className={currentScreen === `folder-${folder.id}` ? 'text-[#FF6B4A]' : 'text-gray-400'} strokeWidth={currentScreen === `folder-${folder.id}` ? 2.5 : 2} />
                    <span className="truncate">{folder.name}</span>
                  </div>
                </div>
                {/* Sub-folders */}
                <div className={`overflow-hidden transition-all duration-300 ${expandedFolders.includes(folder.id) ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="space-y-0.5">
                    {(folder.children || []).map(sub => (
                      <NavItem
                        key={sub.id}
                        icon={File}
                        label={sub.name}
                        isActive={currentScreen === `folder-${sub.id}`}
                        onClick={() => {
                          const articlesInFolder = state.articles.filter(a => a.folderId === sub.id && a.status === 'published');
                          if (articlesInFolder.length === 0) {
                            dispatch({ type: 'SET_CURRENT_FOLDER', folderId: sub.id });
                            navigate('empty-folder');
                          } else {
                            navigate(`folder-${sub.id}`);
                          }
                        }}
                        indent
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </SidebarSection>
        </div>

        {/* Admin Section */}
        {currentUser.role === 'admin' && (
          <div className="px-2">
            <SidebarSection title="Quản trị hệ thống" badge="Admin">
              <NavItem icon={FolderTree} label="Quản lý tài liệu" isActive={currentScreen === 'documents'} onClick={() => navigate('documents')} />
              <NavItem icon={Shield} label="Phân quyền" isActive={currentScreen === 'permissions'} onClick={() => navigate('permissions')} />
              <NavItem icon={Settings} label="Cài đặt hệ thống" isActive={currentScreen === 'settings'} onClick={() => navigate('settings')} />
            </SidebarSection>
          </div>
        )}
      </div>

      {/* Footer / User Profile */}
      <div className="p-3 border-t border-gray-200/60 bg-[#f8f8f6]">
        <button
          onClick={() => dispatch({ type: 'SET_ROLE', role: currentUser.role === 'admin' ? 'user' : 'admin' })}
          className="w-full flex items-center justify-center gap-2 mb-3 px-3 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg text-xs font-semibold transition-all duration-200 shadow-sm hover:shadow"
        >
          <ShieldCheck size={14} className={currentUser.role === 'admin' ? 'text-indigo-600' : 'text-gray-400'} />
          Role: {currentUser.role === 'admin' ? 'Admin' : 'User'}
        </button>
        <div onClick={() => navigate('profile')} className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-black/5 cursor-pointer transition-all duration-200 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B4A] to-[#FF8A6A] overflow-hidden shrink-0 shadow-sm ring-2 ring-white">
            <img src={currentUser.avatar} alt="Avatar" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{currentUser.name}</p>
            <p className="text-[11px] text-gray-500 truncate">{currentUser.role === 'admin' ? 'Quản trị viên' : currentUser.title}</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-500 ring-2 ring-green-500/20 shrink-0"></div>
        </div>
      </div>
    </aside>
  );
}
