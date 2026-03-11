import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../App';
import { TrendingUp, Award, Coins, Eye, MessageSquare, Flame, Edit3, X, Check, User, Camera, Zap } from 'lucide-react';

export default function Profile() {
  const { state, dispatch } = useApp();
  const { addToast } = useToast();
  const { currentUser, articles } = state;

  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: currentUser.name, title: currentUser.title, avatar: currentUser.avatar });

  const myArticles = articles.filter(a => a.author.id === currentUser.id && a.status === 'published');
  const totalViews = myArticles.reduce((s, a) => s + a.views, 0);
  const totalLikes = myArticles.reduce((s, a) => s + a.likes, 0);
  const totalComments = myArticles.reduce((s, a) => s + a.comments.length, 0);
  const xpPercent = Math.round((currentUser.xp / currentUser.xpToNext) * 100);

  const handleSaveProfile = () => {
    if (!editForm.name.trim()) { addToast('Tên không được để trống', 'warning'); return; }
    dispatch({ type: 'UPDATE_USER', updates: { name: editForm.name.trim(), title: editForm.title.trim(), avatar: editForm.avatar.trim() || currentUser.avatar } });
    setShowEditModal(false);
    addToast('Đã cập nhật hồ sơ thành công 🎉', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-8 py-12 animate-fade-in">
      {/* Profile Card */}
      <div className="bg-gradient-to-br from-orange-50/80 via-amber-50/50 to-white rounded-3xl border border-orange-100/50 p-8 mb-8 shadow-sm animate-slide-up">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-[#FF6B4A]/20 shadow-lg">
              <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
              <span className="w-3 h-3 bg-white rounded-full"></span>
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
              <h1 className="text-2xl font-extrabold text-gray-900">{currentUser.name}</h1>
              <span className="px-3 py-1 bg-gradient-to-r from-[#FF6B4A] to-orange-400 text-white text-xs font-bold rounded-full shadow-sm">
                Level {currentUser.level}
              </span>
            </div>
            <p className="text-gray-500 mb-4">{currentUser.title} · {currentUser.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}</p>

            {/* XP Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5 text-xs text-gray-500">
                <span>{currentUser.xp.toLocaleString()} XP</span>
                <span className="font-medium text-gray-700">{xpPercent}% → Level {currentUser.level + 1}</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#FF6B4A] to-amber-400 rounded-full transition-all duration-1000 relative overflow-hidden" style={{ width: `${xpPercent}%` }}>
                  <div className="absolute inset-0 bg-white/20 animate-shimmer rounded-full"></div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1">{(currentUser.xpToNext - currentUser.xp).toLocaleString()} XP cần để lên Level {currentUser.level + 1}</p>
            </div>

            <button onClick={() => setShowEditModal(true)} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm mx-auto sm:mx-0 active:scale-95">
              <Edit3 size={15} /> Chỉnh sửa hồ sơ
            </button>
          </div>

          <div className="flex items-center gap-2 px-4 py-3 bg-white rounded-2xl border border-yellow-200 shadow-sm">
            <Coins className="text-yellow-500" size={20} />
            <div>
              <div className="text-xs text-gray-500">iKame Coins</div>
              <div className="text-lg font-bold text-gray-900">{currentUser.coins.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-slide-up stagger-1">
        {[
          { label: 'Bài viết', value: myArticles.length, icon: Flame, color: 'from-orange-500 to-red-500', bg: 'from-orange-50 to-red-50' },
          { label: 'Lượt xem', value: totalViews.toLocaleString(), icon: Eye, color: 'from-blue-500 to-indigo-500', bg: 'from-blue-50 to-indigo-50' },
          { label: 'Được thắp lửa', value: totalLikes, icon: Flame, color: 'from-orange-500 to-emerald-500', bg: 'from-orange-50 to-emerald-50' },
          { label: 'Bình luận', value: totalComments, icon: MessageSquare, color: 'from-purple-500 to-pink-500', bg: 'from-purple-50 to-pink-50' },
        ].map(stat => {
          const Icon = stat.icon; return (
            <div key={stat.label} className="card-premium p-5 group">
              <div className={`p-2.5 bg-gradient-to-br ${stat.bg} rounded-xl inline-block mb-3 group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={18} className="text-gray-600" />
              </div>
              <div className="text-2xl font-extrabold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slide-up stagger-2">
        {/* Badges */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Award size={20} className="text-yellow-500" /> Thành tích</h2>
          <div className="grid grid-cols-2 gap-3 mb-8">
            {currentUser.badges.map(badge => (
              <div key={badge.id} className={`card-premium p-4 flex items-center gap-3 ${!badge.earned && 'opacity-40'}`}>
                <span className="text-3xl">{badge.icon}</span>
                <div>
                  <p className="text-sm font-bold text-gray-900">{badge.name}</p>
                  <p className="text-xs text-gray-400">{badge.earned ? 'Đã đạt được' : 'Chưa mở khóa'}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Gamification: Leaderboard Mock */}
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><TrendingUp size={20} className="text-orange-500" /> Bảng xếp hạng tháng</h2>
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-4">
             {[
               { rank: 1, name: 'Tạ Minh L.', xp: 4500, self: false },
               { rank: 2, name: 'Nguyễn T.', xp: 4200, self: false },
               { rank: 3, name: currentUser.name, xp: currentUser.xp, self: true },
               { rank: 4, name: 'Phạm A.', xp: 3900, self: false }
             ].map(u => (
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
        </div>

        {/* Recent Articles */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Flame size={20} className="text-[#FF6B4A]" /> Bài viết gần đây</h2>
          <div className="space-y-3">
            {myArticles.length === 0 ? (
              <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-2xl">
                <Flame size={28} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Chưa có bài viết nào</p>
              </div>
            ) : (
              myArticles.slice(0, 4).map(article => (
                <div key={article.id} onClick={() => { dispatch({ type: 'SET_SELECTED_ARTICLE', articleId: article.id }); dispatch({ type: 'INCREMENT_VIEWS', articleId: article.id }); }} className="card-premium p-4 cursor-pointer flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-gray-900 line-clamp-1 hover:text-[#FF6B4A] transition-colors">{article.title}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                      <span className="flex items-center gap-1"><Eye size={12} /> {article.views}</span>
                      <span className="flex items-center gap-1"><Flame size={12} className="text-[#FF6B4A]" /> {article.likes}</span>
                      <span>{article.createdAt}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-modal-backdrop">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-modal-enter">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Chỉnh sửa hồ sơ</h3>
              <button onClick={() => setShowEditModal(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-all active:scale-90"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                <input type="text" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chức danh</label>
                <input type="text" value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Avatar</label>
                <input type="text" value={editForm.avatar} onChange={e => setEditForm(f => ({ ...f, avatar: e.target.value }))} placeholder="https://..." className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] outline-none transition-all" />
                {editForm.avatar && <img src={editForm.avatar} alt="Preview" className="w-16 h-16 rounded-full mt-2 object-cover ring-2 ring-[#FF6B4A]/20" referrerPolicy="no-referrer" />}
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50/80 flex justify-end gap-3">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-xl transition-all active:scale-95">Hủy</button>
              <button onClick={handleSaveProfile} className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6A] rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2">
                <Check size={16} /> Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
