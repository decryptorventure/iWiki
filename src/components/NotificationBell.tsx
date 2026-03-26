import React, { useEffect, useRef, useState } from 'react';
import { Bell, Clock, MessageSquare, Flame, Coins, Target, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNotifications } from '../hooks/use-notifications';
import { APP_SCREENS } from '../constants/screens';
import { Button, Badge } from '@frontend-team/ui-kit';

const MAX_PREVIEW = 5;

export default function NotificationBell() {
  const { dispatch } = useApp();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!rootRef.current || rootRef.current.contains(event.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const openNotification = (notificationId: string, link?: string) => {
    markRead(notificationId);
    setOpen(false);
    if (!link) {
      dispatch({ type: 'SET_SCREEN', screen: APP_SCREENS.NOTIFICATIONS });
      return;
    }
    if (link.startsWith('article:')) {
      const articleId = link.split(':')[1];
      dispatch({ type: 'SET_SELECTED_ARTICLE', articleId });
      dispatch({ type: 'INCREMENT_VIEWS', articleId });
      return;
    }
    if (link === 'bounties') {
      dispatch({ type: 'SET_SCREEN', screen: APP_SCREENS.BOUNTIES });
      return;
    }
    dispatch({ type: 'SET_SCREEN', screen: APP_SCREENS.NOTIFICATIONS });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <MessageSquare size={14} className="text-[var(--ds-fg-info)]" />;
      case 'like':
        return <Flame size={14} className="text-[var(--ds-fg-accent-primary)]" />;
      case 'reward':
        return <Coins size={14} className="text-[var(--ds-fg-accent-secondary)]" />;
      case 'bounty':
        return <Target size={14} className="text-[var(--ds-fg-accent-primary)]" />;
      default:
        return <Info size={14} className="text-[var(--ds-text-secondary)]" />;
    }
  };

  return (
    <div className="relative" ref={rootRef}>
      <Button
        variant="subtle"
        size="icon-m"
        onClick={() => setOpen((prev) => !prev)}
        className="relative border-2 border-[var(--ds-border-tertiary)] bg-white hover:bg-[var(--ds-bg-secondary)] transition-all h-10 w-10 p-0 rounded-xl shadow-sm group"
        aria-label="Mở thông báo"
      >
        <Bell size={20} className="text-gray-900 group-hover:text-[var(--ds-fg-accent-primary)] transition-colors" strokeWidth={2.5} />
        {unreadCount > 0 && (
          <div className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1.5 bg-[#f97316] text-white text-[10px] font-black rounded-full shadow-[0_2px_10px_rgba(249,115,22,0.4)] flex items-center justify-center animate-pulse-glow border-2 border-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-[360px] max-w-[90vw] rounded-2xl border border-[var(--ds-border-secondary)] bg-[var(--ds-bg-primary)] shadow-xl z-30 overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--ds-border-secondary)] flex items-center justify-between">
            <p className="text-sm font-bold text-[var(--ds-text-primary)]">Thông báo</p>
            <Button
              variant="subtle"
              size="s"
              onClick={markAllRead}
              className="text-xs font-semibold text-[var(--ds-text-secondary)] hover:text-[var(--ds-fg-accent-primary)] transition-colors border-none shadow-none h-auto p-0"
            >
              Đánh dấu đã đọc
            </Button>
          </div>

          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-sm text-center text-[var(--ds-text-secondary)]">Chưa có thông báo</div>
            ) : (
              notifications.slice(0, MAX_PREVIEW).map((item) => (
                <Button
                  key={item.id}
                  variant="subtle"
                  onClick={() => openNotification(item.id, item.link)}
                  className={`w-full text-left px-4 py-3 border-b border-[var(--ds-border-secondary)] transition-colors rounded-none h-auto border-none shadow-none block ${
                    item.isRead ? 'bg-[var(--ds-bg-primary)] hover:bg-[var(--ds-bg-secondary)]' : 'bg-[var(--ds-bg-accent-primary-subtle)] hover:bg-[var(--ds-bg-accent-primary-subtle)]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getIcon(item.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--ds-text-primary)] line-clamp-1">{item.title}</p>
                      <p className="text-xs text-[var(--ds-text-secondary)] line-clamp-2 mt-0.5">{item.content}</p>
                      <p className="text-[11px] text-[var(--ds-text-tertiary)] mt-1 flex items-center gap-1">
                        <Clock size={11} />
                        {item.time}
                      </p>
                    </div>
                  </div>
                </Button>
              ))
            )}

          </div>

          <div className="px-4 py-2.5 bg-[var(--ds-bg-secondary)] border-t border-[var(--ds-border-secondary)]">
            <Button
              variant="subtle"
              size="s"
              onClick={() => {
                setOpen(false);
                dispatch({ type: 'SET_SCREEN', screen: APP_SCREENS.NOTIFICATIONS });
              }}
              className="w-full text-sm font-semibold text-[var(--ds-fg-accent-primary)] hover:text-[var(--ds-fg-accent-primary-hover)] transition-colors border-none shadow-none"
            >
              Xem tất cả thông báo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
