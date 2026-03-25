// Bounty domain type

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
