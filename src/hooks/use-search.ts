// Hook: search state and history management
import { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getAccessibleArticles } from '../lib/permissions';

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function useSearch() {
  const { state, dispatch } = useApp();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 200);

  const articles = getAccessibleArticles(state);

  const suggestions = useMemo(
    () =>
      debouncedQuery.trim()
        ? articles
            .filter(
              a =>
                a.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
                a.tags.some(t => t.toLowerCase().includes(debouncedQuery.toLowerCase()))
            )
            .slice(0, 5)
        : [],
    [articles, debouncedQuery]
  );

  const submitSearch = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    dispatch({ type: 'ADD_SEARCH_HISTORY', query: trimmed });
    dispatch({ type: 'SET_SEARCH_QUERY', query: trimmed });
    dispatch({ type: 'SET_SCREEN', screen: 'search' });
  };

  const removeHistoryItem = (q: string) =>
    dispatch({ type: 'REMOVE_SEARCH_HISTORY', query: q });

  const clearHistory = () => dispatch({ type: 'CLEAR_SEARCH_HISTORY' });

  return {
    query,
    setQuery,
    suggestions,
    history: state.searchHistory,
    submitSearch,
    removeHistoryItem,
    clearHistory,
  };
}
