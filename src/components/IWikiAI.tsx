import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, ArrowUp, ChevronDown, Plus, Database, Zap, Check, ExternalLink, PanelRightOpen } from 'lucide-react';
import { Button } from '@frontend-team/ui-kit';
import { useToast } from '../App';
import { useIWikiAI } from '../hooks/use-iwiki-ai';
import { AIChatMessage, AIChatSession } from '../store/useAppStore';
import { generateRagAnswer } from '../lib/rag';
import AIDocEditor from './AIDocEditor';
import IWikiAIHistorySidebar from './iwiki-ai-history-sidebar';
import {
  STARTER_CARDS, DATA_CONNECTORS, MODELS,
  isDocRequest, extractDocTitle, generateDocContent, generateAIResponse,
} from '../lib/iwiki-ai-mock-responses';

interface DocPanel { title: string; content: string; }

function renderMarkdown(text: string) {
  return text
    .replace(/### ([^\n]+)/g, '<h3 class="text-base font-bold text-gray-900 mt-5 border-b border-gray-200 pb-1 mb-3">$1</h3>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em class="italic text-gray-500">$1</em>')
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-mono font-bold">$1</code>')
    .replace(/- \[ \] ([^\n]+)/g, '<div class="flex items-start gap-2.5 my-2"><div class="w-4 h-4 border-2 border-orange-200 rounded-md mt-0.5 shrink-0"></div><span class="text-sm text-gray-600">$1</span></div>')
    .replace(/- \[x\] ([^\n]+)/g, '<div class="flex items-start gap-2.5 my-2"><div class="w-4 h-4 bg-orange-500 border-2 border-orange-500 rounded-md mt-0.5 shrink-0"></div><span class="text-sm line-through text-gray-400">$1</span></div>')
    .replace(/\n/g, '<br/>');
}

export default function IWikiAI() {
  const { addToast } = useToast();
  const {
    messages, setMessages, sessionId, setSessionId,
    isTyping, setIsTyping, sessions, persistSession,
    loadSession: loadSessionData, deleteSession, startNewChat: resetChat,
    trackAIEvent, currentUser, articles,
  } = useIWikiAI();

  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('Auto');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [docPanel, setDocPanel] = useState<DocPanel | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isConversationStarted = messages.length > 0;

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => { if (!isConversationStarted) textareaRef.current?.focus(); }, [isConversationStarted]);

  const startNewChat = () => { resetChat(); setInput(''); setDocPanel(null); textareaRef.current?.focus(); };

  const loadSession = (session: AIChatSession) => {
    loadSessionData(session);
    setShowHistory(false);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const handleDeleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteSession(id);
    addToast('Đã xóa dữ liệu hội thoại', 'info');
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    const currentSessionId = sessionId ?? Date.now().toString();
    if (!sessionId) setSessionId(currentSessionId);

    const userMessage: AIChatMessage = { id: Date.now().toString(), role: 'user', content: content.trim(), timestamp: new Date().toISOString() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 800));

    const isDoc = isDocRequest(content);
    let aiResponse: string;
    if (isDoc) {
      const docTitle = extractDocTitle(content);
      setDocPanel({ title: docTitle, content: generateDocContent(content) });
      aiResponse = `Tài liệu **"${docTitle}"** đã được tạo và hiển thị trong editor bên phải. Bạn có thể chỉnh sửa trực tiếp.`;
    } else {
      const rag = generateRagAnswer(currentUser, articles, content);
      aiResponse = `${generateAIResponse(content)}\n\n---\n**RAG answer:** ${rag.answer}\n${rag.citations.length > 0 ? rag.citations.map((c, i) => `\n[${i + 1}] ${c.title} (score ${c.score})`).join('') : '\nKhông có citation khả dụng.'}`;
    }

    trackAIEvent(isDoc ? 'ai_write' : 'ai_search', content, { isDoc });
    const assistantMessage: AIChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: aiResponse, timestamp: new Date().toISOString() };
    const finalMessages = [...newMessages, assistantMessage];
    setMessages(finalMessages);
    setIsTyping(false);
    persistSession(currentSessionId, content.trim(), finalMessages);
  };

  return (
    <div className="flex h-full bg-white text-gray-900 relative overflow-hidden">
      {showHistory && (
        <IWikiAIHistorySidebar
          sessions={sessions} currentSessionId={sessionId}
          onLoadSession={loadSession} onDeleteSession={handleDeleteSession}
          onNewChat={() => { startNewChat(); addToast('Bắt đầu cuộc trò chuyện mới', 'info'); }}
          onClose={() => setShowHistory(false)}
        />
      )}

      {/* Chat Panel */}
      <div className={`flex flex-col min-h-0 bg-white relative ${docPanel ? 'w-[480px] shrink-0 border-r border-gray-100' : 'flex-1'}`}>
        <div className="shrink-0 px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-white shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowHistory(!showHistory)} className={`p-2 rounded-lg transition-all duration-200 ${showHistory ? 'bg-orange-50 text-orange-500' : 'text-gray-500 hover:bg-gray-100'}`} title="Lịch sử">
              <Database size={18} />
            </button>
            <div className="h-4 w-px bg-gray-200 mx-0.5" />
            <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
              <Sparkles size={16} className="text-orange-500 animate-pulse" />
              iWiki AI <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded-md font-mono ml-1 uppercase">Beta</span>
            </div>
          </div>
          {isConversationStarted && (
            <Button size="s" variant="border" onClick={() => { startNewChat(); addToast('Bắt đầu cuộc trò chuyện mới', 'info'); }}>
              <Plus size={14} /> New
            </Button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {!isConversationStarted ? (
            <div className="flex flex-col items-center justify-center p-6 max-w-3xl mx-auto w-full pt-16">
              <div className="mb-8 relative animate-float">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full blur-2xl opacity-20" />
                <div className="relative bg-white p-5 rounded-full shadow-lg border border-gray-100 ring-4 ring-gray-50">
                  <Sparkles size={44} className="text-gray-800" strokeWidth={1.5} />
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2 text-center text-gray-900 animate-slide-up">Xin chào, {currentUser.name.split(' ').pop()}!</h1>
              <p className="text-gray-400 text-sm mb-10 animate-slide-up stagger-1">iWiki AI — Trợ lý tri thức nội bộ iKame</p>
              <div className="w-full mb-8 animate-slide-up stagger-2">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2 mb-4">
                  <Database size={14} className="text-orange-500" /> Kết nối & Nhập liệu
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {DATA_CONNECTORS.map((conn) => (
                    <button key={conn.id} onClick={() => sendMessage(`Hãy giúp tôi đúc kết dữ liệu từ ${conn.name}...`)}
                      className="flex flex-col p-4 bg-white border border-gray-100 rounded-2xl hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 group text-left">
                      <div className={`mb-3 p-2 w-fit rounded-xl bg-gray-50 ${conn.color} group-hover:scale-110 transition-transform`}><conn.icon size={20} /></div>
                      <span className="text-sm font-bold text-gray-900 mb-1 flex items-center justify-between">{conn.name}<ExternalLink size={12} className="opacity-0 group-hover:opacity-40 transition-opacity" /></span>
                      <span className="text-[11px] text-gray-400">{conn.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="w-full mb-12 animate-slide-up stagger-3">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Gợi ý câu hỏi</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {STARTER_CARDS.map((card, index) => {
                    const Icon = card.icon;
                    return (
                      <button key={index} onClick={() => { setInput(card.prompt); textareaRef.current?.focus(); }}
                        className={`flex flex-col items-start p-4 bg-gradient-to-br ${card.gradient} border border-gray-200/60 rounded-xl hover:shadow-md transition-all duration-300 text-left group h-full hover:-translate-y-1`}>
                        <div className="mb-3 p-2 bg-white rounded-lg text-gray-600 group-hover:shadow-md transition-all group-hover:scale-110"><Icon size={18} /></div>
                        <span className="text-sm font-semibold text-gray-900 mb-0.5 line-clamp-1">{card.title}</span>
                        <span className="text-xs text-gray-500 line-clamp-2">{card.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className={`mx-auto w-full px-4 py-8 space-y-6 ${docPanel ? 'max-w-none' : 'max-w-4xl'}`}>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 animate-slide-up ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {msg.role === 'assistant' ? (
                    <div className="w-8 h-8 rounded-xl bg-gray-900 flex items-center justify-center shrink-0 shadow-lg mt-1"><Sparkles size={14} className="text-orange-400" /></div>
                  ) : (
                    <img src={currentUser.avatar} alt="Me" className="w-8 h-8 rounded-xl ring-2 ring-orange-100 shadow-sm shrink-0 mt-1" referrerPolicy="no-referrer" />
                  )}
                  <div className={`max-w-[90%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-tr-sm shadow-md' : 'bg-gray-50 border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm'}`}>
                    <div className="text-[14px] leading-relaxed whitespace-pre-wrap prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
                    <div className={`text-[10px] mt-2 font-medium uppercase tracking-wider ${msg.role === 'user' ? 'text-white/40 text-right' : 'text-gray-300'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3 animate-slide-up">
                  <div className="w-8 h-8 rounded-xl bg-gray-900 flex items-center justify-center shrink-0 shadow-lg"><Sparkles size={14} className="text-orange-400" /></div>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-1.5 px-1 py-1">
                      {[0, 150, 300].map(delay => <span key={delay} className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />)}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className={`${isConversationStarted ? 'border-t border-gray-100' : ''} p-3 bg-white overflow-visible`}>
          <div className={`w-full relative group overflow-visible ${!isConversationStarted ? 'max-w-3xl mx-auto' : ''}`}>
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-400/20 via-amber-400/10 to-purple-500/20 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-gray-50 border border-gray-200 rounded-2xl shadow-sm overflow-visible transition-all hover:shadow-md focus-within:shadow-xl focus-within:border-orange-200 focus-within:bg-white">
              <textarea ref={textareaRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
                placeholder="Hỏi AI, đúc kết tri thức hoặc import dữ liệu..." className="w-full p-4 pb-2 bg-transparent border-none focus:ring-0 resize-none text-[14px] placeholder:text-gray-400 min-h-[52px] outline-none" rows={2} />
              <div className="px-3 pb-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <button onClick={() => setShowModelDropdown(!showModelDropdown)} className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all shadow-sm">
                      <Zap size={11} className="text-orange-500" />{selectedModel}
                      <ChevronDown size={11} className={`transition-transform text-gray-400 ${showModelDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showModelDropdown && (
                      <div className="absolute bottom-full left-0 mb-2 w-52 bg-white border border-gray-200 rounded-xl shadow-2xl z-[100] py-1 animate-scale-in">
                        <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">Mô hình AI</div>
                        {MODELS.map(model => (
                          <button key={model.id} onClick={() => { setSelectedModel(model.name); setShowModelDropdown(false); }} className="w-full px-3 py-2 text-left flex items-center justify-between hover:bg-gray-50">
                            <span className="text-xs font-medium text-gray-700 flex items-center gap-2">
                              <div className={`p-1 rounded-md ${selectedModel === model.name ? 'bg-orange-50' : 'bg-gray-50'}`}><Zap size={11} className={selectedModel === model.name ? 'text-orange-500' : 'text-gray-400'} /></div>
                              {model.name}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {model.badge && <span className="text-[9px] font-black px-1.5 py-0.5 bg-orange-100 text-orange-600 rounded-full uppercase">{model.badge}</span>}
                              {selectedModel === model.name && <Check size={12} className="text-orange-500" />}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <Button size="icon-m" variant={input.trim() && !isTyping ? 'dim' : 'subtle'} onClick={() => sendMessage(input)} disabled={!input.trim() || isTyping}>
                  <ArrowUp size={18} strokeWidth={2.5} />
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-2 text-center text-[10px] text-gray-400 font-medium tracking-wide flex items-center justify-center gap-1">
            <Sparkles size={10} /> iWiki AI · Powered by Gemini 1.5 Pro & iKame Intelligence
          </div>
        </div>
      </div>

      {/* Document Editor Panel */}
      {docPanel && (
        <div className="flex-1 min-w-0 animate-fade-in">
          <AIDocEditor title={docPanel.title} content={docPanel.content} onClose={() => setDocPanel(null)} onSave={(title) => addToast(`Đã lưu "${title}"`, 'success')} />
        </div>
      )}

      {!docPanel && isConversationStarted && messages.some(m => m.role === 'assistant' && m.content.includes('editor bên phải')) && (
        <Button variant="dim" className="fixed bottom-20 right-6 z-30" onClick={() => { const lastUser = messages.filter(m => m.role === 'user').pop(); if (lastUser) setDocPanel({ title: extractDocTitle(lastUser.content), content: generateDocContent(lastUser.content) }); }}>
          <PanelRightOpen size={18} /> Mở Editor
        </Button>
      )}
    </div>
  );
}
