// Feed and user preferences domain types

export interface RecentReadItem {
  articleId: string;
  lastReadAt: string;
  count: number;
}

export interface CustomFeedPrefs {
  tags: string[];
  folderIds: string[];
}
