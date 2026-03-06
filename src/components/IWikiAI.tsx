import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { retrieveContext, generateRAGResponse } from '../lib/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { Input } from '../ui/Input';

export default function IWikiAI() {
  const { state, dispatch } = useApp();
  const { chatHistory, articles } = state;

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSend = async () => {
    const q = input.trim();
    if (!q || isLoading) return;
    setInput('');
    setIsLoading(true);

    const userMsg = {
      id: `u-${Date.now()}`,
      role: 'user' as const,
      content: q,
      timestamp: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_CHAT_MESSAGE', message: userMsg });

    const ctx = retrieveContext(q, articles);
    let answer = '';

    try {
      answer = await generateRAGResponse(q, ctx, (chunk) => {
        dispatch({
          type: 'UPDATE_LAST_AI_MESSAGE',
          content: chunk,
        });
      });
    } catch (e: any) {
      answer = `Lỗi: ${e.message || 'AI không phản hồi. Kiểm tra GEMINI_API_KEY.'}`;
    }

    const aiMsg = {
      id: `ai-${Date.now()}`,
      role: 'assistant' as const,
      content: answer,
      timestamp: new Date().toISOString(),
      citations: ctx.map((c: any) => c.title),
    };
    dispatch({ type: 'ADD_CHAT_MESSAGE', message: aiMsg });
    setIsLoading(false);
  };

  const SUGGESTIONS = [
    'Văn hoá iKame là gì?',
    'Onboarding nhân viên mới',
    'Quy trình review code',
    'Chính sách nghỉ phép',
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <Sparkles size={16} className="text-orange-500" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900 leading-none">iWiki AI 🤖</h1>
            <p className="text-[11px] text-gray-400 mt-1 font-medium">Trợ lý tri thức thông minh</p>
          </div>
        </div>
        {chatHistory.length > 0 && (
          <button
            onClick={() => dispatch({ type: 'CLEAR_CHAT' })}
            className="flex items-center gap-2 px-3 py-1.5 text-[11px] font-bold text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={12} /> XOÁ LỊCH SỬ
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-10">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6">
              <Sparkles size={28} className="text-orange-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Xin chào! 👋</h2>
            <p className="text-gray-500 text-sm mb-10 max-w-xs leading-relaxed">
              Tôi là iWiki AI, trợ lý của iKame. Tôi có thể giúp bạn tìm kiếm quy trình, chính sách và tài liệu công ty.
            </p>
            <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => { setInput(s); }}
                  className="p-3 text-left border border-gray-100 rounded-lg text-xs font-semibold text-gray-600 hover:border-orange-200 hover:bg-orange-50/20 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {chatHistory.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${msg.role === 'user' ? 'bg-orange-500 border-orange-600' : 'bg-white border-gray-100'}`}>
                  {msg.role === 'user' ? (
                    <User size={14} className="text-white" />
                  ) : (
                    <Sparkles size={14} className="text-orange-500" />
                  )}
                </div>
                <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1.5`}>
                  <div className={`px-4 py-3 rounded-xl text-sm leading-relaxed font-medium ${msg.role === 'user'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white border border-gray-100 text-gray-800'
                    }`}>
                    {msg.content}
                  </div>
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {msg.citations.slice(0, 3).map((c, i) => (
                        <span key={i} className="text-[10px] font-bold px-2 py-0.5 bg-gray-50 text-gray-400 rounded">
                          # {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center shrink-0">
              <Sparkles size={14} className="text-orange-500" />
            </div>
            <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase animate-pulse">Đang trả lời...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Đặt câu hỏi cho iWiki..."
            disabled={isLoading}
            className="flex-1"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-2.5 bg-gray-900 text-white rounded-md hover:bg-orange-500 transition-colors disabled:opacity-40"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
