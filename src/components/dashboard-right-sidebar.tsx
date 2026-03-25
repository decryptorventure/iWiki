// Leaderboard and recent reads sidebar for Dashboard
import React, { memo, useState } from 'react';
import { Trophy, Medal, Clock, Users, User as UserIcon } from 'lucide-react';
import { Article } from '../store/useAppStore';

interface LeaderboardEntry {
  rank: number;
  name: string;
  role?: string;
  avatar?: string;
  score: number;
  team?: string;
}

interface RecentReadItem {
  meta: { articleId: string; count: number; lastReadAt: string };
  article: Article;
}

interface DashboardRightSidebarProps {
  individualLeaderboard: LeaderboardEntry[];
  teamLeaderboard: LeaderboardEntry[];
  recentReadArticles: RecentReadItem[];
  onOpenArticle: (id: string) => void;
}

function getMedalStyle(rank: number) {
  if (rank === 1) return 'text-[var(--ds-fg-orange-strong)] bg-[var(--ds-bg-orange-subtle)] ring-2 ring-[var(--ds-border-tertiary)]';
  if (rank === 2) return 'text-[var(--ds-text-secondary)] bg-[var(--ds-bg-secondary)] ring-2 ring-[var(--ds-border-tertiary)]';
  if (rank === 3) return 'text-[var(--ds-fg-accent-secondary)] bg-[var(--ds-bg-accent-secondary-subtle)] ring-2 ring-[var(--ds-border-tertiary)]';
  return '';
}

function DashboardRightSidebar({ individualLeaderboard, teamLeaderboard, recentReadArticles, onOpenArticle }: DashboardRightSidebarProps) {
  const [activeTab, setActiveTab] = useState<'individual' | 'team'>('individual');
  const currentLeaderboard = activeTab === 'individual' ? individualLeaderboard : teamLeaderboard;

  return (
    <div className="space-y-8">
      {/* Leaderboard */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="text-[var(--ds-fg-orange-strong)]" size={20} />
            <h2 className="text-xl font-bold text-[var(--ds-text-primary)]">Bảng xếp hạng</h2>
          </div>
        </div>

        {/* Tab System */}
        <div className="flex p-1 bg-gray-100/80 rounded-xl mb-4">
          <button
            onClick={() => setActiveTab('individual')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'individual' ? 'bg-white text-[var(--ds-fg-accent-primary)] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <UserIcon size={14} /> Cá nhân
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'team' ? 'bg-white text-[var(--ds-fg-accent-primary)] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Users size={14} /> Team
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm">
          {currentLeaderboard.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500 italic">Chưa có dữ liệu xếp hạng</div>
          ) : (
            currentLeaderboard.map((item, index) => (
              <div key={`${activeTab}-${item.rank}-${item.name}`} className={`flex items-center gap-3 p-4 ${index !== currentLeaderboard.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50/80 transition-all duration-200 group`}>
                <div className="w-8 font-bold text-center flex justify-center shrink-0">
                  {item.rank <= 3 ? (
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center ${getMedalStyle(item.rank)}`}><Medal size={16} /></div>
                  ) : (
                    <span className="text-[var(--ds-text-secondary)] text-sm">{item.rank}</span>
                  )}
                </div>
                
                {item.avatar ? (
                  <img src={item.avatar} alt="Avatar" className={`w-10 h-10 rounded-full border-2 shrink-0 ${item.rank === 1 ? 'border-[var(--ds-border-accent-primary)] shadow-md' : 'border-[var(--ds-border-secondary)]'}`} referrerPolicy="no-referrer" />
                ) : (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-[var(--ds-bg-secondary)] border-2 shrink-0 ${item.rank === 1 ? 'border-[var(--ds-border-accent-primary)]' : 'border-gray-100'}`}>
                    <Users size={18} className="text-[var(--ds-icon-secondary)]" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-[var(--ds-text-primary)] truncate group-hover:text-[var(--ds-fg-accent-primary)] transition-colors">{item.name}</div>
                  <div className="text-[10px] text-[var(--ds-text-secondary)] truncate">
                    {activeTab === 'individual' ? (item.team || item.role) : 'Đội ngũ đóng góp'}
                  </div>
                </div>
                <div className="text-sm font-bold text-[var(--ds-fg-accent-primary)] whitespace-nowrap">
                  {item.score} <span className="text-xs text-[var(--ds-text-secondary)] font-normal">bài</span>
                </div>
              </div>
            ))
          )}
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
