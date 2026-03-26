// Import domain types for use within this file
import type {
  UserRole, AccessLevel, User,
  ArticleStatus, Comment, ApprovalInlineComment, Article,
  Folder,
  Bounty,
  Notification,
  AIChatSession,
  AnalyticsEvent,
  RecentReadItem, CustomFeedPrefs,
} from '../types';

// Re-export so existing imports from this file continue to work without changes
export type {
  UserRole, AccessLevel, Badge, ScopeAccess, User,
  ArticleStatus, Comment, ApprovalInlineComment, ApprovalRecord, Article,
  Folder,
  Bounty,
  Notification,
  AIChatMessage, AIChatSession,
  AnalyticsEvent,
  RecentReadItem, CustomFeedPrefs,
} from '../types';

import {
  PRESET_USERS,
  INITIAL_USER,
  INITIAL_FOLDERS,
  INITIAL_ARTICLES_WITH_CONTENT,
  INITIAL_BOUNTIES,
  INITIAL_NOTIFICATIONS,
  buildSeedAnalyticsEvents,
} from '../data/mock-data';
import { loadState, saveState } from './persist';
import { ARTICLE_CONTENTS } from '../data/articleContents';

// Re-export PRESET_USERS so Login.tsx import continues to work
export { PRESET_USERS };

export interface AppState {
  isLoggedIn: boolean;
  currentScreen: string;
  searchQuery: string;
  userRole: UserRole;
  currentUser: User;
  articles: Article[];
  folders: Folder[];
  bounties: Bounty[];
  notifications: Notification[];
  editorData: Partial<Article> | null;
  selectedArticleId: string | null;
  currentFolderId: string | null;
  aiHistory: AIChatSession[];
  searchHistory: string[];
  favoritesByUser: Record<string, string[]>;
  analyticsEvents: AnalyticsEvent[];
  customFeedPrefs: CustomFeedPrefs;
  recentReadsByUser: Record<string, RecentReadItem[]>;
  /** User id -> đã xem onboarding lần đầu (chỉ hiện tour 1 lần mỗi user) */
  onboardingCompletedForUsers: Record<string, boolean>;
  theme: 'light' | 'dark';
}

const savedState = loadState<AppState>();

export const initialState: AppState = {
  isLoggedIn: savedState.isLoggedIn ?? false,
  currentScreen: 'dashboard',
  searchQuery: '',
  userRole: savedState.currentUser?.role || INITIAL_USER.role,
  currentUser: {
    ...INITIAL_USER,
    ...(savedState.currentUser || {}),
    scopes: Array.isArray(savedState.currentUser?.scopes)
      ? savedState.currentUser.scopes
      : INITIAL_USER.scopes,
  },
  // Re-apply latest article content over any saved articles (keeps content fresh)
  articles: (savedState.articles || INITIAL_ARTICLES_WITH_CONTENT).map((a) => ({
    ...a,
    content: ARTICLE_CONTENTS[a.id] ?? a.content,
  })),
  folders: INITIAL_FOLDERS,
  bounties: savedState.bounties || INITIAL_BOUNTIES,
  notifications: savedState.notifications || INITIAL_NOTIFICATIONS,
  editorData: null,
  selectedArticleId: null,
  currentFolderId: null,
  aiHistory: savedState.aiHistory || [],
  searchHistory: savedState.searchHistory || ['Quy trình xin nghỉ phép', 'Template OKR Q3'],
  favoritesByUser: savedState.favoritesByUser || {},
  analyticsEvents: savedState.analyticsEvents || buildSeedAnalyticsEvents(savedState.currentUser?.id || INITIAL_USER.id),
  customFeedPrefs: savedState.customFeedPrefs || { tags: [], folderIds: [] },
  recentReadsByUser: savedState.recentReadsByUser || {},
  onboardingCompletedForUsers: savedState.onboardingCompletedForUsers || {},
  theme: savedState.theme || 'light',
};

export type AppAction =
  | { type: 'LOGIN'; role: 'viewer' | 'editor' | 'admin' }
  | { type: 'LOGOUT' }
  | { type: 'SET_SCREEN'; screen: string }
  | { type: 'SET_SEARCH_QUERY'; query: string }
  | { type: 'SET_ROLE'; role: UserRole }
  | { type: 'SET_SELECTED_ARTICLE'; articleId: string | null }
  | { type: 'SET_CURRENT_FOLDER'; folderId: string | null }
  | { type: 'OPEN_EDITOR'; article?: Partial<Article> }
  | { type: 'SAVE_ARTICLE'; article: Article }
  | { type: 'DELETE_ARTICLE'; articleId: string }
  | { type: 'SUBMIT_ARTICLE_REVIEW'; articleId: string; userId: string }
  | { type: 'APPROVE_ARTICLE'; articleId: string; approverId: string }
  | { type: 'REJECT_ARTICLE'; articleId: string; approverId: string; reason: string }
  | { type: 'ADD_APPROVAL_COMMENT'; articleId: string; comment: ApprovalInlineComment }
  | { type: 'PUBLISH_APPROVED_ARTICLE'; articleId: string }
  | { type: 'SET_ARTICLE_VIEW_PERMISSION'; articleId: string; viewPermission: 'public' | 'restricted' }
  | { type: 'SET_SCOPE_ACCESS'; folderId: string; level: AccessLevel }
  | { type: 'TOGGLE_LIKE'; articleId: string; userId: string }
  | { type: 'TOGGLE_FAVORITE'; articleId: string; userId: string }
  | { type: 'ADD_COMMENT'; articleId: string; comment: Comment }
  | { type: 'CREATE_BOUNTY'; bounty: Bounty }
  | { type: 'ACCEPT_BOUNTY'; bountyId: string; userId: string }
  | { type: 'UPDATE_USER'; updates: Partial<User> }
  | { type: 'ADD_NOTIFICATION'; notification: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; notificationId: string }
  | { type: 'DELETE_NOTIFICATION'; notificationId: string }
  | { type: 'MARK_ALL_READ' }
  | { type: 'INCREMENT_VIEWS'; articleId: string }
  | { type: 'SAVE_AI_SESSION'; session: AIChatSession }
  | { type: 'DELETE_AI_SESSION'; sessionId: string }
  | { type: 'ADD_SEARCH_HISTORY'; query: string }
  | { type: 'REMOVE_SEARCH_HISTORY'; query: string }
  | { type: 'CLEAR_SEARCH_HISTORY' }
  | { type: 'UPDATE_CUSTOM_FEED_PREFS'; prefs: Partial<CustomFeedPrefs> }
  | { type: 'TRACK_EVENT'; event: Omit<AnalyticsEvent, 'id' | 'createdAt'> }
  | { type: 'RESET_DEMO_STATE' }
  | { type: 'COMPLETE_ONBOARDING'; userId: string }
  | { type: 'TOGGLE_THEME' };

export function appReducer(state: AppState, action: AppAction): AppState {
  let newState: AppState;

  switch (action.type) {
    case 'LOGIN': {
      const user = PRESET_USERS[action.role];
      newState = { ...state, isLoggedIn: true, currentUser: user, userRole: user.role, currentScreen: 'dashboard' };
      break;
    }
    case 'LOGOUT':
      newState = { ...state, isLoggedIn: false, currentScreen: 'dashboard' };
      break;
    case 'SET_SCREEN':
      newState = { ...state, currentScreen: action.screen };
      break;
    case 'SET_SEARCH_QUERY':
      newState = { ...state, searchQuery: action.query };
      break;
    case 'SET_ROLE':
      newState = { ...state, userRole: action.role, currentUser: { ...state.currentUser, role: action.role } };
      break;
    case 'SET_SELECTED_ARTICLE':
      newState = { ...state, selectedArticleId: action.articleId };
      break;
    case 'SET_CURRENT_FOLDER':
      newState = { ...state, currentFolderId: action.folderId };
      break;
    case 'OPEN_EDITOR':
      newState = { ...state, editorData: action.article || {}, currentScreen: 'editor' };
      break;
    case 'SAVE_ARTICLE': {
      const exists = state.articles.find(a => a.id === action.article.id);
      const updated = exists
        ? state.articles.map(a => a.id === action.article.id ? action.article : a)
        : [...state.articles, action.article];
      newState = { ...state, articles: updated, currentScreen: 'my-articles', editorData: null };
      break;
    }
    case 'DELETE_ARTICLE':
      newState = { ...state, articles: state.articles.filter(a => a.id !== action.articleId) };
      break;
    case 'SUBMIT_ARTICLE_REVIEW': {
      const updated = state.articles.map(a => {
        if (a.id !== action.articleId) return a;
        return {
          ...a,
          status: 'in_review' as ArticleStatus,
          updatedAt: new Date().toISOString().split('T')[0],
          approval: { ...a.approval, submittedAt: new Date().toISOString(), submittedBy: action.userId, rejectionReason: undefined },
        };
      });
      newState = { ...state, articles: updated };
      break;
    }
    case 'APPROVE_ARTICLE': {
      const updated = state.articles.map(a => {
        if (a.id !== action.articleId) return a;
        return {
          ...a,
          status: 'approved' as ArticleStatus,
          updatedAt: new Date().toISOString().split('T')[0],
          approval: { ...a.approval, reviewedAt: new Date().toISOString(), reviewedBy: action.approverId, rejectionReason: undefined },
        };
      });
      newState = { ...state, articles: updated };
      break;
    }
    case 'REJECT_ARTICLE': {
      const updated = state.articles.map(a => {
        if (a.id !== action.articleId) return a;
        return {
          ...a,
          status: 'rejected' as ArticleStatus,
          updatedAt: new Date().toISOString().split('T')[0],
          approval: { ...a.approval, reviewedAt: new Date().toISOString(), reviewedBy: action.approverId, rejectionReason: action.reason },
        };
      });
      newState = { ...state, articles: updated };
      break;
    }
    case 'ADD_APPROVAL_COMMENT': {
      const updated = state.articles.map(a => {
        if (a.id !== action.articleId) return a;
        return {
          ...a,
          approval: { ...a.approval, comments: [...(a.approval?.comments || []), action.comment] },
          updatedAt: new Date().toISOString().split('T')[0],
        };
      });
      newState = { ...state, articles: updated };
      break;
    }
    case 'PUBLISH_APPROVED_ARTICLE': {
      const updated = state.articles.map(a =>
        a.id === action.articleId ? { ...a, status: 'published' as ArticleStatus, updatedAt: new Date().toISOString().split('T')[0] } : a
      );
      newState = { ...state, articles: updated };
      break;
    }
    case 'SET_ARTICLE_VIEW_PERMISSION': {
      const updated = state.articles.map(a =>
        a.id === action.articleId ? { ...a, viewPermission: action.viewPermission, updatedAt: new Date().toISOString().split('T')[0] } : a
      );
      newState = { ...state, articles: updated };
      break;
    }
    case 'SET_SCOPE_ACCESS': {
      const previousScopes = Array.isArray(state.currentUser.scopes) ? state.currentUser.scopes : [];
      const existing = previousScopes.find(s => s.folderId === action.folderId);
      const nextScopes = existing
        ? previousScopes.map(s => s.folderId === action.folderId ? { ...s, level: action.level } : s)
        : [...previousScopes, { folderId: action.folderId, level: action.level }];
      newState = { ...state, currentUser: { ...state.currentUser, scopes: nextScopes } };
      break;
    }
    case 'TOGGLE_LIKE': {
      const updated = state.articles.map(a => {
        if (a.id !== action.articleId) return a;
        const liked = a.likedBy.includes(action.userId);
        return {
          ...a,
          likes: liked ? Math.max(0, a.likes - 1) : a.likes + 1,
          likedBy: liked ? a.likedBy.filter(id => id !== action.userId) : [...a.likedBy, action.userId],
        };
      });
      newState = { ...state, articles: updated };
      break;
    }
    case 'TOGGLE_FAVORITE': {
      const current = state.favoritesByUser[action.userId] || [];
      const existed = current.includes(action.articleId);
      newState = {
        ...state,
        favoritesByUser: {
          ...state.favoritesByUser,
          [action.userId]: existed ? current.filter(id => id !== action.articleId) : [action.articleId, ...current],
        },
      };
      break;
    }
    case 'ADD_COMMENT': {
      const updated = state.articles.map(a =>
        a.id === action.articleId ? { ...a, comments: [...a.comments, action.comment] } : a
      );
      newState = { ...state, articles: updated };
      break;
    }
    case 'CREATE_BOUNTY':
      newState = { ...state, bounties: [action.bounty, ...state.bounties] };
      break;
    case 'ACCEPT_BOUNTY': {
      const updated = state.bounties.map(b => {
        if (b.id !== action.bountyId) return b;
        const accepted = b.acceptedBy.includes(action.userId);
        return {
          ...b,
          acceptedBy: accepted ? b.acceptedBy.filter(id => id !== action.userId) : [...b.acceptedBy, action.userId],
          status: (accepted ? 'open' : 'accepted') as Bounty['status'],
        };
      });
      newState = { ...state, bounties: updated };
      break;
    }
    case 'UPDATE_USER':
      newState = { ...state, currentUser: { ...state.currentUser, ...action.updates } };
      break;
    case 'ADD_NOTIFICATION':
      newState = { ...state, notifications: [action.notification, ...state.notifications] };
      break;
    case 'MARK_NOTIFICATION_READ':
      newState = { ...state, notifications: state.notifications.map(n => n.id === action.notificationId ? { ...n, isRead: true } : n) };
      break;
    case 'DELETE_NOTIFICATION':
      newState = { ...state, notifications: state.notifications.filter(n => n.id !== action.notificationId) };
      break;
    case 'MARK_ALL_READ':
      newState = { ...state, notifications: state.notifications.map(n => ({ ...n, isRead: true })) };
      break;
    case 'INCREMENT_VIEWS': {
      const now = new Date().toISOString();
      const nextArticles = state.articles.map(a => a.id === action.articleId ? { ...a, views: a.views + 1 } : a);
      const current = state.recentReadsByUser[state.currentUser.id] || [];
      const existing = current.find((item) => item.articleId === action.articleId);
      const nextRecentReads = existing
        ? current.map((item) => item.articleId === action.articleId ? { ...item, lastReadAt: now, count: item.count + 1 } : item)
        : [{ articleId: action.articleId, lastReadAt: now, count: 1 }, ...current];
      newState = {
        ...state,
        articles: nextArticles,
        recentReadsByUser: {
          ...state.recentReadsByUser,
          [state.currentUser.id]: nextRecentReads
            .sort((a, b) => new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime())
            .slice(0, 20),
        },
      };
      break;
    }
    case 'SAVE_AI_SESSION': {
      const exists = state.aiHistory.find(s => s.id === action.session.id);
      const updated = exists
        ? state.aiHistory.map(s => s.id === action.session.id ? action.session : s)
        : [action.session, ...state.aiHistory];
      newState = { ...state, aiHistory: updated };
      break;
    }
    case 'DELETE_AI_SESSION':
      newState = { ...state, aiHistory: state.aiHistory.filter(s => s.id !== action.sessionId) };
      break;
    case 'ADD_SEARCH_HISTORY':
      newState = { ...state, searchHistory: [action.query, ...state.searchHistory.filter(q => q !== action.query)].slice(0, 10) };
      break;
    case 'REMOVE_SEARCH_HISTORY':
      newState = { ...state, searchHistory: state.searchHistory.filter(q => q !== action.query) };
      break;
    case 'CLEAR_SEARCH_HISTORY':
      newState = { ...state, searchHistory: [] };
      break;
    case 'UPDATE_CUSTOM_FEED_PREFS':
      newState = { ...state, customFeedPrefs: { ...state.customFeedPrefs, ...action.prefs } };
      break;
    case 'TRACK_EVENT':
      newState = {
        ...state,
        analyticsEvents: [
          { ...action.event, id: `e-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, createdAt: new Date().toISOString() },
          ...state.analyticsEvents,
        ].slice(0, 2000),
      };
      break;
    case 'RESET_DEMO_STATE':
      newState = {
        ...state,
        currentScreen: 'dashboard',
        selectedArticleId: null,
        currentFolderId: null,
        editorData: null,
        articles: INITIAL_ARTICLES_WITH_CONTENT,
        bounties: INITIAL_BOUNTIES,
        notifications: INITIAL_NOTIFICATIONS,
        aiHistory: [],
        searchHistory: ['Quy trình xin nghỉ phép', 'Template OKR Q3'],
        favoritesByUser: {},
        analyticsEvents: buildSeedAnalyticsEvents(state.currentUser.id),
        customFeedPrefs: { tags: [], folderIds: [] },
        recentReadsByUser: {},
      };
      break;
    case 'COMPLETE_ONBOARDING':
      newState = { ...state, onboardingCompletedForUsers: { ...state.onboardingCompletedForUsers, [action.userId]: true } };
      break;
    case 'TOGGLE_THEME':
      newState = { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
      break;
    default:
      return state;
  }

  saveState({
    isLoggedIn: newState.isLoggedIn,
    currentUser: newState.currentUser,
    articles: newState.articles,
    bounties: newState.bounties,
    notifications: newState.notifications,
    aiHistory: newState.aiHistory,
    searchHistory: newState.searchHistory,
    favoritesByUser: newState.favoritesByUser,
    analyticsEvents: newState.analyticsEvents,
    customFeedPrefs: newState.customFeedPrefs,
    recentReadsByUser: newState.recentReadsByUser,
    onboardingCompletedForUsers: newState.onboardingCompletedForUsers,
    theme: newState.theme,
  });

  return newState;
}
