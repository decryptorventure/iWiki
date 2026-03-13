import { Dispatch } from 'react';
import { AppAction, AppState } from '../store/useAppStore';

export interface AnalyticsBaseline {
  totalSearches: number;
  zeroResultSearches: number;
  zeroResultRate: number;
  openArticleEvents: number;
  favorites: number;
  reviewSubmitted: number;
  approved: number;
  rejected: number;
  published: number;
  activeUsers30d: number;
}

export function track(dispatch: Dispatch<AppAction>, event: AppAction['event']) {
  dispatch({ type: 'TRACK_EVENT', event });
}

export function getBaseline(state: AppState): AnalyticsBaseline {
  const events = state.analyticsEvents;
  const totalSearches = events.filter(e => e.type === 'search').length;
  const zeroResultSearches = events.filter(e => e.type === 'search' && e.meta?.resultsCount === 0).length;
  const uniqueUsers30d = new Set(
    events
      .filter(e => (Date.now() - new Date(e.createdAt).getTime()) <= 30 * 24 * 60 * 60 * 1000)
      .map(e => e.userId)
  );

  return {
    totalSearches,
    zeroResultSearches,
    zeroResultRate: totalSearches ? Math.round((zeroResultSearches / totalSearches) * 100) : 0,
    openArticleEvents: events.filter(e => e.type === 'open_article').length,
    favorites: events.filter(e => e.type === 'favorite').length,
    reviewSubmitted: events.filter(e => e.type === 'submit_review').length,
    approved: events.filter(e => e.type === 'approve').length,
    rejected: events.filter(e => e.type === 'reject').length,
    published: events.filter(e => e.type === 'publish').length,
    activeUsers30d: uniqueUsers30d.size,
  };
}
