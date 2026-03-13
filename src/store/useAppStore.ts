export type UserRole = 'admin' | 'manager' | 'editor' | 'viewer';
export type AccessLevel = 'none' | 'read' | 'write' | 'approve' | 'admin';
export type ArticleStatus = 'draft' | 'in_review' | 'approved' | 'rejected' | 'published';

export interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
  earned: boolean;
}

export interface ScopeAccess {
  folderId: string;
  level: AccessLevel;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  title: string;
  avatar: string;
  level: number;
  xp: number;
  xpToNext: number;
  coins: number;
  badges: Badge[];
  scopes: ScopeAccess[];
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

export interface ApprovalRecord {
  submittedAt?: string;
  submittedBy?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  coverUrl?: string;
  folderId: string;
  folderName?: string;
  tags: string[];
  author: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
    initials?: string;
    color?: string;
  };
  status: ArticleStatus;
  viewPermission: 'public' | 'restricted';
  allowComments: boolean;
  views: number;
  likes: number;
  likedBy: string[];
  comments: Comment[];
  approval?: ApprovalRecord;
  createdAt: string;
  updatedAt: string;
}

export interface Folder {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  icon?: string;
  color?: string;
  children?: Folder[];
  articleCount?: number;
}

export interface Bounty {
  id: string;
  title: string;
  description: string;
  requester: string;
  requesterId: string;
  reward: number;
  deadline: string;
  tags: string[];
  hot: boolean;
  acceptedBy: string[];
  submittedArticleId?: string;
  status: 'open' | 'accepted' | 'completed';
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'comment' | 'like' | 'reward' | 'bounty' | 'approval' | 'system';
  time: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AIChatSession {
  id: string;
  topic: string;
  messages: AIChatMessage[];
  updatedAt: string;
}

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

export interface CustomFeedPrefs {
  tags: string[];
  folderIds: string[];
}

export interface AppState {
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
}

const INITIAL_USER: User = {
  id: 'user-1',
  name: 'Nguyễn Văn A',
  role: 'manager',
  title: 'Product Manager',
  avatar: 'https://picsum.photos/seed/ikame/100/100',
  level: 12,
  xp: 8450,
  xpToNext: 10000,
  coins: 1250,
  scopes: [
    { folderId: 'f-product', level: 'admin' },
    { folderId: 'f-pm-process', level: 'admin' },
    { folderId: 'f-company', level: 'read' },
    { folderId: 'f-knowhow', level: 'write' },
  ],
  badges: [
    { id: 'b1', name: 'First Article', icon: '✍️', color: 'blue', earned: true },
    { id: 'b2', name: 'Knowledge Sharer', icon: '📚', color: 'purple', earned: true },
    { id: 'b3', name: 'Top Contributor', icon: '🏆', color: 'yellow', earned: true },
    { id: 'b4', name: 'AI Pioneer', icon: '🤖', color: 'green', earned: false },
  ],
};

const INITIAL_FOLDERS: Folder[] = [
  {
    id: 'f-company', name: 'Công ty iKame', description: 'Tài liệu chính sách và quy trình công ty',
    children: [
      { id: 'f-hr', name: 'Chính sách nhân sự', parentId: 'f-company' },
      { id: 'f-process', name: 'Quy trình chung', parentId: 'f-company' },
      { id: 'f-culture', name: 'Văn hóa & Giá trị', parentId: 'f-company' },
    ]
  },
  {
    id: 'f-tech', name: 'Phòng Kỹ thuật', description: 'Tài liệu kỹ thuật nội bộ',
    children: [
      { id: 'f-fe', name: 'Frontend Guidelines', parentId: 'f-tech' },
      { id: 'f-be', name: 'Backend Architecture', parentId: 'f-tech' },
      { id: 'f-devops', name: 'DevOps & Infrastructure', parentId: 'f-tech' },
    ]
  },
  {
    id: 'f-knowhow', name: 'Know-How', description: 'Kho tri thức, kinh nghiệm, kỹ năng',
    children: [
      { id: 'f-mindset', name: 'Mindset', parentId: 'f-knowhow' },
      { id: 'f-checklist', name: 'Process & Checklist', parentId: 'f-knowhow' },
      { id: 'f-softskills', name: 'Soft Skills', parentId: 'f-knowhow' },
    ]
  },
  {
    id: 'f-product', name: 'Product Guild', description: 'Tài liệu product management',
    children: [
      { id: 'f-pm-process', name: 'Product Processes', parentId: 'f-product' },
      { id: 'f-pm-templates', name: 'Templates', parentId: 'f-product' },
    ]
  },
];

const INITIAL_ARTICLES: Article[] = [
  {
    id: 'a-1', title: 'Những điều iKamer cần biết về Performance Checkpoint',
    content: '# Performance Checkpoint tại iKame\n\nBài viết tổng hợp các bước triển khai và tiêu chí đánh giá.',
    excerpt: 'Cẩm nang những điều cần biết để có kỳ Checkpoint hiệu quả.',
    coverUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=800',
    folderId: 'f-hr', folderName: 'Chính sách nhân sự',
    tags: ['HR', 'Performance', 'OKRs'],
    author: { id: 'user-hr', name: 'Nguyễn Thị Nguyệt', role: 'CHRO', avatar: 'https://picsum.photos/seed/nguyet/100/100' },
    status: 'published', viewPermission: 'public', allowComments: true,
    views: 1398, likes: 19, likedBy: [], comments: [],
    createdAt: '2023-12-18', updatedAt: '2023-12-18',
  },
  {
    id: 'a-2', title: 'How to connect VPN iKAME using FortiClient',
    content: '# Hướng dẫn kết nối VPN iKame qua FortiClient\n\n1. Cài đặt client.\n2. Cấu hình gateway.\n3. Dùng OTP để xác thực.',
    excerpt: 'Step-by-step guide to setup VPN.',
    coverUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
    folderId: 'f-be', folderName: 'Backend Architecture',
    tags: ['IT', 'VPN', 'Security'],
    author: { id: 'user-2', name: 'Trần Hoàng Huy', role: 'Solution BE Developer', avatar: 'https://picsum.photos/seed/huy/100/100' },
    status: 'published', viewPermission: 'restricted', allowComments: true,
    views: 841, likes: 6, likedBy: [], comments: [],
    createdAt: '2023-11-22', updatedAt: '2023-11-22',
  },
  {
    id: 'a-3', title: 'OKR Framework — Hỏi đáp thực tế từ team Product',
    content: '# OKRs trong thực tế tại iKame\n\nMẫu triển khai OKR theo quý cho Product team.',
    excerpt: 'Guide thực tế về OKR framework từ team Product.',
    folderId: 'f-pm-process', folderName: 'Product Processes',
    tags: ['Product', 'OKRs', 'Framework'],
    author: { id: 'user-1', name: 'Nguyễn Văn A', role: 'Product Manager', avatar: 'https://picsum.photos/seed/ikame/100/100' },
    status: 'in_review', viewPermission: 'public', allowComments: true,
    views: 420, likes: 28, likedBy: [], comments: [],
    approval: { submittedAt: '2026-03-09', submittedBy: 'user-1' },
    createdAt: '2026-03-08', updatedAt: '2026-03-09',
  },
  {
    id: 'a-4', title: 'Playbook onboarding nhân sự mới',
    content: '# Onboarding Playbook\n\nChecklist tuần đầu cho nhân sự mới.',
    folderId: 'f-process', folderName: 'Quy trình chung',
    tags: ['HR', 'Onboarding'],
    author: { id: 'user-1', name: 'Nguyễn Văn A', role: 'Product Manager', avatar: 'https://picsum.photos/seed/ikame/100/100' },
    status: 'rejected', viewPermission: 'public', allowComments: true,
    views: 0, likes: 0, likedBy: [], comments: [],
    approval: {
      submittedAt: '2026-03-02',
      submittedBy: 'user-1',
      reviewedAt: '2026-03-03',
      reviewedBy: 'manager-1',
      rejectionReason: 'Thiếu quy trình bàn giao tài khoản và SLA hỗ trợ.',
    },
    createdAt: '2026-03-02', updatedAt: '2026-03-03',
  },
  {
    id: 'a-5', title: '[WIP] Tài liệu kỹ thuật API v3.0',
    content: '# API v3.0 — Work In Progress',
    folderId: 'f-be', tags: ['API', 'Technical'],
    author: { id: 'user-1', name: 'Nguyễn Văn A', role: 'Product Manager', avatar: 'https://picsum.photos/seed/ikame/100/100' },
    status: 'draft', viewPermission: 'public', allowComments: false,
    views: 0, likes: 0, likedBy: [], comments: [],
    createdAt: '2024-05-12', updatedAt: '2024-05-12',
  },
];

const INITIAL_BOUNTIES: Bounty[] = [
  { id: 'b-1', title: 'Best Practices tối ưu React Native 2024', description: 'Cần bài viết chi tiết về best practices mới nhất.', requester: 'Mobile Guild', requesterId: 'user-mobile', reward: 500, deadline: '2026-04-15', tags: ['Engineering', 'Mobile'], hot: true, acceptedBy: [], status: 'open', createdAt: '2026-03-10' },
  { id: 'b-2', title: 'Template viết OKRs cho Product Team', description: 'Cần template chuẩn cho quarterly OKR planning.', requester: 'Product Guild', requesterId: 'user-product', reward: 250, deadline: '2026-04-22', tags: ['Product', 'Template'], hot: false, acceptedBy: [], status: 'open', createdAt: '2026-03-08' },
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n-1',
    title: 'Bài viết cần chỉnh sửa',
    content: 'Bài "Playbook onboarding nhân sự mới" đã bị từ chối và cần cập nhật.',
    type: 'approval',
    time: '2 giờ trước',
    isRead: false,
    link: 'article:a-4',
    createdAt: '2026-03-11T10:00:00.000Z',
  },
];

const STORAGE_KEY = 'iwiki_state';

function loadState(): Partial<AppState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // no-op
  }
  return {};
}

function saveState(state: Partial<AppState>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // no-op
  }
}

const savedState = loadState();

export const initialState: AppState = {
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
  articles: savedState.articles || INITIAL_ARTICLES,
  folders: INITIAL_FOLDERS,
  bounties: savedState.bounties || INITIAL_BOUNTIES,
  notifications: savedState.notifications || INITIAL_NOTIFICATIONS,
  editorData: null,
  selectedArticleId: null,
  currentFolderId: null,
  aiHistory: savedState.aiHistory || [],
  searchHistory: savedState.searchHistory || ['Quy trình xin nghỉ phép', 'Template OKR Q3'],
  favoritesByUser: savedState.favoritesByUser || {},
  analyticsEvents: savedState.analyticsEvents || [],
  customFeedPrefs: savedState.customFeedPrefs || { tags: [], folderIds: [] },
};

export type AppAction =
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
  | { type: 'PUBLISH_APPROVED_ARTICLE'; articleId: string }
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
  | { type: 'TRACK_EVENT'; event: Omit<AnalyticsEvent, 'id' | 'createdAt'> };

export function appReducer(state: AppState, action: AppAction): AppState {
  let newState: AppState;

  switch (action.type) {
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
          approval: {
            ...a.approval,
            submittedAt: new Date().toISOString(),
            submittedBy: action.userId,
            rejectionReason: undefined,
          },
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
          approval: {
            ...a.approval,
            reviewedAt: new Date().toISOString(),
            reviewedBy: action.approverId,
            rejectionReason: undefined,
          },
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
          approval: {
            ...a.approval,
            reviewedAt: new Date().toISOString(),
            reviewedBy: action.approverId,
            rejectionReason: action.reason,
          },
        };
      });
      newState = { ...state, articles: updated };
      break;
    }
    case 'PUBLISH_APPROVED_ARTICLE': {
      const updated = state.articles.map(a => a.id === action.articleId
        ? { ...a, status: 'published' as ArticleStatus, updatedAt: new Date().toISOString().split('T')[0] }
        : a);
      newState = { ...state, articles: updated };
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
    case 'INCREMENT_VIEWS':
      newState = { ...state, articles: state.articles.map(a => a.id === action.articleId ? { ...a, views: a.views + 1 } : a) };
      break;
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
      newState = {
        ...state,
        customFeedPrefs: {
          ...state.customFeedPrefs,
          ...action.prefs,
        },
      };
      break;
    case 'TRACK_EVENT':
      newState = {
        ...state,
        analyticsEvents: [
          {
            ...action.event,
            id: `e-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            createdAt: new Date().toISOString(),
          },
          ...state.analyticsEvents,
        ].slice(0, 2000),
      };
      break;
    default:
      return state;
  }

  saveState({
    currentUser: newState.currentUser,
    articles: newState.articles,
    bounties: newState.bounties,
    notifications: newState.notifications,
    aiHistory: newState.aiHistory,
    searchHistory: newState.searchHistory,
    favoritesByUser: newState.favoritesByUser,
    analyticsEvents: newState.analyticsEvents,
    customFeedPrefs: newState.customFeedPrefs,
  });

  return newState;
}
