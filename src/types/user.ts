// User-related domain types

export type UserRole = 'admin' | 'manager' | 'editor' | 'viewer';
export type AccessLevel = 'none' | 'read' | 'write' | 'approve' | 'admin';

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
