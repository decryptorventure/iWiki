import React, { useState, useEffect, useRef } from 'react';
import { X, Flame, MessageSquare, Share2, Eye, Bookmark, Send, Sparkles, Clock, ChevronRight, Maximize2, Minimize2, ArrowLeft, Bot, Zap, Info, List, Search, Users, Edit3, UserPlus, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../App';
import { useArticleActions } from '../hooks/use-article-actions';
import ArticleMarkdownRenderer from './article-markdown-renderer';

export default function ArticleFullView() {
  const { state, dispatch } = useApp();
  const { addToast } = useToast();
  const { articles, currentUser, selectedArticleId } = state;
  const article = articles.find(a => a.id === selectedArticleId);
  const actions = useArticleActions(selectedArticleId ?? '');
  const { isLiked, isFavorited: bookmarked } = actions;

  const [qaInput, setQaInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiChat, setAiChat] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [comment, setComment] = useState('');
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiChat]);

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <Bot size={48} className="mb-4 opacity-20" />
        <p>Không tìm thấy bài viết hoặc bài viết đã bị xóa.</p>
        <button 
          onClick={() => {
            dispatch({ type: 'SET_SCREEN', screen: 'dashboard' });
            dispatch({ type: 'SET_SELECTED_ARTICLE', articleId: null });
          }}
          className="mt-4 text-orange-600 font-bold hover:underline"
        >
          Quay lại Trang chủ
        </button>
      </div>
    );
  }

  const handleLike = () => {
    actions.toggleLike();
    if (!isLiked) addToast('Đã thắp lửa cho bài viết! 🔥', 'success');
  };

  const handleAskAi = () => {
    if (!qaInput.trim()) return;
    const userMsg = qaInput.trim();
    setAiChat(prev => [...prev, { role: 'user', content: userMsg }]);
    setQaInput('');
    setIsAiLoading(true);

    // Mock AI Response
    setTimeout(() => {
      let reply = "";
      if (userMsg.toLowerCase().includes("checkpoint")) {
        reply = "Performance Checkpoint tại iKame diễn ra 6 tháng một lần (tháng 6 và tháng 12). Quy trình gồm 4 bước: Tự đánh giá, 1-on-1 với quản lý, Peer Review và HR duyệt cuối cùng.";
      } else if (userMsg.toLowerCase().includes("tiêu chí")) {
        reply = "Các tiêu chí đánh giá chính bao gồm: Kết quả công việc (50% OKRs), Năng lực chuyên môn (30%) và Alignment với Văn hóa công ty (20%).";
      } else {
        reply = "Tôi là iWiki AI. Dựa trên nội dung bài viết này, bạn nên tập trung vào quy trình đánh giá và chuẩn bị các số liệu achievements cụ thể để có kỳ checkpoint tốt nhất.";
      }
      setAiChat(prev => [...prev, { role: 'assistant', content: reply }]);
      setIsAiLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col animate-fade-in relative font-sans">
      {/* Premium Header */}
      <header className="h-14 border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 bg-white/95 backdrop-blur-xl z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
                dispatch({ type: 'SET_SCREEN', screen: 'dashboard' });
                dispatch({ type: 'SET_SELECTED_ARTICLE', articleId: null });
            }}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-all hover:text-orange-600"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="h-6 w-[1px] bg-gray-200" />
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="text-gray-400 hover:text-gray-600 cursor-pointer" onClick={() => {
                dispatch({ type: 'SET_SCREEN', screen: 'dashboard' });
                dispatch({ type: 'SET_SELECTED_ARTICLE', articleId: null });
            }}>Trang chủ</span>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-gray-900 truncate max-w-[250px]">{article.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
            {/* Active Collaborators */}
            <div className="hidden md:flex items-center -space-x-3">
                {[
                  { n: 'A', c: 'bg-green-100 text-green-700', t: 'Bạn đang xem' },
                  { n: 'H', c: 'bg-indigo-100 text-indigo-700', t: 'Huy đang sửa' },
                  { n: 'M', c: 'bg-orange-100 text-orange-700', t: 'Minh đang đọc' }
                ].map((u, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-white ${u.c} flex items-center justify-center text-[10px] font-bold shadow-sm cursor-help transition-transform hover:-translate-y-1`} title={u.t}>{u.n}</div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 shadow-sm">+2</div>
            </div>

            <div className="h-6 w-[1px] bg-gray-200 mx-2 hidden md:block" />

            <div className="flex items-center gap-1.5">
                <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-all" title="Chia sẻ">
                    <Share2 size={18} />
                </button>
                <button 
                    onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'dashboard' })}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-all hover:text-orange-600"
                    title="Thu nhỏ"
                >
                    <Minimize2 size={20} />
                </button>
            </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 grid grid-cols-12 overflow-hidden h-[calc(100vh-3.5rem)] bg-gray-50/20">
        
        {/* Left: AI Context */}
        <aside className="hidden lg:flex col-span-3 border-r border-gray-100 flex-col overflow-y-auto custom-scrollbar p-6 bg-white">
          <div className="space-y-8">
            <section className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100/50">
                <h3 className="text-xs font-black text-orange-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Bot size={16} /> iWiki AI Summary
                </h3>
                <div className="space-y-4">
                   <div className="text-sm">
                      <h4 className="font-bold text-gray-900 mb-1">Cốt lõi bài viết:</h4>
                      <p className="text-gray-600 leading-relaxed text-xs">
                        Tài liệu hướng dẫn về quy trình đánh giá Performance định kỳ tại iKame, tập trung vào các mốc thời gian và cách chuẩn bị hiệu quả.
                      </p>
                   </div>
                   <div className="text-sm">
                      <h4 className="font-bold text-gray-900 mb-1">3 Điểm đáng lưu ý:</h4>
                      <ul className="space-y-1 text-xs text-gray-600">
                        <li className="flex gap-2"><span>•</span> Mốc thời gian T6 và T12 hàng năm.</li>
                        <li className="flex gap-2"><span>•</span> Quy trình 4 bước khép kín từ HR.</li>
                        <li className="flex gap-2"><span>•</span> Tầm quan trọng của dữ liệu achievements.</li>
                      </ul>
                   </div>
                </div>
            </section>

            <section>
                 <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                   <Sparkles size={16} className="text-indigo-500" /> Hỏi nhanh Tri thức
                 </h3>
                 <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm ring-1 ring-black/5">
                    <div className="min-h-[150px] max-h-[300px] overflow-y-auto mb-4 custom-scrollbar space-y-4">
                       {aiChat.length === 0 ? (
                          <div className="text-center py-6 opacity-40">
                             <div className="bg-indigo-50 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 text-indigo-500"><Search size={16}/></div>
                             <p className="text-[10px] font-medium leading-relaxed px-4 text-gray-500">Đặt câu hỏi để iWiki AI giúp bạn tra cứu nhanh nội dung bài viết này.</p>
                          </div>
                       ) : (
                          aiChat.map((msg, idx) => (
                            <div key={idx} className={`${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                               <div className={`inline-block px-3 py-2 rounded-2xl text-[11px] leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white font-medium' : 'bg-gray-100 text-gray-700 border border-gray-100'}`}>
                                  {msg.content}
                               </div>
                            </div>
                          ))
                       )}
                       {isAiLoading && <div className="text-indigo-500 animate-pulse text-[10px] font-bold flex items-center gap-1"><Zap size={10}/> iWiki AI đang xử lý...</div>}
                       <div ref={chatEndRef} />
                    </div>
                    <div className="relative group">
                       <input 
                        type="text" 
                        value={qaInput}
                        onChange={(e) => setQaInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
                        placeholder="Hỏi AI về bài viết này..." 
                        className="w-full pl-3 pr-10 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all group-hover:border-gray-200"
                       />
                       <button 
                        onClick={handleAskAi}
                        className="absolute right-1 top-1 p-1.5 text-indigo-500 hover:bg-indigo-100 rounded-lg transition-colors"
                       >
                         <Send size={16} />
                       </button>
                    </div>
                 </div>
            </section>
          </div>
        </aside>

        {/* Center: Main Reading Area */}
        <main className="col-span-12 lg:col-span-6 overflow-y-auto custom-scrollbar bg-white px-6 md:px-12 py-12 scroll-smooth">
            <div className="max-w-2xl mx-auto">
               <div className="mb-14">
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    {article.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-bold rounded-md uppercase tracking-wide">#{t}</span>
                    ))}
                  </div>

                  <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-8 leading-tight tracking-tight">{article.title}</h1>
                  
                  <div className="flex items-center gap-4 group cursor-pointer">
                      <img src={article.author.avatar} alt="Author" className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100" referrerPolicy="no-referrer" />
                      <div>
                          <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900 text-sm group-hover:text-orange-600 transition-colors">{article.author.name}</span>
                              <span className="text-[10px] text-gray-400 font-medium">• {article.createdAt}</span>
                          </div>
                          <div className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-3">
                              <span className="flex items-center gap-1"><Eye size={12}/> {article.views.toLocaleString()} lượt xem</span>
                              <span className="flex items-center gap-1"><MessageSquare size={12}/> {article.comments.length} thảo luận</span>
                          </div>
                      </div>
                  </div>
               </div>

               {/* Article Content */}
               <article className="article-body mb-20 relative text-gray-800">
                  {/* Mock Multi-user Editing Cursor */}
                  <div className="absolute top-24 right-1/4 pointer-events-none group animate-pulse z-10">
                     <div className="w-0.5 h-5 bg-indigo-500 relative">
                        <div className="absolute bottom-full left-0 px-2 py-0.5 bg-indigo-500 text-white text-[9px] font-bold rounded-t-md rounded-br-md whitespace-nowrap shadow-lg">Huy đang sửa...</div>
                     </div>
                  </div>

                  <ArticleMarkdownRenderer content={article.content} />
               </article>

               {/* Compact & Orderly Action Hub */}
               <section className="mb-20 pt-10 border-t border-gray-100">
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                         <div className="flex items-center gap-3">
                            <button 
                                onClick={handleLike} 
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${isLiked ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'bg-gray-50 text-gray-700 hover:bg-orange-50 hover:text-orange-600 border border-gray-100'}`}
                            >
                                <Flame size={20} className={isLiked ? 'fill-current animate-bounce' : 'text-orange-500'} />
                                {isLiked ? 'Đã Thắp Lửa' : 'Thắp Lửa Ngay'}
                                <span className="ml-1 opacity-60 font-medium">{article.likes}</span>
                            </button>
                            
                            <button
                                onClick={() => {
                                    actions.toggleFavorite();
                                    addToast(bookmarked ? 'Đã bỏ lưu' : 'Đã lưu bài viết 📌', 'info');
                                }}
                                className={`p-3 rounded-xl transition-all border ${bookmarked ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-white border-gray-200 text-gray-400 hover:text-orange-600 hover:border-orange-200 hover:shadow-sm'}`}
                            >
                                <Bookmark size={20} className={bookmarked ? 'fill-current' : ''} />
                            </button>
                         </div>

                         <div className="flex items-center gap-2">
                            <button 
                                onClick={() => addToast('Đã gửi yêu cầu cộng tác!', 'success')}
                                className="px-4 py-2.5 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-50 hover:border-blue-300 transition-all flex items-center gap-2"
                            >
                                <UserPlus size={16} className="text-blue-500" /> Yêu cầu cộng tác
                            </button>
                            <button 
                                onClick={() => dispatch({ type: 'OPEN_EDITOR', article })}
                                className="px-4 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-orange-600 transition-all shadow-md flex items-center gap-2"
                            >
                                <Edit3 size={16} /> Chỉnh sửa
                            </button>
                         </div>
                      </div>

                      {/* Comment Input Slim */}
                      <div className="bg-gray-50/80 p-5 rounded-2xl border border-gray-100">
                        <div className="flex gap-4">
                            <img src={currentUser.avatar} alt="Me" className="w-9 h-9 rounded-full ring-2 ring-white shadow-sm shrink-0" referrerPolicy="no-referrer" />
                            <div className="flex-1 relative">
                                <textarea
                                    ref={commentRef}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Viết bình luận của bạn..."
                                    className="w-full px-4 py-3 pr-12 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 outline-none resize-none transition-all duration-200 min-h-[44px] custom-scrollbar"
                                    rows={1}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            if (comment.trim()) {
                                              actions.addComment(comment.trim());
                                              setComment('');
                                              addToast('Đã đăng bình luận', 'success');
                                            }
                                        }
                                    }}
                                />
                                <button 
                                    onClick={() => {
                                        if (!comment.trim()) return;
                                        actions.addComment(comment.trim());
                                        setComment('');
                                        addToast('Đã đăng bình luận', 'success');
                                    }} 
                                    disabled={!comment.trim()} 
                                    className={`absolute right-2 top-2 p-1.5 rounded-lg transition-all ${comment.trim() ? 'text-orange-600 hover:bg-orange-50' : 'text-gray-300'}`}
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                      </div>
                    </div>
               </section>

               {/* Comments List */}
               <section className="space-y-6">
                    <h3 className="text-lg font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                        <MessageSquare size={20} className="text-orange-500" />
                        Thảo luận ({article.comments.length})
                    </h3>

                    <div className="space-y-4">
                        {article.comments.length === 0 ? (
                            <div className="text-center py-10 bg-gray-50/50 rounded-2xl border border-gray-100">
                                <p className="text-gray-400 text-sm italic">Chưa có bình luận nào. Hãy bắt đầu cuộc thảo luận!</p>
                            </div>
                        ) : (
                            article.comments.map((c, idx) => (
                                <div key={c.id} className="flex gap-4 group">
                                    <img src={c.authorAvatar || `https://picsum.photos/seed/${c.authorId}/100/100`} alt={c.authorName} className="w-8 h-8 rounded-full border border-gray-100 shrink-0 mt-1" referrerPolicy="no-referrer" />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-gray-900 text-xs">{c.authorName}</span>
                                            <span className="text-[10px] text-gray-400 font-medium">{c.createdAt}</span>
                                        </div>
                                        <div className="bg-gray-50/80 p-3.5 rounded-2xl rounded-tl-none border border-gray-100 transition-all hover:border-gray-200">
                                            <p className="text-sm text-gray-700 leading-relaxed">{c.content}</p>
                                        </div>
                                        <div className="flex items-center gap-4 mt-1 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="text-[10px] font-bold text-gray-400 hover:text-orange-500">Thích</button>
                                            <button className="text-[10px] font-bold text-gray-400 hover:text-orange-500">Trả lời</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
               </section>
            </div>
        </main>

        {/* Right: Insights & Metadata */}
        <aside className="hidden xl:flex col-span-3 border-l border-gray-100 flex-col overflow-y-auto custom-scrollbar p-6 bg-white gap-10">
           {/* Section 1: Table of Contents */}
           <div>
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <List size={14} /> Mục lục nội dung
              </h3>
              <nav className="space-y-1">
                {[
                  { id: 1, text: "Mục tiêu Performance Checkpoint", active: true },
                  { id: 2, text: "Quy trình triển khai 4 bước", active: false },
                  { id: 3, text: "Hướng dẫn viết Tự Đánh Giá", active: false },
                  { id: 4, text: "Quy trình Review 360 độ", active: false },
                  { id: 5, text: "Kinh nghiệm Sitting 1:1", active: false }
                ].map(item => (
                  <div key={item.id} className={`group flex items-center gap-2 py-2 px-3 rounded-xl cursor-pointer transition-all border-l-2 ${item.active ? 'bg-orange-50/50 text-orange-600 font-bold border-orange-500' : 'hover:bg-gray-50 text-gray-500 border-transparent hover:border-gray-300'}`}>
                     <span className="text-xs truncate">{item.text}</span>
                  </div>
                ))}
              </nav>
           </div>

           {/* Section 2: Article Stats Hub */}
           <div className="bg-gray-50/50 rounded-2xl border border-gray-100 p-5 space-y-4">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tri thức Stats</h4>
              <div className="grid grid-cols-2 gap-3">
                 <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                    <div className="text-orange-500 mb-1"><Flame size={14} /></div>
                    <div className="text-lg font-black text-gray-900">{article.likes}</div>
                    <div className="text-[9px] text-gray-400 font-bold uppercase">Thắp lửa</div>
                 </div>
                 <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                    <div className="text-blue-500 mb-1"><Eye size={14} /></div>
                    <div className="text-lg font-black text-gray-900">{article.views.toLocaleString()}</div>
                    <div className="text-[9px] text-gray-400 font-bold uppercase">Lượt đọc</div>
                 </div>
              </div>
           </div>

           {/* Section 3: Related Tri thức */}
           <div>
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Mở rông tri thức</h3>
              <div className="space-y-4">
                 {articles.filter(a => a.id !== article.id && a.folderId === article.folderId).slice(0, 3).map(r => (
                    <div key={r.id} onClick={() => dispatch({ type: 'SET_SELECTED_ARTICLE', articleId: r.id })} className="group cursor-pointer">
                       <h5 className="text-xs font-bold text-gray-700 group-hover:text-orange-600 transition-colors line-clamp-1">{r.title}</h5>
                       <div className="flex items-center gap-2 mt-1">
                          <img src={r.author.avatar} alt="Avatar" className="w-4 h-4 rounded-full" referrerPolicy="no-referrer" />
                          <span className="text-[10px] text-gray-400">{r.author.name}</span>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </aside>

      </div>
    </div>
  );
}
