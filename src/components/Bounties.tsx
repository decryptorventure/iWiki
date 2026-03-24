import React, { useState } from 'react';
import { Coins, Target, Clock, Search, Filter, Flame, Trophy, Plus, Users, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../App';
import { Bounty } from '../store/useAppStore';

const CATEGORIES = ['all', 'Engineering', 'Product', 'HR', 'Data', 'DevOps', 'Backend'];

export default function Bounties() {
  const { state, dispatch } = useApp();
  const { addToast } = useToast();
  const { bounties, currentUser } = state;

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ title: '', description: '', reward: '', deadline: '', tags: '' });

  const filtered = bounties.filter(b => {
    const matchesTab = activeTab === 'all' || b.tags.some(t => t.toLowerCase() === activeTab.toLowerCase());
    const matchesSearch = !searchQuery || b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.requester.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalCoins = currentUser.coins;

  const handleAccept = (bountyId: string) => {
    const bounty = bounties.find(b => b.id === bountyId);
    if (!bounty) return;
    const isAccepted = bounty.acceptedBy.includes(currentUser.id);
    dispatch({ type: 'ACCEPT_BOUNTY', bountyId, userId: currentUser.id });
    if (!isAccepted) {
      dispatch({
        type: 'UPDATE_USER',
        updates: {
          coins: currentUser.coins + 25,
          xp: Math.min(currentUser.xp + 30, currentUser.xpToNext),
        },
      });
    }
    addToast(isAccepted ? 'Đã hủy nhận task' : 'Đã nhận task! Hãy viết bài và giao nộp sớm 🎯', isAccepted ? 'info' : 'success');
  };

  const handleCreate = () => {
    if (!createForm.title.trim()) { addToast('Vui lòng nhập tiêu đề nhiệm vụ', 'warning'); return; }
    if (!createForm.reward || isNaN(Number(createForm.reward))) { addToast('Vui lòng nhập phần thưởng hợp lệ', 'warning'); return; }

    const bounty: Bounty = {
      id: `b-${Date.now()}`,
      title: createForm.title.trim(),
      description: createForm.description.trim(),
      requester: currentUser.name,
      requesterId: currentUser.id,
      reward: Number(createForm.reward),
      deadline: createForm.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      tags: createForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      hot: false,
      acceptedBy: [],
      status: 'open',
      createdAt: new Date().toISOString().split('T')[0],
    };

    dispatch({ type: 'CREATE_BOUNTY', bounty });
    setCreateForm({ title: '', description: '', reward: '', deadline: '', tags: '' });
    setShowCreateModal(false);
    addToast('Đã đăng nhiệm vụ săn thưởng! 🎯', 'success');
  };

  const formatDeadline = (dateStr: string) => {
    const now = new Date();
    const deadline = new Date(dateStr);
    const diff = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'Đã hết hạn';
    if (diff === 0) return 'Hôm nay';
    if (diff === 1) return 'Ngày mai';
    if (diff < 7) return `${diff} ngày nữa`;
    return `${Math.ceil(diff / 7)} tuần nữa`;
  };

  return (
    <div className="max-w-5xl mx-auto px-8 py-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 animate-slide-up">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-[#f76226] to-orange-400 rounded-xl text-white shadow-md shadow-[#f76226]/20"><Target size={24} /></div>
            Săn thưởng tri thức
          </h1>
          <p className="text-gray-500">Đóng góp tài liệu còn thiếu để nhận iKame Coins và thăng hạng.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200/60 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="bg-white p-3 rounded-xl shadow-sm"><Trophy className="text-yellow-500" size={24} /></div>
            <div>
              <div className="text-sm text-gray-600 font-medium">Số dư của bạn</div>
              <div className="text-2xl font-bold text-gray-900 flex items-center gap-1">{totalCoins.toLocaleString()} <Coins className="text-yellow-500" size={20} /></div>
            </div>
          </div>
          <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#f76226] to-[#FF8A6A] text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-[#f76226]/20 transition-all duration-200 shadow-md active:scale-95">
            <Plus size={20} /> Tạo nhiệm vụ
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 bg-white border border-gray-200 rounded-2xl p-4">
        <h3 className="font-bold text-gray-900 mb-2">Quest tuần này</h3>
        <p className="text-sm text-gray-600">Hoàn thành 2 bounty hoặc cập nhật 1 bài outdated để nhận thêm 200 XP + badge "Knowledge Ranger".</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 animate-slide-up stagger-1">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Tìm kiếm nhiệm vụ..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#f76226]/20 focus:border-[#f76226]/50 outline-none transition-all hover:border-gray-300" />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          {CATEGORIES.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${activeTab === tab ? 'bg-gray-900 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'}`}>
              {tab === 'all' ? 'Tất cả' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Bounties List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20"><p className="text-gray-400 mb-4">Không tìm thấy nhiệm vụ nào</p></div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((bounty, i) => {
            const isAccepted = bounty.acceptedBy.includes(currentUser.id);
            return (
              <div key={bounty.id} className={`card-premium p-5 flex flex-col sm:flex-row sm:items-center gap-5 animate-slide-up stagger-${Math.min(i + 2, 6)}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    {bounty.hot && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider animate-pulse-glow"><Flame size={12} /> Hot</span>}
                    <span className="text-xs font-medium text-gray-500 flex items-center gap-1"><Clock size={12} /> Hạn: {formatDeadline(bounty.deadline)}</span>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md flex items-center gap-1"><Users size={12} /> {bounty.acceptedBy.length} người đang làm</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 hover:text-[#f76226] transition-colors mb-1">{bounty.title}</h3>
                  {bounty.description && <p className="text-sm text-gray-500 mb-2 line-clamp-2">{bounty.description}</p>}
                  <p className="text-sm text-gray-500 mb-3">Yêu cầu bởi: <span className="font-medium text-gray-700">{bounty.requester}</span></p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {bounty.tags.map(tag => <span key={tag} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors">{tag}</span>)}
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-4 sm:gap-3 border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:pl-5">
                  <div className="text-center sm:text-right">
                    <div className="text-xs text-gray-500 font-medium mb-1">Phần thưởng</div>
                    <div className="text-xl font-extrabold text-yellow-500 flex items-center gap-1.5">+{bounty.reward} <Coins size={20} /></div>
                  </div>
                  <button
                    onClick={() => handleAccept(bounty.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95 ${isAccepted ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100' : 'bg-gradient-to-r from-[#f76226] to-[#FF8A6A] text-white shadow-md hover:shadow-lg hover:shadow-[#f76226]/20'}`}
                  >
                    {isAccepted ? '✓ Đã nhận task' : 'Nhận task'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-modal-backdrop" onClick={e => e.target === e.currentTarget && setShowCreateModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-modal-enter">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Tạo nhiệm vụ săn thưởng</h3>
                <p className="text-sm text-gray-500 mt-1">Mô tả rõ yêu cầu để mọi người nhận task nhanh hơn.</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-all active:scale-90"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề nhiệm vụ *</label>
                <input type="text" value={createForm.title} onChange={e => setCreateForm(f => ({ ...f, title: e.target.value }))} placeholder="VD: Hướng dẫn setup môi trường Dev..." className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#f76226]/20 focus:border-[#f76226] outline-none hover:border-gray-300 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
                <textarea value={createForm.description} onChange={e => setCreateForm(f => ({ ...f, description: e.target.value }))} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#f76226]/20 focus:border-[#f76226] outline-none resize-none h-24 hover:border-gray-300 transition-all" placeholder="Mô tả những gì bạn cần người viết đề cập đến..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (phân cách bởi dấu phẩy)</label>
                <input type="text" value={createForm.tags} onChange={e => setCreateForm(f => ({ ...f, tags: e.target.value }))} placeholder="Engineering, Tutorial, SOP..." className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#f76226]/20 focus:border-[#f76226] outline-none hover:border-gray-300 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phần thưởng (Coins) *</label>
                  <input type="number" value={createForm.reward} onChange={e => setCreateForm(f => ({ ...f, reward: e.target.value }))} placeholder="500" min="50" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#f76226]/20 focus:border-[#f76226] outline-none hover:border-gray-300 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hạn chót</label>
                  <input type="date" value={createForm.deadline} onChange={e => setCreateForm(f => ({ ...f, deadline: e.target.value }))} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#f76226]/20 focus:border-[#f76226] outline-none hover:border-gray-300 transition-all" />
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50/80 flex justify-end gap-3">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-xl transition-all active:scale-95">Hủy</button>
              <button onClick={handleCreate} className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-[#f76226] to-[#FF8A6A] rounded-xl shadow-md hover:shadow-lg hover:shadow-[#f76226]/20 transition-all active:scale-95">Đăng nhiệm vụ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
