import { Heart, Eye, MessageSquare, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { can } from '../lib/permissions';

export default function Favorites() {
  const { state, dispatch } = useApp();
  const favoriteIds = state.favoritesByUser[state.currentUser.id] || [];
  const favoriteArticles = state.articles.filter(a => favoriteIds.includes(a.id) && can(state.currentUser, 'article.read', a));

  const openArticle = (articleId: string) => {
    dispatch({ type: 'SET_SELECTED_ARTICLE', articleId });
    dispatch({ type: 'INCREMENT_VIEWS', articleId });
    dispatch({
      type: 'TRACK_EVENT',
      event: { type: 'open_article', userId: state.currentUser.id, articleId },
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-8 py-12 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <Heart size={24} className="text-rose-500" />
          Bài viết đã lưu
        </h1>
        <p className="text-gray-500 mt-2">Danh sách bài bạn đã đánh dấu Favorite để đọc lại nhanh.</p>
      </div>

      {favoriteArticles.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center text-gray-500">
          Chưa có bài viết nào trong Favorites.
        </div>
      ) : (
        <div className="space-y-4">
          {favoriteArticles.map(article => (
            <button
              key={article.id}
              onClick={() => openArticle(article.id)}
              className="w-full text-left card-premium p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{article.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{article.excerpt || article.content.slice(0, 120)}</p>
                </div>
                <Heart className="text-rose-500 fill-current shrink-0" size={18} />
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500 mt-4">
                <span className="flex items-center gap-1"><Eye size={12} />{article.views}</span>
                <span className="flex items-center gap-1"><Flame size={12} />{article.likes}</span>
                <span className="flex items-center gap-1"><MessageSquare size={12} />{article.comments.length}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
