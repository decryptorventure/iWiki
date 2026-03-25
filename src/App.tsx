import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import OnboardingTour from './components/OnboardingTour';
import NotificationBell from './components/NotificationBell';
import { ArticleModal } from './components/ArticleModal';
import AppScreenRouter from './components/app-screen-router';
import { toast } from '@frontend-team/ui-kit';

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

  if (!isLoggedIn) return <Login />;

  const handleSearch = (query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', query });
    dispatch({ type: 'SET_SCREEN', screen: 'search' });
  };

  const selectedArticle = selectedArticleId ? articles.find(a => a.id === selectedArticleId) || null : null;

  return (
    <>
      {showOnboarding && (
        <OnboardingTour
          user={currentUser}
          onComplete={() => dispatch({ type: 'COMPLETE_ONBOARDING', userId: currentUser.id })}
          onSkip={() => dispatch({ type: 'COMPLETE_ONBOARDING', userId: currentUser.id })}
          onNavigate={(screen) => dispatch({ type: 'SET_SCREEN', screen })}
        />
      )}
      <div className="flex h-screen bg-[var(--ds-bg-secondary)] text-[var(--ds-text-primary)] font-sans overflow-hidden">
        <Sidebar />
        <div className="flex-1 min-w-0 flex flex-col min-h-0">
          <header className="h-14 shrink-0 border-b border-[var(--ds-border-tertiary)] bg-[var(--ds-bg-primary)] px-6 flex items-center justify-end z-20 relative">
            <NotificationBell />
          </header>
          <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar relative">
            <PageTransition screenKey={currentScreen}>
              <AppScreenRouter onSearch={handleSearch} />
            </PageTransition>
          </main>
        </div>
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
