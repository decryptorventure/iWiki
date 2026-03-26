// User-related domain types

export type UserRole = 'super_admin' | 'admin' | 'staff'; // Global roles
export type SpaceRole = 'km' | 'member'; // Space-specific roles
export type AccessLevel = 'none' | 'read' | 'write' | 'approve' | 'admin';

export type AtomicPermission = 
  | 'article.read' 
  | 'article.create' 
  | 'article.edit' 
  | 'article.approve' 
  | 'article.delete'
  | 'space.manage_members'
  | 'space.manage_settings'
  | 'ai.write'
  | 'ai.chat';

export interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
  earned: boolean;
}

export interface SpaceMember {
  userId: string;
  spaceId: string;
  roleId: SpaceRole;
}

export interface RoleDefinition {
  id: UserRole | SpaceRole;
  name: string;
  permissions: AtomicPermission[];
}

export interface Team {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole; // Global role
  title: string;
  avatar: string;
  level: number;
  xp: number;
  xpToNext: number;
  coins: number;
  badges: Badge[];
  teamId?: string; // e.g., 'marketing', 'production'
}
