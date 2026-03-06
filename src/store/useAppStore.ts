// src/store/useAppStore.ts
// Global state management using React Context + useReducer (no extra dependencies needed)

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'user';
  title: string;
  avatar: string;
  level: number;
  xp: number;
  xpToNext: number;
  coins: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
  earned: boolean;
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
  status: 'draft' | 'published';
  viewPermission: 'public' | 'restricted';
  allowComments: boolean;
  views: number;
  likes: number;
  likedBy: string[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
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
  type: 'like' | 'comment' | 'bounty' | 'reward' | 'system';
  title?: string;
  content?: string;
  message?: string;
  isRead: boolean;
  link?: string;
  time?: string;
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: { [key: string]: boolean };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: string[];
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: string;
}

export interface AppState {
  currentScreen: string;
  searchQuery: string;
  userRole: 'user' | 'admin';
  currentUser: User;
  articles: Article[];
  folders: Folder[];
  bounties: Bounty[];
  notifications: Notification[];
  roles: Role[];
  editorData: Partial<Article> | null;
  selectedArticleId: string | null;
  currentFolderId: string | null;
  conversations: Conversation[];
  activeConversationId: string | null;
}

// ---- SEED DATA ----
const INITIAL_USER: User = {
  id: 'user-1',
  name: 'Nguyễn Văn A',
  role: 'admin',
  title: 'Product Manager',
  avatar: 'https://picsum.photos/seed/ikame/100/100',
  level: 12,
  xp: 8450,
  xpToNext: 10000,
  coins: 1250,
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
    content: `# Performance Checkpoint tại iKame\n\nĐây là bài viết Cẩm nang những điều cần biết để có kỳ Checkpoint hiệu quả.\n\n## Quy trình triển khai\n\n1. **Tự đánh giá (Self-assessment):** Mỗi nhân viên hoàn thành form tự đánh giá trên hệ thống HRM trước ngày 15 hàng tháng.\n2. **1-on-1 với Line Manager:** Buổi họp cá nhân kéo dài 30-60 phút, tập trung vào OKRs, blockers, và career development.\n3. **Peer Review:** Thu thập đánh giá 360 độ từ đồng nghiệp trong team.\n4. **Final Review:** HR tổng hợp và phê duyệt.\n\n## Tiêu chí đánh giá\n\n- **Kết quả công việc (50%):** Hoàn thành OKRs, chất lượng output\n- **Năng lực (30%):** Kỹ năng chuyên môn, soft skills\n- **Văn hóa (20%):** Alignment với core values của iKame\n\n## Lưu ý quan trọng\n\nHãy chuẩn bị danh sách achievements cụ thể với số liệu đo lường được. Tránh trả lời chung chung như "tôi đã làm tốt".`,
    excerpt: 'Cẩm nang những điều cần biết để có kỳ Checkpoint hiệu quả; bao gồm Quy trình triển khai, Tiêu chí đánh giá...',
    coverUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=800',
    folderId: 'f-hr', folderName: 'Chính sách nhân sự',
    tags: ['HR', 'Performance', 'OKRs'],
    author: { id: 'user-hr', name: 'Nguyễn Thị Nguyệt', role: 'CHRO', avatar: 'https://picsum.photos/seed/nguyet/100/100' },
    status: 'published', viewPermission: 'public', allowComments: true,
    views: 1398, likes: 19, likedBy: [], comments: [],
    createdAt: '2023-12-18', updatedAt: '2023-12-18',
  },
  {
    id: 'a-2', title: 'EKS - Kỳ vọng về công việc và sự phát triển cá nhân',
    content: `# EKS Framework tại iKame\n\nEKS (Expectation & Key Skills) là framework định hướng phát triển cá nhân của iKame.\n\n## Ba trụ cột của EKS\n\n### 1. Expectation Setting\nMỗi nhân viên cần có conversation với manager về:\n- Short-term goals (3 tháng)\n- Mid-term goals (1 năm)\n- Career trajectory (3-5 năm)\n\n### 2. Key Skills Development\nMỗi role có một KSF (Key Skills Framework) riêng:\n- Technical skills\n- Leadership skills  \n- Domain knowledge\n\n### 3. Continuous Feedback\nCheck-in 2 tuần/lần để đảm bảo đúng hướng.`,
    excerpt: 'EKS là framework định hướng phát triển cá nhân của iKame, giúp nhân viên xác định mục tiêu rõ ràng.',
    coverUrl: 'https://picsum.photos/seed/eks/400/200',
    folderId: 'f-hr', folderName: 'Chính sách nhân sự',
    tags: ['HR', 'Career', 'Development'],
    author: { id: 'user-hr', name: 'Nguyễn Thị Nguyệt', role: 'CHRO', avatar: 'https://picsum.photos/seed/nguyet/100/100' },
    status: 'published', viewPermission: 'public', allowComments: true,
    views: 1164, likes: 12, likedBy: [], comments: [],
    createdAt: '2023-08-11', updatedAt: '2023-08-11',
  },
  {
    id: 'a-3', title: 'How to connect VPN iKAME using FortiClient',
    content: `# Hướng dẫn kết nối VPN iKame qua FortiClient\n\n## Cài đặt FortiClient VPN\n\n1. Tải FortiClient từ link nội bộ: [internal.ikame.vn/vpn-client](http://internal.ikame.vn)\n2. Cài đặt theo hướng dẫn mặc định\n3. Khởi động lại máy sau khi cài đặt\n\n## Cấu hình kết nối\n\n- **VPN Name:** iKame-Office\n- **Remote Gateway:** vpn.ikame.vn\n- **Port:** 443\n- **Authentication:** Username/Password + SMS OTP\n\n## Kết nối\n\n1. Mở FortiClient\n2. Chọn **iKame-Office** từ danh sách VPN\n3. Nhập username (email nội bộ) và password\n4. Xác nhận OTP được gửi qua SMS\n\n## Troubleshooting\n\n- Nếu không kết nối được, kiểm tra internet connection trước\n- OTP hết hạn sau 60 giây, yêu cầu lại nếu cần\n- Liên hệ IT Support: it-support@ikame.vn`,
    excerpt: 'Step-by-step guide to setting up and connecting to the company VPN securely for remote work.',
    coverUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
    folderId: 'f-be', folderName: 'Backend Architecture',
    tags: ['IT', 'VPN', 'Security', 'Setup'],
    author: { id: 'user-2', name: 'Trần Hoàng Huy', role: 'Solution BE Developer', avatar: 'https://picsum.photos/seed/huy/100/100' },
    status: 'published', viewPermission: 'public', allowComments: true,
    views: 841, likes: 6, likedBy: [], comments: [
      { id: 'c1', authorId: 'user-3', authorName: 'Phạm Thùy Mai', content: 'Cảm ơn bạn! Mình đã kết nối được rồi 😊', createdAt: '2023-11-23' },
      { id: 'c2', authorId: 'user-4', authorName: 'Lê Thị B', content: 'Bài viết rất hữu ích!', createdAt: '2023-11-24' },
    ],
    createdAt: '2023-11-22', updatedAt: '2023-11-22',
  },
  {
    id: 'a-4', title: 'Văn hóa - Giá trị Cốt lõi iKame',
    content: `# Văn hóa & Giá trị Cốt lõi iKame\n\n## iKame DNA\n\nChúng ta tin rằng một công ty vĩ đại được xây dựng bởi những con người vĩ đại. DNA của iKame bao gồm:\n\n## 5 Core Values\n\n### 1. 🚀 Speed with Quality\nChúng ta hành động nhanh nhưng không đánh đổi chất lượng. "Done is better than perfect" — nhưng "done" phải đủ tốt.\n\n### 2. 🎯 Ownership Mindset\nMỗi iKamer là chủ sở hữu của công việc mình đảm nhiệm. Không đổ lỗi, không chờ đợi — hành động và chịu trách nhiệm.\n\n### 3. 📈 Data-Driven\nMọi quyết định đều dựa trên data, không phỏng đoán. "In God we trust; all others must bring data."\n\n### 4. 🤝 Radical Transparency\nChúng ta chia sẻ thông tin cởi mở, thẳng thắn và tôn trọng lẫn nhau.\n\n### 5. 🌱 Growth Mindset\nChúng ta học hỏi liên tục. Sai lầm là cơ hội để phát triển, không phải lý do để phán xét.`,
    excerpt: 'iKame DNA và 5 core values định hình văn hóa làm việc tại iKame.',
    coverUrl: 'https://picsum.photos/seed/culture/400/200',
    folderId: 'f-culture', folderName: 'Văn hóa & Giá trị',
    tags: ['Culture', 'Values', 'Company'],
    author: { id: 'user-3', name: 'Phạm Thùy Mai', role: 'Admin & Event Coordinator', avatar: 'https://picsum.photos/seed/mai/100/100' },
    status: 'published', viewPermission: 'public', allowComments: true,
    views: 725, likes: 5, likedBy: [], comments: [
      { id: 'c3', authorId: 'user-1', authorName: 'Nguyễn Văn A', content: 'Rất tâm huyết! Đây là nền tảng của chúng ta.', createdAt: '2024-09-18' },
    ],
    createdAt: '2024-09-17', updatedAt: '2024-09-17',
  },
  {
    id: 'a-5', title: 'Giờ làm việc, Chấm công, Ngày phép',
    content: `# Chính sách Giờ Làm Việc & Ngày Phép\n\n## Giờ làm việc\n\n**Từ Thứ Hai đến Thứ Sáu:**\n- Sáng: 8:30 - 12:00\n- Chiều: 13:30 - 18:00\n\n*Lưu ý: Giờ làm việc linh động ±30 phút tùy team agreement với manager.*\n\n## Chấm công\n\n- Check-in trước 9:00 AM trên app HRM\n- Check-out sau 17:30 PM\n- Remote work: Check-in qua Slack #daily-standup\n\n## Ngày phép\n\n### Phép năm\n- Nhân viên < 5 năm: **12 ngày/năm**\n- Nhân viên 5-10 năm: **14 ngày/năm**  \n- Nhân viên > 10 năm: **16 ngày/năm**\n\n### Nghỉ lễ\n- Theo quy định Nhà nước\n- Thông thường: ~11-13 ngày/năm\n\n### Quy trình xin phép\n1. Đăng ký trên HRM ít nhất 3 ngày trước\n2. Ping Line Manager qua Slack để được duyệt nhanh\n3. Bàn giao công việc + update Jira\n4. Set OOO trên email và Slack`,
    excerpt: 'Chính sách giờ làm việc, chấm công và ngày phép tại iKame cập nhật 2024.',
    folderId: 'f-hr', folderName: 'Chính sách nhân sự',
    tags: ['HR', 'Policy', 'Leave'],
    author: { id: 'user-hr', name: 'Nguyễn Thị Nguyệt', role: 'CHRO', avatar: 'https://picsum.photos/seed/nguyet/100/100' },
    status: 'published', viewPermission: 'public', allowComments: true,
    views: 2100, likes: 45, likedBy: [], comments: [],
    createdAt: '2024-01-15', updatedAt: '2024-01-15',
  },
  {
    id: 'a-6', title: 'Quy trình Onboarding cho nhân sự mới',
    content: `# Onboarding Process tại iKame\n\nChào mừng bạn đến với iKame! Dưới đây là roadmap tuần đầu tiên.\n\n## Tuần 1: Setup & Orientation\n\n### Ngày 1\n- [ ] Nhận laptop + thiết bị làm việc từ IT\n- [ ] Tạo tài khoản email, Slack, Jira, HRM\n- [ ] Meeting với HR: Ký hợp đồng, paperwork\n- [ ] Lunch với team\n\n### Ngày 2-3\n- [ ] 1-on-1 với Line Manager: Roadmap 30-60-90 ngày\n- [ ] Shadow sessions với các stakeholders\n- [ ] Đọc Culture & Values doc\n- [ ] Join các channels Slack liên quan\n\n### Ngày 4-5\n- [ ] Deep dive vào domain knowledge\n- [ ] Set up development environment (nếu là dev)\n- [ ] Attend Sprint Planning / team meeting đầu tiên\n\n## Checklist tài khoản cần tạo\n\n| Tool | Ai tạo? | SLA |\n|------|---------|-----|\n| Email | IT | Ngày 1 |\n| Slack | IT | Ngày 1 |\n| Jira | IT | Ngày 1 |\n| HRM | HR | Ngày 1 |\n| GitHub | TL | Ngày 2 |\n| AWS | DevOps | Ngày 3 |`,
    excerpt: 'Hướng dẫn toàn diện quy trình tiếp nhận nhân sự mới, tuần đầu tiên tại iKame.',
    folderId: 'f-process', folderName: 'Quy trình chung',
    tags: ['HR', 'Onboarding', 'New Employee'],
    author: { id: 'user-hr', name: 'HR Team', role: 'Human Resources', avatar: 'https://picsum.photos/seed/hr/100/100' },
    status: 'published', viewPermission: 'public', allowComments: true,
    views: 890, likes: 15, likedBy: [], comments: [],
    createdAt: '2024-03-05', updatedAt: '2024-03-05',
  },
  // User's own published articles
  {
    id: 'a-7', title: 'Chiến lược phát triển sản phẩm Game Hyper-casual Q3',
    content: `# Chiến lược Game Hyper-casual Q3 2024\n\n## Phân tích thị trường\n\nThị trường game Hyper-casual đang trải qua giai đoạn chuyển đổi mạnh mẽ:\n- CPI tăng 45% so với 2022\n- Session length trung bình giảm 20%\n- Hybrid-casual games đang bùng nổ\n\n## Đề xuất chiến lược\n\n### Track 1: Core Loop Optimization\nTập trung vào cải thiện D1, D7 retention thay vì chạy UA mạnh.\n\n### Track 2: Hybrid-casual Pivot\nThêm meta-game layer (collection mechanics, story elements) vào top performers.\n\n### Track 3: IP Collaboration\nPartnership với các IP local để tận dụng awareness sẵn có.`,
    excerpt: 'Phân tích xu hướng và đề xuất chiến lược cho dòng game Hyper-casual Q3 2024.',
    coverUrl: 'https://picsum.photos/seed/game/400/200',
    folderId: 'f-pm-process', folderName: 'Product Processes',
    tags: ['Product', 'Game', 'Strategy', 'Hyper-casual'],
    author: { id: 'user-1', name: 'Nguyễn Văn A', role: 'Product Manager', avatar: 'https://picsum.photos/seed/ikame/100/100' },
    status: 'published', viewPermission: 'public', allowComments: true,
    views: 1540, likes: 89, likedBy: [], comments: [],
    createdAt: '2024-05-05', updatedAt: '2024-05-05',
  },
  {
    id: 'a-8', title: 'OKR Framework — Hỏi đáp thực tế từ team Product',
    content: `# OKRs trong thực tế tại iKame\n\n## Tại sao OKRs quan trọng?\n\nOKRs (Objectives & Key Results) giúp align toàn bộ tổ chức về:**\n- **Where** we're going (Objective)\n- **How** we measure success (Key Results)\n\n## Cấu trúc OKR tốt\n\n### Objective: Phải INSPIRING\n❌ "Cải thiện app"\n✅ "Trở thành top 3 productivity app tại VN"\n\n### Key Results: Phải MEASURABLE\n❌ "Người dùng hài lòng hơn"\n✅ "Tăng NPS từ 35 lên 50"\n✅ "Đạt 100K MAU"\n✅ "Giảm churn rate từ 15% xuống 10%"`,
    excerpt: 'Guide thực tế về OKR framework từ góc nhìn team Product tại iKame.',
    folderId: 'f-pm-process', folderName: 'Product Processes',
    tags: ['Product', 'OKRs', 'Framework'],
    author: { id: 'user-1', name: 'Nguyễn Văn A', role: 'Product Manager', avatar: 'https://picsum.photos/seed/ikame/100/100' },
    status: 'published', viewPermission: 'public', allowComments: true,
    views: 420, likes: 28, likedBy: [], comments: [],
    createdAt: '2024-04-20', updatedAt: '2024-04-20',
  },
  // Drafts
  {
    id: 'a-9', title: 'Chiến lược phát triển sản phẩm Game Hyper-casual (Draft)',
    content: '',
    folderId: '', tags: [],
    author: { id: 'user-1', name: 'Nguyễn Văn A', role: 'Product Manager', avatar: 'https://picsum.photos/seed/ikame/100/100' },
    status: 'draft', viewPermission: 'public', allowComments: true,
    views: 0, likes: 0, likedBy: [], comments: [],
    createdAt: '2024-05-10', updatedAt: '2024-05-10',
  },
  {
    id: 'a-10', title: '[WIP] Tài liệu kỹ thuật API v3.0',
    content: `# API v3.0 — Work In Progress\n\n## Authentication\n\nAPI v3.0 sẽ sử dụng OAuth 2.0 với JWT...\n\n*(Đang viết tiếp)*`,
    folderId: 'f-be', tags: ['API', 'Technical'],
    author: { id: 'user-1', name: 'Nguyễn Văn A', role: 'Product Manager', avatar: 'https://picsum.photos/seed/ikame/100/100' },
    status: 'draft', viewPermission: 'public', allowComments: false,
    views: 0, likes: 0, likedBy: [], comments: [],
    createdAt: '2024-05-12', updatedAt: '2024-05-12',
  },
];

const INITIAL_BOUNTIES: Bounty[] = [
  { id: 'b-1', title: 'Best Practices tối ưu React Native 2024', description: 'Cần bài viết chi tiết về các best practices mới nhất cho React Native, bao gồm performance optimization, memory management, và navigation patterns.', requester: 'Mobile Guild', requesterId: 'user-mobile', reward: 500, deadline: '2024-06-15', tags: ['Engineering', 'Mobile'], hot: true, acceptedBy: [], status: 'open', createdAt: '2024-05-20' },
  { id: 'b-2', title: 'Hướng dẫn tích hợp Firebase Analytics', description: 'Cần tutorial step-by-step về cách setup và sử dụng Firebase Analytics trong React Native app, bao gồm custom events và funnel tracking.', requester: 'Data Team', requesterId: 'user-data', reward: 300, deadline: '2024-06-22', tags: ['Data', 'Tutorial', 'Firebase'], hot: false, acceptedBy: [], status: 'open', createdAt: '2024-05-18' },
  { id: 'b-3', title: 'Quy trình xử lý sự cố Production (Incident Response)', description: 'SOP cho incident response: phân loại severity, escalation path, communication template và post-mortem process.', requester: 'DevOps', requesterId: 'user-devops', reward: 800, deadline: '2024-06-12', tags: ['DevOps', 'SOP', 'Operations'], hot: true, acceptedBy: [], status: 'open', createdAt: '2024-05-22' },
  { id: 'b-4', title: 'Template viết OKRs cho Product Team', description: 'Cần template chuẩn cho quarterly OKR planning: từ Objective setting đến Key Result định lượng, với examples thực tế.', requester: 'Product Guild', requesterId: 'user-product', reward: 250, deadline: '2024-06-28', tags: ['Product', 'Template', 'OKRs'], hot: false, acceptedBy: [], status: 'open', createdAt: '2024-05-15' },
  { id: 'b-5', title: 'Tổng hợp lỗi thường gặp khi deploy AWS ECS', description: 'Troubleshooting guide cho các lỗi phổ biến nhất khi deploy services lên AWS ECS/Fargate. Cần practical examples và solutions.', requester: 'Backend Team', requesterId: 'user-be', reward: 400, deadline: '2024-06-18', tags: ['Backend', 'AWS', 'Troubleshooting'], hot: false, acceptedBy: [], status: 'open', createdAt: '2024-05-19' },
];

// ---- LOCALSTORAGE HELPERS ----
const STORAGE_KEY = 'iwiki_state';

function loadState(): Partial<AppState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { }
  return {};
}

function saveState(state: Partial<AppState>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { }
}

// ---- INITIAL STATE ----
const savedState = loadState();

const INITIAL_ROLES: Role[] = [
  { id: 'admin', name: 'Quản trị viên', description: 'Toàn quyền truy cập và cấu hình hệ thống', userCount: 3, permissions: { view_docs: true, create_docs: true, edit_docs: true, delete_docs: true, manage_folders: true, manage_users: true } },
  { id: 'manager', name: 'Trưởng phòng', description: 'Quản lý tài liệu và phê duyệt trong phòng ban', userCount: 12, permissions: { view_docs: true, create_docs: true, edit_docs: true, delete_docs: true, manage_folders: true, manage_users: false } },
  { id: 'editor', name: 'Người viết', description: 'Tạo, chỉnh sửa và xuất bản tài liệu', userCount: 45, permissions: { view_docs: true, create_docs: true, edit_docs: true, delete_docs: false, manage_folders: false, manage_users: false } },
  { id: 'viewer', name: 'Người đọc', description: 'Chỉ xem và bình luận tài liệu', userCount: 128, permissions: { view_docs: true, create_docs: false, edit_docs: false, delete_docs: false, manage_folders: false, manage_users: false } },
];

export const initialState: AppState = {
  currentScreen: 'dashboard',
  searchQuery: '',
  userRole: 'admin',
  currentUser: savedState.currentUser || INITIAL_USER,
  articles: savedState.articles || INITIAL_ARTICLES,
  folders: savedState.folders || INITIAL_FOLDERS,
  bounties: savedState.bounties || INITIAL_BOUNTIES,
  notifications: savedState.notifications || [],
  roles: savedState.roles || INITIAL_ROLES,
  editorData: null,
  selectedArticleId: null,
  currentFolderId: null,
  conversations: savedState.conversations || [],
  activeConversationId: null,
};

// ---- ACTIONS ----
export type AppAction =
  | { type: 'SET_SCREEN'; screen: string }
  | { type: 'SET_SEARCH_QUERY'; query: string }
  | { type: 'SET_ROLE'; role: 'user' | 'admin' }
  | { type: 'SET_SELECTED_ARTICLE'; articleId: string | null }
  | { type: 'SET_CURRENT_FOLDER'; folderId: string | null }
  | { type: 'OPEN_EDITOR'; article?: Partial<Article> }
  | { type: 'SAVE_ARTICLE'; article: Article }
  | { type: 'DELETE_ARTICLE'; articleId: string }
  | { type: 'TOGGLE_LIKE'; articleId: string; userId: string }
  | { type: 'ADD_COMMENT'; articleId: string; comment: Comment }
  | { type: 'CREATE_BOUNTY'; bounty: Bounty }
  | { type: 'ACCEPT_BOUNTY'; bountyId: string; userId: string }
  | { type: 'UPDATE_USER'; updates: Partial<User> }
  | { type: 'ADD_NOTIFICATION'; notification: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; notificationId: string }
  | { type: 'MARK_ALL_READ' }
  | { type: 'INCREMENT_VIEWS'; articleId: string }
  | { type: 'CREATE_FOLDER'; folder: Folder }
  | { type: 'UPDATE_FOLDER'; folderId: string; updates: Partial<Folder> }
  | { type: 'DELETE_FOLDER'; folderId: string }
  | { type: 'MOVE_ITEM'; itemId: string; itemType: 'article' | 'folder'; targetFolderId: string }
  | { type: 'UPDATE_ROLE_PERMISSIONS'; roleId: string; permissions: { [key: string]: boolean } }
  | { type: 'UPSERT_ROLE'; role: Role }
  | { type: 'ADD_CHAT_MESSAGE'; conversationId: string; message: ChatMessage }
  | { type: 'NEW_CONVERSATION'; conversation: Conversation }
  | { type: 'CLEAR_CONVERSATIONS' };

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
    case 'TOGGLE_LIKE': {
      const updated = state.articles.map(a => {
        if (a.id !== action.articleId) return a;
        const liked = a.likedBy.includes(action.userId);
        return {
          ...a,
          likes: liked ? a.likes - 1 : a.likes + 1,
          likedBy: liked ? a.likedBy.filter(id => id !== action.userId) : [...a.likedBy, action.userId],
        };
      });
      newState = { ...state, articles: updated };
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
    case 'MARK_ALL_READ':
      newState = { ...state, notifications: state.notifications.map(n => ({ ...n, isRead: true })) };
      break;
    case 'INCREMENT_VIEWS': {
      const updated = state.articles.map(a =>
        a.id === action.articleId ? { ...a, views: a.views + 1 } : a
      );
      newState = { ...state, articles: updated };
      break;
    }
    case 'CREATE_FOLDER': {
      if (action.folder.parentId) {
        // Find parent and add to children
        const updateChildren = (folders: Folder[]): Folder[] => {
          return folders.map(f => {
            if (f.id === action.folder.parentId) {
              return { ...f, children: [...(f.children || []), action.folder] };
            }
            if (f.children) return { ...f, children: updateChildren(f.children) };
            return f;
          });
        };
        newState = { ...state, folders: updateChildren(state.folders) };
      } else {
        newState = { ...state, folders: [...state.folders, action.folder] };
      }
      break;
    }
    case 'UPDATE_FOLDER': {
      const updateFolders = (folders: Folder[]): Folder[] => {
        return folders.map(f => {
          if (f.id === action.folderId) return { ...f, ...action.updates };
          if (f.children) return { ...f, children: updateFolders(f.children) };
          return f;
        });
      };
      newState = { ...state, folders: updateFolders(state.folders) };
      break;
    }
    case 'DELETE_FOLDER': {
      const deleteFromFolders = (folders: Folder[]): Folder[] => {
        return folders
          .filter(f => f.id !== action.folderId)
          .map(f => (f.children ? { ...f, children: deleteFromFolders(f.children) } : f));
      };
      newState = { ...state, folders: deleteFromFolders(state.folders) };
      break;
    }
    case 'MOVE_ITEM': {
      if (action.itemType === 'article') {
        newState = { ...state, articles: state.articles.map(a => a.id === action.itemId ? { ...a, folderId: action.targetFolderId } : a) };
      } else {
        // Logic for moving folder is complex because of hierarchy, let's simplify or handle top-level for now
        // For a full implementation, we'd remove from old parent and add to new parent
        // For this demo, let's just update parentId
        const moveFolder = (folders: Folder[]): Folder[] => {
          // First remove the folder from its current position
          const removeFromOld = (fs: Folder[]): Folder[] => {
            return fs.filter(f => f.id !== action.itemId).map(f => f.children ? { ...f, children: removeFromOld(f.children) } : f);
          };

          // Helper to find the folder being moved
          let movedFolder: Folder | null = null;
          const findFolder = (fs: Folder[]) => {
            for (const f of fs) {
              if (f.id === action.itemId) { movedFolder = f; break; }
              if (f.children) findFolder(f.children);
            }
          };
          findFolder(state.folders);

          if (!movedFolder) return state.folders; // Should not happen

          const cleanFolders = removeFromOld(state.folders);
          const updatedMovedFolder = { ...movedFolder, parentId: action.targetFolderId === 'root' ? undefined : action.targetFolderId };

          if (action.targetFolderId === 'root') {
            return [...cleanFolders, updatedMovedFolder];
          }

          const addToNew = (fs: Folder[]): Folder[] => {
            return fs.map(f => {
              if (f.id === action.targetFolderId) return { ...f, children: [...(f.children || []), updatedMovedFolder!] };
              if (f.children) return { ...f, children: addToNew(f.children) };
              return f;
            });
          };
          return addToNew(cleanFolders);
        };
        newState = { ...state, folders: moveFolder(state.folders) };
      }
      break;
    }
    case 'UPDATE_ROLE_PERMISSIONS': {
      newState = { ...state, roles: state.roles.map(r => r.id === action.roleId ? { ...r, permissions: action.permissions } : r) };
      break;
    }
    case 'UPSERT_ROLE': {
      const exists = state.roles.find(r => r.id === action.role.id);
      newState = {
        ...state,
        roles: exists ? state.roles.map(r => r.id === action.role.id ? action.role : r) : [...state.roles, action.role]
      };
      break;
    }
    case 'ADD_CHAT_MESSAGE': {
      const updated = state.conversations.map(c =>
        c.id === action.conversationId ? { ...c, messages: [...c.messages, action.message], updatedAt: new Date().toISOString() } : c
      );
      newState = { ...state, conversations: updated };
      break;
    }
    case 'NEW_CONVERSATION':
      newState = { ...state, conversations: [action.conversation, ...state.conversations], activeConversationId: action.conversation.id };
      break;
    case 'CLEAR_CONVERSATIONS':
      newState = { ...state, conversations: [], activeConversationId: null };
      break;
    default:
      return state;
  }

  // Persist important parts of state to localStorage
  saveState({
    currentUser: newState.currentUser,
    articles: newState.articles,
    folders: newState.folders,
    bounties: newState.bounties,
    notifications: newState.notifications,
    roles: newState.roles,
    conversations: newState.conversations,
  });

  return newState;
}
