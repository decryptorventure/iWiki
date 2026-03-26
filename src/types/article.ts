// Article-related domain types

export type ArticleStatus = 'draft' | 'in_review' | 'approved' | 'rejected' | 'published';

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

export interface ApprovalInlineComment {
  id: string;
  lineNumber: number;
  quote: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}

export interface ApprovalRecord {
  submittedAt?: string;
  submittedBy?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  reviewSummary?: string;
  comments?: ApprovalInlineComment[];
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
  isPersonal?: boolean;
  ownerId?: string;
  sharedWith?: string[];
  createdAt: string;
  updatedAt: string;
}
