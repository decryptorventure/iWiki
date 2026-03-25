import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { getAccessibleArticles } from '../lib/permissions';
import PersonalizedFeed from './PersonalizedFeed';
import DashboardHeroSearch from './dashboard-hero-search';
import DashboardFeaturedArticles from './dashboard-featured-articles';
import DashboardAllArticles from './dashboard-all-articles';
import DashboardRightSidebar from './dashboard-right-sidebar';

export default function Dashboard({ onSearch }: { onSearch: (q: string) => void }) {
  const { state, dispatch } = useApp();
  const { currentUser, recentReadsByUser } = state;
  const articles = getAccessibleArticles(state);
  const publishedArticles = articles.filter(a => a.status === 'published');

  const openArticle = (id: string) => {
    dispatch({ type: 'SET_SELECTED_ARTICLE', articleId: id });
    dispatch({ type: 'SET_SCREEN', screen: 'article-detail' });
    dispatch({ type: 'INCREMENT_VIEWS', articleId: id });
    dispatch({ type: 'TRACK_EVENT', event: { type: 'open_article', userId: currentUser.id, articleId: id } });
  };

  const leaderboard = useMemo(() => {
    const scoreByAuthor = publishedArticles.reduce<Record<string, { name: string; role: string; avatar?: string; score: number }>>(
      (acc, article) => {
        const key = article.author.id;
        if (!acc[key]) acc[key] = { name: article.author.name, role: article.author.role, avatar: article.author.avatar, score: 0 };
        acc[key].score += article.views + article.likes * 8 + article.comments.length * 4;
        return acc;
      }, {}
    );
    const base = Object.values(scoreByAuthor).sort((a, b) => b.score - a.score).slice(0, 5).map((item, idx) => ({ ...item, rank: idx + 1 }));
    if (!base.some(item => item.name === currentUser.name)) {
      base.splice(Math.min(4, base.length), 0, { rank: 0, name: currentUser.name, role: currentUser.title, avatar: currentUser.avatar, score: currentUser.xp });
    }
    return base.sort((a, b) => b.score - a.score).slice(0, 5).map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [publishedArticles, currentUser]);

  const recentReadArticles = useMemo(() => {
    const history = recentReadsByUser[currentUser.id] || [];
    return history
      .map(meta => ({ meta, article: articles.find(a => a.id === meta.articleId) }))
      .filter((item): item is { meta: typeof history[number]; article: typeof articles[number] } => Boolean(item.article))
      .slice(0, 4);
  }, [recentReadsByUser, currentUser.id, articles]);

  return (
    <div className="max-w-7xl mx-auto px-8 py-12 relative">
      <DashboardHeroSearch onSearch={onSearch} onOpenArticle={openArticle} />
      <PersonalizedFeed onOpenArticle={openArticle} />
      <DashboardFeaturedArticles articles={publishedArticles} onOpenArticle={openArticle} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up stagger-4">
        <DashboardAllArticles articles={publishedArticles} onOpenArticle={openArticle} />
        <DashboardRightSidebar leaderboard={leaderboard} recentReadArticles={recentReadArticles} onOpenArticle={openArticle} />
      </div>
    </div>
  );
}
