import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Lock, Eye, Check, ChevronRight, X, UserGroup, Users, Plus, Layout } from 'lucide-react';
import { Button, Checkbox, Badge, BadgeVariant, Select } from '@frontend-team/ui-kit';
import { Folder, VisibilityType } from '../../types/folder';

export function FolderVisibilityManager() {
  const { state, dispatch } = useApp();
  const { folders, teams } = state;
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(folders[0]?.id || null);
  const selectedFolder = findFolderById(folders, selectedFolderId || '');

  function findFolderById(folders: Folder[], id: string): Folder | null {
    for (const f of folders) {
      if (f.id === id) return f;
      if (f.children) {
        const found = findFolderById(f.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  const handleToggleTeam = (teamId: string) => {
    if (!selectedFolder) return;
    const currentTeams = selectedFolder.allowedTeams || [];
    const nextTeams = currentTeams.includes(teamId)
      ? currentTeams.filter(t => t !== teamId)
      : [...currentTeams, teamId];
    
    dispatch({ 
      type: 'UPDATE_FOLDER_VISIBILITY', 
      folderId: selectedFolder.id, 
      visibilityType: selectedFolder.visibilityType || 'all_space_members',
      allowedTeams: nextTeams
    });
  };

  const handleSetVisibility = (type: VisibilityType) => {
    if (!selectedFolder) return;
    dispatch({ 
      type: 'UPDATE_FOLDER_VISIBILITY', 
      folderId: selectedFolder.id, 
      visibilityType: type,
      allowedTeams: selectedFolder.allowedTeams
    });
  };

  const renderFolderItem = (folder: Folder, depth = 0) => {
    const isSelected = selectedFolderId === folder.id;
    const isSpace = !folder.parentId;

    return (
      <div key={folder.id}>
        <button
          onClick={() => setSelectedFolderId(folder.id)}
          className={`w-full group flex items-center justify-between p-3 rounded-xl transition-all duration-200 text-left mb-1.5 border ${
            isSelected 
              ? 'bg-[var(--ds-bg-accent-primary-subtle)] border-[var(--ds-border-accent-primary-subtle)] shadow-sm' 
              : 'hover:bg-gray-100/60 border-transparent hover:border-gray-200'
          }`}
          style={{ paddingLeft: `${depth * 1.25 + 1}rem` }}
        >
          <div className="flex items-center gap-2.5 truncate">
            <div className={`transition-transform duration-300 ${isSelected ? 'scale-110' : ''}`}>
              {folder.icon ? <span className="text-lg">{folder.icon}</span> : <Layout size={18} className="text-gray-400" />}
            </div>
            <span className={`text-sm truncate font-medium ${isSelected ? 'text-[var(--ds-text-primary)] font-bold' : 'text-gray-700'}`}>
              {folder.name}
            </span>
          </div>
          <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100">
             {folder.visibilityType === 'team_restricted' ? (
                <Lock size={14} className="text-orange-500" />
             ) : (
                <Eye size={14} className="text-green-500" />
             )}
          </div>
        </button>
        {folder.children && folder.children.map(child => renderFolderItem(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-12 gap-8 h-full animate-slide-up">
      {/* Sidebar: Folder Tree */}
      <div className="col-span-12 md:col-span-4 lg:col-span-4 bg-white rounded-3xl border border-[var(--ds-border-subtle)] shadow-xl p-6 h-[720px] overflow-hidden flex flex-col">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Cấu trúc thư mục</h3>
          <p className="text-xs text-gray-500">Chọn folder để thiết lập giới hạn đội nhóm</p>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-1">
          {folders.map(f => renderFolderItem(f))}
        </div>
      </div>

      {/* Main Panel: Visibility Settings */}
      <div className="col-span-12 md:col-span-8 lg:col-span-8 space-y-6 flex flex-col h-full">
        {selectedFolder ? (
          <>
            <div className="card-premium p-8 bg-white border-2 border-[var(--ds-border-subtle)] rounded-3xl shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-12 -mt-12 -mr-12 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                 {selectedFolder.icon ? <span className="text-[140px] leading-none">{selectedFolder.icon}</span> : <Layout size={140} />}
               </div>
               
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
                 <div>
                   <h2 className="text-2xl font-black text-gray-900 mb-2 truncate max-w-lg flex items-center gap-3">
                     {selectedFolder.icon && <span>{selectedFolder.icon}</span>}
                     {selectedFolder.name}
                   </h2>
                   <div className="flex items-center gap-3">
                     <Badge variant="subtle" color="blue" className="px-3 py-1 font-bold">
                       {selectedFolder.parentId ? `Con của: ${findFolderById(folders, selectedFolder.parentId)?.name}` : 'Folder cấp cao nhất'}
                     </Badge>
                     <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5"><Eye size={16} /> ID: {selectedFolder.id}</p>
                   </div>
                 </div>
               </div>

               <div className="space-y-8 relative z-10">
                 <section>
                   <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                     <Lock size={16} className="text-orange-500" /> Loại giới hạn truy cập
                   </h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div 
                        onClick={() => handleSetVisibility('all_space_members')}
                        className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-start gap-4 ${
                          selectedFolder.visibilityType !== 'team_restricted' 
                            ? 'bg-green-50/50 border-green-500/30 ring-4 ring-green-100/50' 
                            : 'bg-white border-gray-100 hover:border-gray-300'
                        }`}
                     >
                       <div className={`p-3 rounded-xl shadow-sm ${selectedFolder.visibilityType !== 'team_restricted' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                         <Users size={24} />
                       </div>
                       <div>
                         <p className="font-extrabold text-sm mb-1">Mở cho toàn bộ thành viên Space</p>
                         <p className="text-xs text-gray-500 leading-relaxed">Mọi người tham gia Space này đều có thể nhìn thấy nội dung của folder.</p>
                       </div>
                     </div>

                     <div 
                        onClick={() => handleSetVisibility('team_restricted')}
                        className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-start gap-4 ${
                          selectedFolder.visibilityType === 'team_restricted' 
                            ? 'bg-orange-50/50 border-orange-500/30 ring-4 ring-orange-100/50' 
                            : 'bg-white border-gray-100 hover:border-gray-300'
                        }`}
                     >
                       <div className={`p-3 rounded-xl shadow-sm ${selectedFolder.visibilityType === 'team_restricted' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                         <Lock size={24} />
                       </div>
                       <div>
                         <p className="font-extrabold text-sm mb-1">Giới hạn theo đội nhóm (Teams)</p>
                         <p className="text-xs text-gray-500 leading-relaxed">Chỉ những thành viên thuộc team được chọn mới có thể xem các bài viết bên trong.</p>
                       </div>
                     </div>
                   </div>
                 </section>

                 {selectedFolder.visibilityType === 'team_restricted' && (
                   <section className="animate-slide-down">
                     <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <Check size={16} className="text-[var(--ds-fg-accent-primary)]" /> Chọn team được phép truy cập
                     </h4>
                     <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-200/80">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {teams.map(team => (
                            <div 
                              key={team.id}
                              onClick={() => handleToggleTeam(team.id)}
                              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                selectedFolder.allowedTeams?.includes(team.id)
                                  ? 'bg-white border-[var(--ds-bg-accent-primary)] shadow-sm'
                                  : 'bg-transparent border-gray-200'
                              }`}
                            >
                              <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                                selectedFolder.allowedTeams?.includes(team.id)
                                  ? 'bg-[var(--ds-bg-accent-primary)] border-[var(--ds-bg-accent-primary)] text-white'
                                  : 'bg-white border-gray-300'
                              }`}>
                                {selectedFolder.allowedTeams?.includes(team.id) && <Check size={12} />}
                              </div>
                              <span className="text-sm font-medium text-gray-700">{team.name}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-6 flex items-center gap-2 text-xs text-gray-500 italic px-1">
                          <Plus size={14} /> Gợi ý: Có thể gán nhiều team cùng lúc cho project liên phòng ban.
                        </div>
                     </div>
                   </section>
                 )}
               </div>
            </div>
            
            {/* Legend / Info */}
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 text-white overflow-hidden relative shadow-2xl">
               <div className="flex gap-4 items-center">
                 <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center shrink-0 border border-gray-700">
                    <Shield className="text-green-500" size={24} />
                 </div>
                 <div>
                   <p className="font-extrabold text-sm mb-1 uppercase tracking-wider text-green-500">Quy tắc Restrictive Model</p>
                   <p className="text-xs text-gray-400 leading-relaxed">
                     Hệ thống áp dụng cơ chế <strong>hẹp dần</strong>: Nếu folder cha bị giới hạn, folder con không thể mở rộng quyền hơn cha. 
                     Thành viên phải vừa là member của Space vừa thuộc Team được phép mới xem được folder này.
                   </p>
                 </div>
               </div>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-3xl">
            <p className="font-medium">Chọn một folder để bắt đầu cấu hình</p>
          </div>
        )}
      </div>
    </div>
  );
}
