import React, { useState, useCallback, useRef } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SearchResult from './components/SearchResult';
import Profile from './components/Profile';
import MyArticles from './components/MyArticles';
import Bounties from './components/Bounties';
import DataJanitor from './components/DataJanitor';
import Favorites from './components/Favorites';
import CustomFeed from './components/CustomFeed';
import DocumentManagement from './components/DocumentManagement';
import PermissionManagement from './components/PermissionManagement';
import AdminDashboard from './components/AdminDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import IWikiAI from './components/IWikiAI';
import EmptyFolderBounty from './components/EmptyFolderBounty';
import Login from './components/Login';
import OnboardingTour from './components/OnboardingTour';
import FolderView from './components/FolderView';
import Notifications from './components/Notifications';
import Editor from './components/Editor';
import NotificationBell from './components/NotificationBell';
import { ArticleModal } from './components/ArticleModal';
import ArticleFullView from './components/ArticleFullView';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { toast } from '@frontend-team/ui-kit';
import { APP_SCREENS } from './constants/screens';
import { can } from './lib/permissions';

// ===== TOAST SYSTEM =====
export const useToast = () => {
  return {
    addToast: (message: string, type: string = 'info') => {
      // @ts-ignore - Mapping legacy types to UI kit toast
      toast(message, { type });
    }
  };
};

// ===== PAGE WRAPPER =====
function PageTransition({ children, screenKey }: { children: React.ReactNode; screenKey: string }) {
  return <div key={screenKey} className="page-enter h-full">{children}</div>;
}

// ===== MAIN APP INNER (accesses context) =====
function AppInner() {
  const { state, dispatch } = useApp();
  const { isLoggedIn, currentScreen, selectedArticleId, articles, currentUser, onboardingCompletedForUsers } = state;
  const showOnboarding = isLoggedIn && !onboardingCompletedForUsers[currentUser.id];

  if (!isLoggedIn) {
    return <Login />;
  }



  const handleSearch = (query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', query });
    dispatch({ type: 'SET_SCREEN', screen: 'search' });
  };

  const selectedArticle = selectedArticleId ? articles.find(a => a.id === selectedArticleId) || null : null;

  const renderProtectedScreen = (screen: string, component: React.ReactNode) => {
    if (screen === APP_SCREENS.ADMIN_DASHBOARD && !can(currentUser, 'admin.access')) {
      return <div className="p-10 text-center text-gray-500">Bạn không có quyền truy cập trang Admin.</div>;
    }
    if (screen === APP_SCREENS.MANAGER_DASHBOARD && !can(currentUser, 'manager.access') && currentUser.role !== 'admin') {
      return <div className="p-10 text-center text-gray-500">Bạn không có quyền truy cập Manager View.</div>;
    }
    return component;
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case APP_SCREENS.DASHBOARD:
        return <Dashboard onSearch={handleSearch} />;
      case APP_SCREENS.SEARCH:
        return <SearchResult query={state.searchQuery} onBack={() => dispatch({ type: 'SET_SCREEN', screen: APP_SCREENS.DASHBOARD })} />;
      case APP_SCREENS.AI:
        return <IWikiAI />;
      case APP_SCREENS.PROFILE:
        return <Profile />;
      case APP_SCREENS.MY_ARTICLES:
        return <MyArticles />;
      case APP_SCREENS.CUSTOM_FEED:
        return <CustomFeed />;
      case APP_SCREENS.BOUNTIES:
        return <Bounties />;
      case APP_SCREENS.JANITOR:
        return <DataJanitor />;
      case APP_SCREENS.FAVORITES:
        return <Favorites />;
      case APP_SCREENS.NOTIFICATIONS:
        return <Notifications />;
      case APP_SCREENS.DOCUMENTS:
        return renderProtectedScreen(APP_SCREENS.DOCUMENTS, <DocumentManagement />);
      case APP_SCREENS.PERMISSIONS:
        return renderProtectedScreen(APP_SCREENS.PERMISSIONS, <PermissionManagement />);
      case APP_SCREENS.ADMIN_DASHBOARD:
        return renderProtectedScreen(APP_SCREENS.ADMIN_DASHBOARD, <AdminDashboard />);
      case APP_SCREENS.MANAGER_DASHBOARD:
        return renderProtectedScreen(APP_SCREENS.MANAGER_DASHBOARD, <ManagerDashboard />);
      case APP_SCREENS.ARTICLE_DETAIL:
        return <ArticleFullView />;
      case APP_SCREENS.EDITOR:
        return (
          <Editor
            initialData={state.editorData}
            onBack={() => dispatch({ type: 'SET_SCREEN', screen: APP_SCREENS.MY_ARTICLES })}
          />
        );
      case 'folder-know-how':
        return (
          <FolderView
            folderId="f-knowhow"
            title="Know-How"
            description="Nơi lưu trữ kho Kinh nghiệm, Kiến thức, Kỹ năng, Tư duy, Quy trình tiêu chuẩn, Case studies ở mọi khía cạnh trong công việc."
            breadcrumbs={['Know-How']}
          />
        );
      case 'folder-company':
        return (
          <FolderView
            folderId="f-company"
            title="Công ty iKame"
            description="Tài liệu chính sách và quy trình công ty."
            breadcrumbs={['Công ty iKame']}
          />
        );
      case 'folder-tech':
        return (
          <FolderView
            folderId="f-tech"
            title="Phòng Kỹ thuật"
            description="Tài liệu kỹ thuật nội bộ."
            breadcrumbs={['Phòng Kỹ thuật']}
          />
        );
      case APP_SCREENS.EMPTY_FOLDER:
        return <EmptyFolderBounty folderId={state.currentFolderId || 'f-process'} folderName="Process & Checklist" breadcrumbs={['Know-How', 'iKame', 'Process & Checklist']} />;
      default:
        if (currentScreen.startsWith('folder-')) {
          const folderId = currentScreen.replace('folder-', '');
          const folder = state.folders.find(f => f.id === folderId) ||
            state.folders.flatMap(f => f.children || []).find(f => f.id === folderId);
          return (
            <FolderView
              folderId={folderId}
              title={folder?.name || 'Thư mục'}
              description={folder?.description}
              breadcrumbs={[folder?.name || 'Thư mục']}
            />
          );
        }
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            Tính năng đang được phát triển...
          </div>
        );
    }
  };

  const handleOnboardingComplete = () => {
    dispatch({ type: 'COMPLETE_ONBOARDING', userId: currentUser.id });
  };

  return (
    <>
      {showOnboarding && (
        <OnboardingTour
          user={currentUser}
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingComplete}
          onNavigate={(screen) => dispatch({ type: 'SET_SCREEN', screen })}
        />
      )}
      <div className="flex h-screen bg-[#f9fafb] text-gray-900 font-sans overflow-hidden">
        <Sidebar />
        <div className="flex-1 min-w-0 flex flex-col min-h-0">
          <header className="h-14 shrink-0 border-b border-gray-200/80 bg-white px-6 flex items-center justify-between z-20 relative">
            <div>
              <p className="text-sm font-semibold text-gray-900">iWiki</p>
            </div>
            <NotificationBell />
          </header>
          <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar relative">
            <PageTransition screenKey={currentScreen}>
              {renderScreen()}
            </PageTransition>
          </main>
        </div>

        {/* Global Article Modal */}
        <ArticleModal
          open={!!selectedArticle && currentScreen !== 'article-detail'}
          article={selectedArticle}
          onOpenChange={(open) => {
            if (!open) dispatch({ type: 'SET_SELECTED_ARTICLE', articleId: null });
          }}
        />
      </div>
    </>
  );
}

// ===== ROOT =====
export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
