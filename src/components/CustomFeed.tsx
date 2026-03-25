import React, { useMemo } from 'react';
import { Compass, Eye, Flame, FolderOpen, Tags } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { can } from '../lib/permissions';

export default function CustomFeed() {
  const { state, dispatch } = useApp();
  const { articles, folders, currentUser, customFeedPrefs, recentReadsByUser } = state;
  const recentReadIds = new Set((recentReadsByUser[currentUser.id] || []).map((item) => item.articleId));
  const roleAffinityTags: Record<string, string[]> = {
    admin: ['Security', 'Compliance', 'Quy trình'],
    manager: ['Product', 'OKRs', 'Framework', 'Quy trình'],
    editor: ['Template', 'Checklist', 'Process'],
    viewer: ['Onboarding', 'iWiki', 'Hướng dẫn'],
  };

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
    const roleTags = roleAffinityTags[currentUser.role] || [];
    return articles
      .filter((article) => article.status === 'published' && can(currentUser, 'article.read', article))
      .filter((article) => {
        const hasFolderFilter = customFeedPrefs.folderIds.length > 0;
        const hasTagFilter = customFeedPrefs.tags.length > 0;
        const folderMatched = !hasFolderFilter || customFeedPrefs.folderIds.includes(article.folderId);
        const tagMatched = !hasTagFilter || article.tags.some((tag) => customFeedPrefs.tags.includes(tag));
        return folderMatched && tagMatched;
      })
      .map((article) => {
        const reasons: string[] = [];
        let score = 20;

        const tagAffinity = article.tags.filter((tag) => customFeedPrefs.tags.includes(tag)).length;
        if (tagAffinity > 0) {
          score += tagAffinity * 20;
          reasons.push('Khớp tag quan tâm');
        }

        if (customFeedPrefs.folderIds.includes(article.folderId)) {
          score += 18;
          reasons.push('Khớp danh mục theo dõi');
        }

        const roleHits = article.tags.filter((tag) => roleTags.includes(tag)).length;
        if (roleHits > 0) {
          score += roleHits * 8;
          reasons.push(`Phù hợp vai trò ${currentUser.role}`);
        }

        if (recentReadIds.has(article.id)) {
          score += 6;
          reasons.push('Bạn đã đọc gần đây');
        }

        const freshnessDays = (Date.now() - new Date(article.updatedAt).getTime()) / (24 * 60 * 60 * 1000);
        score += freshnessDays <= 30 ? 10 : freshnessDays <= 90 ? 6 : 2;

        return {
          article,
          score,
          reasons: reasons.length > 0 ? reasons : ['Gợi ý khám phá thêm'],
        };
      })
      .sort((a, b) => b.score - a.score || new Date(b.article.updatedAt).getTime() - new Date(a.article.updatedAt).getTime());
  }, [articles, currentUser, customFeedPrefs, recentReadIds]);

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
    dispatch({ type: 'SET_SCREEN', screen: 'article-detail' });
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
            <Compass className="text-[#f76226]" size={26} />
            Custom Feed
          </h1>
          <p className="text-gray-500 mt-2">Tạo feed theo danh mục và tags bạn quan tâm để đọc nhanh hơn.</p>
        </div>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <FolderOpen size={16} className="text-[#f76226]" />
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
                      ? 'bg-[#f76226] text-white'
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
          feedArticles.map(({ article, score, reasons }) => (
            <button
              key={article.id}
              onClick={() => openArticle(article.id)}
              className="w-full text-left bg-white border border-gray-200 hover:border-orange-200 rounded-2xl p-5 transition-all hover:shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-bold text-gray-900">{article.title}</h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-orange-50 text-[#f76226]">
                  Score {Math.round(score)}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {article.excerpt || article.content.slice(0, 120)}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {reasons.slice(0, 2).map((reason) => (
                  <span key={reason} className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-600">
                    {reason}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Eye size={12} />
                  {article.views}
                </span>
                <span className="flex items-center gap-1">
                  <Flame size={12} className="text-[#f76226]" />
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
