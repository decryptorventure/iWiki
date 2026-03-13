import React, { useMemo } from 'react';
import { Compass, Eye, Flame, FolderOpen, Tags } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { can } from '../lib/permissions';

export default function CustomFeed() {
  const { state, dispatch } = useApp();
  const { articles, folders, currentUser, customFeedPrefs } = state;

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    articles.forEach((article) => {
      if (article.status !== 'published') return;
      article.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
  }, [articles]);

  const availableFolders = useMemo(() => {
    return folders.flatMap((folder) => folder.children || []);
  }, [folders]);

  const feedArticles = useMemo(() => {
    return articles
      .filter((article) => article.status === 'published' && can(currentUser, 'article.read', article))
      .filter((article) => {
        const hasFolderFilter = customFeedPrefs.folderIds.length > 0;
        const hasTagFilter = customFeedPrefs.tags.length > 0;
        const folderMatched = !hasFolderFilter || customFeedPrefs.folderIds.includes(article.folderId);
        const tagMatched = !hasTagFilter || article.tags.some((tag) => customFeedPrefs.tags.includes(tag));
        return folderMatched && tagMatched;
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [articles, currentUser, customFeedPrefs]);

  const toggleTag = (tag: string) => {
    const nextTags = customFeedPrefs.tags.includes(tag)
      ? customFeedPrefs.tags.filter((item) => item !== tag)
      : [...customFeedPrefs.tags, tag];
    dispatch({ type: 'UPDATE_CUSTOM_FEED_PREFS', prefs: { tags: nextTags } });
  };

  const toggleFolder = (folderId: string) => {
    const nextFolderIds = customFeedPrefs.folderIds.includes(folderId)
      ? customFeedPrefs.folderIds.filter((item) => item !== folderId)
      : [...customFeedPrefs.folderIds, folderId];
    dispatch({ type: 'UPDATE_CUSTOM_FEED_PREFS', prefs: { folderIds: nextFolderIds } });
  };

  const openArticle = (articleId: string) => {
    dispatch({ type: 'SET_SELECTED_ARTICLE', articleId });
    dispatch({ type: 'INCREMENT_VIEWS', articleId });
    dispatch({
      type: 'TRACK_EVENT',
      event: { type: 'open_article', userId: currentUser.id, articleId, meta: { source: 'custom_feed' } },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-10 space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <Compass className="text-[#FF6B4A]" size={26} />
            Custom Feed
          </h1>
          <p className="text-gray-500 mt-2">Tạo feed theo danh mục và tags bạn quan tâm để đọc nhanh hơn.</p>
        </div>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <FolderOpen size={16} className="text-[#FF6B4A]" />
            Chọn danh mục theo dõi
          </h2>
          <div className="flex flex-wrap gap-2">
            {availableFolders.map((folder) => {
              const active = customFeedPrefs.folderIds.includes(folder.id);
              return (
                <button
                  key={folder.id}
                  onClick={() => toggleFolder(folder.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-[#FF6B4A] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {folder.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Tags size={16} className="text-indigo-500" />
            Chọn chủ đề (tags)
          </h2>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => {
              const active = customFeedPrefs.tags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900">Feed của bạn</h2>
        {feedArticles.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-10 text-center text-gray-500">
            Không có bài viết phù hợp với bộ lọc hiện tại.
          </div>
        ) : (
          feedArticles.map((article) => (
            <button
              key={article.id}
              onClick={() => openArticle(article.id)}
              className="w-full text-left bg-white border border-gray-200 hover:border-orange-200 rounded-2xl p-5 transition-all hover:shadow-sm"
            >
              <h3 className="text-base font-bold text-gray-900">{article.title}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {article.excerpt || article.content.slice(0, 120)}
              </p>
              <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Eye size={12} />
                  {article.views}
                </span>
                <span className="flex items-center gap-1">
                  <Flame size={12} className="text-[#FF6B4A]" />
                  {article.likes}
                </span>
                <span>{article.folderName || article.folderId}</span>
              </div>
            </button>
          ))
        )}
      </section>
    </div>
  );
}
