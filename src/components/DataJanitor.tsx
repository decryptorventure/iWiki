import React, { useState } from 'react';
import { AlertTriangle, Trash2, RefreshCw, CheckCircle, Sparkles, FileText, Database, Copy, Zap, Check, X, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../App';
import { motion, AnimatePresence } from 'motion/react';

export default function DataJanitor() {
  const { dispatch } = useApp();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('outdated');
  const [showReport, setShowReport] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<number[]>([]);

  const handleUpdate = (taskId: number, title: string) => {
    dispatch({ type: 'OPEN_EDITOR', article: { title } });
  };
  const handleDismiss = (taskId: number) => {
    setDismissedIds(prev => [...prev, taskId]);
    addToast('Đã đánh dấu tài liệu vẫn còn chính xác', 'success');
  };
  const handleArchive = (taskId: number) => {
    setDismissedIds(prev => [...prev, taskId]);
    addToast('Đã lưu trữ tài liệu', 'info');
  };

  const tasks = [
    { id: 1, title: 'Quy trình Release App iOS', lastUpdated: '12/05/2023', author: 'Mobile Team', issue: 'Quá hạn 6 tháng', type: 'outdated', aiSuggestion: 'Có vẻ Apple đã thay đổi chính sách review app mới. Cần cập nhật phần 3.' },
    { id: 2, title: 'Hướng dẫn setup môi trường Dev (Cũ)', lastUpdated: '01/02/2022', author: 'Nguyễn Văn A', issue: 'Trùng lặp nội dung', type: 'duplicate', aiSuggestion: 'Bài viết này trùng 85% với "Setup Environment 2024". Đề xuất gộp hoặc lưu trữ.' },
    { id: 3, title: 'Chính sách WFH mùa dịch', lastUpdated: '15/08/2021', author: 'HR Dept', issue: 'Không còn phù hợp', type: 'archived', aiSuggestion: 'Chính sách này có thể đã hết hạn. Đề xuất chuyển vào kho lưu trữ.' },
    { id: 4, title: 'API Documentation v1.0', lastUpdated: '20/11/2023', author: 'Backend Team', issue: 'Quá hạn 3 tháng', type: 'outdated', aiSuggestion: 'Phiên bản v2.0 đã được release. Cần thêm cảnh báo deprecated vào bài này.' },
  ];

  const filteredTasks = tasks.filter(t => (activeTab === 'all' || t.type === activeTab) && !dismissedIds.includes(t.id));

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dọn Dẹp Dữ Liệu 🧹</h1>
          <p className="text-sm text-gray-500">Nâng cao chất lượng tri thức bằng cách xử lý thông tin lỗi thời.</p>
        </div>
        <button
          onClick={() => setShowReport(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-md text-sm font-semibold hover:bg-orange-100 transition-colors"
        >
          <Sparkles size={16} /> Báo cáo sức khoẻ
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Tổng số bài viết', value: '1,248', icon: Database, color: 'text-blue-500' },
          { label: 'Cần cập nhật', value: '156', icon: Zap, color: 'text-orange-500' },
          { label: 'Trùng lặp', value: '24', icon: Copy, color: 'text-pink-500' },
        ].map(m => (
          <div key={m.label} className="bg-white border border-gray-100 p-4 rounded-lg flex flex-col items-center text-center">
            <m.icon size={20} className={`${m.color} mb-2`} />
            <p className="text-xl font-bold text-gray-900">{m.value}</p>
            <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1.5 mb-6 border-b border-gray-100 pb-0.5">
        {[
          { id: 'all', label: 'Tất cả' },
          { id: 'outdated', label: 'Lỗi thời' },
          { id: 'duplicate', label: 'Trùng lặp' },
          { id: 'archived', label: 'Lưu trữ' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                ? 'border-orange-500 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <CheckCircle size={40} className="text-green-400 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Workspace tuyệt vời!</p>
            <p className="text-xs text-gray-400">Không còn dữ liệu cần xử lý trong mục này.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} className="bg-white border border-gray-100 p-5 rounded-lg hover:border-orange-200 transition-all flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${task.type === 'outdated' ? 'bg-orange-100 text-orange-600' :
                      task.type === 'duplicate' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                    {task.issue}
                  </span>
                  <span className="text-[11px] text-gray-400">Cập nhật: {task.lastUpdated}</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">{task.title}</h3>
                <p className="text-[11px] text-gray-400 font-medium uppercase mb-4">Tác giả: {task.author}</p>
                <div className="bg-gray-50 rounded-md p-3 border-l-2 border-orange-300">
                  <div className="flex items-center gap-2 text-orange-600 font-bold text-[10px] uppercase mb-1">
                    <Sparkles size={12} /> AI Gợi ý
                  </div>
                  <p className="text-sm text-gray-600 italic">"{task.aiSuggestion}"</p>
                </div>
              </div>
              <div className="flex md:flex-col gap-2 shrink-0 md:w-36">
                <button onClick={() => handleUpdate(task.id, task.title)} className="flex-1 py-1.5 bg-gray-900 text-white rounded text-xs font-semibold hover:bg-orange-500 transition-colors flex items-center justify-center gap-2"><RefreshCw size={12} /> Cập nhật</button>
                <button onClick={() => handleDismiss(task.id)} className="flex-1 py-1.5 bg-white border border-gray-200 text-gray-600 rounded text-xs font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"><Check size={12} /> Còn mới</button>
                <button onClick={() => handleArchive(task.id)} className="flex-1 py-1.5 bg-white border border-gray-200 text-gray-600 rounded text-xs font-semibold hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center gap-2"><Trash2 size={12} /> Lưu trữ</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* AI Report Modal */}
      <AnimatePresence>
        {showReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowReport(false)} className="absolute inset-0 bg-black/40" />
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="relative bg-white rounded-lg w-full max-w-md shadow-xl overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gray-900 flex items-center justify-between">
                <h3 className="text-white font-bold">Báo cáo sức khoẻ dữ liệu</h3>
                <button onClick={() => setShowReport(false)} className="text-white/50 hover:text-white"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">TỔNG QUAN</h4>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    Workspace của bạn hiện đạt <strong>85%</strong> độ tươi mới. Chúng tôi phát hiện 12 bài viết lỗi thời và 3 bài viết tiềm ẩn sự trùng lặp cần xử lý ngay để tối ưu trải nghiệm đọc.
                  </p>
                </div>
                <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg">
                  <p className="text-xs font-bold text-orange-600 mb-1">CẢNH BÁO QUAN TRỌNG</p>
                  <p className="text-sm text-gray-700">45 bài viết về quy trình Release App iOS có thể đã lỗi thời do Apple thay đổi chính sách App Store tuần qua.</p>
                </div>
                <button onClick={() => setShowReport(false)} className="w-full py-2.5 bg-gray-900 text-white rounded-md text-sm font-semibold hover:bg-orange-500 transition-colors">Đóng báo cáo</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
