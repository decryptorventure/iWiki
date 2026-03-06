import React, { useState } from 'react';
import { Coins, Target, Clock, Search, Filter, Flame, Trophy, Plus, X, ChevronRight, Timer, Megaphone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../App';
import { Bounty } from '../store/useAppStore';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORIES = ['Tất cả', 'Engineering', 'Product', 'HR', 'Data', 'DevOps', 'Marketing'];

export default function Bounties() {
  const { state, dispatch } = useApp();
  const { addToast } = useToast();
  const { bounties, currentUser } = state;

  const [activeTab, setActiveTab] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ title: '', description: '', reward: '', deadline: '', tags: '' });

  const filtered = bounties.filter(b => {
    const matchesTab = activeTab === 'Tất cả' || b.tags.some(t => t.toLowerCase() === activeTab.toLowerCase());
    const matchesSearch = !searchQuery || b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.requester.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleAccept = (bountyId: string) => {
    const bounty = bounties.find(b => b.id === bountyId);
    if (!bounty) return;
    const isAccepted = bounty.acceptedBy.includes(currentUser.id);
    dispatch({ type: 'ACCEPT_BOUNTY', bountyId, userId: currentUser.id });
    addToast(isAccepted ? 'Đã hủy nhận nhiệm vụ' : 'Đã nhận nhiệm vụ!', isAccepted ? 'info' : 'success');
  };

  const handleCreate = () => {
    if (!createForm.title.trim()) { addToast('Vui lòng nhập tiêu đề', 'warning'); return; }
    if (!createForm.reward || isNaN(Number(createForm.reward))) { addToast('Vui lòng nhập mức thưởng', 'warning'); return; }

    const bounty: Bounty = {
      id: `b-${Date.now()}`,
      title: createForm.title.trim(),
      description: createForm.description.trim(),
      requester: currentUser.name,
      requesterId: currentUser.id,
      reward: Number(createForm.reward),
      deadline: createForm.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      tags: createForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      hot: Number(createForm.reward) > 500,
      acceptedBy: [],
      status: 'open',
      createdAt: new Date().toISOString().split('T')[0],
    };

    dispatch({ type: 'CREATE_BOUNTY', bounty });
    setCreateForm({ title: '', description: '', reward: '', deadline: '', tags: '' });
    setShowCreateModal(false);
    addToast('Nhiệm vụ đã được niêm yết!', 'success');
  };

  const formatDeadline = (dateStr: string) => {
    const now = new Date();
    const deadline = new Date(dateStr);
    const diff = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'Quá hạn';
    if (diff === 0) return 'Hạn cuối hôm nay';
    return `Còn ${diff} ngày`;
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Bảng Nhiệm Vụ 🎯</h1>
          <p className="text-gray-500 text-sm max-w-lg">
            Đóng góp những kiến thức còn thiếu để nhận thưởng iKame Coins.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 flex items-center gap-3">
            <Coins className="text-yellow-500" size={18} />
            <span className="text-lg font-bold text-gray-900">{currentUser.coins.toLocaleString()}</span>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="p-2.5 bg-gray-900 text-white rounded-lg hover:bg-orange-500 transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Tìm kiếm nhiệm vụ..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-400"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${activeTab === cat
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <div className="md:col-span-2 text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <Megaphone size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm font-medium">Không tìm thấy nhiệm vụ nào</p>
            </div>
          ) : (
            filtered.map((bounty) => {
              const isAccepted = bounty.acceptedBy.includes(currentUser.id);
              return (
                <motion.div
                  key={bounty.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white border p-6 rounded-lg transition-all flex flex-col justify-between ${isAccepted ? 'border-green-200 bg-green-50/20' : 'border-gray-100 hover:border-orange-200'
                    }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-2">
                        {bounty.hot && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded text-[10px] font-bold uppercase tracking-wider">Hot</span>
                        )}
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <Timer size={10} /> {formatDeadline(bounty.deadline)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-orange-500 font-bold text-sm">
                        +{bounty.reward} <Coins size={14} className="text-yellow-500" />
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug">{bounty.title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">{bounty.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {bounty.tags.map(t => (
                        <span key={t} className="px-2 py-0.5 bg-gray-50 text-gray-400 text-[10px] font-semibold rounded">#{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center text-[10px] font-bold text-orange-600">
                        {bounty.requester[0]}
                      </div>
                      <span className="text-[11px] text-gray-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px]">{bounty.requester}</span>
                    </div>
                    <button
                      onClick={() => handleAccept(bounty.id)}
                      className={`px-4 py-2 rounded-md text-xs font-semibold transition-colors ${isAccepted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-900 text-white hover:bg-orange-500'
                        }`}
                    >
                      {isAccepted ? '✓ Đã nhận' : 'Nhận nhiệm vụ'}
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* New Bounty Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCreateModal(false)} className="absolute inset-0 bg-black/40" />
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="relative bg-white rounded-lg w-full max-w-md shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Tạo nhiệm vụ mới</h2>
                <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Tiêu đề *</label>
                  <input type="text" value={createForm.title} onChange={e => setCreateForm(f => ({ ...f, title: e.target.value }))} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-400" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Mô tả</label>
                  <textarea value={createForm.description} onChange={e => setCreateForm(f => ({ ...f, description: e.target.value }))} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-400 h-24 resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Phần thưởng (Coins)</label>
                    <input type="number" value={createForm.reward} onChange={e => setCreateForm(f => ({ ...f, reward: e.target.value }))} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Hạn chót</label>
                    <input type="date" value={createForm.deadline} onChange={e => setCreateForm(f => ({ ...f, deadline: e.target.value }))} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-400" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setShowCreateModal(false)} className="flex-1 py-2.5 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-lg">Huỷ</button>
                <button onClick={handleCreate} className="flex-1 py-2.5 bg-gray-900 text-white font-semibold rounded-lg hover:bg-orange-500">Tạo nhiệm vụ</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
