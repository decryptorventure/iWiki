// Single article card for MyArticles list — actions passed as callbacks
import React from 'react';
import { Eye, Flame, MessageSquare, Edit2, Trash2, MoreVertical, CheckCircle } from 'lucide-react';
import { Article } from '../store/useAppStore';
import { Button } from '@frontend-team/ui-kit';

interface MyArticleCardProps {
  article: Article;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onView: () => void;
  onEdit: () => void;
  onSubmitReview: () => void;
  onPublish: () => void;
  onDeleteRequest: () => void;
}

export default function MyArticleCard({
  article, isMenuOpen, onToggleMenu, onView, onEdit, onSubmitReview, onPublish, onDeleteRequest,
}: MyArticleCardProps) {
  return (
    <div className="card-premium p-4 flex items-center gap-4 relative">
      {article.coverUrl && (
        <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100 hidden sm:block">
          <img src={article.coverUrl} alt="Cover" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
        </div>
      )}
      <div className="flex-1 min-w-0 cursor-pointer" onClick={onView}>
        <div className="flex items-center gap-2 mb-1">
          {article.status === 'draft' && <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-md">Nháp</span>}
          {article.status === 'in_review' && <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md">Chờ duyệt</span>}
          {article.status === 'approved' && <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md">Đã duyệt</span>}
          {article.status === 'rejected' && <span className="text-xs font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-md">Bị từ chối</span>}
          <h3 className="font-bold text-gray-900 text-sm truncate hover:text-[#f76226] transition-colors">{article.title}</h3>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>{article.updatedAt}</span>
          {article.status === 'published' && (
            <>
              <span className="flex items-center gap-1"><Eye size={12} /> {article.views}</span>
              <span className="flex items-center gap-1"><Flame size={12} className="text-[#f76226]" /> {article.likes}</span>
              <span className="flex items-center gap-1"><MessageSquare size={12} /> {article.comments.length}</span>
            </>
          )}
          {article.tags.length > 0 && (
            <div className="flex gap-1">
              {article.tags.slice(0, 2).map(tag => (
                <span key={tag} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px]">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="relative shrink-0">
        <Button variant="subtle" size="icon-s" onClick={onToggleMenu}>
          <MoreVertical size={18} />
        </Button>
        {isMenuOpen && (
          <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden animate-scale-in">
            <button onClick={onView} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"><Eye size={16} className="text-gray-400" /> Xem bài viết</button>
            <button onClick={onEdit} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"><Edit2 size={16} className="text-blue-500" /> Chỉnh sửa</button>
            {(article.status === 'draft' || article.status === 'rejected') && (
              <button onClick={onSubmitReview} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"><CheckCircle size={16} className="text-emerald-500" /> Gửi duyệt</button>
            )}
            {article.status === 'approved' && (
              <button onClick={onPublish} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <CheckCircle size={16} className="text-orange-500" /> Xuất bản ngay
              </button>
            )}
            <div className="border-t border-gray-100" />
            <button onClick={onDeleteRequest} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"><Trash2 size={16} /> Xóa bài viết</button>
          </div>
        )}
      </div>
    </div>
  );
}
