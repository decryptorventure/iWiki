// Analytics domain type

export interface AnalyticsEvent {
  id: string;
  type:
    | 'search'
    | 'open_article'
    | 'favorite'
    | 'submit_review'
    | 'approve'
    | 'reject'
    | 'publish'
    | 'ai_write'
    | 'ai_search';
  userId: string;
  articleId?: string;
  query?: string;
  meta?: Record<string, string | number | boolean>;
  createdAt: string;
}
