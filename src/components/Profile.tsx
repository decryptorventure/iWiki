import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../App';
import { Coins, Eye, Flame, MessageSquare, Edit3, Check, Heart } from 'lucide-react';
import { Button, Input, Modal } from '@frontend-team/ui-kit';
import ProfileBadgeGrid from './profile-badge-grid';

export default function Profile() {
  const { state, dispatch } = useApp();
  const { addToast } = useToast();
  const { currentUser, articles } = state;

  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: currentUser.name, title: currentUser.title, avatar: currentUser.avatar });

  const myArticles = articles.filter(a => a.author.id === currentUser.id && a.status === 'published');
  const favoriteIds = state.favoritesByUser[currentUser.id] || [];
  const favoriteArticles = articles.filter((a) => favoriteIds.includes(a.id));
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
            <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-[#f76226]/20 shadow-lg">
              <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
              <span className="w-3 h-3 bg-white rounded-full"></span>
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
              <h1 className="text-2xl font-extrabold text-gray-900">{currentUser.name}</h1>
              <span className="px-3 py-1 bg-gradient-to-r from-[#f76226] to-orange-400 text-white text-xs font-bold rounded-full shadow-sm">
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
                <div className="h-full bg-gradient-to-r from-[#f76226] to-amber-400 rounded-full transition-all duration-1000 relative overflow-hidden" style={{ width: `${xpPercent}%` }}>
                  <div className="absolute inset-0 bg-white/20 animate-shimmer rounded-full"></div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1">{(currentUser.xpToNext - currentUser.xp).toLocaleString()} XP cần để lên Level {currentUser.level + 1}</p>
            </div>

            <Button variant="border" size="s" onClick={() => setShowEditModal(true)} className="mx-auto sm:mx-0">
              <Edit3 size={15} /> Chỉnh sửa hồ sơ
            </Button>
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
        <div>
          <ProfileBadgeGrid badges={currentUser.badges} currentUserName={currentUser.name} currentUserXp={currentUser.xp} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Flame size={20} className="text-[#f76226]" /> Bài viết gần đây</h2>
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
                    <p className="font-bold text-sm text-gray-900 line-clamp-1 hover:text-[#f76226] transition-colors">{article.title}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                      <span className="flex items-center gap-1"><Eye size={12} /> {article.views}</span>
                      <span className="flex items-center gap-1"><Flame size={12} className="text-[#f76226]" /> {article.likes}</span>
                      <span>{article.createdAt}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4 flex items-center gap-2">
            <Heart size={20} className="text-rose-500" /> Bài viết đã lưu
          </h2>
          <div className="space-y-3">
            {favoriteArticles.length === 0 ? (
              <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-2xl">
                <Heart size={28} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Bạn chưa lưu bài viết nào</p>
              </div>
            ) : (
              favoriteArticles.slice(0, 4).map((article) => (
                <div key={article.id} onClick={() => { dispatch({ type: 'SET_SELECTED_ARTICLE', articleId: article.id }); dispatch({ type: 'INCREMENT_VIEWS', articleId: article.id }); }} className="card-premium p-4 cursor-pointer flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-gray-900 line-clamp-1 hover:text-[#f76226] transition-colors">{article.title}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                      <span className="flex items-center gap-1"><Eye size={12} /> {article.views}</span>
                      <span className="flex items-center gap-1"><Flame size={12} className="text-[#f76226]" /> {article.likes}</span>
                      <span>{article.createdAt}</span>
                    </div>
                  </div>
                  <Heart className="text-rose-500 fill-current shrink-0" size={16} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        title="Chỉnh sửa hồ sơ"
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="subtle" size="s" onClick={() => setShowEditModal(false)}>Hủy</Button>
            <Button variant="primary" size="s" onClick={handleSaveProfile}>
              <Check size={16} /> Lưu thay đổi
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
            <Input type="text" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chức danh</label>
            <Input type="text" value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Avatar</label>
            <Input type="text" value={editForm.avatar} onChange={e => setEditForm(f => ({ ...f, avatar: e.target.value }))} placeholder="https://..." className="w-full" />
            {editForm.avatar && <img src={editForm.avatar} alt="Preview" className="w-16 h-16 rounded-full mt-2 object-cover ring-2 ring-[#f76226]/20" referrerPolicy="no-referrer" />}
          </div>
        </div>
      </Modal>
    </div>
  );
}
