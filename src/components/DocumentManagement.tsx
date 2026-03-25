import React, { useState } from 'react';
import { Folder, FileText, ChevronRight, ChevronDown, Plus, MoreVertical, Search, FolderPlus, FilePlus, Shield, GripVertical, Lock, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { can } from '../lib/permissions';
import { Button, Input } from '@frontend-team/ui-kit';
import { DocumentPermissionModal } from './document-permission-modal';

export default function DocumentManagement() {
  const { state } = useApp();
  if (!can(state.currentUser, 'admin.access')) {
    return <div className="h-full flex items-center justify-center text-gray-500">Bạn không có quyền truy cập quản lý tài liệu hệ thống.</div>;
  }

  const [expandedFolders, setExpandedFolders] = useState<string[]>(['1', '1-1']);
  const [selectedFolder, setSelectedFolder] = useState<string>('1-1');
  const [draggedFolder, setDraggedFolder] = useState<string | null>(null);
  const [draggedDoc, setDraggedDoc] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [selectedItemForPermission, setSelectedItemForPermission] = useState<{ id: string; name: string; type: 'folder' | 'doc' } | null>(null);

  const toggleFolder = (id: string) => setExpandedFolders(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);

  const [folders] = useState([
    { id: '1', name: 'Công ty iKame', access: 'public', children: [
      { id: '1-1', name: 'Chính sách nhân sự', access: 'restricted', children: [] },
      { id: '1-2', name: 'Quy trình chung', access: 'public', children: [] },
    ]},
    { id: '2', name: 'Phòng Kỹ thuật (Tech)', access: 'restricted', children: [
      { id: '2-1', name: 'Frontend', access: 'restricted', children: [] },
      { id: '2-2', name: 'Backend', access: 'restricted', children: [] },
    ]},
  ]);

  const [documents] = useState([
    { id: 'doc-1', name: 'Sổ tay nhân viên 2024', author: 'HR Dept', date: '10/01/2024', size: '2.4 MB', access: 'public' },
    { id: 'doc-2', name: 'Quy định WFH', author: 'HR Dept', date: '15/02/2024', size: '1.1 MB', access: 'public' },
    { id: 'doc-3', name: 'Quy trình Onboarding', author: 'Nguyễn Văn A', date: '20/03/2024', size: '3.5 MB', access: 'restricted' },
  ]);

  const handleDragOver = (e: React.DragEvent, id: string) => { e.preventDefault(); e.stopPropagation(); setDropTarget(id); };
  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault(); e.stopPropagation(); setDropTarget(null);
    setDraggedFolder(null); setDraggedDoc(null);
  };
  const openPermissionModal = (item: { id: string; name: string; type: 'folder' | 'doc' }) => {
    setSelectedItemForPermission(item);
    setIsPermissionModalOpen(true);
  };

  const folderItemClass = (id: string) =>
    `flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all duration-200 group ${selectedFolder === id ? 'bg-gradient-to-r from-[#f76226]/10 to-orange-50 text-gray-900 font-semibold shadow-sm border border-[#f76226]/10' : 'hover:bg-white text-gray-700 border border-transparent hover:border-gray-200 hover:shadow-sm'} ${dropTarget === id ? 'border-2 border-dashed border-[#f76226] bg-orange-50/50' : ''}`;

  return (
    <div className="flex h-full bg-white">
      {/* Folder Tree Sidebar */}
      <div className="w-72 border-r border-gray-200/80 flex flex-col bg-[#f9fafb]">
        <div className="p-4 border-b border-gray-200/80 flex items-center justify-between bg-white">
          <h2 className="font-bold text-gray-900">Cấu trúc thư mục</h2>
          <Button variant="subtle" size="icon-s"><FolderPlus size={18} /></Button>
        </div>
        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
          {folders.map(folder => (
            <div key={folder.id} className="mb-2">
              <div draggable onDragStart={(e) => { e.stopPropagation(); setDraggedFolder(folder.id); }}
                onDragOver={(e) => handleDragOver(e, folder.id)} onDrop={(e) => handleDrop(e, folder.id)}
                className={folderItemClass(folder.id)}
                onClick={() => { toggleFolder(folder.id); setSelectedFolder(folder.id); }}>
                <div className="flex items-center gap-2">
                  <GripVertical size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 cursor-grab" />
                  {expandedFolders.includes(folder.id) ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                  <Folder size={18} className={selectedFolder === folder.id ? 'text-[#f76226]' : 'text-gray-400'} />
                  <span className="text-sm font-medium">{folder.name}</span>
                </div>
                <Button variant="subtle" size="icon-xs" className="opacity-0 group-hover:opacity-100"
                  onClick={(e) => { e.stopPropagation(); openPermissionModal({ id: folder.id, name: folder.name, type: 'folder' }); }}>
                  {folder.access === 'restricted' ? <Lock size={14} /> : <Globe size={14} />}
                </Button>
              </div>
              {expandedFolders.includes(folder.id) && (
                <div className="ml-6 mt-1 space-y-1">
                  {folder.children.map(child => (
                    <div key={child.id} draggable onDragStart={(e) => { e.stopPropagation(); setDraggedFolder(child.id); }}
                      onDragOver={(e) => handleDragOver(e, child.id)} onDrop={(e) => handleDrop(e, child.id)}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-200 group ${selectedFolder === child.id ? 'bg-gradient-to-r from-[#f76226]/10 to-orange-50 text-gray-900 font-semibold shadow-sm border border-[#f76226]/10' : 'hover:bg-white text-gray-600 border border-transparent hover:border-gray-200'} ${dropTarget === child.id ? 'border-2 border-dashed border-[#f76226] bg-orange-50/50' : ''}`}
                      onClick={() => setSelectedFolder(child.id)}>
                      <div className="flex items-center gap-2">
                        <GripVertical size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 cursor-grab" />
                        <Folder size={16} className={selectedFolder === child.id ? 'text-[#f76226]' : 'text-gray-400'} />
                        <span className="text-sm">{child.name}</span>
                      </div>
                      <Button variant="subtle" size="icon-xs" className="opacity-0 group-hover:opacity-100"
                        onClick={(e) => { e.stopPropagation(); openPermissionModal({ id: child.id, name: child.name, type: 'folder' }); }}>
                        {child.access === 'restricted' ? <Lock size={14} /> : <Globe size={14} />}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Document List */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="p-6 border-b border-gray-200/80 flex items-center justify-between bg-white">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Chính sách nhân sự</h1>
            <p className="text-sm text-gray-500">Quản lý các tài liệu, quy định và chính sách của công ty.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input type="text" placeholder="Tìm tài liệu..." className="pl-10 pr-4" />
            </div>
            <Button variant="primary"><FilePlus size={18} /> Tải lên</Button>
          </div>
        </div>
        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
          <div className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="p-4 font-medium">Tên tài liệu</th>
                  <th className="p-4 font-medium">Tác giả</th>
                  <th className="p-4 font-medium">Ngày cập nhật</th>
                  <th className="p-4 font-medium">Kích thước</th>
                  <th className="p-4 font-medium text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {documents.map(doc => (
                  <tr key={doc.id} draggable onDragStart={(e) => { e.stopPropagation(); setDraggedDoc(doc.id); }}
                    className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-200 group cursor-grab">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <GripVertical size={16} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 rounded-lg"><FileText size={18} /></div>
                        <span className="font-medium text-gray-900 group-hover:text-[#f76226] transition-colors">{doc.name}</span>
                        {doc.access === 'restricted' && <Lock size={14} className="text-gray-400" title="Hạn chế truy cập" />}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{doc.author}</td>
                    <td className="p-4 text-sm text-gray-600">{doc.date}</td>
                    <td className="p-4 text-sm text-gray-600">{doc.size}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <Button variant="subtle" size="icon-s" title="Phân quyền"
                          onClick={() => openPermissionModal({ id: doc.id, name: doc.name, type: 'doc' })}>
                          <Shield size={18} />
                        </Button>
                        <Button variant="subtle" size="icon-s"><MoreVertical size={18} /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <DocumentPermissionModal
        open={isPermissionModalOpen}
        onOpenChange={setIsPermissionModalOpen}
        selectedItem={selectedItemForPermission}
      />
    </div>
  );
}
