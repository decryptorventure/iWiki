import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Sparkles, ExternalLink, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { retrieveContext, generateRAGResponse } from '../lib/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { Input } from '../ui/Input';

interface Props {
  query: string;
  onBack: () => void;
}

export default function SearchResult({ query, onBack }: Props) {
  const { state, dispatch } = useApp();
  const { articles } = state;

  const [aiAnswer, setAiAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(query);

  const published = articles.filter(a => a.status === 'published');
  const results = published.filter(a =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.content?.toLowerCase().includes(query.toLowerCase()) ||
    a.excerpt?.toLowerCase().includes(query.toLowerCase()) ||
    a.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
  );

  useEffect(() => {
    if (!query) return;
    const generate = async () => {
      setIsLoading(true);
      setAiAnswer('');
      const ctx = retrieveContext(query, articles);
      if (ctx.length === 0) { setIsLoading(false); return; }
      try {
        await generateRAGResponse(query, ctx, (chunk) => setAiAnswer(chunk));
      } catch { }
      setIsLoading(false);
    };
    generate();
  }, [query]);

  const openArticle = (id: string) => {
    dispatch({ type: 'SET_SELECTED_ARTICLE', articleId: id });
    dispatch({ type: 'INCREMENT_VIEWS', articleId: id });
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      dispatch({ type: 'SET_SEARCH_QUERY', query: searchQuery.trim() });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Search bar */}
      <div className="flex items-center gap-3 mb-10">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-md text-gray-400 transition-colors shrink-0">
          <ArrowLeft size={18} />
        </button>
        <div className="relative flex-1">
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Tìm kiếm..."
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Kết quả tìm kiếm</h2>
        <p className="text-sm text-gray-500">
          Tìm thấy <strong className="text-gray-900">{results.length}</strong> bài viết cho từ khoá <strong className="text-gray-900">"{query}"</strong>
        </p>
      </div>

      {/* AI Summary */}
      <AnimatePresence>
        {(isLoading || aiAnswer) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-orange-50/50 border border-orange-100 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-orange-500" />
              <span className="text-sm font-bold text-orange-600">iWiki AI Tóm tắt</span>
            </div>
            {isLoading && !aiAnswer ? (
              <div className="flex items-center gap-3 text-sm text-orange-400 font-medium font-medium">
                <div className="w-4 h-4 border-2 border-orange-300 border-t-orange-500 rounded-full animate-spin" />
                <span>Đang tổng hợp thông tin...</span>
              </div>
            ) : (
              <p className="text-sm text-gray-700 leading-relaxed font-medium">{aiAnswer}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      {results.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <Search size={40} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-900 font-bold mb-1">Không tìm thấy bài viết nào</p>
          <p className="text-gray-400 text-xs">Hãy thử dùng từ khoá ngắn hơn hoặc đặt câu hỏi cho AI.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => openArticle(article.id)}
              className="flex items-start gap-5 p-4 bg-white border border-gray-100 rounded-lg cursor-pointer hover:border-orange-200 hover:bg-orange-50/10 transition-all group"
            >
              {article.coverUrl && (
                <img src={article.coverUrl} className="w-24 h-16 object-cover rounded shrink-0" referrerPolicy="no-referrer" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold text-orange-500 uppercase">{article.folderName}</span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-relaxed mb-2">
                  {article.title}
                </h3>
                <div className="flex items-center gap-4 text-[11px] text-gray-400 font-medium">
                  <div className="flex items-center gap-1.5">
                    <img src={article.author.avatar} className="w-4 h-4 rounded-full" referrerPolicy="no-referrer" />
                    <span>{article.author.name}</span>
                  </div>
                  <span>{article.createdAt}</span>
                  <span className="flex items-center gap-1"><Eye size={12} /> {article.views}</span>
                </div>
              </div>
              <ExternalLink size={14} className="text-gray-300 group-hover:text-orange-400 transition-colors mt-1" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
