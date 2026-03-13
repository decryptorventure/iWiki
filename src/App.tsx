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
import FolderView from './components/FolderView';
import Notifications from './components/Notifications';
import Editor from './components/Editor';
import NotificationBell from './components/NotificationBell';
import { ArticleModal } from './components/ArticleModal';
import ArticleFullView from './components/ArticleFullView';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { APP_SCREENS } from './constants/screens';
import { can } from './lib/permissions';

// ===== TOAST SYSTEM =====
type ToastType = 'success' | 'error' | 'warning' | 'info';
interface Toast { id: number; message: string; type: ToastType; }
interface ToastContextType { addToast: (message: string, type?: ToastType) => void; }

export const ToastContext = React.createContext<ToastContextType>({ addToast: () => { } });
export const useToast = () => React.useContext(ToastContext);

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: number) => void }) {
  const icons = {
    success: <CheckCircle size={18} className="text-green-500" />,
    error: <AlertCircle size={18} className="text-red-500" />,
    warning: <AlertTriangle size={18} className="text-amber-500" />,
    info: <Info size={18} className="text-blue-500" />,
  };
  const borders = { success: 'border-l-green-500', error: 'border-l-red-500', warning: 'border-l-amber-500', info: 'border-l-blue-500' };

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className={`pointer-events-auto flex items-center gap-3 px-4 py-3 bg-white rounded-xl shadow-lg border border-gray-100 border-l-4 ${borders[toast.type]} toast-enter min-w-[300px] max-w-[420px]`}>
          {icons[toast.type]}
          <span className="text-sm font-medium text-gray-800 flex-1">{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors shrink-0"><X size={14} /></button>
        </div>
      ))}
    </div>
  );
}

// ===== PAGE WRAPPER =====
function PageTransition({ children, screenKey }: { children: React.ReactNode; screenKey: string }) {
  return <div key={screenKey} className="page-enter h-full">{children}</div>;
}

// ===== MAIN APP INNER (accesses context) =====
function AppInner() {
  const { state, dispatch } = useApp();
  const { currentScreen, selectedArticleId, articles, currentUser } = state;

  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);
  const removeToast = useCallback((id: number) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);

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

  return (
    <ToastContext.Provider value={{ addToast }}>
      <div className="flex h-screen bg-[#f9fafb] text-gray-900 font-sans overflow-hidden">
        <Sidebar />
        <div className="flex-1 min-w-0 flex flex-col min-h-0">
          <header className="h-14 shrink-0 border-b border-gray-200/80 bg-white px-6 flex items-center justify-between z-20 relative">
            <div>
              <p className="text-sm font-semibold text-gray-900">iWiki</p>
            </div>
            <NotificationBell />
          </header>
          <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
            <PageTransition screenKey={currentScreen}>
              {renderScreen()}
            </PageTransition>
          </main>
        </div>
        <ToastContainer toasts={toasts} removeToast={removeToast} />

        {/* Global Article Modal */}
        <ArticleModal
          open={!!selectedArticle && currentScreen !== 'article-detail'}
          article={selectedArticle}
          onOpenChange={(open) => {
            if (!open) dispatch({ type: 'SET_SELECTED_ARTICLE', articleId: null });
          }}
        />
      </div>
    </ToastContext.Provider>
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
