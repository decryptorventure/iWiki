// Hook: per-article interaction actions (like, favorite, comment, delete)
import { useApp } from '../context/AppContext';
import type { Comment } from '../types';

export function useArticleActions(articleId: string) {
  const { state, dispatch } = useApp();
  const { currentUser } = state;

  const article = state.articles.find(a => a.id === articleId);
  const isLiked = article?.likedBy.includes(currentUser.id) ?? false;
  const isFavorited = (state.favoritesByUser[currentUser.id] ?? []).includes(articleId);

  const toggleLike = () =>
    dispatch({ type: 'TOGGLE_LIKE', articleId, userId: currentUser.id });

  const toggleFavorite = () =>
    dispatch({ type: 'TOGGLE_FAVORITE', articleId, userId: currentUser.id });

  const addComment = (content: string) => {
    const comment: Comment = {
      id: Date.now().toString(),
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      content,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_COMMENT', articleId, comment });
  };

  const deleteArticle = () =>
    dispatch({ type: 'DELETE_ARTICLE', articleId });

  const submitForReview = () =>
    dispatch({ type: 'SUBMIT_ARTICLE_REVIEW', articleId, userId: currentUser.id });

  const openArticle = () => {
    dispatch({ type: 'SET_SELECTED_ARTICLE', articleId });
    dispatch({ type: 'INCREMENT_VIEWS', articleId });
    dispatch({ type: 'SET_SCREEN', screen: 'article-detail' });
  };

  return {
    article,
    isLiked,
    isFavorited,
    toggleLike,
    toggleFavorite,
    addComment,
    deleteArticle,
    submitForReview,
    openArticle,
  };
}
