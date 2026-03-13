import { AccessLevel, Article, AppState, User } from '../store/useAppStore';

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

export function getScopeLevel(user: User, folderId?: string): AccessLevel {
  if (!folderId) return user.role === 'admin' ? 'admin' : 'read';
  if (user.role === 'admin') return 'admin';
  const scopes = Array.isArray((user as any)?.scopes) ? (user as any).scopes : [];
  const scope = scopes.find((s: any) => s?.folderId === folderId);
  return scope?.level || 'none';
}

export function can(user: User, action: PermissionAction, article?: Article): boolean {
  if (user.role === 'admin') return true;

  if (action === 'admin.access') return false;
  if (action === 'manager.access') return user.role === 'manager';

  const scope = getScopeLevel(user, article?.folderId);

  if (action === 'article.read') {
    if (!article) return accessRank[scope] >= accessRank.read;
    if (article.viewPermission === 'public') return true;
    if (article.author.id === user.id) return true;
    return accessRank[scope] >= accessRank.read;
  }

  if (action === 'article.write') return accessRank[scope] >= accessRank.write;
  if (action === 'article.submit_review') return article?.author.id === user.id || accessRank[scope] >= accessRank.write;
  if (action === 'article.approve') return user.role === 'manager' && accessRank[scope] >= accessRank.approve;

  return false;
}

export function getAccessibleArticles(state: AppState): Article[] {
  return state.articles.filter(article => can(state.currentUser, 'article.read', article));
}
