import React, { useState } from 'react';
import { AlertTriangle, Trash2, RefreshCw, CheckCircle, ShieldAlert, Sparkles, FileText, Database, FileWarning, Copy, Target } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useApp } from '../context/AppContext';
import { useToast } from '../App';

export default function DataJanitor() {
  const { state, dispatch } = useApp();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('outdated');
  const [showReport, setShowReport] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<number[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleUpdate = (taskId: number, title: string) => {
    dispatch({ type: 'OPEN_EDITOR', article: { title } });
  };
  const handleDismiss = (taskId: number) => {
    setDismissedIds(prev => [...prev, taskId]);
    addToast('Đã đánh dấu là vẫn còn chính xác ✓', 'success');
  };
  const handleArchive = (taskId: number) => {
    setDismissedIds(prev => [...prev, taskId]);
    addToast('Đã lưu trữ tài liệu', 'info');
  };

  const tasks = state.articles.map((article, idx) => {
    const ageDays = Math.floor((Date.now() - new Date(article.updatedAt).getTime()) / (24 * 60 * 60 * 1000));
    const duplicate = state.articles.some(other =>
      other.id !== article.id &&
      other.title.toLowerCase() === article.title.toLowerCase()
    );
    const lowQuality = article.content.trim().length < 80;
    let type: 'outdated' | 'duplicate' | 'archived' = 'outdated';
    let issue = `Quá hạn ${ageDays} ngày`;
    let aiSuggestion = 'Cần kiểm tra và cập nhật lại nội dung cho phù hợp với quy trình hiện tại.';
    if (duplicate) {
      type = 'duplicate';
      issue = 'Trùng tiêu đề/nội dung';
      aiSuggestion = 'Đề xuất gộp bài viết trùng để tạo một source of truth duy nhất.';
    } else if (lowQuality) {
      type = 'archived';
      issue = 'Nội dung quá ngắn';
      aiSuggestion = 'Đề xuất bổ sung sections chuẩn hoặc chuyển sang draft để hoàn thiện.';
    }
    return {
      id: idx + 1,
      articleId: article.id,
      title: article.title,
      lastUpdated: article.updatedAt,
      author: article.author.name,
      issue,
      type,
      aiSuggestion,
    };
  }).filter(item => item.type !== 'outdated' || Number(item.issue.replace(/\D/g, '')) > 120);

  const filteredTasks = (activeTab === 'all' ? tasks : tasks.filter(t => t.type === activeTab))
    .filter(t => !dismissedIds.includes(t.id));

  const outdatedCount = tasks.filter((task) => task.type === 'outdated').length;
  const duplicateCount = tasks.filter((task) => task.type === 'duplicate').length;
  const dataHealth = Math.max(
    55,
    Math.min(99, Math.round(((state.articles.length - (outdatedCount + duplicateCount)) / Math.max(1, state.articles.length)) * 100))
  );

  const bulkMarkAccurate = () => {
    if (selectedIds.length === 0) return;
    setDismissedIds(prev => [...prev, ...selectedIds]);
    setSelectedIds([]);
    addToast(`Đã xử lý ${selectedIds.length} mục`, 'success');
  };

  const createBountyFromTask = (task: { id: number; title: string; type: 'outdated' | 'duplicate' | 'archived' }) => {
    dispatch({
      type: 'CREATE_BOUNTY',
      bounty: {
        id: `b-janitor-${Date.now()}-${task.id}`,
        title: `[Audit] Cập nhật: ${task.title}`,
        description:
          task.type === 'duplicate'
            ? 'Bài viết có dấu hiệu trùng nội dung. Cần gộp và chuẩn hóa source of truth.'
            : 'Bài viết có dấu hiệu lỗi thời. Cần cập nhật quy trình, mốc thời gian và nguồn tham chiếu mới.',
        requester: 'AI Janitor',
        requesterId: 'system-janitor',
        reward: task.type === 'duplicate' ? 280 : 220,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tags: ['Knowledge', 'Audit', task.type === 'duplicate' ? 'Duplicate' : 'Outdated'],
        hot: task.type !== 'archived',
        acceptedBy: [],
        status: 'open',
        createdAt: new Date().toISOString().split('T')[0],
      },
    });
    addToast('Đã tạo bounty từ cảnh báo audit', 'success');
  };

  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 animate-slide-up">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-400 rounded-xl text-white shadow-md shadow-orange-500/20">
              <AlertTriangle size={24} />
            </div>
            Dọn rác dữ liệu
          </h1>
          <p className="text-gray-500">Giữ cho iWiki luôn sạch sẽ, chính xác và cập nhật.</p>
        </div>

        <div className="flex gap-4">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-xl">
              <ShieldAlert className="text-green-500" size={24} />
            </div>
            <div>
              <div className="text-sm text-gray-600 font-medium">Sức khỏe dữ liệu</div>
              <div className="text-2xl font-bold text-gray-900">{dataHealth}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-slide-up stagger-1">
        {[
          { icon: Database, value: state.articles.length.toLocaleString(), label: 'Tổng số bài viết', color: 'text-blue-600', bg: 'from-blue-50 to-indigo-50' },
          { icon: FileWarning, value: outdatedCount.toLocaleString(), label: 'Bài viết quá hạn', color: 'text-orange-600', bg: 'from-orange-50 to-amber-50' },
          { icon: Copy, value: duplicateCount.toLocaleString(), label: 'Bài viết trùng lặp', color: 'text-purple-600', bg: 'from-purple-50 to-pink-50' },
        ].map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div key={i} className="bg-white border border-gray-200/80 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group">
              <div className={`p-3 bg-gradient-to-br ${metric.bg} ${metric.color} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                <div className="text-sm text-gray-500">{metric.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Janitor Banner */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100/60 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-slide-up stagger-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-200/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="flex items-start gap-4 relative">
          <div className="bg-white p-2.5 rounded-xl shadow-sm shrink-0">
            <Sparkles className="text-indigo-500" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">AI Janitor đã quét hệ thống</h3>
            <p className="text-sm text-gray-600">Phát hiện 12 bài viết có thể đã lỗi thời và 3 bài viết trùng lặp trong tuần qua.</p>
          </div>
        </div>
        <Button onClick={() => setShowReport(true)} className="whitespace-nowrap relative" variant="primary">
          Xem báo cáo AI
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-gray-200 pb-px animate-slide-up stagger-3">
        {[
          { id: 'all', label: 'Tất cả vấn đề' },
          { id: 'outdated', label: 'Quá hạn' },
          { id: 'duplicate', label: 'Trùng lặp' },
          { id: 'archived', label: 'Cần lưu trữ' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${activeTab === tab.id
              ? 'border-[#f76226] text-[#f76226]'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredTasks.length > 0 && (
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">Đã chọn {selectedIds.length} mục</span>
            <button onClick={bulkMarkAccurate} className="px-3 py-1.5 text-xs font-bold bg-gray-900 text-white rounded-lg">Bulk xử lý</button>
          </div>
        )}
        {filteredTasks.map((task, i) => (
          <div key={task.id} className={`card-premium p-5 animate-slide-up stagger-${Math.min(i + 4, 6)}`}>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <label className="inline-flex items-center gap-2 text-xs text-gray-500 mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(task.id)}
                    onChange={(e) => {
                      setSelectedIds(prev => e.target.checked ? [...prev, task.id] : prev.filter(id => id !== task.id));
                    }}
                  />
                  Chọn cho bulk action
                </label>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${task.type === 'outdated' ? 'bg-orange-100 text-orange-700' :
                    task.type === 'duplicate' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                    {task.issue}
                  </span>
                  <span className="text-xs text-gray-500">Cập nhật: {task.lastUpdated}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <FileText size={18} className="text-gray-400" />
                  {task.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4">Tác giả: <span className="font-medium text-gray-700">{task.author}</span></p>

                {/* AI Suggestion Box */}
                <div className="bg-gradient-to-r from-indigo-50/80 to-purple-50/40 border-l-4 border-indigo-400 rounded-xl p-4 flex items-start gap-3">
                  <Sparkles size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-indigo-900 leading-relaxed">
                    <span className="font-semibold">AI Gợi ý:</span> {task.aiSuggestion}
                  </p>
                </div>
              </div>

              <div className="flex flex-row lg:flex-col items-center lg:items-end justify-start lg:justify-center gap-2 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6 shrink-0">
                <button
                  onClick={() => handleUpdate(task.id, task.title)}
                  className="w-full lg:w-auto px-4 py-2 bg-gradient-to-r from-[#f76226] to-[#FF8A6A] text-white text-sm font-medium rounded-lg hover:shadow-md hover:shadow-[#f76226]/20 transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
                >
                  <RefreshCw size={16} /> Cập nhật
                </button>
                <button
                  onClick={() => handleDismiss(task.id)}
                  className="w-full lg:w-auto px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
                >
                  <CheckCircle size={16} className="text-green-500" /> Vẫn chính xác
                </button>
                <button
                  onClick={() => createBountyFromTask(task)}
                  className="w-full lg:w-auto px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
                >
                  <Target size={16} /> Tạo bounty
                </button>
                <button
                  onClick={() => handleArchive(task.id)}
                  className="w-full lg:w-auto px-4 py-2 bg-white border border-gray-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 hover:border-red-200 transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
                >
                  <Trash2 size={16} /> Lưu trữ
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredTasks.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200 animate-fade-in">
            <div className="p-4 bg-white rounded-full inline-block mb-4 shadow-sm">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Mọi thứ đã sạch sẽ!</h3>
            <p className="text-gray-500">Không còn vấn đề nào cần xử lý trong mục này.</p>
          </div>
        )}
      </div>

      <Modal
        open={showReport}
        onOpenChange={setShowReport}
        maxWidthClassName="max-w-2xl"
        title={
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-indigo-500" />
            Báo cáo phân tích AI (Tháng 10/2024)
          </div>
        }
        footer={
          <div className="flex justify-end">
            <Button variant="primary" onClick={() => setShowReport(false)} className="bg-indigo-600 hover:bg-indigo-700">
              Đã hiểu
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Tóm tắt tình trạng</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Hệ thống iWiki hiện đang lưu trữ 1,248 bài viết. Trong tháng qua, AI đã quét toàn bộ dữ liệu và phát hiện 156 bài viết (chiếm
              12.5%) có dấu hiệu lỗi thời dựa trên ngày cập nhật và nội dung không còn phù hợp với các quy trình mới.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <h4 className="font-bold text-gray-900 mb-3 text-sm">Các vấn đề chính cần xử lý:</h4>
            <ul className="space-y-3">
              {[
                { color: 'bg-orange-500', text: <><strong>Tài liệu Mobile App:</strong> 45 bài viết liên quan đến quy trình release iOS/Android cần được review do có sự thay đổi từ Apple/Google.</> },
                { color: 'bg-blue-500', text: <><strong>Trùng lặp nội dung:</strong> Phát hiện 8 cụm bài viết (tổng cộng 24 bài) có nội dung giống nhau trên 80%. Đề xuất gộp để tránh gây nhầm lẫn cho người đọc.</> },
                { color: 'bg-red-500', text: <><strong>Chính sách nhân sự:</strong> Các bài viết về WFH mùa dịch không còn giá trị áp dụng, cần được chuyển vào kho lưu trữ (Archive).</> },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <div className={`w-1.5 h-1.5 rounded-full ${item.color} mt-1.5 shrink-0`}></div>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Đề xuất hành động</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Hệ thống đã tự động tạo các nhiệm vụ "Săn thưởng" (Bounties) cho các bài viết quan trọng cần cập nhật gấp. Các bài viết còn lại đã được gắn
              cờ cảnh báo để tác giả tự review.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
