// Routes the current screen to its component — extracted from App.tsx
import React, { lazy, Suspense } from 'react';
import { useApp } from '../context/AppContext';
import { APP_SCREENS } from '../constants/screens';
import { can } from '../lib/permissions';

const Dashboard = lazy(() => import('./Dashboard'));
const SearchResult = lazy(() => import('./SearchResult'));
const Profile = lazy(() => import('./Profile'));
const MyArticles = lazy(() => import('./MyArticles'));
const Bounties = lazy(() => import('./Bounties'));
const DataJanitor = lazy(() => import('./DataJanitor'));
const Favorites = lazy(() => import('./Favorites'));
// Custom Feed removed as requested
const PermissionManagement = lazy(() => import('./PermissionManagement'));
const IWikiAI = lazy(() => import('./IWikiAI'));
const EmptyFolderBounty = lazy(() => import('./EmptyFolderBounty'));
const FolderView = lazy(() => import('./FolderView'));
const Notifications = lazy(() => import('./Notifications'));
const Editor = lazy(() => import('./Editor'));
const ArticleFullView = lazy(() => import('./ArticleFullView'));
const ApprovalQueue = lazy(() => import('./ApprovalQueue'));
const ArticleReviewer = lazy(() => import('./ArticleReviewer'));

const ScreenFallback = () => (
  <div className="flex items-center justify-center h-full">
    <div className="w-8 h-8 border-2 border-[var(--ds-border-accent-primary-subtle)] border-t-[var(--ds-fg-accent-primary)] rounded-full animate-spin" />
  </div>
);

interface AppScreenRouterProps {
  onSearch: (query: string) => void;
}

export default function AppScreenRouter({ onSearch }: AppScreenRouterProps) {
  const { state, dispatch } = useApp();
  const { currentScreen } = state;

  const renderProtected = (screen: string, node: React.ReactNode) => {
    return node;
  };

  let screen: React.ReactNode;
  switch (currentScreen) {
    case APP_SCREENS.DASHBOARD:
      screen = <Dashboard onSearch={onSearch} />;
      break;
    case APP_SCREENS.SEARCH:
      screen = <SearchResult query={state.searchQuery} onBack={() => dispatch({ type: 'SET_SCREEN', screen: APP_SCREENS.DASHBOARD })} />;
      break;
    case APP_SCREENS.AI:
      screen = <IWikiAI />;
      break;
    case APP_SCREENS.PROFILE:
      screen = <Profile />;
      break;
    case APP_SCREENS.MY_ARTICLES:
      screen = <MyArticles />;
      break;
// Custom Feed Case removed
    case APP_SCREENS.BOUNTIES:
      screen = <Bounties />;
      break;
    case APP_SCREENS.JANITOR:
      screen = <DataJanitor />;
      break;
    case APP_SCREENS.FAVORITES:
      screen = <Favorites />;
      break;
    case APP_SCREENS.NOTIFICATIONS:
      screen = <Notifications />;
      break;
    case APP_SCREENS.PERMISSIONS:
      screen = renderProtected(APP_SCREENS.PERMISSIONS, <PermissionManagement />);
      break;
    case APP_SCREENS.ARTICLE_DETAIL:
      screen = <ArticleFullView />;
      break;
    case APP_SCREENS.EDITOR:
      screen = (
        <Editor
          initialData={state.editorData}
          onBack={() => dispatch({ type: 'SET_SCREEN', screen: APP_SCREENS.MY_ARTICLES })}
        />
      );
      break;
    case 'folder-know-how':
      screen = <FolderView folderId="f-knowhow" title="Know-How" description="Nơi lưu trữ kho Kinh nghiệm, Kiến thức, Kỹ năng, Tư duy, Quy trình tiêu chuẩn, Case studies ở mọi khía cạnh trong công việc." breadcrumbs={['Know-How']} />;
      break;
    case 'folder-company':
      screen = <FolderView folderId="f-company" title="Công ty iKame" description="Tài liệu chính sách và quy trình công ty." breadcrumbs={['Công ty iKame']} />;
      break;
    case 'folder-tech':
      screen = <FolderView folderId="f-tech" title="Phòng Kỹ thuật" description="Tài liệu kỹ thuật nội bộ." breadcrumbs={['Phòng Kỹ thuật']} />;
      break;
    case APP_SCREENS.EMPTY_FOLDER:
      screen = <EmptyFolderBounty folderId={state.currentFolderId || 'f-process'} folderName="Process & Checklist" breadcrumbs={['Know-How', 'iKame', 'Process & Checklist']} />;
      break;
    case APP_SCREENS.APPROVAL_QUEUE:
      screen = <ApprovalQueue />;
      break;
    case 'article-review':
      screen = (
        <ArticleReviewer
          articleId={state.selectedArticleId || ''}
          onBack={() => dispatch({ type: 'SET_SCREEN', screen: APP_SCREENS.APPROVAL_QUEUE })}
        />
      );
      break;
    default: {
      if (currentScreen.startsWith('folder-')) {
        const folderId = currentScreen.replace('folder-', '');
        const folder = state.folders.find(f => f.id === folderId) ||
          state.folders.flatMap(f => f.children || []).find(f => f.id === folderId);
        screen = <FolderView folderId={folderId} title={folder?.name || 'Thư mục'} description={folder?.description} breadcrumbs={[folder?.name || 'Thư mục']} />;
      } else {
        screen = <div className="flex items-center justify-center h-full text-[var(--ds-text-secondary)]">Tính năng đang được phát triển...</div>;
      }
    }
  }

  return <Suspense fallback={<ScreenFallback />}>{screen}</Suspense>;
}
