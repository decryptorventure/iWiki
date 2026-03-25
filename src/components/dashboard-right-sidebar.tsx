// Leaderboard and recent reads sidebar for Dashboard
import React, { memo } from 'react';
import { Trophy, Medal, Clock } from 'lucide-react';
import { Article } from '../store/useAppStore';

interface LeaderboardEntry {
  rank: number;
  name: string;
  role: string;
  avatar?: string;
  score: number;
}

interface RecentReadItem {
  meta: { articleId: string; count: number; lastReadAt: string };
  article: Article;
}

interface DashboardRightSidebarProps {
  leaderboard: LeaderboardEntry[];
  recentReadArticles: RecentReadItem[];
  onOpenArticle: (id: string) => void;
}

function getMedalStyle(rank: number) {
  if (rank === 1) return 'text-yellow-500 bg-yellow-50 ring-2 ring-yellow-200';
  if (rank === 2) return 'text-gray-400 bg-gray-50 ring-2 ring-gray-200';
  if (rank === 3) return 'text-amber-600 bg-amber-50 ring-2 ring-amber-200';
  return '';
}

function DashboardRightSidebar({ leaderboard, recentReadArticles, onOpenArticle }: DashboardRightSidebarProps) {
  return (
    <div className="space-y-8">
      {/* Leaderboard */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="text-yellow-500" size={20} />
          <h2 className="text-xl font-bold text-gray-900">Bảng xếp hạng</h2>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm">
          {leaderboard.map((user, index) => (
            <div key={user.rank} className={`flex items-center gap-3 p-4 ${index !== leaderboard.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50/80 transition-all duration-200 group`}>
              <div className="w-8 font-bold text-center flex justify-center shrink-0">
                {user.rank <= 3 ? (
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${getMedalStyle(user.rank)}`}><Medal size={16} /></div>
                ) : (
                  <span className="text-gray-400 text-sm">{user.rank}</span>
                )}
              </div>
              <img src={user.avatar} alt="Avatar" className={`w-10 h-10 rounded-full border-2 shrink-0 ${user.rank === 1 ? 'border-yellow-300 shadow-md shadow-yellow-500/20' : 'border-gray-100'}`} referrerPolicy="no-referrer" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-gray-900 truncate group-hover:text-[#f76226] transition-colors">{user.name}</div>
                <div className="text-[10px] text-gray-500 truncate">{user.role}</div>
              </div>
              <div className="text-sm font-bold text-[#f76226] whitespace-nowrap">{user.score} <span className="text-xs text-gray-500 font-normal">pts</span></div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reads */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="text-indigo-500" size={18} />
          <h3 className="text-lg font-bold text-gray-900">Đọc gần đây</h3>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-3 space-y-2">
          {recentReadArticles.length === 0 ? (
            <p className="text-xs text-gray-500 p-2">Bạn chưa mở bài nào trong phiên demo này.</p>
          ) : (
            recentReadArticles.map(({ meta, article }) => (
              <button key={article.id} onClick={() => onOpenArticle(article.id)} className="w-full text-left p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                <p className="text-sm font-semibold text-gray-900 line-clamp-1">{article.title}</p>
                <p className="text-[11px] text-gray-500 mt-1">
                  Đọc {meta.count} lần • {new Date(meta.lastReadAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(DashboardRightSidebar);
