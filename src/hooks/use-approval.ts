// Hook: manager approval actions for articles in review
import { useApp } from '../context/AppContext';
import type { ApprovalInlineComment } from '../types';

export function useApproval() {
  const { state, dispatch } = useApp();
  const { currentUser } = state;

  const pendingArticles = state.articles.filter(a => a.status === 'in_review');

  const approve = (articleId: string) =>
    dispatch({ type: 'APPROVE_ARTICLE', articleId, approverId: currentUser.id });

  const reject = (articleId: string, reason: string) =>
    dispatch({ type: 'REJECT_ARTICLE', articleId, approverId: currentUser.id, reason });

  const addInlineComment = (articleId: string, comment: ApprovalInlineComment) =>
    dispatch({ type: 'ADD_APPROVAL_COMMENT', articleId, comment });

  const publish = (articleId: string) =>
    dispatch({ type: 'PUBLISH_APPROVED_ARTICLE', articleId });

  return { pendingArticles, approve, reject, addInlineComment, publish };
}
