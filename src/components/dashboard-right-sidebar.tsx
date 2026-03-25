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
  if (rank === 1) return 'text-[var(--ds-fg-orange-strong)] bg-[var(--ds-bg-orange-subtle)] ring-2 ring-[var(--ds-border-tertiary)]';
  if (rank === 2) return 'text-[var(--ds-text-secondary)] bg-[var(--ds-bg-secondary)] ring-2 ring-[var(--ds-border-tertiary)]';
  if (rank === 3) return 'text-[var(--ds-fg-accent-secondary)] bg-[var(--ds-bg-accent-secondary-subtle)] ring-2 ring-[var(--ds-border-tertiary)]';
  return '';
}

function DashboardRightSidebar({ leaderboard, recentReadArticles, onOpenArticle }: DashboardRightSidebarProps) {
  return (
    <div className="space-y-8">
      {/* Leaderboard */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="text-[var(--ds-fg-orange-strong)]" size={20} />
          <h2 className="text-xl font-bold text-[var(--ds-text-primary)]">Bảng xếp hạng</h2>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm">
          {leaderboard.map((user, index) => (
            <div key={user.rank} className={`flex items-center gap-3 p-4 ${index !== leaderboard.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50/80 transition-all duration-200 group`}>
              <div className="w-8 font-bold text-center flex justify-center shrink-0">
                {user.rank <= 3 ? (
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${getMedalStyle(user.rank)}`}><Medal size={16} /></div>
                ) : (
                  <span className="text-[var(--ds-text-secondary)] text-sm">{user.rank}</span>
                )}
              </div>
              <img src={user.avatar} alt="Avatar" className={`w-10 h-10 rounded-full border-2 shrink-0 ${user.rank === 1 ? 'border-[var(--ds-border-accent-primary)] shadow-md' : 'border-[var(--ds-border-secondary)]'}`} referrerPolicy="no-referrer" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-[var(--ds-text-primary)] truncate group-hover:text-[var(--ds-fg-accent-primary)] transition-colors">{user.name}</div>
                <div className="text-[10px] text-[var(--ds-text-secondary)] truncate">{user.role}</div>
              </div>
              <div className="text-sm font-bold text-[var(--ds-fg-accent-primary)] whitespace-nowrap">{user.score} <span className="text-xs text-[var(--ds-text-secondary)] font-normal">pts</span></div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reads */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="text-[var(--ds-fg-info)]" size={18} />
          <h3 className="text-lg font-bold text-[var(--ds-text-primary)]">Đọc gần đây</h3>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-3 space-y-2">
          {recentReadArticles.length === 0 ? (
            <p className="text-xs text-gray-500 p-2">Bạn chưa mở bài nào trong phiên demo này.</p>
          ) : (
            recentReadArticles.map(({ meta, article }) => (
              <button key={article.id} onClick={() => onOpenArticle(article.id)} className="w-full text-left p-2.5 rounded-xl hover:bg-[var(--ds-bg-secondary)] transition-colors">
                <p className="text-sm font-semibold text-[var(--ds-text-primary)] line-clamp-1">{article.title}</p>
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
