import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowLeft, FileText, Search, Copy, Check, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateRagAnswer } from '../lib/rag';

export default function SearchResult({ query, onBack }: { query: string, onBack: () => void }) {
  const { state, dispatch } = useApp();
  const { articles } = state;
  const [searchQuery, setSearchQuery] = useState(query);
  const [currentQuery, setCurrentQuery] = useState(query);
  const [isGenerating, setIsGenerating] = useState(true);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const rag = generateRagAnswer(state.currentUser, articles, currentQuery);
  const matchedArticles = rag.citations.map(citation => {
    const source = articles.find(a => a.id === citation.articleId)!;
    return {
      ...source,
      matchScore: citation.score,
      snippet: citation.snippet,
    };
  });

  // Simulate AI generation loading
  useEffect(() => {
    setIsGenerating(true);
    const timer = setTimeout(() => setIsGenerating(false), 1500);
    return () => clearTimeout(timer);
  }, [currentQuery]);

  useEffect(() => {
    dispatch({
      type: 'TRACK_EVENT',
      event: {
        type: 'search',
        userId: state.currentUser.id,
        query: currentQuery,
        meta: { resultsCount: matchedArticles.length },
      },
    });
  }, [currentQuery]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setCurrentQuery(searchQuery);
  };

  const handleCopy = () => {
    const text = `Kết quả tìm kiếm cho "${currentQuery}" — iWiki iKame`;
    navigator.clipboard?.writeText(text).catch(() => { });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const aiAnswer = rag.answer;

  return (
    <div className="max-w-4xl mx-auto px-8 py-8 animate-fade-in">
      {/* Top Bar */}
      <div className="flex items-center gap-4 mb-8 animate-slide-up">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 text-gray-500 shrink-0 active:scale-90"><ArrowLeft size={20} /></button>
        <div className="flex-1 relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF6B4A]/10 to-orange-300/10 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Search className="h-4 w-4 text-gray-400 group-focus-within:text-[#FF6B4A] transition-colors" /></div>
            <input
              type="text"
              className="block w-full pl-10 pr-24 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A]/50 transition-all duration-200 hover:border-gray-300 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6A] text-white text-xs font-bold rounded-lg hover:shadow-md transition-all duration-200 active:scale-95">Tìm kiếm</button>
          </div>
        </div>
      </div>

      {/* AI Answer Block */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden mb-8 animate-slide-up stagger-1">
        <div className="bg-gradient-to-r from-orange-50 via-amber-50/50 to-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#FF6B4A] font-semibold">
            <div className="p-1 bg-gradient-to-br from-[#FF6B4A] to-orange-400 rounded-lg text-white"><Sparkles size={14} /></div>
            <span>iWiki AI trả lời</span>
          </div>
          <button onClick={handleCopy} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-all duration-200 active:scale-90">
            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
          </button>
        </div>

        <div className="p-6">
          {isGenerating ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#FF6B4A] to-orange-400 animate-pulse" />
                <span className="text-sm text-gray-500 animate-pulse">iWiki AI đang tổng hợp câu trả lời...</span>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-100 rounded-full w-3/4 animate-shimmer"></div>
                <div className="h-4 bg-gray-100 rounded-full w-full animate-shimmer stagger-1"></div>
                <div className="h-4 bg-gray-100 rounded-full w-5/6 animate-shimmer stagger-2"></div>
              </div>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none text-gray-700 animate-fade-in">
              <p dangerouslySetInnerHTML={{
                __html: aiAnswer.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
              }} />
            </div>
          )}
        </div>

        {!isGenerating && (
          <div className="bg-gray-50/80 px-6 py-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">Câu trả lời này có hữu ích không?</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setFeedback('up')} className={`p-1.5 rounded-md transition-all duration-200 active:scale-90 ${feedback === 'up' ? 'text-green-600 bg-green-100' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200'}`}><ThumbsUp size={16} /></button>
              <button onClick={() => setFeedback('down')} className={`p-1.5 rounded-md transition-all duration-200 active:scale-90 ${feedback === 'down' ? 'text-red-600 bg-red-100' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200'}`}><ThumbsDown size={16} /></button>
            </div>
          </div>
        )}
      </div>

      {/* Sources Section */}
      {!isGenerating && matchedArticles.length > 0 && (
        <div className="animate-slide-up stagger-2">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2"><FileText size={16} className="text-gray-400" /> Nguồn tham khảo ({matchedArticles.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {matchedArticles.slice(0, 3).map((source, i) => {
              const colors = ['from-green-500 to-emerald-500', 'from-blue-500 to-indigo-500', 'from-purple-500 to-pink-500'];
              return (
                <div key={source.id} onClick={() => {
                  dispatch({ type: 'SET_SELECTED_ARTICLE', articleId: source.id });
                  dispatch({ type: 'INCREMENT_VIEWS', articleId: source.id });
                  dispatch({
                    type: 'TRACK_EVENT',
                    event: { type: 'open_article', userId: state.currentUser.id, articleId: source.id },
                  });
                }} className="card-premium p-4 cursor-pointer group flex flex-col h-full">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className={`inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-gradient-to-r ${colors[i] || colors[0]} rounded-full shadow-sm`}>{i + 1}</span>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-md">{source.matchScore}% phù hợp</span>
                  </div>
                  <h4 className="font-medium text-sm text-gray-900 group-hover:text-[#FF6B4A] transition-colors line-clamp-2 mb-auto">{source.title}</h4>
                  <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">Tác giả: <span className="font-medium text-gray-700">{source.author.name}</span></p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{source.snippet}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No Results */}
      {!isGenerating && matchedArticles.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <p className="text-gray-400 mb-4">Không tìm thấy bài viết phù hợp</p>
          <button
            onClick={() => dispatch({ type: 'OPEN_EDITOR', article: { title: currentQuery } })}
            className="px-4 py-2 bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6A] text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
          >
            Viết bài về "{currentQuery}"
          </button>
        </div>
      )}
    </div>
  );
}
