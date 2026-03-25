import React, { useState } from 'react';
import { Folder, FileText, ChevronRight, ChevronDown, Plus, MoreVertical, Search, FolderPlus, FilePlus, Shield, GripVertical, Lock, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { can } from '../lib/permissions';
import { Button, Input, DataTable } from '@frontend-team/ui-kit';
import { DocumentPermissionModal } from './document-permission-modal';

interface DocItem {
  id: string;
  name: string;
  author: string;
  date: string;
  size: string;
  access: 'public' | 'restricted';
}

export default function DocumentManagement() {
  const { state } = useApp();
  if (!can(state.currentUser, 'admin.access')) {
    return <div className="h-full flex items-center justify-center text-[var(--ds-text-secondary)]">Bạn không có quyền truy cập quản lý tài liệu hệ thống.</div>;
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

  const [documents] = useState<DocItem[]>([
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
    `flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all duration-200 group ${selectedFolder === id ? 'bg-[var(--ds-bg-accent-primary-subtle)] text-[var(--ds-text-primary)] font-semibold shadow-sm border border-[var(--ds-border-accent-primary-subtle)]' : 'hover:bg-[var(--ds-bg-primary)] text-[var(--ds-text-secondary)] border border-transparent hover:border-[var(--ds-border-secondary)] hover:shadow-sm'} ${dropTarget === id ? 'border-2 border-dashed border-[var(--ds-border-accent-primary)] bg-[var(--ds-bg-accent-primary-subtle)]' : ''}`;

  return (
    <div className="flex h-full bg-[var(--ds-bg-primary)]">
      {/* Folder Tree Sidebar */}
      <div className="w-72 border-r border-[var(--ds-border-secondary)] flex flex-col bg-[var(--ds-bg-secondary)]">
        <div className="p-4 border-b border-[var(--ds-border-secondary)] flex items-center justify-between bg-[var(--ds-bg-primary)]">
          <h2 className="font-bold text-[var(--ds-text-primary)]">Cấu trúc thư mục</h2>
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
                  <GripVertical size={14} className="text-[var(--ds-text-secondary)] opacity-0 group-hover:opacity-100 cursor-grab" />
                  {expandedFolders.includes(folder.id) ? <ChevronDown size={16} className="text-[var(--ds-text-secondary)]" /> : <ChevronRight size={16} className="text-[var(--ds-text-secondary)]" />}
                  <Folder size={18} className={selectedFolder === folder.id ? 'text-[var(--ds-fg-accent-primary)]' : 'text-[var(--ds-text-secondary)]'} />
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
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-200 group ${selectedFolder === child.id ? 'bg-[var(--ds-bg-accent-primary-subtle)] text-[var(--ds-text-primary)] font-semibold shadow-sm border border-[var(--ds-border-accent-primary-subtle)]' : 'hover:bg-[var(--ds-bg-primary)] text-[var(--ds-text-secondary)] border border-transparent hover:border-[var(--ds-border-secondary)]'} ${dropTarget === child.id ? 'border-2 border-dashed border-[var(--ds-border-accent-primary)] bg-[var(--ds-bg-accent-primary-subtle)]' : ''}`}
                      onClick={() => setSelectedFolder(child.id)}>
                      <div className="flex items-center gap-2">
                        <GripVertical size={14} className="text-[var(--ds-text-secondary)] opacity-0 group-hover:opacity-100 cursor-grab" />
                        <Folder size={16} className={selectedFolder === child.id ? 'text-[var(--ds-fg-accent-primary)]' : 'text-[var(--ds-text-secondary)]'} />
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
      <div className="flex-1 flex flex-col bg-[var(--ds-bg-primary)]">
        <div className="p-6 border-b border-[var(--ds-border-secondary)] flex items-center justify-between bg-[var(--ds-bg-primary)]">
          <div>
            <h1 className="text-2xl font-bold text-[var(--ds-text-primary)] mb-1">Chính sách nhân sự</h1>
            <p className="text-sm text-[var(--ds-text-secondary)]">Quản lý các tài liệu, quy định và chính sách của công ty.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ds-text-secondary)]" size={18} />
              <Input type="text" placeholder="Tìm tài liệu..." className="pl-10 pr-4" />
            </div>
            <Button variant="primary"><FilePlus size={18} /> Tải lên</Button>
          </div>
        </div>
        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
          <DataTable<DocItem>
            data={documents}
            getRowKey={(row) => row.id}

            columns={[
              {
                id: 'name',
                header: 'Tên tài liệu',
                accessorKey: 'name',
                cell: (doc) => (
                  <div className="flex items-center gap-3">
                    <GripVertical size={16} className="text-[var(--ds-text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="p-2 bg-[var(--ds-bg-info-subtle)] text-[var(--ds-fg-info)] rounded-lg"><FileText size={18} /></div>
                    <span className="font-medium text-[var(--ds-text-primary)] group-hover:text-[var(--ds-fg-accent-primary)] transition-colors">{doc.name}</span>
                    {doc.access === 'restricted' && <Lock size={14} className="text-[var(--ds-text-secondary)]" title="Hạn chế truy cập" />}
                  </div>
                )
              },
              { id: 'author', header: 'Tác giả', accessorKey: 'author' },
              { id: 'date', header: 'Ngày cập nhật', accessorKey: 'date' },
              { id: 'size', header: 'Kích thước', accessorKey: 'size' },
              {
                id: 'actions',
                header: () => <div className="text-right">Thao tác</div>,
                cell: (doc) => (
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <Button variant="subtle" size="icon-s" title="Phân quyền"
                      onClick={() => openPermissionModal({ id: doc.id, name: doc.name, type: 'doc' })}>
                      <Shield size={18} />
                    </Button>
                    <Button variant="subtle" size="icon-s"><MoreVertical size={18} /></Button>
                  </div>
                )
              }
            ]}
            className="border border-[var(--ds-border-secondary)] rounded-2xl overflow-hidden shadow-sm"
          />

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
