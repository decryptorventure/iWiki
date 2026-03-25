// Badge collection grid and leaderboard for Profile page
import React from 'react';
import { Award, TrendingUp, Zap } from 'lucide-react';
import { Badge } from '../store/useAppStore';

interface ProfileBadgeGridProps {
  badges: Badge[];
  currentUserName: string;
  currentUserXp: number;
}

export default function ProfileBadgeGrid({ badges, currentUserName, currentUserXp }: ProfileBadgeGridProps) {
  const leaderboard = [
    { rank: 1, name: 'Tạ Minh L.', xp: 4500, self: false },
    { rank: 2, name: 'Nguyễn T.', xp: 4200, self: false },
    { rank: 3, name: currentUserName, xp: currentUserXp, self: true },
    { rank: 4, name: 'Phạm A.', xp: 3900, self: false },
  ];

  return (
    <>
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Award size={20} className="text-yellow-500" /> Thành tích
      </h2>
      <div className="grid grid-cols-2 gap-3 mb-8">
        {badges.map(badge => (
          <div key={badge.id} className={`card-premium p-4 flex items-center gap-3 ${!badge.earned && 'opacity-40'}`}>
            <span className="text-3xl">{badge.icon}</span>
            <div>
              <p className="text-sm font-bold text-gray-900">{badge.name}</p>
              <p className="text-xs text-gray-400">{badge.earned ? 'Đã đạt được' : 'Chưa mở khóa'}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <TrendingUp size={20} className="text-orange-500" /> Bảng xếp hạng tháng
      </h2>
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-4">
        {leaderboard.map(u => (
          <div key={u.rank} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${u.self ? 'bg-orange-50/80 border border-orange-100/50' : 'hover:bg-gray-50'}`}>
            <div className={`w-6 text-center font-bold ${u.rank === 1 ? 'text-yellow-500' : u.rank === 2 ? 'text-gray-400' : u.rank === 3 ? 'text-orange-400' : 'text-gray-300'}`}>#{u.rank}</div>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex shrink-0 items-center justify-center font-bold text-gray-500 text-xs">{u.name.charAt(0)}</div>
            <div className="flex-1">
              <p className={`text-sm font-bold ${u.self ? 'text-orange-700' : 'text-gray-800'}`}>{u.name} {u.self && '(Bạn)'}</p>
            </div>
            <div className="text-xs font-bold text-gray-500 flex items-center gap-1"><Zap size={12} className="text-amber-400" /> {u.xp} XP</div>
          </div>
        ))}
      </div>
    </>
  );
}
