import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FolderTree, FileText, ChevronDown, Plus, Sparkles, Shield, Compass, Target, Flame, BarChart, Home, AlertTriangle, Edit, ChevronsUpDown, LogOut, PanelLeftClose, PanelLeftOpen, Sun, Moon, BookOpen } from 'lucide-react';
import { APP_SCREENS } from '../constants/screens';
import { can } from '../lib/permissions';
import { Button } from '@frontend-team/ui-kit';

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
          {badge && <span className="ml-1 px-1.5 py-0.5 bg-[var(--ds-bg-accent-secondary)] text-[var(--ds-fg-accent-secondary)] rounded text-[9px] font-bold tracking-normal normal-case">{badge}</span>}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onAdd && (
            <Button size="icon-xs" variant="subtle" onClick={(e) => { e.stopPropagation(); onAdd(); }}>
              <Plus size={14} />
            </Button>
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
  <Button
    variant="subtle"
    size="m"
    onClick={onClick}
    className={`w-full group flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive
      ? 'bg-[var(--ds-bg-accent-primary-subtle)] text-[var(--ds-text-primary)] font-semibold shadow-sm border border-[var(--ds-border-accent-primary-subtle)]'
      : 'text-[var(--ds-text-secondary)] hover:bg-[var(--ds-bg-tertiary)] hover:text-[var(--ds-text-primary)]'
      } ${indent ? 'pl-9' : ''} border-none shadow-none text-left justify-start`}
  >
    <div className="flex items-center gap-2.5 truncate flex-1">
      <div className={`transition-all duration-200 ${isActive ? 'text-[var(--ds-fg-accent-primary)]' : 'text-[var(--ds-icon-secondary)] group-hover:text-[var(--ds-icon-primary)]'}`}>
        <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
      </div>
      <span className="truncate">{label}</span>
    </div>
    <div className="flex items-center gap-1">
      {badge && <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[var(--ds-bg-error)] text-[var(--ds-fg-on-contrast)] rounded-full">{badge}</span>}
      {rightAction && <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">{rightAction}</div>}
    </div>
  </Button>
);

export default function Sidebar() {
  const { state, dispatch } = useApp();
  const { currentScreen, currentUser, folders } = state;
  const navigate = (screen: string) => dispatch({ type: 'SET_SCREEN', screen });
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`bg-[var(--ds-bg-canvas-secondary)] border-r border-[var(--ds-border-secondary)] flex flex-col h-full overflow-hidden text-[var(--ds-text-primary)] transition-all duration-300 ease-in-out shrink-0 ${collapsed ? 'w-12' : 'w-64'}`}>

      {/* Collapsed rail — just the expand button */}
      {collapsed && (
        <div className="flex flex-col items-center pt-3 flex-1">
          <Button
            size="icon-s"
            variant="subtle"
            onClick={() => setCollapsed(false)}
            title="Mở sidebar"
          >
            <PanelLeftOpen size={18} />
          </Button>
        </div>
      )}

      {/* Full sidebar content */}
      {!collapsed && <>
        {/* Workspace Header */}
        <div className="px-3 pt-3 pb-2">
          <div className="px-2 py-2 flex items-center justify-between group">
            <div 
              className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate(APP_SCREENS.DASHBOARD)}
            >
              <div className="w-8 h-8 bg-[var(--ds-bg-accent-primary)] rounded-xl flex items-center justify-center text-[var(--ds-fg-on-contrast)] shrink-0 shadow-sm border border-[var(--ds-border-tertiary)]/10">
                <BookOpen size={16} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-[var(--ds-text-primary)] leading-none">iWiki</span>
              </div>
            </div>
            <Button
              size="icon-xs"
              variant="subtle"
              onClick={(e) => { e.stopPropagation(); setCollapsed(true); }}
              className="text-gray-400 hover:text-[var(--ds-fg-accent-primary)] hover:bg-[var(--ds-bg-secondary)] transition-all"
              title="Ẩn sidebar"
            >
              <PanelLeftClose size={16} />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pb-4">
          {/* Top Navigation */}
          <div className="px-2">
            <div className="mt-1 space-y-0.5">
              <NavItem icon={Sparkles} label="iWiki AI" isActive={currentScreen === APP_SCREENS.AI} onClick={() => navigate(APP_SCREENS.AI)} />
              <NavItem icon={Home} label="Trang chủ" isActive={currentScreen === APP_SCREENS.DASHBOARD} onClick={() => navigate(APP_SCREENS.DASHBOARD)} />
              <NavItem icon={FileText} label="Bài viết của tôi" isActive={currentScreen === APP_SCREENS.MY_ARTICLES} onClick={() => navigate(APP_SCREENS.MY_ARTICLES)} />
              {currentUser.role !== 'viewer' && currentUser.role !== 'editor' && (
                <>
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
                </>
              )}
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
        <div className="p-3 border-t border-[var(--ds-border-secondary)] bg-[var(--ds-bg-canvas-secondary)]">
          <div className="mb-3 p-2 rounded-lg border border-gray-200 bg-white">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-2">Demo persona</p>
            <div className="grid grid-cols-3 gap-1.5">
              <Button
                variant="subtle"
                size="xs"
                onClick={() => {
                  dispatch({ type: 'LOGIN', role: 'viewer' });
                  dispatch({ type: 'RESET_DEMO_STATE' });
                }}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Viewer
              </Button>
              <Button
                variant="subtle"
                size="xs"
                onClick={() => {
                  dispatch({ type: 'LOGIN', role: 'editor' });
                  dispatch({ type: 'RESET_DEMO_STATE' });
                }}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Editor
              </Button>
              <Button
                variant="subtle"
                size="xs"
                onClick={() => {
                  dispatch({ type: 'LOGIN', role: 'admin' });
                  dispatch({ type: 'RESET_DEMO_STATE' });
                }}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Admin
              </Button>
            </div>
            <Button
              variant="dim"
              size="xs"
              onClick={() => dispatch({ type: 'RESET_DEMO_STATE' })}
              className="mt-2 w-full font-bold"
            >
              Reset dữ liệu demo
            </Button>
          </div>
          <Button
            variant="subtle"
            size="m"
            onClick={() => dispatch({ type: 'LOGOUT' })}
            className="w-full text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 active:scale-95 group justify-start border-none shadow-none font-bold"
            aria-label="Đăng xuất"
          >
            <LogOut size={18} className="text-red-500 group-hover:text-red-600" />
            <span>Đăng xuất</span>
          </Button>
          <div onClick={() => navigate(APP_SCREENS.PROFILE)} className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-black/5 cursor-pointer transition-all duration-200 group">
            <div className="w-8 h-8 rounded-lg bg-[var(--ds-bg-accent-primary-subtle)] overflow-hidden shrink-0 shadow-sm ring-2 ring-white">
              <img src={currentUser.avatar} alt="Avatar" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{currentUser.name}</p>
              <p className="text-[11px] text-gray-500 truncate">{currentUser.role === 'admin' ? 'Quản trị viên' : currentUser.title}</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-500 ring-2 ring-green-500/20 shrink-0"></div>
          </div>
        </div>
      </>}
    </aside>
  );
}
