// Notification domain types

export type NotificationType = 'comment' | 'like' | 'reward' | 'bounty' | 'approval' | 'system';

export interface Notification {
  id: string;
  title: string;
  content: string;
  type: NotificationType;
  time: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}
