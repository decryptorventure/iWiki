import React, { useState } from 'react';
import { Folder, FileText, ChevronRight, ChevronDown, Plus, MoreVertical, Search, FolderPlus, FilePlus, Shield, GripVertical, Lock, Users, X, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { can } from '../lib/permissions';

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
  const [selectedItemForPermission, setSelectedItemForPermission] = useState<{ id: string, name: string, type: 'folder' | 'doc' } | null>(null);

  const toggleFolder = (id: string) => {
    setExpandedFolders(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const [folders] = useState([
    {
      id: '1',
      name: 'Công ty iKame',
      access: 'public',
      children: [
        { id: '1-1', name: 'Chính sách nhân sự', access: 'restricted', children: [] },
        { id: '1-2', name: 'Quy trình chung', access: 'public', children: [] }
      ]
    },
    {
      id: '2',
      name: 'Phòng Kỹ thuật (Tech)',
      access: 'restricted',
      children: [
        { id: '2-1', name: 'Frontend', access: 'restricted', children: [] },
        { id: '2-2', name: 'Backend', access: 'restricted', children: [] }
      ]
    }
  ]);

  const [documents] = useState([
    { id: 'doc-1', name: 'Sổ tay nhân viên 2024', author: 'HR Dept', date: '10/01/2024', size: '2.4 MB', access: 'public' },
    { id: 'doc-2', name: 'Quy định WFH', author: 'HR Dept', date: '15/02/2024', size: '1.1 MB', access: 'public' },
    { id: 'doc-3', name: 'Quy trình Onboarding', author: 'Nguyễn Văn A', date: '20/03/2024', size: '3.5 MB', access: 'restricted' },
  ]);

  const handleDragStartFolder = (e: React.DragEvent, id: string) => {
    e.stopPropagation();
    setDraggedFolder(id);
  };

  const handleDragStartDoc = (e: React.DragEvent, id: string) => {
    e.stopPropagation();
    setDraggedDoc(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDropTarget(id);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDropTarget(null);
    if (draggedFolder && draggedFolder !== targetId) {
      console.log(`Moved folder ${draggedFolder} to ${targetId}`);
    } else if (draggedDoc) {
      console.log(`Moved doc ${draggedDoc} to folder ${targetId}`);
    }
    setDraggedFolder(null);
    setDraggedDoc(null);
  };

  const openPermissionModal = (item: { id: string, name: string, type: 'folder' | 'doc' }) => {
    setSelectedItemForPermission(item);
    setIsPermissionModalOpen(true);
  };

  return (
    <div className="flex h-full bg-white">
      {/* Sidebar - Folder Tree */}
      <div className="w-72 border-r border-gray-200/80 flex flex-col bg-[#f9fafb]">
        <div className="p-4 border-b border-gray-200/80 flex items-center justify-between bg-white">
          <h2 className="font-bold text-gray-900">Cấu trúc thư mục</h2>
          <button className="p-1.5 text-gray-500 hover:text-[#FF6B4A] hover:bg-orange-50 rounded-lg transition-all duration-200 active:scale-90">
            <FolderPlus size={18} />
          </button>
        </div>
        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
          {folders.map(folder => (
            <div key={folder.id} className="mb-2">
              <div
                draggable
                onDragStart={(e) => handleDragStartFolder(e, folder.id)}
                onDragOver={(e) => handleDragOver(e, folder.id)}
                onDrop={(e) => handleDrop(e, folder.id)}
                className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all duration-200 group ${selectedFolder === folder.id ? 'bg-gradient-to-r from-[#FF6B4A]/10 to-orange-50 text-gray-900 font-semibold shadow-sm border border-[#FF6B4A]/10' : 'hover:bg-white text-gray-700 border border-transparent hover:border-gray-200 hover:shadow-sm'} ${dropTarget === folder.id ? 'border-2 border-dashed border-[#FF6B4A] bg-orange-50/50' : ''}`}
                onClick={() => { toggleFolder(folder.id); setSelectedFolder(folder.id); }}
              >
                <div className="flex items-center gap-2">
                  <GripVertical size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing" />
                  {expandedFolders.includes(folder.id) ? <ChevronDown size={16} className="text-gray-400 transition-transform" /> : <ChevronRight size={16} className="text-gray-400 transition-transform" />}
                  <Folder size={18} className={selectedFolder === folder.id ? 'text-[#FF6B4A]' : 'text-gray-400'} />
                  <span className="text-sm font-medium">{folder.name}</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); openPermissionModal({ id: folder.id, name: folder.name, type: 'folder' }); }}
                  className="p-1 text-gray-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all duration-200"
                  title="Phân quyền"
                >
                  {folder.access === 'restricted' ? <Lock size={14} /> : <Globe size={14} />}
                </button>
              </div>

              {expandedFolders.includes(folder.id) && (
                <div className="ml-6 mt-1 space-y-1">
                  {folder.children.map(child => (
                    <div
                      key={child.id}
                      draggable
                      onDragStart={(e) => handleDragStartFolder(e, child.id)}
                      onDragOver={(e) => handleDragOver(e, child.id)}
                      onDrop={(e) => handleDrop(e, child.id)}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-200 group ${selectedFolder === child.id ? 'bg-gradient-to-r from-[#FF6B4A]/10 to-orange-50 text-gray-900 font-semibold shadow-sm border border-[#FF6B4A]/10' : 'hover:bg-white text-gray-600 border border-transparent hover:border-gray-200'} ${dropTarget === child.id ? 'border-2 border-dashed border-[#FF6B4A] bg-orange-50/50' : ''}`}
                      onClick={() => setSelectedFolder(child.id)}
                    >
                      <div className="flex items-center gap-2">
                        <GripVertical size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing" />
                        <Folder size={16} className={selectedFolder === child.id ? 'text-[#FF6B4A]' : 'text-gray-400'} />
                        <span className="text-sm">{child.name}</span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); openPermissionModal({ id: child.id, name: child.name, type: 'folder' }); }}
                        className="p-1 text-gray-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all duration-200"
                        title="Phân quyền"
                      >
                        {child.access === 'restricted' ? <Lock size={14} /> : <Globe size={14} />}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content - Document List */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="p-6 border-b border-gray-200/80 flex items-center justify-between bg-white">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Chính sách nhân sự</h1>
            <p className="text-sm text-gray-500">Quản lý các tài liệu, quy định và chính sách của công ty.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Tìm tài liệu..."
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] transition-all duration-200 hover:border-gray-300"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6A] text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-[#FF6B4A]/20 transition-all duration-200 shadow-md active:scale-95">
              <FilePlus size={18} />
              Tải lên
            </button>
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
                  <tr
                    key={doc.id}
                    draggable
                    onDragStart={(e) => handleDragStartDoc(e, doc.id)}
                    className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-200 group cursor-grab active:cursor-grabbing"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <GripVertical size={16} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 rounded-lg">
                          <FileText size={18} />
                        </div>
                        <span className="font-medium text-gray-900 group-hover:text-[#FF6B4A] transition-colors">{doc.name}</span>
                        {doc.access === 'restricted' && <Lock size={14} className="text-gray-400" title="Hạn chế truy cập" />}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{doc.author}</td>
                    <td className="p-4 text-sm text-gray-600">{doc.date}</td>
                    <td className="p-4 text-sm text-gray-600">{doc.size}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <button
                          onClick={() => openPermissionModal({ id: doc.id, name: doc.name, type: 'doc' })}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 active:scale-90"
                          title="Phân quyền"
                        >
                          <Shield size={18} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 active:scale-90">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Permission Modal */}
      {isPermissionModalOpen && selectedItemForPermission && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-modal-backdrop">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-modal-enter">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Chia sẻ & Phân quyền</h3>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  {selectedItemForPermission.type === 'folder' ? <Folder size={14} /> : <FileText size={14} />}
                  {selectedItemForPermission.name}
                </p>
              </div>
              <button
                onClick={() => setIsPermissionModalOpen(false)}
                className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-all duration-200 active:scale-90"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3">Quyền truy cập chung</h4>
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Globe size={20} className="text-blue-500" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">Bất kỳ ai trong iKame</div>
                      <div className="text-xs text-gray-500">Có thể tìm và xem nội dung này</div>
                    </div>
                  </div>
                  <select className="text-sm border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white px-3 py-1.5 border outline-none transition-all duration-200">
                    <option>Người xem</option>
                    <option>Người chỉnh sửa</option>
                    <option>Bị hạn chế</option>
                  </select>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3">Người có quyền truy cập</h4>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Thêm người hoặc nhóm..."
                    className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 hover:border-gray-300"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src="https://picsum.photos/seed/ikame/100/100" alt="Avatar" className="w-8 h-8 rounded-full ring-2 ring-gray-100" referrerPolicy="no-referrer" />
                      <div>
                        <div className="text-sm font-bold text-gray-900">Nguyễn Văn A (Bạn)</div>
                        <div className="text-xs text-gray-500">nguyen.van.a@ikame.com</div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">Chủ sở hữu</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-600 flex items-center justify-center font-bold text-xs">
                        HR
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">Phòng Nhân sự</div>
                        <div className="text-xs text-gray-500">hr@ikame.com</div>
                      </div>
                    </div>
                    <select className="text-sm border-transparent hover:border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-transparent hover:bg-white px-2 py-1 border outline-none cursor-pointer transition-all duration-200">
                      <option>Người chỉnh sửa</option>
                      <option>Người xem</option>
                      <option>Xóa quyền</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50/80 flex justify-end gap-3">
              <button
                onClick={() => setIsPermissionModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-xl transition-all duration-200 active:scale-95"
              >
                Hủy
              </button>
              <button
                onClick={() => setIsPermissionModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
