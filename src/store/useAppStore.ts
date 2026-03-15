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
  /** User id -> đã xem onboarding lần đầu (chỉ hiện tour 1 lần mỗi user) */
  onboardingCompletedForUsers: Record<string, boolean>;
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

/** Preset users cho màn đăng nhập: Nhân viên mới (viewer), Nhân viên chính thức (editor), Admin (admin) */
export const PRESET_USERS: Record<'viewer' | 'editor' | 'admin', User> = {
  viewer: {
    id: 'user-new',
    name: 'Nguyễn Thành Viên',
    role: 'viewer',
    title: 'Nhân viên mới',
    avatar: 'https://picsum.photos/seed/newemp/100/100',
    level: 1,
    xp: 0,
    xpToNext: 500,
    coins: 0,
    scopes: [
      { folderId: 'f-company', level: 'read' },
      { folderId: 'f-process', level: 'read' },
    ],
    badges: [
      { id: 'b1', name: 'First Article', icon: '✍️', color: 'blue', earned: false },
      { id: 'b2', name: 'Knowledge Sharer', icon: '📚', color: 'purple', earned: false },
      { id: 'b3', name: 'Top Contributor', icon: '🏆', color: 'yellow', earned: false },
      { id: 'b4', name: 'AI Pioneer', icon: '🤖', color: 'green', earned: false },
    ],
  },
  editor: {
    id: 'user-official',
    name: 'Trần Nhân Viên',
    role: 'editor',
    title: 'Nhân viên chính thức',
    avatar: 'https://picsum.photos/seed/official/100/100',
    level: 8,
    xp: 3200,
    xpToNext: 5000,
    coins: 450,
    scopes: [
      { folderId: 'f-company', level: 'read' },
      { folderId: 'f-process', level: 'write' },
      { folderId: 'f-knowhow', level: 'write' },
      { folderId: 'f-tech', level: 'read' },
    ],
    badges: [
      { id: 'b1', name: 'First Article', icon: '✍️', color: 'blue', earned: true },
      { id: 'b2', name: 'Knowledge Sharer', icon: '📚', color: 'purple', earned: true },
      { id: 'b3', name: 'Top Contributor', icon: '🏆', color: 'yellow', earned: false },
      { id: 'b4', name: 'AI Pioneer', icon: '🤖', color: 'green', earned: false },
    ],
  },
  admin: {
    id: 'user-admin',
    name: 'Admin iKame',
    role: 'admin',
    title: 'Quản trị viên',
    avatar: 'https://picsum.photos/seed/admin/100/100',
    level: 15,
    xp: 12000,
    xpToNext: 15000,
    coins: 2000,
    scopes: [
      { folderId: 'f-company', level: 'admin' },
      { folderId: 'f-tech', level: 'admin' },
      { folderId: 'f-knowhow', level: 'admin' },
      { folderId: 'f-product', level: 'admin' },
    ],
    badges: [
      { id: 'b1', name: 'First Article', icon: '✍️', color: 'blue', earned: true },
      { id: 'b2', name: 'Knowledge Sharer', icon: '📚', color: 'purple', earned: true },
      { id: 'b3', name: 'Top Contributor', icon: '🏆', color: 'yellow', earned: true },
      { id: 'b4', name: 'AI Pioneer', icon: '🤖', color: 'green', earned: true },
    ],
  },
};

import { ARTICLE_CONTENTS } from '../data/articleContents';

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
  // --- Bài viết mẫu bổ sung (published) ---
  {
    id: 'a-6', title: 'Quy trình xin nghỉ phép và chính sách PTO',
    content: '# Chính sách nghỉ phép (PTO)\n\nHướng dẫn cách đăng ký nghỉ phép, số ngày được hưởng theo thâm niên và quy trình phê duyệt.',
    excerpt: 'Hướng dẫn đăng ký nghỉ phép, số ngày PTO và quy trình phê duyệt.',
    coverUrl: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&q=80&w=800',
    folderId: 'f-hr', folderName: 'Chính sách nhân sự',
    tags: ['HR', 'PTO', 'Nghỉ phép'],
    author: { id: 'user-hr', name: 'Nguyễn Thị Nguyệt', role: 'CHRO', avatar: 'https://picsum.photos/seed/nguyet/100/100' },
    status: 'published', viewPermission: 'public', allowComments: true,
    views: 2103, likes: 42, likedBy: [], comments: [],
    createdAt: '2024-01-15', updatedAt: '2024-06-10',
  },
  {
    id: 'a-7', title: 'Code style và linting cho React/TypeScript',
    content: '# Frontend Guidelines — Code Style\n\nESLint, Prettier, quy ước đặt tên component và file. Cách viết hook và type an toàn.',
    excerpt: 'Chuẩn code style, ESLint/Prettier và best practices cho React + TypeScript.',
    coverUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=800',
    folderId: 'f-fe', folderName: 'Frontend Guidelines',
    tags: ['Frontend', 'React', 'TypeScript', 'ESLint'],
    author: { id: 'user-fe', name: 'Lê Minh Tuấn', role: 'Tech Lead Frontend', avatar: 'https://picsum.photos/seed/tuan/100/100' },
    status: 'published', viewPermission: 'public', allowComments: true,
    views: 1567, likes: 38, likedBy: [], comments: [],
    createdAt: '2024-02-20', updatedAt: '2024-08-01',
  },
  {
    id: 'a-8', title: 'Kiến trúc microservices và cách triển khai tại iKame',
    content: '# Backend Architecture — Microservices\n\nTổng quan kiến trúc, service discovery, API gateway và chuẩn REST/gRPC nội bộ.',
    excerpt: 'Tổng quan microservices, service discovery và chuẩn API nội bộ.',
    folderId: 'f-be', folderName: 'Backend Architecture',
    tags: ['Backend', 'Microservices', 'Architecture'],
    author: { id: 'user-2', name: 'Trần Hoàng Huy', role: 'Solution BE Developer', avatar: 'https://picsum.photos/seed/huy/100/100' },
    status: 'published', viewPermission: 'public', allowComments: true,
    views: 1892, likes: 51, likedBy: [], comments: [],
    createdAt: '2024-03-05', updatedAt: '2024-07-22',
  },
  {
    id: 'a-9', title: 'CI/CD với GitHub Actions và deploy staging',
    content: '# DevOps — CI/CD Pipeline\n\nCấu hình workflow GitHub Actions, chạy test, build và deploy lên staging/production.',
    excerpt: 'Pipeline CI/CD với GitHub Actions và quy trình deploy staging.',
    coverUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800',
    folderId: 'f-devops', folderName: 'DevOps & Infrastructure',
    tags: ['DevOps', 'CI/CD', 'GitHub Actions'],
    author: { id: 'user-devops', name: 'Phạm Quang Dũng', role: 'DevOps Engineer', avatar: 'https://picsum.photos/seed/dung/100/100' },
    status: 'published', viewPermission: 'public', allowComments: true,
    views: 1245, likes: 29, likedBy: [], comments: [],
    createdAt: '2024-04-12', updatedAt: '2024-09-15',
  },
  {
    id: 'a-10', title: 'Giá trị cốt lõi và văn hóa iKame',
    content: '# Văn hóa & Giá trị\n\nCác giá trị cốt lõi: Khách hàng làm trung tâm, Minh bạch, Học hỏi liên tục. Cách chúng ta làm việc mỗi ngày.',
    excerpt: 'Giá trị cốt lõi và văn hóa làm việc tại iKame.',
    folderId: 'f-culture', folderName: 'Văn hóa & Giá trị',
    tags: ['Văn hóa', 'Values', 'iKame'],
    author: { id: 'user-hr', name: 'Nguyễn Thị Nguyệt', role: 'CHRO', avatar: 'https://picsum.photos/seed/nguyet/100/100' },
    status: 'published', viewPermission: 'public', allowComments: true,
    views: 3201, likes: 89, likedBy: [], comments: [],
    createdAt: '2023-10-01', updatedAt: '2024-05-20',
  },
  {
    id: 'a-11', title: 'Mindset Growth — Học từ thất bại và phản hồi',
    content: '# Mindset — Học từ thất bại\n\nCách chuyển phản hồi và thất bại thành cơ hội học hỏi. Thực hành retrospective cá nhân.',
    excerpt: 'Cách biến thất bại và phản hồi thành cơ hội phát triển.',
    folderId: 'f-mindset', folderName: 'Mindset',
    tags: ['Mindset', 'Growth', 'Feedback'],
    author: { id: 'user-1', name: 'Nguyễn Văn A', role: 'Product Manager', avatar: 'https://picsum.photos/seed/ikame/100/100' },
    status: 'published', viewPermission: 'public', allowComments: true,
    views: 987, likes: 34, likedBy: [], comments: [],
    createdAt: '2024-05-18', updatedAt: '2024-08-30',
  },
  {
    id: 'a-12', title: 'Checklist review code và merge request',
    content: '# Process & Checklist — Code Review\n\nChecklist trước khi tạo MR, tiêu chí review và quy ước approve. SLA review trong team.',
    excerpt: 'Checklist và quy ước review code, merge request và SLA.',
    folderId: 'f-checklist', folderName: 'Process & Checklist',
    tags: ['Process', 'Code Review', 'Checklist'],
    author: { id: 'user-fe', name: 'Lê Minh Tuấn', role: 'Tech Lead Frontend', avatar: 'https://picsum.photos/seed/tuan/100/100' },
    status: 'published', viewPermission: 'public', allowComments: true,
    views: 1456, likes: 41, likedBy: [], comments: [],
    createdAt: '2024-03-28', updatedAt: '2024-07-10',
  },
  {
    id: 'a-13', title: 'Kỹ năng thuyết trình và trình bày ý tưởng',
    content: '# Soft Skills — Thuyết trình\n\nCấu trúc slide, storytelling, xử lý Q&A và tips cho demo nội bộ và khách hàng.',
    excerpt: 'Cách chuẩn bị và thuyết trình ý tưởng hiệu quả.',
    coverUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800',
    folderId: 'f-softskills', folderName: 'Soft Skills',
    tags: ['Soft Skills', 'Presentation', 'Communication'],
    author: { id: 'user-1', name: 'Nguyễn Văn A', role: 'Product Manager', avatar: 'https://picsum.photos/seed/ikame/100/100' },
    status: 'published', viewPermission: 'public', allowComments: true,
    views: 1123, likes: 27, likedBy: [], comments: [],
    createdAt: '2024-06-01', updatedAt: '2024-09-05',
  },
  {
    id: 'a-14', title: 'Template PRD (Product Requirements Document)',
    content: '# Product Templates — PRD\n\nMẫu PRD chuẩn: problem statement, user stories, acceptance criteria, metrics và timeline.',
    excerpt: 'Mẫu PRD chuẩn cho sản phẩm: problem, user stories, criteria.',
    folderId: 'f-pm-templates', folderName: 'Templates',
    tags: ['Product', 'PRD', 'Template'],
    author: { id: 'user-1', name: 'Nguyễn Văn A', role: 'Product Manager', avatar: 'https://picsum.photos/seed/ikame/100/100' },
    status: 'published', viewPermission: 'public', allowComments: true,
    views: 2341, likes: 67, likedBy: [], comments: [],
    createdAt: '2024-02-10', updatedAt: '2024-08-18',
  },
  {
    id: 'a-15', title: 'Quy trình phê duyệt tài liệu và xuất bản',
    content: '# Quy trình chung — Phê duyệt tài liệu\n\nLuồng draft → gửi duyệt → approve/reject → publish. Role và quyền theo folder.',
    excerpt: 'Luồng phê duyệt tài liệu từ draft đến publish.',
    folderId: 'f-process', folderName: 'Quy trình chung',
    tags: ['Quy trình', 'Approval', 'Publish'],
    author: { id: 'user-hr', name: 'Nguyễn Thị Nguyệt', role: 'CHRO', avatar: 'https://picsum.photos/seed/nguyet/100/100' },
    status: 'published', viewPermission: 'public', allowComments: true,
    views: 876, likes: 22, likedBy: [], comments: [],
    createdAt: '2024-04-01', updatedAt: '2024-07-01',
  },
  {
    id: 'a-16', title: 'Hướng dẫn sử dụng iWiki cho thành viên mới',
    content: '# iWiki — Hướng dẫn sử dụng\n\nCách tìm kiếm, đọc bài, đóng góp nội dung, dùng AI và quản lý bài viết của bạn.',
    excerpt: 'Hướng dẫn nhanh tìm kiếm, đọc và đóng góp nội dung trên iWiki.',
    folderId: 'f-process', folderName: 'Quy trình chung',
    tags: ['iWiki', 'Onboarding', 'Hướng dẫn'],
    author: { id: 'user-1', name: 'Nguyễn Văn A', role: 'Product Manager', avatar: 'https://picsum.photos/seed/ikame/100/100' },
    status: 'published', viewPermission: 'public', allowComments: true,
    views: 4521, likes: 112, likedBy: [], comments: [],
    createdAt: '2024-01-08', updatedAt: '2024-10-01',
  },
  {
    id: 'a-17', title: 'Quy trình release sản phẩm và go-live',
    content: '# Product Processes — Release & Go-live\n\nChecklist trước go-live, rollback plan, communication và post-launch review.',
    excerpt: 'Checklist release, rollback và post-launch review.',
    folderId: 'f-pm-process', folderName: 'Product Processes',
    tags: ['Product', 'Release', 'Go-live'],
    author: { id: 'user-1', name: 'Nguyễn Văn A', role: 'Product Manager', avatar: 'https://picsum.photos/seed/ikame/100/100' },
    status: 'published', viewPermission: 'public', allowComments: true,
    views: 1678, likes: 45, likedBy: [], comments: [],
    createdAt: '2024-05-05', updatedAt: '2024-09-20',
  },
  {
    id: 'a-18', title: 'Bảo mật thông tin và quy tắc bảo mật nội bộ',
    content: '# Chính sách — Bảo mật thông tin\n\nPhân loại dữ liệu, quy tắc lưu trữ, chia sẻ và xử lý khi có sự cố.',
    excerpt: 'Phân loại dữ liệu, quy tắc bảo mật và xử lý sự cố.',
    folderId: 'f-hr', folderName: 'Chính sách nhân sự',
    tags: ['Security', 'Bảo mật', 'Compliance'],
    author: { id: 'user-hr', name: 'Nguyễn Thị Nguyệt', role: 'CHRO', avatar: 'https://picsum.photos/seed/nguyet/100/100' },
    status: 'published', viewPermission: 'public', allowComments: true,
    views: 1987, likes: 38, likedBy: [], comments: [],
    createdAt: '2024-03-15', updatedAt: '2024-08-12',
  },
];

// Gắn nội dung chi tiết + hình ảnh từ articleContents (nếu có)
const INITIAL_ARTICLES_WITH_CONTENT: Article[] = INITIAL_ARTICLES.map((a) => ({
  ...a,
  content: ARTICLE_CONTENTS[a.id] ?? a.content,
}));

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
  analyticsEvents: savedState.analyticsEvents || [],
  customFeedPrefs: savedState.customFeedPrefs || { tags: [], folderIds: [] },
  onboardingCompletedForUsers: savedState.onboardingCompletedForUsers || {},
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
  | { type: 'TRACK_EVENT'; event: Omit<AnalyticsEvent, 'id' | 'createdAt'> }
  | { type: 'COMPLETE_ONBOARDING'; userId: string };

export function appReducer(state: AppState, action: AppAction): AppState {
  let newState: AppState;

  switch (action.type) {
    case 'LOGIN': {
      const user = PRESET_USERS[action.role];
      newState = {
        ...state,
        isLoggedIn: true,
        currentUser: user,
        userRole: user.role,
        currentScreen: 'dashboard',
      };
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
    case 'COMPLETE_ONBOARDING':
      newState = {
        ...state,
        onboardingCompletedForUsers: {
          ...state.onboardingCompletedForUsers,
          [action.userId]: true,
        },
      };
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
    onboardingCompletedForUsers: newState.onboardingCompletedForUsers,
  });

  return newState;
}
