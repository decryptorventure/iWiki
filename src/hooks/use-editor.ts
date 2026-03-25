// Hook: editor form state and article save/publish actions
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Article, ArticleStatus } from '../types';

export function useEditor(initialData?: Partial<Article> | null) {
  const { state, dispatch } = useApp();
  const { currentUser } = state;

  const [title, setTitle] = useState(initialData?.title ?? '');
  const [content, setContent] = useState(initialData?.content ?? '');
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? []);
  const [folderId, setFolderId] = useState(initialData?.folderId ?? '');
  const [coverUrl, setCoverUrl] = useState(initialData?.coverUrl ?? '');
  const [viewPermission, setViewPermission] = useState<'public' | 'restricted'>(
    initialData?.viewPermission ?? 'public'
  );
  const [allowComments, setAllowComments] = useState(initialData?.allowComments ?? true);
  const [isDirty, setIsDirty] = useState(false);

  const isEditing = !!initialData?.id;

  const save = (status: ArticleStatus = 'draft') => {
    const article: Article = {
      id: initialData?.id ?? Date.now().toString(),
      title,
      content,
      tags,
      folderId,
      coverUrl,
      viewPermission,
      allowComments,
      status,
      author: {
        id: currentUser.id,
        name: currentUser.name,
        role: currentUser.role,
        avatar: currentUser.avatar,
        initials: currentUser.initials,
        color: currentUser.color,
      },
      views: initialData?.views ?? 0,
      likes: initialData?.likes ?? 0,
      likedBy: initialData?.likedBy ?? [],
      comments: initialData?.comments ?? [],
      approval: initialData?.approval,
      createdAt: initialData?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'SAVE_ARTICLE', article });
    setIsDirty(false);
  };

  return {
    title, setTitle: (v: string) => { setTitle(v); setIsDirty(true); },
    content, setContent: (v: string) => { setContent(v); setIsDirty(true); },
    tags, setTags,
    folderId, setFolderId,
    coverUrl, setCoverUrl,
    viewPermission, setViewPermission,
    allowComments, setAllowComments,
    isDirty,
    isEditing,
    save,
    folders: state.folders,
    currentUser,
  };
}
