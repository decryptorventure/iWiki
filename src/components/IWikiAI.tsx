import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, ArrowUp, ChevronDown, Plus, Database, Zap, Check, ExternalLink, PanelRightOpen } from 'lucide-react';
import { Button, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, Badge } from '@frontend-team/ui-kit';
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
    .replace(/### ([^\n]+)/g, '<h3 class="text-base font-bold text-[var(--ds-text-primary)] mt-5 border-b border-[var(--ds-border-secondary)] pb-1 mb-3">$1</h3>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-[var(--ds-text-primary)]">$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em class="italic text-[var(--ds-text-tertiary)]">$1</em>')
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-[var(--ds-bg-accent-primary-subtle)] text-[var(--ds-fg-accent-primary)] rounded text-xs font-mono font-bold">$1</code>')
    .replace(/- \[ \] ([^\n]+)/g, '<div class="flex items-start gap-2.5 my-2"><div class="w-4 h-4 border-2 border-[var(--ds-border-accent-primary-subtle)] rounded-md mt-0.5 shrink-0"></div><span class="text-sm text-[var(--ds-text-secondary)]">$1</span></div>')
    .replace(/- \[x\] ([^\n]+)/g, '<div class="flex items-start gap-2.5 my-2"><div class="w-4 h-4 bg-[var(--ds-bg-accent-primary)] border-2 border-[var(--ds-bg-accent-primary)] rounded-md mt-0.5 shrink-0"></div><span class="text-sm line-through text-[var(--ds-text-tertiary)]">$1</span></div>')
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
    <div className="flex h-full bg-[var(--ds-bg-primary)] text-[var(--ds-text-primary)] relative overflow-hidden">
      {showHistory && (
        <IWikiAIHistorySidebar
          sessions={sessions} currentSessionId={sessionId}
          onLoadSession={loadSession} onDeleteSession={handleDeleteSession}
          onNewChat={() => { startNewChat(); addToast('Bắt đầu cuộc trò chuyện mới', 'info'); }}
          onClose={() => setShowHistory(false)}
        />
      )}

      {/* Chat Panel */}
      <div className={`flex flex-col min-h-0 bg-[var(--ds-bg-primary)] relative ${docPanel ? 'w-[480px] shrink-0 border-r border-[var(--ds-border-secondary)]' : 'flex-1'}`}>
        <div className="shrink-0 px-5 py-3 border-b border-[var(--ds-border-secondary)] flex items-center justify-between bg-[var(--ds-bg-primary)] shadow-sm">
          <div className="flex items-center gap-3">
            <Button
              variant={showHistory ? 'dim' : 'subtle'}
              size="icon-s"
              onClick={() => setShowHistory(!showHistory)}
              title="Lịch sử"
              className={showHistory ? 'text-[var(--ds-fg-accent-primary)] bg-[var(--ds-bg-accent-primary-subtle)]' : 'text-[var(--ds-text-secondary)]'}
            >
              <Database size={18} />
            </Button>
            <div className="h-4 w-px bg-[var(--ds-border-secondary)] mx-0.5" />
            <div className="flex items-center gap-2 text-sm font-bold text-[var(--ds-text-primary)]">
              <Sparkles size={16} className="text-[var(--ds-fg-accent-primary)] animate-pulse" />
              iWiki AI <span className="text-[10px] px-1.5 py-0.5 bg-[var(--ds-bg-secondary)] text-[var(--ds-text-tertiary)] rounded-md font-mono ml-1 uppercase">Beta</span>
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
                <div className="absolute inset-0 bg-[var(--ds-bg-accent-primary-subtle)] rounded-full blur-2xl opacity-20" />
                <div className="relative bg-[var(--ds-bg-primary)] p-5 rounded-full shadow-lg border border-[var(--ds-border-secondary)] ring-4 ring-[var(--ds-bg-secondary)]">
                  <Sparkles size={44} className="text-[var(--ds-text-primary)]" strokeWidth={1.5} />
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2 text-center text-[var(--ds-text-primary)] animate-slide-up">Xin chào, {currentUser.name.split(' ').pop()}!</h1>
              <p className="text-[var(--ds-text-tertiary)] text-sm mb-10 animate-slide-up stagger-1">iWiki AI — Trợ lý tri thức nội bộ iKame</p>
              <div className="w-full mb-8 animate-slide-up stagger-2">
                <h3 className="text-sm font-bold text-[var(--ds-text-secondary)] uppercase tracking-wider flex items-center gap-2 mb-4">
                  <Database size={14} className="text-[var(--ds-fg-accent-primary)]" /> Kết nối & Nhập liệu
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {DATA_CONNECTORS.map((conn) => (
                    <Button
                      key={conn.id}
                      variant="subtle"
                      onClick={() => sendMessage(`Hãy giúp tôi đúc kết dữ liệu từ ${conn.name}...`)}
                      className="flex flex-col h-auto p-4 bg-[var(--ds-bg-primary)] border border-[var(--ds-border-secondary)] rounded-2xl hover:border-[var(--ds-border-accent-primary-subtle)] hover:shadow-xl hover:shadow-[var(--ds-bg-accent-primary-subtle)] transition-all duration-300 group text-left items-start shadow-none"
                    >
                      <div className={`mb-3 p-2 w-fit rounded-xl bg-[var(--ds-bg-secondary)] ${conn.color} group-hover:scale-110 transition-transform`}><conn.icon size={20} /></div>
                      <span className="text-sm font-bold text-[var(--ds-text-primary)] mb-1 flex items-center justify-between w-full">{conn.name}<ExternalLink size={12} className="opacity-0 group-hover:opacity-40 transition-opacity" /></span>
                      <span className="text-[11px] text-[var(--ds-text-tertiary)] font-normal">{conn.desc}</span>
                    </Button>
                  ))}
                </div>
              </div>
              <div className="w-full mb-12 animate-slide-up stagger-3">
                <h3 className="text-sm font-bold text-[var(--ds-text-secondary)] uppercase tracking-wider mb-4">Gợi ý câu hỏi</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {STARTER_CARDS.map((card, index) => {
                    const Icon = card.icon;
                    return (
                      <Button
                        key={index}
                        variant="subtle"
                        onClick={() => { setInput(card.prompt); textareaRef.current?.focus(); }}
                        className={`flex flex-col items-start h-auto p-4 bg-[var(--ds-bg-secondary)] border border-[var(--ds-border-secondary)] rounded-xl hover:shadow-md transition-all duration-300 text-left group hover:-translate-y-1 shadow-none`}
                      >
                        <div className="mb-3 p-2 bg-[var(--ds-bg-primary)] rounded-lg text-[var(--ds-text-secondary)] group-hover:shadow-md transition-all group-hover:scale-110"><Icon size={18} /></div>
                        <span className="text-sm font-semibold text-[var(--ds-text-primary)] mb-0.5 line-clamp-1">{card.title}</span>
                        <span className="text-xs text-[var(--ds-text-secondary)] line-clamp-2 font-normal">{card.desc}</span>
                      </Button>
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
                    <div className="w-8 h-8 rounded-xl bg-[var(--ds-bg-tertiary)] flex items-center justify-center shrink-0 shadow-lg mt-1"><Sparkles size={14} className="text-[var(--ds-fg-accent-primary)]" /></div>
                  ) : (
                    <img src={currentUser.avatar} alt="Me" className="w-8 h-8 rounded-xl ring-2 ring-[var(--ds-bg-accent-primary-subtle)] shadow-sm shrink-0 mt-1" referrerPolicy="no-referrer" />
                  )}
                  <div className={`max-w-[90%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-[var(--ds-bg-tertiary)] text-[var(--ds-fg-on-contrast)] rounded-tr-sm shadow-md' : 'bg-[var(--ds-bg-secondary)] border border-[var(--ds-border-secondary)] text-[var(--ds-text-primary)] rounded-tl-sm shadow-sm'}`}>
                    <div className="text-[14px] leading-relaxed whitespace-pre-wrap prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
                    <div className={`text-[10px] mt-2 font-medium uppercase tracking-wider ${msg.role === 'user' ? 'text-[var(--ds-fg-on-contrast)]/40 text-right' : 'text-[var(--ds-text-tertiary)]'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3 animate-slide-up">
                  <div className="w-8 h-8 rounded-xl bg-[var(--ds-bg-tertiary)] flex items-center justify-center shrink-0 shadow-lg"><Sparkles size={14} className="text-[var(--ds-fg-accent-primary)]" /></div>
                  <div className="bg-[var(--ds-bg-secondary)] border border-[var(--ds-border-secondary)] rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-1.5 px-1 py-1">
                      {[0, 150, 300].map(delay => <span key={delay} className="w-2 h-2 bg-[var(--ds-fg-accent-primary)] rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />)}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className={`${isConversationStarted ? 'border-t border-[var(--ds-border-secondary)]' : ''} p-3 bg-[var(--ds-bg-primary)] overflow-visible`}>
          <div className={`w-full relative group overflow-visible ${!isConversationStarted ? 'max-w-3xl mx-auto' : ''}`}>
            <div className="absolute -inset-1 bg-[var(--ds-bg-accent-primary-subtle)] rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-[var(--ds-bg-secondary)] border border-[var(--ds-border-secondary)] rounded-2xl shadow-sm overflow-visible transition-all hover:shadow-md focus-within:shadow-xl focus-within:border-[var(--ds-border-accent-primary-subtle)] focus-within:bg-[var(--ds-bg-primary)]">
              <textarea ref={textareaRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
                placeholder="Hỏi AI, đúc kết tri thức hoặc import dữ liệu..." className="w-full p-4 pb-2 bg-transparent border-none focus:ring-0 resize-none text-[14px] placeholder:text-[var(--ds-text-tertiary)] min-h-[52px] outline-none" rows={2} />
              <div className="px-3 pb-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="border" size="s" className="gap-1.5 font-bold text-[var(--ds-text-secondary)] bg-[var(--ds-bg-primary)] shadow-none">
                        <Zap size={11} className="text-[var(--ds-fg-accent-primary)]" />{selectedModel}
                        <ChevronDown size={11} className="text-[var(--ds-text-tertiary)]" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-52">
                      <div className="px-3 py-2 text-[10px] font-bold text-[var(--ds-text-tertiary)] uppercase tracking-widest border-b border-[var(--ds-bg-secondary)]">Mô hình AI</div>
                      {MODELS.map(model => (
                        <DropdownMenuItem
                          key={model.id}
                          onSelect={() => setSelectedModel(model.name)}
                          className="flex items-center justify-between"
                        >
                          <span className="text-xs font-medium text-[var(--ds-text-secondary)] flex items-center gap-2">
                            <div className={`p-1 rounded-md ${selectedModel === model.name ? 'bg-[var(--ds-bg-accent-primary-subtle)]' : 'bg-[var(--ds-bg-secondary)]'}`}><Zap size={11} className={selectedModel === model.name ? 'text-[var(--ds-fg-accent-primary)]' : 'text-[var(--ds-text-tertiary)]'} /></div>
                            {model.name}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {model.badge && <Badge size="xs" color="orange">{model.badge}</Badge>}
                            {selectedModel === model.name && <Check size={12} className="text-[var(--ds-fg-accent-primary)]" />}
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Button size="icon-m" variant={input.trim() && !isTyping ? 'dim' : 'subtle'} onClick={() => sendMessage(input)} disabled={!input.trim() || isTyping}>
                  <ArrowUp size={18} strokeWidth={2.5} />
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-2 text-center text-[10px] text-[var(--ds-text-tertiary)] font-medium tracking-wide flex items-center justify-center gap-1">
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
