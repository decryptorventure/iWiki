// Conversation history sidebar panel for IWikiAI
import React, { useState } from 'react';
import { Database, ChevronDown, Search, MessageSquare, Trash2, Plus } from 'lucide-react';
import { AIChatSession } from '../store/useAppStore';

interface IWikiAIHistorySidebarProps {
  sessions: AIChatSession[];
  currentSessionId: string | null;
  onLoadSession: (session: AIChatSession) => void;
  onDeleteSession: (e: React.MouseEvent, id: string) => void;
  onNewChat: () => void;
  onClose: () => void;
}

export default function IWikiAIHistorySidebar({
  sessions, currentSessionId, onLoadSession, onDeleteSession, onNewChat, onClose,
}: IWikiAIHistorySidebarProps) {
  const [search, setSearch] = useState('');

  const filtered = sessions.filter(s =>
    s.topic.toLowerCase().includes(search.toLowerCase()) ||
    s.messages.some(m => m.content.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="w-80 border-r border-gray-100 flex flex-col bg-gray-50/50 animate-fade-in animate-slide-right z-20">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <span className="font-bold text-sm flex items-center gap-2">
          <Database size={14} className="text-gray-400" /> Lịch sử trò chuyện
        </span>
        <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600">
          <ChevronDown size={18} className="rotate-90" />
        </button>
      </div>

      <div className="p-3">
        <div className="relative group">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
          <input type="text" placeholder="Tìm kiếm hội thoại..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-100 focus:border-orange-200 transition-all outline-none" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        {filtered.length === 0 ? (
          <div className="text-center py-10 px-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageSquare size={20} className="text-gray-300" />
            </div>
            <p className="text-xs text-gray-400">{search ? 'Không tìm thấy kết quả' : 'Chưa có lịch sử trò chuyện'}</p>
          </div>
        ) : (
          filtered.map((session) => (
            <div key={session.id} onClick={() => onLoadSession(session)}
              className={`group relative w-full p-3 text-left rounded-xl transition-all duration-200 cursor-pointer border ${currentSessionId === session.id ? 'bg-white border-orange-100 shadow-sm ring-1 ring-orange-50' : 'border-transparent hover:bg-gray-100 text-gray-600'}`}>
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare size={14} className={currentSessionId === session.id ? 'text-orange-500' : 'text-gray-400'} />
                <span className="text-xs font-bold truncate flex-1 leading-tight">{session.topic}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-gray-400 font-medium">{new Date(session.updatedAt).toLocaleDateString()}</span>
                <span className="text-[10px] text-gray-300 tabular-nums">{session.messages.length} messages</span>
              </div>
              <button onClick={(e) => onDeleteSession(e, session.id)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                <Trash2 size={12} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="p-3 border-t border-gray-100 bg-white/50 backdrop-blur-md">
        <button onClick={onNewChat} className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-200 active:scale-[0.98]">
          <Plus size={16} /> Trò chuyện mới
        </button>
      </div>
    </div>
  );
}
