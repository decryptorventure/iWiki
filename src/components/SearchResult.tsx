import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowLeft, FileText, Search, Copy, Check, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateRagAnswer } from '../lib/rag';
import { Button, Input } from '@frontend-team/ui-kit';

function buildDraftFromQuery(query: string) {
  return {
    title: query,
    tags: ['Draft', 'AI Assisted'],
    content: `# ${query}

## Bối cảnh
- Vấn đề hiện tại:
- Vì sao cần tài liệu này:

## Nội dung chính
- Ý 1:
- Ý 2:
- Ý 3:

## Checklist áp dụng
- [ ] Bước 1
- [ ] Bước 2
- [ ] Bước 3

## Tài liệu liên quan
- Nguồn tham khảo nội bộ:
`,
  };
}

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
    return { ...source, matchScore: citation.score, snippet: citation.snippet };
  });

  useEffect(() => {
    setIsGenerating(true);
    const timer = setTimeout(() => setIsGenerating(false), 1500);
    return () => clearTimeout(timer);
  }, [currentQuery]);

  useEffect(() => {
    dispatch({
      type: 'TRACK_EVENT',
      event: { type: 'search', userId: state.currentUser.id, query: currentQuery, meta: { resultsCount: matchedArticles.length } },
    });
  }, [currentQuery]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    dispatch({ type: 'ADD_SEARCH_HISTORY', query: searchQuery.trim() });
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
        <Button variant="subtle" size="icon-m" onClick={onBack}><ArrowLeft size={20} /></Button>
        <div className="flex-1 relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#f76226]/10 to-orange-300/10 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Search className="h-4 w-4 text-gray-400 group-focus-within:text-[#f76226] transition-colors" /></div>
            <Input
              type="text"
              className="block w-full pl-10 pr-28"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSearch()}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Button variant="primary" size="s" onClick={handleSearch}>Tìm kiếm</Button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Answer Block */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden mb-8 animate-slide-up stagger-1">
        <div className="bg-gradient-to-r from-orange-50 via-amber-50/50 to-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#f76226] font-semibold">
            <div className="p-1 bg-gradient-to-br from-[#f76226] to-orange-400 rounded-lg text-white"><Sparkles size={14} /></div>
            <span>iWiki AI trả lời</span>
          </div>
          <Button variant="subtle" size="icon-s" onClick={handleCopy}>
            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
          </Button>
        </div>

        <div className="p-6">
          {isGenerating ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#f76226] to-orange-400 animate-pulse" />
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
              <p dangerouslySetInnerHTML={{ __html: aiAnswer.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') }} />
            </div>
          )}
        </div>

        {!isGenerating && (
          <div className="bg-gray-50/80 px-6 py-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">Câu trả lời này có hữu ích không?</span>
            <div className="flex items-center gap-2">
              <Button variant="subtle" size="icon-s" onClick={() => setFeedback('up')} className={feedback === 'up' ? 'text-green-600 bg-green-100' : ''}><ThumbsUp size={16} /></Button>
              <Button variant="subtle" size="icon-s" onClick={() => setFeedback('down')} className={feedback === 'down' ? 'text-red-600 bg-red-100' : ''}><ThumbsDown size={16} /></Button>
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
                  dispatch({ type: 'SET_SCREEN', screen: 'article-detail' });
                  dispatch({ type: 'INCREMENT_VIEWS', articleId: source.id });
                  dispatch({ type: 'TRACK_EVENT', event: { type: 'open_article', userId: state.currentUser.id, articleId: source.id } });
                }} className="card-premium p-4 cursor-pointer group flex flex-col h-full">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className={`inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-gradient-to-r ${colors[i] || colors[0]} rounded-full shadow-sm`}>{i + 1}</span>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-md">{source.matchScore}% phù hợp</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {source.matchScore >= 80 && <span className="text-[10px] px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded">Intent match</span>}
                    {source.matchScore >= 60 && <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">Semantic</span>}
                    <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">Citation</span>
                  </div>
                  <h4 className="font-medium text-sm text-gray-900 group-hover:text-[#f76226] transition-colors line-clamp-2 mb-auto">{source.title}</h4>
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
          <Button variant="primary" onClick={() => dispatch({ type: 'OPEN_EDITOR', article: buildDraftFromQuery(currentQuery) })}>
            Tạo draft AI cho "{currentQuery}"
          </Button>
        </div>
      )}
    </div>
  );
}
