import { ComponentType, useMemo } from 'react';
import { CheckCircle2, Clock3, AlertTriangle, FolderOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { can } from '../lib/permissions';

export default function ManagerDashboard() {
  const { state, dispatch } = useApp();
  const scopedArticles = useMemo(
    () => state.articles.filter(a => can(state.currentUser, 'article.read', a)),
    [state.articles, state.currentUser]
  );
  const reviewQueue = scopedArticles.filter(a => a.status === 'in_review');
  const rejected = scopedArticles.filter(a => a.status === 'rejected');
  const outdated = scopedArticles.filter(a => {
    const age = Date.now() - new Date(a.updatedAt).getTime();
    return age > 180 * 24 * 60 * 60 * 1000;
  });

  if (!can(state.currentUser, 'manager.access') && state.currentUser.role !== 'admin') {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Bạn không có quyền truy cập Manager View.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-12 animate-fade-in">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Manager View</h1>
      <p className="text-gray-500 mb-8">Theo dõi queue duyệt bài, bài bị từ chối và chất lượng tri thức theo scope.</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card icon={Clock3} label="Chờ duyệt" value={reviewQueue.length} />
        <Card icon={AlertTriangle} label="Bị từ chối" value={rejected.length} />
        <Card icon={FolderOpen} label="Trong scope" value={scopedArticles.length} />
        <Card icon={CheckCircle2} label="Published" value={scopedArticles.filter(a => a.status === 'published').length} />
      </div>

      <section className="bg-white border border-gray-200 rounded-2xl p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Queue duyệt nội dung</h2>
        {reviewQueue.length === 0 ? (
          <p className="text-sm text-gray-500">Không có bài nào đang chờ duyệt.</p>
        ) : (
          <div className="space-y-3">
            {reviewQueue.map(article => (
              <div key={article.id} className="flex items-center justify-between gap-4 p-3 border border-gray-100 rounded-xl">
                <div>
                  <div className="font-semibold text-gray-900">{article.title}</div>
                  <div className="text-xs text-gray-500">Owner: {article.author.name} • Folder: {article.folderName || article.folderId}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => dispatch({ type: 'APPROVE_ARTICLE', articleId: article.id, approverId: state.currentUser.id })}
                    className="px-3 py-1.5 text-xs font-bold bg-green-500 text-white rounded-lg"
                  >
                    Duyệt
                  </button>
                  <button
                    onClick={() => dispatch({ type: 'REJECT_ARTICLE', articleId: article.id, approverId: state.currentUser.id, reason: 'Cần bổ sung nội dung chi tiết hơn theo checklist.' })}
                    className="px-3 py-1.5 text-xs font-bold bg-gray-100 text-gray-700 rounded-lg"
                  >
                    Từ chối
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-white border border-gray-200 rounded-2xl p-5 mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Bài cần bảo trì (&gt; 180 ngày chưa cập nhật)</h2>
        {outdated.length === 0 ? (
          <p className="text-sm text-gray-500">Không có cảnh báo outdated.</p>
        ) : (
          <ul className="space-y-2">
            {outdated.slice(0, 8).map(a => (
              <li key={a.id} className="text-sm text-gray-700">- {a.title}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Card({ icon: Icon, label, value }: { icon: ComponentType<{ size?: number; className?: string }>; label: string; value: number }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{label}</span>
        <Icon size={16} className="text-gray-400" />
      </div>
      <div className="text-2xl font-extrabold text-gray-900 mt-2">{value}</div>
    </div>
  );
}
