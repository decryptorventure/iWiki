import React from 'react';
import { FileText, Search, Filter, Plus, Target, Coins, Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '@frontend-team/ui-kit';

interface EmptyFolderBountyProps {
  folderId: string;
  folderName: string;
  breadcrumbs: string[];
}

export default function EmptyFolderBounty({ folderId, folderName, breadcrumbs }: EmptyFolderBountyProps) {
  const { dispatch } = useApp();

  const handleWriteArticle = () => {
    dispatch({ type: 'OPEN_EDITOR', article: { folderId } });
  };

  const navigateToHome = () => {
    dispatch({ type: 'SET_SCREEN', screen: 'dashboard' });
  };

  return (
    <div className="flex flex-col h-full bg-[var(--ds-bg-secondary)] text-[var(--ds-text-primary)]">
      {/* Header / Breadcrumbs */}
      <div className="px-8 py-4 border-b border-[var(--ds-border-tertiary)] flex items-center text-sm text-[var(--ds-text-tertiary)] bg-[var(--ds-bg-primary)] backdrop-blur-sm sticky top-0 z-10">
        <span onClick={navigateToHome} className="hover:text-[var(--ds-fg-accent-primary)] cursor-pointer transition-colors">Trang chủ</span>
        <span className="mx-2 text-[var(--ds-text-tertiary)]/50">/</span>
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <span className={index === breadcrumbs.length - 1 ? 'text-[var(--ds-text-primary)] font-medium' : 'hover:text-[var(--ds-fg-accent-primary)] cursor-pointer transition-colors'}>
              {crumb}
            </span>
            {index < breadcrumbs.length - 1 && <span className="mx-2 text-[var(--ds-text-tertiary)]/50">/</span>}
          </React.Fragment>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-8 max-w-5xl mx-auto w-full">
        {/* Title */}
        <h1 className="text-3xl font-bold text-[var(--ds-text-primary)] mb-12 animate-slide-up">{folderName}</h1>

        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-[var(--ds-border-tertiary)] pb-2 mb-16 animate-slide-up stagger-1">
          <h2 className="text-xs font-semibold text-[var(--ds-text-tertiary)] uppercase tracking-wider">Bài viết</h2>
          <div className="flex items-center gap-1 text-[var(--ds-text-tertiary)]">
            <Button variant="subtle" size="icon-s"><Search size={16} /></Button>
            <Button variant="subtle" size="icon-s"><Filter size={16} /></Button>
            <Button variant="subtle" size="icon-s" onClick={handleWriteArticle}><Plus size={16} /></Button>
          </div>
        </div>

        {/* Empty State with Bounty */}
        <div className="flex flex-col items-center justify-center max-w-2xl mx-auto text-center mt-10 animate-slide-up stagger-2">
          <div className="mb-4 text-[var(--ds-text-tertiary)] animate-float">
            <FileText size={48} strokeWidth={1} title="Chưa có bài viết" />
          </div>
          <h3 className="text-xl font-bold text-[var(--ds-text-primary)] mb-2">Chưa có bài viết</h3>
          <p className="text-sm text-[var(--ds-text-secondary)] mb-10">Các bài viết sẽ sớm được cập nhật</p>

          {/* Bounty Card */}
          <div className="w-full relative group mt-4">
            <div className="absolute -inset-1.5 bg-[var(--ds-bg-accent-primary-subtle)] rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative bg-[var(--ds-bg-primary)] border border-[var(--ds-border-accent-primary-subtle)] rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 text-left flex flex-col sm:flex-row items-center gap-8">

              <div className="w-20 h-20 bg-[var(--ds-bg-accent-primary-subtle)] rounded-full flex items-center justify-center shrink-0 shadow-inner border border-[var(--ds-border-accent-primary-subtle)] group-hover:scale-110 transition-transform duration-300">
                <Target size={36} className="text-[var(--ds-fg-accent-primary)]" />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                  <h4 className="text-lg font-bold text-[var(--ds-text-primary)]">Nhiệm vụ: Người tiên phong</h4>
                  <span className="px-2.5 py-1 bg-[var(--ds-bg-accent-primary-subtle)] text-[var(--ds-fg-accent-primary)] text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5 shadow-sm">
                    <Sparkles size={12} />
                    Bounty
                  </span>
                </div>
                <p className="text-[var(--ds-text-secondary)] mb-5 leading-relaxed">
                  Thư mục <span className="font-semibold text-[var(--ds-text-primary)]">"{folderName}"</span> đang trống. Hãy là người đầu tiên đóng góp bài viết chất lượng để nhận phần thưởng đặc biệt từ hệ thống!
                </p>

                <div className="flex items-center justify-center sm:justify-start gap-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-[var(--ds-fg-accent-primary)] bg-[var(--ds-bg-accent-primary-subtle)] px-4 py-2.5 rounded-xl border border-[var(--ds-border-accent-primary-subtle)] shadow-sm">
                    <Coins size={18} />
                    +500 iCoin
                  </div>
                  <Button variant="primary" onClick={handleWriteArticle}>
                    Viết bài ngay <ArrowRight size={16} />
                  </Button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

