import { Article, Folder, AppState } from '../store/useAppStore';
import { User, AtomicPermission, SpaceRole, UserRole } from '../types/user';

/** 
 * Lấy Space ID từ Article hoặc Folder.
 * Trong iWiki, Space là các folder gốc (n-level 0) có ID bắt đầu bằng 's-'
 */
export function getSpaceId(folderId?: string, folders: Folder[] = []): string | undefined {
  if (!folderId) return undefined;
  if (folderId.startsWith('s-')) return folderId;
  const folder = folders.find(f => f.id === folderId);
  if (folder && folder.parentId) return getSpaceId(folder.parentId, folders);
  return undefined;
}

/**
 * Kiểm tra xem user có quyền atomic cụ thể dựa trên role của họ.
 */
export function hasRolePermission(state: AppState, roleId: UserRole | SpaceRole, permission: AtomicPermission): boolean {
  const role = state.roles.find(r => r.id === roleId);
  return role?.permissions.includes(permission) || false;
}

export function can(state: AppState, action: AtomicPermission, articleOrFolder?: { folderId?: string; authorId?: string }, folders: Folder[] = state.folders): boolean {
  const { currentUser, spaceMembers } = state;

  // LAYER 1: Global Bypass
  if (currentUser.role === 'super_admin' || currentUser.role === 'admin') return true;

  // Determine target folder/space
  const folderId = articleOrFolder?.folderId;
  const spaceId = getSpaceId(folderId, folders);

  if (!spaceId) {
    // If no space (global context), check global role permissions
    return hasRolePermission(state, currentUser.role, action);
  }

  // LAYER 2: Space Layer
  const spaceMember = spaceMembers.find(m => m.userId === currentUser.id && m.spaceId === spaceId);
  if (!spaceMember) return false; // Not a member of the space

  // Check if the Space Role has the atomic permission
  const hasPerm = hasRolePermission(state, spaceMember.roleId, action);
  if (!hasPerm) {
    // Check if it's the author (for editing/deleting own articles)
    if (action === 'article.edit' || action === 'article.delete') {
      if (articleOrFolder?.authorId === currentUser.id) return true;
    }
    return false;
  }

  // LAYER 3: Folder/Restrictive Layer
  if (folderId) {
    const isVisible = isFolderVisibleToUser(currentUser, folderId, folders);
    if (!isVisible) return false;
  }

  return true;
}

/**
 * Đệ quy kiểm tra visibility của folder.
 * Mỗi tầng chỉ thu hẹp quyền (Restrictive model).
 */
function isFolderVisibleToUser(user: User, folderId: string, folders: Folder[]): boolean {
  const folder = folders.find(f => f.id === folderId);
  if (!folder) return true;

  // Check visibility at this level
  if (folder.visibilityType === 'team_restricted') {
    if (!folder.allowedTeams?.includes(user.teamId || '')) return false;
  }

  // If has parent, check parent visibility too (Restrictive)
  if (folder.parentId) {
    return isFolderVisibleToUser(user, folder.parentId, folders);
  }

  return true;
}

export function getAccessibleArticles(state: AppState): Article[] {
  return state.articles.filter(article => 
    can(state, 'article.read', { folderId: article.folderId, authorId: article.author.id }, state.folders)
  );
}

// Legacy compatibility shim for can
export function canLegacy(user: User, action: any, article?: any, folders: Folder[] = []): boolean {
  // Try to find state from context or something? 
  // In our case, components always have access to state.
  // We should update the components to pass state to can() instead of user.
  return true; 
}
