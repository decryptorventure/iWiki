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

    dispatch({ type: 'INCREMENT_VIEWS', articleId: id });
    dispatch({ type: 'TRACK_EVENT', event: { type: 'open_article', userId: currentUser.id, articleId: id } });
  };

  const { individualLeaderboard, teamLeaderboard } = useMemo(() => {
    const authorCounts: Record<string, { name: string; role: string; avatar?: string; count: number; team: string }> = {};
    const teamCounts: Record<string, { name: string; count: number }> = {};

    const getTeam = (roleOrTitle: string) => {
      const lower = roleOrTitle.toLowerCase();
      if (lower.includes('product')) return 'Product Team';
      if (lower.includes('frontend') || lower.includes('fe')) return 'Frontend Team';
      if (lower.includes('backend') || lower.includes('be')) return 'Backend Team';
      if (lower.includes('devops') || lower.includes('infra')) return 'DevOps Team';
      if (lower.includes('hr') || lower.includes('admin')) return 'HR & Admin';
      return 'Others';
    };

    publishedArticles.forEach(a => {
      const authorId = a.author.id;
        const team = getTeam(a.author.role || '');
      
      if (!authorCounts[authorId]) {
        authorCounts[authorId] = { name: a.author.name, role: a.author.role, avatar: a.author.avatar, count: 0, team };
      }
      authorCounts[authorId].count += 1;

      if (!teamCounts[team]) {
        teamCounts[team] = { name: team, count: 0 };
      }
      teamCounts[team].count += 1;
    });

    const indSub = Object.values(authorCounts).sort((a, b) => b.count - a.count).slice(0, 5).map((u, i) => ({ ...u, rank: i + 1, score: u.count }));
    const teamSub = Object.values(teamCounts).sort((a, b) => b.count - a.count).slice(0, 5).map((t, i) => ({ ...t, rank: i + 1, score: t.count, avatar: undefined }));

    return { individualLeaderboard: indSub, teamLeaderboard: teamSub };
  }, [publishedArticles]);

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
        <DashboardRightSidebar individualLeaderboard={individualLeaderboard} teamLeaderboard={teamLeaderboard} recentReadArticles={recentReadArticles} onOpenArticle={openArticle} />
      </div>
    </div>
  );
}
