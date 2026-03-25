// AI writing assistant chat panel for Editor (side panel)
import React from 'react';
import { Sparkles, ArrowUp, MessageSquare, X } from 'lucide-react';
import { Button } from '@frontend-team/ui-kit';

export type EditorAIMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
};

interface EditorAIChatPanelProps {
  messages: EditorAIMessage[];
  isTyping: boolean;
  input: string;
  onInputChange: (val: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onInsert: (text: string) => void;
  onClose: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  inputRef: React.RefObject<HTMLTextAreaElement>;
}

export default function EditorAIChatPanel({
  messages, isTyping, input, onInputChange, onSend, onKeyDown, onInsert, onClose, messagesEndRef, inputRef,
}: EditorAIChatPanelProps) {
  return (
    <div className="w-[340px] shrink-0 flex flex-col bg-white h-full">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gray-900 flex items-center justify-center shadow-sm">
            <Sparkles size={16} className="text-orange-300" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
              AI mode
              <span className="px-1.5 py-0.5 rounded-full bg-orange-50 text-[10px] font-bold text-orange-500 uppercase tracking-wider">Beta</span>
            </p>
            <p className="text-[11px] text-gray-500">Tra cứu & nháp nội dung song song khi viết.</p>
          </div>
        </div>
        <Button variant="subtle" size="icon-s" onClick={onClose}>
          <X size={14} />
        </Button>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-3 space-y-3">
          {messages.length === 0 && (
            <div className="text-xs text-gray-500 bg-gray-50 border border-dashed border-gray-200 rounded-xl p-3">
              <p className="font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                <MessageSquare size={13} /> Gợi ý sử dụng
              </p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Hỏi AI gợi ý dàn ý cho bài viết.</li>
                <li>Xin mẫu SOP / báo cáo phù hợp.</li>
                <li>Đề nghị AI viết nháp đoạn mở đầu.</li>
              </ul>
            </div>
          )}
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[88%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${msg.role === 'user' ? 'bg-gray-900 text-white rounded-br-sm shadow-sm' : 'bg-gray-50 border border-gray-100 text-gray-800 rounded-bl-sm'}`}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div className={`mt-1 text-[9px] uppercase tracking-wide ${msg.role === 'user' ? 'text-white/40 text-right' : 'text-gray-300'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </div>
                {msg.role === 'assistant' && (
                  <button type="button" onClick={() => onInsert(msg.content)}
                    className="mt-1 inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/80 border border-gray-200 text-[10px] font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 active:scale-95">
                    <ArrowUp size={10} /> Chèn vào bài viết
                  </button>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 border border-gray-100 px-3 py-1.5">
                {[0, 120, 240].map(delay => <span key={delay} className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: `${delay}ms` }} />)}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-100 p-2.5">
          <div className="relative">
            <textarea ref={inputRef} value={input} onChange={e => onInputChange(e.target.value)} onKeyDown={onKeyDown}
              placeholder="Hỏi AI về cấu trúc, ví dụ, mẫu nội dung..." rows={2}
              className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 pr-9 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-300 resize-none placeholder:text-gray-400" />
            <button type="button" onClick={onSend} disabled={!input.trim() || isTyping}
              className={`absolute right-1.5 bottom-1.5 p-1.5 rounded-lg ${input.trim() && !isTyping ? 'bg-gray-900 text-white shadow-sm hover:bg-black active:scale-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed'} transition-all duration-150`}>
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
