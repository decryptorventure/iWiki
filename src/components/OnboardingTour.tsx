import React, { useState } from 'react';
import {
  Flame,
  Search,
  FolderTree,
  Sparkles,
  FileText,
  Compass,
  Shield,
  BarChart,
  BookOpen,
  ChevronRight,
  X,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import { Button } from '@frontend-team/ui-kit';
import { User } from '../store/useAppStore';
import { APP_SCREENS } from '../constants/screens';

export type OnboardingRole = 'viewer' | 'editor' | 'admin';

interface OnboardingStep {
  id: string;
  title: string;
  body: string;
  icon: React.ElementType;
  gradient: string;
  /** Nếu có, nút "Thử ngay" sẽ chuyển tới screen này */
  tryScreen?: string;
}

const STEPS_BY_ROLE: Record<OnboardingRole, OnboardingStep[]> = {
  viewer: [
    {
      id: 'welcome',
      title: 'Chào mừng bạn đến với iWiki!',
      body: 'Bạn đang đăng nhập với vai trò **Nhân viên mới**. Bạn có thể tìm kiếm, đọc tài liệu nội bộ và hỏi iWiki AI mọi lúc.',
      icon: UserPlus,
      gradient: 'var(--ds-bg-info-subtle)',
    },
    {
      id: 'search',
      title: 'Trang chủ & Tìm kiếm thông minh',
      body: 'Ô **tìm kiếm** trên Trang chủ giúp bạn tìm bài viết theo từ khóa. Hệ thống gợi ý theo ngữ cảnh và lưu lịch sử tìm kiếm gần đây.',
      icon: Search,
      gradient: 'var(--ds-bg-accent-primary-subtle)',
      tryScreen: APP_SCREENS.DASHBOARD,
    },
    {
      id: 'folders',
      title: 'Duyệt thư mục & Đọc bài viết',
      body: '**Sidebar bên trái** có cây thư mục (Công ty, Kỹ thuật, Know-How, Product). Click thư mục để xem danh sách bài, click vào bài để đọc nội dung chi tiết.',
      icon: FolderTree,
      gradient: 'var(--ds-bg-success-subtle)',
    },
    {
      id: 'ai',
      title: 'iWiki AI — Trợ lý tri thức',
      body: 'Mục **iWiki AI** cho phép bạn đặt câu hỏi về quy trình, chính sách, hoặc nhờ tóm tắt tài liệu, viết draft. Hãy thử ngay!',
      icon: Sparkles,
      gradient: 'var(--ds-bg-secondary)',
      tryScreen: APP_SCREENS.AI,
    },
  ],
  editor: [
    {
      id: 'welcome',
      title: 'Chào mừng bạn đến với iWiki!',
      body: 'Với vai trò **Nhân viên chính thức**, bạn có thể đọc tài liệu, **viết bài mới**, gửi duyệt và đóng góp nội dung cho kho tri thức iKame.',
      icon: UserCheck,
      gradient: 'var(--ds-bg-accent-primary-subtle)',
    },
    {
      id: 'search',
      title: 'Trang chủ & Tìm kiếm',
      body: 'Dùng ô **tìm kiếm** trên Trang chủ để tìm bài viết. Bạn cũng xem được bài nổi bật và danh sách bài gần đây ngay trên Dashboard.',
      icon: Search,
      gradient: 'var(--ds-bg-accent-primary-subtle)',
      tryScreen: APP_SCREENS.DASHBOARD,
    },
    {
      id: 'my-articles',
      title: 'Bài viết của tôi',
      body: 'Mục **Bài viết của tôi** giúp bạn quản lý bản nháp và bài đã gửi duyệt. Tạo bài mới, chỉnh sửa và gửi duyệt — khi được approve bạn có thể xuất bản.',
      icon: FileText,
      gradient: 'var(--ds-bg-info-subtle)',
      tryScreen: APP_SCREENS.MY_ARTICLES,
    },
    {
      id: 'feed-ai',
      title: 'Custom Feed & iWiki AI',
      body: '**Custom Feed** gợi ý bài theo tag và thư mục bạn quan tâm. **iWiki AI** hỗ trợ viết PRD, SOP, tóm tắt và trả lời câu hỏi từ kho tri thức.',
      icon: Compass,
      gradient: 'var(--ds-bg-secondary)',
      tryScreen: APP_SCREENS.AI,
    },
    {
      id: 'done',
      title: 'Bạn đã sẵn sàng!',
      body: 'Hãy khám phá các thư mục, đọc bài và bắt đầu đóng góp nội dung. Mọi thắc mắc có thể hỏi iWiki AI hoặc xem hướng dẫn trên iWiki.',
      icon: Flame,
      gradient: 'var(--ds-bg-accent-primary-subtle)',
    },
  ],
  admin: [
    {
      id: 'welcome',
      title: 'Chào mừng Admin!',
      body: 'Với vai trò **Quản trị viên**, bạn có toàn quyền: quản lý tài liệu, **phê duyệt bài viết**, cấu hình phân quyền và xem báo cáo hệ thống.',
      icon: Shield,
      gradient: 'var(--ds-bg-info-subtle)',
    },
    {
      id: 'search',
      title: 'Trang chủ & Tìm kiếm',
      body: 'Trang chủ hiển thị thống kê và bài nổi bật. Ô **tìm kiếm** giúp bạn và mọi người tìm tài liệu nhanh chóng.',
      icon: Search,
      gradient: 'var(--ds-bg-accent-primary-subtle)',
      tryScreen: APP_SCREENS.DASHBOARD,
    },
    {
      id: 'content',
      title: 'Nội dung & iWiki AI',
      body: '**Bài viết của tôi** — quản lý bài của bạn. **iWiki AI** — trợ lý tri thức cho toàn công ty. Với Admin bạn có thể xuất bản bài trực tiếp không cần duyệt.',
      icon: BookOpen,
      gradient: 'var(--ds-bg-info-subtle)',
      tryScreen: APP_SCREENS.MY_ARTICLES,
    },
    {
      id: 'admin',
      title: 'Quản trị hệ thống',
      body: 'Trong **Sidebar** có mục **Quản trị hệ thống**: Admin Dashboard (thống kê, duyệt bài chờ), Manager View, Quản lý tài liệu, Phân quyền. Dùng để vận hành iWiki hàng ngày.',
      icon: BarChart,
      gradient: 'var(--ds-bg-danger-subtle)',
      tryScreen: APP_SCREENS.ADMIN_DASHBOARD,
    },
    {
      id: 'done',
      title: 'Sẵn sàng quản lý iWiki',
      body: 'Bạn đã nắm các tính năng chính. Hãy duyệt bài chờ, cấu hình quyền và đảm bảo nội dung iWiki luôn chất lượng.',
      icon: Flame,
      gradient: 'var(--ds-bg-accent-primary-subtle)',
    },
  ],
};

interface OnboardingTourProps {
  user: User;
  onComplete: () => void;
  onSkip: () => void;
  onNavigate?: (screen: string) => void;
}

export default function OnboardingTour({ user, onComplete, onSkip, onNavigate }: OnboardingTourProps) {
  const role = (user.role === 'viewer' ? 'viewer' : user.role === 'editor' ? 'editor' : 'admin') as OnboardingRole;
  const steps = STEPS_BY_ROLE[role];
  const [stepIndex, setStepIndex] = useState(0);
  const current = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;
  const Icon = current.icon;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  const handleTryNow = () => {
    if (current.tryScreen && onNavigate) {
      onNavigate(current.tryScreen);
    }
    handleNext();
  };

  // Simple markdown: **text** -> bold
  const renderBody = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) =>
      p.startsWith('**') && p.endsWith('**') ? (
        <strong key={i} className="font-semibold text-[var(--ds-text-primary)]">{p.slice(2, -2)}</strong>
      ) : (
        <span key={i}>{p}</span>
      )
    );
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-[var(--ds-bg-primary)] rounded-3xl shadow-2xl border border-[var(--ds-border-secondary)] overflow-hidden animate-scale-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
      >
        {/* Progress bar */}
        <div className="h-1.5 bg-[var(--ds-bg-secondary)]">
          <div
            className="h-full bg-[var(--ds-bg-accent-primary)] transition-all duration-400 ease-out"
            style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="p-8 pb-6">
          {/* Icon + gradient circle */}
          <div 
            className="mb-6 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto ring-4 ring-white shadow-lg"
            style={{ background: current.gradient.startsWith('var') ? `var(${current.gradient})` : current.gradient }}
          >
            <Icon className="w-8 h-8 text-[var(--ds-text-primary)]" strokeWidth={2} />
          </div>

          <h2 id="onboarding-title" className="text-xl font-bold text-[var(--ds-text-primary)] text-center mb-3 leading-tight">
            {current.title}
          </h2>
          <p className="text-[var(--ds-text-secondary)] text-center text-[15px] leading-relaxed mb-6">
            {renderBody(current.body)}
          </p>

          {/* Step dots */}
          <div className="flex justify-center gap-2 mb-6">
            {steps.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setStepIndex(i)}
                className={`h-2 rounded-full transition-all duration-200 ${
                  i === stepIndex ? 'w-6 bg-[var(--ds-bg-accent-primary)]' : 'w-2 bg-[var(--ds-bg-secondary)] hover:bg-[var(--ds-bg-tertiary)]'
                }`}
                aria-label={`Bước ${i + 1}`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {current.tryScreen && !isLast && onNavigate && (
              <Button type="button" variant="primary" onClick={handleTryNow} className="order-2 sm:order-1">
                Thử ngay <ChevronRight size={18} />
              </Button>
            )}
            <Button type="button" variant="border" onClick={handleNext} className="order-1 sm:order-2">
              {isLast ? 'Bắt đầu khám phá' : 'Tiếp theo'}
            </Button>
          </div>
          <p className="text-center mt-4">
            <button
              type="button"
              onClick={onSkip}
              className="text-xs text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)] underline underline-offset-2"
            >
              Bỏ qua hướng dẫn
            </button>
          </p>
        </div>

        {/* Skip */}
        <Button type="button" variant="subtle" size="icon-m" onClick={onSkip} aria-label="Bỏ qua" className="absolute top-4 right-4">
          <X size={20} />
        </Button>
      </div>
    </div>
  );
}
