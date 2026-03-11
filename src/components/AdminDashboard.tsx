import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BarChart3, Users, FileText, AlertTriangle, CheckCircle, Clock, Trash2, ShieldAlert } from 'lucide-react';

export default function AdminDashboard() {
  const { state, dispatch } = useApp();
  const { articles, currentUser } = state;
  const [activeTab, setActiveTab] = useState<'analytics' | 'maintenance' | 'approval'>('analytics');

  // Mock Data
  const stats = {
    totalArticles: articles.length,
    activeUsers: 142,
    pendingApproval: 3,
    needsMaintenance: 5
  };

  const pendingArticles = [
    { id: 'p1', title: 'Quy trình xử lý khủng hoảng truyền thông', author: 'Lê Văn C', date: '2024-05-25', folderId: 'f-hr' },
    { id: 'p2', title: 'Tài liệu API Đối tác VNPAY', author: 'Nguyễn B', date: '2024-05-24', folderId: 'f-be' },
    { id: 'p3', title: 'Design System Guidelines v2', author: 'Trần D', date: '2024-05-23', folderId: 'f-fe' },
  ];

  const maintenanceArticles = [
    { id: 'm1', title: 'Chính sách WFH 2021', status: 'Outdated (Không cập nhật > 2 năm)', author: 'HR Team' },
    { id: 'm2', title: 'Hướng dẫn cài đặt môi trường Dev cũ', status: 'Cảnh báo mâu thuẫn nội dung', author: 'DevOps' },
  ];

  if (currentUser.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <ShieldAlert size={64} className="text-red-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Không có quyền truy cập</h2>
        <p className="text-gray-500">Trang này chỉ dành cho Admin hoặc Quản trị viên tri thức.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-12 animate-fade-in custom-scrollbar h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Governance & Analytics</h1>
          <p className="text-gray-500 mt-2">Quản lý chất lượng tri thức và thống kê toàn hệ thống.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
           <div className="flex items-center gap-4 mb-2">
             <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><FileText size={24} /></div>
             <div><p className="text-sm font-medium text-gray-500">Tổng bài viết</p><h3 className="text-2xl font-bold text-gray-900">{stats.totalArticles}</h3></div>
           </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
           <div className="flex items-center gap-4 mb-2">
             <div className="p-3 bg-green-50 text-green-600 rounded-xl"><Users size={24} /></div>
             <div><p className="text-sm font-medium text-gray-500">Active Users (MAU)</p><h3 className="text-2xl font-bold text-gray-900">{stats.activeUsers}</h3></div>
           </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:border-orange-300 transition-colors" onClick={() => setActiveTab('approval')}>
           <div className="flex items-center gap-4 mb-2">
             <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><Clock size={24} /></div>
             <div><p className="text-sm font-medium text-gray-500">Chờ phê duyệt</p><h3 className="text-2xl font-bold text-gray-900">{stats.pendingApproval}</h3></div>
           </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:border-red-300 transition-colors" onClick={() => setActiveTab('maintenance')}>
           <div className="flex items-center gap-4 mb-2">
             <div className="p-3 bg-red-50 text-red-600 rounded-xl"><AlertTriangle size={24} /></div>
             <div><p className="text-sm font-medium text-gray-500">Cần bảo trì</p><h3 className="text-2xl font-bold text-gray-900">{stats.needsMaintenance}</h3></div>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 mb-8">
        {[
          { id: 'analytics', label: 'Analytics Dashboard', icon: BarChart3 },
          { id: 'approval', label: 'Phê duyệt nội dung', icon: CheckCircle },
          { id: 'maintenance', label: 'Bảo trì tri thức', icon: AlertTriangle },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition-all duration-200 ${activeTab === tab.id ? 'border-[#FF6B4A] text-[#FF6B4A]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <Icon size={18} /> {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm min-h-[400px] p-6">
         {activeTab === 'analytics' && (
           <div className="flex flex-col items-center justify-center h-full py-12 text-center">
             <BarChart3 size={64} className="text-gray-200 mb-4" />
             <h3 className="text-lg font-bold text-gray-900 mb-2">Analytics Dashboard</h3>
             <p className="text-gray-500 max-w-md">Khu vực này sẽ hiển thị các biểu đồ tương tác thực tế kết nối qua API (VD: Lượt đọc theo phòng ban, Đóng góp theo quý).</p>
           </div>
         )}

         {activeTab === 'approval' && (
           <div>
             <h3 className="text-lg font-bold text-gray-900 mb-4">Danh sách chờ phê duyệt (Mock)</h3>
             <div className="space-y-4">
               {pendingArticles.map(p => (
                 <div key={p.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
                   <div>
                     <h4 className="font-bold text-gray-900">{p.title}</h4>
                     <p className="text-xs text-gray-500 mt-1">Gửi bởi: {p.author} • Ngày: {p.date}</p>
                   </div>
                   <div className="flex gap-2 mt-4 sm:mt-0">
                     <button className="px-4 py-2 text-sm font-bold text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors">Duyệt</button>
                     <button className="px-4 py-2 text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 rounded-lg transition-colors">Từ chối</button>
                   </div>
                 </div>
               ))}
             </div>
           </div>
         )}

         {activeTab === 'maintenance' && (
           <div>
             <h3 className="text-lg font-bold text-gray-900 mb-4">Cảnh báo Tri thức Outdated / Mâu thuẫn</h3>
             <div className="space-y-4">
               {maintenanceArticles.map(m => (
                 <div key={m.id} className="flex flex-col sm:flex-row items-start justify-between p-4 border border-red-100 bg-red-50/30 rounded-xl">
                   <div>
                     <h4 className="font-bold text-gray-900">{m.title}</h4>
                     <p className="text-xs font-semibold text-red-600 mt-1 flex items-center gap-1"><AlertTriangle size={12}/> {m.status}</p>
                     <p className="text-xs text-gray-500 mt-1">Owner: {m.author}</p>
                   </div>
                   <div className="flex gap-2 mt-4 sm:mt-0">
                     <button className="px-4 py-2 text-sm font-bold text-white bg-[#FF6B4A] hover:bg-orange-600 rounded-lg transition-colors">Yêu cầu Update</button>
                     <button className="px-4 py-2 text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 rounded-lg transition-colors"><Trash2 size={16}/></button>
                   </div>
                 </div>
               ))}
             </div>
           </div>
         )}
      </div>
    </div>
  );
}
