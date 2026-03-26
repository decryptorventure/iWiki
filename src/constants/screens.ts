export const APP_SCREENS = {
  DASHBOARD: 'dashboard',
  SEARCH: 'search',
  AI: 'ai',
  PROFILE: 'profile',
  MY_ARTICLES: 'my-articles',
  CUSTOM_FEED: 'custom-feed',
  FAVORITES: 'favorites',
  BOUNTIES: 'bounties',
  JANITOR: 'janitor',
  NOTIFICATIONS: 'notifications',
  PERMISSIONS: 'permissions',
  ARTICLE_DETAIL: 'article-detail',
  EDITOR: 'editor',
  EMPTY_FOLDER: 'empty-folder',
} as const;

export type AppScreen = (typeof APP_SCREENS)[keyof typeof APP_SCREENS] | `folder-${string}`;
