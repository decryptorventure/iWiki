import { AccessLevel, Article, AppState, User, Folder } from '../store/useAppStore';

type PermissionAction =
  | 'article.read'
  | 'article.write'
  | 'article.submit_review'
  | 'article.approve'
  | 'admin.access'
  | 'manager.access';

const accessRank: Record<AccessLevel, number> = {
  none: 0,
  read: 1,
  write: 2,
  approve: 3,
  admin: 4,
};

export function getScopeLevel(user: User, folderId?: string, folders: Folder[] = []): AccessLevel {
  if (user.role === 'admin') return 'admin';
  if (!folderId) return 'read'; // Default for public articles without folder

  const scopes = Array.isArray((user as any)?.scopes) ? (user as any).scopes : [];

  // 1. Check exact match
  const exactScope = scopes.find((s: any) => s?.folderId === folderId);
  if (exactScope) return exactScope.level;

  // 2. Check inheritance (crawl up the tree)
  const currentFolder = folders.find(f => f.id === folderId);
  if (currentFolder && currentFolder.parentId) {
    return getScopeLevel(user, currentFolder.parentId, folders);
  }

  return 'none';
}

export function can(user: User, action: PermissionAction, article?: Article, folders: Folder[] = []): boolean {
  if (user.role === 'admin') return true;

  if (action === 'admin.access') return false;
  if (action === 'manager.access') return user.role === 'manager';

  // Personal Space Logic
  if (article?.isPersonal) {
    if (article.ownerId === user.id) return true;
    if (action === 'article.read' && article.sharedWith?.includes(user.id)) return true;
    return false;
  }

  const folder = article?.folderId ? folders.find(f => f.id === article.folderId) : undefined;
  if (folder?.isPersonal) {
    if (folder.ownerId === user.id) return true;
    if (action === 'article.read' && folder.sharedWith?.includes(user.id)) return true;
    return false;
  }

  const scope = getScopeLevel(user, article?.folderId, folders);

  if (action === 'article.read') {
    if (!article) return accessRank[scope] >= accessRank.read;
    if (article?.viewPermission === 'public') return true;
    if (article.author?.id === user.id) return true;
    return accessRank[scope] >= accessRank.read;
  }

  if (action === 'article.write') return accessRank[scope] >= accessRank.write;
  if (action === 'article.submit_review') return article?.author?.id === user.id || accessRank[scope] >= accessRank.write;
  if (action === 'article.approve') return user.role === 'manager' && accessRank[scope] >= accessRank.approve;

  return false;
}

export function getAccessibleArticles(state: AppState): Article[] {
  return state.articles.filter(article => can(state.currentUser, 'article.read', article, state.folders));
}
