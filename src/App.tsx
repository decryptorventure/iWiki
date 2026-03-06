import React, { useState, useCallback, useRef } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SearchResult from './components/SearchResult';
import Profile from './components/Profile';
import MyArticles from './components/MyArticles';
import Bounties from './components/Bounties';
import DataJanitor from './components/DataJanitor';
import DocumentManagement from './components/DocumentManagement';
import PermissionManagement from './components/PermissionManagement';
import IWikiAI from './components/IWikiAI';
import EmptyFolderBounty from './components/EmptyFolderBounty';
import FolderView from './components/FolderView';
import Notifications from './components/Notifications';
import Analytics from './components/Analytics';
import Editor from './components/Editor';
import { ArticleModal } from './components/ArticleModal';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle, Bell, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ===== TOAST SYSTEM =====
type ToastType = 'success' | 'error' | 'warning' | 'info';
interface Toast { id: number; message: string; type: ToastType; }
interface ToastContextType { addToast: (message: string, type?: ToastType) => void; }

export const ToastContext = React.createContext<ToastContextType>({ addToast: () => { } });
export const useToast = () => React.useContext(ToastContext);

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: number) => void }) {
  const icons = {
    success: <div className="p-1 px-1.5 bg-green-500 rounded-lg text-white shadow-lg shadow-green-500/20"><CheckCircle size={14} /></div>,
    error: <div className="p-1 px-1.5 bg-red-500 rounded-lg text-white shadow-lg shadow-red-500/20"><AlertCircle size={14} /></div>,
    warning: <div className="p-1 px-1.5 bg-amber-500 rounded-lg text-white shadow-lg shadow-amber-500/20"><AlertTriangle size={14} /></div>,
    info: <div className="p-1 px-1.5 bg-indigo-500 rounded-lg text-white shadow-lg shadow-indigo-500/20"><Info size={14} /></div>,
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200] space-y-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="pointer-events-auto flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[280px] max-w-[380px]"
          >
            {icons[toast.type]}
            <span className="text-sm font-medium text-gray-800 flex-1">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="p-0.5 text-gray-400 hover:text-gray-700 transition-colors shrink-0"><X size={14} /></button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ===== MAIN APP INNER =====
function AppInner() {
  const { state, dispatch } = useApp();
  const { currentScreen, selectedArticleId, articles } = state;

  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);
  const removeToast = useCallback((id: number) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);

  const handleSearch = (query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', query });
    dispatch({ type: 'SET_SCREEN', screen: 'search' });
  };

  const selectedArticle = selectedArticleId ? articles.find(a => a.id === selectedArticleId) || null : null;

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard': return <Dashboard onSearch={handleSearch} />;
      case 'search': return <SearchResult query={state.searchQuery} onBack={() => dispatch({ type: 'SET_SCREEN', screen: 'dashboard' })} />;
      case 'ai': return <IWikiAI />;
      case 'profile': return <Profile />;
      case 'my-articles': return <MyArticles />;
      case 'bounties': return <Bounties />;
      case 'janitor': return <DataJanitor />;
      case 'notifications': return <Notifications />;
      case 'documents': return <DocumentManagement />;
      case 'permissions': return <PermissionManagement />;
      case 'analytics': return <Analytics />;
      case 'editor':
        return (
          <Editor
            initialData={state.editorData}
            onBack={() => dispatch({ type: 'SET_SCREEN', screen: 'my-articles' })}
          />
        );
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
        if (currentScreen === 'empty-folder') return <EmptyFolderBounty folderId={state.currentFolderId || 'f-process'} folderName="Process & Checklist" breadcrumbs={['Know-How', 'iKame', 'Process & Checklist']} />;
        return <div className="flex items-center justify-center h-full text-gray-500 font-bold uppercase tracking-widest text-xs">Phát triển thêm...</div>;
    }
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      <div className="flex h-screen bg-white text-gray-900 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreen}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </main>

        <ToastContainer toasts={toasts} removeToast={removeToast} />

        <ArticleModal
          open={!!selectedArticle}
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
