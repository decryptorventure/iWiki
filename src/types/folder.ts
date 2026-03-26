// Folder domain type

export interface Folder {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  icon?: string;
  color?: string;
  children?: Folder[];
  articleCount?: number;
  isPersonal?: boolean;
  ownerId?: string;
  sharedWith?: string[];
}
