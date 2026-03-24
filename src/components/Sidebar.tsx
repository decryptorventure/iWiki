import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FolderTree, FileText, ChevronDown, Plus, Sparkles, Shield, Compass, Target, Flame, BarChart, Home, AlertTriangle, Edit, ChevronsUpDown, LogOut, Heart } from 'lucide-react';
import { APP_SCREENS } from '../constants/screens';
import { can } from '../lib/permissions';

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
      ? 'bg-gradient-to-r from-[#f76226]/10 to-orange-50 text-gray-900 font-semibold shadow-sm border border-[#f76226]/10'
      : 'text-gray-600 hover:bg-black/5 hover:text-gray-900'
      } ${indent ? 'pl-9' : ''}`}
  >
    <div className="flex items-center gap-2.5 truncate">
      <div className={`transition-all duration-200 ${isActive ? 'text-[#f76226]' : 'text-gray-400 group-hover:text-gray-600'}`}>
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
  const { currentScreen, currentUser, folders } = state;

  const navigate = (screen: string) => dispatch({ type: 'SET_SCREEN', screen });

  return (
    <>
      <aside className="w-64 bg-[#f8f8f6] border-r border-gray-200/80 flex flex-col h-full overflow-hidden text-[#37352f]">
        {/* Workspace Header */}
        <div className="px-3 pt-3 pb-2">
          <div className="px-2 py-2.5 hover:bg-black/5 cursor-pointer transition-all duration-200 flex items-center justify-between group rounded-lg">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-7 h-7 bg-gradient-to-br from-[#f76226] to-[#FF8A6A] rounded-lg flex items-center justify-center text-white shrink-0 shadow-md shadow-[#f76226]/20">
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
          <div className="px-2">
            <div className="mt-1 space-y-0.5">
              <NavItem icon={Sparkles} label="iWiki AI" isActive={currentScreen === APP_SCREENS.AI} onClick={() => navigate(APP_SCREENS.AI)} />
              <NavItem icon={Home} label="Trang chủ" isActive={currentScreen === APP_SCREENS.DASHBOARD} onClick={() => navigate(APP_SCREENS.DASHBOARD)} />
              <NavItem icon={FileText} label="Bài viết của tôi" isActive={currentScreen === APP_SCREENS.MY_ARTICLES} onClick={() => navigate(APP_SCREENS.MY_ARTICLES)} />
              <NavItem
                icon={Compass}
                label="Custom Feed"
                isActive={currentScreen === APP_SCREENS.CUSTOM_FEED}
                onClick={() => navigate(APP_SCREENS.CUSTOM_FEED)}
              />
              <NavItem
                icon={Target}
                label="Săn thưởng"
                isActive={currentScreen === APP_SCREENS.BOUNTIES}
                onClick={() => navigate(APP_SCREENS.BOUNTIES)}
              />
              <NavItem
                icon={AlertTriangle}
                label="Dọn rác dữ liệu"
                isActive={currentScreen === APP_SCREENS.JANITOR}
                onClick={() => navigate(APP_SCREENS.JANITOR)}
              />
            </div>
          </div>

          {/* Folders */}
          <div className="px-2">
            <SidebarSection title="Tài liệu chung" onAdd={() => navigate(APP_SCREENS.DOCUMENTS)}>
              {folders.map((folder) => (
                <NavItem
                  key={folder.id}
                  icon={FolderTree}
                  label={folder.name}
                  isActive={currentScreen === `folder-${folder.id}`}
                  onClick={() => navigate(`folder-${folder.id}`)}
                />
              ))}
            </SidebarSection>
          </div>

          {/* Admin Section */}
          {(can(currentUser, 'admin.access') || can(currentUser, 'manager.access')) && (
            <div className="px-2">
              <SidebarSection title="Quản trị hệ thống" badge={currentUser.role === 'admin' ? 'Admin' : 'Manager'}>
                <NavItem icon={BarChart} label="Manager View" isActive={currentScreen === APP_SCREENS.MANAGER_DASHBOARD} onClick={() => navigate(APP_SCREENS.MANAGER_DASHBOARD)} />
                {can(currentUser, 'admin.access') && (
                  <>
                    <NavItem icon={BarChart} label="Dashboard Quản trị" isActive={currentScreen === APP_SCREENS.ADMIN_DASHBOARD} onClick={() => navigate(APP_SCREENS.ADMIN_DASHBOARD)} />
                    <NavItem icon={FolderTree} label="Quản lý tài liệu" isActive={currentScreen === APP_SCREENS.DOCUMENTS} onClick={() => navigate(APP_SCREENS.DOCUMENTS)} />
                    <NavItem icon={Shield} label="Phân quyền" isActive={currentScreen === APP_SCREENS.PERMISSIONS} onClick={() => navigate(APP_SCREENS.PERMISSIONS)} />
                  </>
                )}
              </SidebarSection>
            </div>
          )}
        </div>

        {/* Footer / User Profile */}
        <div className="p-3 border-t border-gray-200/60 bg-[#f8f8f6]">
          <div className="mb-3 p-2 rounded-lg border border-gray-200 bg-white">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-2">Demo persona</p>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => {
                  dispatch({ type: 'LOGIN', role: 'viewer' });
                  dispatch({ type: 'RESET_DEMO_STATE' });
                }}
                className="text-[10px] font-semibold px-2 py-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Viewer
              </button>
              <button
                onClick={() => {
                  dispatch({ type: 'LOGIN', role: 'editor' });
                  dispatch({ type: 'RESET_DEMO_STATE' });
                }}
                className="text-[10px] font-semibold px-2 py-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Editor
              </button>
              <button
                onClick={() => {
                  dispatch({ type: 'LOGIN', role: 'admin' });
                  dispatch({ type: 'RESET_DEMO_STATE' });
                }}
                className="text-[10px] font-semibold px-2 py-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Admin
              </button>
            </div>
            <button
              onClick={() => dispatch({ type: 'RESET_DEMO_STATE' })}
              className="mt-2 w-full text-[11px] font-semibold px-2 py-2 rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
            >
              Reset dữ liệu demo
            </button>
          </div>
          <button
            onClick={() => dispatch({ type: 'LOGOUT' })}
            className="flex items-center gap-2.5 px-3 py-2.5 w-full text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 active:scale-95 group"
            aria-label="Đăng xuất"
          >
            <LogOut size={18} className="text-red-500 group-hover:text-red-600" />
            <span>Đăng xuất</span>
          </button>
          <div onClick={() => navigate(APP_SCREENS.PROFILE)} className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-black/5 cursor-pointer transition-all duration-200 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f76226] to-[#FF8A6A] overflow-hidden shrink-0 shadow-sm ring-2 ring-white">
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
    </>
  );
}
