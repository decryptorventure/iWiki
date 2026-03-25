// Single article card for MyArticles list — actions passed as callbacks
import React from 'react';
import { Eye, Flame, MessageSquare, Edit2, Trash2, MoreVertical, CheckCircle } from 'lucide-react';
import { Article } from '../store/useAppStore';
import { Button, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, Badge } from '@frontend-team/ui-kit';

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
          {article.status === 'draft' && <Badge color="amber" size="xs">Nháp</Badge>}
          {article.status === 'in_review' && <Badge color="blue" size="xs">Chờ duyệt</Badge>}
          {article.status === 'approved' && <Badge color="green" size="xs">Đã duyệt</Badge>}
          {article.status === 'rejected' && <Badge color="red" size="xs">Bị từ chối</Badge>}
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
                <Badge key={tag} color="gray" size="xs" rounded={false}>{tag}</Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="relative shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="subtle" size="icon-s">
              <MoreVertical size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={onView} className="gap-2.5">
              <Eye size={16} className="text-gray-400" /> Xem bài viết
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onEdit} className="gap-2.5">
              <Edit2 size={16} className="text-blue-500" /> Chỉnh sửa
            </DropdownMenuItem>
            {(article.status === 'draft' || article.status === 'rejected') && (
              <DropdownMenuItem onSelect={onSubmitReview} className="gap-2.5">
                <CheckCircle size={16} className="text-emerald-500" /> Gửi duyệt
              </DropdownMenuItem>
            )}
            {article.status === 'approved' && (
              <DropdownMenuItem onSelect={onPublish} className="gap-2.5">
                <CheckCircle size={16} className="text-orange-500" /> Xuất bản ngay
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onDeleteRequest} className="gap-2.5 text-red-600 focus:text-red-600 focus:bg-red-50">
              <Trash2 size={16} /> Xóa bài viết
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
